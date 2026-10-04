// ─── MEDULA Learn Engine — content pack registry ────────────────────────────
// The merger. Packs (src/lib/curriculum/packs/*) declare subjects, topics,
// concept lessons and curriculum records; this module merges them into the
// single source of truth the API layer reads. Pure, synchronous, DB-free.
//
// Merge rules:
//   · Entries dedupe by id. A later entry overrides an earlier one; a
//     console.warn fires when the two entries actually differ (identical
//     duplicates — e.g. packs re-listing taxonomy slices — merge silently).
//   · SUBJECT_TAXONOMY (taxonomy.ts) is the canonical subject base and is
//     merged in FIRST, so packs can only sharpen it, never lose it.
//   · Pack order defines precedence: the LAST pack in PACKS wins on clash.

import type { ConceptLesson, CurriculumRecord, Phase, SubjectTaxonomy, TopicTaxonomy } from './types'
import { SUBJECT_TAXONOMY, SYSTEMS } from './taxonomy'
import { aiMedicinePack } from './packs/ai-medicine'
import { preClinicalPack } from './packs/pre-clinical'
import { paraClinicalPack } from './packs/para-clinical'
import { clinicalPack } from './packs/clinical'

// ── Content packs ───────────────────────────────────────────────────────────

export interface ContentPack {
  packId: string
  subjects: SubjectTaxonomy[]
  topics: TopicTaxonomy[]
  lessons: ConceptLesson[]
  curriculum: CurriculumRecord[]
}

/** Order = precedence. Later packs override earlier ones on id clash. */
export const PACKS: ContentPack[] = [
  aiMedicinePack,
  preClinicalPack,
  paraClinicalPack,
  clinicalPack,
]

// ── Merge helpers ───────────────────────────────────────────────────────────

function mergeById<T extends { id: string }>(items: T[], label: string): T[] {
  const byId = new Map<string, T>()
  for (const item of items) {
    const existing = byId.get(item.id)
    if (existing && JSON.stringify(existing) !== JSON.stringify(item)) {
      console.warn(
        `[curriculum/registry] duplicate ${label} id "${item.id}" — later entry overrides earlier`,
      )
    }
    byId.set(item.id, item) // later wins
  }
  return [...byId.values()]
}

function curriculumKey(record: CurriculumRecord): string {
  return `${record.authority}|${record.country}|${record.scope}`
}

function mergeCurriculumRecords(records: CurriculumRecord[]): CurriculumRecord[] {
  const byKey = new Map<string, CurriculumRecord>()
  for (const record of records) {
    const existing = byKey.get(curriculumKey(record))
    if (existing && JSON.stringify(existing) !== JSON.stringify(record)) {
      console.warn(
        `[curriculum/registry] duplicate curriculum record "${record.authority}" (${record.country}) — later entry overrides earlier`,
      )
    }
    byKey.set(curriculumKey(record), record) // later wins
  }
  return [...byKey.values()]
}

// ── Merged accessors (memoized; module re-eval on HMR resets the cache) ─────

let subjectsCache: SubjectTaxonomy[] | null = null

/** All subjects: canonical taxonomy wins; packs may only ADD subjects. */
export function allSubjects(): SubjectTaxonomy[] {
  if (!subjectsCache) {
    const packOnly = PACKS.flatMap((pack) => pack.subjects).filter(
      (s) => !SUBJECT_TAXONOMY.some((t) => t.id === s.id),
    )
    subjectsCache = [...SUBJECT_TAXONOMY, ...packOnly]
  }
  return subjectsCache
}

let topicsCache: TopicTaxonomy[] | null = null

/** All topics across packs, deduped by id. */
export function allTopics(): TopicTaxonomy[] {
  if (!topicsCache) {
    topicsCache = mergeById(PACKS.flatMap((pack) => pack.topics), 'topic')
  }
  return topicsCache
}

let lessonsCache: ConceptLesson[] | null = null

/** All concept lessons across packs, deduped by id (== DB Concept id). */
export function allLessons(): ConceptLesson[] {
  if (!lessonsCache) {
    lessonsCache = mergeById(PACKS.flatMap((pack) => pack.lessons), 'lesson')
  }
  return lessonsCache
}

let lessonsByConceptIdCache: Map<string, ConceptLesson> | null = null

/** Lesson lookup keyed by concept id (the id packs share with Concept rows). */
export function lessonsByConceptId(): Map<string, ConceptLesson> {
  if (!lessonsByConceptIdCache) {
    lessonsByConceptIdCache = new Map(allLessons().map((lesson) => [lesson.id, lesson]))
  }
  return lessonsByConceptIdCache
}

/** Topics of one subject, in pack order (taxonomy-consistent). */
export function topicsBySubject(subjectId: string): TopicTaxonomy[] {
  return allTopics().filter((topic) => topic.subjectId === subjectId)
}

/** The subject that owns a topic — null when the topic id is unknown. */
export function subjectOfTopic(topicId: string): SubjectTaxonomy | null {
  const topic = allTopics().find((t) => t.id === topicId)
  if (!topic) return null
  return allSubjects().find((subject) => subject.id === topic.subjectId) ?? null
}

/** Phase of a subject — null when the subject id is unknown. */
export function phaseOfSubject(subjectId: string): Phase | null {
  return allSubjects().find((subject) => subject.id === subjectId)?.phase ?? null
}

// ── Organ-system index ──────────────────────────────────────────────────────

export interface SystemIndexEntry {
  system: string
  topics: TopicTaxonomy[]
  /**
   * Concept lessons attributable to this system at the registry level.
   * Registry data carries no hard topic→lesson edge (lesson ids map to DB
   * Concept rows, which link to topics via Concept.topicId), so this counts
   * lessons matched through the documented convention below — 0 when the
   * convention is unused. NEVER fabricated. The API layer computes
   * authoritative per-system concept counts from the DB
   * (Concept.topicId → Topic.system) and overrides this where it matters.
   */
  concepts: number
}

/**
 * Registry-level topic→lesson join convention: a lesson belongs to a topic
 * when lesson.id equals the topic id or starts with "<topicId>--".
 * Pack authors may follow it; nobody is forced to, and 0 is an honest answer.
 */
function lessonBelongsToTopic(lessonId: string, topicId: string): boolean {
  return lessonId === topicId || lessonId.startsWith(`${topicId}--`)
}

/**
 * Legacy system tags that already exist on seeded DB topics. They are folded
 * into the canonical SYSTEMS keys so no topic silently disappears from the
 * systems explorer. Anything unknown still surfaces as its own entry —
 * normalization never drops content.
 */
const LEGACY_SYSTEM_ALIASES: Record<string, string> = {
  hematology: 'haematology',
  infectious: 'immune-infection',
  neurology: 'nervous',
}

/**
 * Index of topics (and convention-matched lessons) per organ system.
 * Every canonical SYSTEMS key is present even when empty, so the explorer
 * can render a stable axis; unrecognized tags appear as extra entries.
 */
export function systemIndex(): Map<string, SystemIndexEntry> {
  const index = new Map<string, SystemIndexEntry>()
  for (const s of SYSTEMS) {
    index.set(s.system, { system: s.system, topics: [], concepts: 0 })
  }

  const lessons = allLessons()
  const countedLessons = new Map<string, Set<string>>() // system → lesson ids already counted

  for (const topic of allTopics()) {
    const key = LEGACY_SYSTEM_ALIASES[topic.system] ?? topic.system
    let entry = index.get(key)
    if (!entry) {
      entry = { system: key, topics: [], concepts: 0 }
      index.set(key, entry)
    }
    entry.topics.push(topic)

    let counted = countedLessons.get(key)
    if (!counted) {
      counted = new Set<string>()
      countedLessons.set(key, counted)
    }
    for (const lesson of lessons) {
      if (!counted.has(lesson.id) && lessonBelongsToTopic(lesson.id, topic.id)) {
        counted.add(lesson.id)
        entry.concepts += 1
      }
    }
  }
  return index
}

// ── AI-medicine concept ids ─────────────────────────────────────────────────

/** Concept lesson ids declared by the ai-medicine pack (deduped, order kept). */
export const AI_CONCEPT_IDS: string[] = Array.from(
  new Set(aiMedicinePack.lessons.map((lesson) => lesson.id)),
)

// ── Curriculum registry ─────────────────────────────────────────────────────

/**
 * The 19 subject ids already seeded in the DB — a frozen contract.
 * Every authority record that "covers the MBBS curriculum" starts here;
 * packs may extend coverage to newer subjects (histology, emergency
 * medicine, ai-medicine, …) with their own records.
 */
export const MBBS_CORE_SUBJECT_IDS: string[] = [
  'anatomy', 'physiology', 'biochemistry', 'pathology', 'pharmacology',
  'microbiology', 'fmt', 'cm', 'ent', 'opht', 'medicine', 'surgery',
  'obgy', 'peds', 'orth', 'derm', 'psy', 'rad', 'anes',
]

/** Every non-frontier subject in taxonomy order (the classical disciplines). */
const CLASSICAL_SUBJECT_IDS: string[] = SUBJECT_TAXONOMY
  .filter((subject) => subject.phase !== 'frontier')
  .map((subject) => subject.id)

/**
 * Foundational authority records that anchor the whole taxonomy. Kept here —
 * not in a pack — because they are references for the registry itself, not
 * per-phase content. Descriptions stay general and safe: they describe how
 * MEDULA aligns to each authority, never what the authority "contains".
 * lastReviewed is the date this registry's framing was last checked.
 */
const FOUNDATIONAL_CURRICULUM_RECORDS: CurriculumRecord[] = [
  {
    authority: 'National Medical Commission (NMC)',
    country: 'India',
    scope: 'MBBS CBME curriculum 2024',
    subjectsCovered: [...MBBS_CORE_SUBJECT_IDS],
    version: 'CBME-2024',
    sourceUrl: 'https://www.nmc.org.in',
    lastReviewed: '2026-10-05',
    alignment: 'official-structure',
  },
  {
    authority: 'United States Medical Licensing Examination (USMLE)',
    country: 'United States',
    scope: 'USMLE Step examinations — concept-level alignment of the classical disciplines',
    subjectsCovered: [...CLASSICAL_SUBJECT_IDS],
    version: 'alignment-2026-10',
    sourceUrl: 'https://www.usmle.org',
    lastReviewed: '2026-10-05',
    alignment: 'concept-aligned',
  },
  {
    authority: 'General Medical Council (GMC)',
    country: 'United Kingdom',
    scope: 'Outcomes for graduates — concept-level alignment of the classical disciplines',
    subjectsCovered: [...CLASSICAL_SUBJECT_IDS],
    version: 'alignment-2026-10',
    sourceUrl: 'https://www.gmc-uk.org',
    lastReviewed: '2026-10-05',
    alignment: 'concept-aligned',
  },
  {
    authority: 'World Health Organization (WHO)',
    country: 'WHO/Global',
    scope: 'Global health guidance — supplementary references across the MBBS core and frontier topics',
    subjectsCovered: [...MBBS_CORE_SUBJECT_IDS, 'ai-medicine'],
    version: 'alignment-2026-10',
    sourceUrl: 'https://www.who.int',
    lastReviewed: '2026-10-05',
    alignment: 'supplementary',
  },
]

/**
 * The full curriculum registry: foundational authority records + every
 * pack-declared record, deduped on authority|country|scope (later wins).
 */
export const CURRICULUM_REGISTRY: CurriculumRecord[] = mergeCurriculumRecords([
  ...FOUNDATIONAL_CURRICULUM_RECORDS,
  ...PACKS.flatMap((pack) => pack.curriculum),
])

/** Function form of CURRICULUM_REGISTRY — the accessor seed scripts and API
 *  routes import. Same merged, deduped array on every call. */
export function allCurriculumRecords(): CurriculumRecord[] {
  return CURRICULUM_REGISTRY
}
