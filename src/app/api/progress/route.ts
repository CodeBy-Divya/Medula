import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DAY, estimatedRecall } from '@/lib/engine'
import { getDemoProfile } from '@/lib/profile'
import { ERROR_TYPE_LABELS } from '@/lib/types'
import type { ProgressPayload } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const profile = await getDemoProfile()
  const now = new Date()

  const [subjects, topics, concepts, states, sessions, attempts, patterns, confusions, revisionItems] = await Promise.all([
    db.subject.findMany({ orderBy: { year: 'asc' } }),
    db.topic.findMany(),
    db.concept.findMany({ include: { topic: { include: { subject: true } } } }),
    db.knowledgeState.findMany({ where: { profileId: profile.id } }),
    db.studySession.findMany({ where: { profileId: profile.id, date: { gte: new Date(now.getTime() - 120 * DAY) } } }),
    db.questionAttempt.findMany({ where: { profileId: profile.id }, include: { question: true }, orderBy: { createdAt: 'desc' }, take: 500 }),
    db.errorPattern.findMany({ where: { profileId: profile.id } }),
    db.confusionPair.findMany(),
    db.revisionItem.findMany({ where: { profileId: profile.id, cleared: false } }),
  ])

  const stateByConcept = new Map(states.map(s => [s.conceptId, s]))
  const topicSubject = new Map(topics.map(t => [t.id, t.subjectId]))

  // subject aggregates
  const subjectStats = new Map<string, { sum: number; n: number; acc: number; accN: number; debt: number }>()
  for (const c of concepts) {
    const subId = c.topic.subjectId
    const st = subjectStats.get(subId) ?? { sum: 0, n: 0, acc: 0, accN: 0, debt: 0 }
    const ks = stateByConcept.get(c.id)
    if (ks) { st.sum += ks.score; st.n += 1 }
    subjectStats.set(subId, st)
  }
  for (const a of attempts) {
    const subId = a.question.subjectCode.toLowerCase()
    const st = subjectStats.get(subId)
    if (st) { st.acc += a.correct ? 1 : 0; st.accN += 1 }
  }
  for (const r of revisionItems) {
    const c = concepts.find(cc => cc.id === r.conceptId)
    if (c) {
      const st = subjectStats.get(c.topic.subjectId)
      if (st) st.debt += 1
    }
  }

  const subjectsPayload = subjects.map(s => {
    const st = subjectStats.get(s.id) ?? { sum: 0, n: 0, acc: 0, accN: 0, debt: 0 }
    const mastery = st.n ? Math.round(st.sum / st.n) : 0
    return {
      id: s.id, code: s.code, name: s.name, year: s.year, color: s.color,
      neetWeight: s.neetWeight, blurb: s.blurb,
      topicCount: topics.filter(t => t.subjectId === s.id).length,
      conceptCount: concepts.filter(c => c.topic.subjectId === s.id).length,
      mastery,
      status: mastery === 0 ? 'new' as const : mastery < 45 ? 'weak' as const : mastery < 70 ? 'unstable' as const : 'strong' as const,
      accuracy: st.accN ? Math.round((st.acc / st.accN) * 100) : 0,
      foundation: Math.min(100, mastery + 12),
      clinical: Math.max(0, Math.round(mastery * 0.8) - 8),
      debt: st.debt,
    }
  })

  // heatmap last 120 days
  const byDay = new Map<string, { minutes: number; questions: number; revision: number }>()
  for (let i = 119; i >= 0; i--) {
    const key = new Date(now.getTime() - i * DAY).toISOString().slice(0, 10)
    byDay.set(key, { minutes: 0, questions: 0, revision: 0 })
  }
  for (const s of sessions) {
    const key = s.date.toISOString().slice(0, 10)
    const d = byDay.get(key)
    if (d) { d.minutes += s.minutes; if (s.kind === 'revision') d.revision += s.minutes }
  }
  for (const a of attempts) {
    const key = a.createdAt.toISOString().slice(0, 10)
    const d = byDay.get(key)
    if (d) d.questions += 1
  }
  const heatmap = [...byDay.entries()].map(([date, v]) => ({ date, ...v }))

  // accuracy windows
  const acc = (fromDays: number, toDays: number) => {
    const win = attempts.filter(a => {
      const age = (now.getTime() - a.createdAt.getTime()) / DAY
      return age >= toDays && age < fromDays
    })
    return win.length ? Math.round((win.filter(a => a.correct).length / win.length) * 100) : 0
  }
  const accNow = acc(7, 0)
  const accPrev = acc(14, 7)

  // clinical accuracy
  const clinicalAttempts = attempts.filter(a => ['vignette', 'integrated'].includes(a.question.qtype))
  const clinicalAcc = clinicalAttempts.length ? Math.round((clinicalAttempts.filter(a => a.correct).length / clinicalAttempts.length) * 100) : 0
  const clinicalAcc7 = (() => {
    const win = clinicalAttempts.filter(a => (now.getTime() - a.createdAt.getTime()) / DAY < 7)
    return win.length ? Math.round((win.filter(a => a.correct).length / win.length) * 100) : 0
  })()

  // weekly report narrative
  const topMistake = patterns.slice().sort((a, b) => b.count - a.count)[0]
  const topMistakeConcept = topMistake?.conceptId ? concepts.find(c => c.id === topMistake.conceptId) : undefined
  const weakestSubject = subjectsPayload.filter(s => s.mastery > 0).slice().sort((a, b) => a.mastery - b.mastery)[0]
  const strongestSubject = subjectsPayload.slice().sort((a, b) => b.mastery - a.mastery)[0]
  const timeLast7 = sessions.filter(s => s.date >= new Date(now.getTime() - 7 * DAY)).reduce((a, s) => a + s.minutes, 0)
  const activeDays = new Set(sessions.filter(s => s.date >= new Date(now.getTime() - 7 * DAY)).map(s => s.date.toISOString().slice(0, 10))).size

  const narrative: string[] = []
  if (accNow && accPrev) {
    const diff = accNow - accPrev
    narrative.push(`Your question accuracy ${diff >= 0 ? 'increased' : 'dipped'} from ${accPrev}% → ${accNow}% this week.`)
  }
  if (weakestSubject && weakestSubject.mastery > 0) narrative.push(`${weakestSubject.name} remains your least stable area (${weakestSubject.mastery}%).`)
  if (topMistake) narrative.push(`Most common mistake: ${ERROR_TYPE_LABELS[topMistake.errorType] ?? topMistake.errorType}${topMistakeConcept ? ` — especially ${topMistakeConcept.name}` : ''}.`)
  narrative.push(`Study time this week: ${Math.floor(timeLast7 / 60)}h ${timeLast7 % 60}m across ${activeDays} active days.`)
  narrative.push(revisionItems.length ? `Revision debt stands at ${revisionItems.length} topics — clear it before starting new material.` : 'Revision debt is clear — excellent discipline.')

  // confusion detection: which pairs have recent confused errors
  const confusedConcepts = new Set(patterns.filter(p => p.errorType === 'confused' && p.conceptId).map(p => p.conceptId))
  const confusionsPayload = confusions.map(c => ({
    id: c.id, a: c.a, b: c.b, aCode: c.aCode, bCode: c.bCode,
    aPoints: c.aPoints as string[], bPoints: c.bPoints as string[],
    mnemonic: c.mnemonic, subjectCode: c.subjectCode,
    detected: confusedConcepts.has(c.aCode) || confusedConcepts.has(c.bCode),
  })).sort((x, y) => Number(y.detected) - Number(x.detected))

  // error patterns grouped
  const patternGroups = new Map<string, { count: number; examples: Map<string, number> }>()
  for (const p of patterns) {
    const g = patternGroups.get(p.errorType) ?? { count: 0, examples: new Map() }
    g.count += p.count
    const concept = p.conceptId ? concepts.find(c => c.id === p.conceptId) : undefined
    if (concept) g.examples.set(concept.name, (g.examples.get(concept.name) ?? 0) + p.count)
    patternGroups.set(p.errorType, g)
  }

  const overallMastery = states.length ? Math.round(states.reduce((a, s) => a + s.score, 0) / states.length) : 0

  const payload: ProgressPayload = {
    overall: { mastery: overallMastery, accuracy: accNow, trend: accNow - accPrev },
    subjects: subjectsPayload,
    heatmap,
    weeklyReport: {
      topicsStudied: new Set(attempts.filter(a => (now.getTime() - a.createdAt.getTime()) / DAY < 7 && a.question.conceptId).map(a => a.question.conceptId)).size,
      accuracyNow: accNow, accuracyPrev: accPrev,
      weakest: weakestSubject?.name ?? '—', strongest: strongestSubject?.name ?? '—',
      topMistake: topMistake ? (ERROR_TYPE_LABELS[topMistake.errorType] ?? topMistake.errorType) : 'None recorded',
      consistency: Math.round((activeDays / 7) * 100),
      timeSpent: timeLast7,
      revisionDebt: revisionItems.length,
      clinicalAccuracy: clinicalAcc7 > 0 || clinicalAcc > 0 ? (clinicalAcc7 || clinicalAcc) : 0,
      narrative,
    },
    errorPatterns: [...patternGroups.entries()].map(([errorType, g]) => ({
      errorType: ERROR_TYPE_LABELS[errorType] ?? errorType,
      count: g.count,
      examples: [...g.examples.entries()].map(([concept, count]) => ({ concept, count })).sort((a, b) => b.count - a.count).slice(0, 3),
    })).sort((a, b) => b.count - a.count),
    confusions: confusionsPayload,
  }
  void topicSubject; void estimatedRecall
  return NextResponse.json(payload)
}
