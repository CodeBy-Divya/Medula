import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall, updateKnowledge, statusFor } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import { asInt, asTrimmed, readJson } from '@/lib/http'

export const dynamic = 'force-dynamic'

// Clear a revision item after completing its revision block
export async function POST(req: NextRequest) {
  const body = await readJson<{ conceptId?: unknown; minutes?: unknown }>(req)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const conceptId = asTrimmed(body.conceptId, 200)
  if (!conceptId) return NextResponse.json({ error: 'conceptId is required' }, { status: 400 })
  const minutes = asInt(body.minutes, 1, 240, 15)

  const profile = await getDemoProfile()

  // updateMany is scoped to this profile, so a foreign conceptId simply no-ops
  // (ownership enforced by the profileId filter, not by the id alone).
  await db.revisionItem.updateMany({
    where: { profileId: profile.id, conceptId, cleared: false },
    data: { cleared: true, clearedAt: new Date() },
  })

  // Revision strengthens the memory trace
  const state = await db.knowledgeState.findUnique({
    where: { profileId_conceptId: { profileId: profile.id, conceptId } },
  })
  if (state) {
    const now = new Date()
    const days = state.lastReviewed ? (now.getTime() - state.lastReviewed.getTime()) / DAY : 999
    const recall = estimatedRecall(days, state.stability)
    const blended = state.score * recall + state.score * (1 - recall) * 0.5
    const upd = updateKnowledge(blended, state.stability, true, 2)
    await db.knowledgeState.update({
      where: { id: state.id },
      data: {
        score: Math.min(100, upd.score + 4), stability: Math.min(180, upd.stability * 1.15),
        estRecall: Math.min(1, recall + 0.3), lastReviewed: now, lastCorrect: now,
        status: statusFor(upd.score, Math.min(1, recall + 0.3)),
      },
    })
  }
  await db.studySession.create({
    data: { profileId: profile.id, minutes, kind: 'revision', label: 'Revision debt cleared' },
  })
  return NextResponse.json({ ok: true })
}
