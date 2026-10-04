import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall, computeStreak, greetingFor, buildNextAction, examClock, scoreCandidate, istDayKey, type ActionCandidate } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import { YEAR_LABELS, PREP_STAGE_LABELS } from '@/lib/types'
import type { DashboardPayload, NextAction, PlanSegment } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const profile = await getDemoProfile()
  const now = new Date()

  const [states, revisionItems, errorPatterns, sessions, dueFlashcards, conceptTotal] = await Promise.all([
    db.knowledgeState.findMany({ where: { profileId: profile.id }, include: { concept: { include: { topic: { include: { subject: true } } } } } }),
    db.revisionItem.findMany({ where: { profileId: profile.id, cleared: false }, include: { concept: true } }),
    db.errorPattern.findMany({ where: { profileId: profile.id } }),
    db.studySession.findMany({ where: { profileId: profile.id, date: { gte: new Date(now.getTime() - 60 * DAY) } } }),
    db.flashcardReview.count({ where: { profileId: profile.id, dueAt: { lte: now } } }),
    db.concept.count(),
  ])

  // refresh recall estimates
  for (const s of states) {
    const days = s.lastReviewed ? (now.getTime() - s.lastReviewed.getTime()) / DAY : 999
    const r = estimatedRecall(days, s.stability)
    if (Math.abs(r - s.estRecall) > 0.02) {
      s.estRecall = r
    }
  }

  const atRisk = states.filter(s => s.estRecall < 0.6 && s.score > 0)
  const weak = states.filter(s => s.status === 'weak' || s.score < 45)
  const strong = states.filter(s => s.status === 'strong' && s.estRecall >= 0.6)
  const unstable = states.filter(s => s.status === 'unstable' || (s.estRecall < 0.55 && s.score >= 45))

  const brainScore = states.length
    ? Math.round(states.reduce((a, s) => a + s.score * s.estRecall, 0) / states.length)
    : 0

  const revisionMinutes = revisionItems.reduce((a, r) => a + r.minutes, 0)
  const dueQuestions = Math.max(10, Math.round(atRisk.length * 6))

  const last7 = sessions.filter(s => s.date >= new Date(now.getTime() - 7 * DAY))
  const prev7 = sessions.filter(s => s.date < new Date(now.getTime() - 7 * DAY) && s.date >= new Date(now.getTime() - 14 * DAY))
  const today = sessions.filter(s => istDayKey(s.date) === istDayKey(now))
  const recommendedMinutes = Math.round(profile.dailyHours * 60)

  // NEXT BEST ACTION — deterministic scoring over at-risk + weak concepts
  const candidates: ActionCandidate[] = states
    .filter(s => s.score > 0)
    .map(s => {
      const days = s.lastReviewed ? (now.getTime() - s.lastReviewed.getTime()) / DAY : 999
      return {
        conceptId: s.conceptId, conceptName: s.concept.name,
        score: s.score, estRecall: s.estRecall,
        examRelevance: s.concept.examRelevance,
        yearMatch: Math.max(0, 1 - Math.abs(s.concept.topic.subject.year - Math.min(profile.year, 4)) / 4),
        errorCount: errorPatterns.filter(e => e.conceptId === s.conceptId).reduce((a, e) => a + e.count, 0),
        lastReviewedDays: s.lastReviewed ? Math.round(days) : null,
        status: s.status,
      }
    })
  candidates.sort((a, b) => (b.estRecall < 0.6 ? 1 : 0) - (a.estRecall < 0.6 ? 1 : 0))
  let nextAction: NextAction | null = null
  if (candidates.length) {
    // Single source of truth: the engine's transparent NBA weights (deduped — was inlined here)
    const scored = candidates.map(c => ({ c, v: scoreCandidate(c) }))
    scored.sort((a, b) => b.v - a.v)
    nextAction = buildNextAction(scored[0].c)
  }

  const todayPlan: PlanSegment[] = nextAction
    ? [
        ...nextAction.plan,
        { minutes: 10, activity: 'Flashcard recall', detail: `${dueFlashcards} cards due — clear the deck.` },
        { minutes: 15, activity: 'Error review', detail: 'Revisit your last mistakes before closing the day.' },
      ]
    : [{ minutes: 20, activity: 'Knowledge audit', detail: 'Take a diagnostic assessment to build your first knowledge map.' }]

  const thisWeekAcc = await recentAccuracy(profile.id, 7)
  const prevWeekAcc = await recentAccuracy(profile.id, 14, 7)

  const clock = examClock(profile.year, profile.gradYear, profile.dailyHours, profile.examDate ? new Date(profile.examDate) : null)

  const payload: DashboardPayload = {
    greeting: greetingFor(now),
    name: profile.name,
    prepStage: profile.prepStage,
    stageLabel: YEAR_LABELS[profile.year] ?? 'MBBS',
    brainScore,
    stats: {
      topicsAtRisk: atRisk.length,
      recurringMistakes: errorPatterns.filter(e => e.count >= 2).length,
      dueQuestions,
      dueFlashcards,
      recommendedMinutes,
      streak: computeStreak(sessions.map(s => s.date)),
    },
    knowledgeSplit: {
      strong: strong.length, unstable: unstable.length,
      weak: weak.length, new: Math.max(0, conceptTotal - states.length),
    },
    revisionDebt: { count: revisionItems.length, minutes: revisionMinutes },
    weaknesses: states
      .filter(s => s.score < 60)
      .sort((a, b) => a.score - b.score)
      .slice(0, 4)
      .map(s => ({
        conceptId: s.conceptId, name: s.concept.name,
        subject: s.concept.topic.subject.name, mastery: Math.round(s.score),
        reason: s.estRecall < 0.55 ? 'Recall decayed — schedule revision' : 'Accuracy below target',
      })),
    nextAction,
    todayPlan,
    weeklyDelta: { lastWeek: prevWeekAcc, thisWeek: thisWeekAcc },
    examClock: { ...clock, stage: clock.stage },
    heatToday: {
      questions: await db.questionAttempt.count({ where: { profileId: profile.id, createdAt: { gte: new Date(now.toISOString().slice(0, 10)) } } }),
      minutes: today.reduce((a, s) => a + s.minutes, 0),
    },
  }
  return NextResponse.json(payload)
}

// BUGFIX: was missing the profileId filter — accuracy was computed across ALL profiles.
async function recentAccuracy(profileId: string, days: number, offset = 0): Promise<number> {
  const now = new Date()
  const from = new Date(now.getTime() - (days + offset) * DAY)
  const to = new Date(now.getTime() - offset * DAY)
  const [total, correct] = await Promise.all([
    db.questionAttempt.count({ where: { profileId, createdAt: { gte: from, lt: to } } }),
    db.questionAttempt.count({ where: { profileId, createdAt: { gte: from, lt: to }, correct: true } }),
  ])
  return total ? Math.round((correct / total) * 100) : 0
}
