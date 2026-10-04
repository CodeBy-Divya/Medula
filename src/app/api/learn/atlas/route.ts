// ─── LEARN ATLAS API — 3D diagram assets ────────────────────────────────────
// Serves the 3D atlas: DB Asset3D rows when present, static ATLAS_3D fallback
// when the table is empty. Every entry carries the diagram's own teaching
// answers (never invented) and honestly-derived concept links:
//   · conceptIds from the DB row when non-empty (validated against real
//     Concept ids — broken references are dropped, not served);
//   · plus the deterministic link diagramKey === Concept.id (26 of the 32
//     handcrafted diagram keys ARE seeded concept ids) — the link the atlas
//     registry explicitly deferred to this layer.
//
// `?system=<key>` filters by organ system; unknown keys vs SYSTEMS → 400.

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ATLAS_3D } from '@/lib/curriculum/atlas'
import { SYSTEMS } from '@/lib/curriculum/taxonomy'
import { DIAGRAMS_3D } from '@/lib/visual3d'
import type { Asset3DRecord } from '@/lib/curriculum/types'

export const dynamic = 'force-dynamic'

// Legacy DB tags folded into canonical SYSTEMS keys — mirrors
// LEGACY_SYSTEM_ALIASES in registry.ts (not exported there, so restated here).
const LEGACY_SYSTEM_ALIASES: Record<string, string> = {
  hematology: 'haematology',
  infectious: 'immune-infection',
  neurology: 'nervous',
}

function canonicalSystem(raw: string | null | undefined): string | null {
  if (!raw) return null
  return LEGACY_SYSTEM_ALIASES[raw] ?? raw
}

export async function GET(req: NextRequest) {
  const systemParam = req.nextUrl.searchParams.get('system')
  if (systemParam && !SYSTEMS.some((s) => s.system === systemParam)) {
    return NextResponse.json(
      {
        error: `Unknown system "${systemParam.slice(0, 80)}"`,
        validSystems: SYSTEMS.map((s) => s.system),
      },
      { status: 400 },
    )
  }

  try {
    const [rows, conceptRows] = await Promise.all([
      db.asset3D.findMany(),
      db.concept.findMany({ select: { id: true } }),
    ])
    const conceptIdSet = new Set(conceptRows.map((c) => c.id))
    const staticByKey = new Map(ATLAS_3D.map((a) => [a.diagramKey, a]))

    const assets = (rows.length ? rows.map(fromDbRow) : ATLAS_3D.map(fromStatic))
      .map((a) => enrich(a, conceptIdSet, staticByKey))
      .filter((a) => (systemParam ? canonicalSystem(a.system) === systemParam : true))

    return NextResponse.json({
      source: rows.length ? 'db' : 'static',
      total: assets.length,
      assets,
    })
  } catch (err) {
    console.error('[api/learn/atlas] request failed:', err)
    return NextResponse.json({ error: 'Failed to load atlas assets' }, { status: 500 })
  }
}

// ── Row → record shapers (guarded — malformed fields never crash the route) ─

type AtlasAsset = {
  diagramKey: string
  title: string
  system: string
  handcrafted: boolean
  conceptIds: string[]
  teachingAnswers: Asset3DRecord['teachingAnswers'] | null
}

function fromDbRow(row: {
  id: string
  title: string
  system: string
  handcrafted: boolean
  dataJson: unknown
  conceptIds: unknown
}): AtlasAsset {
  const data = isRecord(row.dataJson) ? row.dataJson : null
  return {
    diagramKey: row.id,
    title: row.title || (typeof data?.title === 'string' ? data.title : row.id),
    system: row.system || (typeof data?.system === 'string' ? data.system : 'general'),
    handcrafted: row.handcrafted,
    conceptIds: stringArray(row.conceptIds),
    teachingAnswers: teachingAnswersOf(data?.teachingAnswers),
  }
}

function fromStatic(a: Asset3DRecord): AtlasAsset {
  return {
    diagramKey: a.diagramKey,
    title: a.title,
    system: a.system,
    handcrafted: a.handcrafted,
    conceptIds: a.conceptIds.filter((id) => typeof id === 'string'),
    teachingAnswers: a.teachingAnswers,
  }
}

/** Enrich with validated concept links + static teachingAnswers fallback. */
function enrich(
  asset: AtlasAsset,
  conceptIdSet: Set<string>,
  staticByKey: Map<string, Asset3DRecord>,
): AtlasAsset & { hasQuiz: boolean; hasSteps: boolean; layerCount: number } {
  // concept links: DB-declared ∩ real concepts, plus the deterministic
  // diagramKey === Concept.id link. Never guessed, never fabricated.
  const declared = asset.conceptIds.filter((id) => conceptIdSet.has(id))
  const derived = conceptIdSet.has(asset.diagramKey) ? [asset.diagramKey] : []
  const conceptIds = Array.from(new Set([...declared, ...derived]))

  const d = DIAGRAMS_3D[asset.diagramKey]
  const teachingAnswers = asset.teachingAnswers ?? staticByKey.get(asset.diagramKey)?.teachingAnswers ?? null

  return {
    ...asset,
    conceptIds,
    teachingAnswers,
    hasQuiz: !!d?.quiz?.length,
    hasSteps: !!d?.guidedSteps?.length,
    layerCount: d?.layers.length ?? 0,
  }
}

// ── guards ──────────────────────────────────────────────────────────────────

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function stringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
}

function teachingAnswersOf(v: unknown): Asset3DRecord['teachingAnswers'] | null {
  if (!isRecord(v)) return null
  const keys: (keyof Asset3DRecord['teachingAnswers'])[] = [
    'whatAmILookingAt', 'whatDoesItDo', 'whatIfItFails', 'clinicalImportance', 'examAngle',
  ]
  const ok = keys.every((k) => typeof v[k] === 'string')
  return ok ? (v as unknown as Asset3DRecord['teachingAnswers']) : null
}
