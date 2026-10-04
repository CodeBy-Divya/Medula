/* eslint-disable no-console */
// ─── MEDULA GLOBAL LEARNING ENGINE — ADDITIVE SEEDER ────────────────────────
// Companion to prisma/seed.ts (which is DESTRUCTIVE — never confuse them).
//
// SAFE TO RE-RUN: this seeder is upsert-only. It NEVER deletes rows (no
// deleteMany anywhere) and NEVER touches user-owned tables (KnowledgeState,
// attempts, reviews, sessions, profiles…). Re-running refreshes content and
// leaves everything else untouched.
//
// Sources of truth (imported, never modified here):
//   - src/lib/curriculum/registry.ts → PACKS (subjects/topics/lessons/curriculum)
//   - src/lib/curriculum/papers.ts   → AI_MEDICINE_PAPERS (PaperExplainer[])
//   - src/lib/curriculum/atlas.ts    → ATLAS_3D (Asset3DRecord[])
//   - src/lib/curriculum/types.ts    → shared content contracts

import { PrismaClient, Prisma } from '@prisma/client'
import { PACKS, allCurriculumRecords, allSubjects } from '../src/lib/curriculum/registry'
import { AI_MEDICINE_PAPERS } from '../src/lib/curriculum/papers'
import { ATLAS_3D } from '../src/lib/curriculum/atlas'
import type {
  ConceptLesson,
  SubjectTaxonomy,
  TopicTaxonomy,
  CurriculumRecord,
  PaperExplainer,
  Asset3DRecord,
} from '../src/lib/curriculum/types'

const db = new PrismaClient()

// ContentPack is defined in registry.ts; use a structural mirror so this
// seeder never depends on that file's type exports (contract per task 19-h:
// ContentPack = { packId, subjects, topics, lessons, curriculum }).
interface ContentPackShape {
  packId: string
  subjects: SubjectTaxonomy[]
  topics: TopicTaxonomy[]
  lessons: ConceptLesson[]
  curriculum: CurriculumRecord[]
}

const DIFFICULTY: Record<ConceptLesson['educationalLevel'], number> = {
  foundation: 1,
  core: 2,
  advanced: 3,
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const truncate = (s: string, n: number) =>
  s.length <= n ? s : s.slice(0, n - 1) + '…'

// CurriculumRecord carries no id — derive a stable one from authority + scope
// (+ version when it adds information). e.g. "National Medical Commission
// (NMC)" + "MBBS CBME curriculum 2024" → "nmc-mbbs-cbme-curriculum-2024".
const curriculumSourceId = (rec: CurriculumRecord): string => {
  const acro = rec.authority.match(/\(([A-Za-z]+)\)/)
  const authorityKey = acro ? slug(acro[1]) : slug(rec.authority).split('-')[0] || 'source'
  const scopeKey = slug(rec.scope)
  const versionKey = slug(rec.version)
  const parts = [authorityKey, scopeKey]
  if (versionKey && !scopeKey.includes(versionKey)) parts.push(versionKey)
  return parts.filter(Boolean).join('-')
}

// Resolve which pack topic a lesson belongs to. The shared ConceptLesson type
// has no topicId field, so resolution is:
//   1. an additive runtime `topicId` field when a pack carries one,
//   2. the pack's only topic (single-topic packs),
//   3. id-convention match (lesson id contains the topic id / its stem).
// Returns null when unresolvable — the lesson is then skipped HONESTLY
// (a Concept row cannot be created without its topic FK).
function resolveTopicId(pack: ContentPackShape, lesson: ConceptLesson): string | null {
  const hinted = (lesson as unknown as { topicId?: string }).topicId
  if (hinted && pack.topics.some(t => t.id === hinted)) return hinted
  if (pack.topics.length === 1) return pack.topics[0].id
  for (const t of pack.topics) {
    const stem = t.id.replace(/^t-/, '')
    if (stem.length >= 5 && (lesson.id.includes(t.id) || lesson.id.includes(stem))) return t.id
  }
  return null
}

async function main() {
  const packs = PACKS as ContentPackShape[]
  const papers = AI_MEDICINE_PAPERS as PaperExplainer[]
  const atlas = ATLAS_3D as Asset3DRecord[]
  const curriculumRecords = allCurriculumRecords() as CurriculumRecord[]

  console.log(`📦 ${packs.length} content pack(s): ${packs.map(p => p.packId).join(', ') || '(none)'}`)
  console.log(`📄 ${papers.length} paper(s) · 🧊 ${atlas.length} 3D asset(s) · 📜 ${curriculumRecords.length} curriculum record(s)`)

  const counters = {
    subjectsUpserted: 0,
    topicsUpserted: 0,
    conceptsCreated: 0,
    conceptsEnriched: 0,
    lessonsSkippedNoTopic: 0,
    edgesUpserted: 0,
    edgesSkipped: 0,
    papersUpserted: 0,
    curriculumSourcesUpserted: 0,
    assets3dUpserted: 0,
    modulesUpserted: 0,
  }

  // ── 1 · Subjects (upsert by id; existing rows get full refresh) ───────────
  // allSubjects() = canonical taxonomy + pack-only additions, so the full
  // global taxonomy (incl. new pre-clinical/frontier subjects) always lands
  // before topics reference them.
  for (const s of allSubjects() as SubjectTaxonomy[]) {
    await db.subject.upsert({
      where: { id: s.id },
      create: { id: s.id, code: s.code, name: s.name, year: s.year, color: s.color, neetWeight: s.neetWeight, blurb: s.blurb },
      update: { code: s.code, name: s.name, year: s.year, color: s.color, neetWeight: s.neetWeight, blurb: s.blurb },
    })
    counters.subjectsUpserted++
  }

  // ── 2 · Topics (upsert by id; keep original parent subject on collision) ──
  for (const pack of packs) {
    for (const t of pack.topics) {
      await db.topic.upsert({
        where: { id: t.id },
        create: {
          id: t.id, subjectId: t.subjectId, name: t.name, system: t.system,
          importance: t.importance, description: t.description,
        },
        update: { name: t.name, system: t.system, importance: t.importance, description: t.description },
      })
      counters.topicsUpserted++
    }
  }

  // ── 3 · Lessons → Concept rows (create missing, enrich existing) ──────────
  for (const pack of packs) {
    for (const lesson of pack.lessons) {
      const lessonColumns = {
        lesson: lesson as unknown as Prisma.InputJsonValue,
        evidenceLevel: lesson.evidenceLevel,
        lastReviewed: lesson.lastReviewed,
        examWeight: lesson.examWeight,
      }
      const existing = await db.concept.findUnique({ where: { id: lesson.id } })
      if (!existing) {
        const topicId = resolveTopicId(pack, lesson)
        if (!topicId) {
          counters.lessonsSkippedNoTopic++
          console.warn(`  ⚠︎ skip ${lesson.id} — no resolvable topic in pack ${pack.packId}`)
          continue
        }
        await db.concept.create({
          data: {
            id: lesson.id,
            topicId,
            name: lesson.name,
            kind: lesson.kind,
            summary: lesson.oneLiner,
            whyMatters: lesson.whyMatters,
            mnemonic: lesson.mnemonics?.[0]?.hook ?? '',
            difficulty: DIFFICULTY[lesson.educationalLevel] ?? 2,
            examRelevance: lesson.examWeight,
            clinicalRelevance: 3,
            // detail omitted → stays NULL (structured explorer detail is
            // separate from the lesson layer)
            ...lessonColumns,
          },
        })
        counters.conceptsCreated++
      } else {
        // NEVER overwrite existing name/kind/graph identity — only add the
        // lesson layer + fill empty summary/whyMatters.
        await db.concept.update({
          where: { id: lesson.id },
          data: {
            ...lessonColumns,
            ...(existing.summary ? {} : { summary: lesson.oneLiner }),
            ...(existing.whyMatters ? {} : { whyMatters: lesson.whyMatters }),
          },
        })
        counters.conceptsEnriched++
      }
    }
  }

  // Concept ids that exist NOW (drives edge + module resolution)
  const conceptIds = new Set((await db.concept.findMany({ select: { id: true } })).map(c => c.id))

  // ── 4 · Cross-links → ConceptEdge (deterministic ids, skip missing) ───────
  for (const pack of packs) {
    for (const lesson of pack.lessons) {
      if (!conceptIds.has(lesson.id)) continue
      const links = lesson.crossLinks ?? []
      for (let index = 0; index < links.length; index++) {
        const link = links[index]
        if (!link.conceptId || !conceptIds.has(link.conceptId)) {
          counters.edgesSkipped++
          continue
        }
        const edgeId = `e-learn-${lesson.id}-${link.conceptId}-${index}`
        await db.conceptEdge.upsert({
          where: { id: edgeId },
          create: {
            id: edgeId, fromId: lesson.id, toId: link.conceptId,
            type: 'related_to', label: truncate(link.why, 80),
          },
          update: { type: 'related_to', label: truncate(link.why, 80) },
        })
        counters.edgesUpserted++
      }
    }
  }

  // ── 5 · Research papers ───────────────────────────────────────────────────
  for (const p of papers) {
    const explainerJson = p as unknown as Prisma.InputJsonValue
    await db.researchPaper.upsert({
      where: { id: p.id },
      create: {
        id: p.id, title: p.title, authors: p.authors, year: p.year, journal: p.journal,
        doi: p.doi ?? null, url: p.url ?? null, field: p.field, evidenceLevel: p.evidenceLevel,
        explainerJson,
      },
      update: {
        title: p.title, authors: p.authors, year: p.year, journal: p.journal,
        doi: p.doi ?? null, url: p.url ?? null, field: p.field, evidenceLevel: p.evidenceLevel,
        explainerJson,
      },
    })
    counters.papersUpserted++
  }

  // ── 6 · Curriculum sources ────────────────────────────────────────────────
  for (const rec of curriculumRecords) {
    const id = curriculumSourceId(rec)
    await db.curriculumSource.upsert({
      where: { id },
      create: {
        id, authority: rec.authority, country: rec.country, scope: rec.scope, version: rec.version,
        sourceUrl: rec.sourceUrl ?? null, lastReviewed: rec.lastReviewed,
        alignment: rec.alignment,
        subjectsCovered: rec.subjectsCovered as unknown as Prisma.InputJsonValue,
      },
      update: {
        authority: rec.authority, country: rec.country, scope: rec.scope, version: rec.version,
        sourceUrl: rec.sourceUrl ?? null, lastReviewed: rec.lastReviewed,
        alignment: rec.alignment,
        subjectsCovered: rec.subjectsCovered as unknown as Prisma.InputJsonValue,
      },
    })
    counters.curriculumSourcesUpserted++
  }

  // ── 7 · 3D atlas assets ───────────────────────────────────────────────────
  for (const a of atlas) {
    const id = a.diagramKey
    await db.asset3D.upsert({
      where: { id },
      create: {
        id, title: a.title, system: a.system, handcrafted: a.handcrafted,
        dataJson: a as unknown as Prisma.InputJsonValue,
        conceptIds: a.conceptIds as unknown as Prisma.InputJsonValue,
      },
      update: {
        title: a.title, system: a.system, handcrafted: a.handcrafted,
        dataJson: a as unknown as Prisma.InputJsonValue,
        conceptIds: a.conceptIds as unknown as Prisma.InputJsonValue,
      },
    })
    counters.assets3dUpserted++
  }

  // ── 8 · Starter learning modules ──────────────────────────────────────────
  type ModuleStep = { conceptId: string; label: string; note?: string }

  // Lessons that ended up represented in the DB, ordered by topic order.
  const ensuredLessons: { pack: ContentPackShape; lesson: ConceptLesson; order: number }[] = []
  packs.forEach((pack, packIndex) => {
    pack.lessons.forEach((lesson, lessonIndex) => {
      if (!conceptIds.has(lesson.id)) return
      const topicIndex = pack.topics.findIndex(t => t.id === resolveTopicId(pack, lesson))
      ensuredLessons.push({
        pack, lesson,
        order: topicIndex >= 0 ? topicIndex * 1000 + lessonIndex : 100000 + packIndex * 1000 + lessonIndex,
      })
    })
  })

  const aiPack = packs.find(p =>
    /(^|-)ai(-|$)/i.test(p.packId) ||
    p.subjects.some(s => s.id.includes('ai-') || /artificial intelligence/i.test(s.name)))

  const aiSteps: ModuleStep[] = aiPack
    ? ensuredLessons
        .filter(e => e.pack === aiPack)
        .sort((a, b) => a.order - b.order)
        .map(e => ({ conceptId: e.lesson.id, label: e.lesson.name, note: e.lesson.oneLiner }))
    : []

  await db.learningModule.upsert({
    where: { id: 'ai-medicine-pathway' },
    create: {
      id: 'ai-medicine-pathway',
      title: 'AI in Medicine — full pathway',
      kind: 'pathway',
      blurb: aiSteps.length
        ? `Every AI-in-medicine lesson in curriculum order — ${aiSteps.length} concepts from foundations to clinical deployment.`
        : 'AI-in-medicine pathway — fills automatically as AI content lands in the packs.',
      stepsJson: aiSteps as unknown as Prisma.InputJsonValue,
    },
    update: {
      title: 'AI in Medicine — full pathway',
      stepsJson: aiSteps as unknown as Prisma.InputJsonValue,
    },
  })
  counters.modulesUpserted++

  // Clinical reasoning track: concepts whose lessons carry full reasoning
  // chains, in curriculum order. Honest-empty when none exist yet.
  const reasoningSteps: ModuleStep[] = ensuredLessons
    .filter(e => (e.lesson.reasoning?.length ?? 0) >= 3)
    .sort((a, b) => a.order - b.order)
    .map(e => ({
      conceptId: e.lesson.id, label: e.lesson.name,
      note: `Reasoning chain · ${e.lesson.reasoning?.length ?? 0} steps`,
    }))

  await db.learningModule.upsert({
    where: { id: 'clinical-reasoning-basics' },
    create: {
      id: 'clinical-reasoning-basics',
      title: 'Clinical reasoning — from symptom to management',
      kind: 'reasoning-track',
      blurb: reasoningSteps.length
        ? `Complete symptom → mechanism → management chains. ${reasoningSteps.length} reasoning-rich concepts.`
        : 'Reserved reasoning track — fills automatically once reasoning-rich lessons exist in the packs.',
      stepsJson: reasoningSteps as unknown as Prisma.InputJsonValue,
    },
    update: {
      stepsJson: reasoningSteps as unknown as Prisma.InputJsonValue,
    },
  })
  counters.modulesUpserted++

  // ── 9 · Final counts (DB truth, not just this run) ────────────────────────
  const [subjects, topics, concepts, edgesDb, papersDb, sourcesDb, assetsDb, modulesDb, lessonsStored] =
    await Promise.all([
      db.subject.count(),
      db.topic.count(),
      db.concept.count(),
      db.conceptEdge.count(),
      db.researchPaper.count(),
      db.curriculumSource.count(),
      db.asset3D.count(),
      db.learningModule.count(),
      db.concept.count({ where: { lesson: { not: Prisma.AnyNull } } }),
    ])

  console.log('\n✅ Additive learn-seed complete — zero rows deleted (upsert-only):')
  console.table([
    { metric: 'subjects (DB total)', value: subjects },
    { metric: 'topics (DB total)', value: topics },
    { metric: 'concepts (DB total)', value: concepts },
    { metric: 'concepts created this run', value: counters.conceptsCreated },
    { metric: 'concepts enriched this run', value: counters.conceptsEnriched },
    { metric: 'lessons stored (lesson != null)', value: lessonsStored },
    { metric: 'lessons skipped (no resolvable topic)', value: counters.lessonsSkippedNoTopic },
    { metric: 'edges upserted this run', value: counters.edgesUpserted },
    { metric: 'edges skipped (missing concept)', value: counters.edgesSkipped },
    { metric: 'edges (DB total)', value: edgesDb },
    { metric: 'research papers', value: papersDb },
    { metric: 'curriculum sources', value: sourcesDb },
    { metric: '3D atlas assets', value: assetsDb },
    { metric: 'learning modules', value: modulesDb },
    { metric: 'subjects upserted (packs)', value: counters.subjectsUpserted },
    { metric: 'topics upserted (packs)', value: counters.topicsUpserted },
    { metric: 'papers upserted (packs)', value: counters.papersUpserted },
    { metric: 'curriculum sources upserted (packs)', value: counters.curriculumSourcesUpserted },
    { metric: '3D assets upserted (atlas)', value: counters.assets3dUpserted },
    { metric: 'modules upserted', value: counters.modulesUpserted },
  ])
}

main()
  .then(() => db.$disconnect())
  .catch(e => {
    console.error('❌ seed-learn failed:', e)
    void db.$disconnect()
    process.exit(1)
  })
