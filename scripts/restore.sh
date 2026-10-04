#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# MEDULA sandbox restore — one command to bring the environment back to a
# fully working state after a sandbox restart/reset.
#
# Usage:  bash scripts/restore.sh
#
# Idempotent: safe to run at any time, skips steps that are already done.
# ─────────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
echo "→ Project root: $ROOT"

# 1. Dependencies (skipped when node_modules is intact)
if [ ! -d node_modules ] || [ ! -x node_modules/.bin/next ]; then
  echo "→ node_modules missing — running bun install (this can take a while)…"
  bun install
else
  echo "✓ node_modules present"
fi

# 2. Prisma client (must match prisma/schema.prisma)
echo "→ prisma generate…"
bun run db:generate >/dev/null 2>&1 && echo "✓ Prisma client generated" || echo "⚠ prisma generate failed — check prisma/schema.prisma"

# 3. Database — db/custom.db is git-tracked (seeded demo data included).
#    Only rebuild from schema if the file is actually missing.
if [ -f db/custom.db ]; then
  echo "✓ db/custom.db present (git-tracked, no rebuild needed)"
else
  echo "→ db/custom.db missing — pushing schema…"
  bun run db:push && echo "✓ Database rebuilt from schema (empty; re-seed if a seed script exists)"
fi

# 4. Dev server on :3000 (single instance; never use `bun run build` here)
if curl -s -o /dev/null -w "" --max-time 3 http://localhost:3000/ 2>/dev/null; then
  echo "✓ Dev server already serving on :3000"
else
  if curl -s -o /dev/null --max-time 2 http://localhost:3000/ 2>/dev/null; then :; fi
  echo "→ Starting dev server in background…"
  nohup bun run dev > /dev/null 2>&1 &
  # Wait until it answers (max ~60s)
  for i in $(seq 1 30); do
    sleep 2
    if curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:3000/ 2>/dev/null | grep -q 200; then
      echo "✓ Dev server up on :3000 (after ~$((i * 2))s)"
      break
    fi
  done
fi

# 5. Final health check
CODE="$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/ 2>/dev/null)"
echo "─────────────────────────────────────────────"
if [ "$CODE" = "200" ]; then
  echo "✅ RESTORE COMPLETE — http://localhost:3000 → 200"
  echo "   Logs: tail -f $ROOT/dev.log"
  echo "   Reminder: recreate the 15-min webDevReview cron job if the cron list is empty."
else
  echo "❌ Dev server not answering (last status: ${CODE:-none}) — check dev.log"
  exit 1
fi
