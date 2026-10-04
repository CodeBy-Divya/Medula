'use client'

// ─── ALL SUBJECTS — the crisp, calm subject index ────────────────────────────
// One tidy grid: emoji, name, mastery bar. Nothing else on the card.
// Tap a subject → opens the Doubt Search pre-scoped to that subject, where
// every topic of the subject is one tap away.

import { motion, useReducedMotion } from 'framer-motion'

import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { MapInsights } from '@/app/api/map-insights/route'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

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

  const openSubject = (subjectId: string) => {
    setMapScope(`subject:${subjectId}`)
    setView('map') // the map view is now the Doubt Search — lands scoped
  }

  return (
    <section aria-label="All subjects">
      {/* header — one line, no clutter */}
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-lg font-semibold tracking-tight">All Subjects</h2>
        <p className="text-xs text-ink-soft">
          {branches.length} subjects · tap to open
        </p>
      </div>

      {/* the tidy grid — 2 cols on phones, up to 5 on desktop */}
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {branches.map((b, i) => (
          <motion.li
            key={b.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: reduce ? 0 : Math.min(i * 0.025, 0.3), ease: EASE }}
          >
            <button
              type="button"
              onClick={() => openSubject(b.id)}
              aria-label={`${b.name} — ${b.conceptCount} concepts, ${b.mastery}% mastery. Open topics.`}
              className="group flex h-full w-full flex-col rounded-xl border border-line bg-card/70 p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex w-full items-center gap-2">
                <span aria-hidden className="text-base leading-none">{b.emoji}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold leading-tight">{b.name}</span>
              </span>
              <span className="mt-2 flex w-full items-center gap-2">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
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
