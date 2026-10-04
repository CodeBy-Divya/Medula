import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import { asTrimmed } from '@/lib/http'

export const dynamic = 'force-dynamic'

// POST /api/understand/complete — wires "Understand Your Topic" into the learning
// engine: marking a topic understood logs a real StudySession so streaks, the
// consistency component of the Readiness Score and the heatmap reflect it.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const title = asTrimmed((body as Record<string, unknown>).title, 90)
    const topicId = asTrimmed((body as Record<string, unknown>).topicId, 120)
    if (!title || !topicId) {
      return NextResponse.json({ error: 'topicId and title are required' }, { status: 400 })
    }
    const profile = await getDemoProfile()
    await db.studySession.create({
      data: {
        profileId: profile.id,
        minutes: 12, // average time to walk a full living-scene walkthrough
        kind: 'study',
        label: `Understand · ${title}`,
      },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/understand/complete]', err)
    return NextResponse.json({ error: 'Failed to log understanding session' }, { status: 500 })
  }
}
