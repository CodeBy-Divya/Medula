import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import type { SubjectSummary } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const profile = await getDemoProfile()
  const [subjects, topics, states, concepts] = await Promise.all([
    db.subject.findMany({ orderBy: { year: 'asc' } }),
    db.topic.findMany(),
    db.knowledgeState.findMany({ where: { profileId: profile.id } }),
    db.concept.findMany({ select: { id: true, topicId: true } }),
  ])
  const topicSubject = new Map(topics.map(t => [t.id, t.subjectId]))
  const conceptSubject = new Map(concepts.map(c => [c.id, topicSubject.get(c.topicId)]))
  const statesBySubject = new Map<string, { sum: number; n: number }>()
  for (const s of states) {
    const sub = conceptSubject.get(s.conceptId)
    if (!sub) continue
    const cur = statesBySubject.get(sub) ?? { sum: 0, n: 0 }
    cur.sum += s.score; cur.n += 1
    statesBySubject.set(sub, cur)
  }
  const topicsBySubject = new Map<string, number>()
  const conceptsBySubject = new Map<string, number>()
  for (const t of topics) topicsBySubject.set(t.subjectId, (topicsBySubject.get(t.subjectId) ?? 0) + 1)
  for (const c of concepts) {
    const sub = topicSubject.get(c.topicId)
    if (sub) conceptsBySubject.set(sub, (conceptsBySubject.get(sub) ?? 0) + 1)
  }

  const payload: SubjectSummary[] = subjects.map(s => {
    const agg = statesBySubject.get(s.id)
    const mastery = agg && agg.n ? Math.round(agg.sum / agg.n) : 0
    return {
      id: s.id, code: s.code, name: s.name, year: s.year, color: s.color,
      neetWeight: s.neetWeight, blurb: s.blurb,
      topicCount: topicsBySubject.get(s.id) ?? 0,
      conceptCount: conceptsBySubject.get(s.id) ?? 0,
      mastery,
      status: mastery === 0 ? 'new' : mastery < 45 ? 'weak' : mastery < 70 ? 'unstable' : 'strong',
    }
  })
  return NextResponse.json({ subjects: payload })
}
