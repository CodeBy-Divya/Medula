import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const profile = await getDemoProfile()
  const c = await db.clinicalCase.findUnique({ where: { id } })
  if (!c) return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  const lastRun = await db.caseRun.findFirst({
    where: { profileId: profile.id, caseId: id }, orderBy: { completedAt: 'desc' },
  })
  const steps = (c.steps as unknown as { id: string; phase: string; title: string; content: string[]; question?: string; options?: string[] }[])
    // strip answers/teaching — revealed via /step
    .map(s => ({ id: s.id, phase: s.phase, title: s.title, content: s.content, question: s.question, options: s.options }))
  return NextResponse.json({
    id: c.id, title: c.title, specialty: c.specialty, system: c.system, difficulty: c.difficulty,
    patient: c.patient, steps, learning: c.learning, diagnosis: '',
    attempted: Boolean(lastRun), lastScore: lastRun?.score ?? null,
  })
}
