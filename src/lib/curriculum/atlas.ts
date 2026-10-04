// ─── 3D ATLAS REGISTRY — one Asset3DRecord per handcrafted diagram ──────────
// Derived programmatically from DIAGRAMS_3D so the atlas can never drift from
// the visual registry. teachingAnswers are filled from the diagram's OWN
// fields (intro, first layer, layer clinical/exam notes, clinicalCorrelation,
// quiz explanations) — never invented per entry.
//
// conceptIds are intentionally EMPTY here: the diagram→concept link is made
// later by the registry/API layer, which knows the seeded concept ids.
// Guessing ids here would create silent broken links — so we don't.

import type { Asset3DRecord } from './types'
import { DIAGRAMS_3D, type Diagram3D } from '../visual3d'

// ── Organ-system bucket per diagram key (UI grouping only — not a concept link).
// Everything is cross-referenced, not duplicated: acid–base sits with renal,
// shock/trauma with emergency, antidotes with pharmacology, etc.
const KEY_SYSTEM: Record<string, string> = {
  'c-acidbase': 'renal',
  'c-gfr': 'renal',
  'c-raas': 'cardiovascular',
  'c-coag': 'haematology',
  'c-cardcycle': 'cardiovascular',
  'c-ecg': 'cardiovascular',
  'c-brachial': 'musculoskeletal',
  'c-cranial': 'neurology',
  'c-thyroidphys': 'endocrine',
  'c-shock': 'emergency',
  'c-arrhythmia': 'cardiovascular',
  'c-hyperk': 'renal',
  'c-glycogen': 'metabolic',
  'c-antidotes': 'pharmacology',
  'c-tof': 'cardiovascular',
  'c-pph': 'obstetrics',
  'c-preec': 'obstetrics',
  'c-aki': 'renal',
  'c-dka': 'endocrine',
  'c-imnci': 'paediatrics',
  'c-thyroidstorm': 'endocrine',
  'c-schizo-frs': 'psychiatry',
  'c-sepsis': 'infectious-disease',
  'c-heartfail': 'cardiovascular',
  'c-trauma-primary': 'emergency',
  'c-torsion': 'surgery',
  'alveolus-gas-exchange': 'respiratory',
  'nephron-filtration': 'renal',
  'cardiac-conduction': 'cardiovascular',
  'hepatic-lobule': 'gastrointestinal',
  'neuromuscular-junction': 'neurology',
  'rafas-RAAS-axis': 'endocrine',
}

function systemFor(key: string): string {
  return KEY_SYSTEM[key] ?? 'general'
}

// ── Teaching answers, derived from the diagram's own authored fields ────────
// - whatAmILookingAt   ← diagram intro (the plain-language scene description)
// - whatDoesItDo       ← first layer's simple line (the entry structure's job)
// - whatIfItFails      ← first authored layer clinicalNote, else the diagram's
//                        clinical anchor line
// - clinicalImportance ← diagram clinicalCorrelation, else the clinical anchor
// - examAngle          ← first authored layer examNote, else a quiz
//                        explanation, else the clinical anchor
function teachingFor(d: Diagram3D): Asset3DRecord['teachingAnswers'] {
  const firstLayer = d.layers[0]
  const failing = d.layers.find(l => l.clinicalNote)
  const exam = d.layers.find(l => l.examNote)
  return {
    whatAmILookingAt: d.intro,
    whatDoesItDo: firstLayer ? `${firstLayer.label} — ${firstLayer.simple}` : d.title,
    whatIfItFails: failing?.clinicalNote ?? d.clinical,
    clinicalImportance: d.clinicalCorrelation ?? d.clinical,
    examAngle: exam?.examNote ?? d.quiz?.[0]?.explain ?? d.clinical,
  }
}

export const ATLAS_3D: Asset3DRecord[] = Object.entries(DIAGRAMS_3D).map(([key, d]) => ({
  diagramKey: key,
  title: d.title,
  conceptIds: [], // linked by the registry/API once concept ids are known — never guessed
  system: systemFor(key),
  handcrafted: true, // every DIAGRAMS_3D entry is a handcrafted scene
  teachingAnswers: teachingFor(d),
}))

// ── Lightweight index for UI listings (atlas grids, search, empty states) ───

export interface AtlasIndexEntry {
  diagramKey: string
  title: string
  system: string
  handcrafted: boolean
  hasQuiz: boolean
  hasSteps: boolean
  /** number of layers in the scene — handy for grid badges */
  layerCount: number
}

export function atlasIndex(): AtlasIndexEntry[] {
  return ATLAS_3D.map(a => {
    const d = DIAGRAMS_3D[a.diagramKey]
    return {
      diagramKey: a.diagramKey,
      title: a.title,
      system: a.system,
      handcrafted: a.handcrafted,
      hasQuiz: !!d?.quiz?.length,
      hasSteps: !!d?.guidedSteps?.length,
      layerCount: d?.layers.length ?? 0,
    }
  })
}
