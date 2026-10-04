// ─── LEARN PAPERS API — grounded research-paper explainers ──────────────────
// Serves PaperExplainer records (src/lib/curriculum/types.ts) from the DB
// ResearchPaper table (explainerJson), newest first. `?field=<key>` filters by
// field ('ai-in-medicine' | 'medical-education' | 'clinical-research');
// unknown fields → 400.
//
// NEVER fabricated: an empty table yields `papers: []` + an honest note —
// the API never invents papers to fill the list.

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { PaperExplainer } from '@/lib/curriculum/types'

export const dynamic = 'force-dynamic'

const VALID_FIELDS: PaperExplainer['field'][] = ['ai-in-medicine', 'medical-education', 'clinical-research']

const EMPTY_NOTE =
  'No research-paper explainers are stored yet. This list is deliberately empty — papers are never fabricated.'

export async function GET(req: NextRequest) {
  const fieldParam = req.nextUrl.searchParams.get('field')
  if (fieldParam && !VALID_FIELDS.includes(fieldParam as PaperExplainer['field'])) {
    return NextResponse.json(
      { error: `Unknown field "${fieldParam.slice(0, 80)}"`, validFields: VALID_FIELDS },
      { status: 400 },
    )
  }

  try {
    const rows = await db.researchPaper.findMany({
      where: fieldParam ? { field: fieldParam } : undefined,
      orderBy: [{ year: 'desc' }, { id: 'asc' }],
    })

    // Only well-formed explainer objects are served — malformed rows are
    // skipped rather than repaired or invented.
    const papers = rows
      .map((r) => r.explainerJson)
      .filter(isExplainerLike)
      .map((p) => p as unknown as PaperExplainer)

    return papers.length
      ? NextResponse.json({ papers, total: papers.length })
      : NextResponse.json({ papers: [], total: 0, note: EMPTY_NOTE })
  } catch (err) {
    console.error('[api/learn/papers] request failed:', err)
    return NextResponse.json({ error: 'Failed to load research papers' }, { status: 500 })
  }
}

/** Minimal structural guard: an object with a string id and a string title. */
function isExplainerLike(v: unknown): v is Record<string, unknown> {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    typeof (v as Record<string, unknown>).id === 'string' &&
    typeof (v as Record<string, unknown>).title === 'string'
  )
}
