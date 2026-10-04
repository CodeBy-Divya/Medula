import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function GET() {
  const profile = await getDemoProfile()
  const [cases, runs] = await Promise.all([
    db.clinicalCase.findMany(),
    db.caseRun.findMany({ where: { profileId: profile.id }, orderBy: { completedAt: 'desc' } }),
  ])
  const runByCase = new Map(runs.map(r => [r.caseId, r]))
  return NextResponse.json({
    cases: cases.map(c => {
      const run = runByCase.get(c.id)
      const patient = c.patient as { age: string; sex: string; occupation: string; complaint: string }
      return {
        id: c.id, title: c.title, specialty: c.specialty, system: c.system, difficulty: c.difficulty,
        patient, attempted: Boolean(run), lastScore: run ? run.score : null,
      }
    }),
  })
}
