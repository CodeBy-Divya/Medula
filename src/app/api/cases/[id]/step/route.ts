import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const { stepId, choice } = await req.json() as { stepId: string; choice: number }
  const c = await db.clinicalCase.findUnique({ where: { id } })
  if (!c) return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  const steps = c.steps as unknown as { id: string; answerId?: number; teaching?: string; question?: string }[]
  const step = steps.find(s => s.id === stepId)
  if (!step || step.answerId === undefined) {
    return NextResponse.json({ correct: true, answerId: -1, teaching: '' })
  }
  return NextResponse.json({
    correct: choice === step.answerId,
    answerId: step.answerId,
    teaching: step.teaching ?? '',
  })
}
