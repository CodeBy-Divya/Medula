import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import { asInt, readJson } from '@/lib/http'

export const dynamic = 'force-dynamic'

// Sanity cap on per-case steps (seeded cases are far below this).
const MAX_STEPS = 60

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const body = await readJson<{ correctSteps?: unknown; totalSteps?: unknown; detail?: unknown }>(req)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  // The case must exist — a bogus id is a 404, not a Prisma FK 500.
  const clinicalCase = await db.clinicalCase.findUnique({ where: { id } })
  if (!clinicalCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 })

  const correctSteps = asInt(body.correctSteps, 0, MAX_STEPS, 0)
  const totalSteps = asInt(body.totalSteps, 0, MAX_STEPS, 0)
  const profile = await getDemoProfile()
  const score = totalSteps ? Math.round((correctSteps / totalSteps) * 100) : 0
  await db.caseRun.create({
    data: {
      profileId: profile.id, caseId: id,
      score, correctSteps, totalSteps,
      detail: body.detail as object,
    },
  })
  await db.studySession.create({
    data: { profileId: profile.id, minutes: 12, kind: 'case', label: 'Clinical case completed' },
  })
  return NextResponse.json({ score })
}
