// ─── MEDULA — 'Clinical' content pack (Task 19-i) ───────────────────────────
// General Medicine · General Surgery · Obstetrics & Gynaecology · Paediatrics ·
// Orthopaedics · ENT · Ophthalmology · Psychiatry · Dermatology · Radiology ·
// Anaesthesia · Emergency Medicine · Critical Care · Oncology.
//
// Self-contained pack. Imports ONLY the shared contracts — all 14 clinical
// subject ids live in taxonomy.ts / the DB already (phase: 'clinical'), so
// this pack declares NO subjects. Topics reuse the EXACT seeded DB topic ids
// wherever a matching topic exists (t-med-*, t-surg-*, t-obgy-*, t-peds-*,
// t-orth-*, t-ent-*, t-opht-*, t-psy-*, t-derm-*, t-rad-*, t-anes-crit) and
// add new `${subjectId}-${slug}` topics for everything else.
// Concept lessons: new ids use the `c2-<subjectId>-<slug>` scheme. Six
// lessons deliberately use EXISTING seeded concept ids (c-ami, c-htn, c-dm,
// c-preec, c-shock, c-cxr) — each genuinely covers that concept's core, so
// this enriches rather than duplicates. Other new lessons cross-link to their
// related seeded concepts (c-appendicitis, c-hernia, c-int-obstruction, …).
//
// HONESTY RULES (pack-wide):
// - Educational content only — NEVER clinical advice. Management sections are
//   PRINCIPLES; every management-bearing lesson carries a verifyNote.
// - No invented statistics. Every number is a classic, widely-published
//   teaching value; where practice varies by guideline we say so.
// - Sources are references for attribution; nothing is reproduced from them.
//   Only the whitelisted institutions appear as sources.

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

const nhsRef = (title: string): SourceRef => ({
  institution: 'National Health Service (NHS), UK',
  title,
  url: 'https://www.nhs.uk',
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

// ── TOPICS (35) ─────────────────────────────────────────────────────────────
// 18 reuse the EXACT seeded DB topic ids (names kept byte-identical to
// prisma/seed-data.ts; descriptions authored here — the seed left some empty).
// 17 new topics follow `${subjectId}-${slug}`.

const topics: TopicTaxonomy[] = [
  // ── Medicine — reused DB topics ───────────────────────────────────────────
  {
    id: 't-med-acs', subjectId: 'medicine', name: 'Acute Coronary Syndromes',
    system: 'cardiovascular', importance: 5,
    description: 'Unstable angina to STEMI — chest-pain triage, ECG territory logic, troponin reasoning and time-critical reperfusion principles.',
  },
  {
    id: 't-med-htn', subjectId: 'medicine', name: 'Systemic Hypertension',
    system: 'cardiovascular', importance: 5,
    description: 'The silent epidemic — pressure physiology, secondary-cause clues, end-organ damage and emergency-vs-urgency logic.',
  },
  {
    id: 't-med-dm', subjectId: 'medicine', name: 'Diabetes Mellitus',
    system: 'endocrine', importance: 5,
    description: 'Type 1 vs type 2 vs gestational, HbA1c diagnostic logic, and the micro/macrovascular complication map.',
  },
  {
    id: 't-med-thyroid', subjectId: 'medicine', name: 'Thyroid Disorders',
    system: 'endocrine', importance: 4,
    description: 'Hypo vs hyperthyroidism, TSH-first interpretation, Graves vs Hashimoto and the thyroid emergency.',
  },
  {
    id: 't-med-shock', subjectId: 'medicine', name: 'Shock & Sepsis',
    system: 'cardiovascular', importance: 5,
    description: 'Haemodynamic profiles of the four shock families and sepsis as resuscitation timed in minutes.',
  },
  // ── Medicine — new topics ─────────────────────────────────────────────────
  {
    id: 'medicine-stroke', subjectId: 'medicine', name: 'Stroke & Cerebrovascular Disease',
    system: 'nervous', importance: 5,
    description: 'Sudden focal deficit — FAST recognition, ischaemic vs haemorrhagic logic and the time-window concept.',
  },
  {
    id: 'medicine-pneumonia', subjectId: 'medicine', name: 'Pneumonia',
    system: 'respiratory', importance: 4,
    description: 'Lobar consolidation to atypical syndromes — severity scoring as admission logic (CURB-65 concept).',
  },
  {
    id: 'medicine-anemia-approach', subjectId: 'medicine', name: 'Approach to Anemia',
    system: 'haematology', importance: 4,
    description: 'Morphology-first framework — microcytic, normocytic, macrocytic — and the history/exam algorithm.',
  },
  {
    id: 'medicine-ckd', subjectId: 'medicine', name: 'Chronic Kidney Disease',
    system: 'renal', importance: 4,
    description: 'eGFR staging as a shared language, albuminuria, and the complication cascade across stages.',
  },
  {
    id: 'medicine-tuberculosis', subjectId: 'medicine', name: 'Tuberculosis — Management Principles',
    system: 'respiratory', importance: 5,
    description: 'Combination therapy logic, adherence systems, drug-resistance principles and programme framing.',
  },
  // ── Surgery ───────────────────────────────────────────────────────────────
  {
    id: 't-surg-appendix', subjectId: 'surgery', name: 'Acute Abdomen & Appendicitis',
    system: 'gastrointestinal', importance: 5,
    description: 'The classic surgical emergency — migration of pain, Alvarado scoring and its mimics.',
  },
  {
    id: 't-surg-hernia', subjectId: 'surgery', name: 'Hernias',
    system: 'gastrointestinal', importance: 4,
    description: 'Reducible to strangulated — the neck, the contents and the complications that change urgency.',
  },
  {
    id: 'surgery-intestinal-obstruction', subjectId: 'surgery', name: 'Intestinal Obstruction',
    system: 'gastrointestinal', importance: 4,
    description: 'Small vs large bowel patterns, strangulation red flags and drip-and-suck principles.',
  },
  {
    id: 'surgery-wounds-healing', subjectId: 'surgery', name: 'Wounds & Wound Healing',
    system: 'integumentary', importance: 4,
    description: 'Phases of healing, intention classification, and the local/systemic factors that decide outcome.',
  },
  // ── Obstetrics & Gynaecology ──────────────────────────────────────────────
  {
    id: 't-obgy-preec', subjectId: 'obgy', name: 'Hypertensive Disorders of Pregnancy',
    system: 'cardiovascular', importance: 5,
    description: 'Gestational HTN to eclampsia — the 20-week line, severe features and magnesium-sulphate logic.',
  },
  {
    id: 't-obgy-labour', subjectId: 'obgy', name: 'Labour Progress & PPH',
    system: 'reproductive', importance: 5,
    description: 'Stages of labour, partograph vigilance and the four Ts of postpartum haemorrhage.',
  },
  {
    id: 't-obgy-antenatal', subjectId: 'obgy', name: 'Antenatal Care & APH',
    system: 'reproductive', importance: 5,
    description: 'Painless vs painful bleeding after 20 weeks — previa and abruption.',
  },
  {
    id: 'obgy-pcos', subjectId: 'obgy', name: 'Polycystic Ovary Syndrome',
    system: 'reproductive', importance: 4,
    description: 'A syndrome of exclusion — diagnostic criteria concept, insulin resistance and long-horizon risks.',
  },
  // ── Paediatrics ───────────────────────────────────────────────────────────
  {
    id: 't-peds-growth', subjectId: 'peds', name: 'Growth, Development & Nutrition',
    system: 'multisystem', importance: 4,
    description: 'Milestones, malnutrition grading and IMNCI danger signs.',
  },
  {
    id: 'peds-immunization', subjectId: 'peds', name: 'Childhood Immunization Principles',
    system: 'immune-infection', importance: 4,
    description: 'Live vs killed platform logic, cold-chain reality and national-programme framing (UIP by name).',
  },
  {
    id: 'peds-diarrhea-dehydration', subjectId: 'peds', name: 'Diarrhoea & Dehydration',
    system: 'gastrointestinal', importance: 5,
    description: 'Assess, classify, rehydrate — the WHO plan framework and the danger signs that escalate care.',
  },
  {
    id: 'peds-neonatal-jaundice', subjectId: 'peds', name: 'Neonatal Jaundice',
    system: 'hepatic', importance: 4,
    description: 'Physiologic vs pathologic timing logic, bilirubin encephalopathy risk and phototherapy as principle.',
  },
  // ── Orthopaedics ──────────────────────────────────────────────────────────
  {
    id: 't-orth-fractures', subjectId: 'orth', name: 'Fractures & Complications',
    system: 'musculoskeletal', importance: 5,
    description: 'Colles to compartment syndrome — deformity, neurology and the 5 Ps.',
  },
  {
    id: 'orth-colles', subjectId: 'orth', name: 'Colles Fracture',
    system: 'musculoskeletal', importance: 3,
    description: 'The distal-radius classic — dinner-fork deformity, FOOSH mechanics and reduction principles.',
  },
  // ── ENT / Ophthalmology ───────────────────────────────────────────────────
  {
    id: 't-ent-vertigo', subjectId: 'ent', name: 'Vertigo & Otitis Media',
    system: 'head-neck-special-senses', importance: 4,
    description: 'Dizzy vs deaf — peripheral causes and the Dix-Hallpike pivot.',
  },
  {
    id: 'ent-epistaxis', subjectId: 'ent', name: 'Epistaxis',
    system: 'head-neck-special-senses', importance: 3,
    description: 'Anterior vs posterior bleeding — Little’s area, first-aid and escalation logic.',
  },
  {
    id: 't-opht-redeye', subjectId: 'opht', name: 'Red Eye & Glaucoma',
    system: 'head-neck-special-senses', importance: 4,
    description: 'Sight-threatening discrimination: conjunctival, corneal, uveal, pressure.',
  },
  {
    id: 'opht-cataract', subjectId: 'opht', name: 'Cataract',
    system: 'head-neck-special-senses', importance: 4,
    description: 'Lens opacity — the world’s leading reversible blindness and the surgery that restores it.',
  },
  // ── Psychiatry / Dermatology ──────────────────────────────────────────────
  {
    id: 't-psy-mood', subjectId: 'psy', name: 'Mood & Psychotic Disorders',
    system: 'nervous', importance: 4,
    description: 'Depressive criteria, first-rank symptoms and the safety questions.',
  },
  {
    id: 'psy-schizophrenia', subjectId: 'psy', name: 'Schizophrenia Basics',
    system: 'nervous', importance: 4,
    description: 'Positive vs negative symptoms, the dopamine-concept frame and early-treatment principles.',
  },
  {
    id: 't-derm-psoriasis', subjectId: 'derm', name: 'Papulosquamous & Eczema',
    system: 'integumentary', importance: 3,
    description: 'Psoriasis vs atopic dermatitis — morphology first, therapy second.',
  },
  // ── Radiology / Anaesthesia / Emergency / Oncology / Critical Care ────────
  {
    id: 't-rad-chestxray', subjectId: 'rad', name: 'Chest X-Ray & CT Patterns',
    system: 'respiratory', importance: 4,
    description: 'Silhouette sign, air-bronchogram, the 10 classic shadows.',
  },
  {
    id: 't-anes-crit', subjectId: 'anes', name: 'Airway, Relaxants & Malignant Hyperthermia',
    system: 'respiratory', importance: 3,
    description: 'Depolarising vs non-depolarising, suxamethonium traps, MH crisis.',
  },
  {
    id: 'emergency-medicine-abcde', subjectId: 'emergency-medicine', name: 'Primary Survey — ABCDE Approach',
    system: 'multisystem', importance: 5,
    description: 'The universal resuscitation grammar — treat as you find, before diagnosis exists.',
  },
  {
    id: 'oncology-tnm-staging', subjectId: 'oncology', name: 'Cancer Staging — TNM Concept',
    system: 'multisystem', importance: 4,
    description: 'Tumour, Node, Metastasis — how a common language of extent drives prognosis and therapy.'
  },
]

// ── CURRICULUM RECORD ───────────────────────────────────────────────────────
// NMC CBME framing for the clinical phase; subject ids verified against
// taxonomy.ts (all fourteen carry phase: 'clinical').

const curriculum: CurriculumRecord[] = [
  {
    authority: 'National Medical Commission (NMC)',
    country: 'India',
    scope: 'MBBS CBME curriculum — clinical phase (General Medicine, General Surgery, Obstetrics & Gynaecology, Paediatrics, Orthopaedics, ENT, Ophthalmology, Psychiatry, Dermatology, Radiology, Anaesthesia, Emergency Medicine, Critical Care, Oncology)',
    subjectsCovered: [
      'medicine', 'surgery', 'obgy', 'peds', 'orth', 'ent', 'opht', 'psy',
      'derm', 'rad', 'anes', 'emergency-medicine', 'critical-care', 'oncology',
    ],
    version: '2024 CBME',
    sourceUrl: 'https://nmc.org.in',
    lastReviewed: '2026-10-05',
    alignment: 'official-structure',
  },
]

// ── LESSONS (36) ────────────────────────────────────────────────────────────

const lessons: ConceptLesson[] = [
  // ═════════════════════════════ MEDICINE (9) ═══════════════════════════════
  {
    id: 'c-ami',
    name: 'Acute Coronary Syndromes (ACS)',
    kind: 'disease',
    oneLiner: 'A spectrum — unstable angina to full heart attack — where a clot on a ruptured cholesterol plaque suddenly cuts blood supply to part of the heart muscle.',
    whyMatters: 'The single most time-critical diagnosis in general medicine: muscle dies by the minute, the ECG separates emergencies within minutes, and recognition-versus-miss is the difference between recovery and heart failure or death.',
    explain30s: 'Coronary arteries feed the heart itself. A cholesterol plaque tears; a clot forms on the tear; blood flow drops. If the ECG shows ST elevation, the artery is likely fully blocked — open it fast (angioplasty or clot-dissolving drugs). If the ECG is not classic but troponin (a protein leaked by injured heart cells) rises, it is still an emergency on the same spectrum. Everything in ACS is about time: time is muscle.',
    eli5: 'Think of plumbing. The heart is a pump, and the pump needs its own water pipes. Greasy gunk (cholesterol plaque) builds up inside one pipe for years — quietly. One day the gunk crust cracks, and the blood forms a scab (clot) that clogs the pipe. Now part of the pump gets no water and starts to die. Doctors hear the alarm (chest pain), take a picture of the electric wires (ECG), and test for paint leaking from dying walls (troponin). Then they rush to reopen the pipe. Faster opening = less pump lost.',
    firstPrinciples: [
      'The heart is a muscular pump that never rests — so it needs its own dedicated blood supply, delivered through the coronary arteries during the relaxation phase of each beat.',
      'Atherosclerosis builds lipid plaques inside these arteries over decades — mostly silent until a plaque’s fibrous cap ruptures.',
      'Rupture exposes the plaque’s inner contents to blood → platelets pile on → a thrombus (clot) grows in the arterial lumen.',
      'Flow falls below demand → ischaemia: myocardial cells switch to anaerobic metabolism within seconds, and the pain of angina/infarction begins.',
      'Injured myocyte membranes leak troponin into blood — the laboratory fingerprints of myocardial injury (assay-specific cut-offs, interpreted in a time pattern).',
      'Ischaemia also corrupts the heart’s electrical wiring → ECG changes (ST/T morphology) that localize the territory and urgency.',
      'Therefore management is a race: restore flow (reperfusion) before muscle that is stunned dies permanently — the entire clinical pathway is organised around this single principle.',
    ],
    normal: 'Coronary flow matches demand beat-by-beat; resting ECG shows a regular rhythm with normally-shaped ST segments and T waves; troponin is below the assay’s 99th-percentile reference limit.',
    mechanism: 'Plaque rupture or erosion → platelet activation and thrombus → partial occlusion (unstable angina/NSTEMI pattern) or total occlusion (STEMI pattern) → supply–demand mismatch → ischaemia, then necrosis spreading from subendocardium outward; reperfusion salvages myocardium in a time-dependent way.',
    presentation: [
      'Central chest pain — heavy, crushing, pressure-like — classically radiating to left arm or jaw.',
      'Associated sweating (diaphoresis), nausea, breathlessness; often a sense of impending doom.',
      'May present atypically: epigastric pain, isolated breathlessness, syncope — especially in elderly and diabetic patients.',
      'Some infarcts are silent — first presentation may already be heart failure or an arrhythmia.',
    ],
    diagnosis: [
      'ECG within minutes of first contact — the only investigation that changes immediate disposition (STEMI vs non-STE pathway).',
      'High-sensitivity troponin: the value itself is assay-specific; the diagnostic logic is the RISE (or fall) across serial measurements, not a single number.',
      'Rest of the workup (echo for wall-motion, risk scores, angiography) follows after the acute decision.',
    ],
    differentials: [
      { name: 'Aortic dissection', key: 'Tearing pain radiating to the back, unequal pulses/pressures — thrombolysis here is catastrophic, so exclude before reperfusion.' },
      { name: 'Pulmonary embolism', key: 'Pleuritic pain, hypoxia out of proportion, right-heart strain signs on ECG.' },
      { name: 'Pericarditis', key: 'Pain worse lying flat, relieved sitting forward; widespread saddle-shaped ST elevation; pericardial rub.' },
      { name: 'Reflux oesophagitis', key: 'Burning, postural, responds to antacids — but never assume this first in a risk patient.' },
    ],
    management: [
      'PRINCIPLE — time-critical reperfusion: an occluded artery is reopened (primary angioplasty) or dissolved (fibrinolysis where angioplasty is not reachable in time); the acceptable delay is measured in minutes, not hours.',
      'PRINCIPLE — antiplatelet and anticoagulant therapy to stop clot propagation, alongside relief of ischaemia and close rhythm monitoring.',
      'PRINCIPLE — parallel processing, not sequential: ECG, intravenous access, drugs and transfer happen simultaneously; the patient with STEMI is diagnosed on ECG before troponin returns.',
      'PRINCIPLE — after stabilisation, secondary prevention: the same plaque biology exists everywhere, so long-term risk-factor control and antiplatelet/statin therapy are part of the acute episode’s management.',
    ],
    complications: [
      'Arrhythmias — from harmless ectopy to ventricular fibrillation (why monitoring and defibrillators precede everything).',
      'Heart failure and cardiogenic shock — proportional to lost muscle mass.',
      'Mechanical complications — papillary-muscle rupture, free-wall rupture, ventricular septal defect (days 3–7 classic window).',
      'Pericarditis, mural thrombus with embolic stroke, and late ventricular remodelling.',
    ],
    numbers: [
      { label: 'Door-to-balloon concept', value: 'Systems are built around opening the artery as fast as possible; the classic teaching benchmark is about 90 minutes from hospital arrival to angioplasty', note: 'The exact target varies by system and guideline revision — the concept (faster = more muscle saved) is the exam point.' },
      { label: 'Troponin logic', value: 'Qualitative: injured myocytes leak troponin within hours; serial measurements rising or falling confirm an acute event', note: 'A single value without a time trend cannot separate acute injury from chronic elevation — labs define their own cut-offs.' },
      { label: 'Classic ECG anchors', value: 'ST elevation in two contiguous leads defines the STEMI pattern; reciprocal depression strengthens it', note: 'Territory: anterior (V1–V4/LAD), lateral (I, aVL, V5–V6/circumflex), inferior (II, III, aVF/RCA).' },
    ],
    drugs: [
      { name: 'Aspirin', drugClass: 'Antiplatelet (COX-1 inhibitor)', mechanism: 'Blocks thromboxane A2 → platelets cannot plug into the growing clot', note: 'Chewed for fastest absorption in the acute setting — a classic teaching point.' },
      { name: 'P2Y12 inhibitors (e.g. clopidogrel/ticagrelor)', drugClass: 'Antiplatelet', mechanism: 'Block the platelet ADP receptor → dual pathway inhibition with aspirin', note: 'Choice and timing are guideline-dependent — verify current protocol.' },
      { name: 'Fibrinolytics (e.g. streptokinase/tenecteplase)', drugClass: 'Clot-dissolving', mechanism: 'Convert plasminogen to plasmin → lyse fibrin strands of the thrombus', note: 'The option when angioplasty cannot be delivered inside the time window; contraindication screening is a classic exam scenario.' },
    ],
    mistakes: [
      'Sending the patient for a chest X-ray or waiting for troponin before the ECG — the ECG is the first and only gate for STEMI.',
      'Discharging atypical presentations (epigastric pain, isolated dyspnoea in a diabetic) without an ECG and troponin.',
      'Reading one troponin value in isolation — acute logic lives in the serial trend.',
      'Forgetting to screen for dissection before fibrinolysis in pain that tears through to the back.',
    ],
    mnemonics: [
      { hook: 'Time is muscle', expands: 'Every minute of total occlusion kills more myocardium — the whole ACS pathway is built on this sentence.' },
    ],
    reasoning: [
      { stage: 'symptom', label: 'Central chest pain + sweating', detail: 'Heavy, pressure-like pain radiating to arm/jaw in a risk patient (smoker, diabetic, hypertensive, older) — treat as ACS until proven otherwise.' },
      { stage: 'mechanism', label: 'Plaque rupture → thrombus', detail: 'Years of atherosclerosis; the acute event is the cap tearing and platelets stacking.' },
      { stage: 'differential', label: 'Dissection, PE, pericarditis, reflux', detail: 'Back-radiating tearing pain, pleuritic hypoxia, positional rub, acid burn — each has a veto or a redirect.' },
      { stage: 'investigation', label: 'ECG first, then troponin', detail: 'ECG in minutes; serial high-sensitivity troponin.' },
      { stage: 'interpretation', label: 'STEMI vs non-STE + troponin trend', detail: 'ST elevation in contiguous leads = probable total occlusion → reperfusion pathway. Non-diagnostic ECG with rising troponin = NSTEMI/UA spectrum.' },
      { stage: 'diagnosis', label: 'ACS confirmed and localised', detail: 'Territory read from lead groups; risk stratified.' },
      { stage: 'management', label: 'Reperfusion + antithrombotics + monitoring', detail: 'Angioplasty or lysis by pathway; dual antiplatelets; rhythm watch — all principle-level, protocol-specific.' },
      { stage: 'complication', label: 'Arrhythmia, failure, mechanical rupture', detail: 'Monitoring catches the first; echo quantifies the second; the third clusters in the first week.' },
    ],
    crossLinks: [
      { conceptId: 'c-coronary', label: 'Coronary Artery Anatomy & Atherosclerosis', why: 'You cannot localise an infarct without knowing which artery feeds which wall.', subject: 'Anatomy' },
      { conceptId: 'c-troponin', label: 'Cardiac Biomarkers', why: 'The rise/fall logic of troponin is the laboratory half of the ACS story.' },
      { conceptId: 'c-ecg', label: 'ECG Basics', why: 'ST-segment morphology is the fastest diagnostic instrument in medicine.' },
      { conceptId: 'c-cvpath-athero', label: 'Atherosclerosis (Pathology)', why: 'The chronic disease whose acute complication is this emergency.' },
    ],
    global: [
      { region: 'India', terminology: ['"heart attack" is the common lay term; STEMI/NSTEMI are the medical terms'], workflow: 'Large public systems run STEMI hub-and-spoke networks — thrombolysis at peripheral centres, angioplasty at hubs; real-world transfer times drive protocol choice.', note: 'Systems differ by geography; the time principle is identical.' },
      { region: 'United States', workflow: 'Regional cardiac-resuscitation systems certify STEMI centres and prehospital ECG transmission to shorten door-to-balloon.', note: 'The prehospital ECG is the system-level accelerator — different country, same physics.' },
      { region: 'United Kingdom', workflow: 'NHS pathways route suspected ACS to rapid-assessment chest-pain units with protocolised troponin testing.', note: 'Organisational details differ; educational content (ECG + troponin logic) is shared.' },
      { region: 'WHO/Global', terminology: ['Ischaemic heart disease is the WHO’s term for the leading global cause of death'], note: 'WHO frames ACS as the acute manifestation of the world’s biggest chronic-disease burden — the epidemiology is the whyMatters.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; reperfusion windows, drug choices and troponin cut-offs are protocol- and assay-specific.',
    sources: [
      whoRef('Cardiovascular diseases — fact sheets and global burden framing'),
      niceRef('Acute coronary syndromes guidance'),
      jhmiRef('Heart attack patient-education resources'),
      ncbiRef('StatPearls — acute coronary syndrome'),
    ],
  },
  {
    id: 'c-htn',
    name: 'Systemic Hypertension',
    kind: 'disease',
    oneLiner: 'Persistently raised blood pressure — usually with no symptoms at all — that quietly damages the heart, brain, kidneys and eyes over years.',
    whyMatters: 'The most common chronic condition a doctor will manage, and the largest modifiable risk factor for stroke, heart attack and kidney failure; almost every prescription decision in medicine touches a hypertensive patient.',
    explain30s: 'Blood pressure is cardiac output times peripheral resistance. In ~90–95% of cases (primary hypertension) no single cause is found — it is genes, salt, weight, age and stress stacked up. Treatment matters because pressure injures vessel walls silently: the eyes, kidneys, brain and heart show the damage first. A small number of patients have a specific cause (secondary) — young age, sudden severity, resistant pressure — and finding it changes everything. Hypertensive emergency (pressure WITH acute organ damage) is an ICU event; pressure alone without damage is managed gradually.',
    eli5: 'Imagine a garden hose. The heart pushes water through it. If the hose is squeezed or stiff, the pressure gauge climbs. High pressure doesn’t hurt on day one — that’s the trap. It quietly bulges and scars the hose walls (vessels), and one day the sprinklers that got the most pressure (brain, kidneys, eyes, heart) break first. Medicine measures the gauge, tells you to use less salt, walk more, and if needed gives a pill that either turns down the pump or opens the squeeze. The scary version is not the high number itself — it’s high number PLUS a broken organ today.',
    firstPrinciples: [
      'Blood pressure = cardiac output × systemic vascular resistance — every antihypertensive drug works by lowering one or both.',
      'Pressure is regulated moment-to-moment by the sympathetic nervous system and long-term by the kidney’s RAAS — which is why kidney disease and hypertension travel together.',
      'Primary (essential) hypertension accounts for the vast majority: no single cause, but salt sensitivity, obesity, family history, alcohol, and ageing all raise the set-point.',
      'Secondary hypertension has a named cause — renal artery stenosis, primary aldosteronism, phaeochromocytoma, coarctation, drugs — and classic red flags are young age, abrupt onset, severe/resistant pressure, and spells.',
      'Chronic pressure injures endothelium → arteriosclerosis and left-ventricular hypertrophy → the end-organs tell the story: retina (hypertensive retinopathy), kidney (nephrosclerosis), brain (stroke), heart (LVH, failure).',
      'The diagnosis requires repeated, correctly-measured readings — a single clinic value never condemns a patient.',
      'The emergency/urgency line is drawn by ORGAN DAMAGE, not by the number alone — this is the most-tested principle in the topic.',
    ],
    normal: 'Classic teaching anchor: around 120/80 mmHg is normal in adults; persistent readings at or above 140/90 (office) define hypertension in most classic frameworks — exact thresholds and staging lines differ between current guidelines.',
    mechanism: 'Sustained pressure load → endothelial shear injury → stiff, thickened arterioles (hyaline arteriolosclerosis) → reduced organ perfusion reserve; the heart hypertrophies against the load; the kidney’s own arterioles scar, further activating RAAS — a self-amplifying loop.',
    presentation: [
      'Usually NOTHING — discovered at screening, insurance checks, or an unrelated visit.',
      'Headache (occipital, morning), epistaxis, dizziness are classically taught but uncommon as the first sign.',
      'Complications present the disease: stroke, MI, heart failure, declining eGFR, retinopathy on fundoscopy.',
      'Clues to secondary causes: young patient, hypokalaemia (aldosteronism), spells of sweating/palpitation (phaeochromocytoma), abdominal bruit (renal artery stenosis).',
    ],
    diagnosis: [
      'Correct technique first: proper cuff size, seated, rested, arm supported; confirm across multiple visits (or out-of-office ambulatory/home readings).',
      'Every new diagnosis needs a baseline organ survey: fundoscopy, ECG, urine protein, serum creatinine/electrolytes, glucose/lipids.',
      'Secondary-cause workup is selective — driven by the red flags above, not reflexive.',
    ],
    differentials: [
      { name: 'White-coat effect', key: 'High in clinic, normal at home — ambulatory monitoring settles it.' },
      { name: 'Secondary hypertension', key: 'Young, abrupt, resistant, or electrolyte clues — hunt for the named cause.' },
      { name: 'Pre-eclampsia', key: 'Pregnancy after 20 weeks changes the entire framework — see the obstetrics lesson.' },
    ],
    management: [
      'PRINCIPLE — lifestyle is the first prescription for everyone: salt reduction, weight loss, regular aerobic activity, alcohol moderation — each lowers pressure measurably and multiplies drug effect.',
      'PRINCIPLE — the major drug classes (diuretic, ACE inhibitor/ARB, calcium-channel blocker, beta-blocker) each attack a different input of CO × SVR; combination of two low-dose agents beats one high-dose agent when monotherapy fails.',
      'PRINCIPLE — treat to protect organs, not to chase a cosmetic number; follow-up verifies adherence and adverse effects (e.g. ACE-inhibitor cough, hyperkalaemia).',
      'PRINCIPLE — hypertensive EMERGENCY (acute organ damage: encephalopathy, pulmonary oedema, aortic dissection, eclampsia) needs controlled intravenous lowering in monitored settings; sudden over-correction risks hypoperfusion.',
    ],
    complications: [
      'Stroke (ischaemic and haemorrhagic) — the brain is the most pressure-sensitive vital organ.',
      'Ischaemic heart disease and heart failure with preserved or reduced ejection fraction.',
      'Hypertensive nephrosclerosis → CKD → accelerated vascular disease (the loop).',
      'Hypertensive retinopathy — papilloedema and flame haemorrhages mark the emergency end.',
      'Aortic dissection — the catastrophic mechanical complication.',
    ],
    numbers: [
      { label: 'Normal (classic teaching anchor)', value: '≈120/80 mmHg', note: 'The reference point every staging system is built from.' },
      { label: 'Hypertension (classic office anchor)', value: '≥140/90 mmHg persistent', note: 'Widely taught cut-off; current national guidelines stage differently above this line — compare before quoting a stage.' },
      { label: 'Severe/Emergency territory', value: 'Severe elevation with ACUTE organ damage defines emergency', note: 'The number alone never makes the emergency; the organ does.' },
    ],
    drugs: [
      { name: 'ACE inhibitors / ARBs', drugClass: 'RAAS blockers', mechanism: 'Block angiotensin II generation or receptor → vasodilation, less aldosterone, renal protection', note: 'Cough (bradykinin) for ACEi; both risk hyperkalaemia — avoid in pregnancy.' },
      { name: 'Calcium-channel blockers', drugClass: 'Vasodilator/heart-rate classes', mechanism: 'Vascular smooth-muscle calcium entry blocked → resistance falls', note: 'Ankle oedema is the classic nuisance effect.' },
      { name: 'Thiazide diuretics', drugClass: 'Diuretic', mechanism: 'Natriuresis lowers volume and, long-term, vascular resistance', note: 'Watch glucose/urate/electrolytes — classic exam associations.' },
      { name: 'Beta-blockers', drugClass: 'Adrenergic blocker', mechanism: 'Lower cardiac output and renin release', note: 'Special niches (post-MI, rate control) rather than universal first-line — guideline-dependent.' },
    ],
    mistakes: [
      'Diagnosing on one reading — hypertension is a repeated-measurement diagnosis.',
      'Deciding emergency vs urgency by the number instead of the organ.',
      'Starting two drugs at max dose simultaneously instead of rational low-dose combination.',
      'Forgetting that ACE inhibitors are contraindicated in pregnancy and bilateral renal artery stenosis.',
    ],
    mnemonics: [
      { hook: 'CO × SVR', expands: 'Cardiac output × systemic vascular resistance — every antihypertensive drug must land on one side of this equation.' },
      { hook: 'ABCD', expands: 'ACE/ARB, Beta-blocker, CCB, Diuretic — the four classic families of stepwise therapy.' },
    ],
    crossLinks: [
      { conceptId: 'c-raas', label: 'RAAS & Blood Pressure (Physiology)', why: 'The regulatory loop hypertension exploits and half the drug cabinet targets.' },
      { conceptId: 'c-acei', label: 'ACE Inhibitors (Pharmacology)', why: 'Mechanism-to-clinic mapping: renal protection, cough, hyperkalaemia.' },
      { conceptId: 'c-nephritic', label: 'Glomerular Diseases (Pathology)', why: 'When the kidney is the cause and when it is the victim — the two directions of one loop.' },
      { conceptId: 'c-cvpath-athero', label: 'Atherosclerosis (Pathology)', why: 'Pressure accelerates every atherosclerotic pathway — hypertension is its chief accomplice.' },
    ],
    global: [
      { region: 'India', delivery: 'Population screening happens through PHCs/CHCs, national NCD screening programmes and opportunistic checks; ashas/health workers increasingly measure pressure in communities.', note: 'Detection, not the drug, is the bottleneck in most low-resource settings.' },
      { region: 'United States', screening: 'Routine office BP screening at adult visits, with home/ambulatory confirmation emphasised; guideline bodies publish staging tables that differ from other countries.', note: 'Thresholds have moved between guideline revisions — always check the current table.' },
      { region: 'United Kingdom', delivery: 'Diagnosis and annual review run through GP practices, with NHS health-check programmes for adults; pharmacy-based BP services have expanded.', note: 'The GP-registry model contrasts with India’s programme model — same disease, different delivery.' },
      { region: 'WHO/Global', terminology: ['Raised blood pressure', 'NCD "best buys" for population salt/alcohol/tobacco policy'], note: 'WHO treats hypertension as a flagship NCD target — population salt policy is the lever patients never see.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; staging thresholds and first-line drug choice vary by national guideline and revision year.',
    sources: [
      whoRef('Hypertension — fact sheet and NCD framing'),
      niceRef('Hypertension in adults — diagnosis and management'),
      cdcRef('Blood pressure measurement and control resources'),
      ncbiRef('StatPearls — hypertension'),
    ],
  },
  {
    id: 'c-dm',
    name: 'Diabetes Mellitus',
    kind: 'disease',
    oneLiner: 'A group of disorders sharing one final pathway — chronically raised blood glucose — but with different engines: autoimmune insulin lack (type 1), insulin resistance with relative deficiency (type 2), and the hormone storm of pregnancy (gestational).',
    whyMatters: 'One of the fastest-growing epidemics on earth and India’s flagship NCD; it damages every organ through the same sugar-rich blood, and its complications are the leading cause of blindness, kidney failure and amputation in adults.',
    explain30s: 'Glucose is fuel; insulin is the key that lets fuel into cells. In type 1 the pancreas stops making keys (autoimmune β-cell destruction) — patients are young, lean, prone to ketoacidosis, and absolutely need insulin. In type 2 the locks jam (insulin resistance) and the pancreas tires — the common adult disease tied to weight and genes, managed stepwise from lifestyle to metformin onward. Diagnosis is biochemical: fasting glucose ≥126 mg/dL, 2-hour OGTT ≥200, HbA1c ≥6.5%, or random ≥200 with symptoms (classic criteria). Complications split into microvascular (retina, kidney, nerve) and macrovascular (heart attack, stroke) — all slowed by the same twin strategy: glucose control + risk-factor control.',
    eli5: 'Your body runs on sugar from food. Insulin is like the doorman who lets sugar into your rooms. In type 1 diabetes, the doorman factory (pancreas) shuts down — no doormen at all, so sugar piles up in the street (blood). Those kids need doormen delivered by injection, forever. In type 2 diabetes, the locks on the doors get rusty — doormen exist but keys barely work — so the factory pumps harder and harder until it’s exhausted. Grown-ups with rusty locks can fix a lot by walking, eating better, and taking a pill (metformin) that makes locks work better. Sticky sugar in the street slowly glues up the tiny pipes of the eyes, kidneys and nerves — that’s why doctors check them every year.',
    firstPrinciples: [
      'Insulin is the only hormone that lowers blood glucose — it moves glucose into muscle/fat, stores it in liver as glycogen, and stops the liver manufacturing new glucose.',
      'Type 1: T-cell-mediated autoimmune destruction of pancreatic β-cells → absolute insulin deficiency; glucose cannot enter cells while the liver keeps dumping glucose + ketones → lean, younger patients, weight loss, DKA risk.',
      'Type 2: genetic predisposition + adiposity → tissues resist insulin (locks jam) → compensatory hyperinsulinaemia for years → β-cell fatigue → relative deficiency; the metabolic syndrome (obesity, hypertension, dyslipidaemia) travels with it.',
      'Gestational diabetes: placental hormones create physiological insulin resistance; when the pancreas cannot compensate, glucose rises — screening in pregnancy is standard because both mother and baby are at risk.',
      'Hyperglycaemia damages three tissues with insulin-independent glucose entry — nerve, retina, glomerulus — via protein glycation and microvascular injury; large arteries age faster through accelerated atherosclerosis.',
      'The diagnostic numbers exist because risk rises continuously — cut-offs mark where complication-risk curves steepen (HbA1c ≥6.5% is the classic diagnostic anchor, reflecting ~8–12 weeks of average glycaemia).',
      'Management is a two-front war: lower glucose AND attack the shared risk factors (pressure, lipids, smoking) — because most mortality in type 2 is cardiovascular, not renal.',
    ],
    normal: 'Fasting plasma glucose below 100 mg/dL; HbA1c below 5.7% (classic normal anchor); insulin secreted in two phases matching meals; ketones produced only during fasting states.',
    mechanism: 'Type 1: molecular mimicry/autoimmunity → insulitis → β-cell loss. Type 2: lipotoxicity + inflammatory cytokines + ectopic fat → insulin signalling fails at the receptor/post-receptor level → hepatic glucose output unopposed → hyperglycaemia → glucotoxicity further poisons β-cells (the forward cascade).',
    presentation: [
      'Classic triad/tetrad: polyuria (osmotic diuresis), polydipsia, polyphagia, weight loss.',
      'Type 1: weeks of rapid symptoms, often young and lean; may present in DKA (vomiting, abdominal pain, Kussmaul breathing, fruity breath).',
      'Type 2: years of silence — found on routine testing, or first seen as a complication (neuropathy, retinopathy, recurrent infections, slow-healing ulcers).',
      'Skin signs: acanthosis nigricans (insulin resistance marker), candidal infections.',
    ],
    diagnosis: [
      'Fasting plasma glucose ≥126 mg/dL (after 8-hour fast) — classic diagnostic criterion.',
      'HbA1c ≥6.5% — glycated haemoglobin reflecting ~8–12 weeks of average glucose; confounded by anaemia/haemoglobinopathies (the classic trap).',
      '2-hour OGTT ≥200 mg/dL (75 g load); random glucose ≥200 with classic symptoms.',
      'Type 1 markers: autoantibodies (GAD, IA-2), low C-peptide — used when the type is unclear.',
    ],
    differentials: [
      { name: 'Type 1 vs type 2', key: 'Age and body habitus are weak discriminators; ketoacidosis at onset, autoantibodies and low C-peptide decide.' },
      { name: 'Secondary diabetes', key: 'Steroids, pancreatitis/pancreatectomy, Cushing’s, acromegaly — the underlying disease names it.' },
      { name: 'Diabetes insipidus', key: 'Causes polyuria/polydipsia WITHOUT hyperglycaemia — a naming trap, not a sugar problem.' },
      { name: 'Stress hyperglycaemia', key: 'Acute illness transiently raises glucose; re-test after recovery before labelling.' },
    ],
    management: [
      'PRINCIPLE — type 1 is insulin-dependent from day one: basal-bolus physiology mimicry, carbohydrate-awareness education, and DKA-sick-day rules; insulin regimens are individualised and protocol-driven.',
      'PRINCIPLE — type 2 management is a stepwise pyramid: lifestyle foundation → metformin (classic first-line) → add agents chosen by comorbidity (heart/kidney/weight) → insulin when the pancreas fails; injection/dose details are protocol territory.',
      'PRINCIPLE — the complications clinic is preventive: annual retina check, urine albumin-to-creatinine, foot examination, pressure/lipid control — each is a proven amputation/blindness/dialysis-saver.',
      'PRINCIPLE — HbA1c is the steering instrument (typically checked ~3-monthly during titration); target is individualised (age, hypoglycaemia risk, comorbidity).',
    ],
    complications: [
      'Microvascular: retinopathy (background → proliferative), nephropathy (microalbuminuria → CKD), neuropathy (distal symmetrical, autonomic).',
      'Macrovascular: coronary, cerebral and peripheral arterial disease — the leading killer in type 2.',
      'Diabetic foot: neuropathy + ischaemia + infection → the ulceration-amputation cascade.',
      'Acute: DKA (type 1 flag) and hyperosmolar hyperglycaemic state (type 2 flag); hypoglycaemia as the treatment’s own complication.',
      'Increased infection susceptibility — glucosuria feeds organisms; immunity is blunted.',
    ],
    numbers: [
      { label: 'HbA1c diagnostic cut-off', value: '≥6.5%', note: 'The classic diagnostic anchor; the same value is ~48 mmol/mol in the IFCC unit system used elsewhere.' },
      { label: 'Fasting plasma glucose', value: '≥126 mg/dL (7.0 mmol/L)', note: 'After an 8-hour fast; 100–125 mg/dL is the classic "prediabetes/impaired fasting glucose" band.' },
      { label: '2-hour OGTT / random', value: 'OGTT ≥200 mg/dL; random ≥200 mg/dL with symptoms', note: 'OGTT uses a 75 g glucose load; random requires classic symptoms.' },
      { label: 'HbA1c meaning', value: 'Reflects average glycaemia over ~8–12 weeks (red-cell lifespan)', note: 'Falsely low in haemolysis (fewer old red cells), distorted in haemoglobinopathies — the classic confounder question.' },
    ],
    drugs: [
      { name: 'Insulin', drugClass: 'Peptide hormone (injectable)', mechanism: 'Replaces the missing key — drives glucose into cells, suppresses hepatic output and ketogenesis', note: 'The only therapy for type 1; basal vs bolus mimics physiological secretion.' },
      { name: 'Metformin', drugClass: 'Biguanide', mechanism: 'Reduces hepatic glucose output and improves insulin sensitivity; does not cause hypoglycaemia alone', note: 'Classic first-line in type 2; caution in severe renal impairment; GI upset is the common nuisance.' },
      { name: 'Sulfonylureas (e.g. glimepiride)', drugClass: 'Insulin secretagogue', mechanism: 'Closes β-cell K-ATP channels → insulin release regardless of glucose', note: 'Hypoglycaemia and weight gain are the classic trade-offs.' },
      { name: 'SGLT2 inhibitors', drugClass: 'Renal glucose excretor', mechanism: 'Blocks glucose reabsorption in proximal tubule → sugar leaves in urine', note: 'Heart/kidney benefits beyond glucose; genital mycotic infections and euglycaemic DKA are the classic cautions.' },
    ],
    mistakes: [
      'Using HbA1c in an anaemic patient without thinking — haemolysis (low) and iron deficiency (high) distort it.',
      'Assuming only thin young patients get type 1 and only the obese get type 2 — biology crosses both lines.',
      'Missing DKA in a patient with normal/modest glucose (euglycaemic DKA, e.g. on SGLT2 inhibitors).',
      'Treating glucose while ignoring pressure and lipids — most type 2 patients die of the arteries, not the kidneys.',
    ],
    mnemonics: [
      { hook: 'Poly-uria, poly-dipsia, poly-phagia', expands: 'Osmotic diuresis pulls water (thirst) and calories starve cells despite plenty (hunger + weight loss).' },
      { hook: 'DKA = Kussmaul + ketones + K down', expands: 'Deep sighing breathing, fruity acetone breath, and total-body potassium depletion despite high serum K — the classic electrolyte paradox.' },
    ],
    crossLinks: [
      { conceptId: 'c-hba1c', label: 'HbA1c (Biochemistry)', why: 'The glycation chemistry behind the most-used monitoring number in medicine.' },
      { conceptId: 'c-insulin', label: 'Insulin & Glucose Homeostasis (Physiology)', why: 'Every management decision is applied insulin physiology.' },
      { conceptId: 'c-metformin', label: 'Metformin (Pharmacology)', why: 'The classic first-line drug, mechanism-first.' },
      { conceptId: 'c-dka', label: 'Diabetic Ketoacidosis', why: 'The acute-on-chronic emergency every diabetes ward fears.' },
      { conceptId: 'c-diabretino', label: 'Diabetic Retinopathy (Ophthalmology)', why: 'The complication that makes annual screening non-negotiable.' },
    ],
    global: [
      { region: 'India', delivery: 'National NCD programmes run diabetes screening through PHCs/CHCs; NPCDCS-style delivery pairs diabetes and hypertension services.', note: 'India is often called the diabetes capital of the world — the epidemiology is the clinical setting.' },
      { region: 'United States', screening: 'Screening recommended for adults with overweight/obesity and risk factors, and from mid-30s broadly per major US bodies; HbA1c ≥6.5% is a diagnostic criterion shared across systems.', note: 'Device regulation (glucose meters, CGM) falls under FDA oversight.' },
      { region: 'United Kingdom', delivery: 'GP-registered structured annual reviews — the "15 healthcare essentials" model of yearly complication surveillance.', note: 'A registry-driven review model that India’s clinics adapt in their own ways.' },
      { region: 'WHO/Global', terminology: ['HbA1c reported as % (DCCT) vs mmol/mol (IFCC)'], note: 'The same patient’s number looks different across unit systems — a genuinely global terminology trap.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; diagnostic criteria, targets and drug sequencing are guideline-specific and revised periodically.',
    sources: [
      whoRef('Diabetes — fact sheet and classification framing'),
      cdcRef('Diabetes diagnostic criteria and prevention education'),
      fdaRef('Blood glucose meters and continuous monitors — device regulation context'),
      ncbiRef('StatPearls — diabetes mellitus'),
    ],
  },
  {
    id: 'c2-medicine-stroke',
    name: 'Stroke & Cerebrovascular Disease',
    kind: 'disease',
    oneLiner: 'Sudden loss of brain function from interrupted blood flow — a blocked artery (ischaemic) or a burst vessel (haemorrhagic) — where minutes decide which brain tissue survives.',
    whyMatters: 'A leading cause of death and adult disability worldwide; it is the classic "time-critical, bedside-diagnosed" emergency, and the FAST message has made it the model disease for public recognition of a medical emergency.',
    explain30s: 'Brain cells die without blood within minutes. Two families: ischaemic stroke (a clot blocks a vessel — from local atherosclerosis, a travelling clot from the heart, or small-vessel disease) and haemorrhagic stroke (a vessel bursts — hypertension is the classic driver). The clinical signature is SUDDEN, focal, negative (loss of function): face droop, arm weakness, speech loss, vision field loss, sudden imbalance. The FAST mnemonic exists to get patients to hospital inside the treatment window — thrombolysis (clot-dissolving) is possible for selected ischaemic strokes when given early; haemorrhage needs blood-pressure control and sometimes surgery. The first investigation is a CT: to tell blood from blockage before any treatment decision.',
    eli5: 'The brain is a city, and blood vessels are its roads. A stroke is when one road suddenly blocks (a truck of blood-clot parked across it) or bursts (water pipe breaks and floods the street). Whatever the city block behind that road does — talking, moving your arm, seeing — that block goes dark, suddenly. There’s a rhyme for spotting it: FAST — Face drooping, Arm weakness, Speech trouble, Time to call the ambulance. Because here’s the rule: every minute the road stays shut, more of the city dies. Doctors first take a picture (CT scan) to check WHICH kind of problem it is — flood or blockage — because the medicines are opposites: one dissolves clots, the other must not.',
    firstPrinciples: [
      'Neurons have near-zero anaerobic reserve — flow stoppage begins injury within seconds and a core of infarction within minutes; this is why stroke is the archetypal time emergency.',
      'Two mechanisms, opposite treatments: ischaemia (occlusion) vs haemorrhage (rupture) — and you cannot reliably tell them apart clinically, which is why imaging comes first.',
      'Ischaemic stroke has three classic sources: large-artery atherosclerosis with artery-to-artery emboli, cardioembolism (atrial fibrillation is the flagship), and small-vessel lacunar disease — the workup is a hunt through these three.',
      'Haemorrhage splits into intracerebral (hypertensive small-vessel rupture — basal ganglia, thalamus, pons, cerebellum) and subarachnoid (aneurysmal, thunderclap headache).',
      'A vascular territory predicts the deficit: middle cerebral artery → face/arm-predominant weakness + speech (dominant hemisphere); posterior circulation → vertigo, diplopia, ataxia; the deficit pattern is the anatomy exam.',
      'Around the dead core sits the penumbra — stunned, salvageable tissue whose survival depends on restoring flow fast; every treatment (and every minute of delay) is a bet on the penumbra.',
      'TIA (transient ischaemic attack) is the same mechanism, fully recovered — and a massive warning of imminent stroke; it is never "a small thing".',
    ],
    normal: 'Brain blood flow is tightly autoregulated across pressure ranges; carotid/vertebral systems meet in the Circle of Willis providing collateral routes; no focal deficit on examination.',
    mechanism: 'Occlusion → core infarction with excitotoxicity and oedema; haemorrhage → mass effect, raised intracranial pressure and toxic blood effects on tissue; both converge on the final common pathway of neuronal death.',
    presentation: [
      'SUDDEN focal deficit: hemiparesis (face/arm often worse than leg in MCA), aphasia or dysarthria, visual field loss, sudden severe imbalance.',
      'FAST public message: Face droop, Arm drift, Speech disturbance, Time to call emergency services.',
      'Haemorrhagic clues: headache, vomiting, reduced consciousness, very high BP — but overlap is too wide to rely on clinically.',
      'Thunderclap headache ("worst ever, instant peak") suggests subarachnoid haemorrhage — different pathway, same urgency.',
    ],
    diagnosis: [
      'Non-contrast CT first: excludes haemorrhage (the treatment gate) and shows early ischaemic change; the clinical score (NIHSS concept) standardises deficit measurement.',
      'Glucose at the bedside — hypoglycaemia mimics stroke perfectly and is instantly correctable (the classic first exclusion).',
      'Then etiology hunt: ECG/telemetry for atrial fibrillation, carotid imaging, cardiac echo as indicated.',
      'MRI-DWI is far more sensitive for early/posterior infarcts when the picture is unclear.',
    ],
    differentials: [
      { name: 'Hypoglycaemia', key: 'Any focal-looking deficit in a diabetic — check glucose before anything else.' },
      { name: 'Seizure with Todd’s paresis', key: 'Positive (shaking) onset, gradual resolution, post-ictal course.' },
      { name: 'Migraine with aura', key: 'Spreading positive phenomena (scintillating scotoma, tingling) — stroke is sudden and negative.' },
      { name: 'Subdural haematoma', key: 'Subacute fluctuating course in the elderly/alcoholics — a bleed, not an infarct, but still a CT story.' },
    ],
    management: [
      'PRINCIPLE — the time window: thrombolysis for selected ischaemic strokes is given early (the classically taught window is hours, not days — exact cut-offs depend on imaging, drug and current guideline); mechanical thrombectomy extends options for large-vessel occlusion in select cases.',
      'PRINCIPLE — image first: no thrombolysis before haemorrhage is excluded; blood pressure in acute ischaemic stroke is deliberately NOT aggressively lowered (perfusion depends on pressure) — the opposite of most emergencies.',
      'PRINCIPLE — the stroke unit saves lives more than any single drug: organised monitoring, swallowing assessment before oral intake, early mobilisation, DVT prevention.',
      'PRINCIPLE — secondary prevention is mechanism-specific: antiplatelets for non-cardioembolic infarct, anticoagulation for atrial fibrillation, statin and pressure control universally, carotid endarterectomy for selected symptomatic stenosis.',
      'PRINCIPLE — haemorrhagic stroke: pressure control, reversal of anticoagulants, neurosurgical consultation for evacuation in selected cases.',
    ],
    complications: [
      'Malignant MCA oedema with herniation in the first days — the early killer.',
      'Aspiration pneumonia (unsafe swallow), pressure sores, DVT/PE — the disability complications.',
      'Post-stroke spasticity, shoulder pain, depression — the rehabilitation agenda.',
      'Epilepsy, and recurrence if the mechanism is not treated.',
    ],
    numbers: [
      { label: 'FAST', value: 'Face · Arm · Speech · Time', note: 'The public-recognition tool — its success is measured in patients arriving inside the treatment window.' },
      { label: 'Treatment-window concept', value: 'Reperfusion options are time-dependent (hours)', note: 'Exact windows have evolved with imaging-based selection — quote the concept, verify the current cut-off.' },
      { label: 'Classic territory rule', value: 'MCA = face/arm + speech; posterior = dizziness/diplopia/ataxia', note: 'The deficit localises the artery — the examiner’s favourite question.' },
    ],
    mistakes: [
      'Giving aspirin/anticoagulation before the CT — in a haemorrhage this is a catastrophe.',
      'Aggressively lowering BP in acute ischaemic stroke — you drop the penumbra’s perfusion.',
      'Feeding a patient before swallow assessment — silent aspiration is the commonest early complication.',
      'Dismissing a resolved TIA as "nothing happened" — it is the loudest warning the vascular system gives.',
    ],
    mnemonics: [
      { hook: 'FAST', expands: 'Face, Arms, Speech, Time — the worldwide public-health message.' },
    ],
    reasoning: [
      { stage: 'symptom', label: 'Sudden face/arm weakness + slurred speech', detail: 'Negative, focal, maximal at onset — the stroke signature.' },
      { stage: 'mechanism', label: 'Occlusion vs rupture', detail: 'Both cut neurons off from blood; the treatments are opposite, so mechanism must be proven.' },
      { stage: 'differential', label: 'Glucose, seizure, migraine, subdural', detail: 'Bedside glucose first; positive phenomena and subacute courses redirect.' },
      { stage: 'investigation', label: 'Urgent non-contrast CT + NIHSS scoring', detail: 'Blood vs no blood decides the pathway; the score standardises severity.' },
      { stage: 'interpretation', label: 'Ischaemic MCA infarct, inside window', detail: 'No blood on CT, deficit localises to MCA, arrival within the reperfusion window.' },
      { stage: 'diagnosis', label: 'Acute ischaemic stroke — anterior circulation', detail: 'Mechanism hunt queued (AF, carotid) for the days after.' },
      { stage: 'management', label: 'Reperfusion decision + stroke unit', detail: 'Thrombolysis/thrombectomy per protocol; swallow check; pressure left permissive.' },
      { stage: 'complication', label: 'Oedema, aspiration, spasticity', detail: 'Anticipated and monitored — complications of stroke are as organised as its treatment.' },
    ],
    crossLinks: [
      { conceptId: 'c-htn', label: 'Systemic Hypertension (Medicine)', why: 'The top modifiable driver of both stroke families.' },
      { conceptId: 'c-arrhythmia', label: 'Arrhythmias', why: 'Atrial fibrillation turns the left atrium into a clot factory — cardioembolic stroke.' },
      { conceptId: 'c-cvpath-athero', label: 'Atherosclerosis (Pathology)', why: 'Carotid plaque is the supply chain of artery-to-artery emboli.' },
    ],
    global: [
      { region: 'India', emergency: 'National ambulance numbers 108/112 route to stroke-capable hospitals where available; many districts still rely on transfer networks to reach CT quickly.', note: 'Access to imaging is the rate-limiting step in much of the world.' },
      { region: 'United States', workflow: 'Certified Primary/Comprehensive Stroke Centers with prehospital destination protocols and door-to-needle performance metrics.', note: 'System-of-care certification is the US model’s contribution.' },
      { region: 'United Kingdom', workflow: 'Hyper-Acute Stroke Units (HASU) centralise first-hours care before step-down rehabilitation.', note: 'Centralisation logic mirrors trauma systems.' },
      { region: 'WHO/Global', terminology: ['Cerebrovascular accident (CVA) is the legacy term; "stroke" is preferred'], note: 'WHO ranks stroke among the top causes of death globally — disability, not just mortality, is the burden.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; thrombolysis/thrombectomy windows and BP targets are protocol-specific and evolve with imaging selection.',
    sources: [
      whoRef('Stroke, cerebrovascular disorders and rehabilitation framing'),
      niceRef('Stroke and transient ischaemic attack in over 16s'),
      cdcRef('Stroke recognition and FAST public education'),
      ncbiRef('StatPearls — acute stroke evaluation'),
    ],
  },
  {
    id: 'c2-medicine-pneumonia',
    name: 'Pneumonia',
    kind: 'disease',
    oneLiner: 'Infection of the lung parenchyma — alveoli fill with pus instead of air — ranging from a treatable community illness to a life-threatening sepsis.',
    whyMatters: 'Among the top infectious killers worldwide across all ages, and the perfect teaching disease: one pathophysiology (consolidation), one physical-sign cluster (crackles, dullness, bronchial breathing) and one decision tool (CURB-65) that turns bedside findings into admission logic.',
    explain30s: 'Germs reach the lower airway when defences fail — viral illness, aspiration, smoking, immunity gaps. Alveoli fill with inflammatory exudate ("consolidation"): fever, productive cough, pleuritic pain, crackles, and dullness where air used to be. Community-acquired pneumonia (CAP) is the classic exam framing; severity decides site of care, and CURB-65 is the classic teaching tool (Confusion, Urea >7 mmol/L, Respiratory rate ≥30, Blood pressure <90/60, age ≥65) — each point pushes toward hospital and ICU. Typical organisms (S. pneumoniae) give lobar patterns; atypicals (Mycoplasma, Legionella, Chlamydophila) give patchier, more indolent pictures. Antibiotics by setting and severity; complications range from parapneumonic effusion to sepsis.',
    eli5: 'Your lungs are like two sponges full of tiny air balloons. Pneumonia means germs have gotten into the balloons and made them fill with pus — like sponges soaked in soup instead of air. Soup-filled balloons can’t hold air, so breathing feels hard and the chest sounds crackly when a doctor listens. Good news: for bacteria, medicines (antibiotics) help the body clear the soup. Doctors ask: is this person safe to fight at home, or do they need the hospital? They count five danger signs (called CURB-65): feeling confused, a lab clue in the blood, breathing too fast, low blood pressure, and being over 65. More signs = higher level of care.',
    firstPrinciples: [
      'The lung sterile-tissue rule: below the vocal cords the airway is normally near-sterile — defence is mucociliary clearance, cough, alveolar macrophages and secretory IgA.',
      'Infection begins when inoculum overwhelms defence or defence fails (viral URTI, smoking, alcohol, stroke-related aspiration, immunosuppression, age).',
      'The inflammatory response fills alveoli with exudate — the radiological and physical finding is CONSOLIDATION: air replaced by fluid/protein.',
      'Consolidation explains every classic sign: crackles, dull percussion, bronchial breathing, increased vocal resonance — and the silhouette sign on X-ray.',
      'Severity is systemic, not local: pneumonia kills through hypoxaemia and sepsis, so scoring systems (CURB-65 concept) measure the systemic spill.',
      'Organism prediction follows setting: community vs hospital vs aspiration vs immunosuppressed — each has its own flora spectrum, which is why "setting" drives empiric antibiotic choice.',
      'Resolution requires re-aeration: follow-up checks for non-resolution (obstructing lesion, empyema, wrong organism) when the story doesn’t settle.',
    ],
    normal: 'Alveoli are air-filled with thin septa; breath sounds are vesicular, percussion resonant; the chest radiograph shows lucent lung fields with visible vascular markings only.',
    mechanism: 'Pathogen breaches defences → neutrophil-rich exudate floods alveoli → consolidation progresses through congestion → red/grey hepatization → resolution (the classic pathology arc); systemic spill via cytokines produces fever and, in severe cases, septic physiology.',
    presentation: [
      'Acute febrile illness with productive cough (purulent/rusty sputum) and pleuritic chest pain.',
      'Breathlessness; tachypnoea and tachycardia — the first severity red flags at the bedside.',
      'Elderly and immunosuppressed may present with confusion or decline WITHOUT fever — the classic atypical presentation.',
      'Legionella clues (contextual): diarrhoea, confusion, hyponatraemia in a severe pneumonia.',
    ],
    diagnosis: [
      'Chest X-ray: lobar consolidation, patchy bronchopneumonia, or interstitial patterns; a normal X-ray makes pneumonia unlikely (CT if strongly suspected).',
      'Severity scoring: CURB-65 concept — Confusion, Urea >7 mmol/L, Respiratory rate ≥30, Blood pressure systolic <90 or diastolic ≤60, age ≥65.',
      'Cultures (sputum/blood) where severe; urinary antigens for pneumococcus/legionella in selected cases; inflammatory markers (CRP) support but never replace the clinical-X-ray pair.',
      'Oxygen saturation on every patient — hypoxaemia is the immediate threat.',
    ],
    differentials: [
      { name: 'Pulmonary tuberculosis', key: 'Subacute weeks of cough, weight loss, night sweats — upper-lobe/cavitating on film (see the TB lessons).' },
      { name: 'Lung cancer with post-obstructive infection', key: 'Non-resolving pneumonia in a smoker — the classic "why hasn’t it cleared" X-ray.' },
      { name: 'Pulmonary embolism', key: 'Pleuritic pain and breathlessness without productive fever; clear X-ray early.' },
      { name: 'Heart failure', key: 'Bilateral basal crackles and oedema, not febrile consolidation — but they coexist often in the elderly.' },
    ],
    management: [
      'PRINCIPLE — site of care follows severity: CURB-65 concept guides home vs ward vs ICU; hypoxaemia (SpO2 below target) needs oxygen regardless of score.',
      'PRINCIPLE — empiric antibiotics are chosen by SETTING and severity (community vs hospital vs aspiration vs immunosuppressed spectra), then narrowed when cultures return.',
      'PRINCIPLE — fluids and monitoring treat the systemic spill; severe pneumonia is managed as sepsis (early antibiotics, resuscitation) — see the shock and sepsis lessons.',
      'PRINCIPLE — prevention is part of the disease: pneumococcal vaccination, smoking cessation, influenza vaccination in risk groups.',
    ],
    complications: [
      'Parapneumonic effusion → empyema (infected pleural space — needs drainage).',
      'Sepsis and multi-organ failure — the mortality pathway.',
      'Lung abscess (especially aspiration, Klebsiella in alcohol misuse).',
      'Respiratory failure requiring ventilatory support; ARDS in severe cases.',
    ],
    numbers: [
      { label: 'CURB-65 components', value: 'Confusion · Urea >7 mmol/L · Respiratory rate ≥30 · BP <90 systolic / ≤60 diastolic · age ≥65', note: 'The classic teaching score — 0–1 often outpatient, rising scores escalate care (exact thresholds vary by guideline).' },
      { label: 'Classic bedside red flags', value: 'Respiratory rate ≥30 and hypotension', note: 'The two components you can measure without a lab — the triage reflex.' },
      { label: 'Oxygen target (concept)', value: 'SpO2 kept within guideline target ranges', note: 'Exact targets are protocol-specific; hypoxaemia always escalates care.' },
    ],
    mistakes: [
      'Diagnosing pneumonia without imaging and treating every cough with antibiotics.',
      'Forgetting that elderly patients may be afebrile and present only with confusion.',
      'Ignoring a non-resolving chest X-ray in a smoker — post-obstructive cancer hides behind "pneumonia".',
      'Missing empyema when a patient recovers slowly with persistent fever and effusion.',
    ],
    mnemonics: [
      { hook: 'CURB-65', expands: 'Confusion, Urea, Respiratory rate, Blood pressure, age 65 — severity by five checkboxes.' },
    ],
    crossLinks: [
      { conceptId: 'c-asthma-copd', label: 'Obstructive Airway Disease', why: 'COPD is both the commonest host factor and the frequent comorbid context of pneumonia.' },
      { conceptId: 'c2-microbiology-sepsis', label: 'Sepsis (Microbiology pack)', why: 'Severe pneumonia is managed in the sepsis framework — antibiotics + resuscitation.' },
      { conceptId: 'c-shock', label: 'Shock (this pack)', why: 'The end of the severity curve is distributive shock from sepsis.' },
    ],
    evidenceLevel: 'widely-taught',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; antibiotic regimens, thresholds and score interpretations are guideline- and setting-specific.',
    sources: [
      whoRef('Pneumonia in children — global burden and management framing'),
      niceRef('Pneumonia in adults — diagnosis and management'),
      cdcRef('Pneumonia causes, prevention and vaccination'),
      ncbiRef('StatPearls — community-acquired pneumonia'),
    ],
  },
  {
    id: 'c2-medicine-anemia',
    name: 'Approach to Anemia',
    kind: 'principle',
    oneLiner: 'A low haemoglobin is not a diagnosis — it is a clue, and the fastest way through the clue is morphology: small cells (microcytic), normal cells (normocytic), or big cells (macrocytic).',
    whyMatters: 'Anemia is one of the commonest abnormal findings in all of medicine — in India, iron deficiency and anaemia of chronic disease touch most clinics — and a structured approach prevents the classic miss (blaming iron deficiency while a GI cancer bleeds).',
    explain30s: 'First confirm and gauge: Hb below classic adult anchors (≈13 g/dL men, ≈12 g/dL women — WHO framing). Then look at the red cells: MCV small → think iron deficiency, thalassemia, chronic disease (the iron-studies panel separates them). MCV normal → think acute blood loss, chronic disease, kidney disease, haemolysis, or early mixed deficiency. MCV large → B12/folate deficiency, liver disease, hypothyroidism, or myelodysplasia — B12 deficiency also damages nerves, so it is the one you must not miss. Then ask the three questions that finish the job: bleeding?, not-making?, destroying? (reticulocyte count answers the last two).',
    eli5: 'Haemoglobin is the red taxi that carries oxygen around your body. Anemia means too few taxis. Now play detective with taxi size. Tiny taxis: usually the factory ran out of iron — the metal for building them (or the blueprint is faulty — thalassemia). Regular taxis: either some taxis were just destroyed or lost (bleeding), or the factory slowed down (long illness, kidneys). Giant taxis: the factory lacked a special vitamin — B12 or folate — the paperwork vitamins. Here’s the scary part: B12 problems don’t just make you tired — they damage the nerves of your legs and spine. So doctors always check size first, then ask: lost? not made? destroyed? — and reticulocytes (baby taxis fresh from the factory) tell you if the factory is working.',
    firstPrinciples: [
      'Haemoglobin carries oxygen; its level falls when red cells are LOST (bleeding), DESTROYED (haemolysis), or UNDER-PRODUCED (marrow/nutrition/hormone failure) — every anemia is one of these three, or a mix.',
      'MCV (mean cell volume) sorts under-production into microcytic, normocytic and macrocytic — the cheapest, highest-yield fork in the tree.',
      'Microcytic logic: haemoglobin synthesis needs iron + globin + porphyrin — iron deficiency, thalassemia (globin), and anaemia of chronic disease (iron locked away) each starve a different ingredient; iron studies (ferritin etc.) arbitrate.',
      'Macrocytic logic: DNA synthesis needs B12 and folate — deficiency slows nuclear maturation while cytoplasm keeps growing (megaloblasts); B12 deficiency additionally causes subacute combined degeneration of the cord — neurological danger, not just tiredness.',
      'Normocytic logic is diagnosis by exclusion and by reticulocyte count: high retics = the marrow is responding (haemolysis or recovering blood loss); low retics = marrow under-performance (chronic disease, renal, endocrine, marrow infiltration).',
      'Haemolysis has a signature: raised retics + raised LDH + raised unconjugated bilirubin + low haptoglobin; jaundice without dark urine initially (unconjugated) is the classic clue.',
      'The history does the heavy lifting: diet (vegetarian B12), drugs, alcohol, menstrual loss, GI bleeding clues (NSAIDs, black stools), family history (thalassemia, haemolytic disorders), and country context (hookworm, malaria).',
    ],
    normal: 'WHO-style classic anchors: adult male Hb <13 g/dL, adult non-pregnant female <12 g/dL defines anemia; normal MCV ≈80–100 fL; reticulocytes ≈0.5–2.5%.',
    mechanism: 'By family: iron lack → low haemoglobinisation → small pale cells (microcytic hypochromic); B12/folate lack → defective DNA → nuclear-cytoplasmic asynchrony → large oval macro-ovalocytes; haemolysis → shortened red-cell survival compensated by marrow expansion (reticulocytosis).',
    presentation: [
      'Fatigue, breathlessness on exertion, pallor of conjunctiva/palmar creases, tachycardia; severity and speed matter more than the number.',
      'Iron deficiency: koilonychia, angular stomatitis, glossitis, pica; the CAUSE (usually bleeding) matters more than the anemia.',
      'B12 deficiency: glossitis + neurological signs — distal paraesthesia, loss of proprioception/vibration (dorsal columns) and spastic weakness (corticospinal tracts).',
      'Haemolysis: jaundice, splenomegaly, dark urine on haemolysis crises (depending on type).',
    ],
    diagnosis: [
      'CBC with indices (MCV the fork) + reticulocyte count + peripheral smear — the smear is the cheapest high-yield test (target cells, sickles, fragments, macro-ovalocytes, hypersegmented neutrophils).',
      'Iron studies for microcytosis: low ferritin = iron deficiency; normal/high ferritin with microcytosis = chronic disease or thalassemia trait ( Mentzer-type indices are teaching aids, not proof).',
      'B12/folate levels for macrocytosis; LDH/haptoglobin/bilirubin for haemolysis; haemoglobin electrophoresis when thalassemia suspected.',
      'Always ask WHY: adult iron deficiency is a GI-bleeding workup until proven otherwise (men and postmenopausal women especially).',
    ],
    differentials: [
      { name: 'Iron-deficiency anemia', key: 'Low ferritin; the search is for the bleeding source, not just the pill.' },
      { name: 'Anaemia of chronic disease', key: 'Normal/high ferritin, iron locked in macrophages — find the inflammation/infection/malignancy.' },
      { name: 'Thalassemia trait', key: 'Marked microcytosis disproportionate to mild anemia, family history, high A2 on electrophoresis — never give reflex iron.' },
      { name: 'Megaloblastic (B12/folate) anemia', key: 'Macro-ovalocytes + hypersegmented neutrophils + possible neurology — B12 before folate replacement, or neurology worsens.' },
      { name: 'Haemolytic anemia', key: 'Retics high, haptoglobin low, LDH/bilirubin high — then divide immune vs non-immune (DAT).' },
    ],
    management: [
      'PRINCIPLE — treat the cause, not just the count: iron pills in a patient bleeding from a colon cancer is the classic failure of medicine-by-numbers.',
      'PRINCIPLE — route and urgency follow physiology: chronic compensated anemia is corrected orally over weeks; symptomatic severe anemia or acute loss may need transfusion — decisions follow stability, not vanity numbers.',
      'PRINCIPLE — replacement has a response test: Hb should rise predictably over ~2–4 weeks with effective iron therapy (the classic reticulocyte surge at ~1 week); failure = non-adherence, ongoing loss, wrong diagnosis, or malabsorption.',
      'PRINCIPLE — B12 with neurological signs is an emergency of prevention: replace before folate, protect the cord (regimens are protocol territory).',
    ],
    complications: [
      'High-output heart failure in severe/chronic anemia — the heart compensates by pumping faster and bigger until it fails.',
      'Untreated B12: irreversible subacute combined degeneration — the tragedy is that it is preventable.',
      'Growth/development impairment in children; adverse pregnancy outcomes (maternal anemia is a global health priority).',
    ],
    numbers: [
      { label: 'WHO-style adult anchors', value: 'Hb <13 g/dL (men), <12 g/dL (non-pregnant women)', note: 'Widely published reference anchors — local laboratories print their own reference intervals.' },
      { label: 'MCV fork', value: '≈80–100 fL normal; <80 microcytic; >100 macrocytic', note: 'The first branch of every anemia algorithm.' },
      { label: 'Reticulocyte logic', value: 'Rising retics = marrow responding (loss/haemolysis); flat retics = marrow failing', note: 'One test that splits the normocytic family in two.' },
    ],
    mistakes: [
      'Giving iron to every pale microcytic patient — thalassemia trait and chronic disease will not respond and delay the true diagnosis.',
      'Missing the GI source: iron deficiency in an adult man or postmenopausal woman demands bowel evaluation.',
      'Replacing folate alone in combined B12/folate deficiency — the neurology of B12 lack can accelerate.',
      'Forgetting that speed of onset determines symptoms: a slow trickle to 7 g/dL may be walked-in; the same drop in a day is an emergency.',
    ],
    mnemonics: [
      { hook: 'Lost, Lacking, Lytic', expands: 'Bleeding · production failure · haemolysis — the three doors of anemia; every test picks a door.' },
      { hook: 'Talons on Tails (target cells)', expands: 'Target cells on smear → think thalassemia, liver disease, post-splenectomy — smear-reading shortcuts.' },
    ],
    crossLinks: [
      { conceptId: 'c2-pathology-anemias', label: 'Anemias — morphology-first deep dive (Pathology, para-clinical pack)', why: 'The laboratory/haematology half of this clinical approach — smear patterns and iron-study logic in depth.' },
      { conceptId: 'c-leukemia', label: 'Leukaemias (Pathology)', why: 'Marrow infiltration is one of the normocytic non-responders — the reason a smear is never skipped.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; transfusion thresholds and replacement regimens are protocol-specific.',
    sources: [
      whoRef('Anaemia — global prevalence framing and definitions'),
      cdcRef('Iron deficiency anemia evaluation resources'),
      ncbiRef('StatPearls — anemia evaluation'),
      nhsRef('Vitamin B12 or folate deficiency anaemia — patient information'),
    ],
  },
  {
    id: 'c2-medicine-thyroid',
    name: 'Thyroid Disorders',
    kind: 'disease',
    oneLiner: 'The thyroid’s hormones set the body’s metabolic tempo — too little slows every system (hypothyroidism), too much races it (thyrotoxicosis), and structure can misbehave independently of function (goitre, nodules, cancer).',
    whyMatters: 'One of the commonest endocrine syndromes and one of the best system-wise teaching diseases: nearly every organ shows a speed-change, the TSH-first lab strategy is a model of diagnostic reasoning, and a thyroid storm or myxoedema coma are classic exam emergencies.',
    explain30s: 'The pituitary’s TSH is the thermostat: low thyroid hormone (hypothyroidism) → TSH rises; excess (thyrotoxicosis) → TSH falls. Hypothyroidism (often autoimmune Hashimoto’s, or post-treatment) shows slowing: weight gain, cold intolerance, constipation, bradycardia, dry skin, heavy periods, delayed reflexes. Hyperthyroidism (Graves’ with eye signs, toxic nodules, thyroiditis) shows speeding: weight loss despite appetite, heat intolerance, palpitations, tremor, diarrhoea, anxiety. Structure adds the third chapter: a nodule or goitre needs its own logic (function testing + imaging/FNAC pathways). Long-term management is mostly simple replacement (levothyroxine) or controlled destruction/blockade — but thyroid storm and myxoedema coma are emergencies.',
    eli5: 'Imagine the thyroid as the body’s accelerator pedal, controlled by the brain’s cruise-control dial called TSH. If the pedal barely works, the whole body drives slowly: cold, sleepy, constipated, thinking in slow motion — and the cruise-control (TSH) shouts louder (high TSH). If something presses the pedal all the time (Graves’ disease — the body makes a fake foot on the pedal), everything races: heart pounding, sweating, shaky hands, losing weight while eating a lot — and the cruise-control goes quiet (low TSH). Doctors check the cruise-control first, because it usually tells the whole story before touching the thyroid. A lump in the neck is a separate question: is it making hormones, and is it friendly or not?',
    firstPrinciples: [
      'The hypothalamic-pituitary-thyroid axis is a negative-feedback loop: TSH rises when thyroid hormone falls and vice versa — this single rule makes TSH the first-line test.',
      'Thyroid hormone (T4, converted peripherally to the active T3) enters cells and tunes metabolic gene expression — hence the everywhere-at-once symptom patterns.',
      'Hypothyroidism causes: autoimmune Hashimoto’s thyroiditis (commonest in iodine-replete regions), iodine deficiency (commonest worldwide context historically), post-surgical/radioiodine, drugs (amiodarone, lithium).',
      'Hyperthyroidism causes: Graves’ disease (TSH-receptor antibodies; eye signs and pretibial myxoedema are its signature), toxic multinodular goitre, toxic adenoma, thyroiditis (stored hormone released — transient), drug-induced (amiodarone).',
      'Pregnancy changes the interpretation: hCG weakly stimulates the receptor, TBG rises, and requirements of levothyroxine rise — pregnancy-specific reference ranges exist for a reason.',
      'Nodules follow a function-then-structure logic: does it make hormone (hot/cold on scan), and does cytology (FNAC) show malignancy risk — size alone never decides.',
      'Emergencies live at the extremes: thyroid storm (decompensated thyrotoxicosis — fever, arrhythmia, delirium) and myxoedema coma (hypothermia, obtundation) — both need protocolised ICU care.',
    ],
    normal: 'TSH and free T4 within the laboratory reference interval; the gland is symmetrical, smooth, moves with swallowing; no bruit, no ophthalmopathy.',
    mechanism: 'Hashimoto’s: T-cell/autoantibody-mediated follicular destruction → hormone failure (± goitre). Graves’: stimulating immunoglobulins dock the TSH receptor → unregulated hormone synthesis + retro-orbital fibroblast activation (the eye disease is part of the autoimmunity).',
    presentation: [
      'Hypothyroid: fatigue, cold intolerance, weight gain, constipation, dry skin, bradycardia, menorrhagia, delayed-relaxation reflexes, bradycardic "slowed" affect; congenital forms endanger development (newborn screening exists for this reason).',
      'Hyperthyroid: weight loss with good appetite, heat intolerance, sweating, palpitations/AF, tremor, diarrhoea, anxiety, proximal myopathy, oligomenorrhoea.',
      'Graves-specific: diffuse goitre with bruit, exophthalmos/proptosis, pretibial myxoedema — the triad is the exam give-away.',
      'Neck lump: nodule/goitre — evaluate independently of function.',
    ],
    diagnosis: [
      'TSH first: high TSH + low free T4 = primary hypothyroidism; low TSH + high free T4 = primary thyrotoxicosis; mismatched pairs (e.g. low everything) point to pituitary disease — the axis question.',
      'Autoantibodies phenotype the cause: anti-TPO (Hashimoto’s), TSH-receptor antibodies (Graves’).',
      'Radioiodine uptake scan separates making-too-much (diffuse hot — Graves; hot nodule) from leaking-stored-hormone (low uptake — thyroiditis) — management differs.',
      'FNAC is the structure test for nodules per risk/size pathways; ultrasound characterises.',
    ],
    differentials: [
      { name: 'Hashimoto’s vs iodine-deficiency goitre', key: 'Antibodies and diet/geography history; both may present as a goitre with low hormones.' },
      { name: 'Graves’ vs toxic nodule', key: 'Eye signs + diffuse bruit vs focal hot nodule on scan; management choice follows.' },
      { name: 'Thyroiditis (subacute/post-partum)', key: 'Painful gland / post-partum timing; transient thyrotoxicosis with LOW uptake — often no antithyroid drug needed.' },
      { name: 'Depression vs hypothyroidism', key: 'Overlapping slowing and low mood — the TSH is the tiebreaker before blaming the mind.' },
      { name: 'Amiodarone effects', key: 'Iodine-loaded drug that can cause BOTH hypo- and hyperthyroidism — classic drug-history trap.' },
    ],
    management: [
      'PRINCIPLE — replace what is missing: levothyroxine titrated to TSH (dose decisions are protocol/regimen territory); in central hypothyroidism titrate to free T4 instead (TSH is blind there).',
      'PRINCIPLE — block or ablate what is overactive: antithyroid drugs, radioiodine or surgery each have patient-specific logic (eye disease, pregnancy, nodules); regimens and blocking strategies are guideline territory.',
      'PRINCIPLE — beta-blockade buys symptom control in thyrotoxicosis while definitive therapy works (rate control, tremor relief).',
      'PRINCIPLE — thyroid storm and myxoedema coma are ICU emergencies: supportive + protocol drug combinations; recognise first, verify protocol second.',
      'PRINCIPLE — thyroid cancer is a separate pathway: nodule workup, FNAC-driven surgery decisions, and post-op hormone suppression/treatment — staging is disease-specific.',
    ],
    complications: [
      'Atrial fibrillation and heart failure in chronic thyrotoxicosis; osteoporosis.',
      'Congestive failure and pericardial effusion in long-standing hypothyroidism; infertility and adverse pregnancy outcomes.',
      'Thyroid storm (precipitated by infection/surgery) and myxoedema coma — the life-threatening ends.',
      'Compressive goitre: stridor, dysphagia — a mechanical problem in an endocrine disease.',
      'Graves’ orbitopathy — sight-threatening variants need urgent ophthalmology input.',
    ],
    numbers: [
      { label: 'TSH-first rule', value: 'Feedback logic: hormone low → TSH high; hormone high → TSH low', note: 'The most reliable single rule in endocrine testing.' },
      { label: 'Pregnancy shifts', value: 'Levothyroxine requirement rises in pregnancy', note: 'Pregnancy-specific TSH ranges exist — never read pregnancy labs on adult reference tables.' },
      { label: 'Congenital screening anchor', value: 'Newborn TSH screening detects congenital hypothyroidism before developmental damage', note: 'One of public health’s cheapest disability-prevention wins.' },
    ],
    drugs: [
      { name: 'Levothyroxine (T4)', drugClass: 'Thyroid hormone replacement', mechanism: 'Converted peripherally to T3; restores the metabolic set-point', note: 'Take fasted, separate from iron/calcium — absorption interactions are the classic exam point.' },
      { name: 'Carbimazole / propylthiouracil', drugClass: 'Antithyroid (thionamide)', mechanism: 'Block thyroid peroxidase → less hormone synthesis; PTU also blocks T4→T3 conversion', note: 'Agranulocytosis is the classic danger to warn; PTU carries hepatotoxicity risk; choice in pregnancy is guideline territory.' },
      { name: 'Propranolol', drugClass: 'Beta-blocker', mechanism: 'Masks adrenergic symptoms (tachycardia, tremor) while hormone levels fall', note: 'Symptom bridge, not disease control; part of storm protocols.' },
    ],
    mistakes: [
      'Reading TSH in a sick euthyroid patient (severe illness transiently distorts the axis) — interpret in clinical context.',
      'Checking thyroid function the day after starting amiodarone and calling it disease.',
      'Missing the eye disease in Graves’ — smoking worsens orbitopathy (a modifiable exam favourite).',
      'Panic over every nodule: function test + structured ultrasound/FNAC pathways replace reflex surgery.',
    ],
    mnemonics: [
      { hook: 'Hypo = slowdown, Hyper = speed-up', expands: 'Walk every organ system (bowel, skin, mind, heart, periods, reflexes) and flip its tempo — the symptom lists write themselves.' },
      { hook: 'Graves = 3 extras', expands: 'Goitre + eyes (orbitopathy) + skin (pretibial myxoedema) — antibodies acting beyond the gland.' },
    ],
    crossLinks: [
      { conceptId: 'c-thyroidphys', label: 'Thyroid Physiology (Physiology)', why: 'The axis, feedback and hormone conversion this lesson presumes.' },
      { conceptId: 'c-graves', label: 'Graves’ Disease (Pathology/Endocrine)', why: 'The flagship hyperthyroid cause with its autoimmune signature.' },
      { conceptId: 'c-thyroidstorm', label: 'Thyroid Storm', why: 'The emergency end of the spectrum, mechanism-first.' },
      { conceptId: 'c-thyroidnodule', label: 'Thyroid Nodule Workup', why: 'The structure chapter: FNAC-first logic.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; dosing, antithyroid choice and nodule pathways are protocol-specific.',
    sources: [
      whoRef('Iodine deficiency and thyroid disorders — global nutrition framing'),
      ncbiRef('StatPearls — hypothyroidism and hyperthyroidism'),
      nhsRef('Overactive/underactive thyroid — patient information'),
      jhmiRef('Thyroid disorder patient-education resources'),
    ],
  },
  {
    id: 'c2-medicine-ckd',
    name: 'Chronic Kidney Disease (CKD)',
    kind: 'disease',
    oneLiner: 'Irreversible, progressive loss of kidney function over months to years — staged by eGFR and albuminuria — whose complications (anaemia, bone disease, acidosis, hypertension) begin long before dialysis.',
    whyMatters: 'Diabetes and hypertension guarantee a rising CKD population in every health system; the staging language (eGFR categories) is shared worldwide, and most CKD mortality is cardiovascular — meaning the nephrologist and the cardiologist are treating one disease.',
    explain30s: 'The kidney filters, balances salt/water/acid, makes erythropoietin and activates vitamin D — so failure is a whole-body disease. CKD is staged by eGFR (estimated filtration rate): the classic G1–G5 ladder from normal-ish (≥90) down to failure (<15), combined with albuminuria (A1–A3) — risk lives in the COMBINATION. Causes are mostly systemic: diabetes and hypertension dominate, plus glomerulonephritis, obstruction, polycystic disease. Management is a deceleration strategy: control pressure (RAAS blockade is central), control glucose, avoid nephrotoxins, and treat the complications that each failing function produces — anaemia (EPO loss), bone-mineral disease (vitamin-D activation loss), acidosis, hyperkalaemia. Dialysis/transplant belong to stage 5 — the lesson is what happens before.',
    eli5: 'Your kidneys are two very clever filters — like the water purifier of the whole house (body). They clean the blood, balance the salts, and even make special helpers: one helper tells your bones’ factory (marrow) to build blood; another helps your bones stay strong. When the filter slowly wears out (from years of high sugar or high pressure grinding it), three things happen: garbage builds up, the helpers stop, and the pipes leak protein. Doctors give the damage a grade using a filter-speed score (eGFR) — like how fast the purifier still works. And here’s the trick: you can’t easily fix an old filter, but you can stop it wearing out faster — keep sugar and pressure low, don’t feed it poisons (certain painkillers), and replace the helpers it lost.',
    firstPrinciples: [
      'Kidney functions define the disease: filtration (urea/creatinine/eGFR), salt-water-acid balance, erythropoietin (anaemia), vitamin-D activation (bone disease), and blood-pressure regulation — each failing function predicts a complication.',
      'eGFR estimates filtration from creatinine (age/sex-adjusted equations) — staging is G1 (≥90) → G2 (60–89) → G3a (45–59) → G3b (30–44) → G4 (15–29) → G5 (<15, failure) in the classic KDIGO-style ladder.',
      'Albuminuria (A1–A3) is the damage-and-progression axis: persistent ACR ≥30 mg/g (classic microalbuminuria anchor) signals glomerular injury and multiplies risk at any eGFR.',
      'Diabetes and hypertension cause most CKD because they destroy the very arterioles/glomeruli the organ runs on — see the RAAS loop: nephron loss → more renin → more pressure → more nephron loss.',
      'Progression is slowed, not reversed: pressure control (RAAS blockade first-line in proteinuric disease), glycaemic control, SGLT2-inhibitor class effects, nephrotoxin avoidance (NSAIDs, contrast where avoidable), sick-day rules.',
      'Complications arrive in stage-order: hypertension and fluid issues early, acidosis/hyperkalaemia and bone-mineral disease in mid stages, uraemia/anaemia as failure approaches — the staging ladder is a complication timetable.',
      'Stage 5 decisions (dialysis modality, transplant workup) are planned electively — a prepared access beats an emergency dialysis line every time.',
    ],
    normal: 'eGFR ≥90 with no albuminuria, normal electrolytes, haemoglobin and calcium-phosphate balance; kidneys concentrate and dilute urine across intake ranges.',
    mechanism: 'Nephron loss → hyperfiltration of survivors → glomerular hypertension → further sclerosis (the self-amplifying loop RAAS blockade interrupts); uraemic toxins accumulate; phosphate rises as calcitriol falls → secondary hyperparathyroidism → renal bone disease.',
    presentation: [
      'Usually SILENT until late — discovered on routine creatinine or urine ACR in diabetic/hypertensive clinics.',
      'Progressive fatigue (anaemia), nocturia (concentration loss), pruritus, anorexia/nausea (uraemia), oedema, breathlessness (volume/anaemia).',
      'Advanced: frothy urine (proteinuria), muscle cramps, restless legs, pericarditis, uraemic encephalopathy.',
      'Incidental findings that expose it: resistant hypertension, hyperkalaemia on any blood test, small kidneys on scan.',
    ],
    diagnosis: [
      'Confirm chronicity: abnormal eGFR persisting >3 months (the definition) — acute dips need the AKI framework instead.',
      'Stage it: eGFR (G1–G5) + urine albumin-to-creatinine ratio (A1–A3) — the two-axis map; haematuria analysis and renal ultrasound (size, obstruction, cysts) characterise structure.',
      'Complication panel: Hb, calcium/phosphate/PTH, bicarbonate, potassium, lipids — each maps to a management chapter.',
      'Cause hunt where indicated: diabetic retinopathy points to diabetic nephropathy without biopsy; atypical presentations (heavy proteinuria, active sediment, rapid decline) justify biopsy.',
    ],
    differentials: [
      { name: 'Acute kidney injury (AKI)', key: 'The definition is chronicity — >3 months. Reversibility, size of kidneys (small = chronic) and prior labs separate them.' },
      { name: 'Diabetic nephropathy vs other', key: 'Retinopathy + years of diabetes + gradual decline predicts diabetic disease; anything atypical gets a biopsy.' },
      { name: 'Obstructive uropathy', key: 'Hydronephrosis on ultrasound — the reversible cause you must not miss.' },
      { name: 'Polycystic kidney disease', key: 'Family history + big cystic kidneys + flank pain/haematuria.' },
    ],
    management: [
      'PRINCIPLE — slow the loop: strict pressure control (ACE inhibitor/ARB first-line in proteinuric disease — the evidence anchor), glycaemic control, and nephroprotective habits (avoid NSAIDs, review every prescription, sick-day rules for ACEi/diuretics/metformin).',
      'PRINCIPLE — replace what failing functions lose: erythropoiesis-stimulating agents + iron for renal anaemia; phosphate binders, vitamin-D analogues for bone-mineral disease; bicarbonate for acidosis (regimens are protocol territory).',
      'PRINCIPLE — cardiovascular risk is the main killer: lipid management, smoking cessation, and treat CKD–heart failure as one disease.',
      'PRINCIPLE — plan ahead: refer to nephrology on the staging map (concept: early referral, e.g. by G4 or heavy albuminuria — exact thresholds vary), preserve arm veins for future fistula, and counsel on modality choices before crisis.',
    ],
    complications: [
      'Cardiovascular death — the dominant outcome across all stages.',
      'Renal anaemia and renal bone disease (CKD-mineral bone disorder) — the two "replacement" failures.',
      'Hyperkalaemia and acidosis — the emergency electrolytes.',
      'Uraemic pericarditis/encephalopathy — late markers of failed filtration.',
      'Accelerated hypertension and volume overload — heart failure decompensations.',
    ],
    numbers: [
      { label: 'eGFR staging ladder (G-categories)', value: 'G1 ≥90 · G2 60–89 · G3a 45–59 · G3b 30–44 · G4 15–29 · G5 <15 mL/min/1.73m²', note: 'The classic KDIGO-style staging; the ladder is the shared worldwide language.' },
      { label: 'Albuminuria staging (A-categories)', value: 'A1 <30 · A2 30–300 · A3 >300 mg/g creatinine', note: 'The damage axis — A3 marks high-risk territory at ANY G-stage.' },
      { label: 'Definition anchor', value: 'Abnormalities of kidney structure/function present for >3 months', note: 'Chronicity is the dividing line from AKI.' },
    ],
    drugs: [
      { name: 'ACE inhibitors / ARBs', drugClass: 'RAAS blocker', mechanism: 'Lower glomerular pressure → less proteinuria → slower sclerosis', note: 'Expect a small creatinine rise on starting (acceptable band — protocol-defined); hyperkalaemia is the watch-item; contraindicated in pregnancy/bilateral stenosis.' },
      { name: 'SGLT2 inhibitors', drugClass: 'Glucosuric agent', mechanism: 'Tubuloglomerular feedback reset → lower intraglomerular pressure; kidney-protective beyond glucose', note: 'Now a pillar of proteinuric CKD care — class effect, guideline-dependent.' },
      { name: 'Erythropoiesis-stimulating agents + iron', drugClass: 'Hormone replacement', mechanism: 'Replaces the lost erythropoietin signal; iron first when stores are low', note: 'Targets are individualised — never chase a "normal" Hb in CKD reflexively.' },
    ],
    mistakes: [
      'Calling every raised creatinine CKD — acute injury needs its own pathway and may be reversible.',
      'Stopping ACE inhibitors for any creatinine bump without protocol-guided judgement.',
      'Letting patients take NSAIDs freely — the commonest self-inflicted progression driver.',
      'Forgetting that uraemia mimics almost anything: nausea called gastritis, pruritus called eczema, fatigue called depression.',
    ],
    mnemonics: [
      { hook: 'The kidney’s four jobs', expands: 'Filter · Balance · Make blood (EPO) · Build bone (vit-D activation) — four jobs, four failure chapters.' },
    ],
    crossLinks: [
      { conceptId: 'c-raas', label: 'RAAS & Blood Pressure (Physiology)', why: 'The self-amplifying loop CKD exploits — and the loop the drugs break.' },
      { conceptId: 'c-gfr', label: 'GFR & Renal Clearance (Physiology)', why: 'How eGFR equations turn a creatinine into a stage.' },
      { conceptId: 'c-aki', label: 'Acute Kidney Injury', why: 'The acute twin — same organ, opposite timescale, different urgency.' },
      { conceptId: 'c-acei', label: 'ACE Inhibitors (Pharmacology)', why: 'Proteinuric CKD is the flagship indication for RAAS blockade.' },
      { conceptId: 'c-dm', label: 'Diabetes Mellitus (this pack)', why: 'The leading cause of CKD worldwide — one disease stream feeding another.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; staging, referral thresholds and drug regimens are guideline-specific.',
    sources: [
      whoRef('Chronic kidney disease — global burden framing'),
      ncbiRef('StatPearls — chronic kidney disease'),
      niceRef('Chronic kidney disease — assessment and management'),
      nhsRef('Chronic kidney disease — patient information'),
    ],
  },
  {
    id: 'c2-medicine-tb-mgmt',
    name: 'Tuberculosis — Management Principles',
    kind: 'principle',
    oneLiner: 'Tuberculosis is managed as a public-health disease, not just a patient’s infection: combination drugs for months, adherence engineered by systems, resistance hunted proactively, and contacts protected.',
    whyMatters: 'The world’s deadliest infectious disease for years running, and India carries a large share of the burden; prescribing anti-TB drugs without the system logic (DOT, contact tracing, resistance) fails both patient and community — which is why NMC’s clinical teaching pairs TB management with programme thinking.',
    explain30s: 'Three ideas define TB management. FIRST — combination therapy: M. tuberculosis naturally contains rare mutants resistant to any single drug, so you give several drugs together (the classic RIPE regimen — rifampicin, isoniazid, pyrazinamide, ethambutol) so each drug mops up the mutants the others miss; the intensity phase is followed by a continuation phase, and courses run for months. SECOND — adherence is the treatment: interrupted courses create resistance, so programmes supervise doses (DOT) and track outcomes. THIRD — resistance changes everything: MDR/RR-TB needs drug-susceptibility testing and longer, more toxic, more expensive regimens. Around the drugs: notify, trace contacts, screen for HIV/diabetes (the two great TB multipliers), and monitor drug toxicities (the RIPE toxicity table is an exam classic).',
    eli5: 'TB bacteria are like weeds in a huge garden. One weed-killer alone never works — a few weeds are naturally immune, and they’re the ones that grow back stronger. So you spray SEVERAL killers at once, and keep spraying for months, because the stubborn weeds hide as seeds (dormant bacteria). The hardest part isn’t the spray — it’s that the patient must finish the whole course even after feeling better, or the surviving weeds learn to resist the spray (drug resistance), and then the medicine gets longer, nastier and costlier. So health systems send someone to watch each dose (that’s "DOT"), check the family (contacts), and test whether the weed still dies to the usual sprays (drug-susceptibility testing).',
    firstPrinciples: [
      'Population logic: a TB lesion contains billions of bacilli; among them, spontaneous single-drug-resistant mutants pre-exist at low frequency — monotherapy simply selects them; combinations make independent resistance astronomically unlikely.',
      'Drug teams have roles: rifampicin and isoniazid are the sterilising core; pyrazinamide hits semi-dormant bacilli in acidic environments; ethambutol adds early bactericidal cover while susceptibility is pending (classic teaching of the RIPE quartet).',
      'Duration exists because bacilli hide: semidormant persister populations require prolonged exposure — hence months-long regimens with an intensive phase and a continuation phase.',
      'Adherence is pharmacology: subtherapeutic exposure = monotherapy in effect = resistance; so delivery systems (directly observed therapy, fixed-dose combinations, adherence counselling) are part of the prescription.',
      'Resistance is laboratory-defined: rifampicin resistance (a key sentinel) or MDR status must be CONFIRMED/Tested, not guessed — drug-susceptibility/molecular testing (e.g. WHO-endorsed rapid molecular tests) drives regimen choice.',
      'Host factors shape risk and outcome: HIV and diabetes multiply TB risk and complicate treatment (immune reconstitution, drug interactions — rifampicin famously breaks many drug combinations including some contraceptives and antiretrovirals).',
      'Public health is curative: notification, contact screening, preventive therapy for selected contacts (programme-defined), infection control in congregate settings — the disease ends in systems, not prescriptions.',
    ],
    normal: 'Latent TB infection: dormant bacilli, no symptoms, non-infectious, positive immune test (TST/IGRA) — a treatment-decision state, not active disease; active disease requires symptoms + evidence.',
    mechanism: 'Pulmonary disease (cavitation, caseation) reflects the balance of bacillary load and host immunity; drugs kill actively-dividing bacilli but persisters regenerate — the pharmacological war is attrition over months, which is why interruption is defeat.',
    presentation: [
      'Pulmonary TB classic: cough >2 weeks (programme-defined suspicion threshold in many settings), haemoptysis, evening fevers, night sweats, weight loss.',
      'Extrapulmonary forms (lymph node, pleural, bone, meningeal, genitourinary) share the constitutional trio with organ-specific signs.',
      'Children often paucibacillary — harder to confirm; contact history carries extra weight.',
      'HIV co-infection flattens the picture: lower inflammatory signs, higher suspicion burden.',
    ],
    diagnosis: [
      'Sputum examination remains the spine: molecular tests (WHO-endorsed rapid platforms detecting M. tuberculosis + rifampicin resistance) and/or smear microscopy; culture is the historical gold standard.',
      'Chest X-ray supports (upper-lobe/cavitary patterns classically) but never stands alone.',
      'Drug-susceptibility testing for all confirmed cases where available — resistance is a lab diagnosis.',
      'Screen for the multipliers in every patient: HIV test, diabetes screening.',
    ],
    differentials: [
      { name: 'Community-acquired pneumonia', key: 'Acute febrile course vs TB’s weeks-to-months arc; response to standard antibiotics where bacterial.' },
      { name: 'Lung malignancy', key: 'Smoker, non-resolving infiltrate — the reason every "failed pneumonia" gets a re-look.' },
      { name: 'Fungal infections / sarcoidosis', key: 'Chronic cavitary mimics — culture and histology arbitrate.' },
      { name: 'Lymphoma vs TB lymphadenitis', key: 'Both give firm nodes; FNAC/biopsy decides — a classic differential in high-burden clinics.' },
    ],
    management: [
      'PRINCIPLE — regimen logic over drug list: the classic intensive phase (four drugs — RIPE) followed by a continuation phase (typically two), with total courses of months; exact durations, phases and drug doses are national-programme and guideline territory.',
      'PRINCIPLE — DOT/adherence engineering: directly observed therapy, fixed-dose combinations, patient-centred support; the cheapest regimen is the one that finishes.',
      'PRINCIPLE — toxicity monitoring: the RIPE toxicity map (hepatitis, neuropathy, optic neuritis, hyperuricaemia etc.) is monitored clinically and by labs where indicated; risks are counseled at start.',
      'PRINCIPLE — resistance pathway: confirmed rifampicin resistance/MDR switches to programme-defined second-line regimens (longer, more toxic, more costly) — never improvise single additions to a failing regimen.',
      'PRINCIPLE — the ecosystem: notify every case, trace and screen contacts, manage comorbid HIV/diabetes, and apply infection control — management extends beyond the patient.',
    ],
    complications: [
      'Drug-resistant TB (MDR/RR-TB) — created largely by incomplete therapy; the man-made complication.',
      'Drug toxicity: hepatotoxicity (RIPE, especially combination), isoniazid neuropathy, ethambutol optic neuritis, rifampicin interactions (orange secretions are benign and a classic counselling point).',
      'Massive haemoptysis, pneumothorax from cavitation — the pulmonary emergencies.',
      'Post-TB lung disease — bronchiectasis-like sequelae; chronic disability.',
      'Immune reconstitution inflammatory syndrome in HIV patients starting antiretrovirals.',
    ],
    numbers: [
      { label: 'Programmatic suspicion anchor', value: 'Cough >2 weeks with constitutional symptoms triggers TB evaluation in high-burden settings', note: 'A screening convention, not a law of nature — local programme definitions apply.' },
      { label: 'RIPE quartet', value: 'Rifampicin · Isoniazid · Pyrazinamide · Ethambutol', note: 'The classic intensive-phase teaching regimen; phase structure and durations are programme-defined.' },
      { label: 'Rifampicin signature', value: 'Orange discolouration of urine/tears/sweat', note: 'Benign, expected, and the classic counselling question.' },
    ],
    drugs: [
      { name: 'Rifampicin', drugClass: 'Rifamycin antibiotic', mechanism: 'Inhibits bacterial RNA polymerase — sterilising backbone', note: 'Potent enzyme INDUCER — interacts with contraceptives, anticoagulants, antiretrovirals (the classic interaction list).' },
      { name: 'Isoniazid', drugClass: 'Anti-tubercular', mechanism: 'Blocks mycolic-acid synthesis in the cell wall', note: 'Peripheral neuropathy (prevent with pyridoxine) and hepatotoxicity are the classic toxicities.' },
      { name: 'Pyrazinamide', drugClass: 'Anti-tubercular', mechanism: 'Kills semi-dormant bacilli in acidic (intracellular/cavitary) environments', note: 'Hyperuricaemia/gout-flare and hepatotoxicity are the classic associations.' },
      { name: 'Ethambutol', drugClass: 'Anti-tubercular', mechanism: 'Disrupts arabinogalactan cell-wall synthesis', note: 'Dose-related optic neuritis — colour-vision testing at baseline and follow-up is the classic monitoring point.' },
    ],
    mistakes: [
      'Adding one drug to a failing regimen — resistance is built exactly this way; regimens change as wholes, by programme.',
      'Stopping treatment when the patient "feels better" at 2 months — persisters are why courses run for months.',
      'Forgetting rifampicin’s interactions — contraception failure and anticoagulant instability hide here.',
      'Missing extrapulmonary TB by demanding sputum only — tissue/fluid sampling follows the organ.',
    ],
    mnemonics: [
      { hook: 'RIPE', expands: 'Rifampicin, Isoniazid, Pyrazinamide, Ethambutol — the classic intensive quartet.' },
      { hook: 'The four S’s of rifampicin', expands: 'Secretions orange · Strong inducer · Steals (interactions) · Sight-safe (no eye toxicity — contrast ethambutol).' },
    ],
    crossLinks: [
      { conceptId: 'c-antitb', label: 'Anti-Tubercular Drugs (Pharmacology, para-clinical pack)', why: 'The mechanism-and-toxicity deep dive this management lesson presumes.' },
      { conceptId: 'c-tb', label: 'Mycobacterium tuberculosis (Microbiology, para-clinical pack)', why: 'The organism’s biology — dormancy, cell wall, diagnostics — underneath the treatment logic.' },
      { conceptId: 'c2-medicine-pneumonia', label: 'Pneumonia (this pack)', why: 'The acute mimic — timing, imaging and course separate the two respiratory fevers.' },
    ],
    global: [
      { region: 'India', delivery: 'India’s National TB Elimination Programme (NTEP — the successor to the DOTS-era RNTCP) runs notification, free diagnosis/treatment, nikshay-style adherence support and drug-resistance services.', note: 'The programme context is exam-relevant and changes by year — verify current structure.' },
      { region: 'WHO/Global', delivery: 'WHO’s End-TB Strategy frames global elimination via integrated patient-centred care, bold policies and research; rapid molecular testing is the preferred initial diagnostic.', note: 'The global reference frame every national programme adapts.' },
      { region: 'United States', delivery: 'Low-incidence framework: targeted testing of risk groups (TST/IGRA), latent-TB treatment programmes, and public-health case management via health departments.', note: 'Same disease, opposite epidemiology — prevention-first systems.' },
      { region: 'United Kingdom', delivery: 'NHS TB service delivery through specialist teams with contact-tracing and migrant-screening emphasis; BCG policy targeted to risk groups.', note: 'Programme design tracks local epidemiology — never copy schedules across borders.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; regimen composition, durations and resistance pathways are national-programme and WHO-specific, and change with evidence.',
    sources: [
      whoRef('Tuberculosis — End-TB Strategy, diagnostics and treatment guidance'),
      cdcRef('TB treatment and latent-TB infection guidelines'),
      ncbiRef('StatPearls — pulmonary tuberculosis'),
      nmcRef('CBME clinical competency reference — tuberculosis and national programme context'),
    ],
  },
  // ═════════════════════════════ SURGERY (5) ════════════════════════════════
  {
    id: 'c2-surgery-acute-abdomen',
    name: 'Approach to the Acute Abdomen',
    kind: 'principle',
    oneLiner: 'A systematic method for sudden abdominal pain — localise the pain, test the peritoneum, resuscitate, investigate — because in the abdomen, timing and pattern are the diagnosis.',
    whyMatters: 'The acute abdomen is the highest-stakes reasoning exercise in surgery: appendicitis, perforation, obstruction, pancreatitis and ruptured ectopic can all look alike at hour one, and the difference between observation and laparotomy is built from history, percussion and one well-chosen scan.',
    explain30s: 'Pain has a grammar. Visceral pain (organ wall stretched) is dull, midline, poorly localised — the appendix announces itself near the umbilicus. Parietal pain (inflammation touching the abdominal wall lining) is sharp, localised, and brings guarding — the appendix has "moved" to the right lower quadrant: this MIGRATION is the classic diagnostic arc. Then examine systematically: inspect, auscultate (silent abdomen = ileus/obstruction), percuss (free air = tympanic + liver dullness lost), palpate gently last (guarding, rigidity, rebound = peritonitis). Resuscitate first — IV fluids, nil by mouth, analgesia, antibiotics where indicated — then investigate: blood counts, electrolytes, amylase/lipase, urine (ectopic/pregnancy test in any fertile woman!), and imaging (ultrasound first-line in many settings; CT where available and needed). The life-threateners that must never be missed: perforated viscus, ruptured ectopic, strangulated hernia, mesenteric ischaemia, ruptured aneurysm.',
    eli5: 'Think of the belly as a house with many rooms, each guarded by a different alarm system. Deep inside, the organs whisper (dull, hard-to-point pain) when something stretches or blocks them. But when the whisper becomes inflammation that touches the outer wall of the house, the alarm becomes a loud, exact shout — "here, this spot!" — and the wall muscles freeze to protect it (guarding). Doctors read this grammar: whisper→shout over hours means the appendix usually; sudden total shout everywhere means something burst. Before any fancy tests: drip in, no food by mouth, pain relief, and a pregnancy test for any woman who could be pregnant — because a burst ectopic pregnancy looks like "bad gastritis" until it kills.',
    firstPrinciples: [
      'Pain pathways: visceral afferents (midline, vague, referred to dermatomes — T10 umbilicus for appendix) vs parietal/somatic innervation of the parietal peritoneum (sharp, exact, movement-worsened) — the transition visceral→parietal IS the story of acute appendicitis.',
      'Peritoneal signs are physical-diagnosis gold: guarding (voluntary/involuntary muscle spasm), rigidity (board-like), rebound tenderness, percussion tenderness — inflammation of the peritoneum is a surgical flag.',
      'Free air in the peritoneal cavity means a hollow organ perforated until proven otherwise — loss of liver dullness on percussion is the bedside hint; erect X-ray/CT confirms.',
      'Bowel sounds tell time: hyperactive early obstruction, absent in established peritonitis/ileus — auscultation before palpation (hands warm the stethoscope, not the reverse).',
      'Resuscitation precedes diagnosis: third-spacing, vomiting and sepsis create hypovolaemia — IV access, fluids, nil-by-mouth, analgesia and early surgical referral happen while tests run.',
      'The fertile-woman rule: a pregnancy test is part of the abdominal examination — ectopic pregnancy is the classic disguised killer.',
      'Investigations follow the working differential, not a fixed menu: FBC, electrolytes, amylase/lipase, LFTs, urinalysis, β-hCG; imaging ladder — ultrasound (gallbladder, appendix, free fluid, aorta) → CT (the definitive modern modality where accessible).',
    ],
    normal: 'Soft, non-tender abdomen; normal bowel sounds (5–30/min-ish — the teaching point is presence and character, not a number); no organomegaly; no masses; tympany over bowel, dullness over liver/spleen.',
    mechanism: 'Each emergency has its mechanism signature: perforation → chemical then bacterial peritonitis; obstruction → proximal dilatation, vomiting, strangulation risk; inflammation (appendicitis/cholecystitis/pancreatitis) → localized peritoneal irritation; vascular (ischaemia, ruptured AAA, ectopic) → pain out of proportion or shock out of proportion to findings.',
    presentation: [
      'Onset matters: seconds (perforation/rupture), hours (appendicitis, obstruction), days (diverticulitis, abscess).',
      'Migration patterns: epigastric→RLQ (appendicitis); epigastric→RUQ biliary colic (precipitated by fatty meals); loin→groin (ureteric colic).',
      'Peritonitis constellation: still, shallow breathing, guarding, rebound, silent abdomen.',
      'Shock out of proportion: pale, cold, tachycardic with a soft abdomen — think ruptured ectopic, AAA, mesenteric ischaemia (pain out of proportion to soft findings).',
    ],
    diagnosis: [
      'Structured exam: inspect → auscultate → percuss → palpate → special signs (Murphy, McBurney, Rovsing, psoas/obturator — the classic appendicitis repertoire).',
      'Rectal/vaginal examination when indicated — tenderness or masses in the pelvis are invisible to the anterior wall.',
      'Labs: WBC, CRP, electrolytes, amylase/lipase (pancreatitis), LFT (biliary), urinalysis (stones/UTI), β-hCG (non-negotiable).',
      'Imaging: erect chest X-ray (free air under diaphragm), ultrasound (first-line for biliary, appendix in children/pregnancy), CT abdomen (the modern gold standard for undifferentiated acute abdomen where available).',
    ],
    differentials: [
      { name: 'Acute appendicitis', key: 'Migrating pain + McBurney tenderness + anorexia — see the dedicated lesson.' },
      { name: 'Perforated peptic ulcer', key: 'Sudden severe epigastric pain, board-like rigidity, free air under diaphragm.' },
      { name: 'Acute pancreatitis', key: 'Epigastric pain boring to the back, raised amylase/lipase, often alcohol/gallstone history.' },
      { name: 'Ruptured ectopic pregnancy', key: 'Amenorrhoea + positive β-hCG + sudden pain + shoulder-tip pain (diaphragmatic irritation) — the killer of assumptions.' },
      { name: 'Mesenteric ischaemia', key: 'Pain far exceeding soft abdominal findings, AF/vascular history — the diagnosis made on suspicion, not on exam.' },
      { name: 'Ruptured AAA', key: 'Elderly hypertensive, pulsatile mass, collapse — straight to theatre trajectory.' },
    ],
    management: [
      'PRINCIPLE — resuscitate before you decide: two large-bore IVs, crystalloid, nil by mouth, analgesia (modern practice does not withhold opioids from the conscious surgical exam — see verifyNote), urinary catheter and monitoring.',
      'PRINCIPLE — antibiotics where infection is on the table (perforation, cholecystitis, appendicitis) — empiric cover per local protocol, then culture-driven.',
      'PRINCIPLE — the surgical decision is binary: operate now (peritonitis, perforation, strangulation, rupture, ischaemia) vs active observation with serial exams (undifferentiated pain, selected appendicitis pathways) — the exam is repeated by the SAME examiner.',
      'PRINCIPLE — never let imaging delay resuscitation of the shocked patient; and never send an unstable patient alone to the CT suite.',
    ],
    complications: [
      'Septic shock from delayed peritonitis — the common final pathway of missed surgical abdomens.',
      'Adhesions after any peritonitis → future obstruction risk (the operation’s echo years later).',
      'Missed ectopic or ischaemia — the two classic medico-legal failures of the acute abdomen.',
    ],
    mistakes: [
      'Forgetting the pregnancy test — the single most cited acute-abdomen error.',
      'Calling severe pain in a soft abdomen "gastritis" — vascular ischaemia whispers until it shouts.',
      'Examining without comparing serial findings — a stable exam means less than a changing one.',
      'Letting analgesia anxiety delay pain relief — modern evidence supports analgesia before examination decisions.',
    ],
    mnemonics: [
      { hook: 'SOFT: Sepsis, Obstruction, Perforation, Females (β-hCG)', expands: 'The four thoughts that should flash before any acute-abdomen plan is written.' },
    ],
    reasoning: [
      { stage: 'symptom', label: 'Periumbilical pain, anorexia, vomiting', detail: 'Visceral, midline, poorly localised — T10 dermatome signalling from a stretched organ.' },
      { stage: 'mechanism', label: 'Appendiceal obstruction → inflammation', detail: 'Luminal block (lymphoid hyperplasia/faecolith) → bacterial overgrowth → wall inflammation.' },
      { stage: 'differential', label: 'Appendicitis vs gastroenteritis, ectopic, stone, torsion', detail: 'Migration of pain, β-hCG, urinalysis and exam signs carve the field.' },
      { stage: 'investigation', label: 'Focused exam + WBC + ultrasound/CT', detail: 'McBurney tenderness with rebound; imaging resolves the uncertain middle.' },
      { stage: 'interpretation', label: 'Localized peritonitis at McBurney point', detail: 'Parietal involvement = the appendix has inflamed its peritoneal covering.' },
      { stage: 'diagnosis', label: 'Acute appendicitis', detail: 'Clinical where classic; score-assisted (Alvarado concept) where ambiguous.' },
      { stage: 'management', label: 'Surgical pathway + fluids + antibiotics', detail: 'Appendicectomy (open/laparoscopic) per facility; resuscitation parallel.' },
      { stage: 'complication', label: 'Perforation → abscess → peritonitis', detail: 'Hours matter: perforation risk climbs across the first day or two of symptoms.' },
    ],
    crossLinks: [
      { conceptId: 'c2-surgery-appendicitis', label: 'Acute Appendicitis (this pack)', why: 'The flagship single-organ case of the acute-abdomen grammar.' },
      { conceptId: 'c-cholecystitis', label: 'Acute Cholecystitis', why: 'The RUQ member of the acute-abdomen family with its own Murphy logic.' },
      { conceptId: 'c-ulcer', label: 'Peptic Ulcer Disease', why: 'The perforation source behind the classic board-like abdomen.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; imaging pathways, antibiotic choice and operative thresholds are institution- and guideline-specific.',
    sources: [
      niceRef('Abdominal aortic aneurysm and acute abdomen-related guidance (surgical emergency framing)'),
      jhmiRef('Acute abdominal pain — patient-education resources'),
      ncbiRef('StatPearls — acute abdomen evaluation'),
      nhsRef('Stomach ache and abdominal pain — patient information'),
    ],
  },
  {
    id: 'c2-surgery-appendicitis',
    name: 'Acute Appendicitis',
    kind: 'disease',
    oneLiner: 'Obstruction and infection of the appendix — the commonest surgical emergency of the abdomen, famous for migrating pain and for mimicking everything else.',
    whyMatters: 'It is the disease every junior doctor is tested on: the classic clinical arc teaches visceral-to-parietal pain logic, the Alvarado score teaches structured scoring, and its complications (perforation, abscess, peritonitis) teach why surgical delays cost.',
    explain30s: 'The appendix obstructs (lymphoid hyperplasia in the young, faecolith in the older) → bacteria multiply → wall inflammation → the pain story: dull periumbilical pain (visceral, T10), then nausea/anorexia, then sharp right-lower-quadrant pain as the inflamed wall irritates the parietal peritoneum. Examination: McBurney-point tenderness, rebound, Rovsing/psoas/obturator signs. The Alvarado score organises the classic findings (migration, anorexia, nausea, RLQ tenderness, rebound, fever, leukocytosis, left shift) — a scoring AID, not a verdict. Management: appendicectomy (laparoscopic where available) with perioperative antibiotics; non-operative antibiotic pathways exist for selected uncomplicated cases. Untreated, it perforates — peritonitis, abscess, portal pyaemia.',
    eli5: 'The appendix is a tiny dead-end tube hanging off the start of the large intestine — like a short lane with no exit. If something blocks the lane (a hard little stone, or swollen tissue), germs get trapped and the lane swells like an infected pimple. Your body feels it in two stages: first the deep boring ache near the belly button (the lane itself whispering), then after some hours the pain moves and sharpens at the lower right of the belly (the wall next door getting angry). That move — whisper then shout, from middle to right-lower — is the classic clue. Left alone, the pimple bursts and floods the whole house. Surgery takes the little lane out before it bursts.',
    firstPrinciples: [
      'Obstruction is the initiating event: lymphoid follicle hyperplasia (children/young adults — often after viral illness) or faecolith (older patients) blocks the narrow lumen of a long, thin diverticulum.',
      'Closed-loop obstruction with ongoing mucosal secretion → rising intraluminal pressure → visceral pain (T10 referral to the umbilicus) → bacterial invasion of the stressed wall.',
      'Progression timeline (classic teaching): mucosal inflammation → full-thickness inflammation → serositis/parietal irritation (sharp, localised RLQ pain) → perforation (risk rising over the first ~24–48 h, greatest in the very young, elderly, and immunosuppressed).',
      'Anatomical variance explains atypical presentations: retrocaecal appendix (psoas irritation, back/flank pain), pelvic appendix (urinary/diarrhoeal mimic), long-tip appendix (RUQ pain) — position modifies the exam.',
      'The exam repertoire maps to anatomy: McBurney point (maximal tenderness at one-third from ASIS to umbilicus), Rovsing (LLQ palpation produces RLQ pain — peritoneal stretch), psoas (retrocaecal), obturator (pelvic).',
      'Scoring systems (Alvarado concept) exist to STRUCTURE uncertainty — they stratify who needs imaging vs theatre, they do not replace judgement.',
      'Treatment logic: remove the inflamed organ (or, in selected uncomplicated cases, antibiotic pathways per protocol); once perforated, control contamination — drain abscesses, lavage peritonitis.',
    ],
    normal: 'The appendix is a blind-ended lymphoid-rich diverticulum at the caecal pole (position variable); inflammation is absent, the lumen patent, the peritoneum quiet.',
    mechanism: 'Obstruction → distension (visceral pain) → mucosal ulceration → bacterial translocation (E. coli, anaerobes) → transmural inflammation → serosal exudate irritating the parietal peritoneum (somatic pain) → micro-abscesses → necrosis → perforation.',
    presentation: [
      'The classic arc: vague periumbilical ache → anorexia/nausea → vomiting (after pain — pain-then-vomiting distinguishes surgical from many medical causes) → sharp RLQ pain.',
      'Examination: low-grade fever, tachycardia, McBurney tenderness, guarding, rebound; Rovsing/psoas/obturator signs.',
      'Atypical: pelvic appendix → diarrhoea/urinary frequency; retrocaecal → flank pain, positive psoas; elderly — minimal signs until perforation (the immune system tells fewer lies quietly).',
      'Red flags of progression: sudden pain relief followed by diffuse rigidity (perforation), high fever, abdominal distension.',
    ],
    diagnosis: [
      'Clinical diagnosis in classic cases — history + examination carry it; imaging is for the uncertain middle, not the obvious.',
      'Labs: leukocytosis with neutrophil left shift (the classic pairing); CRP rises later (time-sensitive).',
      'Alvarado score (concept): migration, anorexia, nausea, RLQ tenderness, rebound, elevated temperature, leukocytosis, left shift — 10-point teaching structure.',
      'Ultrasound first-line in children/pregnant patients (non-compressible blind-ending tube, periappendiceal fluid); CT the most accurate where accessible; MRI in pregnancy when needed.',
      'β-hCG in every fertile woman — before imaging, before theatre.',
    ],
    differentials: [
      { name: 'Mesenteric adenitis', key: 'Viral prodrome, generalised nodes, pain without progression — the classic appendicitis mimic in children.' },
      { name: 'Ectopic pregnancy / ovarian torsion / PID', key: 'Female pelvic pathologies — β-hCG and pelvic exam arbitrate; torsion is a same-day surgery problem.' },
      { name: 'Right ureteric colic', key: 'Loin-to-groin waves, haematuria, patient writhing (peritonitis patients lie still).' },
      { name: 'Gastroenteritis', key: 'Diarrhoea-predominant, diffuse cramps, vomiting-before-pain order reversed.' },
      { name: 'Meckel diverticulitis / caecal pathology', key: 'Right-sided mimics resolved at laparoscopy if persistent.' },
    ],
    management: [
      'PRINCIPLE — appendicectomy is the classic definitive treatment (laparoscopic preferred where available); perioperative antibiotics per protocol.',
      'PRINCIPLE — antibiotic-first pathways exist for selected uncomplicated appendicitis (shared-decision, with recurrence risk) — protocol and patient choice decide; verify current guidance.',
      'PRINCIPLE — perforated disease changes the operation: lavage ± drain, abscess pathways (some drained radiologically after antibiotics first), longer antibiotics.',
      'PRINCIPLE — appendiceal mass (walled-off inflammation): the classic teaching is interval management — treat medically first, consider interval appendicectomy; acute dissection through a mass is avoided.',
    ],
    complications: [
      'Perforation with generalised peritonitis — the timing-driven emergency.',
      'Appendiceal abscess / pelvic abscess — delayed presentation, swinging fever.',
      'Portal pyaemia (septic portal vein thrombophlebitis) — the feared haematogenous spread.',
      'Adhesive obstruction in later life — the legacy of peritoneal contamination.',
      'Stump appendicitis / mucocele — rare late curiosities with exam value.',
    ],
    numbers: [
      { label: 'Alvarado components (concept)', value: 'Migration of pain · anorexia · nausea/vomiting · RLQ tenderness · rebound · fever · leukocytosis · left shift', note: 'The classic teaching score — thresholds and imaging-first strategies vary by guideline; it structures, never commands.' },
      { label: 'Pain-then-vomiting rule', value: 'Surgical pain precedes vomiting; medical vomiting often precedes pain', note: 'A classic sequencing clue in paediatric exams.' },
      { label: 'Perforation timing', value: 'Risk rises with symptom duration across the first day or two', note: 'The exact percentage varies across studies — quote the trend, not a memorised figure.' },
    ],
    mistakes: [
      'Discharging the classic arc as "gastritis" without a reassessment plan — the serial exam is the safety net.',
      'Missing appendicitis in the elderly and pregnant — signs are muted, imaging thresholds are lower.',
      'Operating through an appendix mass without planning — the mass changes the whole strategy.',
      'Relying on labs alone: a normal WBC does not exclude early appendicitis.',
    ],
    mnemonics: [
      { hook: 'MANTRELS (Alvarado letters)', expands: 'Migration, Anorexia, Nausea, Tenderness RLQ, Rebound, Elevated temp, Leukocytosis, Shift left.' },
    ],
    crossLinks: [
      { conceptId: 'c-appendicitis', label: 'Appendicitis (seeded concept)', why: 'The seeded concept pairs with this full clinical lesson.' },
      { conceptId: 'c2-surgery-acute-abdomen', label: 'Approach to the Acute Abdomen (this pack)', why: 'The grammar this disease illustrates best.' },
      { conceptId: 'c-torsion', label: 'Ovarian Torsion', why: 'The must-not-miss differential in the female patient with RLQ pain.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; antibiotic-first versus operative pathways and imaging strategies are guideline- and setting-specific.',
    sources: [
      niceRef('Appendicitis and abdominal pain guidance context'),
      jhmiRef('Appendicitis — patient-education resources'),
      ncbiRef('StatPearls — acute appendicitis'),
      nhsRef('Appendicitis — patient information'),
    ],
  },
  {
    id: 'c2-surgery-hernias',
    name: 'Hernias',
    kind: 'disease',
    oneLiner: 'A protrusion of contents through a weakness in the containing wall — inguinal, femoral, umbilical or incisional — classified above all by whether it can be reduced, and whether it is alive.',
    whyMatters: 'One of the commonest operations in general surgery, and the classic teaching model of anatomy-to-bedside reasoning (the inguinal canal); the real exam is urgency: reducible = planned surgery, irreducible = urgent, strangulated = emergency.',
    explain30s: 'A hernia has a neck, a sac and contents. The inguinal region is the classic site (indirect hernias follow the patent processus vaginalis pathway lateral to inferior epigastric vessels; direct hernias push through a weak posterior wall medial to them — Hesselbach’s triangle). Femoral hernias pass below the inguinal ligament and strangulate readily because of their narrow, rigid neck. Umbilical/paraumbilical and incisional hernias follow acquired weaknesses. Clinically: a cough-impulse swelling, reducible or not. The danger ladder: reducible → irreducible/incarcerated → obstructed (bowel sounds, vomiting) → strangulated (ischaemic, tender, tense, patient toxic) — strangulation is a surgical emergency with bowel viability at stake.',
    eli5: 'A hernia is like a bicycle inner tube pushing through a hole in the tyre. The tyre (muscle wall) has a weak spot; the inner tube (intestine) pokes through and makes a lump that comes and goes — bigger on coughing, smaller lying down. Usually harmless-looking but it never fixes itself. The danger is the hole pinching the loop: if the loop gets stuck and its blood supply is squeezed, that piece of bowel starts to die — painful, hard, red lump plus a sick patient. That’s not "watch and wait"; that’s an emergency operation. Doctors also care WHERE the hole is, because a small hard hole (like the femoral canal) pinches much more easily than a soft wide one.',
    firstPrinciples: [
      'Hernia = defect (neck) + sac (peritoneum) + contents (omentum/bowel); the neck’s rigidity, not the size of the bulge, determines strangulation risk.',
      'The inguinal canal anatomy drives classification: INDIRECT hernias pass through the deep ring lateral to the inferior epigastric vessels, along the canal (often congenital — patent processus vaginalis); DIRECT hernias bulge through Hesselbach’s triangle MEDIAL to the vessels (acquired weakness).',
      'Femoral hernia: below-and-lateral to the pubic tubercle, through the femoral canal — commonest in women, highest strangulation propensity (narrow, unyielding borders), and frequently the "small lump, big problem".',
      'Reducibility is the clinical fulcrum: reducible (contents slide back) → incarcerated (stuck) → obstructed (bowel blocked: colic, vomiting, distension) → strangulated (blood supply cut: constant pain, tenderness, tense/tender lump, systemic toxicity) — the ladder is the exam.',
      'Sliding, Richter and Littre hernias teach contents-logic: only part of the wall strangulates (Richter) — obstruction signs may be absent while ischaemia advances.',
      'Repair principles: anatomical reduction of contents, high ligation/excision of sac, and tension-free mesh reinforcement (the modern standard); emergency repair adds bowel-viability assessment ± resection.',
      'Never force-reduce a tense, tender hernia — you may reduce the strangulated segment en masse and "lose" the ischaemic bowel inside the abdomen.',
    ],
    normal: 'No cough impulse or expansile swelling at the inguinal/umbilical/femoral orifices; the processus vaginalis is obliterated; inguinal lymph nodes are soft, mobile, non-tender (a common lump-mimic).',
    mechanism: 'Raised intra-abdominal pressure (chronic cough, straining, constipation, heavy lifting, ascites, obesity) + wall weakness (patent processus vaginalis, collagen disorders, incisions, age) → progressive defect enlargement; narrow rigid necks compromise blood supply when contents cannot return.',
    presentation: [
      'Groin/lump that enlarges on standing/coughing, reduces lying down; dragging sensation; better in the morning.',
      'Incarceration/obstruction: colicky abdominal pain, vomiting, distension, absolute constipation with a stuck lump.',
      'Strangulation: severe constant pain over a tense, tender, non-reducible lump; fever, tachycardia — the toxic patient.',
      'Infants: intermittent groin/scrotal swelling (indirect); hydrocele is the classic differentiator (transilluminates, cannot be reduced).',
    ],
    diagnosis: [
      'Clinical examination is the diagnosis: stand the patient up, cough impulse, reducibility, and the ring-dilating exam (deep ring control test distinguishing indirect vs direct at the bedside — imperfect but classic).',
      'Transillumination and bowel sounds over the lump; scrotal exam separates hernia from hydrocele/varicocele/testicular pathology.',
      'Ultrasound where uncertain; CT for obstructed/obscure or incisional anatomy.',
      'Femoral vs inguinal relation to the pubic tubercle: hernia above the tubercle = inguinal; below-and-lateral = femoral (the classic landmark question).',
    ],
    differentials: [
      { name: 'Hydrocele', key: 'Transilluminates, non-reducible, surrounds the testis — get above it; you cannot get above a hernia.' },
      { name: 'Inguinal lymphadenopathy', key: 'Solid, non-reducible, no cough impulse; look for the distal source.' },
      { name: 'Femoral artery aneurysm / saphena varix', key: 'Pulsatile expansile / blanches and refills on lying — vascular tricks.' },
      { name: 'Undescended testis', key: 'Empty ipsilateral scrotum with a groin lump — examine the scrotum first, always.' },
    ],
    management: [
      'PRINCIPLE — elective tension-free mesh repair for reducible hernias in fit patients (truss devices are historical/palliative exceptions); watchful waiting is a shared-decision option for minimally symptomatic inguinal hernias per guidance.',
      'PRINCIPLE — irreducible without toxicity: urgent reduction attempt (Trendelenburg, analgesia, gentle sustained traction) then prompt surgical planning; never sedate-and-force.',
      'PRINCIPLE — strangulation is immediate surgery: resuscitate, antibiotics, decompress (NG tube), repair with viability assessment (the classic intraoperative colour/peristalsis checks) ± resection.',
      'PRINCIPLE — treat the pressure drivers before/after repair: cough, constipation, prostatism, weight — a repaired wall still tears under the same forces.',
    ],
    complications: [
      'Strangulation with bowel infarction/perforation — the reason no hernia is "just a lump".',
      'Postoperative: haematoma/seroma, chronic groin pain (inguinal nerve injury), recurrence (highest in emergency repairs), ischaemic orchitis.',
      'Obstruction from the hernia itself — the colic-vomiting-distension triad with a stuck lump.',
    ],
    numbers: [
      { label: 'The urgency ladder', value: 'Reducible → incarcerated → obstructed → strangulated', note: 'The single highest-yield framework of the topic.' },
      { label: 'Hesselbach’s triangle', value: 'Rectus (medial) · inferior epigastric vessels (lateral) · inguinal ligament (floor)', note: 'Direct hernias push through it; indirect ones arrive from lateral to the vessels.' },
      { label: 'Pubic tubercle rule', value: 'Inguinal hernia: above-and-medial · Femoral: below-and-lateral', note: 'The classic localisation exam point.' },
    ],
    mistakes: [
      'Sending a tense, tender, toxic patient home with an appointment — strangulation clock is hours.',
      'Force-reducing a strangulated hernia and losing the dead bowel inside.',
      'Calling every groin lump a hernia — hydrocele, nodes, vessels and testes must be excluded by exam.',
      'Missing a femoral hernia in a small elderly woman with obstruction and a "trivial" lump.',
    ],
    mnemonics: [
      { hook: 'MDs don’t Lie (Medial-Direct, Lateral-Indirect)', expands: 'Direct hernias medial to inferior epigastric vessels; indirect lateral — the anatomy question solved in one line.' },
    ],
    crossLinks: [
      { conceptId: 'c-hernia', label: 'Hernias (seeded concept)', why: 'The seeded concept pairs with this clinical deep-dive.' },
      { conceptId: 'c-femoral', label: 'Femoral Triangle (Anatomy)', why: 'The canal, the ring and the neighbours that make femoral hernias dangerous.' },
      { conceptId: 'c-int-obstruction', label: 'Intestinal Obstruction (seeded concept + this pack’s lesson)', why: 'Strangulated hernia is the classic external cause of small-bowel obstruction.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; watchful-waiting criteria, mesh choice and emergency pathways are guideline-specific.',
    sources: [
      niceRef('Inguinal hernia repair guidance'),
      jhmiRef('Hernia — patient-education resources'),
      ncbiRef('StatPearls — inguinal hernia and hernia complications'),
      nhsRef('Inguinal hernia — patient information'),
    ],
  },
  {
    id: 'c2-surgery-int-obstruction',
    name: 'Intestinal Obstruction',
    kind: 'disease',
    oneLiner: 'Blockage of the bowel’s transit — by adhesions, hernia, tumour or volvulus — producing the classic quartet of colicky pain, distension, vomiting and absolute constipation.',
    whyMatters: 'A common surgical emergency where the level of block predicts the picture (small vs large bowel), and the key question is never just "where" but "is the bowel alive" — strangulation converts a drip-and-suck problem into a same-day operation.',
    explain30s: 'Causes split into luminal (inside — faecal impaction, gallstone ileus), mural (wall — tumour, Crohn’s, intussusception) and extrinsic (outside — adhesions after surgery, hernias, volvulus). Small-bowel obstruction (SBO) — adhesions and hernias dominate — gives early, profuse vomiting and central colic with less distension; large-bowel obstruction (LBO) — tumour and volvulus dominate — gives marked distension and late vomiting with absolute constipation. Strangulation red flags: constant (non-colicky) pain, fever, tachycardia, peritonism, raised lactate. Management principle: resuscitate, decompress (NG tube), correct electrolytes ("drip and suck"), then operate for complete/mechanical or non-viable bowel; conservative trials suit adhesional partial obstruction.',
    eli5: 'Picture a long water-slide in a water park. If a raft jams in the middle, everything behind it piles up: the queue stretches (belly swells), the splash-back comes up the stairs (vomiting), and the cranking queue jerks forward in waves (colicky pain). Nothing comes out the end (no poo, no gas). Doctors ask two questions: WHERE did it jam (early-vomiting = high up; big-swell-late-vomit = lower down) and IS THE JAMMED PART STILL ALIVE? If the squeezed part turns purple (strangulation), it’s an emergency operation — you can’t wait. If it’s just a kink from an old operation scar, they often let time, drips and a tube draining the stomach untangle it.',
    firstPrinciples: [
      'Anatomy predicts the picture: proximal SBO vomits early and copiously (fluid loss + electrolyte chaos) with modest distension; distal/LBO distends greatly and vomits late — the duodenum-to-rectum gradient of capacity.',
      'The four cardinal features are one mechanism: dilated bowel contracts against the block (colic), fluid/air accumulates proximally (distension), contents reflux backward (vomiting), and nothing passes distally (absolute constipation/obstipation).',
      'Fluid shifts are the early killer: the obstructed loop sequesters litres into lumen and wall — "third-spacing" produces hypovolaemia and hypokalaemic metabolic alkalosis (high obstruction) — resuscitation is the first treatment.',
      'Strangulation is the binary question: compromised blood supply (band pressure, volvulus twist, intussusception) → ischaemia → perforation; constant pain, peritonism, fever, lactate rise are the alarms.',
      'Volvulus teaches rotation-logic: sigmoid (elderly, megacolon — coffee-bean sign) or caecal (mobile caecum) — detorsion (endoscopic for sigmoid when viable) or resection.',
      'Intussusception is the paediatric chapter: ileo-colic telescoping with red-currant-jelly stool and a sausage mass — the classic pair of enema-reduction and surgery.',
      'Pseudo-obstruction (Ogilvie) mimics obstruction without a mechanical cause — the reason imaging, not assumption, confirms the diagnosis before surgery.',
    ],
    normal: 'Bowel transit moves chyme aborally with peristaltic waves; abdomen soft, non-distended with normal bowel sounds; flatus and stool pass daily-ish by habit.',
    mechanism: 'Obstruction → proximal dilation → increased secretion and decreased absorption → distension, vomiting, fluid sequestration; venous compression precedes arterial (the strangulation order) → mucosal ischaemia → bacterial translocation → gangrene/perforation.',
    presentation: [
      'Central colicky pain, waves every few minutes, patient restless (vs peritonitis: still).',
      'Vomiting: bilious → faeculent in established SBO (stasis + bacterial action).',
      'Distension + visible peristalsis (thin elderly) + tinkling bowel sounds (the classic auscultation pearl).',
      'Hernial orifices examined in EVERY patient — the external cause you must not miss; scars read like a map of adhesions.',
    ],
    diagnosis: [
      'Erect chest X-ray (perforation exclusion) + supine abdominal film: central valvulae-coniventes ladder loops (SBO) vs peripheral haustration (LBO); sigmoid volvulus coffee-bean.',
      'CT abdomen-pelvis is the modern decision-maker: transition point, cause, ischaemia signs (bowel-wall enhancement, mesenteric fluid, free air).',
      'Labs: electrolytes/creatinine (third-spacing), lactate (ischaemia), WBC/CRP.',
      'A contrast enema/Water-soluble study clarifies LBO level and can be therapeutic (sigmoid volvulus detorsion).',
    ],
    differentials: [
      { name: 'Paralytic ileus', key: 'Silent abdomen, no colic, postoperative/peritonitic/drug (opioid) context — the non-mechanical twin.' },
      { name: 'Pseudo-obstruction (Ogilvie)', key: 'Massive colonic dilation in the elderly/systemically ill — decompress rather than resect.' },
      { name: 'Acute gastroenteritis', key: 'Diarrhoea-led illness with cramps — obstipation and imaging separate it.' },
      { name: 'Mesenteric ischaemia', key: 'Pain out of proportion early, minimal distension — the vascular impostor.' },
    ],
    management: [
      'PRINCIPLE — drip and suck first: IV resuscitation with electrolyte correction, nasogastric decompression, catheter + monitoring; most adhesional partial SBO settles conservatively.',
      'PRINCIPLE — strangulation or complete mechanical obstruction = surgery: resuscitation runs in parallel, never in series.',
      'PRINCIPLE — volvulus has its own ladder: sigmoid — endoscopic detorsion when viable, then elective fixation/resection; caecal — usually surgery.',
      'PRINCIPLE — LBO in adults is cancer until excluded: tissue diagnosis/staging drives resection or stent decisions.',
    ],
    complications: [
      'Strangulation → gangrene → perforation → faecal peritonitis — the escalation everyone is watching for.',
      'Severe dehydration, acute kidney injury and electrolyte derangement from third-spacing and vomiting.',
      'Aspiration of vomitus — the anaesthetic risk of an unprotected stomach.',
      'Recurrence after conservative settling (adhesions reform and re-kink).',
    ],
    numbers: [
      { label: 'The cardinal quartet', value: 'Colicky pain · distension · vomiting · absolute constipation', note: 'Order and prominence map to LEVEL: vomiting early + distension late = high; the reverse = low.' },
      { label: 'Radiology anchors', value: 'Valvulae coniventes cross the WHOLE loop (small); haustra do not (large); coffee-bean = sigmoid volvulus', note: 'The three pattern-recognition exam points.' },
      { label: 'SBO top causes', value: 'Adhesions · hernias · (then malignancy/Crohn’s)', note: 'The classic "AH-HA" list — examine the orifices and the scars.' },
    ],
    mistakes: [
      'Not examining hernial orifices — the most preventable missed cause.',
      'Waiting out fever, tachycardia, constant pain or rising lactate — strangulation does not negotiate.',
      'Calling faeculent vomiting "gastric flu" — it is late SBO until imaged.',
      'Forgetting Ogilvie/ileus and operating on a non-mechanical problem.',
    ],
    mnemonics: [
      { hook: 'AH-HA causes of SBO', expands: 'Adhesions · Hernia · (Intussusception), Hernia again — the exam favourites; then malignancy, volvulus.' },
    ],
    reasoning: [
      { stage: 'symptom', label: 'Colicky central pain + vomiting + distension + no flatus', detail: 'The quartet; timing of vomiting vs distension suggests level.' },
      { stage: 'mechanism', label: 'Mechanical block with proximal dilation', detail: 'Luminal/mural/extrinsic; strangulation risk assessed from the start.' },
      { stage: 'differential', label: 'Ileus, pseudo-obstruction, ischaemia', detail: 'Bowel-sound character, drug/surgery history, vascular risk profile.' },
      { stage: 'investigation', label: 'Erect CXR + abdominal film → CT', detail: 'Free-air exclusion first; CT finds transition point and ischaemia signs.' },
      { stage: 'interpretation', label: 'SBO at adhesion band, no ischaemia signs', detail: 'Dilated small loops, transition point, enhancing walls.' },
      { stage: 'diagnosis', label: 'Adhesional small-bowel obstruction', detail: 'Previous laparotomy + CT pattern.' },
      { stage: 'management', label: 'Drip-and-suck with serial reassessment', detail: 'Fluids, NG, electrolytes; surgery if fails or worsens.' },
      { stage: 'complication', label: 'Strangulation watch', detail: 'Constant pain, peritonism, lactate — the triggers that convert conservative to operative.' },
    ],
    crossLinks: [
      { conceptId: 'c-int-obstruction', label: 'Intestinal Obstruction (seeded concept)', why: 'The seeded concept pairs with this full clinical lesson.' },
      { conceptId: 'c2-surgery-hernias', label: 'Hernias (this pack)', why: 'The strangulated external hernia is the classic surgical cause.' },
      { conceptId: 'c-fluids', label: 'Fluid & Electrolyte Physiology', why: 'Third-spacing and vomiting are electrolyte exams in real time.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; conservative vs operative thresholds, contrast choices and detorsion pathways are institution-specific.',
    sources: [
      niceRef('Bowel obstruction-related surgical guidance context'),
      jhmiRef('Bowel obstruction — patient-education resources'),
      ncbiRef('StatPearls — small bowel obstruction'),
      nhsRef('Bowel obstruction — patient information'),
    ],
  },
  {
    id: 'c2-surgery-wounds-healing',
    name: 'Wounds & Wound Healing',
    kind: 'process',
    oneLiner: 'Injury triggers a four-phase repair programme — haemostasis, inflammation, proliferation, remodelling — and the surgeon’s job is to keep infection, dead tissue and tension from breaking the script.',
    whyMatters: 'Every incision, ulcer, burn and abscess runs the same biology; understanding it explains why wounds dehisce, why diabetics ulcerate, why keloids rise, and why "clean, conservative, closed" is the grammar of surgical wound care.',
    explain30s: 'Phase 1 — haemostasis (minutes): platelet plug + fibrin clot, which also becomes the scaffold and signal source. Phase 2 — inflammation (days 1–4): neutrophils then macrophages clean debris; the cardinal signs are visible. Phase 3 — proliferation (days 4–21): fibroblasts lay collagen, new vessels sprout (granulation tissue — the pink, granular, bleeds-on-touch tissue), epithelium crawls across. Phase 4 — remodelling (months): collagen reorganises and gains strength — the classic teaching arc that a healed wound reaches most of its final strength by ~6–8 weeks, but NEVER regains pre-injury strength. Classify by intention: primary (closed immediately — clean surgical), secondary (left open, heals by granulation — infected/contaminated), tertiary/delayed primary (cleaned for days, then closed). Healing failure factors: infection, ischaemia, dead space, tension, smoking, steroids, diabetes, malnutrition, radiation.',
    eli5: 'A wound is like a burst pipe in a wall, and your body has a four-step repair crew. Step 1, the plumber: blood clots plug the leak in minutes (that scab is the plug). Step 2, the demolition crew: for a few days, white cells clear out germs and rubble — that’s why it looks red and puffy; it’s construction, not disaster. Step 3, the builders: new scaffolding (collagen) and tiny new pipes (blood vessels) grow in — the pink bumpy "granulation" tissue is the new wall being built. Step 4, the painters: over months, the scaffold is trimmed and tightened into a flat, pale scar. Wounds heal badly when the crew is sabotaged — germs keep attacking (infection), no blood arrives (poor circulation, smoking), sugar floods the site (diabetes), or the wall is stitched too tight.',
    firstPrinciples: [
      'Haemostasis is also signalling: the platelet-fibrin clot releases growth factors (PDGF, TGF-β) that recruit the next phase — the clot is scaffold + letterbox, not just a plug.',
      'The inflammatory phase is quality control: neutrophils (first 24–48 h) sterilise; macrophages (48–72 h onward) debride AND orchestrate — "no macrophage, no healing" (the classic experiment).',
      'Proliferation is construction: fibroblasts synthesize type-III-then-I collagen; angiogenesis (VEGF) feeds it; myofibroblasts contract the wound (the reason secondary-intention wounds shrink); epithelium migrates within 24–48 h if the bed is clean.',
      'Remodelling is the long tail: collagen III → I replacement, cross-linking, and the strength curve — a burst-strength plateau well below intact skin, permanent; hypertrophic scars overshoot within the wound, keloids escape beyond it.',
      'Intention classification is a treatment map: primary closure for clean wounds (best cosmesis, fastest), secondary intention for infected/dirty (heals from the base — slower, larger scar), delayed primary (tertiary) for contaminated wounds kept open until "clean", then closed.',
      'The risk-factor list is the exam: local (infection, dead space, tension, ischaemia, foreign body) and systemic (diabetes, malnutrition/hypoalbuminaemia, steroids, chemotherapy, radiation, smoking, age, anaemia/hypoxia).',
      'Wound assessment grammar: colour (red = granulate/healthy, yellow = slough, black = necrosis — the TIME framework), exudate volume, edge character (punched-out, undermined, everted — each hints at cause: ischaemia, infection, malignancy).',
    ],
    normal: 'Unbroken skin: stratum corneum barrier, balanced collagen turnover, sterile dermis; a fresh surgical wound passes through the four phases without clinical infection, closing scars by ~7–10 days and strengthening over months.',
    mechanism: 'Cytokine choreography: platelet growth factors → neutrophil/macrophage influx → macrophage-derived factors (TGF-β, VEGF, PDGF) drive fibroblast/endothelial proliferation → matrix metalloproteinases remodel — every chronic wound is a stall somewhere on this line (usually the inflammatory→proliferative transition).',
    presentation: [
      'Normal healing: mild erythema, serous exudate early, granulation by day 4–6, epithelial bridge by ~7–10 days.',
      'Infection: spreading erythema/warmth, purulent exudate, increasing (not decreasing) pain after day 2, fever — "day-3 pain that rises" is the alarm.',
      'Dehiscence: serosanguinous "pink gush" from a closed wound — the classic prelude; evisceration is the emergency version.',
      'Chronic non-healing (ulcer): stalled in inflammation — venous (gaiter area, sloughy, exudative), arterial (punched-out, painful, distal), neuropathic (pressure points, painless, callused edge), malignant (Marjolin’s in old scars).',
    ],
    diagnosis: [
      'Structured assessment: site, size (measure — never estimate), bed colour (TIME framework), exudate, edge, pain, and the artery/nerve/vein checks that categorise ulcers.',
      'Infection workup: swab/tissue culture (clinical signs decide treatment — a positive swab alone is colonisation, not infection), markers (WBC/CRP) when systemic.',
      'Beneath-the-wound checks: probe for sinus/foreign body, X-ray for gas (clostridial/necrotising infection — the emergency), osteomyelitis evaluation in chronic exposed bone.',
      'Systemic audit: Hb, albumin, glucose/HbA1c, perfusion (ABPI), nutrition.',
    ],
    differentials: [
      { name: 'Cellulitis vs infected wound', key: 'Diffuse spreading erythema without a wound bed vs purulent focus — both need antibiotics; only one needs drainage.' },
      { name: 'Necrotising fasciitis', key: 'Pain out of proportion, rapid spread, crepitus/gas, grey discharge, systemic toxicity — surgical emergency of the first order.' },
      { name: 'Venous vs arterial vs neuropathic ulcer', key: 'Medial gaiter/exudative/pulse-present · painful punched-out/pulse-absent · painless over pressure/callus — the triad every viva asks.' },
      { name: 'Marjolin’s ulcer', key: 'Squamous carcinoma rising in a long-standing scar/burn — the reason old non-healing wounds get biopsied.' },
    ],
    management: [
      'PRINCIPLE — control the four saboteurs first: infection (drain, debride, targeted antibiotics), ischaemia (revascularise/optimise perfusion), dead space & tension (surgical technique), and systemic deficits (glucose, nutrition, smoking, oedema).',
      'PRINCIPLE — debridement is the foundation: remove necrotic tissue and foreign bodies — no dressing heals a dirty bed.',
      'PRINCIPLE — moist wound environment: modern dressings keep the bed moist (epithelialisation is faster on moisture), with exudate managed (absorbent) and dryness avoided; specific dressing choice is local-protocol territory.',
      'PRINCIPLE — match closure strategy to contamination: clean → primary; contaminated → delayed primary; infected/dirty → secondary intention; antibiotics are NOT a substitute for surgical source control.',
      'PRINCIPLE — special wounds follow special rules: bites (never close blindly, high inoculum), punctures (tetanus cover), pressure areas (offloading is the drug), diabetic foot (multi-disciplinary).',
    ],
    complications: [
      'Infection → cellulitis/abscess → necrotising fasciitis (the escalation ladder).',
      'Dehiscence and evisceration — burst abdomen mechanics (the midline wound that failed).',
      'Hypertrophic scar and keloid — collagen overshoot beyond the wound margins (keloid; pigmentation and chest/ear-lobe predilection classically taught).',
      'Chronic ulceration and Marjolin’s transformation — the decades-later malignancy risk.',
      'Suture abscess, stitch granuloma, trap-door scars — the minor-but-common set.',
    ],
    numbers: [
      { label: 'Phase timeline (classic teaching)', value: 'Haemostasis: minutes · Inflammation: ~days 1–4 · Proliferation: ~days 4–21 · Remodelling: months–year', note: 'The canonical arc — healing is a schedule, and every complication has a phase where it bites.' },
      { label: 'Strength anchor', value: 'Healed wound regains only a fraction of original tensile strength — and most of its final strength within ~6–8 weeks', note: 'The classic teaching point behind "no heavy lifting for 6 weeks".' },
      { label: 'Wound colour grammar (TIME)', value: 'Red = granulation (heal) · Yellow = slough (debride) · Black = necrosis (excise)', note: 'The bedside triage of any ulcer bed.' },
    ],
    mistakes: [
      'Antibiotics for every pink wound edge — colonisation is not infection; signs decide.',
      'Closing infected wounds primarily — the classic dehiscence recipe.',
      'Calling all ulcers "diabetic" without feeling pulses, checking sensation and assessing veins.',
      'Letting a wound "dry out" — the moist-bed principle is modern standard teaching.',
    ],
    mnemonics: [
      { hook: 'HIPE', expands: 'Haemostasis · Inflammation · Proliferation · End (remodelling) — the four phases in order.' },
      { hook: 'DIRTY wounds stay open', expands: 'Delayed primary closure for contaminated wounds — clean them today, close them Friday (the teaching shorthand).' },
    ],
    crossLinks: [
      { conceptId: 'c-inflamm', label: 'Inflammation (Pathology, para-clinical pack)', why: 'Phase 2 is applied pathology — cells, mediators and signs.' },
      { conceptId: 'c2-fmt-wound-types', label: 'Wound Types (Forensic Medicine, para-clinical pack)', why: 'The medico-legal characterisation of wounds — age, weapon, vitality.' },
      { conceptId: 'c-steroids', label: 'Corticosteroids (Pharmacology)', why: 'The classic systemic heal-slower drug — collagen synthesis suppression.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; dressing selection, antibiotic policy and closure strategies are protocol-specific.',
    sources: [
      niceRef('Surgical site infections and wound-care guidance'),
      ncbiRef('StatPearls — wound healing phases'),
      cdcRef('Surgical site infection prevention resources'),
      nhsRef('Wound care and leg ulcers — patient information'),
    ],
  },
  // ═══════════════════════ OBGYNECOLOGY (4) ═════════════════════════════════
  {
    id: 'c2-obgy-normal-labour',
    name: 'Normal Labour — Stages & Progress',
    kind: 'process',
    oneLiner: 'Labour is the coordinated sequence that delivers the fetus and placenta through three stages — dilatation, delivery, placental separation — monitored against partograph landmarks and known failure patterns.',
    whyMatters: 'The most common "operation" in medicine happens without an operating table; recognising normal progress (and the P and the partograph that detects its failure) is the core clinical skill of obstetrics, and PPH prevention begins in the third stage.',
    explain30s: 'Labour begins with regular painful contractions producing cervical change. Stage 1 (onset → full dilatation ~10 cm): early/latent phase, then ACTIVE phase — the partograph’s steep "alert line" territory — where the cervix dilates progressively and the head descends; the classic rate anchor is ~1 cm/hour in active first stage (multiparous faster) — progress, not the clock alone, is the point. Stage 2 (full dilatation → baby born): pushing with contractions, perineal phase; prolonged stage 2 is a recognised risk state. Stage 3 (birth → placenta delivered): the placenta separates (cord lengthening, gush of blood, uterus becomes globular) — and ACTIVE management (prophylactic uterotonic like oxytocin, controlled cord traction, uterine massage) is the evidence-based PPH-prevention package. Throughout: the four Ps — Power (contractions), Passenger (fetus/lie/presentation/position), Passage (pelvis), and Psyche — and the partograph as the single-page vigilance instrument.',
    eli5: 'Childbirth has three innings. Inning one: the door (cervix) slowly opens from closed to fully open (about 10 cm) — contractions are like waves squeezing a tube of toothpaste from the top; the waves must get longer, stronger and closer together. Inning two: pushing — mother and uterus work together and the baby travels through the pelvis, rotating like a key turning in a lock. Inning three: after the baby, the placenta peels off the wall and comes out — and doctors actively help (a medicine that squeezes the uterus + gentle traction) because a soft uterus is the number-one cause of dangerous bleeding right here. Midwives draw all this on ONE chart (the partograph): a line where progress should be — crossing it means "look for trouble now", not tomorrow.',
    firstPrinciples: [
      'Labour is defined as regular painful contractions WITH progressive cervical change — contractions alone before term are practice (Braxton Hicks), and change is the objective half of the definition.',
      'Stage 1 is dilatation: latent (slow, variable) → active (progressive, plot on the partograph); the classic anchors are full dilatation ≈10 cm and an active-phase rate around ~1 cm/h (first labours slower) — "expect progress" beats "expect hours".',
      'Stage 2 is descent and delivery: maternal pushing (Valsalva with contractions) + uterine force; the cardinal movements (engagement, descent, flexion, internal rotation, extension by crowning, restitution, external rotation) are the fetus negotiating the pelvic geometry.',
      'Stage 3 is separation and delivery of the placenta: signs of separation (cord lengthening, sudden blood gush, globular rising uterus); ACTIVE third-stage management — prophylactic uterotonic (oxytocin classically), controlled cord traction, uterine massage — prevents PPH (the strongest-evidence intervention in the stage).',
      'The four Ps frame every stalled labour: Power (contraction strength/frequency), Passenger (size, lie, presentation, position — occipito-posterior is the classic slow-labour position), Passage (pelvic adequacy, soft-tissue resistance), Psyche (pain, fear, support — catecholamines genuinely slow labour).',
      'The partograph is a one-page algorithm: cervical-dilatation curves (alert/action lines concept), plus fetal heart, moulding, caput, contractions, drugs, fluids — crossing the action line means active decision, not observation by default.',
      'Pain and support are physiological inputs, not comforts: continuous support and mobilisation improve outcomes — a rare case where kindness is evidence-based.',
    ],
    normal: 'Term singleton fetus in cephalic presentation with flexed head; regular contractions → progressive dilatation; fetal heart normal (~110–160/min classic range); third stage completes with minimal bleeding after active management.',
    mechanism: 'Fetal-maternal signalling (fetal cortisol/prostaglandin pathway, oxytocin sensitivity rising) → myometrial gap-junction activation → coordinated contractions; Ferguson reflex (distension → oxytocin release) sustains the positive-feedback loop; cervical ripening (collagen softening) precedes dilatation.',
    presentation: [
      'True labour: regular, increasing contractions + show (mucus plug) + progressive dilatation.',
      'Stage-2 hallmarks: maternal urge to push, perineal bulging, crowning.',
      'Stage-3 separation signs: cord lengthening, gush of blood, uterus rising/globular.',
      'Red flags: fetal heart abnormality (bradycardia/pattern change), meconium-stained liquor, crossing action line, bleeding, fever, cord prolapse (the immediate emergency).',
    ],
    diagnosis: [
      'Assessment: abdominal exam (lie, presentation, station), vaginal exam (dilatation, effacement, position, membranes, moulding/caput).',
      'Progress plotting: partograph with alert/action-line concept; descent measured in fifths palpable.',
      'Fetal wellbeing: intermittent auscultation (low-risk) or continuous monitoring (risk-based) per protocol.',
      'Maternal wellbeing: hydration, urine (ketones/protein), BP/pulse, analgesia.',
    ],
    differentials: [
      { name: 'False labour (Braxton Hicks)', key: 'Irregular, no cervical change, relieved by rest — the classic triage distinction.' },
      { name: 'Brachystatic lower segment vs obstruction', key: 'Bandl’s ring in obstructed labour — the emergency shape of a neglected uterus.' },
      { name: 'Bloody show vs APH', key: 'Mucus-tinged spotting is normal; fresh bleeding is placenta/abruption territory (see antenatal lesson).' },
    ],
    management: [
      'PRINCIPLE — monitor the four Ps and plot the partograph; intervene on PROGRESS deviations (augmentation with amniotomy/oxytocin per protocol) rather than arbitrary clocks.',
      'PRINCIPLE — fetal surveillance matched to risk: auscultation schedules vs continuous monitoring; decelerations/bradycardia trigger defined response pathways.',
      'PRINCIPLE — ACTIVE third-stage management for every delivery (unless contraindicated): prophylactic uterotonic first, then controlled cord traction and massage — the PPH-prevention package.',
      'PRINCIPLE — operative delivery thresholds are defined (prolonged stage 2, fetal distress patterns) — instrument/CS decisions follow unit protocol and clinical judgement.',
      'PRINCIPLE — psychological support and analgesia are part of obstetric quality: continuous support, mobility, and chosen analgesia improve the experience without slowing well-progressing labour.',
    ],
    complications: [
      'Postpartum haemorrhage — the great one (see its own logic: tone, trauma, tissue, thrombin).',
      'Prolonged/obstructed labour → obstructed-labour injury (vesico-vaginal fistula in neglected cases) — a global equity issue.',
      'Fetal compromise: hypoxia patterns, shoulder dystocia (the unpredicted stage-2 emergency — help call, McRoberts, suprapubic pressure sequence).',
      'Cord prolapse — hands-and-knees + immediate pathway; retained placenta; perineal tears.',
    ],
    numbers: [
      { label: 'Full dilatation', value: '≈10 cm', note: 'The stage-1/2 boundary — the one number every textbook agrees on.' },
      { label: 'Active-phase progress anchor', value: '≈1 cm/hour (classically slower in first labours)', note: 'A teaching anchor, not a stopwatch — modern curves allow slower latent progress; the partograph decides the patient’s own line.' },
      { label: 'Fetal heart normal range', value: '≈110–160 beats/min', note: 'The baseline within which patterns are interpreted.' },
      { label: 'Third-stage package', value: 'Uterotonic + controlled cord traction + uterine massage', note: 'The active-management trio — proven PPH prevention.' },
    ],
    mistakes: [
      'Calling contractions without cervical change "labour" — the definition is change.',
      'Passive third stage — omitting the prophylactic uterotonic is the classic PPH-prevention failure.',
      'Ignoring the partograph action line — crossing it demands a decision, documented.',
      'Missing shoulder dystocia preparation: every stage-2 birth needs a rehearsed emergency plan in the room.',
    ],
    mnemonics: [
      { hook: 'The four Ps', expands: 'Power · Passenger · Passage · Psyche — every stalled labour is one of these (or a mix).' },
      { hook: 'TTTS for separation signs', expands: 'Traction (cord lengthens) · Turbulence (blood gush) · Toner (uterus globular) — placenta is peeling.' },
    ],
    crossLinks: [
      { conceptId: 'c-partograph', label: 'Partograph & Labour Progress (seeded concept)', why: 'The one-page instrument this lesson is organised around.' },
      { conceptId: 'c-pph', label: 'Postpartum Haemorrhage', why: 'Stage-3 management IS PPH prevention — same hour, same thinking.' },
      { conceptId: 'c-oxytocin', label: 'Oxytocin (Pharmacology)', why: 'The contraction physiology and its most-prescribed drug.' },
      { conceptId: 'c-previa', label: 'Placenta Praevia', why: 'The bleeding-at-delivery differential that changes the whole plan.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; labour-curve definitions, augmentation protocols and third-stage regimens are guideline-specific.',
    sources: [
      whoRef('Intrapartum care recommendations and partograph framing'),
      niceRef('Intrapartum care guidance'),
      ncbiRef('StatPearls — stages of labor'),
      nhsRef('Labour and birth — patient information'),
    ],
  },
  {
    id: 'c-preec',
    name: 'Pre-eclampsia & Eclampsia',
    kind: 'disease',
    oneLiner: 'New hypertension with organ involvement after 20 weeks of pregnancy — a placenta-driven, two-stage disease whose seizures (eclampsia) are prevented by magnesium sulphate and cured only by delivery.',
    whyMatters: 'A leading cause of maternal and perinatal death worldwide — and the flagship example of a disease where the cure (delivery) is also the timing dilemma (prematurity); the 20-week line, severe-feature recognition and magnesium logic are exam-perennial.',
    explain30s: 'Stage 1 is placental: faulty trophoblast invasion → poor spiral-artery remodeling → an under-perfused placenta releasing anti-angiogenic factors (sFlt-1 concept) into the mother. Stage 2 is maternal: endothelial damage everywhere — hence hypertension, proteinuria (kidney), cerebral irritability/headache (brain), RUQ pain with raised transaminases (liver), low platelets (blood), pulmonary oedema, IUGR (placenta). Diagnosis: new BP ≥140/90 after 20 weeks + proteinuria or organ features; severe features classically at ≥160/110 or organ involvement. The only cure is delivery — timing balances maternal risk against fetal maturity. Magnesium sulphate prevents/recovers eclamptic seizures (the landmark evidence); BP control and fluid restraint complete the package; hellp syndrome is the liver-platelet variant.',
    eli5: 'During pregnancy, the placenta should remodel the mother’s arteries so it can feed the baby — like renovating a house’s plumbing before moving in. In pre-eclampsia the renovation is botched: the placenta gets grumpy and floods the mother’s blood with chemicals that poison the lining of ALL her blood vessels (stage 2). Poisoned vessels leak and squeeze: pressure rises, kidneys leak protein, the liver aches under the right ribs, platelets drop, the brain gets irritable (headache, flashing lights). The only repair is to deliver — the placenta comes out, the poison stops. Until then, doctors lower pressure carefully and give magnesium sulphate — a mineral drink for the nerves that stops seizures (eclampsia). The scary part: some mothers feel "just a headache" while their organs are quietly in danger — that is why every headache in a pre-eclamptic woman is taken seriously.',
    firstPrinciples: [
      'Two-stage model: stage 1 — defective placentation (shallow trophoblast invasion, failed spiral-artery conversion) creates ischaemic placenta; stage 2 — released factors (anti-angiogenic sFlt-1/endothelin concepts) cause widespread maternal endothelial dysfunction — the phenotype is systemic because the endothelium is systemic.',
      'The 20-week line defines the syndrome: hypertension NEW after 20 weeks with proteinuria or organ features; before 20 weeks think molar pregnancy or chronic hypertension (the timing itself is diagnostic logic).',
      'Endothelial failure explains every feature: kidney (proteinuria, oliguria), brain (headache, visual phenomena, hyperreflexia, seizures), liver (RUQ pain, transaminitis, capsular stretch), blood (haemolysis/low platelets — HELLP), lungs (oedema), placenta (growth restriction, abruption).',
      'Severe features are the escalation trigger: severe-range pressure (classic anchor ≥160/110), symptoms (headache/visual/RUQ), organ labs — each mandates admission-level care.',
      'Eclampsia = seizures in a pre-eclamptic — and can be the FIRST presentation; magnesium sulphate is the established seizure-prevention/treatment (superior to diazepam-class in the landmark comparisons), with reflex monitoring (respiration, reflexes, urine output).',
      'Delivery is the cure — the dilemma is timing: maternal deterioration argues for delivery; fetal prematurity argues for delay; corticosteroids for lung maturity and expectant management buy time ONLY while both mother and fetus remain stable.',
      'Fluid logic is inverted from other shock states: endothelial leak makes these patients vulnerable to pulmonary oedema — restrained fluids and careful balance charts are part of the protocol.',
    ],
    normal: 'Pregnancy physiologically lowers systemic vascular resistance with a mid-trimester BP dip; mild dependent oedema and glycosuria can be normal; proteinuria should be absent on clean samples.',
    mechanism: 'Placental ischaemia → oxidative stress → sFlt-1/soluble-endoglin rise, VEGF/PIGF fall → endothelial gap opening and vasospasm → hypertension, protein leak, organ hypoperfusion; seizures reflect cerebral vasospasm/oedema + irritability, not a primary brain lesion.',
    presentation: [
      'Often silent until measured — the BP cuff and dipstick ARE the screening programme.',
      'Warning symptoms: frontal headache, visual disturbance (flashing/photopsia), epigastric/RUQ pain, sudden swelling, rapid weight gain.',
      'Severe: seizures (eclampsia), severe hypertension, oliguria, pulmonary oedema, placental abruption, abnormal fetal growth/movements.',
      'HELLP variant: right-upper-quadrant pain + nausea/vomiting + malaise with haemolysis, elevated liver enzymes, low platelets — sometimes WITHOUT dramatic hypertension (the classic deceptive case).',
    ],
    diagnosis: [
      'BP ≥140/90 on two occasions (≥4 h apart classically) after 20 weeks in a previously normotensive woman — pre-eclampsia once proteinuria (≥300 mg/24 h concept or dipstick/ACR pathways) or organ features join.',
      'Labs screen the organs: FBC/platelets, liver enzymes, creatinine, uric acid (supportive), urine protein quantification.',
      'Fetal assessment: growth scans, dopplers, CTG — the other half of the timing decision.',
      'Magnesium monitoring: knee reflexes, respiratory rate, urine output (the bedside toxicity triad).',
    ],
    differentials: [
      { name: 'Gestational hypertension', key: 'New BP after 20 weeks WITHOUT proteinuria/organ features — the milder sibling requiring the same vigilance.' },
      { name: 'Chronic/secondary hypertension', key: 'Present BEFORE 20 weeks — a different disease plan (and a higher pre-eclampsia risk).' },
      { name: 'HELLP vs other liver disease', key: 'Viral hepatitis/gallstones/ITP — the pregnancy context plus haemolysis points to HELLP.' },
      { name: 'Molar pregnancy', key: 'Pre-20-week hypertension + uterine size > dates + hyperemesis — scan settles it.' },
    ],
    management: [
      'PRINCIPLE — the only cure is delivery of the placenta: expectant management (steroids, surveillance) only while maternal and fetal conditions are stable; deterioration terminates the expectant plan.',
      'PRINCIPLE — magnesium sulphate for seizure prevention (severe disease) and treatment (eclampsia): protocolised loading/maintenance with bedside toxicity monitoring (reflexes, respiration, output); calcium gluconate is the reversal antidote.',
      'PRINCIPLE — antihypertensive control of severe-range pressures (commonly used agents per protocol — labetalol, nifedipine, hydralazine classes); ACE inhibitors/ARBs are contraindicated in pregnancy.',
      'PRINCIPLE — fluid restraint: hourly balance, watch lungs; pulmonary oedema is an iatrogenic-adjacent hazard.',
      'PRINCIPLE — the multidisciplinary equation: obstetrics + anaesthesia (epidural coagulation questions, airway for seizures) + neonatology; every pre-eclamptic delivery plans for the baby too.',
    ],
    complications: [
      'Eclamptic seizures — cerebral injury, aspiration, fetal hypoxia.',
      'HELLP syndrome, hepatic rupture/infarction, renal failure, pulmonary oedema — the maternal organ cascade.',
      'Placental abruption, IUGR, stillbirth — the fetal half of the disease.',
      'Cardiovascular and renal risk later in life — pre-eclampsia is a "stress test" revealing lifelong risk (the classic long-term counselling point).',
      'Postpartum persistence: fits can occur up to days after delivery — the disease ends at the placenta, not the baby’s birth.',
    ],
    numbers: [
      { label: 'Diagnostic pressure line', value: 'New BP ≥140/90 after 20 weeks', note: 'The classic diagnostic anchor — with proteinuria or organ features for pre-eclampsia.' },
      { label: 'Severe-range pressure (classic anchor)', value: '≥160/110 mmHg', note: 'Escalation territory; exact action thresholds are guideline-defined.' },
      { label: 'Proteinuria anchor', value: '≥300 mg/24 h (concept) or ACR/dipstick pathways', note: 'The kidney leg of the triad — quantification methods vary by guideline.' },
      { label: 'The 20-week line', value: 'Before 20 weeks = not pre-eclampsia (think chronic/molar)', note: 'Timing IS the diagnostic instrument.' },
    ],
    drugs: [
      { name: 'Magnesium sulphate', drugClass: 'Anticonvulsant (mineral)', mechanism: 'NMDA antagonism and vasodilatory/neuromuscular effects — prevents and treats eclamptic seizures', note: 'The landmark-evidence drug of the topic; toxicity monitored by reflexes/respiration/urine; calcium gluconate reverses.' },
      { name: 'Labetalol / nifedipine / hydralazine', drugClass: 'Antihypertensives (obstetric staples)', mechanism: 'Controlled BP reduction without uteroplacental steal', note: 'Agent and route are protocol choices; avoid ACEi/ARBs in pregnancy.' },
      { name: 'Corticosteroids (antenatal)', drugClass: 'Fetal lung maturity accelerant', mechanism: 'Surfactant induction for anticipated preterm delivery', note: 'Buys fetal time during expectant management — maternal stability permitting.' },
    ],
    mistakes: [
      'Waiting for proteinuria to call it pre-eclampsia — severe features alone qualify in many frameworks.',
      'Treating the headache with paracetamol and sending home — the symptomatic pre-eclamptic is an admission.',
      'Fluid-loading liberally — these mothers drown on ward fluids (endothelial leak).',
      'Assuming delivery ends everything — postpartum fits and deterioration occur; surveillance continues.',
    ],
    mnemonics: [
      { hook: 'HEP: Headache, Epigastric pain, Photopsia', expands: 'The three symptom red flags that turn a routine BP into an emergency pathway.' },
      { hook: 'HELLP', expands: 'Haemolysis · Elevated Liver enzymes · Low Platelets — the liver-platelet variant that hides without high BP.' },
    ],
    reasoning: [
      { stage: 'symptom', label: 'Headache + flashing lights at 34 weeks', detail: 'Cerebral irritability symptoms in late pregnancy demand a BP cuff and dipstick, not an analgesic.' },
      { stage: 'mechanism', label: 'Endothelial dysfunction from placental factors', detail: 'Systemic vessel leak/vasospasm explains brain, liver, kidney and blood signs simultaneously.' },
      { stage: 'differential', label: 'Gestational HTN, chronic HTN, migraine, liver disease', detail: 'The 20-week line, proteinuria and labs carve the field.' },
      { stage: 'investigation', label: 'BP series, urine protein, FBC/LFT/creatinine, CTG/scan', detail: 'Both patient halves are staged — mother and fetus.' },
      { stage: 'interpretation', label: 'BP 168/112 + 2+ protein + right subcostal tenderness', detail: 'Severe-range pressure + liver involvement = severe pre-eclampsia.' },
      { stage: 'diagnosis', label: 'Severe pre-eclampsia at 34 weeks', detail: 'Stabilise (magnesium, antihypertensive) and time delivery.' },
      { stage: 'management', label: 'Magnesium + BP control + delivery decision', detail: 'Steroids if time allows; fluid restraint; neonatal team briefed.' },
      { stage: 'complication', label: 'Eclampsia, HELLP, abruption', detail: 'The watch-list for the next 48 hours — and postpartum surveillance continues.' },
    ],
    crossLinks: [
      { conceptId: 'c-eclampsia-mgmt', label: 'Eclampsia Management (seeded concept)', why: 'The magnesium protocols this lesson summarises.' },
      { conceptId: 'c-htn', label: 'Systemic Hypertension (this pack)', why: 'The same pressure, a different disease — and a lifetime-risk clue.' },
      { conceptId: 'c-acei', label: 'ACE Inhibitors (Pharmacology)', why: 'The contraindication-in-pregnancy rule lives here.' },
    ],
    global: [
      { region: 'India', delivery: 'Pradhan Mantri Surakshit Matritva Abhiyan-style assured ANC visits and PHC/FRU referral ladders route severe cases to CEmONC centres; magnesium sulphate availability is a programme priority.', note: 'Access to magnesium and timely referral is the global equity story of this disease.' },
      { region: 'WHO/Global', screening: 'WHO recommends measuring BP and testing urine at every ANC contact — the simplest screening instrument in medicine.', note: 'A cuff and a dipstick, deployed consistently, save the most lives.' },
      { region: 'United States', diagnosis: 'Thresholds, severe-feature lists and expectant-management criteria are published by US obstetric bodies and revised periodically.', note: 'Details vary between national guidelines — verify current tables.' },
      { region: 'United Kingdom', workflow: 'NICE pathways stratify risk at booking (moderate/high factors) and define surveillance and delivery thresholds.', note: 'Risk-stratified ANC is the UK contribution to the shared logic.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; diagnostic thresholds, magnesium regimens and delivery timing are protocol-specific.',
    sources: [
      whoRef('Maternal health — pre-eclampsia/eclampsia recommendations'),
      niceRef('Hypertension in pregnancy guidance'),
      ncbiRef('StatPearls — pre-eclampsia and eclampsia'),
      jhmiRef('Preeclampsia — patient-education resources'),
    ],
  },
  {
    id: 'c2-obgy-anc',
    name: 'Antenatal Care Essentials',
    kind: 'principle',
    oneLiner: 'Structured antenatal care is risk surveillance in instalments — screening the mother (BP, anaemia, blood group, infections) and the fetus (growth, position, wellbeing) so that problems are found while they are still manageable.',
    whyMatters: 'Most obstetric disasters announce themselves in advance — pre-eclampsia, anaemia, Rh problems, gestational diabetes, malpresentation, IUGR — and ANC is the system that catches them; it is also the textbook example of preventive medicine as clinical practice.',
    explain30s: 'The first (booking) visit establishes the baseline: confirm gestational age, full blood count (anaemia — the Indian subcontinent’s signature ANC problem), blood group/Rh, syphilis/HIV/hepatitis screening, urine culture, BP, and risk stratification (age, prior caesarean, hypertension). Subsequent visits repeat the surveillance loop — BP + urine (pre-eclampsia), haemoglobin (anaemia), fundal height/growth (IUGR), fetal heart, presentation (by late third trimester), tetanus immunisation, iron-folate supplementation — and deliver education (danger signs: bleeding, reduced movements, severe headache, swelling). Special investigations layer on by indication: anomaly scan (mid-trimester), gestational-diabetes screening, Rh immunoprophylaxis for Rh-negative mothers. Visit SCHEDULES differ by country and risk level — the principle (scheduled, problem-focused surveillance) is universal.',
    eli5: 'Pregnancy is a nine-month road trip, and antenatal visits are the service checkpoints. At the first big service (booking), the mechanic writes down the car model (blood group, age, old problems), measures the mileage (dating), and checks the basics (haemoglobin, infections). Then every few weeks: check the engine pressure (BP — the pre-eclampsia alarm), the fuel (haemoglobin — the anaemia alarm), and whether the passenger is growing and moving (fundal height, heartbeat). The mother gets a toolkit too: iron tablets, tetanus shots, and a list of emergency signals — bleeding, the baby going quiet, terrible headache, sudden swelling — that mean "drive to the hospital now", not "wait for the next service". The schedule differs by country, but the checkpoints are the same everywhere.',
    firstPrinciples: [
      'ANC is scheduled surveillance, not a formality: each visit has a screening question — "Is pre-eclampsia starting?" (BP/urine), "Is she anaemic?" (Hb), "Is the fetus growing?" (fundal height/dating), "Is presentation settling?" (Leopold’s by term).',
      'Booking establishes the safety data: accurate dating (LMP + earliest ultrasound), blood group/Rh (immunoprophylaxis planning), infection screen (syphilis/HIV/hepatitis — all treatable/preventable transmissions), baseline Hb and BP.',
      'Risk stratification drives frequency and venue: high-risk pregnancies (hypertension, diabetes, prior obstetric tragedy, multiple gestation, teenage/advanced age) need more visits and specialist settings — a one-size schedule is itself the failure mode.',
      'The anaemia-prevention package (iron + folate) and tetanus immunisation are the highest-volume interventions in Indian ANC — both are programme-backed with established benefit.',
      'Fetal surveillance matures with gestation: heart auscultation early, growth/doppler by indication, presentation confirmation late (breech detection at term changes the delivery plan).',
      'Danger-sign education converts the mother into a sensor: bleeding, reduced fetal movements, severe headache/visual symptoms, epigastric pain, swelling, leaking fluid, fever — each maps to a named emergency pathway.',
      'The postnatal continuum is planned in advance: birth preparedness (place, transport, blood donors where relevant), contraception counselling, breastfeeding intent — ANC ends by writing the delivery plan.',
    ],
    normal: 'Singleton pregnancy with normal dating, Hb maintained above anaemia thresholds, normal BP, active fetal movements, cephalic presentation by term, no proteinuria.',
    mechanism: 'Each intervention targets a named pathway: iron-folate → erythropoiesis demand of pregnancy; tetanus toxoid → passive/active neonatal protection; Rh immunoglobulin → anti-D suppression before sensitisation; BP screening → pre-eclampsia early detection; anomaly/dating scans → decision accuracy.',
    presentation: [
      'The well pregnant woman: mild fatigue, nausea (first trimester), the surveillance schedule as planned.',
      'Findings that change the plan: Hb drop, BP rise, proteinuria, fundal height off-dates (small → IUGR/oligohydramnios; large → twins/polyhydramnios/molar), abnormal lie at term, reduced movements.',
      'Danger symptoms reported by the mother (see the seven above) — each is a same-day pathway.',
    ],
    diagnosis: [
      'Dating: reliable LMP + first-trimester crown-rump scan (the gold standard for gestational age).',
      'Routine battery (context-dependent): CBC, blood group/Rh, VDRL/RPR, HIV, HBsAg, urine culture/screen, glucose screening (OGTT frameworks vary by country).',
      'Mid-trimester anomaly scan (structure), late growth/presentation scans by indication.',
      'Each visit: BP, urine protein, Hb when indicated, fundal height, fetal heart, presentation (late), oedema review.',
    ],
    differentials: [
      { name: 'Physiological vs pathological oedema/nausea', key: 'Timing and severity — sudden swelling with headache is pre-eclampsia, morning nausea is not a disease.' },
      { name: 'Small-for-dates vs IUGR', key: 'Constitutionally small with normal dopplers vs pathological growth restriction — doppler decision-making.' },
      { name: 'Fundal-height discrepancy', key: 'Dates error, twins, fibroids, polyhydramnios, molar — scan before diagnosing.' },
    ],
    management: [
      'PRINCIPLE — schedule by risk, not by habit: minimum-contact models exist for low-resource settings (WHO’s 2016+ model), high-risk mothers need more — the visit count is a means, surveillance is the end.',
      'PRINCIPLE — deliver the proven package: iron-folate, tetanus immunisation, calcium (preeclampsia-risk contexts per WHO), infection screening/treatment, Rh immunoprophylaxis where indicated.',
      'PRINCIPLE — education is intervention: danger signs, birth preparedness, nutrition, tobacco/alcohol avoidance, breastfeeding intent.',
      'PRINCIPLE — every abnormal finding maps to a pathway (anaemia → treat and recheck; BP rise → pre-eclampsia rule-out; breech at term → plan ECV/delivery mode).',
    ],
    complications: [
      'Missed pre-eclampsia from unmeasured visits — the costliest omission in obstetrics.',
      'Undetected anaemia unmasking itself at postpartum haemorrhage — the reserve that was never built.',
      'Rh sensitisation from missing prophylaxis — a future pregnancy destroyed by a past oversight.',
      'Late-presenting malpresentation — the planned pathway that became an emergency.',
    ],
    numbers: [
      { label: 'WHO contact model (current framing)', value: 'Eight antenatal contacts recommended for uncomplicated pregnancies (WHO 2016+ model)', note: 'Schedules vary by country and risk — the number is a floor, not a ceiling.' },
      { label: 'Iron-folate anchor', value: 'Daily iron-folate supplementation throughout pregnancy in programme settings', note: 'Specific formulations/doses are national-programme territory.' },
      { label: 'Rh immunoprophylaxis anchor', value: 'Anti-D for non-sensitised Rh-negative mothers at established gestational timepoints + after sensitising events', note: 'Timing schedules are guideline-specific.' },
      { label: 'The seven danger signs', value: 'Bleeding · reduced movements · severe headache/visuals · epigastric pain · sudden swelling · leaking fluid · fever', note: 'The education card that outperforms any single lab.' },
    ],
    mistakes: [
      'Treating visits as weighing ceremonies — every contact has screening questions to answer.',
      'Skipping the Rh/blood-group check because "records exist somewhere".',
      'Ignoring reduced fetal movements as "babies sleep" — it is a same-day assessment.',
      'Not writing a birth plan: place, transport, blood arrangement, and who to call at 2 a.m.',
    ],
    mnemonics: [
      { hook: 'Every visit: BP, Hb, Height, Heart, Presentation', expands: 'Pressure · haemoglobin · fundal height · fetal heart · lie — the five-touch physical audit of ANC.' },
    ],
    crossLinks: [
      { conceptId: 'c-previa', label: 'Placenta Praevia', why: 'The painless-bleeding emergency ANC surveillance exists to catch.' },
      { conceptId: 'c-abruptio', label: 'Placental Abruption', why: 'The painful-bleeding twin — different urgency, same surveillance net.' },
      { conceptId: 'c-preec', label: 'Pre-eclampsia & Eclampsia (this pack)', why: 'The flagship disease the BP/dipstick screen hunts.' },
      { conceptId: 'c-hba1c', label: 'HbA1c (Biochemistry)', why: 'Gestational diabetes screening uses different tools (OGTT) — the contrast is the exam point.' },
    ],
    global: [
      { region: 'India', delivery: 'ANC runs through PHCs/CHCs and programmes (JSY/Pradhan Mantri Surakshit Matritva Abhiyan-style assured visits), with iron-folate, tetanus, and danger-sign education as programme pillars.', note: 'India’s programme architecture is itself exam-relevant content.' },
      { region: 'United Kingdom', delivery: 'GP/midwife-led booking and scheduled midwife appointments with NICE-defined contact schedules and screening offers.', note: 'Midwife-led continuity models contrast with obstetrician-led systems.' },
      { region: 'United States', delivery: 'OB-led scheduled visits with country-specific diabetes-screening and imaging conventions.', note: 'Same surveillance logic; different organiser and schedule.' },
      { region: 'WHO/Global', delivery: 'WHO’s 2016+ model recommends eight contacts for uncomplicated pregnancies, framing ANC as positive experience + surveillance.', note: 'The global floor every national schedule adapts.' },
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; visit schedules, screening batteries and supplementation doses are national-programme specific.',
    sources: [
      whoRef('Antenatal care recommendations (2016+ contact model)'),
      niceRef('Antenatal care guidance'),
      cdcRef('Pregnancy screening and immunisation resources'),
      nhsRef('Antenatal appointments — patient information'),
    ],
  },
  {
    id: 'c2-obgy-pcos',
    name: 'Polycystic Ovary Syndrome (PCOS)',
    kind: 'disease',
    oneLiner: 'A syndrome — not a single disease — of irregular ovulation, raised androgens and polycystic ovarian morphology, wired together by insulin resistance and managed by lifestyle as much as by drugs.',
    whyMatters: 'The commonest endocrine disorder of reproductive-age women and the classic exam of syndromic diagnosis (criteria, not one test); its long tail — diabetes, metabolic syndrome, endometrial risk — makes it a lifelong-medicine lesson disguised as a gynaecology topic.',
    explain30s: 'PCOS is diagnosed (classic Rotterdam framing) by TWO of THREE: oligo/anovulation (irregular cycles), clinical/biochemical hyperandrogenism (hirsutism, acne, raised testosterone), and polycystic ovarian morphology on ultrasound — after EXCLUDING mimics (thyroid disease, hyperprolactinaemia, non-classic CAH, androgen-secreting tumours, Cushing’s). The engine: insulin resistance drives ovarian theca-cell androgen production and lowers SHBG, while altered GnRH pulse favouring LH keeps ovulation irregular — explaining why periods, skin, fertility and metabolism misbehave together. Management follows the patient’s priority: cycle regulation (progestogen/combined-pill concepts), hirsutism therapy, ovulation induction for fertility (letrozole-class now classic first-line in many guidelines), and lifelong metabolic care — lifestyle (weight, activity) is the foundation intervention, and metformin addresses the insulin axis.',
    eli5: 'Imagine the ovary as a storehouse of little seed packets (follicles). In PCOS, the seeds pile up but none get planted regularly — so periods come rarely or chaotically. Two fuel problems cause this: first, the body’s sugar-hormone (insulin) works poorly, and the ovary, hearing the loud insulin shouting, makes too much "male" hormone (androgens) — giving extra hair, acne, and thinning scalp hair. Second, the brain’s monthly signal to "plant the seed" loses its rhythm. Doctors confirm the pattern with a checklist (2 of 3 features), then rule out impostors (thyroid, a hormone-producing tumour, etc.). Treatment depends on what bothers her most: regular periods, less hair, or a baby — but the foundation for all of them is the same: move more, eat better, lower the insulin shouting, and protect the womb lining with periodic bleeds.',
    firstPrinciples: [
      'It is a syndrome: diagnosis is criteria-based (classic Rotterdam framing — 2 of 3: oligo/anovulation, hyperandrogenism, polycystic morphology) PLUS exclusion of mimics — the exclusion list is half the diagnosis.',
      'Insulin resistance is the engine (in the majority): hyperinsulinaemia drives theca androgen synthesis and suppresses hepatic SHBG → more free testosterone — skin, hair and cycles all pay.',
      'GnRH pulse-pattern shift favours LH over FSH → theca stimulation continues, follicles arrest mid-growth → the polycystic appearance is a traffic jam of arrested follicles, not cysts.',
      'Chronic anovulation means unopposed oestrogen → endometrial proliferation risk — the reason cycle protection (periodic progestogen/combined-pill concepts) is preventive, not cosmetic.',
      'The metabolic tail is long: type-2 diabetes, metabolic syndrome, dyslipidaemia, fatty liver, sleep apnoea, and possible cardiovascular risk — PCOS is diagnosed in the gynaecology clinic but tracked for life.',
      'Fertility is treatable: ovulation induction (letrozole-class first-line in many current guidelines; metformin adjunct especially with insulin resistance) — regimens are protocol territory.',
      'Ultrasound morphology is age/tech-dependent (follicle-count criteria) and is NOT required when hyperandrogenism + anovulation are present (classic criteria logic).',
    ],
    normal: 'Regular ovulatory cycles (21–35-day classic range) with balanced androgen levels; ovaries show a handful of developing follicles with dominant-follicle selection each cycle.',
    mechanism: 'Hyperinsulinaemia + LH-biased gonadotropin pulsatility → thecal androgen excess → aromatase-poor arrested follicles → anovulation; low SHBG amplifies free androgen → hirsutism/acne; unopposed oestrogen → endometrial proliferation.',
    presentation: [
      'Irregular/absent periods (often since menarche) — the commonest presenting thread.',
      'Hirsutism (face/chest/abdomen), acne, androgenic alopecia; sometimes acanthosis nigricans (the insulin-resistance skin tag).',
      'Fertility difficulty; first-trimester miscarriage risk discussion.',
      'Weight-gain difficulty and central adiposity (though lean PCOS exists — do not let body habitus veto the diagnosis).',
    ],
    diagnosis: [
      'History + examination: cycle charting, Ferriman-Gallwey-style hirsutism scoring, BP, BMI/waist, acanthosis.',
      'Labs: testosterone (total ± free), SHBG, 17-OHP (excludes non-classic CAH), prolactin, TSH, fasting glucose/insulin or OGTT, lipids.',
      'Transvaginal ultrasound for morphology (follicle-count/ovarian-volume criteria per current definitions) when the first two criteria do not clinch it.',
      'Exclusions: pregnancy (always first with amenorrhoea), thyroid disease, hyperprolactinaemia, CAH, Cushing’s, androgen-secreting tumour (rapid virilisation is the red flag).',
    ],
    differentials: [
      { name: 'Non-classic congenital adrenal hyperplasia', key: 'Raised 17-OHP — the classic mimic caught by one lab.' },
      { name: 'Thyroid disease / hyperprolactinaemia', key: 'Cycle chaos with different hormones — TSH/prolactin on every workup.' },
      { name: 'Cushing’s syndrome', key: 'Central fat + striae + proximal weakness + easy bruising — the phenotype has more than periods.' },
      { name: 'Androgen-secreting tumour', key: 'RAPID virilisation, clitoromegaly, very high testosterone — scan the adrenals/ovaries.' },
      { name: 'Functional hypothalamic amenorrhoea', key: 'Athlete/restriction context, LOW LH/FSH, normal androgens — the opposite hormonal picture.' },
    ],
    management: [
      'PRINCIPLE — lifestyle is first-line therapy for the metabolic axis: weight reduction (even modest), exercise, diet quality — improving ovulation, androgens and long-term risk simultaneously.',
      'PRINCIPLE — protect the endometrium: cycle regulation via combined hormonal contraception or cyclic progestogen concepts (choice by patient priorities — contraception, acne, hirsutism).',
      'PRINCIPLE — fertility pathways: ovulation induction (letrozole-class first-line in many guidelines) with metabolic optimisation ± metformin; referral-led, protocol-driven.',
      'PRINCIPLE — dermatology has its own ladder for hirsutism/acne (anti-androgen concepts, cosmetic/physical methods) — patient priority drives sequencing.',
      'PRINCIPLE — lifelong surveillance: glucose screening (OGTT frameworks), lipids, BP, weight — the diagnosis opens a metabolic follow-up file, not just a gynaecology one.',
    ],
    complications: [
      'Type-2 diabetes and metabolic syndrome — the most quantifiable long-term burden.',
      'Endometrial hyperplasia/carcinoma risk from chronic unopposed oestrogen — the reason cycle protection matters.',
      'Infertility and miscarriage-risk conversations.',
      'Obstructive sleep apnoea, fatty liver, dyslipidaemia — the quiet metabolic companions.',
      'Psychological burden: body image, anxiety/depression — a real outcome, not a footnote.',
    ],
    numbers: [
      { label: 'Rotterdam framing (classic)', value: '2 of 3 — oligo/anovulation · hyperandrogenism (clinical/biochemical) · polycystic morphology', note: 'The most-cited criteria framework; other bodies publish variants — quote the concept, verify the current consensus.' },
      { label: 'The exclusion list', value: 'Thyroid · prolactin · 17-OHP (CAH) · Cushing’s · androgen tumour', note: 'The five names that protect you from a wrong lifelong label.' },
      { label: 'Metabolic follow-up anchor', value: 'Glucose screening at diagnosis and periodically thereafter (frameworks vary)', note: 'The transition from gynaecology to internal medicine.' },
    ],
    drugs: [
      { name: 'Metformin', drugClass: 'Insulin sensitiser (biguanide)', mechanism: 'Reduces hepatic glucose output, improves insulin sensitivity → quieter insulin → less androgen drive', note: 'Adjunct for metabolic/ovulatory goals — not a substitute for lifestyle; GI titration is the classic nuisance.' },
      { name: 'Combined oral contraceptive (concept)', drugClass: 'Oestrogen-progestogen', mechanism: 'Suppresses LH/FSH-driven androgen production, raises SHBG, protects endometrium', note: 'The cycle-and-skin workhorse where contraception is welcome.' },
      { name: 'Letrozole (concept)', drugClass: 'Aromatase inhibitor', mechanism: 'Frees the hypothalamus from oestrogen feedback → FSH surge → ovulation', note: 'Now classic first-line ovulation induction in many guidelines — protocol territory.' },
    ],
    mistakes: [
      'Diagnosing PCOS from an ultrasound alone — morphology without the syndrome is a finding, not a diagnosis.',
      'Skipping the exclusion labs (17-OHP, prolactin, TSH) — the mimics are exactly why criteria exist.',
      'Telling lean patients they "can’t have PCOS" — body habitus does not gate the diagnosis.',
      'Ignoring metabolic follow-up because periods are now regular — the diabetes risk did not leave with the irregular cycles.',
    ],
    mnemonics: [
      { hook: 'HA-IR-ANO (hormone loop)', expands: 'HyperAndrogenism ← Insulin Resistance → ANOvulation — the triangle that ties every feature together.' },
    ],
    crossLinks: [
      { conceptId: 'c-insulin', label: 'Insulin & Glucose Homeostasis (Physiology)', why: 'The insulin axis is the engine under the syndrome.' },
      { conceptId: 'c-metformin', label: 'Metformin (Pharmacology)', why: 'The same drug, a different specialty’s indication.' },
      { conceptId: 'c-dm', label: 'Diabetes Mellitus (this pack)', why: 'The long-term metabolic destination the follow-up file watches.' },
    ],
    evidenceLevel: 'widely-taught',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Verify against current guidelines — educational, not clinical advice; diagnostic criteria variants, induction regimens and screening intervals are guideline-specific.',
    sources: [
      whoRef('PCOS fact sheet and infertility framing'),
      ncbiRef('StatPearls — polycystic ovary syndrome'),
      niceRef('PCOS — investigation and management guidance'),
      jhmiRef('PCOS — patient-education resources'),
    ],
  },
  // ── Paediatrics ───────────────────────────────────────────────────────────
  {
    id: 'c2-peds-milestones',
    name: 'Growth & Developmental Milestones',
    kind: 'process',
    oneLiner:
      'Child development follows a predictable sequence — motor, social and language skills appear in a set order with expected age windows.',
    whyMatters:
      'Milestones are the paediatric vital signs of the brain. Delay flags cerebral palsy, genetic syndromes, hearing loss or neglect far earlier than any scan.',
    explain30s:
      'A baby upgrades itself in a fixed order: head control around 3 months, sitting around 6–8, walking around 12–15, two-word phrases around 2 years. The order rarely changes; the timing varies a little. A child off in ONE sphere (just language) suggests hearing or autism-spectrum concerns; a child delayed in ALL spheres or losing skills suggests something structural — think brain, think metabolic.',
    eli5:
      'Think of development like a video game with levels in fixed order: lift head → roll → sit → crawl → stand → walk. Most players clear each level near the same age. If a child is stuck on a level, or unlocks levels then LOSES them, the game has a bug — and finding it early changes the whole playthrough.',
    firstPrinciples: [
      'Four spheres: gross motor, fine motor, social, language — assess each separately, then combine.',
      'Gross motor spine: head control ~3 months, sits without support ~6–8, crawls ~9, walks alone ~12–15 months, runs by 2 years.',
      'Fine motor spine: transfers objects ~6 months, immature pincer ~9, neat pincer ~12 months, tower of 3 blocks ~18 months.',
      'Social/language spine: social smile ~2 months, babbling ~6 months, first words ~12 months, 2-word phrases ~24 months.',
      'Red flags carry more weight than soft delays: not walking by 18 months, no words by 16–18 months, loss of previously gained skills (regression) at any age.',
      'Primitive reflexes (Moro, palmar grasp) must integrate — persistence beyond expected age is itself a red flag.',
    ],
    numbers: [
      { label: 'Social smile', value: '~2 months', note: 'One of the earliest reliable milestones' },
      { label: 'Sits without support', value: '~6–8 months' },
      { label: 'Walks alone', value: '~12–15 months', note: 'Not walking by 18 months = investigate' },
      { label: '2-word phrases', value: '~24 months' },
    ],
    mistakes: [
      'Assessing a sick, hungry or shy child and labelling delay — always re-check in a calm state.',
      'Forgetting that PREMATURE babies should be scored by corrected age for the first 1–2 years.',
      'Missing regression — a lost skill is never "a variation of normal".',
    ],
    mnemonics: [
      { hook: '3-6-9-12 for motor', expands: 'Head 3m · Sit 6m · Crawl/stand 9m · Walk 12m (approximate spine)' },
    ],
    examRelevance:
      'Classic one-liners: "a child who sits with support at 8 months" → match the milestone to age; "not walking at 18 months" → next step. Milestone-age matching is among the most repeated paediatrics MCQ patterns.',
    clinicalRelevance:
      'Every well-child visit is a milestone screen. Early detection → early intervention (hearing aids, physiotherapy, developmental therapy) when brain plasticity is highest.',
    crossLinks: [
      { conceptId: 'peds-immunization', label: 'Childhood Immunization Principles', why: 'The same well-child visits deliver both screens.' },
      { label: 'Cerebral palsy (Medicine/Paediatrics)', why: 'Persistent primitive reflexes + abnormal tone point here.' },
    ],
    global: [
      { region: 'India', note: 'Rashtriya Bal Swasthya Karyakram (RBSK) screens children for the 4 Ds — defects, deficiencies, diseases, developmental delays — through school and Anganwadi visits.', delivery: 'Village-level screening workers feed district early-intervention centres.' },
      { region: 'United States', note: 'Routine structured screens at 9, 18 and 30 months (validated tools like M-CHAT for autism) are standard, with early-intervention services mandated by law.', delivery: 'Family-centred, insurance-based with public backstop.' },
      { region: 'United Kingdom', note: 'Health-visitors-led reviews track the red book — a parent-held developmental record from birth.', delivery: 'Universal community child-health programme.' },
      { region: 'WHO/Global', note: 'WHO warns against a single global "normal" — milestones vary with culture and stimulation; the framework is early identification and nurturing care, not labels. Caregiver behaviours are tracked alongside milestones.', terminology: ['Nurturing care framework'] },
    ],
    sources: [
      whoRef('WHO — improving early childhood development framework'),
      cdcRef('CDC — developmental milestone checklists (learn the signs)'),
      ncbiRef('Developmental screening and surveillance reviews (PubMed Central)'),
      nmcRef('CBME paediatrics competency framework — developmental assessment'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Screening schedules differ by country — verify current local programme.',
  },
  {
    id: 'c2-peds-immunization',
    name: 'Childhood Immunization Principles',
    kind: 'principle',
    oneLiner:
      'Vaccines train the immune system safely before it meets the real disease — the schedule is built around when protection is needed and when the immune system responds best.',
    whyMatters:
      'Immunization is the highest-yield public-health intervention in history; smallpox is gone and polio is nearly gone because of it. Doctors are the trust engine behind it.',
    explain30s:
      'Give a harmless version or fragment of a germ, and the immune system builds memory without the disease. Live vaccines mimic infection (strong, single-dose, sometimes unsafe in immunodeficiency); killed/subunit vaccines are safer but need boosters. The schedule balances three questions: when is the child most vulnerable, when does the immune response work, and how do we get coverage high enough to protect everyone?',
    eli5:
      'It is a fire drill for the immune system. No real fire — but when the real one comes, everyone already knows the exits. Some drills (live vaccines) are very realistic; some are simpler and need repeating (boosters).',
    firstPrinciples: [
      'Types: live-attenuated (MMR, BCG, oral polio, varicella), inactivated/killed, subunit/toxoid (DTP, hepatitis B), conjugate (pneumococcal, Hib — sugar coats linked to proteins so infants respond), mRNA/vector platforms.',
      'Live vaccines: replicate a little → durable memory, often one dose, but generally avoided in pregnancy and severe immunodeficiency.',
      'Maternal antibodies (IgG across placenta) protect early but can blunt live-vaccine response — one reason MMR waits until ~9–12 months.',
      'Cold chain: vaccines are proteins; heat ruins them. The chain from factory to arm (2–8 °C for most) is as much part of the dose as the liquid itself.',
      'Herd immunity: when enough people are immune, outbreaks stall — protecting those who cannot be vaccinated. Threshold varies by how contagious the disease is (measles needs ~95%).',
      'Vaccine hesitancy is a clinical skill problem: listen, answer the actual fear, and never mock — trust is the real adjuvant.',
    ],
    mistakes: [
      'Calling a mild fever after vaccination "the disease coming through" — it is an immune response, not infection.',
      'Giving live vaccines to severely immunocompromised children without specialist input.',
      'Assuming a missed dose means restarting the whole schedule — most schedules simply continue where they left off.',
    ],
    mnemonics: [
      { hook: 'Live vaccines avoid the "P-I-S-D" hosts', expands: 'Pregnancy, Immunosuppression, Severe illness (defer), specific Drug therapy (biologics/steroids high-dose)' },
    ],
    examRelevance:
      'Favourite questions: which vaccine is live? cold-chain temperature? conjugate vs polysaccharide logic? reaction to a dose (anaphylaxis is contraindication; mild illness is not).',
    clinicalRelevance:
      'In practice you will spend real time catching up missed schedules, counselling hesitant parents and running pulse-polio/mass campaigns in India.',
    crossLinks: [
      { conceptId: 'c-ai-what-is-medical-ai', label: 'AI in Medicine', why: 'Forecasting helps target undervaccinated pockets — a data problem.' },
      { label: 'Hypersensitivity (Immunology)', why: 'Anaphylaxis to a dose is the true contraindication — adrenaline first.' },
    ],
    global: [
      { region: 'India', note: 'Universal Immunisation Programme (UIP) provides free vaccines against ~12 diseases nationally, with Mission Indradhanush drives to reach dropouts; pulse polio campaigns run on national immunization days.', delivery: 'Government free schedule via PHCs/ASHA workers + private market schedules that may add optional vaccines.' },
      { region: 'United States', note: 'CDC schedule via ACIP; school-entry laws drive coverage; catch-up schedules formally defined.', terminology: ['DTaP/Tdap naming differs from India\'s DTwP/DTP tradition'] },
      { region: 'United Kingdom', note: 'NHS schedule; menB/rotumus rotavirus influenza additions historically earlier than many countries.', terminology: ['"Jabs" colloquial for vaccinations'] },
      { region: 'WHO/Global', note: 'WHO runs EPI (Expanded Programme on Immunization) standards, prequalifies vaccines, and coordinates global eradication/elimination targets. Same science, different delivery machinery — never assume one country\'s schedule equals another\'s.' },
    ],
    sources: [
      whoRef('WHO — immunization coverage and EPI standards'),
      cdcRef('CDC — child and adolescent immunization schedule'),
      ncbiRef('Vaccine-preventable disease epidemiology reviews'),
      nmcRef('CBME community-medicine immunization competencies'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Schedules are updated frequently — always verify the current national schedule before advising.',
  },
  {
    id: 'c2-peds-diarrhea',
    name: 'Childhood Diarrhoea & Dehydration — WHO Plans A/B/C',
    kind: 'disease',
    oneLiner:
      'Diarrhoea kills children through dehydration, not through the stool itself — so assessment and replacement of fluid is the life-saving skill.',
    whyMatters:
      'It remains a top killer of under-fives globally, and the WHO framework turns a frightening presentation into a decision tree any clinician can run.',
    explain30s:
      'Assess dehydration first: thirsty/restless (Plan A — home fluids), sunken eyes/skin pinch slow (Plan B — ORS in facility ~4 hours), lethargic/unable to drink (Plan C — IV Ringer lactate fast). Treat with ORS + zinc for 14 days; antibiotics only for bloody diarrhoea/cholera severity. Anti-motility drugs are not for children.',
    eli5:
      'The tap leaks water out faster than the child can drink — the danger is the emptying tank, not the leak. Grade how empty the tank is (thirsty → sunken → sleepy) and refill accordingly: cup by cup, bottle by bottle, or drip by drip.',
    firstPrinciples: [
      'Define: ≥3 loose stools/24h (or looser than usual); acute <14 days, persistent ≥14.',
      'Dehydration signs ladder: no signs → some (thirsty, restless, sunken eyes, slow pinch) → severe (lethargy, unable to drink, very slow pinch).',
      'Plan A: home ORS + continue feeding + zinc 14 days + return advice.',
      'Plan B: 75 ml/kg ORS over 4 hours in facility, re-assess, then Plan A.',
      'Plan C: IV Ringer lactate 100 ml/kg (infants: 30+70 over 5h/1d pattern; older: 30+50), ORS by NG when IV impossible.',
      'Zinc for 10–14 days reduces duration and protects for months; continued feeding prevents the diarrhoea-malnutrition spiral.',
    ],
    numbers: [
      { label: 'Some dehydration ORS volume', value: '75 ml/kg over 4 hours', note: 'WHO Plan B anchor number' },
      { label: 'Severe dehydration IV', value: 'Ringer lactate 100 ml/kg', note: 'Split by age bands in Plan C' },
      { label: 'Zinc course', value: '10–14 days', note: 'Age-banded dose' },
    ],
    mistakes: [
      'Reaching for antibiotics first — most acute watery diarrhoea is viral and needs fluid, not drugs.',
      'Stopping feeds ("gut rest") — the opposite is correct.',
      'Using antimotility agents in children — risk of ileus and masked severity.',
    ],
    examRelevance:
      'Scenario MCQs map a child onto Plan A/B/C by signs; "next best step" is almost always the fluid plan, not a drug.',
    clinicalRelevance:
      'Rotavirus vaccine (now in UIP) has visibly cut severe disease; ORS corners in every clinic are one of medicine\'s cheapest miracles.',
    crossLinks: [
      { conceptId: 'c2-peds-immunization', label: 'Immunization Principles', why: 'Rotavirus and measles vaccines prevent the worst diarrhoea.' },
      { label: 'RAAS & fluid physiology', why: 'Dehydration physiology is the paediatric face of volume depletion.' },
    ],
    global: [
      { region: 'India', note: 'ORS is a national flagship; ASHA workers carry ORS+zinc to villages; rotavirus vaccine rolled into UIP.', delivery: 'Both facility and community-managed plans.' },
      { region: 'WHO/Global', note: 'WHO/UNICEF joint statements set the A/B/C framework used in nearly every country\'s guidelines.; The framework is deliberately country-portable.' },
    ],
    sources: [
      whoRef('WHO — treatment of diarrhoea, Plans A/B/C'),
      cdcRef('CDC — management of acute diarrhoea in children'),
      ncbiRef('ORS and zinc evidence reviews'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Fluid plan details follow the current WHO/UNICEF document — verify before applying.',
  },
  {
    id: 'c2-peds-neonatal-jaundice',
    name: 'Neonatal Jaundice — Physiological vs Dangerous',
    kind: 'sign',
    oneLiner:
      'Almost every newborn yellows a little as old red cells break down; the skill is separating harmless physiologic jaundice from bilirubin that can injure the brain.',
    whyMatters:
      'Unconjugated bilirubin crosses into the basal ganglia (kernicterus) — a permanently preventable tragedy. Phototherapy and exchange transfusion thresholds exist precisely for this.',
    explain30s:
      'Newborns have more red cells, shorter-lived red cells and a sleepy liver enzyme (UGT1A1) — so bilirubin rises for 3–5 days then falls. Danger signals: jaundice in the first 24 hours, conjugated (direct) fraction high, baby unwell, or level crossing age-specific phototherapy lines. Investigation: split bilirubin, blood group/coombs (haemolysis), G6PD where relevant; treatment: feeding, phototherapy, exchange if extreme.',
    eli5:
      'Yellow comes from worn-out red blood cells being recycled. The newborn\'s recycling plant opens slowly, so pigment piles up. Usually the plant catches up (physiologic). If the yellow appears on day one, or the baby looks sick, or the pigment is the "already-processed" kind, the plant is not just slow — something is broken.',
    firstPrinciples: [
      'Physiologic pattern: appears after 24 h, peaks ~day 3–5, resolves by ~2 weeks, unconjugated, baby well.',
      'Pathologic flags: <24 h onset (haemolysis until proven otherwise), conjugated/direct fraction >~20% or conjugated >1 mg/dL (think biliary obstruction, infection, metabolic), prolonged beyond 2 weeks (screen hypothyroidism, UTI, breast-milk jaundice), baby unwell.',
      'Haemolysis workup: maternal/infant blood groups (ABO/Rh), direct Coombs, reticulocytes, peripheral smear; G6PD in relevant populations.',
      'Treatment thresholds are AGE- AND RISK-SPECIFIC hour-specific curves (Bhutani nomograms) — bilirubin is interpreted by exact hour of life, not one number for all.',
      'Phototherapy converts bilirubin to water-soluble isomers that exit without the liver; exchange transfusion when lines are crossed despite phototherapy or signs of acute bilirubin encephalopathy.',
      'Breastfeeding jaundice (under-feeding → less clearance, early days) vs breast-milk jaundice (substance in milk prolongs, benign) — different problems with different fixes.',
    ],
    numbers: [
      { label: 'Physiologic onset', value: 'after 24 h of life', note: 'Earlier = pathologic until proven otherwise' },
      { label: 'Direct (conjugated) flag', value: '>1 mg/dL or >20% of total', note: 'Think obstruction/infection — not phototherapy alone' },
      { label: 'Kernicterus target zone', value: 'unconjugated bilirubin crossing exchange lines', note: 'Hour-specific curves decide' },
    ],
    mistakes: [
      'Treating a number without the hour of life and risk factors.',
      'Missing cholestatic (conjugated) jaundice — pale stools + dark urine is a different disease pathway entirely.',
      'Forgetting urine reducing substances/TSH in prolonged jaundice.',
    ],
    examRelevance:
      'Day-1 jaundice = haemolysis (MCQ classic); pale stools + conjugated picture = biliary atresia screening; phototherapy threshold logic with hour curves.',
    clinicalRelevance:
      'Home phototherapy/BSU devices transformed rural care; the transcutaneous meter on the ward is your first triage, serum bilirubin confirms.',
    crossLinks: [
      { conceptId: 'c2-pathology-anemias', label: 'Anemia workup', why: 'Haemolysis drives both pictures.' },
      { label: 'Biliary atresia (Surgery/Paediatrics)', why: 'Conjugated jaundice at 2–6 weeks needs urgent surgical referral.' },
    ],
    sources: [
      whoRef('WHO — pocket book of hospital care for children: neonatal jaundice'),
      ncbiRef('Neonatal hyperbilirubinemia management guidelines reviews'),
      jhmiRef('Johns Hopkins Medicine — newborn jaundice education'),
      nhsRef('NHS — neonatal jaundice assessment'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Thresholds come from country-specific nomograms — verify the current chart in use.',
  },

  // ── Orthopaedics ──────────────────────────────────────────────────────────
  {
    id: 'c2-orth-compartment',
    name: 'Fracture Healing & Compartment Syndrome',
    kind: 'process',
    oneLiner:
      'Bone repairs through a haematoma → soft callus → hard callus → remodelling pipeline; the emergency hiding inside any cast is compartment syndrome — rising pressure strangling muscle and nerve.',
    whyMatters:
      'Healing principles guide every fixation decision; missing compartment syndrome turns a routine fracture into a lost limb or death from myoglobinuria.',
    explain30s:
      'Bone bleeds, the clot organises, cartilage scaffold calcifies, new bone bridges, then remodels along stress lines (Wolff). Complication radar: infection, non-union, malunion, AVN — and the acute one: pain OUT OF PROPORTION with pain on passive stretch, a tense swelling, paraesthesia. Pressure >30 mmHg or delta <30 needs fasciotomy now. Analgesia does not fix it; splitting the cast is the first bedside move.',
    eli5:
      'A fracture heals like a pothole repair: fill (clot), frame (soft callus), cement (hard callus), sand smooth (remodel). Compartment syndrome is the tyre bursting inside a sealed box — pressure climbs, the muscle suffocates. The box must be opened (fasciotomy) or the muscle dies.',
    firstPrinciples: [
      'Healing stages: inflammatory haematoma (days) → soft callus with fibrocartilage (weeks) → hard bony callus (months) → remodelling (up to years).',
      'Secondary (callus) healing with some motion; primary healing with rigid compression fixation — different biology, different x-ray look.',
      'The 5 Ps are late — trust pain out of proportion + passive-stretch pain EARLY; a normal pulse does NOT exclude compartment syndrome (capillary flow persists below systolic pressure).',
      'High-risk patterns: tibial shaft, forearm (both bones), supracondylar humerus in children, crush injuries, revascularisation (ischaemia-reperfusion).',
      'Bedside: split cast/bandage to skin, elevate to heart level, re-assess; if suspicion persists → compartment pressure measurement or direct fasciotomy.',
      'After reperfusion of a crushed limb, myoglobin → pigmented urine → acute kidney injury: fluid load and monitor.',
    ],
    numbers: [
      { label: 'Fasciotomy pressure trigger', value: 'absolute >30 mmHg or delta (diastolic − pressure) <30 mmHg', note: 'Whichever your unit uses — decide, don\'t dawdle' },
      { label: 'Normal compartment pressure', value: '0–8 mmHg' },
    ],
    mistakes: [
      'Waiting for the "5 Ps" — pallor and pulselessness are late, irreversible stages.',
      'Relying on pulses or Doppler to exclude the diagnosis.',
      'Treating with ice/elevation above heart and reassurance — elevation above heart REDUCES perfusion pressure.',
    ],
    mnemonics: [
      { hook: 'Pain out of proportion is the loudest P', expands: 'The earliest sign beats all five classic Ps' },
    ],
    examRelevance:
      'MCQ: tense calf after tibia fixation, pain on passive dorsiflexion → next step = measure pressure/fasciotomy, not analgesia. Also classic: which fracture has highest compartment risk.',
    clinicalRelevance:
      'Post-op protocols literally schedule cast-splitting checks; a documented passive-stretch pain assessment is medico-legal gold.',
    crossLinks: [
      { conceptId: 'c2-orth-colles', label: 'Colles fracture', why: 'Forearm casts are a risk site — education at discharge.' },
      { label: 'Rhabdomyolysis & AKI (Medicine)', why: 'Crush physiology links orthopaedics to renal medicine.' },
    ],
    sources: [
      niceRef('NICE — fractures: complex fracture assessment (compartment syndrome recognition)'),
      ncbiRef('Acute compartment syndrome diagnosis and pressure thresholds reviews'),
      jhmiRef('Johns Hopkins Medicine — compartment syndrome overview'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Pressure thresholds vary slightly by guideline — verify local protocol.',
  },
  {
    id: 'c2-orth-colles',
    name: 'Colles Fracture',
    kind: 'disease',
    oneLiner:
      'A fall on an outstretched hand causing a distal-radius fracture with the hand pushed backwards (dorsal displacement) — the classic dinner-fork deformity.',
    whyMatters:
      'It is the most common adult forearm fracture and a textbook bridge: mechanism → deformity → reduction principles → the osteoporosis conversation.',
    explain30s:
      'FOOSH → distal radius breaks, wrist looks like a dinner fork. X-ray confirms dorsal displacement/tilt. Undisplaced: cast. Displaced: closed reduction (traction + volar moulding) then cast; surgery when the joint surface is broken or alignment cannot hold. Always screen for osteoporosis in the older patient — the fracture is the warning shot.',
    eli5:
      'Catching yourself with your hand is a lever: all your weight squeezes through one small bone. In young people the bone holds and ligaments tear; in older, weaker bones the bone gives way first. The wrist then bends backwards like a fork at dinner.',
    firstPrinciples: [
      'Mechanism: fall on outstretched, extended wrist (FOOSH); common in older women (osteoporosis) and children (weaker bone → greenstick variants).',
      'Deformity: dorsal displacement + dorsal tilt + radial shortening; "dinner-fork" on lateral view.',
      'Assess ALWAYS: median nerve (thenar sensation, thumb abduction), radial artery, skin integrity — open fractures change everything.',
      'Undisplaced/minimally: below-elbow cast ~6 weeks; displaced: haematoma block/sedation → closed reduction → cast; K-wires/plate for unstable or intra-articular.',
      'Malunion with residual deformity is the common long-term issue; stiffness prevention via finger/shoulder exercises from day one.',
      'In the older patient: send for bone-density assessment and fall review — treat the bone health, not just the bone.',
    ],
    mistakes: [
      'Missing median nerve symptoms at presentation and after reduction.',
      'Accepting poor reduction in young, high-demand wrists (intra-articular step-off).',
      'Never revisiting the cast in the first 2 weeks — displacement happens; follow-up x-rays matter.',
    ],
    examRelevance:
      'Classic image MCQ; associations (osteoporosis, FOOSH); nerve at risk (median); contrast Smith fracture (volar, "garden spade").',
    clinicalRelevance:
      'Emergency-department bread and butter; the discharge conversation about bone health prevents the next, worse fracture (hip).',
    crossLinks: [
      { conceptId: 'c2-orth-compartment', label: 'Compartment syndrome', why: 'Casts create the closed space — counselling every patient.' },
      { label: 'Osteoporosis (Medicine)', why: 'Low-energy Colles = osteoporosis screen indication.' },
    ],
    global: [
      { region: 'India', note: 'Roadside trauma and falls add younger high-energy variants; cast care at small clinics makes follow-up x-ray discipline vital.', delivery: 'Mixed public/private trauma network.' },
      { region: 'United Kingdom', note: 'Virtual fracture-clinic model: all fractures reviewed by a specialist within 72 h with a phone consultation.', workflow: 'Reduces unnecessary follow-up visits.' },
      { region: 'WHO/Global', note: 'WHO frames falls and fragility fractures as a growing global priority with ageing populations; ; Same fracture, wildly different access to fixation worldwide.' },
    ],
    sources: [
      niceRef('NICE — wrist fracture assessment and management'),
      ncbiRef('Distal radius fracture management evidence reviews'),
      nhsRef('NHS — Colles fracture patient information'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 3,
    globalRelevance: 'universal',
  },

  // ── ENT ───────────────────────────────────────────────────────────────────
  {
    id: 'c2-ent-otitis-media',
    name: 'Otitis Media — From AOM to Complications',
    kind: 'disease',
    oneLiner:
      'Middle-ear infection behind an inflamed, bulging eardrum — common in small children because their Eustachian tube is short and horizontal.',
    whyMatters:
      'The commonest reason children get antibiotics in many settings; the distinction between viral ear pain and bacterial AOM decides stewardship, and the complications (mastoiditis, meningitis) are exam gold.',
    explain30s:
      'A child with fever, ear pain, and a bulging red drum with lost light reflex = acute otitis media. Many cases are viral and resolve in 2–3 days — watchful waiting with analgesia when the child is well; antibiotics when under 2 years with bilateral disease, or clearly unwell, or discharge (perforation). Recurrent AOM → grommets consideration; the feared late triad: mastoiditis (tender swelling behind the ear), facial palsy, intracranial spread.',
    eli5:
      'The ear and the nose are connected by a tiny corridor that drains the ear. In toddlers the corridor is short and level, so colds easily send germs upstairs into the ear "balloon" — fluid and pus inflate it, hurting the drum. Most balloons deflate on their own; some need antibiotics; a very few burst dangerously backwards into the bone.',
    firstPrinciples: [
      'Pathophysiology: Eustachian dysfunction (viral URTI, adenoids, cleft palate, allergy) → negative pressure → effusion → bacterial growth (S. pneumoniae, H. influenzae, M. catarrhalis).',
      'Diagnosis is OTOSCOPY: bulging, opacified drum with lost landmarks ± effusion levels; redness alone (a crying child) is not AOM.',
      'Stewardship-first approach in well children 2+ years: 48–72 h watchful waiting with adequate analgesia; antibiotics for <2y bilateral, otorrhoea, systemic toxicity, immunocompromise.',
      'First-line antibiotic: amoxicillin (dose by weight); broader cover when recent amoxicillin or conjunctivitis coexists.',
      'OME (glue ear) is different: fluid without acute infection → hearing loss and speech delay; watch 3 months, then grommets if persistent with impact.',
      'Complications radar: post-auricular swelling/tenderness (mastoiditis), ear protrusion, facial nerve palsy, vertigo/nystagmus or severe headache/neck stiffness (intracranial spread) — urgent ENT.',
    ],
    mistakes: [
      'Diagnosing AOM from a red drum in a crying child without bulging/effusion.',
      'Missing the mastoiditis that developed "while on antibiotics".',
      'Confusing OME (glue ear, no fever) with AOM (acute infection).',
    ],
    examRelevance:
      'Otoscopic image recognition; watchful-waiting criteria; complication triad; grommet indications; the horizontal infant Eustachian tube explanation.',
    clinicalRelevance:
      'You will perform otoscopy thousands of times; a disciplined technique (pull pinna: down-back in infants, up-back in adults) is a procedural competency.',
    crossLinks: [
      { label: 'Pneumonia (Medicine)', why: 'Same top pathogens — pneumococcus links them and the conjugate vaccine protects both.' },
      { conceptId: 'c2-peds-milestones', label: 'Developmental milestones', why: 'Recurrent OME → hearing loss → speech delay — screen milestones.' },
    ],
    global: [
      { region: 'India', note: 'High burden with late presentation; CSOM (chronic suppurative otitis media) remains common and squamous-dangerous (cholesteatoma risk) — a different entity from AOM.', terminology: ['CSOM vs AOM distinction carries heavy exam and practice weight in India.'] },
      { region: 'United Kingdom', note: 'Very strict antibiotic stewardship; most AOM managed with delayed/back-up prescriptions.', workflow: 'Safety-netting advice is a formal competency.' },
      { region: 'WHO/Global', note: 'WHO ranks otitis-media hearing loss as a leading cause of preventable childhood hearing impairment globally; ; The public-health stakes exceed the acute episode.' },
    ],
    sources: [
      niceRef('NICE — otitis media (acute): antimicrobial prescribing'),
      whoRef('WHO — childhood hearing loss report'),
      ncbiRef('AOM diagnosis and antibiotic stewardship reviews'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Antibiotic thresholds differ by country — verify current local guidance.',
  },
  {
    id: 'c2-ent-epistaxis',
    name: 'Epistaxis — Nosebleed Control',
    kind: 'process',
    oneLiner:
      'Most nosebleeds bleed from Little\'s area on the front septum — pinching the soft nose for 10–15 minutes stops the vast majority; the rest follow a control ladder.',
    whyMatters:
      'It is the most common ENT emergency, occasionally life-threatening (posterior bleeds in anticoagulated elderly), and the algorithm is fully learnable now.',
    explain30s:
      'First aid: lean FORWARD, pinch the soft cartilaginous nose (not the bony bridge) 10–15 min uninterrupted, ice, avoid sniffing. In ED: identify the site with suction + vasoconstrictor/anaesthetic; cautery (silver nitrate/electro) for anterior bleeds; anterior pack if cautery fails; posterior bleed (elderly, anticoagulated, blood in pharynx with anterior control) → posterior pack/balloon and admission. Correct clotting where indicated; treat hypertension context, not panic numbers.',
    eli5:
      'The front of the nose septum is a traffic junction of four arteries (Kiesselbach plexus). Dry air or a fingernail bursts a small pipe. Pinching squeezes all pipes shut for long enough for a clot plug to form. Looking UP only sends blood to the stomach — always lean forward.',
    firstPrinciples: [
      'Anatomy: Kiesselbach/Little\'s area = anterior septum, confluence of branches (anterior ethmoidal, sphenopalatine, greater palatine, superior labial); ~90% of bleeds are anterior.',
      'First-line: sustained soft-nose pinch 10–15 min, lean forward, spit out blood; topical vasoconstrictor (e.g. xylometazoline) may assist.',
      'Formal control: suction clots → lidocaine+vasoconstrictor → identify vessel → silver-nitrate cautery (anterior only, avoid cartilage injury/bilateral same site) → anterior packing (nasal tampon) 24–48 h + antibiotic cover per protocol.',
      'Posterior bleed suspicion: bilateral pharyngeal blood, continued bleeding despite anterior pack, elderly/anticoagulated — posterior balloon pack ± admission, airway watch.',
      'Systemic checks: anticoagulants/antiplatelets, clotting screen when significant, treat only dangerous BP extremes; evaluate recurrent unexplained bleeds.',
      'Prevention counselling: saline gel/moisturisation, nail trimming in children, avoid nose-picking week after bleed.',
    ],
    mistakes: [
      'Cauterising both sides of the septum at the same point — septal perforation risk.',
      'Releasing the pinch every 30 seconds to "check" — the clot never forms.',
      'Over-treating mild BP elevation with IV antihypertensives mid-bleed.',
    ],
    examRelevance:
      'First-aid step ordering MCQs; Little\'s area anatomy; posterior-bleed red flags; silver-nitrate rules.',
    clinicalRelevance:
      'Anticoagulation is everywhere — the elderly posterior bleed on apixaban at 2 a.m. is a real ward scenario.',
    crossLinks: [
      { label: 'Coagulopathy & liver disease (Medicine)', why: 'Recurrent severe epistaxis can be the first clue.' },
      { conceptId: 'c2-ent-otitis-media', label: 'Otitis media', why: 'Paired ENT procedural basics.' },
    ],
    sources: [
      niceRef('NICE — epistaxis management summary'),
      ncbiRef('Epistaxis management algorithm reviews'),
      jhmiRef('Johns Hopkins Medicine — nosebleed guidance'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 3,
    globalRelevance: 'universal',
  },

  // ── Ophthalmology ─────────────────────────────────────────────────────────
  {
    id: 'c2-opht-glaucoma',
    name: 'Glaucoma — Open vs Closed Angle',
    kind: 'disease',
    oneLiner:
      'A progressive optic neuropathy where intraocular pressure (usually) outpaces the optic nerve\'s tolerance — the silent open-angle type steals peripheral vision; the acute closed-angle type is a painful emergency.',
    whyMatters:
      'Leading cause of irreversible blindness worldwide. Open-angle is silent (screening matters); acute angle-closure can blind within days and its drug sequence is a classic exam ladder.',
    explain30s:
      'Aqueous humour (made by ciliary body, drains at the angle) has two failure modes: drain gets slowly clogged while the angle stays open (open-angle — painless tunnel vision over years), or the iris suddenly blocks the drain (angle-closure — painful red eye, halos, vomiting, hard stone-like globe, mid-dilated pupil). Open-angle: drops (prostaglandin analogues first-line) for life. Acute closure: immediate multimodal pressure reduction then definitive laser iridotomy on BOTH eyes.',
    eli5:
      'The eye is a water balloon with a tap (production) and a drain. Open-angle: the drain slowly rusts — no pain, vision narrows like looking down a tube, so people present late. Closed-angle: the iris suddenly slaps over the drain — pressure rockets; the eye becomes rock-hard, achy, rainy halos around lights, and the patient vomits. One is a marathon of quiet damage; the other is a fire alarm.',
    firstPrinciples: [
      'Aqueous dynamics: ciliary body secretes → posterior chamber → through pupil → trabecular meshwork at the angle → canal of Schlemm.',
      'Open-angle: gradual trabecular resistance; risk — age, family history, high myopia?, steroid response, and in some populations higher baseline vulnerability; diagnosis = IOP + optic-disc cupping + visual-field defects, often found on screening.',
      'Closed-angle: anatomically narrow angle (hypermetropia, older, female, certain ethnicities); precipitated by dim light/dilating drops/stress; ACUTE = ophthalmic emergency.',
      'Acute-closure drug ladder (principles): topical beta-blocker + alpha-2 agonist + carbonic anhydrase inhibitor ± hyperosmotic mannitol for very high pressure, topical steroid for inflammation, pilocarpine ONCE pressure is falling (ischaemic sphincter won\'t respond at 60 mmHg), antiemetic/analgesia.',
      'Definitive: laser peripheral iridotomy — and prophylactically in the FELLOW eye; surgery (trabeculectomy/tubes) for refractory open-angle.',
      'Steroid-induced glaucoma: any prolonged steroid (drops, creams, inhalers) can open the tap problem in susceptible people — always re-check pressure.',
    ],
    numbers: [
      { label: 'Normal IOP', value: '10–21 mmHg', note: 'Some glaucoma occurs at "normal" pressure — the nerve is the arbiter' },
      { label: 'Acute closure typical IOP', value: '40–60+ mmHg', note: 'Rock-hard globe' },
    ],
    mistakes: [
      'Dilating a shallow-angle eye for routine fundoscopy without angle assessment — can precipitate closure.',
      'Giving pilocarpine first at extreme IOP and calling it failure — the sphincter is ischaemic; sequence matters.',
      'Treating only the affected eye — the fellow eye needs prophylactic iridotomy.',
      'Forgetting that normal-tension glaucoma exists — IOP alone neither confirms nor excludes.',
    ],
    mnemonics: [
      { hook: 'Open = silent tube; Closed = screaming stone', expands: 'Painless field loss vs painful hard red eye with vomiting' },
    ],
    examRelevance:
      'Acute angle-closure management sequence MCQs; disc cupping image; drug mechanisms mapped to aqueous dynamics; contraindication traps (atropine in narrow angles).',
    clinicalRelevance:
      'You will prescribe dilating drops and steroids — knowing the angle risk and re-checking IOP is patient-protection.',
    crossLinks: [
      { conceptId: 'c2-opht-cataract', label: 'Cataract', why: 'The red painful pseudophakic eye vs late cataract presentation contrasts.' },
      { label: 'Autonomic pharmacology', why: 'Beta-blockers, alpha-agonists, CAIs — the eye runs on the same receptors.' },
    ],
    global: [
      { region: 'India', note: 'Glaucoma is a leading cause of irreversible blindness; population-based screening by NGO/PHC networks targets angle-closure-prone and high-risk groups; angle-closure prevalence is comparatively higher in Asian populations.', delivery: 'Vision-centre screening model.' },
      { region: 'United Kingdom', note: 'NICE uses risk-based community optometry triage (GPTS pathways) with laser iridotomy standard in closure.', workflow: 'Optometrist-first referral refinement.' },
      { region: 'WHO/Global', note: 'WHO "Vision 2020→2030" frameworks list glaucoma among priority irreversible-blinding diseases; early detection remains the global bottleneck; ; The disease biology is identical; the screening machinery differs.' },
    ],
    sources: [
      niceRef('NICE — glaucoma: diagnosis and management'),
      whoRef('WHO — world report on vision'),
      ncbiRef('Angle-closure glaucoma acute management reviews'),
      jhmiRef('Johns Hopkins Medicine — glaucoma patient education'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Drug sequences and laser practice follow current ophthalmology society guidelines — verify.',
  },
  {
    id: 'c2-opht-cataract',
    name: 'Cataract',
    kind: 'disease',
    oneLiner:
      'The eye\'s lens slowly clouds with age (or earlier with diabetes, steroids, trauma) — painless, progressive blur that surgery cures by replacing the lens.',
    whyMatters:
      'The single largest cause of reversible blindness on Earth; cataract surgery is the most performed surgery in many health systems — you WILL counsel for it.',
    explain30s:
      'Proteins in the crystalline lens denature and clump over decades → blur, glare (headlights), faded colours, frequent spectacle-number changes. Red flags that mimic cataract: sudden vision loss (retina/vitreous, not cataract), painful red eye, or a white pupil in a child (congenital — urgent). Surgery: small-incision phacoemulsification with intraocular lens implant — day-care, local anaesthesia, spectacular outcomes.',
    eli5:
      'The lens is like a clear glass window that slowly fogs and yellows with age. Washing (drops) does not work; you replace the window with a new plastic one folded through a tiny door. That is the whole surgery — and it is one of the highest-value procedures in medicine.',
    firstPrinciples: [
      'Risk/accelerators: age, UV exposure, diabetes, chronic steroids (any route), smoking, trauma, prior eye surgery/inflammation.',
      'Symptoms: gradual painless BLUR, glare/night driving trouble, second-sight paradox (nuclear sclerosis temporarily improves near vision), colour desaturation.',
      'Differentiate from urgent causes: any sudden change, pain, or associated redness is NOT simple cataract until proven otherwise.',
      'Congenital/childhood cataract: white pupillary reflex (leukocoria) is urgent — amblyopia clock is ticking.',
      'Surgery: phacoemulsification + IOL (power calculated by biometry); astigmatism-correcting/multifocal IOLs as options; both-eyes staging is routine.',
      'Post-op care: drops course, no heavy lifting initially, warning signs — pain/vision loss/redness (endophthalmitis is the feared early complication) or flash/floaters (retinal detachment).',
    ],
    mistakes: [
      'Blaming cataract for sudden vision change — always examine the retina and nerve.',
      'Missing steroid history in a young cataract patient.',
      'Dismissing leukocoria in a child as "small cataract" — retinoblastoma must be excluded first.',
    ],
    examRelevance:
      'Risk-factor MCQs (steroids, diabetes), leukocoria urgency, phaco basics, post-op red-eye = endophthalmitis emergency.',
    clinicalRelevance:
      'In India, eye camps deliver lakhs of surgeries yearly; recognising surgical vs medical causes of blur is everyday OPD skill.',
    crossLinks: [
      { conceptId: 'c-dm', label: 'Diabetes mellitus', why: 'Cataract accelerates AND retinopathy must be staged before lens surgery.' },
      { conceptId: 'c2-opht-glaucoma', label: 'Glaucoma', why: 'Steroid response links both; post-surgical red eye vs angle closure.' },
    ],
    global: [
      { region: 'India', note: 'NPCBVI (National Programme for Control of Blindness and Visual Impairment) plus Aravind/LV Prasad models made India a global cataract-surgery efficiency benchmark.', delivery: 'High-volume camp-based and fixed-base surgery.' },
      { region: 'United Kingdom', note: 'NHS referral by optometrist with visual-acuity criteria; day-case bilateral pathway increasingly standard.', workflow: 'Community optometry filters surgical lists.' },
      { region: 'WHO/Global', note: 'WHO lists unaddressed cataract as the leading cause of blindness globally — an access problem, not a technique problem; ; The surgery is the same everywhere; the queues are not.' },
    ],
    sources: [
      whoRef('WHO — world report on vision (cataract burden)'),
      niceRef('NICE — cataracts in adults: management'),
      ncbiRef('Phacoemulsification outcomes reviews'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 3,
    globalRelevance: 'universal',
  },

  // ── Psychiatry ────────────────────────────────────────────────────────────
  {
    id: 'c2-psy-depression',
    name: 'Depression — Recognition & Management Principles',
    kind: 'disease',
    oneLiner:
      'A clinical syndrome of persistent low mood/loss of interest with somatic and cognitive symptoms lasting ≥2 weeks and impairing function — a treatable illness, not a character flaw.',
    whyMatters:
      'Among the most common conditions you will meet (and the most commonly missed). Suicide risk assessment is a core doctoring skill, not an optional extra.',
    explain30s:
      'Diagnosis rests on the core triad — low mood, anhedonia, low energy — plus sleep/appetite/concentration changes, guilt/worthlessness, psychomotor change, and thoughts of death, for ≥2 weeks, most days, with functional impairment. Screen EVERY depressed patient for suicide risk and substance use; exclude thyroid disease, anaemia, drugs. Management layers: psychotherapy (CBT/IPT), SSRIs first-line when indicated, exercise and social scaffolding; combination beats either alone in severe disease. Safety planning is part of treatment, not an afterthought.',
    eli5:
      'Think of mood as a dimmer switch that got stuck low. The person is not lazy or ungrateful — the brain\'s reward and energy circuitry is genuinely stuck. Therapy retrains thought-habits; medication lifts the chemical floor; both together work best for deeper episodes. Ask about suicide directly — the question itself is a lifeline, not a trigger.',
    firstPrinciples: [
      'Core symptoms (≥2 weeks, most days): low mood, anhedonia, fatigability — plus ≥2-4 of the somatic/cognitive cluster depending on framework (sleep, appetite, concentration, guilt, psychomotor, suicidality).',
      'Always rule out mimics: hypothyroidism, anaemia, vitamin B12/D deficiency, steroids/isotretinoin/interferon effects, alcohol/substance use, grief vs depression (functional impairment + breadth of symptoms help).',
      'Risk assessment is mandatory: ideation → plan → means → intent → protective factors; document; safety-plan; involve supports per consent and law.',
      'First-line pharmacotherapy: SSRIs (start low, expect 2–4 week lag, counsel early side-effects and the activation/jitter window); monitor at ~2 weeks; never stop abruptly.',
      'Psychotherapy: CBT/IPT evidence-based at all severities; combination superior in moderate-severe; exercise is an evidence-backed adjunct.',
      'Special situations: pregnancy/breastfeeding (risk-benefit with history of severe episodes), bipolarity screen BEFORE antidepressants (mono-therapy can ignite mania), psychosis/food refusal → urgent specialist.',
    ],
    mistakes: [
      'Prescribing an antidepressant without screening for bipolar disorder or suicide risk.',
      'Telling patients to "give it a few months" — follow-up at 2 weeks is the safety net (activation risk).',
      'Ignoring the medical mimics panel in a first episode over 40 (new depression ≠ young depression).',
    ],
    examRelevance:
      'Diagnostic-criteria MCQs; SSRI choice/monitoring; bipolarity screen before treatment; risk-assessment next-step questions.',
    clinicalRelevance:
      'Distress Skills: every clerkship patient interaction will include at least one PHQ-2 style screen and one suicide-risk conversation.',
    crossLinks: [
      { conceptId: 'c2-psy-schizophrenia', label: 'Schizophrenia basics', why: 'Psychotic depression vs schizophrenia — the mood/psychosis axis.' },
      { label: 'Hypothyroidism (Endocrine)', why: 'The classic depression mimic in routine bloods.' },
    ],
    global: [
      { region: 'India', note: 'District Mental Health Programme integrates depression care into primary care; national tele-mental-health (Tele-MANAS) expands access; stigma remains the central barrier.', delivery: 'Task-shared counselling at PHC level.' },
      { region: 'United States', note: 'Screening (PHQ-9) is institutionalised in primary care; collaborative-care models pay for integrated behavioural health.', workflow: 'Registry-based follow-up.' },
      { region: 'United Kingdom', note: 'Stepped-care model: guided self-help/CBT first via IAPT (Talking Therapies), medication layered by severity.', workflow: 'Therapy-first access is a defining feature.' },
      { region: 'WHO/Global', note: 'WHO mhGAP trains non-specialists worldwide to identify and manage depression — evidence that task-sharing works; ; Different systems, same core: ask, assess risk, treat.' },
    ],
    sources: [
      whoRef('WHO — mhGAP intervention guide (depression module)'),
      niceRef('NICE — depression in adults: treatment and management'),
      ncbiRef('Antidepressant efficacy and stepped-care reviews'),
      nmcRef('CBME psychiatry competencies — mental-state examination'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Drug choice/doses follow current guidelines and licensing — verify before prescribing decisions.',
  },
  {
    id: 'c2-psy-schizophrenia',
    name: 'Schizophrenia Basics',
    kind: 'disease',
    oneLiner:
      'A psychotic disorder defined by positive symptoms (hallucinations, delusions), negative symptoms (apathy, social withdrawal) and disorganisation lasting ≥6 months with ≥1 month of active symptoms.',
    whyMatters:
      'The prototype psychosis. Early recognition + sustained treatment changes lifelong trajectories; the metabolic side-effect burden of treatment is a doctoring responsibility.',
    explain30s:
      'Psychosis = losing touch with shared reality: hearing voices, fixed false beliefs, thought disorder. Schizophrenia is its chronic prototype. Dopamine excess in mesolimbic pathways drives positive symptoms; prefrontal deficits drive negative ones. All antipsychotics block D2 (except partial agonists) — positive symptoms respond best; negative/cognitive symptoms are the real disability. First-episode care: low-dose second-generation antipsychotic, monitor metabolic/EPSEs, psychosocial rehabilitation, NEVER abrupt discontinuation.',
    eli5:
      'Imagine the brain\'s "reality checker" broke: internal thoughts sound like outside voices, and coincidences feel like plots. The person is not dangerous by default — they are frightened. Medicine turns the volume down; therapy and family support rebuild the checker.',
    firstPrinciples: [
      'Symptom groups: positive (hallucinations — auditory classical; delusions — persecutory/reference; thought insertion/broadcast), negative (avolition, blunted affect, alogia, social withdrawal), disorganisation (speech, behaviour), cognitive (attention/working memory).',
      'Duration logic: <1 month acute psychosis; 1–6 months schizophreniform; ≥6 months schizophrenia (active phase ≥1 month).',
      'Organic/drug exclusions are mandatory: temporal-lobe epilepsy, autoimmune encephalitis, stimulant/cannabis-induced psychosis, delirium (visual hallucinations + fluctuating consciousness point away from schizophrenia).',
      'Dopamine hypothesis: mesolimbic D2 overactivity → positive symptoms; all effective antipsychotics occupy D2 (aripiprazole = partial agonist nuance).',
      'Side-effect map: EPSEs (acute dystonia, parkinsonism, akathisia, tardive dyskinesia) track D2 blockade; metabolic syndrome (weight, dyslipidaemia, diabetes — olanzapine/clozapine worst); clozapine = treatment-resistant schizophrenia + agranulocytosis monitoring.',
      'Treatment is LONG-term: relapse tracks discontinuation; LAI (long-acting injectables) when adherence is fragile; CBT for psychosis + family intervention are evidence-based add-ons.',
    ],
    mistakes: [
      'Calling any hallucination schizophrenia — visual hallucinations suggest organic/delirium; tactile/olfactory raise medical causes.',
      'Missing the metabolic annual-review duty — antipsychotic patients die earlier from cardiovascular disease, not suicide alone.',
      'Stopping antipsychotics abruptly at discharge.',
    ],
    mnemonics: [
      { hook: 'First-rank Schneider classics', expands: 'Thought insertion/withdrawal/broadcast · audible thoughts · delusional perception · passivity phenomena' },
    ],
    examRelevance:
      'Duration-threshold MCQs; first-rank symptoms; EPSE vs metabolic burden by drug; clozapine indications + monitoring; substance-vs-primary psychosis reasoning.',
    clinicalRelevance:
      'You will review psychiatric outpatients on antipsychotics — weight, lipids, glucose and EPSE checks are YOUR job alongside the psychiatrist.',
    crossLinks: [
      { conceptId: 'c2-psy-depression', label: 'Depression', why: 'Post-psychotic depression is common; the mood-psychosis spectrum.' },
      { label: 'Autonomic pharmacology', why: 'Anticholinergic/α1 blockade explains dry mouth, sedation, postural drops.' },
    ],
    global: [
      { region: 'India', note: 'Treatment gap remains large; family-based intervention and NIMHANS-district models lead; faith-healer first-contact is common — engagement, not confrontation, changes outcomes.', delivery: 'District Mental Health Programme + NGOs.' },
      { region: 'United States', note: 'Coordinated Specialty Care for first-episode psychosis emphasises duration-of-untreated-psychosis reduction.', workflow: 'Early-psychosis clinics.' },
      { region: 'United Kingdom', note: 'NICE mandates early intervention in psychosis services with 2-week access target.', workflow: 'Rapid access teams.' },
      { region: 'WHO/Global', note: 'WHO QualityRights project reframes care around dignity and human rights globally; ; Biology identical; human context everywhere.' },
    ],
    sources: [
      whoRef('WHO — mhGAP psychosis module and QualityRights'),
      niceRef('NICE — psychosis and schizophrenia in adults'),
      ncbiRef('Antipsychotic metabolic monitoring reviews'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Antipsychotic choice/monitoring is guideline- and licence-dependent — verify current standards.',
  },

  // ── Dermatology ───────────────────────────────────────────────────────────
  {
    id: 'c2-derm-psoriasis',
    name: 'Psoriasis',
    kind: 'disease',
    oneLiner:
      'A chronic immune-mediated disease where skin cells renew in days instead of weeks — silvery scaly plaques on extensor surfaces, often with nail and joint involvement.',
    whyMatters:
      'The prototype papulosquamous eruption. Recognising it matters because it is systemic: psoriatic arthritis, metabolic syndrome, and the psychosocial load all ride along.',
    explain30s:
      'Sharply demarcated red plaques with silvery scale on elbows/knees/scalp; scratch the scale and see pinpoint bleeding (Auspitz). Triggers: strep throat (guttate flares), stress, drugs (beta-blockers, lithium, antimalarials, steroid withdrawal), Koebner on trauma. Nail pitting and oil spots; morning back stiffness or dactylitis → psoriatic arthritis. Treatment ladder: emollients + topical steroids/vitamin-D analogues → phototherapy → systemic/biologics for severe disease.',
    eli5:
      'Skin normally renews monthly; in psoriasis the production line speeds up to a few days, so cells pile up as shiny scales. It is not an infection and not contagious — it is the immune system\'s accelerator jammed. The skin is only one stop: joints and heart-risk ride the same train.',
    firstPrinciples: [
      'Pathogenesis: Th17/IL-23/IL-17 axis drives keratinocyte hyperproliferation + neutrophil microabscesses — the reason biologics targeting IL-17/IL-23 are so effective.',
      'Morphology: well-demarcated erythematous plaques, silvery mica scale, extensor elbows/knees, sacrum, scalp; variants — guttate (drop lesions post-strep), pustular, erythrodermic (emergency).',
      'Signature signs: Auspitz (pinpoint bleeding), Koebner (lesions at trauma lines), candle-grease on grattage.',
      'Nails: pitting, oil-drop discolouration, onycholysis; nail disease predicts joint disease.',
      'Psoriatic arthritis screen (every visit): DIP involvement, dactylitis, enthesitis, inflammatory back pain — early referral changes radiographic destiny.',
      'Comorbidity bundle: obesity, dyslipidaemia, diabetes, depression, cardiovascular risk — psoriasis is a systemic inflammatory state.',
      'Treatment ladder: emollients + topical corticosteroid ± vitamin-D analogue → phototherapy (NB-UVB) → methotrexate/ciclosporin/acitretin → biologics (IL-17/IL-23/anti-TNF) for severe/refractory.',
    ],
    mistakes: [
      'Calling it a fungal infection and treating with antifungals for months (the well-demarcated extensor distribution argues psoriasis).',
      'Prescribing strong steroids alone long-term and ignoring the rebound on withdrawal.',
      'Never asking about joints or cardiovascular risk — the skin is one organ of the syndrome.',
    ],
    mnemonics: [
      { hook: 'Psoriasis drugs that flare it', expands: 'BALI — Beta-blockers, Antimalarials, Lithium, NSAIDs/steroid-withdrawal (+ alcohol, stress, strep)' },
    ],
    examRelevance:
      'Image recognition (extensor plaques), Auspitz/Koebner signs, guttate-after-strep scenario, drug-flare lists, psoriatic-arthritis screening.',
    clinicalRelevance:
      'One of the top dermatology OPD diagnoses; a disciplined topical regimen + joint screen is the whole visit.',
    crossLinks: [
      { label: 'Immunology — Th17 axis', why: 'Connects directly to the hypersensitivity/cytokine framework.' },
      { conceptId: 'c-htn', label: 'Hypertension', why: 'Cardiovascular-risk bundle shared with metabolic syndrome.' },
    ],
    global: [
      { region: 'India', note: 'High OPD volume; topical-therapy-first pragmatism; phototherapy access uneven; stigmatisation and marriage-related distress are real clinical topics.', delivery: 'Dermatology at district hospitals + teledermatology pilots.' },
      { region: 'United States', note: 'Biologic-first adoption is earlier in moderate-severe disease; payer prior-authorisation shapes choice.', workflow: 'Insurance step-therapy.' },
      { region: 'WHO/Global', note: 'WHO recognizes psoriasis as a serious noncommunicable disease with major psychosocial impact (2016 resolution); ; The stigma is part of the pathology.' },
    ],
    sources: [
      whoRef('WHO — global report on psoriasis'),
      niceRef('NICE — psoriasis assessment and management'),
      ncbiRef('IL-17/IL-23 pathway and biologic evidence reviews'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 3,
    globalRelevance: 'universal',
    verifyNote: 'Systemic/biologic choices are specialist-led and guideline-updated — verify.',
  },

  // ── Radiology ─────────────────────────────────────────────────────────────
  {
    id: 'c2-rad-cxr',
    name: 'Chest X-Ray — The Systematic ABCDE Approach',
    kind: 'investigation',
    oneLiner:
      'A chest X-ray rewards a fixed reading order — A irway, B ones, C ardiac, D iaphragm/Diaphragmatic angles, E verything else — so nothing important hides behind an obvious finding.',
    whyMatters:
      'The most ordered imaging test in medicine. "Satisfaction of search" — spotting the obvious pneumonia and missing the small pneumothorax — is a documented, preventable error pattern.',
    explain30s:
      'Check the film first: name/date/orientation (left marker), projection (PA vs AP — heart size only valid on PA), inspiration (5–7 anterior ribs), penetration (vertebrae just visible behind heart). Then sweep: A — trachea central, hila position, mediastinal width; B — ribs/clavicles/spine (lytic lesions, fractures), soft tissues; C — heart width <50% chest width (PA), contours; D — diaphragm domes, costophrenic angles sharp, gastric bubble, air under the right hemidiaphragm; E — lung fields zone-by-zone comparing sides, then lines/tubes/devices. Finish with review areas: apices, behind the heart, below the diaphragms, hila, soft tissues.',
    eli5:
      'Reading an X-ray without a system is like entering a room and staring at the loudest object. The ABCDE walk-through is turning on the lights wall-by-wall. The review areas are the places burglars love: apices (small tumour), behind the heart (left lower lobe), under the diaphragm (free air), and the bone edges everyone skips.',
    firstPrinciples: [
      'Technical check before diagnosis: projection (PA/AP), inspiration effort, penetration, rotation (clavicles equidistant from spinous processes) — a bad film fakes pathology.',
      'Air is black, fat grey, soft tissue/water white, bone intense white, metal brightest — density logic explains every silhouette.',
      'Silhouette sign: a border disappears when adjacent tissue has the same density → right-middle-lobe consolidation erases the right heart border; left-lingula erases the left; lower lobes spare the heart border but erase the diaphragm.',
      'Cardiothoracic ratio <50% valid ONLY on PA erect films; AP films magnify the heart — do not call cardiomegaly on an AP.',
      'Pneumothorax logic: look for the visceral pleural line and absent peripheral markings; tension signs (trachea/mediastinal shift away) convert it to an emergency.',
      'Always finish with review areas — the discipline that catches the second diagnosis.',
    ],
    mistakes: [
      'Calling cardiomegaly on an AP film.',
      'Missing air under the diaphragm because the lungs looked "interesting".',
      'Diagnosing consolidation without checking for an underlying mass behind it ("satisfaction of search").',
      'Reading a rotated/expired film as bilateral hilar prominence.',
    ],
    mnemonics: [
      { hook: 'ABCDE + review areas RAPIDS', expands: 'Review: apices, behind-heart, below-diaphragm, hila, soft-tissues/bones (personalise your own list and KEEP it fixed)' },
    ],
    examRelevance:
      'Film-based MCQs: silhouette-sign localisation, pneumothorax vs bulla, free air, pleural effusion meniscus, cardiomegaly rules. The systematic-approach answer scores in vivas.',
    clinicalRelevance:
      'Your first on-call CXR interpretations (line positions, NG tube check, pneumothorax after line insertion) happen as an intern — the system is safety.',
    crossLinks: [
      { conceptId: 'c2-medicine-pneumonia', label: 'Pneumonia', why: 'Consolidation + air-bronchograms are the lobar pattern you are hunting.' },
      { conceptId: 'c2-medicine-stroke', label: 'Stroke', why: 'Contrast: the CXR before thrombolysis in stroke Mimic-safety checks.' },
    ],
    sources: [
      ncbiRef('Systematic chest radiograph interpretation teaching reviews'),
      jhmiRef('Johns Hopkins Medicine — chest X-ray patient/learner resources'),
      hmxRef('Harvard Medical School HMX — medical imaging fundamentals (radiology concepts)'),
    ],
    evidenceLevel: 'widely-taught',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 4,
    globalRelevance: 'universal',
  },

  // ── Anaesthesia ───────────────────────────────────────────────────────────
  {
    id: 'c2-anes-asa-airway',
    name: 'ASA Grading & Airway Basics',
    kind: 'principle',
    oneLiner:
      'Before any anaesthetic, two questions rule: how sick is the patient (ASA class) and can we keep oxygen moving (airway)?',
    whyMatters:
      'ASA class predicts peri-operative risk in one letter-digit code and appears in every surgical note; airway assessment (Mallampati etc.) is the pre-op checklist that prevents catastrophes.',
    explain30s:
      'ASA I healthy · II mild systemic disease (controlled HTN) · III severe (poorly controlled DM, COPD) · IV severe constant threat to life · V moribund · E suffix = emergency. Airway exam: mouth opening, neck movement, teeth, Mallampati (what of the posterior oropharynx is visible), thyromental distance (<6 cm predicts difficulty), beard/burns/previous difficulty history. Failed-airway drill: oxygenate by any means, call help, LMA, fibreoptic — never repeat the same failing manoeuvre.',
    eli5:
      'ASA is a fitness-to-fly sticker for surgery — one letter tells the whole team how bumpy the flight may be. The airway check is the pre-flight walk-around: can the tube get in, and is there a plan B, C and D BEFORE you need them?',
    firstPrinciples: [
      'ASA is a SUBJECTIVE functional scale, not a lab-score; the emergency suffix multiplies risk and changes urgency calculus.',
      'Airway anatomy predictability: Mallampati class I–IV (tongue-to-pharynx ratio), thyromental distance >6 cm, mouth opening >3 cm, neck extension — each adds up to an "airway plan".',
      'Pre-oxygenation (3 min or 8 vital-capacity breaths) buys desaturation time — the single strongest routine safety manoeuvre.',
      'Induction sequence logic: pre-oxygenate → induce → mask ventilate → paralise → intubate → confirm (capnography = gold standard of tube confirmation).',
      'Difficult-airway algorithms share one principle: STOP repeating failed attempts; wake-up options exist; escalate by plan (supraglottic → flexible scope → surgical airway).',
      'Malignant hyperthermia radar: masseter rigidity → rising EtCO2 → temperature spike; stop triggers, dantrolene, cool.',
    ],
    numbers: [
      { label: 'Thyromental distance', value: '>6 cm', note: 'Shorter = difficult-airway predictor' },
      { label: 'Mouth opening', value: '≥3 finger-breadths' },
    ],
    mistakes: [
      'Treating ASA as a precise score — it is a shared-shorthand risk flag.',
      'Multiple repeated laryngoscopy attempts ("if at first you fail, fail the airway") — trauma, desaturation, can\'t-intubate-can\'t-oxygenate.',
      'Skipping capnography confirmation — misplaced tubes kill silently.',
    ],
    examRelevance:
      'ASA classification MCQs (with E suffix), Mallampati/thyromental predictors, capnography as confirmation gold standard, malignant hyperthermia drill order.',
    clinicalRelevance:
      'Interns write ASA grades on every pre-op note and assist airway management on calls — the vocabulary is daily currency.',
    crossLinks: [
      { conceptId: 'emergency-medicine-abcde', label: 'ABCDE approach', why: 'A = airway — the anaesthetic skill inside the emergency framework.' },
      { conceptId: 'c2-cc-shock', label: 'Shock types', why: 'Induction hypotension in shock is a different risk game.' },
    ],
    global: [
      { region: 'India', note: 'Objective structured pre-op templates standardised by teaching-hospital protocols; equipment-variable environments make the difficult-airway algorithm non-negotiable.', delivery: 'Government vs corporate theatre realities differ sharply.' },
      { region: 'United States', note: 'ASA classification originates here; anaesthesia information systems embed it in every note.', workflow: 'Standardised pre-op clinics.' },
      { region: 'WHO/Global', note: 'WHO Surgical Safety Checklist (airway + aspiration risk items) is the global standard — implemented in every member state\'s guidance.; A one-page checklist saved more lives than many drugs.' },
    ],
    sources: [
      whoRef('WHO — surgical safety checklist'),
      ncbiRef('Difficult airway algorithms and ASA classification reviews'),
      jhmiRef('Johns Hopkins Medicine — anaesthesiology education resources'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'foundation',
    examWeight: 3,
    globalRelevance: 'universal',
  },

  // ── Emergency Medicine ────────────────────────────────────────────────────
  {
    id: 'emergency-abcde',
    name: 'Emergency ABCDE Approach',
    kind: 'principle',
    oneLiner:
      'Treat the killable problems in order — Airway, Breathing, Circulation, Disability, Exposure — fixing each before moving on, and re-looping whenever the patient changes.',
    whyMatters:
      'It is the shared language of every emergency system on Earth. The approach converts panic into sequence, and sequence into lives.',
    explain30s:
      'A: patent? sounds? protect (airway manoeuvres/oxygen). B: rate, effort, saturation, equal air entry, treat tension pneumothorax NOW if seen. C: pulses, BP, fast scan for bleed, two big IV lines, control external bleeding, fluids/blood by physiology. D: GCS/pupils/glucose — hypoglycaemia is the classic imposter. E: fully expose, log-roll, temperature, full exam. Then AMPLE history (allergies, meds, past, last meal, events). Re-assess after every intervention: the sick patient gets the loop again and again.',
    eli5:
      'In an emergency, the body punishes you for skipping steps. ABCDE is the checklist a pilot uses: engine (airway), lift (breathing), fuel (circulation), instruments (brain/glucose), full walk-around (exposure). You fix what is failing at each step before taxiing onward — and after any change, you run the checklist again.',
    firstPrinciples: [
      'The order is by time-to-death: airway obstruction kills in minutes, tension pneumothorax in minutes, haemorrhage in minutes-to-hours — the sequence encodes triage physics.',
      'A: look/sounds (stridor, gurgling), suction, jaw thrust, adjuncts; oxygen high-flow while assessing.',
      'B: 3–s system — rate/effort/saturation; equal chest movement; percussion for tension pneumothorax → immediate decompression BEFORE imaging; treat life-threatening breathing first.',
      'C: two large-bore lines, take bloods with insertion; FAST scan in trauma; control visible bleeding (pressure); fluid/blood guided by physiology — hypotensive resuscitation concepts in penetrating trauma are specialist territory.',
      'D: AVPU/GCS, pupils, glucose (mandatory — the most commonly missed reversible cause), lateralising signs.',
      'E: expose fully (hypothermia and hidden wounds), keep warm; AMPLE history after stabilisation, never during the first loop.',
      'The loop repeats: any deterioration → back to A. Document times; call for help early; the team leader assigns, does not grab.',
    ],
    mistakes: [
      'Doing the E before the C — exposing a shocked patient while the bleed continues.',
      'Forgetting glucose in decreased consciousness.',
      'Chasing the dramatic wound and skipping a quiet tension pneumothorax.',
      'Leaving to fetch equipment yourself instead of tasking a named helper.',
    ],
    examRelevance:
      'Next-step ordering questions (tension pneumothorax → decompress, not CXR first), GCS calculation, reversible-cause checklists (glucose), team-leadership principles.',
    clinicalRelevance:
      'Every resuscitation in every hospital in the world runs this loop; certification courses (ATLS/EMST equivalents) build on it.',
    crossLinks: [
      { conceptId: 'c2-cc-shock', label: 'Shock types', why: 'C-step physiology in depth.' },
      { conceptId: 'c2-anes-asa-airway', label: 'Airway basics', why: 'A-step craft.' },
      { conceptId: 'c2-medicine-pneumonia', label: 'Pneumonia', why: 'Sepsis-triggered presentations funnel through this loop.' },
    ],
    global: [
      { region: 'India', note: '108/112 ambulance networks and BLS training drives embed ABCDE in pre-hospital care; golden-hour trauma culture grew from highway epidemiology.', terminology: ['"Casualty" is the traditional Indian ED name'] },
      { region: 'United States', note: 'ATLS (American College of Surgeons) codified the primary survey; 911/EMS handoff scripts mirror A-E.', workflow: 'Trauma-team activation criteria.' },
      { region: 'United Kingdom', note: 'ATLS-derived and taught nationally; "A to E assessment" appears in RCS/RCUK guidance; 999 system.', workflow: 'SIRS/NEWS2 escalation loops.' },
      { region: 'WHO/Global', note: 'WHO trauma-care checklists and essential-emergency-care lists globalise the same sequence for resource-variable settings; ; The order is universal; the equipment budget is not.' },
    ],
    sources: [
      whoRef('WHO — trauma care checklists and essential emergency care'),
      cdcRef('CDC — emergency response fundamentals'),
      ncbiRef('Primary survey evidence and team-performance reviews'),
      nhsRef('NHS — emergency assessment frameworks'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
  },

  // ── Oncology ──────────────────────────────────────────────────────────────
  {
    id: 'oncology-tnm',
    name: 'Cancer Staging — the TNM Concept',
    kind: 'principle',
    oneLiner:
      'TNM compresses a cancer\'s anatomy into three numbers — Tumour size/invasion, Nodes involved, Metastases — that drive stage, treatment and prognosis worldwide.',
    whyMatters:
      'Every cancer conversation (MDT, trials, prognosis counselling) runs on stage. Mis-staging mis-treats. The grammar is universal — learn it once, read all cancers.',
    explain30s:
      'T describes local depth/size (e.g. breast T1 <2 cm; rectal T3 beyond muscularis). N is regional nodes (N0 none, N1-N3 by number/level). M0 vs M1 is the great divider — metastatic disease changes the goal from cure to control. Groups map to stages I–IV. Extras: cT (clinical) vs pT (pathological, after surgery); suffixes like "mi" (microscopic metastasis) exist. Stage drives intent: I–II often local therapy ± adjuvant; III multimodal; IV systemic/palliative intent — always framed with the patient, never in a vacuum.',
    eli5:
      'Think of cancer as an invasion map: how big is the army at home (T), how many nearby towns are taken (N), has it crossed the ocean (M). The map decides the war plan — local battle, regional campaign, or global defence. Same grammar for every country (cancer), which is why oncologists everywhere can read each other\'s notes.',
    firstPrinciples: [
      'T = local invasion depth/size (organ-specific definitions — learn one cancer deeply, e.g. colorectal Tis→T4, and the pattern transfers).',
      'N = regional lymph nodes by NUMBER and/or level; sentinel-node logic (first echelon) changed breast/melanoma surgery.',
      'M = distant spread; M1 splits into resectable-oligometastatic vs systemic disease in modern practice.',
      'Prefixes: c = clinical (exam/imaging), p = pathological (specimen), y = after neoadjuvant therapy, r = recurrent, a = autopsy — the letter before TNM changes meaning.',
      'Stage grouping combines T+N+M + grade/score inputs per organ (e.g. Gleason in prostate, Breslow in melanoma) — AJCC/UICC editions update periodically; always quote the edition used.',
      'Communication duty: stage language ("locally advanced", "metastatic") carries emotional weight — pair every stage with intent (cure vs control) and a plan.',
    ],
    mistakes: [
      'Quoting stage without the edition year (criteria change between AJCC editions).',
      'Confusing pT3 in rectum (through muscularis) with T3 semantics in another organ — definitions are organ-specific.',
      'Calling lymph nodes "metastasis" — regional nodes are N, not M; distant organs are M.',
    ],
    examRelevance:
      'Assign-stage vignettes, c vs p vs y prefixes, TNM-to-stage grouping in common cancers (breast, colorectal), which modality stages which step (PET/CT, MRI rectum, sentinel node).',
    clinicalRelevance:
      'MDT meetings decode staging imaging daily; your accurate radiology report → correct stage → correct trial eligibility.',
    crossLinks: [
      { conceptId: 'c-neoplasia', label: 'Neoplasia basics', why: 'Hallmarks and metastasis pathways underlie TNM.' },
      { conceptId: 'c2-rad-cxr', label: 'Chest X-ray approach', why: 'Staging imaging starts with systematic reading.' },
    ],
    global: [
      { region: 'India', note: 'Late presentation shifts the stage distribution upward; NCRP registry data guide national priorities; low-cost staging (ultrasound-first) is a real-world skill.', delivery: 'Regional cancer centres + MDT-by-telemedicine.' },
      { region: 'United States', note: 'AJCC staging is the reference standard; SEER registries power survival statistics.', workflow: 'Insurance-coded staging pathways.' },
      { region: 'United Kingdom', note: 'NHS stages via national MDTs with mandated cancer-wait targets (62-day referral-to-treatment).', workflow: 'Timer-governed staging.' },
      { region: 'WHO/Global', note: 'WHO/UICC promote uniform staging so global trials and registries can speak one language; ; TNM is one of medicine\'s true shared languages.' },
    ],
    sources: [
      whoRef('WHO — cancer control frameworks'),
      ncbiRef('AJCC/UICC staging primer literature (PubMed Central)'),
      nhsRef('NHS — cancer waiting times and MDT standards'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 4,
    globalRelevance: 'universal',
    verifyNote: 'Staging editions update — always verify the current AJCC/UICC edition used by your unit.',
  },

  // ── Critical Care ─────────────────────────────────────────────────────────
  {
    id: 'c2-cc-shock',
    name: 'Shock — The Four Types and the Resuscitation Logic',
    kind: 'disease',
    oneLiner:
      'Shock is cellular oxygen debt from inadequate perfusion — four families (hypovolaemic, cardiogenic, obstructive, distributive), each with its own fix.',
    whyMatters:
      'Misclassifying shock kills: fluids that save a haemorrhage patient drown a cardiogenic one. The classification is a treatment algorithm in disguise.',
    explain30s:
      'Perfusion = pump × pipes × volume. Hypovolaemic: tank empty (bleed/diarrhoea) → flat necks, dry axillae, respond to fluids + source control. Cardiogenic: pump failed (MI, arrhythmia) → cold clammy, raised JVP, crackles → inotropes/revascularisation, cautious fluids. Obstructive: pump blocked (tension pneumothorax, tamponade, massive PE) → fix the obstruction itself. Distributive: pipes wide open (sepsis, anaphylaxis, neurogenic) → warm early, fluids + vasopressors + cause. Lactate and mentation track severity better than BP alone — normotensive shock exists.',
    eli5:
      'A city needs water pressure: tank (volume), pump (heart), pipes (vessels). Shock means pressure is failing — find WHICH piece broke. Empty tank → refill it. Broken pump → support the pump, don\'t flood it. Blocked pipe → unblock it. Wide-open pipes → squeeze them shut. The patient\'s skin, neck veins and urine tell you which story you are in.',
    firstPrinciples: [
      'Definition is cellular: oxygen delivery < demand → anaerobic metabolism → lactate rises; BP is a late, unreliable sign (compensation keeps pressure near-normal until late).',
      'Hypovolaemic: haemorrhagic vs non-haemorrhagic; ATLS-class blood loss logic; control the source WHILE resuscitating.',
      'Cardiogenic: acute MI most common; signs — cold peripheries, pulmonary oedema, raised JVP; echo is the rapid answer; avoid flood-dose fluids.',
      'Obstructive: tension pneumothorax (needle decompression), cardiac tamponade (pulsus paradoxus, Beck triad → pericardiocentesis), massive PE (thrombolysis/EMBO logic).',
      'Distributive: septic (warm early shock, capillary-refill/lactate-guided fluids + noradrenaline logic, antibiotics within the hour), anaphylactic (IM adrenaline 0.5 mg 1:1000 anterolateral thigh FIRST), neurogenic (loss of sympathetic tone — bradycardia + hypotension after spinal injury).',
      'Monitoring escalation: lactate clearance, urine output, central venous context, arterial line, bedside echo (POCUS) — resuscitate to perfusion endpoints, not pressure vanity.',
    ],
    numbers: [
      { label: 'Lactate', value: '>2 mmol/L concern · >4 mmol/L severe', note: 'Clearance with treatment tracks survival' },
      { label: 'Anaphylaxis adrenaline', value: '0.5 mg IM 1:1000, anterolateral thigh', note: 'Repeat per protocol; IV route only in monitored settings' },
      { label: 'Urine output target', value: '≥0.5 ml/kg/h', note: 'The cheapest perfusion monitor' },
    ],
    mistakes: [
      'Treating BP instead of perfusion — a normotensive lactate 5 is still shock.',
      'Fluid-bolusing every hypotension (cardiogenic and obstructive suffer).',
      'Giving adrenaline slowly IV in anaphylaxis instead of IM per protocol.',
      'Missing tamponade in a post-MI/cancer/uraemic patient with raised JVP and quiet heart sounds.',
    ],
    mnemonics: [
      { hook: 'Pump-Pipes-Tank-Block', expands: 'Cardiogenic = pump · Distributive = pipes · Hypovolaemic = tank · Obstructive = block' },
    ],
    examRelevance:
      'Classify-the-shock vignettes (skin/JVP/lactate patterns), anaphylaxis-first-questions, tension-pneumothorax-before-imaging, tamponade triad, lactate interpretation.',
    clinicalRelevance:
      'Ward-call bread and butter: the hypotensive post-op patient at 2 a.m. gets the classification before the fluid bag.',
    crossLinks: [
      { conceptId: 'emergency-abcde', label: 'ABCDE approach', why: 'Shock is what the C step is hunting.' },
      { conceptId: 'c-raas', label: 'RAAS & BP regulation', why: 'Compensatory physiology explaining late hypotension.' },
      { conceptId: 'c2-medicine-pneumonia', label: 'Pneumonia & sepsis', why: 'The commonest distributive-shock source.' },
    ],
    global: [
      { region: 'India', note: 'Septic-shock burden from tropical infections (malaria, dengue, leptospirosis) adds flavour — fluid-resuscitation nuance in dengue (leakage phase) is a distinctly Indian exam topic.', delivery: 'ICU access varies from district-ventilator ward to quaternary centre.' },
      { region: 'United States', note: 'Surviving Sepsis Campaign hour-1 bundle culture; POCUS-first haemodynamics in academic centres.', workflow: 'Bundle-compliance metrics.' },
      { region: 'United Kingdom', note: 'NEWS2-triggered escalation to critical-care outreach; sepsis six-bundle.', workflow: 'Rapid-response teams.' },
      { region: 'WHO/Global', note: 'WHO essential-medicines list includes adrenaline, noradrenaline, Ringer lactate — the shock armamentarium is a global-equity issue; ; Same physiology; unequal shelf availability.' },
    ],
    sources: [
      whoRef('WHO — model list of essential medicines (emergency agents)'),
      ncbiRef('Shock classification and sepsis bundle evidence reviews'),
      cdcRef('CDC — sepsis clinical overview'),
      niceRef('NICE — sepsis recognition and management'),
    ],
    evidenceLevel: 'established',
    sourceConfidence: 'high',
    lastReviewed: '2026-10-05',
    educationalLevel: 'core',
    examWeight: 5,
    globalRelevance: 'universal',
    verifyNote: 'Fluid strategies and vasopressor sequencing are guideline-evolving — verify current bundles.',
  },
]

// ── LESSON → TOPIC HINTS ────────────────────────────────────────────────────
// Explicit placement map (same pattern as the other packs) — the seeder
// resolves each lesson's topic via this hint; unresolvable ids throw.
const LESSON_TOPICS: Record<string, string> = {
  'c-ami': 't-med-acs',
  'c-htn': 't-med-htn',
  'c-dm': 't-med-dm',
  'c2-medicine-stroke': 't-med-acs',
  'c2-medicine-pneumonia': 't-med-shock',
  'c2-medicine-anemia': 't-med-shock',
  'c2-medicine-thyroid': 't-med-thyroid',
  'c2-medicine-ckd': 't-med-htn',
  'c2-medicine-tb-mgmt': 't-med-shock',
  'c2-surgery-acute-abdomen': 't-surg-appendix',
  'c2-surgery-appendicitis': 't-surg-appendix',
  'c2-surgery-hernias': 't-surg-hernia',
  'c2-surgery-int-obstruction': 'surgery-intestinal-obstruction',
  'c2-surgery-wounds-healing': 'surgery-wounds-healing',
  'c2-obgy-normal-labour': 't-obgy-labour',
  'c-preec': 't-obgy-preec',
  'c2-obgy-anc': 't-obgy-antenatal',
  'c2-obgy-pcos': 'obgy-pcos',
  'c2-peds-milestones': 't-peds-growth',
  'c2-peds-immunization': 'peds-immunization',
  'c2-peds-diarrhea': 'peds-diarrhea-dehydration',
  'c2-peds-neonatal-jaundice': 'peds-neonatal-jaundice',
  'c2-orth-compartment': 't-orth-fractures',
  'c2-orth-colles': 'orth-colles',
  'c2-ent-otitis-media': 't-ent-vertigo',
  'c2-ent-epistaxis': 'ent-epistaxis',
  'c2-opht-glaucoma': 't-opht-redeye',
  'c2-opht-cataract': 'opht-cataract',
  'c2-psy-depression': 't-psy-mood',
  'c2-psy-schizophrenia': 'psy-schizophrenia',
  'c2-derm-psoriasis': 't-derm-psoriasis',
  'c2-rad-cxr': 't-rad-chestxray',
  'c2-anes-asa-airway': 't-anes-crit',
  'emergency-abcde': 'emergency-medicine-abcde',
  'oncology-tnm': 'oncology-tnm-staging',
  'c2-cc-shock': 't-med-shock',
}

const lessonsWithTopics = lessons.map((l) => {
  const topicId = LESSON_TOPICS[l.id]
  if (!topicId || !topics.some((t) => t.id === topicId)) {
    throw new Error(`[clinical pack] lesson ${l.id} has no valid topic hint (${topicId ?? 'none'})`)
  }
  return { ...l, topicId }
})

export const clinicalPack: ContentPack = {
  packId: 'clinical',
  subjects: [],
  topics,
  lessons: lessonsWithTopics,
  curriculum,
}
