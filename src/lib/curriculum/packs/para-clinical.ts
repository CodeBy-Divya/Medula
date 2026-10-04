// ─── MEDULA — 'Para-clinical' content pack (Task 19-c) ──────────────────────
// Pathology · Pharmacology · Microbiology · Forensic Medicine & Toxicology ·
// Community Medicine.
//
// Self-contained pack. Imports ONLY the shared contracts — subjects live in
// taxonomy.ts / the DB already (all 5 para-clinical ids exist), so this pack
// declares NO subjects. Topics reuse the EXACT seeded DB topic ids wherever a
// matching topic exists (t-patho-*, t-pharm-*, t-micro-*, t-fmt-*, t-cm-*)
// and add new `${subjectId}-${slug}` topics for everything else.
// Concept lessons: new ids use the `c2-<subjectId>-<slug>` scheme. Seven
// lessons deliberately use EXISTING seeded concept ids (c-inflamm, c-neoplasia,
// c-cvpath-athero, c-acei, c-metformin, c-antitb, c-tb) — each genuinely
// covers that concept's core, so this enriches rather than duplicates.
//
// HONESTY RULES (pack-wide):
// - Educational content only — NEVER clinical advice. Management sections are
//   principles; doses quoted (emergency drugs) are well-established teaching
//   values always paired with a verifyNote pointing to local protocols.
// - Sources are references for attribution; nothing is reproduced from them.
//   Only the ten whitelisted institutions appear as sources.
// - No invented statistics. Every number is a standard, widely-published
//   teaching value; where practice varies we say so.

import type { ContentPack } from '../registry'
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

const whoRef = (title: string, sourceType: SourceType = 'guideline'): SourceRef => ({
  institution: 'World Health Organization (WHO)',
  title,
  url: 'https://www.who.int',
  sourceType,
  accessNote: REF_NOTE,
})

const cdcRef = (title: string): SourceRef => ({
  institution: 'U.S. Centers for Disease Control and Prevention (CDC)',
  title,
  url: 'https://www.cdc.gov',
  sourceType: 'health-organization',
  accessNote: REF_NOTE,
})

const ncbiRef = (title: string): SourceRef => ({
  institution: 'NIH / NCBI (PubMed Central)',
  title,
  url: 'https://www.ncbi.nlm.nih.gov',
  sourceType: 'database',
  accessNote: REF_NOTE,
})

const niceRef = (title: string): SourceRef => ({
  institution: 'NICE (National Institute for Health and Care Excellence, UK)',
  title,
  url: 'https://www.nice.org.uk',
  sourceType: 'guideline',
  accessNote: REF_NOTE,
})

const fdaRef = (title: string): SourceRef => ({
  institution: 'U.S. Food and Drug Administration (FDA)',
  title,
  url: 'https://www.fda.gov',
  sourceType: 'health-organization',
  accessNote: REF_NOTE,
})

const jhmiRef = (title: string): SourceRef => ({
  institution: 'Johns Hopkins Medicine',
  title,
  url: 'https://www.hopkinsmedicine.org',
  sourceType: 'hospital-reference',
  accessNote: REF_NOTE,
})

const hmxRef = (title: string): SourceRef => ({
  institution: 'Harvard Medical School (HMX online education)',
  title,
  url: 'https://hms.harvard.edu',
  sourceType: 'course',
  accessNote: REF_NOTE,
})

const mitRef = (title: string): SourceRef => ({
  institution: 'MIT OpenCourseWare',
  title,
  url: 'https://ocw.mit.edu',
  sourceType: 'open-courseware',
  accessNote: REF_NOTE,
})

const openStaxRef = (title: string): SourceRef => ({
  institution: 'OpenStax (Rice University)',
  title,
  url: 'https://openstax.org',
  sourceType: 'open-courseware',
  accessNote: REF_NOTE,
})

const nmcRef = (title: string): SourceRef => ({
  institution: 'National Medical Commission (NMC), India',
  title,
  url: 'https://www.nmc.org.in',
  sourceType: 'exam-authority',
  accessNote: REF_NOTE,
})

// ── TOPICS (28) ─────────────────────────────────────────────────────────────
// 12 reuse the EXACT seeded DB topic ids (names kept byte-identical to
// prisma/seed-data.ts; system tags filled with canonical SYSTEMS keys where
// the seed left them empty — legacy seeded tags 'hematology'/'infectious'
// are preserved as-is and folded by the registry alias layer).
// 16 new topics follow `${subjectId}-${slug}`.

const topics: TopicTaxonomy[] = [
  // ── Pathology — reused DB topics ──────────────────────────────────────────
  {
    id: 't-patho-inflamm',
    subjectId: 'pathology',
    name: 'Inflammation & Repair', // seeded DB name — keep byte-identical
    system: 'immune-infection',
    importance: 4,
    description:
      'Acute inflammation (vascular + cellular events, mediators, outcomes) and its chronic/granulomatous shift — the substrate of nearly every disease name you will ever learn.',
  },
  {
    id: 't-patho-neoplasia',
    subjectId: 'pathology',
    name: 'Neoplasia', // seeded DB name — keep byte-identical
    system: 'multisystem',
    importance: 4,
    description:
      'Benign vs malignant behaviour, nomenclature, hallmarks of cancer, invasion and the three metastasis routes, oncogenes vs tumour suppressors, tumour markers.',
  },
  {
    id: 't-patho-cvpath',
    subjectId: 'pathology',
    name: 'Cardiovascular Pathology', // seeded DB name — keep byte-identical
    system: 'cardiovascular',
    importance: 5,
    description:
      'The structural substrate of cardiology — atherosclerosis from endothelial injury to complicated plaque, and the lesions behind ischaemia, infarction and aneurysm.',
  },
  {
    id: 't-patho-hemapath',
    subjectId: 'pathology',
    name: 'Haematology', // seeded DB name — keep byte-identical
    system: 'hematology', // legacy seeded tag — folded to 'haematology' by registry alias
    importance: 5,
    description:
      'Red cells and white cells gone wrong — the MCV-based anaemia workup and the acute-vs-chronic leukaemia logic with their defining cytogenetics.',
  },
  // ── Pathology — new topics ────────────────────────────────────────────────
  {
    id: 'pathology-cell-injury',
    subjectId: 'pathology',
    name: 'Cell Injury, Adaptation & Necrosis',
    system: 'multisystem',
    importance: 5,
    description:
      'The grammar of disease — reversible vs irreversible injury, the six necrosis types with their organ signatures, apoptosis, and serum enzyme fingerprints.',
  },
  {
    id: 'pathology-thyroid',
    subjectId: 'pathology',
    name: 'Thyroid Pathology',
    system: 'endocrine',
    importance: 4,
    description:
      'Goitre, thyroiditis patterns (Hashimoto, de Quervain), Graves hyperplasia, and the four thyroid carcinomas — nuclei, spread routes and prognosis.',
  },
  {
    id: 'pathology-liver',
    subjectId: 'pathology',
    name: 'Liver Pathology & Cirrhosis',
    system: 'hepatic',
    importance: 5,
    description:
      'Fibrosis + regenerative nodules = cirrhosis — portal hypertension, hepatocellular failure, and the complications that dominate medicine and surgery wards.',
  },
  // ── Pharmacology — reused DB topics ───────────────────────────────────────
  {
    id: 't-pharm-antibio',
    subjectId: 'pharmacology',
    name: 'Antibiotics', // seeded DB name — keep byte-identical
    system: 'infectious', // legacy seeded tag — folded to 'immune-infection' by registry alias
    importance: 5,
    description:
      'Antibiotics organised by mechanism — cell-wall agents, the 30S/50S ribosome story, DNA and folate saboteurs — with the classic adverse-effect table.',
  },
  {
    id: 't-pharm-cardio',
    subjectId: 'pharmacology',
    name: 'Cardiovascular Drugs', // seeded DB name — keep byte-identical
    system: 'cardiovascular',
    importance: 5,
    description:
      'Drugs that steer blood pressure and the heart — ACE inhibitors, ARBs, calcium-channel blockers, beta-blockers, diuretics — mechanisms, compelling indications and traps.',
  },
  {
    id: 't-pharm-endo',
    subjectId: 'pharmacology',
    name: 'Endocrine Drugs', // seeded DB name — keep byte-identical
    system: 'endocrine',
    importance: 4,
    description:
      'Metformin and the antidiabetic ladder, insulin types by time-course, and the logic that connects each drug class to glucose physiology.',
  },
  // ── Pharmacology — new topics ─────────────────────────────────────────────
  {
    id: 'pharmacology-kinetics',
    subjectId: 'pharmacology',
    name: 'Pharmacokinetics (ADME)',
    system: 'multisystem',
    importance: 5,
    description:
      'What the body does to the drug — absorption, bioavailability, distribution (Vd), CYP450 metabolism, clearance, half-life, zero- vs first-order elimination.',
  },
  {
    id: 'pharmacology-dynamics',
    subjectId: 'pharmacology',
    name: 'Pharmacodynamics & Dose-Response',
    system: 'multisystem',
    importance: 4,
    description:
      'What the drug does to the body — agonists, partial agonists, competitive vs non-competitive antagonists, potency vs efficacy, therapeutic index.',
  },
  {
    id: 'pharmacology-autonomic',
    subjectId: 'pharmacology',
    name: 'Autonomic Pharmacology',
    system: 'nervous',
    importance: 5,
    description:
      'The sympathetic/parasympathetic drug map — receptor by receptor (alpha, beta, muscarinic, nicotinic) with the mimetics, blockers and toxidromes every vignette assumes.',
  },
  {
    id: 'pharmacology-analgesia',
    subjectId: 'pharmacology',
    name: 'Analgesics & NSAIDs',
    system: 'multisystem',
    importance: 4,
    description:
      'COX-1 vs COX-2 logic — why NSAIDs hurt stomachs and kidneys, why aspirin protects platelets, paracetamol toxicity, and the WHO analgesic ladder.',
  },
  {
    id: 'pharmacology-emergency',
    subjectId: 'pharmacology',
    name: 'Emergency Drugs',
    system: 'cardiovascular',
    importance: 4,
    description:
      'The crash-cart shelf by logic — adrenaline by route, atropine, adenosine, amiodarone, naloxone — mechanisms first, well-established doses, verify-always framing.',
  },
  // ── Microbiology — reused DB topics ───────────────────────────────────────
  {
    id: 't-micro-tb',
    subjectId: 'microbiology',
    name: 'Mycobacterium tuberculosis', // seeded DB name — keep byte-identical
    system: 'respiratory',
    importance: 5,
    description:
      'The acid-fast bacillus — structure, primary vs post-primary pathogenesis, Mantoux/IGRA logic, smear vs GeneXpert vs culture, latent vs active.',
  },
  {
    id: 't-micro-hep',
    subjectId: 'microbiology',
    name: 'Hepatitis Viruses', // seeded DB name — keep byte-identical
    system: 'gastrointestinal',
    importance: 4,
    description:
      'Hepatitis A–E and the serology table that never stops being examined — HBsAg, anti-HBs, anti-HBc IgM/IgG and the vaccinated-vs-infected discriminator.',
  },
  // ── Microbiology — new topics ─────────────────────────────────────────────
  {
    id: 'microbiology-bacteria-basics',
    subjectId: 'microbiology',
    name: 'Bacterial Structure & Gram Staining',
    system: 'immune-infection',
    importance: 5,
    description:
      'The wall decides the colour — peptidoglycan, LPS, capsule, spores; the four-step Gram stain logic, its famous exceptions, and the classic organism gallery.',
  },
  {
    id: 'microbiology-malaria',
    subjectId: 'microbiology',
    name: 'Malaria Parasites',
    system: 'immune-infection',
    importance: 4,
    description:
      'Four (plus knowlesi) Plasmodium species — life cycle, hypnozoites and relapse, smear findings, falciparum danger signs and the ACT treatment principle.',
  },
  {
    id: 'microbiology-hiv',
    subjectId: 'microbiology',
    name: 'HIV & Its Laboratory Diagnosis',
    system: 'immune-infection',
    importance: 4,
    description:
      'Retrovirus biology in plain language — CD4 tropism, the window-period honesty table, CD4 thresholds for opportunistic infections, ART principles and U=U.',
  },
  {
    id: 'microbiology-sepsis',
    subjectId: 'microbiology',
    name: 'Sepsis: Definitions & Recognition',
    system: 'immune-infection',
    importance: 5,
    description:
      'Sepsis-3 definitions with real cutoffs — SIRS, qSOFA, SOFA, lactate — the dysregulated-response biology, and how recognition feeds the hour-1 bundle.',
  },
  {
    id: 'microbiology-sterilisation',
    subjectId: 'microbiology',
    name: 'Sterilisation & Disinfection',
    system: 'immune-infection',
    importance: 3,
    description:
      'Sterilise vs disinfect vs antisepsis — autoclave and hot-air oven numbers, chemical levels, spore indicators, and the prion exception.',
  },
  // ── FMT — new topics ──────────────────────────────────────────────────────
  {
    id: 'fmt-thanatology',
    subjectId: 'fmt',
    name: 'Death & Post-mortem Changes',
    system: 'multisystem',
    importance: 4,
    description:
      'Thanatology — death definition and certification, algor/livor/rigor timelines, decomposition stages, and the forensic art of estimating time since death.',
  },
  {
    id: 'fmt-wounds',
    subjectId: 'fmt',
    name: 'Mechanical Injuries & Wound Logic',
    system: 'integumentary',
    importance: 4,
    description:
      'Abrasion, bruise, laceration, incised, stab, chop and firearm wounds — the morphological rules that let you read a wound like a sentence.',
  },
  {
    id: 'fmt-asphyxia',
    subjectId: 'fmt',
    name: 'Asphyxial Deaths',
    system: 'respiratory',
    importance: 3,
    description:
      'Hanging vs strangulation vs suffocation vs drowning — the classic signs, their honest non-specificity, and the ligature-mark discriminators.',
  },
  // ── Community Medicine — reused DB topics ─────────────────────────────────
  {
    id: 't-cm-epi',
    subjectId: 'cm',
    name: 'Epidemiology & Biostatistics', // seeded DB name — keep byte-identical
    system: 'multisystem',
    importance: 5,
    description:
      'Measuring disease in populations — incidence vs prevalence, case fatality, standardisation, and the arithmetic behind every headline health number.',
  },
  {
    id: 't-cm-biostat',
    subjectId: 'cm',
    name: 'Biostatistics Tests & Screening', // seeded DB name — keep byte-identical
    system: 'multisystem',
    importance: 5,
    description:
      'Screening done honestly — Wilson-Jungner criteria, sensitivity/specificity/PPV arithmetic, and the biases (lead-time, length, overdiagnosis) that fool populations and papers.',
  },
  {
    id: 't-cm-vaccines',
    subjectId: 'cm',
    name: 'Immunisation & National Programs', // seeded DB name — keep byte-identical
    system: 'immune-infection',
    importance: 4,
    description:
      'Vaccine platforms and the cold chain that keeps them alive, the Universal Immunisation Programme by name, and India’s national health programmes at overview level.',
  },
]

// ════════════════════════════════════════════════════════════════════════════
// LESSONS — PATHOLOGY (8)
// Flagships: cell injury & necrosis · anemias (MCV workup)
// ════════════════════════════════════════════════════════════════════════════

const pathologyLessons: ConceptLesson[] = [
  // ── Topic: pathology-cell-injury (FLAGSHIP) ────────────────────────────────
  {
    id: 'c2-pathology-cell-injury',
    name: 'Cell Injury, Adaptation & the Types of Necrosis',
    kind: 'process',
    oneLiner:
      'Cell injury is what happens when cells are pushed past what they can adapt to — mild or brief stress stays reversible, severe or sustained stress becomes irreversible cell death, and the SHAPE of that death (the type of necrosis) tells you the cause and the organ.',
    whyMatters:
      'Every disease you will ever study is this lesson played out somewhere in the body. Exams love it because it is pure logic: give a tissue, give a cause, ask for the necrosis type. Clinically it matters more than students expect — serum enzymes (troponin, ALT, lipase) are literally the markers of irreversibly injured cells leaking their contents, so the whole basis of modern diagnosis sits on cell injury.',
    explain30s:
      'Cells respond to stress in steps. First they adapt (grow, shrink, or change type). If stress continues, they get injured — at first reversibly: the cell swells because its sodium-potassium pumps fail. If the stress persists — especially if mitochondria and cell membranes are damaged beyond repair — injury becomes irreversible and the cell dies. Death with swelling and inflammation is NECROSIS, and its microscopic pattern depends on the cause and tissue: ischaemia in solid organs gives coagulative necrosis, brain gives liquefactive, tuberculosis gives caseous, pancreatic enzymes digest fat (fat necrosis), immune attack on vessels gives fibrinoid necrosis, and blocked blood supply plus infection gives gangrene. Dying cells spill enzymes — troponin, transaminases, amylase — which is how labs detect injury.',
    eli5:
      'Think of a fish in a fish tank with a failing air pump. At first the fish just breathes faster — that is adaptation. Soon it drifts sideways — reversible injury: fix the pump, it recovers. Leave it long enough and it dies — irreversible injury. Now, HOW the fish dies tells you what killed it: dried out and stiff (coagulative), turned to mush (liquefactive), crumbled like old cheese (caseous), or melted like butter in a hot pan (fat necrosis). Pathologists are basically reading the tank. And one more idea: apoptosis is the cell dying quietly and neatly by its own genetic programme, like a self-destructing envelope — no mess, no inflammation. Necrosis is the messy death that neighbours have to clean up, which is exactly why inflammation follows.',
    firstPrinciples: [
      'Start with energy: cells need ATP constantly. Ischaemia (blocked blood supply) starves mitochondria → ATP falls → the Na⁺/K⁺ ATPase pump fails → sodium and water enter → the cell SWELLS. Cellular swelling is the first reversible change.',
      'Reversible injury = swelling + fatty change in metabolically active organs (liver, heart, kidney). The membrane is still intact; remove the cause and the cell recovers.',
      'Irreversibility has two hard gates: profound mitochondrial damage (irreversible, amorphous densities) and ruptured cell/lysosomal membranes. When lysosomal enzymes leak, they digest the cell from inside and outside.',
      'Leaked intracellular enzymes are the diagnostic gold: troponin and CK-MB (heart), AST/ALT (liver), amylase/lipase (pancreas), LDH (nonspecific). A lab test is often just cell injury made visible.',
      'Necrosis types are named by what the dead tissue looks like: architecture preserved (coagulative), digested to liquid (liquefactive), cheese-like granular debris (caseous), soap (fat), fibrin-like vessel walls (fibrinoid), ischaemic ± infection (gangrenous).',
      'Coagulative necrosis follows ischaemia in solid organs (heart, kidney, spleen) — protein denaturation preserves the "ghost" outline. The brain liquefies because it is rich in lipid and enzymes but poor in scaffolding protein. The exception to "solid organ = coagulative" is the brain; the exception to "ischaemia = coagulative" is caseous (TB) and wet gangrene (infection).',
      'Apoptosis is programmed single-cell death (caspases, cell shrinkage, no inflammation) — normal in embryology and used by tumours and viruses too. Necrosis is always pathological, always inflamed.',
    ],
    normal:
      'A healthy cell keeps a narrow internal environment: pumps maintain ion gradients, mitochondria supply ATP, lysosomes stay sealed, and damaged organelles are recycled. Homeostasis is active work — the moment energy or membranes fail, the cell cannot hold its shape or its contents.',
    mechanism:
      'The central switches from ischaemic/reperfusion and toxic injury: (1) ATP depletion → pump failure → swelling; (2) mitochondrial damage → failure of oxidative phosphorylation and leakage of pro-apoptotic proteins (cytochrome c); (3) influx of calcium (normally kept ~10,000-fold lower inside than outside) → activates phospholipases, proteases, endonucleases; (4) reactive oxygen species → lipid peroxidation of membranes; (5) membrane damage → enzyme leak. Whichever gate fails first depends on the insult — that is why the same endpoint (necrosis) looks different across causes.',
    presentation: [
      'Necrosis is microscopic, but you see its consequences: an infarcted organ causes sudden pain (MI, renal infarct), an abscess causes fever and swelling, fat necrosis presents as a tender firm lump in the breast after trauma.',
      'Laboratory presentation: rising troponin in myocardial infarction; ALT in the thousands in toxic hepatitis; lipase in pancreatitis.',
      'Gangrene presents as black, cold, insensitive tissue — dry (no infection: the limb stays demarcated) versus wet (infected: oedema, foul smell, crepitus, sepsis).',
    ],
    differentials: [
      { name: 'Coagulative necrosis', key: 'Ischaemia in solid organs (heart, kidney, spleen); ghost architecture preserved — the tissue outline remains for days.' },
      { name: 'Liquefactive necrosis', key: 'Brain infarcts (lipid-rich, little stromal protein) and pyogenic abscesses (pus = digested neutrophils + tissue).' },
      { name: 'Caseous necrosis', key: 'Tuberculosis (and dimorphic fungi); granuloma with amorphous, cheese-like centre; acid-fast bacilli on Ziehl-Neelsen.' },
      { name: 'Fat necrosis', key: 'Acute pancreatitis (lipase digests peripancreatic fat) or breast trauma; calcium soaps = chalky white areas, later calcified on X-ray.' },
      { name: 'Fibrinoid necrosis', key: 'Immune-complex vessel injury — malignant hypertension, vasculitis; vessel walls look smudged, eosinophilic, "fibrin-like".' },
      { name: 'Gangrenous necrosis', key: 'Not a distinct mechanism — coagulative (dry) or liquefactive superimposed by infection (wet); limb ischaemia, bowel volvulus.' },
    ],
    mnemonics: [
      { hook: 'GHOST tissue', expands: 'Coagulative necrosis preserves the architecture — the dead tissue looks like a faint GHOST of itself (classic in ischaemic heart, kidney, spleen).' },
      { hook: 'The brain LIQUEFIES and pus is LIQUID', expands: 'Liquefactive necrosis = brain infarcts + pyogenic abscesses — the two classic sites.' },
      { hook: 'Caseous = Cheese = TB', expands: 'Caseous necrosis is cheese-like debris inside a granuloma — think Mycobacterium tuberculosis.' },
      { hook: 'SAPONification — SOAP', expands: 'Fat necrosis: fatty acids + calcium = calcium SOAPS (chalky white deposits) in pancreatitis or traumatic breast fat necrosis.' },
      { hook: 'Fibrinoid = Fibrin-like = Furious immune fire in vessels', expands: 'Fibrinoid necrosis lives in vessel walls — malignant hypertension, vasculitis, immune complexes.' },
      { hook: 'Apoptosis = a planned Apology; necrosis = an Accident', expands: 'Apoptosis: programmed, energy-dependent, single cells, no inflammation. Necrosis: accidental, inflamed, spreads to neighbours.' },
    ],
    numbers: [
      { label: 'Na⁺/K⁺ ATPase dependence', value: 'Ischaemic cell swelling is the first visible reversible change', note: 'The pump is among the earliest ATP-starved structures — swelling precedes death by a window of hours in many tissues.' },
      { label: 'Intracellular vs extracellular calcium', value: 'Roughly 10,000-fold gradient', note: 'Membrane failure lets calcium flood in and activate destructive enzymes — one of the points of no return.' },
      { label: 'Serum enzyme logic', value: 'Troponin (heart) · CK-MB (heart) · AST/ALT (liver) · amylase/lipase (pancreas)', note: 'Each enzyme maps to a tissue — the whole discipline of chemical pathology rests on membrane leak.' },
    ],
    imaging:
      'Necrosis has an imaging life too: a completed myocardial infarct shows as a scarred, akinetic wall on echocardiography and late-gadolinium enhancement on cardiac MRI; coagulative necrosis in cerebral infarcts appears as cytotoxic oedema (restricted diffusion) on MRI DWI; old fat necrosis shows as calcifications on mammography; a calcified, fibrotic scar replaces the ghost tissue the pathologist sees.',
    pathologyCorrelation:
      'Microscopy of coagulative necrosis shows preserved cell outlines with lost nuclei (karyolysis → karyorrhexis → pyknosis are the nuclear death stages) — the "tombstone" pattern. Caseous necrosis is granulomas with central amorphous debris; fat necrosis shows anucleate shadowy adipocytes with calcium deposits and foamy macrophages at the rim.',
    reasoning: [
      { stage: 'symptom', label: 'Crushing chest pain, 45 minutes, radiating to left arm', detail: 'A classic ischaemic presentation — the substrate question is whether myocardial cells have crossed from reversible injury to necrosis.' },
      { stage: 'mechanism', label: 'Coronary plaque rupture → thrombus → myocyte ischaemia', detail: 'ATP depletion → pump failure → swelling; beyond ~minutes-to-hours of total ischaemia, mitochondrial and sarcolemmal damage become irreversible — coagulative necrosis.' },
      { stage: 'differential', label: 'STEMI vs NSTEMI vs unstable angina vs aortic dissection', detail: 'All are "chest pain + risk factors"; the necrosis question separates angina (no cell death) from infarction (cell death).' },
      { stage: 'investigation', label: 'ECG (ST elevation?) + high-sensitivity troponin', detail: 'Troponin release is the serum signature of leaked myocyte contents — the lab reading of membrane rupture.' },
      { stage: 'interpretation', label: 'ST elevation + rising troponin', detail: 'Together they localise necrosis to the myocardium and time it (tropomin dynamics give the timeline).' },
      { stage: 'diagnosis', label: 'Acute ST-elevation myocardial infarction', detail: 'The pathology word for this region of heart is a coagulative-necrosis infarct with an inflammatory border.' },
      { stage: 'management', label: 'Restore perfusion urgently (reperfusion strategy per protocol) + antiplatelet therapy per local protocol', detail: 'Principle: salvage the zone of reversible injury around the dead core; verify against current guidelines.' },
      { stage: 'complication', label: 'Arrhythmia, scar → heart failure, free-wall rupture window, papillary muscle rupture', detail: 'The necrotic zone heals by fibrosis — a scar that cannot contract; the weakest days for rupture are the first week while dead tissue is softest.' },
    ],
    mistakes: [
      'Calling the brain infarct "coagulative" — the brain is THE classic liquefactive exception.',
      'Treating gangrene as a separate mechanism — it is coagulative (dry) or liquefactive-plus-infection (wet) necrosis seen with the naked eye.',
      'Assuming apoptosis = necrosis with better manners. Apoptosis is a different program (caspases, no inflammation); tumour cells and viruses hijack or dodge it.',
      'Forgetting that caseous necrosis means TB until proven otherwise in a granuloma.',
    ],
    analogies: [
      'Reversible vs irreversible injury = a wilted plant (water it, it recovers) vs a burned page (no recovery).',
      'Necrosis types = how a building collapses: left standing but gutted (coagulative), dissolved to sludge (liquefactive), crumbled to cheese (caseous), melted and re-solidified as soap (fat).',
    ],
    examRelevance:
      'Among the most repeated pathology questions in NEET-PG and university theory: match cause↔necrosis type, identify the ghost pattern, name the nuclear changes in order, and interpret enzyme patterns. The brain/abscess liquefactive exception is a guaranteed trap.',
    clinicalRelevance:
      'Every troponin, ALT, or lipase you order is an assay of this lesson. Understanding coagulative necrosis explains why an old MI leaves a scar that echo sees forever, and why "time is muscle" in reperfusion.',
    teachDeeper: [
      'Reperfusion injury: restoring blood flow paradoxically adds reactive oxygen species — why some salvage fails.',
      'Ischaemia-reperfusion vs direct toxins: carbon tetrachloride (CYP-generated radicals), mercury (binds sulfhydryl groups) — mechanism-specific membrane attack.',
      'Pyknosis → karyorrhexis → karyolysis: the orderly nuclear death sequence examiners ask you to recite.',
      'Dystrophic vs metastatic calcification: dystrophic = calcium in DEAD/damaged tissue with normal serum calcium (caseous, fat necrosis, valves); metastatic = high serum calcium depositing in normal tissue.',
    ],
    crossLinks: [
      { conceptId: 'c-ami', label: 'Acute Myocardial Infarction (Medicine)', why: 'The clinical face of coagulative necrosis — same story from the ward side.', subject: 'Medicine' },
      { conceptId: 'c-inflamm', label: 'Acute Inflammation (Pathology)', why: 'Necrosis releases DAMPs that ignite the inflammatory response — the two lessons are one system.' },
      { conceptId: 'c-troponin', label: 'Cardiac Biomarkers (Biochemistry)', why: 'Troponin leak IS membrane rupture measured in serum.', subject: 'Biochemistry' },
      { conceptId: 'c-ulcer', label: 'Peptic Ulcer Disease (Medicine)', why: 'An ulcer is localised mucosal necrosis dug deeper by acid and proteolysis.', subject: 'Medicine' },
    ],
    sources: [
      openStaxRef('Anatomy & Physiology — cellular response to stress (reference framing)'),
      ncbiRef('Robbins-style general pathology literature on cell death and necrosis patterns (review indexing)'),
      jhmiRef('Patient/professional education pages on myocardial infarction and organ injury'),
      nmcRef('CBME general-pathology competency reference (Biochemistry of cell injury context)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: t-patho-inflamm (ENRICHES existing concept c-inflamm) ──────────
  {
    id: 'c-inflamm',
    name: 'Acute Inflammation (and When It Turns Chronic)',
    kind: 'process',
    oneLiner:
      'Acute inflammation is the rapid, stereotyped vascular-and-white-cell response to injury — redness, heat, swelling, pain — built from histamine, complement and neutrophils; when the cause refuses to leave, it shifts into chronic inflammation led by macrophages and lymphocytes, sometimes packed into granulomas.',
    whyMatters:
      'This is the engine under most of medicine: appendicitis, pneumonia, rheumatoid arthritis, tuberculosis, atherosclerosis — all inflammation at different speeds. It is also how the exam separates students: mediators (histamine vs bradykinin vs complement) and outcomes (resolution vs abscess vs chronicity) are question-perfect, and the acute-vs-chronic logic explains why some diseases smoulder for years.',
    explain30s:
      'Tissue damage releases alarms. Within seconds-to-minutes, arterioles dilate (redness, heat) and capillaries leak protein-rich fluid (swelling) — histamine and bradykinin drive the early phase, bradykinin also sensitises nerves (pain). Neutrophils arrive first: they roll along vessel walls (selectins), stick (integrins), squeeze between endothelial cells, and crawl toward bacteria along chemical gradients (chemotaxis). They engulf organisms opsonised by C3b and IgG and kill them with a hydrogen-peroxide–myeloperoxidase–halide system. Outcomes: complete resolution, pus walled off as an abscess, repair by fibrosis, or — if the trigger persists — chronic inflammation: macrophages, lymphocytes, plasma cells, and in special cases granulomas (TB = caseating; sarcoid, Crohn = non-caseating).',
    eli5:
      'Imagine a small fire in a neighbourhood. The alarm (injured cells) wakes everyone. The fire brigade is already parked nearby: neutrophils are the first responders — fast, brave, and a bit clumsy (they damage nearby houses). Histamine is the siren that opens the roads wider (vasodilation) and makes them leaky (swelling); bradykinin is why you FEEL the fire (pain). If the fire goes out, everyone goes home and repairs the street — resolution. If the fire keeps burning, the heavy crew moves in: macrophages (cleanup experts), lymphocytes (intelligence officers), plasma cells (antibody factories). When the enemy digs a bunker, the body builds a siege wall around it — a granuloma. That siege is chronic inflammation, and sieges damage the city too.',
    firstPrinciples: [
      'Cardinal signs first, mechanism second: rubor (redness) and calor (heat) come from vasodilation; tumor (swelling) from vascular permeability; dolor (pain) from bradykinin and prostaglandins sensitising nociceptors; functio laesa (loss of function) is the sum.',
      'The vascular sequence: transient vasoconstriction → sustained vasodilation (histamine, nitric oxide) → increased permeability → exudate (protein-rich) → slowing of flow so cells can marginate.',
      'The cellular sequence — the four S-curves of a neutrophil’s journey: Margination and Rolling (selectins), Adhesion (integrins), Transmigration (PECAM/CD31), Chemotaxis (C5a, leukotriene B4, bacterial peptides).',
      'Killing needs three ingredients — the H₂O₂–myeloperoxidase–halide system — and two handles for engulfment: opsonins C3b and the Fc part of IgG (phagocyte receptors recognise them).',
      'Exudate vs transudate: exudate = inflamed, leaky vessels (high protein/LDH); transudate = pressure-driven, low protein. Light’s criteria make this quantitative for pleural fluid: exudate if pleural/serum protein ratio > 0.5, or pleural/serum LDH ratio > 0.6, or pleural LDH > two-thirds of the serum upper limit.',
      'Outcomes are decided by the BALANCE of injury vs host power and by whether the antigen persists: resolution (nothing lost), abscess (pus contained), organisation (fibrosis replaces), or chronicity.',
      'Chronic inflammation is a different cell cast: macrophages (the directors), lymphocytes, plasma cells. Granulomas appear when macrophages cannot digest the enemy (mycobacteria, foreign bodies, beryllium) or when immunity is dysregulated (sarcoidosis, Crohn’s) — epithelioid macrophages fuse into Langhans giant cells.',
    ],
    normal:
      'Baseline circulation is a smooth, non-adhesive surface: endothelial cells repel platelets and leukocytes. Inflammation temporarily converts vessels from a highway into an assembly point — a controlled emergency that must switch off; chronic activation is the disease.',
    mechanism:
      'Plasma-derived mediators: complement (C3a/C5a anaphylatoxins attract neutrophils; C3b opsonises; C5b-9 punches membranes), kinins (bradykinin — pain), coagulation/fibrinolysis products. Cell-derived mediators: histamine (preformed in mast cells — vasodilation, permeability), arachidonic-acid products (prostaglandins — pain/vasodilation; leukotriene B4 — chemotaxis), cytokines (IL-1, IL-6, TNF — fever, acute-phase response, CRP), nitric oxide (vasodilation, microbicidal), lysosomal enzymes. This is why the same "inflammation" can look like anaphylaxis (histamine), septic shock (TNF), or a tuberculous siege (macrophage cytokines).',
    presentation: [
      'Acute bacterial infection: local redness, heat, swelling, pain, pus; systemic fever, chills, high CRP, neutrophilic leukocytosis.',
      'Abscess: fluctuant, tender collection — the body’s prison for bacteria it cannot digest.',
      'Chronic smouldering inflammation: fatigue, low-grade fever, weight loss, elevated ESR/CRP without dramatic local signs.',
      'Granulomatous disease: chronic cough + night sweats + weight loss (TB) or silent lymphadenopathy (sarcoidosis).',
    ],
    differentials: [
      { name: 'Acute vs chronic inflammation', key: 'Neutrophils + rapid onset (minutes–days) vs mononuclear cells + slow onset (weeks–months) with tissue destruction and repair at once.' },
      { name: 'Exudate vs transudate', key: 'Protein-rich and LDH-rich (inflamed) vs protein-poor (pressure-driven) — Light’s criteria quantifies pleural fluid.' },
      { name: 'Caseating vs non-caseating granuloma', key: 'TB (caseous, acid-fast, AFB-positive) vs sarcoidosis/Crohn’s/berylliosis (non-caseating) — never call every granuloma TB.' },
      { name: 'Suppurative vs fibrinous vs serous inflammation', key: 'Pus-forming (pyogenic cocci) vs fibrin-rich rough surfaces (pericarditis — "bread-and-butter") vs blister fluid (burns, herpes blisters).' },
    ],
    mnemonics: [
      { hook: 'R-C-T-P-A-C-C', expands: 'The neutrophil’s journey: Rolling (selectins) → Adhesion/Activation (integrins) → Transmigration (PECAM-1) → Phagocytosis → opsonin recognition (C3b, IgG Fc) → Killing (H₂O₂-MPO-halide) → Clearance.' },
      { hook: '“Brady” = bradypnoea of the wallet — it HURTS', expands: 'Bradykinin is the pain mediator of early inflammation; prostaglandins lower its threshold (why NSAIDs relieve pain).' },
      { hook: 'Caseous = Cheese = TB; Sarcoid stays Smooth', expands: 'Caseating granuloma → mycobacteria (or dimorphic fungi); non-caseating → sarcoidosis, Crohn’s, berylliosis.' },
      { hook: 'Neutrophils Never waste time; Macrophages March later', expands: 'Neutrophils dominate the first 6–24 h; macrophages take over at 24–48 h — the cellular changing of the guard.' },
    ],
    numbers: [
      { label: 'Neutrophil arrival', value: 'First 6–24 hours', note: 'Then macrophages dominate from 24–48 h — the time-course behind "early" vs "late" biopsy findings.' },
      { label: 'Light’s criteria (pleural exudate)', value: 'Protein ratio > 0.5 · LDH ratio > 0.6 · pleural LDH > 2/3 upper serum limit', note: 'Any ONE criterion = exudate — the single most used lab rule in pleural disease.' },
      { label: 'Acute-phase marker', value: 'CRP rises within hours; ESR lags over days', note: 'CRP tracks active inflammation faster — why it guides antibiotic response discussions.' },
    ],
    pathologyCorrelation:
      'Histology: acute inflammation shows congested capillaries, oedema and neutrophil infiltrate; suppuration shows neutrophil debris (pus); organisation shows granulation tissue — proliferating capillaries + fibroblasts. Chronic inflammation shows lymphocytes, plasma cells and macrophages; a granuloma is a rim of epithelioid macrophages ± Langhans giant cells (peripheral nuclei) around the irritant, often with a lymphocyte collar.',
    mistakes: [
      'Saying histamine causes pain — bradykinin and prostaglandins do; histamine is the vascular opener.',
      'Calling transudate "inflammation" — transudate is pressure, not inflammation; the protein content is the discriminator.',
      'Assuming all granulomas are TB — sarcoidosis, Crohn’s, foreign bodies and berylliosis are non-caseating lookalikes.',
      'Writing "chronic inflammation = lymphocytes" only — macrophages are the orchestrators; plasma cells make the antibodies.',
    ],
    analogies: [
      'Acute inflammation = the fire brigade (fast, generic, occasionally burns the curtains); chronic inflammation = the siege army (slow, organised, destroys the neighbourhood it is defending).',
      'Opsonins = barcode stickers on bacteria so the phagocyte’s scanner (receptor) can grab them.',
    ],
    examRelevance:
      'Mediator-to-sign matching (histamine→vasodilation; bradykinin→pain; C5a→chemotaxis), Light’s criteria arithmetic, neutrophil-vs-macrophage timing, and granuloma differentials are perennial NEET-PG and vivas. "Which step does CD18/integrin block?" (leukocyte adhesion deficiency) is the classic applied question.',
    clinicalRelevance:
      'You will use this daily: interpreting pleural fluid, deciding if a swelling is abscess vs cellulitis, reading a biopsy report that says "granulomatous inflammation — AFB pending", and explaining to a patient why a scar formed where an abscess was.',
    teachDeeper: [
      'Leukocyte adhesion deficiency (CD18/integrin failure): delayed cord separation, recurrent infections WITHOUT pus — the adhesion step made visible by its absence.',
      'Chronic granulomatous disease: NADPH-oxidase failure — catalase-positive organisms (S. aureus) survive; the H₂O₂-MPO system made visible by its absence.',
      'Serous, fibrinous, catarrhal, haemorrhagic, suppurative: the exudate spectrum and where each occurs.',
      'Alpha-1 antitrypsin and tissue damage: why unchecked neutrophil elastase destroys lung — inflammation needs brakes.',
    ],
    crossLinks: [
      { conceptId: 'c-hypersensitivity', label: 'Hypersensitivity & Immunodeficiency (Pathology)', why: 'Inflammation with an antigen-specific driver becomes hypersensitivity types I–IV.' },
      { conceptId: 'c2-pathology-cell-injury', label: 'Cell Injury & Necrosis (this pack)', why: 'Necrosis feeds inflammation; inflammation can injure cells — one loop.' },
      { conceptId: 'c2-pharmacology-nsaids', label: 'NSAIDs (this pack)', why: 'The prostaglandin arm of inflammation is exactly what NSAIDs switch off.' },
      { conceptId: 'c-tb', label: 'Tuberculosis (Microbiology)', why: 'TB is the caseating granuloma made into a global disease.' },
    ],
    sources: [
      openStaxRef('Anatomy & Physiology — inflammatory response (reference framing)'),
      ncbiRef('Inflammation mediator reviews indexed on PubMed Central'),
      hmxRef('HMX Immunology — innate immune response course concepts'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: t-patho-neoplasia (ENRICHES existing concept c-neoplasia) ──────
  {
    id: 'c-neoplasia',
    name: 'Neoplasia: Hallmarks & Spread',
    kind: 'process',
    oneLiner:
      'A neoplasm is new tissue whose growth has escaped normal control — benign tumours stay local and respectful, malignant ones invade and travel by three routes (lymph, blood, body cavities), and the whole behaviour is written in a handful of acquired capabilities called the hallmarks of cancer.',
    whyMatters:
      'Cancer pharmacology, staging systems, tumour markers and prognosis all reduce to this lesson. NEET-PG asks it constantly — nomenclature traps (-oma names that are malignant), metastasis routes, p53/RB logic — and the clinic assumes it: when you read "poorly differentiated carcinoma, 3 of 12 nodes positive, T2N1M0", every word is neoplasia vocabulary.',
    explain30s:
      'A tumour begins as a clone: one cell acquires mutations that give it advantages — it makes its own growth signals, ignores stop signals, refuses to die (apoptosis resistance), replicates without limit (telomerase), builds its own blood supply (angiogenesis via VEGF), and finally invades and metastasises. Benign tumours have some advantages but respect tissue boundaries; malignant tumours combine them all, becoming anaplastic (undifferentiated), fast-growing, invasive and metastatic. Spread has three highways: lymphatics (carcinomas first — e.g. breast to axillary nodes), blood (sarcomas classically; carcinomas too — lung and liver are the great filters), and transcoelomic seeding across body cavities (ovarian cancer across the peritoneum). Genes: oncogenes are accelerated pedals (RAS, MYC, BCR-ABL — one mutated copy suffices); tumour suppressors are broken brakes (p53, RB — usually BOTH copies must fail, the "two-hit" rule).',
    eli5:
      'Picture a city of cells with strict traffic rules. A benign tumour is a shop that expanded illegally into its own street — annoying, pushing neighbours, but it never leaves the street; you can walk in, remove it, done. A malignant tumour is a gang that (1) prints its own permission slips for growth, (2) tears down the stop signs, (3) bribes the demolition crew not to condemn broken buildings (no apoptosis), (4) never retires, (5) builds private roads to bring in supplies (angiogenesis), and finally (6) leaves the city — by the postal service (lymph nodes), the highways (bloodstream), or by crawling along the metro walls (across body cavities). Oncogenes are stuck accelerators; tumour suppressors are cut brakes. Cancer needs BOTH mistakes — floor the accelerator AND cut the brakes.',
    firstPrinciples: [
      'Definition first: neoplasia = uncontrolled, clonal, autonomous growth that persists after the triggering stimulus is gone. "Autonomy" is what separates a tumour from hyperplasia (which obeys physiological signals).',
      'Nomenclature logic: benign mesenchymal = tissue + -oma (fibroma, lipoma); benign epithelial = adenoma/papilloma; malignant epithelial = carcinoma; malignant mesenchymal = sarcoma. Learn the TRAPS — melanoma, mesothelioma, lymphoma, seminoma, hepatoma are malignant despite the friendly -oma.',
      'Benign vs malignant on four axes: differentiation (well vs anaplastic), growth rate (slow vs rapid), local invasion (capsule/pushing vs infiltrative), metastasis (never vs the defining feature). Dysplasia and carcinoma in situ are the pre-invasive stations on the line to cancer.',
      'The hallmarks (Hanahan & Weinberg, then updated): self-sufficiency in growth signals; insensitivity to anti-growth signals; evasion of apoptosis; limitless replication; sustained angiogenesis; invasion & metastasis — later framed additions include reprogrammed metabolism and evasion of immune destruction. Every targeted cancer drug you will learn maps onto one hallmark.',
      'Three metastasis routes with direction rules: lymphatic first for most carcinomas (regional nodes), haematogenous for sarcomas and late carcinomas (liver for portal drainage — gut; lung for systemic venous blood), transcoelomic across closed cavities (ovarian carcinoma paints the peritoneum; pseudomyxoma peritonei).',
      'Genetic logic: oncogenes are dominant gain-of-function (RAS locked "on", BCR-ABL fusion tyrosine kinase in CML, MYC overexpression in Burkitt). Tumour suppressors are recessive loss-of-function (RB two-hit in retinoblastoma; p53 — guardian of the genome — mutated in >half of human cancers; BRCA1/2 repair genes).',
      'Grade vs stage: GRADE = how angry the cells look microscopically (differentiation); STAGE = how far it has spread anatomically (TNM: Tumour size/depth, Nodes, Metastases). Stage generally drives prognosis more than grade.',
    ],
    normal:
      'Normal tissue renews through a disciplined cycle: stem cells divide, daughter cells differentiate, old cells die on schedule (apoptosis), and growth factors are matched by growth inhibitors. DNA repair (p53 checkpoints) fixes or eliminates damaged cells before they reproduce. Cancer is the escape from every one of these brakes at once.',
    mechanism:
      'Multistep carcinogenesis: initiation (a mutation fixes a change in a long-lived cell), promotion (selective expansion of that clone), progression (accumulating further hits — instability, angiogenesis, immune escape). Chemicals (smoking PAHs → p53 in lung), viruses (HPV E6/E7 disable p53/RB; EBV in Burkitt; HBV → HCC), and radiation all feed the same endpoints. Invasion requires EMT-like changes: loss of cell-cell adhesion (E-cadherin down), basement-membrane proteolysis (MMPs), motility — then intravasation, survival in circulation, extravasation and colonisation of a compatible "soil" (the seed-and-soil hypothesis — why prostate cancer loves bone).',
    presentation: [
      'Local: a lump that is hard, fixed, painless (late ulceration/bleeding); obstruction (colonic cancer → constipation), compression symptoms.',
      'Systemic: weight loss, fatigue, anaemia, fever — and the paraneoplastic syndromes (SIADH in small-cell lung, PTHrP hypercalcaemia in squamous lung) that ask tumours via chemistry.',
      'Through markers: AFP (hepatocellular carcinoma, yolk sac), CEA (colorectal), CA-125 (ovarian), CA 19-9 (pancreatic), PSA (prostate), β-hCG (choriocarcinoma, hydatidiform mole), calcitonin (medullary thyroid). Markers monitor — they do not screen the general population (except PSA debates; AFP for high-risk cirrhosis surveillance).',
    ],
    differentials: [
      { name: 'Benign vs malignant epithelial tumour', key: 'Adenoma (respectful, encapsulated, non-metastatic) vs carcinoma (infiltrative, anaplastic, metastatic) — histology decides, not size.' },
      { name: 'Carcinoma vs sarcoma', key: 'Epithelial origin + lymphatic-first spread vs mesenchymal origin + haematogenous-first spread.' },
      { name: 'Dysplasia vs carcinoma in situ vs invasive', key: 'Disordered maturation (reversible-ish) → full-thickness atypia confined by basement membrane (pre-invasive) → through the basement membrane (invasive, metastatic-capable).' },
      { name: 'Oncogene vs tumour suppressor', key: 'Dominant, gain-of-function pedal vs recessive, loss-of-function brake (two-hit) — explains inherited syndromes (RB, BRCA, p53/Li-Fraumeni).' },
    ],
    mnemonics: [
      { hook: '“-oma” liars: Melanoma, Mesothelioma, Lymphoma, Seminoma, Hepatoma', expands: 'Five famous malignant tumours wearing benign-sounding names — the classic nomenclature trap.' },
      { hook: 'Carcinomas Crawl to Lymph nodes first; Sarcomas Swim in blood', expands: 'The C-C and S-S pairing that fixes the metastasis-route logic.' },
      { hook: 'Lung & Liver = the L-filters', expands: 'Systemic venous blood filters through the LUNG; portal blood filters through the LIVER — the two great metastatic crossroads.' },
      { hook: 'p53 = Police 53; RB = Road Block', expands: 'p53 the guardian-checkpoint; RB the G1/S roadblock — the two brakes exams always name.' },
    ],
    numbers: [
      { label: 'Metastasis routes', value: '3 — lymphatic, haematogenous, transcoelomic', note: 'Direction logic matters more than memorising every example.' },
      { label: 'Two-hit rule', value: 'Both alleles of a tumour suppressor must fail', note: 'Explains retinoblastoma’s familial (one inherited hit) vs sporadic (two somatic hits) patterns.' },
      { label: 'TNM', value: 'T = primary tumour · N = nodes · M = metastases', note: 'Stage (I–IV) derives from TNM — staging drives prognosis and therapy choice.' },
    ],
    imaging:
      'Imaging is staging made visible: CT/MRI define T (size, depth, invasion), node stations (N), and distant deposits (M). Breast cancer’s triple assessment pairs imaging (mammography/ultrasound) with FNAC/core biopsy; a liver "target lesion" on contrast CT with rim enhancement is a metastasis until proven otherwise in a known primary.',
    pathologyCorrelation:
      'Histology: anaplasia (pleomorphism, hyperchromasia, mitoses, abnormal mitotic figures), loss of polarity, invasion through basement membrane; perineural and lymphovascular invasion are prognostic flags. Benign lesions show orderly maturation and a capsule; malignant ones infiltrate like roots.',
    mistakes: [
      'Assuming a big tumour is malignant and a small one benign — behaviour, not size, decides (a 2 cm melanoma kills; a 15 cm lipoma naps).',
      'Using CA-125 or CEA to screen healthy populations — markers track known disease; they are not population screens.',
      'Mixing grade and stage — grade is microscopic mood; stage is anatomical geography.',
      'Forgetting that sarcomas metastasise haematogenously FIRST — the axillary-node-first logic belongs to carcinomas.',
    ],
    analogies: [
      'Oncogene vs tumour suppressor = a stuck accelerator vs cut brakes — a speeding car usually needs BOTH failures to crash the tissue.',
      'Seed and soil = a traveller (tumour cell) settling only in cities whose food it can digest — prostate cells thrive in bone, colon cells in liver.',
    ],
    examRelevance:
      'Repeated NEET-PG patterns: name-that-nomenclature traps, match tumour↔marker, identify the metastasis route from the primary, apply the two-hit rule to retinoblastoma pedigrees, and order the hallmarks to targeted therapies (trastuzumab→HER2; imatinib→BCR-ABL; bevacizumab→VEGF).',
    clinicalRelevance:
      'Reading a cancer report aloud in a ward round — "moderately differentiated, lymphovascular invasion present, 3/12 nodes" — is this lesson recited. It also explains why removing the primary with draining nodes (the classic operation) works, and why sentinel-node biopsy revolutionised breast and melanoma surgery.',
    teachDeeper: [
      'Telomerase: how tumours solve the end-replication problem and achieve "limitless" division.',
      'Angiogenesis therapy logic: bevacizumab (anti-VEGF) — starve the private road network.',
      'Hereditary cancer syndromes: RB (13q), BRCA1/2, APC (familial polyposis), p53 (Li-Fraumeni), mismatch-repair genes (HNPCC/Lynch) — each a brake gene with a signature tumour set.',
      'Grading systems examples: FIGO for gynae, Gleason for prostate — different organs, same grade-vs-stage grammar.',
    ],
    crossLinks: [
      { conceptId: 'c2-pathology-cell-injury', label: 'Cell Injury & Necrosis (this pack)', why: 'Damage → repair → misrepair is the road most cancers travel; inflammation itself is tumour-promoting.' },
      { conceptId: 'c2-pathology-cirrhosis', label: 'Cirrhosis (this pack)', why: 'Cirrhosis is the single main substrate of hepatocellular carcinoma — pathology meets prevention (AFP + ultrasound surveillance).' },
      { conceptId: 'c2-pharmacology-antibiotics', label: 'Antibiotics by Mechanism (this pack)', why: 'Contrast mechanism-based thinking: targeted oncology drugs are to cancer what mechanism tables are to antibiotics.' },
    ],
    sources: [
      ncbiRef('Cancer biology and metastasis review literature (PubMed Central indexing)'),
      openStaxRef('Biology — cell cycle regulation and cancer concepts'),
      hmxRef('HMX Genetics & Pharmacology — oncogene/tumour-suppressor course framing'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: t-patho-hemapath — FLAGSHIP ─────────────────────────────────────
  {
    id: 'c2-pathology-anemias',
    name: 'Anaemias: The MCV-Based Workup',
    kind: 'disease',
    oneLiner:
      'Anaemia is a haemoglobin below normal for age and sex — and the mean corpuscular volume (MCV) is the single fork in the road that sorts every anaemia into microcytic (<80 fL), normocytic (80–100 fL) or macrocytic (>100 fL), each with its own short list of causes.',
    whyMatters:
      'Anaemia is among the commonest findings you will ever meet — in OPDs, wards, pregnancy, and nearly every system review — and the MCV fork is the most reliably examined algorithm in pathology. Get it and a single CBC reading turns into a diagnosis; miss it and you order blind. It also carries public-health weight: iron-deficiency anaemia remains one of the world’s commonest health burdens, with India and much of South Asia and sub-Saharan Africa carrying a large share.',
    explain30s:
      'Confirm anaemia first (WHO teaching cutoffs: Hb <13 g/dL in men, <12 g/dL in non-pregnant women). Then read the MCV. Below 80 fL = microcytic: the "TAILS" list — Thalassemia, Anemia of chronic disease, Iron deficiency, Lead poisoning, Sideroblastic — with iron studies as the tiebreaker (ferritin low in iron deficiency, high in chronic disease and sideroblastic; TIBC high only in iron deficiency). 80–100 fL = normocytic: check the reticulocyte count — high retics mean the marrow is compensating for LOSS (haemolysis or bleeding: low haptoglobin, high LDH, high indirect bilirubin); low-normal retics mean marrow PRODUCTION failure (chronic disease, renal failure with low EPO, aplasia, infiltration). Above 100 fL = macrocytic: megaloblastic (B12 — with neurological signs and high methylmalonic acid — vs folate, no neurology) or non-megaloblastic (alcohol, liver disease, hypothyroidism, MDS); hypersegmented neutrophils (>5 lobes) shout megaloblastic.',
    eli5:
      'Haemoglobin is the oxygen-carrying red paint inside red cells. Anaemia means less paint — so tissues get less oxygen: tiredness, breathlessness, pallor. Now, red cells come in sizes. Think of three baskets by SIZE (that is all MCV is — average red-cell size). Tiny cells (microcytic): usually a construction-material problem — the cell is small because it is poor in iron-paint; the "TAILS" crew. Normal-size cells (normocytic): ask whether cells are being LOST (blood is a leaking bucket — the marrow responds with fresh young cells called reticulocytes) or NOT MADE (the factory itself is slow — kidney disease, chronic illness). Giant cells (macrocytic): the DNA cookbook is failing — vitamin B12 or folate build the recipe; without them cells grow big but immature; alcohol and thyroid disease also puff them up. One number (MCV) sorts the whole story — that is the beauty.',
    firstPrinciples: [
      'Define and confirm: anaemia = Hb below the population norm (WHO teaching thresholds: <13 g/dL adult men, <12 g/dL non-pregnant women, <11 g/dL pregnant women and young children). Confirm before classifying.',
      'The one fork that matters is MCV — the average red-cell volume. Cut-offs: microcytic <80 fL, normocytic 80–100 fL, macrocytic >100 fL (standard teaching; labs vary by ±2).',
      'Microcytic means HAEM (iron) or globin scarcity: TAILS — Thalassemia, Anemia of chronic disease, Iron deficiency, Lead poisoning, Sideroblastic. Iron studies separate them: iron deficiency = ↓ferritin, ↑TIBC, ↓saturation; chronic disease = ↑ferritin, ↓TIBC; sideroblastic = ↑ferritin, ring sideroblasts in marrow.',
      'A red flag to respect: in combined iron + B12 deficiency, MCV can look normal — always check ferritin in confusing anaemias.',
      'Normocytic means ask PRODUCTION vs LOSS with the reticulocyte count (a corrected/absolute retic count, not the raw %). High retics = marrow working = haemolysis or acute bleed. Low retics = marrow failing (anaemia of chronic disease, CKD → ↓EPO, aplastic anaemia, marrow infiltration).',
      'Haemolysis signature = ↑LDH, ↑indirect bilirubin, ↓haptoglobin. Intravascular adds haemoglobinuria; the film adds shapes: spherocytes (hereditary spherocytosis, warm AIHA), sickles (HbS), bite cells (G6PD), schistocytes (MAHA — TTP/HUS/DIC).',
      'Macrocytic splits at the marrow: MEGALOBLASTIC (B12/folate — oval macrocytes, hypersegmented neutrophils; B12 also blocks methylmalonyl-CoA → high MMA + neurological signs; folate has neither) vs NON-MEGALOBLASTIC (alcohol, liver disease, hypothyroidism, MDS).',
    ],
    normal:
      'Normal adult values to anchor against: Hb 13–17 g/dL (men), 12–15 g/dL (women); MCV 80–100 fL; reticulocytes ~0.5–2.5%; serum ferritin the mirror of iron stores (low = empty stores even with normal Hb — iron deficiency precedes anaemia).',
    mechanism:
      'Three mechanistic families: (1) PRODUCTION failure — substrate lack (iron → small pale cells; B12/folate → impaired DNA synthesis → nuclear-cytoplasmic asynchrony = big immature cells), marrow failure (aplasia), or inadequate stimulus (renal EPO, chronic-inflammatory hepcidin blocking iron release). (2) LOSS — haemorrhage (iron leaves the body → eventual iron-deficiency picture). (3) DESTRUCTION — haemolysis, inherited (membrane: spherocytosis; enzyme: G6PD; haemoglobin: sickle, thalassaemia) or acquired (autoimmune, MAHA).',
    presentation: [
      'Common: fatigue, exertional dyspnoea, pallor (palmar creases, conjunctiva), tachycardia.',
      'Iron deficiency: koilonychia (spoon nails), angular stomatitis, pica (ice, mud — a real and under-asked clue), brittle hair; men and postmenopausal women with iron deficiency need GI bleeding hunted (colonoscopy).',
      'B12 deficiency: glossitis, peripheral neuropathy, posterior-column loss (vibration/proprioception), subacute combined degeneration, sometimes psychiatric change — FOLATE never does this.',
      'Haemolysis: jaundice (indirect), dark urine on intravascular haemolysis, splenomegaly, pigment gallstones from years of bilirubin.',
    ],
    diagnosis: [
      'Step 1 — CBC with indices + peripheral smear: the smear is the cheapest "biopsy of blood" and answers half the differentials by itself.',
      'Step 2 — the MCV fork, then targeted chemistry: iron studies (ferritin, TIBC, saturation) for microcytic; reticulocyte count + LDH/haptoglobin/bilirubin for normocytic; B12, folate ± MMA/homocysteine for macrocytic.',
      'Step 3 — marrow only when the blood cannot answer: ring sideroblasts, aplasia, infiltration, myelodysplasia.',
      'Mentzer index (MCV ÷ RBC count): <13 favours thalassaemia trait, >13 favours iron deficiency — a screening rule of thumb, not a verdict.',
      'RDW: high in iron deficiency (mixed sizes), typically normal in thalassaemia trait (uniformly small cells) — a subtle discriminator exams love.',
    ],
    differentials: [
      { name: 'Iron-deficiency anaemia', key: '↓Ferritin (first to fall), ↑TIBC, microcytosis with high RDW, anisopoikilocytosis; treat the CAUSE — in men/postmenopausal women, find the bleeding.' },
      { name: 'Anaemia of chronic disease', key: 'Ferritin normal/high, TIBC low, hepcidin traps iron; normocytic or mildly microcytic; corrects only when the underlying disease does.' },
      { name: 'Thalassaemia trait', key: 'Very low MCV with disproportionately MILD anaemia, normal ferritin, normal RDW, Mentzer <13; confirm by Hb electrophoresis/HPLC (↑HbA2 in beta-trait).' },
      { name: 'Megaloblastic anaemia (B12/folate)', key: 'Macro-ovalocytes, hypersegmented neutrophils (>5 lobes); B12 adds neurology + ↑MMA — replacement without diagnosing B12 can mask and let neurology progress.' },
      { name: 'Haemolytic anaemias', key: 'Retic high + LDH high + haptoglobin low; spherocytes (Coombs+ AIHA / Coombs− hereditary spherocytosis), sickles, schistocytes, bite cells — shape names the disease.' },
      { name: 'Anaemia of renal disease', key: 'Normocytic, low retics — EPO-starved marrow; respond to EPO therapy, not iron alone (unless iron deficient too).' },
    ],
    management: [
      'Principle 1 — diagnose the TYPE and the CAUSE; anaemia is a sign, not a disease. Iron deficiency without an explanation is a GI bleed until proven otherwise.',
      'Principle 2 — replace what is missing by the right route: oral iron for deficiency (vitamin C aids absorption; tea/calcium hinder); parenteral iron for intolerance/malabsorption/continuing losses.',
      'Principle 3 — never give B12 "just in case" before documenting B12 status when neurology is present — correcting the anaemia while neurology progresses is a classic tragedy.',
      'Principle 4 — transfuse for physiology, not for the number: symptoms, active bleeding, or cardiodecompensation drive the decision (verify local thresholds).',
      'Principle 5 — in haemolysis, treat the mechanism (steroids for warm AIHA; folate supplementation in chronic haemolysis; avoid oxidant drugs in G6PD).',
      'Verify against current guidelines — thresholds and regimens evolve; the PRINCIPLES above are stable.',
    ],
    complications: [
      'High-output cardiac failure — the anaemic heart runs faster and harder for years; severe prolonged anaemia thickens and dilates it.',
      'Growth and cognitive effects in children; pregnancy: maternal anaemia linked with adverse outcomes (preterm birth, low birth weight).',
      'B12 neurologic damage can become permanent if untreated; folate deficiency in pregnancy → neural tube defects.',
      'Iron overload from repeated transfusions in thalassaemia — the reason chelation exists.',
    ],
    numbers: [
      { label: 'MCV fork', value: 'Microcytic <80 fL · Normocytic 80–100 fL · Macrocytic >100 fL', note: 'Standard teaching cut-offs — the skeleton of the whole workup.' },
      { label: 'WHO anaemia thresholds', value: 'Hb <13 g/dL (men) · <12 g/dL (non-pregnant women) · <11 g/dL (pregnant women, children <5 y)', note: 'Public-health definitions — commonly quoted in exams.' },
      { label: 'Mentzer index', value: 'MCV/RBC < 13 → thalassaemia trait; > 13 → iron deficiency', note: 'Screening heuristic for microcytosis, popular in exams; not definitive.' },
      { label: 'Hypersegmented neutrophil', value: '> 5 nuclear lobes', note: 'The megaloblastic tell — often appears BEFORE macrocytosis in B12/folate deficiency.' },
      { label: 'Haemolysis triad', value: '↑LDH · ↑indirect bilirubin · ↓haptoglobin', note: 'Destruction made measurable; haptoglobin is the most sensitive single marker.' },
    ],
    imaging:
      'Blood-film microscopy is the "imaging" of haematology: small pale cells with pencil cells (iron), oval macrocytes with hypersegmented polys (megaloblastic), sickles, spherocytes, schistocytes, bite cells. Cross-sectional imaging earns its place for causes: GI imaging/endoscopy for occult bleeding; ultrasound for splenomegaly in chronic haemolysis.',
    pathologyCorrelation:
      'Marrow: megaloblastic anaemia shows nuclear-cytoplasmic asynchrony (mature cytoplasm, immature nucleus — "nuclear-cytoplasmic dissociation"); iron deficiency shows absent iron on Prussian-blue stain; sideroblastic shows ring sideroblasts (iron-ringed mitochondria around the nucleus); aplastic shows a fatty, empty marrow.',
    reasoning: [
      { stage: 'symptom', label: 'Young woman, fatigue, breathlessness on stairs, pica for ice', detail: 'Fatigue + pica + demographic = anaemia first, iron deficiency high on the list.' },
      { stage: 'mechanism', label: 'Menstrual loss + poor dietary iron → empty stores → small pale cells', detail: 'Iron is the construction material of haem; without it, red cells leave the marrow small (↓MCV) and pale (↓MCH).' },
      { stage: 'differential', label: 'Microcytic: IDA vs ACD vs thalassaemia trait vs sideroblastic', detail: 'TAILS list — iron studies arbitrate; thalassaemia is the mild-anaemia/high-RBC-count impostor.' },
      { stage: 'investigation', label: 'CBC → MCV 68 fL, RBC 5.9 million, RDW high; ferritin 6 ng/mL, TIBC high', detail: 'Low ferritin is diagnostic of empty stores; high RDW says heterogeneous sizes (IDA, not uniform thalassaemia).' },
      { stage: 'interpretation', label: 'Microcytic, high-RDW, ferritin-low, TIBC-high', detail: 'Iron-deficiency anaemia confirmed — and in a woman of this age, menorrhagia is the leading suspect cause.' },
      { stage: 'diagnosis', label: 'Iron-deficiency anaemia, presumptively menstrual-loss-driven', detail: 'Named disease + named mechanism.' },
      { stage: 'management', label: 'Oral iron replacement + treat the bleeding source; recheck counts and stores', detail: 'Replace the missing substrate AND close the leak; Hb recovers in weeks, stores need months. Verify current dosing guidance.' },
      { stage: 'complication', label: 'If ignored: worsening cardiodynamic strain; in men/postmenopausal — missed colon cancer', detail: 'The anaemia is a messenger; the message (blood loss) matters more than the number.' },
    ],
    mistakes: [
      'Treating the MCV as the diagnosis — it is a sorting number, not a disease.',
      'Forgetting combined deficiency (iron + B12) can normalise MCV — microcytic cells hide inside a normal average.',
      'Confusing ferritin (iron STORES; an acute-phase reactant — high in inflammation even when iron-deficient) with serum iron.',
      'Missing thalassaemia trait — giving lifelong "iron" to a person whose ferritin is normal; check iron studies BEFORE iron.',
      'Ignoring pica and koilonychia — old signs still carrying diagnostic weight.',
    ],
    analogies: [
      'MCV = sorting laundry by size before you look for stains — one quick observation that halves the suspect list.',
      'Reticulocytes = the factory’s fresh shift; counting them tells you whether the factory knows about the problem (loss) or is itself the problem (production).',
      'Ferritin = the pantry; haemoglobin = today’s cooked meal. The pantry empties FIRST.',
    ],
    examRelevance:
      'NEET-PG staple: given CBC + iron studies, name the anaemia; Mentzer arithmetic; B12-vs-folate discriminators (MMA, neurology); haemolysis lab triad; spherocyte/Coombs logic (warm AIHA Coombs+, hereditary spherocytosis Coombs−).',
    clinicalRelevance:
      'Anaemia clinics, antenatal visits, and every "routine" CBC: the MCV fork plus one retic count resolves most cases in two lines of investigation — the highest yield-per-rupee diagnostic algorithm in medicine.',
    teachDeeper: [
      'Sideroblastic anaemia: iron enters mitochondria but haem synthesis stalls — ring sideroblasts; think alcohol, drugs (isoniazid), lead, and X-linked ALA-S mutations.',
      'Lead poisoning anaemia: basophilic stippling + inhibited ferrochelatase — microcytic with a different fingerprint.',
      'Hepcidin: the master iron hormone — inflammation raises it (iron locked away), deficiency of its regulation underlies thalassaemia iron overload; the bridge between ACD and modern iron therapy.',
      'Aplastic vs pure red cell aplasia: three-lineage vs single-lineage failure — and the drug/viral culprits exams ask (chloramphenicol, parvovirus B19).',
    ],
    crossLinks: [
      { conceptId: 'c-idacda', label: 'Iron Deficiency vs Anaemia of Chronic Disease (Pathology)', why: 'The seeded concept holds the classic two-way table — this lesson is its algorithmic parent.' },
      { conceptId: 'c2-cm-epidemiological-measures', label: 'Epidemiological Measures (this pack)', why: 'Anaemia prevalence is a headline population measure — incidence/prevalence logic in action.' },
      { conceptId: 'c2-pharmacology-antibiotics', label: 'Antibiotics by Mechanism (this pack)', why: 'Chloramphenicol links both tables — aplastic anaemia as a pharmacology price.' },
      { conceptId: 'c-aki', label: 'Acute Kidney Injury (Medicine)', why: 'Renal EPO failure is the normocytic anaemia of renal disease.', subject: 'Medicine' },
    ],
    global: [
      {
        region: 'India',
        screening: 'Anaemia is a recognised major public-health problem — national surveys (NFHS series) measure Hb prevalence at scale, and programmes such as Anemia Mukt Bharat operate a 6X6X6 strategy framework (6 beneficiaries, 6 interventions, 6 institutional mechanisms). Iron-folic-acid supplementation in pregnancy and adolescence is a standard component.',
        terminology: ['IFA — iron-folic acid supplementation', 'AMB — Anemia Mukt Bharat', 'HPLC — test used to characterise haemoglobinopathies'],
        note: 'Describes programme framing at overview level — verify current programme documents for operational specifics.',
      },
      {
        region: 'United States',
        screening: 'Preventive-services bodies weigh routine anaemia screening selectively (pregnancy, high-risk groups) rather than universally; newborn screening includes sickle-cell disease by name.',
        terminology: ['USMLE teaching emphasizes the same MCV algorithm', 'NBS — newborn screening panel'],
        note: 'Different population baseline (higher dietary iron, fortification) — the same science, different public-health weighting.',
      },
      {
        region: 'United Kingdom',
        screening: 'NICE guidance frames anaemia (iron deficiency) investigation with explicit age-context: postmenopausal women and men with unexplained iron deficiency merit GI investigation.',
        terminology: ['NICE — National Institute for Health and Care Excellence', 'FBC — full blood count (UK term for CBC)'],
        note: 'The "find the bleed" principle is universal; the trigger thresholds are guideline-specific.',
      },
      {
        region: 'WHO/Global',
        delivery: 'WHO classifies anaemia severity by population prevalence (mild/moderate/severe public-health categories) and drives fortification and supplementation programmes; haemoglobinopathies (thalassaemia, sickle) receive dedicated global programme attention.',
        terminology: ['Public-health significance categories by prevalence', 'HbA2 — electrophoresis fraction used in beta-thalassaemia trait'],
        note: 'Where prevalence is high, the population-level response (fortification, supplementation) matters as much as the individual workup.',
      },
    ],
    sources: [
      whoRef('WHO haemoglobin thresholds for the diagnosis of anaemia (public-health framing)'),
      cdcRef('CDC — haemoglobinopathies and iron-deficiency resources'),
      jhmiRef('Johns Hopkins Medicine — anaemia patient/professional education'),
      niceRef('NICE — anaemia (iron deficiency) guidance framing'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Transfusion thresholds, iron-dose regimens and programme details evolve — verify against current WHO/NICE/national guidance before clinical use.',
  },

  // ── Topic: t-patho-hemapath ────────────────────────────────────────────────
  {
    id: 'c2-pathology-leukaemias',
    name: 'Leukaemias: AML · CML · ALL · CLL Quick-Logic + the Philadelphia Chromosome',
    kind: 'disease',
    oneLiner:
      'The four classic leukaemias sort by two questions — acute (blasts) or chronic (mature-looking cells)? and myeloid or lymphoid? — with a handful of signature clues (Auer rods, smudge cells, PAS positivity, the Philadelphia chromosome) that unlock each vignette.',
    whyMatters:
      'Leukaemia questions are among the most reliably repeated marks in NEET-PG pathology because they are SHORT and LOGICAL: age + cell line + one signature finding + one cytogenetic. Clinically, recognising the marrow-failure triad (anaemia → fatigue, neutropenia → infection, thrombocytopenia → bleeding) can be the difference between an early and a late diagnosis, and the Philadelphia chromosome is the poster child of mechanism-based therapy (imatinib) — the story that rewrote oncology.',
    explain30s:
      'Bone marrow makes blood; leukaemia is marrow becoming a monoculture. ACUTE leukaemias are packed with BLASTS — immature cells that crowd out normal marrow, so the patient presents with marrow failure: anaemia, infections, bleeding. Which blasts? Myeloblasts with AUER RODS (needle-like granules) = AML — adults; lymphoblasts, PAS-positive, common in CHILDREN, love the CNS = ALL. CHRONIC leukaemias have mature-looking cells and slower stories. CML — middle-aged adults, gigantic spleen, very high WBC with basophilia, and the PHILADELPHIA CHROMOSOME t(9;22) making the BCR-ABL fusion tyrosine kinase — druggable by imatinib; it runs chronic → accelerated → blast crisis. CLL — elderly, lymphocytosis of mature B cells, SMUDGE CELLS on smear, hypogammaglobulinaemia, warm autoimmune haemolytic anaemia, and possible Richter transformation to aggressive lymphoma. Two more cytogenetics that pay rent: t(15;17) (APL/M3 — DIC, cured by all-trans retinoic acid) and t(8;21)/inv(16) (core-binding-factor AML — better prognosis).',
    eli5:
      'The bone marrow is a school producing four graduate classes: red cells (delivery vans), platelets (road-repair crew), neutrophils (police), lymphocytes (detectives). A leukaemia is when ONE student type takes over the whole school and stops everyone else from graduating. Acute leukaemia = the takeover is by students who refuse to grow up (blasts) — the school collapses within weeks, so the child or adult gets weak (no vans), infected (no police), bruised (no road crew). Chronic leukaemia = the takeover is by grown-up-looking staff who just multiply and crowd the halls slowly — people feel fine for months. Now the detective tricks: AML students carry needle-pockets (Auer rods); ALL students love sugar-paint (PAS+) and travel to the brain; CML carries a ID badge forged from two genes stuck together (BCR-ABL — badge number 9;22, nicknamed Philadelphia) — and modern medicine can print a key (imatinib) that fits that forged badge specifically; CLL students are so fragile they smudge when you touch the slide (smudge cells) and sometimes start arresting their own citizens (autoimmune anaemia).',
    firstPrinciples: [
      'The 2×2 grid comes first: acute vs chronic (blasts vs mature cells) × myeloid vs lymphoid = AML, ALL, CML, CLL. Almost every stem can be placed on this grid before any special fact.',
      'Acute leukaemias present as MARROW FAILURE (anaemia, neutropenia → infection, thrombocytopenia → petechiae/bleeding) ± tissue infiltration (gum hypertrophy in AML M4/M5, CNS in ALL, bone pain). Chronic leukaemias often present INCIDENTALLY (high counts) or with splenomegaly (CML) / painless lymphadenopathy (CLL).',
      'AML — the myeloblast with Auer rods: adults; Auer rods (myeloperoxidase crystals) define the family; M3 (acute promyelocytic leukaemia, t(15;17), PML-RARA) is the exam’s favourite because it causes DIC and is curable with all-trans-retinoic acid (the receptor-fusion drug principle).',
      'ALL — the child’s disease (most common childhood malignancy): lymphoblasts, PAS+ (glycogen), TdT+, bone pain (marrow expansion), CNS sanctuaries (needs CNS prophylaxis); t(12;21) ETV6-RUNX1 is a common favourable childhood translocation; Philadelphia-positive ALL occurs in adults and worsens prognosis.',
      'CML — the Philadelphia story: t(9;22) fuses BCR with ABL → constitutively active tyrosine kinase → granulocyte overgrowth; total WBC very high, basophils and eosinophils, massive splenomegaly, low LDH? (no — keep: leukaemic arthritis from urate). Natural history: chronic phase → accelerated phase → blast crisis (the more blasts, the more it behaves like acute leukaemia). Imatinib targets the fusion kinase — mechanism-into-medicine.',
      'CLL — the elderly B-cell bulge: mature small lymphocytes, SMUDGE cells (fragile cells crushed in the smear), hypogammaglobulinaemia (despite being B cells they are dysfunctional), warm autoimmune haemolytic anaemia (Coombs+), Richter transformation to diffuse large B-cell lymphoma.',
      'Cytogenetics is PROGNOSIS: t(15;17) APL → ATRA curable; t(8;21)/inv(16) core-binding-factor AML → favourable; Ph+ ALL → poor; complex karyotype in AML → poor. The chromosome answer often IS the treatment answer.',
    ],
    normal:
      'Normal marrow balances production against loss with feedback: EPO for red cells, thrombopoietin for platelets, G-CSF for neutrophils, and a strict blast ceiling — blasts are a transient, tiny fraction of marrow. Leukaemia is the loss of that ceiling plus differentiation arrest.',
    mechanism:
      'Marrow monoculture: a clone with growth/differentiation mutations fills the niches, suppresses normal haematopoiesis (crowding + cytokines), and spills into blood. Organ burden follows the cells: spleen (CML’s trade-mark splenomegaly), lymph nodes (CLL), CNS and testes (ALL sanctuary sites with poor drug penetration). Metabolic consequences of cell turnover: hyperuricaemia and tumour-lysis syndrome when therapy kills cells fast — potassium, phosphate, urate up; calcium down; renal crystal injury.',
    presentation: [
      'Acute (AML/ALL): days-to-weeks of fatigue, fever, gum/mucosal bleeding, petechiae, bone pain; exam shows pallor, sternal tenderness, hepatosplenomegaly; AML M4/M5 with gum hypertrophy; AML M3 with bleeding/DIC out of proportion.',
      'CML: incidental high WBC or left-upper-quadrant fullness; massive splenomegaly; gout attacks from urate; basophilia on the differential.',
      'CLL: elderly, asymptomatic lymphocytosis found on routine FBC; painless generalized lymphadenopathy; recurrent infections (functional hypogammaglobulinaemia).',
      'Laboratory presentation: blasts on peripheral smear; marrow examination (aspiration/biopsy) with flow cytometry and cytogenetics completes classification.',
    ],
    diagnosis: [
      'CBC + smear first: blast percentage, cell morphology (Auer rods, smudge cells), basophilia.',
      'Marrow aspiration/biopsy: cellularity, blast % (≥20% blasts defines acute leukaemia in the standard classification — widely used teaching threshold).',
      'Cytochemistry: myeloperoxidase/sudan black positive = myeloid; PAS+ and TdT+ = lymphoid (classic teaching frame).',
      'Flow cytometry markers: CD34/CD117 blasts; myeloid CD13/CD33; lymphoid CD10/CD19/CD20 (B), CD3 (T).',
      'Cytogenetics/molecular: karyotype + FISH/PCR for t(9;22) BCR-ABL, t(15;17) PML-RARA, t(8;21), inv(16) — the prognosis-and-therapy layer.',
    ],
    differentials: [
      { name: 'AML', key: 'Adults + Auer rods + marrow failure; M3 = DIC + t(15;17) + ATRA.' },
      { name: 'ALL', key: 'Children + PAS+/TdT+ lymphoblasts + bone pain + CNS risk; commonest childhood cancer.' },
      { name: 'CML', key: 'Middle age + huge spleen + very high WBC + basophilia + t(9;22) BCR-ABL; three phases; imatinib-sensitive.' },
      { name: 'CLL', key: 'Elderly + mature lymphocytosis + smudge cells + hypogammaglobulinaemia ± Coombs+ AIHA; Richter transformation.' },
      { name: 'Leukaemoid reaction', key: 'Reactive WBC surge (severe infection) mimicking leukaemia — marked toxic granulation, LAP score high (classic teaching), no basophilia/blast surge, resolves with the cause.' },
    ],
    management: [
      'Principle 1 — acute leukaemia is an urgent referral diagnosis: stabilise the complications (infection, bleeding, tumour-lysis prophylaxis with hydration ± urate-lowering) while the workup runs.',
      'Principle 2 — classification drives therapy: ATRA for APL (M3) is the model of mechanism-directed cure; induction-then-consolidation frames the rest (verify current protocols — they evolve constantly).',
      'Principle 3 — CNS prophylaxis in ALL exists because the brain is a drug-sanctuary; sanctuary-site logic generalises.',
      'Principle 4 — targeted kinase inhibition (BCR-ABL TKIs) transformed CML into a chronic managed disease — the proof-of-concept for mechanism-based oncology.',
      'Principle 5 — supportive care is survival care: transfusion support, infection prevention, vaccination strategies adapted to the immunosuppressed (no live vaccines during intensive therapy — verify).',
      'All regimens are specialist territory — the educational principle is the LOGIC, never self-prescription. Verify against current guidelines.',
    ],
    complications: [
      'Tumour-lysis syndrome — K⁺↑, phosphate↑, urate↑, calcium↓, renal injury: the metabolic price of rapid kill; preventable with hydration/urate control.',
      'DIC in APL (M3) — tissue-factor-rich granules tip clotting into simultaneous bleeding and clots.',
      'Infection from neutropenia — the leading early killer; febrile neutropenia is an emergency construct built for this.',
      'Blast crisis in CML — the chronic disease resuming acute behaviour, often with new cytogenetic hits.',
      'Richter transformation in CLL — sudden conversion to aggressive lymphoma.',
    ],
    numbers: [
      { label: 'Acute-leukaemia blast threshold', value: '≥20% marrow blasts (standard classification teaching)', note: 'The number that draws the acute/chronic line in most modern classifications.' },
      { label: 'Philadelphia chromosome', value: 't(9;22)(q34;q11) → BCR-ABL1 fusion kinase', note: 'Present in ~all CML and a subset of ALL (adult-leaning, poor prognosis).' },
      { label: 'APL signature', value: 't(15;17) → PML-RARA; treated with all-trans retinoic acid', note: 'The exam’s favourite cure story — receptor-fusion blocked by its ligand.' },
      { label: 'Core-binding-factor AML', value: 't(8;21) and inv(16)', note: 'The favourable-prognosis pair — worth naming in any AML answer.' },
    ],
    pathologyCorrelation:
      'Smears do half the diagnosis: Auer rods (AML), smudge cells (CLL), blast predominance (acute). Marrow: hypercellular with monotypic infiltration; APL granules loaded with tissue factor; CML marrow granulocytic hyperplasia with small megakaryocytes.',
    reasoning: [
      { stage: 'symptom', label: '5-year-old with weeks of leg pain, pallor, fever, bruising', detail: 'Marrow-failure triad + bone pain + age = acute leukaemia until excluded; ALL is the statistical favourite in this age.' },
      { stage: 'mechanism', label: 'Lymphoblast clone crowds marrow → three-lineage failure', detail: 'Anaemia (pallor), neutropenia (fever), thrombocytopenia (bruising); marrow expansion gives bone pain.' },
      { stage: 'differential', label: 'ALL vs AML vs aplastic anaemia vs infections with cytopenias', detail: 'Age + blast morphology + cytochemistry separate the leukaemias; aplasia shows an EMPTY marrow, not a crowded one.' },
      { stage: 'investigation', label: 'CBC: WBC high, blasts on smear; marrow: >20% PAS+/TdT+ lymphoblasts; cytogenetics sent', detail: 'Blast percentage defines acuity; cytochemistry and flow define lineage.' },
      { stage: 'interpretation', label: 'B-cell ALL with standard-risk cytogenetics', detail: 'Lineage + cytogenetics set the risk group — the modern treatment plan is written by the cytogenetic report.' },
      { stage: 'diagnosis', label: 'Acute lymphoblastic leukaemia', detail: 'Named, staged for risk, therapy pathway selected.' },
      { stage: 'management', label: 'Multidrug induction + CNS prophylaxis + supportive care per protocol (specialist)', detail: 'Sanctuary logic (CNS), lysis prevention, infection control. Verify current protocol.' },
      { stage: 'complication', label: 'Tumour-lysis, febrile neutropenia, relapse', detail: 'The three early threats are metabolic, infectious, and clonal — each with a pre-planned response.' },
    ],
    mistakes: [
      'Forgetting Philadelphia-positive ALL — "Philadelphia = CML" is true ~most of the time, not all; adult ALL with Ph is a poor-prognosis alarm.',
      'Missing the leukaemoid-reaction impostor — infection-driven leukocytosis with toxic granulation is not CML; basophilia is the CML hint.',
      'Not connecting APL with DIC — bleeding in a new AML is an M3 red flag with an ATRA-based emergency response.',
      'Calling CLL "harmless" — hypogammaglobulinaemia, AIHA and Richter transformation are real clinical duties.',
      'Ignoring urate prophylaxis before starting therapy — tumour-lysis is a planned-for complication, not a surprise.',
    ],
    analogies: [
      'The 2×2 grid = the period before the map: place the disease in acute/chronic × myeloid/lymphoid and half the options vanish.',
      'BCR-ABL and imatinib = a forged master key; imatinib is a key-cutting lock that jams exactly that forgery — mechanism-based therapy in one image.',
    ],
    examRelevance:
      'Signature-match questions dominate: Auer rods→AML, PAS/TdT→ALL, smudge cells→CLL, basophilia+splenomegaly+t(9;22)→CML; M3-DIC-ATRA triads; t(8;21)/inv(16) favourable AML; Richter transformation. Age-prognosis pairings (children→ALL best cure rates; adults→AML dominates) are constant.',
    clinicalRelevance:
      'Febrile neutropenia protocols, tumour-lysis prophylaxis, and TKI adherence counselling all trace to this lesson; recognising "incidental high WBC + big spleen" as a possible CML is a genuine GP-level skill.',
    teachDeeper: [
      'Why ATRA cures APL: the PML-RARA fusion blocks myeloid differentiation; retinoic acid binds the fusion receptor and releases the block — differentiation therapy personified.',
      'CLL biology: it is a disease of anti-apoptotic B cells (BCL-2) as much as proliferation — the logic behind BCL-2 inhibitors.',
      'CML blast crisis: additional mutations (often ABL kinase-domain or tumour-suppressor hits) push the chronic clone into acute behaviour.',
      'Allogeneic transplant logic in leukaemia: graft-versus-leukaemia effect — the donor immune system becomes therapy.',
    ],
    crossLinks: [
      { conceptId: 'c-leukemia', label: 'Acute Leukaemias ALL vs AML (Pathology)', why: 'The seeded concept holds the childhood-acute story; this lesson adds the chronic half and the cytogenetic layer.' },
      { conceptId: 'c2-pathology-anemias', label: 'Anaemias: MCV Workup (this pack)', why: 'Pancytopenia and haemolysis borders meet here — marrow failure vs peripheral destruction.' },
      { conceptId: 'c-coag', label: 'Coagulation Cascade & Anticoagulants (Pathology)', why: 'APL-DIC is the leukaemia-coagulation junction.' },
      { conceptId: 'c2-microbiology-sepsis', label: 'Sepsis (this pack)', why: 'Febrile neutropenia is sepsis with a leukaemia plot twist.' },
    ],
    sources: [
      ncbiRef('Leukaemia classification and cytogenetics review literature (PubMed Central indexing)'),
      jhmiRef('Johns Hopkins Medicine — leukaemia education pages'),
      whoRef('WHO classification framing for haematolymphoid tumours (reference)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Treatment protocols evolve rapidly — this lesson teaches classification logic; verify all regimen details against current haemato-oncology guidelines.',
  },

  // ── Topic: pathology-thyroid ───────────────────────────────────────────────
  {
    id: 'c2-pathology-thyroid-pathology',
    name: 'Thyroid Pathology: Goitre, Thyroiditis & the Four Carcinomas',
    kind: 'disease',
    oneLiner:
      'Thyroid pathology sorts into four shelves — enlargements (goitre), inflammations (thyroiditis), functional overgrowth (Graves), and tumours (papillary, follicular, medullary, anaplastic) — and each shelf has one memorable fingerprint.',
    whyMatters:
      'The thyroid is the exam’s favourite endocrine organ and the clinic’s commonest neck lump: every lump algorithm (history → TSH → ultrasound → FNAC) runs through this lesson. It also stitches beautifully — Hashimoto to hypothyroidism, Graves to thyroid storm, papillary carcinoma to radiation exposure, medullary carcinoma to MEN2 — so one lesson harvests marks across pathology, medicine and surgery.',
    explain30s:
      'GOITRE: diffuse enlargement from TSH drive — iodine deficiency (endemic) or biosynthetic blocks; nodular goitre develops after repeated hyper/hypoplasia cycles. THYROIDITIS: Hashimoto (autoimmune — lymphocytes, Hürthle-cell change, anti-TPO antibodies → usually hypothyroid; small risk of lymphoma), subacute/de Quervain (post-viral, PAINFUL, tender gland, high ESR, transient hyper→hypo), Riedel (fibrosing, woody). GRAVES: stimulating TSH-receptor antibodies drive diffuse hyperplasia — hyperthyroidism with ophthalmopathy. TUMOURS: follicular ADENOMA (encapsulated, benign); PAPILLARY carcinoma (most common, nuclear grooves, Orphan-Annie nuclei, psammoma bodies, lymphatic spread, best prognosis); FOLLICULAR carcinoma (haematogenous spread — bone/lung; diagnosed by capsular/vascular invasion, not cytology); MEDULLARY carcinoma (C-cells, calcitonin, amyloid stroma, MEN2A/2B with RET); ANAPLASTIC carcinoma (elderly, rapidly enlarging rock-hard mass, dismal).',
    eli5:
      'The thyroid is a butterfly-shaped factory making "speed-up" hormone. GOITRE is the factory building extra floor space because the boss (TSH) keeps shouting "more output!" — usually because the raw material (iodine) is short. THYROIDITIS is the factory on fire in different ways: Hashimoto = the factory’s own security guards (autoantibodies) attack it, and over the years the factory under-produces; de Quervain = after a viral passing-by, the factory is red-hot and painful, runs fast for a while, then crashes briefly. GRAVES = a forged memo ("we want MORE!") orders every wall of the factory to grow and overproduce — and the eyes and shins get collateral memos (exophthalmos, pretibial myxoedema). TUMOURS: papillary is the common, slow, well-behaved bully that travels by lymph but rarely kills; follicular sneaks into the bloodstream (bones, lungs); medullary comes from a different department (the C-cells) and leaves a calcitonin breadcrumb trail; anaplastic is the monster — an elderly patient whose neck grows a stone overnight.',
    firstPrinciples: [
      'Frame every thyroid presentation with the TSH axis first: is the gland overworking (TSH low), underworking (TSH high), or structurally changed with normal function? Pathology and physiology must agree before you name the disease.',
      'Goitre logic: ANY sustained TSH drive enlarges the gland — iodine deficiency, goitrogens, biosynthetic enzyme blocks. Multinodular change is the long-term consequence of repeated growth cycles.',
      'Hashimoto fingerprint: autoimmune lymphocytic destruction with Hürthle-cell (oncocytic) change and anti-TPO/anti-thyroglobulin antibodies → hypothyroidism (mostly), lymphoma risk (rare but examinable).',
      'De Quervain fingerprint: PAINFUL, tender, post-viral, high ESR, transient thyrotoxicosis from destroyed follicles leaking hormone (the "leak, then empty" pattern), then recovery.',
      'Graves fingerprint: TSH-receptor stimulating antibodies → diffuse vascular hyperplasia (bruit audible), ophthalmopathy and dermopathy are autoantibody-mediated extras that hyperthyroidism alone never gives.',
      'Papillary vs follicular — the two great contrasts: papillary = most common, lymphatic spread, nuclear features (Orphan-Annie nuclei, grooves, pseudoinclusions) + psammoma bodies, excellent prognosis; follicular = haematogenous spread, diagnosed by capsular/vascular invasion (FNAC cannot see invasion — the classic cytology trap).',
      'Medullary and anaplastic complete the four: medullary = C-cells, calcitonin (a true tumour marker), amyloid stroma, RET/MEN2 screening of relatives; anaplastic = the elderly, rapidly fatal rock — recognition matters because the plan is palliative-facing.',
    ],
    normal:
      'The thyroid is a vascular bilobed gland under pituitary (TSH) control producing T4/T3 from iodinated thyroglobulin in follicles lined by cuboidal epithelium; C-cells (calcitonin) sit between follicles. Normal gland is ~15–25 g, invisible and impalpable or just perceptible.',
    mechanism:
      'Hashimoto = type IV-ish autoimmune destruction (T-cell mediated) plus autoantibodies; follicles destroyed, germinal centres form, residual cells become Hürthle cells. Graves = stimulating antibodies mimicking TSH; gland grows and secretes regardless of pituitary feedback (TSH suppressed). Papillary carcinoma: radiation-associated, BRAF-type pathway activation (framing — mechanisms evolve); spreads via lymphatics. Follicular carcinoma invades capsule and vessels — the histologic step that adenoma cannot take. Medullary secretes calcitonin; stroma deposits amyloid (calcitonin-derived).',
    presentation: [
      'Diffuse painless enlargement ± hypothyroid symptoms (Hashimoto); tenderness and fever (de Quervain); hyperthyroidism with eye signs and tremor (Graves).',
      'Solitary nodule: the FNAC-first workup (TSH → ultrasound → FNAC; function scanned only if TSH low — the "hot nodule rarely cancers" logic).',
      'Rapidly enlarging hard fixed neck mass with compressive symptoms in an elderly patient = anaplastic carcinoma alarm.',
      'Medullary carcinoma: thyroid nodule ± diarrhoea (calcitonin effect) ± family history of endocrine tumours → screen RET.',
    ],
    diagnosis: [
      'TSH first (function), ultrasound next (structure: microcalcifications, irregular margins, taller-than-wide shape are the suspicious ultrasound flags), FNAC third (cells), lobectomy when follicular-neoplasm cytology needs capsular assessment.',
      'Anti-TPO for Hashimoto; ESR + uptake scan for de Quervain (low uptake with high ESR in the painful phase).',
      'Calcitonin for suspected medullary carcinoma; RET germline testing for MEN2 families.',
      'Psammoma bodies on histology → think papillary carcinoma even when found incidentally (e.g., in a node).',
    ],
    differentials: [
      { name: 'Hashimoto thyroiditis', key: 'Painless, firm, diffuse; anti-TPO+; hypothyroid drift; lymphoid aggregates + Hürthle cells; lymphoma risk.' },
      { name: 'Subacute (de Quervain) thyroiditis', key: 'PAINFUL + fever + high ESR after viral illness; transient thyrotoxicosis with LOW radioiodine uptake (inflamed follicles cannot take up iodine).' },
      { name: 'Graves disease', key: 'Diffuse hyperplasia + ophthalmopathy/dermopathy + stimulating TRAb; HIGH uptake.' },
      { name: 'Papillary carcinoma', key: 'Commonest; lymphatic spread; nuclear grooves + Orphan-Annie nuclei + psammoma bodies; best prognosis.' },
      { name: 'Follicular carcinoma', key: 'Haematogenous spread (bone/lung); capsular/vascular invasion — invisible to FNAC, hence "follicular neoplasm" reports go to surgery.' },
      { name: 'Medullary carcinoma', key: 'C-cell, calcitonin↑, amyloid stroma, MEN2A/2B (RET) — parafollicular, not follicular.' },
    ],
    management: [
      'Principle 1 — function before structure: normalise the TSH axis conversation first; a hyperfunctioning nodule is rarely malignant, a cold nodule with suspicious ultrasound needs cells (FNAC).',
      'Principle 2 — Hashimoto is managed as hypothyroidism (replacement) with awareness of the (rare) lymphoma red flags; de Quervain is managed for PAIN (NSAIDs/steroids) — the gland usually recovers.',
      'Principle 3 — differentiated carcinoma (papillary/follicular) principles: surgery first; radioiodine for uptake; TSH-suppression logic (TSH drives thyroid tissue growth); excellent prognosis for papillary. Verify current staging/therapy guidance.',
      'Principle 4 — medullary carcinoma is surgically managed and genetically counselled (RET) — calcitonin tracks disease.',
      'Principle 5 — anaplastic carcinoma shifts goals toward comfort and airway security — honest, compassionate framing.',
    ],
    complications: [
      'Compressive goitre: tracheal deviation/stridor, dysphagia — the surgical urgency inside a "benign" story.',
      'Untreated Hashimoto → myxoedema; Graves untreated → thyroid storm (the ICU end of this lesson).',
      'Papillary carcinoma → cervical nodes (still good prognosis); follicular → distant metastases (bone pathologic fractures).',
      'Medullary → familial screening cascade (MEN2); anaplastic → airway obstruction and death within months (median survival short — honest).',
    ],
    numbers: [
      { label: 'Most common thyroid carcinoma', value: 'Papillary carcinoma', note: 'And the best-prognosed — "P for popular, P for prognosis". Radiation exposure in childhood is a classic risk factor.' },
      { label: 'FNAC blind spot', value: 'Capsular/vascular invasion (follicular carcinoma)', note: 'Cytology sees cells, not capsules — hence the "follicular neoplasm" diagnostic category.' },
      { label: 'Tumour marker', value: 'Calcitonin (medullary carcinoma)', note: 'One of the few true tumour markers usable for diagnosis and follow-up — plus RET germline in MEN2.' },
    ],
    imaging:
      'Ultrasound is the workhorse: suspicious flags = microcalcifications, irregular/infiltrative margins, taller-than-wide shape, abnormal cervical nodes. Radioiodine scans classify nodules as hot (functioning, rarely malignant) vs cold (non-functioning — the cancer-risk pool). CT/MRI reserved for retrosternal extension and anaplastic airway assessment.',
    pathologyCorrelation:
      'Hashimoto: dense lymphoid infiltrate with germinal centres, Hürthle cells. Graves: crowded tall follicular cells with scalloped colloid. Papillary: crowded overlapping nuclei, grooves, pseudoinclusions, psammoma bodies. Follicular carcinoma: microfollicles breaching a full capsule with vascular invasion. Medullary: nests of plasmacytoid cells in amyloid (Congo-red positive).',
    reasoning: [
      { stage: 'symptom', label: '40-year-old woman, painless neck swelling, tiredness, cold intolerance', detail: 'Painless goitre + hypothyroid symptoms: autoimmune thyroiditis leads the list.' },
      { stage: 'mechanism', label: 'T-cell/autoantibody destruction of follicles (Hashimoto)', detail: 'Anti-TPO antibodies mark the process; the gland first struggles (TSH↑), then fails.' },
      { stage: 'differential', label: 'Hashimoto vs iodine-deficiency goitre vs silent nodule pathology', detail: 'Diffuse + firm + antibodies vs endemic history vs a single suspicious nodule — ultrasound and antibodies arbitrate.' },
      { stage: 'investigation', label: 'TSH high; anti-TPO strongly positive; ultrasound diffuse hypoechoic', detail: 'Function says underactive; structure says diffuse — no nodule to chase.' },
      { stage: 'interpretation', label: 'Autoimmune (Hashimoto) thyroiditis with hypothyroidism', detail: 'Named pathology with a named mechanism.' },
      { stage: 'diagnosis', label: 'Hashimoto thyroiditis', detail: 'Replacement therapy ahead; counsel on lifelong monitoring and the (rare) lymphoma red flags.' },
      { stage: 'management', label: 'Levothyroxine replacement titrated to TSH per protocol', detail: 'Principle: replace to normalize the axis; recheck TSH after stabilisation intervals. Verify current targets.' },
      { stage: 'complication', label: 'Progressive hypothyroidism if untreated; rare lymphoma in long-standing disease', detail: 'The gland that burns out quietly still deserves an occasional look.' },
    ],
    mistakes: [
      'Calling every painful thyroid "Hashimoto" — Hashimoto is PAINLESS; de Quervain is the painful one with high ESR.',
      'Expecting FNAC to diagnose follicular carcinoma — it can only say "follicular neoplasm"; invasion needs the capsule.',
      'Forgetting medullary carcinoma is NOT a follicular-cell tumour — calcitonin, amyloid, MEN2 screening.',
      'Ignoring a rapidly growing hard neck mass in the elderly while ordering routine tests — that pattern is anaplastic carcinoma and an airway risk.',
    ],
    analogies: [
      'Papillary vs follicular spread = one travels by the postal service (lymph nodes), the other by the railway (bloodstream to bone/lung).',
      'FNAC and the capsule = you can interview the tenants (cells) but cannot judge the fence (capsule) without walking the boundary.',
    ],
    examRelevance:
      'Nuclear-feature matching (Orphan-Annie, grooves, psammoma), papillary-vs-follicular spread routes, de Quervain painful-low-uptake logic, medullary-calcitonin-MEN2 triads, and Hashimoto lymphoma risk are perennial; solitary-nodule FNAC sequencing is the classic "next step" question.',
    clinicalRelevance:
      'Neck-lump clinics run on this lesson daily: the TSH→ultrasound→FNAC sequence, the hot-nodule reassurance, and knowing when "follicular neoplasm" means surgery — practical pathology at its most literal.',
    teachDeeper: [
      'Thyroid lymphoma: almost always arises in Hashimoto glands — the rare reason to biopsy a rapidly enlarging Hashimoto goitre.',
      'Radioiodine therapy logic: differentiated carcinoma keeps iodine uptake — papillary/follicular absorb the isotope; medullary/anaplastic do not (different cell origin).',
      'RET proto-oncogene: germline mutations drive MEN2 medullary carcinoma — prophylactic thyroidectomy timing in carrier children is the textbook prevention story.',
      'Riedel thyroiditis: the woody, fibrosing impostor that invades neck structures — the "hard as board" benign disease.',
    ],
    crossLinks: [
      { conceptId: 'c-thyroidphys', label: 'Thyroid Hormone Synthesis & Action (Physiology)', why: 'Iodine, TPO, thyroglobulin — the physiology this pathology attacks.' },
      { conceptId: 'c-graves', label: 'Graves Disease (Medicine)', why: 'The hyperfunction half of the same gland’s story.' },
      { conceptId: 'c-thyroidnodule', label: 'Thyroid Nodule Workup (Surgery)', why: 'The clinical algorithm this pathology feeds.' },
      { conceptId: 'c-thyroidstorm', label: 'Thyroid Storm (Medicine)', why: 'Graves pathology at its ICU extreme.' },
    ],
    sources: [
      ncbiRef('Thyroid neoplasm pathology review literature (PubMed Central indexing)'),
      jhmiRef('Johns Hopkins Medicine — thyroid nodule and thyroid cancer education'),
      niceRef('NICE — thyroid cancer assessment and management guidance framing'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Nodule-malignancy risk stratification systems (and ultrasound lexicons) are updated periodically — verify current guideline versions.',
  },

  // ── Topic: t-patho-cvpath (ENRICHES existing concept c-cvpath-athero) ─────
  {
    id: 'c-cvpath-athero',
    name: 'Atherosclerosis',
    kind: 'disease',
    oneLiner:
      'Atherosclerosis is intimal plaque built from trapped, oxidised LDL and the immune response to it — endothelial injury first, fatty streak next, fibrofatty plaque, then the complications (rupture, thrombosis) that turn a silent lesion into a heart attack or stroke.',
    whyMatters:
      'It is the single upstream lesion behind ischaemic heart disease, ischaemic stroke and peripheral arterial disease — the world’s biggest killers. Exams ask its sequence and vessel ranking every year; clinics live inside it: every statin, antihypertensive and antiplatelet conversation is atherosclerosis prevention. Understanding the plaque explains why a "stable" chest pain history and an "unstable" one are different diseases of the same wall.',
    explain30s:
      'Start with endothelial injury/dysfunction (smoking, hypertension, diabetes, high LDL shear the wall). LDL slips into the intima, gets oxidised, and attracts macrophages, which swallow it and become FOAM CELLS — the fatty streak, visible even in young aortas. Smooth muscle migrates from media to intima, lays down collagen, and a FIBROUS CAP forms over a lipid core: the fibrofatty plaque. Over years, plaques calcify and the vessel remodels (often outward, so the lumen is spared — until it is not). The clinically decisive moment is COMPLICATION: cap rupture or erosion exposes thrombogenic contents → platelet thrombus → sudden occlusion (unstable angina/MI/stroke) or embolisation, haemorrhage into the plaque, or aneurysmal weakening (abdominal aorta). Large elastic/muscular arteries are hit in order: abdominal aorta > coronary > popliteal > carotid (classic teaching order).',
    eli5:
      'Imagine a water pipe whose inner lining gets scratched (smoke, high pressure, sugar). Grease (LDL) lodges in the scratches. Cleaning crews (macrophages) eat the grease until they are bloated and stuck — grease stains (fatty streaks). The pipe repairs itself by laying a plaster patch (fibrous cap) over the grease pocket. For years nothing happens — the pipe works. But if the patch cracks open, the grease core meets the blood and the blood does what blood does on any wound: it clots — instantly plugging the pipe. In the heart’s pipe that clot is a heart attack; in the brain’s, a stroke. The whole discipline of prevention — stop smoking, control pressure and sugar, lower grease — is aimed at keeping the patch intact.',
    firstPrinciples: [
      'The initiating insult is endothelial dysfunction — the endothelium stops being a smooth anti-clotting, anti-inflammatory surface (NO falls, adhesion molecules rise). All major risk factors (smoking, hypertension, diabetes, dyslipidaemia) attack the endothelium first.',
      'LDL retention and oxidation drive the lesion: retained LDL is modified, monocytes adhere (VCAM-1), enter, and become macrophages; oxidised LDL is engulfed via scavenger receptors (unregulated — hence foam cells).',
      'Fatty streak → fibrofatty plaque: the lipid core is walled off by smooth-muscle-derived collagen (the fibrous cap) — the cap is both protection and the site of future failure.',
      'Plaque biology explains clinical behaviour: STABLE plaque = thick cap, small lipid core → predictable effort angina; UNSTABLE plaque = thin cap, big lipid core, inflammatory shoulder ("shoulder region" ruptures) → rupture, thrombosis, acute events.',
      'Vessel preference order (classic): abdominal aorta > coronary arteries > popliteal > carotid — and within vessels, branch points and low-shear areas (flow disturbs endothelium).',
      'Remodelling: vessels often expand outward (positive remodelling) early — the lumen stays open while the plaque grows; angiography sees the lumen, pathology sees the wall — why sudden events can appear "from nowhere".',
      'Complications are the clinical endgame: rupture/erosion → thrombosis; haemorrhage into plaque; embolism; calcification (stiff vessels); aneurysm (media weakened — abdominal aorta).',
    ],
    normal:
      'Normal arteries have three layers: intima (thin endothelium-lined), media (smooth muscle — tone), adventitia (vessels of the vessel). The endothelium actively repels platelets and leukocytes and produces vasodilators (NO). Atherosclerosis is intimal disease with media consequences.',
    mechanism:
      'A chronic inflammatory lipid-storage disease: every stage has an immune cell — monocyte adhesion (selectins/integrins), foam-cell formation (scavenger receptors), T-cell activation, cytokines (IFN-γ, TNF), matrix remodelling (MMPs thin the cap). Lipid chemistry: LDL↓ and HDL logic frame risk (HDL reverse-transport framing is classical teaching, nuances evolving); triglyceride-rich particles and Lp(a) add texture. Risk-factor arithmetic: hypertension injures endothelium mechanically; diabetes glycosylates and inflames it; smoking oxidises and vasoconstricts; LDL supplies the substrate — remove substrate, and the disease slows (statin logic).',
    presentation: [
      'Silent for decades — the first presentation is often the complication: effort chest pain (stable plaque), acute chest pain/sudden death (rupture), claudication (peripheral), TIA/stroke (carotid), renovascular hypertension (renal ostial disease).',
      'Signs of the substrate: xanthelasma, tendon xanthomas (familial hypercholesterolaemia clues), premature disease family history.',
      'Abdominal aortic aneurysm presentation: pulsatile abdominal mass, back pain — the complicated-plaque artery in aneurysm mode.',
    ],
    diagnosis: [
      'Clinical risk framing: risk-factor profile + symptom pattern first.',
      'Anatomy: coronary angiography (lumen), CT coronary calcium scoring (the plaque burden made visible), carotid/duplex ultrasound (plaque + stenosis), ankle-brachial index (peripheral disease).',
      'Lipid panel (LDL/HDL/TG), HbA1c, blood pressure — the modifiable substrate audit.',
      'Acute-event chemistry (troponin) belongs to the downstream complication, not the plaque itself.',
    ],
    differentials: [
      { name: 'Stable vs unstable plaque', key: 'Thick cap/small core (stable angina) vs thin cap/large inflammatory core (rupture → ACS) — same disease, different moment.' },
      { name: 'Atherosclerosis vs arteriolosclerosis vs Mönckeberg', key: 'Intimal lipid plaque in elastic/muscular arteries vs hyaline/hyperplastic small-vessel change (diabetes/HTN) vs medial calcification (benign, elderly, "pipe-stem").' },
      { name: 'Aneurysm vs occlusive disease', key: 'Same complicated plaques, two failure modes — wall weakening (abdominal aorta) vs lumen compromise (coronary).' },
    ],
    management: [
      'Principle 1 — risk-factor control is the disease therapy: smoking cessation, blood-pressure control, glycaemic control, lipid lowering (statins as the cornerstone — verify targets/guidelines).',
      'Principle 2 — antiplatelet therapy for established disease per guideline (aspirin’s irreversible COX-1 logic lives in the pharmacology lesson).',
      'Principle 3 — revascularisation (stenting/bypass) relieves flow-limiting disease but does not remove the systemic substrate — plaque is a whole-artery, whole-person disease.',
      'Principle 4 — screen the family tree: premature atherosclerosis (men <55, women <65 in first-degree relatives — conventional teaching) raises suspicion for familial hypercholesterolaemia.',
      'All therapeutic specifics evolve — verify against current guidelines; the pathology principles above are stable.',
    ],
    complications: [
      'Acute coronary syndromes (rupture → thrombus spectrum), ischaemic stroke (carotid/embolic), peripheral arterial disease and critical limb ischaemia.',
      'Abdominal aortic aneurysm ± rupture — the complicated-plaque weakening of media; mesenteric ischaemia (SMA ostial disease) is the exam’s classic "pain out of proportion".',
      'Renovascular hypertension and ischaemic nephropathy (ostial renal artery disease).',
    ],
    numbers: [
      { label: 'Classic vessel-involvement order', value: 'Abdominal aorta > coronary > popliteal > carotid', note: 'Robbins-canonical ranking — a direct exam question.' },
      { label: 'Fatty streak', value: 'Can appear in the aorta even in childhood/young adults', note: 'The earliest lesion is not an old-age phenomenon — prevention logic starts early.' },
      { label: 'Familial hypercholesterolaemia clue', value: 'Tendon xanthomas + premature CAD family history', note: 'The heterozygous form is among the commonest genetic lipid disorders — high suspicion saves families.' },
    ],
    imaging:
      'CT coronary-artery calcium scoring quantifies plaque BURDEN (calcium tracks atherosclerosis); contrast CT/CTA and conventional angiography show the LUMEN (and remodelled plaques can hide); carotid duplex measures stenosis % and plaque morphology; intravascular ultrasound/OCT (catheter-based) finally see the cap thickness — the unstable-cap question answered from inside.',
    pathologyCorrelation:
      'Gross: yellow fatty streaks → raised fibrofatty plaques → ulcerated, calcified, haemorrhagic complicated plaques. Microscopy: foam cells, cholesterol clefts, inflammatory cap with smooth-muscle layers, neovascularisation at the shoulder. Aortic aneurysm media shows elastin destruction.',
    reasoning: [
      { stage: 'symptom', label: '58-year-old smoker, chest tightness on climbing stairs, eased by rest', detail: 'Effort-triggered, rest-relieved = flow-demand mismatch over a fixed plaque: stable angina framing.' },
      { stage: 'mechanism', label: 'Fibrofatty plaque limits coronary flow reserve', detail: 'Endothelial injury decades ago → foam cells → cap → now the lumen pays the bill.' },
      { stage: 'differential', label: 'Stable angina vs ACS vs anaemia/structural causes of effort dyspnoea', detail: 'The stability of the pattern separates plaque physiology from plaque rupture.' },
      { stage: 'investigation', label: 'ECG during pain, troponin (negative), lipid panel, CT calcium score high', detail: 'Negative troponin excludes necrosis; calcium score quantifies the substrate.' },
      { stage: 'interpretation', label: 'Stable coronary plaque disease with high burden', detail: 'Ischaemia without rupture — the "stable" half of the plaque story.' },
      { stage: 'diagnosis', label: 'Stable angina due to atherosclerotic coronary disease', detail: 'Named lesion + named artery.' },
      { stage: 'management', label: 'Risk-factor overhaul + antiplatelet/statin per guideline ± revascularisation if flow-limiting', detail: 'Treat the substrate systemically; revascularise the bottleneck selectively. Verify current guidance.' },
      { stage: 'complication', label: 'Cap rupture → ACS — the event this plan is built to prevent', detail: 'The entire secondary-prevention agenda is cap-protection.' },
    ],
    mistakes: [
      'Thinking atherosclerosis = old-age hardening of the wall in general — it is a specific INTIMAL lipid-inflammatory disease (arteriolosclerosis and Mönckeberg are different entities).',
      'Assuming lumen % on angiography equals danger — thin-cap inflammatory plaques rupture before severely narrowing the lumen (remodelling).',
      'Forgetting the brain and the leg — carotid and popliteal disease are the same lesson in different geography.',
      'Treating statins as "cholesterol numbers" rather than plaque-stabilising anti-inflammatory therapy (pleiotropic framing).',
    ],
    analogies: [
      'Positive remodelling = the pipe expanding its walls as grease builds — the water keeps flowing until the patch cracks; outward appearances mislead.',
      'Stable vs unstable plaque = a sealed tin vs a dented tin of pressurised contents — the dent (thin inflamed cap) decides the explosion.',
    ],
    examRelevance:
      'Sequence questions (injury → fatty streak → plaque → complication), vessel-order questions, stable-vs-unstable plaque logic, and risk-factor-to-mechanism matching are perennial; AA-popliteal-carotid order is a guaranteed one-liner.',
    clinicalRelevance:
      'Every prevention conversation you will ever have (statins, BP, sugar, smoking) is this lesson compressed into advice. Reading "calcified plaque, no significant stenosis" on a CT report without understanding remodelling is a classic mis-interpretation.',
    teachDeeper: [
      'HDL reverse-cholesterol-transport framing and why raising HDL pharmacologically has disappointed — biology vs arithmetic.',
      'Lp(a): the genetically fixed, statin-resistant risk particle — the family-tree lipid.',
      'Inflammation hypothesis in action: residual inflammatory risk (CRP framing) and anti-inflammatory trial logic.',
      'Aneurysm pathogenesis: matrix metalloproteinases eating medial elastin under complicated plaques — occlusion and aneurysm are two exits of one room.',
    ],
    crossLinks: [
      { conceptId: 'c-ami', label: 'Acute Myocardial Infarction (Medicine)', why: 'The plaque-rupture event, downstream.' },
      { conceptId: 'c-htn', label: 'Systemic Hypertension (Medicine)', why: 'Hypertension is both cause and consequence in the arterial wall loop.' },
      { conceptId: 'c-acei', label: 'ACE Inhibitors (Pharmacology)', why: 'Endothelium, RAAS and plaque inflammation share machinery.' },
      { conceptId: 'c-antiplatelet', label: 'Antiplatelet Agents (Pharmacology)', why: 'Platelet thrombosis on ruptured plaque is the event every antiplatelet exists for.' },
    ],
    sources: [
      ncbiRef('Atherosclerosis pathogenesis review literature (PubMed Central indexing)'),
      jhmiRef('Johns Hopkins Medicine — coronary/cerebrovascular disease education'),
      whoRef('WHO cardiovascular disease prevention framing (reference)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: pathology-liver ─────────────────────────────────────────────────
  {
    id: 'c2-pathology-cirrhosis',
    name: 'Cirrhosis & Portal Hypertension',
    kind: 'disease',
    oneLiner:
      'Cirrhosis is the liver’s final common scar — fibrous bands bridging between regenerative nodules that strangle the liver’s blood flow (portal hypertension) and its factory capacity (hepatocellular failure), and in the long run fertilise cancer.',
    whyMatters:
      'It is the converging endpoint of alcohol, hepatitis B/C, fatty-liver disease and a dozen rarer insults — and the substrate for oesophageal variceal bleeding, ascites, spontaneous bacterial peritonitis and hepatocellular carcinoma. Exams test its mechanism-split (portal vs hepatocellular failure) relentlessly; wards run on it: every "upper-GI bleed in a yellow man" is this lesson.',
    explain30s:
      'Any chronic liver injury (alcohol, viruses, fat, autoimmune, copper/iron overload) triggers repair: stellate cells lay down collagen until fibrous BRIDGES connect portal tracts and central veins, chopping the liver into REGENERATIVE NODULES. Two consequences follow: (1) PORTAL HYPERTENSION — the scarred architecture resists portal flow, so pressure backs up into collaterals: oesophageal varices (bleeding!), caput medusae, haemorrhoids, plus splenomegaly and ascites. (2) HEPATOCELLULAR FAILURE — too few working hepatocytes: jaundice, low albumin (oedema), coagulopathy (no clotting factors), encephalopathy (ammonia), and the oestrogen-excess signs (spider naevi, palmar erythema, gynaecomastia, testicular atrophy). Add hepatorenal syndrome, hepatopulmonary syndrome, and a yearly hepatocellular-carcinoma risk — and cirrhosis becomes the most multi-organ "single-organ" disease you will meet. Severity scoring (Child-Turcotte-Pugh: bilirubin, albumin, INR, ascites, encephalopathy) converts all this into stages.',
    eli5:
      'The liver is a giant factory with a river (portal vein) flowing through it. Keep injuring the factory — by alcohol, viruses, fat — and the repair crew keeps pouring concrete (fibrosis) over every crack. One day the concrete forms walls that cut the factory into disconnected blocks (nodules). Now two disasters: the river cannot get through (traffic jam = portal hypertension), so blood finds side-alleys (varices — fragile streets that burst); and there are fewer working machines, so the factory’s products run short — the cleaning chemical (albumin, which holds water in the veins) runs out (swelling), the clotting glue runs out (easy bleeding), the recycling crew for ammonia fails (confusion), and the hormone-balancing department breaks (spider marks, breast growth in men). And worst: factories that constantly rebuild themselves sometimes start building illegal copies — cancer.',
    firstPrinciples: [
      'Definition first: cirrhosis = bridging fibrosis + regenerative nodules. Fibrosis alone (or nodules alone) is not cirrhosis — the ARCHITECTURAL distortion is the disease.',
      'The stellate cell is the villain of repair: quiescent vitamin-A-storing cells activate into myofibroblasts and lay collagen; every chronic injury ends at this cell.',
      'Split every clinical sign into the two-column table: PORTAL HYPERTENSION (varices, caput medusae, haemorrhoids, splenomegaly, ascites via splanchnic + portal pressure) vs HEPATOCELLULAR FAILURE (jaundice, coagulopathy, hypoalbuminaemia, encephalopathy, oestrogen signs). Exams live in this split.',
      'Ascites is multi-mechanism: portal hypertension (splanchnic vasodilation + sodium retention via RAAS) + low albumin (failure) — which is why diuretics (spironolactone-first logic) and salt restriction, not albumin alone, treat it.',
      'Encephalopathy = failing ammonia handling: gut-derived ammonia normally converted to urea by hepatocytes; shunted and failing liver lets it reach the brain (asterixis, day-night reversal). Lactulose traps ammonia in the gut — mechanism into therapy.',
      'Varices obey Ohm-style pressure logic: portal pressure rises (HVPG teaching threshold >10–12 mmHg commonly cited for variceal risk) until collaterals form; a variceal bleed is a pressure event — hence non-selective beta-blockers and banding as prevention principles.',
      'Cancer substrate: a regenerating, inflamed, fibrotic liver is hepatocellular-carcinoma soil — surveillance (ultrasound ± AFP) is the prevention lesson that saves lives.',
    ],
    normal:
      'Normal liver: dual blood supply (portal vein ~75%, hepatic artery), acinar architecture with portal tracts and central veins, hepatocytes performing synthesis (albumin, clotting factors), detoxification (ammonia → urea; drugs), bile handling, and hormone metabolism (oestrogens). All of these fail in ordered, predictable ways when architecture collapses.',
    mechanism:
      'Fibrogenesis: chronic injury → Kupffer-cell cytokines (TGF-β central) → stellate-cell activation → type I/III collagen deposition in space of Disse and bridging bands → vascular resistance rises AND regenerative nodules squeeze sinusoids → portal hypertension. Systemic decompensation: splanchnic vasodilation (NO-rich) drops effective arterial volume → RAAS/ADH activation → sodium/water retention (ascites, oedema) → hyperdynamic circulation. Failure chemistry: urea-cycle deficit (ammonia), synthesis deficit (albumin <2.8 g/dL territory; prolonged INR — the liver’s synthetic speedometer), conjugation deficit (jaundice).',
    presentation: [
      'Compensated: often silent — fatigue, pruritus, lab clues (thrombocytopenia from hypersplenism is the classic earliest count clue).',
      'Decompensated: jaundice, ascites, ankle oedema, variceal haematemesis/melaena, encephalopathy (asterixis, fetor hepaticus), spontaneous bacterial peritonitis (ascitic fluid infection — fever, abdominal pain, worsening confusion).',
      'Chronic-liver-disease stigmata: spider naevi (upper-body distribution), palmar erythema, gynaecomastia, testicular atrophy, Dupuytren contracture (alcohol association), caput medusae, haemorrhoids.',
      'Aetiology clues: alcohol (AST:ALT >2 teaching rule), viral history, metabolic (copper — Kayser-Fleischer rings in Wilson; iron — bronzed diabetes in haemochromatosis), autoimmune (middle-aged woman, high globulins).',
    ],
    diagnosis: [
      'Establish cirrhosis: imaging (nodular coarse liver surface, splenomegaly, portal vein changes on ultrasound), elastography (stiffness), biopsy (the historical gold standard) — often imaging + labs suffice now.',
      'Establish cause: viral serologies (HBV/HCV), ferritin/iron studies, caeruloplasmin (Wilson in the young), autoantibodies (ANA/ASMA — autoimmune; AMA — PBC), immunoglobulins, alcohol history.',
      'Assess decompensation: bilirubin, albumin, INR, ascites (paracentesis with cell count — neutrophil count ≥250 cells/mm³ defines SBP), encephalopathy grade → Child-Turcotte-Pugh / MELD framing.',
      'Surveillance: HCC screening with ultrasound ± AFP at guideline intervals; variceal screening by endoscopy.',
    ],
    differentials: [
      { name: 'Alcohol-associated cirrhosis', key: 'AST:ALT >2 (both <500-ish teaching rule), Mallory-Denk bodies on histology; the commonest story in many Indian wards.' },
      { name: 'Chronic viral (HBV/HCV) cirrhosis', key: 'Serology signatures; HCC surveillance mandatory — viral cirrhosis is potent cancer soil.' },
      { name: 'NAFLD/MASLD-driven cirrhosis', key: 'Metabolic syndrome substrate — diabetes/obesity; the rising global cause.' },
      { name: 'Autoimmune hepatitis / PBC / PSC', key: 'Autoantibody signatures (ANA/ASMA; AMA; pANCA/ERCP beading) — the immunology shelf of cirrhosis.' },
      { name: 'Wilson disease / haemochromatosis', key: 'The young-cirrhosis hunts: copper (low caeruloplasmin, KF rings, haemolysis) vs iron (high ferritin/transferrin saturation, bronze DM).' },
      { name: 'Non-cirrhotic portal hypertension', key: 'Portal-vein thrombosis, schistosomiasis (pre-sinusoidal) — portal hypertension WITHOUT liver failure; the physiology split made real.' },
    ],
    management: [
      'Principle 1 — remove the insult and treat the cause: abstinence, antivirals, venesection/chelation, immunosuppression — decompensation can reverse when the driver stops.',
      'Principle 2 — decompensation has standing orders: sodium restriction + spironolactone-led diuresis for ascites; lactulose (± rifaximin) for encephalopathy; non-selective beta-blockers or banding for variceal prevention; prompt paracentesis + antibiotics for SBP. Verify all specifics against current guidelines.',
      'Principle 3 — surveillance is survival: HCC ultrasound ± AFP and endoscopic variceal screening at protocol intervals.',
      'Principle 4 — transplant assessment is a principle, not a defeat: MELD-based allocation logic exists for exactly this conversation.',
      'Principle 5 — vaccinate and protect: hepatitis A/B vaccination where non-immune, alcohol counselling — the liver has little reserve left to fight new insults.',
    ],
    complications: [
      'Variceal haemorrhage — the dramatic killer; pressure + coagulopathy + thrombocytopenia together.',
      'Spontaneous bacterial peritonitis — ascites fluid infected by enteric flora; neutrophils ≥250 cells/mm³ is the standard diagnostic cut-off (widely taught).',
      'Hepatorenal syndrome — functional renal failure in advanced cirrhosis; a perfusion-pressure disease, not a structural kidney disease.',
      'Hepatic encephalopathy and hepatopulmonary syndrome (dyspnoea, platypnoea, shunting) — the multisystem extensions.',
      'Hepatocellular carcinoma — the long-term shadow of every cirrhosis aetiology (especially viral).',
    ],
    numbers: [
      { label: 'Child-Turcotte-Pugh components', value: 'Bilirubin · albumin · INR/PT · ascites · encephalopathy', note: 'The classic 5-variable severity score — class A/B/C prognosis.' },
      { label: 'SBP diagnostic threshold', value: 'Ascitic neutrophil count ≥250 cells/mm³', note: 'The single most quoted cirrhosis number — treatment usually starts on the count, before culture returns.' },
      { label: 'AST:ALT ratio', value: '>2 suggests alcohol-associated liver disease', note: 'A teaching rule of thumb — context-dependent, still examinable.' },
      { label: 'Variceal-risk pressure concept', value: 'Portal pressure (HVPG) >10–12 mmHg commonly cited for clinically significant risk', note: 'Physiology framing — measured only in specialist settings; quoted for concept, not practice.' },
    ],
    imaging:
      'Ultrasound: nodular, coarse echotexture, shrunken right lobe/caudate hypertrophy patterns, splenomegaly, ascites, portal-vein patency (thrombosis hunt). Elastography measures stiffness (fibrosis made physical). Triphasic CT/MRI characterises HCC (arterial enhancement with washout — the imaging signature). Endoscopy grades varices.',
    pathologyCorrelation:
      'Gross: micronodular (alcohol) vs macronodular (viral/chronic) patterns; bile-stained cut surface (cholestasis). Microscopy: fibrous septa linking portal tracts and central veins, nodules of regenerating hepatocytes, ductular reaction; aetiology clues inside — Mallory-Denk bodies (alcohol), ground-glass hepatocytes (HBV), copper/iron stains.',
    reasoning: [
      { stage: 'symptom', label: '52-year-old man, 3 days of vomiting blood, jaundice, distended abdomen', detail: 'Haematemesis + stigmata of chronic liver disease = variceal bleed until proven otherwise — an emergency with an architecture.' },
      { stage: 'mechanism', label: 'Cirrhotic fibrosis → portal hypertension → collaterals (varices) + coagulopathy', detail: 'The bleed is a pressure event in a patient who cannot clot — a double failure.' },
      { stage: 'differential', label: 'Variceal vs ulcer bleed; SBP vs other sepsis; encephalopathy vs other confusions', detail: 'Same symptoms, different columns of the portal-vs-failure table.' },
      { stage: 'investigation', label: 'Hb low, INR prolonged, platelets low; endoscopy: oesophageal varices; ascitic tap: neutrophils ≥250', detail: 'Blood confirms failure; endoscope confirms pressure; tap confirms SBP — all three columns quantified.' },
      { stage: 'interpretation', label: 'Decompensated cirrhosis (alcohol pattern on labs/history) with variceal bleeding + SBP', detail: 'Named architecture, named complications.' },
      { stage: 'diagnosis', label: 'Alcohol-associated cirrhosis, decompensated — variceal haemorrhage + spontaneous bacterial peritonitis', detail: 'The ward-round sentence in one line.' },
      { stage: 'management', label: 'Resuscitation principles, variceal-control measures and antibiotics per protocol; SBP treatment; abstinence pathway; transplant conversation', detail: 'Specialist territory — the educational point is the ordered logic. Verify against current guidelines.' },
      { stage: 'complication', label: 'Rebleeding, hepatorenal syndrome, HCC', detail: 'The three follow-on threats the surveillance plan exists to catch early.' },
    ],
    mistakes: [
      'Calling any liver fibrosis "cirrhosis" — only bridging fibrosis + nodules qualifies.',
      'Assigning every sign to "liver failure" — the portal-hypertension vs hepatocellular-failure split is the exam’s favourite discriminator.',
      'Treating encephalopathy without asking WHY it decompensated (infection, GI bleed, electrolytes, constipation, sedatives — the trigger hunt).',
      'Forgetting thrombocytopenia as the earliest count clue — hypersplenism sequesters platelets first.',
      'Missing HCC surveillance in a "stable" cirrhotic — the cancer question is permanent.',
    ],
    analogies: [
      'Cirrhosis = a city rebuilt after repeated floods — concrete walls cut it into blocks, the river jams, and the city’s services (cleaning, policing, plumbing) fail in predictable order.',
      'Portal hypertension vs liver failure = the plumbing problem vs the factory problem — same building, different faults, different symptoms.',
    ],
    examRelevance:
      'Two-column sign sorting, SBP threshold (≥250 neutrophils), AST:ALT>2 alcohol logic, Child-Pugh components, variceal-pressure physiology, and cause-matching (Wilson/haemochromatosis/autoimmune signatures) are recurring NEET-PG and viva patterns.',
    clinicalRelevance:
      'Ward-deciding numbers live here: the ascitic neutrophil count that starts antibiotics, the INR that summarises the liver’s factory output, and the ultrasound date that screens for cancer — cirrhosis is where pathology becomes a calendar.',
    teachDeeper: [
      'Hepatorenal syndrome physiology: splanchnic vasodilation → effective hypovolaemia → renal vasoconstriction; why albumin + vasoconstrictor logic (specialist) works.',
      'Hepatopulmonary syndrome: intrapulmonary shunting — platypnoea (worse upright) and orthodeoxia are the poetic physical signs.',
      'MELD logic: bilirubin, INR, creatinine (± sodium in MELD-Na) — objective severity for transplant allocation.',
      'The bile-acid world: pruritus in cholestatic disease — why the failing liver itches.',
    ],
    crossLinks: [
      { conceptId: 'c2-pathology-cell-injury', label: 'Cell Injury & Necrosis (this pack)', why: 'Chronic injury → repair → fibrosis is the injury story’s last chapter.' },
      { conceptId: 'c-hpylori', label: 'Helicobacter pylori (Microbiology)', why: 'Contrast in upper-GI bleeding workup — varices vs ulcer logic shares the endoscope.' },
      { conceptId: 'c-vaccines', label: 'Universal Immunisation Programme (Community Medicine)', why: 'Hepatitis B vaccination is cirrhosis prevention at population scale.' },
      { conceptId: 'c-antitb', label: 'Anti-Tubercular Drugs (Pharmacology)', why: 'The cirrhotic liver rewrites every drug decision — hepatotoxicity stakes.', subject: 'Pharmacology' },
    ],
    sources: [
      whoRef('WHO — viral hepatitis and liver-disease programme framing'),
      ncbiRef('Cirrhosis, portal hypertension and decompensation review literature (PubMed Central indexing)'),
      jhmiRef('Johns Hopkins Medicine — cirrhosis and liver-disease education'),
      niceRef('NICE — cirrhosis assessment/management guidance framing'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'high',
    verifyNote: 'Decompensation management (SBP, varices, encephalopathy, HCC surveillance intervals) is guideline-driven and periodically updated — verify current versions.',
  },
]

// ════════════════════════════════════════════════════════════════════════════
// LESSONS — PHARMACOLOGY (9)
// Flagships: pharmacokinetics · autonomic. Enrichments: c-acei, c-metformin,
// c-antitb (each genuinely teaches that seeded concept's core).
// ════════════════════════════════════════════════════════════════════════════

const pharmacologyLessons: ConceptLesson[] = [
  // ── Topic: pharmacology-kinetics (FLAGSHIP) ─────────────────────────────────
  {
    id: 'c2-pharmacology-kinetics',
    name: 'Pharmacokinetics: What the Body Does to the Drug',
    kind: 'principle',
    oneLiner:
      'Pharmacokinetics (ADME) is the body’s handling of a drug — how it is absorbed, distributed, metabolised and excreted — expressed through four bookkeeping ideas: bioavailability, volume of distribution, clearance and half-life.',
    whyMatters:
      'Every dose you write is a kinetics decision, whether you admit it or not: why digoxin is once daily, why nitroglycerin is not swallowed, why phenytoin dosing is an art, why kidney or liver disease rewrites the whole plan. Exams test half-life, first-pass, zero- vs first-order and drug-monitoring logic endlessly; wards live on the same four numbers.',
    explain30s:
      'ABSORPTION moves drug from the site of administration into blood; swallowing a tablet sends it through the liver first — the first-pass effect — so only a fraction (bioavailability F) arrives. DISTRIBUTION spreads drug through body water; the apparent volume of distribution (Vd) says how widely. METABOLISM chemically modifies drug, mostly in liver CYP450 enzymes — some induction (faster clearance, drug interactions), some inhibition. EXCRETION removes drug, mostly by the kidney. CLEARANCE is the volume of plasma cleaned per unit time, and it fixes the half-life: most drugs eliminate a constant FRACTION per unit time (first-order); a few eliminate a constant AMOUNT (zero-order) because their elimination machinery is saturated. Steady state arrives after about 4–5 half-lives; half-life then tells you the dosing interval.',
    eli5:
      'Think of a drug as a guest at a hotel. Getting in through the door is absorption. Walking around the building is distribution. The kitchen digesting the guest’s food (and sometimes the guest) is metabolism. The exit door is excretion. Bioavailability asks: how much of the guest actually checked in? Half-life asks: how fast do guests leave? If half the guests leave every hour, you must send new guests in regularly — that is a dosing schedule. A first-order hotel never gets overcrowded — it just runs at half speed when full (constant fraction out). A zero-order hotel has one tiny exit door: when it is crowded, the SAME number leave per hour no matter how many arrive — so each extra drink (alcohol is the classic) piles up dangerously.',
    firstPrinciples: [
      'Build the vocabulary first: A-D-M-E. Absorption (drug → blood), Distribution (blood → tissues), Metabolism (chemical change, mostly liver), Excretion (removal, mostly kidney). Pharmacokinetics is bookkeeping of where the drug is and in what amount.',
      'Bioavailability (F) is the fraction of administered dose reaching the systemic circulation. Intravenous is the definition of 100%; oral drugs pay a toll — gut and liver metabolism (first-pass effect). Oral nitroglycerin is almost fully destroyed on first pass, which is why it is given under the tongue or as a patch.',
      'Vd = amount in body ÷ plasma concentration — an APPARENT volume, not anatomy. A drug stuck in plasma (large, bound) has small Vd; a drug that hides in fat or tissue (amiodarone, digoxin, chloroquine) has a huge Vd. Vd tells you how hard dialysis or haemorrhage can rescue you, and sets the loading dose.',
      'Clearance (CL) is the volume of plasma irreversibly cleared of drug per unit time — the single most important number, because maintenance dose = clearance × target concentration. Liver disease and kidney disease both work by cutting clearance.',
      'Half-life t½ = 0.693 × Vd ÷ CL. It fixes two clinical rules: after ~4–5 half-lives a drug reaches steady state or is essentially gone, and the dosing interval is usually chosen around the half-life.',
      'Order of elimination: FIRST-order = constant FRACTION eliminated per time (most drugs; a straight half-life exists). ZERO-order = constant AMOUNT eliminated because enzymes are saturated (classic: alcohol, phenytoin at therapeutic doses, high-dose salicylates) — no safe half-life, small dose increases cause steep concentration rises.',
      'Metabolism has phases: phase I oxidation/reduction/hydrolysis (CYP450) then phase II conjugation. CYP inducers (rifampin, phenytoin, carbamazepine, chronic alcohol) speed other drugs’ clearance; inhibitors (cimetidine, ciprofloxacin, macrolides, ketoconazole) slow it — this is the mechanism behind most famous drug interactions.',
    ],
    numbers: [
      { label: 'Steady state / washout rule', value: 'About 4–5 half-lives', note: 'The rule that decides how long until a drug works fully (or clears after stopping) — true for every first-order drug.' },
      { label: 'Bioavailability (F)', value: 'IV = 1 (100%) by definition', note: 'Oral F varies with first-pass metabolism and formulation — the reason doses differ by route.' },
      { label: 'Zero-order classics', value: 'Alcohol · phenytoin · salicylates (high dose)', note: 'Saturated elimination — the exceptions that make overdose so dangerous.' },
      { label: 'Half-life equation', value: 't½ = 0.693 × Vd / CL', note: 'One line connects all four bookkeeping numbers — exams ask it as logic, not arithmetic.' },
    ],
    mistakes: [
      'Calling Vd an anatomical space — it is an apparent (fictitious) volume computed from a ratio; a huge Vd means tissue storage, not a big body.',
      'Assuming steady state starts after the first dose — it takes ~4–5 half-lives at a constant rate; loading doses exist precisely to bridge that gap.',
      'Applying a tidy half-life to zero-order drugs — with saturated elimination, each dose increase raises concentration disproportionately.',
      'Forgetting route changes everything: the same drug, swallowed vs intravenous, has different F and therefore different effective dose.',
    ],
    analogies: [
      'Hotel with exits (above): absorption = check-in, Vd = how the guest spreads through the building, metabolism = kitchen, excretion = exit door, half-life = how fast guests leave.',
      'First-order vs zero-order = a highway toll (a fixed percentage of cars pass per minute) vs a single-lane bridge (a fixed number of cars per minute, whatever the jam).',
    ],
    examRelevance:
      'Half-life and steady-state arithmetic, first-pass drugs (nitroglycerin, propranolol, morphine, levodopa), zero-order drug lists, Vd extremes (digoxin, chloroquine, amiodarone), enzyme inducers vs inhibitors, and "which parameter changes in renal failure?" — all recurring NEET-PG pharmacology patterns.',
    clinicalRelevance:
      'Renal or hepatic impairment means lower clearance, so maintenance doses fall and intervals stretch; drugs with narrow safety margins (phenytoin, digoxin, lithium, aminoglycosides) get blood-level monitoring for exactly the kinetic reasons in this lesson.',
    teachDeeper: [
      'Loading dose = (Vd × target concentration) ÷ F; maintenance dose = (CL × target concentration) ÷ F — why a loading dose depends on Vd but maintenance depends on clearance.',
      'Bioequivalence and generics: same F and similar rate — what the regulator actually tests.',
      'Drug–protein binding: hypoalbuminaemia or displacement raises free fraction — matters for warfarin, phenytoin.',
      'Zero-order kinetics of ethanol as the model: saturation of alcohol dehydrogenase — why "one drink per hour" folk rules exist.',
    ],
    crossLinks: [
      { conceptId: 'c2-pharmacology-dynamics', label: 'Pharmacodynamics (this pack)', why: 'Kinetics is what the body does to the drug; dynamics is what the drug does to the body — one system, two ledgers.' },
      { conceptId: 'c2-pathology-cirrhosis', label: 'Cirrhosis (this pack)', why: 'A failing liver cuts clearance and first-pass — the pathologist’s lesion becomes the pharmacist’s dose change.' },
      { conceptId: 'c-antitb', label: 'Anti-Tubercular Drugs (Pharmacology)', why: 'Rifampin is the classic enzyme inducer — kinetics logic explains the contraceptive-failure interactions.' },
    ],
    global: [
      { region: 'India', terminology: [], note: 'Teaching of ADME, half-life and first-order/zero-order logic is the same across Indian pharmacology curricula; brand-name differences do not change the kinetics.' },
      { region: 'United States', terminology: ['US: bioavailability (F) · ADME framework'], workflow: 'US teaching emphasises therapeutic drug monitoring ranges published in FDA labelling for narrow-index drugs.', note: 'Same four numbers, different labelling conventions — the concepts transfer unchanged.' },
      { region: 'United Kingdom', terminology: ['UK: "prescribing in renal impairment" framing'], workflow: 'UK formularies organise dosing adjustments by eGFR bands.', note: 'Organ impairment → lower clearance → adjusted dose is the universal logic.' },
    ],
    sources: [
      fdaRef('FDA — clinical pharmacology and biopharmaceutics review framing'),
      hmxRef('HMX Pharmacology — ADME and dose–response concept framing'),
      ncbiRef('Pharmacokinetics review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: pharmacology-dynamics ─────────────────────────────────────────────
  {
    id: 'c2-pharmacology-dynamics',
    name: 'Pharmacodynamics: Agonists, Antagonists & the Therapeutic Index',
    kind: 'principle',
    oneLiner:
      'Pharmacodynamics is what a drug does to the body — how it binds its target, how the response scales with dose, and how safe the useful range is.',
    whyMatters:
      'It is the language of every drug class: "full agonist", "competitive antagonist", "partial agonist", "narrow therapeutic index". Exams ask the vocabulary as logic puzzles (shift the curve — what happens?); practice uses it every time a drug interaction or overdose question appears.',
    explain30s:
      'Most drugs bind a target (receptor, enzyme, ion channel, transporter). An AGONIST binds and activates; its dose–response curve rises to a maximum (Emax) at some concentration (EC50 — the potency marker). An ANTAGONIST blocks. A COMPETITIVE antagonist can be overcome by more agonist — the curve shifts right, Emax unchanged. A NON-COMPETITIVE antagonist cannot — Emax falls. A PARTIAL agonist never reaches full Emax even alone. POTENCY (EC50) and EFFICACY (Emax) are different virtues: a drug can be potent but weak. The THERAPEUTIC INDEX (TD50/ED50) measures the gap between the dose that helps and the dose that harms — narrow-index drugs need monitoring.',
    eli5:
      'A receptor is a light switch and a drug is a finger. An agonist is a finger that turns the light on. An antagonist is a finger that just sits on the switch so nobody else can press it. A competitive antagonist is a kid you can out-push — press harder (more agonist) and the light still comes on. A non-competitive antagonist glued the switch — no amount of pressing helps. A partial agonist turns the light only halfway, even at full strength. Potency is how little finger-pressure you need; efficacy is how bright the light can get. And the therapeutic index is how much margin you have between "works nicely" and "causes harm" — some drugs are staircase-wide, some are a tightrope.',
    firstPrinciples: [
      'Drug targets are four families: receptors (surface or nuclear), enzymes (aspirin → COX), ion channels (lidocaine → Na⁺ channels), transporters (SSRIs → serotonin transporter). "Drug class" usually means "shares a target".',
      'The graded dose–response curve is the exam’s favourite graph: x = log dose, y = effect. EC50 = concentration giving 50% of maximum effect (potency). Emax = ceiling (efficacy). Read curves before answering any question about them.',
      'Competitive antagonism: surmountable. The agonist dose–response curve shifts RIGHT, Emax preserved. Clinical face: naloxone out-competing morphine at mu receptors — and simply giving more agonist reverses it.',
      'Non-competitive (irreversible or allosteric) antagonism: Emax falls. Clinical face: aspirin permanently acetylating platelet COX-1 until new platelets replace the blocked enzyme.',
      'Partial agonists have a lower ceiling even when occupying every receptor — buprenorphine at mu receptors is the classic; they can act as antagonists when a full agonist is present.',
      'Therapeutic index = TD50 ÷ ED50 (toxic dose for half the population ÷ effective dose for half). High TI = forgiving; narrow TI (warfarin, digoxin, lithium, phenytoin, theophylline) = plasma-level monitoring and careful titration.',
      'Quantal dose–response curves (how many PEOPLE respond at a dose) are where ED50/TD50 come from — different graph, same vocabulary; do not mix the two graphs in one answer.',
    ],
    numbers: [
      { label: 'Therapeutic index', value: 'TI = TD50 / ED50', note: 'The definition itself is the exam answer; a narrow index triggers monitoring requirements.' },
      { label: 'Narrow-index teaching set', value: 'Warfarin · digoxin · lithium · phenytoin · theophylline', note: 'The classic "check a level" list — memorise as a family.' },
      { label: 'Competitive vs non-competitive signature', value: 'Right shift (same Emax) vs lowered Emax', note: 'The two-curve comparison asked in some form almost every year.' },
    ],
    mistakes: [
      'Confusing potency with efficacy — a more potent drug needs less dose, not more effect; exams pair a right-shifted curve with exactly this trap.',
      'Calling naloxone "non-competitive" — it is competitive (surmountable); the confusion usually comes from mixing dose–response graphs with receptor cartoons.',
      'Reading partial agonists as "weak full agonists" — the ceiling is a distinct property with its own clinical logic.',
      'Forgetting the two graphs: graded (one subject, increasing dose) vs quantal (population, % responding).',
    ],
    analogies: [
      'Light switch and fingers (above) — agonist, competitive/non-competitive antagonist, partial agonist in one picture.',
      'Therapeutic index = the width of a footpath between "helps" and "harms" — some drugs give a boulevard, others a tightrope over a gorge.',
    ],
    examRelevance:
      'Curve-reading questions (which shift means what), potency-vs-efficacy comparisons between two named drugs, naloxone/naltrexone logic, partial-agonist examples, and TI-based "which drug needs monitoring?" lists.',
    clinicalRelevance:
      'Titration to effect, interactions (an antagonist added to a regimen), and monitoring narrow-index drugs are daily ward decisions built entirely on this vocabulary.',
    teachDeeper: [
      'Inverse agonists and constitutive receptor activity — one notch beyond antagonist.',
      'Receptor regulation: tachyphylaxis and down-regulation after chronic agonist exposure; up-regulation after chronic blockade (beta-blocker withdrawal).',
      'Efficacy ceiling in practice: why partial agonists are used in opioid-dependence care (specialist context).',
      'Spare receptors: why some systems reach Emax before full receptor occupancy.',
    ],
    crossLinks: [
      { conceptId: 'c2-pharmacology-kinetics', label: 'Pharmacokinetics (this pack)', why: 'Dose–concentration (kinetics) feeds dose–effect (dynamics); together they are the whole of dosing.' },
      { conceptId: 'c2-pharmacology-autonomic', label: 'Autonomic Pharmacology (this pack)', why: 'Every autonomic drug is an agonist/antagonist example — dynamics vocabulary applied to a receptor map.' },
      { conceptId: 'c2-pharmacology-nsaids', label: 'NSAIDs & the COX story (this pack)', why: 'Aspirin’s irreversible antagonism of COX-1 is non-competitive logic made clinical.' },
    ],
    sources: [
      hmxRef('HMX Pharmacology — receptor theory and dose–response framing'),
      openStaxRef('Anatomy & Physiology — receptors and signalling (reference framing)'),
      ncbiRef('Pharmacodynamics review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
  },

  // ── Topic: pharmacology-autonomic (FLAGSHIP) ────────────────────────────────
  {
    id: 'c2-pharmacology-autonomic',
    name: 'Autonomic Pharmacology: The Sympathetic–Parasympathetic Drug Map',
    kind: 'principle',
    oneLiner:
      'Autonomic pharmacology is a map, not a list — every drug either mimics or blocks a branch of the autonomic nervous system at a named receptor (α1, α2, β1, β2, M, N), and the receptor predicts all the effects and side-effects.',
    whyMatters:
      'This is the highest-traffic map in pharmacology: adrenaline in anaphylaxis, salbutamol in asthma, atropine in bradycardia, propranolol in thyroid storm, organophosphate poisoning, glaucoma drops, prostate drugs — every one is a point on this map. NEET-PG treats receptor logic as assumed knowledge in medicine, anaesthesia, ophthalmology and surgery vignettes.',
    explain30s:
      'Two branches: SYMPATHETIC (fight-or-flight) releases noradrenaline (± adrenaline); PARASYMPATHETIC (rest-and-digest) releases acetylcholine onto muscarinic receptors. Adrenergic receptors: α1 = vasoconstriction (vessels, prostate, pupil dilator), α2 = presynaptic brakes (↓noradrenaline release), β1 = heart (rate + force), β2 = bronchodilation + uterine relaxation + vasodilation. Cholinergic: M = glands and smooth muscle (secretion, bronchoconstriction, pupil constriction, slow heart via M2), N = ganglia and the neuromuscular junction. AGONISTS push a branch (adrenaline = α+β; salbutamol = β2; pilocarpine = M); ANTAGONISTS pull it (prazosin = α1; propranolol = β1+β2; atropine = anti-M). Side-effects are simply the receptor doing its normal job somewhere you did not want it.',
    eli5:
      'Your body has two drivers. One is an accelerator (sympathetic — heart races, pupils widen, airways open, hair stands up). The other is a brake-and-digest driver (parasympathetic — drools, digests, constricts pupils). Drugs just hire one driver or handcuff one. Adrenaline is the accelerator pedal itself. Salbutamol is a button that only opens airways (β2). Propranolol blocks the whole accelerator including the heart (β1) — great for a racing heart, bad for asthma, because blocking β2 narrows airways. Atropine handcuffs the brake driver — dry mouth, big pupils, fast heart. Organophosphate pesticides jam the brake driver’s off-switch so it fires forever — drooling, tiny pupils, wheezing, weak muscles. Once you know who drives what, every drug on the map is guessable.',
    firstPrinciples: [
      'Learn the anatomy as the map legend: sympathetic outflow (thoracolumbar) acts mostly via noradrenaline at α and β receptors (with adrenaline from the adrenal medulla); parasympathetic (craniosacral) acts via acetylcholine at muscarinic receptors. Nicotinic receptors sit at all autonomic ganglia (both branches) and at the neuromuscular junction.',
      'Receptor-by-receptor effects: α1 — vascular smooth-muscle contraction (↑BP, nasal decongestion, prostate contraction, mydriasis); α2 — presynaptic inhibition (↓NE release; clonidine’s central effect); β1 — heart (↑rate, ↑force, ↑conduction); β2 — bronchodilation, vasodilation, uterine relaxation, glycogenolysis; M3 — glands + smooth muscle (secretion, bronchoconstriction, miosis, gut motility); M2 — heart (slows rate).',
      'Agonist shelf: adrenaline (α1+α2+β1+β2 — anaphylaxis, cardiac arrest), noradrenaline (α1+β1 — shock vasopressor), salbutamol (β2 — asthma), phenylephrine (α1 — decongestant/mydriatic), pilocarpine (M — glaucoma, dry mouth), bethanechol (M — urinary retention).',
      'Antagonist shelf: prazosin/tamsulosin (α1 — hypertension/BPH; tamsulosin spares vessels relatively), propranolol (β1+β2 — the non-selective trap in asthma/diabetes), metoprolol/atenolol (β1-selective), atropine (anti-M — bradycardia, organophosphate antidote), and neuromuscular blockers at N (anaesthesia world).',
      'The toxidromes are the map read backwards: anticholinergic = "hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter" (atropine overdose); cholinergic crisis = SLUDGE (salivation, lacrimation, urination, defecation, GI upset, emesis) + killer Bs (bronchorrhoea, bronchospasm, bradycardia) in organophosphate poisoning — treated with atropine + pralidoxime.',
      'Selectivity is dose-dependent: "β1-selective" metoprolol still hits β2 at higher doses — selectivity is a slope, not a wall.',
      'Connect to systemic physiology: glaucoma drops (β-blockers ↓aqueous, α-agonists, miotics), BPH (α1-blockers), anaphylaxis (adrenaline hits every receptor usefully at once), and thyroid storm (propranolol blocks β-amplification) — one map, five wards.',
    ],
    drugs: [
      { name: 'Adrenaline (epinephrine)', drugClass: 'Non-selective adrenergic agonist (α+β)', mechanism: 'Vasoconstriction (α1), bronchodilation (β2), ↑heart rate/contractility (β1)', note: 'First-line in anaphylaxis — route and concentration matter (see emergency-drugs lesson).' },
      { name: 'Salbutamol (albuterol)', drugClass: 'β2-selective agonist', mechanism: 'Relaxes bronchial smooth muscle', note: 'β2 selectivity is relative — tremor and tachycardia appear at higher doses.' },
      { name: 'Atropine', drugClass: 'Competitive muscarinic antagonist', mechanism: 'Blocks M receptors — ↑heart rate, ↓secretions, mydriasis', note: 'Antidote to cholinergic (organophosphate) crises; the anticholinergic toxidrome is atropine-like.' },
      { name: 'Propranolol', drugClass: 'Non-selective β-blocker', mechanism: 'Blocks β1 (heart) and β2 (airways, vessels)', note: 'Avoid in asthma and caution in diabetes (masks hypoglycaemia signs, delays recovery).' },
      { name: 'Prazosin / tamsulosin', drugClass: 'α1-blockers', mechanism: 'Relax vascular and prostatic smooth muscle', note: 'First-dose hypotension is the classic teaching pearl (prazosin).' },
      { name: 'Organophosphates', drugClass: 'Irreversible cholinesterase inhibitors (toxic, not therapeutic)', mechanism: 'ACh accumulates at M and N sites — SLUDGE + weakness', note: 'Management principles: decontaminate, atropinise, pralidoxime reactivates the enzyme. Verify against current protocols.' },
    ],
    mnemonics: [
      { hook: 'You have 1 heart and 2 lungs', expands: 'β1 = heart (rate/force), β2 = bronchi (+uterus, vessels) — the single most reused receptor mnemonic.' },
      { hook: 'α1 = "one wall to squeeze"', expands: 'α1 contracts vascular smooth muscle (↑BP), prostatic capsule, and the dilator pupillae (mydriasis).' },
      { hook: 'α2 = "adios, noradrenaline"', expands: 'Presynaptic α2 stops further NE release — the brake on the accelerator; clonidine works centrally here.' },
      { hook: 'Hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter', expands: 'The anticholinergic (atropine) toxidrome — hyperthermia, mydriasis, dry skin/mouth, flushing, delirium.' },
      { hook: 'SLUDGE + the killer Bs', expands: 'Cholinergic crisis: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis + Bronchorrhoea, Bronchospasm, Bradycardia.' },
      { hook: 'M = Moist, N = Nerve', expands: 'Muscarinic = glands and smooth muscle (everything gets wet and squeezes); nicotinic = ganglia + neuromuscular junction (ganglia and muscle fire).' },
    ],
    mistakes: [
      'Giving propranolol to an asthmatic — β2 blockade bronchoconstricts; check selectivity every time a β-blocker appears.',
      'Reversing the α1 picture: α1 raises BP and contracts the prostate — it does not relax anything.',
      'Treating "cholinergic" and "anticholinergic" toxidromes as similar — they are opposites; the antidote of one (atropine) causes the other.',
      'Forgetting nicotinic ganglia serve BOTH branches — ganglion-blocking drugs are pharmacological chaos, which is why they are historical.',
    ],
    analogies: [
      'Accelerator vs brake drivers (above) — every drug hires, handcuffs, or jams one driver at one pedal.',
      'Receptors are labeled doors in a corridor; a drug is a key that fits some doors — side-effects are just doors you opened unintentionally.',
    ],
    examRelevance:
      'Match drug → receptor → organ effect chains, toxidrome recognition vignettes (anticholinergic vs cholinergic), β-blocker traps in asthma/diabetes, glaucoma and BPH drug mechanisms, and "which receptor causes this side-effect?" — all standard NEET-PG pharmacology.',
    clinicalRelevance:
      'The map is used daily: choosing a β1-selective agent, warning a patient on tamsulosin about first-dose dizziness, recognising organophosphate exposure in a rural emergency, or knowing why atropine precedes every anaesthetic procedure involving secretions.',
    teachDeeper: [
      'Noradrenaline vs adrenaline receptor profiles — why noradrenaline raises diastolic pressure while adrenaline may drop it transiently (β2).',
      'Dopamine receptors and dopaminergic doses (renal-dose lore and its modern de-emphasis) — the third catecholamine on the map.',
      'Neuromuscular junction pharmacology: depolarising vs non-depolarising block (anaesthesia territory).',
      'Central autonomic drugs: clonidine, methyldopa — α2 logic rising into the brainstem.',
    ],
    crossLinks: [
      { conceptId: 'c2-pharmacology-emergency', label: 'Emergency Drugs (this pack)', why: 'Adrenaline, atropine and amiodarone are autonomic-map points that live on the crash cart.' },
      { conceptId: 'c2-pharmacology-dynamics', label: 'Pharmacodynamics (this pack)', why: 'Agonist/antagonist vocabulary is the grammar; the autonomic map is where it is spoken.' },
      { conceptId: 'c-betablock', label: 'Beta-Blockers (Pharmacology)', why: 'The β-blocker story is autonomic map logic applied to hypertension and heart disease.' },
    ],
    global: [
      { region: 'India', terminology: ['Adrenaline · noradrenaline'], note: 'Indian teaching and labelling follow the British convention — adrenaline.' },
      { region: 'United States', terminology: ['Epinephrine · norepinephrine'], note: 'US labelling uses epinephrine; same molecule, same receptor map.' },
      { region: 'United Kingdom', terminology: ['Adrenaline · noradrenaline'], note: 'UK practice matches Indian nomenclature; examination bodies in both accept either name with the other in brackets.' },
      { region: 'WHO/Global', terminology: [], note: 'WHO essential-medicines materials use both names together (adrenaline/epinephrine) — a small lesson in global labelling.' },
    ],
    sources: [
      hmxRef('HMX Pharmacology — autonomic nervous system drug classes'),
      openStaxRef('Anatomy & Physiology — autonomic nervous system (reference framing)'),
      ncbiRef('Autonomic pharmacology and toxidrome review literature (PubMed Central indexing)'),
      whoRef('WHO — organophosphate poisoning management framing'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: t-pharm-antibio ──────────────────────────────────────────────────
  {
    id: 'c2-pharmacology-antibiotics',
    name: 'Antibiotics by Mechanism: Four Ways to Attack a Bacterium',
    kind: 'drug-class',
    oneLiner:
      'Every standard antibiotic attacks one of four bacterial essentials — the cell wall, the ribosome (30S or 50S), DNA machinery, or folate synthesis — and knowing which tells you the spectrum, the side-effects and the resistance logic.',
    whyMatters:
      'Antibiotics are the most-prescribed drug class on earth and the most misused. Organising by mechanism converts a terrifying list into four drawers: it predicts adverse effects (cell-wall allergy, ribosomal toxicity), explains resistance (destroyer, target-changer, bouncer, plumber), and underpins stewardship. Exams ask the organisation itself almost every year.',
    explain30s:
      'CELL WALL: β-lactams (penicillins, cephalosporins, carbapenems) block the transpeptidase enzymes (PBPs) that cross-link peptidoglycan; vancomycin blocks wall building one step earlier. Bacteria fight back with β-lactamases (hence clavulanate) or a changed target (MRSA’s PBP2a). PROTEIN SYNTHESIS: the 30S inhibitors (aminoglycosides, tetracyclines) and 50S inhibitors (macrolides, clindamycin, chloramphenicol, linezolid) freeze the bacterial ribosome — selectivity comes from the ribosome’s difference from ours. DNA: fluoroquinolones block DNA gyrase/topoisomerase. FOLATE: sulphonamides and trimethoprim block the two steps of the folate pathway — given together (cotrimoxazole) they are sequential sabotage. Side-effects cluster by drawer: allergy and cross-reactivity in the wall drawer, ototoxicity/nephrotoxicity (aminoglycosides) and teeth/photosensitivity (tetracyclines) in the protein drawer, tendinopathy and QT (quinolones) in the DNA drawer, folate-related cytopenias in the folate drawer.',
    eli5:
      'A bacterium is a tiny factory inside a brick wall, running a 3-D printer (ribosome) with a control computer (DNA), powered by a workshop (folate pathway). Antibiotics are saboteurs, each trained for one job: break the bricks (β-lactams), jam the printer (ribosome drugs), scramble the computer (quinolones), or cut the power cables (sulfa/trimethoprim). Our own cells have no brick wall, and our printers/computers are built differently — that difference is why we survive the treatment. But bacteria adapt fast: they can chew the saboteur (β-lactamase), rebuild the target (MRSA), throw the saboteur out (efflux pumps), or stop opening the door (porin loss). Combination drugs like amoxicillin-clavulanate are simply "saboteur + bodyguard against the chewer".',
    firstPrinciples: [
      'Selective toxicity is the organising principle: every classic antibiotic exploits a difference between bacterial and human cells — the wall we lack, ribosomes with different shape/size, gyrase we do not have, and folate we eat instead of synthesise.',
      'Cell-wall drawer: β-lactams share the β-lactam ring and PBP (transpeptidase) target; generations of cephalosporins broaden coverage outward; clavulanate/sulbactam/tazobactam are suicide β-lactamase inhibitors bolted onto penicillins; vancomycin binds the wall precursors instead of the enzyme — the Gram-positive workhorse when MRSA blocks the β-lactam door.',
      'Protein drawer — memorise the subunit: 30S = aminoglycosides (gentamicin — bactericidal, ototoxic/nephrotoxic; needs oxygen to enter, so useless against anaerobes) and tetracyclines/doxycycline (teeth staining in children, photosensitivity). 50S = macrolides (azithromycin), clindamycin, chloramphenicol (grey-baby and aplastic-anaemia notoriety), linezolid.',
      'DNA drawer: fluoroquinolones (ciprofloxacin, levofloxacin) block gyrase/topoisomerase IV — tendinopathy, cartilage caution, QT prolongation, dysglycaemia are the teaching flags. Folate drawer: sulphonamides block dihydropteroate synthase; trimethoprim blocks dihydrofolate reductase; together = cotrimoxazole (sequential blockade, strong synergy).',
      'Resistance has four mechanistic shapes: destroy the drug (β-lactamase), change the target (MRSA PBP2a, quinolone target mutations), pump the drug out (efflux), or block entry (porin loss). Naming a mechanism for a named bug is a standard exam task.',
      'Time-dependent vs concentration-dependent killing organises dosing logic: β-lactams want time above MIC (hence frequent dosing/infusions); aminoglycosides and quinolones want high peaks (hence once-daily aminoglycoside dosing logic).',
      'Stewardship logic follows: narrowest effective spectrum, correct dose/duration, de-escalate when cultures return, and remember antibiotics are the classic cause of Clostridioides difficile colitis — killing good anaerobes opens the door.',
    ],
    drugs: [
      { name: 'Amoxicillin-clavulanate', drugClass: 'β-lactam + β-lactamase inhibitor (cell wall)', mechanism: 'Blocks peptidoglycan cross-linking; clavulanate neutralises the bacterial β-lactamase', note: 'The "saboteur + bodyguard" pattern in one tablet.' },
      { name: 'Ceftriaxone', drugClass: 'Third-generation cephalosporin (cell wall)', mechanism: 'Broad Gram-negative activity with good tissue penetration', note: 'Ward workhorse; no anti-MRSA or enterococcal coverage — a favourite exam discriminator.' },
      { name: 'Vancomycin', drugClass: 'Glycopeptide (cell wall)', mechanism: 'Binds D-Ala-D-Ala wall precursors, blocking polymerisation', note: 'The Gram-positive/MRSA answer; monitoring and "red man" infusion reactions are the classic flags.' },
      { name: 'Gentamicin', drugClass: 'Aminoglycoside (30S)', mechanism: 'Freezes the 30S subunit → misreading → bactericidal', note: 'Ototoxic + nephrotoxic; concentration-dependent dosing logic; no anaerobic cover.' },
      { name: 'Doxycycline', drugClass: 'Tetracycline (30S)', mechanism: 'Blocks aminoacyl-tRNA entry at 30S', note: 'The rickettsia/atypical workhorse; avoid in children and pregnancy (teeth/bone).' },
      { name: 'Azithromycin', drugClass: 'Macrolide (50S)', mechanism: 'Blocks translocation at the 50S subunit', note: 'Atypical-coverage staple; QT prolongation is the flag exams quote.' },
      { name: 'Ciprofloxacin', drugClass: 'Fluoroquinolone (DNA gyrase)', mechanism: 'Blocks DNA replication machinery', note: 'Tendinopathy and cartilage caution — the DNA drawer’s adverse-effect signature.' },
      { name: 'Cotrimoxazole', drugClass: 'Sulphamethoxazole + trimethoprim (folate)', mechanism: 'Sequential blockade of the folate pathway', note: 'PCP prophylaxis classic; folate-related cytopenias and hyperkalaemia are the flags.' },
    ],
    mnemonics: [
      { hook: 'Buy AT 30, CCEL at 50', expands: 'Aminoglycosides + Tetracyclines act at the 30S ribosomal subunit; Chloramphenicol, Clindamycin, Erythromycin/macrolides, Linezolid (Lincosamides) at the 50S.' },
      { hook: 'The four drawers', expands: 'WALL (β-lactams, vancomycin) · RIBOSOME (30S/50S) · DNA (quinolones) · FOLATE (sulfa + trimethoprim) — every standard antibiotic files into one.' },
      { hook: 'Destroy, Disguise, Deport, Deny entry', expands: 'The four resistance shapes: β-lactamase (destroy), PBP2a/target change (disguise), efflux pumps (deport), porin loss (deny entry).' },
    ],
    mistakes: [
      'Assuming cephalosporins cover MRSA — the classic trap; MRSA’s PBP2a resists all standard β-lactams, which is why vancomycin exists in the answer.',
      'Putting tetracyclines in the 50S drawer (or clindamycin in 30S) — subunit placement is examined verbatim.',
      'Forgetting that aminoglycosides need oxygen for uptake — hence no anaerobic and poor intracellular activity.',
      'Missing C. difficile risk whenever broad-spectrum antibiotics appear — the harm of the wall-and-ribosome drawers is often another organism.',
    ],
    analogies: [
      'Factory with a brick wall, 3-D printer, computer and workshop (above) — each drawer is a trained saboteur for one target.',
      'Sequential folate blockade = two locks on the same door, opened by two keys given together (cotrimoxazole).',
    ],
    examRelevance:
      'Mechanism→drug matching, 30S vs 50S sorting, resistance-mechanism vignettes, adverse-effect tables (aminoglycoside toxicity, tetracycline teeth, quinolone tendon), and cephalosporin-generation coverage questions are the perennial patterns.',
    clinicalRelevance:
      'Empirical choices on the ward are drawer choices: cover the likely wall/ribosome/DNA target for the likely organism, add a bodyguard when β-lactamase is likely, and de-escalate once culture and sensitivity return.',
    teachDeeper: [
      'β-lactamase classes and inhibitor coverage — why clavulanate fails some enzymes (specialist detail, teaching level).',
      'Post-antibiotic effect and once-daily aminoglycoside logic.',
      'The AWaRe classification as a stewardship tool — Access/Watch/Reserve.',
      'Linezolid and MAO-adjacent effects; chloramphenicol’s two classic toxicities.',
    ],
    crossLinks: [
      { conceptId: 'c2-microbiology-gram-stain', label: 'Gram Staining (this pack)', why: 'The stain is the first branch point of empirical antibiotic choice — colour picks the drawer.' },
      { conceptId: 'c-antitb', label: 'Anti-Tubercular Drugs (Pharmacology)', why: 'TB drugs are the special case: slow growers, intracellular targets, combination-forced-by-resistance.' },
      { conceptId: 'c2-microbiology-sepsis', label: 'Sepsis (this pack)', why: 'The hour-1 bundle’s broad-spectrum antibiotics are the drawer logic under time pressure.' },
    ],
    global: [
      { region: 'WHO/Global', terminology: ['AWaRe: Access · Watch · Reserve'], workflow: 'WHO organises stewardship teaching around the AWaRe book — groups by spectrum and stewardship role rather than chemistry.', note: 'A complementary lens to the mechanism drawers; both are worth knowing.' },
      { region: 'India', terminology: [], note: 'Over-the-counter availability makes stewardship education central to Indian pharmacology teaching; schedule-H logic exists alongside.' },
      { region: 'United States', terminology: [], note: 'US teaching frames similar mechanism content around FDA-labelled indications and hospital antibiograms.' },
      { region: 'United Kingdom', terminology: [], note: 'NICE antimicrobial-prescribing guidance pairs each syndrome with narrowest-spectrum choices.' },
    ],
    sources: [
      whoRef('WHO — AWaRe antibiotic classification and stewardship framing'),
      cdcRef('CDC — antibiotic resistance and stewardship education'),
      ncbiRef('Antibiotic mechanisms and resistance review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Antibiotic choice and durations are guideline-driven and resistance-pattern dependent — always verify against current local and national guidance.',
  },

  // ── Topic: t-pharm-cardio (ENRICHES existing concept c-acei) ────────────────
  {
    id: 'c-acei',
    name: 'ACE Inhibitors & the Antihypertensive Classes',
    kind: 'drug-class',
    oneLiner:
      'ACE inhibitors block the enzyme that converts angiotensin I to angiotensin II — lowering both a vasoconstrictor and a salt-retaining hormone — and sit at the centre of a five-class antihypertensive map (ACEi, ARB, CCB, β-blocker, diuretic) that every exam and clinic uses.',
    whyMatters:
      'Hypertension is the commonest chronic diagnosis in adult practice worldwide, and its drug map is drawn on RAAS physiology. ACE inhibitors anchor it: the same logic covers heart failure, post-MI protection, diabetic nephropathy — and the same side-effects (cough, angioedema, hyperkalaemia, teratogenicity) are perennial exam questions.',
    explain30s:
      'RAAS in one line: renin → angiotensin I → ACE cuts it to angiotensin II → vasoconstriction + aldosterone → salt/water retention + remodelling. ACE INHIBITORS block the cut: vessels relax, aldosterone falls, potassium rises, and bradykinin (normally degraded by ACE) accumulates — causing the famous dry cough and rare angioedema. ARBs block the angiotensin II receptor instead — same benefits, no kinin effect, no cough. CALCIUM-CHANNEL BLOCKERS: dihydropyridines (amlodipine) relax vascular smooth muscle (ankle oedema, reflex tachycardia); verapamil/diltiazem also slow the heart (constipation, bradycardia with verapamil). β-BLOCKERS cut heart rate/force and renin release — powerful post-MI and in failure, avoided in asthma. DIURETICS: thiazides lower BP by early volume depletion then sustained vasodilation (watch sodium, potassium, urate, glucose); spironolactone is the resistant-hypertension add-on. First-line logic: any of ACEi/ARB/CCB/thiazide may start; β-blockers are compelling where ischaemia or failure coexists.',
    eli5:
      'Blood pressure is water pressure in pipes. The body has a tap-turning hormone (angiotensin II) that both squeezes pipes and tells kidneys to keep salt and water. ACE inhibitors stop the factory line that makes that hormone — pipes relax, less salt stored. But the same factory line also shreds a spare pipe-relaxer (bradykinin); block the line and the spare piles up — that is the dry cough. ARBs jam the hormone’s lock instead — no pile-up, no cough. Calcium-channel blockers loosen the pipe muscles themselves. Beta-blockers calm the heart pump. Water tablets (thiazides) drain the tank. Five tools, one pressure gauge — and pregnancy forbids the hormone tools (ACEi/ARB) because the baby’s kidney plumbing depends on them.',
    firstPrinciples: [
      'RAAS first, drugs second: juxtaglomerular cells release renin → angiotensinogen → angiotensin I → ACE (lung endothelium) → angiotensin II → AT1 receptors: vasoconstriction, aldosterone, ADH, thirst, remodelling. Every anti-RAAS drug names its step.',
      'ACEi effects: ↓Ang II → vasodilation + natriuresis; ↓aldosterone → potassium retention (hyperkalaemia risk, worse with potassium supplements or renal impairment); ↓remodelling signals → the post-MI and heart-failure benefit logic.',
      'The bradykinin story explains the signature toxicity: ACE also degrades bradykinin → ACEi raises it → dry cough (common) and angioedema (rare but dangerous). ARBs do not touch bradykinin — the standard alternative.',
      'ACEi/ARB renal logic is two-edged: they reduce intraglomerular pressure (long-term kidney protection in diabetic nephropathy) but depend on efferent tone — bilateral renal-artery stenosis or volume depletion can crash GFR. The exam loves this duality.',
      'CCBs split by target: dihydropyridines (amlodipine, nifedipine) = vascular smooth muscle → ankle oedema (precapillary), flushing, reflex tachycardia; non-dihydropyridines (verapamil, diltiazem) = cardiac conduction/contractility → bradycardia, constipation (verapamil), caution in failure.',
      'β-blockers lower BP via ↓rate/contractility, ↓renin, and central effects; compelling where post-MI, HFrEF or rate control coexists; avoid in asthma (β2), caution in diabetes (masking tremor/palpitations of hypoglycaemia), and never stop abruptly (rebound).',
      'Diuretics and the electrolyte table: thiazides lose Na⁺, K⁺, Mg²⁺, retain Ca²⁺ and urate (gout trap), raise glucose — "hyperGLUC"; loop diuretics are the oedema/failure tools; spironolactone (aldosterone antagonism) is the add-on for resistant hypertension and the ascites drug — same RAAS story at two organs.',
    ],
    drugs: [
      { name: 'Enalapril / ramipril (ACEi)', drugClass: 'ACE inhibitor', mechanism: 'Blocks angiotensin I→II conversion', note: 'Dry cough and angioedema are the signature risks; contraindicated in pregnancy and bilateral renal-artery stenosis.' },
      { name: 'Losartan / telmisartan (ARB)', drugClass: 'AT1-receptor blocker', mechanism: 'Blocks angiotensin II at its receptor', note: 'The cough-free ACEi alternative; same pregnancy and hyperkalaemia rules.' },
      { name: 'Amlodipine (CCB)', drugClass: 'Dihydropyridine calcium-channel blocker', mechanism: 'Vascular smooth-muscle relaxation', note: 'Ankle oedema is dose-dependent and the commonest reason patients stop it.' },
      { name: 'Metoprolol / atenolol (β-blocker)', drugClass: 'β1-selective blocker', mechanism: '↓heart rate/contractility, ↓renin', note: 'Post-MI and HFrEF benefit; asthma caution; abrupt withdrawal rebound.' },
      { name: 'Hydrochlorothiazide / chlorthalidone', drugClass: 'Thiazide/thiazide-like diuretic', mechanism: 'Early volume loss, sustained vasodilation', note: 'Hyponatraemia, hypokalaemia, hyperuricaemia, hyperglycaemia — the electrolyte table to recite.' },
      { name: 'Spironolactone', drugClass: 'Aldosterone antagonist (potassium-sparing)', mechanism: 'Blocks mineralocorticoid receptor', note: 'Resistant-hypertension add-on; hyperkalaemia and gynaecomastia are the classic flags.' },
    ],
    mistakes: [
      'Combining ACEi with ARB or with spironolactone without reason — hyperkalaemia stacks; the exam and the ward both punish the potassium arithmetic.',
      'Prescribing ACEi/ARB in pregnancy — fetal renal toxicity is an absolute teaching rule.',
      'Cough on ACEi treated with more drug instead of switching to an ARB — the bradykinin logic gives the answer.',
      'Attributing amlodipine ankle oedema to heart failure — it is precapillary dilation; venous return is fine.',
      'Stopping β-blockers abruptly before surgery — rebound adrenergic surge is the classic perioperative trap.',
    ],
    analogies: [
      'RAAS as a factory line making a tap-tightening hormone; ACEi stops the conveyor, ARB jams the hormone’s lock — same tap, two sabotage points.',
      'The five classes as five plumbers: one cuts the hormone supply (ACEi/ARB), two loosen pipe muscles (CCB) or calm the pump (β-blocker), one drains the tank (diuretic).',
    ],
    examRelevance:
      'Cough→bradykinin→switch-to-ARB chains, hyperkalaemia combinations, pregnancy contraindications, thiazide electrolyte patterns, CCB subclass discrimination, and "compelling indication" matching (post-MI → ACEi + β-blocker) are the recurring frames.',
    clinicalRelevance:
      'Baseline potassium and creatinine before starting an ACEi, counselling about dry cough, checking ankles on amlodipine follow-up, and the resistant-hypertension add-on sequence are daily hypertension-clinic moves built on this lesson.',
    teachDeeper: [
      'Direct renin inhibitors and the "why not" of their niche.',
      'Aldosterone breakthrough and spironolactone’s heart-failure evidence logic (principle level).',
      'Hypertensive emergencies: which classes, which routes, why nicardipine/labetalol-style infusions (specialist).',
      'Renal-artery stenosis physiology — why efferent tone is the stenotic kidney’s lifeline.',
    ],
    crossLinks: [
      { conceptId: 'c-betablock', label: 'Beta-Blockers (Pharmacology)', why: 'The β-blocker branch of this map in full depth — same physiology, dedicated lesson.' },
      { conceptId: 'c-heartfail', label: 'Heart Failure (Pharmacology)', why: 'ACEi + β-blocker are mortality classes in HFrEF — hypertension’s map becomes failure’s.' },
      { conceptId: 'c2-pathology-cirrhosis', label: 'Cirrhosis & Portal Hypertension (this pack)', why: 'Spironolactone-first ascites logic — the same aldosterone story at a different organ.' },
      { label: 'RAAS physiology (Physiology)', why: 'The map behind the drugs — renin to aldosterone in four steps.' },
    ],
    global: [
      { region: 'India', terminology: [], note: 'All five classes are on India’s essential-medicines list; fixed-dose ACEi/ARB+CCB combinations are widely used in public and private sectors.' },
      { region: 'United Kingdom', terminology: [], workflow: 'NICE sequences first-line by age/ancestry framing (CCB or diuretic vs ACEi/ARB by renin logic).', note: 'A sequencing lens — the drug classes and cautions are identical.' },
      { region: 'United States', terminology: [], workflow: 'US committee guidance presents ACEi/ARB/CCB/thiazide as interchangeable first-line starts with compelling indications.', note: 'Same classes; guideline sequencing details differ by committee and update cycle.' },
      { region: 'WHO/Global', terminology: [], note: 'WHO lists these agents among essential medicines for hypertension control programmes worldwide.' },
    ],
    sources: [
      niceRef('NICE — hypertension diagnosis and management guidance framing'),
      jhmiRef('Johns Hopkins Medicine — high blood pressure patient/professional education'),
      fdaRef('FDA — antihypertensive labelling and safety communication framing'),
      ncbiRef('Antihypertensive pharmacology review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'First-line sequencing and combination rules are guideline-driven and periodically updated — verify against current national guidance.',
  },

  // ── Topic: pharmacology-analgesia ───────────────────────────────────────────
  {
    id: 'c2-pharmacology-nsaids',
    name: 'NSAIDs, Aspirin & Paracetamol: The COX Story',
    kind: 'drug-class',
    oneLiner:
      'NSAIDs block cyclo-oxygenase (COX), the enzyme that makes prostaglandins — the useful effects (analgesia, anti-inflammation) and the famous harms (stomach, kidney, platelets) are the same blockade seen at three tissues.',
    whyMatters:
      'These are the world’s most self-prescribed drugs, so their harm profile is public-health scale: GI bleeding, renal impairment, aspirin’s narrow antiplatelet window, and paracetamol as a leading overdose hepatotoxin. The mechanism explains every harm — the exam’s favourite "mechanism→adverse effect" table.',
    explain30s:
      'Arachidonic acid → COX-1/COX-2 → prostaglandins (and thromboxane via platelets). COX-1 is housekeeping: gastric mucosal protection, renal perfusion support, platelet thromboxane. COX-2 is mostly inducible: inflammation, fever, pain. NON-SELECTIVE NSAIDs (ibuprofen, diclofenac, naproxen) block both — analgesia and anti-inflammation, but lose gastric protection, stress renal perfusion and (reversibly) hit platelets. ASPIRIN irreversibly acetylates COX-1 — at low dose that means permanent antiplatelet effect until new platelets arrive (its cardioprotective niche). PARACETAMOL (acetaminophen) is a weak peripheral COX blocker with central action — no meaningful antiplatelet or gastric effect, but overdose: its metabolite NAPQI depletes glutathione and kills hepatocytes (centrilobular necrosis) — treated with N-acetylcysteine, which replenishes glutathione. The WHO analgesic ladder organises escalation: non-opioid → weak opioid → strong opioid, with adjuvants.',
    eli5:
      'Prostaglandins are the body’s alarm-and-maintenance chemicals: they say "hurt!" and "inflame!", but also "keep the stomach lining slimy" and "keep blood flowing to the kidneys". NSAIDs silence the alarm — pain and swelling fall — but the maintenance messages get silenced too: the stomach lining thins (ulcers), kidneys sulk, and platelets get stick-logic changes. Aspirin is the permanent version: it glues the platelet alarm shut until the platelet dies — that is why a small daily aspirin thins clots, and why it must stop before surgery. Paracetamol barely touches the workshop; it works mostly in the brain — but push too much and its leftover exhaust (NAPQI) burns down the liver’s central district; the antidote simply restocks the fire extinguisher (glutathione).',
    firstPrinciples: [
      'One pathway explains everything: membrane phospholipids → arachidonic acid → COX-1/COX-2 → prostaglandins/thromboxane/prostacyclin. NSAIDs sit on the enzyme; the tissue that suffers is whichever tissue needed those prostaglandins that day.',
      'COX-1 (constitutive) = stomach mucosa (cytoprotection via mucus/bicarbonate/perfusion), kidney (afferent vasodilation in low-flow states), platelet TXA2 (stickiness). COX-2 (inducible) = pain, fever, inflammation — with some kidney/endothelium roles (the reason selective COX-2 inhibitors carry cardiovascular flags).',
      'Aspirin’s irreversibility is its personality: covalent acetylation means the effect lasts the platelet’s lifespan; low dose = antiplatelet niche; higher doses add analgesia/antipyresis; Reye syndrome teaching flag in children with viral illness; bleeding risk before surgery is the perioperative classic.',
      'NSAID harms are a three-organ list with mechanisms: STOMACH (lost cytoprotection → erosions/ulcers/bleeds — co-prescribing PPI logic for high-risk patients), KIDNEY (afferent vasoconstriction → prerenal impairment, worse with ACEi + volume depletion — the "triple whammy" teaching pattern with diuretics), PLATELETS (reversible TXA2 blockade for most NSAIDs — ibuprofen can theoretically blunt aspirin’s effect if taken first).',
      'Paracetamol is a different animal: central COX-ish action, negligible peripheral inflammation effect, safe stomach/platelets/kidney at normal doses — but a narrow overdose margin via NAPQI: glutathione depletion → centrilobular hepatocellular necrosis; N-acetylcysteine works by restocking glutathione, best early.',
      'NSAID-exacerbated respiratory disease: COX blockade shunts arachidonate to leukotrienes in susceptible asthmatics — the reason "NSAID allergy" asthmatic vignettes appear.',
      'The WHO analgesic ladder is escalation logic, not a prescription: step 1 non-opioid (± adjuvant), step 2 weak opioid, step 3 strong opioid — used mainly in cancer-pain teaching.',
    ],
    drugs: [
      { name: 'Ibuprofen', drugClass: 'Non-selective NSAID', mechanism: 'Reversible COX-1/COX-2 inhibition', note: 'Analgesic staple; same GI/renal/platelet caution family.' },
      { name: 'Aspirin (low dose)', drugClass: 'Irreversible COX-1 inhibitor (antiplatelet)', mechanism: 'Covalent acetylation of platelet COX-1 → ↓thromboxane for the platelet’s life', note: 'The only NSAID used prophylactically for clots; Reye syndrome flag in children.' },
      { name: 'Paracetamol (acetaminophen)', drugClass: 'Analgesic/antipyretic (central COX-related action)', mechanism: 'Central prostaglandin modulation; no meaningful peripheral anti-inflammatory effect', note: 'Overdose → NAPQI hepatotoxicity; N-acetylcysteine is the antidote. Follow local protocols for thresholds and timing.' },
      { name: 'Diclofenac / naproxen', drugClass: 'Non-selective NSAIDs', mechanism: 'Reversible COX blockade', note: 'Naproxen’s longer half-life suits inflammatory arthritis; same harm family.' },
      { name: 'Celecoxib', drugClass: 'Selective COX-2 inhibitor', mechanism: 'COX-2 blockade spares platelet/gastric COX-1 partially', note: 'Cardiovascular flags from the class history — mechanism-based teaching.' },
    ],
    mnemonics: [
      { hook: 'COX-1 = Constant housekeeping · COX-2 = Crisis chemical', expands: 'COX-1 protects stomach/kidney/platelets; COX-2 answers inflammation — why blocking both helps pain and hurts stomach/kidney.' },
      { hook: 'Aspirin glues, the rest just lean', expands: 'Aspirin’s covalent bond is permanent for the platelet’s life; other NSAIDs inhibit reversibly.' },
      { hook: 'The triple whammy', expands: 'NSAID + ACE inhibitor + diuretic = the classic acute-kidney-injury combination in teaching (afferent squeeze + efferent relaxation + volume depletion).' },
    ],
    mistakes: [
      'Calling paracetamol an NSAID — it lacks meaningful anti-inflammatory and platelet effects; its danger is the liver, not the stomach.',
      'Forgetting aspirin is "NSAID-class" for allergic asthmatics — cross-reactivity logic applies.',
      'Timing aspirin after ibuprofen without thought — the interference teaching point.',
      'Treating paracetamol overdose as safe because it is over-the-counter — the delayed-hepatotoxicity story exists precisely because patients feel "fine" early.',
    ],
    analogies: [
      'Silencing the alarm bell that also rings "keep the stomach slimy" — relief and damage from the same switch.',
      'Aspirin = superglue on the platelet’s stickiness lever until the platelet is replaced; ibuprofen = a firm hand on the lever, released within hours.',
      'Paracetamol exhaust (NAPQI) vs glutathione = smoke vs fire extinguisher; N-acetylcysteine refills the extinguisher.',
    ],
    examRelevance:
      'Mechanism→harm matching (stomach/kidney/platelets), aspirin’s irreversibility logic, paracetamol-NAPQI-NAC chain, COX-2 selectivity and cardiovascular flags, and the WHO ladder are the standard question shapes.',
    clinicalRelevance:
      'Counselling patients about self-medication (GI symptoms, kidney risk with dehydration), perioperative aspirin decisions, and safe paracetamol labelling literacy are population-scale uses of this lesson.',
    teachDeeper: [
      'Prostacyclin vs thromboxane balance and the COX-2 cardiovascular story.',
      'Leukotriene shunting in NSAID-exacerbated respiratory disease.',
      'Paracetamol metabolism kinetics: saturation of conjugation pathways in overdose (ties to the kinetics lesson).',
      'Topical NSAIDs and systemic absorption — why guidelines increasingly favour them for local musculoskeletal pain.',
    ],
    crossLinks: [
      { conceptId: 'c2-pathology-cell-injury', label: 'Cell Injury & Necrosis (this pack)', why: 'Paracetamol overdose is the textbook centrilobular (coagulative) necrosis — pathology made pharmacological.' },
      { conceptId: 'c-antiplatelet', label: 'Antiplatelet Agents (Pharmacology)', why: 'Aspirin is the bridge drug: NSAID by class, antiplatelet by dose and irreversibility.' },
      { conceptId: 'c2-pharmacology-kinetics', label: 'Pharmacokinetics (this pack)', why: 'NAPQI accumulation is saturation kinetics — the zero-order lesson wearing a toxicology coat.' },
    ],
    sources: [
      fdaRef('FDA — NSAID safety communication and paracetamol labelling framing'),
      niceRef('NICE — NSAID prescribing and palliative analgesia guidance framing'),
      ncbiRef('COX pharmacology and paracetamol hepatotoxicity literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Overdose thresholds, N-acetylcysteine protocols and analgesic escalation are protocol-driven — verify current local guidance.',
  },

  // ── Topic: t-pharm-endo (ENRICHES existing concept c-metformin) ─────────────
  {
    id: 'c-metformin',
    name: 'Metformin & the Antidiabetic Classes',
    kind: 'drug-class',
    oneLiner:
      'Metformin — the default first drug for type 2 diabetes — cuts the liver’s glucose output and improves insulin sensitivity without causing hypoglycaemia; the other classes (sulfonylureas, insulins, SGLT2, GLP-1) each plug into a different point of glucose physiology.',
    whyMatters:
      'Diabetes is among the most prevalent chronic diseases worldwide and its drug ladder is examined in every clinical subject. Metformin is the anchor: mechanism, contraindications (renal impairment), and the "no hypoglycaemia" logic are guaranteed marks — and insulin time-courses are practical daily knowledge.',
    explain30s:
      'Glucose physiology has three dials: the LIVER dumps glucose (gluconeogenesis/glycogenolysis), MUSCLE/FAT take it up (insulin-dependent transporters), and the GUT absorbs it. METFORMIN turns down the liver’s output (AMPK/mitochondrial framing) and sensitises uptake — weight-neutral, no hypoglycaemia alone, GI upset common; stopped when eGFR falls because of the rare but classic lactic-acidosis risk. SULFONYLUREAS (glimepiride, gliclazide) close beta-cell K-ATP channels → insulin release regardless of glucose → hypoglycaemia + weight gain. INSULINS are timed: rapid analogues (lispro/aspart) with meals, short-acting regular, intermediate NPH, long-acting glargine/detemir as the basal floor. SGLT2 INHIBITORS spill glucose into urine (with genital-mycotic and volume flags); GLP-1 AGONISTS slow the gut, boost glucose-dependent insulin, curb appetite. The ladder logic: match the drug to the patient’s weight, renal function, hypoglycaemia risk and cost.',
    eli5:
      'Sugar in the blood comes from three doors: the liver makes it, the gut absorbs it, muscles store it (with insulin’s help). Metformin tells the liver "stop making so much sugar" and helps muscles open their doors — it never pushes sugar lower than safety, so it rarely causes a crash. Sulfonylureas whip the pancreas: "release insulin NOW!" — effective, but the whip does not check the blood level first, so lows happen. Injected insulin is simply the key muscles need, in fast (mealtime), medium, and slow (all-day) versions. SGLT2 blockers tell the kidneys to leak extra sugar out — a plumbing solution. GLP-1 drugs whisper "you are full", slow the stomach, and only make insulin when sugar is high. Each drug attacks a different door — exams ask which door, clinics ask which patient.',
    firstPrinciples: [
      'Start with the three dials: hepatic output, peripheral uptake, gut absorption. Every antidiabetic class names its dial — organising by dial beats memorising a list.',
      'Metformin: ↓hepatic gluconeogenesis (AMPK-activation and mitochondrial-glycerophosphate framing — exam-friendly), ↑peripheral insulin sensitivity; does NOT stimulate insulin, hence no hypoglycaemia as monotherapy and weight-neutral profile. GI upset is the common limitation; take with food.',
      'Metformin’s renal rule: eGFR-dependent dosing/avoidance because accumulation raises lactic-acidosis risk (rare, classic, exam-permanent). Contrast-procedure holding rules are protocol-driven — verify locally.',
      'Sulfonylureas: close β-cell K-ATP channels → depolarisation → insulin release. Glucose-independent → hypoglycaemia (especially long-acting/renal impairment) + weight gain. The "whip without a fuel gauge" logic.',
      'Insulin time-course is the clinical matrix: rapid analogues (lispro/aspart — take with meals), short (regular — ~30 min pre-meal), intermediate (NPH — cloudy, peaky), long (glargine/detemir — near-peakless basal). Mix logic: basal covers the floor, prandial covers the spikes; hypoglycaemia management is glucose-first, then find the cause.',
      'SGLT2 inhibitors: block renal glucose reabsorption → glycosuria; benefits beyond glucose (teaching level), flags: genital mycotic infections, volume depletion, euglycaemic ketoacidosis awareness. GLP-1 receptor agonists: incretin logic — glucose-dependent insulin secretion, glucagon suppression, gastric slowing, weight benefit; GI intolerance is the practical limiter.',
      'The ladder is patient-shaped: renal function, hypoglycaemia risk, weight, cost and comorbidity pick the class — not a fixed sequence. HbA1c is the scoreboard, individualised by age/comorbidity.',
    ],
    drugs: [
      { name: 'Metformin', drugClass: 'Biguanide', mechanism: '↓Hepatic gluconeogenesis, ↑insulin sensitivity', note: 'First-line for T2DM; GI intolerance common; eGFR-based cautions; rare lactic acidosis.' },
      { name: 'Glimepiride / gliclazide', drugClass: 'Sulfonylurea', mechanism: 'Closes β-cell K-ATP channels → insulin release', note: 'Hypoglycaemia and weight gain are the class signature; caution in renal impairment/elderly.' },
      { name: 'Insulin glargine', drugClass: 'Long-acting basal insulin analogue', mechanism: 'Near-peakless 24-hour background insulin', note: 'The basal floor; hypoglycaemia risk shifts to missed meals/unmatched doses.' },
      { name: 'Insulin lispro/aspart', drugClass: 'Rapid-acting prandial analogues', mechanism: 'Mealtime insulin spikes matching absorption speed', note: 'Dose-with-food logic; the "15-minute rule" teaching frame (verify local practice).' },
      { name: 'Empagliflozin / dapagliflozin', drugClass: 'SGLT2 inhibitor', mechanism: 'Renal glucose reabsorption blockade → glycosuria', note: 'Genital mycotic infections, volume status, euglycaemic ketoacidosis awareness.' },
      { name: 'Semaglutide / liraglutide', drugClass: 'GLP-1 receptor agonist', mechanism: 'Incretin pathway: glucose-dependent insulin release, slowed gastric emptying, satiety', note: 'GI intolerance limits up-titration; weight benefit is part of the story.' },
    ],
    mistakes: [
      'Claiming metformin causes hypoglycaemia as monotherapy — it does not stimulate insulin; the claim confuses it with sulfonylureas.',
      'Continuing full-dose metformin in advanced renal impairment — the accumulation/lactic-acidosis rule is the exam’s favourite metformin vignette.',
      'Mixing insulin time-courses in an answer (calling NPH peakless, or glargine prandial) — the matrix must stay clean.',
      'Forgetting insulin shifts potassium into cells — the same key opens the K⁺ door (links to hyperkalaemia management).',
    ],
    analogies: [
      'Three doors of blood sugar (liver factory, gut door, muscle storage) — each class is a hand on one door.',
      'Sulfonylurea = accelerator without a fuel gauge; insulin = the key itself; metformin = the foreman who stops the liver factory overproducing.',
      'Insulin time-courses as rain: a shower (lispro), a steady drizzle all day (glargine), an afternoon burst (NPH).',
    ],
    examRelevance:
      'Metformin mechanism + contraindication vignettes, sulfonylurea hypoglycaemia logic, insulin-type matching to time-course, SGLT2/GLP-1 mechanism identification, and insulin-potassium links are recurring patterns.',
    clinicalRelevance:
      'Renal-function checks before metformin refills, sick-day insulin rules teaching, hypoglycaemia counselling, and recognising that "new drug for diabetes" questions on the ward are dial-questions (which door?) are daily uses.',
    teachDeeper: [
      'Incretin physiology: why GLP-1 only works glucose-dependently (the safety logic).',
      'Euglycaemic ketoacidosis mechanism with SGLT2 inhibitors (awareness-level teaching).',
      'Insulin regimes: basal-bolus vs premix logic — matching injections to meals.',
      'Perioperative and sick-day metformin holding rules (protocol-driven — verify).',
    ],
    crossLinks: [
      { conceptId: 'c-hyperk', label: 'Hyperkalaemia (Pharmacology)', why: 'Insulin + glucose shifts potassium into cells — the antidiabetic key opens the K⁺ door too.' },
      { conceptId: 'c-steroids', label: 'Corticosteroid Pharmacology (Pharmacology)', why: 'Steroids raise glucose and unmask diabetes — the other end of the endocrine drug story.' },
      { conceptId: 'c2-pharmacology-kinetics', label: 'Pharmacokinetics (this pack)', why: 'Renal impairment rewrites the metformin plan — clearance logic in action.' },
    ],
    sources: [
      whoRef('WHO — diabetes care and essential-medicines framing'),
      niceRef('NICE — type 2 diabetes management guidance framing'),
      jhmiRef('Johns Hopkins Medicine — diabetes patient education'),
      ncbiRef('Antidiabetic pharmacology review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Drug sequencing, eGFR cut-offs and insulin regimens are guideline-driven and updated — verify current national guidance.',
  },

  // ── Topic: t-pharm-antibio (ENRICHES existing concept c-antitb) ─────────────
  {
    id: 'c-antitb',
    name: 'Anti-Tubercular Drugs: RIPE and the Rules',
    kind: 'drug-class',
    oneLiner:
      'Anti-TB therapy uses multiple drugs for months because TB bacilli live in different metabolic states and resist single drugs fast — the first-line set (rifampin, isoniazid, pyrazinamide, ethambutol) is remembered as RIPE, and each drug has one signature effect exams never stop asking.',
    whyMatters:
      'TB is one of the world’s great killers and India carries a large share of the global burden. The drug list is short and its toxicity table is one of the most repeated NEET-PG patterns — and the resistance story (MDR/XDR) is a public-health reality students must understand at principle level.',
    explain30s:
      'Why four drugs? Because a tuberculous lesion is a mixture: fast-growing bacilli in cavities (air), slow growers inside macrophages, and semi-dormant ones in caseous debris. No single drug kills all states, and single-drug therapy breeds resistance. RIFAMPIN blocks RNA polymerase — bacteria- and body-staining orange (urine, tears) — and is one of medicine’s strongest enzyme INDUCERS (oral contraceptives, warfarin fail). ISONIAZID blocks mycolic-acid synthesis (the wall’s wax) — peripheral neuropathy, prevented with pyridoxine (B6). PYRAZINAMIDE works in acidic environments (inside macrophages, caseous foci) — raises urate (gout flag). ETHAMBUTOL blocks arabinosyl transferase (wall assembly) — optic neuritis; colour vision is checked. Streptomycin (aminoglycoside) is the injectable historical line. The hepatotoxicity trio (isoniazid, rifampin, pyrazinamide) drives LFT monitoring logic; resistance patterns define MDR (rifampin+isoniazid resistant) and XDR (MDR plus more) — diagnosed by molecular tests, treated by specialist regimens.',
    eli5:
      'Tuberculosis is a fortress with workers of three moods: sprinters outside in the open cavity, slow workers hiding inside your own security guards (macrophages), and sleepers in the rubble. One drug cannot catch all three — so we send a team. Rifampin is the paperwork-destroyer that also paints everything orange (even your tears). Isoniazid dissolves the wax in their walls; it can tingle your fingertips, so we hand out vitamin B6 as a shield. Pyrazinamide works in the acid swamps — it can stir up gout. Ethambutol damages the eye’s colour vision if watched too long, so eyes get checked. Because the team must stay for months, the exams test exactly who does what and who hurts where — orange, tingling, gout, eyes.',
    firstPrinciples: [
      'Combination logic comes from bacillary populations: rapidly multiplying (cavity, oxygen-rich), slowly multiplying (macrophage interior), sporadically multiplying (caseous, acidic). Four first-line drugs overlap to sterilise all states and prevent resistance — the population logic, not a memorised table.',
      'RIFAMPIN: inhibits DNA-dependent RNA polymerase → no mRNA. Signature: orange discolouration (a compliance marker!) and potent hepatic CYP INDUCTION — failures of oral contraceptives, warfarin, anticonvulsants; the interaction exam never forgets.',
      'ISONIAZID: inhibits mycolic-acid synthesis (katG activation to the active form). Signature: peripheral neuropathy (pyridoxine prevention) + hepatotoxicity + the slow acetylator lore.',
      'PYRAZINAMIDE: prodrug active only at acidic pH — the sterilising drug for intracellular/caseous niches. Signature: hyperuricaemia (gout flag) + hepatotoxicity.',
      'ETHAMBUTOL: inhibits arabinosyl transferase (arabinogalactan wall component). Signature: dose-dependent optic neuritis — red-green colour discrimination and visual acuity checks are the monitoring story.',
      'Hepatotoxicity trio: isoniazid ≥ rifampin ≈ pyrazinamide (teaching emphasis) — baseline LFTs and symptom-driven monitoring logic; the cirrhotic liver rewrites every TB plan.',
      'Resistance is defined by the drugs lost: resistance to rifampin (± isoniazid) = the MDR threshold; molecular assays detect rifampicin resistance directly — hence GeneXpert’s double role (diagnosis + resistance screen). Second-line regimens are specialist territory — principles, not prescriptions.',
    ],
    drugs: [
      { name: 'Rifampin (rifampicin)', drugClass: 'Rifamycin — first-line', mechanism: 'Inhibits DNA-dependent RNA polymerase', note: 'Orange secretions; potent enzyme inducer — check every co-prescription.' },
      { name: 'Isoniazid', drugClass: 'First-line', mechanism: 'Blocks mycolic-acid synthesis', note: 'Peripheral neuropathy → pyridoxine prophylaxis; hepatotoxicity flag.' },
      { name: 'Pyrazinamide', drugClass: 'First-line', mechanism: 'Active at acidic pH — sterilises intracellular/caseous niches', note: 'Hyperuricaemia/gout flag; hepatotoxicity trio member.' },
      { name: 'Ethambutol', drugClass: 'First-line', mechanism: 'Blocks arabinosyl transferase', note: 'Optic neuritis — colour-vision monitoring is the classic vignette.' },
      { name: 'Streptomycin', drugClass: 'Aminoglycoside (injectable, second-line-ish)', mechanism: '30S inhibition', note: 'Ototoxicity/nephrotoxicity — the aminoglycoside family price.' },
    ],
    mnemonics: [
      { hook: 'RIPE — and remember who turns you orange', expands: 'Rifampin, Isoniazid, Pyrazinamide, Ethambutol — the first-line core (often with pyridoxine alongside).' },
      { hook: 'Orange machine, tingly hands, angry joints, tired eyes', expands: 'The four signatures: rifampin discolouration/induction, isoniazid neuropathy, pyrazinamide urate, ethambutol optic neuritis.' },
      { hook: 'RIPES the liver', expands: 'Rifampin + Isoniazid + Pyrazinamide (+Streptomycin historically) are the hepatotoxicity-flag set — monitor logic.' },
    ],
    mistakes: [
      'Forgetting rifampin’s enzyme induction when reviewing a patient’s other medicines — contraceptive and anticoagulant failures are the canonical vignette.',
      'Giving isoniazid without pyridoxine in neuropathy-risk patients (alcohol, diabetes, HIV, pregnancy) — the prevention is part of the drug’s story.',
      'Skipping baseline/interval eye checks on ethambutol — colour vision first.',
      'Treating MDR-TB as "harder RIPE" — it is a different regimen family entirely (specialist-managed).',
    ],
    analogies: [
      'The fortress with sprinters, hidden slow workers and sleepers (above) — the four-drug team covers all moods.',
      'Rifampin as a forklift driver who speeds up the whole liver warehouse — other cargo (drugs) suddenly leaves too fast.',
    ],
    examRelevance:
      'Drug→toxicity matching is one of the most repeated pharmacology patterns in NEET-PG; plus enzyme-induction interactions, pyridoxine logic, visual-monitoring ethics, and resistance-definition questions.',
    clinicalRelevance:
      'Every TB programme visit checks adherence and toxicity; knowing the signatures makes you useful on day one — and knowing the interaction logic makes you safe around every other prescription the patient takes.',
    teachDeeper: [
      'Latent-TB preventive therapy logic (different doses/durations — verify current national guidance).',
      'Second-line classes at overview level: fluoroquinolones, injectables, bedaquiline-era regimens (naming, not dosing).',
      'Acetylator polymorphism and isoniazid kinetics (ties to the kinetics lesson).',
      'Why pyrazinamide fails in neutral pH — the sterilising-niche logic.',
    ],
    crossLinks: [
      { conceptId: 'c-tb', label: 'Tuberculosis (Microbiology)', why: 'The organism lesson pairs with the drug lesson — diagnosis feeds regimen.' },
      { conceptId: 'c2-pharmacology-kinetics', label: 'Pharmacokinetics (this pack)', why: 'Rifampin’s CYP induction is kinetics logic with real-world contraceptive consequences.' },
      { conceptId: 'c2-pathology-cirrhosis', label: 'Cirrhosis (this pack)', why: 'A failing liver and a hepatotoxic regimen — the interaction that rewrites TB care.' },
    ],
    global: [
      { region: 'India', terminology: ['NTEP — National TB Elimination Programme'], note: 'India’s programme (formerly RNTCP) organises diagnosis and treatment; this lesson names the programme without reproducing schedule specifics.' },
      { region: 'WHO/Global', terminology: [], note: 'WHO treatment guidance defines the framework national programmes adapt; regimens and durations are periodically updated — verify current versions.' },
      { region: 'United States', terminology: [], note: 'US CDC materials teach the same first-line agents with monitoring specifics differing by setting.' },
      { region: 'United Kingdom', terminology: [], note: 'UK guidance mirrors the same agents; BCG policy differences are the visible global contrast.' },
    ],
    sources: [
      whoRef('WHO — tuberculosis treatment guidance framing'),
      cdcRef('CDC — TB treatment and monitoring education'),
      ncbiRef('Anti-tubercular pharmacology and toxicity literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'high',
    verifyNote: 'Regimens, durations and resistance definitions are programme-driven and periodically updated — verify current WHO/NTEP guidance.',
  },

  // ── Topic: pharmacology-emergency ───────────────────────────────────────────
  {
    id: 'c2-pharmacology-emergency',
    name: 'Emergency Drugs: The Crash Cart by Logic',
    kind: 'drug-class',
    oneLiner:
      'Crash-cart drugs are not exotic — they are old drugs whose ROUTE, CONCENTRATION and TIMING decide lives: adrenaline by route, atropine for rate, adenosine for rhythm, amiodarone for shock-refractory VF/VT, naloxone for opioids.',
    whyMatters:
      'Every junior doctor meets the crash cart before they feel ready. The exam-relevant logic (why IM adrenaline in anaphylaxis but IV in arrest, why adenosine must be fast, why concentrations differ 1:1000 vs 1:10,000) is also the safety logic that prevents the classic fatal errors. This lesson teaches well-established teaching values only — and tells you to verify every protocol.',
    explain30s:
      'ADRENALINE (epinephrine): α1 squeezes vessels (restores pressure, shrinks airway swelling) while β1/β2 support the heart and open bronchi — in ANAPHYLAXIS it is INTRAMUSCULAR 0.5 mg of the 1:1000 solution (0.5 mL, mid-outer thigh), repeatable; in CARDIAC ARREST it is INTRAVENOUS 1 mg of the 1:10,000 solution every 3–5 minutes per protocol. The route/concentration pair is the safety hinge. ATROPINE: muscarinic blockade for symptomatic bradycardia. ADENOSINE: transient AV-node block, terminating many SVTs — pushed fast with a flush because its half-life is seconds. AMIODARONE: multichannel-blocking antiarrhythmic for shock-refractory VF/pulseless VT and for rate/rhythm control in selected tachyarrhythmias. NALOXONE: competitive mu-opioid antagonist for opioid overdose — repeat dosing may be needed (its duration can be shorter than the opioid’s). Supporting cast: 10% dextrose for hypoglycaemia, fluid boluses for shock, plus oxygen.',
    eli5:
      'Think of the body’s controls as a mixing desk: heart rate, vessel squeeze, airway size. Adrenaline is the master handle that pushes all the useful sliders at once — how you hold the handle matters: into the thigh muscle for allergy (strong and slow-releasing), into a vein for cardiac arrest (precise and fast). Atropine holds up the heart-rate slider when the brake driver is overactive. Adenosine is a hand that briefly pauses the heart’s relay station (AV node) — so brief you must slam it in with a chase of fluid, or it disappears first. Amiodarone calms electrical storms that resist the defibrillator. Naloxone simply pushes the opioid off its keyhole and keeps pushing until the patient breathes.',
    firstPrinciples: [
      'Emergency drugs are ordinary drugs with emergency logistics: the compound is familiar; the teaching points are route, concentration, timing — learn them as a set (anaphylaxis = IM adrenaline 1:1000; arrest = IV adrenaline 1:10,000).',
      'Adrenaline in anaphylaxis: α1 vasoconstriction reverses the distributive collapse and laryngeal oedema; β2 bronchodilation; β1 supports output. IM into the anterolateral thigh (vastus lateralis) — reliable absorption; the 0.5 mg (0.5 mL of 1:1000) adult teaching value is repeatable every 5 minutes as needed per protocol.',
      'Adrenaline in cardiac arrest: IV 1 mg (10 mL of 1:10,000) every 3–5 minutes during CPR per protocol — timing per current algorithm; the 10-fold concentration difference between vials is THE error-prevention teaching point.',
      'Atropine for symptomatic bradycardia: competitive muscarinic blockade removes vagal braking; the anticholinergic toxidrome is its overdose signature (hot, dry, blind, red, mad).',
      'Adenosine: ultra-short acting (seconds) AV-node blocker — terminate the majority of paroxysmal SVT by momentarily breaking the re-entry loop; give via large vein with an immediate flush; asthma caution (bronchospasm) is the flag.',
      'Amiodarone: class-III-leaning multi-channel blocker (K⁺ main, plus Na⁺/Ca²⁺/β effects) — for shock-refractory VF/pulseless VT per protocol and selected arrhythmias; thyroid, pulmonary, hepatic flags belong to chronic use.',
      'Naloxone: competitive mu-antagonist — respiratory depression reverses but naloxone’s shorter duration means re-sedation is possible; observe the patient. Dextrose for confirmed hypoglycaemia; fluids for distributive shock per protocol.',
    ],
    drugs: [
      { name: 'Adrenaline (epinephrine)', drugClass: 'Catecholamine — α1/β1/β2 agonist', mechanism: 'Vasoconstriction + bronchodilation + cardiac support', note: 'Anaphylaxis: IM 0.5 mg of 1:1000 (thigh). Cardiac arrest: IV 1 mg of 1:10,000 every 3–5 min per protocol. Verify local protocol — always.' },
      { name: 'Atropine', drugClass: 'Muscarinic antagonist', mechanism: 'Blocks vagal braking → ↑heart rate', note: 'Symptomatic bradycardia; also the organophosphate-poisoning antidote at higher, titrated doses.' },
      { name: 'Adenosine', drugClass: 'AV-node blocking agent', mechanism: 'Transient AV block terminates re-entry SVT', note: 'Half-life in seconds — fast push + flush; asthma caution.' },
      { name: 'Amiodarone', drugClass: 'Multichannel antiarrhythmic', mechanism: 'K⁺-dominant channel blockade (± Na/Ca/β)', note: 'Shock-refractory VF/VT per protocol; infusion and organ-toxicity flags belong to longer use.' },
      { name: 'Naloxone', drugClass: 'Opioid antagonist', mechanism: 'Competitive mu-receptor blockade', note: 'Re-sedation risk — duration mismatch with many opioids; observe after reversal.' },
      { name: 'Glucose 10% / 25–50% per protocol', drugClass: 'Antihypoglycaemic', mechanism: 'Restores substrate', note: 'Confirmed hypoglycaemia; consider thiamine in alcohol-use contexts per protocol.' },
    ],
    mnemonics: [
      { hook: '1:1000 in the thigh, 1:10,000 in the line', expands: 'The adrenaline route-concentration pairing that prevents the classic fatal mix-up.' },
      { hook: 'Adenosine is a snapshot, not a film', expands: 'Its action lasts seconds — the fast-push-with-flush technique exists because of the kinetics.' },
      { hook: 'HALT for bradycardia causes', expands: 'Hypoxia, (heart) block/AV issues, Anaesthetic/vagal, Lycaemia/low-temp & toxins — treat causes alongside atropine (protocol logic).' },
    ],
    mistakes: [
      'Drawing up the wrong adrenaline concentration — 1:1000 vs 1:10,000 is the classic fatal error this lesson exists to prevent.',
      'Delaying IM adrenaline in anaphylaxis for airway drugs or antihistamines — adrenaline first, and IM, not IV (IV reserved for arrest/specialist settings).',
      'Pushing adenosine slowly — without the flush it never reaches the AV node in active form.',
      'Assuming one naloxone dose ends the story — re-sedation as the opioid outlasts the antagonist is the observation-hall teaching point.',
    ],
    analogies: [
      'The mixing desk (above) — adrenaline as the master handle, atropine releasing a jammed brake, adenosine as a camera flash on the relay, naloxone as a hand pulling the opioid off the keyhole.',
      'Concentrations as two bottles that look alike: one is a firehose for a thigh muscle, the other a precision drip for a vein — labels are lives.',
    ],
    examRelevance:
      'Anaphylaxis first-drug-and-route questions, adrenaline concentration matching, adenosine SVT logic, atropine uses, naloxone duration mismatch — the emergency-pharmacology canon, asked across medicine, anaesthesia and surgery.',
    clinicalRelevance:
      'During any arrest or anaphylaxis, the junior doctor’s value is knowing these drugs’ route/concentration pairs cold — and reading the current protocol sheet before the event, not during it.',
    teachDeeper: [
      'Vasopressor selection in shock: noradrenaline’s α1-dominant profile as the septic-shock default (principle level).',
      'Amiodarone’s organ toxicity table (thyroid, lung, liver, cornea) — chronic-use teaching.',
      'Calcium salts, magnesium (torsades), and bicarbonate roles per protocol (awareness level).',
      'Pediatric weight-based emergency dosing systems (tape/length-based) — the logistics behind the doses.',
    ],
    crossLinks: [
      { conceptId: 'c2-pharmacology-autonomic', label: 'Autonomic Pharmacology (this pack)', why: 'Every crash-cart drug is a point on the autonomic map — emergency logistics on familiar receptor logic.' },
      { conceptId: 'c2-pharmacology-kinetics', label: 'Pharmacokinetics (this pack)', why: 'Adenosine’s seconds-long half-life and naloxone’s duration mismatch are kinetics deciding technique.' },
      { conceptId: 'c-ami', label: 'Acute Myocardial Infarction (Medicine)', why: 'Where many arrests begin — reperfusion and rhythm management share this shelf.' },
    ],
    global: [
      { region: 'India', terminology: ['Adrenaline'], note: 'Indian practice uses the adrenaline naming and commonly labels concentrations as 1:1000 / 1:10,000.' },
      { region: 'United States', terminology: ['Epinephrine'], note: 'US labelling says epinephrine with mg/mL concentrations (0.1 mg/mL, 1 mg/mL equivalents) — same drugs, different label arithmetic.' },
      { region: 'United Kingdom', terminology: ['Adrenaline'], note: 'UK resuscitation teaching matches the IM/IV route logic used here.' },
      { region: 'WHO/Global', terminology: ['adrenaline (epinephrine)'], note: 'WHO essential-medicines materials pair both names; doses quoted here are widely-taught teaching values, not a substitute for local protocols.' },
    ],
    sources: [
      whoRef('WHO — anaphylaxis and emergency-care guidance framing'),
      fdaRef('FDA — epinephrine and naloxone labelling/safety framing'),
      ncbiRef('Emergency pharmacology and resuscitation literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Emergency doses, concentrations and algorithms are protocol-driven and periodically updated — ALWAYS verify against the current resuscitation council and local hospital protocols before clinical use.',
  },
]

// ════════════════════════════════════════════════════════════════════════════
// LESSONS — MICROBIOLOGY (6)
// Flagships: Gram staining · hepatitis B serology. Enrichment: c-tb.
// ════════════════════════════════════════════════════════════════════════════

const microbiologyLessons: ConceptLesson[] = [
  // ── Topic: microbiology-bacteria-basics (FLAGSHIP) ──────────────────────────
  {
    id: 'c2-microbiology-gram-stain',
    name: 'Gram Staining: Why the Wall Decides the Colour',
    kind: 'investigation',
    oneLiner:
      'Gram staining sorts bacteria into purple (Gram-positive) and pink (Gram-negative) purely by cell-wall architecture — one four-step lab test that becomes the first branch point of every empirical antibiotic decision.',
    whyMatters:
      'It is usually the first result any microbiology lab reports, hours before culture. The colour narrows the organism list instantly, which narrows the antibiotic list — so the stain is where microbiology meets pharmacology. Exams test the four steps, the mechanism, and the famous exceptions relentlessly.',
    explain30s:
      'Four steps: (1) CRYSTAL VIOLET stains everything purple; (2) IODINE acts as a mordant, locking a big crystal-violet–iodine complex inside the cell; (3) ALCOHOL decolourises — and here the wall decides: a thick peptidoglycan mesh (Gram-POSITIVE) traps the complex and stays purple, while a Gram-NEGATIVE cell (thin peptidoglycan plus an outer membrane that alcohol disrupts) loses the stain; (4) SAFRANIN counterstains the now-colourless Gram-negatives PINK. The biology behind it: Gram-positives have a thick peptidoglycan wall; Gram-negatives have a thin peptidoglycan layer plus an outer membrane with lipopolysaccharide (endotoxin). Structures around the wall matter too: capsules (virulence, "K" antigen), spores (survival forms), flagella. Exceptions to memorise: mycoplasmas have NO wall (neither colour), acid-fast mycobacteria need Ziehl-Neelsen, some Gram-positives decolourise easily in old cultures, and intracellular organisms (chlamydia) hide from the stain.',
    eli5:
      'Imagine two kinds of houses. One has very thick brick walls; the other has a thin wall hidden behind a greasy raincoat (the outer membrane). You flood the whole town with purple paint, then glue it in place with iodine. Then you wash everyone with alcohol: the thick-brick house keeps the paint stuck deep in its walls — stays purple. The greasy raincoat dissolves and the thin wall loses the paint — it turns colourless, so we repaint it pink. That is the entire test. The raincoat town (Gram-negative) also carries a poison in its raincoat (endotoxin), and the thick-brick town is extra vulnerable to drugs that attack bricks (penicillins). A few oddballs have no walls at all (mycoplasma) or wax-coated walls that purple paint cannot enter (TB bacilli) — they need different tests.',
    firstPrinciples: [
      'The stain reports STRUCTURE, not identity: purple = thick peptidoglycan, no outer membrane; pink = thin peptidoglycan + outer membrane with LPS. Everything clinical (antibiotic permeability, endotoxin, beta-lactam susceptibility patterns) flows from that architecture.',
      'The four steps and their logic: crystal violet (primary stain) → iodine (mordant — builds the insoluble CV–I complex) → alcohol/acetone (decolouriser — the discriminating step) → safranin (counterstain). If you must know which step carries the decision, it is decolourisation.',
      'Gram-POSITIVE wall: thick peptidoglycan with teichoic acids. Peptidoglycan is THE target of β-lactams — which is why the purple world is the classic penicillin world. Examples: Staphylococcus (clusters), Streptococcus (chains), Enterococcus, Clostridium, Corynebacterium, Listeria, Bacillus.',
      'Gram-NEGATIVE envelope: outer membrane (LPS = endotoxin; porins control entry) + thin peptidoglycan + periplasm. The outer membrane is a permeability barrier — hence the need for specialised drugs (and porin-loss resistance). Examples: E. coli, Klebsiella, Pseudomonas, Salmonella/Shigella, Neisseria (pink diplococci), Haemophilus, Bacteroides.',
      'The famous exceptions: MYCOPLASMA (no wall — neither colour, and intrinsically β-lactam-resistant); MYCOBACTERIUM (waxy mycolic-acid wall — acid-fast by Ziehl-Neelsen, weakly Gram-positive at best); Treponema (too thin to stain well — dark-field/serology); Chlamydia/Rickettsia (intracellular — special stains/serology); old cultures and over-decolourised smears can flip positives pink — timing matters.',
      'Wall accessories with clinical meaning: CAPSULE (antiphagocytic — pneumococcus, Klebsiella; vaccines often target capsular polysaccharides), SPORES (Bacillus/Clostridium survival forms — autoclave is built around killing them), FLAGELLA/PILI (motility and adherence — pili matter for Neisseria’s attachment).',
      'The clinical chain: smear → Gram reaction + morphology (cocci in clusters? chains? pink rods? diplococci?) → empirical antibiotic drawer (this pack’s antibiotics lesson) → culture and sensitivity refine. The stain is fast, cheap, and the first fork in the road.',
    ],
    presentation: [
      'Gram-positive cocci in clusters → staphylococcal thinking (skin/abscess, endocarditis).',
      'Gram-positive cocci in chains → streptococcal thinking (pharyngitis, cellulitis, post-streptococcal sequelae).',
      'Gram-negative diplococci inside pus cells → meningococcus/gonococcus thinking — an emergency shape.',
      'Gram-negative rods in a biliary or urinary source → enteric thinking (E. coli, Klebsiella).',
      'Big Gram-positive rods with spores in trauma gas gangrene → Clostridium thinking.',
    ],
    diagnosis: [
      'Collect before antibiotics where possible — pus, CSF, sputum; fix by heat, stain, read under oil immersion.',
      'Interpret with the source: the same "Gram-negative rods" means different organisms in urine vs CSF vs sputum.',
      'Culture remains the definitive step; the stain buys you hours of earlier, narrower therapy.',
      'Report language: "Gram-positive cocci in clusters" is a description — the species waits for culture/biochemistry/MALDI-TOF.',
    ],
    mnemonics: [
      { hook: 'CV–I–A–S: "Come Voilet, I Adhere, Alcohol Decides, Safranin Sees"', expands: 'Crystal violet → Iodine (mordant) → Alcohol (the deciding decolouriser) → Safranin (counterstain).' },
      { hook: 'Positive = Prison of peptidoglycan', expands: 'Gram-positive cells keep the dye because their thick peptidoglycan "prison" traps the CV–I complex.' },
      { hook: 'NASTy exceptions: No wall, Acid-fast, Spores… wait', expands: 'Mycoplasma (No wall — no stain), mycobacteria (Acid-fast), Treponema (Thin — dark field), chlamydia (intracellular) — the four usual "neither colour" traps.' },
    ],
    mistakes: [
      'Calling Gram-negatives "no wall" — they HAVE a wall (thin peptidoglycan) plus an outer membrane; mycoplasma is the one with no wall.',
      'Reversing the colour code under pressure — positive/purple, negative/pink; anchor with "positively purple".',
      'Trusting a Gram stain of an old culture or a badly decolourised smear — technique errors flip colours.',
      'Expecting TB bacilli or mycoplasma on a routine Gram stain — they are the designed exceptions.',
    ],
    analogies: [
      'Thick-brick house vs raincoat house and the purple-paint wash (above) — the whole test in one picture.',
      'The Gram stain as a customs gate: it does not name the traveller, it just stamps two categories that decide which corridor (antibiotic drawer) they enter.',
    ],
    examRelevance:
      'Step-order and mechanism questions, colour/morphology organism matching, exception lists (mycoplasma, mycobacteria, treponema, chlamydia), LPS/endotoxin links, and Gram-based empirical-therapy vignettes are the standard formats.',
    clinicalRelevance:
      'CSF, blood-culture bottles, joint fluid and sputum all reach you with a Gram comment attached; reading that comment correctly is the fastest clinical skill this subject gives you.',
    teachDeeper: [
      'Peptidoglycan chemistry: NAM–NAG chains and cross-bridges — the exact target β-lactams block (ties to the antibiotics lesson).',
      'LPS structure: lipid A (toxic core), core polysaccharide, O antigen — endotoxin biology in one line each.',
      'Ziehl-Neelsen mechanics: carbol fuchsin, acid-alcohol, methylene blue — the mycobacterial counterpart stain.',
      'Modern taxonomy shifts (MALDI-TOF, 16S) — how identification actually happens in labs today.',
    ],
    crossLinks: [
      { conceptId: 'c2-pharmacology-antibiotics', label: 'Antibiotics by Mechanism (this pack)', why: 'Colour → organism family → antibiotic drawer: the stain is pharmacology’s opening move.' },
      { conceptId: 'c2-microbiology-sepsis', label: 'Sepsis (this pack)', why: 'The first smear in suspected sepsis shapes the first antibiotic choice of the hour-1 bundle.' },
      { conceptId: 'c-hpylori', label: 'Helicobacter pylori (Microbiology)', why: 'A curved Gram-negative rod — the gallery’s favourite diagnostic exception story.' },
    ],
    sources: [
      cdcRef('CDC — laboratory identification of bacteria education'),
      ncbiRef('Bacterial cell-envelope and staining review literature (PubMed Central indexing)'),
      openStaxRef('Microbiology — staining techniques (reference framing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: t-micro-tb (ENRICHES existing concept c-tb) ──────────────────────
  {
    id: 'c-tb',
    name: 'Tuberculosis: The Organism and the Tests That Decide',
    kind: 'disease',
    oneLiner:
      'Tuberculosis is infection with Mycobacterium tuberculosis — a slow, waxy, acid-fast bacillus that most people contain silently (latent) but some progress from — with Mantoux, IGRA, smear, NAAT and culture as the tests that sort exposure, infection and active disease.',
    whyMatters:
      'TB remains among the world’s top infectious killers and India carries a large share of the burden — every Indian clinical posting meets it. The exam-critical skill is test LOGIC: which test answers which question (infection vs active disease), and why the "window" and immune-status caveats matter.',
    explain30s:
      'The organism: an aerobic, non-motile bacillus with a waxy mycolic-acid wall — acid-fast on Ziehl-Neelsen, slow-growing (weeks on culture), resistant to drying, intracellularly capable. PRIMARY infection: inhaled droplet nuclei → lung focus (Ghon) ± hilar nodes → usually contained; most infected people never develop active disease (a commonly taught lifetime risk of roughly 5–10% overall, far higher with HIV, diabetes, smoking, malnutrition). LATENT vs ACTIVE: latent = contained infection, no symptoms, non-infectious; active = symptoms (cough >2 weeks, fever, weight loss, night sweats ± haemoptysis) + findings + microbiology. TESTS: MANTOUX (purified protein derivative skin test — induration read at 48–72 h; positivity thresholds vary by risk category and BCG status, with ≥10 mm the common standard cut-off in higher-risk contexts); IGRA (blood interferon-gamma assay — single visit, no BCG cross-reaction, still cannot separate latent from active); SMEAR (fast, cheap, needs high bacillary load); NAAT/GeneXpert (hours; detects rifampicin resistance — the MDR screen); CULTURE (gold standard, weeks). Post-primary TB reactivates in apices (oxygen-rich); miliary and extrapulmonary forms spread beyond.',
    eli5:
      'TB germs are like burglars with wax jackets. When they sneak in, your body usually builds a wall around them — a sealed crime scene (latent TB: caught, quiet, harmless, not contagious). A few escape later when your guards weaken (HIV, diabetes, malnutrition) — that is active TB: coughing for weeks, fever, weight loss, sweating at night. The tests answer different questions. The skin test (Mantoux) asks: "have your guards ever met this burglar?" — a lump two days later says yes. The blood test (IGRA) asks the same question in a vial. Neither can tell if the burglar is currently loose! For that you need evidence: sputum under a special stain (acid-fast), a fast gene machine (GeneXpert, hours — also checks if the burglar resists our main weapon), or growing the burglar in a lab (culture — slow but the gold standard).',
    firstPrinciples: [
      'The wall is the biology: mycolic-acid wax explains acid-fastness (dye resists acid-alcohol decolourisation), slow growth, environmental hardiness, and why drug targets (cell-wall synthesis) are special here.',
      'Spectrum thinking: EXPOSURE → LATENT INFECTION → ACTIVE DISEASE. Latent is alive-but-contained (non-infectious, no symptoms); active is uncontained (infectious if pulmonary). Every test maps to one question on this spectrum — the single highest-yield frame in TB.',
      'Mantoux logic: intradermal PPD → delayed-type hypersensitivity read as induration (not redness) at 48–72 h. Cut-offs are risk-tiered (immunocompromise/contact contexts use lower thresholds; general higher-risk screening commonly 10 mm) and vary by country guidance — verify the local table. Prior BCG can enlarge responses; prior infection does too.',
      'IGRA logic: blood T-cells exposed to TB-specific antigens release interferon-γ — quantified. Single visit, no BCG cross-reactivity, no booster effect; same fundamental limit as the skin test: infection marker, NOT activity marker.',
      'Microbiology ladder: SMEAR (ZN/fluorochrome — fast, cheap, low sensitivity, needs ~thousands of bacilli per mL teaching scale) → NAAT (GeneXpert MTB/RIF — same-day, plus rifampicin-resistance detection) → CULTURE (liquid/solid media — weeks, the gold standard, enables full drug-sensitivity testing).',
      'Why HIV changes everything: higher progression risk, more extrapulmonary/disseminated disease, lower smear positivity, and IGRA/skin-test anergy possibilities — the co-infection lesson links directly.',
      'Active-disease diagnosis is a triad: compatible symptoms + imaging (apical infiltrates/cavitation in post-primary) + microbiological confirmation where possible. Treatment follows national programme regimens (see the anti-TB drugs lesson).',
    ],
    numbers: [
      { label: 'Mantoux reading', value: 'Induration at 48–72 h; ≥10 mm a common standard cut-off (risk-tiered tables exist)', note: 'Induration, not erythema; thresholds differ by country and immune context — verify local guidance.' },
      { label: 'Lifetime progression risk', value: 'Roughly 5–10% overall in untreated latent infection (widely published teaching figure)', note: 'Immunosuppression (especially HIV) multiplies the risk many-fold.' },
      { label: 'Smear sensitivity', value: 'Needs high bacillary load; negative smear never excludes TB', note: 'The reason NAAT and culture exist alongside.' },
      { label: 'GeneXpert turnaround', value: 'About 2 hours', note: 'Same-day answer plus rifampicin-resistance screen — the modern front-door test in high-burden programmes.' },
    ],
    diagnosis: [
      'Symptom screen first: cough ≥2 weeks, fever, night sweats, weight loss, contact history.',
      'Post-primary chest imaging: upper-lobe infiltrates, cavitation; primary disease may show Ghon focus/nodes.',
      'Microbiology in order of speed: smear → NAAT (± resistance) → culture with drug sensitivity.',
      'Latent testing (Mantoux/IGRA) is for infection status — never for proving active disease, and vice versa.',
      'Extrapulmonary sites need site-specific sampling (pleural fluid, CSF, lymph-node aspirate) — same ladder applies.',
    ],
    mistakes: [
      'Using Mantoux/IGRA to diagnose active TB — they mark infection, not activity; a positive IGRA in a symptomatic patient does not equal disease confirmation.',
      'Reading the Mantoux at the wrong time or measuring redness instead of induration.',
      'Assuming a negative smear excludes TB — paucibacillary, extrapulmonary and HIV contexts are smear-poor.',
      'Forgetting the BCG caveat for skin tests and the anergy caveat in advanced immunosuppression.',
    ],
    analogies: [
      'Wax-jacketed burglars and sealed crime scenes (above) — latent vs active in one picture.',
      'The tests as different security questions: the skin test asks "have we met?", the gene machine asks "is he loose AND does he fear our weapon?", culture asks "let’s watch him grow to be sure".',
    ],
    examRelevance:
      'Test-selection vignettes (which test for latent screening in a contact vs diagnosis of active cough), Mantoux reading rules, GeneXpert’s double role, acid-fast staining logic, and HIV-modified risk questions are the recurring formats.',
    clinicalRelevance:
      'In high-burden settings the sequence — symptom screen, smear/NAAT, notification, programme treatment — is daily practice; in low-burden settings the same logic drives contact tracing and latent-TB screening of immunosuppressed patients.',
    teachDeeper: [
      'Ghon complex vs post-primary apical disease — pathology timelines of the same infection.',
      'BCG: what it does (severe childhood forms) and does not do (adult pulmonary prevention) — policy differences across countries.',
      'MDR/XDR definitions and the molecular assays behind them (naming level).',
      'Latent-TB treatment options at principle level (see the anti-TB drugs lesson).',
    ],
    crossLinks: [
      { conceptId: 'c-antitb', label: 'Anti-Tubercular Drugs (Pharmacology)', why: 'Diagnosis feeds regimen — the organism lesson and the drug lesson are a pair.' },
      { conceptId: 'c2-microbiology-hiv', label: 'HIV (this pack)', why: 'The deadly duo: HIV multiplies progression risk and reshapes every test’s behaviour.' },
      { conceptId: 'c2-pathology-cell-injury', label: 'Cell Injury & Necrosis (this pack)', why: 'Caseous necrosis and granulomas are this organism’s histological signature.' },
    ],
    global: [
      { region: 'India', terminology: ['NTEP — National TB Elimination Programme'], note: 'India’s programme drives notification, free diagnosis (including NAAT) and treatment; this lesson names it without reproducing schedule details.' },
      { region: 'WHO/Global', terminology: [], note: 'WHO End-TB framing sets the global targets national programmes adapt; algorithms are periodically updated — verify current versions.' },
      { region: 'United States', terminology: [], note: 'Low-burden logic: targeted latent-TB testing of risk groups; risk-tiered Mantoux tables differ from high-burden screening practice.' },
      { region: 'United Kingdom', terminology: ['NICE TB guidance'], note: 'UK practice pairs low-burden screening with high-risk-group focus — the contrast with universal-symptom-screen settings is educational, not a ranking.' },
    ],
    sources: [
      whoRef('WHO — tuberculosis diagnostics and End-TB strategy framing'),
      cdcRef('CDC — TB testing (Mantoux/IGRA) education'),
      ncbiRef('Tuberculosis diagnosis review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'high',
    verifyNote: 'Testing thresholds and diagnostic algorithms are programme- and guideline-driven — verify current WHO/NTEP/CDC guidance.',
  },

  // ── Topic: microbiology-malaria ──────────────────────────────────────────────
  {
    id: 'c2-microbiology-malaria',
    name: 'Malaria: Four Species, One Emergency',
    kind: 'disease',
    oneLiner:
      'Malaria is infection with Plasmodium parasites (vivax, falciparum, ovale, malariae, plus zoonotic knowlesi) carried by female Anopheles mosquitoes — periodic fevers from red-cell destruction, with falciparum the species that kills.',
    whyMatters:
      'Hundreds of millions of cases occur globally each year and India remains endemic (predominantly vivax and falciparum). The exam hinges are species logic (relapse, periodicity, danger) and the falciparum red flags — the difference between a treatable fever and a medical emergency.',
    explain30s:
      'TRANSMISSION: the female Anopheles injects sporozoites → liver phase (silent multiplication) → red-blood-cell phase — parasites digest haemoglobin and rupture RBCs in synchrony, producing the classic periodic fevers (vivax/ovale ~48 h "tertian", malariae ~72 h "quartan"; falciparum often irregular — a teaching trap). SPECIES LOGIC: vivax and ovale hide dormant forms (HYPNOZOITES) in the liver → relapse months later → need "radical cure" targeting the liver (primaquine-line drugs, with G6PD testing first); falciparum infects red cells of ALL ages (any parasitaemia possible) and makes infected cells sticky (cytoadherence) → sequestration in brain/placenta/kidneys → cerebral malaria, severe anaemia, renal failure, pulmonary oedema; malariae is chronic, low-grade, associated with nephrotic-syndrome teaching lore; knowlesi is zoonotic (macaques), Southeast Asia. DIAGNOSIS: thick smear (sensitive screen) + thin smear (species identification and parasitaemia %), plus rapid diagnostic tests (RDTs, antigen-based). Danger signs define SEVERE malaria: impaired consciousness, convulsions, jaundice, heavy parasitaemia, shock, renal impairment, acidotic breathing. Treatment principle: uncomplicated non-falciparum → chloroquine-line where still sensitive + liver-stage clearance; falciparum → artemisinin-based combination therapy (ACT); severe → IV artesunate per protocol.',
    eli5:
      'Imagine tiny pirates that stow away on your red blood cells — the little ships that carry oxygen. A mosquito injects the first pirate into your liver, where it quietly photocopies itself. Then the copies hijack red cells, multiply inside, and burst the ships on a schedule — that is why the fever comes in waves. The vivax/ovale pirates also hide spare photocopies in the liver (hypnozoites) — like seeds in a vault — so they can relaunch months later; treatment must burn the vault too. The falciparum pirate is the criminal one: it hijacks ships of every size (so their numbers can explode) and glues the hijacked ships to your blood-vessel walls, blocking traffic to the brain and kidneys — that is when malaria becomes an emergency.',
    firstPrinciples: [
      'Lifecycle in two acts: LIVER (silent, asymptomatic multiplication) then BLOOD (symptomatic — RBC invasion, haemoglobin digestion, synchronous rupture → fever spikes with waste products triggering the response). All symptoms live in the blood act.',
      'Periodicity from synchrony: tertian (~48 h) vivax/ovale, quartan (~72 h) malariae; falciparum’s cycles are asynchronous → irregular fever — the exam’s favourite species-differentiator trap.',
      'Hypnozoites define relapse: vivax/ovale dormant liver forms cause TRUE relapse after months; blood-stage treatment alone leaves the vault intact — radical cure (primaquine-family, G6PD-tested) is the species-specific lesson.',
      'Falciparum’s two weapons: (1) invades RBCs of all ages → parasitaemia can reach extreme levels; (2) knob-protein cytoadherence → microvascular sequestration → cerebral malaria, placental malaria, renal injury — the pathology behind the danger signs.',
      'Diagnosis: THICK smear maximises sensitivity (concentrates parasites); THIN smear identifies species and quantifies parasitaemia %; RDTs detect antigens where microscopy is unavailable; negative tests do not end suspicion in endemic fever workups.',
      'Severity is clinical: any danger sign (altered consciousness, repeated convulsions, respiratory distress/acidotic breathing, jaundice, significant parasitaemia, shock, oliguria, severe anaemia) upgrades the case — treat as severe regardless of species initially.',
      'Treatment principles by species and severity: non-falciparum uncomplicated → blood schizonticide ± radical cure after G6PD check; falciparum → ACT (never monotherapy — resistance history); severe → parenteral artesunate per protocol. Vector control (bednets, larval measures) is the population-level lesson (ties to Community Medicine).',
    ],
    presentation: [
      'Classic periodic fever with chills/rigors and sweats — but early falciparum may be just fever, headache, body ache (the dangerous mimic).',
      'Anaemia, splenomegaly, mild jaundice — the chronic trio.',
      'Danger signs: confusion/drowsiness, seizures, dark urine (blackwater teaching), breathlessness, scanty urine, bleeding — each is a severe-malaria flag.',
      'Pregnancy danger: placental sequestration → maternal anaemia and low-birth-weight risk.',
    ],
    diagnosis: [
      'Thick + thin smear in any compatible fever from an endemic area — the standard request.',
      'Parasitaemia percentage on thin film quantifies severity (high levels flag severe disease).',
      'RDTs for field/primary settings; microscopy confirms species and counts.',
      'Supporting labs: haemoglobin, platelets, bilirubin, renal function, glucose (hypoglycaemia flag), lactate in severe cases.',
    ],
    mistakes: [
      'Assuming all malaria fevers are periodic — falciparum is often irregular; waiting for the classic tertian pattern delays the kill-species diagnosis.',
      'Giving only blood-stage therapy for vivax and forgetting hypnozoites — relapse follows; and primaquine needs G6PD testing first.',
      'Calling vivax "always benign" — severe vivax exists; species never overrides danger signs.',
      'Missing malaria in the returning traveller or the febrile postpartum/neonatal-adjacent contexts — travel history is part of the fever screen.',
    ],
    analogies: [
      'Pirates hijacking oxygen ships (above) — synchronous scuttling = fever waves; the glued-ships falciparum = traffic jams in brain and kidney.',
      'Hypnozoites as seeds in a vault: chemotherapy clears the fields, radical cure clears the vault.',
    ],
    examRelevance:
      'Species→feature matching (hypnozoites, periodicity, all-age RBC invasion), danger-sign lists, thick-vs-thin smear logic, G6PD-before-primaquine chains, and ACT reasoning are the perennial malaria questions.',
    clinicalRelevance:
      'In endemic India, every febrile patient decision (test? smear or RDT? species? danger signs?) uses exactly this lesson; travellers’ clinics in non-endemic countries run the same logic with lower suspicion thresholds.',
    teachDeeper: [
      'Resistance history: chloroquine resistance and why ACTs became global standard (narrative, no invented numbers).',
      'Cytoadherence molecules (pfEMP1) and rosetting — sequestration biology at teaching depth.',
      'RDT antigen logic (HRP2/LDH) and its false-negative caveats.',
      'Vector biology and integrated control — the Community Medicine bridge (bednets, IRS, larval source management).',
    ],
    crossLinks: [
      { conceptId: 'c2-pathology-anemias', label: 'Anaemias (this pack)', why: 'Haemolysis-driven anaemia is the blood-side story of RBC destruction.' },
      { conceptId: 'c2-cm-vaccine-platforms', label: 'Community Medicine (this pack)', why: 'Vector control and fever surveillance are the population-level half of malaria.' },
      { conceptId: 'c2-microbiology-sepsis', label: 'Sepsis (this pack)', why: 'Severe malaria mimics and overlaps septic shock — the danger-sign lists rhyme.' },
    ],
    global: [
      { region: 'India', terminology: ['vivax + falciparum predominance'], note: 'India’s endemic mix makes BOTH the relapse lesson and the danger-sign lesson locally essential.' },
      { region: 'WHO/Global', terminology: [], note: 'WHO malaria guidance frames case management around parasitological confirmation and ACTs; endemic countries adapt by region.' },
      { region: 'WHO/Global', terminology: ['Sub-Saharan Africa: falciparum-dominant burden'], note: 'Sub-Saharan burden is falciparum-dominant — the emergency-species lens dominates there; educational contrast, not a ranking.' },
      { region: 'United States', terminology: [], note: 'Mostly imported/travel cases — the lesson is the travel history; laboratory confirmation before therapy per guidance.' },
    ],
    sources: [
      whoRef('WHO — malaria guidelines and global programme framing'),
      cdcRef('CDC — malaria diagnosis and species identification education'),
      ncbiRef('Malaria biology and treatment review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'high',
    verifyNote: 'Treatment choices and severe-malaria protocols are guideline-driven and region-specific — verify current WHO/national guidance.',
  },

  // ── Topic: microbiology-hiv ──────────────────────────────────────────────────
  {
    id: 'c2-microbiology-hiv',
    name: 'HIV: Retrovirus Biology & the Testing Timeline',
    kind: 'disease',
    oneLiner:
      'HIV is a retrovirus that copies its RNA into DNA, inserts it into the host genome, and progressively destroys CD4 T-cells — with the modern testing story (antigen-antibody combos, window periods) and ART suppressing it to undetectable levels.',
    whyMatters:
      'Testing logic is where HIV education matters most: window-period honesty determines counselling, post-exposure decisions and blood-safety practice. CD4 thresholds organise opportunistic-infection teaching, and U=U has become a public-health message every clinician should understand.',
    explain30s:
      'BIOLOGY: HIV carries RNA + reverse transcriptase → makes DNA → integrates into the host chromosome (provirus — permanent) → produces new virions, budding from CD4 T-helper cells; destruction of these "generals" of adaptive immunity is the disease. TRANSMISSION: sexual, blood, mother-to-child (intrapartum/breastfeeding contexts) — no casual spread. TESTING TIMELINE (the heart of this lesson): NAT (viral RNA) earliest (~10–33 days window, assay-dependent); 4th-generation lab antigen+antibody combos next (~18–45 days); antibody-only rapid tests last (~23–90 days). During the WINDOW PERIOD the person is infected and infectious but tests negative — the honesty fact that drives repeat testing and PEP logic. DISEASE COURSE: acute retroviral syndrome (mononucleosis-like) → clinical latency (years) → without therapy, CD4 falls → opportunistic infections by threshold (the classic teaching marker: PCP risk below CD4 ~200 cells/µL). TREATMENT: combination ART (≥3 drugs, usually 2 NRTIs + integrase inhibitor) suppresses viral load; adherence is the whole game; U=U — sustained undetectable viral load means no sexual transmission.',
    eli5:
      'HIV is a thief with a photocopier that works backwards: most machines copy DNA→RNA; this one copies its RNA→DNA and pastes the copy into your own library (your genome) — that is why the infection is permanent. It specialises in kidnapping your army generals (CD4 cells), so lower and lower, your immune defences fall apart and ordinary germs become deadly. The testing story is about the thief’s trail: its photocopier parts (a protein called p24) appear first, antibodies appear later. A combo test that looks for BOTH finds it sooner. The awkward gap — infected but not yet test-positive — is the window period: like a pregnancy test before a missed period. Modern medicines pin the thief down so completely that tests cannot even find copies of it — and a person with "undetectable" virus does not pass it on sexually (U=U).',
    firstPrinciples: [
      'Retrovirus logic: RNA → reverse transcriptase → DNA → integrase → provirus → transcription. Each enzyme is a drug target (reverse transcriptase, integrase, protease) — the ART classes map one-to-one onto lifecycle steps.',
      'CD4 tropism explains the disease: gp120 binds CD4 (+coreceptors) → helper-T depletion → the specific vulnerability ladder of opportunistic infections as counts fall.',
      'Window period is a test-property, not a person-property: NAT ~10–33 days, 4th-gen Ag/Ab lab assays ~18–45 days, antibody-only ~23–90 days (CDC-published ranges; exact values vary by assay — verify locally). Infected persons are infectious during the window — the fact behind repeat testing at interval and PEP.',
      'The modern testing algorithm: 4th-generation combo (p24 antigen + antibody) → differentiation immunoassay → NAT to resolve acute/false-positive results — screening designed to catch earliest infection while remaining specific.',
      'CD4 thresholds organise the opportunistic-infection syllabus (teaching markers): PCP prophylaxis below ~200 cells/µL is the classic; earlier threats (oral candidiasis, TB at any count) and later ones (CMV, MAC, toxoplasmosis) build the ladder.',
      'ART principles: combination (prevents resistance), lifelong, adherence-dependent; viral-load monitoring defines success; U=U (sustained undetectable → no sexual transmission) is evidence-based public-health teaching.',
      'Prevention stack: condoms, ART-as-prevention, PrEP for high-risk groups, PEP within 72 h of significant exposure (the earlier the better), mother-to-child prevention bundles, and universal blood-safety screening.',
    ],
    numbers: [
      { label: 'Window period (NAT)', value: 'About 10–33 days (assay-dependent)', note: 'Detects viral RNA earliest — the blood-safety test.' },
      { label: 'Window period (4th-gen Ag/Ab lab test)', value: 'About 18–45 days', note: 'The standard screening assay — antigen catches the early phase.' },
      { label: 'Window period (antibody-only rapid)', value: 'About 23–90 days', note: 'Latest to turn positive — explains interval retesting advice.' },
      { label: 'PCP prophylaxis threshold', value: 'CD4 < 200 cells/µL (classic teaching marker)', note: 'The canonical CD4 cut-off organising opportunistic-infection teaching.' },
      { label: 'PEP clock', value: 'Within 72 hours of significant exposure', note: 'The sooner the better — protocol-driven regimen and duration; verify locally.' },
    ],
    diagnosis: [
      'Screening: 4th-generation lab Ag/Ab combo as the modern default; rapid antibody tests where point-of-care is needed.',
      'Confirmatory: differentiation assay or NAT for indeterminate/acute results — never disclose on a single rapid test alone.',
      'Once diagnosed: baseline CD4, viral load, and resistance/strategy planning with specialist services.',
      'Acute retroviral syndrome (fever, rash, sore throat, lymphadenopathy after exposure) — think NAT, not antibody alone.',
    ],
    mistakes: [
      'Counselling a "no risk" verdict from a same-week antibody test — the window period exists; the honest answer is repeat testing per protocol.',
      'Reversing the test hierarchy — antibody-only rapid tests are the LATEST positives, not the earliest.',
      'Saying "HIV positive = AIDS" — AIDS is the late stage defined by immunosuppression; modern ART keeps most people far from it.',
      'Confusing undetectable with cured — the provirus persists; suppression, not eradication, is the achievement.',
    ],
    analogies: [
      'Backwards photocopier pasting into your own library — retroviral integration in one picture.',
      'Window period as a pregnancy test before the missed period — infected-but-negative, the counselling-critical image.',
      'CD4 cells as army generals: lose them slowly and enemy germs you always carried quietly start winning.',
    ],
    examRelevance:
      'Window-period ordering (NAT < 4th-gen < Ab-only), 4th-gen assay logic, CD4-threshold infection matching, PEP timing, ART class→lifecycle-step matching, and U=U interpretation are the standard question shapes.',
    clinicalRelevance:
      'Post-exposure counselling after needlestick or assault, blood-bank screening literacy, pregnancy planning in HIV care, and interpreting "undetectable" for patients and families are the daily clinical uses.',
    teachDeeper: [
      'ART class mechanics: NRTIs/nucleoside chain termination, integrase strand transfer inhibition, protease inhibitors — lifecycle logic into pharmacology.',
      'TB-HIV co-infection logic (immunodepression ↔ more active disease; drug-interaction complexities at naming level).',
      'Mother-to-child prevention bundles — antenatal testing and prophylaxis principles.',
      'Resistance testing and switched regimens — why adherence monitoring precedes drug changes.',
    ],
    crossLinks: [
      { conceptId: 'c-tb', label: 'Tuberculosis (this pack)', why: 'The classic co-infection: HIV multiplies TB progression risk and reshapes its diagnosis.' },
      { conceptId: 'c2-microbiology-hbv-serology', label: 'Hepatitis B Serology (this pack)', why: 'Shared transmission routes make HBV/HIV co-screening logic a pair.' },
      { conceptId: 'c2-pharmacology-kinetics', label: 'Pharmacokinetics (this pack)', why: 'Lifelong combination ART is a pharmacokinetics-and-adherence story.' },
    ],
    global: [
      { region: 'India', terminology: ['ICTC — Integrated Counselling and Testing Centres'], note: 'India’s testing network organises counselling-led screening; this lesson names the structure without reproducing algorithm details.' },
      { region: 'WHO/Global', terminology: [], note: 'WHO promotes treat-all policies and U=U messaging; national testing algorithms differ — verify local versions.' },
      { region: 'United States', terminology: [], note: 'CDC-published window-period ranges (quoted here) anchor US testing education.' },
      { region: 'United Kingdom', terminology: [], note: 'UK guidance emphasises same-day testing and rapid retest intervals — the counselling framing differs, the science does not.' },
    ],
    sources: [
      cdcRef('CDC — HIV testing window-period and algorithm education'),
      whoRef('WHO — HIV testing, treatment and U=U framing'),
      ncbiRef('HIV biology and ART review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Testing algorithms, window-period assay ranges and PEP regimens vary by country and update cycle — verify current local guidance.',
  },

  // ── Topic: t-micro-hep (FLAGSHIP) ───────────────────────────────────────────
  {
    id: 'c2-microbiology-hbv-serology',
    name: 'Hepatitis B Serology: Reading the Table Like a Story',
    kind: 'investigation',
    oneLiner:
      'Hepatitis B serology is a timeline, not a list — three antigens (HBsAg, HBeAg, HBcAg) and their antibodies appear in a fixed order that lets you name any patient’s state: acute, recovered, chronic, vaccinated, or in the "window".',
    whyMatters:
      'The HBV serology table is asked in every exam from second MBBS to superspeciality, because it is pure logic — and clinically it decides real sentences: is this patient infectious? vaccinated? chronically infected? The vaccinated-vs-infected discriminator (anti-HBc) is the single most reused logic in the table.',
    explain30s:
      'The cast: HBsAg (SURFACE antigen — the outer coat; first to appear, its persistence >6 months defines CHRONIC infection); HBeAg (a replication marker — "e = export/active replication", high infectivity); HBcAg (CORE antigen — never detectable free in serum, only as antibody); anti-HBs (antibody to surface — IMMUNITY: after vaccination or recovery); anti-HBc IgM (recent infection) vs IgG (past exposure, persists for life); anti-HBe (replication winding down). The story in order: incubation → HBsAg rises → HBeAg (infectivity peak) → symptoms/ALT spike → window period (HBsAg cleared, anti-HBs not yet risen — the ONLY marker is anti-HBc IgM) → recovery (anti-HBs + anti-HBc IgG). VACCINATED: anti-HBs alone (no anti-HBc — the vaccine contains surface antigen only). CHRONIC: HBsAg >6 months ± HBeAg, IgG anti-HBc, no anti-HBs. Resolved: anti-HBs + anti-HBc IgG together.',
    eli5:
      'Think of the virus as a caramel sweet: the wrapper (HBsAg), the sticky filling that shows the factory is still running (HBeAg), and the inside core (HBcAg) you never see loose — only its crumpled wrappers (anti-HBc antibodies). The story goes: wrappers appear first (HBsAg) → filling appears (HBeAg — very contagious now) → your body fights, you feel ill → wrappers are cleared but your body hasn’t yet made anti-wrapper antibodies — a quiet "window" where the only clue is the fresh core-wrapper antibody (anti-HBc IgM) → then you make anti-wrapper-of-the-sweet (anti-HBs) and you’re immune forever. The vaccine is just empty wrappers — you make anti-HBs but have NEVER met the core, so anti-HBc stays negative. That one fact separates "vaccinated" from "recovered infection" in every exam ever written.',
    firstPrinciples: [
      'Three antigens, three antibodies, one timeline: HBsAg (earliest, chronicity clock), HBeAg (replication/infectivity), HBcAg (invisible free — antibody only). Learn the order of appearance and the rest of the table derives itself.',
      'Window-period logic: after HBsAg clears but before anti-HBs rises, all routine "surface" tests may be negative — the only positive marker is anti-HBc IgM. The exam’s favourite hidden-state question.',
      'The vaccinated-vs-infected discriminator: the vaccine contains HBsAg ONLY → vaccinated = anti-HBs positive, anti-HBc NEGATIVE. Any real exposure leaves anti-HBc IgG for life → recovered infection = anti-HBs + anti-HBc both positive. This one line answers half the table.',
      'Chronicity clock: HBsAg persistence beyond 6 months = chronic infection (perinatal-acquired infection carries the highest chronicity risk — the immunology of neonatal tolerance, taught qualitatively).',
      'HBeAg semantics: positive = active replication, high infectivity (the "e" generation of teaching); its clearance with anti-HBe = lower-replication state (HBeAg-negative chronic hepatitis exists — variants matter).',
      'Acute severity markers are lab-side (ALT spikes, bilirubin), not serology-side; serology states the EPISODE, biochemistry states its heat. Coinfection/superinfection with hepatitis D rides on HBsAg — the delta logic.',
      'Prevention completes the story: the vaccine (surface-antigen recombinant), birth-dose vaccination programmes, and blood-screening HBsAg — population logic (ties to the immunisation lesson).',
    ],
    numbers: [
      { label: 'Chronicity definition', value: 'HBsAg persistence > 6 months', note: 'The single clock that converts acute into chronic infection.' },
      { label: 'Window-period marker', value: 'Anti-HBc IgM alone', note: 'The only positive test between HBsAg clearance and anti-HBs appearance.' },
      { label: 'Vaccination signature', value: 'Anti-HBs positive · anti-HBc negative', note: 'Surface-antigen-only exposure — the discriminator line.' },
      { label: 'Infectivity marker', value: 'HBeAg (± HBV DNA quantification in modern practice)', note: '"e" = actively exporting virions; DNA assays quantify what HBeAg signals.' },
    ],
    diagnosis: [
      'Acute hepatitis panel in the jaundiced patient: HBsAg, anti-HBc IgM, ± HAV IgM, anti-HCV — the standard first screen.',
      'Chronic-carrier monitoring: HBsAg, HBeAg/anti-HBe, HBV DNA quantification, ALT trends, and hepatocellular-carcinoma surveillance logic (ties to the cirrhosis lesson).',
      'Vaccination follow-up: anti-HBs titre where occupational exposure demands documentation.',
      'D coinfection: anti-HDV where HBsAg carriers deteriorate unexpectedly.',
    ],
    mnemonics: [
      { hook: 's = Surface = Sweet wrapper', expands: 'HBsAg is the outer coat — first to appear; its antibody (anti-HBs) is the immunity mark; the vaccine is made of wrappers only.' },
      { hook: 'e = Exporting = infectious', expands: 'HBeAg signals active replication and high infectivity; anti-HBe marks the winding-down.' },
      { hook: 'c = Core = never loose', expands: 'HBcAg is never free in serum — you only ever see anti-HBc; IgM = fresh, IgG = forever.' },
      { hook: 'Window = only the IgM knocks', expands: 'In the window period, anti-HBc IgM is the sole positive marker.' },
    ],
    mistakes: [
      'Claiming vaccinated people have anti-HBc — they never met the core; anti-HBs alone is the vaccination signature.',
      'Calling the window period "HBsAg-negative = uninfected" — the IgM anti-HBc is still there.',
      'Using anti-HBc IgG as an "acute" marker — IgG means past exposure (it persists for life).',
      'Forgetting HBV DNA in modern practice — serology signals replication; DNA quantifies it.',
    ],
    analogies: [
      'Caramel sweet with wrapper, filling and hidden core (above) — the entire table in one candy.',
      'The window period as the gap between two trains: the antigen train has left the station, the antibody train has not yet arrived — only the IgM porter remains on the platform.',
    ],
    examRelevance:
      'Pattern-recognition tables (which markers for chronic carrier? for the window? for the vaccinated infant?), the vaccinated-vs-recovered discriminator, HBeAg infectivity logic, and HBsAg-6-month chronicity are the perennial formats — asked across microbiology, medicine and paediatrics.',
    clinicalRelevance:
      'Antenatal HBsAg screening, blood-donor deferral logic, occupational needlestick counselling (donor’s markers → recipient’s plan), and chronic-carrier surveillance all run on this table.',
    teachDeeper: [
      'HBeAg-negative chronic hepatitis and precore mutants — why "e-negative" is not automatically benign.',
      'Hepatitis D (delta) biology — the defective virus that needs HBsAg to travel.',
      'Occult HBV infection (DNA-positive, HBsAg-negative) — the blood-banking edge case.',
      'Treatment endpoints at principle level: seroconversion, DNA suppression, surface-antigen loss (specialist territory).',
    ],
    crossLinks: [
      { conceptId: 'c2-pathology-cirrhosis', label: 'Cirrhosis & Portal Hypertension (this pack)', why: 'Chronic HBV is a leading cirrhosis/HCC cause — the serology table is the cirrhosis-prevention front door.' },
      { conceptId: 'c2-microbiology-hiv', label: 'HIV (this pack)', why: 'Shared routes, shared screening logic — co-infection changes management at every step.' },
      { conceptId: 'c-vaccines', label: 'Immunisation & National Programmes (Community Medicine)', why: 'Birth-dose HBV vaccination and blood screening are the population half of this table.' },
    ],
    sources: [
      cdcRef('CDC — hepatitis B serology teaching materials'),
      whoRef('WHO — hepatitis B prevention and testing framing'),
      ncbiRef('HBV serology and natural-history review literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: microbiology-sepsis ───────────────────────────────────────────────
  {
    id: 'c2-microbiology-sepsis',
    name: 'Sepsis: Definitions with Real Cutoffs',
    kind: 'syndrome',
    oneLiner:
      'Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection — recognised with bedside cutoffs (SIRS, qSOFA, SOFA, lactate) that convert a vague feeling of "this patient looks toxic" into numbers.',
    whyMatters:
      'Sepsis kills more hospitalised patients than most single diseases, and every specialty exam and every ward round uses its vocabulary. The definitions changed (SIRS → Sepsis-3), so knowing WHICH cutoff does WHAT is exactly the kind of precise logic exams reward and patients need.',
    explain30s:
      'DEFINITION (Sepsis-3): infection + dysregulated response → organ dysfunction; clinically ≈ suspected infection + rise in the SOFA organ score (respiration, coagulation, liver, MAP, CNS, renal). SEPTIC SHOCK: vasopressor-needed hypotension + lactate >2 mmol/L despite fluids. The OLDER SIRS criteria (2 of 4: temperature >38 or <36 °C; heart rate >90; respiratory rate >20; WBC >12,000 or <4,000 or >10% bands) survive as an infection-flagging tool — sensitive, non-specific. qSOFA (2 of 3: respiratory rate ≥22/min; systolic BP ≤100 mmHg; altered mentation) is the bedside "escalate now" trigger. LACTATE: ≥2 mmol/L flags hypoperfusion, ≥4 marks severe hypoperfusion in classic teaching. RECOGNITION FEEDS ACTION: the hour-1 bundle — measure lactate, blood cultures BEFORE antibiotics, broad-spectrum antibiotics, fluids for hypoperfusion, vasopressors if persistently hypotensive — principles ordered by clock.',
    eli5:
      'An infection is invaders in one room. Sepsis is when the whole building’s fire alarm overreacts — sprinklers flood every floor (organs start failing far from the infection). The numbers are the alarm panel: qSOFA asks three quick questions — breathing fast? (≥22 per minute) blood pressure low-ish? (≤100 systolic) confused? — two yeses means treat it as an emergency now. SIRS is the older four-switch panel (temperature, heart rate, breathing, white-cell count). Lactate is the smoke detector of cell suffocation — cells gasping without oxygen dump lactate into blood; the higher it climbs, the worse the flood. And the treatment is a relay race run on a clock: cultures first (a quick snapshot), antibiotics immediately after, fluids, then pressure-supporting drugs — each minute of delay matters.',
    firstPrinciples: [
      'Sepsis-3 framing: it is a RESPONSE disorder, not a germ property — same organism, different hosts, different outcomes. Organ dysfunction (SOFA rise) is what makes infection septic.',
      'SIRS is physiology, not diagnosis: fever/tachycardia/tachypnoea/leukocytosis are the body’s alarm — 2 of 4 flags POSSIBLE infection (sensitive, non-specific: burns, pancreatitis, trauma also light it up).',
      'qSOFA is the triage tool: 2 of 3 (RR ≥22/min, SBP ≤100 mmHg, altered mentation) at the bedside says "escalate, this infected patient may be deteriorating" — no labs needed, which is its whole point.',
      'SOFA is the organ ledger: PaO₂/FiO₂, platelets, bilirubin, MAP/vasopressors, Glasgow coma scale, creatinine — a rise ≥2 from baseline defines the septic physiologically.',
      'Lactate is hypoperfusion chemistry: anaerobic metabolism dumps lactate; ≥2 mmol/L flags concern, ≥4 marks severe hypoperfusion in the classic teaching — clearance trends track resuscitation.',
      'Septic shock (Sepsis-3): vasopressor requirement to keep MAP ≥65 mmHg + lactate >2 despite adequate fluids — the mortality-heavy tip of the spectrum.',
      'Recognition feeds the hour-1 bundle (principles, verify locally): lactate measured; blood cultures before antibiotics (when not delaying); broad-spectrum antibiotics promptly; 30 mL/kg-style balanced crystalloid for hypoperfusion per protocol; vasopressors (noradrenaline-first logic) for refractory hypotension. Source control (drain the abscess, remove the line) is the surgical half.',
    ],
    numbers: [
      { label: 'qSOFA', value: 'RR ≥22/min · SBP ≤100 mmHg · altered mentation (2 of 3)', note: 'The bedside escalation trigger — the most-quoted modern sepsis cutoff.' },
      { label: 'SIRS', value: 'T >38 or <36 °C · HR >90 · RR >20 · WBC >12k/<4k/>10% bands (2 of 4)', note: 'The older, sensitive screen — still taught and still used for flagging.' },
      { label: 'Lactate', value: '≥2 mmol/L flagged · ≥4 severe (classic teaching)', note: 'Hypoperfusion chemistry — trend matters more than one value.' },
      { label: 'Septic shock (Sepsis-3)', value: 'Vasopressor need + lactate >2 mmol/L after fluids', note: 'The formal definition of the shock end of the spectrum.' },
    ],
    presentation: [
      'The "worst-looking infected patient" pattern: fever or hypothermia, tachycardia, tachypnoea, confusion, hypotension, oliguria.',
      'Source clues: burning urine, cough with purulent sputum, abdominal pain, cellulitis, line-site infection, recent surgery.',
      'Cold vs warm shock physiology (teaching): mottled/clamped periphery vs flushed vasodilated shock — both are sepsis.',
      'Elderly and immunosuppressed patients may show only confusion or low temperature — absence of fever never rules out sepsis.',
    ],
    diagnosis: [
      'Recognise: infection suspicion + qSOFA/SIRS flags + organ dysfunction (creatinine, bilirubin, platelets, lactate, mentation).',
      'Identify source: cultures (blood ± site), imaging for collection, urine/chest as history directs.',
      'Grade: lactate, SOFA components, mental status — the severity ledger.',
      'Reassess on the clock: repeat lactate and pressures guide whether fluids/vasopressors are working (protocol-driven).',
    ],
    mistakes: [
      'Using SIRS as a diagnosis instead of a flag — specificity is poor; the SOFA/qSOFA frame is the modern logic.',
      'Waiting for culture results before antibiotics — cultures first ONLY when they do not delay drugs; the clock outranks the sample.',
      'Forgetting source control — antibiotics cannot drain an abscess or fix an infected line.',
      'Anchoring on fever — hypothermic, confused elderly patients are classic septic presentations.',
    ],
    analogies: [
      'Fire alarm flooding every floor (above) — the response, not the fire, does the damage.',
      'qSOFA as the lift-door triage: three questions you can answer before any lab returns.',
      'Lactate as a smoke detector of cell suffocation — it rises with the flood and falls when you drain it.',
    ],
    examRelevance:
      'Cutoff-recall (qSOFA components, SIRS criteria, lactate marks), definition discrimination (Sepsis-3 vs septic shock), bundle-ordering questions, and "which parameter shows hypoperfusion?" — the highest-frequency microbiology-critical-care crossover in exams.',
    clinicalRelevance:
      'Every emergency department uses these numbers on shift one; knowing which cutoff triggers escalation, and that cultures precede antibiotics only when they cost no time, is the difference between a bystander and a useful junior.',
    teachDeeper: [
      'Immunopathology: DAMP/PAMP storm, endothelial leak, distributive-shock haemodynamics — the mechanism behind the flood.',
      'SOFA scoring mechanics and baseline-vs-acute logic.',
      'Vasopressor physiology: noradrenaline-first logic and MAP targets (specialist depth).',
      'Post-sepsis syndrome and the rehabilitation question — the long tail.',
    ],
    crossLinks: [
      { conceptId: 'c-inflamm', label: 'Acute Inflammation (this pack)', why: 'Sepsis is inflammation unmoored — the mediator story at systemic scale.' },
      { conceptId: 'c2-pharmacology-antibiotics', label: 'Antibiotics by Mechanism (this pack)', why: 'The hour-1 broad-spectrum choice is drawer logic under a clock.' },
      { conceptId: 'c2-microbiology-gram-stain', label: 'Gram Staining (this pack)', why: 'The first smear narrows the antibiotic drawer within the same hour.' },
    ],
    sources: [
      ncbiRef('Sepsis-3 definitions and qSOFA literature (PubMed Central indexing)'),
      cdcRef('CDC — sepsis recognition and prevention education'),
      niceRef('NICE — sepsis recognition, diagnosis and early management framing'),
      whoRef('WHO — sepsis as a global health priority framing'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Definitions, cutoffs and the hour-1 bundle are guideline-driven and periodically updated — verify the current resuscitation/sepsis guidance in your setting.',
  },
]

// ════════════════════════════════════════════════════════════════════════════
// LESSONS — FORENSIC MEDICINE & TOXICOLOGY (2)
// ════════════════════════════════════════════════════════════════════════════

const fmtLessons: ConceptLesson[] = [
  // ── Topic: fmt-thanatology ──────────────────────────────────────────────────
  {
    id: 'c2-fmt-postmortem-changes',
    name: 'Death & Post-mortem Changes: The Body’s Timetable',
    kind: 'process',
    oneLiner:
      'After death the body cools, patches purple (livor), stiffens then relaxes (rigor) and finally decomposes — each change on a rough timetable that forensic medicine uses, honestly and cautiously, to estimate time since death.',
    whyMatters:
      'Post-mortem changes are the alphabet of thanatology: they tell investigators whether a body has been moved, when death likely occurred, and which findings are death itself versus disease or injury. Exams ask the timelines; courts ask the same questions with higher stakes.',
    explain30s:
      'ALGOR MORTIS (cooling): the body falls toward ambient temperature — the classic teaching rule of thumb is roughly 1–1.5 °C per hour in the early hours, but climate, clothing, body size and water immersion rewrite it, so it is a range, never a clock. LIVOR MORTIS (lividity): blood settles by gravity into dependent skin as blanchable purple patches within about 20–30 minutes to 2 hours, becoming FIXED (no longer blanches/shifts) at roughly 8–12 hours — fixed livor in the WRONG position means the body was moved. RIGOR MORTIS: ATP depletion makes muscles stiffen — begins around 2–4 hours (small muscles first), fully established by roughly 12 hours, persists and then passes as muscle proteins degrade by about 24–48 hours; it disappears in the same order it appeared. Heat shortens all three timelines; cold stretches them. DECOMPOSITION follows: green discolouration of the abdomen, marbling of vessels, bloating from bacterial gas, skin slippage — heavily climate-dependent (fast in tropical heat). Cadaveric spasm (instant rigor at death, e.g. gripped objects) is the special exception. Time-since-death is always a combined estimate: cooling + livor + rigor + stomach contents + scene evidence — never one sign alone.',
    eli5:
      'A body after death is like a house switching off. The heating turns off and the house cools (algor). Water — here, blood — runs downhill and pools on the floor (livor: purple patches on the side that touches the ground; press them early and they blanch, like pressing a carpet, but after hours the stain sets like spilled ink). The springs of the doors seize up (rigor: first the small springs, then all of them, then they rust back loose in the same order). Then the house starts to rot: green stains, swelling with gas, peeling paint (decomposition). A detective reads all the dials together — temperature, stains, stiffness — because hot summers fast-forward every dial and cold winters pause them.',
    firstPrinciples: [
      'Death is declared, then read: somatic death (absent consciousness/respiration/circulation) precedes cellular death; certification requires the legal framework of the jurisdiction — the forensic lesson starts with definition, not decay.',
      'Cooling (algor) is physics: Newtonian cooling toward ambient — the 1–1.5 °C/hour early rule is a teaching rule of thumb; obesity, clothing, still air, water submersion and climate each bend the curve. Honest practice reports a range.',
      'Livor (hypostasis) is gravity: venular pooling in dependent skin; BLANCHABLE early (pressure moves the blood) → FIXED by roughly 8–12 h. Its distribution documents posture — mismatch between livor and the scene’s position is evidence of movement.',
      'Rigor is chemistry: ATP runs out, actin–myosin cross-bridges cannot detach → stiffness; onset ~2–4 h, full ~12 h, resolution ~24–48 h (order: face/neck → trunk → limbs; leaves in the same order). Heat accelerates; cold delays. Cadaveric spasm — instantaneous rigor without a preceding flaccid phase — is the famous exception (clenched weapon/weed in the hand).',
      'Decomposition is bacterial succession: endogenous gut flora migrate, haemoglobin stains vessels (marbling), protein fermentation makes gas (bloating), skin epidermis sloughs. Timelines are climate-dominated — a tropical afternoon is weeks of temperate decay.',
      'Putrefaction vs mummification vs adipocere: hot-humid → rapid putrefaction; dry heat → mummification (skin leathery, features preserved); wet, fatty graves → adipocere (waxy saponified tissue). Environment chooses the preservation mode.',
      'The synthesis rule: no single change dates death. The estimate combines algor + livor + rigor + decomposition stage + stomach contents + vitreous chemistry + scene/context — and is always reported as an interval, never an instant.',
    ],
    numbers: [
      { label: 'Cooling rate (rule of thumb)', value: 'About 1–1.5 °C per hour early, slowing toward ambient', note: 'A teaching average, not a measurement — climate and context bend it heavily.' },
      { label: 'Livor onset → fixation', value: 'Visible ~20–30 min; fixed ~8–12 h', note: 'Fixed livor in a non-scene position = body was moved.' },
      { label: 'Rigor timeline', value: 'Onset ~2–4 h · full ~12 h · passes ~24–48 h', note: 'Small muscles first; leaves in the order it arrived; heat speeds, cold slows.' },
    ],
    mistakes: [
      'Quoting a single time of death from one sign — every textbook and examiner punishes the overconfident estimate; intervals only.',
      'Ignoring environment: a 1–1.5 °C/h rule read in a tropical heatwave or icy river is fiction; context first.',
      'Treating fixed livor as proof of position at death — it proves position during the hours of fixation, which is exactly why "moved body" questions use it.',
      'Confusing cadaveric spasm with rigor mortis — spasm is instantaneous at death and forensically loaded (gripped objects).',
    ],
    analogies: [
      'The switched-off house (above): heating off (algor), water pooling (livor), door springs seizing and rusting loose (rigor), then rot (decomposition).',
      'Time-since-death as a weather forecast, not a stopwatch: several instruments, one honest range.',
    ],
    examRelevance:
      'Timeline recall (rigor/livor/algor classic hours), moved-body reasoning with fixed livor, cadaveric-spasm exceptions, and putrefaction-vs-mummification-vs-adipocere matching are the standard FMT question shapes.',
    clinicalRelevance:
      'Doctors certify death and often the first responder to the scene; knowing which changes are expected biology versus pathology (and documenting what one saw, with times) protects patients, families and the doctor.',
    teachDeeper: [
      'Vitreous humour potassium as a biochemical clock (awareness level).',
      'Stomach-emptying logic and its honest limits in death-time estimation.',
      'Entomology (insect succession) — the specialist clock in advanced decomposition.',
      'Cause–manner–mechanism of death framing: how thanatology feeds death certification.',
    ],
    crossLinks: [
      { conceptId: 'c2-pathology-cell-injury', label: 'Cell Injury & Necrosis (this pack)', why: 'Autolysis after death is cell injury’s post-mortem twin — enzymes finish what ischaemia started.' },
      { conceptId: 'c2-fmt-wound-types', label: 'Wound Types (this pack)', why: 'Reading wounds and reading decay are the two alphabets of the post-mortem examination.' },
    ],
    sources: [
      whoRef('WHO — medical certification of cause of death framing'),
      ncbiRef('Forensic post-mortem change literature (PubMed Central indexing)'),
      nmcRef('CBME forensic-medicine competency reference'),
    ],
    evidenceLevel: 'widely-taught',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Timelines are teaching averages; medico-legal time-of-death estimation is always an interval and jurisdiction practice varies — verify local protocols.',
  },

  // ── Topic: fmt-wounds ───────────────────────────────────────────────────────
  {
    id: 'c2-fmt-wound-types',
    name: 'Mechanical Wounds: Reading the Injury Like a Sentence',
    kind: 'sign',
    oneLiner:
      'Each wound type — abrasion, bruise, laceration, incised, stab, firearm — is a sentence written by force on tissue: the weapon’s shape, the direction of force and whether the victim was alive are all readable from the margins, bridging and pattern.',
    whyMatters:
      'Wound interpretation answers the three questions courts ask: what weapon, what direction/force, and inflicted before or after death. It is FMT’s most examined table — and its logic (margins, bridging, depth-vs-width) is pure morphology any student can learn.',
    explain30s:
      'ABRASION: superficial epidermal scrape from blunt friction — oozing capillary bleeding points, follows the force’s direction, and is a reliable VITAL reaction (implies the skin was alive when injured). BRUISE/CONTUSION: blunt force ruptures vessels under intact skin — swelling, discolouration; colour-change timing is unreliable for dating. LACERATION: blunt tearing/splitting — irregular, crushed, bruised margins with TISSUE BRIDGING (vessels/nerves span the gap) and marginal abrasions. INCISED WOUND: sharp edge drawn across skin — clean margins, longer than deep, NO bridging, profuse bleeding. STAB WOUND: sharp point driven in — DEPTH greater than width; depth estimates blade; sometimes the classic hilt bruise. FIREARM: entry vs exit logic — entry often smaller with an abrasion collar/ring; exit larger/torn (teaching generalisations, range-dependent); range-of-fire signs (soot, tattooing) at close range. The master question: VITAL vs POST-MORTEM injury — bleeding into tissues and inflammatory response prove the person was alive (vital reaction); absent reaction suggests post-mortem infliction.',
    eli5:
      'Wounds are handwriting. A scrape (abrasion) is a pencil smudge — surface-only, tells you the direction of the drag. A bruise is a leaky pen under the paper — ink spreads under the skin, and you cannot tell exactly when the pen leaked by its colour. A torn paper edge (laceration) is ragged, with fibres still connecting the torn bits — blunt force tears. A razor cut (incised) slices the paper cleanly — no connecting fibres, edges neat, and it bleeds a lot. A stab is a hole deeper than it is wide — it tells you about the blade’s length, not its shine. A bullet writes twice — a neat, often smaller entry and a messier, usually larger exit. And the court’s question — "was the person alive?" — is answered by ink: living tissue bleeds and swells into the wound; dead tissue does not.',
    firstPrinciples: [
      'Force–tissue grammar: blunt force → abrasions, bruises, lacerations; sharp force → incised and stab wounds; special force → firearm and chop wounds. Naming the force is step one of every description.',
      'The bridging discriminator: LACERATION has tissue bridging (resilient vessels/nerves span the torn gap) + crushed margins; INCISED wounds have clean-cut margins and NO bridging. One look settles blunt vs sharp in the classic vignette.',
      'Incised vs stab is geometry: incised = length > depth (sliding blade); stab = depth > width (thrust blade). Depth estimates blade length — the court’s arithmetic.',
      'Abrasion directionality: epidermal tags/drying pattern indicate the direction of force — scrape toward where the tags point (teaching convention). Abrasions are dependable vital-reaction markers.',
      'Bruise honesty: shape approximates the object (tramline bruising from rod/pipe edges is the classic), but AGEING A BRUISE BY COLOUR IS UNRELIABLE — the modern teaching point; document, do not date.',
      'Firearm logic is range-and-entry/exit: close range leaves soot/tattooing; entry wounds are typically smaller with an abrasion ring, exits typically larger and torn — generalisations with documented exceptions; report findings, not certainties.',
      'Vital reaction is the master key: haemorrhage into tissue, inflammatory changes and repair signs = inflicted in life. Post-mortem wounds are pale, gaping without soaked margins and reactionless — the courtroom-critical distinction.',
    ],
    presentation: [
      'Abrasion: parchment-dry, surface scrape, bleeding points — often the first sign on resuscitated patients (intubation/defibrillator marks — know them, do not over-read).',
      'Bruise: swollen, discoloured, tender — tramline patterns and grip-pattern bruises carry interpretation weight.',
      'Laceration: gaping, ragged, crushed, hair/plaques of bridging tissue across the wound bed.',
      'Incised: clean parallel margins, spindle shape, heavy external bleeding; self-inflicted hesitation marks are the classic context finding (teaching).',
      'Stab: elliptical or slit defect, depth > width; wound-angle geometry maps the blade’s orientation.',
      'Firearm: abrasion collar, soot/tattooing at close range, entry–exit size logic, x-ray for projectiles.',
    ],
    diagnosis: [
      'Describe before you interpret: site, size, shape, margins, direction, depth, contents — the seven-line wound certificate.',
      'Classify force (blunt/sharp/firearm) by margins and bridging.',
      'Assess vitality: tissue bleeding/inflammation vs none.',
      'Correlate with the scene and history — a wound is one sentence in a larger paragraph; the forensic report is the paragraph.',
    ],
    mistakes: [
      'Dating a bruise by colour confidently — the literature and examiners agree it is unreliable; describe, do not date.',
      'Calling every ragged wound a laceration — incised wounds over bony edges can gape raggedly; bridging decides.',
      'Reversing entry/exit logic absolutely — exit wounds are usually larger but exceptions exist; report, qualify, verify.',
      'Forgetting iatrogenic marks (IV lines, chest tubes, defibrillator pads) in the resuscitated patient — the honest report lists them.',
    ],
    analogies: [
      'Wounds as handwriting (above): smudge, leaky pen, torn paper, clean slice, drilled hole, two bullet letters.',
      'Bridging as scaffolding: torn fabric leaves threads across the gap; a scissor cut leaves none.',
    ],
    examRelevance:
      'Margin/bridging discrimination (laceration vs incised), geometry (incised vs stab), vital-reaction logic, firearm range signs, and "which wound implies movement/ direction of force?" are the perennial FMT formats.',
    clinicalRelevance:
      'Every emergency clinician documents wounds; knowing the vocabulary of margins, direction and vitality turns a chart into evidence — and protects patients in abuse, assault and self-harm contexts.',
    teachDeeper: [
      'Chop wounds (heavy sharp force) and defence wounds — pattern logic at the extremes.',
      'Wound-age histology at awareness level: neutrophil influx timelines and their limits.',
      'Firearm ballistics teaching: range categories and intermediate targets.',
      'Documentation standards and the medico-legal case sheet — how FMT writing actually works.',
    ],
    crossLinks: [
      { conceptId: 'c2-fmt-postmortem-changes', label: 'Post-mortem Changes (this pack)', why: 'Vital reaction vs post-mortem injury is the bridge between wound reading and decay reading.' },
      { conceptId: 'c2-pathology-cell-injury', label: 'Cell Injury & Inflammation (this pack)', why: 'The vital reaction IS acute inflammation — FMT borrows general pathology’s grammar.' },
    ],
    sources: [
      ncbiRef('Forensic wound-interpretation literature (PubMed Central indexing)'),
      whoRef('WHO — violence and injury prevention framing'),
      nmcRef('CBME forensic-medicine competency reference'),
    ],
    evidenceLevel: 'widely-taught',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Wound interpretation is examiner- and court-dependent; colour-based bruise dating is explicitly unreliable — principles only, never case conclusions.',
  },
]

// ════════════════════════════════════════════════════════════════════════════
// LESSONS — COMMUNITY MEDICINE (3)
// ════════════════════════════════════════════════════════════════════════════

const cmLessons: ConceptLesson[] = [
  // ── Topic: t-cm-epi ─────────────────────────────────────────────────────────
  {
    id: 'c2-cm-incidence-prevalence',
    name: 'Incidence vs Prevalence: Two Numbers, One Population',
    kind: 'principle',
    oneLiner:
      'Prevalence counts all existing cases at a moment (a photograph); incidence counts new cases over time (a video) — and the bridge between them is disease duration: prevalence ≈ incidence × duration.',
    whyMatters:
      'Every health headline, outbreak report and exam question uses these two words — usually testing whether you know they are NOT interchangeable. They also drive real decisions: incidence measures risk and outbreak dynamics; prevalence measures service-planning burden.',
    explain30s:
      'PREVALENCE = (all existing cases at a point or period) ÷ (total population) — a snapshot: what fraction is affected TODAY. It includes old and new cases. INCIDENCE (cumulative incidence or incidence rate) = (NEW cases during a period) ÷ (population at risk, ideally person-time) — the flow: how fast new disease appears. The relationship: P ≈ I × D (duration), when prevalence is low and the population is stable. A long-lasting disease (diabetes, HIV with effective ART) accumulates high prevalence from modest incidence; a short, common illness (common cold) has enormous incidence but tiny prevalence. The bathtub analogy: water level = prevalence, tap inflow = incidence, drain (cure + death) = exit. CASE FATALITY (deaths ÷ diagnosed cases) measures deadliness within the diseased; MORTALITY (deaths ÷ population) measures population impact — the pair exams love to contrast. Attack rate is incidence in an outbreak; person-time (patient-years) is the denominator of honest longitudinal studies.',
    eli5:
      'Picture a bathtub. The TAP pouring water is incidence — new cases arriving per month. The WATER LEVEL is prevalence — how full the tub is right now. The DRAIN (people recovering or dying) empties it. If the tap drips slowly but the drain is tiny (a chronic disease), the tub fills up and stays full — big prevalence. If the tap gushes but the drain is wide (a quick cold), the level never rises — huge incidence, low prevalence. Public health reads the tap when it wants to prevent (find why new cases keep coming), reads the level when it wants to plan (how many patients will clinics see today?).',
    firstPrinciples: [
      'Define both precisely: prevalence = existing cases ÷ population (point or period); incidence = new cases ÷ population at risk over a time period (cumulative incidence) or per person-time (incidence density). The denominators differ — that is the exam.',
      'P ≈ I × D is the bridge: with stable conditions, prevalence equals incidence times average duration. Shorten duration (a cure) and prevalence falls even while incidence is unchanged; prolong survival (better ART) and prevalence RISES even as incidence falls — the counterintuitive paragraph that tests real understanding.',
      'The bathtub model: tap (incidence) → water level (prevalence) → drain (recovery + death). Interventions can act on the tap (prevention), the drain (cure) or both — naming which explains why prevalence can rise in a success story.',
      'Which number for which job: INCIDENCE for aetiology/risk and outbreak dynamics (it tracks what changes); PREVALENCE for health-service planning (clinics, drugs, dialysis beds) — the assignment question.',
      'Case fatality vs mortality: CF = deaths ÷ cases (how deadly, within the sick); mortality = deaths ÷ population (how big, in the community). The pair separates "dangerous disease" from "common killer".',
      'Attack rate: incidence restricted to an exposed population during an outbreak — food-poisoning tables are attack-rate arithmetic (who ate what ÷ who was there).',
      'Person-time: the honest denominator when people enter/leave studies — patient-years make incidence comparable across follow-ups of different lengths.',
    ],
    numbers: [
      { label: 'Bridge formula', value: 'P ≈ I × D (prevalence ≈ incidence × duration)', note: 'Valid for low-prevalence, stable conditions — the reasoning tool, not a lab constant.' },
      { label: 'Case fatality', value: 'Deaths ÷ diagnosed cases', note: 'Deadliness within the sick — the outbreak-severity metric.' },
      { label: 'Mortality rate', value: 'Deaths ÷ population (per time)', note: 'Population burden — the planning metric.' },
    ],
    mistakes: [
      'Swapping the two under exam pressure — anchor: PREVALENCE = picture (stock), INCIDENCE = video (flow).',
      'Claiming a cure that prolongs life "reduces prevalence" — better survival often RAISES prevalence while lowering mortality; the P = I × D logic catches it.',
      'Using total population as the incidence denominator when some were already ill — the denominator is the population AT RISK.',
      'Reading a falling prevalence as success without asking whether the drain (deaths) widened.',
    ],
    analogies: [
      'The bathtub (above): tap = incidence, level = prevalence, drain = cure + death.',
      'Photograph vs video: prevalence freezes one moment; incidence runs the film.',
    ],
    examRelevance:
      'Definition-discrimination MCQs, P = I × D reasoning (what happens to prevalence if treatment prolongs life?), case-fatality vs mortality contrast, and outbreak-table attack-rate arithmetic are the standard formats.',
    clinicalRelevance:
      'District planning reads prevalence (how many diabetics will the clinic see?), outbreak control reads incidence (is the tap still running?), and a clinician who can explain why HIV prevalence rose while incidence fell understands modern public health.',
    teachDeeper: [
      'Incidence density vs cumulative incidence arithmetic on small worked examples.',
      'Period vs point prevalence and when period figures mislead.',
      'Standardisation (direct/indirect) — comparing rates across populations with different age structures.',
      'Screening-measure links: how prevalence moves PPV (ties to the screening lesson).',
    ],
    crossLinks: [
      { conceptId: 'c2-cm-screening', label: 'Screening Principles (this pack)', why: 'Prevalence sets positive predictive value — the two lessons share arithmetic.' },
      { conceptId: 'c-tb', label: 'Tuberculosis (this pack)', why: 'TB control is incidence thinking: the tap, notification, and outbreak response.' },
    ],
    sources: [
      whoRef('WHO — health statistics and burden-of-disease metrics framing'),
      cdcRef('CDC — principles of epidemiology education'),
      openStaxRef('Introductory statistics — rates and proportions (reference framing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: t-cm-biostat ─────────────────────────────────────────────────────
  {
    id: 'c2-cm-screening',
    name: 'Screening: Principles & the Biases That Fool Us',
    kind: 'principle',
    oneLiner:
      'Screening tests asymptomatic people — an arithmetic with its own traps: low prevalence lowers predictive value, and survival statistics can flatter a useless test through lead-time and length bias.',
    whyMatters:
      'Screening programmes spend billions and touch millions of healthy people — so their harms are real and their evaluation is subtle. The Wilson-Jungner criteria, the sensitivity/PPV arithmetic and the three biases (lead-time, length, overdiagnosis) are the exam’s favourite Community Medicine logic — and the reason honest doctors ask "does this test save lives, or just find earlier?"',
    explain30s:
      'Screening applies a test to people WITHOUT symptoms — different arithmetic from diagnosis: in a low-prevalence population even a highly specific test yields mostly FALSE positives (PPV falls with prevalence). Test validity: SENSITIVITY = a/(a+c) — how well the test catches the sick (SnNout: a sensitive negative rules out); SPECIFICITY = d/(b+d) — how well it spares the healthy (SpPin: a specific positive rules in); PPV/NPV depend on prevalence. The Wilson-Jungner criteria name when screening is justified: important condition, detectable early phase, acceptable test, agreed treatment, early treatment better than late, and the whole programme must do more good than harm at reasonable cost. THE BIASES: LEAD-TIME bias — screening finds cancer earlier, so survival-from-diagnosis looks longer even if death date is unchanged; LENGTH bias — screening preferentially catches slow-growing, indolent tumours (fast killers present between screens), inflating apparent benefit; OVERDIAGNOSIS — detecting pseudo-disease that would never have harmed. The honest endpoint: cause-specific MORTALITY in randomised evidence — survival rates alone are the trap.',
    eli5:
      'Imagine searching a school for one contagious child among thousands. If sickness is rare, even a good test mostly flags healthy kids — that is why "positive" in a screening programme means "needs confirmation", not "you have it" (prevalence moved the odds). Now the traps. Lead-time bias: finding the lion two years earlier doesn’t make it a smaller lion, but the zookeeper can brag the animal "survived longer after being found". Length bias: screening always catches the slow tortoises and misses the fast rabbits that zoom past between check-ups — so the screened group looks like it has gentler disease. Overdiagnosis: some "tumours" found would never have grown enough to matter — treating them helps no one and harms some. The honest question is never "do people live longer after diagnosis?" but "do fewer people die of the disease?"',
    firstPrinciples: [
      'Screening ≠ diagnosis: asymptomatic population → low prevalence → PPV collapses even with good sensitivity/specificity. Counselling language: a screening positive is a threshold for confirmation, not a verdict.',
      'The 2×2 arithmetic: sensitivity = a/(a+c); specificity = d/(b+d); PPV = a/(a+b); NPV = d/(c+d). Mnemonics: SnNout (Sensitive test, Negative result rules out) and SpPin (Specific test, Positive result rules in).',
      'PPV rides on prevalence: same test, rarer disease, more false positives — the reason newborn panels and population checks generate confirmatory workloads, and the arithmetic behind every "screening scandal" headline.',
      'Wilson-Jungner (by name): the condition is important; the early/detectable phase exists; the test is acceptable and reliable; treatment is available and better early; policy on whom to treat is agreed; benefits outweigh harms at acceptable cost. Exams ask the list; programmes live by it.',
      'Lead-time bias: earlier detection adds measured "survival time" without adding life — survival-since-diagnosis is the dishonest metric; death-rate is the honest one.',
      'Length bias: screening samples the indolent tail (slow tumours are present longer and get caught); interval cancers are the fast tail — apparent case mix flatters the programme.',
      'Overdiagnosis: the extreme of length bias — disease detected that would never have caused harm; every screen has a false-positive and overdiagnosis price, which is why criteria and mortality endpoints exist. The honest evaluation: randomised evidence, cause-specific mortality, all-cause harms.',
    ],
    numbers: [
      { label: 'Sensitivity / Specificity', value: 'a/(a+c) · d/(b+d)', note: 'Test properties — stable across populations.' },
      { label: 'PPV / NPV', value: 'a/(a+b) · d/(c+d)', note: 'Population-dependent — PPV falls as prevalence falls; the screening arithmetic.' },
      { label: 'The three biases', value: 'Lead-time · Length · Overdiagnosis', note: 'The triad that turns "earlier detection" into false proof of benefit.' },
    ],
    mistakes: [
      'Telling a screening-positive patient they have the disease — prevalence-adjusted PPV says "needs confirmation" is usually the honest phrase.',
      'Quoting 5-year survival to prove screening works — survival-from-diagnosis is exactly where lead-time bias lives; mortality is the honest endpoint.',
      'Reversing SnNout/SpPin — sensitive rules OUT when negative; specific rules IN when positive.',
      'Assuming a highly sensitive test suffices for screening — sensitivity without specificity drowns confirmatory services in false positives.',
    ],
    analogies: [
      'The contagious-child search (above) — prevalence moves the meaning of a positive.',
      'The lion found two years earlier (lead-time), the tortoise caught and the rabbit missed (length), the pebble called a lion (overdiagnosis) — three fables, one lesson.',
    ],
    examRelevance:
      '2×2 computations, PPV-prevalence reasoning, Wilson-Jungner recall, and "which bias explains this survival jump?" vignettes are among Community Medicine’s most reliable question patterns.',
    clinicalRelevance:
      'Explaining a positive mammogram/Pap smear to a worried patient, designing a workplace health check, or reading a screening headline critically — all three are this lesson applied.',
    teachDeeper: [
      'Worked PPV table across prevalence levels with one fixed test — arithmetic made visible.',
      'Interval cancers and programme sensitivity — how programmes audit themselves.',
      'Likelihood ratios: the bridge from 2×2 numbers to real post-test odds.',
      'The randomised-trial logic of screening evaluation (mortality endpoints, intention-to-screen).',
    ],
    crossLinks: [
      { conceptId: 'c2-cm-incidence-prevalence', label: 'Incidence vs Prevalence (this pack)', why: 'Prevalence is the engine of PPV — the two lessons are one arithmetic.' },
      { conceptId: 'c2-microbiology-hiv', label: 'HIV Testing (this pack)', why: 'Window-period logic is screening logic: test properties, confirmatory algorithms, honest counselling.' },
    ],
    sources: [
      niceRef('NICE — population screening programme framing'),
      whoRef('WHO — screening programmes principles framing'),
      ncbiRef('Screening bias (lead-time/length/overdiagnosis) literature (PubMed Central indexing)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Topic: t-cm-vaccines ────────────────────────────────────────────────────
  {
    id: 'c2-cm-vaccine-platforms',
    name: 'Vaccine Platforms & the Cold Chain',
    kind: 'principle',
    oneLiner:
      'Vaccines teach immunity without disease — built on a handful of platforms (live attenuated, inactivated, subunit/toxoid, conjugate, viral-vector, mRNA) — and only survive to do their work inside a maintained cold chain, coordinated nationally by programmes like India’s Universal Immunisation Programme.',
    whyMatters:
      'Vaccination is the highest-impact public-health intervention in history, and its practical half is logistics: which platform suits which patient (live vaccines and immunosuppression!), and why a broken fridge silently ruins a programme. Exams test platform matching and cold-chain rules; populations depend on both.',
    explain30s:
      'PLATFORMS: LIVE ATTENUATED vaccines carry weakened replicating organisms — strong, often long-lived immunity with few doses, but cautioned in pregnancy and immunosuppression (measles, BCG, oral polio are the classic examples). INACTIVATED vaccines use killed organisms — safe for the immunocompromised but needing multiple doses/adjuvants (whole-cell pertussis, rabies, injectable polio). SUBUNIT/TOXOID vaccines use purified pieces or inactivated toxins (tetanus toxoid, hepatitis B surface antigen) — very safe, boosters needed. CONJUGATE vaccines glue poor polysaccharide antigens to carrier proteins so infants respond (the Hib/pneumococcal logic). VIRAL-VECTOR and mRNA platforms deliver instructions rather than organisms — the newer generation taught alongside the classics. THE COLD CHAIN keeps potency from factory to arm: most vaccines live at +2 to +8 °C; some (like oral polio) freeze-dry for deeper cold; FREEZE-SENSITIVE vaccines (hepatitis B, DTP/TT-type adsorbed vaccines) are ruined by freezing as surely as heat; WHO-style vial monitors and shake tests exist to catch damage. In India the Universal Immunisation Programme (UIP) organises platforms and cold chain nationally — this lesson names the programme and principles, and leaves specific schedules to current national guidance.',
    eli5:
      'A vaccine is a wanted-poster of a criminal, not the criminal: show your immune police the poster and they practise drills for the real thing. There are several ways to print the poster: a weak cousin of the criminal that can still jog but not hurt you (live attenuated — great training, risky if your police are on holiday, i.e. immunosuppressed); a mugshot of the killed criminal (inactivated — safe, needs reminders); just the criminal’s fingerprints (subunit) or their poison neutralised (toxoid); fingerprints glued to a flashing sign so even babies notice (conjugate); or modern messages that tell your cells to print the poster themselves (mRNA/viral vector). Cold chain = keeping posters crisp: heat blurs them, and some posters CRACK if frozen. So the vaccine’s journey is a relay of refrigerators with thermometers, and a country’s immunisation programme is the map that gets every baby the right poster at the right time.',
    firstPrinciples: [
      'Platform logic first: LIVE ATTENUATED = mimics natural infection, strong and durable, BUT contraindicated logic in pregnancy and severe immunosuppression (the exam’s favourite safety pairing). INACTIVATED/KILLED = safe for everyone, weaker, repeat doses.',
      'SUBUNIT/TOXOID: purified components or neutralised toxins — maximal safety profile, adjuvant-dependent strength; the tetanus-toxoid and hepatitis-B-surface-antigen classics.',
      'CONJUGATION: polysaccharide antigens are T-cell-independent (infants respond poorly); gluing them to carrier proteins recruits T-helper help — the reason infant pneumococcal/Hib programmes exist (one line, one exam).',
      'NEWER platforms at concept level: viral vectors (another harmless virus as the delivery van) and mRNA (instructions for your own cells to build the antigen) — no organism replication logic; taught alongside, not replacing, the classics.',
      'Herd immunity: indirect protection when enough people are immune — the population arithmetic that protects those who cannot be vaccinated (the immunosuppressed child’s shield).',
      'Cold chain rules: most vaccines at +2 to +8 °C; the diluent follows the cold chain too; FREEZE damage (adsorbed vaccines — hepatitis B, DTP/TT family) and HEAT damage are both silent potency killers; shake-test and vial-monitor logic exist to detect them. Never refreeze; never use a frozen adsorbed vaccine.',
      'Programme framing: India’s Universal Immunisation Programme (UIP) runs the national schedule, session logistics and cold-chain network; THIS lesson teaches platform-and-cold-chain principles and defers specific schedules/doses to current national guidance — schedules change, principles do not.',
    ],
    presentation: [
      'Live attenuated family (classic examples): measles, BCG, oral polio, rotavirus — the "caution in immunosuppression" shelf.',
      'Inactivated family: whole-cell pertussis, rabies, injectable polio — the "safe, repeat" shelf.',
      'Subunit/toxoid/conjugate family: tetanus toxoid, hepatitis B, Hib/pneumococcal conjugates — the "purified, boostered" shelf.',
      'Cold-chain failures present as programme-level mystery: sessions where "nothing worked" — potency died in transit, not in the arm.',
    ],
    mistakes: [
      'Giving live vaccines to severely immunocompromised patients or in pregnancy without contraindication-check logic — the platform question IS a safety question.',
      'Ignoring a frozen adsorbed vaccine (hepatitis B/DTP family) — freezing is as destructive as heat; the shake test exists for a reason.',
      'Confusing conjugate with plain polysaccharide vaccines in infants — polysaccharide-only responses fail in the very young.',
      'Assuming "vaccine failure" means the cold chain failed — primary failure, waning immunity and programme gaps are distinct causes; investigate before blaming the fridge.',
    ],
    analogies: [
      'The wanted-poster family (above): weak cousin, mugshot, fingerprints, neutralised poison, flashing sign, self-printing instructions.',
      'Cold chain as a relay of refrigerators: a baton (potency) passed through every hand — drop it once, silently, and the last runner’s race is already lost.',
    ],
    examRelevance:
      'Platform→example matching, live-vaccine contraindication logic, conjugate-infant reasoning, cold-chain temperature rules and freeze-sensitive lists, and UIP/national-programme naming questions are the standard Community Medicine formats.',
    clinicalRelevance:
      'The immunisation session, the district cold-chain officer’s shake test, the immunocompromised child’s travel advice and the antenatal tetanus question all run on this lesson — platform logic and logistics in one.',
    teachDeeper: [
      'Adjuvant mechanisms (alum depot/innate signalling) at concept level.',
      'Vaccine-vial monitors and shake-test interpretation — the quality-control half of cold chain.',
      'Herd-immunity thresholds conceptually (why transmissibility, R₀, sets the bar) — no invented figures.',
      'Adverse-event surveillance (AEFI) systems and the causality-assessment idea.',
    ],
    crossLinks: [
      { conceptId: 'c-vaccines', label: 'Immunisation & National Programmes (Community Medicine)', why: 'The seeded immunisation concept pairs with this platform/cold-chain deep-dive.' },
      { conceptId: 'c-tb', label: 'Tuberculosis (this pack)', why: 'BCG is the classic live-attenuated example — policy differences across countries are the global-contrast story.' },
      { conceptId: 'c2-microbiology-hiv', label: 'HIV (this pack)', why: 'Immunosuppression flips the platform decision — the safety logic made concrete.' },
    ],
    global: [
      { region: 'India', terminology: ['UIP — Universal Immunisation Programme'], note: 'India’s national immunisation programme organises vaccines, sessions and the cold-chain network; schedule specifics are deliberately left to current national guidance.' },
      { region: 'WHO/Global', terminology: ['EPI — Expanded Programme on Immunization'], note: 'WHO’s EPI framing and cold-chain standards shape national systems worldwide; this lesson teaches the shared principles.' },
      { region: 'United States', terminology: [], note: 'US committee-based scheduling updates annually — the platform and storage science is identical; the calendar differs by country.' },
      { region: 'United Kingdom', terminology: [], note: 'UK programme naming and delivery models differ; freeze-sensitivity and 2–8 °C logic do not.' },
    ],
    sources: [
      whoRef('WHO — immunisation, EPI and cold-chain standards framing'),
      cdcRef('CDC — vaccine storage and handling education'),
      nmcRef('CBME community-medicine competency reference (immunisation context)'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Schedules, specific vaccine presentations and cold-chain device standards change — verify current national programme guidance (e.g., UIP) before operational use.',
  },
]

// ════════════════════════════════════════════════════════════════════════════
// LESSON → TOPIC WIRING (28 lessons)
// Every lesson id (pathology included) maps to a topic declared above.
// ════════════════════════════════════════════════════════════════════════════

const LESSON_TOPICS: Record<string, string> = {
  // Pathology
  'c2-pathology-cell-injury': 'pathology-cell-injury',
  'c-inflamm': 't-patho-inflamm',
  'c-neoplasia': 't-patho-neoplasia',
  'c2-pathology-anemias': 't-patho-hemapath',
  'c2-pathology-leukaemias': 't-patho-hemapath',
  'c2-pathology-thyroid-pathology': 'pathology-thyroid',
  'c-cvpath-athero': 't-patho-cvpath',
  'c2-pathology-cirrhosis': 'pathology-liver',
  // Pharmacology
  'c2-pharmacology-kinetics': 'pharmacology-kinetics',
  'c2-pharmacology-dynamics': 'pharmacology-dynamics',
  'c2-pharmacology-autonomic': 'pharmacology-autonomic',
  'c2-pharmacology-antibiotics': 't-pharm-antibio',
  'c-acei': 't-pharm-cardio',
  'c2-pharmacology-nsaids': 'pharmacology-analgesia',
  'c-metformin': 't-pharm-endo',
  'c-antitb': 't-pharm-antibio',
  'c2-pharmacology-emergency': 'pharmacology-emergency',
  // Microbiology
  'c2-microbiology-gram-stain': 'microbiology-bacteria-basics',
  'c-tb': 't-micro-tb',
  'c2-microbiology-malaria': 'microbiology-malaria',
  'c2-microbiology-hiv': 'microbiology-hiv',
  'c2-microbiology-hbv-serology': 't-micro-hep',
  'c2-microbiology-sepsis': 'microbiology-sepsis',
  // FMT
  'c2-fmt-postmortem-changes': 'fmt-thanatology',
  'c2-fmt-wound-types': 'fmt-wounds',
  // Community Medicine
  'c2-cm-incidence-prevalence': 't-cm-epi',
  'c2-cm-screening': 't-cm-biostat',
  'c2-cm-vaccine-platforms': 't-cm-vaccines',
}

const lessonsWithTopics = [
  ...pathologyLessons,
  ...pharmacologyLessons,
  ...microbiologyLessons,
  ...fmtLessons,
  ...cmLessons,
].map((l) => {
  const topicId = LESSON_TOPICS[l.id]
  if (!topicId || !topics.some((t) => t.id === topicId)) {
    throw new Error(`[para-clinical pack] lesson ${l.id} has no valid topic hint (${topicId ?? 'none'})`)
  }
  return { ...l, topicId }
})

// ── CURRICULUM RECORD ───────────────────────────────────────────────────────
// NMC CBME framing for the para-clinical phase; subject ids verified against
// taxonomy.ts (pathology · pharmacology · microbiology · fmt · cm).

const curriculum: CurriculumRecord[] = [
  {
    authority: 'National Medical Commission (NMC)',
    country: 'India',
    scope: 'MBBS CBME curriculum — para-clinical phase (Pathology, Pharmacology, Microbiology, Forensic Medicine & Toxicology, Community Medicine)',
    subjectsCovered: ['pathology', 'pharmacology', 'microbiology', 'fmt', 'cm'],
    version: '2026.10',
    sourceUrl: 'https://www.nmc.org.in',
    lastReviewed: '2026-10-05',
    alignment: 'official-structure',
  },
]

// ── PACK ASSEMBLY ───────────────────────────────────────────────────────────
// Structurally matches registry's ContentPack: { packId, subjects, topics,
// lessons, curriculum }. 0 subjects (all 5 ids live in taxonomy.ts) ·
// 28 topics · 28 lessons · 1 curriculum record.

export const paraClinicalPack: ContentPack = {
  packId: 'para-clinical',
  subjects: [] as SubjectTaxonomy[],
  topics,
  lessons: lessonsWithTopics,
  curriculum,
}

