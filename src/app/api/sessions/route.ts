import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import { asInt, asTrimmed, readJson } from '@/lib/http'

export const dynamic = 'force-dynamic'

// Allowed study-session kinds (mirrors StudySession.kind in the schema)
const KINDS = ['study', 'questions', 'revision', 'case', 'recall'] as const

export async function POST(req: NextRequest) {
  const body = await readJson<{ minutes?: unknown; kind?: unknown; label?: unknown }>(req)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const kind = asTrimmed(body.kind, 40) ?? 'study'
  if (!(KINDS as readonly string[]).includes(kind)) {
    return NextResponse.json({ error: `kind must be one of: ${KINDS.join(', ')}` }, { status: 400 })
  }

  const profile = await getDemoProfile()
  await db.studySession.create({
    data: {
      profileId: profile.id,
      minutes: asInt(body.minutes, 1, 600, 10),
      kind,
      label: asTrimmed(body.label, 200) ?? '',
    },
  })
  return NextResponse.json({ ok: true })
}
