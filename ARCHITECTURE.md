# ARCHITECTURE.md — MEDULA · Medical Knowledge OS (Phase 2)

## 1. Layered system (spec §100)

```
OFFICIAL SOURCES (AIIMS · NMC/ICMR/MoHFW · WHO/CDC/NIH · Harvard/JHU/Stanford/Mayo)
        │  metadata only · verified domains · link-out always
        ▼
KNOWLEDGE GRAPH  (Subject → Topic → Concept --ConceptEdge--> Concept)
        │  19 subjects · 59 topics · 88 concepts · 121 typed edges
        ▼
AI INTELLIGENCE  (grounded, cited, refuses when unknown)
        │
   ┌────┼──────────────┬───────────────┐
   ▼    ▼              ▼               ▼
 LEARN         DISCOVER          RESEARCH
 (map/learn/   (Explore: grouped (Europe PMC papers,
 understand/   search + summary)  paper-of-day, explain,
 questions/                       saved library)
 cases/revise)
   └────┬──────────────┴───────────────┘
        ▼
PERSONAL KNOWLEDGE STATE  (KnowledgeState · Ebbinghaus recall · SM-2-lite · NBA scoring)
        ▼
NEXT BEST ACTION  (dashboard readiness + mission + roadmap)
```

The knowledge flywheel (§88): DISCOVER → LEARN → CONNECT → PRACTICE → RESEARCH →
back to DISCOVER. Explore ↔ Research ↔ Understand ↔ Questions are wired together
(`researchSeedQuery` store handoff; mistake-book → focused drills).

## 2. Module map (what exists today)

| Layer | Modules | Status |
|---|---|---|
| Learning OS | dashboard · map · understand (living SVG scenes) · learn · questions (+Mistake Book) · cases · revise · tutor · progress · readiness · roadmap · audit | ✅ |
| Discovery | `ExploreView` + `/api/explore` (4 parallel legs: local graph · Europe PMC · registry · live web) | ✅ new |
| Research | `ResearchView` + `/api/research/{papers,paper-of-day,explain,saved}` | ✅ new |
| Source layer | `institutions-registry.ts` + `/api/institutions` + `SOURCE_REGISTRY.md` | ✅ new |
| AI | `/api/tutor` (8 modes, temp 0.4, RAG-lite) · `/api/research/explain` (RAG-locked, temp 0.3) · explore summary (grounded + numbered citations) | ✅ |
| Engine | `src/lib/engine.ts` — recall `e^(−t/(S·1.6))`, SM-2-lite, NBA `recallRisk·.30 + weakness·.28 + relevance·.22 + yearMatch·.10 + errors·.10`, IST day-keys | ✅ |
| Mentorship / pipeline / guidelines / 3D | flagged OFF (`src/lib/feature-flags.ts`) | ⏳ phased |

## 3. AI architecture (spec §67–68)

- **Specialized, not one giant agent**: tutor (study), research-explainer (papers),
  discovery-summarizer (search). Each has its own strict system prompt.
- **RAG-lite contract**: retrieval first → model may only use retrieved text → cite
  [1][2] → say "not stated / sources don't answer" otherwise → AI output always
  labelled (`⚠️ AI interpretation — verify at the original source`).
- **Prompt-injection stance (§66)**: external abstracts/snippets are *data*, never
  instructions; prompts forbid instruction-following from retrieved text; SDK is
  backend-only; temperatures ≤ 0.4.
- Planned: streaming tutor, vector+graph hybrid retrieval (§69) — P2.

## 4. Navigation & routing

SPA on `/`: Zustand view registry (`APP_VIEWS`), hash deep-links (`#/explore`,
`#/research`), last-view memory, session-gated render (no dead-end spinners).
Desktop sidebar 13 items; mobile = Home/Questions/Revise/Tutor + accessible More
sheet (auto-derives `NAV − MOBILE_NAV`, safe-area aware, focus-trapped).

## 5. Security posture

Validation hardening on all mutating routes (`src/lib/http.ts`), `$transaction`
write paths, caps on unbounded payloads, typed 400/404/502s, upstream timeouts +
TTL caches to protect third-party APIs. Known, documented gaps (AUDIT.md §10):
demo localStorage auth (no server authz yet — P2 real-auth milestone), client-side
scoring in cases (validated but replayable).

## 6. Feature flags (§104)

`ENABLE_EXPLORE · ENABLE_RESEARCH_HUB · ENABLE_INSTITUTION_EXPLORER ·
ENABLE_PAPER_EXPLAIN` = ON. `MENTORSHIP · SOURCE_PIPELINE · GUIDELINE_COMPARE ·
PAPER_DIFFICULTY · COURSE_HUB` = OFF until their phase (each has a stated blocker —
e.g. paper difficulty ships only with a verified methodology, never a guess).

## 7. Phase ledger (spec §101)

Done: ① research/registry ② this doc ③ schema doc ④ graph (pre-existing, extended)
⑤ search (Explore) ⑥ pipeline (flagged) ⑦ map ⑧ learning engine ⑨ research hub ⑩
courses folded into Explore. Next: ⑪ mentorship (needs real auth) ⑫ advanced viz.
