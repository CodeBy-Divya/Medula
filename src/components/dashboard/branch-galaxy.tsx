'use client'

// ─── BRANCH GALAXY ───
// The 19 MBBS subjects orbiting around "you" as animated 3D emoji spheres.
// Click a branch → the full Medical Map opens scoped to that subject.

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { MapBranch } from '@/app/api/map-insights/route'
import type { MapInsights } from '@/app/api/map-insights/route'

const STATUS_TONE: Record<MapBranch['status'], { ring: string; label: string }> = {
  strong: { ring: 'var(--sev-ok)', label: 'Strong' },
  unstable: { ring: 'var(--sev-warn)', label: 'Unstable' },
  weak: { ring: 'var(--sev-crit)', label: 'Weak' },
  new: { ring: 'var(--muted-foreground)', label: 'New' },
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

function BranchSphere({ b, reduce }: { b: Placed; reduce: boolean | null }) {
  const setView = useAppStore(s => s.setView)
  const setMapScope = useAppStore(s => s.setMapScope)
  const tone = STATUS_TONE[b.status]
  const [hover, setHover] = useState(false)

  const open = () => {
    setMapScope(`subject:${b.id}`)
    setView('map')
  }

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
        onClick={open}
        aria-label={`${b.name} — ${tone.label}, mastery ${b.mastery}%. Open on Medical Map.`}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={reduce ? undefined : { scale: 1.14, y: -4 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18, delay: reduce ? 0 : b.delay }}
        className={cn(
          'group relative grid place-items-center rounded-full outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          !reduce && 'animate-sphere-float',
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
      {hover && (
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
          <p className="mt-0.5 text-[10px] text-muted-foreground">NEET-PG weight {b.neetWeight}%</p>
        </motion.div>
      )}
    </div>
  )
}

export function BranchGalaxy() {
  const reduce = useReducedMotion()
  const [insights, setInsights] = useState<MapInsights | null>(null)
  const [failed, setFailed] = useState(false)

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
            <Compass className="size-4 text-primary" /> Branch galaxy
          </h3>
          <p className="mt-0.5 text-xs text-ink-soft">19 subjects orbit your brain · tap one to travel</p>
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
        <div className="relative mx-auto h-[320px] max-w-2xl md:h-[440px]" role="group" aria-label="Subject branches">
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
          {placed.map(b => <BranchSphere key={b.id} b={b} reduce={reduce} />)}
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
