'use client'

// ─── INDEX SUBJECTARUM — the calm, simple subject index ───
// Replaces the old orbiting Branch Galaxy: one tidy grid, readable text,
// zero decoration. Tap a subject → opens it focused on the Medical Map.

import { Map as MapIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MapInsights } from '@/app/api/map-insights/route'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function statusDot(status: string): string {
  if (status === 'strong') return 'bg-sev-ok'
  if (status === 'unstable') return 'bg-sev-warn'
  if (status === 'weak') return 'bg-sev-crit'
  return 'bg-muted-foreground/50'
}

function barColor(mastery: number): string {
  if (mastery < 45) return 'bg-sev-crit'
  if (mastery < 70) return 'bg-sev-warn'
  return 'bg-sev-ok'
}

export function SubjectIndex({ insights }: { insights: MapInsights | null }) {
  const setView = useAppStore((s) => s.setView)
  const setMapScope = useAppStore((s) => s.setMapScope)
  const reduce = useReducedMotion()

  const branches = insights?.branches ?? []
  if (branches.length === 0) return null

  const openOnMap = (subjectId: string) => {
    setMapScope(`subject:${subjectId}`)
    setView('map')
  }

  return (
    <section className="glass rounded-2xl p-4 md:p-6" aria-label="All subjects">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">Index Subjectarum</h2>
          <p className="mt-0.5 text-xs text-ink-soft md:text-sm">
            All {branches.length} subjects · Year 1 → Intern · tap to open on the map
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="min-h-10 gap-1.5 rounded-full border-primary/40 px-4 text-primary hover:bg-primary/10"
          onClick={() => setView('map')}
        >
          <MapIcon className="size-3.5" /> Medical Map
        </Button>
      </div>

      {/* quiet summary strip */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-soft">
        <span>
          Avg mastery <strong className="text-foreground tabular-nums">{insights?.totals.avgMastery ?? 0}%</strong>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-sev-ok" /> Strong{' '}
          <strong className="text-foreground tabular-nums">{insights?.totals.strongCount ?? 0}</strong>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-sev-warn" /> Need attention{' '}
          <strong className="text-foreground tabular-nums">{insights?.totals.weakCount ?? 0}</strong>
        </span>
      </div>

      {/* the tidy grid — 2 cols on phones, up to 5 on desktop */}
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {branches.map((b, i) => (
          <motion.li
            key={b.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduce ? 0 : Math.min(i * 0.03, 0.4), ease: EASE }}
          >
            <button
              type="button"
              onClick={() => openOnMap(b.id)}
              aria-label={`${b.name} — mastery ${b.mastery}%, ${b.conceptCount} concepts. Open on the Medical Map.`}
              className="group flex h-full w-full flex-col rounded-xl border border-line bg-surface-2/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex w-full items-center gap-2">
                <span aria-hidden className="text-base leading-none">{b.emoji}</span>
                <span className="min-w-0 flex-1 truncate text-xs font-semibold leading-tight">{b.name}</span>
                <span className={cn('size-1.5 shrink-0 rounded-full', statusDot(b.status))} aria-hidden />
              </span>
              <span className="mt-1 block truncate text-[10px] text-ink-soft">
                {b.conceptCount} concepts
              </span>
              <span className="mt-2 flex w-full items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-background/60">
                  <span
                    className={cn('block h-full rounded-full transition-[width] duration-700', barColor(b.mastery))}
                    style={{ width: `${Math.max(4, b.mastery)}%` }}
                  />
                </span>
                <span className="text-[10px] font-semibold tabular-nums text-ink-soft">{b.mastery}%</span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
