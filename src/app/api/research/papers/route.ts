import { NextRequest, NextResponse } from 'next/server'
import { asInt, asTrimmed } from '@/lib/http'
import { searchEuropePmcPaged, EuropePmcError } from '@/lib/europepmc'

export const dynamic = 'force-dynamic'

// ─── GET /api/research/papers ───────────────────────────────────────────────
// SOURCE-FIRST paper search over Europe PMC (EBI). We return exactly what the
// upstream API gives us — hitCount is the true upstream total and papers carry
// their original-source link. Nothing here is fabricated; results are only
// cached for 10 minutes inside the Europe PMC client for politeness.

const PAGE_SIZE = 12

const FILTERS: Record<string, string> = {
  open: '(OPEN_ACCESS:Y)',
  india: '(AFF:India)',
  reviews: '(PUB_TYPE:"Review")',
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams

    const q = asTrimmed(sp.get('q'), 120)
    if (!q || q.length < 2) {
      return NextResponse.json(
        { error: 'INVALID_QUERY', hint: 'q is required — 2 to 120 characters.' },
        { status: 400 },
      )
    }

    const page = asInt(sp.get('page'), 1, 50, 1)

    const rawFilter = sp.get('filter') ?? 'all'
    const filter = rawFilter in FILTERS || rawFilter === 'all' ? rawFilter : 'all'

    const rawSort = sp.get('sort') ?? 'relevance'
    const sort = rawSort === 'date' ? 'date' : 'relevance'

    // base query always requires an abstract (so the UI always has real text)
    let eq = `${q} AND HAS_ABSTRACT:Y`
    if (filter !== 'all') eq += ` AND ${FILTERS[filter]}`

    const { hitCount, papers } = await searchEuropePmcPaged(eq, {
      pageSize: PAGE_SIZE,
      page,
      sort,
    })

    return NextResponse.json({ query: q, page, filter, sort, hitCount, papers })
  } catch (err) {
    if (err instanceof EuropePmcError) {
      console.error(`[api/research/papers] upstream ${err.kind}:`, err.message)
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
    console.error('[api/research/papers] GET failed:', err)
    return NextResponse.json({ error: 'Failed to search papers' }, { status: 500 })
  }
}
