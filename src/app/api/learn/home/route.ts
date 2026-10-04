// ─── LEARN HOME API — mixed static registry + live user state ───────────────
// Builds LearnHomePayload (src/lib/curriculum/types.ts) for the Learn home
// surface. Registry data (taxonomy, packs, atlas) is static; user state
// (knowledge, sessions) comes from the DB for the demo profile.
//
// Honesty rules:
//   · Every count is measured, never fabricated — 0 means zero.
//   · DB failure → static registry-derived payload with zeros for all
//     user-state arrays + `degraded: true` (additive field), never an error
//     page for a read-only surface.
//   · StudySession carries no conceptId column today, so per the omit-rule
//     every session is omitted from recentlyStudied → the section stays
//     honestly empty until sessions record concept links (the join code is
//     ready and will pick the column up additively if the schema gains it).

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import { DAY, estimatedRecall } from '@/lib/engine'
import { ATLAS_3D } from '@/lib/curriculum/atlas'
import { AI_CONCEPT_IDS, allSubjects } from '@/lib/curriculum/registry'
import { PHASES, SYSTEMS } from '@/lib/curriculum/taxonomy'
import type { LearnHomePayload, Phase } from '@/lib/curriculum/types'

export const dynamic = 'force-dynamic'

// Legacy DB topic.system tags folded into canonical SYSTEMS keys — mirrors
// LEGACY_SYSTEM_ALIASES in registry.ts (not exported there, so restated here).
const LEGACY_SYSTEM_ALIASES: Record<string, string> = {
  hematology: 'haematology',
  infectious: 'immune-infection',
  neurology: 'nervous',
}

function canonicalSystem(raw: string | null | undefined): string | null {
  if (!raw) return null
  return LEGACY_SYSTEM_ALIASES[raw] ?? raw
}

type HomePayload = LearnHomePayload & { degraded?: boolean }

export async function GET(_req: NextRequest) {
  let payload: HomePayload
  try {
    payload = await buildLivePayload()
  } catch (err) {
    console.error('[api/learn/home] DB unavailable — serving static registry payload:', err)
    payload = { ...staticPayload(), degraded: true }
  }
  return NextResponse.json(payload)
}

// ── Live payload (registry + DB) ────────────────────────────────────────────

async function buildLivePayload(): Promise<HomePayload> {
  const profile = await getDemoProfile()
  const now = new Date()

  const [states, sessions, topics, concepts, subjectRows, prereqEdges, lessonCount, papersCount, subjectTotal] =
    await Promise.all([
      db.knowledgeState.findMany({
        where: { profileId: profile.id },
        include: { concept: { include: { topic: { include: { subject: true } } } } },
      }),
      db.studySession.findMany({ where: { profileId: profile.id }, orderBy: { date: 'desc' }, take: 40 }),
      db.topic.findMany({ select: { id: true, subjectId: true, system: true } }),
      db.concept.findMany({
        select: { id: true, topicId: true, name: true, examWeight: true, examRelevance: true },
      }),
      db.subject.findMany({ select: { id: true, name: true } }),
      db.conceptEdge.findMany({ where: { type: 'prerequisite_of' }, select: { fromId: true, toId: true } }),
      db.concept.count({ where: { lesson: { not: Prisma.DbNull } } }),
      db.researchPaper.count(),
      db.subject.count(),
    ])

  // Fresh recall estimates (same refresh rule as /api/dashboard — stored
  // estRecall goes stale as time passes; estimatedRecall recomputes honestly).
  const fresh = states.map((s) => {
    const days = s.lastReviewed ? (now.getTime() - s.lastReviewed.getTime()) / DAY : 999
    return { s, estRecall: estimatedRecall(days, s.stability) }
  })
  const stateByConcept = new Map(fresh.map(({ s }) => [s.conceptId, s]))

  // ── continueLearning — attempted concepts, most at-risk recall first ─────
  const continueLearning = fresh
    .filter(({ s }) => s.attemptCount > 0)
    .sort((a, b) => a.estRecall - b.estRecall)
    .slice(0, 5)
    .map(({ s, estRecall }) => ({
      conceptId: s.conceptId,
      conceptName: s.concept.name,
      subjectName: s.concept.topic.subject.name,
      subjectColor: s.concept.topic.subject.color,
      mastery: Math.round(s.score),
      estRecall: Math.round(estRecall * 100) / 100,
      reason:
        estRecall < 0.6
          ? `Recall estimate dropped to ${Math.round(estRecall * 100)}% — review now`
          : s.score < 45
            ? 'Mastery still building — keep practicing'
            : 'Strength building',
    }))

  // ── recommendedNext — lighter NBA: new/weak concepts, prereqs preferred ──
  const topicById = new Map(topics.map((t) => [t.id, t]))
  const subjectNameById = new Map(subjectRows.map((s) => [s.id, s.name]))
  const prereqsOf = new Map<string, string[]>()
  for (const e of prereqEdges) {
    const list = prereqsOf.get(e.toId) ?? []
    list.push(e.fromId)
    prereqsOf.set(e.toId, list)
  }
  const isReady = (conceptId: string) => {
    const st = stateByConcept.get(conceptId)
    return !!st && st.score >= 45
  }
  const candidates = concepts
    .filter((c) => {
      const st = stateByConcept.get(c.id)
      return !st || st.score < 45 // 'new' or weak
    })
    .map((c) => ({
      c,
      examWeight: c.examWeight ?? c.examRelevance,
      isNew: !stateByConcept.has(c.id),
      prereqMet: (prereqsOf.get(c.id) ?? []).every(isReady),
    }))
    .sort(
      (a, b) =>
        Number(b.prereqMet) - Number(a.prereqMet) ||
        b.examWeight - a.examWeight ||
        a.c.name.localeCompare(b.c.name),
    )
  const recommendedNext = candidates.length
    ? (() => {
        const top = candidates[0]
        const subjectId = topicById.get(top.c.topicId)?.subjectId
        const unmet = (prereqsOf.get(top.c.id) ?? []).filter((pid) => !isReady(pid))
        return {
          conceptId: top.c.id,
          conceptName: top.c.name,
          subjectName: (subjectId && subjectNameById.get(subjectId)) || 'General',
          reason: unmet.length
            ? `Exam yield ${top.examWeight}/5 — ${unmet.length} prerequisite${unmet.length > 1 ? 's' : ''} still in progress`
            : `${top.isNew ? 'Not yet studied' : 'Mastery below target'} — prerequisites secured, exam yield ${top.examWeight}/5`,
          examWeight: top.examWeight,
        }
      })()
    : null

  // ── weakConcepts — mastery < 40, weakest first ───────────────────────────
  const weakConcepts = fresh
    .filter(({ s }) => s.score < 40)
    .sort((a, b) => a.s.score - b.s.score)
    .slice(0, 6)
    .map(({ s }) => ({
      conceptId: s.conceptId,
      conceptName: s.concept.name,
      subjectName: s.concept.topic.subject.name,
      mastery: Math.round(s.score),
    }))

  // ── recentlyStudied — sessions joined to a concept, else omitted ─────────
  // NOTE: the StudySession table has no conceptId column in the current
  // schema, so today every row is honestly omitted → []. The cast below is
  // future-proof: if the schema gains conceptId the join starts working with
  // no code change. Never guessed from free-text labels.
  const conceptNameById = new Map(concepts.map((c) => [c.id, c.name]))
  const recentlyStudied = sessions
    .map((session) => {
      const cid = (session as unknown as { conceptId?: unknown }).conceptId
      if (typeof cid !== 'string' || !cid) return null
      const name = conceptNameById.get(cid)
      if (!name) return null
      return { conceptId: cid, conceptName: name, at: session.date.toISOString() }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, 6)

  // ── per-subject + per-system counts (measured from the DB) ───────────────
  const topicsBySubject = new Map<string, number>()
  const systemTopicCount = new Map<string, number>()
  for (const t of topics) {
    topicsBySubject.set(t.subjectId, (topicsBySubject.get(t.subjectId) ?? 0) + 1)
    const key = canonicalSystem(t.system)
    if (key) systemTopicCount.set(key, (systemTopicCount.get(key) ?? 0) + 1)
  }
  const conceptsBySubject = new Map<string, number>()
  const systemConceptCount = new Map<string, number>()
  for (const c of concepts) {
    const t = topicById.get(c.topicId)
    if (!t) continue
    conceptsBySubject.set(t.subjectId, (conceptsBySubject.get(t.subjectId) ?? 0) + 1)
    const key = canonicalSystem(t.system)
    if (key) systemConceptCount.set(key, (systemConceptCount.get(key) ?? 0) + 1)
  }
  const masteryAgg = new Map<string, { sum: number; n: number }>()
  for (const { s } of fresh) {
    const t = topicById.get(s.concept.topicId)
    if (!t) continue
    const cur = masteryAgg.get(t.subjectId) ?? { sum: 0, n: 0 }
    cur.sum += s.score
    cur.n += 1
    masteryAgg.set(t.subjectId, cur)
  }
  const masteryOf = (subjectId: string) => {
    const agg = masteryAgg.get(subjectId)
    return agg && agg.n ? Math.round(agg.sum / agg.n) : 0
  }

  const phases = PHASES.map(({ phase, label }) => ({
    phase: phase as Phase,
    label,
    subjects: allSubjects()
      .filter((sub) => sub.phase === phase)
      .map((sub) => ({
        id: sub.id,
        code: sub.code,
        name: sub.name,
        color: sub.color,
        year: sub.year,
        topicCount: topicsBySubject.get(sub.id) ?? 0,
        conceptCount: conceptsBySubject.get(sub.id) ?? 0,
        mastery: masteryOf(sub.id),
        neetWeight: sub.neetWeight,
        systems: sub.systems,
      })),
  }))

  const systems = SYSTEMS.map(({ system, label }) => {
    const contributing = allSubjects().filter((sub) => sub.systems.includes(system))
    return {
      system,
      label,
      subjectCount: contributing.length,
      topicCount: systemTopicCount.get(system) ?? 0,
      conceptCount: systemConceptCount.get(system) ?? 0,
      subjects: contributing.map((sub) => sub.id),
    }
  })

  return {
    continueLearning,
    recommendedNext,
    weakConcepts,
    recentlyStudied,
    phases,
    systems,
    hasLessonCoverage: lessonCount,
    totals: {
      subjects: subjectTotal,
      topics: topics.length,
      concepts: concepts.length,
      lessons: lessonCount,
      diagrams3d: ATLAS_3D.length,
      papers: papersCount,
      aiConcepts: AI_CONCEPT_IDS.length,
    },
  }
}

// ── Static fallback (DB unavailable) — registry-derived, honest zeros ───────

function staticPayload(): LearnHomePayload {
  const subjectBase = (sub: ReturnType<typeof allSubjects>[number]) => ({
    id: sub.id,
    code: sub.code,
    name: sub.name,
    color: sub.color,
    year: sub.year,
    topicCount: 0,
    conceptCount: 0,
    mastery: 0,
    neetWeight: sub.neetWeight,
    systems: sub.systems,
  })
  return {
    continueLearning: [],
    recommendedNext: null,
    weakConcepts: [],
    recentlyStudied: [],
    phases: PHASES.map(({ phase, label }) => ({
      phase: phase as Phase,
      label,
      subjects: allSubjects()
        .filter((sub) => sub.phase === phase)
        .map(subjectBase),
    })),
    systems: SYSTEMS.map(({ system, label }) => {
      const contributing = allSubjects().filter((sub) => sub.systems.includes(system))
      return {
        system,
        label,
        subjectCount: contributing.length,
        topicCount: 0,
        conceptCount: 0,
        subjects: contributing.map((sub) => sub.id),
      }
    }),
    hasLessonCoverage: 0,
    totals: {
      subjects: 0,
      topics: 0,
      concepts: 0,
      lessons: 0,
      diagrams3d: ATLAS_3D.length,
      papers: 0,
      aiConcepts: AI_CONCEPT_IDS.length,
    },
  }
}
