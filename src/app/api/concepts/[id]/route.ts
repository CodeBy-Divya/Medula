import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import type { ConceptDetail, Section } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const profile = await getDemoProfile()
  const concept = await db.concept.findUnique({
    where: { id },
    include: {
      topic: { include: { subject: true } },
      edgesOut: true, edgesIn: true,
      flashcards: true,
      questions: { select: { id: true } },
    },
  })
  if (!concept) return NextResponse.json({ error: 'Concept not found' }, { status: 404 })

  const states = await db.knowledgeState.findMany({ where: { profileId: profile.id } })
  const stateMap = new Map(states.map(s => [s.conceptId, s]))
  const now = new Date()

  const stateOf = (conceptId: string) => {
    const s = stateMap.get(conceptId)
    if (!s) return { mastery: 0, status: 'new', estRecall: 0 }
    const days = s.lastReviewed ? (now.getTime() - s.lastReviewed.getTime()) / DAY : 999
    const estRecall = estimatedRecall(days, s.stability)
    return {
      mastery: Math.round(s.score), estRecall,
      status: s.score <= 0 ? 'new' : s.score < 45 ? 'weak' : estRecall < 0.55 ? 'unstable' : 'strong',
    }
  }

  const relatedOut = async (ids: string[]) => {
    const cs = await db.concept.findMany({ where: { id: { in: ids } }, include: { topic: { include: { subject: true } } } })
    return cs.map(c => {
      const st = stateOf(c.id)
      const link = concept.edgesOut.find(e => e.toId === c.id)
      return { to: c.id, toName: c.name, type: link?.type ?? 'related_to', label: link?.label ?? '', kind: c.kind, ...st }
    })
  }
  const relatedIn = async (ids: string[]) => {
    const cs = await db.concept.findMany({ where: { id: { in: ids } }, include: { topic: { include: { subject: true } } } })
    return cs.map(c => {
      const st = stateOf(c.id)
      const link = concept.edgesIn.find(e => e.fromId === c.id)
      return { from: c.id, fromName: c.name, type: link?.type ?? 'related_to', label: link?.label ?? '', kind: c.kind, ...st }
    })
  }

  const [out, inn] = await Promise.all([
    relatedOut(concept.edgesOut.map(e => e.toId)),
    relatedIn(concept.edgesIn.map(e => e.fromId)),
  ])

  // WHY CHAIN: foundation → clinical → pharmacology → exam — assembled from edges
  const whyChain: ConceptDetail['whyChain'] = []
  const foundation = inn.find(e => ['prerequisite_of', 'related_to', 'mechanism_of'].includes(e.type))
  const clinical = out.find(e => ['causes', 'diagnosed_by', 'clinical_application_of'].includes(e.type))
  const drug = out.find(e => e.kind === 'drug')
  const examOut = out.find(e => ['treated_by', 'commonly_tested_with'].includes(e.type))
  if (foundation) whyChain.push({ stage: 'Foundation', label: `${concept.name} rests on ${foundation.fromName}`, conceptId: foundation.from })
  whyChain.push({ stage: 'Core', label: concept.summary, conceptId: concept.id })
  if (clinical) whyChain.push({ stage: 'Clinical connection', label: `Leads to ${clinical.toName}`, conceptId: clinical.to })
  if (drug) whyChain.push({ stage: 'Pharmacology', label: `Managed with ${drug.toName}`, conceptId: drug.to })
  if (examOut) whyChain.push({ stage: 'NEET-PG', label: `Tested via ${examOut.toName} question patterns`, conceptId: examOut.to })
  if (whyChain.length < 3) whyChain.push({ stage: 'NEET-PG', label: `High-yield for NEET-PG — exam relevance ${concept.examRelevance}/5` })

  const s = stateOf(concept.id)
  const knowledge = stateMap.get(concept.id)
  const detail = (concept.detail as unknown as Section[]) ?? null

  const payload: ConceptDetail = {
    id: concept.id, name: concept.name, kind: concept.kind, summary: concept.summary,
    whyMatters: concept.whyMatters, mnemonic: concept.mnemonic,
    difficulty: concept.difficulty, examRelevance: concept.examRelevance, clinicalRelevance: concept.clinicalRelevance,
    detail,
    topic: { id: concept.topic.id, name: concept.topic.name, subject: { code: concept.topic.subject.code, name: concept.topic.subject.name, color: concept.topic.subject.color, year: concept.topic.subject.year } },
    knowledge: knowledge ? {
      score: Math.round(knowledge.score), status: s.status, estRecall: Math.round(s.estRecall * 100) / 100,
      attemptCount: knowledge.attemptCount, correctCount: knowledge.correctCount,
      lastReviewed: knowledge.lastReviewed?.toISOString() ?? null, stability: knowledge.stability,
    } : null,
    edgesOut: out, edgesIn: inn,
    whyChain,
    flashcards: concept.flashcards.map(f => ({ id: f.id, front: f.front, back: f.back })),
    questionCount: concept.questions.length,
  }
  return NextResponse.json(payload)
}
