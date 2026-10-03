import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { questionId, errorType } = await req.json() as { questionId: string; errorType: string }
  const profile = await getDemoProfile()
  const question = await db.question.findUnique({ where: { id: questionId } })
  const conceptId = question?.conceptId ?? null

  const existing = await db.errorPattern.findFirst({
    where: { profileId: profile.id, errorType, conceptId },
  })
  if (existing) {
    await db.errorPattern.update({ where: { id: existing.id }, data: { count: { increment: 1 }, lastAt: new Date() } })
  } else {
    await db.errorPattern.create({ data: { profileId: profile.id, errorType, conceptId } })
  }

  // confusion detection: 2+ "confused" errors on one concept → surface a revision item
  if (errorType === 'confused' && conceptId) {
    const confusedCount = await db.errorPattern.count({ where: { profileId: profile.id, errorType: 'confused', conceptId } })
    if (confusedCount >= 2) {
      const already = await db.revisionItem.findFirst({ where: { profileId: profile.id, conceptId, cleared: false } })
      if (!already) {
        await db.revisionItem.create({
          data: {
            profileId: profile.id, conceptId,
            reason: 'Repeated confusion detected — compare with its classic differential',
            priority: 3, minutes: 15,
          },
        })
      }
    }
  }
  return NextResponse.json({ ok: true })
}
