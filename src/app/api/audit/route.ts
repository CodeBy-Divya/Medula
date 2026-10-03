import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// KNOWLEDGE AUDIT — builds a diagnostic sample across the curriculum.
// Up to 2 questions per subject that has questions (easy + hard spread), capped at 24.
export async function POST() {
  const subjects = await db.subject.findMany({ orderBy: { neetWeight: 'desc' } })
  const questionsBySubject = await db.question.groupBy({ by: ['subjectCode'], _count: { id: true } })
  const subjectWithQ = new Set(questionsBySubject.map(g => g.subjectCode))

  const picked: Awaited<ReturnType<typeof db.question.findMany>> = []
  const coveredSubjects: { code: string; name: string; color: string }[] = []

  for (const s of subjects) {
    if (!subjectWithQ.has(s.code)) continue
    const pool = await db.question.findMany({ where: { subjectCode: s.code }, take: 8 })
    if (pool.length === 0) continue
    const sorted = pool.slice().sort((a, b) => a.difficulty - b.difficulty)
    const easy = sorted[0]
    const hard = sorted[sorted.length - 1]
    const chosen = hard.id !== easy.id ? [easy, hard] : [easy]
    for (const q of chosen) picked.push(q)
    coveredSubjects.push({ code: s.code, name: s.name, color: s.color })
    if (picked.length >= 24) break
  }

  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[picked[i], picked[j]] = [picked[j], picked[i]]
  }

  const payload = {
    questions: picked.map(q => ({
      id: q.id, stem: q.stem,
      options: q.options as { id: string; text: string }[],
      difficulty: q.difficulty, qtype: q.qtype, subjectCode: q.subjectCode, system: q.system,
    })),
    subjects: coveredSubjects,
  }
  return NextResponse.json(payload)
}
