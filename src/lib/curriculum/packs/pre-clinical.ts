// ─── MEDULA — 'Pre-clinical' content pack (Task 19-b) ───────────────────────
// Anatomy · Physiology · Biochemistry · Histology · Embryology · Genetics ·
// Immunology — the year-1 foundations.
//
// Self-contained pack. Imports ONLY the shared contracts — all 7 subjects
// already exist in taxonomy.ts / the DB, so this pack declares NO subjects
// (subjects: []). Topics reuse the EXACT seeded DB topic ids wherever a
// matching topic exists (t-anat-heart, t-anat-brachial, t-anat-femoral,
// t-phys-cardcycle, t-phys-raas, t-phys-lung, t-phys-thyroid — names kept
// byte-identical to prisma/seed-data.ts; empty seeded descriptions filled
// additively) and add new `${subjectId}-${slug}` topics for everything else.
// Concept lessons: new ids use the `c2-<subjectId>-<slug>` scheme. Five
// lessons deliberately use EXISTING seeded concept ids (c-brachial, c-femoral,
// c-cardcycle, c-raas, c-thyroidphys) — each genuinely covers that concept's
// core, so this enriches rather than duplicates (the para-clinical pack
// precedent; none of these ids is declared by any other pack).
//
// HONESTY RULES (pack-wide):
// - Educational content only — NEVER clinical advice. Management-style fields
//   are principles, and emergency-drug mentions are well-established teaching
//   values paired with verifyNote pointing to local protocols.
// - Sources are references for attribution; nothing is reproduced from them.
//   Only the eight whitelisted institutions appear as sources.
// - No invented statistics. Every number is a classic, widely-published
//   teaching value (e.g. SA node 60–100/min, K⁺ 3.5–5.0 mEq/L, Down syndrome
//   ≈ 1/700 live births); where practice varies we say so.

import type {
  ConceptLesson,
  CurriculumRecord,
  SourceRef,
  SourceType,
  SubjectTaxonomy,
  TopicTaxonomy,
} from '../types'

// ── Source helpers — institutions/resources verified to exist ───────────────
// Root-domain URLs only (certain, publicly reachable). accessNote is ALWAYS
// the honest framing: attribution, never a claim of copied text.

const REF_NOTE = 'Reference — content independently synthesized'

const staxRef = (title: string): SourceRef => ({
  institution: 'OpenStax (Rice University)',
  title,
  url: 'https://openstax.org',
  sourceType: 'open-courseware',
  accessNote: REF_NOTE,
})

const hmxRef = (title: string): SourceRef => ({
  institution: 'Harvard Medical School (HMX online education)',
  title,
  url: 'https://hms.harvard.edu',
  sourceType: 'course',
  accessNote: REF_NOTE,
})

const ocwRef = (title: string): SourceRef => ({
  institution: 'MIT OpenCourseWare',
  title,
  url: 'https://ocw.mit.edu',
  sourceType: 'open-courseware',
  accessNote: REF_NOTE,
})

const jhmiRef = (title: string): SourceRef => ({
  institution: 'Johns Hopkins Medicine',
  title,
  url: 'https://www.hopkinsmedicine.org',
  sourceType: 'hospital-reference',
  accessNote: REF_NOTE,
})

const whoRef = (title: string, sourceType: SourceType = 'guideline'): SourceRef => ({
  institution: 'World Health Organization (WHO)',
  title,
  url: 'https://www.who.int',
  sourceType,
  accessNote: REF_NOTE,
})

const ncbiRef = (title: string): SourceRef => ({
  institution: 'NIH / NCBI (PubMed Central)',
  title,
  url: 'https://www.ncbi.nlm.nih.gov',
  sourceType: 'database',
  accessNote: REF_NOTE,
})

const cdcRef = (title: string): SourceRef => ({
  institution: 'U.S. Centers for Disease Control and Prevention (CDC)',
  title,
  url: 'https://www.cdc.gov',
  sourceType: 'health-organization',
  accessNote: REF_NOTE,
})

const nmcRef = (title: string): SourceRef => ({
  institution: 'National Medical Commission (NMC), India',
  title,
  url: 'https://www.nmc.org.in',
  sourceType: 'exam-authority',
  accessNote: REF_NOTE,
})

// ── TOPICS (24) ─────────────────────────────────────────────────────────────
// 7 reuse the EXACT seeded DB topic ids (names byte-identical to
// prisma/seed-data.ts); 17 new topics follow `${subjectId}-${slug}`.

const topics: TopicTaxonomy[] = [
  // ── Anatomy — reused DB topics (names byte-identical to seed) ─────────────
  {
    id: 't-anat-heart',
    subjectId: 'anatomy',
    name: 'Heart & Coronary Circulation',
    system: 'cardiovascular',
    importance: 4,
    description: 'Chambers, valves, coronary arteries — the plumbing behind every MI.',
  },
  {
    id: 't-anat-brachial',
    subjectId: 'anatomy',
    name: 'Brachial Plexus',
    system: 'musculoskeletal',
    importance: 4,
    description: 'Roots-trunks-divisions-cords-branches — every exam favourite nerve map.',
  },
  {
    id: 't-anat-femoral',
    subjectId: 'anatomy',
    name: 'Femoral Triangle',
    system: 'musculoskeletal',
    importance: 3,
    description: 'NAVEL boundaries, contents, catheterisation and hernia relevance.',
  },
  // ── Anatomy — new topics ──────────────────────────────────────────────────
  {
    id: 'anatomy-inguinal-canal',
    subjectId: 'anatomy',
    name: 'Inguinal Canal & Hernia Anatomy',
    system: 'gastrointestinal',
    importance: 4,
    description: 'Walls, rings and contents of the inguinal canal — the anatomy behind the most common hernia question.',
  },
  {
    id: 'anatomy-thyroid-gland',
    subjectId: 'anatomy',
    name: 'Thyroid Gland — Gross Anatomy',
    system: 'endocrine',
    importance: 3,
    description: 'Lobes, isthmus, blood supply and the nerves at risk in thyroid surgery.',
  },
  {
    id: 'anatomy-diaphragm',
    subjectId: 'anatomy',
    name: 'Diaphragm — Openings & Innervation',
    system: 'respiratory',
    importance: 3,
    description: 'Three apertures, their vertebral levels, and the phrenic nerve that runs the show.',
  },
  // ── Physiology — reused DB topics (names byte-identical to seed) ──────────
  {
    id: 't-phys-cardcycle',
    subjectId: 'physiology',
    name: 'Cardiac Cycle',
    system: 'cardiovascular',
    importance: 5,
    description: 'Pressure-volume dance, heart sounds, ECG correlation.',
  },
  {
    id: 't-phys-raas',
    subjectId: 'physiology',
    name: 'RAAS & Blood Pressure',
    system: 'renal',
    importance: 5,
    description: 'Renin-angiotensin-aldosterone — the most connected pathway in medicine.',
  },
  {
    id: 't-phys-lung',
    subjectId: 'physiology',
    name: 'Pulmonary Function',
    system: 'respiratory',
    importance: 4,
    description: 'Ventilation mechanics, lung volumes and gas exchange across the alveolar membrane.',
  },
  {
    id: 't-phys-thyroid',
    subjectId: 'physiology',
    name: 'Thyroid Hormone Physiology',
    system: 'endocrine',
    importance: 4,
    description: 'The hypothalamic–pituitary–thyroid axis, hormone synthesis and metabolic action.',
  },
  // ── Physiology — new topics ───────────────────────────────────────────────
  {
    id: 'physiology-cardiac-electrophysiology',
    subjectId: 'physiology',
    name: 'Cardiac Action Potential & Conduction',
    system: 'cardiovascular',
    importance: 5,
    description: 'Phase 0–4, pacemaker hierarchy and conduction speeds — the electrical wiring of the heart.',
  },
  {
    id: 'physiology-gi-secretion',
    subjectId: 'physiology',
    name: 'GI Secretion',
    system: 'gastrointestinal',
    importance: 3,
    description: 'Saliva, gastric acid, pancreatic juice and bile — who secretes what, on which signal.',
  },
  // ── Biochemistry — new topics ─────────────────────────────────────────────
  {
    id: 'biochemistry-glycolysis-tca',
    subjectId: 'biochemistry',
    name: 'Glycolysis & TCA Cycle Overview',
    system: 'multisystem',
    importance: 4,
    description: 'Glucose to CO₂ and ATP — the central energy pathway and its clinical fingerprints.',
  },
  {
    id: 'biochemistry-fasting-metabolism',
    subjectId: 'biochemistry',
    name: 'Fasting State & Gluconeogenesis',
    system: 'endocrine',
    importance: 4,
    description: 'How blood glucose survives the night — glycogen, gluconeogenesis, ketones.',
  },
  {
    id: 'biochemistry-vitamins',
    subjectId: 'biochemistry',
    name: 'Vitamins & Deficiency States',
    system: 'multisystem',
    importance: 4,
    description: 'Fat-soluble vs water-soluble, each vitamin\u2019s job and the deficiency disease it leaves behind.',
  },
  // ── Histology — new topics ────────────────────────────────────────────────
  {
    id: 'histology-epithelium',
    subjectId: 'histology',
    name: 'Epithelial Tissue',
    system: 'multisystem',
    importance: 3,
    description: 'Layers × shapes — the covering tissue whose classification explains every lining in the body.',
  },
  {
    id: 'histology-connective-tissue',
    subjectId: 'histology',
    name: 'Connective Tissue',
    system: 'multisystem',
    importance: 3,
    description: 'Cells, fibres and ground substance — the scaffolding tissue and its genetic diseases.',
  },
  // ── Embryology — new topics ───────────────────────────────────────────────
  {
    id: 'embryology-heart-development',
    subjectId: 'embryology',
    name: 'Heart Embryogenesis & Septation',
    system: 'cardiovascular',
    importance: 4,
    description: 'From a simple tube to a four-chambered pump — and the congenital defects when septation fails.',
  },
  {
    id: 'embryology-gi-rotation',
    subjectId: 'embryology',
    name: 'Midgut Rotation & Malrotations',
    system: 'gastrointestinal',
    importance: 3,
    description: 'The 270° turn that positions the gut — and what volvulus has to do with it.',
  },
  // ── Genetics — new topics ─────────────────────────────────────────────────
  {
    id: 'genetics-inheritance-patterns',
    subjectId: 'genetics',
    name: 'Inheritance Patterns & Pedigrees',
    system: 'multisystem',
    importance: 4,
    description: 'AD, AR, X-linked, mitochondrial — read the pedigree, name the pattern.',
  },
  {
    id: 'genetics-trisomies',
    subjectId: 'genetics',
    name: 'Trisomies 21, 18 & 13',
    system: 'multisystem',
    importance: 4,
    description: 'The three viable autosomal trisomies — recognition features and screening logic.',
  },
  // ── Immunology — new topics ───────────────────────────────────────────────
  {
    id: 'immunology-innate-adaptive',
    subjectId: 'immunology',
    name: 'Innate vs Adaptive Immunity',
    system: 'immune-infection',
    importance: 5,
    description: 'Two defence systems, one handover — speed, specificity and memory.',
  },
  {
    id: 'immunology-hypersensitivity',
    subjectId: 'immunology',
    name: 'Hypersensitivity Reactions I–IV',
    system: 'immune-infection',
    importance: 5,
    description: 'When defence turns harmful — the four types, their mechanisms and classic examples.',
  },
  {
    id: 'immunology-immunodeficiency',
    subjectId: 'immunology',
    name: 'Immunodeficiency States',
    system: 'immune-infection',
    importance: 4,
    description: 'Which arm of immunity failed? The infection pattern tells you.',
  },
]

// ── LESSONS (25) ────────────────────────────────────────────────────────────
// Anatomy 6 · Physiology 7 · Biochemistry 3 · Histology 2 · Embryology 2 ·
// Genetics 2 · Immunology 3.

const lessons: ConceptLesson[] = [
  // ═══════════════════════════ ANATOMY (6) ═══════════════════════════════

  {
    id: 'c2-anatomy-heart-chambers-valves',
    name: 'Heart Chambers & Valves',
    kind: 'structure',
    oneLiner: 'The heart is a four-chambered pump with four one-way valves that keep blood moving in a single direction.',
    whyMatters: 'Every murmur, every heart failure pattern and every congenital defect question starts here: know which chamber pushes blood through which valve, and the whole cardiovascular examination becomes logic instead of memorisation.',
    explain30s: 'The right side of the heart receives oxygen-poor blood from the body and pumps it to the lungs. The left side receives oxygen-rich blood from the lungs and pumps it to the whole body. Each side has a receiving chamber (atrium) and a pumping chamber (ventricle). Four valves — tricuspid, pulmonary, mitral, aortic — open and close with each beat to keep blood flowing forward only. Valve failure means either narrowing (stenosis) or leaking (regurgitation).',
    eli5: 'Imagine a two-storey house with two upstairs rooms and two downstairs rooms. Upstairs rooms (atria) collect rainwater; downstairs rooms (ventricles) pump it out. The doors between rooms (valves) only open one way, like gates at a football stadium. If a gate is too narrow, water backs up. If a gate does not close, water leaks backwards. That is all a heart murmur is — the sound of a door that is not working properly.',
    firstPrinciples: [
      'Blood always flows from high pressure to low pressure — the whole heart is built around that one rule.',
      'Deoxygenated blood arrives in the RIGHT atrium from the body via the superior and inferior vena cava, and from the heart itself via the coronary sinus.',
      'Right atrium contracts → blood crosses the TRICUSPID valve into the right ventricle → right ventricle pumps it through the PULMONARY valve into the pulmonary arteries → lungs.',
      'Oxygenated blood returns via pulmonary veins to the LEFT atrium → crosses the MITRAL (bicuspid) valve into the left ventricle → pumped through the AORTIC valve into the aorta → whole body.',
      'The left ventricle therefore works against much higher pressure (systemic circulation) than the right (pulmonary circulation) — which is why its wall is roughly three times thicker.',
      'Valves sit between a chamber and a vessel, or between atrium and ventricle; each "atrioventricular" valve is anchored by papillary muscles and chordae tendineae (little guy-ropes) so it does not flip inside-out under pressure.',
    ],
    normal: 'Right atrium receives systemic venous return; left ventricle wall is the thickest (~3× the right). Valves in flow order: tricuspid → pulmonary → mitral → aortic. The valve area of the normal mitral valve is roughly 4–6 cm² — narrowing below ~1 cm² produces severe mitral stenosis (classic teaching value).',
    mechanism: 'Closure of each valve is a PRESSURE event, not a muscular one: when the pressure behind a valve exceeds the pressure ahead of it, it slams shut. That closure — not the heartbeat itself — creates S1 (atrioventricular valves) and S2 (semilunar valves) on auscultation.',
    numbers: [
      { label: 'Left ventricle vs right ventricle wall', value: 'LV ~3× thicker than RV', note: 'left side pumps against systemic arterial pressure; right side only against pulmonary pressure' },
      { label: 'Normal mitral valve area', value: '≈ 4–6 cm²', note: 'critical narrowing below ~1 cm² = severe mitral stenosis (classic teaching threshold)' },
    ],
    differentials: [
      { name: 'Stenosis', key: 'valve fails to OPEN fully — pressure builds up behind it, causing a high-velocity jet and often a crescendo–decrescendo murmur' },
      { name: 'Regurgitation (incompetence)', key: 'valve fails to CLOSE — blood leaks backwards, e.g. mitral regurgitation after chordae rupture or rheumatic scarring' },
    ],
    mistakes: [
      'Mixing up the sides: the PULMONARY artery carries deoxygenated blood and the pulmonary VEINS carry oxygenated blood — "artery = oxygen-rich" is the beginner trap.',
      'Calling the mitral valve "right-sided": mnemonic flow order T-P-M-A (tricuspid, pulmonary, mitral, aortic) follows the blood.',
      'Thinking valves are actively opened by muscles — they are passive pressure doors; muscles (papillary) only stop them from everting.',
    ],
    examRelevance: 'Favourite stem: "a murmur loudest at the apex radiating to the axilla" — mitral regurgitation. Valve-chamber mapping is assumed knowledge in every cardiology vignette, ECG question and congenital heart disease stem.',
    clinicalRelevance: 'Auscultation sites are named after the valve but sit ABOVE it along the flow direction — you listen where the jet carries, not where the valve sits. Rheumatic fever damages valves (classically mitral) years after a strep throat — one of the most preventable heart diseases worldwide.',
    analogies: [
      'Valves are one-way stadium gates: open for the crowd moving forward, slam shut if anyone tries to walk back.',
      'The two sides of the heart are two separate pumps sharing a wall — a "hole in the wall" (septal defect) mixes the two circuits.',
    ],
    crossLinks: [
      { label: 'Cardiac Cycle (Physiology)', why: 'The pressure changes that open and close each valve are the cardiac cycle itself.', subject: 'Physiology' },
      { label: 'Coronary Arteries (Anatomy)', why: 'Same organ, same topic cluster — perfusion happens during diastole, when the aortic valve is closed.', subject: 'Anatomy' },
      { label: 'Heart Embryogenesis (Embryology)', why: 'Chambers and valves are carved out of one embryonic tube — defects of septation explain congenital valve disease.', subject: 'Embryology' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — the Heart, chapters on chambers and circulation'),
      jhmiRef('Patient education on heart valves and heart anatomy'),
      nmcRef('CBME foundation-course competencies in human anatomy'),
    ],
  },

  {
    id: 'c-brachial',
    name: 'Brachial Plexus',
    kind: 'structure',
    oneLiner: 'The brachial plexus is the nerve network that re-routes fibres from five spinal roots into the five main nerves of the arm.',
    whyMatters: 'It is the single most-tested anatomy diagram: birth injuries, shoulder trauma, Saturday-night palsy and Klumpke claw hand are all plexus-lesion questions. Learn the map once and every upper-limb neurology stem becomes readable.',
    explain30s: 'Five nerve roots (C5–T1) emerge from the spinal cord and braid themselves into the arm\u2019s nerves. The braiding order is roots → trunks → divisions → cords → branches. The cords are named for their position around the axillary artery (lateral, posterior, medial). Each cord ends in terminal nerves: musculocutaneous, axillary, radial, median, ulnar. Localise a lesion by asking which movements are lost — shoulder (upper trunk), hand intrinsics (lower trunk), extension (radial), flexion of forearm (musculocutaneous), precise finger movements (median/ulnar).',
    eli5: 'Picture five rivers from different hills joining into one lake, then splitting again into five canals that water different fields. The rivers are the spinal roots (C5–T1), the lake is the plexus, and the canals are the nerves to your arm. If one canal is blocked, only its field dries up — so which field is dry tells you which canal is blocked. That is how doctors work backwards from a weak hand to the exact nerve, and from the nerve back to the exact spot on the plexus.',
    firstPrinciples: [
      'Start with the raw material: ventral rami of spinal nerves C5, C6, C7, C8 and T1 — five roots carrying motor and sensory fibres destined for one limb.',
      'ROOTS → TRUNKS: C5+C6 = upper trunk, C7 = middle trunk, C8+T1 = lower trunk. (Memory: 5+6, 7 alone, 8+1 — pairs at the ends, singleton in the middle.)',
      'TRUNKS → DIVISIONS: each trunk splits into an anterior and a posterior division — six divisions total. Anterior divisions carry flexor-biased fibres, posterior divisions extensor-biased fibres.',
      'DIVISIONS → CORDS: the three posterior divisions join = POSTERIOR cord. Upper and middle anterior divisions = LATERAL cord. Lower anterior division = MEDIAL cord. Cords wrap the axillary artery and take their names from their position around it.',
      'CORDS → BRANCHES: lateral cord → musculocutaneous + lateral root of median; posterior cord → axillary + radial; medial cord → ulnar + medial root of median. The two median roots embrace the artery and unite — forming the classic "M" shape.',
      'Read lesions in reverse: a "waiter\u2019s tip" posture (arm adducted, extended, forearm pronated) means upper-trunk roots C5–C6 (Erb\u2019s palsy — birth stretch, shoulder dystocia); a claw hand with Horner features means lower-trunk C8–T1 (Klumpke\u2019s palsy).',
      'Why the re-routing at all: fibres for one movement come from several roots, so the plexus is the mixing desk that bundles them into purpose-built nerves — that is also why a single root injury spares individual nerves, and a single nerve injury points to one cord or branch.',
    ],
    normal: 'The plexus spans from the neck (roots between scalene muscles) over the first rib, behind the clavicle, into the axilla (cords around the axillary artery). Cutaneous supply overlaps segmentally — dermatomes run C5 (lateral shoulder/regimental badge) → C6 (thumb) → C7 (middle finger) → C8 (little finger) → T1 (medial forearm).',
    mechanism: 'Nerve fibres segregate by destination as they pass distally: posterior-division fibres end in extensor muscles (radial, axillary), anterior-division fibres in flexors. This is why posterior-cord injuries (e.g. compression under the humeral head — "crutch palsy") produce a wrist-drop radial pattern.',
    mnemonics: [
      { hook: 'Rob Taylor Drinks Cold Beer', expands: 'Roots → Trunks → Divisions → Cords → Branches — the five plexus stages in order.' },
      { hook: 'The "M" of the median', expands: 'Lateral root (lateral cord) + medial root (medial cord) of the median nerve embrace the axillary artery — spot the M on any dissection photo and you have found the cords\u2019 terminals.' },
    ],
    differentials: [
      { name: 'Erb\u2019s palsy (C5–C6, upper trunk)', key: 'waiter\u2019s tip posture — shoulder adducted & internally rotated, elbow extended, forearm pronated; from birth traction or shoulder trauma' },
      { name: 'Klumpke\u2019s palsy (C8–T1, lower trunk)', key: 'claw hand (intrinsic hand muscles paralysed); consider in upward traction of the arm; ± Horner syndrome when T1 sympathetic fibres are involved' },
      { name: 'Radial nerve compression (spiral groove)', key: 'wrist-drop after sleeping on the arm ("Saturday-night palsy") — a terminal-branch problem, not a trunk lesion' },
    ],
    mistakes: [
      'Counting divisions wrong: 5 roots → 3 trunks → 6 divisions → 3 cords → 5 terminal branches. Students forget it widens to 6 in the middle.',
      'Placing the long thoracic nerve "in" the plexus: it comes off the ROOTS (C5–C7) and innervates serratus anterior — injury there causes winged scapula, and it is spared in most plexus lesions distal to the roots.',
      'Assuming every hand weakness is ulnar: median nerve loss kills thumb opposition (ape hand), ulnar loss kills interossei (claw) — the two claws look different.',
    ],
    examRelevance: 'Asked three ways: diagram-labelling (name the stage between divisions and cords), lesion-localisation vignettes (waiter\u2019s tip vs claw vs wrist-drop), and nerve-injury pairings (winged scapula = long thoracic; regimental-badge numbness = axillary).',
    clinicalRelevance: 'Shoulder dystocia during delivery stretches the upper trunk — the classic obstetric Erb\u2019s story. Deep axillary surgery and central-line placement risk cord injury. Klumpke\u2019s in an adult with a swinging fall onto the outstretched arm deserves the same attention as the fracture itself.',
    analogies: [
      'The plexus is a railway junction: five incoming lines merge, cars are re-sorted, and five outgoing lines each carry a mixed destination set.',
      'A plexus lesion is a power-cut at the junction, not the house — everything downstream of that junction goes dark together.',
    ],
    crossLinks: [
      { label: 'Upper-limb fractures (Orthopaedics)', why: 'Humeral shaft and shoulder injuries are the common adult causes of terminal-branch palsies.', subject: 'Orthopaedics' },
      { label: 'Colles\u2019 fracture (Orthopaedics)', why: 'Distal radius trauma sits in median-nerve territory — the same limb, one level distal.', subject: 'Orthopaedics' },
      { label: 'Congenital anomalies (Embryology)', why: 'The plexus grows with the limb bud; positional anomalies follow the same segment logic (C5–T1).', subject: 'Embryology' },
    ],
    reasoning: [
      { stage: 'symptom', label: 'New claw hand after a fall', detail: 'intrinsic hand weakness, ± numbness medial forearm' },
      { stage: 'mechanism', label: 'Lower-trunk pattern', detail: 'C8–T1 fibres serve the intrinsic hand muscles via ulnar nerve' },
      { stage: 'differential', label: 'Klumpke palsy vs ulnar mononeuropathy', detail: 'whole-lower-trunk loss (medial forearm sensory loss, ± Horner) vs isolated ulnar deficit' },
      { stage: 'investigation', label: 'Localise', detail: 'clinical examination ± imaging of the plexus/neck; EMG studies characterise the level' },
      { stage: 'diagnosis', label: 'Lower brachial plexus injury', detail: 'history of traction + C8–T1 pattern' },
      { stage: 'management', label: 'Principles', detail: 'physiotherapy to prevent contractures; document neurological baseline; refer for nerve-injury evaluation — verify against local protocols' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — peripheral nervous system and nerve plexuses'),
      ocwRef('Human anatomy course materials on the upper limb'),
      nmcRef('CBME competencies on upper-limb regional anatomy'),
    ],
  },

  {
    id: 'c-femoral',
    name: 'Femoral Triangle',
    kind: 'structure',
    oneLiner: 'The femoral triangle is a flat pyramid in the upper thigh that funnels the femoral nerve, artery and vein from the abdomen into the leg.',
    whyMatters: 'It is where you feel the femoral pulse, insert central lines, and explain femoral hernias — a pocket-sized anatomy lesson with direct bedside and emergency use.',
    explain30s: 'Under the fold of the groin (the inguinal ligament) lies a triangular space. Its base is the inguinal ligament above; its two sides are the sartorius muscle (lateral) and adductor longus (medial). Inside, from lateral to medial, run the femoral Nerve, Artery, Vein and Empty space with Lymph nodes — NAVEL. The artery is the landmark: the pulse tells you where you are for everything else. The femoral sheath wraps artery, vein and canal — but NOT the nerve, which matters for nerve-sparing approaches.',
    eli5: 'Think of a highway toll plaza just as the road leaves the city (pelvis) into the countryside (leg). Three vehicles pass in strict lane order: the nerve rides free outside the toll booth (outside the sheath), the artery and vein queue inside it. Knowing the lane order — nerve, artery, vein, from outside in — is the difference between hitting a pulse and hitting a nerve when you insert a needle.',
    firstPrinciples: [
      'Boundaries: superior/base = inguinal ligament; lateral = medial border of sartorius; medial = medial border of adductor longus; floor = gutter of iliopsoas and pectineus; roof = fascia lata (with saphenous opening).',
      'Contents lateral → medial — NAVEL: femoral Nerve, Artery, Vein, Empty space (femoral canal), Lymphatics (including Cloquet\u2019s node deep in the canal).',
      'The femoral SHEATH is fascial continuation from the abdomen enclosing artery, vein and canal — the nerve lies OUTSIDE the sheath, on the iliacus fascia. A sheath line is not a nerve line.',
      'Femoral canal: the medial-most compartment of the sheath — a short dead-space that lets the vein expand. It is also the route of a FEMORAL HERNIA: bowel pushes through the canal, appearing below and lateral to the pubic tubercle, medial to the femoral vein.',
      'Why hernias here are dangerous: the canal is narrow and ringed by rigid edges, so femoral hernias strangulate often — and they are more common in females.',
      'Clinical coordinates: femoral pulse palpated at the mid-inguinal point (halfway between anterior superior iliac spine and pubic symphysis); artery is the reference for vascular access and for locating vein (medial) or nerve (lateral).',
    ],
    normal: 'Normal contents, lateral to medial: femoral nerve → artery → vein → canal (with lymphatic tissue). Great saphenous vein drains into the femoral vein at the saphenous opening (saphenous varix and groin lumps hang around here).',
    procedures: [
      {
        name: 'Femoral vascular access (educational anatomy, not a how-to)',
        what: 'The femoral vein is accessed below the inguinal ligament for central venous catheterisation when other sites are unsuitable: artery palpated, needle enters MEDIAL to it within the sheath; the nerve lies lateral and is avoided. Ultrasound guidance and institutional protocols govern actual practice.',
      },
    ],
    numbers: [
      { label: 'Order of contents', value: 'NAVEL — Nerve, Artery, Vein, Empty space, Lymphatics (lateral → medial)', note: 'the safest single memory for the groin' },
      { label: 'Femoral hernia position', value: 'below & lateral to the pubic tubercle, medial to the femoral vein', note: 'vs inguinal hernia, which lies above the inguinal ligament' },
    ],
    mistakes: [
      'Placing the nerve inside the femoral sheath — it is outside; "NAVEL" order survives even though the sheath does not include N.',
      'Calling every groin lump an inguinal hernia: a lump BELOW the inguinal ligament and medial to the femoral vein is a femoral hernia until proven otherwise — high strangulation risk.',
      'Palpating the femoral artery too laterally — the mid-inguinal point, not the midpoint of the ligament.',
    ],
    examRelevance: 'Questions come as boundary lists ("lateral wall of the femoral triangle?"), contents-in-order (NAVEL), hernia differentiation (femoral vs inguinal) and catheter-site reasoning.',
    clinicalRelevance: 'Cardiac catheterisation and emergency access historically enter via this triangle; hernia examinations always end with the question "above or below the inguinal ligament?" — the triangle decides the answer.',
    analogies: [
      'The sheath is a glove with three fingers (artery, vein, canal) — the nerve walks beside the glove, not inside it.',
      'The femoral canal is the spare seat that lets the vein swell after a big meal — and, unfortunately, also a trapdoor for bowel.',
    ],
    crossLinks: [
      { label: 'Inguinal canal (Anatomy)', why: 'The neighbouring passageway above the ligament — together they explain every groin lump.', subject: 'Anatomy' },
      { label: 'Hernias (Surgery)', why: 'Femoral vs inguinal differentiation is applied triangle anatomy.', subject: 'Surgery' },
      { label: 'Deep venous thrombosis (Medicine)', why: 'The femoral vein through this triangle is a key DVT site and Doppler landmark.', subject: 'Medicine' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 3,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — lower limb and vessels'),
      jhmiRef('Reference material on vascular access sites'),
      nmcRef('CBME competencies on lower-limb anatomy'),
    ],
  },

  {
    id: 'c2-anatomy-inguinal-canal',
    name: 'Inguinal Canal',
    kind: 'structure',
    oneLiner: 'The inguinal canal is an oblique tunnel through the lower abdominal wall that carries the spermatic cord in males (or the round ligament in females).',
    whyMatters: 'It is the anatomy behind the most common operation in general surgery: the inguinal hernia. The canal\u2019s walls and two rings decide whether a hernia is direct or indirect — a distinction examiners love and surgeons act on.',
    explain30s: 'The canal is about 4 cm long, running downward and medially from the deep inguinal ring (an opening in transversalis fascia) to the superficial ring (an opening in the external oblique aponeurosis). It has four walls: anterior — external oblique aponeurosis; posterior — transversalis fascia and conjoint tendon; roof — arching fibres of internal oblique and transversus; floor — the inguinal ligament. In males the spermatic cord travels through; in females the smaller round ligament of the uterus. The canal is an oblique flap-door: raising intra-abdominal pressure presses its walls together, which is why the oblique path protects against hernia.',
    eli5: 'Imagine pushing a rope diagonally through the layers of a folded jacket. Because the tunnel is slanted, squeezing the jacket pinches the tunnel shut — the harder you squeeze, the safer the rope. A hernia happens when the tunnel gets too big: then squeezing pushes the intestine through instead. Where the tunnel starts (deep ring) versus where a new hole appears (through the weak back wall) tells the surgeon which type of hernia it is.',
    firstPrinciples: [
      'Geometry first: ~4 cm long, angled downward-medially, lying parallel to and just above the inguinal ligament. Obliquity is the defence mechanism.',
      'Two ends: DEEP ring — hole in transversalis fascia, halfway between ASIS and pubic symphysis, LATERAL to the inferior epigastric vessels; SUPERFICIAL ring — triangular gap in the external oblique aponeurosis, above the pubic tubercle.',
      'Anterior wall: external oblique aponeurosis throughout, reinforced laterally by internal oblique fibres. Posterior wall: transversalis fascia, reinforced medially by the conjoint tendon (internal oblique + transversus).',
      'Roof: the arching lower fibres of internal oblique and transversus abdominis ("the arch"). Floor: the inguinal ligament (upturned lateral fibres forming the lacunar ligament medially).',
      'Contents (male): spermatic cord (vas deferens, testicular vessels, pampiniform plexus, lymphatics/nerves) + ilioinguinal nerve. Contents (female): round ligament of the uterus + ilioinguinal nerve.',
      'The landmark rule: INDIRECT hernias pass through the deep ring, LATERAL to the inferior epigastric vessels, following the canal\u2019s oblique track into the scrotum. DIRECT hernias push straight through the weak posterior wall, MEDIAL to the inferior epigastric vessels (through Hesselbach\u2019s triangle).',
      'Why the canal exists: in the male it is the route by which the testis descended from abdomen to scrotum in fetal life (guided by the gubernaculum) — the canal is the permanent doorway that descent left behind.',
    ],
    normal: 'Boundaries recap — A(nterior): external oblique; P(osterior): transversalis fascia + conjoint tendon; R(oof): arching fibres; F(loor): inguinal ligament. Inferior epigastric vessels run on the posterior wall and divide the direct from the indirect territories.',
    differentials: [
      { name: 'Indirect inguinal hernia', key: 'enters via deep ring, lateral to inferior epigastric vessels, can descend into scrotum; congenital flavour (patent processus vaginalis)' },
      { name: 'Direct inguinal hernia', key: 'pushes through posterior wall (Hesselbach triangle), medial to inferior epigastric vessels, rarely reaches scrotum; acquired weakness in older adults' },
      { name: 'Femoral hernia', key: 'below the inguinal ligament, medial to femoral vein — different canal entirely (see Femoral Triangle)' },
    ],
    mistakes: [
      'Saying "the deep ring is lateral to the inferior epigastric ARTERY alone" — the landmark is the inferior epigastric VESSELS; laterality decides direct vs indirect.',
      'Forgetting the conjoint tendon reinforces the posterior wall medially — the weak spot where direct hernias punch through.',
      'Believing females cannot have inguinal hernias — the canal exists (round ligament), so inguinal hernias occur in females too, just without cord contents.',
    ],
    mnemonics: [
      { hook: 'Lateral = Lat-ernal (indirect)', expands: 'Indirect hernia enters Lateral to the inferior epigastric vessels through the deep ring; Direct is Medial — two D-M pairs that solve the discrimination question.' },
    ],
    examRelevance: 'The classic anatomy-viva pair: "walls of the inguinal canal" and "direct vs indirect hernia — how do you decide?" The inferior epigastric vessels answer the second every time.',
    clinicalRelevance: 'Hernia examination always answers three questions: above/below the ligament, reducibility, and relation to the inferior epigastrics (decided at surgery). Cough impulse and deep-ring occlusion tests (control the ring → lump stays = indirect) are applied canal anatomy.',
    analogies: [
      'The oblique canal is a flap-door on a tent — pressure from inside pushes the flap shut.',
      'Hesselbach\u2019s triangle is the soft patch in a bicycle tyre — the tube bulges straight through, not along any tunnel.',
    ],
    crossLinks: [
      { label: 'Femoral triangle (Anatomy)', why: 'The other groin passage — together they localise every groin swelling.', subject: 'Anatomy' },
      { label: 'Hernia (Surgery)', why: 'Repair decisions (mesh position, ring handling) are canal anatomy applied.', subject: 'Surgery' },
      { label: 'Testicular descent (Embryology)', why: 'The canal is the track the descending testis carved; cryptorchidism and hydrocele are descent leftovers.', subject: 'Embryology' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — abdominal wall musculature'),
      ocwRef('Gross anatomy materials on the anterior abdominal wall'),
      nmcRef('CBME competencies on inguinal region anatomy'),
    ],
  },

  {
    id: 'c2-anatomy-thyroid-gland',
    name: 'Thyroid Gland — Gross Anatomy',
    kind: 'structure',
    oneLiner: 'The thyroid is a butterfly-shaped endocrine gland wrapped around the front of the trachea, whose surgery is nerve-preservation chess.',
    whyMatters: 'Two tiny nerves run beside it. Laryngeal nerve injury (hoarseness) is the classic post-thyroidectomy complication question, and the gland\u2019s blood supply explains both surgery technique and metastatic patterns.',
    explain30s: 'The gland has two lobes joined by an isthmus that lies over the 2nd–4th tracheal rings. It is invested in pre-tracheal fascia, so it moves on swallowing (a key clinical sign). Blood supply is double: superior thyroid artery (from the external carotid) and inferior thyroid artery (from the subclavian via thyrocervical trunk). Two nerves matter: the recurrent laryngeal nerve runs in the tracheo-oesophageal groove supplying most voice muscles; the external branch of the superior laryngeal nerve runs with the superior thyroid artery to tense the vocal cords. Parathyroid glands sit on its back surface.',
    eli5: 'Think of the thyroid as a bow tie on the windpipe. Two ropes pass right next to the bow tie — they are the nerves that control your voice box. One runs alongside (the recurrent laryngeal nerve, the "hoarseness nerve"), the other rides with the top blood vessel (the external superior laryngeal nerve, the "high-pitch nerve"). Surgeons learn where each rope lies because cutting one changes the voice. The gland itself moves up and down when you swallow, like a bow tie on a slide.',
    firstPrinciples: [
      'Shape & position: two lobes (each roughly 5 cm) against C5–T1, joined by an isthmus over the 2nd–4th tracheal rings; a pyramidal lobe may extend upward from the isthmus (thyroglossal-duct remnant).',
      'It is enclosed by pre-tracheal fascia, so the gland (and any lump in it) MOVES WITH SWALLOWING — the single most useful bedside sign distinguishing thyroid from other neck lumps.',
      'Arterial supply: superior thyroid artery (first branch of external carotid) to the upper pole; inferior thyroid artery (thyrocervical trunk of subclavian) to the lower pole; ~5% have a thyroidea ima artery (classic teaching).',
      'Venous drainage: superior and middle thyroid veins → internal jugular; inferior thyroid veins → brachiocephalic.',
      'Recurrent laryngeal nerve (RLN): branch of vagus; loops (right around subclavian artery, left around the aortic arch) and ascends in the tracheo-oesophageal groove, entering just behind the inferior thyroid artery\u2019s branches — supplies ALL intrinsic laryngeal muscles except cricothyroid. Injury → hoarseness; bilateral injury → airway emergency.',
      'External branch of superior laryngeal nerve (EBSLN): runs WITH the superior thyroid artery to supply cricothyroid (pitch/tension). Ligation of the superior thyroid artery close to the GLAND protects it ("ligate close on top"); the RLN is protected by ligating the inferior thyroid artery AWAY from the gland ("ligate low & far").',
      'Neighbours on the back surface: four parathyroid glands (superior more constant in position than inferior) — their preservation is why subtotal/total thyroidectomy technique matters.',
    ],
    normal: 'Adult gland weighs roughly 20–25 g. Lymphatics drain to level VI (pretracheal/paratracheal) nodes first, then lateral cervical nodes — the reason papillary carcinoma spreads first to neck nodes.',
    mechanism: 'The RLN\u2019s asymmetry explains embryology: the right nerve loops under the subclavian artery (6th arch derivative remnant logic), the left under the aortic arch — hence longer left course. A non-recurrent right RLN occurs rarely (classic teaching ≈1% on the right) with aberrant subclavian artery anatomy.',
    numbers: [
      { label: 'Isthmus level', value: 'over 2nd–4th tracheal rings', note: 'landmark for tracheostomy planning above the isthmus' },
      { label: 'Gland weight', value: '≈ 20–25 g in adults', note: 'goitre = visible/enlarged gland beyond this baseline' },
      { label: 'Non-recurrent RLN', value: 'rare (~1%, classically on the right)', note: 'associated with aberrant right subclavian artery' },
    ],
    mistakes: [
      'Ligating the superior thyroid artery away from the gland — that is where EBSLN travels; close-to-gland ligation is the protective rule.',
      'Assuming the RLN always sits behind the inferior thyroid artery in a fixed spot — anatomy varies, which is why the nerve is sought visually.',
      'Forgetting the gland moves on swallowing — a fixed "thyroid" lump raises suspicion of invasive malignancy or is simply not thyroid.',
    ],
    examRelevance: 'Asked as: blood-supply nerve pairings (which nerve travels with which artery), post-operative voice change localisation, and "why does the thyroid move with swallowing?" (pre-tracheal fascia).',
    clinicalRelevance: 'Thyroidectomy safety checks centre on the two nerves and four parathyroids; goitres extending retrosternally follow the fascia plane into the superior mediastinum.',
    analogies: [
      'The gland is a bow tie over the windpipe; the voice nerves are two electrical cables routed beside it — surgery is careful cable avoidance.',
      'Pre-tracheal fascia is a sleeve: whatever is inside the sleeve slides up when you swallow.',
    ],
    crossLinks: [
      { label: 'Thyroid hormone physiology (Physiology)', why: 'Structure first, function second — the gland\u2019s follicles are the hormone factory described there.', subject: 'Physiology' },
      { label: 'Thyroid nodule workup (Surgery)', why: 'Swallow movement, consistency and nodes decide the workup sequence.', subject: 'Surgery' },
      { label: 'Pharyngeal arch derivatives (Embryology)', why: 'The gland descends from the foramen cecum via the thyroglossal duct; the nerves\u2019 looping reflects arch-artery fate.', subject: 'Embryology' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 3,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — the endocrine system, thyroid'),
      jhmiRef('Patient education on thyroid surgery and voice changes'),
      nmcRef('CBME competencies on neck anatomy'),
    ],
  },

  {
    id: 'c2-anatomy-diaphragm-openings',
    name: 'Diaphragm — Openings & Innervation',
    kind: 'structure',
    oneLiner: 'The diaphragm is the dome-shaped primary breathing muscle, pierced by three big openings at three memorable vertebral levels.',
    whyMatters: 'The three openings (T8, T10, T12) are guaranteed-exam recall, and clinically they are the gateways through which hernias, catheters and disease spread between chest and abdomen.',
    explain30s: 'The diaphragm is a muscular sheet separating chest from abdomen, doming upward. It contracts and flattens on inspiration, sucking air into the lungs. Three major structures pass through it: the inferior vena cava at T8 (right side), the oesophagus at T10, and the aorta at T12 — with the thoracic duct and azygos vein alongside. Motor supply is entirely the phrenic nerve (C3, C4, C5), which is why high spinal cord injuries stop breathing. Referred pain from the diaphragm travels with the phrenic nerve to the shoulder tip — a classic diagnostic clue.',
    eli5: 'Picture a trampoline stretched across your chest cavity. Pull it down and the tent above gets bigger — air rushes in; let it bounce up and air squeezes out. The trampoline has three holes: one at your collarbone height (T8) for the big vein, one at T10 for the food pipe, one at T12 for the body\u2019s main artery. The mnemonic "I ate ten eggs at twelve" tells you the levels: 8, 10, 12 — vein, eggs (oesophagus), artery.',
    firstPrinciples: [
      'Structure: peripheral muscular part (sternal, costal, lumbar origins) inserting into a central tendon — the muscle pulls on its own tendon to flatten the dome.',
      'Three apertures, top to bottom: CAVAL opening at T8 (inferior vena cava + right phrenic nerve) in the central tendon; OESOPHAGEAL hiatus at T10 (oesophagus + vagal trunks) in the muscular part, right crus; AORTIC hiatus at T12 (aorta + thoracic duct ± azygos vein) behind the diaphragm, between the crura.',
      'The aortic hiatus is not truly "in" the diaphragm — the aorta passes BEHIND it, which is why aortic flow does not stop when the diaphragm contracts.',
      'The oesophageal hiatus is muscular — its squeeze acts as a pinch-valve on the oesophagus; failure of this anti-reflux mechanism is the anatomy behind sliding hiatal hernia and reflux.',
      'Nerve supply: motor = phrenic nerve ONLY (C3, C4, C5 — "C3-4-5 keeps the diaphragm alive"); sensory to central diaphragm also phrenic (→ shoulder-tip referred pain), peripheral rim via intercostal nerves.',
      'Clinical chain: irritation of central diaphragmatic peritoneum (blood, abscess, ruptured spleen) → phrenic afferents → pain felt at the SHOULDER TIP (C4 dermatome) — referred pain by shared spinal segment.',
      'Developmental logic: the diaphragm forms from the septum transversum, mesentery and body wall; incomplete closure of pleuroperitoneal membranes → congenital diaphragmatic hernia (classically left, Bochdalek) — bowel in the chest.',
    ],
    normal: 'Right dome sits slightly higher (liver below); quiet inspiration is diaphragm-first, expiration at rest is passive recoil. Openings: T8-10-12, mnemonic holds.',
    mnemonics: [
      { hook: 'I ate (8) ten eggs (10) at twelve (12)', expands: 'T8 = IVC (caval), T10 = oesophagus ("eggs"), T12 = aorta — the three diaphragm apertures in descending order.' },
      { hook: 'C3, 4, 5 keeps the diaphragm alive', expands: 'Phrenic nerve roots — the only motor supply; high cervical cord injury stops breathing.' },
    ],
    numbers: [
      { label: 'Caval opening', value: 'T8', note: 'IVC + right phrenic nerve, within central tendon' },
      { label: 'Oesophageal hiatus', value: 'T10', note: 'oesophagus + vagus nerves; muscular pinch-valve' },
      { label: 'Aortic hiatus', value: 'T12', note: 'aorta + thoracic duct; aorta passes behind the diaphragm' },
    ],
    differentials: [
      { name: 'Sliding hiatal hernia', key: 'gastro-oesophageal junction slides up through the T10 hiatus — reflux-associated, commonest type' },
      { name: 'Rolling (para-oesophageal) hernia', key: 'fundus rolls up beside a normally-placed junction — obstruction/strangulation risk without reflux' },
      { name: 'Congenital (Bochdalek) diaphragmatic hernia', key: 'posterolateral defect, classically left — neonatal respiratory distress with bowel sounds in chest' },
    ],
    mistakes: [
      'Placing the IVC opening at T10 — "I ate (8)" anchors the vein at T8; mixing caval and oesophageal levels is the classic error.',
      'Saying phrenic nerve carries sensory supply to the WHOLE diaphragm — only the central part; the rim is intercostal (which is why pleurisy at the rim gives chest-wall, not shoulder, pain).',
      'Forgetting the aorta is behind, not through, the diaphragm — thoracic duct and azygos accompany it at T12.',
    ],
    examRelevance: 'Direct recall (levels + contents), referred-shoulder-pain reasoning (splenic rupture stories), and clinical anatomy of hiatal hernia vs reflux.',
    clinicalRelevance: 'A Kehr\u2019s sign (left shoulder-tip pain) in a trauma patient is diaphragmatic irritation — think splenic bleed. Chest X-rays after stabbing should include the diaphragm contours; penetrating injuries below the nipple line can still enter the abdomen.',
    analogies: [
      'The diaphragm is a trampoline with three fixed holes — bounce controls airflow, holes route the plumbing.',
      'The oesophageal hiatus is a muscular hand-squeeze on a drinking straw — when the grip fails, the straw slides up.',
    ],
    crossLinks: [
      { label: 'Respiratory mechanics (Physiology)', why: 'Contraction pressure changes are the physiology half of this anatomy.', subject: 'Physiology' },
      { label: 'Referred pain & diaphragmatic irritation (Surgery)', why: 'Shoulder-tip pain localises intra-abdominal bleeding.', subject: 'Surgery' },
      { label: 'Congenital diaphragmatic hernia (Paediatrics)', why: 'Developmental failure of the same structure.', subject: 'Paediatrics' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 3,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — respiratory system and the diaphragm'),
      ocwRef('Gross anatomy materials on thoracic wall and diaphragm'),
      nmcRef('CBME competencies on thoracic anatomy'),
    ],
  },

  // ═══════════════════════════ PHYSIOLOGY (7) ═════════════════════════════

  {
    id: 'c-cardcycle',
    name: 'Cardiac Cycle',
    kind: 'process',
    oneLiner: 'The cardiac cycle is one full heartbeat — a fixed sequence of filling, contraction, ejection and relaxation that turns pressure changes into blood flow.',
    whyMatters: 'It is the Rosetta stone of cardiology: heart sounds, murmurs, ECG waves, jugular pulses and the pressure–volume loop are all the same story told through different instruments. Master it and every valve or heart-failure question becomes physiology instead of memorisation.',
    explain30s: 'One beat has two halves: systole (contraction, blood ejected) and diastole (relaxation, blood fills). Ventricular filling happens mostly passively right after the AV valves open; atrial contraction tops up the last ~20–25%. Then the AV valves shut (S1), pressure builds with valves closed (isovolumetric contraction), the semilunar valves open and blood ejects. Pressure falls, semilunar valves close (S2), and the ventricle relaxes with all valves shut (isovolumetric relaxation) until filling restarts. The ECG runs slightly ahead: P wave before atrial contraction, QRS before ventricular contraction, T wave during relaxation.',
    eli5: 'Imagine a hand pump with two one-way doors. First you relax and water flows in (filling). Then you squeeze the handle — the inlet door slams shut (that bang is S1). Pressure builds for a moment with both doors closed, then the outlet door bursts open and water shoots out (ejection). As you relax, the outlet door slams shut (S2), then the whole pump refills. The ECG is the electrical order-paper that arrives slightly before each muscle action.',
    firstPrinciples: [
      'Rule one: valves open and close because of PRESSURE GRADIENTS, never because muscles pull them — every phase follows from which side of each valve has higher pressure.',
      'Phase 1 — Ventricular filling (diastole): AV (mitral/tricuspid) valves open; passive filling produces the E–wave of flow, then atrial contraction ("atrial kick") adds the last ~20–25% of volume.',
      'Phase 2 — Isovolumetric contraction (systole begins): QRS fires, ventricle contracts, LV pressure exceeds atrial pressure → AV valves close = S1. All valves are shut for ~a few hundredths of a second; volume unchanged, pressure rockets.',
      'Phase 3 — Ejection: LV pressure exceeds aortic pressure (~80 mmHg) → aortic valve opens → stroke volume leaves; aortic pressure peaks (~120 mmHg).',
      'Phase 4 — Isovolumetric relaxation: ventricle repolarises (T wave), pressure falls below aortic → aortic valve closes = S2 (dicrotic notch on the aortic trace). All valves shut again; volume is minimal (end-systolic).',
      'Phase 5 — back to filling: LV pressure falls below atrial → mitral opens → rapid passive filling. Cycle length at 75 bpm ≈ 0.8 s: systole ~0.3 s, diastole ~0.5 s.',
      'Read everything off one diagram: the Wiggers diagram lines up pressures, volumes, valve sounds and ECG — every exam question about S1/S2 timing, murmur timing or JVP waves is a cell in that table.',
    ],
    normal: 'Classic teaching values: end-diastolic volume ≈ 120 mL, end-systolic ≈ 50 mL, stroke volume ≈ 70 mL, ejection fraction 55–70%, cardiac output ≈ 5 L/min at rest (HR × SV). S1 = AV-valve closure (start of systole); S2 = semilunar closure (start of diastole).',
    mechanism: 'The pressure–volume loop encodes the whole cycle: the bottom edge is filling (volume up, pressure low), the right edge is isovolumetric contraction (pressure up, volume fixed), the top edge is ejection (volume down, pressure up then down), the left edge is isovolumetric relaxation. Loop area = external work. Preload shifts the right edge rightward, afterload the top edge upward — failure states deform the loop shape, not the logic.',
    numbers: [
      { label: 'End-diastolic / end-systolic volume', value: '≈ 120 mL / ≈ 50 mL', note: 'the difference is stroke volume ≈ 70 mL' },
      { label: 'Ejection fraction', value: '55–70%', note: 'the number heart-failure classification hangs on (HFrEF vs HFpEF)' },
      { label: 'Cardiac output', value: '≈ 5 L/min at rest', note: 'CO = HR × SV; rises several-fold in exercise' },
      { label: 'Cycle timing at ~75 bpm', value: '≈ 0.8 s (systole ~0.3 s, diastole ~0.5 s)', note: 'faster hearts shorten diastole first — why tachycardia compromises coronary filling' },
    ],
    mnemonics: [
      { hook: '"Systole Squeezes, S1 Sounds"', expands: 'AV valves close as systole BEGINS (S1); semilunars close as systole ENDS (S2) — "lub-dub" maps to isovolumetric contraction and relaxation bookends.' },
    ],
    mistakes: [
      'Saying S2 is "aortic closure only" — S2 is aortic + pulmonary; the split you hear physiologically is the slight timing difference (wider on inspiration).',
      'Believing atrial contraction provides most filling — at rest it tops up only about a quarter; in tachycardia its share grows.',
      'Reading murmurs without phase logic: systolic murmurs sit between S1 and S2, diastolic between S2 and the next S1 — phase first, valve second.',
    ],
    examRelevance: 'Asked as heart-sound timing, phase-ordering ("what is happening during isovolumetric contraction?"), pressure-volume loop interpretation and ECG-to-mechanical-event matching (P→atrial kick, QRS→S1, T→S2).',
    clinicalRelevance: 'Murmur timing, JVP wave reading (a before S1, v around S2) and echo reports all speak cycle language. In atrial fibrillation the atrial kick is lost — the same stroke volume now depends purely on passive filling.',
    analogies: [
      'The heart is a two-door pump: inlet and outlet doors slam at different pressures — S1 and S2 are the door-sounds, and the whole cycle is the pump handle\u2019s rhythm.',
      'The Wiggers diagram is a musical score: pressures, volumes, valves and ECG are four instruments playing the same bar in sync.',
    ],
    crossLinks: [
      { label: 'Cardiac Action Potential & Conduction (Physiology)', why: 'The electrical events drive the mechanical phases — QRS precedes S1 by a beat-fraction.', subject: 'Physiology' },
      { label: 'Heart chambers & valves (Anatomy)', why: 'The valves whose opening/closing defines each phase live here.', subject: 'Anatomy' },
      { label: 'Heart failure (Medicine)', why: 'Failure is the same cycle with worse pressures — EF and congestion come from this frame.', subject: 'Medicine' },
    ],
    global: [
      {
        region: 'India',
        training: 'In the MBBS curriculum, cardiac-cycle physiology is taught in year 1 and re-tested practically during clinical postings (auscultation sign-offs), with NEET-PG continuing to test heart-sound timing and Wiggers-based reasoning.',
        note: 'Concept content is universal; the difference is when and how the skill is certified.',
      },
      {
        region: 'United States',
        training: 'US students typically meet the cardiac cycle in undergraduate physiology, then again in pre-clinical medical school modules before Step 1, which tests the pressure–volume loop and valvular timing heavily.',
        note: 'Same science, sequenced around a different licensing exam structure.',
      },
      {
        region: 'United Kingdom',
        training: 'UK curricula integrate the cardiac cycle early within cardiorespiratory modules; OSCE-style auscultation stations test the S1/S2 logic at the bedside.',
        note: 'Integrated curricula present the same content in system-based blocks rather than subject-based ones.',
      },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — cardiac cycle and heart sounds'),
      hmxRef('HMX physiology content on cardiovascular dynamics'),
      ncbiRef('Review literature on the cardiac cycle and pressure–volume analysis'),
      nmcRef('CBME physiology competencies — cardiovascular system'),
    ],
  },

  {
    id: 'c2-physiology-cardiac-action-potential',
    name: 'Cardiac Action Potential & Conduction',
    kind: 'process',
    oneLiner: 'The heart generates its own electricity: specialised cells fire a repeatable action potential and a fixed wiring network delivers it to the working muscle.',
    whyMatters: 'Every antiarrhythmic drug, every ECG wave and every pacemaker decision is this lesson applied. Conduction speeds and pacemaker rates are among the most repeated numbers in medicine.',
    explain30s: 'Specialised cells can depolarise by themselves (automaticity). The sinoatrial (SA) node is the fastest pacemaker at 60–100/min, so it leads; the atrioventricular (AV) node (40–60/min) and His–Purkinje system (20–40/min) are slower backups. In working muscle the action potential has five phases: rapid sodium upstroke (0), brief potassium outflow (1), a calcium-driven plateau (2), potassium-driven repolarisation (3), and a stable resting phase (4). The AV node deliberately delays the impulse ~0.1 s so atria empty before ventricles contract. The plateau is what makes cardiac muscle unable to tetanise.',
    eli5: 'Think of the heart as a building with its own power company. One generator (the SA node) fires fastest, so it sets the pace; two backup generators sit downstream, slower but ready. Wires (special conducting fibres) carry the signal to every room with deliberate pause at the junction box (AV node) so the upstairs finishes filling before the downstairs starts pumping. Each heartbeat is one electric pulse making muscle cells admit calcium, hold a beat (plateau), then reset — a rhythm that never rests.',
    firstPrinciples: [
      'Automaticity: some cells leak positive ions toward threshold during rest (phase 4 slope). Fastest slope wins the race — the SA node normally leads because its phase-4 depolarisation is steepest (funny current, I_f, plus calcium).',
      'Pacemaker hierarchy with classic rates: SA node 60–100/min; AV node/junctional 40–60/min; His–Purkinje/ventricular 20–40/min. If the SA fails, the next-fastest site takes over — slower.',
      'Working (ventricular) action potential phases: 0 = rapid Na⁺ upstroke (depolarisation); 1 = transient K⁺ out (notch); 2 = plateau via Ca²⁺ in (L-type channels) balanced by K⁺ out; 3 = K⁺-driven repolarisation; 4 = stable rest until the next impulse.',
      'Nodal action potentials differ: no fast Na upstroke — Ca²⁺ does phase 0 and phase 4 rises spontaneously; this makes nodal tissue slower-conducting and calcium-channel-blocker sensitive.',
      'The conduction path: SA node → atrial pathways → AV node (deliberate ~0.1 s delay: atria finish emptying) → bundle of His → right and left bundle branches → Purkinje fibres → ventricular myocardium from apex upward.',
      'The plateau (phase 2) is why cardiac muscle cannot be tetanised: the long refractory period outlasts the twitch, forcing every beat to be separate — you could not survive a fused, contracted heart.',
      'ECG mapping: P wave = atrial depolarisation; PR = AV delay; QRS = ventricular depolarisation (fast Na); QT = full ventricular electrical systole; T = repolarisation. Drugs and electrolytes bend specific phases (e.g. hyperkalaemia flattens phase 3 speed → peaked T waves).',
    ],
    normal: 'Classic conduction-rate teaching values: SA 60–100/min, AV junction 40–60/min, ventricular/His–Purkinje 20–40/min. AV conduction delay ≈ 0.1 s. Ventricular action potential duration ≈ 200–300 ms at resting heart rates.',
    mechanism: 'Phase 0 speed (dV/dt) sets conduction velocity: fast-Na tissue conducts metres/second; calcium-dependent nodal tissue conducts slowly — which is why re-entry circuits love nodal slow pathways. Refractoriness follows the plateau: absolute (phase 0–2) then relative (phase 3), the substrate antiarrhythmics lengthen (class III) or shorten.',
    numbers: [
      { label: 'SA node rate', value: '60–100/min', note: 'normal sinus rhythm definition' },
      { label: 'AV junctional rate', value: '40–60/min', note: 'the backup pacemaker when the SA fails' },
      { label: 'Ventricular/His–Purkinje rate', value: '20–40/min', note: 'last-line pacemaker — idioventricular rhythm' },
      { label: 'AV nodal delay', value: '≈ 0.1 s', note: 'time for atrial contraction to finish before ventricular systole begins' },
    ],
    differentials: [
      { name: 'Sinus rhythm', key: 'P before every QRS, rate 60–100, P follows one path — the normal hierarchy in action' },
      { name: 'Atrial fibrillation', key: 'no organised atrial depolarisation — irregularly irregular ventricle responds to whatever the AV node lets through' },
      { name: 'Complete heart block', key: 'atria and ventricles beat independently — ventricular escape at junctional/ventricular backup rates' },
    ],
    mistakes: [
      'Reversing pacemaker rates — SA 60–100 is the FASTEST; backups are slower, not faster.',
      'Assuming the AV node delays on purpose via valves or muscle — it is the node\u2019s slow calcium-based conduction itself that creates the delay.',
      'Treating all phases as sodium-driven: only non-nodal tissue uses fast Na⁺ for phase 0; nodal tissue uses Ca²⁺ — the reason class IV (calcium-channel) drugs act on the AV node.',
    ],
    examRelevance: 'Guaranteed number questions (SA/AV/ventricular rates), phase-drug matching (class I blocks Na phase 0, class II β-blockade slows SA/AV, class III prolongs phase 3, class IV blocks nodal Ca²⁺) and ECG-wave to phase mapping.',
    clinicalRelevance: 'Hyperkalaemia quietens phase 3 and phase 0 — peaked T waves, widening QRS. Digoxin raises vagal tone at the AV node. Pacemakers exist to replace exactly the hierarchy described above when it fails.',
    verifyNote: 'Drug classing and thresholds are teaching values — always verify against current guidelines and local protocols before clinical use.',
    analogies: [
      'Pacemakers are generators in a chain: fastest one runs the building; if it dies, a slower one takes over — never faster.',
      'The AV node is a speed bump placed on purpose so the upstairs (atria) finishes its job before the downstairs (ventricles) starts.',
    ],
    crossLinks: [
      { label: 'Cardiac Cycle (Physiology)', why: 'Electrical phases precede mechanical phases — QRS fires just before S1.', subject: 'Physiology' },
      { label: 'Antiarrhythmic drug classes (Pharmacology)', why: 'Class I–IV map directly onto phases 0, 4/SA-AV, 3 and nodal calcium.', subject: 'Pharmacology' },
      { label: 'ECG interpretation (Investigation)', why: 'Every ECG wave is one of these phases seen from the skin.', subject: 'Investigation' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — cardiac muscle and electrical activity'),
      hmxRef('HMX physiology content on cardiac electrophysiology'),
      ncbiRef('Review literature on cardiac conduction and arrhythmia mechanisms'),
    ],
  },

  {
    id: 'c2-physiology-respiration-gas-exchange',
    name: 'Respiratory Mechanics & Gas Exchange',
    kind: 'process',
    oneLiner: 'Breathing is a pressure story — the diaphragm changes chest volume, air follows pressure, and gases cross the alveolar wall down their own concentration gradients.',
    whyMatters: 'Spirometry reports, ventilator settings and hypoxaemia workups are all this lesson: mechanics explains obstructive vs restrictive patterns, and gas-exchange logic explains why oxygen helps some patients and not others.',
    explain30s: 'Inspiration is active: the diaphragm contracts and flattens, chest volume rises, pressure inside falls below atmospheric, air flows in. Quiet expiration is passive: elastic recoil pushes air out. Airflow meets resistance; disease narrows airways (obstructive) or stiffens/limits the chest-lung system (restrictive), and spirometry separates them by the FEV1/FVC ratio. In the alveoli, oxygen diffuses into blood and carbon dioxide out, driven purely by partial-pressure differences across a paper-thin membrane — perfusion and ventilation must match for this to work efficiently.',
    eli5: 'Think of the lung as a sponge in a sealed jar with one tube. Pull the jar\u2019s floor down (the diaphragm) and the sponge stretches — low pressure sucks air in. Let go, the sponge snaps back and air exits. The sponge\u2019s bubbles are alveoli: thin wet walls where oxygen hops into blood and carbon dioxide hops out, like exchanging passengers through a platform gate — each gas walks down its own crowded-to-empty gradient. Block the tube and the sponge cannot fill; stiffen the sponge and it barely stretches — those are obstructive and restrictive disease.',
    firstPrinciples: [
      'Boyle\u2019s law drives ventilation: volume up → pressure down → air in. The diaphragm (plus intercostals) is the volume machine; the pleural seal couples lung to chest wall.',
      'Quiet expiration is passive elastic recoil; forced expiration recruits abdominal and internal intercostal muscles. No muscle "pulls air in" — pressure does.',
      'Surface tension in alveoli would collapse small ones (Laplace law); surfactant from type II pneumocytes lowers surface tension — its absence (premature babies) is neonatal respiratory distress syndrome.',
      'Compliance = how easily the lung stretches. Fibrosis lowers compliance (stiff lung, restrictive); emphysema raises it (floppy lung, easy to inflate, hard to exhale — recoil lost).',
      'Obstructive vs restrictive, one number: FEV1/FVC. Obstruction (asthma, COPD) traps air → ratio falls (≈ <0.7 classically). Restriction (fibrosis, chest-wall disease) lowers BOTH volumes → ratio normal or high.',
      'Gas exchange obeys Fick\u2019s law: diffusion ∝ (area × solubility × gradient) ÷ membrane thickness. Emphysema removes area; fibrosis thickens the membrane; high altitude shrinks the gradient.',
      'Efficiency needs matching: alveoli well-ventilated but poorly perfused = wasted ventilation (dead space); perfused but not ventilated = shunt (blood leaves without oxygen). V/Q mismatch is the commonest cause of hypoxaemia — oxygen usually helps it.',
    ],
    normal: 'Classic teaching values: tidal volume ≈ 500 mL; respiratory rate 12–16/min; anatomical dead space ≈ 150 mL; arterial SpO₂ 95–100%; normal FEV1/FVC ≈ 0.75–0.80 in a young adult. Alveolar PO₂ ≈ 100 mmHg, mixed venous PO₂ ≈ 40 mmHg drive oxygen diffusion.',
    mechanism: 'Most oxygen travels bound to haemoglobin (each gram carries ~1.34 mL O₂ — classic teaching); the sigmoid dissociation curve keeps loading high in lungs and unloading high in tissues. CO₂ travels mostly as bicarbonate (carbonic anhydrase) — the Haldane/Bohr effects couple the two gases so unloading of one helps the other.',
    numbers: [
      { label: 'Tidal volume', value: '≈ 500 mL', note: 'normal quiet breath' },
      { label: 'Respiratory rate', value: '12–16/min at rest', note: 'tachypnoea threshold varies with context but rests below ~20' },
      { label: 'Anatomical dead space', value: '≈ 150 mL', note: 'air that is ventilated but never reaches alveoli' },
      { label: 'FEV1/FVC (young adult)', value: '≈ 0.75–0.80', note: 'falls in obstruction; preserved/raised in restriction' },
    ],
    differentials: [
      { name: 'Obstructive pattern (asthma, COPD)', key: 'FEV1 falls more than FVC → ratio <0.7; air trapping, ↑ TLC in emphysema' },
      { name: 'Restrictive pattern (fibrosis, chest wall)', key: 'both FEV1 and FVC fall together → ratio normal/high; stiff lungs, low TLC' },
      { name: 'Shunt vs dead space', key: 'perfused-but-not-ventilated (shunt) vs ventilated-but-not-perfused (dead space) — opposite V/Q failures, opposite responses to oxygen' },
    ],
    mistakes: [
      'Saying "we breathe in because the lungs pull" — the diaphragm changes VOLUME; pressure gradients do the rest.',
      'Reading a ratio <0.7 as restrictive — low ratio is the obstructive signature; restriction preserves or raises it.',
      'Assuming 100% oxygen fixes every hypoxaemia — shunt blood never meets the alveolus, so added oxygen helps far less than in V/Q mismatch.',
    ],
    examRelevance: 'PFT-table interpretation (obstructive vs restrictive), surfactant/prematurity logic, altitude physiology, and "why is this patient hypoxic" V/Q reasoning are recurring formats.',
    clinicalRelevance: 'Auscultation, CXR patterns and spirometry all encode mechanics; ventilator management (PEEP/recruitment) is compliance and V/Q thinking at the bedside.',
    analogies: [
      'The lung is a sponge in a sealed jar — pull the floor, air enters; release, air leaves.',
      'The alveolar membrane is a station platform: oxygen and CO₂ each board the train (blood) down their own gradient — thinner platform, more trains, better boarding.',
    ],
    crossLinks: [
      { label: 'Diaphragm openings & innervation (Anatomy)', why: 'The muscle that changes chest volume is described there.', subject: 'Anatomy' },
      { label: 'Epithelial tissue (Histology)', why: 'Type I/II pneumocytes are the exchange and surfactant cells.', subject: 'Histology' },
      { label: 'Asthma & COPD (Medicine)', why: 'Obstructive spirometry logic is this lesson applied.', subject: 'Medicine' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — respiratory system mechanics and gas exchange'),
      ocwRef('Course materials on respiratory physiology'),
      ncbiRef('Review literature on ventilation–perfusion matching'),
      nmcRef('CBME physiology competencies — respiratory system'),
    ],
  },

  {
    id: 'c-raas',
    name: 'Renin-Angiotensin-Aldosterone System',
    kind: 'physiology',
    oneLiner: 'RAAS is the body\u2019s blood-pressure rescue chain: the kidney senses low perfusion, and a hormone cascade restores volume and vessel tone within minutes to days.',
    whyMatters: 'RAAS sits at the crossroads of renal physiology, hypertension, heart failure and pharmacology — ACE inhibitors, ARBs, spironolactone and sacubitril all act on pieces of this cascade. Understand it once and four drug classes explain themselves.',
    explain30s: 'When renal perfusion falls, juxtaglomerular cells release renin. Renin clips angiotensinogen (from the liver) into angiotensin I; ACE (abundant in lung endothelium) converts it to angiotensin II — the star of the show. Angiotensin II constricts vessels (raising pressure fast), triggers aldosterone from the adrenal cortex (sodium and water retention, potassium excretion — slower, volume-based), stimulates ADH and thirst, and directly remodels heart and vessels when overactive. The system is a rescue chain designed for haemorrhage; in modern chronic disease it fires when it should not, which is exactly why blocking it treats hypertension and heart failure.',
    eli5: 'Imagine the body as a city whose water pressure is dropping. The water plant (kidney) notices and calls dispatch (renin). Dispatch activates two crews: one immediately narrows all pipes so pressure rises (angiotensin II), the other starts hoarding water and salt to refill the mains (aldosterone). The system is brilliant after blood loss — and harmful when it runs for years in a city that is not bleeding. Most blood-pressure medicines are simply people cutting the dispatch phone line at different points.',
    firstPrinciples: [
      'Trigger step: juxtaglomerular cells (in the afferent arteriole wall) secrete RENIN in response to three sensors — ↓ perfusion pressure (baroreceptor), ↓ NaCl at the macula densa, and β1 sympathetic drive.',
      'Cascade: renin cleaves angiotensinogen (liver protein) → angiotensin I (inactive) → ACE (lung endothelium, also elsewhere) → ANGIOTENSIN II (active octapeptide).',
      'Fast arm — angiotensin II via AT1 receptors: systemic vasoconstriction (minutes), preferentially sparing brain and heart; plus ADH release, thirst, and potentiation of sympathetic output.',
      'Slow arm — aldosterone (adrenal zona glomerulosa): acts on the distal nephron (ENaC channels) to reabsorb Na⁺/water and secrete K⁺ — volume expansion over hours to days, at the price of potassium loss.',
      'Built-in checks: angiotensin II also drives negative feedback and, when chronically high, causes maladaptive remodelling (cardiac hypertrophy, fibrosis, glomerular pressure) — the difference between rescue and disease.',
      'Kidney\u2019s day job (context): it filters ~180 L of plasma daily into ~1.5 L of urine; RAAS is one of several regulators deciding how much of that filtrate is reclaimed.',
      'Pharmacology reads the chain like a subway map: renin inhibitors at the source, ACE inhibitors at the lung-ACE step (bradykinin builds up → cough), ARBs at the AT1 receptor (no bradykinin problem), spironolactone at the aldosterone receptor (hyperkalaemia, gynaecomastia) — each blockade site predicts its side effects.',
    ],
    normal: 'Baseline RAAS activity is low when volume is adequate. Systemic targets: maintain mean arterial pressure ≈ 70–100 mmHg; serum K⁺ 3.5–5.0 mEq/L (aldosterone lowers it). GFR ≈ 120–125 mL/min — the filtration baseline against which RAAS adjusts.',
    mechanism: 'Two receptor families split the story: AT1 (vasoconstriction, aldosterone, ADH, remodelling — the "bad" arm in chronic disease) and AT2 (opposing effects, less abundant). ACE also degrades bradykinin — ACE inhibition therefore both blocks angiotensin II formation AND preserves vasodilator bradykinin, explaining the dry cough and angioedema that ARBs largely avoid.',
    numbers: [
      { label: 'Normal serum K⁺', value: '3.5–5.0 mEq/L', note: 'aldosterone promotes K⁺ secretion — RAAS overactivity/hypoaldosteronism shifts this range' },
      { label: 'GFR (normal adult)', value: '≈ 120–125 mL/min', note: '≈ 180 L filtered/day, ~99% reabsorbed, ~1–1.5 L urine' },
      { label: 'MAP target (perfusion)', value: '≈ 70–100 mmHg', note: 'the pressure the rescue chain evolved to defend' },
    ],
    differentials: [
      { name: 'Primary hyperaldosteronism (Conn)', key: 'hypertension + hypokalaemia + suppressed renin — the "escapee" arm of RAAS acting alone' },
      { name: 'Renal artery stenosis', key: 'renin-driven secondary hypertension — the trigger step stuck ON; ACEi responsiveness and risk' },
      { name: 'SIADH (comparison)', key: 'water retention without the angiotensin/aldosterone arms — hyponatraemia instead of hypertension' },
    ],
    mistakes: [
      'Placing ACE in the kidney — ACE is classically taught in LUNG endothelium (hence ACE-inhibitor cough); renin is the kidney\u2019s enzyme.',
      'Forgetting aldosterone costs potassium: any RAAS blockade (ACEi/ARB/spironolactone) raises K⁺ — the monitoring step students skip.',
      'Thinking RAAS is only about pressure: its chronic arm (remodelling, fibrosis) is why the drugs save lives in heart failure beyond BP alone.',
    ],
    examRelevance: 'The most connected pathway in NEET-PG-style testing: mechanism questions (which step does each drug block?), side-effect vignettes (cough, angioedema, hyperkalaemia, gynaecomastia), and physiology chains (renin in renal artery stenosis, aldosterone in Conn).',
    clinicalRelevance: 'Hypertension first-line therapy, HFrEF pillar drugs, diabetic nephropathy protection and peri-operative ACEi decisions all trace to this cascade. Monitoring pattern is uniform: creatinine and potassium after starting any RAAS blocker.',
    verifyNote: 'Educational physiology — drug thresholds and targets vary by guideline and patient; verify against current standards.',
    analogies: [
      'RAAS is a rescue chain: sensor (JG cells) → dispatcher (renin) → field commander (angiotensin II) → quartermaster (aldosterone).',
      'Each antihypertensive cuts one link of the chain — the side effects are what happens when the chain\u2019s other jobs lose their signal too.',
    ],
    crossLinks: [
      { label: 'ACE inhibitors & ARBs (Pharmacology)', why: 'Two blockade sites on this same cascade — mechanism and side effects follow.', subject: 'Pharmacology' },
      { label: 'Diuretics (Pharmacology)', why: 'Spironolactone is aldosterone\u2019s receptor rival; loop/thiazide effects ride the nephron RAAS acts on.', subject: 'Pharmacology' },
      { label: 'Blood Pressure Regulation (Physiology)', why: 'RAAS is the long-term arm; baroreflexes are the short-term arm of the same defence.', subject: 'Physiology' },
      { label: 'Heart failure (Medicine)', why: 'Chronic RAAS activation drives remodelling — blocking it is a mortality pillar.', subject: 'Medicine' },
    ],
    reasoning: [
      { stage: 'symptom', label: 'Resistant hypertension with low K⁺', detail: 'BP persistently high despite usual therapy; K⁺ below normal range' },
      { stage: 'mechanism', label: 'Aldosterone excess', detail: 'Na⁺/water retention raises volume; K⁺ secretion lowers serum potassium' },
      { stage: 'differential', label: 'Conn vs renovascular vs other', detail: 'renin LOW favours primary hyperaldosteronism; renin HIGH favours renal artery stenosis' },
      { stage: 'investigation', label: 'Renin & aldosterone ratio', detail: 'plus imaging if renovascular disease suspected' },
      { stage: 'diagnosis', label: 'RAAS-driven hypertension', detail: 'pattern + biochemistry' },
      { stage: 'management', label: 'Principles', detail: 'block the dominant arm (MR antagonist / renin-angiotensin blockade); monitor K⁺ and creatinine — verify against current guidelines' },
    ],
    global: [
      {
        region: 'India',
        delivery: 'India\u2019s national NCD programme screens for hypertension at primary health centres and wellness centres, where first-line antihypertensives from the RAAS/thiazide/calcium-channel families are supplied on essential-medicines lists.',
        terminology: ['NP-NCD — National Programme for Prevention & Control of Non-Communicable Diseases'],
        note: 'Same physiology; the access pathway differs by health system.',
      },
      {
        region: 'WHO/Global',
        delivery: 'The WHO Model List of Essential Medicines includes several antihypertensive classes (including ACE inhibitors, ARB-class agents, calcium-channel blockers and thiazides) as the global reference frame for national lists.',
        note: 'Essential-medicines framing puts availability — not novelty — at the centre of BP control.',
      },
      {
        region: 'United States',
        delivery: 'US guidelines (ACC/AHA) position RAAS blockers first-line in hypertension with compelling indications (diabetes with albuminuria, HFrEF); electrolyte and creatinine monitoring is a standard-of-care expectation.',
        note: 'Guideline thresholds differ internationally — see the Blood Pressure Regulation lesson for the category comparison.',
      },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — the urinary system and fluid regulation'),
      hmxRef('HMX physiology content on renal endocrine function'),
      ncbiRef('Review literature on the renin-angiotensin-aldosterone system'),
      whoRef('WHO Model List of Essential Medicines — cardiovascular medicines'),
    ],
  },

  {
    id: 'c2-physiology-blood-pressure-regulation',
    name: 'Blood Pressure Regulation',
    kind: 'process',
    oneLiner: 'Blood pressure is cardiac output × vessel resistance, defended second-by-second by reflexes and day-by-day by the kidneys.',
    whyMatters: 'Hypertension is the world\u2019s most common chronic diagnosis. Its whole treatment logic — and the exam logic of BP categories — reduces to this two-timescale regulation story.',
    explain30s: 'Mean arterial pressure = cardiac output × systemic vascular resistance; anything that changes either changes BP. Short-term defence is neural: baroreceptors in the carotid sinus and aortic arch detect stretch, and reflexes adjust heart rate and vessel tone within seconds. Long-term defence is renal: the kidneys set total body volume, and RAAS plus pressure-natriuresis decide how much fluid the system holds. Chronic hypertension happens when these set-points drift — often without symptoms — which is why it is diagnosed by repeated measurement, not by how it feels.',
    eli5: 'Think of a garden hose: pressure depends on how hard the tap pushes water (cardiac output) and how pinched the nozzle is (resistance). The body has a fast guard and a slow guard. The fast guard is a tripwire in your neck arteries — stand up quickly and it tells the heart to speed up within seconds. The slow guard is the kidney\u2019s water-accountant, adjusting how much water stays in the pipes over days. High blood pressure is what happens when the slow guard keeps the tanks too full or the nozzles too tight for years.',
    firstPrinciples: [
      'The master equation: MAP = CO × SVR. Heart rate × stroke volume give CO; vessel radius (fourth-power sensitivity — small radius changes, huge resistance changes) gives SVR.',
      'Fast arm — baroreflex: stretch receptors in the carotid sinus (glossopharyngeal nerve, IX) and aortic arch (vagus, X) fire MORE when pressure rises; the medulla responds by slowing the heart and relaxing vessels — seconds-fast, faint-to-standing defence.',
      'Fast arm\u2019s limits: baroreceptors reset within days (they defend the CURRENT pressure, even if it is high) — which is why they cannot alone explain or cure chronic hypertension.',
      'Slow arm — kidneys: total body sodium/water sets long-term volume. Pressure-natriuresis (higher pressure → more Na⁺ excreted) is the kidney\u2019s built-in thermostat; RAAS, ADH and sympathetic drive modify it.',
      'Other regulators modulate the two arms: adrenaline/noradrenaline (fight-or-flight), renin-angiotensin (volume+tone), ADH (water), atrial natriuretic peptide (pressure-overload signal to shed sodium), local endothelial factors (NO vs endothelin).',
      'Measurement logic: BP is written systolic/diastolic — the pressure at ejection vs at rest between beats; Korotkoff sounds appear and disappear over brachial artery as cuff pressure crosses these two values.',
      'Category logic (why 120/80 matters): values near 120/80 mmHg sit at the boundary of "normal" in most frameworks — the US ACC/AHA 2017 guideline labels ≥130/80 stage 1 hypertension, while most other major frameworks (ESC/ESH, WHO/ISH) still define hypertension at ≥140/90 — two defensible lines on one continuous risk curve.',
    ],
    normal: 'Classic reference: ≈120/80 mmHg as the canonical "normal-ish" adult value; hypertension diagnosis requires repeated/verified elevation, not one reading. Orthostatic defence: standing briefly raises HR and maintains MAP via the baroreflex.',
    mechanism: 'Stroke volume follows preload (volume), contractility, afterload; SVR follows vessel radius via sympathetic tone and circulating vasoconstrictors. Chronically, high salt intake, obesity-driven hyperinsulinaemia, sleep apnoea sympathetic surges and RAAS overactivity all push the volume/tone arms upward — the reason lifestyle change is a first-line "drug" in every guideline.',
    numbers: [
      { label: 'Canonical reference BP', value: '≈ 120/80 mmHg', note: 'the teaching anchor; risk rises continuously above it' },
      { label: 'ACC/AHA 2017 (US) stage 1 hypertension', value: '≥ 130/80 mmHg', note: 'US category; lifestyle-first with risk-based decisions' },
      { label: 'ESC/ESH · WHO/ISH hypertension threshold', value: '≥ 140/90 mmHg', note: 'threshold used by most other major frameworks; treatment thresholds differ by guideline' },
      { label: 'MAP formula', value: 'MAP ≈ DBP + ⅓(pulse pressure)', note: 'perfusion pressure the reflexes defend' },
    ],
    differentials: [
      { name: 'Primary (essential) hypertension', key: 'no single cause; volume + tone + sympathetic contributions; ~90–95% of cases (classic teaching)' },
      { name: 'Secondary hypertension', key: 'a named driver — renal artery stenosis, primary aldosteronism, sleep apnoea, phaeochromocytoma; suspect in young age, abrupt onset, resistance' },
      { name: 'Orthostatic hypotension', key: 'baroreflex failure/volume depletion — BP falls ≥20/10 mmHg on standing (classic teaching definition)' },
    ],
    mistakes: [
      'Treating one high reading as hypertension — diagnosis is repeated, correctly-measured elevation (proper cuff size, seated, rested).',
      'Memorising 130/80 vs 140/90 as "one is wrong" — they are different guideline lines on the same continuous risk curve; know which framework a question uses.',
      'Forgetting the baroreflex RESETS: it stabilises whatever pressure exists, so chronic hypertension does not trigger constant reflex slowing.',
    ],
    examRelevance: 'Questions pair the MAP equation with reasoning ("why does aortic stenosis narrow pulse pressure?"), category-thresholds across guidelines, and secondary-hypertension screening clues.',
    clinicalRelevance: 'Every antihypertensive class is a lever on this equation: diuretics (volume), ACEi/ARB/CCB (resistance/tone & RAAS), β-blockers (rate/contractility/renin). Home BP monitoring and proper technique decide most diagnoses.',
    verifyNote: 'BP categories vary by guideline and are periodically revised — verify against the current framework applicable to your setting.',
    analogies: [
      'MAP is a hose equation: tap strength × nozzle pinch.',
      'Baroreflex is the fast tripwire guard; the kidney is the slow water-accountant — hypertension is the accountant quietly overfilling the tanks for years.',
    ],
    crossLinks: [
      { label: 'RAAS (Physiology)', why: 'The slow arm\u2019s main hormone chain — and the most prescribed drug targets in it.', subject: 'Physiology' },
      { label: 'Antihypertensive drug classes (Pharmacology)', why: 'Each class is one lever on CO × SVR.', subject: 'Pharmacology' },
      { label: 'Hypertension (Medicine)', why: 'Diagnosis thresholds, end-organ damage and treatment follow this regulation logic.', subject: 'Medicine' },
    ],
    global: [
      {
        region: 'India',
        workflow: 'Indian public-sector screening typically uses repeated office BP measurement at NCD clinics, with diagnosis confirmation protocols aligned to national and WHO/ISH-style thresholds (≥140/90 as the classical hypertension line).',
        note: 'Threshold choice follows national programme guidance — several frameworks coexist worldwide.',
      },
      {
        region: 'United States',
        diagnosis: 'ACC/AHA 2017 categories: normal <120/<80; elevated 120–129/<80; stage 1 130–139 or 80–89; stage 2 ≥140 or ≥90 mmHg.',
        note: 'The lowest major guideline threshold; emphasises earlier lifestyle intervention.',
      },
      {
        region: 'United Kingdom',
        diagnosis: 'NICE practice confirms clinic readings ≥140/90 with ambulatory/home BP confirmation (daytime average ≥135/85) before diagnosing hypertension.',
        note: 'Home/ambulatory confirmation is formalised — a workflow difference, not a physiology difference.',
      },
      {
        region: 'WHO/Global',
        screening: 'WHO highlights raised BP as a leading modifiable risk factor globally and supports population salt reduction alongside primary-care detection and affordable essential medicines.',
        note: 'Global framing emphasises measurement coverage and salt policy as much as individual thresholds.',
      },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — cardiovascular system, blood pressure and its regulation'),
      ncbiRef('Review literature on blood pressure control mechanisms'),
      whoRef('Global report on hypertension — population-level framing'),
      nmcRef('CBME physiology competencies — cardiovascular regulation'),
    ],
  },

  {
    id: 'c2-physiology-gi-secretion',
    name: 'GI Secretion',
    kind: 'process',
    oneLiner: 'The gut runs a chemical factory: six to seven litres of specialised juices a day, each secreted on a specific hormonal or nervous cue.',
    whyMatters: 'Acid blockers, pancreatic enzyme replacement and gallstone disease all make sense once you know who secretes what, into where, and on which signal — the GI system\u2019s entire pharmacology hangs on these cues.',
    explain30s: 'Saliva starts starch digestion and protects teeth, secreted on parasympathetic signals (thinking of food, chewing). The stomach makes acid (parietal cells), pepsinogen (chief cells) and intrinsic factor, driven mainly by gastrin and vagus. The pancreas secretes enzymes (amylase, lipase, proteases) and bicarbonate — enzymes on CCK\u2019s cue (fat/protein arriving), bicarbonate on secretin\u2019s (acid arriving). The liver makes bile, stored in the gallbladder and squeezed out by CCK to emulsify fat. Each secretion is matched to the meal\u2019s composition — that matching is the whole design.',
    eli5: 'Picture a car wash with different spray stations, each turned on by its own sensor. Saliva is the pre-rinse (starts digesting starch, wets food). Stomach acid is the powerful degreaser — strong enough to burn skin, which is why the stomach lines itself with protective mucus. The pancreas is the multi-tool sprayer: enzymes to cut fats, proteins and starch, plus bicarbonate soap to neutralise the acid before it damages the small intestine. Bile is the dishwasher liquid that breaks grease (fat) into tiny droplets so the enzyme spray can reach it.',
    firstPrinciples: [
      'Salivary glands (≈1–1.5 L/day): amylase (starch), lipase (minor), mucus, lysozyme; secretion is NEURAL (parasympathetic — smell/sight/chewing; sympathetic modifies flow), not hormonal.',
      'Gastric secretion (parietal cells): HCl via the H⁺/K⁺-ATPase (the proton pump — PPI target) plus intrinsic factor (B₁₂ absorption — the one gastric secretion you cannot live without); chief cells send pepsinogen (activated by acid to pepsin).',
      'Gastric control in three phases: cephalic (sight/smell — vagus), gastric (food stretch & peptides — gastrin from G cells), intestinal (feedback — acid in duodenum → secretin/somatostatin brake).',
      'Pancreatic secretion: acinar cells → enzymes (proteases as inactive precursors — trypsinogen first, activated in the gut; amylase; lipase); duct cells → HCO₃⁻. Hormonal triggers: SECRETIN = acid → bicarbonate ("secretin = soaks up acid"); CCK = fat/protein → enzyme release + gallbladder contraction.',
      'Bile: made by the liver continuously (~0.5 L/day, classic teaching), concentrated 5–10× in the gallbladder, released on CCK; bile salts emulsify fat (droplets ↓ → surface area ↑ → lipase works) and carry bilirubin/waste out.',
      'Intestinal additions: Brunner glands (duodenum — alkaline mucus protecting from acid), crypts of Lieberkühn (enzymes + mucus); the brush border finishes digestion.',
      'Big picture: total GI secretion ≈ 6–7 L/day — nearly all reabsorbed with the ~9 L of daily fluid load; the reason severe vomiting/diarrhoea dehydrates so fast is that this factory\u2019s output is now leaving the body.',
    ],
    normal: 'Classic daily volumes: saliva 1–1.5 L, gastric ~2 L, pancreatic ~1–1.5 L, bile ~0.5 L, intestinal ~1–2 L — total ≈ 6–7 L. Gastric juice pH ≈ 1.5–3.5. Duodenal pH rises toward neutral after bicarbonate delivery.',
    mechanism: 'Acid secretion logic: parietal cells respond to three stimulants — gastrin (endocrine), acetylcholine (vagal), histamine (paracrine, the amplifier). H₂-blockers and PPIs interrupt at different rungs: histamine receptor vs the pump itself. Somatostatin from D cells is the shared off-switch.',
    numbers: [
      { label: 'Total GI secretions', value: '≈ 6–7 L/day', note: 'nearly all reabsorbed — explains rapid dehydration with vomiting/diarrhoea' },
      { label: 'Gastric juice pH', value: '≈ 1.5–3.5', note: 'strong enough to activate pepsin and kill most microbes' },
      { label: 'Bile production', value: '≈ 0.5 L/day', note: 'concentrated in gallbladder between meals' },
    ],
    differentials: [
      { name: 'Peptic ulcer disease', key: 'acid-mucus imbalance — H. pylori or NSAIDs break the mucosal defence (educational framing; see clinical lessons)' },
      { name: 'Pancreatic insufficiency', key: 'missing enzyme arm — steatorrhoea (fat malabsorption), treated with enzyme replacement' },
      { name: 'Gallstone disease', key: 'bile arm blocked — pain after fatty meals when CCK squeezes an obstructed gallbladder' },
    ],
    mistakes: [
      'Saying secretin triggers enzymes — SECRETIN triggers BICARBONATE (acid neutralisation); CCK triggers ENZYMES + gallbladder. Mixing them is the classic error.',
      'Forgetting intrinsic factor: vitamin B₁₂ absorption depends on it; total gastrectomy needs lifelong B₁₂ replacement.',
      'Assuming bile digests fat itself — bile only EMULSIFIES; pancreatic lipase does the chemical cutting.',
    ],
    examRelevance: 'Hormone–secretion matching (gastrin/secretin/CCK/somatostatin — the "G, S, C, S" quartet), cell–product mapping (parietal = acid + IF, chief = pepsinogen), and drug targets (PPI at the pump, H₂ at the amplifier).',
    clinicalRelevance: 'PPIs, H₂ blockers, pancreatic enzymes and ursodeoxycholic logic all sit on this map. Post-vagotomy and pernicious-anaemia physiology test the same wiring from opposite ends.',
    analogies: [
      'The gut is a car wash: pre-rinse (saliva), degreaser (acid), neutralising soap (bicarbonate), dishwasher liquid (bile) — each switched on by its own sensor.',
      'Secretin and CCK are two different doorbells: one rings for acid ("send soap"), the other for food ("send enzymes").',
    ],
    crossLinks: [
      { label: 'Peptic ulcer disease (Medicine)', why: 'Acid–mucosa balance is the whole disease story.', subject: 'Medicine' },
      { label: 'Epithelial tissue (Histology)', why: 'Gastric pits and duodenal glands are epithelial specialisations doing this secretion.', subject: 'Histology' },
      { label: 'Gallbladder & biliary tree (Surgery)', why: 'CCK-driven bile release explains post-fatty-meal biliary colic.', subject: 'Surgery' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 3,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — the digestive system, chemical digestion and secretion'),
      ocwRef('Course materials on gastrointestinal physiology'),
      ncbiRef('Review literature on gastrointestinal secretion control'),
    ],
  },

  {
    id: 'c-thyroidphys',
    name: 'Thyroid Hormone Synthesis & Action',
    kind: 'physiology',
    oneLiner: 'The thyroid builds its hormones from iodine on a protein scaffold, releases them slowly, and every cell\u2019s metabolic thermostat responds to the result.',
    whyMatters: 'Iodine deficiency, thyroiditis, graves\u2019 disease and every antithyroid drug make sense from the synthesis steps. The TSH-based diagnostic algorithm — the most-used endocrine test in the world — stands on this axis.',
    explain30s: 'The hypothalamus sends TRH → pituitary sends TSH → the thyroid gland builds T4 and T3. The gland traps iodine (via a transporter), attaches it to tyrosine residues on thyroglobulin (TPO enzyme, peroxide-driven), couples them into T4 (mostly) and T3 (the active one), and stores hormone in colloid for weeks. T4 is the "warehouse" hormone (7-day half-life, 4× more of it released); T3 is the "working" hormone (stronger, shorter-lived, largely made by converting T4 in tissues). T3 raises basal metabolic rate, drives growth and brain development, and increases sensitivity to catecholamines. TSH is the best single blood test: high TSH = the thyroid is failing (primary hypothyroidism); low TSH = it is overactive.',
    eli5: 'Think of the thyroid as a bakery that can only make bread if it gets flour (iodine) delivered. The baker (TSH) is told to work by the manager upstairs (TRH/hypothalamus). Flour + dough scaffold (thyroglobulin) + oven enzyme (TPO) make loaves (T4). Loaves are delivered to every house, where each kitchen converts them into ready-to-eat slices (T3) that actually run the household engines. If flour runs out, the manager sends more and more baker-orders (TSH rises) and the bakery grows (goitre) but bread is still scarce.',
    firstPrinciples: [
      'Axis logic (top-down): hypothalamus → TRH → anterior pituitary → TSH → thyroid → T4/T3; T4/T3 feed back DOWN on both pituitary and hypothalamus — a thermostat loop, which is why TSH moves OPPOSITE to thyroid hormone in primary disease.',
      'Iodine handling: the gland actively traps iodide (Na⁺/I⁻ symporter) — concentration against a gradient; pregnancy and Graves\u2019 both upregulate trapping.',
      'Synthesis on a scaffold: tyrosine residues on thyroglobulin are iodinated (TPO + H₂O₂) → MIT/DIT → coupled to T4 (DIT+DIT) or T3 (MIT+DIT); the whole assembly is stored in colloid until TSH signals its re-uptake and release.',
      'T4 vs T3: the gland releases ~90–95% T4 (prohormone, half-life ~7 days) and a little T3; peripheral tissues (liver, kidney) deiodinate T4 → T3 (the ~4× more active form, half-life ~1 day) — the body\u2019s built-in buffering system.',
      'Action: T3 enters nuclei and changes gene expression → ↑ basal metabolic rate, heat production, heart rate/contractility (permissive on catecholamines — why thyrotoxicosis feels like adrenaline excess), gut motility, and — critically — brain development in infancy.',
      'Wolff–Chaikoff safety catch: a sudden large iodine load transiently BLOCKS new hormone synthesis (self-defence against iodine surge) — exploited in thyroid storm preparation; the opposite failure (autonomous tissue escaping the block) is Jod–Basedow.',
      'Why the storage matters: the gland holds weeks of pre-made hormone — so radioactive-iodine or antithyroid therapy takes weeks to work, and post-thyroiditis "release" states are self-limited.',
    ],
    normal: 'Typical laboratory TSH reference ≈ 0.4–4.0 mIU/L (ranges vary by lab and assay). Free T4 is the hormone measured for confirmation; total T4 rises in pregnancy (oestrogen ↑ binding proteins) while free T4 stays normal.',
    mechanism: 'Antithyroid drugs map onto synthesis: thionamides block TPO (iodination/coupling); high-dose iodine (Wolff–Chaikoff) blocks release; β-blockers only mute the catecholamine-sensitivity symptoms while hormone levels fall. The thyroid\u2019s iodine-trapping ability is also what radioiodine therapy exploits — the gland builds its own radiation dose.',
    numbers: [
      { label: 'TSH (typical lab range)', value: '≈ 0.4–4.0 mIU/L', note: 'varies by assay — always use the local reference; TSH is the best single screening test' },
      { label: 'T4 half-life', value: '≈ 7 days', note: 'why levothyroxine dosing changes take weeks to show' },
      { label: 'T3 half-life', value: '≈ 1 day', note: 'active form, shorter acting' },
    ],
    differentials: [
      { name: 'Primary hypothyroidism', key: 'thyroid fails → HIGH TSH (pituitary shouting at a deaf gland); Hashimoto\u2019s is the commonest cause in iodine-sufficient regions' },
      { name: 'Primary hyperthyroidism (e.g. Graves\u2019)', key: 'gland overworks autonomously → LOW/undetectable TSH, raised free T4/T3' },
      { name: 'Euthyroid changes in pregnancy', key: 'oestrogen raises TBG → total T4 up, free T4 normal, TSH mildly shifted — interpret with pregnancy-specific ranges' },
    ],
    mistakes: [
      'Reading total T4 in pregnancy/ocp users without thinking of binding proteins — free hormone is the biologically meaningful number.',
      'Expecting antithyroid drugs to work in days — pre-made colloid stores must be spent first (weeks).',
      'Reversing the TSH rule: in PRIMARY disease, TSH moves OPPOSITE to the gland\u2019s output — high TSH = failing gland, not overactive.',
    ],
    examRelevance: 'The TSH-algorithm question family (interpret the panel), synthesis-step drug matching (TPO, trapping, Wolff–Chaikoff/Jod–Basedow pair), and hormone-action vignettes (weight, heat intolerance, reflexes) are the recurring formats.',
    clinicalRelevance: 'Congenital hypothyroidism screening exists because untreated infant deficiency causes irreversible intellectual disability — the highest-stakes application of this axis. Amiodarone, lithium and iodinated contrast all perturb the same steps.',
    verifyNote: 'Reference ranges are assay-dependent and guidance evolves — verify local reference values before interpretation.',
    analogies: [
      'The axis is a thermostat loop: furnace output (T4/T3) feeds back on the dial (TSH) — measure the dial first.',
      'T4 is the warehouse loaf, T3 the fresh slice: the house (tissue) does the final conversion to taste.',
    ],
    crossLinks: [
      { label: 'Thyroid gland anatomy (Anatomy)', why: 'The factory\u2019s floor plan — follicles, blood supply and nerves at risk.', subject: 'Anatomy' },
      { label: 'Thionamides & radioiodine (Pharmacology)', why: 'Each drug is one blocked synthesis step.', subject: 'Pharmacology' },
      { label: 'Graves\u2019 disease (Medicine)', why: 'Autoimmune drive on the same axis — TSH-receptor antibodies.', subject: 'Medicine' },
    ],
    global: [
      {
        region: 'India',
        screening: 'Iodised-salt programmes (universal salt iodisation under the National Iodine Deficiency Disorders Control Programme) are the population-level implementation of this lesson — goitre prevention by flour-delivery, so to speak.',
        terminology: ['NIDDCP — National Iodine Deficiency Disorders Control Programme'],
        note: 'Iodine deficiency remains the classic preventable endocrine disease in endemic regions.',
      },
      {
        region: 'United States',
        screening: 'Newborn screening panels in the US include congenital hypothyroidism (TSH or T4-based) as a standard public-health program — early detection prevents developmental disability.',
        note: 'Screening coverage reflects health-system design, not biology.',
      },
      {
        region: 'United Kingdom',
        screening: 'The NHS newborn blood-spot screening programme also includes congenital hypothyroidism; adult thyroid testing centres on TSH-first algorithms with free T4 reflex.',
        note: 'Same axis logic; differing screening logistics and reference ranges by assay.',
      },
      {
        region: 'WHO/Global',
        screening: 'WHO supports universal salt iodisation as the global strategy against iodine-deficiency disorders — one of public health\u2019s most cost-effective interventions.',
        note: 'A population-level application of iodine-handling physiology.',
      },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — the endocrine system, the thyroid gland'),
      hmxRef('HMX physiology content on endocrine axes'),
      ncbiRef('Review literature on thyroid hormone synthesis and action'),
      whoRef('Guidance on salt iodisation and iodine deficiency elimination'),
    ],
  },

  // ═══════════════════════════ BIOCHEMISTRY (3) ════════════════════════════

  {
    id: 'c2-biochemistry-glycolysis-tca',
    name: 'Glycolysis & TCA Cycle Overview',
    kind: 'process',
    oneLiner: 'Glycolysis splits glucose in the cytosol for a small, fast ATP payout; the TCA cycle then strips the fragments\u2019 electrons in mitochondria so the electron-transport chain can pay the big dividend.',
    whyMatters: 'This is the engine every tissue runs on and the exam\u2019s favourite pathway: enzyme blocks (glycogen storage diseases, pyruvate dehydrogenase deficiency), oxygen dependence (lactic acidosis) and cancer metabolism (Warburg effect) are all this map with one arrow broken.',
    explain30s: 'Glycolysis (cytosol, oxygen-independent): one 6-carbon glucose → two 3-carbon pyruvates, net gain of 2 ATP + 2 NADH. The committed, regulated step is PFK-1. Pyruvate then enters mitochondria and is converted to acetyl-CoA (pyruvate dehydrogenase). The TCA (Krebs) cycle oxidises acetyl-CoA to CO₂, yielding 3 NADH, 1 FADH₂ and 1 GTP per turn. NADH/FADH₂ carry electrons to the electron-transport chain, where oxygen is the final acceptor and oxidative phosphorylation produces the bulk of ATP (classically ~30–32 ATP per glucose overall, aerobic). Without oxygen, pyruvate is converted to lactate instead, regenerating NAD⁺ so glycolysis can keep running.',
    eli5: 'Imagine a log (glucose). Chopping it in half in your yard (glycolysis) gives you quick kindling — small, fast energy. Trucking the halves into a big furnace building (mitochondria), the log-halves are split into burnable chips (acetyl-CoA) and fed into a spinning furnace wheel (TCA cycle). The wheel doesn\u2019t make much heat directly — its job is to load batteries (NADH/FADH₂). The batteries run the real power plant (electron-transport chain) where oxygen is the exhaust collector. No oxygen? The furnace backs up and you stash energy as lactic acid — much smaller pay, but you keep going.',
    firstPrinciples: [
      'Energy currency first: cells spend ATP; carbohydrates, fats and proteins all converge to acetyl-CoA or pathway intermediates — glycolysis + TCA is the shared central exchange.',
      'Glycolysis (cytosol, anaerobic-capable): 10 steps, 2 investment phases → net 2 ATP (substrate-level phosphorylation) + 2 NADH + 2 pyruvate per glucose. Regulated, committed step: phosphofructokinase-1 (PFK-1) — activated by AMP, inhibited by ATP/citrate.',
      'Oxygen checkpoint: pyruvate → lactate (lactate dehydrogenase) regenerates NAD⁺ for glycolysis when O₂ is scarce; pyruvate → acetyl-CoA (pyruvate dehydrogenase complex, mitochondrial, needs 5 cofactors incl. thiamine/B1) when O₂ is present.',
      'TCA cycle (mitochondrial matrix): acetyl-CoA + oxaloacetate → citrate; two decarboxylations and four oxidations per turn → 3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂; cycle turns twice per glucose.',
      'The real payout: NADH/FADH₂ feed the electron-transport chain; electron flow pumps protons; ATP-synthase uses that gradient (chemiosmosis). Classic teaching total: ~30–32 ATP per glucose aerobically vs 2 anaerobically.',
      'Regulation logic: high ATP slows the system (PFK-1 inhibited), high AMP/ADP speeds it; calcium (muscle working) activates dehydrogenases — supply follows demand.',
      'Clinical fingerprints: blocked PDH or thiamine deficiency shunts pyruvate to lactate (lactic acidosis, Wernicke in alcoholics); G6PD/favism aside, the classic glycolytic-enzyme deficiencies (e.g. pyruvate kinase) cause haemolytic anaemia because red cells run ONLY on glycolysis.',
    ],
    normal: 'Per glucose: glycolysis net 2 ATP + 2 NADH; TCA ×2 = 6 NADH + 2 FADH₂ + 2 GTP; aerobic total classically ≈ 30–32 ATP (teaching value; modern estimates vary slightly by shuttle). Brain and red cells depend on glucose continuously.',
    mechanism: 'Three irreversible gates organise the map: hexokinase/glucokinase (entry), PFK-1 (committed step), pyruvate kinase (exit). The TCA cycle\u2019s intermediates are not just fuel — they are biosynthesis hubs (citrate → fatty acids, oxaloacetate → gluconeogenesis, α-ketoglutarate → amino acids), which is why the cycle is a roundabout, not a dead-end furnace.',
    numbers: [
      { label: 'Net ATP from glycolysis alone', value: '2 ATP per glucose', note: 'fast, oxygen-independent, cytosolic' },
      { label: 'Aerobic total per glucose', value: '≈ 30–32 ATP (classic teaching)', note: 'glycolysis + PDH + TCA + oxidative phosphorylation' },
      { label: 'TCA turns per glucose', value: '2 turns', note: 'one per acetyl-CoA; 3 NADH + 1 FADH₂ + 1 GTP each' },
    ],
    differentials: [
      { name: 'Pyruvate kinase deficiency', key: 'glycolytic block → haemolytic anaemia (RBCs have no mitochondria — glycolysis is their only ATP source)' },
      { name: 'Pyruvate dehydrogenase deficiency / thiamine deficiency', key: 'pyruvate piles into lactate → lactic acidosis; neurology suffers (B1-dependent enzyme)' },
      { name: 'Mitochondrial disorders', key: 'the OXPHOS arm fails — exercise intolerance, lactic acidosis, multi-organ patterns (heteroplasmy)' },
    ],
    mistakes: [
      'Counting glycolysis ATP as 4 net — 2 invested, 4 produced: NET 2.',
      'Saying the TCA cycle makes lots of ATP directly — it makes electron carriers (NADH/FADH₂) and 1 GTP; the electron-transport chain makes the ATP.',
      'Forgetting red cells lack mitochondria — they cannot use the TCA at all and always end at lactate.',
    ],
    examRelevance: 'Rate-limiting enzyme matching (PFK-1), net-ATP accounting, cofactor lists (PDH\u2019s thiamine/lipoic acid/FAD/NAD/CoA), and "why lactic acidosis in sepsis/shock" — tissue hypoxia forcing the anaerobic branch.',
    clinicalRelevance: 'Sepsis and shock lactate, metformin\u2019s caution in severe hypoxia, fluoride-grey tubes for lactate sampling, and PET imaging of glucose uptake in tumours (Warburg effect — cancer favours glycolysis even with oxygen) all ride this map.',
    analogies: [
      'Glycolysis is chopping logs for kindling; the TCA + ETC is the furnace building that pays the real dividend — oxygen is the exhaust collector without which the furnace jams.',
      'The TCA cycle is a roundabout: fuel enters, electrons (batteries) exit, and side-roads ship intermediates off to build amino acids and fat.',
    ],
    crossLinks: [
      { label: 'Fasting state & gluconeogenesis (Biochemistry)', why: 'The same intermediates run the glucose-making arm in reverse priorities.', subject: 'Biochemistry' },
      { label: 'Vitamins & deficiencies (Biochemistry)', why: 'Thiamine (B1) sits at the PDH gate — B1 deficiency jams the entrance to the furnace.', subject: 'Biochemistry' },
      { label: 'Diabetes mellitus (Medicine)', why: 'Without insulin signalling, the whole fuel-map reroutes (ketones, lipolysis).', subject: 'Medicine' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Biology / Microbiology — cellular respiration chapters'),
      ocwRef('Biochemistry course materials on glycolysis and the citric-acid cycle'),
      ncbiRef('Review literature on intermediary metabolism'),
    ],
  },

  {
    id: 'c2-biochemistry-fasting-gluconeogenesis',
    name: 'Fasting State & Gluconeogenesis',
    kind: 'process',
    oneLiner: 'When meals stop, the body re-orders its fuel economy: glycogen is spent first, then gluconeogenesis makes new glucose, and fat becomes the main currency — with ketones as the brain\u2019s emergency ration.',
    whyMatters: 'Diabetes emergencies (DKA/HHS), refeeding syndrome, alcohol hypoglycaemia and every "starvation" exam stem are this switchboard mis-wired. Knowing what the body does in a normal overnight fast tells you exactly what breaks in disease.',
    explain30s: 'Right after a meal, insulin stores fuel (glycogen in liver/muscle, fat in adipose). During fasting, insulin falls, glucagon rises: liver glycogen breaks down first (hours). As glycogen runs low (roughly within a day, classically taught as ~12–24 h), the liver builds NEW glucose — gluconeogenesis — from lactate (Cori cycle), glycerol (fat breakdown) and amino acids (muscle, mainly alanine). Adipose releases fatty acids for most tissues, but red cells and much of the brain still need glucose. In prolonged fasting the liver converts fatty acids into ketone bodies, which the brain gradually adopts — sparing muscle protein.',
    eli5: 'Think of the body as a household with a fridge (recent meal), a pantry (glycogen), and a savings account (fat). Right after shopping, everything goes into the fridge. Overnight, you eat from the pantry. When the pantry empties, the house starts MANUFACTURING its own bread (gluconeogenesis) from whatever raw materials exist — recycling scraps (lactate), melting candles (glycerol from fat), and yes, dismantling a chair (muscle protein) if needed. After a while, the house learns to burn oil (fatty acids) in most rooms, and to cook a special ration (ketones) that the most stubborn resident — the brain — finally accepts, so the chairs stop being dismantled.',
    firstPrinciples: [
      'The switch: insulin (fed, "store") vs glucagon (fasting, "spend"). Fasting = insulin down, glucagon up, catecholamines ready — the whole economy flips in minutes.',
      'Timeline (classic teaching): first hours — liver glycogenolysis maintains blood glucose; ~12–24 h — hepatic glycogen substantially depleted; beyond a day — gluconeogenesis dominates; days — ketone production rises steeply and the brain shifts to ketones.',
      'Gluconeogenesis is NOT reverse glycolysis: it bypasses the three irreversible glycolytic gates with four key enzymes (pyruvate carboxylase, PEP carboxykinase, fructose-1,6-bisphosphatase, glucose-6-phosphatase). Main site: liver (kidney contributes in prolonged fasting).',
      'The three raw materials: lactate (recycled from muscle/RBC anaerobic glycolysis via the Cori cycle), glycerol (from adipose lipolysis), amino acids (mainly alanine from muscle — the glucose-alanine cycle). Fatty acids CANNOT become glucose in humans — their carbons are lost as CO₂ in the TCA; only their glycerol backbone counts.',
      'Fat takes over: fatty-acid oxidation fuels liver, muscle and most tissues; acetyl-CoA piles up (oxaloacetate is busy with gluconeogenesis) → liver diverts it into ketogenesis: acetoacetate, β-hydroxybutyrate, acetone.',
      'Brain economics: the brain cannot burn fatty acids (they don\u2019t cross well nor fit its transport logic) but readily burns ketones — after adaptation, ketones can cover a large share of brain energy, sparing muscle.',
      'Guardrails: blood glucose is defended at ~70–100 mg/dL fasting (normal range) because red cells and the brain\u2019s basal needs still require it; below that, counter-regulatory hormones (glucagon, adrenaline, cortisol, growth hormone) mobilise everything above.',
    ],
    normal: 'Normal fasting glucose ≈ 70–100 mg/dL (standard reference). Fed state: insulin-driven storage. Overnight fast of 8–12 h is normal physiology — breakfast literally means breaking the fast.',
    mechanism: 'Hormonal logic maps to enzymes: glucagon → PKA → phosphorylates pyruvate kinase (OFF) and glycogen phosphorylase (ON); insulin does the reverse. Alcohol adds a trap: ethanol metabolism raises NADH, shunting pyruvate to lactate and blocking gluconeogenesis — fasting drinkers get hypoglycaemia. Refeeding after starvation swings insulin up suddenly — phosphate/potassium/magnesium rush into cells: refeeding syndrome.',
    numbers: [
      { label: 'Normal fasting glucose', value: '70–100 mg/dL', note: 'the level the fasting economy defends' },
      { label: 'Hepatic glycogen depletion', value: 'classically taught ≈ 12–24 h of fasting', note: 'after which gluconeogenesis dominates' },
      { label: 'Ketone onset', value: 'significant after ~2–3 days of fasting (classic teaching)', note: 'brain ketone adaptation follows — muscle sparing' },
    ],
    differentials: [
      { name: 'Diabetic ketoacidosis (DKA)', key: 'the fasting program running with NO insulin brake at all — glucose high (cannot enter cells), ketones high, acidosis' },
      { name: 'Alcoholic ketoacidosis / hypoglycaemia', key: 'NADH overload shunts pyruvate away — no gluconeogenesis despite ketones; glucose low or low-normal' },
      { name: 'Refeeding syndrome', key: 'sudden insulin surge after prolonged fasting — phosphate/K/Mg shift into cells; feed cautiously, replace electrolytes first' },
    ],
    mistakes: [
      'Believing fat becomes glucose — only the glycerol backbone does; fatty-acid carbons exit as CO₂ or become ketones.',
      'Putting gluconeogenesis in muscle — the LIVER (± kidney) makes glucose; muscle exports alanine/lactate as raw material.',
      'Forgetting red cells can\u2019t use ketones — erythrocytes need glucose forever; the Cori cycle exists to serve them.',
    ],
    examRelevance: 'Timeline questions (what maintains glucose at 6 h vs 3 days?), substrate-source matching (Cori vs glucose-alanine cycle), DKA-vs-starvation ketosis discrimination (insulin absent vs merely low), and refeeding-syndrome electrochemistry.',
    clinicalRelevance: 'Fasting protocols before surgery, juice fasts and prolonged illness in children (vomiting diarrhoea → hypoglycaemia risk), alcohol-related hypoglycaemia, and ketogenic-diet logic (deliberately driving the ketone arm for epilepsy therapy) all apply this physiology.',
    analogies: [
      'The body\u2019s fuel order: fridge (meal) → pantry (glycogen) → manufacturing (gluconeogenesis) → oil furnace (fat) → special ration for the stubborn brain (ketones).',
      'Ketones are the brain\u2019s emergency currency — minted from fat so the muscle-chairs stop being dismantled.',
    ],
    crossLinks: [
      { label: 'Glycolysis & TCA cycle (Biochemistry)', why: 'Gluconeogenesis bypasses glycolysis\u2019s irreversible gates; ketogenesis diverts TCA fuel.', subject: 'Biochemistry' },
      { label: 'Insulin & glucose homeostasis (Physiology)', why: 'The hormonal switchboard that runs this economy.', subject: 'Physiology' },
      { label: 'DKA (Medicine)', why: 'The fasting program without its insulin brake — the disease version of this lesson.', subject: 'Medicine' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Biology — metabolism and cellular respiration chapters'),
      hmxRef('HMX biochemistry content on metabolic integration'),
      ncbiRef('Review literature on fasting metabolism and ketogenesis'),
    ],
  },

  {
    id: 'c2-biochemistry-vitamins-deficiencies',
    name: 'Vitamins & Deficiency States',
    kind: 'principle',
    oneLiner: 'Vitamins are micronutrients the body cannot make (or makes insufficiently) — each has one core biochemical job, and each deficiency writes its own recognisable disease signature.',
    whyMatters: 'Vitamin questions are guaranteed marks across biochemistry, paediatrics, ophthalmology and medicine — and clinically, deficiency diseases remain common worldwide, from anaemia to night blindness.',
    explain30s: 'Fat-soluble vitamins (A, D, E, K) are stored in the body — excess harms, and fat-malabsorption or bile problems cause deficiency. Water-soluble vitamins (B-complex, C) are rarely stored — deficiency shows up faster. Each vitamin has a signature: A for vision/epithelium, B1 for carbohydrate metabolism and nerves, B3 for NAD, B12/folate for DNA synthesis, C for collagen, D for calcium, E as antioxidant, K for clotting. Learn the job → predict the deficiency, and the reverse.',
    eli5: 'Think of vitamins as tiny specialist tools in a workshop. You only need small amounts, but if one tool is missing, its one specific job stops: no screwdriver (vitamin C) and the scaffolding (collagen) falls loose — gums bleed. No spirit level (vitamin A) and the night-shift workers (retina) can\u2019t see. No cement mixer (vitamin D) and the bricks (calcium) never set into bone. The fat-soluble tools get stored in the storeroom (liver/fat) — so they run out slowly but can also pile up dangerously; the water-soluble ones wash away daily, so workshops run out of them fast.',
    firstPrinciples: [
      'The dividing line: FAT-SOLUBLE (A, D, E, K — "ADEK") dissolve in lipid, are absorbed WITH fat (bile needed), stored in liver/adipose → deficiency is slow, toxicity possible. WATER-SOLUBLE (B-complex, C) wash out → deficiency faster, toxicity rare.',
      'Vitamin A (retinol): visual pigments (night vision), epithelial integrity, immunity. Deficiency: night blindness → xerophthalmia, keratomalacia; excess: pseudotumour cerebri, teratogenicity.',
      'Vitamin B1 (thiamine): cofactor of pyruvate dehydrogenase, transketolase, α-ketoglutarate dehydrogenase — carbohydrate metabolism\u2019s gatekeeper. Deficiency (alcohol, malnutrition): beriberi — wet (heart failure, oedema) / dry (neuropathy); Wernicke–Korsakoff encephalopathy.',
      'Vitamin B3 (niacin): NAD⁺/NADP⁺ — the cell\u2019s electron shuttles. Deficiency: pellagra — dermatitis, diarrhoea, dementia (+ death if untreated); tryptophan-poor diets (maize-only) at risk.',
      'Vitamin B12 (cobalamin) & folate: one-carbon chemistry for DNA synthesis → megaloblastic anaemia; B12 ALSO maintains myelin — its deficiency adds neurological damage, and folate replacement can mask (but not fix) the neurology — always think B12 first.',
      'Vitamin C (ascorbate): collagen hydroxylation (the triple helix needs vitamin-C-powered proline/lysine hydroxylation) + iron absorption. Deficiency: scurvy — bleeding gums, poor wound healing, perifollicular haemorrhage.',
      'Vitamin D (cholecalciferol): calcium/phosphate absorption, bone mineralisation (skin makes it with sunlight; kidney does the final activation). Deficiency: rickets (children — bowing), osteomalacia (adults — bone pain); vitamin K: clotting-factor carboxylation (II, VII, IX, X) + osteocalcin. Deficiency: bleeding, raised PT/INR; warfarin works by antagonising it.',
    ],
    normal: 'Vitamin stores vary hugely: liver stores of B12 last years; body stores of B1 last weeks; folate stores months. Fat-soluble vitamin absorption always requires bile and pancreatic lipase — think of it whenever malabsorption (coeliac, cholestasis, short bowel) is in a stem.',
    mechanism: 'Each deficiency is an enzyme-cofactor story: B1 → PDH/TCA gates jam (lactic acidosis, neuropathy); B12/folate → thymidine synthesis fails → megaloblasts (nuclear-cytoplasmic asynchrony); C → collagen can\u2019t crosslink (capillary fragility); K → clotting factors made but not functional (warfarin\u2019s mechanism is exactly this block).',
    numbers: [
      { label: 'Fat-soluble vitamins', value: 'A, D, E, K', note: 'stored in body fat/liver — slow deficiency, real toxicity risk' },
      { label: 'Clotting factors needing vitamin K', value: 'II, VII, IX, X (+ proteins C & S)', note: 'warfarin antagonises this carboxylation step' },
    ],
    differentials: [
      { name: 'Megaloblastic anaemia — B12 vs folate', key: 'both give macrocytosis + hypersegmented neutrophils; B12 adds NEUROPATHY (posterior columns, cognition) — folate alone can mask it' },
      { name: 'Beriberi — wet vs dry', key: 'same B1 deficiency; wet = high-output heart failure & oedema, dry = symmetric peripheral neuropathy' },
      { name: 'Rickets vs osteomalacia', key: 'same vitamin D deficiency — growth plates open (children: bowing, rachitic rosary) vs closed (adults: bone pain, fractures)' },
    ],
    mnemonics: [
      { hook: 'ADEK', expands: 'the fat-soluble vitamins — absorbed with fat, stored, can accumulate to toxicity.' },
      { hook: 'Pellagra\u2019s 3 Ds (+1)', expands: 'Dermatitis, Diarrhoea, Dementia — and Death if untreated (niacin/B3 deficiency).' },
      { hook: '"K for Koagulation"', expands: 'vitamin K\u2019s German-derived name reflects its clotting-factor job — II, VII, IX, X.' },
    ],
    mistakes: [
      'Giving folate alone in macrocytic anaemia without excluding B12 deficiency — folate fixes the blood film but lets the neurology progress.',
      'Treating fat-soluble vitamin deficiency with oral doses in a cholestatic patient — without bile, oral ADEK simply isn\u2019t absorbed.',
      'Confusing B1 (thiamine, beriberi/Wernicke) with B12 (cobalamin, megaloblastic + neuropathy) — both cause neurology by utterly different mechanisms.',
    ],
    examRelevance: 'Vitamin–deficiency matching is the highest-yield table in biochemistry: asked forward (deficiency → disease) and reverse (disease → missing cofactor), plus absorption-logic vignettes (malabsorption, alcohol, exclusive breastfeeding and vitamin K haemorrhagic disease of the newborn).',
    clinicalRelevance: 'Newborn vitamin K prophylaxis, Wernicke prevention (thiamine before glucose in alcohol misuse — a classic ordering question), folate in pregnancy (neural-tube prevention) and vitamin A programmes in deficiency-endemic regions are direct applications.',
    verifyNote: 'Doses, screening cut-offs and fortification policies vary by country — verify current local guidance.',
    analogies: [
      'Vitamins are specialist tools: each missing tool stops exactly one job — learn the job list and deficiency becomes deduction.',
      'Fat-soluble tools go into the storeroom (slow to run out, dangerous to overstock); water-soluble tools wash down the sink every day (fast to run out).',
    ],
    crossLinks: [
      { label: 'Glycolysis & TCA (Biochemistry)', why: 'B1 sits at the pyruvate-dehydrogenase gate into the TCA — metabolism\u2019s first door.', subject: 'Biochemistry' },
      { label: 'Connective tissue (Histology)', why: 'Vitamin C\u2019s collagen hydroxylation is a tissue-level story — scurvy is connective-tissue failure.', subject: 'Histology' },
      { label: 'Coagulation cascade (Pathology)', why: 'Vitamin K carboxylation makes factors II, VII, IX, X functional — warfarin\u2019s target.', subject: 'Pathology' },
    ],
    global: [
      {
        region: 'India',
        delivery: 'India\u2019s Anaemia Mukt Bharat programme delivers iron–folic-acid supplementation through public health systems; vitamin A prophylaxis rounds target deficiency-endemic districts.',
        terminology: ['Anaemia Mukt Bharat — national anaemia-mitigation programme'],
        note: 'Deficiency in India is largely a nutrition-programme story, not only a biochemistry one.',
      },
      {
        region: 'United States',
        delivery: 'US staple foods are fortified — folic acid in enriched grain products (since 1998, associated with marked falls in neural-tube-defect births), vitamin D in milk; deficiency now clusters in malabsorption and dietary-restriction groups.',
        terminology: ['USPSTF — issues supplementation evidence reviews'],
        note: 'Fortification moves the deficiency conversation from individual diets to population policy.',
      },
      {
        region: 'United Kingdom',
        delivery: 'UK policy includes folic-acid fortification of flour (legislated rollout) and NHS healthy-start vitamins for children/pregnant women; rickets re-emerged in at-risk groups, prompting vitamin D guidance.',
        note: 'Same nutrients, different delivery architecture per health system.',
      },
      {
        region: 'WHO/Global',
        delivery: 'WHO runs global vitamin strategies — universal salt iodisation, periodic high-dose vitamin A supplementation in deficiency-endemic regions, and micronutrient fortification guidance.',
        note: 'At population scale, vitamins are public-health instruments as much as nutrients.',
      },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'high',
    sources: [
      staxRef('Biology / Anatomy & Physiology — vitamins and nutrition chapters'),
      ncbiRef('Review literature on vitamin deficiencies and metabolism'),
      whoRef('Guidance on micronutrient deficiency control programmes'),
      cdcRef('Folic acid fortification and neural tube defect prevention materials'),
    ],
  },

  // ═══════════════════════════ HISTOLOGY (2) ═══════════════════════════════

  {
    id: 'c2-histology-epithelium',
    name: 'Epithelial Tissue',
    kind: 'structure',
    oneLiner: 'Epithelium is the body\u2019s covering and lining tissue — sheets of tightly packed cells classified by layers × shape, sitting on a basement membrane and always avascular.',
    whyMatters: 'Every organ surface you will ever study (skin, gut, airways, vessels, glands) is epithelium, and pathology\u2019s biggest cancer families (carcinomas) arise from it. Classification logic turns a microscope slide into a diagnosis.',
    explain30s: 'Epithelial sheets cover surfaces, line cavities and form glands. Classify any epithelium with two questions: how many LAYERS (one = simple; several = stratified; looks-many-but-one = pseudostratified) and what SHAPE the surface cells are (flat = squamous; square = cuboidal; tall = columnar; dome-y & stretchable = transitional). One extra rule: epithelium has NO blood vessels of its own — it is fed by diffusion from underneath, across a basement membrane. Function follows the pattern: thin & simple = exchange/absorption; thick & stratified = protection.',
    eli5: 'Imagine tissue as a house and epithelium as wallpaper, tiles and waterproof coatings. Where nothing much happens, you use one thin layer (simple) — thin walls make fast exchanges, like lung and blood-vessel linings. Where rough wear happens, you stack many layers (stratified) — like skin. Your gut uses one tall layer with tiny finger-hairs (microvilli) to absorb food — more surface, more absorption. Bladders use a special stretchy tile (transitional) that slides over itself like a telescope. And every wallpaper sits on glue-paper (the basement membrane) that also filters things underneath.',
    firstPrinciples: [
      'The two-axis classification: LAYERS (simple = 1, stratified = 2+, pseudostratified = all cells touch the basement membrane but nuclei sit at different heights) × SHAPE of the apical/surface cells (squamous, cuboidal, columnar, transitional).',
      'Avascularity rule: epithelium has no own blood supply — nutrients diffuse from underlying connective tissue across the basement membrane. This single fact explains epithelial healing speed, carcinoma behaviour, and why burns are infections waiting to happen.',
      'Polarity: epithelial cells have an apical (surface) side and a basal side — cilia, microvilli and goblet cells decorate the apical face; hemidesmosomes anchor the basal face to the basement membrane.',
      'Match form to function by examples: simple squamous (alveoli, endothelium — exchange); simple cuboidal (ducts, tubules — transport); simple columnar with microvilli (small intestine — absorption); pseudostratified ciliated with goblet cells (trachea/bronchi — the "mucus escalator"); stratified squamous keratinised (skin — armour), non-keratinised (oesophagus/vagina — wet friction armour); transitional (urinary tract — stretch); stratified cuboidal/columnar (large ducts, rare).',
      'Glands are epithelium turned inward: exocrine glands keep a duct (secretion to a surface); endocrine glands lose the duct (secretion to blood).',
      'The basement membrane (basal lamina + reticular lamina) is type-IV-collagen-rich: it anchors, filters (glomerulus!) and scaffolds regeneration — which is why breaching it is the definition of carcinoma invasion.',
      'Turnover logic: surface epithelia renew from stem cells near the basement membrane — high-turnover tissues (gut, skin) show toxicity first in chemotherapy and radiation.',
    ],
    normal: 'Canonical pairings to memorise: alveoli/endothelium = simple squamous; small intestine = simple columnar + microvilli; trachea = pseudostratified ciliated; skin = stratified squamous keratinised; bladder = transitional.',
    mechanism: 'Renewal and repair: epithelial wounds heal by stem-cell migration and mitosis along the basement membrane scaffold; loss of the membrane forces granulation-tissue repair (scar). The same scaffold\u2019s breach (basement-membrane invasion) is histology\u2019s line between in-situ and invasive carcinoma.',
    pathologyCorrelation: 'Metaplasia is epithelium reclassified under stress: smoking swaps tracheal ciliated epithelium for stratified squamous (loses the mucus escalator); acid reflux swaps oesophageal squamous for intestinal-type columnar (Barrett\u2019s oesophagus — surveillance for dysplasia). Transitional epithelium gives urothelial carcinoma; squamous epithelium gives squamous cell carcinoma — the surface you start from predicts the cancer you get.',
    mistakes: [
      'Calling pseudostratified epithelium "stratified" — every cell touches the basement membrane; only the NUCLEI are at different levels (trachea is the classic).',
      'Forgetting avascularity — an "epithelial blood vessel" on a slide means you are looking at something else (or vessels in underlying tissue).',
      'Classifying stratified epithelium by its DEEPEST layer — classification uses the SURFACE (apical) cells\u2019 shape.',
    ],
    examRelevance: 'Slide-identification questions (trachea vs oesophagus vs bladder), form-function matching (why alveoli are thin), and clinicopathologic bridges (Barrett\u2019s, smoking metaplasia, transitional cell carcinoma).',
    clinicalRelevance: "Pap smears, biopsies and cytology are all epithelial sampling; 'carcinoma' literally means a cancer of epithelial origin — the most common cancer family.",
    analogies: [
      'Epithelium is the building\u2019s wallpaper-and-tiles department: thin tiles where exchange matters, thick armour where wear matters.',
      'The basement membrane is the glue-paper layer under wallpaper — tear the wallpaper (superficial) and it regrows; tear the glue-paper (invasion) and the story changes.',
    ],
    crossLinks: [
      { label: 'Connective tissue (Histology)', why: 'Every epithelium rests on connective tissue — the two partners define every organ surface.', subject: 'Histology' },
      { label: 'Respiratory mechanics (Physiology)', why: 'Type I/II pneumocytes are epithelium doing gas exchange and surfactant.', subject: 'Physiology' },
      { label: 'Neoplasia (Pathology)', why: 'Carcinomas, metaplasia and invasion are epithelial biology gone wrong.', subject: 'Pathology' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 3,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — epithelial tissue chapter'),
      hmxRef('HMX content on tissue structure and histology'),
      ncbiRef('Review literature on epithelial biology and metaplasia'),
    ],
  },

  {
    id: 'c2-histology-connective-tissue',
    name: 'Connective Tissue',
    kind: 'structure',
    oneLiner: 'Connective tissue is the body\u2019s scaffolding — relatively few cells scattered in a large matrix of fibres and ground substance, specialising into fat, cartilage, bone and blood.',
    whyMatters: 'It is the tissue behind the collagen-disease family (Ehlers–Danlos, osteogenesis imperfecta, Marfan, scurvy) and the tissue every organ leans on. The matrix logic also explains wound healing and fibrosis.',
    explain30s: 'Unlike epithelium (cells packed tight), connective tissue is mostly EXTRACELLULAR MATRIX with cells sprinkled in. The matrix has three ingredients: fibres (collagen = strength, elastic = stretch, reticular = fine mesh), ground substance (gel holding water), and tissue fluid. Cells: fibroblasts make the matrix; adipocytes store fat; mast cells and macrophages police it; mesenchymal cells are the reserves. Broad families: loose (packing, under epithelia), dense regular (tendons — one direction of pull), dense irregular (skin dermis — multi-direction pull), and specialised (cartilage, bone, blood). Disease follows the matrix: weak collagen → stretchy joints and fragile vessels; weak vitamin C → collagen can\u2019t cross-link.',
    eli5: 'If epithelium is a house\u2019s wallpaper, connective tissue is the concrete, steel rods and foam insulation inside the walls — plus the storage room (fat) and the delivery network (blood). Concrete rods = collagen fibres (strength), rubber bands = elastic fibres (stretch), sticky gel = ground substance. The workers who pour concrete are fibroblasts. Weak concrete (bad collagen) means wobbly buildings (flexible joints, stretchy skin) — that\u2019s Ehlers–Danlos. No cement additive (vitamin C) means concrete never sets properly — that\u2019s scurvy.',
    firstPrinciples: [
      'Inversion of the epithelial rule: connective tissue = sparse CELLS + abundant MATRIX (vs epithelium\u2019s packed cells, no matrix). Everything else follows from this inversion.',
      'Matrix ingredients: FIBRES — collagen (tensile strength; the body\u2019s most abundant protein), elastic fibres (elastin + fibrillin — recoil), reticular fibres (type-III collagen mesh for soft organs). GROUND SUBSTANCE — glycosaminoglycans/proteoglycans holding water (the gel that resists compression and lets nutrients diffuse).',
      'The cell cast: fibroblasts (build matrix, the workhorse), adipocytes (fuel store + endocrine organ), mast cells (histamine granules — the allergy/anaphylaxis switch), macrophages (cleanup + antigen display), plasma cells (antibody factories), undifferentiated mesenchymal cells (repair reserves).',
      'The family tree by density/arrangement: loose (areolar — everywhere under epithelia), dense regular (tendons/ligaments — parallel pull), dense irregular (dermis, capsules — random pull), reticular (lymphoid organs\u2019 skeleton), adipose (fuel + insulation + cushioning).',
      'Specialised connective tissues share the same logic with hard or liquid matrices: cartilage (firm gel matrix, avascular — hence slow healing), bone (mineralised collagen — the body\u2019s rebar concrete), blood (liquid matrix = plasma, cells = the formed elements).',
      'Collagen typing as clinical grammar: type I = skin, bone, tendon (strength); type II = hyaline cartilage; type III = reticular fibres, vessels, early granulation tissue; type IV = basement membrane (filter). Genetic or nutritional defects map onto these slots.',
      'Vitamin C\u2019s gate: collagen needs proline/lysine HYDROXYLATION (vitamin-C-dependent) for stable triple helices — no C, no stable scaffold: bleeding gums, poor healing, perifollicular bleeds (scurvy).',
    ],
    normal: 'Under every epithelium lies loose connective tissue with the immune sentries (mast cells, macrophages); tendons are dense regular; dermis is dense irregular. Cartilage is avascular — nutrients diffuse from perichondrium, so chondrocyte injuries heal poorly.',
    mechanism: 'Wound healing is connective-tissue biology: type-III collagen lays down fast in granulation tissue, then remodels to type I with cross-linking over months — the reason scars soften and strengthen for up to a year. Fibrosis (cirrhosis, pulmonary fibrosis) is the same system stuck in "build" mode.',
    pathologyCorrelation: 'Matrix-gene diseases are direct slides of this lesson: Ehlers–Danlos (collagen V/III defects — hyperextensible skin, hypermobile joints, easy bruising), osteogenesis imperfecta (type-I collagen — blue sclerae, multiple fractures), Marfan (fibrillin-1 in elastic fibres — tall habitus, aortic-root risk), scurvy (vitamin C — collagen can\u2019t cross-link). Fibrotic diseases (cirrhosis, keloids) are over-activation of the same builders.',
    mistakes: [
      'Forgetting cartilage is avascular — chondrocyte nutrition diffuses through matrix; deep cartilage injuries barely heal (classic sports-medicine fact).',
      'Treating blood as "not connective tissue" — liquid matrix + suspended cells is the same tissue logic at its most fluid.',
      'Assuming all collagen is type I — type IV makes the basement membrane filter in kidneys; wrong type in the wrong slot = disease.',
    ],
    examRelevance: 'Slide questions (tendon vs dermis vs cartilage), collagen-type matching (I/II/III/IV with locations and diseases), mast-cell identification (granules, histamine), and healing-timeline questions riding the type-III→type-I switch.',
    clinicalRelevance: 'Surgery is connective-tissue management: sutures hold until collagen strength returns (wounds regain strength slowly — never full baseline), keloids are matrix over-production, and joint/ligament injuries are dense-regular failures.',
    analogies: [
      'Connective tissue is the building\u2019s concrete-and-steel floor with workers (fibroblasts), guards (mast cells/macrophages) and a storeroom (fat).',
      'Collagen types are steel grades: rebar for bones (I), springs for vessels (elastic/III), mesh filters for kidneys (IV).',
    ],
    crossLinks: [
      { label: 'Epithelial tissue (Histology)', why: 'The inseparable partner — epithelium works because connective tissue feeds and anchors it.', subject: 'Histology' },
      { label: 'Vitamins & deficiencies (Biochemistry)', why: 'Vitamin C\u2019s collagen gate makes scurvy a matrix disease.', subject: 'Biochemistry' },
      { label: 'Inflammation & healing (Pathology)', why: 'Granulation tissue and fibrosis are connective-tissue programs.', subject: 'Pathology' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 3,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — connective tissue chapter'),
      hmxRef('HMX content on extracellular matrix biology'),
      ncbiRef('Review literature on collagen types and matrix disorders'),
    ],
  },

  // ═══════════════════════════ EMBRYOLOGY (2) ══════════════════════════════

  {
    id: 'c2-embryology-heart-embryogenesis',
    name: 'Heart Embryogenesis & Septation',
    kind: 'process',
    oneLiner: 'The heart starts as a simple pulsing tube in week 3–4 and carves itself into four chambers by folding walls (septa) — every congenital heart defect is one of those walls built late, wrongly or not at all.',
    whyMatters: 'Congenital heart disease is the most common birth-defect family. Septation logic turns a list of scary acronyms (VSD, ASD, TGA, TOF) into one predictable story about which wall failed and when.',
    explain30s: 'In week 4 the heart is a tube that begins beating (~day 22) and folds into its final position. Four partitions then build it into four chambers: (1) the atrial septum grows with a hole-and-flap system (septum primum + secundum) that deliberately leaves the foramen ovale — a fetal shunt; (2) the endocardial cushions divide the single common canal into tricuspid and mitral inlets; (3) the interventricular septum grows upward from the apex, finishing last at the membranous part (helped by the cushions); (4) the outflow tract\u2019s spiral (aorticopulmonary) septum twists the single output into aorta + pulmonary artery. Failures map one-to-one: atrial septal defects, atrioventricular canal defects, ventricular septal defects (most common, usually membranous), and transposition/tetralogy (spiral failure/deviation).',
    eli5: 'Imagine a long balloon being twisted into a four-room flat. First the balloon starts throbbing (day 22 — it must pump while it builds). Workers fold walls: one wall between the two upstairs rooms with a planned trapdoor (foramen ovale — the baby\u2019s bypass), a central junction block that splits the hallway into two doorways (the valves), a wall rising from the ground floor (ventricular septum), and a spiral partition that turns one big exit pipe into two (aorta and pulmonary artery). Each hole or twist you can imagine going wrong IS a named heart defect.',
    firstPrinciples: [
      'Timeline: heart tube forms & fuses week 3; begins to beat ~day 22 (the earliest functioning organ — no waiting period, the embryo is already bigger than diffusion can feed); folding week 4 puts the tube into the chest, looped to the right (dextro-looping — situs logic).',
      'Atrial septation is a DESIGN WITH A HOLE: septum primum grows down toward the cushions; holes (ostium secundum) open in it; septum secundum grows beside it leaving the FORAMEN OVALE — right-to-left shunt in the fetus (placenta does gas exchange, lungs are bypassed). At birth, lung pressure drops, left atrial pressure rises, the flap closes — "functional closure" in hours, anatomical fusion over months.',
      'Endocardial cushions: swellings in the AV canal that fuse to form the mitral/tricuspid orifices AND contribute the membranous part of the ventricular septum and lower atrial septum — one structure, three septal jobs (why AV-canal defects combine all three, classically in Down syndrome).',
      'Ventricular septation: muscular septum grows up from the apex; the LAST millimetre — the membranous septum — needs cushion help. Last-built = most-built-wrong: membranous VSD is the most common congenital heart defect.',
      'Outflow (aorticopulmonary) septum: neural-crest cells twist the truncus arteriosus into spiral aorta + pulmonary trunk. No twist = transposition of the great arteries (circuits in parallel — cyanotic emergency); off-centre twist = tetralogy of Fallot\u2019s anterosuperior deviation (four features from one deviation).',
      'Fetal circulation context: three shunts (ductus venosus, foramen ovale, ductus arteriosus) all bypass liver/lungs; their post-birth closures explain PDA (ductus arteriosus stays open — keeps pulmonary flow in some defects) and the atrial-septal story.',
      'Reading defects backwards: cyanosis timing and shunt direction reveal the wall that failed — acyanotic left-to-right shunts (VSD/ASD) overload lungs; cyanotic right-to-left shunts (TOF, TGA) bypass them.',
    ],
    normal: 'Heart beats from ~day 22. Foramen ovale and ductus arteriosus are designed fetal shunts; both normally close after birth (ductus functionally within the first day or two, anatomically over weeks — classic teaching). A small "stretch" ASD-type opening (patent foramen ovale) persists in a sizable minority of adults without consequence in most.',
    mechanism: 'Why defects cluster: the endocardial cushions serve atrial, ventricular AND valvular septation — one hit (e.g. trisomy 21) produces combined AV-canal defects. Neural-crest outflow failure links arch anomalies with outflow defects. The septum secundum\u2019s flap design explains why secundum ASDs are defects of absent/deficient tissue, not just holes.',
    differentials: [
      { name: 'VSD (membranous most common)', key: 'acyanotic left-to-right shunt — harsh pansystolic murmur at left sternal border; last-built wall = last-built-wrong' },
      { name: 'ASD (secundum most common)', key: 'often silent into adulthood — fixed splitting of S2; a design flaw in the flap-and-hole system, not a random hole' },
      { name: 'Transposition of great arteries', key: 'no spiralling — aorta from right ventricle; parallel circuits, cyanosis at birth, needs shunt-mixing to survive' },
      { name: 'Tetralogy of Fallot', key: 'anterosuperior deviation of the outflow septum → VSD + overriding aorta + pulmonary stenosis + RVH — four features, one deviation' },
    ],
    mistakes: [
      'Calling the foramen ovale a "hole that failed to form" — it is a DESIGNED shunt with a one-way flap; defects are failures of its redundant rims (secundum ASD) or of primum growth (primum ASD, often with cleft mitral valve).',
      'Mixing TGA (no spiral — two parallel circuits) with TOF (deviated septum — four features): transposition = twist failed; tetralogy = twist off-centre.',
      'Assuming the heart "starts beating when finished" — it beats from day 22 while still under construction; function precedes form throughout embryology.',
    ],
    examRelevance: 'The highest-yield embryology cluster: defect-to-mechanism matching (which wall/when), fetal-shunt closures, AV-canal defects in Down syndrome, and cyanotic-vs-acyanotic shunt logic.',
    clinicalRelevance: 'Antenatal anomaly scans image the four-chamber view; prostaglandins are used to KEEP the ductus open in duct-dependent defects — the exact inverse of the PDA treatments, both riding this embryology.',
    analogies: [
      'The heart is a balloon twisted into a four-room flat — each congenital defect is one wall folded late, off-centre, or left out on purpose (the trapdoor).',
      'Fetal shunts are planned detours around closed roads (lungs/liver); birth opens the roads and the detours are demolished.',
    ],
    crossLinks: [
      { label: 'Heart chambers & valves (Anatomy)', why: 'The finished architecture this process builds.', subject: 'Anatomy' },
      { label: 'Trisomy 21 (Genetics)', why: 'AV-canal defects cluster in Down syndrome — the cushion connection.', subject: 'Genetics' },
      { label: 'Congenital heart disease (Paediatrics)', why: 'Cyanosis timing and shunt logic applied at the bedside.', subject: 'Paediatrics' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — development of the heart (embryology sections)'),
      hmxRef('HMX content on developmental biology and the cardiovascular system'),
      ncbiRef('Review literature on cardiac septation and congenital heart defects'),
    ],
  },

  {
    id: 'c2-embryology-gi-rotation',
    name: 'Midgut Rotation & Malrotations',
    kind: 'process',
    oneLiner: 'The midgut grows too fast for the embryo\u2019s belly, takes a temporary holiday in the umbilical cord, returns while turning 270° anticlockwise — and malrotation is what happens when the choreography fails.',
    whyMatters: 'Intestinal malrotation with volvulus is a paediatric surgical emergency whose whole logic (Ladd\u2019s bands, clockwise twist, sudden bilious vomiting) is this rotation story. It also explains why your large intestine sits exactly where it sits.',
    explain30s: 'Around week 6, the rapidly growing midgut (from duodenum to two-thirds along the transverse colon) herniates into the umbilical cord — physiological herniation. Outside, it rotates anticlockwise around the superior mesenteric artery axis. Around week 10, it returns to the abdomen while completing a total of 270° of anticlockwise rotation, landing caecum in the right lower quadrant and fixing (retroperitonealising) parts of the bowel. If rotation stops early or goes wrong, the mesentery is left on a narrow stalk — bowel can then twist around it (volvulus) or fibrous bands (Ladd\u2019s bands) can obstruct the duodenum.',
    eli5: 'Imagine packing a growing snake into a small box. The snake (midgut) outgrows the box (embryo\u2019s belly), so it coils into a side-pocket (the cord), spins three-quarters of a turn anticlockwise, and then slides back in — landing in a perfect spiral. If the snake returns without spinning, or spins the wrong way, it lies in coils that can knot around their own feeding tube (the mesentery with its blood vessels). A knot there is volvulus — sudden, dangerous, and the reason a baby vomiting green (bile) is an emergency.',
    firstPrinciples: [
      'Why herniate at all: the midgut elongates faster than the abdominal cavity expands (plus the relatively large liver and kidneys fill the belly) — week 6: physiological umbilical herniation.',
      'The axis: everything rotates around the superior mesenteric artery (SMA) — the stalk of the herniated loop is literally its blood supply; that stalk is where volvulus strikes.',
      'The choreography: ~270° anticlockwise rotation total (classically taught as three 90° steps), occurring partly outside (weeks 6–10) and completed on return at ~week 10.',
      'The landing: caecum descends to the RIGHT ILIAC FOSSA last; duodenojejunal loop lands left of the SMA; broad mesenteric attachment normally anchors duodenum and colon, leaving a wide-based fan for small bowel.',
      'Failures map to stages: non-rotation (no turn — small bowel on the right, colon on the left; often asymptomatic, found incidentally), incomplete rotation/malrotation (caecum stops near the midline/high — narrow mesenteric base, Ladd\u2019s bands across the duodenum), reversed rotation (clockwise — rare), internal hernias.',
      'The emergency: a narrow mesenteric base lets bowel twist around the SMA → midgut volvulus → sudden bilious vomiting in a neonate, double-bubble/whirl signs on imaging, ischaemia within hours — a repair-now problem.',
      'Related landmarks in the same program: vitelline (omphalomesenteric) duct remnants leave Meckel\u2019s diverticulum ("rule of 2s" — ~2% of people, ~2 feet from ileocaecal valve, ~2 inches long, commonly contains ectopic gastric mucosa — classic teaching); failure of cord re-entry leaves an omphalocele; abdominal-wall closure failure beside the cord leaves gastroschisis.',
    ],
    normal: 'Normal rotation: 270° anticlockwise, caecum to RLQ, Treitz ligament left of midline, wide small-bowel mesentery from duodenojejunal flexure to ileocaecal junction. Non-rotation can be a completely benign incidental finding in adults.',
    mechanism: 'Malrotation\u2019s danger is geometric, not inflammatory: the short mesenteric stalk converts a mobile bowel fan into a turntable; twist → venous congestion first (sudden pain, then blood in stool), then arterial compromise. Ladd\u2019s bands (abnormal peritoneal attachments from a malpositioned caecum) compress the duodenum independently.',
    differentials: [
      { name: 'Midgut volvulus', key: 'sudden bilious vomiting in a neonate — surgical emergency; twist around the narrow SMA-based mesentery' },
      { name: 'Duodenal atresia', key: 'double bubble, bilious or non-bilious vomiting within first days — a recanalisation failure, not a rotation failure' },
      { name: 'Pyloric stenosis', key: 'projectile NON-bilious vomiting weeks 3–6 — upstream of the duodenum, hence no bile' },
    ],
    mistakes: [
      'Quoting 180° or 360° — the established figure is 270° anticlockwise.',
      'Treating all malrotation as emergencies — many non-rotations are incidental; the danger is specifically the NARROW mesenteric base ± Ladd\u2019s bands.',
      'Forgetting "bilious = distal to the ampulla": bile-stained vomiting in a neonate demands urgent imaging — the single most safety-critical reflex from this lesson.',
    ],
    examRelevance: 'Rotation-direction/timing recall, malrotation vs atresia vs pyloric-stenosis vomiting discrimination, Meckel\u2019s "rule of 2s", and omphalocele (cord-covered) vs gastroschisis (not covered) wall-defect pairing.',
    clinicalRelevance: 'Upper-GI contrast studies show the duodenojejunal flexure position; laparotomy (Ladd\u2019s procedure) widens the mesenteric base and divides bands. In adults, malrotation surfaces as an incidental finding or an internal-hernia obstruction.',
    analogies: [
      'The midgut is a snake coiling into a side-pocket while the box catches up — three-quarter anticlockwise spin on re-entry.',
      'Volvulus is that coiled snake knotting around its own feeding cable — geometry, not inflammation, decides the emergency.',
    ],
    crossLinks: [
      { label: 'Abdominal wall & inguinal canal (Anatomy)', why: 'The cord route the midgut uses is shared with the testis\u2019s descent — same doorway.', subject: 'Anatomy' },
      { label: 'Intestinal obstruction (Surgery)', why: 'Volvulus and band obstruction are rotation-failure endpoints.', subject: 'Surgery' },
      { label: 'Paediatric vomiting discrimination (Paediatrics)', why: 'Bilious vs non-bilious localises the block along the same embryology.', subject: 'Paediatrics' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 3,
    globalRelevance: 'universal',
    sources: [
      staxRef('Anatomy & Physiology — development of the digestive system'),
      ocwRef('Developmental biology course materials on gut formation'),
      ncbiRef('Review literature on intestinal malrotation and midgut volvulus'),
    ],
  },

  // ═══════════════════════════ GENETICS (2) ════════════════════════════════

  {
    id: 'c2-genetics-inheritance-patterns',
    name: 'Inheritance Patterns & Pedigrees',
    kind: 'principle',
    oneLiner: 'A pedigree is a logic puzzle: who is affected, across which generations and sexes, tells you whether a condition is autosomal dominant, recessive, X-linked or mitochondrial.',
    whyMatters: 'Counselling, risk percentages and syndrome recognition all flow from pattern recognition. Exam stem writers encode the pattern in two or three pedigree details — this lesson is how to decode them.',
    explain30s: 'Autosomal dominant: vertical inheritance — every generation has affected members, males and females equally, male-to-male transmission possible, one affected parent suffices (50% risk per child). Autosomal recessive: horizontal — affected siblings, unaffected parents, skipped generations, consanguinity common, 25% recurrence. X-linked recessive: no father-to-son, carrier mothers produce affected sons, variable severity in females. X-linked dominant: affected fathers pass to ALL daughters and no sons. Mitochondrial: all children of an affected mother may be affected; fathers never transmit; severity varies (heteroplasmy).',
    eli5: 'Think of a family recipe book. If it\u2019s a dominant recipe, one copy is enough — anyone who gets the page cooks the dish: it shows up in every generation (vertical line). If it\u2019s recessive, you need BOTH copies — so it hides in carriers and suddenly appears when two silent carriers marry (skips generations, more common when families marry cousins). X-linked pages live only in mum\u2019s special book that never goes to sons — so sick mums\u2019 sons are affected, and dads can never hand it to their boys. Mitochondrial recipes live ONLY in mum\u2019s kitchen (the egg), so mum passes it to everyone and dad to no one.',
    firstPrinciples: [
      'Start with what gametes can carry: autosome pairs (22, both sexes) vs the X/Y pair (father decides sex; sons get Y from father, X from mother) — this asymmetry alone generates every pedigree signature.',
      'AUTOSOMAL DOMINANT: one mutated allele expresses. Signatures — vertical transmission, male-to-male possible, both sexes affected, ~50% of children affected. Variable expressivity & incomplete penetrance complicate it. Classics: Huntington disease, Marfan, neurofibromatosis, adult polycystic kidney disease.',
      'AUTOSOMAL RECESSIVE: both alleles mutated. Signatures — horizontal pattern (siblings), skipped generations, unaffected parents, 25% recurrence per pregnancy, consanguinity raises risk. Classics: cystic fibrosis, sickle cell, thalassaemias, PKU.',
      'X-LINKED RECESSIVE: males (XY) express with one copy. Signatures — no father-to-son, affected males clustered through CARRIER mothers, females usually carriers (a female needs both X\u2019s mutated — rare, unless Turner or skewed inactivation). Classics: Duchenne muscular dystrophy, haemophilia A/B, G6PD deficiency, fragile X (technically dominant-ish/X-linked with unusual inheritance).',
      'X-LINKED DOMINANT: one copy in a female suffices. Signature — affected fathers transmit to ALL daughters, NO sons (sons get the Y). Classics: Rett syndrome (usually de novo), vitamin-D–resistant rickets, incontinentia pigmenti (usually lethal in males).',
      'MITOCHONDRIAL (maternal): mitochondria come almost entirely from the egg. Signatures — mother transmits to all offspring, fathers never do; severity varies with HETEROPLASMY (mix of mutant/normal mitochondria per cell). Classics: MELAS, MERRF, LHON.',
      'Complicating layers worth naming (not memorising blindly): anticipation (worse/earlier in generations — trinucleotide repeats, e.g. Huntington), imprinting (parent-of-origin effects — Prader–Willi vs Angelman from the same 15q11-13 region), de novo mutations (no family history at all — achondroplasia often).',
    ],
    normal: 'Recurrence-risk anchors: AD 50% per child; AR 25% affected, 50% carriers; XLR — sons of a carrier 50% affected, daughters 50% carriers; mitochondrial — all children at risk from an affected mother, none from an affected father.',
    mechanism: 'Why skipped generations happen: recessives hide in carriers (one good copy masks the bad). Why penetrance varies: modifier genes, environment, and in dominant trinucleotide diseases the repeat length grows across generations (anticipation) — molecular explanations for pedigree "noise".',
    differentials: [
      { name: 'AD vs XLD', key: 'male-to-male transmission settles it — possible in AD, impossible in any X-linked pattern' },
      { name: 'AR vs XLR', key: 'if affected MALES only across generations with no father-to-son → XLR; affected siblings of both sexes with unaffected parents → AR' },
      { name: 'Mitochondrial vs everything else', key: 'father-to-child transmission rules it OUT; all-or-none maternal transmission with variable severity points IN' },
    ],
    mistakes: [
      'Claiming X-linked fathers can pass disease to sons — biologically impossible via the X; any stem showing father-to-son transmission is NOT X-linked.',
      'Reading "skipped generation" as dominant with poor penetrance automatically — first consider recessive; penetrance is the fallback, not the default.',
      'Forgetting consanguinity: first-cousin parents massively raise recessive risk — a pedigree clue examiners include deliberately.',
    ],
    examRelevance: 'Two formats dominate: "what is the inheritance pattern?" from a pedigree, and "what is the risk to the next child?" — both solved by the four signatures above. Syndrome-list matching (which disease is AD/AR/XLR) is the memory half.',
    clinicalRelevance: 'Genetic counselling sessions run on these numbers; thalassaemia and sickle-carrier screening programmes are AR logic at population scale; family-history taking is pedigree logic at the bedside.',
    analogies: [
      'Pedigrees are recipe books: one-copy recipes (dominant) cook every generation; two-copy recipes (recessive) skip until two carriers meet.',
      'The X chromosome is mum\u2019s book that never goes to sons — any "father-to-son" recipe proves the page is elsewhere.',
    ],
    crossLinks: [
      { label: 'Trisomies 21/18/13 (Genetics)', why: 'Chromosomal (whole-chromosome) disease — the other half of the genetics tree.', subject: 'Genetics' },
      { label: 'Haemoglobinopathies (Medicine)', why: 'Sickle/thalassaemia are AR counselling archetypes.', subject: 'Medicine' },
      { label: 'Duchenne & neuromuscular disease (Paediatrics)', why: 'The X-linked recessive flagship family.', subject: 'Paediatrics' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Biology — Mendelian inheritance and pedigrees chapters'),
      ncbiRef('Genetics reference materials — NCBI Bookshelf, inheritance patterns'),
      hmxRef('HMX genetics content on inheritance and counselling logic'),
    ],
  },

  {
    id: 'c2-genetics-trisomies',
    name: 'Trisomies 21, 18 & 13',
    kind: 'disease',
    oneLiner: 'Three autosomal trisomies are compatible with life to varying degrees — 21 (Down), 18 (Edwards) and 13 (Patau) — each with its own recognisable physical signature, from an extra chromosome 21, 18 or 13.',
    whyMatters: 'Down syndrome is the most common chromosomal disorder and every specialty touches it: screening in obstetrics, cardiac defects in paediatrics, thyroid and coeliac associations in medicine. The other two trisomies are the classic "which severe syndrome is this?" discriminators.',
    explain30s: 'Most trisomies arise from nondisjunction — a chromosome pair fails to separate during egg (usually) or sperm formation, leaving an extra copy. Trisomy 21 (Down, ≈1 in 700 live births — the classic teaching figure) brings characteristic facies, hypotonia, intellectual disability, and a distinctive associations list: atrioventricular-septal defects, duodenal atresia, early Alzheimer-type changes, leukaemia risk, thyroid disease. Trisomy 18 (Edwards, ≈1 in 5,000) — growth retardation, clenched fists with overlapping fingers, rocker-bottom feet; most don\u2019t survive the first year. Trisomy 13 (Patau, ≈1 in 10,000) — cleft lip/palate, polydactyly, holoprosencephaly-spectrum brain/eye defects. Risk of all three rises with maternal age; screening has shifted from age thresholds to combined/cell-free-DNA approaches.',
    eli5: 'Chromosomes come in pairs, like shoes. Sometimes a cell-pack accidentally includes three of one kind — three left shoes, no matching right. Having three copies of chromosome 21\u2019s "instructions" over-reads those genes: development follows a slightly different plan (Down syndrome). Three copies of 18 or 13 over-read much bigger instruction sets, so organs form with more severe differences. The extra copy usually appears by accident during egg-making — and the chance of that packing error climbs as mothers get older, which is why pregnancy screening focuses on it.',
    firstPrinciples: [
      'Mechanism first: meiotic NONDISJUNCTION — homologous chromosomes (or sister chromatids) fail to separate → gamete with an extra chromosome → zygote with 47. For trisomy 21 the large majority arise in maternal meiosis I, and risk rises steeply with maternal age (classic teaching) — the reason screening is maternal-age-aware.',
      'Mosaicism & translocation variants (Down): ~small% are translocations (14;21 Robertsonian — recurrence/genetic-counselling implications, can run in families) or mosaics (some cells normal — often milder). The chromosome change, not the "label", sets severity.',
      'Trisomy 21 — Down (≈1/700 live births): hypotonia + upslanting palpebral fissures, epicanthic folds, single palmar (simian) crease, intellectual disability (variable). Association list that writes exam questions: AV-septal defect (most characteristic cardiac lesion), duodenal atresia (double-bubble), Hirschsprung, hypothyroidism, coeliac disease, ALL/AML (esp. acute megakaryoblastic leukaemia) risk, early-onset Alzheimer-type pathology.',
      'Trisomy 18 — Edwards (≈1/5,000): severe growth restriction, micrognathia, low-set ears, clenched fists with overlapping fingers, rocker-bottom feet, organ defects; survival beyond the first year is uncommon (classic teaching) — care conversations centre on comfort.',
      'Trisomy 13 — Patau (≈1/10,000): midline defects — cleft lip/palate, polydactyly, microphthalmia/anophthalmia, holoprosencephaly-spectrum, cardiac and renal anomalies; similarly severe early-life outcomes.',
      'Screening logic (obstetrics): first-trimester combined test (nuchal translucency + β-hCG/PAPP-A), second-trimester quadruple screen, non-invasive cell-free DNA (analyses fetal placental DNA in maternal blood — highly sensitive for 21), and diagnostic confirmation by karyotype/chorionic villus/amniocentesis when a screening test is positive — screening ESTIMATES risk; karyotype DIAGNOSES.',
      'Why age & why recombination: egg cells pause in meiosis for decades before ovulation — long pause, more nondisjunction opportunities. That single fact connects the epidemiology (maternal-age effect) to the cell biology.',
    ],
    normal: 'Human karyotype: 46 chromosomes (22 autosome pairs + sex chromosomes). Aneuploidy = an abnormal chromosome number; trisomy = one extra (47). Most autosomal trisomies are lost early in pregnancy — only 21, 18 and 13 commonly reach live birth, which itself reflects gene-dose tolerance.',
    mechanism: 'Gene dosage: three copies of a chromosome over-express hundreds of genes simultaneously — Down\u2019s phenotype is the summed over-reading of chromosome-21 genes (including amyloid-precursor-protein dosage, the classical teaching link to early Alzheimer-type changes). Smaller chromosomes 21 vs larger 18/13 explains the severity gradient.',
    numbers: [
      { label: 'Trisomy 21 (Down) incidence', value: '≈ 1 in 700 live births (classic teaching)', note: 'most common chromosomal disorder; rises steeply with maternal age' },
      { label: 'Trisomy 18 (Edwards) incidence', value: '≈ 1 in 5,000 live births', note: 'severe; most affected do not survive the first year' },
      { label: 'Trisomy 13 (Patau) incidence', value: '≈ 1 in 10,000 live births', note: 'midline-defect signature (cleft lip/palate, polydactyly)' },
    ],
    differentials: [
      { name: 'Down (T21)', key: 'hypotonia + characteristic facies + AV-septal defect + duodenal atresia cluster' },
      { name: 'Edwards (T18)', key: 'clenched overlapping fists + rocker-bottom feet + severe growth restriction' },
      { name: 'Patau (T13)', key: 'midline invasion: cleft lip/palate + polydactyly + holoprosencephaly spectrum' },
    ],
    mistakes: [
      'Saying "risk of Down syndrome = risk of having ANY affected child for that woman" — screening modifies; maternal-age risk is per-pregnancy at that age.',
      'Assuming all Down syndrome is pure trisomy — translocation (14;21) cases carry family-recurrence implications and deserve karyotype-level counselling.',
      'Treating a positive SCREEN as a diagnosis — cfDNA and serum screens estimate probability; karyotype/QF-PCR confirms.',
    ],
    examRelevance: 'Feature-matching across the three trisomies, maternal-age effect reasoning, association lists (AV-canal defect + duodenal atresia in T21), and screening-vs-diagnostic test logic in obstetrics.',
    clinicalRelevance: 'Newborn examination (creases, tone, facies), cardiac evaluation for every confirmed case, thyroid/coeliac surveillance over the lifespan, and antenatal counselling where screening pathways differ by country.',
    analogies: [
      'Chromosomes are shoe-pairs: a trisomy is three of one shoe — the "instructions" get read three times, and the bigger the shoe-box (chromosome), the bigger the disruption.',
      'Screening is a smoke detector (probability); karyotyping is walking into the room (proof).',
    ],
    crossLinks: [
      { label: 'Heart embryogenesis (Embryology)', why: 'AV-canal defects in T21 are endocardial-cushion failures — the cushion connection.', subject: 'Embryology' },
      { label: 'Inheritance patterns (Genetics)', why: 'Nondisjunction vs Mendelian inheritance — chromosomal vs gene-level disease.', subject: 'Genetics' },
      { label: 'Antenatal screening (Obstetrics)', why: 'Combined/quad/cfDNA pathways apply this risk logic.', subject: 'Obstetrics & Gynaecology' },
    ],
    global: [
      {
        region: 'India',
        screening: 'Antenatal screening pathways in India vary widely by sector — public programmes commonly use second-trimester serum screening where first-trimester/cfDNA access is limited; awareness of Down syndrome and support systems are growing through parent organisations.',
        terminology: ['RBSK — Rashtriya Bal Swasthya Karyakram (child screening programme, includes developmental screening)'],
        note: 'Access determines which screening step is offered — the biology is identical.',
      },
      {
        region: 'United States',
        screening: 'US practice offers cell-free DNA screening broadly (ACOG-endorsed patient-choice model) with diagnostic confirmation offered after positive screens; maternal age alone is no longer the gatekeeper.',
        note: 'A choice-architecture difference, not a science difference.',
      },
      {
        region: 'United Kingdom',
        screening: 'The NHS offers first-trimester combined screening within a defined antenatal pathway, with cfDNA rolling out as a follow-on test after higher-risk results.',
        note: 'A sequenced public-programme pathway — same tests, different ordering.',
      },
      {
        region: 'WHO/Global',
        screening: 'WHO frames congenital-anomaly care around equitable access to early detection, family support and management of correctable defects (e.g. cardiac surgery for Down-related lesions) rather than screening technology alone.',
        terminology: ['Congenital anomalies — WHO umbrella term for birth defects'],
        note: 'The global conversation centres on access and inclusion as much as detection.',
      },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Biology — chromosomal disorders and nondisjunction sections'),
      ncbiRef('Reference materials on trisomy 21, 18 and 13 (NCBI Bookshelf/GHR)'),
      cdcRef('Data and materials on birth defects — Down syndrome'),
      whoRef('Congenital anomalies fact sheet and guidance'),
    ],
  },

  // ═══════════════════════════ IMMUNOLOGY (3) ══════════════════════════════

  {
    id: 'c2-immunology-innate-adaptive',
    name: 'Innate vs Adaptive Immunity',
    kind: 'principle',
    oneLiner: 'The immune system has two tiers: a fast, generic first responder (innate) and a slower, targeted specialist that learns and remembers (adaptive).',
    whyMatters: 'Every vaccine, every transplant-rejection story, every immunodeficiency pattern and every autoimmune disease is this two-tier division doing too much or too little. It is the single most load-bearing concept in immunology.',
    explain30s: 'Innate immunity acts within minutes to hours and recognises generic microbial patterns (PAMPs) with fixed receptors: skin and mucosa as barriers, phagocytes (neutrophils, macrophages), natural-killer cells, complement and inflammation. It has no memory. Adaptive immunity activates over days: lymphocytes with unique receptors (B cells → antibodies, T cells → helper/cytotoxic functions) recognise specific antigens, multiply clonally, and leave memory cells behind — faster, stronger responses on re-encounter. The innate system also teaches the adaptive one (antigen presentation). One system buys time; the other wins the war and remembers it.',
    eli5: 'Picture a castle. The innate system is the wall, the moat and the guard dogs — ready instantly, attack anything suspicious the same way every time, and never learn. The adaptive system is the royal detective agency: slow to start (days), but it studies the intruder, builds a custom weapon (antibody), and keeps case files (memory) — so the second visit by the same villain ends within hours. Vaccines are training dossiers: they show the detectives a harmless photo of the villain so real case files exist before the real attack.',
    firstPrinciples: [
      'Speed vs specificity is the organising trade-off: innate = minutes–hours, pattern-level recognition, no memory; adaptive = days for first response, antigen-specific, memory for life (or years).',
      'Innate recognition: PRRs (pattern-recognition receptors, e.g. Toll-like receptors) bind PAMPs (microbe-only patterns — bacterial wall components, viral nucleic acids). Fixed germline receptors — the same for every invader of that class.',
      'Innate effector cast: barriers (skin/mucus/acid), neutrophils (first phagocytes in), macrophages (phagocytose + present antigen), NK cells (kill virus-infected/"missing-self" cells), complement (cascade → opsonisation, inflammation, membrane attack), and the inflammatory program itself (cytokines, fever, acute-phase response).',
      'Adaptive recognition: B-cell receptors/antibodies and T-cell receptors are generated randomly (gene rearrangement — V(D)J) → an astronomically diverse receptor library; clonal selection expands only the cells whose receptor fits the current antigen.',
      'Adaptive effectors: B cells → plasma cells → ANTIBODIES (neutralise, opsonise, complement-fix); CD4⁺ helper T cells (orchestrators — Th1/Th2/Th17 lineages); CD8⁺ cytotoxic T cells (kill infected cells directly, MHC-I restricted).',
      'The handover: innate antigen-presenting cells (dendritic cells, macrophages) digest the invader and DISPLAY peptides on MHC to T cells — with costimulation signals that decide "respond" vs "tolerate". Without costimulation, tolerance — the logic vaccines and autoimmunity both exploit.',
      'Memory: after a first encounter, long-lived memory B/T cells persist; second encounter is faster and stronger — the biological basis of vaccination and of "second infection is milder".',
    ],
    normal: 'Baselines: innate response begins within minutes to hours; adaptive primary response takes ~a week or more; secondary responses peak in days. Antibody classes: IgM first (primary), IgG dominant in secondary responses (classic teaching).',
    mechanism: 'MHC restriction is the key logic: MHC-I displays intracellular peptides to CD8⁺ T cells (all nucleated cells); MHC-II displays extracellular peptides to CD4⁺ helpers (professional APCs only). This division is why viruses must be fought INSIDE cells (CD8⁺) while bacteria are fought outside (antibodies, complement) — and why transplant matching is MHC (HLA) matching.',
    numbers: [
      { label: 'Innate response window', value: 'minutes–hours', note: 'barriers, complement, phagocytes act immediately' },
      { label: 'Primary adaptive response', value: '≈ 1–2 weeks to peak', note: 'naive lymphocyte activation + clonal expansion' },
      { label: 'Secondary adaptive response', value: 'faster & stronger (days)', note: 'memory cells — the vaccine principle' },
    ],
    differentials: [
      { name: 'Innate failure', key: 'recurrent pyogenic/catalase-positive infections, no memory — e.g. neutrophil defects (CGD), complement deficiencies' },
      { name: 'Adaptive failure', key: 'opportunistic infections (viruses, fungi) and poor vaccine responses — T-cell deficits (DiGeorge, SCID), antibody deficits (XLA, CVID)' },
      { name: 'Over-response', key: 'autoimmunity (loss of self-tolerance) or hypersensitivity (excessive responding) — the same two tiers misfiring' },
    ],
    mistakes: [
      'Saying the innate system "has no specificity at all" — it is specific to PATTERN CLASSES (PAMPs), just not to unique antigens.',
      'Thinking antibodies themselves kill pathogens directly — antibodies TAG (neutralise/opsonise/complement-fix); effectors do the killing.',
      'Forgetting the handover: without innate antigen presentation + costimulation, the adaptive system does not launch — and may be tolerised instead.',
    ],
    examRelevance: 'Comparison-table questions (speed, receptors, memory), cell-function matching (NK = missing-self, dendritic = professional APC), MHC-I vs MHC-II logic, and vaccine-principle explanations.',
    clinicalRelevance: 'Vaccination schedules, transplant HLA matching, immunodeficiency workups and adjuvant logic (adjuvants deliberately trigger innate costimulation) all sit on this framework.',
    analogies: [
      'Castle defence: walls and guard dogs (innate) buy time; the detective agency with case files (adaptive) wins and remembers.',
      'Vaccines are training dossiers shown to the detectives before the villain\u2019s real visit.',
    ],
    crossLinks: [
      { label: 'Hypersensitivity reactions (Immunology)', why: 'What happens when the adaptive tier over-responds.', subject: 'Immunology' },
      { label: 'Immunodeficiency states (Immunology)', why: 'What each tier\u2019s absence looks like in infections.', subject: 'Immunology' },
      { label: 'Vaccines & immunisation (Community Medicine)', why: 'Memory is the product vaccines deliver.', subject: 'Community Medicine' },
    ],
    global: [
      {
        region: 'India',
        training: 'Indian curricula (CBME) teach immunity across Microbiology and Pathology with foundation-phase immunology sessions; the Universal Immunisation Programme is the applied memory of this lesson at population scale.',
        terminology: ['UIP — Universal Immunisation Programme (India)'],
        note: 'Same science; the delivery system differs.',
      },
      {
        region: 'United States',
        training: 'US students meet innate/adaptive distinctions in pre-clinical immunology modules; Step exams test cytokine and cell-function matching directly.',
        note: 'Sequenced around licensing exams rather than integrated postings.',
      },
      {
        region: 'United Kingdom',
        training: 'UK curricula introduce immunology within infection & immunity blocks; terminology follows the same IUIS-style framework (innate/adaptive, MHC/HLA).',
        terminology: ['HLA — human leukocyte antigen (UK term for MHC in practice)'],
        note: 'MHC (mouse/classic) vs HLA (human/clinical) is a naming, not a concept, difference.',
      },
      {
        region: 'WHO/Global',
        screening: 'WHO\u2019s Expanded Programme on Immunisation is the global frame for adaptive-memory delivery — vaccine coverage remains among the highest-impact public-health metrics worldwide.',
        note: 'The strongest population-level application of immunological memory.',
      },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 5,
    globalRelevance: 'universal',
    sources: [
      staxRef('Microbiology / Biology — adaptive and innate immune response chapters'),
      hmxRef('HMX immunology content on innate and adaptive immunity'),
      ncbiRef('Review literature on immune system organisation'),
      whoRef('Immunisation coverage and EPI framing'),
    ],
  },

  {
    id: 'c2-immunology-hypersensitivity',
    name: 'Hypersensitivity Reactions I–IV',
    kind: 'process',
    oneLiner: 'Hypersensitivity is the immune system damaging the very body it protects — four mechanisms (ACID), each with its own timing, mediators and classic disease examples.',
    whyMatters: 'Anaphylaxis, transfusion reactions, autoimmune diseases and transplant rejection are all hypersensitivity. The ACID framework converts a sprawling allergy chapter into one table — and the type-I story links directly to emergency adrenaline.',
    explain30s: 'Type I (Allergy): IgE-coated mast cells re-firing on allergen exposure — minutes, histamine-driven, from hay fever to anaphylaxis. Type II (Cytotoxic): antibodies (IgM/IgG) bind antigens ON cells and call complement or phagocytes — transfusion reactions, haemolytic disease of the newborn, Goodpasture. Type III (Immune-complex): antibody-antigen complexes deposit in tissues and inflame them — serum sickness, post-streptococcal glomerulonephritis. Type IV (Delayed): T-cell mediated, no antibodies, peaks 48–72 hours — contact dermatitis, TB skin test, transplant rejection components. Timing is the tell: minutes → I; immediate cytotoxic → II; complex-mediated days → III; delayed days → IV.',
    eli5: 'Think of the immune system as an over-enthusiastic security team with four kinds of accidents. Type I: the alarm company (IgE-mast cells) overreacts to pollen and triggers a full building evacuation (histamine) within minutes. Type II: guards mistakenly tag a resident\u2019s own car (own cells) and the tow-trucks (complement) haul it away. Type III: security leaves a mess of broken tags and litter (immune complexes) clogging the building\u2019s drains (vessels/kidneys), which gets inflamed over days. Type IV: no guards involved — the detectives (T cells) arrive late (48–72 h) and set the building on fire to kill one intruder.',
    firstPrinciples: [
      'ACID — the master key: Allergy (I), Cytotoxic (II), Immune-complex (III), Delayed (IV). Types I–III are antibody-mediated; type IV is cell-mediated (T cells) — the cleanest dividing line in the chapter.',
      'TYPE I — IgE + mast cells: first exposure sensitises (IgE arms mast cells); re-exposure cross-links IgE → degranulation (histamine, leukotrienes) within MINUTES. Spectrum: allergic rhinitis, asthma, urticaria → anaphylaxis (systemic vasodilation + bronchospasm + laryngeal oedema). First-line emergency treatment: intramuscular ADRENALINE — reversal of the mediator storm, not an antihistamine.',
      'TYPE II — antibody vs CELL-BOUND antigen: IgM/IgG target antigens on cells → complement lysis or ADCC/phagocytosis. ABO-mismatched transfusion (instant intravascular haemolysis), haemolytic disease of the newborn (Rh), Goodpasture (anti-basement-membrane → lungs/kidneys), immune thrombocytopenia, some drug-induced haemolysis.',
      'TYPE III — antibody vs SOLUBLE antigen: immune complexes circulate, deposit in vessels/glomeruli/joints → complement-mediated inflammation DAYS later. Serum sickness, post-streptococcal glomerulonephritis, lupus nephritis component, Farmer\u2019s lung. The classic site rule: where the blood filters (kidneys, vessels, synovium).',
      'TYPE IV — T-cell delayed: sensitised T cells (CD4⁺ orchestrating macrophages, CD8⁺ killing) peak at 48–72 h — the only type transferable by CELLS, not serum. Contact dermatitis (nick, poison ivy), tuberculin skin test (PPD), granulomatous diseases (TB), and type-IV components of graft rejection.',
      'Timing & mediator table (the exam\u2019s real ask): onset (minutes / minutes–hours / days / 48–72 h), antibody vs T-cell, mediator (histamine / complement / complexes / cytokines-macrophages), example — four rows, done.',
      'Why adrenaline for type I: it reverses vasodilation and bronchospasm fast (α/β effects) — the mediator-level rescue; antihistamines and steroids are downstream/slow helpers. This is the classic cross-link between immunology classroom and emergency practice.',
    ],
    normal: 'Sensitisation is required for type I (first exposure makes IgE, later exposures react) — first-time anaphylaxis to a drug usually implies prior silent exposure. Type-IV testing (PPD) reads at 48–72 h — neither earlier nor later.',
    mechanism: 'The common soil: all four are exaggerated responses to normally-tolerated antigens. Atopy runs in families (IgE bias); type-II/III depend on where antigen sits (cell-bound vs soluble); type-IV granulomas are persistent-antigen T-cell/macrophage standoffs — same immune logic, different targets.',
    numbers: [
      { label: 'Type I onset', value: 'minutes (re-exposure)', note: 'mast-cell degranulation — the anaphylaxis clock' },
      { label: 'Type IV peak', value: '48–72 hours', note: 'delayed-type hypersensitivity — PPD reading window' },
      { label: 'Type III window', value: '≈ 1–2 weeks after antigen exposure (e.g. serum sickness)', note: 'immune-complex formation + deposition takes days' },
    ],
    differentials: [
      { name: 'Type I — anaphylaxis', key: 'minutes after exposure: hypotension + bronchospasm + urticaria → IM adrenaline FIRST' },
      { name: 'Type II — transfusion reaction', key: 'fever + back pain + haemoglobinuria during transfusion — stop transfusion, ABO mismatch logic' },
      { name: 'Type III — serum sickness', key: 'fever, rash, arthralgia, proteinuria ~1–2 weeks after antigen (sera, some drugs)' },
      { name: 'Type IV — contact dermatitis', key: 'eczematous rash 48–72 h after skin contact (nickel, plants); patch-test logic' },
    ],
    mnemonics: [
      { hook: 'ACID', expands: 'Allergy (I), Cytotoxic (II), Immune-complex (III), Delayed (IV) — the four hypersensitivity types at a glance.' },
      { hook: '"1st = Fast, 4th = Late"', expands: 'type I is minutes (histamine), type IV peaks at 48–72 h (T cells) — timing separates I from IV when mechanisms blur.' },
    ],
    mistakes: [
      'Reaching for antihistamines first in anaphylaxis — IM adrenaline is the first-line drug; antihistamines/steroids are adjuncts (classic, safety-critical exam point).',
      'Calling the TB skin test type III — it is type IV (delayed, T-cell); any reaction peaking at 48–72 h is type-IV territory.',
      'Assuming type II needs complement always — some type-II injury is antibody-dependent cellular cytotoxicity or functional blocking/receptor stimulation (e.g. Graves\u2019 TSH-receptor stimulation is classically taught as a type-II variant).',
    ],
    examRelevance: 'Type-matching vignettes (transfusion reaction → II; serum sickness → III; PPD → IV; anaphylaxis → I), the ACID mnemonic itself, and adrenaline-first sequencing questions.',
    clinicalRelevance: 'Allergy testing (skin-prick = type I; patch = type IV), blood-bank crossmatching (type-II prevention), and anaphylaxis first-aid training all apply this framework — verify current emergency protocols locally.',
    verifyNote: 'Emergency management specifics evolve — verify adrenaline dosing/routes against current guidelines and local protocols.',
    analogies: [
      'Four security accidents: over-alarming alarm (I), tagging your own cars (II), clogging drains with tag-litter (III), late detectives torching the building (IV).',
      'Adrenaline in anaphylaxis is the building\u2019s master reset — it undoes the evacuation alarm itself, not the dust that triggered it.',
    ],
    crossLinks: [
      { label: 'Adrenaline / anaphylaxis management (Emergency Medicine)', why: 'Type-I physiology is the reason adrenaline is first-line.', subject: 'Emergency Medicine' },
      { label: 'Transfusion & blood groups (Physiology/Pathology)', why: 'ABO/Rh logic is type-II hypersensitivity in daily practice.', subject: 'Pathology' },
      { label: 'Glomerulonephritis (Pathology)', why: 'Post-streptococcal GN is the classic type-III deposit disease.', subject: 'Pathology' },
    ],
    global: [
      {
        region: 'India',
        terminology: ['Adrenaline (INN-style naming in India)', 'Anaphylaxis kits in primary centres'],
        workflow: 'Indian guidelines and teaching follow the WHO/INN convention "adrenaline"; emergency teaching emphasises IM adrenaline via standard tuberculin-style technique in the anterolateral thigh.',
        note: 'Same drug, same urgency — naming conventions differ by region.',
      },
      {
        region: 'United States',
        terminology: ['Epinephrine (USAN)', 'EpiPen-style autoinjectors'],
        workflow: 'US practice and labelling use "epinephrine"; autoinjector prescribing for known anaphylaxis-prone patients is a routine outpatient step.',
        note: 'The classic UK/India "adrenaline" vs US "epinephrine" split — one molecule, two names.',
      },
      {
        region: 'United Kingdom',
        terminology: ['Adrenaline (UK naming)', 'Resuscitation Council UK anaphylaxis algorithm'],
        workflow: 'UK algorithms sequence IM adrenaline first, then IV fluids, with antihistamines/steroids as second-line adjuncts — a widely copied teaching sequence.',
        note: 'Algorithm-first training culture; nomenclature follows UK convention.',
      },
      {
        region: 'WHO/Global',
        delivery: 'WHO\u2019s Model List of Essential Medicines includes adrenaline as the anaphylaxis essential — a reminder that the first-line drug must be physically available where hypersensitivity lives.',
        note: 'Availability framing: the best emergency protocol is one the local pharmacy can supply.',
      },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    sources: [
      staxRef('Microbiology / Biology — hypersensitivity and allergy chapters'),
      ncbiRef('Review literature on hypersensitivity mechanisms'),
      cdcRef('Vaccine-reaction and allergy reference materials'),
      whoRef('Model List of Essential Medicines — adrenaline'),
    ],
  },

  {
    id: 'c2-immunology-immunodeficiencies',
    name: 'Immunodeficiency States',
    kind: 'disease',
    oneLiner: 'When one arm of immunity fails, the infecting organisms themselves announce which arm failed — a diagnostic logic you can read straight from the infection pattern.',
    whyMatters: 'From a baby with recurrent pneumonia to an adult with thrush, immunodeficiency thinking turns "recurrent infections" into a precise differential — and it is the framework behind HIV medicine, transplant immunology and SCID newborn-screening debates.',
    explain30s: 'The immune system has four arms: antibodies (B cells), T cells, phagocytes and complement. B-cell failure invites ENCAPSULATED bacteria (pneumococcus, Hib) and Giardia — recurrent sinopulmonary infections. T-cell failure invites VIRUSES, FUNGI and opportunists (Candida, Pneumocystis, CMV). Combined failure (SCID) is the worst of both in infancy. Phagocyte failure (chronic granulomatous disease) means catalase-positive organisms (Staph aureus, Serratia, Aspergillus) — the NBT test is negative. Terminal-complement failure means Neisseria (meningococcus). HIV specifically destroys CD4⁺ T cells — the conductor — so the whole orchestra weakens.',
    eli5: 'Imagine a city with four defence departments: border scanners (antibodies), special agents (T cells), street patrol (phagocytes) and the alarm system (complement). Each department, when it sleeps, lets a very specific gang in. Antibody patrol asleep → bacteria with thick coats (the "capsule gang") keep raiding the lungs. Special agents asleep → viruses and fungi throw parties everywhere. Street patrol asleep → only the toughest gang (staph) survives the streets. Alarm system asleep → one gang (meningococcus) walks straight into the bloodstream. The gang that keeps breaking in tells you which department is asleep.',
    firstPrinciples: [
      'The four arms & their favourite invaders: B cells/antibodies → encapsulated pyogens & Giardia; T cells → intracellular and opportunistic (viruses, fungi, mycobacteria); phagocytes → catalase-positive organisms; complement (esp. terminal C5–9) → Neisseria.',
      'B-cell/antibody defects: X-linked agammaglobulinaemia (Bruton — boys, no B cells, infections begin after maternal IgG fades ~6 months), CVID (later onset, low immunoglobulins, autoimmune overlap), selective IgA deficiency (commonest, often mild/sinusitis). Live-vaccine caution applies.',
      'T-cell defects: DiGeorge syndrome (22q11 deletion — thymus fails to develop; also cardiac outflow defects + hypocalcaemia from absent parathyroids — one deletion, three organs), IL-2 receptor defects → SCID ("bubble boy" — combined B+T because T-cells orchestrate B-cells too).',
      'Phagocyte defects: chronic granulomatous disease (NADPH-oxidase failure — neutrophils ingest but cannot produce the respiratory burst); CATALASE-POSITIVE organisms thrive (they neutralise the little peroxide made) — S. aureus, Serratia, Nocardia, Aspergillus; NBT (nitroblue tetrazolium) test turns negative. Leukocyte-adhesion deficiency → delayed cord separation, no pus.',
      'Complement defects: early components → immune-complex/SLE-like disease; C3 → severe pyogenic infections; terminal C5–C9 (MAC) → recurrent Neisseria meningitis/sepsis.',
      'HIV (the acquired archetype): targets CD4⁺ helper T cells — the conductor — so Opportunists (Pneumocystis pneumonia, CMV, Candida, TB reactivation, Kaposi sarcoma via HHV-8) define the AIDS stage; ART restores counts and changes outcomes.',
      'Secondary immunodeficiency is the commoner category in practice: malnutrition, diabetes, steroids/chemotherapy, splenectomy (encapsulated organisms again — the vaccination logic of post-splenectomy care) — always ask "is this immune system born tired, drugged, or fed badly?"',
    ],
    normal: 'Maternal IgG crosses the placenta and protects the infant for roughly the first months; the physiological "IgG trough" around 3–6 months explains why XLA presents after maternal antibodies fade. Newborn SCID screening (T-cell-receptor excision circles) exists in several countries.',
    mechanism: 'The unifying principle: the INFECTION PATTERN localises the DEFECT. Encapsulated bacteria need antibody-opsonisation (hence B-cell failure); intracellular organisms need T-cell killing (hence T-cell failure); catalase-positive organisms need the respiratory burst (hence CGD); Neisseria needs the membrane-attack complex (hence terminal-complement failure). Each organism choice is a physiology lesson in disguise.',
    differentials: [
      { name: 'X-linked agammaglobulinaemia (Bruton)', key: 'male infant >6 months, recurrent sinopulmonary/Giardia infections, absent tonsils/B cells' },
      { name: 'DiGeorge syndrome (22q11.2)', key: 'T-cell deficit + cardiac outflow defects + hypocalcaemia (3rd/4th pouch failure) — one deletion, three systems' },
      { name: 'Chronic granulomatous disease', key: 'recurrent abscesses by catalase-positive organisms; NBT test negative' },
      { name: 'Terminal complement deficiency', key: 'recurrent Neisseria meningitis/sepsis — ask for family history of the same' },
    ],
    mistakes: [
      'Listing CGD organisms without the CATALASE logic — catalase-positive (S. aureus, Serratia, Nocardia, Aspergillus) is the memorable, examinable pattern; NBT negative seals it.',
      'Forgetting that T-cell failure weakens B-cell function too — helper T cells orchestrate antibody class-switching, so "pure T-cell" deficits show antibody problems as well.',
      'Missing secondary immunodeficiency: steroid-treated, diabetic or splenectomised patients have predictable vulnerabilities — encapsulated organisms first.',
    ],
    examRelevance: 'The classic format is a vignette with recurrent infections + organism list → "which defect?" Reverse format (defect → likely organism) is equally common. DiGeorge\u2019s triad and CGD\u2019s NBT are the two highest-frequency details.',
    clinicalRelevance: 'SCID is a paediatric emergency (avoid live vaccines, irradiated blood, early transplant decision); post-splenectomy vaccination is immunodeficiency-logic applied daily; HIV testing guidelines hinge on recognising the CD4-driven opportunism pattern.',
    crossLinks: [
      { label: 'HIV/AIDS (Microbiology)', why: 'The acquired T-cell immunodeficiency archetype — CD4 biology and opportunism.', subject: 'Microbiology' },
      { label: 'Innate vs adaptive immunity (Immunology)', why: 'Each deficiency is one arm of this framework switched off.', subject: 'Immunology' },
      { label: 'Vaccination in special groups (Community Medicine)', why: 'Live-vaccine caution and post-splenectomy schedules follow these defects.', subject: 'Community Medicine' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    sources: [
      staxRef('Microbiology — immunodeficiency and immune system disorders chapters'),
      ncbiRef('Review literature on primary immunodeficiencies'),
      cdcRef('HIV-related opportunistic infection reference materials'),
      whoRef('Primary immunodeficiency and HIV guidance'),
    ],
  },
]

// ── LESSON → TOPIC HINTS ────────────────────────────────────────────────────
// The shared ConceptLesson type has no topicId field; the seeder resolves
// placement via this explicit map (additive runtime hint, contract untouched).
const LESSON_TOPICS: Record<string, string> = {
  // Anatomy (6)
  'c2-anatomy-heart-chambers-valves': 't-anat-heart',
  'c-brachial': 't-anat-brachial',
  'c-femoral': 't-anat-femoral',
  'c2-anatomy-inguinal-canal': 'anatomy-inguinal-canal',
  'c2-anatomy-thyroid-gland': 'anatomy-thyroid-gland',
  'c2-anatomy-diaphragm-openings': 'anatomy-diaphragm',
  // Physiology (7)
  'c-cardcycle': 't-phys-cardcycle',
  'c2-physiology-cardiac-action-potential': 'physiology-cardiac-electrophysiology',
  'c2-physiology-respiration-gas-exchange': 't-phys-lung',
  'c-raas': 't-phys-raas',
  'c2-physiology-gi-secretion': 'physiology-gi-secretion',
  'c-thyroidphys': 't-phys-thyroid',
  'c2-physiology-blood-pressure-regulation': 't-phys-raas',
  // Biochemistry (3)
  'c2-biochemistry-glycolysis-tca': 'biochemistry-glycolysis-tca',
  'c2-biochemistry-fasting-gluconeogenesis': 'biochemistry-fasting-metabolism',
  'c2-biochemistry-vitamins-deficiencies': 'biochemistry-vitamins',
  // Histology (2)
  'c2-histology-epithelium': 'histology-epithelium',
  'c2-histology-connective-tissue': 'histology-connective-tissue',
  // Embryology (2)
  'c2-embryology-heart-embryogenesis': 'embryology-heart-development',
  'c2-embryology-gi-rotation': 'embryology-gi-rotation',
  // Genetics (2)
  'c2-genetics-inheritance-patterns': 'genetics-inheritance-patterns',
  'c2-genetics-trisomies': 'genetics-trisomies',
  // Immunology (3)
  'c2-immunology-innate-adaptive': 'immunology-innate-adaptive',
  'c2-immunology-hypersensitivity': 'immunology-hypersensitivity',
  'c2-immunology-immunodeficiencies': 'immunology-immunodeficiency',
}

const lessonsWithTopics = lessons.map((l) => {
  const topicId = LESSON_TOPICS[l.id]
  if (!topicId || !topics.some((t) => t.id === topicId)) {
    throw new Error(`[pre-clinical pack] lesson ${l.id} has no valid topic hint (${topicId ?? 'none'})`)
  }
  return { ...l, topicId }
})

// ── CURRICULUM RECORD (1) ───────────────────────────────────────────────────
// Distinct scope from the registry's foundational NMC record (whole-MBBS), so
// both records coexist in the merged registry.

const curriculum: CurriculumRecord[] = [
  {
    authority: 'National Medical Commission (NMC)',
    country: 'India',
    scope: 'MBBS CBME pre-clinical phase — foundation subjects (anatomy, physiology, biochemistry, histology, embryology, genetics, immunology)',
    subjectsCovered: [
      'anatomy',
      'physiology',
      'biochemistry',
      'histology',
      'embryology',
      'genetics',
      'immunology',
    ],
    version: '2024 CBME',
    sourceUrl: 'https://www.nmc.org.in',
    lastReviewed: '2026-10-05',
    alignment: 'official-structure',
  },
]

// ── PACK ASSEMBLY ───────────────────────────────────────────────────────────
// Structurally matches registry's ContentPack: { packId, subjects, topics,
// lessons, curriculum }. 0 subjects (all 7 exist in taxonomy) · 24 topics ·
// 25 lessons · 1 record.

export const preClinicalPack = {
  packId: 'pre-clinical',
  subjects: [] as SubjectTaxonomy[],
  topics,
  lessons: lessonsWithTopics,
  curriculum,
}
