import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json() as { minutes?: number; kind?: string; label?: string }
  const profile = await getDemoProfile()
  await db.studySession.create({
    data: {
      profileId: profile.id,
      minutes: Math.max(1, Math.min(600, Number(body.minutes ?? 10))),
      kind: body.kind ?? 'study',
      label: body.label ?? '',
    },
  })
  return NextResponse.json({ ok: true })
}
