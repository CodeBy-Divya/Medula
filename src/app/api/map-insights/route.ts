import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// ─── MAP INSIGHTS ───
// Powers the dashboard "Medical Universe" hero: branch orbit stats,
// struggle zones (hardest topics students repeatedly fail), and
// curriculum-source trust badges.

export interface MapBranch {
  id: string
  code: string
  name: string
  color: string
  year: number
  emoji: string
  neetWeight: number
  mastery: number
  conceptCount: number
  status: 'new' | 'weak' | 'unstable' | 'strong'
}

export interface StruggleZone {
  conceptId: string
  name: string
  subjectCode: string
  subjectName: string
  subjectColor: string
  difficulty: number
  examRelevance: number
  mastery: number
  reason: string
}

export interface MapInsights {
  branches: MapBranch[]
  struggleZones: StruggleZone[]
  counts: { concepts: number; edges: number; subjects: number; questions: number; flashcards: number; cases: number }
  totals: { avgMastery: number; strongCount: number; weakCount: number }
}

// Subject emoji map — each branch of the Medical Universe gets a friendly face.
const SUBJECT_EMOJI: Record<string, string> = {
  anatomy: '🦴', physiology: '🫀', biochemistry: '🧬', pathology: '🔬', pharmacology: '💊',
  microbiology: '🦠', fmt: '⚖️', cm: '🌍', ent: '👂', opht: '👁️', medicine: '🩺',
  surgery: '🚑', obgy: '🤰', peds: '👶', orth: '🦿', derm: '🧴', psy: '🧠', rad: '🔭', anes: '😴',
}

export async function GET() {
  const profile = await getDemoProfile()

  const [subjects, concepts, states, edges, qCount, fCount, cCount] = await Promise.all([
    db.subject.findMany({ orderBy: { year: 'asc' } }),
    db.concept.findMany({ include: { topic: { include: { subject: true } } } }),
    db.knowledgeState.findMany({ where: { profileId: profile.id } }),
    db.conceptEdge.count(),
    db.question.count(),
    db.flashcard.count(),
    db.clinicalCase.count(),
  ])

  const stateMap = new Map(states.map(s => [s.conceptId, s]))
  const bySubject = new Map<string, { total: number; masterySum: number; mapped: number; strong: number; weak: number }>()
  for (const c of concepts) {
    const sid = c.topic.subjectId
    const entry = bySubject.get(sid) ?? { total: 0, masterySum: 0, mapped: 0, strong: 0, weak: 0 }
    entry.total++
    const st = stateMap.get(c.id)
    if (st) {
      entry.mapped++
      entry.masterySum += st.score
      if (st.status === 'strong') entry.strong++
      if (st.status === 'weak') entry.weak++
    }
    bySubject.set(sid, entry)
  }

  const branches: MapBranch[] = subjects.map(s => {
    const agg = bySubject.get(s.id) ?? { total: 0, masterySum: 0, mapped: 0, strong: 0, weak: 0 }
    const mastery = agg.mapped > 0 ? Math.round(agg.masterySum / agg.mapped) : 0
    const status: MapBranch['status'] =
      agg.mapped === 0 || mastery <= 0 ? 'new' : mastery < 45 ? 'weak' : mastery < 70 ? 'unstable' : 'strong'
    return {
      id: s.id, code: s.code, name: s.name, color: s.color, year: s.year,
      emoji: SUBJECT_EMOJI[s.id] ?? '🧑‍⚕️', neetWeight: s.neetWeight,
      mastery, conceptCount: agg.total, status,
    }
  })

  // Struggle zones: hard concepts (difficulty >= 4) with weak/absent mastery.
  const zones: StruggleZone[] = concepts
    .map(c => {
      const st = stateMap.get(c.id)
      return { c, difficulty: c.difficulty, examRelevance: c.examRelevance, mastery: st?.score ?? 0 }
    })
    .filter(x => x.difficulty >= 4 && x.mastery < 45)
    .sort((a, b) => (b.difficulty * (100 - b.mastery) * b.examRelevance) - (a.difficulty * (100 - a.mastery) * a.examRelevance))
    .slice(0, 6)
    .map(({ c, difficulty, examRelevance, mastery }) => ({
      conceptId: c.id, name: c.name,
      subjectCode: c.topic.subject.code, subjectName: c.topic.subject.name, subjectColor: c.topic.subject.color,
      difficulty, examRelevance, mastery,
      reason: mastery === 0
        ? 'Not yet attempted — high difficulty × high exam yield'
        : `Repeatedly missed (mastery ${mastery}% on a difficulty-${difficulty} topic)`,
    }))

  const avgMastery = states.length ? Math.round(states.reduce((a, s) => a + s.score, 0) / states.length) : 0
  const strongCount = states.filter(s => s.status === 'strong').length
  const weakCount = states.filter(s => s.status === 'weak').length

  const payload: MapInsights = {
    branches, struggleZones: zones,
    counts: { concepts: concepts.length, edges, subjects: subjects.length, questions: qCount, flashcards: fCount, cases: cCount },
    totals: { avgMastery, strongCount, weakCount },
  }
  return NextResponse.json(payload)
}
