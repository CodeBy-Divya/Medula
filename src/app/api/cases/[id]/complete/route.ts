import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const body = await req.json() as { correctSteps: number; totalSteps: number; detail: unknown[] }
  const profile = await getDemoProfile()
  const score = body.totalSteps ? Math.round((body.correctSteps / body.totalSteps) * 100) : 0
  await db.caseRun.create({
    data: {
      profileId: profile.id, caseId: id,
      score, correctSteps: body.correctSteps, totalSteps: body.totalSteps,
      detail: body.detail as object,
    },
  })
  await db.studySession.create({
    data: { profileId: profile.id, minutes: 12, kind: 'case', label: 'Clinical case completed' },
  })
  return NextResponse.json({ score })
}
