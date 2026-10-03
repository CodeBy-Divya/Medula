import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall, updateKnowledge, statusFor } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import type { AttemptResult } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { questionId, selected, timeMs = 0, confidence = 3 } = body as {
    questionId: string; selected: string; timeMs?: number; confidence?: number
  }
  const profile = await getDemoProfile()
  const question = await db.question.findUnique({ where: { id: questionId } })
  if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

  const correct = selected === question.answer
  await db.questionAttempt.create({
    data: { questionId, profileId: profile.id, selected, correct, timeMs, confidence },
  })

  let errorTypeSuggestion: string | undefined
  if (!correct) {
    // heuristic guess of likely error type for pre-fill
    errorTypeSuggestion = ['didnt_know', 'forgot', 'confused', 'misread'][question.difficulty === 1 ? 0 : Math.floor(Math.random() * 3)]
  }

  // Update knowledge state for linked concept
  let mastery: number | undefined
  let status: string | undefined
  if (question.conceptId) {
    const existing = await db.knowledgeState.findUnique({
      where: { profileId_conceptId: { profileId: profile.id, conceptId: question.conceptId } },
    })
    const now = new Date()
    if (!existing) {
      const init = updateKnowledge(0, 1, correct, question.difficulty)
      const rec = await db.knowledgeState.create({
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
      const rec = await db.knowledgeState.update({
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
