import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import type { TopicSummary } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const profile = await getDemoProfile()
  const subject = await db.subject.findUnique({ where: { id } })
  if (!subject) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const topics = await db.topic.findMany({
    where: { subjectId: id },
    include: { concepts: true },
  })
  const states = await db.knowledgeState.findMany({ where: { profileId: profile.id } })
  const stateMap = new Map(states.map(s => [s.conceptId, s]))

  const topicPayload: TopicSummary[] = topics.map(t => {
    const scores = t.concepts.map(c => stateMap.get(c.id)?.score ?? 0)
    const mastery = t.concepts.length ? Math.round(scores.reduce((a, b) => a + b, 0) / t.concepts.length) : 0
    return {
      id: t.id, subjectId: t.subjectId, name: t.name, system: t.system,
      importance: t.importance, description: t.description,
      conceptCount: t.concepts.length, mastery,
    }
  })

  return NextResponse.json({
    subject: {
      id: subject.id, code: subject.code, name: subject.name, year: subject.year,
      color: subject.color, neetWeight: subject.neetWeight, blurb: subject.blurb,
      topicCount: topics.length, conceptCount: topics.reduce((a, t) => a + t.concepts.length, 0),
      mastery: topicPayload.length ? Math.round(topicPayload.reduce((a, t) => a + t.mastery, 0) / topicPayload.length) : 0,
      status: 'new' as const,
    },
    topics: topicPayload,
  })
}
