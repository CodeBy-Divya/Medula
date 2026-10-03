'use client'

import { useCallback, useEffect, useState } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Check,
  Clock3,
  Flag,
  ListChecks,
  RefreshCw,
  Repeat,
  Target,
  Timer,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import type { RoadmapPayload, RoadmapPhase, WeekDayPlan } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type LoadState = 'loading' | 'ready' | 'error'

const SPLIT_COLORS = ['bg-primary', 'bg-sev-ok', 'bg-sev-warn', 'bg-info', 'bg-muted-foreground/50'] as const

// Week-planner block palette (kind → chip classes)
const BLOCK_KIND: Record<string, { chip: string; bar: string; label: string }> = {
  college: { chip: 'bg-info/10 text-info', bar: 'bg-info', label: 'College' },
  questions: { chip: 'bg-primary/10 text-primary', bar: 'bg-primary', label: 'Questions' },
  revision: { chip: 'bg-sev-warn/10 text-sev-warn', bar: 'bg-sev-warn', label: 'Revision' },
  flashcards: { chip: 'bg-sev-ok/10 text-sev-ok', bar: 'bg-sev-ok', label: 'Recall' },
  mocks: { chip: 'bg-sev-crit/10 text-sev-crit', bar: 'bg-sev-crit', label: 'Mocks' },
  weakness: { chip: 'bg-sev-crit/10 text-sev-crit', bar: 'bg-sev-crit', label: 'Repair' },
  rest: { chip: 'bg-surface-2 text-ink-soft', bar: 'bg-muted-foreground/50', label: 'Rest' },
}

function fmtDur(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m ? `${h}h ${m}m` : `${h}h`
}

function DayCard({ plan, index, reduce }: { plan: WeekDayPlan; index: number; reduce: boolean }) {
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: reduce ? 0 : index * 0.06, ease: EASE }}
      className={cn(
        'flex w-[172px] shrink-0 flex-col rounded-2xl border p-3 sm:w-auto',
        plan.isWeekend ? 'border-amber-400/30 bg-amber-400/5' : 'border-line bg-surface-2/50',
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide">{plan.short}</p>
        <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-ink-soft">{plan.hours}h</span>
      </div>
      <ul className="mt-2 flex-1 space-y-2">
        {plan.blocks.map((b, i) => {
          const s = BLOCK_KIND[b.kind] ?? BLOCK_KIND.rest
          return (
            <li key={`${b.label}-${i}`} className="flex items-start gap-1.5">
              <span aria-hidden className={cn('mt-0.5 h-4 w-1 shrink-0 rounded-full', s.bar)} />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-medium leading-snug">{b.label}</span>
                <span className={cn('mt-0.5 inline-block rounded-full px-1.5 text-[9px] font-bold tabular-nums', s.chip)}>{fmtDur(b.minutes)}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </motion.li>
  )
}

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

function MetricChip({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: string }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface-2/70 px-3.5 py-2 text-xs">
      <Icon className={cn('size-4 shrink-0', tone)} />
      <span className="font-semibold">{value}</span>
      <span className="text-ink-soft">{label}</span>
    </span>
  )
}

function IntensityDots({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1" title={`Intensity ${level}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'size-1.5 rounded-full',
            i < level ? 'bg-primary' : 'bg-surface-2 border border-line',
          )}
        />
      ))}
    </span>
  )
}

// ─── Phase timeline node ─────────────────────────────────────────────────────

function PhaseNode({ phase, index, reduce }: { phase: RoadmapPhase; index: number; reduce: boolean }) {
  return (
    <motion.li
      className="relative"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: reduce ? 0 : index * 0.08, ease: EASE }}
    >
      {/* node dot */}
      <span className="absolute -left-[31px] top-7 flex size-3 items-center justify-center">
        {index === 0 && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        )}
        <span className={cn('relative size-3 rounded-full', index === 0 ? 'bg-primary' : 'bg-muted-foreground/50')} />
      </span>

      <article
        className={cn(
          'glass rounded-2xl p-4 md:p-5',
          index === 0 && 'border-primary/40 shadow-lg shadow-primary/20',
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight md:text-lg">{phase.phase}</h3>
          <span className="rounded-md border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-soft">
            {phase.timeframe}
          </span>
          {index === 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sev-ok/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sev-ok">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sev-ok opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-sev-ok" />
              </span>
              You are here
            </span>
          )}
          <span className="ml-auto flex items-center gap-2">
            <span className="hidden text-[10px] uppercase tracking-wide text-muted-foreground sm:inline">intensity</span>
            <IntensityDots level={phase.intensity} />
          </span>
        </div>

        <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-ink-soft">{phase.goal}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {phase.focus.map((f) => (
            <span key={f} className="rounded-md bg-surface-2 px-2 py-1 text-[11px] font-medium text-ink-soft">
              {f}
            </span>
          ))}
        </div>

        <ul className="mt-3 space-y-1.5">
          {phase.actions.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm leading-snug">
              <Check className="mt-0.5 size-4 shrink-0 text-sev-ok" />
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-sev-warn/30 bg-sev-warn/10 p-3">
          <Flag className="mt-0.5 size-4 shrink-0 text-sev-warn" />
          <p className="text-xs leading-relaxed">
            <span className="font-bold uppercase tracking-wide text-sev-warn">Milestone · </span>
            {phase.milestone}
          </p>
        </div>
      </article>
    </motion.li>
  )
}

// ─── Loading / Error states ──────────────────────────────────────────────────

function RoadmapSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6" aria-busy="true" role="status">
      <div className="space-y-3">
        <Skeleton className="shimmer h-9 w-44 rounded-lg" />
        <Skeleton className="shimmer h-4 w-3/4 rounded-md md:w-1/2" />
      </div>
      <Skeleton className="shimmer h-72 rounded-3xl" />
      <Skeleton className="shimmer h-40 rounded-2xl" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="shimmer h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function RoadmapError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center md:p-12">
        <span className="grid size-12 place-items-center rounded-full bg-sev-crit/10">
          <RefreshCw className="size-6 text-sev-crit" />
        </span>
        <h2 className="text-lg font-semibold tracking-tight">Couldn&apos;t load your roadmap</h2>
        <p className="max-w-sm text-sm text-ink-soft">
          The planning engine did not respond. Your profile is intact — retry to rebuild the plan.
        </p>
        <Button variant="outline" className="min-h-11" onClick={onRetry}>
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    </div>
  )
}

// ─── Main view ───────────────────────────────────────────────────────────────

export function RoadmapView() {
  const setView = useAppStore((s) => s.setView)

  const [data, setData] = useState<RoadmapPayload | null>(null)
  const [status, setStatus] = useState<LoadState>('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    let cancelled = false
    api.roadmap().then(
      (payload) => {
        if (cancelled) return
        setData(payload)
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

  if (status === 'loading') return <RoadmapSkeleton />
  if (status === 'error' || !data) return <RoadmapError onRetry={retry} />

  const { neetClock, weeklySplit, phases, currentStageLabel, weekPlan } = data

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-6">
      {/* Header */}
      <motion.header
        className="space-y-2"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">ROADMAP</h1>
        <p className="max-w-2xl text-sm text-ink-soft md:text-base">
          From your classroom today to your NEET-PG attempt — dynamically computed from your profile.
        </p>
      </motion.header>

      {/* 1 · NEET-PG clock hero */}
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduce ? 0 : 0.08, ease: EASE }}
        className="glass relative overflow-hidden rounded-3xl p-5 md:p-8"
      >
        <div className="med-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              <Timer className="size-4 text-primary" />
              NEET-PG clock
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              <Activity className="size-3.5" />
              {neetClock.stage}
            </span>
          </div>

          {/* countdown blocks */}
          <div className="mt-5 grid max-w-xl grid-cols-3 gap-3">
            {[
              { v: neetClock.daysLeft, label: 'days' },
              { v: neetClock.weeksLeft, label: 'weeks' },
              { v: neetClock.monthsLeft, label: 'months' },
            ].map((b) => (
              <div key={b.label} className="rounded-2xl border border-line bg-surface-2/50 p-3 text-center md:p-4">
                <p className="text-4xl font-semibold leading-none tabular-nums tracking-tight md:text-5xl">
                  <AnimatedNumber value={b.v} />
                </p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">{b.label}</p>
              </div>
            ))}
          </div>

          {/* exam window */}
          <div className="mt-4">
            <p className="text-sm font-medium">
              Expected exam window: <span className="text-primary">≈ June {neetClock.examYear}</span>
            </p>
            {data.isEstimate && neetClock.isEstimate ? (
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Estimated from typical NBEMS scheduling — verify with official announcements.
              </p>
            ) : (
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Based on the exam date on your profile.
              </p>
            )}
          </div>

          {/* metric chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <MetricChip icon={Clock3} value={`≈ ${neetClock.weeklyTarget} h/week`} label="required workload" tone="text-primary" />
            <MetricChip icon={Repeat} value={`${neetClock.revisionCyclesLeft}`} label="revision cycles left" tone="text-info" />
            <MetricChip
              icon={Target}
              value={`${neetClock.questionTarget.toLocaleString('en-IN')}`}
              label="question target"
              tone="text-sev-warn"
            />
            <MetricChip icon={ListChecks} value={`${neetClock.mockTarget}`} label="mock target" tone="text-sev-ok" />
          </div>
        </div>
      </motion.section>

      {/* 2 · Weekly split */}
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="glass rounded-2xl p-4 md:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">Weekly split</h2>
          <span className="text-[11px] text-muted-foreground">how your hours should divide each week</span>
        </div>
        <div className="mt-4 flex h-3.5 w-full overflow-hidden rounded-full bg-surface-2">
          {weeklySplit.map((seg, i) => (
            <motion.div
              key={seg.label}
              className={cn('h-full', SPLIT_COLORS[i % SPLIT_COLORS.length])}
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${Math.max(0, Math.min(100, seg.pct))}%` }}
              transition={{ duration: 0.8, delay: reduce ? 0 : 0.15 + i * 0.1, ease: EASE }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {weeklySplit.map((seg, i) => (
            <span key={seg.label} className="inline-flex items-center gap-2 text-xs">
              <span className={cn('size-2 shrink-0 rounded-full', SPLIT_COLORS[i % SPLIT_COLORS.length])} />
              <span className="text-ink-soft">{seg.label}</span>
              <span className="font-semibold tabular-nums">{seg.pct}%</span>
            </span>
          ))}
        </div>
      </motion.section>

      {/* 2b · Your week, planned (spec §42/§43) */}
      {weekPlan.length > 0 && (
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="glass rounded-2xl p-4 md:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Your week, planned
              <span aria-hidden className="ml-1.5">🗓️</span>
            </h2>
            <span className="text-[11px] text-muted-foreground">
              built from the {data.neetClock.stage.toLowerCase()} stage and your declared hours — Sunday evening is mock night
            </span>
          </div>
          <ul className="med-scroll mt-4 flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-7 md:overflow-visible">
            {weekPlan.map((p, i) => (
              <DayCard key={p.day} plan={p} index={i} reduce={reduce ?? false} />
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-3 text-[10px] text-ink-soft">
            {Object.entries(BLOCK_KIND).map(([kind, s]) => (
              <span key={kind} className="inline-flex items-center gap-1">
                <span aria-hidden className={cn('size-2 rounded-full', s.bar)} />
                {s.label}
              </span>
            ))}
            <span className="ml-auto">Saturday evening stays protected — burnout is a real syllabus risk 🌿</span>
          </div>
        </motion.section>
      )}

      {/* 3 · Phases timeline */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">Phases timeline</h2>
          <span className="rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold tracking-wide text-ink-soft">
            {currentStageLabel}
          </span>
        </div>
        <ol className="relative ml-2 space-y-4 border-l border-line pl-6 md:ml-4 md:pl-8">
          {phases.map((p, i) => (
            <PhaseNode key={p.phase} phase={p} index={i} reduce={reduce ?? false} />
          ))}
        </ol>
      </section>

      {/* 4 · CTA band */}
      <motion.section
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="glass flex flex-col gap-4 rounded-2xl border-l-4 border-l-primary p-5 sm:flex-row sm:items-center md:p-6"
      >
        <div className="flex-1">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">
            Every phase adapts as your knowledge state changes.
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            This plan is regenerated from your live mastery, revision debt and error patterns — not a fixed syllabus.
          </p>
        </div>
        <Button size="lg" className="min-h-11 shrink-0" onClick={() => setView('home')}>
          SEE TODAY&apos;S MISSION <ArrowRight className="size-4" />
        </Button>
      </motion.section>
    </div>
  )
}
