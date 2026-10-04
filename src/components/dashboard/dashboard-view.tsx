'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  Clock3,
  Flame,
  GraduationCap,
  History,
  Info,
  Map as MapIcon,
  Play,
  RefreshCw,
  ShieldCheck,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Zap,
  ClipboardList,
  ScanSearch,
  Waypoints,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { PREP_STAGE_LABELS } from '@/lib/types'
import type { DashboardPayload, PlanSegment } from '@/lib/types'
import type { MapInsights } from '@/app/api/map-insights/route'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BranchGalaxy } from '@/components/dashboard/branch-galaxy'
import { InternshipPanel } from '@/components/dashboard/internship-panel'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type LoadState = 'loading' | 'ready' | 'error'
type ReadinessPayload = Awaited<ReturnType<typeof api.readiness>>

// ─── Primitives ──────────────────────────────────────────────────────────────

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (reduce) return
    const controls = animate(0, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [value, reduce])

  return <span className={className}>{reduce ? value : display}</span>
}

function Reveal({ index = 0, className, children }: { index?: number; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: reduce ? 0 : 0.06 * index, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function ProgressRing({
  value,
  size,
  stroke,
  gradientId,
  children,
}: {
  value: number
  size: number
  stroke: number
  gradientId: string
  children?: ReactNode
}) {
  const reduce = useReducedMotion()
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="45%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-2" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct / 100) }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

function Bar({ pct, className, delay = 0 }: { pct: number; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn('h-full shrink-0 rounded-full', className)}
      initial={reduce ? false : { width: 0 }}
      animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      transition={{ duration: 1, delay: reduce ? 0 : delay, ease: EASE }}
    />
  )
}

const TONES = {
  warn: { text: 'text-sev-warn', bg: 'bg-sev-warn/10' },
  crit: { text: 'text-sev-crit', bg: 'bg-sev-crit/10' },
  ok: { text: 'text-sev-ok', bg: 'bg-sev-ok/10' },
  info: { text: 'text-info', bg: 'bg-info/10' },
  muted: { text: 'text-ink-soft', bg: 'bg-surface-2' },
} as const

function StatTile({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon
  value: number
  label: string
  tone: keyof typeof TONES
}) {
  const t = TONES[tone]
  return (
    <div className="glass rounded-xl p-4 transition-shadow hover:shadow-md">
      <span className={cn('inline-grid size-8 place-items-center rounded-lg', t.bg)}>
        <Icon className={cn('size-4', t.text)} />
      </span>
      <p className="mt-2.5 text-2xl font-semibold tabular-nums tracking-tight">
        <AnimatedNumber value={value} />
      </p>
      <p className="mt-0.5 text-xs leading-snug text-ink-soft">{label}</p>
    </div>
  )
}

function LegendDot({ className, label, value }: { className?: string; label: string; value: number }) {
  return (
    <span className="flex items-center gap-2 text-xs">
      <span className={cn('size-2 shrink-0 rounded-full', className)} />
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </span>
  )
}

function SegmentRow({ index, seg }: { index: number; seg: PlanSegment }) {
  return (
    <div className="flex min-h-11 items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-ink-soft">
        {index + 1}
      </span>
      <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
        {seg.minutes} min
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{seg.activity}</p>
        <p className="truncate text-xs text-ink-soft">{seg.detail}</p>
      </div>
    </div>
  )
}

function masteryTone(m: number): string {
  if (m < 40) return 'bg-sev-crit'
  if (m < 70) return 'bg-sev-warn'
  return 'bg-sev-ok'
}

// Nature scene backdrop — soft decorative layer, hides itself if missing
function SceneImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setOk(false)}
      className="absolute inset-0 size-full object-cover opacity-[0.16] mix-blend-luminosity"
      loading="lazy"
    />
  )
}

// ─── Loading / Error states ──────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6" aria-busy="true" role="status">
      <div className="space-y-3">
        <Skeleton className="shimmer h-9 w-3/4 rounded-lg md:w-1/2" />
        <Skeleton className="shimmer h-4 w-2/3 rounded-md md:w-1/3" />
      </div>
      <Skeleton className="shimmer h-[560px] rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="shimmer h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="shimmer h-60 rounded-2xl" />
        <Skeleton className="shimmer h-60 rounded-2xl md:col-span-2" />
      </div>
      <Skeleton className="shimmer h-72 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="shimmer h-44 rounded-2xl" />
        <Skeleton className="shimmer h-44 rounded-2xl" />
      </div>
    </div>
  )
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center md:p-12">
        <span className="grid size-12 place-items-center rounded-full bg-sev-crit/10">
          <AlertTriangle className="size-6 text-sev-crit" />
        </span>
        <h2 className="text-lg font-semibold tracking-tight">Couldn&apos;t load your dashboard</h2>
        <p className="max-w-sm text-sm text-ink-soft">
          The learning engine did not respond. Check your connection and try again — your progress data is safe.
        </p>
        <Button variant="outline" className="min-h-11" onClick={onRetry}>
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    </div>
  )
}

// ─── Main view ───────────────────────────────────────────────────────────────

export function DashboardView() {
  const setView = useAppStore((s) => s.setView)
  const openConcept = useAppStore((s) => s.openConcept)
  const setQuizPreset = useAppStore((s) => s.setQuizPreset)
  const setAuditOpen = useAppStore((s) => s.setAuditOpen)
  const reduceMotion = useReducedMotion()

  const [data, setData] = useState<DashboardPayload | null>(null)
  const [insights, setInsights] = useState<MapInsights | null>(null)
  const [readiness, setReadiness] = useState<ReadinessPayload | null>(null)
  const [showMethod, setShowMethod] = useState(false)
  const [status, setStatus] = useState<LoadState>('loading')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.dashboard(), api.mapInsights().catch(() => null), api.readiness().catch(() => null)]).then(
      ([d, ins, rdy]) => {
        if (cancelled) return
        setData(d)
        setInsights(ins)
        setReadiness(rdy)
        setStatus('ready')
      },
      () => {
        if (cancelled) return
        setStatus('error')
      },
    )
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const retry = useCallback(() => {
    setStatus('loading')
    setReloadKey((k) => k + 1)
  }, [])

  if (status === 'loading') return <DashboardSkeleton />
  if (status === 'error' || !data) return <DashboardError onRetry={retry} />

  const {
    greeting,
    name,
    stageLabel,
    prepStage,
    brainScore,
    stats,
    knowledgeSplit,
    revisionDebt,
    weaknesses,
    nextAction,
    todayPlan,
    weeklyDelta,
    heatToday,
  } = data

  const stageLabelText = PREP_STAGE_LABELS[prepStage] ?? prepStage
  const missionTotal = todayPlan.reduce((a, s) => a + s.minutes, 0)
  const missionPct =
    stats.recommendedMinutes > 0 ? Math.min(100, Math.round((heatToday.minutes / stats.recommendedMinutes) * 100)) : 0
  const splitTotal = knowledgeSplit.strong + knowledgeSplit.unstable + knowledgeSplit.weak + knowledgeSplit.new
  const splitPct = (n: number) => (splitTotal > 0 ? (n / splitTotal) * 100 : 0)
  const accuracyUp = weeklyDelta.thisWeek >= weeklyDelta.lastWeek
  const { strong, unstable, weak, new: newCount } = knowledgeSplit

  const startNextAction = (count: number) => {
    if (!nextAction) return
    setQuizPreset({ conceptId: nextAction.conceptId, count })
    setView('questions')
  }

  const startMission = () => {
    if (nextAction) startNextAction(5)
    else setView('progress')
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 overflow-x-clip p-4 md:p-6">
      {/* 1 · Warm greeting header */}
      <Reveal index={0} className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {greeting}, Dr. {name}.{' '}
            <motion.span
              aria-hidden
              className="inline-block"
              animate={{ rotate: [0, 12, -8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌿
            </motion.span>
          </h1>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft">
            <GraduationCap className="size-3.5 text-primary" />
            {stageLabel} · {stageLabelText}
          </span>
        </div>
        <p className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
          <span aria-hidden className="text-base">🌤️</span>
          Your 19-branch medical universe — organized, calm, and one glance away.
        </p>
      </Reveal>

      {/* 2 · BRANCH GALAXY — the home centerpiece */}
      <Reveal index={1}>
        <section className="relative overflow-hidden rounded-3xl" aria-label="Your medical universe">
          {/* warm scenic frame around the galaxy */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <SceneImage src="/scenes/dawn-meadow.jpg" alt="" />
            <div className="scene-dawn absolute inset-0 opacity-70" />
          </div>
          <div className="relative">
            <BranchGalaxy
              onOpenMap={() => setView('map')}
              focusCount={insights?.struggleZones.length ?? 0}
            />
          </div>
        </section>
      </Reveal>

      {/* 2b · Internship mode — rotation-based plan (renders only for year ≥ 5) */}
      <InternshipPanel />

      {/* 4 · Daily intelligence strip */}
      <Reveal index={3} className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">Your medical brain today</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatTile icon={Flame} value={stats.topicsAtRisk} label="topics at risk of forgetting" tone="warn" />
          <StatTile icon={AlertTriangle} value={stats.recurringMistakes} label="recurring mistakes" tone="crit" />
          <StatTile icon={Target} value={weaknesses.length} label="high-priority weak spots" tone="crit" />
          <StatTile icon={BookOpen} value={stats.dueQuestions} label="questions due" tone="info" />
          <StatTile icon={Brain} value={stats.dueFlashcards} label="flashcards due" tone="muted" />
        </div>
        <div className="glass flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl px-4 py-3">
          <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
            <Timer className="size-4 text-primary" />
            Recommended study:
            <span className="font-semibold text-foreground">{stats.recommendedMinutes} min</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium">
            <Zap className="size-3.5 text-sev-warn" />
            {stats.streak}-day streak
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
            <ProgressRing value={readiness?.overall ?? brainScore} size={40} stroke={4} gradientId="ring-strip">
              <span className="text-[10px] font-bold tabular-nums">{readiness?.overall ?? brainScore}</span>
            </ProgressRing>
            Readiness
          </span>
        </div>
      </Reveal>

      {/* 5 · Brain score + knowledge split */}
      <Reveal index={4}>
        <div className="grid gap-4 md:grid-cols-3">
          <section className="glass flex flex-col rounded-2xl p-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                NEET-PG Readiness
              </h3>
              <button
                type="button"
                onClick={() => setShowMethod((v) => !v)}
                aria-expanded={showMethod}
                className="inline-flex min-h-8 items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink-soft transition-colors hover:bg-surface-2"
              >
                <Info className="size-3" />
                Method
              </button>
            </div>
            <div className="mt-3 flex flex-1 items-center gap-4">
              <ProgressRing value={readiness?.overall ?? brainScore} size={150} stroke={11} gradientId="ring-brain">
                <span className="text-3xl font-semibold tabular-nums tracking-tight">
                  <AnimatedNumber value={readiness?.overall ?? brainScore} />%
                </span>
                <span className="mt-0.5 text-center text-[11px] font-medium text-ink-soft">{readiness?.band ?? stageLabel}</span>
              </ProgressRing>
              <ul className="min-w-0 flex-1 space-y-2.5" aria-label="Readiness components">
                {(readiness?.components ?? []).map((c) => (
                  <li key={c.key}>
                    <div className="flex items-baseline justify-between gap-2 text-[11px]">
                      <span className="truncate font-medium text-ink-soft">
                        {c.label} <span className="text-muted-foreground">·{c.weight}%</span>
                      </span>
                      <span className="font-semibold tabular-nums">{c.value}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <Bar pct={c.value} className="bg-primary" delay={0.3} />
                    </div>
                  </li>
                ))}
                {!readiness && (
                  <li className="text-xs text-ink-soft">Components are computing…</li>
                )}
              </ul>
            </div>
            {showMethod && readiness && (
              <div className="mt-4 space-y-2 rounded-xl border border-line bg-surface-2/60 p-3 text-xs">
                <p className="font-mono text-[10px] text-ink-soft">{readiness.methodology}</p>
                <ul className="space-y-1.5">
                  {readiness.components.map((c) => (
                    <li key={`m-${c.key}`} className="text-ink-soft">
                      <span className="font-medium text-foreground">{c.label}:</span> {c.note} — {c.suggestion}
                    </li>
                  ))}
                </ul>
                {readiness.focusSubjects.length > 0 && (
                  <p className="text-ink-soft">
                    <span className="font-medium text-foreground">Focus first:</span>{' '}
                    {readiness.focusSubjects.map((s) => `${s.name} (${s.readiness}%)`).join(' · ')}
                  </p>
                )}
                <p className="text-[10px] italic text-muted-foreground">{readiness.disclaimer}</p>
              </div>
            )}
            <p className="mt-3 text-center text-xs text-ink-soft">
              {stageLabel} · an estimate, never a rank prediction
            </p>
          </section>

          <section className="glass flex flex-col rounded-2xl p-6 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">Your knowledge</h3>
              <span className="text-xs text-ink-soft">{splitTotal} concepts mapped</span>
            </div>
            <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-surface-2">
              <Bar pct={splitPct(strong)} className="bg-sev-ok" delay={0.25} />
              <Bar pct={splitPct(unstable)} className="bg-sev-warn" delay={0.35} />
              <Bar pct={splitPct(weak)} className="bg-sev-crit" delay={0.45} />
              <Bar pct={splitPct(newCount)} className="bg-muted-foreground/40" delay={0.55} />
            </div>
            {splitTotal === 0 && (
              <p className="mt-3 text-xs text-ink-soft">
                No concepts mapped yet — answer a few questions or take the knowledge audit to begin.
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
              <LegendDot className="bg-sev-ok" label="Strong" value={strong} />
              <LegendDot className="bg-sev-warn" label="Unstable" value={unstable} />
              <LegendDot className="bg-sev-crit" label="Weak" value={weak} />
              <LegendDot className="bg-muted-foreground/40" label="New" value={newCount} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-sm">
              {accuracyUp ? (
                <TrendingUp className="size-4 text-sev-ok" />
              ) : (
                <TrendingDown className="size-4 text-sev-crit" />
              )}
              <span className="text-ink-soft">
                Accuracy <span className="font-semibold text-foreground">{weeklyDelta.lastWeek}%</span>
                <span className="mx-1.5">→</span>
                <span className={cn('font-semibold', accuracyUp ? 'text-sev-ok' : 'text-sev-crit')}>
                  {weeklyDelta.thisWeek}%
                </span>{' '}
                this week
              </span>
              <Button
                size="sm"
                variant="outline"
                className="ml-auto min-h-9 gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                onClick={() => setAuditOpen(true)}
              >
                <ScanSearch className="size-3.5" />
                AUDIT MY MEDICAL KNOWLEDGE
              </Button>
            </div>
          </section>
        </div>
      </Reveal>

      {/* 6 · Today's mission */}
      <Reveal index={5}>
        <section className="glass relative overflow-hidden rounded-2xl p-4 md:p-6">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <SceneImage src="/scenes/canopy-light.jpg" alt="" />
            <div className="scene-canopy absolute inset-0" />
          </div>
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Today&apos;s Mission</p>
                <h2 className="text-2xl font-semibold tracking-tight">TODAY 🌱</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                ≈ {missionTotal} min
              </span>
            </div>

            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <Bar pct={missionPct} className="bg-primary" delay={0.3} />
              </div>
              <p className="mt-1.5 text-xs text-ink-soft">
                {heatToday.minutes}/{stats.recommendedMinutes} min done
              </p>
            </div>

            <div className="mt-3 space-y-1">
              {todayPlan.map((seg, i) => (
                <SegmentRow key={`${seg.activity}-${i}`} index={i} seg={seg} />
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button size="lg" className="min-h-11 flex-1" onClick={startMission}>
                <Play className="size-4" /> START TODAY&apos;S MISSION
              </Button>
              <Button size="lg" variant="outline" className="min-h-11 sm:flex-none" onClick={() => setView('revise')}>
                OPEN IN REVISE
              </Button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 7 · Next best action */}
      <Reveal index={6}>
        {nextAction ? (
          <section className="glass rounded-2xl border-l-4 border-l-primary p-4 md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Next best study action · {nextAction.activityType}
            </p>
            <h3 className="mt-1.5 text-xl font-semibold tracking-tight md:text-2xl">{nextAction.conceptName}</h3>
            <p className="mt-1 text-sm italic text-ink-soft">Because: {nextAction.reason}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium">
              <Clock3 className="size-3.5 text-primary" />
              {nextAction.duration} min
            </span>

            <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {nextAction.plan.map((seg, i) => (
                <li
                  key={`${seg.activity}-${i}`}
                  className="rounded-lg border border-line/60 bg-surface-2/70 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-[11px] font-medium text-ink-soft">{seg.minutes} min</span>
                  </div>
                  <p className="mt-1.5 text-xs font-medium leading-snug">{seg.activity}</p>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button size="lg" className="min-h-11" onClick={() => startNextAction(6)}>
                <Play className="size-4" /> START {nextAction.duration} MIN BLOCK
              </Button>
              <Button size="lg" variant="ghost" className="min-h-11" onClick={() => openConcept(nextAction.conceptId)}>
                Why this?
              </Button>
              <Button size="lg" variant="link" className="min-h-11" onClick={() => setView('map')}>
                <MapIcon className="size-4" /> View on Medical Map
              </Button>
            </div>
          </section>
        ) : (
          <section className="glass flex flex-col gap-4 rounded-2xl border-l-4 border-l-primary p-6 sm:flex-row sm:items-center">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10">
              <ClipboardList className="size-5 text-primary" />
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold tracking-tight">Take your knowledge audit</h3>
              <p className="mt-1 text-sm text-ink-soft">
                MEDULA has no knowledge map for you yet. A short diagnostic will reveal what to study first.
              </p>
            </div>
            <Button size="lg" className="min-h-11" onClick={() => setAuditOpen(true)}>
              TAKE THE AUDIT
            </Button>
          </section>
        )}
      </Reveal>

      {/* 8 · Revision debt + weaknesses */}
      <Reveal index={7}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="glass flex h-full flex-col rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-sev-warn/10">
                <History className="size-4 text-sev-warn" />
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">Revision debt</h3>
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-semibold leading-none tabular-nums tracking-tight">
                <AnimatedNumber value={revisionDebt.count} />
              </span>
              <span className="pb-0.5 text-sm text-ink-soft">topics need revision</span>
            </div>
            <p className="mt-2 text-sm text-ink-soft">Estimated clear time: ≈ {revisionDebt.minutes} min</p>
            {revisionDebt.count === 0 && (
              <p className="mt-1 text-xs text-sev-ok">Debt clear — spaced repetition is on schedule.</p>
            )}
            <Button className="mt-5 min-h-11 w-fit self-start" onClick={() => setView('revise')}>
              FIX NOW
            </Button>
          </section>

          <section className="glass flex h-full flex-col rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-sev-crit/10">
                <Target className="size-4 text-sev-crit" />
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">Top weaknesses</h3>
            </div>
            <div className="mt-3 flex-1 space-y-1">
              {weaknesses.length === 0 ? (
                <p className="py-6 text-center text-sm text-ink-soft">
                  No weak spots flagged yet — keep the momentum going.
                </p>
              ) : (
                weaknesses.map((w, i) => (
                  <button
                    key={w.conceptId}
                    type="button"
                    onClick={() => openConcept(w.conceptId)}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-accent/50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{w.name}</span>
                      <span className="block truncate text-xs text-ink-soft">
                        {w.subject} · {w.reason}
                      </span>
                    </span>
                    <span className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-surface-2 sm:w-24">
                      <Bar pct={w.mastery} delay={0.4 + i * 0.06} className={masteryTone(w.mastery)} />
                    </span>
                    <span className="w-9 shrink-0 text-right text-xs tabular-nums text-ink-soft">{w.mastery}%</span>
                  </button>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => setView('progress')}
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline"
            >
              Full progress <ArrowRight className="size-4" />
            </button>
          </section>
        </div>
      </Reveal>

      {/* 9 · Source trust strip — real, cross-verified data */}
      <Reveal index={8}>
        <section className="relative overflow-hidden rounded-2xl p-px" aria-label="Content sources">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <SceneImage src="/scenes/zen-lake.jpg" alt="" />
            <div className="absolute inset-0 bg-background/88" />
          </div>
          <div className="glass relative rounded-2xl px-4 py-3.5 md:px-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-ink-soft">
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="size-4 text-sev-ok" />
                Cross-verified content
              </span>
              <span className="inline-flex items-center gap-1.5">🏥 Curriculum aligned to <strong>NMC CBME 2024</strong></span>
              <span className="inline-flex items-center gap-1.5">📋 Exam blueprint per <strong>NBEMS NEET-PG</strong></span>
              <span className="inline-flex items-center gap-1.5">🌐 Terminology per <strong>WHO ICD-11</strong></span>
              <span className="inline-flex items-center gap-1.5">🔬 Guidelines per <strong>ICMR / WHO</strong></span>
              <span className="text-muted-foreground">All educational content is original — no commercial question banks are copied.</span>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
