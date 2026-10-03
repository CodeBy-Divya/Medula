import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { QuestionClient } from '@/lib/types'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// mix=high-yield → subjects sampled proportionally to their NEET-PG weight
// mix=weak       → prefer questions tied to the profile's weak/unstable concepts
// mix=random     → uniform shuffle (default)
type Mix = 'random' | 'high-yield' | 'weak'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const subjectCode = sp.get('subjectCode') ?? undefined
  const system = sp.get('system') ?? undefined
  const conceptId = sp.get('conceptId') ?? undefined
  const qtype = sp.get('qtype') ?? undefined
  const mix = (sp.get('mix') ?? 'random') as Mix
  const count = Math.min(50, Math.max(1, Number(sp.get('count') ?? 10)))

  const where: Record<string, unknown> = {}
  if (subjectCode) where.subjectCode = subjectCode
  if (system) where.system = system
  if (conceptId) where.OR = [{ conceptId }, { concept: { edgesIn: { some: { fromId: conceptId } } } }]
  if (qtype) where.qtype = qtype

  const all = await db.question.findMany({ where, take: 500 })

  const shuffle = <T,>(arr: T[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  let pool: typeof all
  if (mix === 'high-yield' && all.length > 0) {
    // Weighted sampling: subjects with higher NEET-PG weight contribute more.
    const subjects = await db.subject.findMany()
    const weightByCode = new Map(subjects.map(s => [s.code, Math.max(1, s.neetWeight)]))
    const buckets = new Map<string, typeof all>()
    for (const q of shuffle([...all])) {
      const arr = buckets.get(q.subjectCode) ?? []
      arr.push(q)
      buckets.set(q.subjectCode, arr)
    }
    const picked: typeof all = []
    // Repeat weight-proportioned rounds until the ask is met or pools run dry
    while (picked.length < count) {
      const remaining = [...buckets.entries()].filter(([, arr]) => arr.length > 0)
      if (!remaining.length) break
      const totalWeight = remaining.reduce((a, [code, arr]) => a + (weightByCode.get(code) ?? 1) * arr.length, 0)
      let ticket = Math.random() * totalWeight
      let chosen = remaining[0]
      for (const entry of remaining) {
        ticket -= (weightByCode.get(entry[0]) ?? 1) * entry[1].length
        if (ticket <= 0) { chosen = entry; break }
      }
      const [code, arr] = chosen
      picked.push(arr.pop()!)
      if (arr.length === 0) buckets.delete(code)
    }
    pool = picked
  } else if (mix === 'weak') {
    // Prefer questions tied to weak/unstable knowledge states, fill with random.
    const profile = await getDemoProfile()
    const states = await db.knowledgeState.findMany({ where: { profileId: profile.id } })
    const weakIds = new Set(
      states.filter(s => s.status === 'weak' || s.status === 'unstable').map(s => s.conceptId),
    )
    const shuffled = shuffle([...all])
    const preferred = shuffled.filter(q => q.conceptId && weakIds.has(q.conceptId))
    const rest = shuffled.filter(q => !(q.conceptId && weakIds.has(q.conceptId)))
    pool = [...preferred, ...rest].slice(0, count)
  } else {
    // shuffle deterministically-ish then slice
    pool = shuffle([...all]).slice(0, count)
  }

  const questions: QuestionClient[] = pool.map(q => ({
    id: q.id, stem: q.stem,
    options: (q.options as { id: string; text: string }[]),
    difficulty: q.difficulty, qtype: q.qtype, subjectCode: q.subjectCode, system: q.system,
  }))
  return NextResponse.json({ questions, available: all.length })
}
