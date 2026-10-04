import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall, istDayKey } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// ─── NEET-PG READINESS SCORE ────────────────────────────────────────────────
// An interpretable, honest composite — NOT a rank prediction. Every component is
// computed from real student data with its weight and a "how to move it" note,
// so the student always understands WHERE the number comes from.
//
//   readiness = 0.35·coverage + 0.30·accuracy + 0.25·retention + 0.10·consistency
//
//   coverage    — high-yield-weighted share of the syllabus you have engaged with
//   accuracy    — correct rate over your last 100 question attempts
//   retention   — mean estimated recall (Ebbinghaus) across touched concepts
//   consistency — share of the last 14 IST days with ≥1 logged study session

export async function GET() {
  try {
    const profile = await getDemoProfile()
    const now = new Date()

    const [states, concepts, attempts, sessions] = await Promise.all([
      db.knowledgeState.findMany({ where: { profileId: profile.id }, include: { concept: { include: { topic: { include: { subject: true } } } } } }),
      db.concept.findMany({ select: { id: true, examRelevance: true, topic: { select: { subject: { select: { code: true, name: true } } } } } }),
      db.questionAttempt.findMany({
        where: { profileId: profile.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: { correct: true, createdAt: true, question: { select: { subjectCode: true } } },
      }),
      db.studySession.findMany({
        where: { profileId: profile.id, date: { gte: new Date(now.getTime() - 14 * DAY) } },
        select: { date: true },
      }),
    ])

    // ── Coverage: high-yield-weighted engagement ──
    const totalYield = concepts.reduce((a, c) => a + c.examRelevance, 0) || 1
    const touched = new Set(states.filter(s => s.attemptCount > 0 || s.score > 0).map(s => s.conceptId))
    const coveredYield = concepts
      .filter(c => touched.has(c.id))
      .reduce((a, c) => a + c.examRelevance, 0)
    const coverage = Math.round((coveredYield / totalYield) * 100)

    // ── Accuracy: last 100 attempts ──
    const accuracy = attempts.length
      ? Math.round((attempts.filter(a => a.correct).length / attempts.length) * 100)
      : 0

    // ── Retention: mean estimated recall over touched concepts ──
    const active = states.filter(s => s.score > 0)
    const retention = active.length
      ? Math.round(
          (active.reduce((a, s) => {
            const days = s.lastReviewed ? (now.getTime() - s.lastReviewed.getTime()) / DAY : 999
            return a + estimatedRecall(days, s.stability)
          }, 0) / active.length) * 100,
        )
      : 0

    // ── Consistency: distinct active IST days in the last 14 ──
    const activeDays = new Set(sessions.map(s => istDayKey(s.date))).size
    const consistency = Math.min(100, Math.round((activeDays / 14) * 100))

    const overall = Math.round(coverage * 0.35 + accuracy * 0.3 + retention * 0.25 + consistency * 0.1)
    const band =
      overall >= 75 ? 'Exam sharp' :
      overall >= 60 ? 'On track' :
      overall >= 40 ? 'Developing' : 'Building foundations'

    const components = [
      {
        key: 'coverage', label: 'Syllabus coverage', weight: 35, value: coverage,
        note: `${touched.size} of ${concepts.length} concepts engaged, weighted by NEET-PG yield`,
        suggestion: coverage < 60 ? 'Widen your base — use Learn + the Medical Map to touch high-yield concepts first.' : 'Coverage is healthy — protect it with spaced revision.',
      },
      {
        key: 'accuracy', label: 'Question accuracy', weight: 30, value: accuracy,
        note: `Last ${attempts.length} attempts, profile-scoped`,
        suggestion: accuracy < 60 ? 'Slow down: read stems fully, tag every error type in practice.' : 'Keep the streak — push into harder vignette mixes.',
      },
      {
        key: 'retention', label: 'Retention (recall)', weight: 25, value: retention,
        note: 'Mean estimated recall across concepts you have studied',
        suggestion: retention < 60 ? 'Clear your revision debt — flashcards and due concepts first.' : 'Memory is holding — schedule light top-ups before decay.',
      },
      {
        key: 'consistency', label: 'Consistency', weight: 10, value: consistency,
        note: `${activeDays} of the last 14 days had at least one study session`,
        suggestion: consistency < 50 ? 'Show up daily — even 20 focused minutes protects the curve.' : 'Routine is strong — keep the rhythm.',
      },
    ]

    // Focus subjects: lowest per-subject blend (coverage 60% + accuracy 40%) among
    // subjects the student has engaged with — actionable, not vanity.
    const bySubject = new Map<string, { name: string; total: number; covered: number; correct: number; att: number }>()
    for (const c of concepts) {
      const code = c.topic.subject.code
      const row = bySubject.get(code) ?? { name: c.topic.subject.name, total: 0, covered: 0, correct: 0, att: 0 }
      row.total += c.examRelevance
      if (touched.has(c.id)) row.covered += c.examRelevance
      bySubject.set(code, row)
    }
    for (const a of attempts) {
      const row = bySubject.get(a.question.subjectCode)
      if (row) { row.att += 1; if (a.correct) row.correct += 1 }
    }
    const focusSubjects = [...bySubject.entries()]
      .filter(([, r]) => r.att >= 5 || r.covered > 0)
      .map(([code, r]) => ({
        code,
        name: r.name,
        readiness: Math.round((r.covered / Math.max(1, r.total)) * 60 + (r.att ? (r.correct / r.att) * 40 : 0)),
      }))
      .sort((a, b) => a.readiness - b.readiness)
      .slice(0, 3)

    return NextResponse.json({
      overall,
      band,
      components,
      focusSubjects,
      dataBasis: {
        concepts: concepts.length,
        engaged: touched.size,
        attemptsConsidered: attempts.length,
        activeDaysLast14: activeDays,
      },
      methodology: 'readiness = 0.35·coverage + 0.30·accuracy + 0.25·retention + 0.10·consistency',
      disclaimer: 'A learning-analytics estimate of preparation coverage and stability — not a rank prediction or a clinical measure.',
    })
  } catch (err) {
    console.error('[api/readiness]', err)
    return NextResponse.json({ error: 'Failed to compute readiness' }, { status: 500 })
  }
}
