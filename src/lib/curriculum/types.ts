// ─── MEDULA Learn Engine — content contracts ────────────────────────────────
// Shared types for the global medical learning layer. Every content pack
// (src/lib/curriculum/packs/*) and every API that serves lessons conforms to
// these types. Additive only — never rename or remove fields (packs in the
// wild depend on them).

// ── Sources & attribution ───────────────────────────────────────────────────
// Content is INDEPENDENTLY SYNTHESIZED — sources are references/attribution,
// never claims of copied material. See the anti-fabrication rules in
// worklog + AUDIT.md: a source entry must be a real, publicly-accessible
// institution/resource. If a URL is not certain, omit it and keep the name.

export type SourceType =
  | 'course'               // Harvard HMX, MIT OCW…
  | 'guideline'            // WHO, NICE, ACC/AHA…
  | 'health-organization'  // WHO, CDC, NIH, NMC…
  | 'journal'              // NEJM, Lancet, BMJ…
  | 'database'             // PubMed/NCBI, ClinicalKey-free indexes…
  | 'hospital-reference'   // Johns Hopkins Medicine, Mayo patient education…
  | 'open-courseware'      // MIT OCW, OpenStax…
  | 'exam-authority'       // NMC/NBEMS documents…

export interface SourceRef {
  /** Institution/author, e.g. "Harvard Medical School HMX" */
  institution: string
  /** What this reference is, e.g. "Concepts discussed in HMX Pharmacology" */
  title: string
  /** Only include when the URL is real and publicly reachable; omit otherwise */
  url?: string
  sourceType: SourceType
  year?: number
  /** Honest framing, e.g. "Reference — content independently synthesized" */
  accessNote?: string
}

// ── Global perspective (education comparison — never medical advice) ────────

export type Region = 'India' | 'United States' | 'United Kingdom' | 'WHO/Global'

export interface GlobalPerspectiveEntry {
  region: Region
  /** Terminology differences, e.g. "US: epinephrine · UK: adrenaline" */
  terminology?: string[]
  /** How clinical workflow/order differs (educational description) */
  workflow?: string
  screening?: string
  diagnosis?: string
  treatment?: string
  emergency?: string
  /** Healthcare delivery / setting differences */
  delivery?: string
  /** Training / residency structure differences */
  training?: string
  /** Required — neutral framing sentence; never rank systems */
  note: string
}

// ── Drugs, procedures, numbers ──────────────────────────────────────────────

export interface DrugNote {
  name: string
  drugClass: string
  mechanism: string
  note?: string // exam pearl / caution
}

export interface ProcedureNote {
  name: string
  what: string
  steps?: string[]
}

export interface NumberFact {
  label: string      // "Normal serum K⁺"
  value: string      // "3.5–5.0 mEq/L"
  note?: string      // why it matters / cutoff meaning
}

export interface DifferentialNote {
  name: string
  /** The one distinguishing feature students must not miss */
  key: string
}

export interface MnemonicNote {
  hook: string     // the mnemonic itself
  expands: string  // what it expands to
}

// ── Clinical reasoning chain (symptom → mechanism → …) ──────────────────────

export interface ReasoningStep {
  stage: 'symptom' | 'mechanism' | 'differential' | 'investigation' | 'interpretation' | 'diagnosis' | 'management' | 'complication'
  label: string
  detail: string
}

// ── Cross-subject connections ───────────────────────────────────────────────

export interface CrossLink {
  /** conceptId when the target exists in the graph; omit when external */
  conceptId?: string
  label: string       // "ACE inhibitors (Pharmacology)"
  why: string         // why the connection matters
  subject?: string
}

// ── THE LESSON — every concept's full structured content ────────────────────
// Not every field is required for every concept; the UI renders exactly what
// exists and never invents the rest. Flagship concepts fill nearly all fields.

export interface ConceptLesson {
  /** Stable concept id — MUST match the seeded Concept row */
  id: string
  name: string
  kind: string // 'disease' | 'process' | 'drug' | 'structure' | 'sign' | 'investigation' | 'procedure' | 'principle' | 'ai-concept' | …
  oneLiner: string        // "What is it?" — one plain sentence
  whyMatters: string      // "Why does it matter?"

  // Layered explanations (progressive disclosure)
  explain30s: string      // "Explain in 30 seconds"
  eli5: string            // beginner version — short sentences. Analogy first.
  firstPrinciples: string[] // step-by-step build-up ("learning it for the first time")
  normal?: string         // normal anatomy/physiology baseline
  mechanism?: string      // mechanism / pathophysiology
  presentation?: string[] // clinical presentation
  diagnosis?: string[]    // investigations & diagnostic approach
  differentials?: DifferentialNote[]
  management?: string[]   // management PRINCIPLES (educational; never a prescription)
  complications?: string[]
  numbers?: NumberFact[]
  drugs?: DrugNote[]
  procedures?: ProcedureNote[]
  imaging?: string        // imaging correlation
  pathologyCorrelation?: string

  // Memory & exam
  mistakes?: string[]     // common mistakes / frequently confused
  mnemonics?: MnemonicNote[]
  examRelevance?: string  // how it is actually asked
  clinicalRelevance?: string // real-world practice relevance
  analogies?: string[]
  teachDeeper?: string[]  // "Teach me deeper" expansion threads

  // Connections & reasoning
  crossLinks?: CrossLink[]
  reasoning?: ReasoningStep[] // clinical reasoning pathway

  // Global layer
  global?: GlobalPerspectiveEntry[]

  // Quality metadata (content quality system)
  evidenceLevel: 'established' | 'widely-taught' | 'emerging' | 'varies-by-guideline'
  sourceConfidence: 'high' | 'medium' | 'review-needed'
  lastReviewed: string    // ISO date, e.g. '2026-10-05'
  clinicalUpdateRequired?: boolean
  educationalLevel: 'foundation' | 'core' | 'advanced'
  examWeight: number      // 1..5
  globalRelevance?: 'universal' | 'high' | 'regional'
  /** Shown near management content: "Verify against current guidelines" */
  verifyNote?: string

  // Sources & further reading (attribution, never reproduction)
  sources: SourceRef[]
}

// ── Taxonomy: phases, subjects, systems, topics ─────────────────────────────

export type Phase = 'pre-clinical' | 'para-clinical' | 'clinical' | 'specialized' | 'frontier'

export interface SubjectTaxonomy {
  /** Stable slug id matching the DB Subject row (e.g. 'anatomy') */
  id: string
  code: string        // short code, e.g. 'ANAT'
  name: string
  latinName?: string  // atlas naming tradition (Morphologia, …)
  phase: Phase
  /** Canonical MBBS year 1..4; 0 = spans years / not year-bound */
  year: number
  color: string
  blurb: string
  /** Organ systems / domains this subject contributes to (overlap mapping) */
  systems: string[]
  /** Subjects whose content overlaps — cross-referenced, not duplicated */
  overlapsWith?: string[]
  /** NEET-PG weight % (exam relevance; may be 0 for frontier subjects) */
  neetWeight: number
  icon?: string // lucide icon name hint
}

export interface TopicTaxonomy {
  id: string
  subjectId: string
  name: string
  /** Organ system tag, e.g. 'cardiovascular' */
  system: string
  importance: number // 1..5
  description: string
}

// ── Curriculum registry (sourcing/versioning — update without UI rewrites) ──

export interface CurriculumRecord {
  authority: string        // "National Medical Commission (NMC)"
  country: string
  scope: string            // "MBBS CBME curriculum 2024"
  subjectsCovered: string[] // subject ids
  version: string
  sourceUrl?: string
  lastReviewed: string
  /** How closely this pack follows the authority's structure */
  alignment: 'official-structure' | 'concept-aligned' | 'supplementary'
}

// ── 3D atlas registry entry ────────────────────────────────────────────────

export interface Asset3DRecord {
  /** Diagram key in visual3d DIAGRAMS_3D or generated-fallback tag */
  diagramKey: string
  title: string
  conceptIds: string[]
  system: string
  /** true when handcrafted; false = generated layered fallback (honest) */
  handcrafted: boolean
  teachingAnswers: {
    whatAmILookingAt: string
    whatDoesItDo: string
    whatIfItFails: string
    clinicalImportance: string
    examAngle: string
  }
}

// ── Research paper explainer (grounded — never invent papers) ───────────────

export interface PaperExplainer {
  /** Sanity-unique slug, e.g. 'esteva-2017-dermatology' */
  id: string
  title: string
  authors: string       // "Esteva A, Kuprel B, et al."
  year: number
  journal: string
  doi?: string          // include ONLY when certain
  url?: string          // only when certain (doi.org / publisher public page)
  question: string      // research question
  dataset: string       // dataset/population
  method: string
  result: string        // main result (honest, no invented numbers)
  meaning: string       // clinical meaning
  limitations: string[]
  whyMatters: string
  simpleExplain: string // "Explain this paper simply"
  field: 'ai-in-medicine' | 'medical-education' | 'clinical-research'
  evidenceLevel: 'systematic-review' | 'rct' | 'meta-analysis' | 'cohort' | 'landmark-study' | 'guideline' | 'emerging-research'
  /** uncertainty is fine — label it instead of inventing */
  confidenceNote?: string
}

// ── API payloads ───────────────────────────────────────────────────────────

export interface LearnHomePayload {
  continueLearning: {
    conceptId: string
    conceptName: string
    subjectName: string
    subjectColor: string
    mastery: number
    estRecall: number
    reason: string
  }[]
  recommendedNext: {
    conceptId: string
    conceptName: string
    subjectName: string
    reason: string
    examWeight: number
  } | null
  weakConcepts: {
    conceptId: string
    conceptName: string
    subjectName: string
    mastery: number
  }[]
  recentlyStudied: {
    conceptId: string
    conceptName: string
    at: string
  }[]
  phases: {
    phase: Phase
    label: string
    subjects: {
      id: string; code: string; name: string; color: string; year: number
      topicCount: number; conceptCount: number; mastery: number
      neetWeight: number; systems: string[]
    }[]
  }[]
  systems: {
    system: string
    label: string
    subjectCount: number
    topicCount: number
    conceptCount: number
    subjects: string[]
  }[]
  hasLessonCoverage: number // how many concepts carry full lessons
  totals: { subjects: number; topics: number; concepts: number; lessons: number; diagrams3d: number; papers: number; aiConcepts: number }
}
