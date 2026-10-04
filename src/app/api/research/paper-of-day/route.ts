import { NextResponse } from 'next/server'
import { searchEuropePmc, EuropePmcError } from '@/lib/europepmc'
import type { NormalizedPaper } from '@/lib/europepmc'

export const dynamic = 'force-dynamic'

// ─── GET /api/research/paper-of-day ─────────────────────────────────────────
// A deterministic daily paper pick, computed in IST. Same day → same paper for
// every visitor. The pick rotates through a fixed pool of 14 real topic areas
// and indexes into that day's open-access result pool sorted by citations.
// This is selection by arithmetic, not curation — the note says so verbatim.

const TOPIC_POOL = [
  'sepsis',
  'myocardial infarction',
  'tuberculosis',
  'diabetes mellitus type 2',
  'antimicrobial resistance',
  'artificial intelligence in medicine',
  'hypertension',
  'iron deficiency anemia',
  'acute stroke',
  'cancer immunotherapy',
  'vaccination',
  'telemedicine',
  'neonatal sepsis',
  'vitamin d deficiency',
] as const

const POOL_SIZE = 14
const CANDIDATES = 25
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

const NOTE =
  "Selected deterministically from today's open-access pool — not an editorial endorsement."

interface PodResponse {
  date: string
  topic: string
  paper: NormalizedPaper | null
  note: string
}

// cache keyed by YYYYMMDD — a day boundary naturally invalidates the entry
const podCache = new Map<number, { at: number; data: PodResponse }>()

function istDayNumber(): number {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
  return Number(ymd.replaceAll('-', ''))
}

function istDateString(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
}

export async function GET() {
  try {
    const istDay = istDayNumber()
    const cached = podCache.get(istDay)
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return NextResponse.json(cached.data)
    }

    const topic = TOPIC_POOL[istDay % POOL_SIZE]
    const query = `(${topic}) AND HAS_ABSTRACT:Y AND (OPEN_ACCESS:Y) AND (SRC:MED)`

    const { papers } = await searchEuropePmc(query, {
      pageSize: CANDIDATES,
      sort: 'cited',
    })

    // deterministic index into today's pool; fall back to the last available
    // paper if upstream returned fewer than 25 records — never fabricate
    const pickIndex = istDay % CANDIDATES
    const paper =
      papers.length > 0 ? (papers[pickIndex] ?? papers[papers.length - 1]) : null

    const data: PodResponse = { date: istDateString(), topic, paper, note: NOTE }
    podCache.set(istDay, { at: Date.now(), data })
    return NextResponse.json(data)
  } catch (err) {
    if (err instanceof EuropePmcError) {
      console.error(`[api/research/paper-of-day] upstream ${err.kind}:`, err.message)
      return NextResponse.json(
        {
          error: err.kind,
          hint:
            err.kind === 'TIMEOUT'
              ? 'Europe PMC took too long to respond — try again.'
              : 'Europe PMC is unreachable — try again shortly.',
        },
        { status: 502 },
      )
    }
    console.error('[api/research/paper-of-day] GET failed:', err)
    return NextResponse.json({ error: 'Failed to load paper of the day' }, { status: 500 })
  }
}
