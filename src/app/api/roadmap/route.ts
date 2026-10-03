import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { RoadmapPayload } from '@/lib/types'
import { buildRoadmap, examClock } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

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

  const payload: RoadmapPayload = {
    horizonYears, phases, stageLabel, currentStageLabel: stageLabel, neetClock: { ...clock, stage: clock.stage },
    weeklySplit, isEstimate: clock.isEstimate,
  }
  return NextResponse.json(payload)
}
