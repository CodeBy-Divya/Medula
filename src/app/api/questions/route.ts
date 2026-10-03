import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { QuestionClient } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const subjectCode = sp.get('subjectCode') ?? undefined
  const system = sp.get('system') ?? undefined
  const conceptId = sp.get('conceptId') ?? undefined
  const qtype = sp.get('qtype') ?? undefined
  const count = Math.min(50, Math.max(1, Number(sp.get('count') ?? 10)))

  const where: Record<string, unknown> = {}
  if (subjectCode) where.subjectCode = subjectCode
  if (system) where.system = system
  if (conceptId) where.OR = [{ conceptId }, { concept: { edgesIn: { some: { fromId: conceptId } } } }]
  if (qtype) where.qtype = qtype

  const all = await db.question.findMany({ where, take: 200 })
  // shuffle deterministically-ish then slice
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  const picked = all.slice(0, count)

  const questions: QuestionClient[] = picked.map(q => ({
    id: q.id, stem: q.stem,
    options: (q.options as { id: string; text: string }[]),
    difficulty: q.difficulty, qtype: q.qtype, subjectCode: q.subjectCode, system: q.system,
  }))
  return NextResponse.json({ questions, available: all.length })
}
