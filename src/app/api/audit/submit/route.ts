import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall, updateKnowledge, statusFor } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import type { AuditResultPayload, AuditSubjectResult } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Submit audit results: record attempts, update knowledge states, return the knowledge map.
export async function POST(req: NextRequest) {
  const profile = await getDemoProfile()
  const body = await req.json() as { results: { questionId: string; selected: string }[] }

  const questionIds = body.results.map(r => r.questionId)
  const questions = await db.question.findMany({ where: { id: { in: questionIds } } })
  const qMap = new Map(questions.map(q => [q.id, q]))
  const now = new Date()

  // Record attempts + update knowledge states
  for (const r of body.results) {
    const q = qMap.get(r.questionId)
    if (!q) continue
    const correct = r.selected === q.answer
    await db.questionAttempt.create({
      data: { questionId: q.id, profileId: profile.id, selected: r.selected, correct, timeMs: 0, confidence: 2 },
    })
    if (q.conceptId) {
      const existing = await db.knowledgeState.findUnique({
        where: { profileId_conceptId: { profileId: profile.id, conceptId: q.conceptId } },
      })
      if (!existing) {
        const init = updateKnowledge(0, 1, correct, q.difficulty)
        await db.knowledgeState.create({
          data: {
            profileId: profile.id, conceptId: q.conceptId,
            score: init.score, stability: init.stability, estRecall: 1,
            attemptCount: 1, correctCount: correct ? 1 : 0,
            lastReviewed: now, lastCorrect: correct ? now : null,
            status: statusFor(init.score, 1),
          },
        })
      } else {
        const days = existing.lastReviewed ? (now.getTime() - existing.lastReviewed.getTime()) / DAY : 999
        const recall = estimatedRecall(days, existing.stability)
        const blended = existing.score * recall + (1 - recall) * existing.score * 0.4
        const upd = updateKnowledge(blended, existing.stability, correct, q.difficulty)
        await db.knowledgeState.update({
          where: { id: existing.id },
          data: {
            score: upd.score, stability: upd.stability, estRecall: recall,
            attemptCount: existing.attemptCount + 1,
            correctCount: existing.correctCount + (correct ? 1 : 0),
            lastReviewed: now, lastCorrect: correct ? now : existing.lastCorrect,
            status: statusFor(upd.score, recall),
          },
        })
      }
    }
  }

  // Per-subject breakdown across the audited sample
  const bySubject = new Map<string, { correct: number; total: number }>()
  for (const r of body.results) {
    const q = qMap.get(r.questionId)
    if (!q) continue
    const s = q.subjectCode
    const cur = bySubject.get(s) ?? { correct: 0, total: 0 }
    cur.total += 1
    if (r.selected === q.answer) cur.correct += 1
    bySubject.set(s, cur)
  }
  void questionIds

  const subjects = await db.subject.findMany()
  const subjectMap = new Map(subjects.map(s => [s.code, s]))
  const states = await db.knowledgeState.findMany({ where: { profileId: profile.id } })
  const conceptSubject = new Map(
    (await db.concept.findMany({ select: { id: true, topic: { select: { subjectId: true } } } }))
      .map(c => [c.id, c.topic.subjectId]),
  )
  const masteryBySubject = new Map<string, { sum: number; n: number }>()
  for (const st of states) {
    const subId = conceptSubject.get(st.conceptId)
    if (!subId) continue
    const cur = masteryBySubject.get(subId) ?? { sum: 0, n: 0 }
    cur.sum += st.score; cur.n += 1
    masteryBySubject.set(subId, cur)
  }

  const subjectResults: AuditSubjectResult[] = [...bySubject.entries()].map(([code, agg]) => {
    const s = subjectMap.get(code)
    const accuracy = agg.total ? Math.round((agg.correct / agg.total) * 100) : 0
    const m = masteryBySubject.get(s?.id ?? '')
    const mastery = m && m.n ? Math.round(m.sum / m.n) : 0
    const band: AuditSubjectResult['band'] = mastery === 0 && agg.total === 0 ? 'unmapped'
      : accuracy >= 75 && mastery >= 60 ? 'strong'
      : accuracy >= 50 ? 'moderate' : 'weak'
    return {
      code, name: s?.name ?? code, color: s?.color ?? '#94a3b8',
      correct: agg.correct, total: agg.total, accuracy,
      mastery, band,
    }
  }).sort((a, b) => b.accuracy - a.accuracy)

  const total = body.results.length
  const correct = body.results.filter(r => {
    const q = qMap.get(r.questionId)
    return q ? r.selected === q.answer : false
  }).length

  const weakest = subjectResults.slice().sort((a, b) => a.accuracy - b.accuracy)[0] ?? null
  const strongest = subjectResults.slice().sort((a, b) => b.accuracy - a.accuracy)[0] ?? null

  const accuracyPct = total ? Math.round((correct / total) * 100) : 0
  let recommendation: string
  if (!total) recommendation = 'The audit sample came back empty — practice questions first, then re-audit.'
  else if (accuracyPct >= 75) recommendation = `Strong baseline (${accuracyPct}%). Push into integrated vignettes and keep the revision engine fed.`
  else if (accuracyPct >= 50) recommendation = `Moderate baseline (${accuracyPct}%). Focus this week on ${weakest ? weakest.name : 'your weakest subject'} and clear revision debt before new material.`
  else recommendation = `Early-stage map (${accuracyPct}%). Build foundations subject by subject — start with ${weakest ? weakest.name : 'high-yield subjects'} and use the daily missions.`

  const payload: AuditResultPayload = {
    overall: { correct, total, accuracy: accuracyPct },
    subjects: subjectResults,
    weakest: weakest ? { code: weakest.code, name: weakest.name } : null,
    strongest: strongest ? { code: strongest.code, name: strongest.name } : null,
    recommendation,
  }
  await db.studySession.create({
    data: { profileId: profile.id, minutes: 10, kind: 'study', label: 'Knowledge audit completed' },
  })
  return NextResponse.json(payload)
}
