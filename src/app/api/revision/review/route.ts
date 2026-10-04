import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { srsUpdate } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import { asInt, asTrimmed, readJson } from '@/lib/http'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await readJson<{ flashcardId?: unknown; grade?: unknown }>(req)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const flashcardId = asTrimmed(body.flashcardId, 200)
  if (!flashcardId) return NextResponse.json({ error: 'flashcardId is required' }, { status: 400 })
  const grade = asInt(body.grade, 0, 3, 2)

  const profile = await getDemoProfile()
  const existing = await db.flashcardReview.findUnique({
    where: { flashcardId_profileId: { flashcardId, profileId: profile.id } },
  })
  // Validate before write: the card must already have a review row for this
  // profile OR exist as a Flashcard — a bogus id is a 404, not a Prisma FK 500.
  if (!existing && !(await db.flashcard.findUnique({ where: { id: flashcardId } }))) {
    return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 })
  }
  const prev = existing
    ? { intervalDays: existing.intervalDays, reps: existing.reps, lapses: existing.lapses }
    : { intervalDays: 0, reps: 0, lapses: 0 }
  const upd = srsUpdate(prev, grade)
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
