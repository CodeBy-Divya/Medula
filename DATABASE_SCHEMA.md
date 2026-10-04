# DATABASE_SCHEMA.md — MEDULA (Phase 3)

SQLite via Prisma (`db/custom.db`). Rule: primitive columns only (no list types) —
arrays are `Json` string-encoded. Push with `bun run db:push`.

## 1. Core — student (stable, Task 1–14)

`StudentProfile` (1 row demo; year 1–6, prepStage, hours, learningStyles, resources,
examMode/Label/Date, onboarded) → relations: KnowledgeState · QuestionAttempt ·
FlashcardReview · RevisionItem · StudySession · ErrorPattern · CaseRun · ResourceLog ·
**SavedPaper (new)**.

## 2. Curriculum graph (the pre-Existing Knowledge Graph, §73)

- `Subject` (code, year, neetWeight) → `Topic` (system, importance) → `Concept`
  (kind: concept|disease|drug|investigation|physiology|…; detail sections; difficulty;
  exam/clinical relevance) — **KnowledgeNode**
- `ConceptEdge` (type: prerequisite_of|causes|treated_by|diagnosed_by|
  complication_of|differential_of|commonly_tested_with|…; label) — **KnowledgeEdge**
- `KnowledgeState` per (profile, concept): score, stability, estRecall, status,
  priority — the *personal layer* over the global graph (§49).

Content: `Question` (options/explanation/teaching/qtype) · `Flashcard` ·
`ConfusionPair` (aPoints/bPoints/mnemonic) · `ClinicalCase` (steps JSON) ·
`ErrorPattern` · `RevisionItem` · `FlashcardReview` (SM-2-lite fields) ·
`StudySession` · `CaseRun` · `ResourceLog` · `LogbookEntry`.

## 3. New — Research Hub (metadata layer only)

`SavedPaper` — profile-scoped paper library.
- Key: `@@unique([profileId, pmid])` (upsert-safe re-saves).
- Provenance required by design (§6): `source` (default `EUROPE_PMC`), `url`
  (doi.org / europepmc.org link), `doi`, `journal`, `pubYear`, `authors`,
  `abstract` (plain-text, HTML stripped).
- User layer: `tags Json` (≤12×40), `note`.
- **We never store or reproduce full papers — metadata + abstract + link only.**

API note: during the dev-server hot window the saved route uses parameterized
`$queryRaw/$executeRaw` against the identical schema; a normal `db.savedPaper`
switch is safe after any server restart.

## 4. Phased entities (spec §72–74) — DO NOT CREATE until the phase activates

| Phase flag | Planned tables |
|---|---|
| `ENABLE_MENTORSHIP` | Mentor (verification status enum: VERIFIED / SELF_REPORTED / UNVERIFIED) · MentorshipRequest · Conversation |
| `ENABLE_SOURCE_PIPELINE` | Source (source_id, license, accessType, retrievalDate, reviewStatus) · SourceVersion (WHAT CHANGED) · DocumentChunk · Embedding · Institution/Department (crawler targets) |
| `ENABLE_GUIDELINE_COMPARE` | Guideline (org, issued, updated, officialUrl) + GuidelineVersion |
| Research workspace (§23) | ResearchProject · ResearchInterest · Citation (pull from SavedPaper, don't duplicate) |
| Perf (P2) | indexes on QuestionAttempt(profileId, createdAt), StudySession(profileId, date); fix ErrorPattern NULL-unique |

## 5. Migration history

Task 14: examMode fields, detail JSON, IST-safe defaults — additive only.
Task 15: **+SavedPaper** (additive; `db:push` clean, no data loss). Seed remains
`prisma/seed.ts` (real curriculum content; no fabricated external sources).
