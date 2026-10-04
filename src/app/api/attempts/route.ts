import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall, updateKnowledge, statusFor } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import { asInt, asTrimmed, readJson } from '@/lib/http'
import type { AttemptResult } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await readJson<{ questionId?: unknown; selected?: unknown; timeMs?: unknown; confidence?: unknown }>(req)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const questionId = asTrimmed(body.questionId, 200)
  if (!questionId) return NextResponse.json({ error: 'questionId is required' }, { status: 400 })
  if (typeof body.selected !== 'string') return NextResponse.json({ error: 'selected must be a string' }, { status: 400 })
  const selected = body.selected
  const timeMs = asInt(body.timeMs, 0, 3_600_000, 0) // sanity-clamped: up to 1h
  const confidence = asInt(body.confidence, 1, 5, 3)

  const profile = await getDemoProfile()
  const question = await db.question.findUnique({ where: { id: questionId } })
  if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

  const correct = selected === question.answer

  let errorTypeSuggestion: string | undefined
  if (!correct) {
    // Deterministic pre-fill suggestion (a HINT only — the student still logs
    // the real error type; nothing here is stored as truth). Fast + wrong reads
    // like a misread; low confidence reads like a guess; else a reasoning slip.
    errorTypeSuggestion = timeMs < 10000 ? 'misread' : confidence <= 2 ? 'guess' : 'reasoning'
  }

  // Attempt record + knowledge-state read-modify-write run in ONE transaction
  // so concurrent submissions can't interleave the read and the update.
  const { mastery, status } = await db.$transaction(async (tx) => {
    await tx.questionAttempt.create({
      data: { questionId, profileId: profile.id, selected, correct, timeMs, confidence },
    })

    // Update knowledge state for linked concept
    let mastery: number | undefined
    let status: string | undefined
    if (question.conceptId) {
      const existing = await tx.knowledgeState.findUnique({
        where: { profileId_conceptId: { profileId: profile.id, conceptId: question.conceptId } },
      })
      const now = new Date()
      if (!existing) {
        const init = updateKnowledge(0, 1, correct, question.difficulty)
        const rec = await tx.knowledgeState.create({
          data: {
            profileId: profile.id, conceptId: question.conceptId,
            score: init.score, stability: init.stability, estRecall: 1,
            attemptCount: 1, correctCount: correct ? 1 : 0,
            lastReviewed: now, lastCorrect: correct ? now : null,
            status: statusFor(init.score, 1),
          },
        })
        mastery = Math.round(rec.score); status = rec.status
      } else {
        const days = existing.lastReviewed ? (now.getTime() - existing.lastReviewed.getTime()) / DAY : 999
        const recall = estimatedRecall(days, existing.stability)
        const blended = existing.score * recall + (1 - recall) * existing.score * 0.4
        const upd = updateKnowledge(blended, existing.stability, correct, question.difficulty)
        const rec = await tx.knowledgeState.update({
          where: { id: existing.id },
          data: {
            score: upd.score, stability: upd.stability, estRecall: recall,
            attemptCount: existing.attemptCount + 1,
            correctCount: existing.correctCount + (correct ? 1 : 0),
            lastReviewed: now, lastCorrect: correct ? now : existing.lastCorrect,
            status: statusFor(upd.score, recall),
          },
        })
        mastery = Math.round(rec.score); status = rec.status
      }
    }
    return { mastery, status }
  })

  const result: AttemptResult = {
    correct,
    answer: question.answer,
    explanation: question.explanation,
    teaching: question.teaching,
    errorTypeSuggestion,
    knowledgeUpdated: Boolean(question.conceptId),
    mastery,
    status,
  }
  return NextResponse.json(result)
}
