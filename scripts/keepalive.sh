#!/bin/bash
# MEDOS dev-server watchdog — keeps the dev server alive forever.
# Checks http://localhost:3000 every 30s; restarts `bun run dev` if dead.
# Logs to /home/z/my-project/keepalive.log

PROJECT="/home/z/my-project"
URL="http://localhost:3000/api/profile"
LOG="$PROJECT/keepalive.log"
LAST_START=0

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG"; }

log "watchdog started (pid $$)"

while true; do
  code=$(curl -s -o /dev/null -m 8 -w "%{http_code}" "$URL" 2>/dev/null)
  now=$(date +%s)
  if [ "$code" != "200" ] && [ "$code" != "401" ]; then
    # avoid restart thrash: at most one restart per 60s
    if [ $((now - LAST_START)) -gt 60 ]; then
      log "unhealthy (code=$code) — restarting dev server"
      # kill any zombie dev processes on port 3000
      pids=$(lsof -t -i:3000 2>/dev/null)
      [ -n "$pids" ] && kill -9 $pids 2>/dev/null
      sleep 1
      cd "$PROJECT" || exit 1
      nohup bun run dev > dev.log 2>&1 &
      LAST_START=$now
      # wait for boot
      for i in $(seq 1 24); do
        sleep 5
        c=$(curl -s -o /dev/null -m 5 -w "%{http_code}" "$URL" 2>/dev/null)
        if [ "$c" = "200" ] || [ "$c" = "401" ]; then
          log "recovered after $((i*5))s (code=$c)"
          break
        fi
      done
    fi
  fi
  sleep 30
done
