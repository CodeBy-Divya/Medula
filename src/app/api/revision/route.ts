import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import type { RevisionPayload } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const profile = await getDemoProfile()
  const now = new Date()

  const reviews = await db.flashcardReview.findMany({
    where: { profileId: profile.id, dueAt: { lte: new Date(now.getTime() + 2 * DAY) } },
    include: { flashcard: true },
    orderBy: { dueAt: 'asc' },
  })
  const dueFlashcards = reviews
    .filter(r => r.dueAt <= now)
    .map(r => ({ id: r.flashcardId, front: r.flashcard.front, back: r.flashcard.back, subjectCode: r.flashcard.subjectCode, conceptId: r.flashcard.conceptId }))

  const items = await db.revisionItem.findMany({
    where: { profileId: profile.id, cleared: false },
    include: { concept: true },
    orderBy: { priority: 'desc' },
  })
  const states = await db.knowledgeState.findMany({ where: { profileId: profile.id } })
  const stateMap = new Map(states.map(s => [s.conceptId, s]))

  const dueConcepts = items.map(i => {
    const s = stateMap.get(i.conceptId)
    const days = s?.lastReviewed ? (now.getTime() - s.lastReviewed.getTime()) / DAY : 999
    return {
      conceptId: i.conceptId, name: i.concept.name, reason: i.reason,
      priority: i.priority, minutes: i.minutes,
      estRecall: s ? Math.round(estimatedRecall(days, s.stability) * 100) : 0,
    }
  })

  // status counts
  let nowC = 0, soon = 0, stable = 0, mastered = 0
  for (const s of states) {
    const days = s.lastReviewed ? (now.getTime() - s.lastReviewed.getTime()) / DAY : 999
    const r = estimatedRecall(days, s.stability)
    if (r < 0.6) nowC++
    else if (r < 0.8) soon++
    else if (s.score < 75) stable++
    else mastered++
  }

  const payload: RevisionPayload = {
    dueFlashcards,
    dueConcepts,
    debt: { count: items.length, minutes: items.reduce((a, i) => a + i.minutes, 0) },
    counts: { now: nowC, soon, stable, mastered },
  }
  return NextResponse.json(payload)
}
