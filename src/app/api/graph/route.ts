import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { DAY, estimatedRecall } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import type { GraphPayload } from '@/lib/types'

export const dynamic = 'force-dynamic'

// scope: "all" | "system:<name>" | "subject:<code>" | "topic:<id>" | "concept:<id>" (neighborhood)
export async function GET(req: NextRequest) {
  const profile = await getDemoProfile()
  const scope = req.nextUrl.searchParams.get('scope') ?? 'all'
  const states = await db.knowledgeState.findMany({ where: { profileId: profile.id } })
  const stateMap = new Map(states.map(s => [s.conceptId, s]))
  const now = new Date()

  const recallOf = (conceptId: string): { mastery: number; status: 'new' | 'weak' | 'unstable' | 'strong'; estRecall: number } => {
    const s = stateMap.get(conceptId)
    if (!s) return { mastery: 0, status: 'new', estRecall: 0 }
    const days = s.lastReviewed ? (now.getTime() - s.lastReviewed.getTime()) / DAY : 999
    const estRecall = estimatedRecall(days, s.stability)
    const mastery = s.score
    const status: 'new' | 'weak' | 'unstable' | 'strong' = mastery <= 0 ? 'new' : mastery < 45 ? 'weak' : estRecall < 0.55 ? 'unstable' : 'strong'
    return { mastery: Math.round(mastery), status, estRecall }
  }

  let conceptFilter: Prisma.ConceptWhereInput = {}
  if (scope.startsWith('system:')) {
    conceptFilter = { topic: { is: { system: scope.slice(7) } } }
  } else if (scope.startsWith('subject:')) {
    conceptFilter = { topic: { is: { subjectId: scope.slice(8) } } }
  } else if (scope.startsWith('topic:')) {
    conceptFilter = { topicId: { equals: scope.slice(6) } }
  }

  const concepts = await db.concept.findMany({
    where: Object.keys(conceptFilter).length ? conceptFilter : undefined,
    include: { topic: { include: { subject: true } } },
    take: 90,
  })
  const idSet = new Set(concepts.map(c => c.id))
  void conceptFilter

  // For concept scope, include 1-hop neighbors
  if (scope.startsWith('concept:')) {
    const center = scope.slice(8)
    const centerConcept = await db.concept.findUnique({ where: { id: center }, include: { topic: { include: { subject: true } } } })
    if (centerConcept) concepts.push(centerConcept as never)
    idSet.add(center)
    const links = await db.conceptEdge.findMany({
      where: { OR: [{ fromId: center }, { toId: center }] },
      take: 30,
    })
    const neighborIds = links.flatMap(l => [l.fromId, l.toId]).filter(i => !idSet.has(i))
    const neighbors = await db.concept.findMany({ where: { id: { in: neighborIds.slice(0, 18) } }, include: { topic: { include: { subject: true } } } })
    for (const n of neighbors) { concepts.push(n as never); idSet.add(n.id) }
  }

  const edges = await db.conceptEdge.findMany({
    where: { AND: [{ fromId: { in: [...idSet] } }, { toId: { in: [...idSet] } }] },
    take: 220,
  })

  const payload: GraphPayload = {
    nodes: concepts.map(c => ({
      id: c.id, name: c.name, kind: c.kind, summary: c.summary,
      topicId: c.topicId,
      subjectCode: c.topic.subject.code,
      subjectColor: c.topic.subject.color,
      ...recallOf(c.id),
      examRelevance: c.examRelevance, difficulty: c.difficulty,
    })),
    edges: edges.map(e => ({ from: e.fromId, to: e.toId, type: e.type, label: e.label })),
  }
  return NextResponse.json(payload)
}
