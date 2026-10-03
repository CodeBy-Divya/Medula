import { NextResponse } from 'next/server'
import type { RoadmapPayload, WeekDayPlan, WeekBlock } from '@/lib/types'
import { buildRoadmap, examClock } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// ─── WEEKLY PLANNER (spec §42/§43) ───
// Builds a concrete 7-day template from the profile's declared study hours.
// Early years stay college-synced (lectures first); exam mode / dedicated
// years flip to question-and-mock-heavy weeks with one protected rest evening.

function dayBlocks(hours: number, isWeekend: boolean, year: number, examMode: boolean, dayIndex: number): WeekBlock[] {
  const total = Math.max(30, Math.round(hours * 60))
  const blocks: WeekBlock[] = []
  const collegeFirst = year <= 3 && !examMode

  if (collegeFirst && !isWeekend) {
    // College-synced weekday (§43): lectures anchor the day
    const lecture = Math.min(total * 0.45, 240)
    blocks.push({ label: 'College lectures & practicals', minutes: Math.round(lecture), kind: 'college' })
    const remaining = total - lecture
    blocks.push({ label: 'Same-day notes (never let slides pile up)', minutes: Math.round(remaining * 0.3), kind: 'revision' })
    blocks.push({ label: 'Question practice — today’s topics', minutes: Math.round(remaining * 0.45), kind: 'questions' })
    blocks.push({ label: 'Flashcards — Anki-style recall', minutes: Math.round(remaining * 0.25), kind: 'flashcards' })
    return blocks
  }

  // Dedicated / exam-mode / weekend rhythm
  blocks.push({ label: 'Question practice — mixed subjects', minutes: Math.round(total * 0.4), kind: 'questions' })
  blocks.push({ label: 'Revision cycle — spaced repetition due', minutes: Math.round(total * 0.3), kind: 'revision' })
  if (dayIndex === 6) {
    // Sunday: the mock day
    blocks.push({ label: 'Grand mock test + deep review', minutes: Math.round(total * 0.45), kind: 'mocks' })
    blocks.push({ label: 'Weakness repair — last week’s misses', minutes: Math.round(total * 0.25), kind: 'weakness' })
  } else if (dayIndex === 5) {
    // Saturday evening: protected rest (burnout is a real syllabus risk)
    blocks.push({ label: 'Flashcards only — light recall', minutes: Math.round(total * 0.3), kind: 'flashcards' })
    blocks.push({ label: 'Protected rest — walk, music, family 🌿', minutes: Math.round(total * 0.4), kind: 'rest' })
  } else {
    blocks.push({ label: 'Weakness repair — lowest-mastery topics', minutes: Math.round(total * 0.3), kind: 'weakness' })
  }
  return blocks
}

const DAYS = [
  { day: 'Monday', short: 'Mon' }, { day: 'Tuesday', short: 'Tue' }, { day: 'Wednesday', short: 'Wed' },
  { day: 'Thursday', short: 'Thu' }, { day: 'Friday', short: 'Fri' }, { day: 'Saturday', short: 'Sat' },
  { day: 'Sunday', short: 'Sun' },
]

export async function GET() {
  const profile = await getDemoProfile()
  const { horizonYears, phases, stageLabel } = buildRoadmap(profile.year, profile.prepStage, profile.dailyHours)
  const clock = examClock(profile.year, profile.gradYear, profile.dailyHours, profile.examDate ? new Date(profile.examDate) : null)

  const weeklySplit = profile.year <= 2
    ? [
        { label: 'College subjects', pct: 45 },
        { label: 'NEET-PG integration', pct: 25 },
        { label: 'Question practice', pct: 20 },
        { label: 'Revision & recall', pct: 10 },
      ]
    : profile.year === 3
      ? [
          { label: 'Clinical learning', pct: 35 },
          { label: 'Questions & cases', pct: 30 },
          { label: 'Para-clinical revision', pct: 20 },
          { label: 'Flashcards & recall', pct: 15 },
        ]
      : [
          { label: 'Question practice', pct: 40 },
          { label: 'Revision cycles', pct: 30 },
          { label: 'Mocks & analysis', pct: 20 },
          { label: 'Weakness repair', pct: 10 },
        ]

  // 7-day planner — weekday vs weekend hours straight from the profile
  const weekPlan: WeekDayPlan[] = DAYS.map((d, i) => {
    const isWeekend = i >= 5
    const hours = isWeekend ? profile.weekendHours : profile.weekdayHours
    return {
      day: d.day, short: d.short, hours,
      isWeekend,
      blocks: dayBlocks(hours, isWeekend, profile.year, profile.examMode, i),
    }
  })

  const payload: RoadmapPayload = {
    horizonYears, phases, stageLabel, currentStageLabel: stageLabel, neetClock: { ...clock, stage: clock.stage },
    weeklySplit, weekPlan, isEstimate: clock.isEstimate,
  }
  return NextResponse.json(payload)
}
