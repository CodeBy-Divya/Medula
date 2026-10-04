// ─── LEARN CURRICULUM API — taxonomy + live DB counts ───────────────────────
// Full curriculum map: phases, subjects (with live DB counts), organ systems,
// the curriculum authority registry, and totals. `?subject=<id>` returns one
// subject's DB topics (importance desc) with per-topic concept counts and
// lesson coverage.
//
// Honesty rules: every count is measured (0 means zero); unknown subject /
// bad input → 400; DB errors → 500 per route conventions.

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import {
  AI_CONCEPT_IDS,
  allCurriculumRecords,
  allSubjects,
  phaseOfSubject,
} from '@/lib/curriculum/registry'
import { ATLAS_3D } from '@/lib/curriculum/atlas'
import { PHASES, SYSTEMS } from '@/lib/curriculum/taxonomy'
import type { Phase } from '@/lib/curriculum/types'

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

export async function GET(req: NextRequest) {
  const subjectParam = req.nextUrl.searchParams.get('subject')
  try {
    if (subjectParam) return NextResponse.json(await subjectDetail(subjectParam))
    return NextResponse.json(await fullCurriculum())
  } catch (err) {
    console.error('[api/learn/curriculum] request failed:', err)
    return NextResponse.json({ error: 'Failed to load curriculum data' }, { status: 500 })
  }
}

// ── Single subject detail (?subject=<id>) ───────────────────────────────────

async function subjectDetail(subjectId: string) {
  const subject = allSubjects().find((s) => s.id === subjectId)
  if (!subject) {
    return NextResponse.json(
      { error: `Unknown subject "${subjectId.slice(0, 80)}"` },
      { status: 400 },
    )
  }

  const profile = await getDemoProfile()
  const [topics, concepts, lessonTopics, states] = await Promise.all([
    db.topic.findMany({
      where: { subjectId },
      orderBy: [{ importance: 'desc' }, { name: 'asc' }],
    }),
    db.concept.findMany({
      where: { topic: { subjectId } },
      select: { id: true, topicId: true, name: true },
    }),
    db.concept.findMany({
      where: { topic: { subjectId }, lesson: { not: Prisma.DbNull } },
      select: { topicId: true },
    }),
    db.knowledgeState.findMany({
      where: { profileId: profile.id, concept: { topic: { subjectId } } },
      select: { score: true },
    }),
  ])

  const conceptCountByTopic = new Map<string, number>()
  for (const c of concepts) {
    conceptCountByTopic.set(c.topicId, (conceptCountByTopic.get(c.topicId) ?? 0) + 1)
  }
  const lessonCountByTopic = new Map<string, number>()
  for (const c of lessonTopics) {
    lessonCountByTopic.set(c.topicId, (lessonCountByTopic.get(c.topicId) ?? 0) + 1)
  }
  const mastery = states.length
    ? Math.round(states.reduce((a, s) => a + s.score, 0) / states.length)
    : 0

  return {
    subject: {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      phase: phaseOfSubject(subject.id) ?? subject.phase,
      year: subject.year,
      color: subject.color,
      blurb: subject.blurb,
      neetWeight: subject.neetWeight,
      systems: subject.systems,
      topicCount: topics.length,
      conceptCount: concepts.length,
      mastery,
    },
    topics: topics.map((t) => ({
      id: t.id,
      name: t.name,
      system: t.system,
      importance: t.importance,
      description: t.description,
      conceptCount: conceptCountByTopic.get(t.id) ?? 0,
      lessonCoverage: lessonCountByTopic.get(t.id) ?? 0,
    })),
  }
}

// ── Full curriculum map ─────────────────────────────────────────────────────

async function fullCurriculum() {
  const profile = await getDemoProfile()
  const [topics, concepts, states, papersTotal, subjectTotal, lessonCount] = await Promise.all([
    db.topic.findMany({ select: { id: true, subjectId: true, system: true } }),
    db.concept.findMany({ select: { id: true, topicId: true } }),
    db.knowledgeState.findMany({
      where: { profileId: profile.id },
      select: { score: true, concept: { select: { topicId: true } } },
    }),
    db.researchPaper.count(),
    db.subject.count(),
    db.concept.count({ where: { lesson: { not: Prisma.DbNull } } }),
  ])

  const topicById = new Map(topics.map((t) => [t.id, t]))
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
  for (const s of states) {
    const t = topicById.get(s.concept.topicId)
    if (!t) continue
    const cur = masteryAgg.get(t.subjectId) ?? { sum: 0, n: 0 }
    cur.sum += s.score
    cur.n += 1
    masteryAgg.set(t.subjectId, cur)
  }

  return {
    phases: PHASES,
    subjects: allSubjects().map((subject) => {
      const agg = masteryAgg.get(subject.id)
      return {
        ...subject,
        phase: phaseOfSubject(subject.id) ?? subject.phase,
        topicCount: topicsBySubject.get(subject.id) ?? 0,
        conceptCount: conceptsBySubject.get(subject.id) ?? 0,
        mastery: agg && agg.n ? Math.round(agg.sum / agg.n) : 0,
      }
    }),
    systems: SYSTEMS.map(({ system, label }) => {
      const contributing = allSubjects().filter((sub) => sub.systems.includes(system))
      return {
        system,
        label,
        subjectCount: contributing.length,
        topicCount: systemTopicCount.get(system) ?? 0,
        conceptCount: systemConceptCount.get(system) ?? 0,
        subjects: contributing.map((sub) => sub.id),
      }
    }),
    registry: allCurriculumRecords(),
    totals: {
      subjects: subjectTotal,
      topics: topics.length,
      concepts: concepts.length,
      lessons: lessonCount,
      diagrams3d: ATLAS_3D.length,
      papers: papersTotal,
      aiConcepts: AI_CONCEPT_IDS.length,
    },
  }
}
