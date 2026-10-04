// ─── MEDULA KNOWLEDGE ENGINE (server-side) ───
// Learning analytics indicators — NOT measures of biological memory or clinical competence.
import type { PlanSegment, NextAction, RoadmapPhase } from './types'

export const DAY = 24 * 3600 * 1000

// The entire audience is IST (Asia/Kolkata, UTC+5:30, no DST) — all day-bucketing
// (streaks, "today" filters, heatmaps) must use IST calendar days, not UTC.
const IST_DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }) // en-CA → YYYY-MM-DD
export function istDayKey(d: Date): string {
  return IST_DAY.format(d)
}
export function istHour(d: Date): number {
  return Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }).format(d))
}

// Ebbinghaus-style estimate: R = e^(-t / (S * k))
export function estimatedRecall(daysSinceReview: number, stabilityDays: number): number {
  if (daysSinceReview <= 0) return 1
  return Math.exp(-daysSinceReview / (stabilityDays * 1.6))
}

// SM-2-lite: grade 0..3 (again, hard, good, easy)
export function srsUpdate(prev: { intervalDays: number; reps: number; lapses: number }, grade: number) {
  let { intervalDays, reps, lapses } = prev
  if (grade === 0) {
    lapses += 1
    intervalDays = 0.5
    reps = 0
  } else {
    const factor = grade === 1 ? 1.3 : grade === 2 ? 2.2 : 3.2
    intervalDays = reps === 0 ? (grade === 1 ? 1 : 2) : Math.max(1, Math.round(intervalDays * factor))
    reps += 1
  }
  return { intervalDays: Math.min(intervalDays, 180), reps, lapses }
}

// Update knowledge state after a question attempt
export function updateKnowledge(score: number, stability: number, correct: boolean, difficulty: number) {
  const gain = correct ? Math.max(3, 14 - difficulty * 2) : -(10 + difficulty * 3)
  const newScore = Math.max(0, Math.min(100, score + (correct ? gain : gain * 1.1)))
  const newStability = correct
    ? Math.min(180, Math.max(1.5, stability * (1.25 + difficulty * 0.06)))
    : Math.max(0.8, stability * 0.6)
  return { score: Math.round(newScore * 10) / 10, stability: Math.round(newStability * 10) / 10 }
}

export function statusFor(score: number, recall: number): 'new' | 'weak' | 'unstable' | 'strong' {
  if (score <= 0) return 'new'
  if (score < 45) return 'weak'
  if (recall < 0.55) return 'unstable'
  return 'strong'
}

// ─── NEXT BEST ACTION ───
export interface ActionCandidate {
  conceptId: string
  conceptName: string
  score: number          // mastery 0..100
  estRecall: number      // 0..1
  examRelevance: number  // 1..5
  yearMatch: number      // 0..1 relevance to current stage
  errorCount: number     // recent errors on this concept
  lastReviewedDays: number | null
  status: string
}

// Weighted candidate scoring — transparent, deterministic
export function scoreCandidate(c: ActionCandidate): number {
  const recallRisk = 1 - c.estRecall // forgetting pressure
  const weakness = 1 - c.score / 100
  const exam = c.examRelevance / 5
  const errors = Math.min(1, c.errorCount / 4)
  return recallRisk * 0.30 + weakness * 0.28 + exam * 0.22 + c.yearMatch * 0.10 + errors * 0.10
}

export function buildPlanFor(conceptName: string, minutes: number, kind: 'weak' | 'decayed' | 'new'): PlanSegment[] {
  if (kind === 'new') {
    return [
      { minutes: Math.round(minutes * 0.4), activity: 'Learn the core concept', detail: `${conceptName} — read the connected map first, then the detail sections.` },
      { minutes: Math.round(minutes * 0.25), activity: 'Active recall', detail: 'Close everything. Write down what you remember.' },
      { minutes: Math.round(minutes * 0.35), activity: 'First questions', detail: 'Solve linked MCQs to anchor the concept.' },
    ]
  }
  return [
    { minutes: Math.max(5, Math.round(minutes * 0.28)), activity: 'Concept review', detail: `Refresh ${conceptName} — focus on the sections you last got wrong.` },
    { minutes: Math.max(5, Math.round(minutes * 0.28)), activity: 'Active recall', detail: 'Free recall: whiteboard/blank page, then compare.' },
    { minutes: Math.max(5, Math.round(minutes * 0.28)), activity: 'Clinical application', detail: 'Apply to a vignette or linked clinical case.' },
    { minutes: Math.max(5, Math.round(minutes * 0.16)), activity: 'Rapid questions', detail: 'Linked MCQs — aim for >80% this round.' },
  ]
}

export function buildNextAction(c: ActionCandidate): NextAction {
  const kind: 'weak' | 'decayed' | 'new' = c.score < 45 ? 'weak' : c.estRecall < 0.6 ? 'decayed' : 'new'
  const duration = kind === 'new' ? 40 : 35
  const reasons: string[] = []
  if (c.estRecall < 0.6 && c.lastReviewedDays) reasons.push(`last revised ${c.lastReviewedDays} days ago — estimated recall ${(c.estRecall * 100).toFixed(0)}%`)
  if (c.score < 45) reasons.push(`mastery indicator ${c.score.toFixed(0)}% — below target`)
  if (c.errorCount >= 2) reasons.push(`${c.errorCount} repeated errors detected`)
  if (c.examRelevance >= 4) reasons.push('high NEET-PG yield')
  const reason = reasons.length
    ? reasons.slice(0, 3).join(' · ')
    : 'Solid foundation — a quick reinforcement keeps the streak of stability going'
  return {
    conceptId: c.conceptId,
    conceptName: c.conceptName,
    reason,
    duration,
    priority: Math.round(scoreCandidate(c) * 100),
    plan: buildPlanFor(c.conceptName, duration, kind),
    activityType: kind === 'new' ? 'Learn' : kind === 'weak' ? 'Repair' : 'Reinforce',
  }
}

// ─── EXAM CLOCK ───
export interface ExamClockOut {
  daysLeft: number; weeksLeft: number; monthsLeft: number
  examYear: number; stage: string; weeklyTarget: number
  revisionCyclesLeft: number; questionTarget: number; mockTarget: number
  isEstimate: boolean
}

// NEET-PG window is announced by NBEMS each year — we estimate the student's realistic first
// attempt window (June of graduation year, when internship permits) and ALWAYS label it as an
// estimate to verify with official NBEMS announcements.
export function examClock(year: number, gradYear: number, dailyHours: number, customDate?: Date | null): ExamClockOut {
  const isEstimate = !customDate
  const now = new Date()
  let examDate: Date
  if (customDate) examDate = customDate
  else {
    // First eligible attempt: June 15 of graduation year (internship completes ~then).
    const candidate = new Date(gradYear, 5, 15)
    // If that window is less than ~4 months away, the realistic attempt is next year.
    examDate = candidate.getTime() - now.getTime() < 120 * DAY
      ? new Date(gradYear + 1, 5, 15)
      : candidate
    // Never in the past
    if (examDate.getTime() < now.getTime()) examDate = new Date(now.getFullYear() + 1, 5, 15)
  }
  const daysLeft = Math.max(0, Math.round((examDate.getTime() - now.getTime()) / DAY))
  const weeksLeft = Math.max(0, Math.round(daysLeft / 7))
  const monthsLeft = Math.max(0, Math.round(daysLeft / 30))
  const stage = daysLeft > 365 ? 'Foundation' : daysLeft > 180 ? 'Integration' : daysLeft > 90 ? 'Consolidation' : daysLeft > 30 ? 'Intensive Revision' : 'Final Sprint'
  const intensityBoost = daysLeft < 180 ? 1.6 : daysLeft < 365 ? 1.25 : 1
  const weeklyTarget = Math.round((dailyHours * 7 + (daysLeft < 180 ? 6 : 2)) * intensityBoost)
  return {
    daysLeft, weeksLeft, monthsLeft,
    examYear: gradYear > 0 ? Math.max(examDate.getFullYear(), gradYear) : examDate.getFullYear(),
    stage,
    weeklyTarget,
    revisionCyclesLeft: Math.max(0, Math.floor(daysLeft / 45)),
    questionTarget: Math.min(15000, Math.max(1000, Math.round(daysLeft * 8))),
    mockTarget: Math.min(40, Math.max(2, Math.floor(daysLeft / 30))),
    isEstimate,
  }
}

// ─── ROADMAP ───
export function buildRoadmap(year: number, prepStage: string, dailyHours: number): { horizonYears: number; phases: RoadmapPhase[]; stageLabel: string } {
  const remaining = year <= 1 ? 4 : year === 2 ? 3 : year === 3 ? 2 : year === 4 ? 1 : 1
  const phaseSets: Record<number, RoadmapPhase[]> = {
    4: [
      { phase: 'Phase 1 — First Year Foundation', timeframe: 'Year 1', goal: 'Build unshakeable basics in Anatomy, Physiology, Biochemistry while forming recall habits.', focus: ['Anatomy: gross + clinical correlations', 'Physiology: mechanisms, graphs, experiments', 'Biochemistry: pathways with clinical markers'], actions: ['Active recall after every college lecture (15 min)', 'Build flashcard habit — 20/day', 'First NEET-PG-style questions in basics (10/week)'], milestone: 'Can explain RAAS, cardiac cycle, nerve physiology without notes.', intensity: 2 },
      { phase: 'Phase 2 — Para-Clinical Integration', timeframe: 'Year 2', goal: 'Connect pathology, pharmacology and microbiology to the Year-1 base — the biggest NEET-PG yield jump.', focus: ['Pathology: general + systemic', 'Pharmacology: mechanism-first learning', 'Community Medicine: biostatistics + programs'], actions: ['For each pathology, revisit its physiology link', 'Drug mechanism → disease chains', 'Question volume grows to 25–40/week'], milestone: 'Can traverse disease→pathology→drug→question chains unaided.', intensity: 3 },
      { phase: 'Phase 3 — Clinical Immersion', timeframe: 'Year 3', goal: 'Attach wards knowledge to para-clinical base — Medicine & Surgery integration begins.', focus: ['Medicine + Surgery core topics', 'Case-based learning on wards', 'First full-subject question banks'], actions: ['Turn every ward case into 3 revision items', '50+ questions/week with error analysis', 'Start subject-wise Grand Tests'], milestone: 'Clinical vignettes trigger instant concept chains.', intensity: 4 },
      { phase: 'Phase 4 — Final Year Consolidation', timeframe: 'Final Year', goal: 'Complete OBGY/Peds/ortho/ENT/ophthal coverage while running first full revision cycles.', focus: ['Final year subjects complete first pass', 'Integrated revision cycle 1', 'Mock test calibration'], actions: ['Two full revision cycles of Year 1–2 subjects', 'One mock test/month with AI error analysis', 'Clinical cases weekly'], milestone: 'All 19 subjects have ≥1 revision cycle.', intensity: 4 },
      { phase: 'Phase 5 — Internship: NEET-PG Intensive', timeframe: 'Internship', goal: 'Convert internship exposures into question practice; run high-frequency revision.', focus: ['Subject-wise question marathons', 'Grand revision cycles', 'Full mocks + simulation'], actions: ['50–100 questions/day', 'Weekly mock + analysis', 'Clinical logbook → targeted revision'], milestone: 'Exam-ready knowledge state across all subjects.', intensity: 5 },
    ],
    3: [
      { phase: 'Phase 1 — Deepen the Para-Clinical Core', timeframe: 'This year', goal: 'Pathology/Pharm/Micro are the highest-yield NEET-PG subjects — own them now.', focus: ['System-wise pathology→pharmacology chains', 'Error-driven question practice'], actions: ['30–50 questions/week', 'Weekly confusion-pair review', 'Begin Medicine/History-taking foundation'], milestone: 'Para-clinical mastery indicators >70%.', intensity: 3 },
      { phase: 'Phase 2 — Clinical Integration', timeframe: 'Year 3', goal: 'Medicine/Surgery ward work feeds directly into vignette practice.', focus: ['Medicine, Surgery, ENT, Ophtho', 'Ward cases → revision items'], actions: ['Grand Tests per subject', 'Case simulator weekly'], milestone: 'Integrated questions accuracy >65%.', intensity: 4 },
      { phase: 'Phase 3 — Final Year Sprint', timeframe: 'Final Year', goal: 'Complete remaining subjects; run revision cycles 1–2.', focus: ['OBGY, Peds, Ortho, short subjects', 'Two full revision cycles'], actions: ['60–80 questions/week', 'Monthly mocks'], milestone: 'All subjects at least once revised.', intensity: 4 },
      { phase: 'Phase 4 — Internship Intensive', timeframe: 'Internship', goal: 'Full NEET-PG mode: mocks, revision, error elimination.', focus: ['Full-length mocks', 'Rapid revision banks'], actions: ['Daily question blocks', 'Weekly analysis sessions'], milestone: 'Consistent mock performance at target level.', intensity: 5 },
    ],
    2: [
      { phase: 'Phase 1 — Clinical Year Leverage', timeframe: 'Year 3', goal: 'Medicine + Surgery integration; para-clinical subjects get their second pass.', focus: ['Medicine/Surgery core', 'Pathology & Pharmacology revision'], actions: ['Vignette-first question practice', 'Confusion list weekly'], milestone: 'Integrated accuracy >65%.', intensity: 4 },
      { phase: 'Phase 2 — Final Year Completion', timeframe: 'Final Year', goal: 'Finish all subjects once + first revision cycle.', focus: ['OBGY/Peds/short subjects', 'Revision cycle 1'], actions: ['Mock monthly', 'Flashcards to full deck'], milestone: 'First full revision cycle done.', intensity: 4 },
      { phase: 'Phase 3 — Internship Intensive', timeframe: 'Internship', goal: 'Dedicated prep: mocks, revision cycles, error elimination.', focus: ['Grand tests', 'Rapid revision'], actions: ['70–100 questions/day', 'Weekly mock analysis'], milestone: 'Target mock scores achieved.', intensity: 5 },
    ],
    1: [
      { phase: 'Phase 1 — Final Year Dual Track', timeframe: 'This year', goal: 'University exams + NEET-PG foundation run together — they overlap ~70%.', focus: ['All final-year subjects', 'Revision cycle 1 of previous years'], actions: ['University-exam mode switches', 'Monthly diagnostic mocks'], milestone: 'Uni exams strong + first revision done.', intensity: 4 },
      { phase: 'Phase 2 — Internship Intensive', timeframe: 'Internship', goal: 'Full dedicated NEET-PG preparation.', focus: ['Complete syllabus coverage', 'Revision cycles + mocks'], actions: ['100 questions/day', 'Alternate-day mocks'], milestone: 'Exam readiness across all subjects.', intensity: 5 },
    ],
    5: [
      { phase: 'Phase 1 — Syllabus Completion + Error Purge', timeframe: 'Months 1–3', goal: 'Cover remaining gaps while converting internship exposure into practice.', focus: ['Weak subjects first', 'Question volume ramp'], actions: ['Daily 8–10 h blocks', 'Weekly full mocks'], milestone: 'No subject below 60%.', intensity: 5 },
      { phase: 'Phase 2 — Revision + Simulation', timeframe: 'Months 4–6', goal: 'Cycles 1–2 of rapid revision with full simulation.', focus: ['Rapid revision banks', 'Exam simulation'], actions: ['Grand tests weekly', 'Confusion list purge'], milestone: 'Mock scores stable at target.', intensity: 5 },
      { phase: 'Phase 3 — Final Calibration', timeframe: 'Last 6–8 weeks', goal: 'Exam temperament, image-based and recent-pattern practice.', focus: ['Image banks', 'Recent exam patterns'], actions: ['Alternate-day grand tests', 'Error notebook final pass'], milestone: 'Confident, calm, exam-ready.', intensity: 5 },
    ],
  }
  const phases = phaseSets[Math.min(remaining, 5)] ?? phaseSets[5]
  const stageLabel = year <= 2 ? 'FOUNDATION → INTEGRATION' : year === 3 ? 'INTEGRATION' : year === 4 ? 'CONSOLIDATION' : 'INTENSIVE'
  return { horizonYears: remaining, phases, stageLabel }
}

// Streak from session dates — bucketed by IST calendar day (fixed UTC-day bug that
// broke streaks for sessions logged before 05:30 IST)
export function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  const days = new Set(dates.map(istDayKey))
  let streak = 0
  const cur = new Date()
  for (let i = 0; i < 400; i++) {
    const key = istDayKey(cur)
    if (days.has(key)) { streak++; cur.setTime(cur.getTime() - DAY) }
    else if (streak === 0) { cur.setTime(cur.getTime() - DAY); if (!days.has(istDayKey(cur))) break }
    else break
  }
  return streak
}

export function greetingFor(d = new Date()): string {
  const h = istHour(d) // IST, not server-local (server runs UTC → wrong greeting for IST users)
  if (h < 5) return 'Burning the midnight oil'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
