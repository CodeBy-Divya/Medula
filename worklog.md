# PROJECT MEDOS — Worklog
AI-Powered MBBS → NEET-PG Learning Operating System

## Product Architecture (final decisions)
- **Constraint**: Single Next.js page route `/` (SPA with Zustand view routing). All backend = `/api/*` routes.
- **Stack**: Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui + Framer Motion + Prisma/SQLite + z-ai-web-dev-sdk (backend only).
- **Design**: "Medical OS" premium dark-first theme — deep midnight navy, clinical cyan primary, amber/red severity, glass surfaces, large typography. Light mode supported.
- **Views**: landing | onboarding | home | map | learn | questions | cases | revise | tutor | progress | roadmap | profile (+ concept explorer overlay + global search).
- **Knowledge engine** (`src/lib/engine.ts`): Ebbinghaus forgetting curve (R = e^(-t/S)), per-concept KnowledgeState, spaced repetition (SM-2-lite), NEXT_BEST_ACTION scoring (recall risk + weakness + exam relevance + year match + error patterns).
- **Content**: All-original educational content. Subjects per NMC CBME structure (19 subjects), concepts as graph nodes with typed edges, ~60 original MCQs, ~50 flashcards, 4+ clinical cases, confusion pairs, disease/drug/investigation deep dives.
- **Task IDs**: 1 (schema), 1b (seed), 1c (libs), 1d (APIs), 2-a..2-f (parallel view subagents), 3 (shell wiring), 4 (QA), 5 (cron).

---
Task ID: 0
Agent: main
Task: Project initialization + architecture

Work Log:
- Inspected scaffold (Next 16, shadcn/ui installed, Prisma SQLite at db/custom.db, dev server on :3000)
- Wrote architecture decisions above

Stage Summary:
- Ready for schema build

---
Task ID: 1/1b/1c/1d
Agent: main
Task: Schema, seed, libs, APIs

Work Log:
- Prisma schema: StudentProfile, Subject/Topic/Concept/ConceptEdge (graph), Question/Attempt, KnowledgeState, Flashcard/Review, RevisionItem, StudySession, ErrorPattern, ConfusionPair, ClinicalCase/CaseRun, ResourceLog
- Seed: 19 NMC-CBME subjects, 25 topics, 45 concepts (rich detail for flagship chains: RAAS, nephrotic/nephritic, ACS, DKA, Graves, TB), ~80 typed edges, 55 original MCQs, 64 flashcards, 4 progressive clinical cases, 6 confusion pairs, demo student "Arpit" (Y2, serious prep) w/ 30-day history
- Libs: types.ts, store.ts (zustand), engine.ts (forgetting curve R=e^(-t/1.6S), SRS, NEXT_BEST_ACTION scoring, exam clock, roadmap builder), api.ts client, graph-layout.ts force layout
- APIs: profile, dashboard, graph (scoped), concepts/[id] (why-chain assembled), subjects, questions, attempts (+error-type → confusion detection), revision (+review SRS, +clear), cases (+step, +complete), tutor (z-ai SDK, 7 modes, safety rules), roadmap, progress (heatmap, weekly report, confusions), search (synonyms/abbrevs), sessions. All smoke-tested 200.

Stage Summary:
- Backend complete and verified. Frontend views next: shared context = use `@/lib/api`, `@/lib/types`, `@/lib/store`; theme classes in globals.css (.glass, .med-grid, sev-ok/warn/crit, ink-soft); shadcn/ui in src/components/ui; framer-motion + recharts available; single-page app — navigation via useAppStore.setView, concept drill-in via openConcept.

---
Task ID: 2-b
Agent: frontend-styling-expert
Task: Dashboard view

Work Log:
- Read contracts: types.ts (DashboardPayload/NextAction/PlanSegment/PREP_STAGE_LABELS), api.ts, store.ts, globals.css theme tokens, ui/ inventory (Button, Skeleton); cross-checked /api/dashboard route for real payload shape (demo student "Arpit", Y2, seeded analytics)
- Built src/components/dashboard/dashboard-view.tsx ('use client', named export DashboardView) — the ONLY file touched
- Data layer: useEffect fetch of api.dashboard() with cancelled-guard promise (.then/.catch) to satisfy react-hooks v6 set-state-in-effect rule; retry via reloadKey; states: skeleton shimmer (Skeleton + .shimmer, layout-mirrored), error card with Retry button
- Section 1 greeting: "{greeting}, Dr. {name}." (text-3xl md:text-4xl) + stage chip "{stageLabel} · {PREP_STAGE_LABELS[prepStage]}"; NEET-PG CLOCK row: Timer icon, "Estimated exam window: June {examYear} · {daysLeft} days left · stage: {stage}" + NBEMS disclaimer
- Section 2 intelligence strip: 5 glass stat tiles (grid-cols-2 md:grid-cols-5) — Flame/warn topicsAtRisk, AlertTriangle/crit recurringMistakes, Target/crit weaknesses.length, BookOpen/info dueQuestions, Brain/muted dueFlashcards; bottom row: recommended minutes + Zap streak badge + mini brain-score ring
- Section 3: custom SVG brain-score ring (framer-motion stroke-dashoffset, cyan gradient #22d3ee→#0284c7, -rotate-90) + knowledge split stacked bar (animated widths, sev-ok/warn/crit/muted segments) with counts legend and weekly accuracy delta (TrendingUp/Down, sev colors)
- Section 4 TODAY'S MISSION: "≈ sum min" badge, progress bar (heatToday.minutes/recommendedMinutes), plan segment rows (index, minutes chip, activity, detail, hover), START TODAY'S MISSION → setQuizPreset({conceptId: nextAction.conceptId, count: 5}) + setView('questions') (falls back to setView('progress') when no nextAction); OPEN IN REVISE → setView('revise')
- Section 5 NEXT BEST ACTION: border-l-4 border-l-primary glass, eyebrow with activityType, title, italic "Because: {reason}", duration chip, horizontal mini-plan steps, START {duration} MIN BLOCK → setQuizPreset count 6 + questions; "Why this?" → openConcept; "View on Medical Map" → setView('map'); null-state = knowledge-audit card → setView('progress')
- Section 6: revision debt card (big AnimatedNumber count, ≈ minutes, FIX NOW → revise, zero-debt positive state) + top weaknesses list (clickable rows → openConcept, animated mastery bars with sev-tone mapping, "Full progress →" → progress)
- Motion: staggered Reveal sections (0.06s), AnimatedNumber counters via framer-motion animate() (once on load), ProgressRing/Bar gated by useReducedMotion (renders final state instantly when reduced); all buttons/rows min-h-11 (44px); lucide icons only, no emojis

Stage Summary:
- Artifact: /home/z/my-project/src/components/dashboard/dashboard-view.tsx (~604 lines, strict TS, zero any)
- Verified: bun run lint → 0 problems in dashboard-view.tsx (remaining repo errors are pre-existing in other agents' files: landing-page.tsx, api routes, seed.ts); tsc --noEmit → 0 errors in this file
- Decisions: exam window rendered literally per spec ("June {examYear}"); ⏱ spec emoji replaced by lucide Timer per no-emoji rule; Target tile labeled "high-priority weak spots"; mission progress bar informational only (marking-complete out of scope); empty split/debt/weakness states handled
- Next for integrator: mount DashboardView in AppShell when view === 'home'; views questions/revise/map/progress/concept-explorer consume the setView/setQuizPreset/openConcept signals emitted here
---
Task ID: 2-a
Agent: frontend-styling-expert
Task: Landing page + Onboarding wizard

Work Log:
- Read worklog.md, types.ts, api.ts, store.ts, globals.css, layout.tsx, ui components (button/input/label/progress/slider/select/toaster/use-toast) to lock contracts
- Toast decision: layout mounts shadcn Toaster via @/hooks/use-toast (sonner Toaster NOT wired) → used useToast hook
- Built src/components/landing/landing-page.tsx: sticky glass nav (MEDOS wordmark + pulsing cyan dot, scroll anchors Philosophy/#philosophy, Medical Map/#features, AI Tutor/#ai-tutor card anchor, Roadmap/#roadmap, "Sign in → Start"); hero = med-grid + animated ECG svg (.ecg-line, masked), eyebrow badge, H1 "Don't just study medicine." + gradient "Build a medical brain.", exact subheading, CTAs → setView('onboarding')/setView('map'), NMC CBME trust line; fragmented→connected SVG constellation (6 nodes Anatomy→NEET-PG, scattered dashed lines fade out, nodes fly to formation, edges draw via pathLength, 3 captions swap on timers: fragmented → departments → shouldn't either); 6 glass feature cards (Map/Network/RefreshCcw/ScanSearch/Stethoscope/Sparkles, hover scale 1.02 + cyan border-glow); FROM CLASSROOM TO NEET-PG chip chain with looping ChevronRight arrows; persona strip (4 cards); final CTA band; muted disclaimer footer
- Built src/components/onboarding/onboarding-wizard.tsx: 6 steps + Review pane, max-w-xl glass-strong card on med-grid, Progress bar + "Step X of 6" + step dots, AnimatePresence direction-aware slide/fade; WELCOME (name input default "Future Dr." + 3 bullet value props); ACADEMIC (6 year segmented buttons → auto semester (year-1)*2+1 and gradYear = now+(5-year), semester Select 1-8, college name, Gov/Private/Deemed segmented, optional past performance); PREPARATION (6 radio cards exploring…revision); TIME (3 sliders 0.5-12 / 0-14 ×2 step 0.5 + live "≈ X h/week"); LEARNING STYLE (8 chips, min 1, engine-adaptation note); RESOURCES (6 optional chips + exact Info note about intelligence-layer-not-content-copying); REVIEW (12-row summary + ENTER MEDOS with Loader2, inline error + retry via api.saveProfile → setProfile(res.profile) → toast → setView('home'))
- Skip: persistent "Use demo student →" top-right → api.saveProfile({onboarded:true}) → setView('home') with graceful toast on failure
- Validation: name non-empty, year required, prepStage required, ≥1 learning style, gradYear sane; Next disabled until valid; Enter advances when valid (guarded against buttons/select); min-h-11 touch targets, mobile-first
- Reduced motion: local hydration-safe useReducedMotion gate → constellation renders static connected state, captions/step transitions collapse to near-instant (also avoids react-hooks/set-state-in-effect lint error by deriving displayPhase)
- QA: bun run lint → 0 errors in my files (only pre-existing prisma/seed.ts warning); bunx tsc --noEmit → 0 errors in my files (pre-existing errors in api routes/seed/examples untouched)

Stage Summary:
- Artifacts: src/components/landing/landing-page.tsx, src/components/onboarding/onboarding-wizard.tsx (no other files touched)
- Key decisions: useToast (shadcn) over sonner since Toaster in layout is ui/toaster; saveProfile merged-partial contract confirmed from api/profile/route.ts (skip sends {onboarded:true} only); year→semester/gradYear auto-derivation with manual override; constellation is pure SVG+framer-motion (no extra deps); anchors: philosophy section, features grid, ai-tutor card (scroll-mt-32), roadmap chain
- Ready for Task 3 shell wiring: render <LandingPage/> when view==='landing' and <OnboardingWizard/> when view==='onboarding'

---
Task ID: 2-c
Agent: frontend-styling-expert
Task: Medical Map + Concept Explorer

Work Log:
- Read worklog + types/api/store/graph-layout/globals.css; verified live API shapes via running server (graph all/system/subject/concept scopes, subjects, concepts/[id]) before writing UI
- Built src/components/map/medical-map-view.tsx: MEDICAL MAP header, scope bar (All + 9 system chips with lucide icons + subject Select from api.subjects), legend (KIND_META colors + status rings sev-ok/warn/crit/muted) + node/link count
- Graph: inline SVG viewBox 0 0 1000 640 inside h-[520px] md:h-[640px] rounded-3xl med-grid canvas; forceLayout(seed 42) in useMemo per data; edges drawn under nodes with type styling (prerequisite_of dashed amber, causes rose, treated_by emerald, diagnosed_by amber, commonly_tested_with dotted, related_to/default foreground 15% w1.5)
- Nodes: r=14+examRelevance*2+mastery*0.08, fill subjectColor 85% + inner kind dot, stroke=status color 2.5px, 18-char labels; framer-motion spring entrance with stagger; pulsing halo on weak/unstable (mastery>0), disabled via useReducedMotion; center-node ring + "Focused" chip on concept: scopes (initial scope derives from conceptFocus on mount)
- Interactions: cursor-anchored wheel zoom (native non-passive listener, k 0.6–2.5, letterbox-aware viewBox math), pan via pointer events with window-listener drag lifecycle (no pointer capture — it retargets click away from nodes; touch works), drag-vs-click guard, dblclick reset, dblclick-spam open/close guard; hover tooltip (getScreenCTM→container px) with name/kind/mastery/status/summary; loading shimmer overlay, error retry, empty-scope state
- Built src/components/concept/concept-explorer.tsx: AnimatePresence slide-over (backdrop blur click-close, panel x:100%→0 spring, max-w-3xl, mobile full width, Escape + sticky X close, body scroll lock, scroll reset per concept)
- Content: kind badge (KIND_META color+icon) + subject·topic breadcrumb, H1, summary, Quiz me (setQuizPreset{conceptId,count:6}→questions→close), Ask AI Tutor (setView('tutor')), animated SVG mastery ring (est recall %, status color, "model estimate" caption), meta chips; WHY THIS MATTERS (border-l-primary, generated fallback from summary); HOW THIS CONNECTS whyChain with staggered whileInView ChevronDown arrows, clickable stages → recursive openConcept, visited-stack breadcrumb + Back (navRef push/pop protocol survives refetch)
- Deep-dive Sections (H3 + medprose paragraphs + styled tables), Connections 2-col (Foundation & inputs / Leads to & applied in) chips with kind dot, prettified rel label, mastery mini-bar → openConcept; flip flashcards (rotateY, snap-x scroll, subjectCode badge), Question bank hint + PRACTICE NOW, amber mnemonic Lightbulb callout, footer disclaimer; skeleton + retry error states
- QA: bun run lint 0 errors (only pre-existing prisma/seed.ts warning); tsc --noEmit clean for both files (remaining project errors are pre-existing in untouched API routes/seed/examples)

Stage Summary:
- Artifacts: src/components/map/medical-map-view.tsx (MedicalMapView), src/components/concept/concept-explorer.tsx (ConceptExplorer) — no other files touched
- Decisions: node fill = subject color (KIND_META color kept as inner dot so kind legend stays truthful); drag uses window pointer listeners not pointer capture (capture breaks node clicks); map initial scope honors conceptFocus for "arrive from focused concept" flows; concept-detail edge mastery bar color derived from mastery thresholds matching engine status bands
- For task 3 (shell wiring): render <MedicalMapView/> when view==='map' and <ConceptExplorer/> globally (it self-hides when conceptFocus===null); Note: backend concept: graph scope currently returns full graph (not just neighborhood) — UI handles it, backend may tighten later

---
Task ID: 2-f
Agent: frontend-styling-expert
Task: AI Tutor + Profile + Search overlay

Work Log:
- Read worklog, types.ts (Profile/SearchResults/YEAR_LABELS/PREP_STAGE_LABELS), api.ts (tutor/search/getProfile/saveProfile), store.ts (searchOpen/openConcept/setView/setQuizPreset), globals.css, ui inventory (command/cmdk, dialog, switch, slider, select, input, textarea, skeleton); read /api/tutor + /api/search routes to lock payload shapes; reused onboarding field conventions (Segmented/Chip/SliderRow) for profile edit
- Built src/components/tutor/tutor-view.tsx ('use client', named export TutorView) — h-full flex column: header (Stethoscope badge, "Ask Your Medical Tutor", exact safety subtitle, CLEAR ghost button when thread non-empty); 7 mode chips as radiogroup with title-tooltips (Simple/Lightbulb, Exam Mode/GraduationCap default+primary style, Clinical/Stethoscope, Deep Dive/Microscope, Rapid Revision/Zap, ELI5/Baby, Hinglish key 'hinglish'/Languages); empty-state Sparkles + 5 suggested prompt chips; thread with user bubbles right (primary/15 border-primary/30) and assistant glass cards left rendered via react-markdown (Components-typed override: h1-h4 demoted to smaller tags, table wrapped in overflow-x-auto with cell styling, compact p/ul/ol/strong/blockquote/code, a→target _blank); ThinkingDots indicator (3 staggered motion dots + "Thinking through this…", AnimatePresence); composer = auto-growing Textarea (rows 1, onInput scrollHeight cap 160px, Enter send / Shift+Enter newline via onKeyDown) + size-11 (44px) Send button with Loader2 while pending; api.tutor({messages: last 10, mode, conceptId: undefined}) with reqRef stale-response guard; error banner keeps last user message + Retry; permanent ShieldAlert safety footer; sensitive regex /my patient|should i (give|prescribe|start)|real patient/i flags the user turn → amber TriangleAlert inline notice under the paired reply; mode changes apply to next message (state only); sessionStorage 'medos:tutor-question' consumed once on mount (bootRef guard + setTimeout to stay clear of set-state-in-effect lint) → auto-sends question handed off from search
- Built src/components/profile/profile-view.tsx (named export ProfileView) — api.getProfile() on mount with cancelled-guard promise + store fallback (useAppStore.getState()), reload retry; skeleton layout mirror; null-profile → onboarding CTA card; grid md:grid-cols-3 (main col-span-2 = IDENTITY + PREPARATION; side = EXAM MODE + RESOURCES + DATA & DISCLAIMER); IDENTITY: initials avatar circle, name, YEAR_LABELS[year] + semester, InfoRows college (+type chip), Class of {gradYear}, past performance, weekly capacity; PREPARATION: stage chip (PREP_STAGE_LABELS) + exam-priority chip, 3 stat blocks (daily/weekday/weekend h), learning-style + resource chip rows; EXAM MODE: label-wrapped Switch "College exam priority" + exact explanation, when on reveals exam-name Input + optional date Input, own SAVE → api.saveProfile({examMode, examLabel, examDate|null}) + toast; extracted into ExamModeCard (mounts post-load so state initializes from real profile without set-state-in-effect); EDIT: "Edit profile" → glass-strong action bar (SAVE disabled until name + ≥1 style + grad year sane; CANCEL) and both cards swap to onboarding-parity form (name, 6 year segmented with semester/gradYear auto-derive, semester Select 1-8, college, Government/Private/Deemed, grad year number input, past score, 6 prep-stage radio-cards, 3 sliders 0.5-12/0-14/0-14 step .5, styles chips min-1, resources chips) → api.saveProfile full payload → setProfile store + toast; RESOURCES card: chips from profile.resources, exact "sits above your resources" note, static example row "{firstResource} · Renal pathology lecture ✓(Check icon) → Platform follow-up: 20 min recall · 10 questions · 1 case"; DATA & DISCLAIMER: 4 Info bullets (learning analytics, NMC CBME, NBEMS verify, educational use); mobile single column
- Built src/components/search/search-overlay.tsx (named export SearchOverlay) — ui/command exists → composed Dialog + Command primitives directly (CommandDialog wrapper can't pass shouldFilter) : Dialog open={searchOpen} onOpenChange(false)→close; DialogContent "top-[12vh] translate-y-0 max-w-xl sm:max-w-xl gap-0 p-0 glass-strong rounded-2xl overflow-hidden" (built-in tw-animate zoom/fade = subtle scale/fade) + sr-only Title/Description + built-in X; Command shouldFilter={false} (cmdk native filtering would hide synonym-expanded API hits); CommandInput controlled placeholder = exact trigger hint + aria-label; debounced 250ms api.search(q) when ≥2 chars (timer-based, reqRef id guard, retryNonce state for manual retry); results grouped via CommandGroup headings with sliced caps: Concepts(Brain→openConcept+close), Subjects(Library→learn), Topics(FileText→learn), Questions(CircleHelp→setQuizPreset({count:8})+questions), Flashcards(Layers→revise), Clinical cases(Stethoscope→cases); /\b(why|how|what)\b/ → top "ASK THE TUTOR" CommandItem (Sparkles, primary tint) → sessionStorage hand-off + setView('tutor') + close; empty query: "Try" quick chips (RAAS · nephrotic · metformin · ECG · TB) fill query + explainer; loading Loader2 "Searching…"; error state with Retry; no-results state with exact copy + "Ask the tutor instead" fallback; results container keyed motion fade/rise; footer kbd hint bar (↑↓ navigate · ↵ open · esc close); all items min-h-11, Tag badges (subject code/kind), Escape/backdrop/X all → setSearchOpen(false) with query reset
- QA: bunx eslint on my 3 files → 0 problems; bunx tsc --noEmit → 0 errors in my files (remaining repo errors pre-existing in api routes/seed/examples/progress+revise views owned by others); bun run lint repo error in revise-view.tsx is not mine (touched nothing outside my 3 files)

Stage Summary:
- Artifacts: src/components/tutor/tutor-view.tsx (TutorView), src/components/profile/profile-view.tsx (ProfileView + local ExamModeCard/helpers), src/components/search/search-overlay.tsx (SearchOverlay) — no other files touched
- Decisions: native title-attr tooltips on mode chips (zero-dep, mobile-safe); sensitive-question notice attached to the reply following the flagged user turn; tutor consumes sessionStorage 'medos:tutor-question' written by SearchOverlay so "Ask the tutor" truly hands the query over; shouldFilter={false} + manual empty/loading/error states because cmdk client filtering would fight server-side synonym search; profile API re-fetch on mount for truth with zustand snapshot as offline fallback; exam-mode card keeps independent save flow (spec) while full edit save posts all identity/prep fields
- For Task 3 shell wiring: render <TutorView/> when view==='tutor' inside a bounded-height container (h-full flex expected); render <ProfileView/> when view==='profile'; render <SearchOverlay/> globally (self-hides on closed store flag); wire a keyboard shortcut (e.g. Cmd/Ctrl+K) → useAppStore.setSearchOpen(true)

---
Task ID: 2-e
Agent: frontend-styling-expert
Task: Revise + Progress + Roadmap views

Work Log:
- Read worklog.md, types.ts (RevisionPayload/ProgressPayload/RoadmapPayload/ERROR_TYPE_LABELS), api.ts, store.ts, globals.css tokens, ui inventory; cross-checked /api/revision, /api/revision/review (+clear), /api/progress, /api/roadmap routes for real payload shapes before writing UI
- Built src/components/revise/revise-view.tsx (named export ReviseView) — only file touched for this view: REVISE header + "model estimates" subtitle; REVISION DEBT band (animated count + "≈ min" chip + 4 stat chips now/soon/stable/mastered with sev dots + never-permanent-mastery note + CLEAR DEBT → switches to CONCEPTS tab, disabled at zero debt); shadcn Tabs FLASHCARDS|CONCEPTS DUE with live count badges
- Flashcards tab: local deck state (survives data refreshes), 3D flip card (min-h-56 glass, framer rotateY 180 with preserve-3d/backface-hidden faces, front=question, back=answer+subjectCode badge, click/Enter/Space to flip), card i/n progress bar, 4 grade buttons AGAIN rose/HARD amber/GOOD primary/EASY emerald with sub-labels → POST api.reviewFlashcard (response cast to {ok, nextDueDays?} since api.ts types it {ok}) → inline sev-ok strip "next review in N days/hours" (0.5-day AGAIN interval renders as hours) → card advances + flip resets; grade-error inline strip keeps card; keyboard Space=flip 1-4=grade (tab-scoped, input-safe, e.repeat-guarded); empty deck = spring-pop CircleCheck "Deck clear — nothing due…" celebratory state
- Concepts DUE tab: rows with priority dot (3 crit/2 warn/1 info), name+reason button → openConcept, estRecall mini-bar+% (model-estimate caption), minutes chip, REVIEWED → await clearRevisionItem then fire-and-forget logSession({minutes, kind:'revision', label:'Concept revision'}), row exits via AnimatePresence (layout + x-slide), debt count/minutes and counts buckets update locally mirroring backend recall thresholds (<60 now→soon, <80 soon→stable, else stable→mastered); clear-error inline strip keeps row; empty queue state
- Built src/components/progress/progress-view.tsx (ProgressView): top row grid md:grid-cols-4 (md:grid-cols-3 when clinical card omitted) — animated SVG mastery ring + "learning analytics indicator" caption, accuracy card with trend arrow chip (+X% / −X% vs last week, sev-ok/crit), optional Clinical-questions card rendered only if weeklyReport carries clinicalAccuracy (current backend voids it → omitted), consistency card with 7-dot week row; STUDY HEATMAP: GitHub-style 120-day Monday-first grid (columns=weeks via useMemo, month labels on date≤7 columns, M/W/F gutter, size-3 rounded-sm cells, 5-step sev-ok opacity scale by minutes+questions vs max, title tooltips "Tue 4 Feb · 45 min · 12 questions", less→more legend, totals line, overflow-x-auto); WEEKLY MEDICAL INTELLIGENCE REPORT accent card (border-l-primary, date-range chip last-7-days, narrative bullets with keyword-mapped icons TrendingUp/Target/AlertTriangle/Clock/BookOpen, footer chips weakest/strongest/top-mistake); SUBJECT DASHBOARDS md:grid-cols-2 static cards (subject color dot, name, Year chip, NEET-weight bar normalized to max weight, 4 metric bars Progress/Foundation/Clinical application/Question accuracy with % labels, revision-debt chip when >0, status badge strong/unstable/weak/new); ERROR INTELLIGENCE lg:grid-cols-2 — left patterns list (label + count chip + example sub-chips ×count), right confusion cards: subject chip + pulsing-crit DETECTED badge else muted Watchlist, a-vs-b two-column grid with primary/amber headers and divide-x point lists, Lightbulb mnemonic strip
- Built src/components/roadmap/roadmap-view.tsx (RoadmapView): NEET-PG CLOCK hero glass card with med-grid backdrop (animated day/week/month stat blocks, stage badge, "Expected exam window: ≈ June {examYear}" + NBEMS estimate disclaimer shown when isEstimate, metric chips ≈{weeklyTarget} h/week required workload, {revisionCyclesLeft} cycles left, {questionTarget} question target, {mockTarget} mock target); WEEKLY SPLIT animated stacked bar + dot legend chips; PHASES TIMELINE border-l vertical ol with whileInView stagger (0.08s), per-node glass cards: phase name, timeframe chip, 1-5 intensity dots, goal line (border-l-primary), focus chips, Check-icon action checklist, amber Flag milestone callout; phase 0 = pulsing node + "YOU ARE HERE" badge + primary glow; CTA band "Every phase adapts as your knowledge state changes." + SEE TODAY'S MISSION → setView('home')
- Shared patterns across all three: self-contained Reveal/Bar/AnimatedNumber primitives (dashboard-consistent), .then+cancelled-guard fetch (react-hooks v6-safe), retry via reloadKey, layout-mirrored shimmer skeletons, glass error+Retry cards, useReducedMotion gates on every animation (incl. ping/pulse which globals.css also throttles), min-h-11 buttons/touch rows, lucide only, zero emojis, strict TS no any

Stage Summary:
- Artifacts: src/components/revise/revise-view.tsx (629 lines), src/components/progress/progress-view.tsx (694 lines), src/components/roadmap/roadmap-view.tsx (383 lines) — no other files touched
- QA: bun run lint → 0 errors (only pre-existing prisma/seed.ts warning); bunx tsc --noEmit → 0 errors in all three files (remaining repo errors pre-exist in api/progress|roadmap routes, untouched)
- Decisions: reviewFlashcard response widened via local cast (backend actually returns nextDueDays, api.ts types {ok}); concept-clear count shifts approximate backend buckets by cleared item's estRecall; clinical-accuracy card behind optional-field check so it appears automatically if backend later emits weeklyReport.clinicalAccuracy; deck kept in local state so silent data updates never resurrect reviewed cards; heatmap intensity = minutes+questions against dynamic max (min 60)
- For task 3 shell wiring: render <ReviseView/> when view==='revise', <ProgressView/> when view==='progress', <RoadmapView/> when view==='roadmap'

---
Task ID: 2-d
Agent: frontend-styling-expert
Task: Question engine + Clinical cases

Work Log:
- Read worklog + types.ts (QuestionClient/AttemptResult/ERROR_TYPES/SYSTEMS), api.ts (questions/attempt/logErrorType/cases/caseDetail/caseStep/caseComplete/logSession), store.ts (quizPreset), globals.css tokens; verified real payload shapes in /api/questions, /api/attempts, /api/attempts/error-type, /api/cases(/step,/complete) routes; checked seed-cases.ts (phases HISTORY…REPORT, patient {age,sex,occupation,complaint}) and ui/ inventory (Select/Slider/AlertDialog/Skeleton/Button)
- Built src/components/questions/quiz-view.tsx ('use client', export QuizView) — ONLY file, three internal phases (config/run/results):
  - CONFIG: "QUESTION LAB" header + exact subtitle; Subject Select (api.subjects, loading skeleton + error retry), System Select (SYSTEMS), Count slider 5–30 step 5 default 10, mode chips (All types/rapid/vignette); START SESSION
  - quizPreset auto-start: mount effect reads store preset, defers via setTimeout(0) (keeps react-hooks set-state-in-effect clean), presetStartedRef double-start guard, setQuizPreset(null) claimed inside the start tick, count default 6; "Focused practice" banner in config+run with concept name fetched via api.concept
  - RUN: top bar Q{i+1}/{n} + segmented progress bar (segments color by result correctness) + ticking mm:ss timer + X exit → AlertDialog "End session? Progress is saved per question." (partial results → RESULTS, zero → CONFIG); AnimatePresence mode="wait" slide between questions; meta row = difficulty dots ●●○ + qtype + subject + system chips; stem text-lg leading-relaxed; full-width radio option cards (≥44px, selected border-primary bg-primary/10, post-attempt correct=sev-ok/wrong pick=sev-crit + icons, A–D letters); keyboard 1–4/A–D (window keydown, input-guarded, disabled after submit); confidence Slider 1–5 Guess→Certain default 3; SUBMIT → api.attempt({questionId,selected,timeMs:per-question,confidence}) with inline error+retry
  - Verdict: correct = green banner + explanation card (CheckCircle2 header, teaching line border-l-primary highlighted); incorrect = red banner + correct-answer text + "WHY DID YOU MISS THIS?" 9 ERROR_TYPES cards (label+hint) → click POSTs api.logErrorType w/ "logged" chip, errorTypeSuggestion pre-selected, skippable → NEXT QUESTION / SEE RESULTS
  - RESULTS: logSession({minutes:max(1,round(sec/60)),kind:'questions',label:'Quiz session'}) fire-once (ref guard) incl. early exit; animated SVG score ring (accuracy%), correct/total, avg s/question, session length; by-difficulty bars (Easy/Moderate/Hard); knowledge note when AttemptResult.mastery present ("Knowledge state updated: 48% → unstable"); missed list w/ stems + correct answer + teaching one-liners (flawless zero-state); RUN ANOTHER SET → CONFIG, BACK TO DASHBOARD → setView('home'); run 'empty' filter state handled
- Built src/components/cases/cases-view.tsx ('use client', export CasesView) — ONLY file, list/player internal states:
  - LIST: "CLINICAL CASE SIMULATOR" header + exact subtitle; md:grid-cols-2 cards: difficulty chip (Easy/Moderate/Hard sev-toned), specialty chip, title, patient line (age/sex/occupation — complaint), attempted + mini last-score ring (static SVG, sev-toned) vs "New case" Sparkles, START CASE; api.cases() refetched on return for fresh scores
  - PLAYER: header w/ back button + case title + chips; lg:grid-cols-[320px_1fr], mobile chart stacks above; sticky PATIENT CHART (initials avatar from title, age/sex/occupation + extra patient rows, complaint quote, FINDINGS SO FAR derived from revealed steps w/ phase tags, max-h-64 overflow-y-auto); phase stepper from real step.phase values (completed=check+sev-ok, active=primary, ChevronRight separators, overflow-x-auto); AnimatePresence step card: phase badge + "Step x of y" + title + content bullets staggered 0.12s (reduced-motion gated)
  - Decision panel "YOUR CALL": radio option cards (≥44px) + CONFIRM DECISION → api.caseStep(id,{stepId,choice}) → emerald "Good clinical reasoning" / rose "Missed it — here's why" + amber border-l teaching callout (Lightbulb); correct/wrong option highlighting via answerId; POST error → inline retry; steps w/o question render content + CONTINUE
  - REPORT (last step): content renders then "CLINICAL REASONING REPORT" card — api.caseComplete fired exactly once on reaching report (completeFiredRef; {correctSteps, totalSteps: question steps, detail:[{stepId,correct,chosen}]}) → animated score ring + per-step Correct/Missed/Skipped review + learning points (case.learning) + RETRY CASE (resets run state) / MORE CASES (→ list) / TURN INSIGHT INTO QUESTIONS (setQuizPreset({system: case.system, count: 8}) + setView('questions'))
- QA: bun run lint → 0 errors in my files (only pre-existing prisma/seed.ts warning); bunx tsc --noEmit → 0 errors in my files (remaining errors pre-exist in untouched api routes/seed); all setState kept out of effect bodies (.then patterns / interval / deferred preset tick)

Stage Summary:
- Artifacts: src/components/questions/quiz-view.tsx, src/components/cases/cases-view.tsx — no other files touched
- Decisions: quizPreset claimed+started inside setTimeout(0) tick with ref guard (strict-mode double-effect safe, avoids sync setState-in-effect); error-type logging only on explicit card click (pre-selected suggestion is UI-only, next = skip); exit-dialog "End session" routes to RESULTS with partial entries (0 answered → config); results array stores {questionId,correct,selected,timeMs,stem,answerText,teaching,difficulty,qtype} so breakdowns/teaching need no refetch; findings derived from revealed index (no effect); caseComplete fired on advancing into final step, retry button re-POSTs on failure only; case list refetch keyed on reloadKey when returning from player
- For task 3 (shell wiring): render <QuizView/> when view==='questions' and <CasesView/> when view==='cases'; both consume quizPreset — CasesView emits {system,count:8} presets and QuizView auto-runs concept/system/subject presets from dashboard/concept-explorer/cases

---
Task ID: 3
Agent: main
Task: App shell, Learn view, page wiring, type fixes

Work Log:
- Built src/components/learn/learn-view.tsx (subject browser by year → topic accordions → concept cards with mastery; quiz-subject shortcut)
- Built src/components/app-shell.tsx (desktop sidebar w/ 10 nav items + user card, topbar w/ ⌘K search + NEET-PG clock chip + theme toggle, mobile drawer + 5-item bottom nav, sticky footer with disclaimer via mt-auto)
- Wired src/app/page.tsx: profile hydration → landing/onboarding (no shell) vs 10 app views in shell + global ConceptExplorer + SearchOverlay overlays
- Fixed type errors: RoadmapPayload.stageLabel, ConceptEdge/GraphPayload typings, concepts/[id] union-type split (relatedOut/relatedIn), progress route ErrorPattern.concept → concepts lookup, seed conceptsCoverage typed + allConcepts export order
- Added theme-provider + next-themes (dark default, light supported)

Stage Summary:
- All views wired and compiling clean (0 lint errors in app code; 0 tsc errors outside pre-existing examples/skills dirs)

---
Task ID: 4
Agent: main
Task: QA with agent-browser — golden path verification + fixes

Work Log:
- Verified: landing (hero + constellation + 6 instrument cards), onboarding full 6-step flow (Aditi/Y2/AIIMS → review → dashboard greeting updated), dashboard (all stats live), Medical Map (42-node force graph, status rings, node click → explorer), Concept Explorer (why-chain, detail sections, connections, flashcards), Quiz (config → answer correct → answer wrong → error-type tagging → early exit → results with "Knowledge state updated 14% → Weak"), Cases (list → progressive reveal → decision → verdict+teaching), Revise (debt 8 topics/120min, flashcard flip via Space → grade GOOD → "Next review in 7 days" → deck advanced 10→9), Progress (120-day heatmap, weekly report narrative, confusion list), Roadmap (clock, weekly split, phases timeline), AI Tutor (real LLM reply on RAAS, 7 mode chips), Search (⌘K, synonym expansion finds RAAS cluster), Learn (subjects → topics → concepts)
- FIX: exam clock now targets graduation-year window (was counting to next June — 254d/2028-label mismatch → now 620d to June 2028 for Y2/grad-2028)
- FIX: concept explorer ring showed estRecall; now shows mastery % with recall as secondary text
- FIX: logo clickable → landing (landing reachable post-onboarding)
- FIX: seed guarantees recent 6-day activity (streak 0 → 29 days), added 4 concepts to empty topics
- Verified mobile 390px (bottom nav, 2-up tiles, footer gap 0px) and light theme
- Verified: no runtime errors in dev.log after fixes; all recent API responses 200

Stage Summary:
- Golden path (spec §87) verified end-to-end. App is production-presentable. Next rounds: polish + feature expansion per cron reviews.

---
Task ID: 5 (cron round 2)
Agent: main
Task: Knowledge Audit + Clinical Logbook + integration polish

Work Log:
- STATUS ASSESSMENT: app stable — lint clean, tsc clean (outside pre-existing examples/skills), all APIs 200, zero console errors. Chose feature expansion over fixes.
- FEATURE — Knowledge Audit (spec §49): new store flag auditOpen + /api/audit POST (samples up to 2 questions per subject with questions — easy+hard spread, capped 24, weighted by NEET yield) + /api/audit/submit (records attempts, upserts KnowledgeStates via engine, returns per-subject {accuracy, mastery, band: strong/moderate/weak/unmapped}, weakest/strongest, tailored recommendation). New src/components/audit/audit-view.tsx — spring-scale modal: intro explainer → 22-question run (keyboard-free radio cards, progress bar, subject chip) → knowledge map results (animated dual bars: audit accuracy vs stored mastery, band chips, weakest/strongest callouts, recommendation, CTAs: Practice weakest subject → quiz preset; View on Medical Map). Entry: dashboard "AUDIT MY MEDICAL KNOWLEDGE" button in the knowledge split card + registered globally in page.tsx.
- FEATURE — Clinical Logbook (spec §45): /api/logbook GET/POST/DELETE (LogbookEntry model already in schema; de-identified educational records; each entry logs a 5-min study session). CasesView gained a tab switcher: CASE SIMULATOR | CLINICAL LOGBOOK with LogbookPanel — stats band (cases logged / systems touched / learning tasks), entry form (5 case-type chips, 9 system chips, diagnosis*, learned textarea, "de-identified only" badge), timeline of entries (type+system chips, auto learning tasks: 15 min recall / 8 questions / 1 case review, PRACTICE → setQuizPreset({system}) → questions, delete with optimistic update), privacy disclaimer.
- FIX: logbook entry cards animated to opacity 0 forever (animate prop set only scale) → animate includes opacity/y.
- ENHANCEMENT: /api/progress now emits weeklyReport.clinicalAccuracy (vignette/integrated accuracy, last-7d fallback all-time) → the conditional "CLINICAL QUESTIONS %" card in Progress view is now live.
- ENHANCEMENT: Concept Explorer "Ask AI Tutor" now hands context over via sessionStorage 'medos:tutor-question' (tutor already consumes it) AND closes the explorer; "Quiz me" also closes the explorer (previously the slide-over blocked the target view).
- QA via agent-browser: audit full run (22 Qs answered → 9% baseline map with per-subject bands, weakest/strongest), logbook add/list/practice/delete verified, clinical-accuracy card live (33%), explorer→tutor handoff fires prefilled message ("Explain 'ACE Inhibitors' (drug)…"), mobile 390px audit dialog clean. lint 0 errors, tsc 0 errors (app code), dev.log clean.

Stage Summary:
- New surfaces: Knowledge Audit modal (dashboard entry), Clinical Logbook tab in Cases. Cross-subject diagnostics now feed the knowledge engine directly.
- Verified end-to-end in browser; no regressions (quiz/cases/revise/progress flows re-checked via API 200s + spot screenshots).
- NEXT ROUND PRIORITIES: (1) Internship mode dashboard (§44 — rotation-based plan for year-5 profiles), (2) College-sync weekly planner (§42/43 exam mode planner UI in profile/roadmap), (3) deep content expansion for surgery/obgy/peds topics (concepts+questions), (4) image-based learning stubs (§34) with original SVG illustrations, (5) consider seeding logbook with 3-4 sample entries for demo richness.

---
Task ID: 6 (cron round 3)
Agent: main
Task: Medical Universe home + comprehensive Medical Map + warm nature design

Work Log:
- USER REQUESTS: (1) Medical Map displayed on dashboard home, (2) more map features/topics, (3) highlight hardest topics, (4) emoji/3D/GIF-style animated branch circles, (5) warm nature-inspired calming design, (6) remove NEET-PG countdown from home, (7) real cross-verified data.
- CONTENT EXPANSION (prisma/seed-data.ts): topicsUniverse (+12 topics: Acid-Base, GSD, Brachial Plexus, Cranial Nerves, Coagulation, Immunodeficiency, Corticosteroids, Immunology, Biostatistics, Toxicology/Antidotes, CXR Patterns, Airway/MH) + conceptsUniverse (+16 struggle-zone concepts with full detail/mnemonics, difficulty 3–5) + edgesUniverse (+42 cross-subject edges). Graph now 88 concepts / 121 edges / 19 subjects. Fixed FK violation (c-anticoag) + allEdges moved after declarations + HTML-entity quoting bugs. Seed re-run OK (demo knowledge states added for new concepts so struggle zones render with real low mastery).
- NEW API /api/map-insights: branch stats per subject (emoji map, mastery, counts, status), struggle zones (difficulty>=4 && mastery<45 ranked by difficulty×gap×examYield, top 6), library counts, totals. api.mapInsights() client added.
- MEDICAL MAP UPGRADE (medical-map-view.tsx → exported MedicalMapCanvas with variant full|hero): kind-based emoji inside node circles (💡🩺💊🔬⚡🦴🧫💉🦠🤲), STRUGGLE ZONES filter chip with count badge, ⚠️ badge + dashed red halo + pulse on struggle nodes, struggle legend, struggle-aware tooltip (difficulty chip), empty-filter message for struggle scope, hero variant (compact 420/560px canvas, floating nature emoji backdrop, struggle banner). take limit 46→90.
- NEW HOME (dashboard-view.tsx rebuilt): greeting WITHOUT NEET-PG clock (also removed topbar "620d to NEET-PG" chip + clock state in app-shell), warm-scene hero "Your Medical Universe" embedding the interactive map with dawn-meadow scene image + aurora blobs + drifting emoji (framer-motion, reduced-motion safe), STRUGGLE ZONES strip (6 warm-cards: HARD badge, 🔥 difficulty flames, mastery bar, Practice→quiz + Explore→explorer), BranchGalaxy, then retained intelligence modules (brain stats, knowledge split w/ warm gradient ring, mission w/ canopy scene, next best action, revision debt, weaknesses) + source trust strip (NMC CBME 2024 / NBEMS NEET-PG / WHO ICD-11 / ICMR).
- NEW COMPONENT branch-galaxy.tsx: 19 subject emoji spheres on 2 elliptical orbits around "you", 3D glossy spheres (radial gradient + inset shadows + specular ::after), mastery ring per subject (SVG stroke), float animation, heartbeat pulse for weak subjects, hover tooltip (concepts/mastery/NEET weight), click → mapScope store → Medical Map scoped to subject. Fixed overlap via elliptical x/y radii (24/19 inner, 41/32 outer).
- WARM DESIGN SYSTEM (globals.css): warm-scene, scene-dawn, scene-canopy, scene-float, leaf-drift, sphere-3d (glossy ball), sphere-float, sphere-pulse, galaxy-aurora, galaxy-core (breathe), warm-card, med-scroll + prefers-reduced-motion kills all.
- IMAGES (public/scenes/): AI-generated dawn-meadow.jpg (hero), canopy-light.jpg (mission card), zen-lake.jpg (trust strip) via z-ai image CLI 1344x768 (learned: sizes must be 32-multiples in CLI whitelist; background nohup jobs get reaped — run foreground). SceneImage component with onError graceful hide.
- app-shell.tsx: removed NEET-PG clock chip + unused api import. page.tsx: scroll-to-top on view change (SPA scroll context bug found via QA).
- QA (agent-browser): home renders map-first with 88 nodes/121 links; struggle filter shows 13 zones w/ halos; struggle Practice → focused quiz (hyperkalemia Q via graph fallback ✓); Explore → full concept explorer (Acid-Base, mastery 22%, difficulty 5/5 ✓); galaxy sphere click → Medical Map auto-scoped to General Medicine ✓; light mode warm cream/sage ✓; mobile 390px chips/cards/galaxy/stats ✓; lint 0 errors, tsc 0 errors (app), dev.log clean.

Stage Summary:
- Home IS the Medical Map now: interactive universe hero + struggle zones + branch galaxy, all in a calming warm nature design. Content nearly doubled (73→88 concepts, 84→121 edges).
- Real-data trust strip surfaced on home; NEET-PG countdown removed everywhere on home/topbar (still lives in Roadmap where it belongs).
- NEXT ROUND PRIORITIES: (1) seed questions/flashcards for the 16 new struggle concepts (quiz currently falls back to linked concepts), (2) confuse-pairs for acid-base/coag, (3) internship-mode dashboard (§44), (4) exam-mode planner polish, (5) map "guided tour" mode + branch detail mini-panels on galaxy click, (6) light-mode contrast pass on struggle cards.

---
Task ID: 7 (cron round 4)
Agent: main
Task: Struggle-zone content bank + Mock Test mode + light-mode contrast

Work Log:
- STATUS ASSESSMENT: app stable (HTTP 200, lint 0 errors, tsc 0 errors, dev.log clean, home renders map-first hero). No bugs found in browser QA sweep → chose feature expansion per worklog Task 6 priorities.
- CONTENT — Struggle-zone bank (seed-questions.ts): +22 original questions targeting the 16 struggle concepts (ABG ×3 incl. Winters + salicylate mixed disorder, RTA, HIT, warfarin skin necrosis, CGD, PPD type IV, Von Gierke, Erb palsy, CN III palsy, PPV/prevalence, ANOVA, OP poisoning first-line, snakebite ASV+neostigmine, SVT→adenosine, torsades→Mg²⁺, steroid sick-day rule, CXR shift-toward-collapse, MH→dantrolene, X-linked dominant pedigree, WHO Plan B fluids). +19 flashcards (f-65..f-83) covering every struggle concept. +4 confusion pairs: Type1-vs-Type2 RTA, VT-vs-SVT-aberrancy, PT-vs-aPTT (cf-9), Sensitivity-vs-Specificity. Fixed leftover "bixa..." typo. Reseeded: 85 questions / 83 flashcards / 10 confusion pairs.
- Verified via API: conceptId drills now hit direct questions (acidbase 6, coag 4, biostat 6, arrhythmia 4, antidotes 2 incl. graph-linked fallbacks) — struggle Practice buttons are truly targeted now.
- FEATURE — MOCK TEST mode (spec §46-lite): new src/components/questions/mock-test-view.tsx + questions-index.tsx tab shell (Practice | Mock Test, animated layoutId pill) wired into page.tsx. Exam conditions: 10/15/20-question presets, 1 min/question countdown that turns red <60 s and AUTO-SUBMITS at zero, no feedback during the run, question palette (answered=green, current=cyan, marked=amber dot), mark-for-review toggle, prev/next navigation, submit-confirm dialog that counts unanswered, sequential /api/attempts submission (knowledge engine still updates) + session log ("Mock test"/"auto-submitted"), then a full report: animated score ring with verdict copy, correct/wrong/skipped badges, per-subject breakdown bars, and a review list (per-question expandable: your answer vs correct, full explanation, 🎯 teaching line, skipped counted as "the clock won").
- STYLING: light-mode contrast pass — :root:not(.dark) .warm-card gets stronger amber tint/border/shadow; warm-scene border strengthened in light mode. Verified visually (cream/rose struggle cards pop on white).
- QA (agent-browser): lab tabs render + animate; mock config → run (countdown ticking 09:58, palette, mark-for-review) → answered Q1 correctly, marked it, navigated, answered Q4 → submit dialog ("8 of 10 unanswered") → graded in ~2 s → report shows 1/2 with verdict, BIOCH 1/1 vs OBGY 0/1 bars, review expands with explanation ✓. Theme toggled back to dark after light QA. lint 0 errors, tsc 0 errors, dev.log clean.

Stage Summary:
- Question Lab is now two modes: Practice (instant feedback) + Mock Test (exam conditions) — first exam-simulation surface in the product, feeding the same knowledge engine.
- Every struggle zone now has direct practice content (22 Qs, 19 flashcards, 4 confusion pairs) — the home "Practice" CTA no longer falls back to unrelated topics.
- NEXT ROUND PRIORITIES: (1) internship-mode dashboard (§44 — rotation plan for year-5 profiles), (2) map guided tour (auto-walk struggle zone → next best action → hub concepts), (3) galaxy branch mini-panel (subject drill-down without leaving home), (4) mock test difficulty/subject-mix presets (e.g. "high-yield mix" weighting neetWeight), (5) exam-mode planner in Roadmap (§42/43).
