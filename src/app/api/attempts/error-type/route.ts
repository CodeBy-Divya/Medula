import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import { asTrimmed, readJson } from '@/lib/http'

export const dynamic = 'force-dynamic'

// Allowed self-reported error types (mirrors QuestionAttempt.errorType in the schema)
const ERROR_TYPES = ['didnt_know', 'forgot', 'misread', 'confused', 'calculation', 'reasoning', 'changed', 'time', 'guess'] as const

export async function POST(req: NextRequest) {
  const body = await readJson<{ questionId?: unknown; errorType?: unknown }>(req)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const errorType = asTrimmed(body.errorType, 40)
  if (!errorType || !(ERROR_TYPES as readonly string[]).includes(errorType)) {
    return NextResponse.json(
      { error: `errorType must be one of: ${ERROR_TYPES.join(', ')}` },
      { status: 400 },
    )
  }

  // questionId is optional; when provided it must reference a real question
  const questionId = asTrimmed(body.questionId, 200)
  let conceptId: string | null = null
  if (questionId) {
    const question = await db.question.findUnique({ where: { id: questionId } })
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    conceptId = question.conceptId ?? null
  }

  const profile = await getDemoProfile()

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
