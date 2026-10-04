import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { srsUpdate } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { flashcardId, grade } = await req.json() as { flashcardId: string; grade: number }
  const profile = await getDemoProfile()
  const existing = await db.flashcardReview.findUnique({
    where: { flashcardId_profileId: { flashcardId, profileId: profile.id } },
  })
  const prev = existing
    ? { intervalDays: existing.intervalDays, reps: existing.reps, lapses: existing.lapses }
    : { intervalDays: 0, reps: 0, lapses: 0 }
  const upd = srsUpdate(prev, Math.max(0, Math.min(3, grade)))
  const dueAt = new Date(Date.now() + upd.intervalDays * 24 * 3600 * 1000)
  if (existing) {
    await db.flashcardReview.update({
      where: { id: existing.id },
      data: { dueAt, intervalDays: upd.intervalDays, reps: upd.reps, lapses: upd.lapses, lastGrade: grade, reviewedAt: new Date() },
    })
  } else {
    await db.flashcardReview.create({
      data: { flashcardId, profileId: profile.id, dueAt, intervalDays: upd.intervalDays, reps: upd.reps, lapses: upd.lapses, lastGrade: grade, reviewedAt: new Date() },
    })
  }
  return NextResponse.json({ ok: true, nextDueDays: Math.round(upd.intervalDays * 10) / 10 })
}
