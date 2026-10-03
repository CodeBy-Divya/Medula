'use client'

// ─── BRANCH GALAXY ───
// The 19 MBBS subjects orbiting around "you" as animated 3D emoji spheres.
// Click a branch → a drill-down mini-panel opens right here on Home (no view
// switch): top concepts, struggle zones, mastery + actions (Map / Practice / Learn).

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BookOpen, Loader2, Map as MapIcon, Play, Waypoints, X } from 'lucide-react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { MapBranch } from '@/app/api/map-insights/route'
import type { MapInsights } from '@/app/api/map-insights/route'
import type { GraphPayload } from '@/lib/types'
import { KIND_META } from '@/lib/types'

// kind-based emoji for concept chips inside the drill-down panel
const KIND_EMOJI: Record<string, string> = {
  concept: '💡', disease: '🩺', drug: '💊', investigation: '🔬',
  physiology: '⚡', anatomy: '🦴', pathology: '🧫', pharmacology: '💉',
  microbiology: '🦠', clinical_skill: '🤲',
}

const STATUS_TONE: Record<MapBranch['status'], { ring: string; label: string; chip: string }> = {
  strong: { ring: 'var(--sev-ok)', label: 'Strong', chip: 'bg-sev-ok/10 text-sev-ok' },
  unstable: { ring: 'var(--sev-warn)', label: 'Unstable', chip: 'bg-sev-warn/10 text-sev-warn' },
  weak: { ring: 'var(--sev-crit)', label: 'Weak', chip: 'bg-sev-crit/10 text-sev-crit' },
  new: { ring: 'var(--muted-foreground)', label: 'New', chip: 'bg-surface-2 text-ink-soft' },
}

interface Placed extends MapBranch {
  x: number // 0..100 (%)
  y: number // 0..100 (%)
  size: number // px
  delay: number
}

function orbitLayout(branches: MapBranch[]): Placed[] {
  // Two elliptical orbits: high-weight subjects inner, lighter ones outer.
  // x/y radii differ because the container is wider than tall — this keeps
  // circles evenly spaced visually (no clumping at top/bottom).
  const sorted = [...branches].sort((a, b) => b.neetWeight - a.neetWeight)
  const inner = sorted.slice(0, 8)
  const outer = sorted.slice(8)
  const placed: Placed[] = []

  inner.forEach((b, i) => {
    const angle = (i / inner.length) * Math.PI * 2 - Math.PI / 2
    placed.push({
      ...b,
      x: 50 + Math.cos(angle) * 24,
      y: 50 + Math.sin(angle) * 19,
      size: 62,
      delay: i * 0.4,
    })
  })
  outer.forEach((b, i) => {
    const angle = ((i + 0.5) / outer.length) * Math.PI * 2 - Math.PI / 2
    placed.push({
      ...b,
      x: 50 + Math.cos(angle) * 41,
      y: 50 + Math.sin(angle) * 32,
      size: 52,
      delay: i * 0.35 + 0.5,
    })
  })
  return placed
}

// ─── Branch drill-down mini-panel ────────────────────────────────────────────
// Opens in-flow under the orbits when a sphere is clicked. Data comes from the
// same graph API the map uses (`scope=subject:*`) — no extra endpoint needed.

function BranchPanel({ branch, onClose }: { branch: MapBranch; onClose: () => void }) {
  const reduce = useReducedMotion()
  const openConcept = useAppStore(s => s.openConcept)
  const setView = useAppStore(s => s.setView)
  const setMapScope = useAppStore(s => s.setMapScope)
  const setQuizPreset = useAppStore(s => s.setQuizPreset)

  const [graph, setGraph] = useState<GraphPayload | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let ok = true
    // NOTE: no sync state reset here — the parent mounts this panel with
    // `key={selected.id}`, so a branch switch remounts a fresh component.
    api.graph(`subject:${branch.id}`)
      .then(d => { if (ok) setGraph(d) })
      .catch(() => { if (ok) setFailed(true) })
    return () => { ok = false }
  }, [branch.id])

  // Escape closes — matches the global overlay pattern
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const topConcepts = useMemo(() => {
    if (!graph) return []
    const struggleFirst = (n: GraphPayload['nodes'][number]) =>
      (n.difficulty >= 4 && n.mastery < 45 ? 10000 : 0) + (100 - n.mastery)
    return [...graph.nodes].sort((a, b) => struggleFirst(b) - struggleFirst(a)).slice(0, 6)
  }, [graph])

  const weakCount = graph ? graph.nodes.filter(n => n.status === 'weak' || n.status === 'unstable').length : 0
  const struggleCount = graph ? graph.nodes.filter(n => n.difficulty >= 4 && n.mastery < 45).length : 0
  const tone = STATUS_TONE[branch.status]

  const openOnMap = () => {
    setMapScope(`subject:${branch.id}`)
    setView('map')
  }

  return (
    <motion.div
      role="region"
      aria-label={`${branch.name} branch details`}
      initial={reduce ? false : { opacity: 0, height: 0, y: 12 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={reduce ? undefined : { opacity: 0, height: 0, y: 8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-card/70 backdrop-blur"
    >
      {/* warm top glow matching the branch color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-25"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${branch.color}, transparent)` }}
      />

      <div className="relative p-4 md:p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid size-12 shrink-0 place-items-center rounded-2xl text-2xl"
            style={{ background: `${branch.color}22`, boxShadow: `inset 0 0 0 1px ${branch.color}55` }}
          >
            {branch.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold tracking-tight">{branch.emoji} {branch.name}</h4>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', tone.chip)}>
                {tone.label}
              </span>
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-ink-soft">
                Year {branch.year} · NEET-PG weight {branch.neetWeight}%
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
              <span className="tabular-nums">{branch.conceptCount} concepts mapped</span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                mastery <strong className="text-foreground">{branch.mastery}%</strong>
              </span>
              {weakCount > 0 && (
                <span className="text-sev-warn tabular-nums">{weakCount} need work</span>
              )}
              {struggleCount > 0 && (
                <span className="font-semibold text-sev-crit tabular-nums">⚠️ {struggleCount} struggle zone{struggleCount > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close branch details"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* concepts */}
        {failed && (
          <p className="mt-4 rounded-lg border border-sev-crit/25 bg-sev-crit/5 p-3 text-xs text-sev-crit">
            Couldn&apos;t load this branch&apos;s concepts — try again in a moment.
          </p>
        )}
        {!failed && !graph && (
          <div className="mt-4 flex items-center gap-2 px-1 py-3 text-xs text-ink-soft" aria-busy="true">
            <Loader2 className="size-3.5 animate-spin" /> Gathering concepts in {branch.name}…
          </div>
        )}
        {!failed && graph && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {topConcepts.map((c, i) => {
              const struggle = c.difficulty >= 4 && c.mastery < 45
              return (
                <li key={c.id}>
                  <motion.button
                    type="button"
                    onClick={() => openConcept(c.id)}
                    aria-label={`Open ${c.name} in the concept explorer`}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                    whileHover={reduce ? undefined : { y: -2 }}
                    className={cn(
                      'group flex w-full flex-col rounded-xl border p-3 text-left transition-colors',
                      struggle
                        ? 'border-sev-crit/30 bg-sev-crit/5 hover:border-sev-crit/60'
                        : 'border-line bg-surface-2/60 hover:border-primary/40',
                    )}
                  >
                    <span className="flex items-start justify-between gap-1.5">
                      <span className="text-xs font-semibold leading-snug">{KIND_EMOJI[c.kind] ?? '💡'} {c.name}</span>
                      {struggle && <span aria-hidden className="text-[10px]">⚠️</span>}
                    </span>
                    <span className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-soft">
                      {KIND_META[c.kind]?.label ?? c.kind} · {c.status}
                    </span>
                    <span className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <span
                        className={cn('block h-full rounded-full', c.mastery < 45 ? 'bg-sev-crit' : c.mastery < 70 ? 'bg-sev-warn' : 'bg-sev-ok')}
                        style={{ width: `${Math.max(3, c.mastery)}%` }}
                      />
                    </span>
                    <span className="mt-1 text-[10px] tabular-nums text-ink-soft">
                      mastery {c.mastery}% · difficulty {c.difficulty}/5
                    </span>
                  </motion.button>
                </li>
              )
            })}
          </ul>
        )}

        {/* actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <Button size="sm" className="min-h-9 gap-1.5" onClick={() => { setQuizPreset({ subjectCode: branch.code, count: 8 }) ; setView('questions') }}>
            <Play className="size-3.5" /> Practice {branch.code}
          </Button>
          <Button size="sm" variant="outline" className="min-h-9 gap-1.5" onClick={openOnMap}>
            <MapIcon className="size-3.5" /> Open on Medical Map
          </Button>
          <Button size="sm" variant="outline" className="min-h-9 gap-1.5" onClick={() => setView('learn')}>
            <BookOpen className="size-3.5" /> Learn
          </Button>
          <span className="ml-auto inline-flex min-h-9 items-center gap-1 text-xs font-medium text-ink-soft">
            <Waypoints className="size-3.5 text-primary" />
            {graph ? `${graph.edges.length} connections inside` : '—'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function BranchSphere({ b, reduce, active, onToggle }: { b: Placed; reduce: boolean | null; active: boolean; onToggle: () => void }) {
  const tone = STATUS_TONE[b.status]
  const [hover, setHover] = useState(false)

  return (
    <div
      className="absolute"
      style={{
        left: `${b.x}%`,
        top: `${b.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: hover ? 20 : 10,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.button
        type="button"
        onClick={onToggle}
        aria-label={`${b.name} — ${tone.label}, mastery ${b.mastery}%. Show branch details.`}
        aria-pressed={active}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={reduce ? undefined : { scale: 1.14, y: -4 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18, delay: reduce ? 0 : b.delay }}
        className={cn(
          'group relative grid place-items-center rounded-full outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          !reduce && 'animate-sphere-float',
          active && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        )}
        style={{
          width: b.size,
          height: b.size,
          animationDelay: `${b.delay}s`,
          animationDuration: `${5 + (b.delay % 3)}s`,
        }}
      >
        {/* mastery ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 72 72" aria-hidden>
          <circle cx="36" cy="36" r="33" fill="none" strokeWidth="4" className="stroke-surface-2" />
          <circle
            cx="36" cy="36" r="33" fill="none" strokeWidth="4" strokeLinecap="round"
            stroke={tone.ring}
            strokeDasharray={2 * Math.PI * 33}
            strokeDashoffset={2 * Math.PI * 33 * (1 - b.mastery / 100)}
            opacity={0.95}
          />
        </svg>
        {/* 3D sphere body */}
        <span
          className="sphere-3d grid size-[78%] place-items-center rounded-full text-xl md:text-2xl"
          style={{
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.92), ${b.color}cc 45%, ${b.color} 70%, rgba(0,0,0,0.25) 130%)`,
            boxShadow: `0 6px 18px -6px ${b.color}88, inset 0 -4px 10px rgba(0,0,0,0.18), inset 0 3px 6px rgba(255,255,255,0.4)`,
          }}
          aria-hidden
        >
          <span className="drop-shadow-sm" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))' }}>{b.emoji}</span>
        </span>
        {/* heartbeat pulse for weak subjects */}
        {b.status === 'weak' && (
          <span aria-hidden className="absolute inset-0 rounded-full border-2 border-sev-crit/60 sphere-pulse" />
        )}
      </motion.button>

      {/* tooltip */}
      {hover && !active && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-max max-w-[180px] -translate-x-1/2 rounded-xl border border-line bg-card/95 p-2.5 text-left shadow-xl backdrop-blur"
          role="tooltip"
        >
          <p className="text-xs font-semibold leading-tight">{b.emoji} {b.name}</p>
          <p className="mt-1 text-[10px] text-ink-soft">
            {b.conceptCount} concepts · mastery <span className="font-semibold tabular-nums">{b.mastery}%</span> · {tone.label}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Click for a closer look · NEET-PG weight {b.neetWeight}%</p>
        </motion.div>
      )}
    </div>
  )
}

export function BranchGalaxy() {
  const reduce = useReducedMotion()
  const [insights, setInsights] = useState<MapInsights | null>(null)
  const [failed, setFailed] = useState(false)
  const [selected, setSelected] = useState<MapBranch | null>(null)

  useEffect(() => {
    let ok = true
    api.mapInsights().then(d => { if (ok) setInsights(d) }).catch(() => { if (ok) setFailed(true) })
    return () => { ok = false }
  }, [])

  const branches = insights?.branches ?? []
  const placed = useMemo(() => (branches.length ? orbitLayout(branches) : []), [branches])
  const avgMastery = insights?.totals.avgMastery ?? 0

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-4 md:p-6">
      {/* warm aurora glow */}
      <div aria-hidden className="galaxy-aurora pointer-events-none absolute inset-0" />

      <div className="relative mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
            <Waypoints className="size-4 text-primary" /> Branch galaxy
          </h3>
          <p className="mt-0.5 text-xs text-ink-soft">19 subjects orbit your brain · tap one for a closer look</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium tabular-nums">
          🌤️ avg mastery {avgMastery}%
        </span>
      </div>

      {failed && (
        <p className="relative py-8 text-center text-sm text-ink-soft">
          The galaxy could not load — refresh to retry.
        </p>
      )}
      {!failed && branches.length === 0 && (
        <div className="relative grid h-[320px] place-items-center md:h-[420px]" aria-busy="true">
          <div className="shimmer size-24 rounded-full" />
        </div>
      )}

      {branches.length > 0 && (
        <div className="relative mx-auto max-w-2xl">
          <div
            className="relative h-[320px] md:h-[440px]"
            role="group"
            aria-label="Subject branches"
          >
            {/* orbit rings (elliptical — matches sphere placement) */}
            <svg aria-hidden className="absolute inset-0 size-full">
              <ellipse cx="50%" cy="50%" rx="24%" ry="19%" className="fill-none stroke-line" strokeWidth="1" strokeDasharray="3 6" />
              <ellipse cx="50%" cy="50%" rx="41%" ry="32%" className="fill-none stroke-line" strokeWidth="1" strokeDasharray="3 6" />
              <ellipse cx="50%" cy="50%" rx="43.5%" ry="34.5%" className="fill-none stroke-primary/15" strokeWidth="1.5" />
            </svg>

            {/* you — the sun of this galaxy */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div aria-hidden className="galaxy-core" />
              <motion.div
                className="relative grid size-16 place-items-center rounded-full border border-primary/40 bg-primary/15 text-2xl backdrop-blur md:size-20"
                animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
                transition={reduce ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                🧑‍⚕️
              </motion.div>
              <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">You</p>
            </div>

            {/* orbiting branch spheres */}
            {placed.map(b => (
              <BranchSphere
                key={b.id}
                b={b}
                reduce={reduce}
                active={selected?.id === b.id}
                onToggle={() => setSelected(cur => (cur?.id === b.id ? null : b))}
              />
            ))}
          </div>

          {/* drill-down mini-panel — opens without leaving home */}
          <AnimatePresence mode="wait">
            {selected && (
              <BranchPanel key={selected.id} branch={selected} onClose={() => setSelected(null)} />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* legend */}
      {branches.length > 0 && (
        <div className="relative mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-ink-soft">
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: 'var(--sev-ok)' }} /> Strong ≥70%</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: 'var(--sev-warn)' }} /> Unstable</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: 'var(--sev-crit)' }} /> Weak &lt;45%</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: 'var(--muted-foreground)' }} /> Not started</span>
        </div>
      )}
    </div>
  )
}
