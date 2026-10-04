import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// CLINICAL LOGBOOK — de-identified educational case records (no real patient data).
export async function GET() {
  const profile = await getDemoProfile()
  const entries = await db.logbookEntry.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json({
    entries: entries.map(e => ({
      id: e.id, caseType: e.caseType, system: e.system,
      diagnosis: e.diagnosis, learned: e.learned, createdAt: e.createdAt.toISOString(),
    })),
  })
}

export async function POST(req: NextRequest) {
  const profile = await getDemoProfile()
  const body = await req.json() as { caseType: string; system: string; diagnosis: string; learned: string }
  if (!body.diagnosis?.trim()) {
    return NextResponse.json({ error: 'Diagnosis / finding is required' }, { status: 400 })
  }
  const entry = await db.logbookEntry.create({
    data: {
      profileId: profile.id,
      caseType: body.caseType || 'Ward case',
      system: body.system || 'general',
      diagnosis: body.diagnosis.trim().slice(0, 200),
      learned: (body.learned ?? '').trim().slice(0, 1000),
    },
  })
  await db.studySession.create({
    data: { profileId: profile.id, minutes: 5, kind: 'study', label: `Logbook: ${entry.diagnosis.slice(0, 40)}` },
  })
  return NextResponse.json({
    entry: {
      id: entry.id, caseType: entry.caseType, system: entry.system,
      diagnosis: entry.diagnosis, learned: entry.learned, createdAt: entry.createdAt.toISOString(),
    },
  })
}

export async function DELETE(req: NextRequest) {
  const profile = await getDemoProfile()
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await db.logbookEntry.deleteMany({ where: { id, profileId: profile.id } })
  return NextResponse.json({ ok: true })
}
