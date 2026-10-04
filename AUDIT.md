# MEDULA — Executive Product Audit & Implementation Roadmap

**Date:** 2026-02 · **Scope:** Full application audit (frontend/backend/DB), competitive intelligence (8 Indian NEET-PG platforms + AI-native challengers), pain-point analysis, AI-native product design, P0–P3 roadmap.
**Method:** Two parallel code audits (frontend ~14,260 LOC / backend 30 routes / 18 Prisma models / live DB), 40+ verified web searches (App Store listings, pricing pages, Reddit/Quora student threads, exam-fact sources). Claims labeled VERIFIED (source opened) vs ASSUMED (inference).

---

## 1. Current Architecture

- **Single route `/`** (Next.js 16 App Router), Zustand view-switching to 11 app views + 4 global overlays, hash-mirrored (`#/map`), last-view persisted (`medos:last-view`), session gated by localStorage flag `medos:session` (no cookies).
- **Stack:** TypeScript 5, Tailwind 4 (`@theme inline` oklch tokens, claymorphism `.clay*` utilities), shadcn/ui, framer-motion with `useReducedMotion` guards, Prisma + SQLite (`db/custom.db`, 632 KB), z-ai-web-dev-sdk (backend only), SW PWA-lite (network-only API).
- **Learning engine** (`src/lib/engine.ts`): Ebbinghaus recall `e^(−t/(S·1.6))`, SM-2-lite SRS (grades 0–3, caps 180d), heuristic mastery updates, NEXT_BEST_ACTION scoring `recallRisk·0.30 + weakness·0.28 + examRelevance·0.22 + yearMatch·0.10 + errorCount·0.10`, plan/roadmap/exam-clock builders.
- **Content:** 19 subjects → 59 topics → 88 concepts → 121 edges; 182 Qs / 115 flashcards / 17 confusion pairs / 4 clinical cases; Understand catalogue (39 topics, 6 living SVG scenes) is client-side static.
- **AI surface:** exactly one endpoint (`/api/tutor`, 8 modes, safety preamble, RAG-lite concept grounding, temp 0.4).

## 2. Feature Inventory (A–Q categories)

| Category | Features | Status |
|---|---|---|
| A Core learning | Learn browser, concept explorer (why-chains, edges), 3D diagrams | **Complete** |
| B Question bank | Practice config, mixes (random/high-yield/weak), error-type tagging, confidence | **Complete** (no image-based/PYQ types) |
| C Mock tests | Grand Mock 100, custom builder, palette, negative marking, report | **Complete** (100 sequential POSTs; retry-wrong local-only) |
| D Video learning | — | **Missing** (by design: 3D scenes instead) |
| E Notes | Concept detail sections; logbook | **Partial** (no personal notes layer) |
| F Revision | SRS flashcards, revision debt, due concepts | **Complete** (grade chips 32px; double session-logging bug) |
| G AI | Tutor (8 modes), Socratic pair-drills | **Partial** (no streaming, no rate limit, no grounding in concept detail) |
| H Analytics | Progress rings, 120-day heatmap, weekly narrative, error patterns | **Complete** (descriptive, not prescriptive; recentAccuracy cross-profile bug) |
| I Personalization | Onboarding (7 steps), NBA engine, plan segments | **Partial** (examMode never persists — bug) |
| J Social | — | **Missing** |
| K Gamification | Streaks (UTC bug), heatmap | **Partial** (no missions/leagues) |
| L Productivity | Roadmap planner (7-day blocks), internship rotations | **Complete** |
| M Subscription | — | **Missing** (demo) |
| N Notifications | Toasts only | **Partial** |
| O Admin/CMS | — | **Missing** (content lives in seed files) |
| P Search | ⌘K palette over 6 entities + synonyms | **Complete** (Understand topics not indexed; results navigate by view) |
| Q Medical content infra | Knowledge graph + confusion pairs + case steps | **Complete** (no image bank, no PYQ layer) |

## 3. Broken / Half-Wired (verified)

1. **Landing "EXPLORE THE MEDICAL MAP" → infinite spinner** without session (`page.tsx` hydration gate).
2. **"TAKE THE AUDIT" opens Progress instead of AuditView** (`dashboard-view.tsx:585`).
3. **Exam-mode toggle never persists** — `/api/profile` drops `examMode/examLabel/examDate` while the client sends them.
4. **`recentAccuracy()` lacks `profileId` filter** (`dashboard/route.ts`) — accuracy computed across ALL profiles.
5. **UTC streak bug** — sessions before 05:30 IST count to previous UTC day; entire audience is IST.
6. **Tutor persona says "MEDOS"** (`tutor/route.ts:75`) — stale brand leaks into chat.
7. `undefined` class `map-scene-dawn`; dead `logSession` stub; fabricated logbook stats ("entries × 3") & static profile follow-up card; BranchGalaxy duplicate fetch; dashboard "START block" always 6 Qs regardless of duration.
8. No `error.tsx`/`not-found.tsx` — uncaught render error white-screens the SPA.

## 4. Missing Features (gap vs market)

Image-based questions, PYQ layer, video/lecture loop, personal notes, real auth, admin CMS, subscriptions, notifications, community, adaptive sequencing beyond NBA, image banks, offline content, Hinglish voice.

## 5. Competitor Comparison (VERIFIED unless noted)

| Platform | Suite anchors | Price (iOS list) | Rating | Key weakness |
|---|---|---|---|---|
| **Marrow** | QBank king, GTs "closest to real exam", Edition 8.5, Notes, 1L+ test series | Plan C ₹44,900/yr | 4.69×35k | "complex af" UI, price/FOMO fatigue, no adaptive path, no daily-loop |
| **PrepLadder** (Unacademy) | 18k Qs, SPARK SRS, Rapid Revision, Audio QBank | PRO ₹16,500 | — | Notes complaints, brand chaos, no LLM tutor |
| **PW MedEd** | 25k Qs, 850h video, MEDVERSE 3D, named faculty | ₹6,900–18,500 | 3.82×809 | polish + analytics depth |
| **Cerebellum** | Mission 4.0, Hyperrevision, Codons, CoreBTR 4.74×12k | ₹19.5k–36.5k | 3.78×3.6k | app experience worst-in-class among majors |
| **DAMS** | classrooms, DVT, "Cortex AI" golden points | ₹3k–105k range | 3.62×6.4k | AI is video-timestamps only |
| **DBMCI/eGurukul** | 30k Qs claim, guru-connect | ₹49,900 | **2.97×2.3k** | legacy tech; being rolled into Marrow's parent |
| **DocTutorials** | Daily Targets, Seat Predictor, transparent unbundled pricing | ₹4,999–44,999 | 4.31×2.4k | brand gravity |
| **Oncourse AI** | AI planner/adaptive QBank (closest analogue, tiny) | — | — | early stage |

**Table stakes:** 19-subject videos, big QBank + custom modules, GT/test series, notes/rapid revision, faculty stars, SRS/flashcards, live classes, mentorship.
**Universal gaps (blue ocean, VERIFIED absences):** ① no true adaptive engine anywhere ("custom module" = manual filters); ② no LLM doubt-tutor; ③ analytics descriptive-not-prescriptive; ④ retention = content cadence, no habit design; ⑤ coupon whiplash + price distrust; ⑥ fragmented video/notes/test surfaces; ⑦ GT-score trauma unhandled; ⑧ exam-cycle volatility (2024 two-shift, 2025 cutoff revisions) unmanaged; ⑨ no conversational Hinglish; ⑩ no mid-cycle re-planning.

**Exam facts (VERIFIED):** 200 Qs / 210 min / 800 marks / +4 −1 0; 2025 cutoff UR 276; 2026 UR 262 (6-yr low).

## 6. Student Pain Points (top 12 of 38 catalogued)

1. Huge-syllabus paralysis → no one sequences "what tonight?" from *your* errors. 2. GT score trauma/demotivation (community-verified). 3. Forgetting → revision converges into last-45-days panic. 4. Video-length fatigue. 5. "Marrow is complex af" navigation overload. 6. Price FOMO ("are offers a scam??"). 7. Repeat-attempter despair (1.1L→4.5k attrition cohort). 8. Subject-skipping triage outsourced to Reddit. 9. Notes quality (PL "horrible"). 10. No calibration between practice and rank. 11. Fragmented surfaces (watch/solve/revise separate). 12. Mental-health toll ("mentally breaking down").

## 7. AI Opportunities (student-outcome-bound)

Grounded doubt-tutor (already 70% there) → **prescriptive daily loop** (errors → tonight's plan → re-test) → **Mistake intelligence** (recurring confusion detection) → **Readiness Score with methodology** (calibration, not GT trauma) → rapid-revision generation from mastered concepts → variant-question generation (guarded, later) → Hinglish voice drills (later). Every AI feature ships with a visible student outcome + honest "model estimate" labeling.

## 8. UX Problems (top 10)

Landing dead-end; mobile bottom-nav buries Revise/Tutor/Progress (6/11 views drawer-only); no safe-area insets despite standalone PWA; no skip-link; map is pointer-only; homepage stacks duplicate rings + 19-tile index duplicating orbits; sub-44px targets (mock palette 24px, revise chips 32px); no error boundary; fabricated micro-stats erode trust; Understand rail mixes live scenes with 33 static cards.

## 9. Performance

No caching layer (all `force-dynamic`); `/api/progress` 9 queries + O(n²) in-memory joins; `/api/dashboard` ~12 queries (2 wasted COUNTs); `take:500`-then-shuffle in questions; 100 sequential POSTs per Grand Mock; no streaming on tutor; missing indexes (Question.subjectCode, QuestionAttempt(profileId,createdAt), FlashcardReview.dueAt…). Latency fine at current scale (10–50 ms), degrades non-linearly later.

## 10. Security

**CRITICAL:** no server-side auth/authz (localStorage theater, `getDemoProfile()` = first row); client-trusted scoring (case completion, tutor-drill, sessions) → streaks/points fiction-capable. **HIGH:** zero input validation on mutating routes (NaN/FK 500s; unbounded `audit/submit` array = DoS); unthrottled AI spend. **MEDIUM:** no rate limiting; read-modify-write races (no `$transaction`); `ErrorPattern` NULL-unique flaw; `ignoreBuildErrors: true`. **LOW:** hardcoded demo creds; no security headers; prisma query logging in prod. Zero SQL-injection risk (no raw SQL); no secrets beyond demo password.

## 11. Monetization (recommended, for later)

Freemium intelligence wedge: free QBank + paid AI personalization ("MEDULA Intelligence"), transparent flat pricing (anti-coupon positioning), institutional B2B (colleges/DAMS-class partners) later. Defensible because the *personalization data* compounds per student — not the content library.

## 12. Differentiation — THE MOAT ANSWER

**"If Marrow, PrepLadder, PW, DAMS copied our product tomorrow, what would still be hard to replace?"**

1. **The personal data flywheel**: every attempt, error-type, confidence rating, recall grade, and scene-focus event feeds one mastery model. A copy of our *features* without 6 months of *your* data is a copy of day zero. Marrow's moat is content volume (copiable at cost); ours is per-student state.
2. **The closed prescriptive loop** — plan → act → measure → re-plan — is an *architecture*, not a feature checkbox. Competitors must retrofit their entire analytics spine.
3. **Honest-calibration brand**: we show methodology, uncertainty bands, and "model estimate" labels — the anti-GT-trauma position incumbents structurally can't take (their marketing runs on score anxiety).
4. **The living-scene layer** (6 SVG theatres, spotlight engine) is craft-moat content, expensive to replicate with equal quality.

**Positioning:** *"The control centre of your medical mind."* — not a course marketplace; an OS that tells you what to study tonight, what you're forgetting, and whether you're on track, with receipts.

## 13. 50+ Feature Ideas (scored V/D/C/R/Re, 10 each; P = priority)

**Build now (top 10):** 1. Mistake Book 2.0 (9/9/4/6/9→P92) 2. Readiness Score w/ methodology (9/9/5/7/9→P91) 3. Prescriptive daily mission hardening (9/8/5/7/9→P90) 4. Understand→engine wiring (7/8/3/5/8→P79) 5. Mobile IA fix + More sheet (8/5/4/6/9→P78) 6. Validation/transaction hardening (5/2/5/4/8→P71) 7. Retry-wrong server sync (7/5/4/5/8→P76) 8. Search index Understand topics (6/6/4/4/7→P67) 9. AI streaming tutor (7/7/5/6/7→P66) 10. Focus/skip-link a11y pass (5/2/3/3/7→P60).
**Later top 10:** PYQ layer, image-based Qs (radial/derm/ECG bank), custom notes layer, weekly AI re-plan email/push, leagues w/ friends, Hinglish voice drills, GT simulator w/ normalization scenarios, seat-predictor band, admin CMS, real auth+multi-user.
**Not worth building:** generic chatbot (no outcome), social feed, video hosting, degree/certification tracking, gamified pets/avatars.

## 14. Feature Scoring Method

V student value, D differentiation, C complexity (higher = costlier), R revenue potential, Re retention impact; **P = (2V+2D+R+2Re) − C** (retention and differentiation double-weighted for an exam-prep OS).

## 15. P0 / P1 / P2 / P3 Roadmap

**P0 (this round — correctness & trust):** landing spinner dead-end · audit CTA wiring · profile examMode persistence · dashboard `profileId` accuracy fix · IST streak math · MEDOS→MEDULA tutor persona · try/catch + validation hardening on mutating routes · `error.tsx`/`not-found.tsx` · safe-area + bottom-nav overlap · Understand→engine session wiring.
**P1 (this round — differentiators):** Mistake Book 2.0 (API + tab: error-type intelligence, recurring-confusion detection, wrong-Q re-drill, confusion radar) · Readiness Score (interpretable composite: coverage/accuracy/retention/consistency/mock — methodology shown) · mobile nav curation (Home/Questions/Revise/Tutor + More sheet) · touch-target cleanup on the two worst offenders.
**P2:** batch attempts endpoint, streaming tutor, search Understand index, PYQ layer, weekly re-plan, leagues, real auth (httpOnly cookie + middleware), indexes + SQL aggregates, admin seed CMS.
**P3:** image QBank, voice Hinglish, exam-uncertainty simulator, seat-predictor bands, institutional tier.

## 16–20. Implementation Plan (this round)

**Order:** AUDIT → P0 batch → P1 features (parallel: Mistake Book by subagent A; nav/a11y by subagent B; Readiness + Understand wiring by main) → QC (lint, dev.log, agent-browser E2E of every touched flow) → worklog.
**Files (P0):** `page.tsx`, `dashboard-view.tsx`, `api/profile/route.ts`, `api/dashboard/route.ts`, `api/attempts/route.ts`, `api/revision/review/route.ts`, `api/sessions/route.ts`, `api/audit/submit/route.ts`, `api/cases/[id]/complete/route.ts`, `api/tutor/route.ts`, `engine.ts`, `app-shell.tsx`, `globals.css`, new `app/error.tsx`, `app/not-found.tsx`.
**Files (P1):** new `api/mistakes/route.ts` + `lib/mistake-intel.ts` + Questions "Mistakes" tab; `api/readiness/route.ts` + dashboard/progress cards; `api/understand/complete/route.ts`; nav More sheet.
**No destructive DB changes** — additive only (indexes deferred to P2 with migrations story). **Testing:** lint + agent-browser scripted E2E per flow + dev.log sweep after each phase.
**Definition of Done (round):** all P0 bugs fixed & E2E-verified; Mistake Book + Readiness Score live & honest (methodology visible, no fabricated numbers); mobile bottom nav covers the daily loop; lint 0; no regressions in existing flows.
