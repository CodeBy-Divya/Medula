import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall, updateKnowledge, statusFor } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// Closing the loop on Socratic pair drills: when a student ends a drill that
// went at least MIN_PROBES rounds, the knowledge engine logs it as a review
// event on both concepts of the confusion pair (recall refreshed, stability up)
// and records a study session so streaks/heatmaps reflect the work.
const MIN_PROBES = 4

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { pairId, probes = 0 } = body as { pairId?: string; probes?: number }
  if (!pairId) {
    return NextResponse.json({ error: 'pairId is required' }, { status: 400 })
  }
  const pair = await db.confusionPair.findUnique({ where: { id: pairId } })
  if (!pair) {
    return NextResponse.json({ error: 'Unknown confusion pair' }, { status: 404 })
  }

  const safeProbes = Math.max(0, Math.min(40, Math.floor(Number(probes) || 0)))
  if (safeProbes < MIN_PROBES) {
    return NextResponse.json({
      ok: false,
      reason: `A drill only counts after ${MIN_PROBES} probes — this one had ${safeProbes}.`,
      updated: [],
    })
  }

  const profile = await getDemoProfile()
  const now = new Date()
  const updated: { conceptId: string; mastery: number; status: string }[] = []

  // The drill is a genuine review of both sides of the distinction: refresh
  // recall + nudge mastery upward (a moderate "correct" event, difficulty 3).
  for (const conceptId of [pair.aCode, pair.bCode].filter(Boolean)) {
    const existing = await db.knowledgeState.findUnique({
      where: { profileId_conceptId: { profileId: profile.id, conceptId } },
    })
    if (!existing) {
      const init = updateKnowledge(0, 1, true, 3)
      const rec = await db.knowledgeState.create({
        data: {
          profileId: profile.id, conceptId,
          score: init.score, stability: init.stability, estRecall: 1,
          attemptCount: 1, correctCount: 1,
          lastReviewed: now, lastCorrect: now,
          status: statusFor(init.score, 1),
        },
      })
      updated.push({ conceptId, mastery: Math.round(rec.score), status: rec.status })
    } else {
      const days = existing.lastReviewed ? (now.getTime() - existing.lastReviewed.getTime()) / DAY : 999
      const recall = estimatedRecall(days, existing.stability)
      const blended = existing.score * recall + (1 - recall) * existing.score * 0.4
      const upd = updateKnowledge(blended, existing.stability, true, 3)
      const rec = await db.knowledgeState.update({
        where: { id: existing.id },
        data: {
          score: upd.score, stability: upd.stability, estRecall: recall,
          lastReviewed: now, lastCorrect: now,
          status: statusFor(upd.score, recall),
        },
      })
      updated.push({ conceptId, mastery: Math.round(rec.score), status: rec.status })
    }
  }

  // Estimate the time spent: roughly 2 minutes per probe, capped for sanity.
  const minutes = Math.max(2, Math.min(30, safeProbes * 2))
  await db.studySession.create({
    data: {
      profileId: profile.id,
      minutes,
      kind: 'drill',
      label: `Socratic drill: ${pair.a} vs ${pair.b}`,
    },
  })

  return NextResponse.json({
    ok: true,
    updated,
    minutes,
    label: `${pair.a} vs ${pair.b}`,
  })
}
