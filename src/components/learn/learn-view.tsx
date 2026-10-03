'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import type { SubjectSummary, TopicSummary, GraphPayload } from '@/lib/types'
import { YEAR_LABELS } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  ChevronRight, ChevronDown, RefreshCcw, BookOpen, Sparkles,
  ArrowLeft, Target, CircleDot,
} from 'lucide-react'

const statusColor: Record<string, string> = {
  strong: 'bg-sev-ok', unstable: 'bg-sev-warn', weak: 'bg-sev-crit', new: 'bg-muted-foreground/40',
}

function MasteryBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Progress value={value} className="h-1.5 flex-1" />
      <span className="w-9 text-right text-xs tabular-nums text-ink-soft">{value}%</span>
    </div>
  )
}

export function LearnView() {
  const { openConcept, setQuizPreset, setView } = useAppStore()
  const [subjects, setSubjects] = useState<SubjectSummary[] | null>(null)
  const [error, setError] = useState(false)
  const [activeSubject, setActiveSubject] = useState<SubjectSummary | null>(null)
  const [topics, setTopics] = useState<TopicSummary[] | null>(null)
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const [topicConcepts, setTopicConcepts] = useState<Record<string, GraphPayload['nodes']>>({})
  const [conceptLoading, setConceptLoading] = useState<string | null>(null)

  const loadSubjects = useCallback(() => {
    setError(false)
    api.subjects()
      .then((r) => setSubjects(r.subjects))
      .catch(() => setError(true))
  }, [])

  useEffect(() => {
    let ok = true
    api.subjects()
      .then((r) => { if (ok) setSubjects(r.subjects) })
      .catch(() => { if (ok) setError(true) })
    return () => { ok = false }
  }, [])

  const openSubject = (s: SubjectSummary) => {
    setActiveSubject(s)
    setTopics(null)
    setOpenTopic(null)
    setTopicsLoading(true)
    api.subject(s.id)
      .then((r) => setTopics(r.topics))
      .catch(() => setTopics([]))
      .finally(() => setTopicsLoading(false))
  }

  const toggleTopic = (topicId: string) => {
    if (openTopic === topicId) { setOpenTopic(null); return }
    setOpenTopic(topicId)
    if (!topicConcepts[topicId]) {
      setConceptLoading(topicId)
      api.graph(`topic:${topicId}`)
        .then((g) => setTopicConcepts((prev) => ({ ...prev, [topicId]: g.nodes })))
        .catch(() => setTopicConcepts((prev) => ({ ...prev, [topicId]: [] })))
        .finally(() => setConceptLoading(null))
    }
  }

  const yearGroups = [1, 2, 3, 4].map((y) => ({
    year: y,
    items: (subjects ?? []).filter((s) => s.year === y),
  }))

  if (error && !subjects) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-6">
        <p className="text-sm text-ink-soft">Could not load the curriculum.</p>
        <Button variant="outline" onClick={loadSubjects}><RefreshCcw className="mr-2 size-4" />Retry</Button>
      </div>
    )
  }

  // ── SUBJECT DETAIL ──
  if (activeSubject) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
        <button
          onClick={() => { setActiveSubject(null); setTopics(null) }}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All subjects
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start gap-3">
            <span className="mt-1.5 size-3.5 shrink-0 rounded-full" style={{ background: activeSubject.color }} />
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{activeSubject.name}</h1>
              <p className="mt-1 text-sm text-ink-soft">{activeSubject.blurb}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{YEAR_LABELS[activeSubject.year] ?? `Year ${activeSubject.year}`}</Badge>
                <Badge variant="outline" className="gap-1"><Target className="size-3" /> {activeSubject.neetWeight}% NEET-PG weight</Badge>
                <Badge variant="outline">{activeSubject.conceptCount} concepts</Badge>
                <Badge variant="outline">{activeSubject.topicCount} topics</Badge>
              </div>
              <div className="mt-4 max-w-sm">
                <MasteryBar value={activeSubject.mastery} />
              </div>
            </div>
            <Button
              className="ml-auto hidden min-h-11 sm:inline-flex"
              onClick={() => { setQuizPreset({ subjectCode: activeSubject.code, count: 10 }); setView('questions') }}
            >
              <Sparkles className="mr-2 size-4" /> Quiz this subject
            </Button>
          </div>
        </motion.div>

        <div className="space-y-3">
          {topicsLoading && (
            <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}</div>
          )}
          {!topicsLoading && (topics ?? []).length === 0 && (
            <Card className="glass rounded-2xl"><CardContent className="p-6 text-sm text-ink-soft">Topics for this subject are being curated.</CardContent></Card>
          )}
          <AnimatePresence initial={false}>
            {(topics ?? []).map((t, idx) => {
              const isOpen = openTopic === t.id
              const concepts = topicConcepts[t.id]
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Card className={`glass overflow-hidden rounded-2xl transition-colors ${isOpen ? 'border-primary/40' : ''}`}>
                    <button
                      onClick={() => toggleTopic(t.id)}
                      className="flex w-full items-center gap-3 p-4 text-left md:p-5"
                      aria-expanded={isOpen}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{t.name}</span>
                          {t.system && <Badge variant="secondary" className="capitalize">{t.system}</Badge>}
                          <Badge variant="outline" className="gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <CircleDot key={i} className={`size-2 ${i < t.importance ? 'text-primary' : 'text-muted-foreground/30'}`} />
                            ))}
                            yield
                          </Badge>
                        </div>
                        {t.description && <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{t.description}</p>}
                        <div className="mt-2 max-w-xs"><MasteryBar value={t.mastery} /></div>
                      </div>
                      <span className="text-xs text-ink-soft">{t.conceptCount} concepts</span>
                      {isOpen ? <ChevronDown className="size-4 shrink-0 text-ink-soft" /> : <ChevronRight className="size-4 shrink-0 text-ink-soft" />}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          <div className="border-t border-line p-4 md:p-5">
                            {conceptLoading === t.id && (
                              <div className="grid gap-3 sm:grid-cols-2">{[0, 1].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
                            )}
                            {conceptLoading !== t.id && (concepts ?? []).length === 0 && (
                              <p className="text-sm text-ink-soft">No concepts mapped yet.</p>
                            )}
                            <div className="grid gap-3 sm:grid-cols-2">
                              {(concepts ?? []).map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => openConcept(c.id)}
                                  className="group rounded-xl border border-line bg-surface-2 p-4 text-left transition-all hover:border-primary/50"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="truncate font-medium text-sm group-hover:text-primary">{c.name}</span>
                                  </div>
                                  <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{c.summary}</p>
                                  <div className="mt-2.5 flex items-center gap-2">
                                    <span className={`size-2 rounded-full ${statusColor[c.status] ?? 'bg-muted-foreground/40'}`} />
                                    <span className="text-[11px] capitalize text-ink-soft">{c.status}</span>
                                    <div className="ml-auto w-24"><MasteryBar value={c.mastery} /></div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <Button
          className="w-full min-h-11 sm:hidden"
          onClick={() => { setQuizPreset({ subjectCode: activeSubject.code, count: 10 }); setView('questions') }}
        >
          <Sparkles className="mr-2 size-4" /> Quiz this subject
        </Button>
      </div>
    )
  }

  // ── SUBJECT BROWSER ──
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">LEARN</h1>
        <p className="mt-1 text-sm text-ink-soft">
          The NMC CBME curriculum as a living knowledge map — every topic links concepts across subjects.
        </p>
      </div>

      {!subjects && !error && (
        <div className="space-y-8">
          {[1, 2].map((y) => (
            <div key={y} className="space-y-3">
              <Skeleton className="h-6 w-40" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {yearGroups.map(({ year, items }) => items.length > 0 && (
        <section key={year} className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
              {YEAR_LABELS[year] ?? `Year ${year}`}
            </h2>
            <div className="h-px flex-1 bg-line" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => openSubject(s)}
                  className="group w-full rounded-2xl border border-line bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="size-3 rounded-full" style={{ background: s.color }} />
                    <span className="font-medium group-hover:text-primary">{s.name}</span>
                    <ChevronRight className="ml-auto size-4 text-ink-soft transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-2 line-clamp-2 min-h-8 text-xs text-ink-soft">{s.blurb}</p>
                  <div className="mt-3"><MasteryBar value={s.mastery} /></div>
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] text-ink-soft">
                    <span className={`size-1.5 rounded-full ${statusColor[s.status]}`} />
                    <span className="capitalize">{s.status}</span>
                    <span className="ml-auto">{s.neetWeight}% NEET-PG</span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
