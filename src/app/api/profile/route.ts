import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { toProfile, getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

const nOr = (v: unknown, fallback: number, min: number, max: number): number => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n * 100) / 100)) : fallback
}
const strOr = (v: unknown, fallback: string, max = 120): string =>
  typeof v === 'string' ? v.slice(0, max) : fallback
const arrOr = (v: unknown, fallback: string[]): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 12) : fallback

export async function GET() {
  const p = await getDemoProfile()
  return NextResponse.json({ profile: toProfile(p) })
}

export async function POST(req: NextRequest) {
  // Hardened: bad JSON → 400 (was unhandled 500); numbers NaN-safe (year "abc" no
  // longer reaches Prisma); arrays validated; exam-mode fields now actually persist
  // (the client sent examMode/examLabel/examDate but the route silently dropped them).
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const existing = await getDemoProfile()

  const examDateRaw = (body as Record<string, unknown>).examDate
  let examDate: Date | null = existing.examDate
  if (examDateRaw === null) examDate = null
  else if (typeof examDateRaw === 'string' && examDateRaw.trim()) {
    const d = new Date(examDateRaw)
    if (!Number.isNaN(d.getTime())) examDate = d
  }

  const updated = await db.studentProfile.update({
    where: { id: existing.id },
    data: {
      name: strOr(body.name, existing.name, 80),
      year: nOr(body.year ?? existing.year, existing.year, 1, 6),
      semester: nOr(body.semester ?? existing.semester, existing.semester, 1, 12),
      collegeName: strOr(body.collegeName, existing.collegeName, 120),
      collegeType: strOr(body.collegeType, existing.collegeType, 40),
      gradYear: nOr(body.gradYear ?? existing.gradYear, existing.gradYear, 2000, 2100),
      internshipDone: Boolean(body.internshipDone ?? existing.internshipDone),
      pastScore: strOr(body.pastScore, existing.pastScore, 40),
      prepStage: strOr(body.prepStage, existing.prepStage, 40),
      dailyHours: nOr(body.dailyHours ?? existing.dailyHours, existing.dailyHours, 0, 18),
      weekdayHours: nOr(body.weekdayHours ?? existing.weekdayHours, existing.weekdayHours, 0, 18),
      weekendHours: nOr(body.weekendHours ?? existing.weekendHours, existing.weekendHours, 0, 18),
      learningStyles: arrOr(body.learningStyles, existing.learningStyles as string[]),
      resources: arrOr(body.resources, existing.resources as string[]),
      examMode: Boolean((body as Record<string, unknown>).examMode ?? existing.examMode),
      examLabel: strOr((body as Record<string, unknown>).examLabel, existing.examLabel, 80),
      examDate,
      onboarded: body.onboarded !== undefined ? Boolean(body.onboarded) : existing.onboarded,
    },
  })
  return NextResponse.json({ profile: toProfile(updated) })
}
