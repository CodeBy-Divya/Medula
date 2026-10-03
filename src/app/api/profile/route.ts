import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { toProfile, getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

export async function GET() {
  const p = await getDemoProfile()
  return NextResponse.json({ profile: toProfile(p) })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const existing = await getDemoProfile()
  const updated = await db.studentProfile.update({
    where: { id: existing.id },
    data: {
      name: body.name ?? existing.name,
      year: Number(body.year ?? existing.year),
      semester: Number(body.semester ?? existing.semester),
      collegeName: body.collegeName ?? existing.collegeName,
      collegeType: body.collegeType ?? existing.collegeType,
      gradYear: Number(body.gradYear ?? existing.gradYear),
      internshipDone: Boolean(body.internshipDone ?? existing.internshipDone),
      pastScore: body.pastScore ?? existing.pastScore,
      prepStage: body.prepStage ?? existing.prepStage,
      dailyHours: Number(body.dailyHours ?? existing.dailyHours),
      weekdayHours: Number(body.weekdayHours ?? existing.weekdayHours),
      weekendHours: Number(body.weekendHours ?? existing.weekendHours),
      learningStyles: (body.learningStyles ?? existing.learningStyles) as string[],
      resources: (body.resources ?? existing.resources) as string[],
      onboarded: body.onboarded !== undefined ? Boolean(body.onboarded) : existing.onboarded,
    },
  })
  return NextResponse.json({ profile: toProfile(updated) })
}
