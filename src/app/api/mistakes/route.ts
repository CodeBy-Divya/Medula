import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import { ERROR_TYPE_LABELS } from '@/lib/types'

export const dynamic = 'force-dynamic'

// ─── Mistake Book 2.0 ───
// Personal mistake intelligence. Every number below is COMPUTED from the
// profile's own attempts / error patterns / confusion pairs — nothing is
// estimated, modelled or fabricated. If data is thin, we say so instead.

export interface MistakeErrorTypeRow {
  errorType: string // 'untagged' when the attempt carried no tag
  label: string
  count: number
  share: number // % of all wrong attempts
}

export interface MistakePatternRow {
  errorType: string
  label: string
  conceptId: string | null
  conceptName: string | null
  count: number
}

export interface MistakeConfusionRow {
  id: string
  a: string
  b: string
  aCode: string
  bCode: string
  mnemonic: string
  subjectCode: string
  aPoints: string[]
  bPoints: string[]
  aErrors: number // wrong attempts on questions linked to aCode
  bErrors: number // wrong attempts on questions linked to bCode
}

export interface MistakeWrongQuestionRow {
  questionId: string
  stem: string
  selected: string
  selectedText: string
  answer: string
  answerText: string
  explanation: string
  teaching: string
  subjectCode: string
  difficulty: number
  conceptId: string | null
  conceptName: string | null
  errorType: string | null
  timeMs: number
  confidence: number
  at: string // ISO timestamp
}

export interface MistakeConfusionCard {
  id: string
  a: string
  b: string
  mnemonic: string
  subjectCode: string
  aCode: string
  bCode: string
}

export interface MistakesPayload {
  totals: { totalAttempts: number; totalWrong: number; overallMistakeRate: number }
  errorTypeBreakdown: MistakeErrorTypeRow[]
  patterns: MistakePatternRow[]
  recurringConfusions: MistakeConfusionRow[]
  wrongQuestions: MistakeWrongQuestionRow[]
  confusions: MistakeConfusionCard[]
  insights: string[]
  insufficientData: boolean
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return `${s.slice(0, max - 1).trimEnd()}…`
}

function optionText(options: unknown, id: string): string {
  if (!Array.isArray(options)) return id
  const opt = options.find(
    (o) => o && typeof o === 'object' && (o as { id?: unknown }).id === id,
  ) as { text?: unknown } | undefined
  return typeof opt?.text === 'string' && opt.text ? opt.text : id
}

const MIN_ATTEMPTS_FOR_INSIGHTS = 5
const TIME_PRESSURE_RATIO = 1.4

export async function GET() {
  try {
    const profile = await getDemoProfile()

    const [attempts, patterns, pairs] = await Promise.all([
      db.questionAttempt.findMany({
        where: { profileId: profile.id },
        include: { question: { include: { concept: true } } },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      db.errorPattern.findMany({ where: { profileId: profile.id } }),
      db.confusionPair.findMany(),
    ])

    // ── totals ──
    const totalAttempts = attempts.length
    const wrong = attempts.filter((a) => !a.correct) // preserves newest-first order
    const totalWrong = wrong.length
    const overallMistakeRate = totalAttempts
      ? Math.round((totalWrong / totalAttempts) * 100)
      : 0

    // ── concept names seen anywhere in the data ──
    const conceptNameById = new Map<string, string>()
    for (const a of attempts) {
      if (a.question.concept) conceptNameById.set(a.question.concept.id, a.question.concept.name)
    }

    // ── error-type breakdown over wrong attempts (null → untagged) ──
    const typeCounts = new Map<string, number>()
    for (const a of wrong) {
      const key = a.errorType ?? 'untagged'
      typeCounts.set(key, (typeCounts.get(key) ?? 0) + 1)
    }
    const errorTypeBreakdown: MistakeErrorTypeRow[] = [...typeCounts.entries()]
      .map(([errorType, count]) => ({
        errorType,
        label: errorType === 'untagged' ? 'Untagged' : (ERROR_TYPE_LABELS[errorType] ?? errorType),
        count,
        share: totalWrong ? Math.round((count / totalWrong) * 100) : 0,
      }))
      .sort((x, y) => y.count - x.count)

    // ── concepts with wrong attempts (for confusion detection) ──
    const wrongAttemptsByConcept = new Map<string, number>()
    for (const a of wrong) {
      const cid = a.question.conceptId
      if (cid) wrongAttemptsByConcept.set(cid, (wrongAttemptsByConcept.get(cid) ?? 0) + 1)
    }
    const patternConceptIds = new Set(
      patterns.map((p) => p.conceptId).filter((cid): cid is string => !!cid),
    )
    const errorConcepts = new Set<string>([...patternConceptIds, ...wrongAttemptsByConcept.keys()])

    // name any pattern concept the attempt feed didn't cover (e.g. older lapses)
    const missingConceptIds = [...patternConceptIds].filter((cid) => !conceptNameById.has(cid))
    if (missingConceptIds.length > 0) {
      const extraConcepts = await db.concept.findMany({
        where: { id: { in: missingConceptIds } },
        select: { id: true, name: true },
      })
      for (const c of extraConcepts) conceptNameById.set(c.id, c.name)
    }

    // ── top error patterns (joined with concept names, top 6) ──
    const patternsOut: MistakePatternRow[] = patterns
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map((p) => ({
        errorType: p.errorType,
        label: ERROR_TYPE_LABELS[p.errorType] ?? p.errorType,
        conceptId: p.conceptId,
        conceptName: p.conceptId ? (conceptNameById.get(p.conceptId) ?? null) : null,
        count: p.count,
      }))

    // ── recurring confusions: both sides of a pair show up in the profile's errors ──
    const recurringConfusions: MistakeConfusionRow[] = []
    for (const pair of pairs) {
      if (!pair.aCode || !pair.bCode) continue
      if (!errorConcepts.has(pair.aCode) || !errorConcepts.has(pair.bCode)) continue
      recurringConfusions.push({
        id: pair.id,
        a: pair.a,
        b: pair.b,
        aCode: pair.aCode,
        bCode: pair.bCode,
        mnemonic: pair.mnemonic,
        subjectCode: pair.subjectCode,
        aPoints: (pair.aPoints as string[]) ?? [],
        bPoints: (pair.bPoints as string[]) ?? [],
        aErrors: wrongAttemptsByConcept.get(pair.aCode) ?? 0,
        bErrors: wrongAttemptsByConcept.get(pair.bCode) ?? 0,
      })
    }
    recurringConfusions.sort((x, y) => y.aErrors + y.bErrors - (x.aErrors + x.bErrors))

    // ── wrong questions: latest wrong attempt per distinct question, max 25, newest first ──
    const seenQuestion = new Set<string>()
    const wrongQuestions: MistakeWrongQuestionRow[] = []
    for (const a of wrong) {
      if (seenQuestion.has(a.questionId)) continue
      if (wrongQuestions.length >= 25) break
      seenQuestion.add(a.questionId)
      wrongQuestions.push({
        questionId: a.questionId,
        stem: truncate(a.question.stem, 220),
        selected: a.selected,
        selectedText: optionText(a.question.options, a.selected),
        answer: a.question.answer,
        answerText: optionText(a.question.options, a.question.answer),
        explanation: truncate(a.question.explanation, 300),
        teaching: a.question.teaching ?? '',
        subjectCode: a.question.subjectCode,
        difficulty: a.question.difficulty,
        conceptId: a.question.conceptId,
        conceptName: a.question.concept?.name ?? null,
        errorType: a.errorType,
        timeMs: a.timeMs,
        confidence: a.confidence,
        at: a.createdAt.toISOString(),
      })
    }

    // ── confusion pairs relevant to this profile's mistakes (max 6) ──
    // matched by concept codes first, then by same subject as wrong questions
    const wrongSubjectCodes = new Set(wrong.map((a) => a.question.subjectCode))
    const confusionsOut: MistakeConfusionCard[] = pairs
      .map((pair) => {
        const byCode =
          (!!pair.aCode && errorConcepts.has(pair.aCode)) ||
          (!!pair.bCode && errorConcepts.has(pair.bCode))
        return { pair, byCode }
      })
      .filter(({ pair, byCode }) => byCode || wrongSubjectCodes.has(pair.subjectCode))
      .sort((x, y) => Number(y.byCode) - Number(x.byCode))
      .slice(0, 6)
      .map(({ pair }) => ({
        id: pair.id,
        a: pair.a,
        b: pair.b,
        mnemonic: pair.mnemonic,
        subjectCode: pair.subjectCode,
        aCode: pair.aCode,
        bCode: pair.bCode,
      }))

    // ── honest auto-generated insights (empty until there is enough data) ──
    const insights: string[] = []
    if (totalAttempts >= MIN_ATTEMPTS_FOR_INSIGHTS) {
      // top tagged error type
      const taggedWrong = wrong.filter((a) => !!a.errorType).length
      const topType = errorTypeBreakdown.find((e) => e.errorType !== 'untagged')
      if (topType && taggedWrong > 0) {
        insights.push(
          `Most frequent mistake: ${topType.label} — ${topType.count} of ${taggedWrong} tagged wrong answers (${topType.share}%). (from your error-type tags)`,
        )
      }

      // untagged nudge — only when it actually matters
      const untagged = errorTypeBreakdown.find((e) => e.errorType === 'untagged')
      if (untagged && totalWrong > 0 && untagged.count / totalWrong >= 0.3) {
        insights.push(
          `${untagged.count} of your ${totalWrong} wrong answers carry no error tag — tag them after practice and this analysis gets sharper. (from untagged attempts)`,
        )
      }

      // recurring confusions
      if (recurringConfusions.length > 0) {
        const first = recurringConfusions[0]
        insights.push(
          `You have ${recurringConfusions.length} recurring confusion pattern${recurringConfusions.length > 1 ? 's' : ''} — e.g. ${first.a} vs ${first.b}. (from error patterns + wrong attempts)`,
        )
      }

      // time analysis: wrong vs correct average (only meaningful with samples on both sides)
      const wrongTimed = wrong.filter((a) => a.timeMs > 0)
      const correctTimed = attempts.filter((a) => a.correct && a.timeMs > 0)
      if (wrongTimed.length >= 5 && correctTimed.length >= 5) {
        const avgWrongMs = wrongTimed.reduce((s, a) => s + a.timeMs, 0) / wrongTimed.length
        const avgCorrectMs = correctTimed.reduce((s, a) => s + a.timeMs, 0) / correctTimed.length
        if (avgCorrectMs > 0 && avgWrongMs / avgCorrectMs > TIME_PRESSURE_RATIO) {
          insights.push(
            `You average ${Math.round(avgWrongMs / 1000)}s on wrong answers vs ${Math.round(avgCorrectMs / 1000)}s on correct ones — time pressure correlates with your errors. Slow down on stems that feel familiar. (from attempt timings)`,
          )
        }
      }

      // overconfidence: share of wrong answers marked confidence >= 4
      if (totalWrong >= 5) {
        const overconfident = wrong.filter((a) => a.confidence >= 4).length
        if (overconfident > 0) {
          const share = Math.round((overconfident / totalWrong) * 100)
          insights.push(
            `${overconfident} of ${totalWrong} wrong answers (${share}%) were marked confidence ≥ 4 — overconfidence, not ignorance, may be the leak. (from confidence ratings)`,
          )
        }
      }

      // most-mistaken concept
      let topConcept: { name: string; count: number } | null = null
      for (const [cid, count] of wrongAttemptsByConcept) {
        const name = conceptNameById.get(cid)
        if (name && (!topConcept || count > topConcept.count)) topConcept = { name, count }
      }
      if (topConcept) {
        insights.push(
          `Most-mistaken concept: ${topConcept.name} — ${topConcept.count} wrong attempt${topConcept.count > 1 ? 's' : ''}. (from your attempt history)`,
        )
      }
    }

    const payload: MistakesPayload = {
      totals: { totalAttempts, totalWrong, overallMistakeRate },
      errorTypeBreakdown,
      patterns: patternsOut,
      recurringConfusions,
      wrongQuestions,
      confusions: confusionsOut,
      insights,
      insufficientData: totalAttempts < MIN_ATTEMPTS_FOR_INSIGHTS,
    }
    return NextResponse.json(payload)
  } catch (err) {
    console.error('[api/mistakes] GET failed:', err)
    return NextResponse.json({ error: 'Failed to compute mistake intelligence' }, { status: 500 })
  }
}
