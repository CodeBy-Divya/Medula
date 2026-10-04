import { NextRequest, NextResponse } from 'next/server'
import { SOURCE_REGISTRY, searchRegistry, type SourceKind } from '@/lib/institutions-registry'

export const dynamic = 'force-dynamic'

// ─── INSTITUTIONAL SOURCE REGISTRY API ───────────────────────────────────────
// GET /api/institutions            → full registry
// GET /api/institutions?kind=AIIMS → filtered by kind
// GET /api/institutions?q=nmc      → name/slug/country search
//
// A discovery index of official sources — metadata and official URLs only.
// "Verified" means the official domain was confirmed via live web search on
// the shown date. This is NOT a ranking and NOT an endorsement.

const VALID_KINDS: SourceKind[] = ['AIIMS', 'GOVERNMENT', 'DATABASE', 'GLOBAL_UNIVERSITY', 'SOCIETY']

const DISCLAIMER =
  'A discovery index of official sources — metadata and official URLs only. ' +
  '"Verified" means the official domain was confirmed via live web search on the shown date. ' +
  'This is not a ranking.'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams

  const kindParam = params.get('kind')
  if (kindParam && !VALID_KINDS.includes(kindParam as SourceKind)) {
    return NextResponse.json(
      { error: `Invalid kind "${kindParam}". Valid kinds: ${VALID_KINDS.join(', ')}.` },
      { status: 400 },
    )
  }

  const q = (params.get('q') ?? '').trim()
  let institutions = q ? searchRegistry(q) : [...SOURCE_REGISTRY]

  if (kindParam) {
    const kind = kindParam as SourceKind
    institutions = institutions.filter((r) => r.kind === kind)
  }

  return NextResponse.json({
    count: institutions.length,
    institutions,
    disclaimer: DISCLAIMER,
  })
}
