// ─── MEDULA — 'AI in Medicine' content pack (Task 19-d) ────────────────────
// Self-contained pack. Imports ONLY the shared contracts from ../types —
// never modifies them. Registry (src/lib/curriculum/registry.ts) treats this
// export as a ContentPack: { packId, subjects, topics, lessons, curriculum }.
//
// HONESTY RULES (pack-wide):
// - Educational content only — NEVER clinical advice.
// - Sources are references for attribution; nothing is reproduced from them.
// - No invented statistics about specific products. Only well-known,
//   verifiable numbers appear in `numbers` (e.g. AUROC 1.0 = perfect,
//   0.5 = chance, FHIR R4). Where the field moves fast, we say so.

import type {
  ConceptLesson,
  CurriculumRecord,
  SourceRef,
  SourceType,
  SubjectTaxonomy,
  TopicTaxonomy,
} from '../types'

// ── Local pack shape (structurally matches registry's ContentPack) ─────────
export interface ContentPack {
  packId: string
  subjects: SubjectTaxonomy[]
  topics: TopicTaxonomy[]
  lessons: ConceptLesson[]
  curriculum: CurriculumRecord[]
}

// ── Source helpers — institutions/resources verified to exist ───────────────
// Root-domain URLs only (certain, publicly reachable). accessNote is ALWAYS
// the honest framing: attribution, never a claim of copied text.

const REF_NOTE = 'Reference — content independently synthesized'

const whoRef = (title: string, sourceType: SourceType = 'guideline'): SourceRef => ({
  institution: 'World Health Organization (WHO)',
  title,
  url: 'https://www.who.int',
  sourceType,
  accessNote: REF_NOTE,
})

const fdaRef = (title: string): SourceRef => ({
  institution: 'U.S. Food and Drug Administration (FDA) — Digital Health Center of Excellence',
  title,
  url: 'https://www.fda.gov',
  sourceType: 'guideline',
  accessNote: REF_NOTE,
})

const niceRef = (title: string): SourceRef => ({
  institution: 'NICE (National Institute for Health and Care Excellence, UK)',
  title,
  url: 'https://www.nice.org.uk',
  sourceType: 'guideline',
  accessNote: REF_NOTE,
})

const ncbiRef = (title: string): SourceRef => ({
  institution: 'NIH / NCBI (PubMed Central)',
  title,
  url: 'https://www.ncbi.nlm.nih.gov',
  sourceType: 'database',
  accessNote: REF_NOTE,
})

const mitRef = (title: string): SourceRef => ({
  institution: 'MIT OpenCourseWare',
  title,
  url: 'https://ocw.mit.edu',
  sourceType: 'open-courseware',
  accessNote: REF_NOTE,
})

const hmsRef = (title: string): SourceRef => ({
  institution: 'Harvard Medical School (online / HMX education)',
  title,
  url: 'https://hms.harvard.edu',
  sourceType: 'course',
  accessNote: REF_NOTE,
})

const jhmiRef = (title: string): SourceRef => ({
  institution: 'Johns Hopkins Medicine',
  title,
  url: 'https://www.hopkinsmedicine.org',
  sourceType: 'hospital-reference',
  accessNote: REF_NOTE,
})

const journalRef = (institution: string, title: string, year?: number): SourceRef => ({
  institution,
  title,
  sourceType: 'journal',
  year,
  accessNote: REF_NOTE,
})

const nmcRef = (): SourceRef => ({
  institution: 'National Medical Commission (NMC), India',
  title: 'Competency-based undergraduate medical curriculum (CBME) — reference for digital-health context',
  url: 'https://www.nmc.org.in',
  sourceType: 'exam-authority',
  accessNote: REF_NOTE,
})

// ── SUBJECT (1) ─────────────────────────────────────────────────────────────

const subjects: SubjectTaxonomy[] = [
  {
    id: 'ai-medicine',
    code: 'AIM',
    name: 'AI in Medicine',
    phase: 'frontier',
    year: 0, // spans years — not part of the canonical MBBS year structure
    color: '#0d9488', // teal — deliberately distinct from blue/indigo packs
    blurb:
      'A doctor’s plain-language guide to the software now entering the clinic: how medical AI actually works, how to read its claims, where it genuinely helps, and where it fails. No hype — just concepts, the numbers that matter, and the guardrails that keep patients safe.',
    systems: ['frontier-ai'],
    neetWeight: 0, // not a formal NEET-PG subject (honest — see lesson examRelevance fields)
    icon: 'brain-circuit',
  },
]

// ── TOPICS (14) ─────────────────────────────────────────────────────────────
// Coverage: foundations · clinical AI · frontiers · data/interoperability ·
// evaluation · safety-ethics-regulation.

const topics: TopicTaxonomy[] = [
  {
    id: 'ai-foundations',
    subjectId: 'ai-medicine',
    name: 'AI & Machine Learning Foundations',
    system: 'frontier-ai',
    importance: 5,
    description:
      'What artificial intelligence and machine learning actually are for doctors: learning from data, training vs testing, and why "the model" is just a pattern-finder — not a mind.',
  },
  {
    id: 'ai-deep-learning-llms',
    subjectId: 'ai-medicine',
    name: 'Deep Learning, LLMs & Multimodal AI',
    system: 'frontier-ai',
    importance: 5,
    description:
      'Neural networks, CNNs for medical images, large language models, and multimodal systems that read text, images and signals together.',
  },
  {
    id: 'ai-clinical-decision-support',
    subjectId: 'ai-medicine',
    name: 'Clinical Decision Support & Predictive Models',
    system: 'frontier-ai',
    importance: 5,
    description:
      'From drug-interaction alerts to AI deterioration prediction: how decision support reaches the point of care, and how alert fatigue and over-trust are managed.',
  },
  {
    id: 'ai-medical-imaging',
    subjectId: 'ai-medicine',
    name: 'Medical Imaging AI',
    system: 'frontier-ai',
    importance: 4,
    description:
      'The most deployed branch of medical AI: diabetic retinopathy screening, stroke triage, chest X-ray, dermatology and pathology — and what "radiologist-level" really meant.',
  },
  {
    id: 'ai-clinical-nlp',
    subjectId: 'ai-medicine',
    name: 'Clinical NLP & AI Documentation',
    system: 'frontier-ai',
    importance: 3,
    description:
      'Making sense of clinical text: extracting data from notes, ambient scribes that draft documentation, and why every AI-drafted note still needs a human author.',
  },
  {
    id: 'ai-drug-discovery',
    subjectId: 'ai-medicine',
    name: 'Drug Discovery & Precision Medicine',
    system: 'frontier-ai',
    importance: 3,
    description:
      'AI for finding molecules and predicting protein structure, plus precision medicine: matching patients to therapies using genomic and molecular data.',
  },
  {
    id: 'ai-digital-health',
    subjectId: 'ai-medicine',
    name: 'Wearables, Remote Monitoring & Digital Twins',
    system: 'frontier-ai',
    importance: 3,
    description:
      'Continuous data from watches, CGMs and home monitoring; simulation models ("digital twins") of organs and patients; wellness device vs medical device.',
  },
  {
    id: 'ai-robotics-agents',
    subjectId: 'ai-medicine',
    name: 'Robotics, Agents & Workflow Automation',
    system: 'frontier-ai',
    importance: 3,
    description:
      'AI-assisted surgery and robotics, multi-step AI "agents", and automation of paperwork, scheduling and coding — with oversight questions.',
  },
  {
    id: 'ai-data-fhir',
    subjectId: 'ai-medicine',
    name: 'Medical Data, FHIR & Interoperability',
    system: 'frontier-ai',
    importance: 4,
    description:
      'EHR data, health data standards (HL7, FHIR R4), and why no AI can be better than the messy data plumbing beneath it.',
  },
  {
    id: 'ai-evaluation-metrics',
    subjectId: 'ai-medicine',
    name: 'Model Evaluation Metrics',
    system: 'frontier-ai',
    importance: 5,
    description:
      'Sensitivity, specificity, AUROC, AUPRC — the bedrock numbers every doctor needs to judge any diagnostic claim, AI or not.',
  },
  {
    id: 'ai-validation-shift',
    subjectId: 'ai-medicine',
    name: 'External Validation, Dataset Shift & Calibration',
    system: 'frontier-ai',
    importance: 5,
    description:
      'Why a model that shines in one hospital can stumble in another: validation on new data, dataset shift, and what a "predicted 10%" should mean.',
  },
  {
    id: 'ai-bias-explainability',
    subjectId: 'ai-medicine',
    name: 'Bias, Fairness & Explainability',
    system: 'frontier-ai',
    importance: 4,
    description:
      'How models inherit bias from data and labels, what fairness can and cannot mean at once, and what it takes to see WHY a model decided.',
  },
  {
    id: 'ai-hallucination-safety',
    subjectId: 'ai-medicine',
    name: 'Hallucination & Human-in-the-Loop Safety',
    system: 'frontier-ai',
    importance: 5,
    description:
      'Fluent but wrong: LLM hallucination, grounding and verification, and the human-in-the-loop rule that keeps AI-assisted care safe.',
  },
  {
    id: 'ai-ethics-regulation',
    subjectId: 'ai-medicine',
    name: 'Privacy, Regulatory Science & Ethics',
    system: 'frontier-ai',
    importance: 4,
    description:
      'Health-data privacy (HIPAA, GDPR, India’s DPDP), how medical software gets regulated (FDA SaMD, UK routes), and WHO’s ethics principles for health AI.',
  },
]

// ── CURRICULUM RECORDS (3) ──────────────────────────────────────────────────

const curriculum: CurriculumRecord[] = [
  {
    authority: 'World Health Organization (WHO)',
    country: 'Global',
    scope: 'Ethics and governance of artificial intelligence for health — guidance for member states',
    subjectsCovered: ['ai-medicine'],
    version: '2021 guidance',
    sourceUrl: 'https://www.who.int',
    lastReviewed: '2026-10-05',
    alignment: 'supplementary',
  },
  {
    authority: 'U.S. Food and Drug Administration (FDA)',
    country: 'United States',
    scope: 'Digital health / Software as a Medical Device (SaMD) policy context for AI-enabled device software',
    subjectsCovered: ['ai-medicine'],
    version: 'Digital health policy context (concept-aligned)',
    sourceUrl: 'https://www.fda.gov',
    lastReviewed: '2026-10-05',
    alignment: 'concept-aligned',
  },
  {
    authority: 'National Medical Commission (NMC)',
    country: 'India',
    scope: 'MBBS competency-based curriculum — AI is NOT yet a formal NMC subject; this pack is supplementary and clearly labelled as such',
    subjectsCovered: ['ai-medicine'],
    version: 'Supplementary to CBME',
    sourceUrl: 'https://www.nmc.org.in',
    lastReviewed: '2026-10-05',
    alignment: 'supplementary',
  },
]

// ── LESSONS (25) ────────────────────────────────────────────────────────────
// Every lesson: oneLiner · whyMatters · explain30s · eli5 · firstPrinciples,
// plus ≥4 relevant depth fields. Exam relevance is stated HONESTLY — most of
// this subject is "not yet in NEET-PG; institutional curricula and vivas".

const lessons: ConceptLesson[] = [
  // ═══ Topic: ai-foundations ════════════════════════════════════════════════
  {
    id: 'c-ai-what-is-medical-ai',
    name: 'What Is AI in Medicine?',
    kind: 'ai-concept',
    oneLiner:
      'AI in medicine is computer software that learns patterns from medical data — images, notes, lab values — and uses those patterns to help doctors see, predict, and decide.',
    whyMatters:
      'AI tools are already inside real clinics: retina-screening programmes, stroke triage, documentation helpers. A doctor who understands them can use them safely and spot nonsense. A doctor who does not will either over-trust a confident screen or dismiss genuinely useful tools. Understanding the tool is now part of using the tool.',
    explain30s:
      'Artificial intelligence (AI) is the broad field of making computers do tasks that seem to need intelligence. Machine learning (ML) is the part of AI where the computer is not given rules — it is given examples, and it finds the rules itself. A "model" is the finished pattern-finder. Show it enough labelled examples (this scan: stroke; that scan: no stroke) and it learns to judge new cases. In medicine, AI never replaces the doctor’s judgement; it adds a fast, consistent second look. The doctor remains responsible for the decision.',
    eli5:
      'Think of a student who has seen 10,000 solved ECGs. Nobody taught them a rule for every pattern — they just saw so many labelled examples that they started to recognise the patterns themselves. That is machine learning. The student is not a cardiologist. They are brilliant at spotting patterns that LOOK like ones they have seen, and hopeless at anything new or weird. A good teacher uses the student’s speed but always double-checks the answers. That teacher is the doctor.',
    firstPrinciples: [
      'Start with the term: "artificial intelligence" is an umbrella for software doing tasks that normally need human intelligence — recognising, predicting, translating, summarising.',
      'Narrow to machine learning: instead of hand-written rules ("if creatinine > X and age > Y then…"), the program learns rules from labelled examples.',
      'Define the "model": the learned pattern-finder. Training = the learning phase on known cases. Testing = measuring it on cases it has never seen.',
      'Add data: medical AI learns from X-rays, pathology slides, ECGs, notes, lab trends. If the data is narrow or biased, the model inherits that.',
      'Place it in the workflow: AI flags, ranks, drafts, or predicts — a doctor interprets, verifies, and decides. That last step is not optional.',
    ],
    mechanism:
      'Hierarchy to keep straight: AI ⊃ machine learning ⊃ deep learning. Older "rule-based" medical software (expert systems) followed explicit if-then rules written by humans — brittle, because medicine’s rules have exceptions. Machine learning flipped the approach: extract patterns statistically from examples. The output of training is a model file: numbers (weights) that transform new inputs into outputs (a category, a risk score, a drafted sentence).',
    mistakes: [
      'Calling every calculator "AI" — a fixed formula (like a creatinine-clearance equation) does not learn from data; a model does.',
      'Assuming the model "understands" medicine. It matches statistical patterns; it has no concept of the patient as a person.',
      'Thinking AI in medicine means robots diagnosing alone. Almost every deployed tool today is assistive.',
    ],
    analogies: [
      'AI model = pattern-hungry student; doctor = the supervising teacher who signs off.',
      'Rule-based system = a recipe book; machine learning = a chef who learned from tasting thousands of dishes.',
    ],
    examRelevance:
      'Not yet in NEET-PG or INI-CET as a formal subject — NEET-PG weight for this pack is honestly 0. AI literacy appears in institutional curricula (AI electives, MD/DM seminars), medical-education conferences, and increasingly as viva questions about research interpretation ("this paper claims doctor-level performance — what would you check?").',
    clinicalRelevance:
      'You will meet AI as a consumer (documentation tools, imaging triage), a decision-maker-under-supervision (screening programmes), and an appraiser (reading trials and marketing claims). All three roles need the same base: knowing what a model is and is not.',
    teachDeeper: [
      'Where did "AI" start? The term dates to the 1950s (Dartmouth workshop era); medicine’s first expert systems came in the 1970s — decades before today’s data-rich wave.',
      'Why now? Three ingredients matured together: digitised health data, much faster processors (GPUs), and better learning algorithms.',
      'Assistive vs autonomous: an assistive tool suggests; an autonomous tool acts within a narrow approved task (rare today — see the human-in-the-loop lesson).',
    ],
    crossLinks: [
      { label: 'Sensitivity & specificity (this pack)', why: 'The same statistics you already use for any diagnostic test are exactly how AI performance is measured.', subject: 'AI in Medicine' },
      { label: 'Evidence-based medicine appraisal (Community Medicine)', why: 'Reading an AI claim uses the same critical-appraisal muscles as reading any trial.', subject: 'Community Medicine' },
    ],
    sources: [
      whoRef('Ethics and governance of artificial intelligence for health (guidance framing)', 'health-organization'),
      fdaRef('Digital health and artificial-intelligence-enabled medical software (regulatory context)'),
      mitRef('Introductory AI and machine-learning lecture materials'),
    ],
    evidenceLevel: 'widely-taught',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-machine-learning-basics',
    name: 'How Machines Learn: Data, Training & Testing',
    kind: 'ai-concept',
    oneLiner:
      'A machine-learning model learns by practising on labelled examples (training data) and is graded on examples it has never seen (test data) — exactly the exam discipline you already follow.',
    whyMatters:
      'Every AI claim you will ever read rests on one question: was it tested on data like the data it learned from? Doctors who understand train/test discipline immediately smell the most common type of AI hype — performance measured on the model’s own homework.',
    explain30s:
      'Supervised learning gives the computer many examples WITH answers: image + label ("stroke" / "no stroke"). It practices on the training set, adjusting itself to reduce mistakes. Its skill is then measured on the test set — data held back, never used for practice. If you test on training data, you measure memory, not skill. Data is usually split into training / validation / test portions; exact ratios are conventions, not laws (70:30 and 80:20 are common).',
    eli5:
      'A student prepares using 800 old exam questions, then faces 200 brand-new ones. Their score on the NEW questions is their real ability. If they scored 95% on the old questions they had already seen and 55% on the new ones — the 95% was memory, not learning. Models do exactly this, which is why the honest number is always the test-set score.',
    firstPrinciples: [
      'Define the ingredients: DATA (examples), FEATURES (the inputs, e.g. pixels, age, lab values), LABELS (the answers to learn, e.g. "fracture present").',
      'Supervised learning = learning from features + labels. Unsupervised learning finds structure without labels (e.g. clustering similar patients). Reinforcement learning learns by trial, reward, and penalty.',
      'Training: the model makes predictions, measures its error against the labels, and adjusts its internal numbers (weights) to err less — repeated millions of times.',
      'Holding out data: keep a test set the model never sees during training. Only test-set performance predicts real-world usefulness.',
      'Overfitting: the model memorises quirks of the training set instead of learning the real pattern — like a student memorising answer keys. Symptom: great training scores, poor test scores.',
      'Generalisation: the whole game. A model is only as good as its performance on data it did not learn from.',
    ],
    mechanism:
      'Learning = numerical error minimisation. The model outputs a prediction; a loss function measures how wrong it was; an algorithm (gradient descent) nudges the weights slightly downhill on that error surface; repeat. "Validation set" = used during development to tune choices (model size, settings); "test set" = touched once, at the end, for an honest grade.',
    numbers: [
      { label: 'Common data splits', value: '70:30 or 80:20 (train:test)', note: 'Conventions, not rules — what matters is that the test set is untouched until final evaluation.' },
      { label: 'Overfitting signature', value: 'Training score ≫ test score', note: 'The gap, not the absolute score, is the alarm bell.' },
    ],
    mistakes: [
      'Believing a model’s quoted accuracy without asking: on WHICH data — training or test?',
      'Data leakage: when information from the test set (or the future) sneaks into training — performance looks magical until it collapses in real use.',
      'Assuming more data always fixes a bad task — if the label is wrong or the task is ill-defined, more data just memorises the mistake better.',
    ],
    analogies: [
      'Test set = the unseen exam paper; training set = past papers you practised on.',
      'Overfitting = memorising past-paper answer keys instead of understanding the subject.',
    ],
    examRelevance:
      'Not in NEET-PG as a named topic. The underlying ideas (sampling bias, overfitting as a form of systematic error, train/test discipline) map onto biostatistics and research-methodology vivas — a favourite angle when examiners discuss "why did the study fail in the real world?".',
    clinicalRelevance:
      'When your hospital proposes to buy or build an AI tool, the first question is the one this lesson teaches: "Show me performance on data this model never saw — ideally from patients like ours."',
    teachDeeper: [
      'Cross-validation: rotating which slice of data serves as the test set, so every example gets tested — a more stable estimate on small datasets.',
      'Feature engineering vs representation learning: classic ML needed humans to hand-craft features; deep learning learns features itself from raw data — one reason it took over imaging.',
      'Labels are made by humans — label noise caps the ceiling of any model trained on them.',
    ],
    crossLinks: [
      { label: 'Sampling & selection bias (Biostatistics)', why: 'A model trained on a biased sample inherits the bias — the same failure as a survey with a biased sample.', subject: 'Community Medicine' },
      { label: 'External validation (this pack)', why: 'The test set is step one; a genuinely NEW hospital is step two.', subject: 'AI in Medicine' },
    ],
    sources: [
      mitRef('Machine-learning fundamentals (supervised learning, generalisation)'),
      ncbiRef('Literature on training/test methodology in clinical prediction models'),
      hmsRef('Harvard Medical School online education on data science in medicine'),
    ],
    evidenceLevel: 'widely-taught',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-deep-learning-llms ═════════════════════════════════════════
  {
    id: 'c-ai-deep-learning',
    name: 'Deep Learning & Neural Networks',
    kind: 'ai-concept',
    oneLiner:
      'Deep learning uses stacked layers of simple mathematical units ("neurons") that learn to detect features — from edges in an X-ray to whole organs — directly from raw data.',
    whyMatters:
      'Deep learning is the engine behind nearly every headline medical-AI result: retina screening, skin-lesion classification, chest X-ray triage. If you understand what the layers are doing, "the AI looked at the scan and found cancer" becomes a comprehensible — and checkable — claim.',
    explain30s:
      'A neural network is layers of tiny calculator units. Each unit takes numbers in, multiplies by learned weights, and passes a signal on. Early layers learn simple features (edges, gradients); deeper layers combine them into complex ones (borders, textures, organs, lesions). Convolutional neural networks (CNNs) specialise in images by scanning them with small filters — perfect for radiographs and slides. "Deep" just means many layers. Training adjusts millions of weights until the output errors shrink.',
    eli5:
      'Imagine a relay of students looking at a chest X-ray. Student 1 only knows lines and edges. Student 2 groups edges into shapes. Student 3 spots textures and shadows. Student 4 says "that pattern looks like pneumonia I have seen". Each student only does one simple job, but the chain together recognises the whole disease. That chain is a deep network — and each "student" is a layer of simple maths, not a real neuron.',
    firstPrinciples: [
      'A single artificial "neuron" is a weighted sum plus a simple non-linear step — nothing more mystical than that.',
      'Stack neurons in LAYERS; connect layers so each builds on the last. "Deep" = many layers.',
      'For images, use convolution: small filters slide across the image, each learning to fire on a local pattern (an edge, a curve, a nodule rim).',
      'Training: make a prediction, measure the error, propagate blame backwards through the layers (backpropagation), nudge every weight to reduce future error.',
      'The network learns its OWN features — nobody hand-codes "look for air bronchograms". Given labelled data, the filters emerge during training.',
      'Cost of power: deep models are data-hungry and can latch onto shortcuts (a ruler in every tumour photo) — which is why careful validation matters.',
    ],
    mechanism:
      'Why deep learning transformed imaging: images are huge raw number grids; CNNs exploit their spatial structure and need no manual feature design. Around 2012, a deep network’s dominant win in the ImageNet photo-recognition contest is widely credited with igniting the modern wave — medical imaging followed within a few years.',
    numbers: [
      { label: 'What a layer learns (CNN)', value: 'Early: edges → mid: shapes/textures → deep: lesion-like patterns', note: 'Feature hierarchy is learned, not programmed.' },
      { label: 'Scale of modern models', value: 'Thousands to billions of learned weights', note: 'Why they need large datasets and why their behaviour can be hard to fully explain.' },
    ],
    mistakes: [
      'Believing network "neurons" resemble biological neurons — the name is an analogy, the maths is crude by brain standards.',
      'Assuming deep learning is always the right tool — for small tabular datasets, simpler models often win and are easier to audit.',
      'Forgetting the shortcut risk: a model can score well using clues you never intended (laterality markers, text on the image).',
    ],
    analogies: [
      'CNN filters = a stack of increasingly senior readers, each annotating what the previous one missed.',
      'Backpropagation = a marksheet that travels backwards through the relay, telling every student exactly how to adjust.',
    ],
    examRelevance:
      'Not in NEET-PG. Recognised in institutional electives and radiology/pathology teaching programmes; the phrase "convolutional neural network" now appears in journal abstracts you will read in journal clubs — this lesson makes those abstracts readable.',
    clinicalRelevance:
      'Imaging AI you may encounter (retina, chest X-ray, stroke triage, digital pathology) is overwhelmingly CNN-based or CNN-derived. Understanding the shortcut risk explains why governance asks: was the model tested on scanners and populations like ours?',
    teachDeeper: [
      'Beyond images: the same deep-learning idea powers models for ECG waveforms, audio (cough/heart sounds research), and free text — data type changes, the principle stands.',
      'Transformers (the architecture behind LLMs) replaced CNNs in many tasks by attending to relationships across the whole input — see the LLM lesson.',
      'Transfer learning: start from a network pretrained on general images, fine-tune on medical data — the standard trick that makes medical CNNs feasible.',
    ],
    crossLinks: [
      { label: 'Chest X-ray interpretation (Respiratory Medicine)', why: 'The clinical skill CheXNet-style systems emulate — and the skill you use to verify them.', subject: 'Respiratory Medicine' },
      { label: 'Histopathology basics (Pathology)', why: 'Digital-slide AI is built on the same pattern-recognition pathologists train for.', subject: 'Pathology' },
    ],
    sources: [
      mitRef('Deep-learning lecture materials (neural networks, CNNs)'),
      ncbiRef('Reviews of deep learning applications in medical imaging'),
      journalRef('Nature (journal)', 'Deep-learning landmark imaging studies (reference for attribution)'),
    ],
    evidenceLevel: 'widely-taught',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-llms-multimodal',
    name: 'Large Language Models & Multimodal AI',
    kind: 'ai-concept',
    oneLiner:
      'A large language model (LLM) predicts the next word so well — over vast amounts of text — that it can draft, summarise, translate and answer questions; multimodal models extend this to images, audio and signals.',
    whyMatters:
      'LLMs are the first medical AI most doctors meet personally: drafting referral letters, summarising notes, answering "explain this report" requests. They are also the easiest to misuse, because their fluency feels like understanding. This lesson gives you the accurate mental model — and the guardrail.',
    explain30s:
      'An LLM is trained on enormous text corpora to do one task: given the words so far, predict the next word. Do this well enough, at scale, and the model can write essays, answer questions, and summarise records. It has no database of verified facts — it has learned statistical patterns of language, including medicine’s. That is why it can be simultaneously brilliant and confidently wrong (hallucination). Multimodal models add other data types — images, audio, ECGs — to the same idea. A "prompt" is your instruction; the quality of output depends heavily on it.',
    eli5:
      'Think of an autocomplete that read most of the internet — including textbooks and forums — and got eerily good at continuing any sentence. Ask it a medical question and it writes a fluent answer because fluent answers are the likeliest continuations it has seen. Sometimes the likeliest-sounding continuation is wrong. The model does not "know" — it "continues". Treat every output as a clever draft from a stranger, never as a verified fact.',
    firstPrinciples: [
      'Core mechanism: next-token prediction. A "token" is a word-piece; the model assigns probabilities to every possible next token.',
      'Scale created surprise ability: with enough text and parameters, models can follow instructions, reason step-by-step on request, and hold context across a long conversation.',
      'Instruction tuning: models are refined with human feedback so they behave helpfully — but helpfulness is not the same as correctness.',
      'Grounding: connect the model to verified sources (e.g. retrieval systems that feed it real documents first) to reduce — never eliminate — invented content.',
      'Multimodality: the same principle extends beyond text — an image-language model can "describe a radiograph", combining learned visual and textual patterns.',
      'The doctor’s rule: LLM output is a DRAFT with a confidence problem. Verify anything that informs a decision.',
    ],
    mechanism:
      'Inside: transformer architecture — attention layers let every token "look at" every other token, capturing long-range relationships in text. Medical uses fall into three honest buckets: (1) paperwork drafting (notes, letters, summaries), (2) information retrieval with grounding, (3) patient-facing explanation. Diagnosis and treatment decisions are NOT an approved bucket without rigorous, regulated systems.',
    numbers: [
      { label: 'Training signal', value: 'Next-token prediction over very large text corpora', note: 'No curated medical fact-check at base-training time — hence the need for verification downstream.' },
      { label: 'Output style risk', value: 'Fluency ≠ accuracy', note: 'The single most important one-line takeaway of this lesson.' },
    ],
    mistakes: [
      'Pasting patient-identifying data into a general consumer chatbot — a privacy breach risk (see the privacy lesson).',
      'Trusting a citation the LLM produced without checking it exists — fabricated references are a classic hallucination.',
      'Confusing "it sounds like my consultant" with "it reasons like my consultant" — pattern fluency is not clinical judgement.',
    ],
    analogies: [
      'LLM = a well-read mimic, not a well-trained doctor: perfect diction, occasionally fictional content.',
      'Prompting = briefing a very fast, very literal junior — the clearer the brief, the safer the output.',
    ],
    examRelevance:
      'Not in NEET-PG. Appears in institutional curricula and medical-education discussions ("should students use LLMs?"), and in viva-style questions about interpreting AI-in-medicine research. Some universities now run formal AI-literacy sessions for undergraduates.',
    clinicalRelevance:
      'Ambient scribes and documentation assistants are the fastest-adopted medical LLM use. The professional rule emerging across regulators: the clinician who signs the note owns the note — AI drafted it, you verified it.',
    clinicalUpdateRequired: true,
    teachDeeper: [
      'Benchmarks vs bedside: high scores on medical exam question banks (e.g. USMLE-style sets) made headlines, but clinician reviews found long-form answers still needed supervision — see the Med-PaLM paper explainer in this platform.',
      'Retrieval-augmented generation (RAG): the model first retrieves real documents, then writes grounded in them — a standard safety pattern.',
      'Why hallucinations happen: the model optimises plausible continuation, not truth; there is no internal truth-check.',
    ],
    crossLinks: [
      { label: 'Medical record documentation norms (General Practice)', why: 'The note is a medico-legal document; AI drafting changes how, not whether, you own it.', subject: 'General Medicine' },
      { label: 'Hallucination & safety (this pack)', why: 'The dedicated safety lesson for LLM failure modes.', subject: 'AI in Medicine' },
    ],
    sources: [
      journalRef('Nature Medicine (journal)', 'Reviews and landmark studies of LLMs in medicine (name-only attribution)'),
      fdaRef('FDA discussions of generative-AI-enabled medical devices (emerging regulatory area)'),
      whoRef('WHO guidance on multimodal large language models in health (2024-class guidance framing)', 'health-organization'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'medium',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-clinical-decision-support ══════════════════════════════════
  {
    id: 'c-ai-clinical-decision-support',
    name: 'Clinical Decision Support (CDS)',
    kind: 'ai-concept',
    oneLiner:
      'Clinical decision support is any tool that helps a clinician decide at the point of care — from a drug-interaction pop-up to an AI risk score — and its hardest problem is not accuracy but attention.',
    whyMatters:
      'CDS is where AI actually touches your daily work. Done well, it catches what tired humans miss. Done badly, it buries clinicians in alerts until they start clicking "ignore" — a documented safety hazard called alert fatigue. Understanding CDS design is understanding how AI behaves in real wards.',
    explain30s:
      'CDS answers one of three questions: "Is something wrong?" (alerts: drug interactions, allergy flags), "What is the risk?" (scores: sepsis risk, readmission risk), or "What next?" (suggestions, order sets). Classic CDS used fixed rules; AI-based CDS learns risk patterns from data. The core loop is always: data → risk estimate → human review → action. The tool advises; the clinician decides. Every added alert competes for the same limited attention budget, so poorly tuned CDS can make care less safe.',
    eli5:
      'Imagine a co-worker who taps your shoulder every few minutes. Sometimes they save your life ("that drug clashes with her kidney function!"). Sometimes they tap for nothing. If they tap too often for nothing, you start ignoring taps — including the important one. Designers must keep the taps rare and worth hearing. AI can make taps smarter (catching subtle patterns), but the shoulder-tapping budget rule never changes.',
    firstPrinciples: [
      'Classify the tool: alert (something needs attention), score (a risk estimate), suggestion (a proposed action), or summary (condensed information).',
      'Data in, advice out: CDS is only as good as the data feed — a stale allergy field produces wrong "all clear" advice.',
      'The intervention point matters: a great score nobody sees changes nothing; a mediocre score placed at ordering time changes behaviour.',
      'Alert fatigue: high false-positive rates train humans to dismiss alerts reflexively — a system-level safety failure.',
      'Human-in-the-loop: recommendations are presented, never auto-executed, except in narrow approved autonomous settings (rare).',
      'Evaluation: judge CDS by outcomes and behaviour change (did prescribing actually get safer?), not by the model’s offline accuracy alone.',
    ],
    mechanism:
      'Rule-based CDS: if-then logic on coded data (drug A + renal impairment → warn). AI-based CDS: a model computes risk from many inputs and often outputs a calibrated score with a threshold. Modern EHRs expose standard interfaces so tools can plug into the workflow at the right moment (ordering, chart review).',
    numbers: [
      { label: 'Alert outcome chain', value: 'Data → risk estimate → alert → human review → action', note: 'Remove any link and the system fails — most silently at "human review".' },
    ],
    mistakes: [
      'Measuring a CDS tool by its model’s paper accuracy instead of its effect on real decisions.',
      'Overriding without thinking — overrides are sometimes right, but blind override is how the system learns nothing.',
      'Assuming the data feeding the alert is current — garbage in, confident garbage out.',
    ],
    analogies: [
      'CDS = a spell-checker for decisions: catches many slips, not all, and must not type the essay for you.',
      'Alert fatigue = alarm-clock deafness: hear enough false mornings and you sleep through the real one.',
    ],
    examRelevance:
      'Not in NEET-PG. Clinical decision support and pharmacovigilance-adjacent concepts surface in hospital practice and institutional teaching; the classic scores CDS builds on (e.g. early-warning scores) ARE exam-relevant through their clinical subjects.',
    clinicalRelevance:
      'Interns and residents meet CDS daily: interaction alerts, sepsis banners, deterioration scores. Knowing why thresholds are tuned (and who tunes them) turns you from an alert-clicker into a useful reviewer when your unit asks "is this tool helping or drowning us?".',
    reasoning: [
      { stage: 'symptom', label: 'Data appears', detail: 'Vitals trend, new lab, new order enters the EHR in real time.' },
      { stage: 'investigation', label: 'Tool estimates risk', detail: 'Rule or model converts data into a flag or score with a threshold.' },
      { stage: 'interpretation', label: 'Clinician verifies', detail: 'You check the raw data, the context the tool cannot see, and the patient in front of you.' },
      { stage: 'diagnosis', label: 'Judgement', detail: 'Is the flag a true signal here? Confirmatory findings sought as for any hypothesis.' },
      { stage: 'management', label: 'Decision + ownership', detail: 'You act, do not act, or escalate — and the decision is yours to document, not the software’s.' },
      { stage: 'complication', label: 'Feedback loop', detail: 'Overrides and misses feed system tuning; silent override-everything is the failure mode to avoid.' },
    ],
    global: [
      {
        region: 'India',
        delivery: 'Decision support in India increasingly rides national digital infrastructure — telemedicine platforms (e.g. eSanjeevani-style services) and ABDM-linked records create channels where alerts and summaries can follow the patient across facilities.',
        terminology: ['eSanjeevani — national telemedicine service (name well known; features evolve)', 'ABDM-linked health records'],
        note: 'Describes the general direction of digitally-mediated decision support, not specific tool claims — verify current programmes.',
      },
      {
        region: 'United States',
        delivery: 'CDS is deeply embedded in certified EHR systems — drug-interaction and allergy alerts are near-universal, and standards exist for connecting third-party decision-support apps into the record at point of care.',
        terminology: ['CDS Hooks — a known standard pattern for app-triggered clinical suggestions'],
        note: 'Alert fatigue is a well-documented national safety topic; describes the ecosystem, not specific products.',
      },
      {
        region: 'United Kingdom',
        delivery: 'NHS decision support leans on national guidance (NICE) embedded into pathways and formularies; digital tools are assessed against evidence standards before wider deployment.',
        terminology: ['NICE guidance — the reference standard clinical pathways build on'],
        note: 'A guidance-first model: AI suggestions are expected to align with, or justify deviations from, national guidance.',
      },
      {
        region: 'WHO/Global',
        delivery: 'WHO promotes point-of-care digital decision support as a way to standardise care where specialists are scarce — and warns that unvalidated tools can entrench error at population scale.',
        note: 'The global trade-off in one line: reach vs evidence; both WHO framing and country examples are general descriptions.',
      },
    ],
    crossLinks: [
      { label: 'Drug–drug interactions (Pharmacology)', why: 'The canonical rule-based CDS use case you already rely on.', subject: 'Pharmacology' },
      { label: 'Early warning scores (Emergency Medicine)', why: 'Non-AI risk stratification that AI-CDS extends.', subject: 'Emergency Medicine' },
      { label: 'Predictive deterioration models (this pack)', why: 'The AI-powered evolution of the same idea.', subject: 'AI in Medicine' },
    ],
    sources: [
      whoRef('WHO guidance framing: AI for health decision-support safety principles'),
      niceRef('NICE evidence standards for digital health technologies (evaluation framing)'),
      jhmiRef('Johns Hopkins Medicine patient-safety and clinical-informatics public resources'),
    ],
    evidenceLevel: 'varies-by-guideline',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-predictive-models',
    name: 'AI Predictive Models in Clinical Care',
    kind: 'ai-concept',
    oneLiner:
      'Predictive models estimate what is LIKELY to happen — deterioration, sepsis, readmission, no-show — so care can move earlier; their value is the head-start, and their danger is the false alarm.',
    whyMatters:
      'Prediction is the quiet workhorse of hospital AI: watching hundreds of data streams a human cannot watch, flagging patients who may crash hours before they crash. Used well, that head-start saves lives. Used carelessly, it floods wards with alerts and burns trust. This lesson teaches you to read a prediction the way you read a fever — as information needing interpretation, not an order.',
    explain30s:
      'A predictive model takes current data (vitals, labs, history) and outputs a probability of a future event within a window ("sepsis within 12 hours"). It is trained on past cases where the outcome is known. Two questions decide usefulness: discrimination (does it rank sicker patients higher? — see the AUROC lesson) and calibration (does a predicted 20% actually happen about 20% of the time?). The third question is human: what does the ward DO with the flag? Prediction without a response plan is decoration.',
    eli5:
      'A weather forecast for patients. "70% chance of rain" does not mean it will rain on YOU — it means that among many similar days, rain happened 7 times out of 10. A good forecast lets you carry an umbrella early. A forecast that cries rain every day gets ignored — and the day it was right, nobody listened. Hospitals must design both the forecast AND the umbrella-reflex.',
    firstPrinciples: [
      'Define the event and the window precisely: "sepsis within 12 hours" and "sepsis" must be coded definitions, or the model learns a blurry target.',
      'Training data = past patients with known outcomes; the model learns which present-day patterns preceded the event.',
      'Discrimination: can it rank the soon-to-deteriorate above the stable? (Measured by AUROC/AUPRC — see this pack’s metrics lessons.)',
      'Calibration: predicted probabilities should match observed frequencies — a 10% risk should happen ~10 times per 100 such patients.',
      'Threshold choice sets the trade-off: lower it for sensitivity (more catches, more false alarms) or raise it for precision (fewer, more reliable alerts).',
      'Closing the loop: the alert must trigger a defined human response (nurse review, escalation protocol) — or it is noise.',
    ],
    mechanism:
      'Models range from logistic regression (transparent, one term per feature) to gradient-boosted trees and deep networks. Famous target: deterioration and sepsis prediction from continuous vitals. Cautionary real-world lesson: a widely sold proprietary sepsis model, when independently evaluated on external data, alerted on far fewer true sepsis cases than the vendor’s own reports implied — external validation is not a formality (see this pack’s external-validation and dataset-shift lessons).',
    numbers: [
      { label: 'What a prediction is', value: 'A probability for a defined event within a defined window', note: 'Never a certainty; never a diagnosis.' },
      { label: 'Calibration check', value: 'Predicted 10% → observed ≈ 10 in 100', note: 'Miscalibrated models mislead even with good ranking ability.' },
    ],
    mistakes: [
      'Treating "high risk" as a diagnosis or an automatic treatment trigger.',
      'Judging the model by alerts seen: with rare events, most alerts are false positives even for a good model (base-rate effect).',
      'Deploying without the response plan — an alert nobody is rostered to answer.',
    ],
    analogies: [
      'Predictive model = smoke detector: tuned to catch fires early, will false-alarm; you still design WHO checks the kitchen.',
      'Calibration = an honest barometer; discrimination = ordering days from most to least likely to rain.',
    ],
    examRelevance:
      'Not in NEET-PG. Discussed in institutional critical-care and informatics teaching; the statistical ideas underneath (sensitivity/specificity, predictive values) are classic exam material — see this pack’s evaluation lessons.',
    clinicalRelevance:
      'Ward rounds increasingly start with a "risk board". Your skill: interpret scores with base rates in mind, examine the patient, and feed overrides back — the model improves only if real usage is measured.',
    reasoning: [
      { stage: 'symptom', label: 'Model flags rising risk', detail: 'Continuous data pattern matches learned pre-deterioration signatures.' },
      { stage: 'investigation', label: 'Nurse/clinician review', detail: 'Bedside assessment: is the patient actually changing? Check the data feed for artefacts (probe off, wrong weight).' },
      { stage: 'interpretation', label: 'Contextualise', detail: 'Base rate, comorbidity trajectory, what the model cannot see (clinical gestalt, family report).' },
      { stage: 'diagnosis', label: 'Confirm or dismiss', detail: 'Objective findings sought as for any clinical hypothesis — the flag is a prompt to look, not a verdict.' },
      { stage: 'management', label: 'Escalate if warranted', detail: 'Defined pathway: review team, investigations, treatment decisions per standard care — not per the score.' },
      { stage: 'complication', label: 'Both failure directions matter', detail: 'Missed true events (alert never fired or was dismissed) and alert fatigue (too many false alarms) are BOTH safety failures.' },
    ],
    crossLinks: [
      { label: 'SIRS and sepsis definitions (Infectious Disease)', why: 'The outcome definitions such models learn from — and their controversies.', subject: 'General Medicine' },
      { label: 'AUROC & AUPRC (this pack)', why: 'How the model’s ranking skill is quantified.', subject: 'AI in Medicine' },
      { label: 'External validation (this pack)', why: 'The famous sepsis-model cautionary tale lives here.', subject: 'AI in Medicine' },
    ],
    sources: [
      ncbiRef('External validation literature on clinical prediction models (e.g. sepsis model evaluations)'),
      whoRef('WHO guidance on AI for health — model governance principles'),
      journalRef('JAMA (journal)', 'Peer-reviewed external-validation studies of proprietary prediction models (name-only attribution)'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-medical-imaging ════════════════════════════════════════════
  {
    id: 'c-ai-imaging-ai',
    name: 'Medical Imaging AI',
    kind: 'ai-concept',
    oneLiner:
      'Imaging AI — the most deployed medical AI — reads pixels to detect, segment, triage or quantify findings on X-rays, CTs, MRIs, retinal photos, skin images and pathology slides.',
    whyMatters:
      'If you meet one AI tool in practice, it will probably be an imaging tool: a stroke-triage flag, a retina-screening result, a chest X-ray worklist reorder. The landmark studies (retina, skin, breast screening) set the template for all medical-AI evidence — learn to read them here and you can read the whole field.',
    explain30s:
      'Four jobs imaging AI does: DETECT ("nodule present?"), TRIAGE (move the likely-positive scan up the worklist), QUANTIFY (measure volumes, percentages), and SCREEN (autonomous or assisted population programmes). Images are ideal for AI: standardised, digital, and full of visual patterns CNNs learn well. The famous studies — diabetic retinopathy (JAMA 2016), skin cancer (Nature 2017), chest X-ray pneumonia (arXiv 2017), mammography (Nature 2020) — each compared model vs experts on held-out data. Each also showed the same pattern: strong lab performance, then real-world questions about data, workflow, and generalisation.',
    eli5:
      'Give the computer a million labelled photos — "this retina has diabetes damage", "this one is healthy" — and it learns the tell-tale patterns, like a student who has seen more slides than any human could in ten lifetimes. It never gets tired at 3 a.m. But it has only seen what it was shown: change the camera, the lighting, the patient population, and it may stumble — exactly like the student who studied one textbook and faces a new exam board.',
    firstPrinciples: [
      'Images are numbers: each pixel is a value; a CNN learns filters over these values — see the deep-learning lesson.',
      'The four task types (detect, triage, quantify, screen) have different risk profiles: triage failure means delay; screening failure means missed disease.',
      'Ground truth matters: labels from biopsy beat labels from a single reader’s opinion; many landmark studies built careful reference standards.',
      'Performance is two-dimensional: sensitivity (catching disease) vs specificity (not alarming the healthy) — chosen threshold, not a single grade.',
      'Deployment differs from the lab: new scanners, different patients, image-quality problems, and humans in the loop — see the CHI-2020 deployment paper explainer.',
      'Regulatory status varies by country and by exact intended use: a cleared screening aid is not an autonomous diagnostician.',
    ],
    mechanism:
      'Typical pipeline: acquire image → preprocess → model outputs finding probabilities/heatmaps → integrate into PACS/worklist → radiologist or screening programme acts. Autonomous screening (e.g. certain retinal systems) can issue a referral recommendation without physician over-read within a narrow approved indication — the exception that proves how narrow autonomy remains.',
    numbers: [
      { label: 'Landmark retina study (Gulshan 2016, JAMA)', value: 'Detection of referable diabetic retinopathy on two independent image sets', note: 'See the paper explainer for the honest performance description.' },
      { label: 'Landmark skin-cancer study (Esteva 2017, Nature)', value: '~129,450 clinical images, tested against 21 dermatologists', note: 'One of the most-cited numbers in medical AI.' },
      { label: 'Triage vs diagnosis', value: 'Different tasks, different risk', note: 'A triage flag ordering a worklist is safer to err with than an autonomous "no disease" verdict.' },
    ],
    mistakes: [
      'Reading "radiologist-level" headlines without asking: which radiologists, which dataset, which operating point?',
      'Assuming a tool validated in one country transfers to your population unchanged — imaging devices, prevalence and skin tones differ.',
      'Forgetting image quality: most deployed-system failures start with a blurred, mis-centered or under-exposed capture.',
    ],
    analogies: [
      'Imaging AI = an extremely well-practised junior reader: fast, tireless, needs supervision, knows only what it has seen.',
      'Worklist triage = the sorting hat that says "look at THIS one first" — it does not have to be right every time to help, but wrong orderings cost time.',
    ],
    examRelevance:
      'Not in NEET-PG. Imaging AI appears in radiology and ophthalmology residency teaching, institutional electives, and journal clubs; the underlying statistics (sens/spec/AUROC) are standard exam fare.',
    clinicalRelevance:
      'Real deployments to know qualitatively: diabetic-retinopathy screening programmes (including autonomous-grade tools in some countries), stroke large-vessel-occlusion triage, chest X-ray prioritisation, digital-pathology assistants. In each, the AI changes WHO looks first — the human still decides.',
    reasoning: [
      { stage: 'symptom', label: 'Image enters system', detail: 'Capture quality checked first — the most common real-world failure point.' },
      { stage: 'investigation', label: 'Model scores the image', detail: 'Outputs a probability ± a highlighted region (see the explainability lesson).' },
      { stage: 'interpretation', label: 'Clinician reads WITH the flag', detail: 'The flag directs attention; the clinician still interprets the image (or a specialist reviews if autonomous-screening says refer).' },
      { stage: 'diagnosis', label: 'Diagnosis per standard care', detail: 'Diagnosis integrates history, examination and other tests — never the AI output alone.' },
      { stage: 'management', label: 'Action & documentation', detail: 'Document what the tool suggested and your independent read — ownership stays with the clinician.' },
      { stage: 'complication', label: 'Failure audit', detail: 'Missed cases and false alarms feed quality review; a tool nobody audits slowly decays in usefulness.' },
    ],
    global: [
      {
        region: 'India',
        screening: 'Diabetic-retinopathy screening is a recognised public-health need; AI-based retinal screening has been piloted within national programme settings and via start-up devices, with the aim of reaching centres without enough ophthalmologists.',
        note: 'AI screening is positioned as a way to extend specialist reach — outcomes depend on image quality, connectivity and referral pathways; describes general direction, not specific programme claims.',
      },
      {
        region: 'United States',
        screening: 'A large number of AI-enabled imaging devices have received FDA clearance via the 510(k)/De Novo routes — imaging is the leading AI device category; most are assistive (triage/detection), a few narrow uses are autonomous.',
        note: 'Cleared ≠ proven outcome benefit in every setting; clearance indicates the regulatory bar for that intended use was met.',
      },
      {
        region: 'United Kingdom',
        screening: 'NICE maintains evidence standards for digital health technologies and assesses imaging AI through health-technology evaluation, emphasising real-world evidence before wide adoption.',
        note: 'The UK route stresses measured clinical and system benefit, not just technical accuracy.',
      },
      {
        region: 'WHO/Global',
        screening: 'WHO highlights AI’s potential to extend diagnostic access where specialists are scarce, and equally warns about unequal validation across populations.',
        note: 'The global framing is equity: tools must be validated in the populations that will use them.',
      },
    ],
    crossLinks: [
      { label: 'Diabetic retinopathy grading (Ophthalmology)', why: 'The canonical AI screening target — know the clinical grading first.', subject: 'Ophthalmology' },
      { label: 'Large-vessel occlusion stroke (Neurology)', why: 'Time-critical triage is a headline imaging-AI use.', subject: 'Neurology' },
      { label: 'AUROC & AUPRC (this pack)', why: 'How imaging-AI claims are quantified.', subject: 'AI in Medicine' },
    ],
    sources: [
      journalRef('Nature (journal)', 'Esteva 2017 dermatology CNN; McKinney 2020 mammography (name-only attribution)'),
      journalRef('JAMA (journal)', 'Gulshan 2016 diabetic retinopathy deep-learning study (name-only attribution)'),
      fdaRef('AI-enabled medical device listings — imaging as the dominant category'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'high',
  },

  // ═══ Topic: ai-clinical-nlp ═══════════════════════════════════════════════
  {
    id: 'c-ai-clinical-nlp',
    name: 'Clinical NLP & AI Documentation',
    kind: 'ai-concept',
    oneLiner:
      'Clinical natural language processing (NLP) turns unstructured medical text — notes, discharge summaries, radiology reports — into usable information, and modern scribes DRAFT the text for you.',
    whyMatters:
      'Most medical data is text, and most clinician time goes to text. NLP decides whether that text becomes searchable, codable, researchable data — and LLM scribes are the fastest-growing AI tool in medicine. Every doctor will soon sign notes they did not type; the rules for doing that safely start here.',
    explain30s:
      'NLP has two classic jobs: extraction ("pull the smoking status, stage and medications out of 200 notes") and generation ("summarise this admission"). Extractive NLP powers coding, quality registries and research cohorts. Generative NLP (LLM-based) drafts documentation — including "ambient scribes" that listen to the consultation (with consent) and produce a draft note. Both share one rule: the extracted or drafted text is a PROPOSAL. A wrong extraction corrupts data silently; a wrong draft corrupts the record visibly — but only if someone reads it.',
    eli5:
      'Imagine a librarian who reads every case file and writes tidy index cards ("patient X: asthma, on inhaler, allergic to penicillin"). Old NLP = the librarian with a strict checklist. New LLM NLP = the librarian who also writes the report for you. Wonderful — until the librarian confidently writes "no allergies" because nobody said the word allergy out loud. The doctor signs the card, so the doctor checks the card.',
    firstPrinciples: [
      'Why text is hard: clinical language is abbreviated, misspelled, negation-rich ("no chest pain"), and context-dependent ("patient denies seizures" ≠ "seizures").',
      'Extraction pipeline: detect entities (drugs, problems, dates) → normalise to codes → resolve negation and time → store as structured data.',
      'Generation pipeline: capture context (audio/text) → LLM drafts → clinician edits and signs. Consent and privacy rules govern the capture step.',
      'Evaluation differs by job: extraction is scored against human annotation; drafting is judged by edits, errors caught, and time saved.',
      'Silent failure mode: an extraction error propagates into databases and research — nobody sees it at the bedside. Build audits.',
      'The signature rule: whoever signs the note owns its content — AI assistance does not transfer responsibility.',
    ],
    mechanism:
      'Old-school: rule-based parsers and statistical models per task. Modern: transformer LLMs handle both extraction and generation in one architecture, prompted per task. Ambient scribes add speech recognition + summarisation with the consultation audio as context.',
    numbers: [
      { label: 'Share of medical data that is text', value: 'The majority of the EHR is unstructured notes', note: 'Why NLP gates research, coding and AI more broadly.' },
    ],
    mistakes: [
      'Signing an AI-drafted note without reading it — the medico-legal owner is you.',
      'Assuming extracted registries are accurate without sampling audits.',
      'Letting a scribe record without patient consent — a consent and privacy failure, not a technicality.',
    ],
    analogies: [
      'Extractive NLP = indexer; generative NLP = ghostwriter. You publish under your name either way.',
      'Negation handling = reading "the patient has NO history of DVT" without missing the "NO".',
    ],
    examRelevance:
      'Not in NEET-PG. Medical records and consent norms ARE exam-relevant through forensic medicine and general practice; NLP itself appears in institutional informatics teaching and health-system discussions.',
    clinicalRelevance:
      'Expect ambient scribes and draft-report tools in outpatient and radiology workflows within your training years. The professional posture: consent properly, read the draft, correct aggressively, sign as author.',
    teachDeeper: [
      'Why coding matters: extracted text feeds ICD coding, quality metrics and payments — extraction bias becomes data bias at population scale.',
      'Summarisation risks: omission is the hallucination nobody notices — the model left OUT the relevant history.',
      'Evaluation standards for scribes are still maturing; ask vendors for edit-rate and error-catch data, not just testimonials.',
    ],
    crossLinks: [
      { label: 'Medical records & consent (Forensic Medicine)', why: 'The legal frame around recording and documenting consultations.', subject: 'Forensic Medicine' },
      { label: 'LLMs & multimodal AI (this pack)', why: 'The technology underneath modern clinical NLP.', subject: 'AI in Medicine' },
      { label: 'Medical data & FHIR (this pack)', why: 'Where extracted text goes — the structured-data layer.', subject: 'AI in Medicine' },
    ],
    sources: [
      journalRef('npj Digital Medicine (journal)', 'Clinical NLP and ambient-documentation literature (name-only attribution)'),
      whoRef('WHO guidance on LLMs in health — documentation and consent framing'),
      ncbiRef('PubMed-indexed literature on clinical NLP evaluation'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'medium',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-drug-discovery ═════════════════════════════════════════════
  {
    id: 'c-ai-drug-discovery',
    name: 'AI in Drug Discovery',
    kind: 'ai-concept',
    oneLiner:
      'AI accelerates drug discovery by predicting which molecules might work — screening billions computationally, predicting protein structures, and designing candidates — before expensive lab work begins.',
    whyMatters:
      'Drug discovery traditionally fails late and expensively. AI moves failure earlier and cheaper, and its headline achievement — protein-structure prediction (AlphaFold) — changed biology research practice worldwide. Doctors should understand both the genuine speed-up and the honest limit: AI shortens DISCOVERY, not the clinical-trials pipeline.',
    explain30s:
      'Finding a drug means finding a molecule that binds the right target, has the right properties, and is safe. AI helps at several steps: virtual screening (computationally testing millions of compounds against a target model), property prediction (will it be absorbed? toxic?), target discovery (mining "omics" data), and structure prediction (AlphaFold predicting 3D protein shapes from sequence — a decades-old grand problem, transformed around 2020-21 and recognised by the 2024 Nobel Prize in Chemistry). None of this skips the lab or the trials; it makes the starting guesses dramatically better.',
    eli5:
      'Looking for a key (drug) for a lock (disease protein) used to mean physically trying keys one by one. AI is like a locksmith who has studied every key and lock ever made and can say: "start with these hundred, not those million." Better first guesses, fewer dead ends. But someone still has to cut the key, test it in real doors (lab), and prove it works in real houses (trials).',
    firstPrinciples: [
      'The pipeline: target selection → compound finding → lead optimisation → preclinical testing → clinical trials. AI concentrates on the early steps.',
      'Virtual screening: models predict how strongly each candidate molecule binds a target — a ranked shortlist replaces brute-force testing.',
      'Structure prediction: knowing a protein’s 3D shape makes rational design possible; deep-learning systems (notably AlphaFold) predict structure from amino-acid sequence with experimental-grade accuracy for many proteins.',
      'Generative chemistry: models can PROPOSE new molecules with desired properties — powerful and requiring rigorous safety evaluation.',
      'Property and toxicity prediction: models flag likely ADMET problems (absorption, metabolism, toxicity) before synthesis.',
      'The wall: biology is complex; candidates that shine computationally still fail in animals and humans. No model replaces trials.',
    ],
    mechanism:
      'Why it works: molecular behaviour is patterned and data-rich (decades of published structures, assay results). Deep learning learns those patterns — including 3D geometry via geometric deep learning — and turns search into prediction. Public artefacts to know by name: AlphaFold’s open protein-structure database (with EMBL-EBI) and its CASP14 benchmark success (~2020).',
    numbers: [
      { label: 'AlphaFold milestone', value: 'CASP14 (2020) — protein-structure prediction transformed; Nobel Prize in Chemistry 2024', note: 'The field’s clearest landmark; the database of predicted structures is publicly available.' },
      { label: 'Where AI acts', value: 'Discovery & preclinical design — NOT trial substitution', note: 'Trials still decide truth.' },
    ],
    mistakes: [
      'Believing "AI-designed drug" means "proven drug" — every candidate still faces the same trial gauntlet.',
      'Assuming AI made drug prices fall — discovery is one costly stage among many.',
      'Conflating prediction with mechanism — a model that binds well in silico says nothing yet about a living body.',
    ],
    analogies: [
      'AI screening = a shortlist generator, not a verdict machine.',
      'AlphaFold = a weather-satellite for proteins: it shows the terrain where experiments still have to travel.',
    ],
    examRelevance:
      'Not in NEET-PG. Appears in pharmacology seminars, MD/PhD routes and institutional seminars; AlphaFold is now standard background in molecular-biology teaching.',
    clinicalRelevance:
      'Expect future labels and formularies to include AI-discovered molecules with no special clinical meaning — a drug is judged by its trial evidence, not its origin story. Precision-medicine coupling (right drug for right genotype) is where bedside impact concentrates (see next lesson).',
    clinicalUpdateRequired: true,
    teachDeeper: [
      'Antibiotic discovery is a headline frontier: AI screens have proposed novel candidate molecules against resistant organisms — early-stage, rigorously unproven until trials.',
      'Repurposing: models mine existing drugs and "omics" data for new indications — faster route than de-novo design.',
      'Failure modes: assay artefacts ("pan-assay interference compounds"), optimistic benchmarks, and the perennial bench-to-bedside gap.',
    ],
    crossLinks: [
      { label: 'Protein structure & function (Biochemistry)', why: 'The biology beneath structure-prediction AI.', subject: 'Biochemistry' },
      { label: 'Clinical trials phases (Pharmacology)', why: 'The pipeline AI accelerates but cannot replace.', subject: 'Pharmacology' },
      { label: 'Antimicrobial resistance (Microbiology)', why: 'A headline target area for AI-driven discovery.', subject: 'Microbiology' },
    ],
    sources: [
      journalRef('Nature (journal)', 'AlphaFold protein-structure-prediction publications (name-only attribution)'),
      ncbiRef('PubMed-indexed reviews of AI in drug discovery'),
      mitRef('Computational biology course materials'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-precision-medicine',
    name: 'AI & Precision Medicine',
    kind: 'ai-concept',
    oneLiner:
      'Precision medicine tailors care to the individual — genotype, molecular profile, context — and AI helps by finding which patients belong to which responsive subgroup.',
    whyMatters:
      'One disease, many diseases: tumours with the same name respond differently by mutation; drugs fail in some metabolisers and shine in others. AI’s pattern-finding suits this subgroup discovery — but the medical logic (biomarkers, eligibility, ethics) is what makes it usable at the bedside.',
    explain30s:
      'Precision medicine matches treatment to measured characteristics of the patient: genetic variants, protein markers, tumour mutations. Classic examples predate AI — HER2 status guiding targeted breast-cancer therapy, HLA-B*57:01 screening before abacavir. AI extends the approach: predicting drug response from multi-omic profiles, finding unnoticed subgroups in real-world data, and matching patients to clinical trials automatically. The model suggests a subgroup; biology and trials must confirm the subgroup means something.',
    eli5:
      'Not every key fits every lock, even when the doors look identical. Precision medicine measures the lock before cutting the key. AI is the assistant who measures thousands of locks quickly and notices: "these 40 doors have the same weird lock — try the new key here." The locksmith (the clinician-scientist) still has to prove that key works before trusting it.',
    firstPrinciples: [
      'Foundation: measurable biomarkers define subgroups — established long before AI (HER2, EGFR, HLA screening).',
      'AI’s added value: pattern-finding across high-dimensional data (genomics + imaging + EHR) where human intuition drowns.',
      'Pharmacogenomics: predicting drug response and adverse-risk from inherited variants — AI augments established gene–drug pairs.',
      'Trial matching: NLP/AI reads eligibility criteria and proposes patients — speeding the slowest step of evidence generation.',
      'Risk stratification: models estimate individual trajectories (e.g. cancer risk polygenic scores — still emerging clinically).',
      'Guardrail: a subgroup found by AI is a HYPOTHESIS until prospective evidence shows acting on it improves outcomes.',
    ],
    mechanism:
      'Data layers: genome, transcriptome, proteome, microbiome, imaging phenotypes, digital phenotypes. Models integrate layers (multi-omic learning) to predict response, toxicity risk, or prognosis. Regulatory path mirrors companion-diagnostics: the biomarker + test + drug package is validated together.',
    numbers: [
      { label: 'Established pre-AI exemplars', value: 'HER2 → trastuzumab; HLA-B*57:01 → abacavir screening', note: 'Precision medicine did not start with AI — AI extends it.' },
    ],
    mistakes: [
      'Treating AI-found clusters as destiny — correlation in retrospective data is not a treatment rule.',
      'Ignoring access and equity: precision therapy without testing access deepens inequality (a WHO-flagged concern).',
      'Over-interpreting risk scores: a polygenic score shifts probability; it does not diagnose.',
    ],
    analogies: [
      'Polygenic risk score = a weighted family history on steroids — informative, not fate.',
      'Trial-matching AI = a matchmaker between patients and protocols that still requires consent and eligibility checks.',
    ],
    examRelevance:
      'Not in NEET-PG as "AI", but the underlying biomarker logic (HER2, EGFR, HLA screening) is firmly exam-relevant through oncology and pharmacology — making this lesson a bridge, not a detour.',
    clinicalRelevance:
      'Oncology already runs on molecular profiling; AI’s near-term bedside role is surfacing eligible patients and trials, and predicting toxicity risk — always with confirmatory testing.',
    teachDeeper: [
      'Multi-omics integration is technically hard and overfitting-prone; external validation is even more critical than usual.',
      'Equity: genomic databases over-represent certain ancestries; predictions for under-represented groups are weaker — a fairness issue (see bias lesson).',
      'Regulatory: many jurisdictions treat the biomarker-test-therapy combination as an interconnected package.',
    ],
    crossLinks: [
      { label: 'HER2-targeted therapy (Pharmacology/Oncology)', why: 'The canonical biomarker-driven therapy.', subject: 'Pharmacology' },
      { label: 'Abacavir & HLA-B*57:01 screening (Pharmacology)', why: 'Established pharmacogenomic screening — precision logic AI extends.', subject: 'Pharmacology' },
      { label: 'Bias & fairness (this pack)', why: 'Genomic data gaps are a fairness problem with clinical consequences.', subject: 'AI in Medicine' },
    ],
    sources: [
      ncbiRef('PubMed-indexed pharmacogenomics and precision-oncology literature'),
      whoRef('WHO guidance on AI for health — equity framing'),
      journalRef('The Lancet (journal)', 'Precision-medicine and biomarker-stratified trials (name-only attribution)'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'high',
  },

  // ═══ Topic: ai-digital-health ═════════════════════════════════════════════
  {
    id: 'c-ai-wearables-monitoring',
    name: 'Wearables & Remote Monitoring',
    kind: 'ai-concept',
    oneLiner:
      'Wearables and remote-monitoring devices turn the body into a continuous data stream — and AI’s job is to find the signal (real events) inside the noise (motion, artefact, worry).',
    whyMatters:
      'Your patients already wear heart-rate and step trackers; some watch-class devices have regulatory clearances for specific detections (e.g. irregular-rhythm notifications). Continuous data changes follow-up from snapshots to films — and shifts work onto clinicians to interpret what arrives. Knowing device categories and their limits is now basic clinical literacy.',
    explain30s:
      'Categories: consumer wellness devices (no diagnostic claim), regulated features within consumer devices (specific cleared detections, e.g. irregular-rhythm notification), and medical-grade remote monitoring (prescribed devices like continuous glucose monitors or cardiac telemetry). AI sits in the middle: filtering artefact, detecting patterns (arrhythmia hints, glucose trends, fall detection), and triaging what deserves clinician attention. The core clinical skill: treat device output as a screening signal that prompts standard confirmation (e.g. an ECG), not as a diagnosis.',
    eli5:
      'A watch that buzzes "your rhythm looks irregular" is like a smoke detector on the wall — worth taking seriously, but you check for fire with your own eyes (an ECG) before calling the fire brigade. Some patients will flood you with screenshots; the skill is triage: pattern over days, symptoms, and the standard confirmation test — not a single scary reading.',
    firstPrinciples: [
      'Device classes: wellness (no claim) vs regulated feature (specific cleared detection) vs prescribed medical device (monitoring as therapy support).',
      'Sensors: photoplethysmography (optical pulse), accelerometry, single-lead ECG, continuous glucose sensing — each with characteristic artefacts.',
      'AI roles: artefact rejection, event detection, trend summarisation, and alert triage for scarce clinician attention.',
      'Confirmation rule: device flags → standard diagnostic test → clinical decision. Notification ≠ diagnosis.',
      'Data quality: skin tone, perfusion, motion and fit affect optical sensors — measurement bias is a fairness issue too.',
      'Burden design: every monitoring programme needs an answer to "who reviews what, when?" — or alarms become wallpaper.',
    ],
    mechanism:
      'Signal chain: sensor → preprocessing (filter motion) → model (classical or deep) → event/trend → app alert or clinical dashboard. Continuous glucose monitoring (CGM) shows the mature end: interstitial glucose every few minutes, aggregated into metrics clinicians already use (e.g. time-in-range targets in diabetes care — verify current targets against prevailing guidance).',
    numbers: [
      { label: 'CGM time-in-range concept', value: 'Percent of readings in target glucose band (commonly cited 70–180 mg/dL target band; >70% time-in-range widely used)', note: 'Verify current targets against prevailing diabetes guidance — device metrics evolve.' },
      { label: 'Notification vs diagnosis', value: 'A flag, not a finding', note: 'Confirmed by standard testing per current guidance.' },
    ],
    mistakes: [
      'Diagnosing from a single wearable reading (one "AFib-like" alert ≠ atrial fibrillation).',
      'Dismissing all consumer data — trends over weeks can be genuinely informative.',
      'Ignoring measurement bias: optical sensors perform differently across skin tones and perfusion states — an equity-relevant measurement issue.',
    ],
    analogies: [
      'Wearable alert = smoke detector; ECG = actually looking at the kitchen.',
      'Continuous data = film vs snapshot — richer, but someone must watch the film.',
    ],
    examRelevance:
      'Not in NEET-PG. Continuous glucose monitoring metrics and ambulatory-monitoring concepts appear in medicine ward practice and institutional teaching; arrhythmia confirmation logic is standard cardiology exam material.',
    clinicalRelevance:
      'Prepare for consultations that start with "my watch said…". The safe script: acknowledge, look at the trend not the single event, confirm with the standard test, and document. For diabetes, CGM reports are already part of routine care conversations.',
    clinicalUpdateRequired: true,
    teachDeeper: [
      'Detection studies for consumer irregular-rhythm features reported high positive predictive values in large consented cohorts — but enrolment was self-selected; ask who was measured before generalising.',
      'Remote patient monitoring programmes (hypertension, heart failure) pair devices with nurse-led review pathways — the pathway is the intervention.',
      'Digital biomarkers (gait, speech, sleep) are research-grade: promising, not yet diagnostic standards.',
    ],
    crossLinks: [
      { label: 'Atrial fibrillation & ECG (Cardiology)', why: 'The confirmation pathway behind rhythm notifications.', subject: 'Cardiology' },
      { label: 'Diabetes self-monitoring (Endocrinology)', why: 'CGM metrics are the mature end of remote monitoring.', subject: 'General Medicine' },
      { label: 'Bias & fairness (this pack)', why: 'Sensor performance differences across skin tones are a measurement-equity issue.', subject: 'AI in Medicine' },
    ],
    sources: [
      fdaRef('FDA-cleared device features in consumer and clinical monitoring (regulatory categories)'),
      ncbiRef('PubMed-indexed studies of wearable arrhythmia detection and CGM outcomes'),
      jhmiRef('Johns Hopkins Medicine patient-education resources on wearable heart devices'),
    ],
    evidenceLevel: 'varies-by-guideline',
    sourceConfidence: 'medium',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'high',
  },

  {
    id: 'c-ai-digital-twins',
    name: 'Digital Twins in Healthcare',
    kind: 'ai-concept',
    oneLiner:
      'A digital twin is a computer model of a specific patient or organ — built from their data — that lets doctors simulate "what would happen if…" before doing it in the body.',
    whyMatters:
      'Twins promise rehearsal: try the device size, the drug schedule, or the surgery plan on the digital copy first. Some uses are already real (computational pressure modelling of coronary arteries from CT), while most twin visions remain research. Separating the working from the promised is exactly the literacy this pack teaches.',
    explain30s:
      'A digital twin combines three ingredients: a physics or data-driven model of an organ/system, the individual patient’s measurements, and simulation. Cardiac examples lead the field: models that compute blood-flow pressure fractions from routine CT scans (a regulated, used technology), and electrophysiology simulations for ablation planning. "Whole-patient twin" — a model continuously updated from your EHR that forecasts your future — is aspiration, not current routine. The clinical value rule: a twin is useful only when its predictions were validated against outcomes in patients like yours.',
    eli5:
      'Pilots practise landings in a flight simulator tuned to their aircraft. A digital twin is a flight simulator for one patient’s heart (or lung, or tumour): feed in their scans and measurements, then rehearse — "what if we place the valve here?" The simulator is only trustworthy if it has been checked against real flights. For hearts, some checks exist; for the "whole-body twin", they mostly do not yet.',
    firstPrinciples: [
      'Ingredients: (1) model of the system — physics-based (fluid dynamics, electrophysiology) and/or data-driven; (2) patient-specific parameters from imaging/sensors; (3) simulation of interventions.',
      'Spectrum: organ-level twins (most mature) → disease-level simulations → whole-patient visions (speculative today).',
      'Validation is the product: a twin earns trust only by predicting real outcomes prospectively.',
      'Regulation: twins that output diagnostic or interventional guidance are regulated as medical software (e.g. SaMD) — see the regulation lesson.',
      'Data hunger: twins need high-quality individual measurements — the interoperability lesson is the plumbing beneath this one.',
      'Honest status: a few regulated organ-twin applications are in clinical use; broad "digital twin of the patient" remains research and marketing language.',
    ],
    mechanism:
      'Physics-based twins encode known physiology (equations of blood flow, electrical propagation) and calibrate to the patient’s data. Data-driven twins learn dynamics from populations and personalise. Hybrids (physics + machine learning) are the pragmatic mainstream.',
    numbers: [
      { label: 'Maturest clinical example', value: 'Coronary pressure-fraction computed from routine CT (regulated, in use)', note: 'An organ-twin success story — not a whole-body twin.' },
      { label: 'Status of "whole-patient twin"', value: 'Research/aspirational', note: 'Say this plainly when the term is used in marketing.' },
    ],
    mistakes: [
      'Assuming "digital twin" means a validated model — sometimes it is a dashboard with ambition.',
      'Skipping the validation question: has this twin’s predictions been tested prospectively, in which population?',
      'Confusing simulation with prediction: simulating blood flow is not the same as predicting outcome benefit without trials.',
    ],
    analogies: [
      'Flight simulator tuned to one aircraft = organ twin for one heart.',
      'A model railway set labelled "digital twin of the city" = marketing overreach; check what it actually predicts.',
    ],
    examRelevance:
      'Not in NEET-PG. Appears in cardiology/engineering-adjacent seminars and innovation-focused institutional curricula; coronary physiology concepts (FFR logic) are exam-relevant via cardiology.',
    clinicalRelevance:
      'Where twins touch practice: non-invasive coronary physiology from CT in suitable patients, electrophysiology planning tools, orthopaedic planning simulations. Ask the validation question; use per current guidance.',
    clinicalUpdateRequired: true,
    teachDeeper: [
      'Twin vs model: a twin is typically claimed to update with new individual data over time — most "twins" in products do not yet close that loop.',
      'In-silico trials: regulators and industry explore simulated control arms for some device questions — early, carefully bounded.',
      'Ethics: a twin built from your data raises the same privacy/ownership questions as any health-data use (see privacy lesson).',
    ],
    crossLinks: [
      { label: 'Coronary circulation & ischaemia testing (Cardiology)', why: 'The physiology twins simulate.', subject: 'Cardiology' },
      { label: 'Medical data & FHIR (this pack)', why: 'Twins need live, interoperable patient data to stay "twin-like".', subject: 'AI in Medicine' },
      { label: 'Regulatory science (this pack)', why: 'Simulation outputs that guide care are regulated software.', subject: 'AI in Medicine' },
    ],
    sources: [
      fdaRef('Regulated software using computational modelling for coronary physiology (regulatory context)'),
      ncbiRef('PubMed-indexed reviews of digital twins in medicine'),
      journalRef('The Lancet Digital Health (journal)', 'Digital-twin validation literature (name-only attribution)'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'medium',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'regional',
  },

  // ═══ Topic: ai-robotics-agents ════════════════════════════════════════════
  {
    id: 'c-ai-robotics-surgery',
    name: 'Robotics & AI-Assisted Surgery',
    kind: 'ai-concept',
    oneLiner:
      'Robotic surgery platforms are master–slave tools the surgeon controls; AI adds vision, guidance and skill assessment — full surgical autonomy is NOT current practice.',
    whyMatters:
      'Patients ask about "robot surgery" constantly, and marketing outpaces reality. Doctors who can explain what the robot does and does not do (surgeon-driven instrument manipulation, better optics and dexterity, no independent decision-making) protect patients from hype on both sides — fear and over-trust.',
    explain30s:
      'Established robotic platforms (the da Vinci family is the well-known example) translate a surgeon’s hand movements into smaller, tremor-filtered instrument movements inside the patient, with magnified 3D vision. The surgeon is in control at every moment; the robot has no plan of its own. AI is entering around the edges: computer vision that highlights anatomy, phase recognition that logs and assesses technique, and navigation/guidance in some orthopaedic and neurosurgical systems. A fully autonomous operating robot performing unscripted surgery does not exist in routine care.',
    eli5:
      'Think of power steering in a car: your hands decide every turn; the machinery just makes your steering precise and removes the shake. A surgical robot is power steering for the surgeon’s hands — brilliant dexterity support, zero independent driving. The "AI future" adds a smart camera that points out landmarks and a coach that grades your technique. It does not add a chauffeur.',
    firstPrinciples: [
      'Master–slave principle: console (surgeon’s hands) → computer translation → patient-side instruments. Control remains human at all times.',
      'Advantages are mechanical and visual: wristed instruments, tremor filtration, magnified stereoscopic view — not intelligence.',
      'AI layer 1 — perception: systems segment anatomy and overlay guidance (e.g. bone-cutting planes in navigation-assisted orthopaedics).',
      'AI layer 2 — assessment: video analysis recognises operative phases and grades technical skill for training (consenting, recorded cases).',
      'Autonomy ladder: guidance → shared control → supervised subtasks → autonomy. Routine surgery sits at the bottom of this ladder today.',
      'Outcome honesty: robotic vs laparoscopic differences depend on procedure, surgeon experience and case mix — check current evidence per procedure, not slogans.',
    ],
    mechanism:
      'Why AI-vision is tractable in surgery: endoscopic video is standardised, and anatomy has learnable visual signatures. Phase recognition models classify what step is happening; instrument-tracking models localise tools; risk warnings (bleed-prone vessel proximity) are active research areas with regulatory questions.',
    numbers: [
      { label: 'Autonomy status', value: 'No fully autonomous surgical robot in routine clinical care', note: 'The single most important fact for patient conversations.' },
    ],
    mistakes: [
      'Telling patients "the robot does the surgery" — it never does; consent language should say surgeon-controlled robotic assistance.',
      'Assuming robot = better outcomes for every procedure; the evidence is procedure- and team-specific.',
      'Ignoring the learning curve and case-selection effects behind centre outcomes.',
    ],
    analogies: [
      'Surgical robot = power steering + zoom glasses for the surgeon’s hands.',
      'AI assessment = video-analysis coach for surgical training, not an operating co-pilot.',
    ],
    examRelevance:
      'Not in NEET-PG. Robotic platforms appear in surgery teaching as instrumentation context; minimally-invasive-surgery principles (pneumoperitoneum, port basics) remain the examinable core.',
    clinicalRelevance:
      'Consent conversations, referrals and post-op expectations are where you meet robotics — know the honest description, the cost/access trade-offs in your system, and that technique (human) still dominates outcomes.',
    teachDeeper: [
      'Autonomy classification in surgical robotics research ranges from level 0 (no autonomy) to hypothetical level 4 — current approved systems are at the lowest levels.',
      'Data governance: routine recording of surgical video raises consent and storage questions most systems have not resolved.',
      'Cost equity: robot access concentrates in well-funded centres; WHO equity framing applies (see regulation lesson).',
    ],
    crossLinks: [
      { label: 'Minimally invasive surgery principles (Surgery)', why: 'The operative context robotic platforms extend.', subject: 'Surgery' },
      { label: 'Consent for procedures (Forensic Medicine)', why: 'Consent language must describe robotic assistance accurately.', subject: 'Forensic Medicine' },
      { label: 'Explainability (this pack)', why: 'Surgical AI-vision overlays are an explainability-in-practice case.', subject: 'AI in Medicine' },
    ],
    sources: [
      jhmiRef('Johns Hopkins Medicine public resources on robotic surgery patient information'),
      ncbiRef('PubMed-indexed reviews of surgical robotics and AI-assisted interventions'),
      journalRef('The Lancet (journal)', 'Robotic versus laparoscopic surgery trial literature (name-only attribution)'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'regional',
  },

  {
    id: 'c-ai-healthcare-agents',
    name: 'Healthcare AI Agents & Workflow Automation',
    kind: 'ai-concept',
    oneLiner:
      'AI agents are systems that plan and execute multi-step tasks — chase records, draft referrals, book follow-ups — and workflow automation applies the same idea to paperwork; both need supervision rails.',
    whyMatters:
      'The next wave after chatbots is DOING: agents that chain actions (read the chart → draft the referral → schedule the test). They promise hours back to clinicians — and introduce a new risk: errors that propagate through systems without a human ever looking. Understanding agent design helps you demand the safety rails.',
    explain30s:
      'A chatbot answers; an agent acts. Technically: a language-model "brain" plus tools (databases, schedulers, email) plus a plan-execute loop, often with checkpoints. Healthcare examples: pre-visit information gathering, referral drafting with attachments, coding/billing drafts, prior-authorisation paperwork, discharge-follow-up coordination. The safety equation changes with actions: a wrong answer wastes time, a wrong ACTION books a wrong appointment, cancels a drug, or leaks data. Hence the design rule: significant actions need human checkpoints, audit logs, and bounded permissions.',
    eli5:
      'A chatbot is a helpful receptionist who answers questions. An agent is a receptionist you let pick up the phone, call the lab, and file the form. Wonderful — IF they follow your rulebook and call you before anything irreversible. Agents without rulebooks are receptionists who might confidently cancel your patient’s MRI because a form looked odd.',
    firstPrinciples: [
      'Agent anatomy: model (reasoning) + tools (actions allowed) + memory (task context) + loop (plan → act → observe → repeat).',
      'Action risk ≠ answer risk: grade actions (read-only, reversible, irreversible) and gate the risky ones behind human approval.',
      'Least privilege: an agent booking appointments needs the calendar, not the full record — scope permissions narrowly.',
      'Auditability: every agent action should be logged and attributable — "the system did it" is not a governance answer.',
      'Verification points: build checkpoints where a human confirms before irreversible steps (send, order, prescribe).',
      'Evaluation: test agents end-to-end with adversarial cases (weird inputs, edge cases), not just happy paths.',
    ],
    mechanism:
      'Under the hood, today’s agents are orchestrated LLM calls: the model decomposes a goal into steps, calls tool interfaces (often standard APIs — see the FHIR lesson for health data plumbing), observes results, and iterates. Reliability comes from engineering (guardrails, retries, checks) more than from raw model skill.',
    numbers: [
      { label: 'Action grading', value: 'read-only < reversible < irreversible', note: 'Human checkpoints mandatory for the last tier — the core agent-safety rule.' },
    ],
    mistakes: [
      'Giving an agent broad record access "because it is easier" — scope creep is the top design failure.',
      'Assuming the agent’s summary of what it did is accurate — read the log, not the narrative.',
      'Deploying without a rollback path for wrong actions.',
    ],
    analogies: [
      'Agent = junior intern with a phone and your passwords: capable, eager, needs a rulebook and a bleeper.',
      'Least privilege = prescription rights: you grant specific powers, not the whole pharmacy.',
    ],
    examRelevance:
      'Not in NEET-PG. Health-systems and administration teaching touches workflow design; agents themselves are institutional-curriculum and conference material — honestly, a fast-moving area where even terminology is still settling.',
    clinicalRelevance:
      'Expect agents in scheduling, coding, prior authorisation and inbox management first — the paperwork you already hate. Your role: insist on checkpoints for anything irreversible, and report misfires like any other safety event.',
    clinicalUpdateRequired: true,
    teachDeeper: [
      'Multi-agent systems (agents talking to agents) are early research — coordination failures compound, so single-agent designs dominate deployments.',
      'Interoperability is the bottleneck: agents are only as connected as the APIs beneath them (FHIR again).',
      'Regulators are actively studying agentic systems; expect evolving guidance — check current sources.',
    ],
    crossLinks: [
      { label: 'Health information systems (Community Medicine)', why: 'Agents automate inside the systems Community Medicine teaches.', subject: 'Community Medicine' },
      { label: 'Medical data & FHIR (this pack)', why: 'The API plumbing agents act through.', subject: 'AI in Medicine' },
      { label: 'Human-in-the-loop (this pack)', why: 'Checkpoint design is HITL applied to actions, not answers.', subject: 'AI in Medicine' },
    ],
    sources: [
      whoRef('WHO guidance framing on AI for health — accountability and oversight principles'),
      fdaRef('FDA digital-health horizon scanning for AI-enabled software functions'),
      ncbiRef('PubMed-indexed literature on LLM agents and workflow automation in healthcare'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'medium',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-data-fhir ══════════════════════════════════════════════════
  {
    id: 'c-ai-medical-data-fhir',
    name: 'Medical Data, FHIR & Interoperability',
    kind: 'ai-concept',
    oneLiner:
      'FHIR (Fast Healthcare Interoperability Resources) is the modern standard that lets different health systems exchange data as small, named, web-friendly "resources" — the plumbing beneath every medical AI.',
    whyMatters:
      'No AI reads a spreadsheet of truth; it reads whatever your EHR, lab system and pharmacy system agree to share. Interoperability decides whether a patient’s allergies follow them across hospitals, whether research can pool data, and whether AI tools see reality or a fragmented shadow of it. It is the least glamorous and most decisive layer in the whole stack.',
    explain30s:
      'Health data historically moved via messy legacy formats (HL7 v2 messages) or not at all. FHIR — pronounced "fire", from HL7 — models data as discrete resources: Patient, Observation, MedicationRequest, Encounter… Each has a defined structure, and systems exchange them over web APIs. The current widely-implemented major version is R4 (a newer R5 exists but adoption is earlier). For doctors the practical meaning: structured, portable data = better care coordination, better research, better AI — and poor data quality poisons all three.',
    eli5:
      'Imagine every hospital writing patient files in its own secret shorthand. Moving means losing your history. FHIR is an agreement: everyone writes certain cards the same way — one card for allergies, one for medicines, one for test results — with standard headings, and any hospital’s computer can read another’s cards. AI needs those standard cards too: a model fed inconsistent cards learns nonsense.',
    firstPrinciples: [
      'The problem: fragmentation — EHRs, labs, pharmacies and radiology each speak partially compatible dialects; patients suffer the seams.',
      'The idea: model data as RESOURCES — small, standard, individually addressable units (Patient, Observation, AllergyIntolerance, DiagnosticReport).',
      'The transport: standard web APIs (REST), so authorised apps request resources — the base of patient-access and third-party app ecosystems.',
      'Versioning: R4 is the widely-implemented major release (R5 later, earlier adoption); profiles tailor resources to countries/use cases.',
      'Garbage in, wisdom out — or not: AI trained on inconsistent coded data inherits the inconsistency (the dataset-shift lesson in disguise).',
      'National layers: countries build programmes on these standards (India’s Ayushman Bharat Digital Mission; US interoperability rules; UK standards work).',
    ],
    mechanism:
      'Why FHIR succeeded: it fit the web (JSON, HTTPS, OAuth-style authorisation) instead of inventing parallel plumbing, so regular developers could build. Terminology systems (LOINC for labs, SNOMED CT for concepts, ICD for classification, RxNorm-classification for drugs) supply the shared vocabulary inside resources.',
    numbers: [
      { label: 'FHIR current major release', value: 'R4 (widely implemented; R5 published later, earlier adoption)', note: 'Version matters when vendors claim "FHIR-compatible".' },
      { label: 'Resource examples', value: 'Patient · Observation · MedicationRequest · AllergyIntolerance', note: 'Standardised building blocks exchanged across systems.' },
    ],
    mistakes: [
      'Assuming "we have an EHR" means "our data is interoperable" — local digital records can still be islands.',
      'Ignoring data quality: duplicated patients, free-text allergies, missing units — AI downstream amplifies every defect.',
      'Confusing standards with products: FHIR is a specification; vendors implement it unevenly.',
    ],
    analogies: [
      'FHIR resources = standard index cards with agreed headings, exchangeable between libraries.',
      'Terminologies (LOINC/SNOMED/ICD) = the shared dictionary that makes the cards mean the same thing everywhere.',
    ],
    examRelevance:
      'Not in NEET-PG. Health-information systems, national health missions and e-health appear in Community Medicine teaching (public-health administration sections); FHIR by name is institutional-curriculum and informatics-elective material.',
    clinicalRelevance:
      'You will feel interoperability as friction: repeated blood tests at transfer, unreadable outside scans, prescription history gaps. National digital-health missions exist largely to remove that friction — and AI value scales with it.',
    reasoning: [
      { stage: 'symptom', label: 'A patient arrives from another facility', detail: 'History exists — somewhere else, in another system’s format.' },
      { stage: 'investigation', label: 'Data request via standards', detail: 'With FHIR-style APIs and consent, records arrive as structured resources, not faxed PDFs.' },
      { stage: 'interpretation', label: 'Clinician reads structured data', detail: 'Allergies, medications, problems are machine-readable AND human-readable — fewer transcription errors.' },
      { stage: 'management', label: 'Safer decisions', detail: 'Care continues with real history; duplicate tests avoided.' },
      { stage: 'complication', label: 'If plumbing fails', detail: 'Incomplete feeds → the AI and the doctor both fly blind; audit data quality like you audit vitals.' },
    ],
    global: [
      {
        region: 'India',
        delivery: 'Ayushman Bharat Digital Mission (ABDM) builds a national digital-health ecosystem — health IDs (ABHA), standardised records and a federated architecture where data stays with data custodians and moves with consent.',
        terminology: ['ABHA — Ayushman Bharat Health Account (health ID)', 'Health Information Provider / Health Information User roles'],
        note: 'India’s approach emphasises consent-driven federated data rather than one central database; describes the general design, not specific implementation claims.',
      },
      {
        region: 'United States',
        delivery: 'The 21st Century Cures Act (2016) pushed standardised, FHIR-based patient access — patients can request their electronic health information via apps; "information blocking" by providers is penalised.',
        terminology: ['USCDI — United States Core Data for Interoperability (the required data classes)', 'ONC/ASTP — the federal health-IT coordinator'],
        note: 'A legal-push model: standards mandated by rule, enforced by penalties.',
      },
      {
        region: 'United Kingdom',
        delivery: 'NHS national interoperability programmes and clinical-record standards (structured headings like SNOMED CT) aim to make GP and hospital records flow; national sharing depends on opt-out frameworks.',
        terminology: ['SNOMED CT — the UK’s clinical terminology standard', 'GP connect-style record sharing programmes'],
        note: 'A standards-plus-national-programmes model with explicit patient choice over sharing.',
      },
      {
        region: 'WHO/Global',
        delivery: 'WHO’s global strategy on digital health urges countries to adopt open, standards-based interoperability and to invest in governance — framing interoperability as population-health infrastructure.',
        note: 'The global message: without shared standards, digital health widens gaps instead of closing them.',
      },
    ],
    crossLinks: [
      { label: 'Health management information systems (Community Medicine)', why: 'HMIS is the public-health cousin of clinical interoperability.', subject: 'Community Medicine' },
      { label: 'ICD coding basics (Community Medicine)', why: 'ICD is one of the terminologies riding inside FHIR resources.', subject: 'Community Medicine' },
      { label: 'Dataset shift & data quality (this pack)', why: 'Messy interoperability is a top source of silent model drift.', subject: 'AI in Medicine' },
    ],
    sources: [
      ncbiRef('PubMed-indexed literature on FHIR and clinical interoperability'),
      whoRef('WHO global strategy on digital health (standards and governance framing)'),
      niceRef('NICE digital-health evaluation framing (real-world data quality context)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-evaluation-metrics ═════════════════════════════════════════
  {
    id: 'c-ai-sensitivity-specificity',
    name: 'Sensitivity & Specificity',
    kind: 'ai-concept',
    oneLiner:
      'Sensitivity is how reliably a test catches the truly sick (TP ÷ all sick); specificity is how reliably it clears the truly healthy (TN ÷ all healthy) — the twin pillars of every diagnostic claim, AI or not.',
    whyMatters:
      'Every AI performance claim — "95% accurate!", "detects cancer" — decomposes into these two numbers plus context. They are already your tools from biostatistics; AI changes nothing except how often you will meet them. Master the 2×2 table here and half of the AI-evaluation literature becomes readable on sight.',
    explain30s:
      'Lay out the 2×2: disease present/absent × test positive/negative. Sensitivity = TP/(TP+FN): of all truly diseased, what fraction does the test flag? Specificity = TN/(TN+FP): of all truly healthy, what fraction does it correctly clear? High sensitivity → few missed cases (good for screening). High specificity → few false alarms (good for confirmation). The two are usually traded off — moving the "positive" threshold buys one at the other’s expense. Neither tells you what a positive RESULT means in your patient: that is predictive value, which depends on how common the disease is.',
    eli5:
      'A metal detector at the airport. Sensitivity: of all the actual knives walking through, what fraction beeps? Specificity: of all the innocent keys and belts, what fraction stays silent? Turn the knob up — catches every knife, but beeps at every belt (low specificity). Turn it down — peaceful queues, missed knives. There is no free lunch: with one knob, every gain on one side costs the other.',
    firstPrinciples: [
      'Build the 2×2 table: rows = truth (disease present/absent), columns = test result (positive/negative). Four cells: TP, FN, FP, TN.',
      'Sensitivity = TP ÷ (TP + FN) — "catch rate among the sick". A test missing no one has 100% sensitivity.',
      'Specificity = TN ÷ (TN + FP) — "clear rate among the healthy". A test alarming no healthy person has 100% specificity.',
      'The threshold trade-off: the same detector at different settings yields different (sens, spec) pairs — this trade-off curve is the ROC (next lesson).',
      'Screening vs confirmation logic: screening needs sensitivity (do not miss cases); confirmatory tests need specificity (do not alarm/treat the healthy).',
      'Bridge to the bedside: sens/spec describe the TEST; predictive values describe the PATIENT’S positive/negative result — and those depend on prevalence.',
    ],
    mechanism:
      'Why AI inherits this unchanged: a model outputting a probability gets cut into positive/negative by a threshold; the resulting 2×2 is identical in logic to any lab test. The only novelty is that AI threshold-setting is a design choice, sometimes left adjustable at deployment — ask which threshold was used, and how it was chosen.',
    numbers: [
      { label: 'Perfect test', value: 'Sensitivity 100% AND specificity 100%', note: 'Real tests trade one against the other; check both, never one.' },
      { label: 'Chance-level binary test', value: '≈50% sensitivity AND ≈50% specificity', note: 'A coin-flip test lands here; below that, worse than flipping a coin.' },
      { label: 'Screening doctrine', value: 'Screen → high sensitivity; confirm → high specificity', note: 'Why positives from screening programmes always need a second, more specific test.' },
    ],
    mistakes: [
      'Reading "95% accurate" as either sensitivity or specificity — accuracy conflates them and hides prevalence tricks.',
      'Applying sens/spec directly to a patient: those describe cohorts; your patient needs predictive values (prevalence-dependent).',
      'Forgetting the reference standard: sensitivity is computed against the TRUTH definition — if the "truth" is shaky, both numbers are theatre.',
    ],
    mnemonics: [
      { hook: 'SnNOut', expands: 'a highly Sensitive test, when Negative, rules Out disease (a good screening test misses few)' },
      { hook: 'SpPIn', expands: 'a highly Specific test, when Positive, rules In disease (a good confirmatory test rarely false-alarms)' },
    ],
    analogies: [
      'Metal-detector knob: one setting, two costs — the trade-off made physical.',
      'Sensitivity = fishing net mesh: finer mesh catches smaller fish but also weeds.',
    ],
    examRelevance:
      'Genuinely exam-relevant everywhere: NEET-PG/INI-CET biostatistics items, FMGE, university vivas and journal clubs all test the 2×2 table. AI changes the dressing ("a deep-learning model achieved…"), never the arithmetic — and examiners increasingly enjoy the AI dressing.',
    clinicalRelevance:
      'Reading any new diagnostic claim (AI or biomarker or clinical sign) starts here: find the reference standard, the threshold, and BOTH numbers. Then ask who was tested — before trusting either.',
    reasoning: [
      { stage: 'symptom', label: 'A positive AI screen appears', detail: 'Tool flags "finding present" above its threshold.' },
      { stage: 'investigation', label: 'Ask the metric question', detail: 'What is sensitivity AND specificity at THIS threshold, against what reference standard?' },
      { stage: 'interpretation', label: 'Convert to patient terms', detail: 'With the local prevalence, what is the positive predictive value here? (Rare disease → many false positives, even with good specificity.)' },
      { stage: 'diagnosis', label: 'Confirmatory pathway', detail: 'Follow the standard diagnostic pathway; the AI screen is a prompt, not a verdict.' },
      { stage: 'management', label: 'Act on the confirmed picture', detail: 'Treatment decisions per clinical evidence — never on the screening metric alone.' },
      { stage: 'complication', label: 'Audit both directions', detail: 'Missed cases (false negatives) and false alarms (false positives) are both harms; track both.' },
    ],
    crossLinks: [
      { label: 'Predictive values & prevalence (Biostatistics)', why: 'The bridge from test metrics to this patient’s probability.', subject: 'Community Medicine' },
      { label: 'AUROC & AUPRC (this pack)', why: 'The threshold-free generalisation of the sens/spec trade-off.', subject: 'AI in Medicine' },
      { label: 'Screening criteria (Community Medicine)', why: 'Wilson-Jungner-style logic decides whether a sensitive screen should exist at all.', subject: 'Community Medicine' },
    ],
    sources: [
      ncbiRef('PubMed-indexed biostatistics primers on diagnostic-test evaluation'),
      mitRef('Open statistics course materials (2×2 tables, test evaluation)'),
      nmcRef(),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-auroc-auprc',
    name: 'AUROC & AUPRC — Reading Model Performance',
    kind: 'ai-concept',
    oneLiner:
      'AUROC is the quality score of a model’s RANKING: the probability it scores a random sick patient above a random healthy one — 1.0 is perfect, 0.5 is a coin flip.',
    whyMatters:
      '"The model had an AUROC of 0.87" appears in almost every AI abstract. Doctors who know the coin-flip interpretation instantly ask the two follow-ups that matter: compared to what (which clinicians, which baseline), and on which patients (which dataset, which prevalence)? AUPRC answers the question AUROC hides when disease is rare: of the alerts raised, how many were real?',
    explain30s:
      'The ROC curve plots sensitivity (y) against 1 − specificity (x) as the threshold slides from strict to loose. AUROC is the area under it: 1.0 = perfect ranking; 0.5 = chance; below 0.5 = worse than chance (rankings inverted). Intuition: take one random patient with the condition and one without — AUROC is the probability the model gives the sick one the higher risk score. AUPRC (area under the precision-recall curve) focuses on the alerts: precision = of those flagged, how many truly have the condition. When the condition is rare, AUPRC is the humbler, more honest number.',
    eli5:
      'AUROC is the coin-flip quality score of a model ranking sick vs healthy patients. Shuffle a deck: AUROC 0.5 means the model separates sick from healthy exactly as well as flipping a coin. 0.9 means nine times out of ten it puts the sicker card on top. But if only 1 in 1000 patients is truly sick, even a great ranker will still knock on many wrong doors — that is what AUPRC counts: of all the doors it knocked on, how many hid the disease?',
    firstPrinciples: [
      'Start from the threshold trade-off: every cut-point gives a (sensitivity, specificity) pair; plotting all of them draws the ROC curve.',
      'AUROC = area under that curve = P(model scores a random positive above a random negative). Chance = 0.5; perfect = 1.0.',
      'Why clinicians like AUROC: threshold-free — it summarises ranking skill across all operating points at once.',
      'The trap AUROC hides: with rare conditions, great ranking can still yield terrible positive predictive value — most alerts false. Precision-recall (AUPRC) exposes this.',
      'AUPRC intuition: precision (positive predictive value) vs recall (sensitivity) across thresholds; the baseline is the prevalence, not 0.5 — a rare-disease AUPRC of 0.15 can be signal; an AUROC of 0.15 is a broken model.',
      'Reporting hygiene: confidence intervals, the dataset it was computed on, and the class balance — an AUROC without a dataset is a rumour.',
    ],
    mechanism:
      'ROC construction: rank all patients by model score; slide the threshold from highest to lowest; each step yields (sensitivity, 1−specificity); the curve traces the trade-off surface. AUPRC likewise integrates precision against recall. Class imbalance shifts precision (and thus AUPRC) dramatically while leaving AUROC comparatively stable — the mathematical reason rare-disease studies should report both.',
    numbers: [
      { label: 'AUROC = 1.0', value: 'Perfect — every sick patient ranked above every healthy one', note: 'In published clinical studies, real-world-classifying models typically land well below it.' },
      { label: 'AUROC = 0.5', value: 'Chance — equivalent to a coin flip', note: 'The universal baseline every claim must beat, by enough to matter.' },
      { label: 'AUPRC baseline', value: '≈ disease prevalence', note: 'The counterintuitive one: in a 1%-prevalence problem, an AUPRC of 0.15 may be strong signal.' },
    ],
    mistakes: [
      'Comparing AUROCs across different datasets/populations — different case mix, different AUROC; not a leaderboard.',
      'Trusting AUROC alone in rare disease — always demand precision/PPV or AUPRC alongside.',
      'Confusing AUROC with accuracy — accuracy needs a threshold and a prevalence; AUROC needs neither.',
      'Assuming a model with AUROC 0.9 is "90% accurate" — it means a strong ranking tendency, nothing about any single alert.',
    ],
    mnemonics: [
      { hook: 'Half is chance', expands: 'AUROC 0.5 = coin flip; above it, ranking skill; below it, inverted rankings' },
    ],
    analogies: [
      'AUROC = how well a sorter arranges a mixed deck with all hearts above all spades.',
      'AUPRC = the sorter’s honesty about how many wrong cards it puts in the "hearts" pile.',
    ],
    examRelevance:
      'Not a named NEET-PG item, but biostatistics vivas increasingly feature AUROC in AI papers; INI-CET/institutional question banks have begun including AI-evaluation stems. The arithmetic (ROC, predictive values) is squarely classic biostatistics territory.',
    clinicalRelevance:
      'Journal clubs, vendor decks and conference talks all quote AUROC. Your reading ritual: (1) which dataset and prevalence? (2) compared against which clinical baseline? (3) what precision at the chosen threshold — i.e., how many false alarms per true catch in MY kind of practice?',
    reasoning: [
      { stage: 'investigation', label: 'Model quoted AUROC 0.85', detail: 'First instinct: good ranking skill — above chance, comfortably.' },
      { stage: 'interpretation', label: 'Interrogate context', detail: 'Dataset? Prevalence? External or internal? Clinician baseline for the same task? (See external-validation lesson.)' },
      { stage: 'diagnosis', label: 'Judge the metric fit', detail: 'Rare condition → demand AUPRC/PPV; screening use → focus sensitivity at acceptable specificity; triage → precision at top-k matters.' },
      { stage: 'management', label: 'Decide deployment questions', detail: 'Threshold policy, alert volume per day, review capacity — metrics map to workload.' },
      { stage: 'complication', label: 'Watch the drift', detail: 'An AUROC from last year’s data is a historical fact, not a current property — monitor (see dataset-shift lesson).' },
    ],
    crossLinks: [
      { label: 'Sensitivity & specificity (this pack)', why: 'The 2×2 roots under every ROC point.', subject: 'AI in Medicine' },
      { label: 'ROC reasoning in radiology reporting (Radiology)', why: 'Threshold thinking is how reporting standards already work.', subject: 'Radiology' },
      { label: 'Reading AI research claims (this pack)', why: 'AUROC context-checking is the core appraisal move.', subject: 'AI in Medicine' },
    ],
    sources: [
      ncbiRef('PubMed-indexed primers on ROC analysis and precision-recall in clinical prediction'),
      mitRef('Open statistics / data-science course materials (ROC fundamentals)'),
      journalRef('BMJ (journal)', 'Methodological tutorials on reporting clinical prediction models (name-only attribution)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 3,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-validation-shift ═══════════════════════════════════════════
  {
    id: 'c-ai-external-validation',
    name: 'External Validation — The Test That Matters',
    kind: 'ai-concept',
    oneLiner:
      'External validation means measuring the model on data it never saw, from a DIFFERENT setting — new hospital, new country, new scanner — and it is the step most AI hype quietly skips.',
    whyMatters:
      'A model can ace its own hospital’s data and fail at yours: different machines, patient mix, documentation habits. External validation is how medicine found out that several celebrated systems shrink outside their birthplace. For any tool proposed in your practice, this is THE question — and "the vendor says" is not an answer.',
    explain30s:
      'Internal validation tests the model on held-out data from the SAME source — necessary, not sufficient. External validation tests on genuinely different data: another site, another time period, another population. Performance usually drops a little (measurement differences) or a lot (dataset shift — next lesson). Regulatory science increasingly expects this evidence for high-risk tools, and top journals increasingly require it for clinical claims. The reading rule: no external validation → treat performance as a local rumour, not a general fact.',
    eli5:
      'The topper of one school scores brilliantly on that school’s papers. Move them to a different school with different teachers and question styles — what do they score now? External validation is exactly that exam. Some toppers stay brilliant; some were only brilliant in one classroom. You want to know BEFORE trusting them with your patients.',
    firstPrinciples: [
      'Define the ladder: training data → internal test (same source) → external test (different site/time/population) → prospective real-world deployment.',
      'Why performance drops: different scanners and protocols, different disease prevalence, different care processes, different coding habits — the model meets a world it never studied.',
      'Temporal validation: testing on LATER data from the same place — catches drift over time; a minimum standard for deployed systems.',
      'Geographic validation: another hospital/region — the stronger, more honest test.',
      'Prospective validation: the model runs live and outcomes are collected going forward — the highest evidence before autonomy.',
      'Where to find it: methods section of papers ("externally validated on…"), regulatory summaries, and independent replications — absence is information.',
    ],
    mechanism:
      'Mechanically, nothing changes — same metrics (sens/spec, AUROC/AUPRC, calibration). What changes is the sampling frame: the external dataset must represent the DEPLOYMENT population, not a convenient other dataset. Silent mismatches (different lab units, different scoring conventions) produce artificially poor OR artificially good results — independent investigators matter.',
    numbers: [
      { label: 'Validation ladder', value: 'internal test < temporal < geographic < prospective', note: 'Each rung answers a harder real-world question.' },
      { label: 'Expected pattern', value: 'Performance typically drops on external data', note: 'A modest drop is normal; a collapse is diagnosis — ask what shifted.' },
    ],
    mistakes: [
      'Accepting "validated" without asking internally or externally, on whom.',
      'Trusting vendor-reported metrics — independent external evaluation is a different evidence class entirely.',
      'Assuming a model validated in one country needs no re-check in yours — population, device and process differences are exactly what validation measures.',
    ],
    analogies: [
      'External validation = the visiting exam: the student faces unfamiliar papers.',
      'Internal-only evaluation = practising serves in your own driveway, then claiming rally credentials.',
    ],
    examRelevance:
      'Not in NEET-PG as a named topic, but "why do promising models fail in new settings?" is a natural viva/research-methods discussion question and appears in institutional AI curricula. The underlying concept (external validity of studies) is classic EBM teaching.',
    clinicalRelevance:
      'Procurement conversations, pilot proposals and journal clubs all hinge here. The three-part ask: show external performance on data like ours, show calibration not just ranking, and show what happens to workflow and outcomes.',
    reasoning: [
      { stage: 'symptom', label: 'A model shows stellar local results', detail: 'High AUROC/AUPRC on its home data.' },
      { stage: 'investigation', label: 'Hunt for external evidence', detail: 'Papers/registries: tested at other sites? other countries? other years? By independent teams?' },
      { stage: 'interpretation', label: 'Weigh the drop', detail: 'Small drop = robust pattern; big drop = the model learned local quirks (shortcuts, artefacts, mix shifts).' },
      { stage: 'diagnosis', label: 'Judge transferability to YOUR setting', detail: 'Scanner parity, population, prevalence, workflow — the axes along which your centre differs.' },
      { stage: 'management', label: 'Pilot with monitoring', detail: 'If adopted: local shadow-mode evaluation, predefined metrics, scheduled re-audit.' },
      { stage: 'complication', label: 'Plan for decay', detail: 'Even externally validated models drift — monitoring is not optional (see dataset-shift lesson).' },
    ],
    crossLinks: [
      { label: 'External validity of studies (Biostatistics/EBM)', why: 'The same concept at trial scale — generalisability.', subject: 'Community Medicine' },
      { label: 'Dataset shift & calibration (this pack)', why: 'The mechanical explanation for validation drops.', subject: 'AI in Medicine' },
      { label: 'Sepsis prediction models (this pack)', why: 'The well-known independent-evaluation cautionary tale.', subject: 'AI in Medicine' },
    ],
    sources: [
      ncbiRef('PubMed-indexed external-validation studies of clinical prediction models'),
      journalRef('JAMA (journal)', 'Independent evaluations of proprietary clinical AI (name-only attribution)'),
      niceRef('NICE evidence standards framework for digital health technologies (validation expectations)'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-dataset-shift-calibration',
    name: 'Dataset Shift & Calibration',
    kind: 'ai-concept',
    oneLiner:
      'Dataset shift is when the real world quietly stops matching the model’s training data — and calibration is whether a predicted "20%" really happens about 20% of the time; both decide whether a deployed model can still be trusted.',
    whyMatters:
      'Models decay in place: scanners get serviced, protocols change, a pandemic rewrites case mix. Nobody unplugs them — they just get quietly wrong. Calibration failures are the most insidious: the alert fires and the number LOOKS trustworthy. Monitoring for shift and calibration is the difference between a tool and a liability.',
    explain30s:
      'Dataset shift (drift) = the joint world of inputs and outcomes changes after training: different equipment, different patient mix, different measurement habits, or genuine epidemiology (a pandemic). Calibration asks: when the model says 20% risk, do ~20 of every 100 such patients actually have the event? A model can rank patients perfectly (fine AUROC) yet be miscalibrated — its ORDER is right, its NUMBERS lie. Fix strategies: recalibration on local data, periodic retraining, and continuous monitoring with alarm bells on drift.',
    eli5:
      'A fisherman trains his dog to bark at fish of a certain size — using last year’s fish. This year the river’s fish are all bigger: the dog barks at everything (shift). Or the dog still ranks big-vs-small correctly, but "medium" now means something else — its size-estimate is off (miscalibration). The dog is not disloyal; the river moved. A good fisherman re-teaches sizes on this year’s fish (recalibration) and occasionally checks the dog’s guesses against actual fish (monitoring).',
    firstPrinciples: [
      'Name the shifts: covariate shift (inputs change — new scanner), prior/label shift (disease prevalence changes), concept shift (the relationship itself changes — new treatment changes what "risk" means).',
      'Where it comes from in hospitals: protocol updates, equipment changes, coding-habit changes, population changes, public-health events.',
      'Calibration defined: predicted probabilities match observed frequencies across the risk range — checked with calibration curves/slopes (and metrics like Brier).',
      'Ranking vs numbers: AUROC can survive mild shift while calibration collapses — safe ranking, lying numbers; both must be monitored.',
      'Fixes: recalibrate on local data (cheap, often effective), retrain with new data (riskier — needs revalidation), or restrict use until understood.',
      'Monitoring: drift detectors on input distributions + scheduled performance audits against outcomes — with a named owner.',
    ],
    mechanism:
      'Why models are shift-sensitive: they learn the statistical texture of their training world, artefacts included. Change the texture (a new image filter, a lab analyser) and the model reads the new texture as signal. Calibration drifts even when the model itself is untouched, because prevalence or measurement — not the model — moved.',
    numbers: [
      { label: 'Calibration check', value: 'Predicted 20% → observed ≈ 20 in 100', note: 'Across the risk range, not just on average.' },
      { label: 'Decay is the default', value: 'Shift accumulates silently', note: 'Scheduled audit + named owner is the mitigation, not vigilance vibes.' },
    ],
    mistakes: [
      'Assuming a deployed model keeps its paper performance indefinitely.',
      'Monitoring only AUROC — miscalibration hides behind good rankings.',
      'Blaming the model when the data pipeline changed (a new analyser is a shift event, not a model defect).',
    ],
    analogies: [
      'River moved, dog’s training aged — the model did not break; the world changed under it.',
      'Calibration = honest speedometer: ranking says you are fastest; calibration says your "80 km/h" is really 80.',
    ],
    examRelevance:
      'Not in NEET-PG. Appears in institutional informatics teaching and research-methods discussions of model maintenance; the calibration concept connects to classic measurement/reliability teaching.',
    clinicalRelevance:
      'If your unit runs any risk model, ask: who monitors it, how often, against what? Post-pandemic medicine offered the field-wide demonstration: models trained pre-2020 met a shifted world — the literature documents the consequences.',
    reasoning: [
      { stage: 'symptom', label: 'Alert pattern quietly changes', detail: 'Same tool, different alert volume or feel over months.' },
      { stage: 'investigation', label: 'Check for shift', detail: 'New equipment? Protocol change? Case-mix change? Compare input distributions vs training-era data.' },
      { stage: 'interpretation', label: 'Check calibration', detail: 'Group alerts by predicted risk; compare predicted vs observed event rates (calibration curve).' },
      { stage: 'diagnosis', label: 'Localise the failure', detail: 'Ranking fine + numbers off → recalibrate. Both off → revalidate/retrain; possibly retire.' },
      { stage: 'management', label: 'Fix under governance', detail: 'Recalibration/retraining through the same change-control as any clinical system update.' },
      { stage: 'complication', label: 'Institutionalise monitoring', detail: 'Scheduled audits with named owners — shift recurs by default.' },
    ],
    crossLinks: [
      { label: 'External validation (this pack)', why: 'Validation catches shift at adoption; monitoring catches it after.', subject: 'AI in Medicine' },
      { label: 'Measurement reliability & bias (Biostatistics)', why: 'Instrument change = measurement-system shift.', subject: 'Community Medicine' },
      { label: 'Clinical audit cycle (Community Medicine)', why: 'Model monitoring IS an audit cycle with different machinery.', subject: 'Community Medicine' },
    ],
    sources: [
      ncbiRef('PubMed-indexed literature on model drift, recalibration and monitoring'),
      journalRef('JAMA (journal)', 'External evaluations documenting performance decay of deployed models (name-only attribution)'),
      niceRef('NICE digital-health evidence standards (post-deployment monitoring expectations)'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-bias-explainability ════════════════════════════════════════
  {
    id: 'c-ai-bias-fairness',
    name: 'Bias & Fairness in Medical AI',
    kind: 'ai-concept',
    oneLiner:
      'Medical AI inherits bias from data and from the CHOICE of what to predict — the famous example: an algorithm that used healthcare COSTS as a stand-in for health NEEDS systematically underrated sick Black patients.',
    whyMatters:
      'Bias in AI is not a hypothetical ethics seminar — it has been measured in a deployed, widely used system (Obermeyer et al., Science 2019 — see the paper explainer here). For doctors, bias literacy is patient safety: which patients a model underserves, who was missing from training data, and what "fair" even means are questions you are now part of answering.',
    explain30s:
      'Bias enters at three doors: (1) DATA — under-representation (a dermatology dataset of only light skin), or measurement bias (pulse oximeters’ documented accuracy differences across skin tones); (2) LABELS — the target variable is a proxy that bakes in inequity (costs ≠ need); (3) DEPLOYMENT — a tool used outside its validated population. "Fairness" itself is plural: equal accuracy? equal false-negative rates? equal access to benefit? These definitions can conflict mathematically — so fairness is a stated choice plus measurement across subgroups, not a vibe.',
    eli5:
      'A teacher predicts who needs extra tutoring by looking at how much each family spends on books. Wealthier families buy more books — so the teacher sends help to the rich kids, though need is spread evenly. No cruelty intended; the PROXY was rotten. That is exactly what the famous 2019 study found in a real health algorithm: money spent ≠ health needed, and one group quietly lost out. The fix was not smarter maths — it was a better question.',
    firstPrinciples: [
      'Bias door 1 — data: who is missing? (skin tones, ages, languages, regions). A model cannot serve patients it never saw.',
      'Bias door 2 — labels/proxies: what did the model actually learn to predict? Cost, utilisation and diagnosis-coded data all carry historical inequity inside them.',
      'Bias door 3 — deployment: validated on whom, used on whom? Transfer outside the validated population reopens every earlier gap.',
      'Measurement: performance must be reported BY SUBGROUP (sens/spec/calibration per group), not only overall — averages hide exactly the harm that matters.',
      'Fairness definitions conflict: equalised accuracy vs equal false-negative rates vs calibration within groups cannot all be maximised simultaneously — the choice is ethical and must be explicit.',
      'Governance: diverse teams, subgroup audits before deployment, and ongoing monitoring — bias is re-checked, not certified once.',
    ],
    mechanism:
      'Why proxies do the damage: models optimise the label they are given. If the label is "next-year cost", the model learns to predict spending patterns — including the structural reasons some groups receive less care. Mechanically flawless, ethically broken. Related measurement-level example: pulse oximetry overestimates arterial oxygen more often in darker skin — a sensor-level bias that can flow into any model trained on it.',
    numbers: [
      { label: 'The landmark finding (Obermeyer 2019, Science)', value: 'Fixing the label (cost → illness) would roughly triple the share of Black patients flagged for extra care (≈17.7% → ≈46.5%)', note: 'Widely cited figures; see the paper explainer and its confidence note.' },
    ],
    mistakes: [
      'Believing "the algorithm is just maths, maths cannot be biased" — bias lives in inputs, labels and deployment choices, not in arithmetic.',
      'Checking only average performance — subgroup numbers are where inequity hides.',
      'Treating fairness as one dial — name WHICH fairness definition your tool prioritises and accept the trade-offs openly.',
    ],
    analogies: [
      'Cost-as-proxy = books-bought-as-proxy for needing tutoring.',
      'Subgroup reporting = checking every classroom, not just the school average.',
    ],
    examRelevance:
      'Not in NEET-PG. The underlying concepts (selection bias, measurement bias, confounding) are core biostatistics exam material — AI supplies memorable new examples; the Obermeyer study is a staple of medical journal clubs and ethics teaching worldwide.',
    clinicalRelevance:
      'Bedside version: when a tool’s score seems off for a patient unlike its training population, that suspicion is legitimate — escalate it. Institutional version: demand subgroup performance data in procurement.',
    reasoning: [
      { stage: 'symptom', label: 'A flag pattern feels unequal', detail: 'A group seems over-alerted or under-served by the tool.' },
      { stage: 'investigation', label: 'Audit by subgroup', detail: 'Sensitivity, specificity and calibration per relevant subgroup — with adequate sample sizes acknowledged.' },
      { stage: 'interpretation', label: 'Find the bias door', detail: 'Missing data? proxy label? deployment beyond validated population? Each door has a different fix.' },
      { stage: 'diagnosis', label: 'Name the harm', detail: 'Under-detection (missed care) vs over-alerting (burden/harm) — different groups may bear different harms.' },
      { stage: 'management', label: 'Mitigate & document', detail: 'Re-label, re-weight, re-collect data, restrict scope — and record the fairness definition chosen.' },
      { stage: 'complication', label: 'Re-audit on schedule', detail: 'Fairness drifts with the population; one certification is never enough.' },
    ],
    crossLinks: [
      { label: 'Selection & measurement bias (Biostatistics)', why: 'The classic biases, reborn as AI failure modes.', subject: 'Community Medicine' },
      { label: 'Pulse oximetry (Respiratory Medicine)', why: 'A documented measurement-bias example feeding downstream AI.', subject: 'Respiratory Medicine' },
      { label: 'Explainability (this pack)', why: 'Seeing WHY a model errs helps locate which bias door opened.', subject: 'AI in Medicine' },
      { label: 'Health equity (Community Medicine)', why: 'AI inequity is health inequity at algorithmic speed.', subject: 'Community Medicine' },
    ],
    sources: [
      journalRef('Science (journal)', 'Obermeyer 2019 — racial bias in a health algorithm (name-only attribution)'),
      whoRef('WHO 2021 guidance on ethics & governance of AI for health — equity principle'),
      ncbiRef('PubMed-indexed literature on fairness and subgroup performance in clinical ML'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-explainability',
    name: 'Explainability — Why Did the Model Say That?',
    kind: 'ai-concept',
    oneLiner:
      'Explainability (XAI) is the toolbox for peeking inside a model’s decision — heatmaps showing what an image-classifier looked at, or feature lists showing what pushed a risk score up.',
    whyMatters:
      'Clinicians rightly ask "why?" before acting on a suggestion — for accountability, for learning, and for catching nonsense. Explainability answers incompletely: explanations help debug and build trust, but a plausible-looking heatmap is not proof the model reasoned soundly. Knowing what explanations CAN and CANNOT tell you is the skill.',
    explain30s:
      'Two honest levels: TRANSPARENT models (logistic regression: every feature’s contribution is readable) and POST-HOC explanations for opaque models — saliency heatmaps over images (which pixels drove "pneumonia?"), feature-attribution scores (which inputs pushed this patient’s risk up). The catch: post-hoc explanations approximate the model, and they can look convincing even when the model is using a shortcut. Best practice: treat explanations as clues for expert review, require human-meaningful justification for consequential decisions, and never let a pretty heatmap replace validation.',
    eli5:
      'A brilliant student answers instantly. You ask "how?" — they point at the parts of the question that mattered to them. Sometimes that shows real understanding; sometimes the student actually spotted a trick (a typo pattern) and the pointing is after-the-fact storytelling. Model explanations are that pointing: genuinely useful, occasionally storytelling. Cross-check them against what a careful human would look at.',
    firstPrinciples: [
      'Transparency spectrum: interpretable-by-design models (small regression trees, logistic regression) → glass-box-ish (monotonic models) → black-box (deep nets), where explanation is approximate.',
      'Image explanations: saliency/heatmaps highlight input regions that influenced the output (Grad-CAM-style methods are the well-known family).',
      'Tabular explanations: feature attributions (how much each variable pushed THIS prediction) — per-patient, not just global.',
      'The faithfulness trap: an explanation can be plausible without being faithful to the model’s actual computation — validate explanations themselves.',
      'Use cases that work: debugging (catching shortcut learning), training support, communication scaffolding, and locating failures — not autonomous justification.',
      'Regulatory angle: consequential decisions need human-reviewable rationale; explanations support but do not replace accountability.',
    ],
    mechanism:
      'How heatmaps work (intuition): perturb or gradient-trace the input to estimate which pixels change the output most. Why they can mislead: they summarise LOCAL sensitivity, not the model’s global logic; correlated features scatter credit; adversarial research shows the same output can arise from different inputs with similar-looking maps.',
    numbers: [
      { label: 'Explanation types', value: 'heatmaps (images) · feature attributions (tabular) · example-based (similar past cases)', note: 'Pick per data type; each approximates differently.' },
    ],
    mistakes: [
      'Reading a heatmap as "the proof" — it is a hint, sometimes a misleading one.',
      'Demanding explainability as a substitute for validation — an explained bad model is still a bad model.',
      'Rejecting all black-box models — for some tasks their performance justifies use WITH monitoring and human oversight; the trade-off should be explicit.',
    ],
    analogies: [
      'Heatmap = the student pointing at the question part that swayed them — helpful, checkable, not proof.',
      'Post-hoc explanation = a translator summarising a foreign-language genius: faithful-ish, not word-for-word.',
    ],
    examRelevance:
      'Not in NEET-PG. Appears in institutional AI curricula, ethics teaching (accountability) and journal-club discussions of imaging-AI papers; the underlying accountability logic connects to medico-legal teaching on responsibility.',
    clinicalRelevance:
      'When an imaging tool highlights a region, cross-check it like a colleague’s pointing finger: look there AND form your own view. When a risk score arrives with drivers listed, sanity-check the drivers clinically (a "risk factor" of "recorded height 9 cm" means the data pipeline is broken, not the patient is unusual).',
    teachDeeper: [
      'Interpretable vs explainable: some regulators and clinicians prefer inherently simple models for high-stakes calls unless the black box earns its complexity.',
      'Counterfactual explanations ("the score would drop if creatinine were X") are intuitive for clinicians — and must stay clinically plausible.',
      'Explanation-evaluation research is active: faithfulness metrics exist and are imperfect — an honest field admits it.',
    ],
    crossLinks: [
      { label: 'Clinical reasoning & justification (General Medicine)', why: 'Doctors already justify decisions — models must join the same norm.', subject: 'General Medicine' },
      { label: 'Bias & fairness (this pack)', why: 'Explanations are one tool for surfacing discriminatory shortcuts.', subject: 'AI in Medicine' },
      { label: 'Human-in-the-loop (this pack)', why: 'Explanations make oversight faster and better-informed.', subject: 'AI in Medicine' },
    ],
    sources: [
      ncbiRef('PubMed-indexed explainability (XAI) literature in medical imaging'),
      mitRef('Open course materials on interpretable machine learning'),
      journalRef('The Lancet Digital Health (journal)', 'Explainability evaluation studies (name-only attribution)'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-hallucination-safety ═══════════════════════════════════════
  {
    id: 'c-ai-hallucination',
    name: 'Hallucination — When AI Sounds Right and Is Wrong',
    kind: 'ai-concept',
    oneLiner:
      'A hallucination is AI output that is fluent, confident — and fabricated: invented citations, wrong facts, plausible-sounding nonsense; the mitigation is grounding plus verification, never trust.',
    whyMatters:
      'Hallucination is THE failure mode of the LLM era, and it is dangerous precisely because the output reads beautifully. Doctors have seen fabricated references and invented drug details from general-purpose chatbots. Every workflow you build around AI must assume hallucination is possible on every output — the same way you assume any lab can be mislabelled.',
    explain30s:
      'Why it happens: LLMs predict plausible continuations of text; they have no built-in truth-check. When knowledge runs out, they continue plausibly anyway — inventing references, doses, or guidelines that should exist (but do not). Two control layers: GROUNDING (feed the model real, retrieved documents and require answers from them — retrieval-augmented generation) and VERIFICATION (a human — or a second system — checks output against authoritative sources before anything consequential). Design goal: make verification cheap and mandatory, not optional heroism.',
    eli5:
      'Imagine a student who never says "I don’t know" — every gap gets filled with something that SOUNDS right, in beautiful handwriting. For easy questions they are excellent; for gaps, they write fiction with total confidence. You would happily use their summaries AND check anything important against the textbook. The handwriting was never the test. That is an LLM: brilliant drafter, unreliable witness.',
    firstPrinciples: [
      'Root cause: next-word prediction optimises plausibility, not truth — there is no internal fact-checker to fail loudly.',
      'High-risk shapes: fabricated citations (references that do not exist), invented specifics (doses, criteria, guideline clauses), confident false negatives ("no known interaction").',
      'Grounding: retrieval-augmented generation — the system first fetches real documents, and the model writes FROM them with citations you can open.',
      'Verification: human check for consequential outputs; automated cross-checks (second model, rule systems) reduce volume, not responsibility.',
      'Calibration of trust: risk scales with specificity — a generic summary is safer than a precise-sounding dose; the more precise and consequential, the more verification.',
      'Design rule: workflows should make the RIGHT way the EASY way — verification buttons, source links beside every claim, no copy-paste without check.',
    ],
    mechanism:
      'Why grounding helps but does not cure: a grounded model still summarises, interpolates, and can overreach the source; retrieval can also fetch the wrong document. Hence layered defence: grounded generation + citation display + human verification for anything that touches a decision. Regulators treat consequential outputs as the regulated event, not the model in the abstract.',
    numbers: [
      { label: 'Defence layers', value: 'grounding (RAG) + citations + human verification', note: 'Any single layer alone is not enough for consequential use.' },
      { label: 'The fluency trap', value: 'confidence ≠ correctness', note: 'Tone carries zero information about truth in an LLM.' },
    ],
    mistakes: [
      'Trusting output because it "sounds like my professor" — fluency is the product, not the proof.',
      'Copying an AI citation into academic work without opening it — fabricated references are the classic self-inflicted wound.',
      'Using a general chatbot for dosing or interaction questions — even grounded systems are assistive; dosing decisions follow verified sources and current guidance.',
      'Assuming newer models have "fixed" hallucination — the failure mode persists; mitigations improve, guarantees do not exist.',
    ],
    mnemonics: [
      { hook: 'Draft, not decree', expands: 'LLM output = a draft to check, never a decree to follow' },
    ],
    analogies: [
      'The student who never says "I don’t know" — excellent summaries, fictional footnotes.',
      'Grounding = open-book exam rules: answers must come from the provided book, and you can see the page.',
    ],
    examRelevance:
      'Not in NEET-PG. Rapidly entering institutional curricula, medical-education workshops ("AI tools and academic integrity"), and ethics discussions; fabricated-citation risks are now standard content in research-methodology teaching.',
    clinicalRelevance:
      'Practical rules for practice and study: never let unverified AI output near a prescribing, diagnostic or documentation decision; prefer systems that show sources; report AI-caused near-misses through incident systems like any other hazard.',
    reasoning: [
      { stage: 'symptom', label: 'AI offers a precise-sounding answer', detail: 'Fluent text, a citation, a number — the full costume of credibility.' },
      { stage: 'investigation', label: 'Open the source', detail: 'Does the cited source exist? Does it actually say that? (Fabrication is most common exactly where you cannot check.)' },
      { stage: 'interpretation', label: 'Classify the stakes', detail: 'Generic summary (low stakes) vs patient-specific decision content (high stakes) — verification effort scales with stakes.' },
      { stage: 'diagnosis', label: 'Verify against authority', detail: 'Guidelines, formularies, the primary literature — the same sources you would use without AI.' },
      { stage: 'management', label: 'Decide and own', detail: 'Human decision, documented; AI assistance noted where relevant.' },
      { stage: 'complication', label: 'Feed the system', detail: 'Report hallucinations/near-misses — user reports are how deployments improve.' },
    ],
    crossLinks: [
      { label: 'Academic integrity & plagiarism norms (Medical Education)', why: 'Fabricated citations are an integrity event, not just an error.', subject: 'Medical Education' },
      { label: 'Human-in-the-loop (this pack)', why: 'Verification is HITL applied to text.', subject: 'AI in Medicine' },
      { label: 'LLMs & multimodal AI (this pack)', why: 'The technology whose failure mode this is.', subject: 'AI in Medicine' },
      { label: 'Critical appraisal (Community Medicine)', why: 'Verification against primary sources is appraisal in miniature.', subject: 'Community Medicine' },
    ],
    sources: [
      whoRef('WHO guidance on LLMs in health — trust, safety and human-oversight framing'),
      fdaRef('FDA digital-health framing on generative-AI-enabled device functions'),
      ncbiRef('PubMed-indexed studies measuring hallucination rates in medical LLM outputs'),
    ],
    evidenceLevel: 'emerging',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 1,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-human-in-the-loop',
    name: 'Human-in-the-Loop & Safe Autonomy',
    kind: 'ai-concept',
    oneLiner:
      'Human-in-the-loop (HITL) means the AI assists and a qualified human decides — the default safety architecture for medical AI; autonomy exists only inside narrow, approved, well-monitored tasks.',
    whyMatters:
      'Every AI safety principle from WHO, FDA and NICE lands on the same floor: a named human remains responsible. HITL is also subtler than it sounds — humans over-trust confident machines (automation bias) and skills erode when unused (deskilling). Learning to supervise AI well is becoming a clinical skill in its own right.',
    explain30s:
      'Autonomy is a ladder, not a switch. Assistive: AI suggests, human decides (the overwhelming majority of deployed medical AI). Partial autonomy: AI acts within a narrow approved task with human oversight — the cleanest example is autonomous retinal-screening systems approved in some jurisdictions to issue a "refer / no-refer" recommendation without an over-read, for one specific disease, camera class and population. Full autonomy in open-ended care: does not exist in routine practice. Two human failure modes to train against: automation bias (rubber-stamping the machine) and deskilling (losing the underlying skill). The professional posture: supervise like you would a competent junior — with audit, not blind faith.',
    eli5:
      'Autopilots fly planes most of the time, but we still pay two pilots — because when something weird happens, you want a trained human with authority and recent practice. Medical AI is the same: the machine can hold the yoke for routine pattern-spotting, while the doctor keeps command authority AND keeps flying skills fresh. "The computer said so" is not a landing, a diagnosis, or a prescription.',
    firstPrinciples: [
      'Define the ladder: decision support (suggest) → partial autonomy (act in a narrow approved task) → full autonomy (open-ended action — not current practice).',
      'Narrow autonomy is real: approved autonomous screening systems exist for specific indications (e.g. diabetic retinopathy "refer/no-refer" within validated camera/population bounds) — their narrowness IS the safety.',
      'The human keeps three duties: command (final decision), verification (spot-check audits), and escalation (when the case leaves the tool’s validated box).',
      'Automation bias: confident output + time pressure = rubber-stamping; countermeasures: show uncertainty, require rationale, audit overrides.',
      'Deskilling: if juniors only see AI-filtered images, their unaided skills atrophy — training must include unassisted practice.',
      'Governance: who owns the tool’s performance in your institution? A named accountable person/team — not "the software".',
    ],
    mechanism:
      'Why narrow autonomy works: the task is bounded (one disease), the input is controlled (approved camera, defined quality check), the outcome is low-regret (referral for a confirmatory exam), and performance is monitored. Expand any of those bounds and the safety case must be rebuilt — which is why generalised "AI doctor" claims deserve deep scepticism.',
    numbers: [
      { label: 'Default architecture', value: 'Assistive (human decides) for the overwhelming majority of deployed medical AI', note: 'Narrow autonomous screening is the exception, tightly bounded by indication.' },
    ],
    mistakes: [
      'Rubber-stamping AI output when busy — automation bias is the most common HITL failure, and it is trainable against.',
      'Treating an autonomous-screening "no refer" as a clean bill of health — it clears ONE condition under ONE quality check; symptoms still demand evaluation.',
      'Letting trainees lose unassisted practice — deskilling is a system-level safety debt.',
    ],
    analogies: [
      'Autopilot + pilots: automation flies routinely; humans hold command and stay practised.',
      'Junior + consultant: AI as the tireless junior — the consultant signs, and teaching keeps both sharp.',
    ],
    examRelevance:
      'Not in NEET-PG. Medico-legal responsibility concepts (who is accountable when a tool errs) connect to forensic-medicine teaching; HITL principles appear in institutional AI curricula and hospital governance discussions.',
    clinicalRelevance:
      'Daily practice version: when a tool suggests, do what you would do with a junior’s suggestion — weigh it, verify what is verifiable, decide, document. Governance version: ask who owns monitoring, what the escalation path is, and how overrides are audited.',
    clinicalUpdateRequired: true,
    reasoning: [
      { stage: 'symptom', label: 'AI-assisted finding appears', detail: 'Flag, score or draft enters your workflow with varying confidence display.' },
      { stage: 'mechanism', label: 'Recall the tool’s scope', detail: 'What was it validated for, on whom, at what threshold? Outside that box, it is an unvalidated opinion.' },
      { stage: 'investigation', label: 'Independent check', detail: 'Verify the data feed, look at the primary evidence (image, tracing, note) yourself.' },
      { stage: 'interpretation', label: 'Guard against bias', detail: 'Ask: would I agree if a junior said this? If the machine were silent, would I have looked here — or looked past this?' },
      { stage: 'diagnosis', label: 'Human decision', detail: 'Agree, override, or escalate — each is legitimate; silent rubber-stamping is not.' },
      { stage: 'management', label: 'Document & feed back', detail: 'Record your reasoning and the tool’s input; overrides and misses feed governance review.' },
    ],
    crossLinks: [
      { label: 'Medical responsibility & negligence (Forensic Medicine)', why: 'Accountability cannot be delegated to software.', subject: 'Forensic Medicine' },
      { label: 'Supervision & training norms (Medical Education)', why: 'HITL borrows the apprenticeship model’s safeguards.', subject: 'Medical Education' },
      { label: 'Autonomous retinal screening (this pack)', why: 'The worked example of narrow autonomy.', subject: 'AI in Medicine' },
    ],
    sources: [
      whoRef('WHO 2021 guidance on ethics & governance of AI for health — human accountability principle'),
      fdaRef('FDA framing on AI-enabled device functions and intended use'),
      niceRef('NICE evidence standards (human oversight in evaluation)'),
    ],
    evidenceLevel: 'varies-by-guideline',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
  },

  // ═══ Topic: ai-ethics-regulation ══════════════════════════════════════════
  {
    id: 'c-ai-health-data-privacy',
    name: 'Health Data Privacy for the AI Era',
    kind: 'ai-concept',
    oneLiner:
      'Health data is the fuel of medical AI and the most sensitive data a person owns — privacy law (HIPAA in the US, GDPR in the UK/EU, India’s DPDP Act) sets the floor; professional duty sets the standard.',
    whyMatters:
      'Every AI tool you touch runs on patient data, and every consultation you record (ambient scribes!), every dataset you contribute to, every chatbot query you paste is a privacy event. Doctors are the first line: knowing what is identifiable, what consent covers, and what never gets pasted into a consumer tool is now basic professionalism.',
    explain30s:
      'Key ideas: personal data vs DE-IDENTIFIED data (identifiers removed — but re-identification from "anonymous" combinations is a proven risk, so de-identification is a spectrum, not a switch); CONSENT (what scope? one study, one deployment, secondary research?); MINIMISATION (collect/use only what is needed); and SECURITY (encryption, access control — privacy dies fastest through breaches). Legal floors: HIPAA (US), GDPR/UK GDPR (UK/EU), India’s Digital Personal Data Protection Act 2023 plus its health-specific missions (ABDM consent architecture). For AI specifically: training on patient data, model memorisation risks, and consumer-tool data flows are the new battlegrounds.',
    eli5:
      'Treat patient data like their naked photographs: hugely useful for teaching and research, catastrophic if leaked, and never something to post to a stranger’s website for "quick help". Removing the face (de-identification) helps but is not magic — enough puzzle pieces can rebuild the person. So: share the minimum, with consent, through locked doors (secure systems), and check who keeps copies.',
    firstPrinciples: [
      'Identifiability is a spectrum: names are obvious; rare diagnosis + small town + date is effectively a name. Judge re-identification risk, not field labels.',
      'Consent has scope: purpose, duration, and downstream use — ambient scribe recording needs explicit consent; research reuse needs its own basis.',
      'Minimisation: every extra field is extra risk — collect and expose only what the task needs.',
      'Security is half of privacy: encryption, access logs, vendor agreements — most leaks are process failures, not clever hackers.',
      'AI-specific risks: models can memorise and leak training data; consumer chatbots may retain/process inputs — patient identifiers never go in.',
      'Legal floors vary by country; professional duty does not — treat every patient’s data as you want yours treated, wherever you practise.',
    ],
    mechanism:
      'Why "anonymised" leaks: high-dimensional data re-identifies (the classic demonstrations: genomes, location traces, hospital-record linkages). Defences: k-anonymity-style suppression/generalisation, differential-privacy-style noise, federated learning (model travels to data, raw data stays local) — each trades utility for protection, none is unconditional.',
    numbers: [
      { label: 'India’s general data law', value: 'Digital Personal Data Protection Act, 2023 (DPDP Act)', note: 'With ABDM’s consent-based architecture for health specifically — verify current rules as implementation evolves.' },
      { label: 'US floor', value: 'HIPAA (Privacy & Security Rules)', note: 'Applies to covered entities and business associates; consumer apps often sit outside it — a core gap.' },
      { label: 'UK/EU floor', value: 'GDPR / UK GDPR — special-category protections for health data', note: 'Explicit lawful basis required for processing.' },
    ],
    mistakes: [
      'Pasting identifiable patient details into consumer AI tools — the single most common new privacy breach by clinicians.',
      'Recording consultations with an AI scribe without explicit consent — a consent failure before it is a technology question.',
      'Trusting "anonymised" absolutely — treat it as reduced risk, not zero risk.',
    ],
    mnemonics: [
      { hook: 'CAMS', expands: 'Consent · Anonymise/minimise · Minimum necessary · Secure — the four doors data must pass' },
    ],
    analogies: [
      'De-identification = removing the face from a photo: helpful, reversible by context if enough clues remain.',
      'Federated learning = sending the recipe-seeker to the library instead of photocopying the books.',
    ],
    examRelevance:
      'Not in NEET-PG as "AI privacy", BUT confidentiality is core exam material in Forensic Medicine and hospital administration — AI scenarios (scribe consent, chatbot leaks) are the fresh question-dress. India’s ABDM appears in Community Medicine/public-health administration teaching.',
    clinicalRelevance:
      'Daily rules: no identifiers into consumer tools; consent scripts for recording; vendor agreements before pilots; report suspected leaks through incident systems. When contributing data to research, confirm the ethics basis and de-identification standard.',
    clinicalUpdateRequired: true,
    teachDeeper: [
      'Model memorisation: large models can regurgitate training examples — a reason healthcare deployments use controls beyond generic chatbots.',
      'Synthetic data: generated fake-but-realistic records for development — promising, not automatically private.',
      'Cross-border flows: data-localisation rules differ by country — relevant for cloud AI vendors.',
    ],
    crossLinks: [
      { label: 'Confidentiality & medical ethics (Forensic Medicine)', why: 'The 2,400-year-old duty that AI just made harder to keep.', subject: 'Forensic Medicine' },
      { label: 'Medical data & FHIR (this pack)', why: 'Interoperability and privacy must be designed together.', subject: 'AI in Medicine' },
      { label: 'Health information systems (Community Medicine)', why: 'ABDM/HMIS context for India-specific practice.', subject: 'Community Medicine' },
    ],
    sources: [
      whoRef('WHO 2021 guidance on ethics & governance of AI for health — privacy principle'),
      fdaRef('FDA digital-health privacy-adjacent guidance (device data context)'),
      ncbiRef('PubMed-indexed literature on health-data re-identification and privacy technologies'),
    ],
    evidenceLevel: 'varies-by-guideline',
    sourceConfidence: 'medium',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
  },

  {
    id: 'c-ai-regulation-ethics',
    name: 'Regulating & Governing Medical AI',
    kind: 'ai-concept',
    oneLiner:
      'Medical AI is regulated as medical SOFTWARE — the US FDA route (Software as a Medical Device), UK pathways, and WHO’s ethics guidance together define how tools earn the right to touch patients.',
    whyMatters:
      '"AI-powered" is marketing; "authorised for this intended use" is regulation. Doctors sit between the two at procurement and at the bedside. Knowing how medical software is classified, what evidence regulators expect, and which ethics principles (WHO’s six: protect autonomy; promote human well-being; ensure transparency; foster responsibility; ensure inclusiveness; promote responsive sustainability) structure the debate makes you the person hospitals trust with these decisions.',
    explain30s:
      'If software makes or informs claims about diagnosing, treating or managing disease, most countries regulate it as a medical device — the umbrella term is Software as a Medical Device (SaMD). The US FDA has cleared/authorised hundreds of AI-enabled devices (imaging dominates) via existing pathways (510(k), De Novo, PMA), and is actively adapting frameworks for adaptive/learning algorithms. The UK routes via MHRA with NICE assessing value/evidence. WHO’s 2021 guidance sets global ETHICS principles for health AI. Core regulatory ideas: intended use defines the bar; validation evidence must match risk; adaptive models raise "how do you regulate something that keeps changing?" — answered (increasingly) by change-control plans and post-market monitoring.',
    eli5:
      'A new drug needs proof before pharmacy shelves; a new AI tool needs proof before it touches patients — the proof just looks different (validation studies, quality systems, monitoring plans). And because AI can quietly change over time, regulators increasingly demand a promise: "if you change the model, you re-check it, you tell us, and someone is accountable." Think of it as a driving licence plus a promise to re-test after every engine swap.',
    firstPrinciples: [
      'SaMD concept: software intended for medical purposes that runs on general hardware — regulated per risk category tied to its claim (inform vs drive clinical management).',
      'Intended use is everything: the same model may be a wellness toy outside claims and a regulated device inside them.',
      'Evidence ladder matches risk: higher-risk claims need stronger clinical validation — including, increasingly, external/prospective evidence.',
      'The adaptive-model problem: models that update post-deployment break the "frozen device" assumption — regulators respond with predetermined change-control plans and lifecycle oversight.',
      'The ethics layer (WHO 2021): protect human autonomy; promote well-being & safety; ensure transparency & explicability; foster responsibility & accountability; ensure inclusiveness & equity; promote AI that is responsive & sustainable.',
      'Your role: procurement committees, incident reporting, and simply asking "what is this authorised for, and what evidence exists in populations like ours?" — governance is a clinical job now.',
    ],
    mechanism:
      'How a tool reaches practice (generalised): developer claims intended use → validation evidence → regulator authorisation/clearance per pathway → institutional procurement & governance → deployment with monitoring → post-market reporting. Different countries weight stages differently; the LOGIC (claims bounded by evidence) is converging globally.',
    numbers: [
      { label: 'US device umbrella', value: 'Software as a Medical Device (SaMD); AI-enabled device lists published by FDA', note: 'Imaging has been the leading category among AI-enabled authorisations.' },
      { label: 'Global ethics reference', value: 'WHO guidance on ethics & governance of AI for health (2021)', note: 'Six principles — the shared vocabulary of health-AI governance.' },
      { label: 'UK value check', value: 'NICE evidence standards framework for digital health technologies', note: 'Evidence expectations scale with the product’s risk tier.' },
    ],
    mistakes: [
      'Assuming "FDA-cleared" means "proven to improve outcomes" — clearance covers the specific intended use and its evidence bar, which varies by risk class.',
      'Treating regulation as a country-curiosity — intended-use logic transfers; paperwork details differ.',
      'Forgetting procurement is governance: choosing tools is a clinical decision with regulatory texture, not an IT purchase.',
    ],
    analogies: [
      'SaMD pathways = driving licences with vehicle classes: a licence for a scooter is not a licence for a truck.',
      'Adaptive-model change control = re-testing after every engine swap, with the mechanic’s logbook open to the examiner.',
    ],
    examRelevance:
      'Not in NEET-PG. Regulatory and drug-trial concepts appear in Pharmacology (regulatory bodies, pharmacovigilance) and Forensic Medicine (consumer protection, negligence) — AI regulation slots into those frames as fresh examples; institutional curricula and MD teaching cover it directly.',
    clinicalRelevance:
      'Practical skill: read an AI vendor sheet and extract — intended use? risk class? evidence (internal/external/prospective)? monitoring plan? accountability? Those five answers decide more patient safety than any accuracy number on the slide.',
    clinicalUpdateRequired: true,
    global: [
      {
        region: 'India',
        delivery: 'India regulates medical devices under the CDSCO framework (Medical Devices Rules, 2017), with software as a medical device recognised in principle; digital-health governance develops through ABDM and national policy (National Health Policy 2017 articulated a supportive digital-health stance).',
        terminology: ['CDSCO — Central Drugs Standard Control Organisation', 'MDR 2017 — Medical Devices Rules', 'ABDM — Ayushman Bharat Digital Mission'],
        note: 'AI-specific regulation is evolving; describes the general architecture, not specific device claims — verify current status.',
      },
      {
        region: 'United States',
        delivery: 'FDA authorises AI-enabled devices via 510(k), De Novo and PMA pathways and publishes lists of AI-enabled medical devices; adaptive algorithms are addressed through evolving frameworks (predetermined change-control plan concepts).',
        terminology: ['SaMD — Software as a Medical Device', '510(k) / De Novo / PMA — authorisation pathways'],
        note: 'The most device-dense AI market; clearance ≠ outcome proof — evidence bars scale with risk class.',
      },
      {
        region: 'United Kingdom',
        delivery: 'MHRA regulates software and AI as medical devices ("Software and AI as a Medical Device" guidance); NICE’s evidence standards framework assesses digital health technologies for value and evidence before wider adoption.',
        terminology: ['MHRA — Medicines and Healthcare products Regulatory Agency', 'DiD — Devices in Digital Health framing (NICE EVIDENS-class framework)'],
        note: 'A two-door model: safety authorisation (MHRA) + value/evidence assessment (NICE).',
      },
      {
        region: 'WHO/Global',
        delivery: 'WHO’s 2021 guidance on ethics and governance of AI for health sets six principles and later guidance addresses LLMs specifically — the global reference frame for national policy.',
        terminology: ['Six WHO principles — autonomy, well-being, transparency, responsibility, inclusiveness, sustainability'],
        note: 'Principles, not law — national implementations vary; the shared language is the value.',
      },
    ],
    crossLinks: [
      { label: 'Drug regulatory bodies & pharmacovigilance (Pharmacology)', why: 'Same logic — claims bounded by evidence, monitored after launch.', subject: 'Pharmacology' },
      { label: 'Consumer protection & negligence (Forensic Medicine)', why: 'Legal frame when tools harm.', subject: 'Forensic Medicine' },
      { label: 'Human-in-the-loop (this pack)', why: 'Oversight duties are the operating half of regulation.', subject: 'AI in Medicine' },
    ],
    sources: [
      fdaRef('Digital health / Software as a Medical Device policy and AI-enabled device listings'),
      niceRef('Evidence standards framework for digital health technologies'),
      whoRef('2021 guidance on ethics & governance of artificial intelligence for health'),
    ],
    evidenceLevel: 'varies-by-guideline',
    sourceConfidence: 'medium',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 2,
    globalRelevance: 'universal',
    verifyNote: 'Regulatory pathways and guidance evolve quickly — verify against current FDA/MHRA/CDSCO/WHO sources before relying on specifics.',
  },
]

// ── LESSON → TOPIC HINTS ────────────────────────────────────────────────────
// The shared ConceptLesson type has no topicId field; the seeder resolves
// placement via this explicit map (additive runtime hint, contract untouched).
const LESSON_TOPICS: Record<string, string> = {
  'c-ai-what-is-medical-ai': 'ai-foundations',
  'c-ai-machine-learning-basics': 'ai-foundations',
  'c-ai-deep-learning': 'ai-deep-learning-llms',
  'c-ai-llms-multimodal': 'ai-deep-learning-llms',
  'c-ai-clinical-decision-support': 'ai-clinical-decision-support',
  'c-ai-predictive-models': 'ai-clinical-decision-support',
  'c-ai-imaging-ai': 'ai-medical-imaging',
  'c-ai-clinical-nlp': 'ai-clinical-nlp',
  'c-ai-drug-discovery': 'ai-drug-discovery',
  'c-ai-precision-medicine': 'ai-drug-discovery',
  'c-ai-wearables-monitoring': 'ai-digital-health',
  'c-ai-digital-twins': 'ai-digital-health',
  'c-ai-robotics-surgery': 'ai-robotics-agents',
  'c-ai-healthcare-agents': 'ai-robotics-agents',
  'c-ai-medical-data-fhir': 'ai-data-fhir',
  'c-ai-sensitivity-specificity': 'ai-evaluation-metrics',
  'c-ai-auroc-auprc': 'ai-evaluation-metrics',
  'c-ai-external-validation': 'ai-validation-shift',
  'c-ai-dataset-shift-calibration': 'ai-validation-shift',
  'c-ai-bias-fairness': 'ai-bias-explainability',
  'c-ai-explainability': 'ai-bias-explainability',
  'c-ai-hallucination': 'ai-hallucination-safety',
  'c-ai-human-in-the-loop': 'ai-hallucination-safety',
  'c-ai-health-data-privacy': 'ai-ethics-regulation',
  'c-ai-regulation-ethics': 'ai-ethics-regulation',
}

const lessonsWithTopics = lessons.map((l) => {
  const topicId = LESSON_TOPICS[l.id]
  if (!topicId || !topics.some((t) => t.id === topicId)) {
    throw new Error(`[ai-medicine pack] lesson ${l.id} has no valid topic hint (${topicId ?? 'none'})`)
  }
  return { ...l, topicId }
})

// ── PACK ASSEMBLY ───────────────────────────────────────────────────────────
// Structurally matches registry's ContentPack: { packId, subjects, topics,
// lessons, curriculum }. 1 subject · 14 topics · 25 lessons · 3 records.

export const aiMedicinePack: ContentPack = {
  packId: 'ai-medicine',
  subjects,
  topics,
  lessons: lessonsWithTopics,
  curriculum,
}

