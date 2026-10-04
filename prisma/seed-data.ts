// ─── MEDOS CURRICULUM DATA ───
// Subjects follow NMC CBME structure (year-wise). Content is original educational material.
// Graph edges encode cross-subject connections — the core of the product.

export interface SeedSubject { id: string; code: string; name: string; year: number; color: string; neetWeight: number; blurb: string }
export interface SeedTopic { id: string; subjectId: string; name: string; system?: string; importance?: number; description?: string }
export interface SeedConcept {
  id: string; topicId: string; name: string; kind?: string; summary: string;
  whyMatters?: string; mnemonic?: string; difficulty?: number; examRelevance?: number; clinicalRelevance?: number;
  detail?: { h: string; body?: string[]; table?: { headers: string[]; rows: string[][] } }[]
}
export interface SeedEdge { from: string; to: string; type: string; label?: string }

export const subjects: SeedSubject[] = [
  { id: 'anatomy', code: 'ANAT', name: 'Anatomy', year: 1, color: '#38bdf8', neetWeight: 4, blurb: 'The structural language of medicine — every clinical sign is anatomy in action.' },
  { id: 'physiology', code: 'PHYS', name: 'Physiology', year: 1, color: '#22d3ee', neetWeight: 8, blurb: 'How the body works. Every drug you will prescribe is physiology repeated.' },
  { id: 'biochemistry', code: 'BIOCH', name: 'Biochemistry', year: 1, color: '#34d399', neetWeight: 8, blurb: 'Molecular machinery — enzymes, pathways and their clinical fingerprints.' },
  { id: 'pathology', code: 'PATHO', name: 'Pathology', year: 2, color: '#f472b6', neetWeight: 13, blurb: 'The bridge from normal to diseased. Highest-yield para-clinical subject.' },
  { id: 'pharmacology', code: 'PHARM', name: 'Pharmacology', year: 2, color: '#a78bfa', neetWeight: 11, blurb: 'Drugs are applied physiology — mechanisms, indications, and traps.' },
  { id: 'microbiology', code: 'MICRO', name: 'Microbiology', year: 2, color: '#fbbf24', neetWeight: 8, blurb: 'Infectious agents, lab diagnosis and the logic of antimicrobials.' },
  { id: 'fmt', code: 'FMT', name: 'Forensic Medicine & Toxicology', year: 2, color: '#94a3b8', neetWeight: 5, blurb: 'Medicine meets law — injuries, poisoning, and legal procedure.' },
  { id: 'cm', code: 'CM', name: 'Community Medicine', year: 2, color: '#4ade80', neetWeight: 12, blurb: 'Populations as patients — epidemiology, vaccines, and national programs.' },
  { id: 'ent', code: 'ENT', name: 'Otorhinolaryngology', year: 3, color: '#fb923c', neetWeight: 5, blurb: 'Head-neck anatomy applied — hearing, airway, and cancers.' },
  { id: 'opht', code: 'OPHT', name: 'Ophthalmology', year: 3, color: '#2dd4bf', neetWeight: 5, blurb: 'The eye as a window — to hypertension, diabetes and neurology.' },
  { id: 'medicine', code: 'MED', name: 'General Medicine', year: 3, color: '#60a5fa', neetWeight: 18, blurb: 'The highest-weighted clinical subject — internal medicine mastery.' },
  { id: 'surgery', code: 'SURG', name: 'General Surgery', year: 3, color: '#f87171', neetWeight: 15, blurb: 'Surgical principles, trauma, and high-yield operative logic.' },
  { id: 'obgy', code: 'OBGY', name: 'Obstetrics & Gynaecology', year: 4, color: '#e879f9', neetWeight: 12, blurb: 'Two subjects, one specialty — pregnancy, labour, and female health.' },
  { id: 'peds', code: 'PEDS', name: 'Paediatrics', year: 4, color: '#facc15', neetWeight: 8, blurb: 'Children are not small adults — milestones, nutrition, and syndromes.' },
  { id: 'orth', code: 'ORTH', name: 'Orthopaedics', year: 4, color: '#c084fc', neetWeight: 4, blurb: 'Bones, joints, nerves — fractures and their complications.' },
  { id: 'derm', code: 'DERM', name: 'Dermatology', year: 4, color: '#fca5a5', neetWeight: 3, blurb: 'Diagnosis by sight — morphology first, therapy second.' },
  { id: 'psy', code: 'PSY', name: 'Psychiatry', year: 4, color: '#818cf8', neetWeight: 4, blurb: 'Disorders of mind and behaviour — diagnosis and psychopharmacology.' },
  { id: 'rad', code: 'RAD', name: 'Radiology', year: 4, color: '#7dd3fc', neetWeight: 3, blurb: 'Seeing the invisible — imaging patterns across all systems.' },
  { id: 'anes', code: 'ANES', name: 'Anaesthesia', year: 4, color: '#9ca3af', neetWeight: 2, blurb: 'Airway, breathing, circulation — physiology under stress.' },
]

export const topics: SeedTopic[] = [
  // Anatomy
  { id: 't-anat-heart', subjectId: 'anatomy', name: 'Heart & Coronary Circulation', system: 'cardiovascular', importance: 4, description: 'Chambers, valves, coronary arteries — the plumbing behind every MI.' },
  { id: 't-anat-femoral', subjectId: 'anatomy', name: 'Femoral Triangle', system: 'musculoskeletal', importance: 3, description: 'NAVEL boundaries, contents, catheterisation and hernia relevance.' },
  // Physiology
  { id: 't-phys-cardcycle', subjectId: 'physiology', name: 'Cardiac Cycle', system: 'cardiovascular', importance: 5, description: 'Pressure-volume dance, heart sounds, ECG correlation.' },
  { id: 't-phys-raas', subjectId: 'physiology', name: 'RAAS & Blood Pressure', system: 'renal', importance: 5, description: 'Renin-angiotensin-aldosterone — the most connected pathway in medicine.' },
  { id: 't-phys-insulin', subjectId: 'physiology', name: 'Insulin & Glucose Homeostasis', system: 'endocrine', importance: 4 },
  { id: 't-phys-thyroid', subjectId: 'physiology', name: 'Thyroid Hormone Physiology', system: 'endocrine', importance: 4 },
  { id: 't-phys-lung', subjectId: 'physiology', name: 'Pulmonary Function', system: 'respiratory', importance: 4 },
  // Biochemistry
  { id: 't-bioch-hba1c', subjectId: 'biochemistry', name: 'Glycated Haemoglobin', system: 'endocrine', importance: 4 },
  { id: 't-bioch-enzymes', subjectId: 'biochemistry', name: 'Clinical Enzymes & Markers', system: 'cardiovascular', importance: 3 },
  // Pathology
  { id: 't-patho-glomerular', subjectId: 'pathology', name: 'Glomerular Diseases', system: 'renal', importance: 5, description: 'Nephrotic vs nephritic — the classic confusion pair.' },
  { id: 't-patho-inflamm', subjectId: 'pathology', name: 'Inflammation & Repair', importance: 4 },
  { id: 't-patho-neoplasia', subjectId: 'pathology', name: 'Neoplasia', importance: 4 },
  { id: 't-patho-cvpath', subjectId: 'pathology', name: 'Cardiovascular Pathology', system: 'cardiovascular', importance: 5 },
  { id: 't-patho-hemapath', subjectId: 'pathology', name: 'Haematology', system: 'hematology', importance: 5 },
  // Pharmacology
  { id: 't-pharm-cardio', subjectId: 'pharmacology', name: 'Cardiovascular Drugs', system: 'cardiovascular', importance: 5 },
  { id: 't-pharm-antibio', subjectId: 'pharmacology', name: 'Antibiotics', system: 'infectious', importance: 5 },
  { id: 't-pharm-endo', subjectId: 'pharmacology', name: 'Endocrine Drugs', system: 'endocrine', importance: 4 },
  { id: 't-pharm-diuretics', subjectId: 'pharmacology', name: 'Diuretics', system: 'renal', importance: 4 },
  // Microbiology
  { id: 't-micro-tb', subjectId: 'microbiology', name: 'Mycobacterium tuberculosis', system: 'respiratory', importance: 5 },
  { id: 't-micro-hep', subjectId: 'microbiology', name: 'Hepatitis Viruses', system: 'gastrointestinal', importance: 4 },
  // Community Medicine
  { id: 't-cm-epi', subjectId: 'cm', name: 'Epidemiology & Biostatistics', importance: 5 },
  { id: 't-cm-vaccines', subjectId: 'cm', name: 'Immunisation & National Programs', importance: 4 },
  // Medicine
  { id: 't-med-htn', subjectId: 'medicine', name: 'Systemic Hypertension', system: 'cardiovascular', importance: 5 },
  { id: 't-med-acs', subjectId: 'medicine', name: 'Acute Coronary Syndromes', system: 'cardiovascular', importance: 5 },
  { id: 't-med-dm', subjectId: 'medicine', name: 'Diabetes Mellitus', system: 'endocrine', importance: 5 },
  { id: 't-med-thyroid', subjectId: 'medicine', name: 'Thyroid Disorders', system: 'endocrine', importance: 4 },
  { id: 't-med-aki', subjectId: 'medicine', name: 'Acute Kidney Injury', system: 'renal', importance: 5 },
  { id: 't-med-resp', subjectId: 'medicine', name: 'Obstructive Airway Disease', system: 'respiratory', importance: 4 },
  // Surgery
  { id: 't-surg-hernia', subjectId: 'surgery', name: 'Hernias', importance: 4 },
  { id: 't-surg-trauma', subjectId: 'surgery', name: 'Trauma & ATLS Principles', importance: 4 },
  // ENT / Ophtho
  { id: 't-ent-deaf', subjectId: 'ent', name: 'Hearing Loss', importance: 3 },
  { id: 't-opht-retina', subjectId: 'opht', name: 'Diabetic & Hypertensive Retinopathy', importance: 4 },
  // Peds / OBGY
  { id: 't-peds-nephro', subjectId: 'peds', name: 'Paediatric Nephrology', system: 'renal', importance: 3 },
  { id: 't-obgy-preec', subjectId: 'obgy', name: 'Hypertensive Disorders of Pregnancy', system: 'cardiovascular', importance: 5 },
  // ─── CLINICAL SUBJECT EXPANSION (surgery, OBGY, peds, orth, ENT, ophtha, psychiatry, derm) ───
  { id: 't-surg-appendix', subjectId: 'surgery', name: 'Acute Abdomen & Appendicitis', system: 'gastrointestinal', importance: 5, description: 'The classic surgical emergency — migration of pain, Alvarado scoring and its mimics.' },
  { id: 't-surg-biliary', subjectId: 'surgery', name: 'Biliary Disease', system: 'gastrointestinal', importance: 4, description: 'Murphy sign, sonographic criteria and the fat-fertile-forty narrative.' },
  { id: 't-surg-thybreast', subjectId: 'surgery', name: 'Thyroid & Breast Lumps', importance: 4, description: 'Structured lump workup — history, FNAC-first logic, red flags.' },
  { id: 't-obgy-antenatal', subjectId: 'obgy', name: 'Antenatal Care & APH', importance: 5, description: 'Painless vs painful bleeding after 20 weeks — previa and abruption.' },
  { id: 't-obgy-labour', subjectId: 'obgy', name: 'Labour Progress & PPH', importance: 5, description: 'Partograph vigilance and the four Ts of postpartum haemorrhage.' },
  { id: 't-peds-growth', subjectId: 'peds', name: 'Growth, Development & Nutrition', importance: 4, description: 'Milestones, malnutrition grading and IMNCI danger signs.' },
  { id: 't-peds-cardio', subjectId: 'peds', name: 'Paediatric Cardiology', system: 'cardiovascular', importance: 4, description: 'Cyanotic and acyanotic lesions — the tet spell is the exam classic.' },
  { id: 't-orth-fractures', subjectId: 'orth', name: 'Fractures & Complications', system: 'musculoskeletal', importance: 5, description: 'Colles to compartment syndrome — deformity, neurology and the 5 Ps.' },
  { id: 't-ent-vertigo', subjectId: 'ent', name: 'Vertigo & Otitis Media', importance: 4, description: 'Dizzy vs deaf — peripheral causes and the Dix-Hallpike pivot.' },
  { id: 't-opht-redeye', subjectId: 'opht', name: 'Red Eye & Glaucoma', importance: 4, description: 'Sight-threatening discrimination: conjunctival, corneal, uveal, pressure.' },
  { id: 't-psy-mood', subjectId: 'psy', name: 'Mood & Psychotic Disorders', importance: 4, description: 'Depressive criteria, first-rank symptoms and the safety questions.' },
  { id: 't-derm-psoriasis', subjectId: 'derm', name: 'Papulosquamous & Eczema', importance: 3, description: 'Psoriasis vs atopic dermatitis — morphology first, therapy second.' },
  { id: 't-med-shock', subjectId: 'medicine', name: 'Shock & Sepsis', system: 'cardiovascular', importance: 5, description: 'Haemodynamic profiles and the hour-1 bundle — resuscitation as a timed skill.' },
]

const T = {
  glom: 't-patho-glomerular', cvpath: 't-patho-cvpath', hema: 't-patho-hemapath',
  raas: 't-phys-raas', cardcycle: 't-phys-cardcycle', insulin: 't-phys-insulin', thyroid: 't-phys-thyroid', lung: 't-phys-lung',
  anatHeart: 't-anat-heart', femoral: 't-anat-femoral',
  hba1c: 't-bioch-hba1c', enzymes: 't-bioch-enzymes',
  pharmCardio: 't-pharm-cardio', antibio: 't-pharm-antibio', pharmEndo: 't-pharm-endo', diuretics: 't-pharm-diuretics',
  tb: 't-micro-tb', hep: 't-micro-hep',
  epi: 't-cm-epi', vaccines: 't-cm-vaccines',
  htn: 't-med-htn', acs: 't-med-acs', dm: 't-med-dm', medThyroid: 't-med-thyroid', aki: 't-med-aki', resp: 't-med-resp',
  hernia: 't-surg-hernia', trauma: 't-surg-trauma',
  deaf: 't-ent-deaf', retina: 't-opht-retina', pedsNephro: 't-peds-nephro', preec: 't-obgy-preec',
  inflamm: 't-patho-inflamm', neoplasia: 't-patho-neoplasia',
}

// Aliases for the clinical expansion topics
const T2 = {
  appendix: 't-surg-appendix', biliary: 't-surg-biliary', thyBreast: 't-surg-thybreast',
  antenatal: 't-obgy-antenatal', labour: 't-obgy-labour',
  growth: 't-peds-growth', pedsCardio: 't-peds-cardio',
  fractures: 't-orth-fractures', vertigo: 't-ent-vertigo', redEye: 't-opht-redeye',
  mood: 't-psy-mood', psoriasis: 't-derm-psoriasis', shock: 't-med-shock',
}

export const concepts: SeedConcept[] = [
  // ─── RAAS CHAIN (flagship) ───
  {
    id: 'c-raas', topicId: T.raas, name: 'Renin-Angiotensin-Aldosterone System', kind: 'physiology',
    summary: 'The hormonal axis that defends blood pressure and salt status — and the single most-drugged pathway in medicine.',
    whyMatters: 'RAAS sits at the crossroads of renal physiology, hypertension, heart failure, nephrology and pharmacology. NEET-PG tests it as mechanism questions (ACE, ARB, aldosterone antagonists) AND as clinical vignettes ( hypertensive nephropathy, HFrEF therapy). Master it once, harvest marks across 4+ subjects.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'The cascade', body: ['Juxtaglomerular cells sense ↓ renal perfusion (baroreceptor), ↓ NaCl at macula densa, or β1 sympathetic stimulation → secrete renin.', 'Renin cleaves angiotensinogen → Angiotensin I → ACE (lung endothelium) → Angiotensin II.', 'Ang II: vasoconstriction (AT1), aldosterone release → ↑Na⁺/H₂O reabsorption, ADH release, thirst, sympathetic potentiation, and cardiac/renal remodeling via AT1 receptors.'] },
      { h: 'Where drugs strike', body: ['ACE inhibitors block conversion (ramipril, enalapril) — dry cough & angioedema from bradykinin accumulation.', 'ARBs block AT1 receptor (losartan, telmisartan) — no bradykinin effect.', 'Direct renin inhibitor (aliskiren), aldosterone antagonists (spironolactone, eplerenone) act downstream.'] },
      { h: 'Clinical anchors', body: ['Bilateral renal artery stenosis: efferent tone maintains GFR — blocking RAAS precipitates AKI.', 'In HFrEF, RAAS blockade is mortality-reducing (four pillars).', 'Sarcoptes...'] },
    ],
  },
  {
    id: 'c-gfr', topicId: T.raas, name: 'GFR & Renal Autoregulation', kind: 'physiology',
    summary: 'How kidneys filter 125 mL/min and defend it against swings in pressure.',
    whyMatters: 'GFR explains creatinine (the number you will order daily), explains why ACE inhibitors protect diabetic kidneys, and why they can be dangerous in renal artery stenosis. Directly tested in Physiology, Medicine and Pharmacology.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Core idea', body: ['GFR = Kf × (P_GC − P_BS − π_GC). Autoregulation (myogenic + tubuloglomerular feedback) keeps GFR stable between MAP 80–180 mmHg.', 'Afferent constriction ↓GFR; efferent constriction ↑GFR initially — this is why Ang II maintains GFR in low-flow states.'] },
      { h: 'Clinical fingerprints', body: ['eGFR staging defines CKD (KDIGO G1–G5).', 'NSAIDs block prostaglandins → afferent constriction; ACEi/ARB block efferent → the dangerous "double hit".'] },
    ],
  },
  {
    id: 'c-htn', topicId: T.htn, name: 'Systemic Hypertension', kind: 'disease',
    summary: 'The silent pandemic: BP ≥140/90 on two occasions, primary in 90–95%.',
    whyMatters: 'Hypertension integrates RAAS physiology, renal pathology, cardiac adaptation (LVH), stroke, retinopathy and pharmacology into one disease. It is among the most frequently tested NEET-PG topics — drug choices, compelling indications and hypertensive emergencies.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Definition & classification', body: ['Office BP ≥140/90 (JNC/AHA vary: ACC-AHA ≥130/80 Stage 1). White-coat vs masked hypertension — ABPM confirms.', 'Secondary causes: renal artery stenosis, primary aldosteronism (hypokalemia + HTN), phaeochromocytoma (episodic + headache/sweating/palpitations), Cushing, OSA, coarctation.'] },
      { h: 'Target-organ damage', body: ['Heart: LVH, IHD, HF. Brain: stroke, lacunes. Kidney: nephrosclerosis. Eye: retinopathy grades I–IV (Keith-Wagener). Vessels: aortic dissection.'] },
      { h: 'Management ladder', body: ['Lifestyle first (salt <5 g, DASH, weight, exercise).', 'First-line: ACEi/ARB, CCB, thiazide-like diuretics, β-blockers (compelling indications).', 'Hypertensive emergency = severe BP + acute target-organ damage → IV agents (labetalol, nicardipine, nitroprusside); urgency without damage → oral titration.'] },
    ],
  },
  {
    id: 'c-acei', topicId: T.pharmCardio, name: 'ACE Inhibitors', kind: 'drug',
    summary: 'Block Ang-II formation: antihypertensive, cardioprotective, renoprotective — with a bradykinin price.',
    whyMatters: 'ACEi are the archetype of "physiology applied to therapy". They appear in NEET-PG via their cough/angioedema, teratogenicity, hyperkalemia, and their four life-saving roles: post-MI, HFrEF, diabetic nephropathy, hypertension.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Mechanism & effects', body: ['↓ Ang II → vasodilation, ↓ aldosterone, ↓ remodeling. ↑ bradykinin (ACE also degrades it) → dry cough (5–20%) and angioedema.', 'Also ↓ GFR efferent tone → protect glomeruli in diabetes but raise creatinine when renal perfusion depends on Ang II.'] },
      { h: 'Indications with outcome data', body: ['Post-MI (remodeling), HFrEF (mortality), diabetic nephropathy (albuminuria ↓), HTN.'] },
      { h: 'Toxicity & traps', body: ['Hyperkalemia (esp. with K-sparing diuretics/spironolactone), bilateral RAS → AKI, pregnancy → fetopathy, dry cough → switch to ARB.'] },
    ],
  },
  {
    id: 'c-betablock', topicId: T.pharmCardio, name: 'Beta-Blockers', kind: 'drug',
    summary: 'β1 blockade lowers heart rate, contractility, renin — β2 effects explain the traps.',
    whyMatters: 'The classic NEET-PG drug class: selectivity (metoprolol vs propranolol), contraindications (asthma, heart block), and the counterintuitive wins (HFrEF, post-MI, thyrotoxicosis). Repeatedly a source of "changed the answer" errors.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Classification', body: ['Non-selective: propranolol, nadolol. β1-selective (cardioselective): metoprolol, atenolol, bisoprolol, nebivolol. With α-blockade: carvedilol, labetalol.', 'ISA (intrinsic sympathomimetic activity): pindolol — less bradycardia.'] },
      { h: 'Indications', body: ['HTN, angina, post-MI, HFrEF (carvedilol/metoprolol succinate/bisoprolol — start low, go slow), SVT rate control, thyrotoxicosis symptom control, migraine/glaucoma (timolol) prophylaxis, essential tremor.'] },
      { h: 'Contraindications & traps', body: ['Asthma (β2 block → bronchospasm; cardioselective safer but still caution), 2nd/3rd degree AV block, severe bradycardia, decompensated HF (initiate only when euvolemic).', 'Avoid abrupt withdrawal → rebound tachycardia/angina (upregulation).', 'Mask hypoglycemia symptoms in diabetics except sweating.'] },
      { h: 'Overdose', body: ['Treat with glucagon (bypasses β receptor via cAMP), atropine for bradycardia.'] },
    ],
  },
  // ─── CARDIAC CYCLE / ACS CHAIN ───
  {
    id: 'c-cardcycle', topicId: T.cardcycle, name: 'Cardiac Cycle', kind: 'physiology',
    summary: 'Seven phases linking pressure, volume, valves, ECG and heart sounds into one synchronized story.',
    whyMatters: 'The cardiac cycle is the Rosetta stone of cardiology: it explains S1/S2 (valve closure), the jugular waves, the Wiggers diagram, murmur timing and the pressure-volume loop that explains preload/afterload. NEET-PG loves heart-sound timing and phase-order questions.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'The seven phases (in order)', body: ['1. Atrial systole (S4 if stiff ventricle) → 2. Isovolumetric contraction (S1: MV+TV close) → 3. Rapid ejection → 4. Reduced ejection → 5. Isovolumetric relaxation (S2: AV close) → 6. Rapid filling (S3 if volume-loaded) → 7. Diastasis.', 'ECG: P before atrial systole; QRS initiates contraction; T marks ventricular repolarization → end systole.', '"Crescendo-decrescendo ejection systolic murmur of aortic stenosis" is heard during ejection phases.'] },
      { h: 'High-yield numbers', body: ['End-diastolic volume ≈120 mL; end-systolic ≈50 mL; stroke volume ≈70 mL; ejection fraction ≈55–70%.', 'S3 = volume overload (dilated cardiomyopathy, MR); S4 = stiff ventricle (LVH, ischemia).'] },
    ],
  },
  {
    id: 'c-coronary', topicId: T.anatHeart, name: 'Coronary Arteries', kind: 'anatomy',
    summary: 'LAD supplies the anterior wall & septum; RCA the inferior; LCx the lateral.',
    whyMatters: 'Map the artery to the wall to the ECG leads to the complication — LAD occlusion → anteroseptal MI (V1–V4) with highest mortality; RCA → inferior MI (II, III, aVF) with bradyarrhythmias and RV involvement. This chain is a NEET-PG fixture.',
    difficulty: 1, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Territories', body: ['LAD: anterior wall, apical, septum (V1–V4). LCx: lateral (I, aVL, V5–V6). RCA: inferior (II, III, aVF), posterior, SA/AV nodal supply in ~85%.'] },
      { h: 'Dominance', body: ['Right-dominant in ~85% (posterior descending from RCA).'] },
    ],
  },
  {
    id: 'c-ami', topicId: T.acs, name: 'Acute Myocardial Infarction', kind: 'disease',
    summary: 'Plaque rupture → thrombotic occlusion → myocyte necrosis. Time is muscle.',
    whyMatters: 'The quintessential integrated question: atherosclerosis (pathology) → chest pain (medicine) → ECG changes (investigation) → troponin (biochemistry) → reperfusion (pharmacology/intervention). Among the top 5 NEET-PG disease topics.',
    difficulty: 3, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Pathophysiology', body: ['Vulnerable plaque (thin fibrous cap) ruptures → platelet-rich thrombus. Complete occlusion → STEMI; subtotal → NSTEMI/unstable angina.', 'Ischemia <20 min → reversible; then coagulative necrosis, neutrophilic infiltrate by day 1.'] },
      { h: 'Diagnosis', body: ['ST-elevation in contiguous leads; reciprocal depression. Troponin I/T rises 3–4 h, peaks 24–48 h, stays 7–10 days; CK-MB for reinfarction timing.', 'New LBBB + symptoms treated as STEMI; posterior MI: ST depression V1–V3 + ST elevation V7–V9.'] },
      { h: 'Management', body: ['MONA refreshed: Aspirin 300 mg chewed, P2Y12 inhibitor (ticagrelor/clopidogrel), anticoagulation; primary PCI within 90 min (door-to-balloon); if unavailable → fibrinolysis within 30 min (streptokinase/tenecteplase) then transfer.', 'Morphine for refractory pain, oxygen only if SpO2 <90%.'] },
      { h: 'Complications by timeline', body: ['<24 h: arrhythmia (VF), papillary muscle rupture (3–7 d, acute MR), ventricular free-wall rupture (5–10 d → tamponade), ventricular septal rupture (3–7 d, L→R shunt, pansystolic murmur + thrill).', 'Later: aneurysm (persistent ST elevation), Dressler syndrome (autoimmune pericarditis, weeks), mural thrombus → embolic stroke.'] },
    ],
  },
  {
    id: 'c-troponin', topicId: T.enzymes, name: 'Cardiac Biomarkers', kind: 'investigation',
    summary: 'Troponin = most sensitive & specific; CK-MB = reinfarction window; LDH = historical.',
    whyMatters: 'Biomarker timing questions are NEET-PG staples: when does troponin rise, which marker detects reinfarction on day 3 (CK-MB), and the pattern in unstable angina (normal troponin).',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'The panel', body: ['Troponin I/T: ↑ in 3–4 h, peak 24–48 h, elevated 7–14 days. CK-MB: ↑ 4–6 h, peak 18–24 h, normal by 48–72 h → best for reinfarction.', 'Myoglobin earliest but nonspecific. BNP/NT-proBNP → heart failure, not MI.'] },
    ],
  },
  {
    id: 'c-ecg', topicId: T.acs, name: 'ECG Basics & Ischemia Patterns', kind: 'investigation',
    summary: 'P-QRS-T rhythm code; ST elevation = transmural ischemia; reciprocal depression seals MI.',
    whyMatters: 'ECG interpretation is a skill tested in every NEET-PG paper and needed on day 1 of internship. Learn one systematic reading algorithm and the five killer patterns (STEMI, NSTEMI, hyperkalemia, complete heart block, VT).',
    difficulty: 3, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Systematic read', body: ['Rate → rhythm (P before every QRS?) → axis → intervals (PR 0.12–0.20 s, QRS <0.12 s, QTc <440 ms men) → morphology → ST/T.', 'Intervals: PR long = AV block; QRS wide = bundle branch block; QTc long (congenital, drugs — macrolides, antipsychotics) → torsades.'] },
      { h: 'Patterns to never miss', body: ['STEMI: ST elevation ≥1 mm in 2 contiguous limb leads / ≥2 mm precordial + reciprocal depression.', 'Hyperkalemia: tall peaked T → wide QRS → sine wave. Digoxin: scooped ST depression.', 'Pericarditis: diffuse concave ST elevation + PR depression; MI: localized + reciprocal.'] },
    ],
  },
  {
    id: 'c-antiplatelet', topicId: T.pharmCardio, name: 'Antiplatelet Agents', kind: 'drug',
    summary: 'Aspirin (COX-1), clopidogrel/ticagrelor (P2Y12), abciximab (GPIIb/IIIa) — platelets by stage.',
    whyMatters: 'Mechanism-order questions (COX-1 → ADP → GPIIb/IIIa) and combined-therapy scenarios (DAPT duration post-stent) make antiplatelets a reliable NEET-PG topic.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Mechanisms by stage', body: ['Aspirin: irreversible COX-1 block → ↓TXA2 (lasts platelet lifespan 7–10 d).', 'Thienopyridines: clopidogrel/prasugrel → P2Y12 (ADP receptor). Ticagrelor: reversible, direct P2Y12.', 'GPIIb/IIIa blockers (abciximab, eptifibatide): final common pathway.', 'Dipyridamole: ↑cAMP, phosphodiesterase inhibition.'] },
      { h: 'Traps', body: ['Aspirin asthma (LO shunting), Reye syndrome in children, GI bleeding — PPI co-prescription.', 'Clopidogrel + PPI (omeprazole CYP2C19 inhibition) → reduced activation; use pantoprazole.'] },
    ],
  },
  // ─── NEPHROTIC / NEPHRITIC (flagship confusion) ───
  {
    id: 'c-nephrotic', topicId: T.glom, name: 'Nephrotic Syndrome', kind: 'disease',
    summary: 'Heavy proteinuria (>3.5 g/day) → hypoalbuminemia → edema + hyperlipidemia.',
    whyMatters: 'The most-tested renal pathology topic. It connects glomerular anatomy (podocyte), oncotic pressure physiology, lipid metabolism, hypercoagulability (renal vein thrombosis) and steroid therapy. NEET-PG asks etiology by age, complications and the pediatric MCD story.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Pathophysiology', body: ['Podocyte/GBM injury → charge & size barrier lost → albumin leaks. ↓Oncotic pressure → periorbital edema (children) → generalized anasarca. Liver responds with lipoproteins → hyperlipidemia + lipiduria (fatty/oval fat casts, Maltese cross).', 'Loss of antithrombin III + hypercoagulability → renal vein thrombosis; loss of immunoglobulins → infection risk (pneumococcal peritonitis).'] },
      { h: 'Etiology by age', body: ['Children 2–12: minimal change disease (steroid-responsive).', 'Adults: focal segmental glomerulosclerosis (Black patients, HIV, heroin, obesity), membranous (tumors, HBV, NSAIDs, PLA2R antibodies — most common in White adults), membranoproliferative, diabetic nephropathy (most common overall in clinical practice).'] },
      { h: 'Diagnosis', body: ['Urine protein:creatinine ratio / 24 h protein >3.5 g; bland sediment (few cells/casts); hypoalbumin <2.5, lipids ↑; renal biopsy if adult or steroid-resistant.'] },
      { h: 'Management', body: ['Salt restriction, fluid, steroids (MCD: prednisolone 4–6 weeks), ACEi/ARB for proteinuria reduction, statins, VTE prophylaxis if albumin <2 g/dL.', 'Complications: infection (encapsulated organisms), thromboembolism, hypovolemia → AKI, protein malnutrition.'] },
    ],
  },
  {
    id: 'c-nephritic', topicId: T.glom, name: 'Nephritic Syndrome', kind: 'disease',
    summary: 'Inflammatory glomerulonephritis: hematuria + RBC casts + hypertension + oliguria + mild proteinuria.',
    whyMatters: 'Pairs with nephrotic syndrome as the #1 renal confusion. The subtype-by-antibody pattern (anti-GBM linear, immune complex granular, pauci-immune ANCA) is a repeatedly asked discriminator.',
    difficulty: 3, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Presentation', body: ['Post-infectious GN (children, 1–3 weeks after strep pharyngitis/impetigo, ↓C3, ASO ↑): cola-colored urine, facial edema, hypertension.', 'IgA nephropathy: hematuria 1–2 days after URTI (synpharyngitic) — most common chronic GN worldwide.', 'Rapidly progressive GN: crescents, rapid ↓GFR over weeks.'] },
      { h: 'RPGN immunofluorescence triad', body: ['Linear IgG along GBM = anti-GBM (Goodpasture — pulmonary hemorrhage + GN).', 'Granular deposits = immune complex (post-strep, lupus, IgA).', 'Pauci-immune = ANCA (granulomatosis with polyangiitis, microscopic polyangiitis).'] },
      { h: 'Treatment', body: ['Post-infectious: supportive (fluid/salt, diuretics, BP).', 'RPGN: pulse methylprednisolone + cyclophosphamide; plasma exchange for anti-GBM.'] },
    ],
  },
  {
    id: 'c-aki', topicId: T.aki, name: 'Acute Kidney Injury', kind: 'disease',
    summary: 'Abrupt ↓GFR/↑creatinine — prerenal (most common), intrinsic, postrenal. BUN:Cr differentiates.',
    whyMatters: 'AKI is a daily internship reality and a NEET-PG favorite: the FENa/BUN-Cr ratio tables, contrast nephropathy, and rhabdomyolysis all funnel here. Links GFR physiology, diuretics, and nephrotoxic drug lists.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Classification & indices', body: ['Prerenal: hypovolemia/HF/cirrhosis — urine Na <20, FENa <1%, BUN:Cr >20:1, concentrated urine (>500 mOsm).', 'ATN (ischemic/toxic — contrast, aminoglycosides, myoglobin): FENa >2%, BUN:Cr 10–15:1, muddy brown casts.', 'Interstitial nephritis: WBC casts, drug allergy (PPIs, NSAIDs, antibiotics) with eosinophiluria.', 'Postrenal: obstruction — hydronephrosis on USG; BPH, stones, cervical cancer.'] },
      { h: 'Management principles', body: ['Volume assessment first; treat cause; avoid nephrotoxins, adjust drug doses; dialysis indications — AEIOU (Acidosis, Electrolyte (refractory hyperK), Intoxication, Overload, Uremia).'] },
    ],
  },
  {
    id: 'c-diuretics', topicId: T.diuretics, name: 'Diuretics', kind: 'drug',
    summary: 'Loop > thiazide > K-sparing by potency; sites explain effects and toxicities.',
    whyMatters: 'Diuretics are applied nephron anatomy. Site → transporter → electrolyte effect → side effect chains are classic NEET-PG questions (loop = hypocalcemia, thiazide = hypercalcemia/hypokalemia, spironolactone = hyperkalemia + gynecomastia).',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'By nephron site', body: ['Loop (furosemide): NKCC2 in TAL — strongest; hypokalemia, hypomagnesemia, metabolic alkalosis, hypocalcemia, ototoxicity.', 'Thiazide (HCTZ): NCC in DCT — hypertension first-line, hypercalcemia-preserving (useful in stones/osteoporosis), hypokalemia, hyponatremia, hyperuricemia, hyperglycemia.', 'K-sparing: spironolactone (aldosterone antagonist — hyperkalemia, gynecomastia), amiloride (ENaC).', 'Osmotic (mannitol): proximal reabsorption — cerebral edema, contraindicated in anuria.', 'Acetazolamide: carbonic anhydrase — metabolic acidosis, glaucoma, altitude sickness.'] },
    ],
  },
  // ─── ENDOCRINE CHAIN ───
  {
    id: 'c-insulin', topicId: T.insulin, name: 'Insulin & Glucose Homeostasis', kind: 'physiology',
    summary: 'The anabolic switch: GLUT4 translocation, glycogenesis, lipogenesis — and its counter-regulators.',
    whyMatters: 'Before DKA and metformin make sense, insulin physiology must. Explains type 1 vs type 2, hypoglycemia symptoms (neuroglycopenia vs adrenergic), and why potassium shifts with insulin in emergency treatment.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Actions', body: ['β-cells (glucose >90 mg/dL → insulin). Insulin: GLUT4 into muscle/fat (GLUT2 liver/β-cell independent), glycogen synthesis, lipogenesis, protein anabolism, K⁺ into cells (Na/K-ATPase).', 'Counter-regulatory: glucagon, cortisol, GH, adrenaline.'] },
      { h: 'Clinical hooks', body: ['Insulin + glucose treats hyperkalemia (shifts K⁺ intracellularly).', 'Sulfonylurea vs insulin hypoglycemia: C-peptide distinguishes exogenous (↓C-peptide) from endogenous (↑).'] },
    ],
  },
  {
    id: 'c-dm', topicId: T.dm, name: 'Diabetes Mellitus (T1 vs T2)', kind: 'disease',
    summary: 'Autoimmune absolute deficiency vs insulin resistance with relative deficiency.',
    whyMatters: 'DM threads biochemistry (HbA1c), pathology (micro/macrovascular), pharmacology (metformin→SGLT2→GLP-1), ophthalmology (retinopathy), nephrology (nephropathy) and community medicine (prevalence). The single most connected disease in the app.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Discriminators', body: ['T1DM: young, lean, autoimmune (GAD-65, IA-2 antibodies), ketosis-prone, absolute insulin lack.', 'T2DM: older (now younger), obese, strong heredity, metabolic syndrome, insulin resistance + progressive β-cell failure.', 'Diagnosis: FPG ≥126, 2h OGTT ≥200, HbA1c ≥6.5%, or random ≥200 with symptoms.'] },
      { h: 'Complications', body: ['Micro: retinopathy (leading cause of blindness 20–74 y), nephropathy (leading cause of ESRD), neuropathy (distal symmetrical, autonomic).', 'Macro: IHD/stroke/PAD. Infections: mucormycosis, malignant otitis externa, emphysematous pyelonephritis.', 'Emergencies: DKA (T1, acidosis), HHS (T2, osmotic diuresis, glucose usually >600).'] },
    ],
  },
  {
    id: 'c-dka', topicId: T.dm, name: 'Diabetic Ketoacidosis', kind: 'disease',
    summary: 'Insulin lack + stress hormones → ketogenesis, anion-gap acidosis, dehydration.',
    whyMatters: 'A prototypical emergency vignette: recognize the triad (hyperglycemia + ketosis + acidosis), compute the anion gap, and sequence fluids→insulin→potassium. Errors in sequencing are life-threatening in reality and easy marks in exams.',
    difficulty: 3, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Recognition', body: ['Nausea/vomiting, abdominal pain (pseudoperitonitis), Kussmaul breathing, fruity breath, dehydration.', 'Labs: glucose 300–600, low pH <7.3, low bicarb, ketonemia/ketonuria, anion gap >12, total-body potassium DEPLETED despite serum normal/high.'] },
      { h: 'Management sequence', body: ['1. IV isotonic saline (1–1.5 L first hour). 2. Regular insulin 0.1 U/kg IV bolus then 0.1 U/kg/h infusion (target glucose fall ~50–75 mg/dL/h). 3. Add K⁺ once K <5.2 and urine flows — insulin drives K⁺ into cells. 4. Bicarb only if pH <6.9. 5. Glucose reaches 200–250 → add dextrose, continue insulin until gap closes.', 'Pitfalls: cerebral edema in children (rapid osmotic shifts), hypoglycemia from stopping insulin before gap closure.'] },
    ],
  },
  {
    id: 'c-metformin', topicId: T.pharmEndo, name: 'Metformin', kind: 'drug',
    summary: 'Biguanide: ↓hepatic gluconeogenesis via AMPK; first-line T2DM; the lactic acidosis fear.',
    whyMatters: 'The most prescribed oral antidiabetic worldwide and a NEET-PG mechanism favourite — its insulin-independent action, weight neutrality, PCOS use, and contraindications (eGFR <30, contrast, severe hypoxia).',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Mechanism', body: ['Activates AMPK → ↓hepatic gluconeogenesis, ↑peripheral glucose uptake; does NOT cause hypoglycemia alone; weight-neutral/loss.', 'GI upset common (take with food); B12 deficiency with long-term use.'] },
      { h: 'Cautions', body: ['eGFR <30 contraindicated (lactic acidosis risk); hold for iodinated contrast if unstable renal function; avoid in DKA/HHS as monotherapy.', 'Newer agents in NEET-PG: SGLT2 inhibitors (empagliflozin — CV benefit, genital mycoses, euglycemic DKA), GLP-1 agonists (liraglutide — weight loss, nausea), DPP-4 inhibitors (sitagliptin — weight neutral).'] },
    ],
  },
  {
    id: 'c-thyroidphys', topicId: T.thyroid, name: 'Thyroid Hormone Synthesis & Action', kind: 'physiology',
    summary: 'Iodide trapping → thyroglobulin iodination (TPO) → T3/T4 → TBG transport → nuclear action.',
    whyMatters: 'Every thyroid pharmacology and disease question stands on this: Wolff-Chaikoff vs Jod-Basedow, thionamide block of TPO, thyroid storm management, and the TSH-based diagnosis algorithm.',
    difficulty: 3, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'The pathway', body: ['TSH → NIS (iodide trapping) → TPO organification (MIT/DIT) → coupling (T3 = MIT+DIT, T4 = DIT+DIT) → proteolysis on TSH stimulation.', 'T4 is the prohormone (90%); T3 is 4× more active; peripheral 5′-deiodinase converts; propylthiouracil also blocks conversion (pregnancy choice).'] },
      { h: 'High-yield facts', body: ['Wolff-Chaikoff: high iodine transiently ↓ synthesis; Jod-Basedow: hyperthyroidism after iodine load in autonomous tissue.', 'Best single test: TSH. Pregnancy: ↑TBG → total T4 ↑, free T4 normal.'] },
    ],
  },
  {
    id: 'c-graves', topicId: T.medThyroid, name: 'Graves Disease', kind: 'disease',
    summary: 'TSH-receptor stimulating immunoglobulins → diffuse goiter, ophthalmopathy, dermopathy.',
    whyMatters: 'The classic hyperthyroid vignette: vs toxic multinodular goiter (hot spots, no eye disease) vs thyroiditis (low uptake) vs exogenous hormones. Radioiodine uptake scan interpretation is a guaranteed NEET-PG question family.',
    difficulty: 3, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Recognition', body: ['Diffuse nontender goiter with bruit, exophthalmos (TSH-R Ab on retro-orbital fibroblasts), pretibial myxedema, thyroid acropachy.', 'Labs: ↓TSH, ↑free T4/T3; uptake scan: diffuse high uptake (vs low in thyroiditis/exogenous).'] },
      { h: 'Management', body: ['Symptom control: propranolol (blocks adrenergic symptoms; inhibits peripheral conversion at high dose).', 'Definitive: thionamides (methimazole except first trimester; PTU pregnancy/liver caution), radioiodine (contraindicated in pregnancy, may worsen ophthalmopathy), subtotal thyroidectomy (euthyroid prep).', 'Storm: propranolol + PTU + iodine (1 h after PTU) + steroids + cooling.'] },
    ],
  },
  // ─── RESPIRATORY ───
  {
    id: 'c-spirometry', topicId: T.lung, name: 'Spirometry & PFTs', kind: 'investigation',
    summary: 'Obstructive = FEV1/FVC <0.7 with ↓FEV1; restrictive = normal ratio, ↓FVC (both fall).',
    whyMatters: 'One number (FEV1/FVC) splits lung disease into two families — asthma/COPD vs fibrosis. Reversibility and DLCO complete the discrimination table asked constantly in NEET-PG.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'The table that pays', body: ['Obstructive (asthma, COPD, bronchiectasis): FEV1↓↓, FVC normal/↓, ratio <0.7; DLCO ↓ in emphysema, ↑ in asthma (during attack).', 'Restrictive (IPF, sarcoid, chest wall, neuromuscular): both ↓, ratio normal/↑; DLCO ↓ in IPF.', 'TLC: ↑ emphysema, ↓ fibrosis.'] },
    ],
  },
  {
    id: 'c-asthma-copd', topicId: T.resp, name: 'Asthma vs COPD', kind: 'disease',
    summary: 'Reversible, variable, eosinophilic, young vs fixed, progressive, neutrophilic, smoker.',
    whyMatters: 'Inhaler selection, classification of severity (GINA/GOLD), and acute exacerbation management are all based on this discrimination. The asthma-drug ladder (SABA→ICS→LABA/ICS→...) is a guaranteed question.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Discrimination', body: ['Asthma: onset <40 (often childhood), atopy, diurnal variation, reversibility >12% & 200 mL post-bronchodilator, airway remodeling with time.', 'COPD: smoking/biomass exposure, slowly progressive, partial reversibility, emphysema (↓DLCO) or chronic bronchitis phenotype.'] },
      { h: 'Asthma step therapy (GINA)', body: ['Step 1: SABA as needed. Step 2: low-dose ICS. Step 3: ICS+LABA. Step 4: medium/high-dose ICS+LABA. Step 5: add-on (tiotropium, omalizumab for allergic, oral steroids).', 'Never LABA monotherapy in asthma (mortality). Status asthmaticus: O2, nebulized salbutamol+ipratropium, systemic steroids, magnesium sulfate if severe.'] },
    ],
  },
  {
    id: 'c-tb', topicId: T.tb, name: 'Tuberculosis', kind: 'disease',
    summary: 'Airborne Mycobacterium tuberculosis: Ghon focus, caseation, PPD/IGRA, DOTS.',
    whyMatters: "India's defining public-health disease — microbiology, community medicine (NTEP), medicine, and pediatrics all examine it: drug regimens and their toxicities (ethambutol eye, isoniazid neuropathy/B6, rifampin orange secretions).",
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Key concepts', body: ['Primary complex (Ghon focus + hilar nodes); post-primary reactivation → apical cavitation (high O2).', 'Diagnosis: sputum AFB ×2, CBNAAT/GeneXpert (detects rifampin resistance) — first-line in NTEP.', 'Latent vs active: PPD ≥10 mm (5 in HIV/contact), IGRA unaffected by BCG.'] },
      { h: 'Treatment (NTEP regimens)', body: ['2HRZE + 4H3R3 (intensive 2 months daily HRZE, continuation phase). MDR/RR-TB: shorter oral regimen with bedaquiline.', 'Drug toxicities: isoniazid — peripheral neuropathy (prophylactic B6), hepatotoxicity; rifampin — orange body fluids, enzyme inducer (OCP failure); pyrazinamide — hyperuricemia/hepatotoxic; ethambutol — retrobulbar optic neuritis (red-green).', 'Meningitis: extends to 12 months, steroids added.'] },
    ],
  },
  // ─── HEMATOLOGY ───
  {
    id: 'c-idacda', topicId: T.hema, name: 'Iron Deficiency vs Anemia of Chronic Disease', kind: 'disease',
    summary: 'Microcytic twins: ferritin low vs high, TIBC high vs low — the classic lab-table question.',
    whyMatters: 'The most repeated hematology MCQ pattern. Ferritin is an acute-phase reactant — in inflammation, a "normal" ferritin can mask iron deficiency; a combined picture (thalassemia trait) completes the trio.',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Discriminators', body: ['IDA: ↓ferritin, ↑TIBC, ↓serum iron, ↑transferrin saturation low. ACD: ferritin normal/↑, TIBC ↓, iron ↓, marrow iron stores present.', 'Thalassemia trait: microcytosis disproportionate to anemia (Mentzer index <13), normal iron studies, target cells.'] },
    ],
  },
  {
    id: 'c-leukemia', topicId: T.hema, name: 'Acute Leukemias (ALL vs AML)', kind: 'disease',
    summary: 'Blasts crowd the marrow: age, Auer rods, PAS block, and cytogenetics decide prognosis.',
    whyMatters: 'Auer rods (AML), PAS positivity (ALL), t(15;17) APL + DIC → all-trans retinoic acid cure, and the childhood ALL story remain among the most reliably repeated NEET-PG pathology questions.',
    difficulty: 3, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Discriminators', body: ['ALL: children, lymphoblasts, PAS+ blocks, TdT+, CALLA (CD10); t(12;21) good, t(9;22) Ph+ poor; CNS prophylaxis essential.', 'AML: adults, myeloblasts, Auer rods (M3 classic), MPO+; t(15;17) APL → ATRA + arsenic; DIC complicates APL.', 'Tumor lysis syndrome with treatment: ↑uric acid, K, phosphate; ↓calcium — hydration, allopurinol/rasburicase.'] },
    ],
  },
  // ─── GI / MICRO / CM ───
  {
    id: 'c-hpylori', topicId: T.hep, name: 'Helicobacter pylori', kind: 'microbiology',
    summary: 'Urease-positive curved gram-negative rod linking peptic ulcer, gastritis, MALT lymphoma.',
    whyMatters: 'Explains why duodenal ulcers recur, why NSAID ulcers need testing, and the triple/quadruple regimens — plus urea breath test vs stool antigen vs rapid urease test discrimination (all NEET-PG regulars).',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Facts', body: ['Produces urease → ammonia cloud (rapid urease test); urea breath test = best non-invasive, also checks eradication (stool antigen equally good).', 'Serology can\'t distinguish past infection.', 'Regimen: PPI + clarithromycin + amoxicillin ×14 d (bismuth quadruple if resistance); stop PPI/bismuth 2 weeks, antibiotics 4 weeks before retesting.'] },
    ],
  },
  {
    id: 'c-epidesign', topicId: T.epi, name: 'Study Designs & Biostatistics', kind: 'concept',
    summary: 'Case-control (odds ratio) vs cohort (relative risk) vs RCT (gold standard); sensitivity/specificity.',
    whyMatters: 'Community Medicine\'s highest-yield zone: every exam has OR/RR calculation, screening-test 2×2 arithmetic, and bias identification. Pure marks with the right mental model.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 3,
    detail: [
      { h: 'Design ladder', body: ['Case-control: retrospective, rare diseases, odds ratio. Cohort: prospective, incidence, relative risk. RCT: randomization kills confounding; blinding kills bias. Meta-analysis top of hierarchy.', 'Cross-sectional = prevalence snapshot.'] },
      { h: 'Screening arithmetic', body: ['Sensitivity = a/(a+c) — true positives caught; Specificity = d/(b+d). PPV rises with prevalence — a favorite twist.', 'Bias: selection, recall (case-control), Berkson, lead-time, publication.'] },
    ],
  },
  {
    id: 'c-vaccines', topicId: T.vaccines, name: 'Universal Immunisation Programme', kind: 'concept',
    summary: 'BCG day-1 to JE — the Indian UIP schedule at a glance.',
    whyMatters: 'Guaranteed marks in CM and Pediatrics: which vaccines are live (BCG, OPV, MR, JE), which are killed (DPT, IPV, HepB, Pentavalent), and the catch-up rules.',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Schedule anchors', body: ['Birth: BCG + OPV-0 + HepB. 6/10/14 weeks: Pentavalent (DPT+HepB+Hib) + OPV + IPV + rotavirus + fIPV. 9–12 months: MR-1, JE, Vitamin A. 16–24 months: MR-2, DPT-booster, JE-2.', 'Live vaccines: BCG, OPV, MR/MMR, varicella, yellow fever, JE (SA-14-14-2 live attenuated).'] },
    ],
  },
  // ─── ANATOMY / SURGERY / OTHERS ───
  {
    id: 'c-femoral', topicId: T.femoral, name: 'Femoral Triangle', kind: 'anatomy',
    summary: 'Inguinal ligament, sartorius, adductor longus — NAVEL from lateral to medial.',
    whyMatters: 'A perfect example of anatomy→clinical chains: femoral pulse palpation, central venous catheterisation (below inguinal ligament), femoral hernia (medial to vein, below ligament) and vascular access complications.',
    difficulty: 1, examRelevance: 3, clinicalRelevance: 4,
    detail: [
      { h: 'Contents', body: ['Lateral→medial: Nerve, Artery, Vein, Empty space (lymphatics), Lymph nodes (also mnemonic NAVY-L).', 'Femoral sheath encloses artery & vein but NOT the nerve.', 'Femoral hernia: passes medial to femoral vein through femoral canal — common in females, high strangulation risk.'] },
    ],
  },
  {
    id: 'c-hernia', topicId: T.hernia, name: 'Inguinal Hernia', kind: 'disease',
    summary: 'Indirect (lateral to inferior epigastric, into scrotum) vs direct (Hesselbach triangle).',
    whyMatters: 'The highest-yield surgical anatomy question family: the inferior epigastric vessels as the dividing landmark, incarceration/strangulation management, and hernia repair principles (Lichtenstein mesh).',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Discriminators', body: ['Indirect: congenital patent processus vaginalis, lateral to IE vessels, can descend into scrotum, all ages.', 'Direct: acquired weakness, medial to IE vessels, rarely scrotal, older men.', 'Strangulation: blood supply cut → emergency; never attempt forceful reduction (reduction en masse).'] },
    ],
  },
  {
    id: 'c-preec', topicId: T.preec, name: 'Preeclampsia & Eclampsia', kind: 'disease',
    summary: 'New-onset hypertension + proteinuria after 20 weeks; seizures = eclampsia; MgSO4 saves.',
    whyMatters: 'OBG\'s most-tested disorder with medicine overlaps (HELLP, eclampsia vs epilepsy) and pharmacology (MgSO4 regimen, labetalol vs methyldopa vs ACEi-in-pregnancy trap).',
    difficulty: 3, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Definition & features', body: ['≥140/90 after 20 wks + proteinuria (>300 mg/24 h) or end-organ signs; severe features: BP ≥160/110, platelets <100k, ↑creatinine, ↑LFT, pulmonary edema, headache/visual symptoms.', 'HELLP: hemolysis, ↑liver enzymes, low platelets — may lack classic BP.'] },
      { h: 'Management', body: ['Definitive = delivery (timing by severity/gestational age; corticosteroids for lung maturity 24–34 wks).', 'Seizure prevention/treatment: MgSO4 (Pritchard/Deland regimens) — monitor reflexes, respiration, urine output; antidote calcium gluconate.', 'Antihypertensives in pregnancy: labetalol, methyldopa, nifedipine. NEVER ACEi/ARB (fetal renal failure).'] },
    ],
  },
  {
    id: 'c-diabretino', topicId: T.retina, name: 'Diabetic Retinopathy', kind: 'disease',
    summary: 'Microaneurysms → hemorrhages → neovascularization; NPDR vs PDR decides laser.',
    whyMatters: 'Connects medicine (DM control = HbA1c), ophthalmology (grading + treatment thresholds), and pharmacology (anti-VEGF). The question hook: treatment for macular edema vs PDR.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Grading & treatment', body: ['NPDR: microaneurysms (earliest), dot-blot hemorrhages, hard exudates, cotton-wool spots.', 'PDR: neovascularization (VEGF-driven) → vitreous hemorrhage, tractional detachment. Treatment: panretinal photocoagulation; anti-VEGF for macular edema.', 'Screening: first exam at diagnosis (T2) / 5 years after onset (T1), then annually.'] },
    ],
  },
  // ─── LIGHT WEIGHT TOPICS (skeleton coverage) ───
  { id: 'c-inflamm', topicId: T.inflamm, name: 'Acute Inflammation', kind: 'pathology', summary: 'Vascular + cellular response; mediators; outcomes.', whyMatters: 'Foundation for every disease you will study — mediators (histamine, bradykinin, complement), exudates, and outcomes (resolution, abscess, chronicity).', difficulty: 1, examRelevance: 4, clinicalRelevance: 3,
    detail: [{ h: 'Sequence', body: ['Transient vasoconstriction → vasodilation (histamine, NO) → ↑permeability → stasis → margination (selectins), adhesion (integrins), transmigration (CD31) → chemotaxis → phagocytosis (opsonins C3b, IgG).', 'Outcomes: resolution, abscess, chronic inflammation, lymphangitis.'] }] },
  { id: 'c-neoplasia', topicId: T.neoplasia, name: 'Neoplasia: Hallmarks & Spread', kind: 'pathology', summary: 'Benign vs malignant, metastasis routes, oncogenes vs tumor suppressors.', whyMatters: 'Cancer pharmacology, staging, tumor markers all reduce to these fundamentals; highly examined.', difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [{ h: 'Core', body: ['Metastasis: lymphatic (carcinomas), hematogenous (sarcomas, RCC/HCC → renal vein), transcoelomic (ovarian).', 'Oncogenes (gain of function): RAS, MYC, HER2, BCR-ABL. Tumor suppressors (loss): p53, RB, BRCA1/2, APC.', 'Markers: AFP (HCC), CEA (colon), CA-125 (ovary), PSA (prostate), β-hCG (chorio).'] }] },
  { id: 'c-cushing', topicId: T.medThyroid, name: 'Cushing Disease vs Syndrome', kind: 'disease', summary: 'Pituitary adenoma (disease) vs ectopic/adrenal (syndrome) — DX by ACTH & dexamethasone.', whyMatters: 'The endocrine algorithm question: high-dose vs low-dose dexamethasone suppression and ACTH levels localize the source.', difficulty: 3, examRelevance: 4, clinicalRelevance: 4,
    detail: [{ h: 'Algorithm', body: ['Screen: overnight 1 mg dexamethasone, 24 h urinary free cortisol, midnight salivary cortisol.', 'ACTH high → pituitary (Cushing disease — suppresses with high-dose dex) vs ectopic (never suppresses). ACTH low → adrenal adenoma/carcinoma.'] }] },
]

// Graph edges — the connective tissue of the product
export const edges: SeedEdge[] = [
  // RAAS chain
  { from: 'c-gfr', to: 'c-raas', type: 'prerequisite_of', label: 'autoregulation context' },
  { from: 'c-raas', to: 'c-htn', type: 'causes', label: 'RAAS-driven HTN' },
  { from: 'c-raas', to: 'c-acei', type: 'mechanism_of', label: 'drug target' },
  { from: 'c-acei', to: 'c-htn', type: 'treated_by', label: 'first-line' },
  { from: 'c-acei', to: 'c-aki', type: 'causes', label: 'bilateral RAS trap' },
  { from: 'c-diuretics', to: 'c-htn', type: 'treated_by', label: 'first-line' },
  { from: 'c-diuretics', to: 'c-nephrotic', type: 'treated_by', label: 'edema control' },
  // Cardiac chain
  { from: 'c-cardcycle', to: 'c-ecg', type: 'related_to', label: 'electrical ↔ mechanical' },
  { from: 'c-coronary', to: 'c-ami', type: 'prerequisite_of', label: 'territory mapping' },
  { from: 'c-ami', to: 'c-ecg', type: 'diagnosed_by' },
  { from: 'c-ami', to: 'c-troponin', type: 'diagnosed_by' },
  { from: 'c-troponin', to: 'c-enzymes-none', type: 'related_to' }, // will be ignored gracefully
  { from: 'c-htn', to: 'c-ami', type: 'causes', label: 'risk factor' },
  { from: 'c-htn', to: 'c-heartfail', type: 'causes' },
  { from: 'c-ami', to: 'c-heartfail', type: 'causes' },
  { from: 'c-betablock', to: 'c-ami', type: 'treated_by' },
  { from: 'c-betablock', to: 'c-htn', type: 'treated_by' },
  { from: 'c-betablock', to: 'c-graves', type: 'treated_by', label: 'symptom control' },
  { from: 'c-antiplatelet', to: 'c-ami', type: 'treated_by' },
  { from: 'c-ecg', to: 'c-hyperk', type: 'diagnosed_by', label: 'peaked T waves' },
  { from: 'c-acei', to: 'c-hyperk', type: 'causes' },
  { from: 'c-htn', to: 'c-diabretino', type: 'causes', label: 'hypertensive retinopathy' },
  { from: 'c-htn', to: 'c-preec', type: 'related_to', label: 'pregnancy overlap' },
  { from: 'c-htn', to: 'c-nephritic', type: 'causes', label: 'nephrosclerosis' },
  { from: 'c-femoral', to: 'c-hernia', type: 'related_to', label: 'femoral hernia site' },
  // Renal
  { from: 'c-nephrotic', to: 'c-nephritic', type: 'differential_of', label: 'THE classic pair' },
  { from: 'c-gfr', to: 'c-aki', type: 'prerequisite_of' },
  { from: 'c-aki', to: 'c-hyperk', type: 'causes' },
  { from: 'c-nephrotic', to: 'c-aki', type: 'causes', label: 'hypovolemia' },
  { from: 'c-insulin', to: 'c-hyperk', type: 'treated_by', label: 'K shift' },
  // Endocrine
  { from: 'c-insulin', to: 'c-dm', type: 'prerequisite_of' },
  { from: 'c-dm', to: 'c-dka', type: 'complication_of' },
  { from: 'c-dm', to: 'c-hba1c', type: 'diagnosed_by' },
  { from: 'c-dm', to: 'c-metformin', type: 'treated_by' },
  { from: 'c-dm', to: 'c-diabretino', type: 'causes' },
  { from: 'c-dm', to: 'c-nephrotic', type: 'causes', label: 'diabetic nephropathy' },
  { from: 'c-thyroidphys', to: 'c-graves', type: 'prerequisite_of' },
  { from: 'c-betablock', to: 'c-thyroidstorm', type: 'treated_by' },
  { from: 'c-graves', to: 'c-thyroidstorm', type: 'causes' },
  { from: 'c-cushing', to: 'c-htn', type: 'causes', label: 'secondary HTN' },
  // Respiratory
  { from: 'c-spirometry', to: 'c-asthma-copd', type: 'diagnosed_by' },
  { from: 'c-betablock', to: 'c-asthma-copd', type: 'causes', label: 'bronchospasm risk' },
  { from: 'c-tb', to: 'c-antitb', type: 'treated_by' },
  // Hematology / micro / CM
  { from: 'c-hpylori', to: 'c-ulcer', type: 'causes' },
  { from: 'c-epidesign', to: 'c-vaccines', type: 'related_to' },
]

export const conceptsExtra: SeedConcept[] = [
  { id: 'c-heartfail', topicId: T.pharmCardio, name: 'Heart Failure (HFrEF)', kind: 'disease', summary: 'Four pillars reduce mortality; congestion is managed with diuretics.', whyMatters: 'Integrates hemodynamics, RAAS pharmacology, beta-blocker caution and diuretic choice — the most clinically asked cardiology scenario.', difficulty: 3, examRelevance: 5, clinicalRelevance: 5,
    detail: [{ h: 'Framework', body: ['HFrEF (EF <40%): four pillars — ARNI/ACEi/ARB + β-blocker + MRA + SGLT2i (quad therapy).', 'Diuretics relieve symptoms not mortality. Etiology workup: echo, ECG, iron studies, amyloid if indicated.'] }] },
  { id: 'c-hyperk', topicId: T.enzymes, name: 'Hyperkalemia', kind: 'disease', summary: 'Peaked T → wide QRS → sine wave; stabilize-shift-remove.', whyMatters: 'A lethal electrolyte emergency crossing medicine, nephrology and pharmacology: the stabilize (calcium) → shift (insulin+glucose, salbutamol) → remove (resonium, dialysis) sequence is a guaranteed question.', difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [{ h: 'Sequence', body: ['ECG changes progress: peaked T → P flattening → QRS widening → sine wave.', 'Stabilize myocardium: IV calcium gluconate. Shift: insulin+dextrose, nebulized salbutamol, bicarb (if acidosis). Remove: K-binder, dialysis if refractory/oliguric.', 'Causes: AKI, ACEi/ARB, K-sparing diuretics, rhabdomyolysis, pseudohyperkalemia (hemolysis).'] }] },
  { id: 'c-hba1c', topicId: T.hba1c, name: 'HbA1c', kind: 'investigation', summary: 'Glycated Hb over 8–12 weeks; ≥6.5% diagnoses DM; falsified by anemia/Hb variants.', whyMatters: 'Biochemistry applied directly to diabetes diagnosis and monitoring — with the classic confounders (hemolytic anemia falsely low, iron deficiency falsely high).', difficulty: 1, examRelevance: 4, clinicalRelevance: 5,
    detail: [{ h: 'Facts', body: ['Reflects average glucose over RBC lifespan (~120 d); goal <7% generally.', 'Falsely LOW: hemolysis, pregnancy, transfusion, EPO. Falsely HIGH: iron-deficiency anemia, CKD.', 'Estimated average glucose (mg/dL) ≈ 28.7 × A1c − 46.7.'] }] },
  { id: 'c-thyroidstorm', topicId: T.medThyroid, name: 'Thyroid Storm', kind: 'disease', summary: 'Hyperthyroidism + fever + agitation/arrhythmia — ICU emergency with the 5-step block.', whyMatters: 'Sequencing questions (PTU before iodine!) reward understanding of thyroid physiology; high-yield emergency.', difficulty: 3, examRelevance: 4, clinicalRelevance: 5,
    detail: [{ h: 'Blocks', body: ['1. β-blockade (propranolol) 2. Thionamide (PTU preferred — blocks T4→T3) 3. Iodine 1 h AFTER thionamide (Wolff-Chaikoff) 4. Glucocorticoids 5. Supportive (cooling, fluids).'] }] },
  { id: 'c-antitb', topicId: T.pharmEndo, name: 'Anti-Tubercular Drugs', kind: 'drug', summary: 'RIPE: Rifampin (orange, inducer), Isoniazid (neuropathy), Pyrazinamide (urate), Ethambutol (eye).', whyMatters: 'Drug-toxicity matching is one of the most repeated NEET-PG patterns in pharmacology-microbiology integration.', difficulty: 1, examRelevance: 5, clinicalRelevance: 5,
    detail: [{ h: 'Toxicity table', body: ['Rifampin: orange secretions, CYP450 inducer (OCP failure), hepatotoxic. Isoniazid: B6 neuropathy, hepatotoxic. Pyrazinamide: hyperuricemia, hepatotoxic. Ethambutol: retrobulbar neuritis (red-green color).', 'Streptomycin: ototoxicity. Bedaquiline: QT prolongation (MDR-TB).'] }] },
  { id: 'c-ulcer', topicId: T.hep, name: 'Peptic Ulcer Disease', kind: 'disease', summary: 'Duodenal (H. pylori ~90%) vs gastric (malignancy risk, biopsy).', whyMatters: 'Links microbiology (H. pylori), pharmacology (PPIs), and surgery (perforation). The gastric-vs-duodenal discriminator table is high-yield.', difficulty: 1, examRelevance: 3, clinicalRelevance: 4,
    detail: [{ h: 'Facts', body: ['Duodenal: pain relieved by food, H. pylori in 90%. Gastric: pain worsens with food, weight loss — always biopsy (malignancy).', 'Perforation: pneumoperitoneum (free air under diaphragm), "notched diaphragm" on CXR — surgery after resuscitation.'] }] },
]

// ─── Coverage polish: light concepts for skeleton topics ───
export const conceptsCoverage: SeedConcept[] = [
  { id: 'c-cvpath-athero', topicId: 't-patho-cvpath', name: 'Atherosclerosis', kind: 'pathology', summary: 'Endothelial injury → lipid core → fibrous cap; the substrate of every acute coronary event.', whyMatters: 'The single upstream lesion behind MI, stroke and PAD — risk factors, stable vs unstable plaque, and complication timeline are repeated NEET-PG marks.', difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [{ h: 'Sequence', body: ['Endothelial dysfunction → LDL infiltration/oxidation → monocyte recruitment → foam cells → fatty streak → fibrous plaque (SMC + collagen cap).', 'Unstable plaque: thin cap, large lipid core, inflammation → rupture → thrombosis.', 'Complications: stenosis, thrombosis, embolism, aneurysm.'] }] },
  { id: 'c-ent-conductive', topicId: 't-ent-deaf', name: 'Conductive vs Sensorineural Hearing Loss', kind: 'disease', summary: 'Rinne/Weber localise the lesion before any audiogram.', whyMatters: 'A guaranteed ENT question family: the 512 Hz tuning fork table, otosclerosis vs presbycusis vs noise-induced patterns.', difficulty: 1, examRelevance: 4, clinicalRelevance: 4,
    detail: [{ h: 'Tuning fork table', body: ['Conductive: Weber lateralizes TO affected ear; Rinne BC>AC in affected ear. Causes: wax, otitis media, otosclerosis.', 'Sensorineural: Weber lateralizes AWAY; Rinne AC>BC both. Causes: presbycusis (high-frequency first), noise, drugs (aminoglycosides), acoustic neuroma (asymmetric + CN V/VII signs).'] }] },
  { id: 'c-peds-poststrep', topicId: 't-peds-nephro', name: 'Post-streptococcal GN in Children', kind: 'disease', summary: 'Cola-colored urine 1–3 weeks after pharyngitis/impetigo; low C3 that normalizes in 6–8 weeks.', whyMatters: 'The classic pediatric nephritic vignette — links microbiology (strep), immunology (immune complexes) and the C3 normalization discriminator from lupus nephritis.', difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [{ h: 'Course & treatment', body: ['Supportive: fluid/salt restriction, diuretics, BP control. >95% children recover fully.', 'Red flags: rapidly rising creatinine, nephrotic-range proteinuria, persistent low C3 → biopsy (consider MPGN/lupus).'] }] },
  { id: 'c-trauma-primary', topicId: 't-surg-trauma', name: 'Primary Survey (ABCDE)', kind: 'clinical_skill', summary: 'Airway with C-spine, Breathing, Circulation, Disability, Exposure — life before limb.', whyMatters: 'The sequence itself is the answer in trauma MCQs: what comes first, what kills in minutes, and the lethal six of chest trauma.', difficulty: 1, examRelevance: 4, clinicalRelevance: 5,
    detail: [{ h: 'Priorities', body: ['A: airway + C-spine immobilization. B: breathing — tension pneumothorax kills fastest (needle decompression). C: circulation — 2 wide-bore IVs, control external hemorrhage.', 'D: GCS, pupils. E: expose/log-roll, prevent hypothermia.', 'Lethal six of chest trauma: airway obstruction, tension pneumothorax, open pneumothorax, massive hemothorax, flail chest, cardiac tamponade.'] }] },
]

// ─── CLINICAL SUBJECTS EXPANSION ───
// Original content for Surgery, OBGY, Paediatrics, Orthopaedics, ENT, Ophthalmology, Psychiatry, Dermatology + shock/sepsis bridge.
export const conceptsClinical: SeedConcept[] = [
  // ─── SURGERY: ACUTE ABDOMEN ───
  {
    id: 'c-appendicitis', topicId: T2.appendix, name: 'Acute Appendicitis', kind: 'disease',
    summary: 'Obstructed, inflamed appendix: periumbilical pain migrating to the right iliac fossa — the most common acute surgical abdomen.',
    whyMatters: 'The single most-tested surgical emergency: it integrates referred-visceral-pain physiology, peritoneal signs, Alvarado scoring, imaging choices and the complication timeline (perforation, abscess, portal pyaemia). NEET-PG asks it as classic vignettes and as discriminator questions against mesenteric adenitis, torsion and ectopic.',
    mnemonic: 'MANTRELS — Migration, Anorexia, Nausea, Tenderness RIF, Rebound, Elevated temp, Leukocytosis, Shift of pain.',
    difficulty: 1, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Pathophysiology & pain migration', body: ['Obstruction (faecolith, lymphoid hyperplasia after viral illness, worms) → distension → visceral afferent T10 pain felt PERIUMBILICAL.', 'As inflammation translocates to the parietal peritoneum, pain localises to the RIGHT ILIAC FOSSA and worsens with movement — the migration is the diagnostic signature.', 'Anorexia is nearly universal; vomiting follows pain (inverse of gastroenteritis).'] },
      { h: 'Signs & the Alvarado score', body: ['McBurney point tenderness (junction of lateral 1/3 and medial 2/3 of the ASIS–umbilicus line), rebound (Blumberg), Rovsing, psoas and obturator signs.', 'Alvarado 1–10: migration + anorexia + nausea (1 each), RIF tenderness (2), rebound (1), fever ≥37.3 (1), leukocytosis >10k (1), left shift (1) — ≥7 = high probability → surgeon; 4–6 → imaging/observation.'] },
      { h: 'Investigation & management', body: ['Clinical diagnosis first; USG first-line in children/pregnancy (non-compressible blind-ending tube >6 mm); CT highest accuracy in equivocal adults; pregnancy → MRI.', 'Appendicectomy (laparoscopic preferred) after resuscitation + prophylactic antibiotics; antibiotics-only is not standard for uncomplicated exams.', 'Retrocecal position (~65%) blunts anterior signs → psoas stretch positive; pelvic appendix → urinary frequency/diarrhoea mimic.'] },
      { h: 'Complications timeline', body: ['Perforation (~30%, highest in children/elderly — atypical presentations) → localised peritonitis → appendicular mass (Ochsner–Sherren regimen) → appendicular abscess.', 'Portal pyaemia (pylephlebitis) with jaundice and swinging fever is the classic late killer.', 'Mass resolving silently → plan interval appendicectomy.'] },
      { h: 'Score anchor', table: { headers: ['Component', 'Points'], rows: [['Pain migration to RIF', '1'], ['Anorexia', '1'], ['Nausea/vomiting', '1'], ['RIF tenderness', '2'], ['Rebound tenderness', '1'], ['Fever ≥37.3°C', '1'], ['Leukocytosis >10,000', '1'], ['Left shift >75%', '1']] } },
    ],
  },
  {
    id: 'c-int-obstruction', topicId: T2.appendix, name: 'Intestinal Obstruction', kind: 'disease',
    summary: 'Adhesions and hernias obstruct the small bowel; distension + absolute constipation + faeculent vomiting define the picture.',
    whyMatters: 'A "drip and suck" resuscitation question with high-yield discriminators: small vs large bowel radiology, strangulation red flags, and causes by age (adhesions in adults, intussusception in toddlers, hernia everywhere). Links fluid physiology, radiology and emergency surgery.',
    mnemonic: 'Distension + Obstipation + Vomiting + Pain = the DOVP quartet; "vomiting early = high, late & faeculent = low".',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Causes by context', body: ['Adults: postoperative ADHESIONS (most common) and hernias (most common external cause).', 'Neonates: atresia, meconium ileus, Hirschsprung, anorectal malformation. Toddlers: intussusception (red-currant jelly stool). Elderly: malignancy, sigmoid volvulus (coffee-bean sign).'] },
      { h: 'Small vs large bowel', table: { headers: ['Feature', 'Small bowel', 'Large bowel'], rows: [['Onset', 'Rapid, colicky central pain', 'Slower, distension dominates'], ['Vomiting', 'Early; faeculent if low ileal', 'Late'], ['Distension', 'Central ladder', 'Peripheral, gross'], ['X-ray', 'Central valvulae conniventes (cross full width)', 'Peripheral haustra (partial width)'], ['Common cause', 'Adhesions/hernia', 'Carcinoma/volvulus']] } },
      { h: 'Strangulation red flags & management', body: ['Constant pain, localised tenderness/guarding, fever, tachycardia, rigid hernia — strangulation until proven otherwise → emergency laparotomy.', 'Drip and suck: IV isotonic correction (often 3–5 L deficit), nasogastric decompression, catheter + fluid balance, serial abdominal X-rays.', 'Never reduce a tense, tender hernia forcefully (reduction en masse).'] },
    ],
  },
  {
    id: 'c-cholecystitis', topicId: T2.biliary, name: 'Acute Cholecystitis', kind: 'disease',
    summary: 'Cystic duct obstruction by a stone → bile-induced mucosal inflammation: RUQ pain, Murphy sign, stone on sonography.',
    whyMatters: 'The classic RUQ emergency: distinguishes biliary colic (no wall inflammation, no fever) from cholecystitis (Murphy + wall thickening), flags empyema/empysematous change in diabetics, and anchors the cholangitisCharcot triad. Sonographic criteria are direct NEET-PG marks.',
    mnemonic: 'COURVOISIER law for the palpable non-tender gallbladder with jaundice — "a palpable GB with jaundice is probably NOT stones".',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Clinical picture', body: ['Right hypochondrial pain radiating to the right shoulder/inter-scapular region after fatty meals, with fever and vomiting.', 'Murphy sign: inspiratory arrest on palpating the RUQ as the inflamed gallbladder descends against the fingers.', 'Acalculus cholecystitis (10%): critically ill, burns, TPN, diabetes — same danger, no stone.'] },
      { h: 'Diagnosis', body: ['USG first-line: stones + wall thickening >3 mm + pericholecystic fluid + sonographic Murphy — sensitivity ~95%.', 'HIDA scan is the gold standard when USG equivocal (non-visualisation of gallbladder).', 'Labs: leukocytosis, mild bilirubin/alkaline phosphatase rise (watch for choledocholithiasis).'] },
      { h: 'Management ladder', body: ['NBM, IV fluids, analgesia (NSAID/opioid), antibiotics (gram-negative + anaerobe cover).', 'Early laparoscopic cholecystectomy within 72 h (or after 6 weeks if delayed) — same outcomes, shorter stay.', 'Empysematous cholecystitis (diabetics, gas in wall) → emergency surgery; high perforation risk.'] },
      { h: 'Biliary cousins', body: ['Cholangitis: Charcot triad (fever + jaundice + RUQ pain); Reynolds pentad adds hypotension + confusion → emergency biliary drainage (ERCP).', 'Gallstone ileus: elderly female, recurrent subacute obstruction, aerobilia + ectopic gallstone (Rigler triad).'] },
    ],
  },
  {
    id: 'c-thyroidnodule', topicId: T2.thyBreast, name: 'Thyroid Nodule Workup', kind: 'concept',
    summary: 'TSH → ultrasound → FNAC: the structured ladder that finds the 5–10% malignant nodule.',
    whyMatters: 'A favourite "next step" question family: it forces you to sequence tests correctly (function before structure, FNAC as the decisive test) and to spot red flags. Also integrates endocrine physiology (hot vs cold nodules) with surgical pathology.',
    mnemonic: 'Red flags: "Hard, Hoarse, Hurried, His-story" — hard fixed lump, hoarseness (RLN), rapid growth, young male/irradiation history.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'The ladder', body: ['TSH first: low TSH → radioiodine uptake scan (hot nodule rarely malignant); normal/high TSH → ultrasound.', 'Ultrasound: size, position, microcalcifications, hypoechoic irregular margins, abnormal cervical nodes (TI-RADS risk stratification).', 'FNAC (fine-needle aspiration cytology) is the investigation of CHOICE for a euthyroid solitary nodule — cheap, outpatient, decisions made on cytology (Bethesda categories).'] },
      { h: 'Benign vs malignant tilt', table: { headers: ['Favours benign', 'Favours malignant'], rows: [['Family history of benign goitre', 'Family history of medullary/MEN2, papillary cancer'], ['Hot on uptake scan', 'Cold nodule (esp. male <30 or >60)'], ['Soft, smooth, mobile, multi-nodular', 'Hard, fixed, rapidly enlarging'], ['No nodes', 'Cervical nodes, hoarseness, stridor'], ['Hashimoto thyroiditis background', 'Prior neck irradiation, PLA2R—MEN2 RET mutation']] } },
      { h: 'Exam anchors', body: ['Papillary carcinoma: most common, lymphatic spread, Orphan-Annie nuclei, excellent prognosis.', 'Follicular: haematogenous spread — FNAC cannot distinguish follicular adenoma from carcinoma (needs capsular/vascular invasion on histology).', 'Medullary: calcitonin, C-cells, associated with MEN2 → prophylactic thyroidectomy; amyloid stroma.', 'Anaplastic: elderly, rapidly enlarging hard mass, dreadful prognosis.'] },
    ],
  },
  {
    id: 'c-torsion', topicId: T2.appendix, name: 'Acute Scrotum & Testicular Torsion', kind: 'disease',
    summary: 'Sudden severe scrotal pain + absent cremasteric reflex = torsion: 6 golden hours before the testis is lost.',
    whyMatters: 'A classic surgical emergency where DELAY to image costs the organ: NEET-PG rewards the safe answer (immediate exploration without waiting for Doppler) and the discriminator table vs epididymo-orchitis and appendicitis (RIF pain in males is never complete without a scrotal check).',
    mnemonic: 'CREMASTER ABSENT + HIGH-RIDING TRANSVERSE testis = TORSION. "Prehn sign" relieves epididymitis, NOT torsion.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Recognition', body: ['Adolescent boy: abrupt lower abdominal/scrotal pain with vomiting; testis high-riding, horizontal (bell-clapper deformity), exquisitely tender; cremasteric reflex ABSENT.', 'Epididymo-orchitis: more gradual, fever + urinary symptoms, cremasteric intact, Prehn RELIEF, epididymis tender first.', 'Torsion of the appendix testis: "blue dot sign", prepubertal — managed conservatively.'] },
      { h: 'Management', body: ['Clinical diagnosis → immediate scrotal exploration (detorsion + bilateral orchidopexy) within 6 h for best salvage; do not delay for imaging in high suspicion.', 'Colour Doppler may be done ONLY when suspicion is low; a negative Doppler never trumps a strong clinical picture.', 'Manual detorsion (lateral-to-medial usually) only as a bridge to theatre.'] },
    ],
  },
  // ─── SHOCK & SEPSIS (bridge) ───
  {
    id: 'c-shock', topicId: T2.shock, name: 'Shock: Types & Recognition', kind: 'concept',
    summary: 'Inadequate tissue perfusion with four haemodynamic signatures — hypovolaemic, cardiogenic, obstructive, distributive.',
    whyMatters: 'The resuscitation spine of medicine and surgery: CVP/CO/SVR profiles separate the four types, and every postpartum haemorrhage, MI, PE and sepsis vignette tests whether you can match profile → cause → fluid/vasopressor logic.',
    mnemonic: 'TMAP per type — think Tone (SVR), Pump (CO), and Filling (CVP/PCWP); "warm shock = distributive, cold shock = the rest".',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'The four profiles', table: { headers: ['Parameter', 'Hypovolaemic', 'Cardiogenic', 'Obstructive', 'Distributive'], rows: [['CVP/filling', 'Low', 'High', 'High (tamponade/PE)', 'Low/normal'], ['Cardiac output', 'Low', 'Low', 'Low', 'High (early)'], ['SVR', 'High', 'High', 'High', 'Low'], ['Skin', 'Cold, clammy', 'Cold, mottled', 'Cold', 'WARM, flushed'], ['Pulse pressure', 'Narrow', 'Narrow', 'Narrow', 'WIDE'], ['Prototype', 'Haemorrhage, PPH, burns', 'Large MI, arrhythmia', 'Tension pneumothorax, tamponade, massive PE', 'Sepsis, anaphylaxis, neurogenic']] } },
      { h: 'Management logic', body: ['Hypovolaemic: control the source + crystalloid/blood (1:1:1 for trauma).', 'Cardiogenic: cautious fluids, inotropes (dobutamine), early revascularisation — avoid fluid flooding.', 'Obstructive: decompress the pneumothorax, pericardiocentesis, thrombolysis/EMBOLECTOMY — treat the obstruction, fluids are second.', 'Distributive: fluids + norepinephrine first-line, source control, antibiotics if septic.', 'Lactate clearance and urine output track response better than a single BP reading.'] },
      { h: 'Lethal teaching point', body: ['Vasopressor choice: norepinephrine is first-line in septic and most undifferentiated shock; epinephrine in anaphylaxis (IM, anterolateral thigh).', 'Beware the WARM hypotensive patient — normal-looking peripheries hide profound hypoperfusion.'] },
    ],
  },
  {
    id: 'c-sepsis', topicId: T2.shock, name: 'Sepsis & the Hour-1 Bundle', kind: 'clinical_skill',
    summary: 'Life-threatening organ dysfunction from dysregulated infection: qSOFA screening, SOFA scoring, and timed resuscitation.',
    whyMatters: 'Sepsis is the most common pathway into ICU and a fixture of exam bundles: define it (infection + organ dysfunction), score it (qSOFA at bedside), and act inside hour 1 (cultures → broad-spectrum antibiotics → 30 mL/kg crystalloid for hypotension/lactate ≥4). Sequencing questions are free marks if rehearsed.',
    mnemonic: 'qSOFA: RR ≥22, altered mentation, SBP ≤100 → 2 of 3 raises alarm. Hour-1: CULTURE, ANTIBIOTIC, FLUID, LACTATE, SOURCE.',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Definitions that get asked', body: ['Sepsis = suspected/documented infection + acute rise in SOFA ≥2 (mortality ~10%).', 'Septic shock = sepsis + vasopressor need to keep MAP ≥65 + lactate >2 despite adequate fluids (mortality ~40%).', 'SIRS is obsolete for diagnosis but still quoted: ≥2 of temp >38/<36, HR >90, RR >20, WBC >12k/<4k.'] },
      { h: 'Hour-1 bundle (in order)', body: ['1) Measure lactate (repeat if >2). 2) Blood cultures BEFORE antibiotics (never delay antibiotics >45 min for cultures). 3) Broad-spectrum IV antibiotics. 4) 30 mL/kg balanced crystalloid for hypotension or lactate ≥4. 5) Vasopressors (norepinephrine) if MAP <65 during/after fluids.', 'SOURCE CONTROL within 6–12 h: drain the abscess, remove the line, debride.'] },
      { h: 'India-specific anchors', body: ['Common sources: urosepsis, pneumonia, abdominal (perforation — link to appendicitis/typhoid), neonatal sepsis, melioidosis in pockets.', 'Septic AKI is the most common hospital AKI — euglycaemia does not exclude severe infection in diabetics.'] },
    ],
  },
  // ─── OBGY ───
  {
    id: 'c-previa', topicId: T2.antenatal, name: 'Placenta Previa', kind: 'disease',
    summary: 'Placenta over the lower segment: painless, bright-red APH after 20 weeks — and a vagina you must NOT examine.',
    whyMatters: 'One half of the classic APH pair (with abruption). The exam tests the safe behaviour: painless bleeding → USG first, no vaginal examination, expectant vs delivery decisions by gestational age, and the maternal/fetal risk list (accreta, PPH, malpresentation).',
    mnemonic: 'PREVIA = PAinless, PINK-red, PLacenta low — "no per vagina fingers".',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Types & natural history', body: ['Low-lying (edge <2 cm from os) may migrate upward with lower-segment formation; major degrees (partial/complete) persist.', 'Risk factors: previous caesarean/uterine scar, multiparity, smoking, multiple gestation, prior previa.'] },
      { h: 'Diagnosis & management', body: ['Painless recurrent bright-red bleeding; uterus soft and non-tender; malpresentation common; FHR usually normal (vs abruption distress).', 'Transabdominal then transvaginal USG (safe, above the bleeding) localises the placenta — NEVER digital vaginal examination.', '<37 wks, stable: expectant (steroids 24–34 wks, anti-D if Rh-negative, blood on standby); ≥37 or uncontrolled bleeding: delivery by caesarean.'] },
      { h: 'Dangers', body: ['Massive PPH (lower segment cannot contract), morbidly adherent placenta (accreta — esp. placenta previa over a caesarean scar), fetal malpresentation/preterm birth.', 'Postpartum: high hysterectomy risk — consent, cross-match 4 units, senior obstetrician.'] },
    ],
  },
  {
    id: 'c-abruptio', topicId: T2.antenatal, name: 'Abruptio Placentae', kind: 'disease',
    summary: 'Premature separation of a normally-placed placenta: painful, tense woody uterus, fetal distress, DIC risk.',
    whyMatters: 'The dangerous twin of previa: concealed bleeding can kill the fetus while vital signs lie (relative anaemia, normotension until decompensation). Tested as the painful-APH vignette, the DIC/causes table, and the Couvelaire uterus finding at caesarean.',
    mnemonic: 'ABRUPTIO = ABRupt pain, Board-like uterus, RUpture of vessels, DIC threat — "painful previa is a lie: it is abruption".',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Risk factors & types', body: ['Hypertension/preeclampsia (top), trauma, smoking, cocaine, sudden decompression (polyhydramnios rupture), previous abruption.', 'Concealed vs revealed; grades I–IV (Sher) — grade III with fetal death and coagulopathy.'] },
      { h: 'Recognition & complications', body: ['Dark venous bleeding WITH continuous abdominal pain; uterus tense, tender, "woody"; fetal parts hard to palpate; FHR abnormalities early.', 'Complications: DIC (tissue thromboplastin release), acute renal failure (cortical necrosis), Couvelaire uterus (blood infiltrating myometrium), PPH after delivery, fetal death (in severe).'] },
      { h: 'Management', body: ['Resuscitate (2 large-bore IVs, cross-match, anti-D if Rh-negative), watch urine output (renal failure triad).', 'Fetus alive + mother stable → expedite delivery (vaginal if imminent, caesarean for distress). Fetus dead → vaginal delivery with analgesia, correct coagulopathy (FFP/cryoprecipitate/platelets).', 'Never tocolyse; monitor for PPH after delivery (atonic over-distended uterus).'] },
    ],
  },
  {
    id: 'c-pph', topicId: T2.labour, name: 'Postpartum Haemorrhage (PPH)', kind: 'disease',
    summary: '>500 mL loss after delivery (vaginal) — Tone, Trauma, Tissue, Thrombin: find the T, treat in order.',
    whyMatters: 'The leading cause of maternal death worldwide and the highest-yield OBGY management-sequence question: uterine massage + uterotonics → bimanual compression → prostaglandins → balloon/surgery. Each step has a memorised order that examiners (and real life) demand.',
    mnemonic: 'The FOUR Ts — Tone (70%), Trauma (20%), Tissue (10%), Thrombin (1%). "MOTIVATE your uterus: Massage, Oxytocin, then escalate."',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Definition & the 4 Ts', table: { headers: ['Cause', 'Frequency', 'Key clue', 'First move'], rows: [['Tone (uterine atony)', '~70%', 'Boggy, soft uterus', 'Massage + oxytocin'], ['Trauma (tears, incisions)', '~20%', 'Bleeding with well-contracted uterus', 'Inspect and repair'], ['Tissue (retained placenta/cotyledon)', '~10%', 'Incomplete placenta/membranes', 'Manual removal'], ['Thrombin (coagulopathy)', '~1%', 'Oozing from raw surfaces, DIC labs', 'Blood products/FFP']] } },
      { h: 'Stepwise management', body: ['1) Call for help, ABC, 2 wide-bore IVs, cross-match, empty the bladder.', '2) UTERINE MASSAGE + IV OXYTOCIN (first-line uterotonic).', '3) Second-line uterotonics: methyl ergometrine (not in HTN/preeclampsia), carboprost PGF2α (NOT in asthma), misoprostol.', '4) Bimanual compression / aortic compression while escalating.', '5) Balloon tamponade (Bakri), then uterine artery ligation, B-Lynch brace suture, stepwise devascularisation; hysterectomy as the terminal step.', 'Primary vs secondary: primary <24 h (6 wks for some definitions); secondary = retained tissue/endometritis → antibiotics + evacuation.'] },
      { h: 'Prevention (active management of third stage)', body: ['Prophylactic oxytocin 10 IU IM with delivery of the anterior shoulder (or after delivery) is the single best reducer of PPH; controlled cord traction + uterine massage complete the triad.', 'Risk score mothers antenatally: previous PPH, over-distension (twins, polyhydramnios), anaemia, prolonged labour.'] },
    ],
  },
  {
    id: 'c-oxytocin', topicId: T2.labour, name: 'Oxytocin & Uterotonics', kind: 'drug',
    summary: 'Oxytocin = first-line for PPH and induction; the uterotonic family has organ-specific contraindications that exams love.',
    whyMatters: 'A pure pharmacology-surgery crossover: oxytocin (V1/V2 receptor —antidiuretic water retention), ergometrine (hypertension → forbidden in preeclampsia), carboprost (bronchospasm → forbidden in asthma), misoprostol (shelf-stable, the community answer). Matching drug to comorbidity is a guaranteed mark.',
    mnemonic: 'No ASTHMA for carboprost, no BLOOD-PRESSURE for ergometrine; oxytocin is the friend of all.',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'The family', body: ['Oxytocin: IV infusion for induction/augmentation (hypotension with rapid push) and PPH prophylaxis/first-line; continuous infusion risks water intoxication at high doses.', 'Ergometrine/methylergometrine: sustained tetanic contraction — contraindicated in hypertension, preeclampsia, cardiac disease; causes vomiting and rises BP.', 'Carboprost (PGF2α): for atony refractory to oxytocin — contraindicated in ASTHMA (bronchospasm); diarrhoea/flushing.', 'Misoprostol (PGE1): sublingual/rectal, heat-stable — the community/remote-area workhorse; shivering and fever.'] },
      { h: 'Anti-dote context', body: ['Uterotonic failure → mechanical escalation (balloon, B-Lynch, hysterectomy) — drugs cannot fix trauma or retained tissue.', 'Oxytocin +重复 dosing: down-regulation with prolonged high-dose infusion — note tachyphylaxis.'] },
    ],
  },
  {
    id: 'c-eclampsia-mgmt', topicId: T.preec, name: 'Eclampsia Management', kind: 'clinical_skill',
    summary: 'Seizure in a preeclamptic woman: left-lateral, oxygen, MgSO4 loading — delivery is the only cure.',
    whyMatters: 'An emergency sequence question with zero tolerance for improvisation: MgSO4 is the anticonvulsant (not diazepam for maintenance), the Pritchard regimen has memorised doses, and the three safety monitors (knee jerks, respiration, urine output) with calcium gluconate as antidote are direct marks.',
    mnemonic: 'LMNOP — Left lateral, Magnesium, Nurture airway/O2, Prevent injury, Order delivery. Monitor: Jerks, Respiration, Urine.',
    difficulty: 3, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'During the seizure', body: ['Do NOT restrain or force the mouth open. Left-lateral tilt (relieves aortocaval compression), suction airway, O2 by mask, protect from injury.', 'Give MgSO4 if not already loaded — it terminates and prevents seizures; diazepam/lorazepam only if MgSO4 unavailable or seizures persist.'] },
      { h: 'MgSO4 regimens (Pritchard)', body: ['Loading: 4 g IV (20% slowly over 5–10 min) + 10 g IM (5 g each buttock, 50% with lignocaine). Maintenance: 5 g IM 4-hourly alternating buttocks.', 'Continue 24 h after last seizure/delivery.', 'Toxicity ladder (assess BEFORE every dose): knee jerks present → respiration ≥12–16/min → urine output ≥25–30 mL/h. Antidote: IV calcium gluconate 10%.'] },
      { h: 'Around the seizure', body: ['Control BP (IV labetalol or nifedipine; hydralazine alternatives) targeting 130–150/80–100 — do not crash-restore to normal.', 'Definitive treatment = STABILISE then DELIVER (vaginal if favourable, caesarean for obstetric indications); at ≥34 weeks / severe features do not delay for steroid benefit.', 'Post-partum vigilance: seizures can occur up to 48+ h after delivery; fluid restrict to ~80 mL/h to avoid pulmonary oedema.'] },
    ],
  },
  {
    id: 'c-partograph', topicId: T2.labour, name: 'Partograph & Labour Progress', kind: 'investigation',
    summary: 'One graph: cervical dilatation (alert/action lines), descent, and fetal-maternal wellbeing — the early-warning system of labour.',
    whyMatters: 'WHO partograph logic answers "prolonged labour" MCQs: alert line crossing (4 h behind) → action line (4 h later) → intervene (augmentation with oxytocin / caesarean). Also integrates moulding, caput, liquor and FHR plotting as the composite fetal-maternal monitor.',
    mnemonic: 'ALERT at the line, ACT at the action line — "dilatation, descent, distress: watch all three Ds".',
    difficulty: 2, examRelevance: 3, clinicalRelevance: 4,
    detail: [
      { h: 'Components', body: ['Left panel: labour progress — cervical dilatation (latent then active phase ≥1 cm/h in active phase), fetal head descent (fifths palpable), contractions (number per 10 min).', 'Right panel: fetal — FHR, membranes/liquor (intact/C/C+S), moulding (0 to +++), caput; maternal — BP, pulse, temperature, urine (protein, acetone, volume).'] },
      { h: 'The two lines', body: ['ALERT line: expected progress slope starting at active phase (4 cm). If the curve crosses to its right → transfer/augment.', 'ACTION line: 4 h to the right of alert — crossing it mandates intervention (ARM + oxytocin, reassess, deliver by caesarean if failure to progress).', 'Uses: reduces prolonged labour, intra-uterine sepsis and unnecessary caesareans when used with a humanitarian policy ( WHO 30-cm simplified partograph).'] },
    ],
  },
  // ─── PAEDIATRICS ───
  {
    id: 'c-milestones', topicId: T2.growth, name: 'Growth & Developmental Milestones', kind: 'concept',
    summary: '3-6-9-12 anchors: social smile, sitting, pincer, walking — plotted against weight/height/head-circumference charts.',
    whyMatters: 'The most reliable marks in Paediatrics: milestone-by-age tables, the primitive reflex disappearance schedule, and growth-chart interpretation (weight-for-age faltering). Also the backbone of developmental delay triage in OPD.',
    mnemonic: '3-month social smile, 6 sits, 9 stands, 12 walks — "smile-sit-stand-step". Head control 3 m, pincer 9–10 m, 2-word sentences 2 y.',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'The core table', table: { headers: ['Age (median)', 'Gross motor', 'Fine motor / social'], rows: [['2 months', 'Lifts head prone', 'Social smile'], ['4–5 months', 'Rolls over', 'Reaches for objects'], ['6 months', 'Sits with support → alone by 6–8 m', 'Transfers objects hand-to-hand'], ['9 months', 'Sits without support, stands holding', 'Immature pincer grasp, waves bye-bye'], ['12 months', 'Stands alone, walks with support → alone by 12–15 m', 'Mature pincer; 1–2 words; object permanence'], ['18 months', 'Runs, climbs stairs', 'Tower of 3–4 cubes; points to needs'], ['24 months', 'Kicks ball, up-down stairs', '2-word sentences; parallel play']] } },
      { h: 'Primitive reflexes (appear → vanish)', body: ['Moro and grasp: birth → 3–4 months. Rooting: birth → 3–4 months. ATNR (fencing): 2 → 6 months. Parachute appears 6–8 months and persists — its absence signals motor delay.', 'Red flags: no social smile by 3 m, not sitting by 9 m, not walking by 18 m, no words by 16–18 m, hand dominance before 12 m (suggests hemiparesis).'] },
      { h: 'Growth monitoring', body: ['Weigh at every immunisation visit; plot on WHO z-score charts. Crossing ≥2 z-score lines down = growth faltering → dietary history, illness screen, treat the cause (link to kwashiorkor/marasmus).', 'Head circumference: microcephaly <−3 SD; rising too fast → hydrocephalus (bulging fontanelle, sunset eyes).'] },
    ],
  },
  {
    id: 'c-kwashmaras', topicId: T2.growth, name: 'Kwashiorkor vs Marasmus', kind: 'disease',
    summary: 'Protein-dominant deficiency with oedema vs calorie-dominant deficiency with wasted "old-man" facies and no oedema.',
    whyMatters: 'The flagship Paediatrics confusion pair: weight-for-height percentages, oedema as the great divider, flaky-paint dermatosis, hair flag-sign, and WHO classification thresholds are asked in every Pediatrics paper — and integrate biochemistry (fatty liver, hypoalbumin) and community medicine (IMNCI nutrition counselling).',
    mnemonic: 'KWASH = Kwashiorkor Has AnaSArcal Oedema (protein lack); MARASMUS = Muscle & Subcutis melt (calorie lack).',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Side-by-side', table: { headers: ['Feature', 'Kwashiorkor', 'Marasmus'], rows: [['Deficiency', 'Protein (with some calories)', 'Total calories (protein-energy both low)'], ['Weight', '60–80% of expected', '<60% of expected'], ['Oedema', 'PRESENT (starts feet → anasarca)', 'Absent'], ['Subcutaneous fat', 'Preserved over trunk', 'Grossly lost, "baggy pants"'], ['Face', 'Moon-face (pathognomonic)', 'Old-man facies'], ['Skin/hair', 'Flaky-paint dermatosis, flag-sign hair', 'Dry, wrinkled, atrophic skin'], ['Liver', 'Fatty infiltration (hepatomegaly)', 'Atrophic'], ['Mood', 'Apathetic, miserable', 'Alert, irritable "hungry"']] } },
      { h: 'Management principles (WHO 10 steps)', body: ['Phase 1 (stabilisation): treat/prevent hypoglycaemia, hypothermia, dehydration (ReSoMal, NOT standard ORS), electrolytes (K, Mg), infection cover, micronutrients WITHOUT iron initially, cautious feeding (F-75).', 'Phase 2 (rehabilitation): catch-up growth F-100, iron after oedema resolves, sensory stimulation.', 'The most lethal moments are the first days — refeeding syndrome (watch phosphate), and never rapid volume loads (heart failure risk).'] },
    ],
  },
  {
    id: 'c-imnci', topicId: T2.growth, name: 'IMNCI Danger Signs', kind: 'clinical_skill',
    summary: 'Any general danger sign in a sick child = urgent referral: lethargy, unable to feed, vomiting everything, convulsions, stridor at rest.',
    whyMatters: 'IMNCI is India\'s frontline child-health algorithm and a Community Medicine + Paediatrics double subject: the color-coded triage (pink = urgent referral, yellow = outpatient treatment, green = home care) converts exam questions into real triage skills.',
    mnemonic: 'The 5 pink flags: "Very LUCV" — Lethargic/unconscious, Unable to Can-feed (not able to feed), Vomits everything, Convulsions, Stridor at rest (or severe chest indrawing).',
    difficulty: 1, examRelevance: 3, clinicalRelevance: 5,
    detail: [
      { h: 'General danger signs (any one = pink)', body: ['Unable to drink/breastfeed. Vomits everything. Convulsions (current illness). Lethargic or unconscious. Stridor in a calm child.', 'Fast breathing thresholds: <2 m ≥60, 2–12 m ≥50, 1–5 y ≥40. Chest indrawing or grunting escalates pneumonia classification.'] },
      { h: 'Colour triage', body: ['PINK (urgent pre-referral: O2, first-dose antibiotics/antimalarial, ORS sip, keep warm, glucose) → REFER.', 'YELLOW: treat at health facility (dysentery, non-severe pneumonia, dehydration without danger signs).', 'GREEN: home care + follow-up schedule (2 days for antibiotics, 5 days for fever, 30 days growth check).'] },
    ],
  },
  {
    id: 'c-tof', topicId: T2.pedsCardio, name: 'Tetralogy of Fallot (TOF)', kind: 'disease',
    summary: 'Four defects, one embryology (anterosuperior VSD malalignment): VSD + overriding aorta + RVOT obstruction + RVH — spells relieved by squatting.',
    whyMatters: 'The most common CYANOTIC congenital heart disease beyond infancy and a guaranteed question: tet-spell physiology (infundibular spasm, R→L shunt worsening) and knee-chest/salbutamol/morphine-phenylephrine management are the highest-yield clinical hooks.',
    mnemonic: 'PROVe: Pulmonary stenosis, Right ventricular hypertrophy, Overriding aorta, VSD — and Spells need SQUAT (↑SVR).',
    difficulty: 2, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Anatomy & physiology', body: ['Anterosuperior deviation of the outlet septum creates all four defects; degree of RVOT (infundibular/pulmonary) obstruction sets cyanosis severity.', 'X-ray: boot-shaped heart (RVH, concave PA segment). ECG: RAD + RVH. Echo establishes; single LV?→ check aortic arch side (left arch common, right arch ~25%).'] },
      { h: 'The tet spell (hypercyanotic attack)', body: ['Trigger: crying/feeding/defecation (infancy) — infundibular spasm → more R→L shunt → deeper cyanosis, syncope, seizures.', 'MANAGEMENT: knee-chest position (↑SVR, ↓venous return to the right heart) + high-flow O2 + morphine (calms, relaxes infundibulum) + IV fluid; refractory → phenylephrine (↑SVR) or esmolol; surgical source (BT shunt/complete repair).'] },
      { h: 'Exam anchors', body: ['TOF is the most common cyanotic CHD after infancy; TGA is most common in the first week of life (needs PGE1).', 'Natural history: squatting by toddlers, clubbing, brain abscess and stroke risk from R→L shunts (paradoxical emboli, polycythaemia).', 'Pulmonary atresia/VSD = extreme TOF; TOF with absent pulmonary valve → bronchial compression.'] },
    ],
  },
  // ─── ENT ───
  {
    id: 'c-bppv-meniere', topicId: T2.vertigo, name: "BPPV vs Meniere's Disease", kind: 'disease',
    summary: 'Seconds-long positional vertigo with a normal ear (canalithiasis) vs hours-long vertigo with fluctuating sensorineural hearing loss and tinnitus.',
    whyMatters: 'The most examined vestibular pair: duration + hearing + trigger triad separates BPPV (Dix-Hallpike positive, Epley cures), Meniere (low-salt, betahistine), vestibular neuritis (days, after URTI) and acoustic neuroma (asymmetric SNHL). One table = repeated marks across ENT, Medicine and Neurology.',
    mnemonic: 'BPPV = Brief (seconds) + Positional +Provoked (head movement). Meniere = Mile-long (hours) + Malady of the Membranous labyrinth ( hearing drops, ears ring).',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Discriminator table', table: { headers: ['Feature', 'BPPV', "Meniere's"], rows: [['Duration', 'Seconds (<1 min)', '20 min – hours'], ['Hearing loss', 'None', 'Fluctuating, progressive SNHL (low-frequency first)'], ['Tinnitus/ear fullness', 'No', 'Yes (attacks)'], ['Trigger', 'Rolling in bed, looking up (posterior canal most)', 'Spontaneous attacks; salt/stress'], ['Test', 'Dix-Hallpike: rotatory nystagmus with latency & fatiguability', 'Audiometry; glycerol test historical'], ['Treatment', 'Epley/Brandt-Daroff repositioning (cure)', 'Low-salt diet, betahistine, diuretics; intratympanic gentamicin/steroi​d for refractory']] } },
      { h: 'The wider vestibular map', body: ['Vestibular neuritis: severe constant vertigo for DAYS, single episode, no hearing loss (viral, after URTI) — treat with vestibular suppressants briefly then mobilise.', 'Vestibular migraine: variable, headache link, personal/family migraine history.', 'Central red flags: vertical or direction-changing nystagmus, gait ataxia out of proportion, focal neurology, "worst headache" — think stroke (posterior circulation).', 'Acoustic neuroma: unilateral progressive SNHL + tinnitus, absent corneal reflex (CN V), treat/watch by size.'] },
    ],
  },
  {
    id: 'c-otitis-media', topicId: T2.vertigo, name: 'Acute Otitis Media', kind: 'disease',
    summary: 'Bulging, erythematous tympanic membrane with earache and fever in a small child — pneumococcus tops the organism list.',
    whyMatters: 'The commonest reason for paediatric antibiotics and a favourite organism/discrimination question: AOM vs OME (glue ear, no fever), the complication ladder (mastoiditis — post-auricular swelling, TM perforation, facial palsy, meningitis), and first-line amoxicillin dosing logic.',
    mnemonic: 'Bulging TM + fever + pain = AOM; effusion without inflammation = OME ("glue ear": retracted TM, air-fluid level, no fever).',
    difficulty: 1, examRelevance: 3, clinicalRelevance: 5,
    detail: [
      { h: 'Recognition & organisms', body: ['Pneumococcus (most common), H. influenzae (non-typeable), Moraxella (β-lactamase). Risk: daycare, passive smoke, bottle-feeding supine, cleft palate, adenoid hypertrophy.', 'Examination: bulging TM with lost landmarks/light reflex; perforation → discharge with relief of pain.'] },
      { h: 'Management', body: ['Analgesia; antibiotics if <2 y, bilateral, severe (fever ≥39, ≥48 h), or otorrhoea — amoxicillin first-line (watch resistance → amoxiclav).', 'Watchful waiting 48–72 h acceptable in mild unilateral disease >2 y.', 'Complication alarm: MASTOIDITIS — post-auricular swelling pushing the pinna forward/down, tender mastoid → IV antibiotics ± cortical mastoidectomy. Facial palsy, vertigo, meningitis → urgent ENT.'] },
    ],
  },
  // ─── OPHTHALMOLOGY ───
  {
    id: 'c-red-eye', topicId: T2.redEye, name: 'The Acute Red Eye', kind: 'concept',
    summary: 'One sign, four threats: conjunctivitis, keratitis, uveitis and acute angle-closure glaucoma — vision, pain pattern and pupil sort them.',
    whyMatters: 'A triage skill that prevents blindness: conjunctival discharge + normal vision = safe; ciliary flush + photophobia + small pupil (uveitis) or corneal opacity (keratitis) or mid-dilated fixed pupil + halos (angle closure) = refer urgently. NEET-PG presents exactly this discrimination table.',
    mnemonic: 'DISCHARGE safe, CILIARY flush not; "photophobia + small pupil = uveitis; halos + stone pupil = angle closure; white light on white eye = keratitis rules out".',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'The discrimination table', table: { headers: ['Feature', 'Conjunctivitis', 'Keratitis (corneal ulcer)', 'Acute anterior uveitis', 'Acute angle-closure glaucoma'], rows: [['Vision', 'Normal', 'Reduced if central/opacity', 'Reduced', 'Markedly reduced'], ['Pain', 'Gritty, mild', 'Foreign-body, severe', 'Aching, photophobia', 'Severe + headache, vomiting'], ['Injection', 'Diffuse conjunctival', 'Ciliary flush', 'Ciliary flush', 'Ciliary + conjunctival'], ['Pupil', 'Normal', 'Normal ± white ulcer', 'Small, irregular', 'Mid-dilated, FIXED, oval'], ['Discharge', 'Yes (watery/purulent)', 'Watery/reflective tears', 'No', 'No (epiphora)'], ['Cornea', 'Clear', 'Ulcer/opacity, fluorescein-positive', 'KPs (keratic precipitates)', 'Hazy/steamy, epithelial oedema'], ['Pressure', 'Normal', 'Normal/↑', 'Usually normal', 'Rock-hard, very high']] } },
      { h: 'Never-miss rules', body: ['Any red eye with VISION LOSS, severe pain, photophobia, corneal opacity, or an abnormal pupil is NOT conjunctivitis — refer.', 'Contact lens + red eye = keratitis (Pseudomonas risk) until proven otherwise; STOP lens wear, urgent ophthalmology.', 'Viral conjunctivitis: adenovirus, highly contagious, pre-auricular node; bacterial: purulent; chlamydial in neonates (treat systemically).', 'Never steroid drops for an undiagnosed red eye — herpes keratitis can melt the cornea.'] },
    ],
  },
  {
    id: 'c-poag', topicId: T2.redEye, name: 'Primary Open-Angle Glaucoma', kind: 'disease',
    summary: 'The "silent thief of sight": painless, open angles, raised IOP → cupping and progressive field loss from the periphery inward.',
    whyMatters: 'Contrasted against angle-closure, POAG teaches chronic glaucoma logic: risk factors (age, family history, myopia, steroid response, race), signs (C:D ratio >0.6, focal notching, nasal field defects, arcuate scotoma), and the drug ladder whose systemic side-effects (timolol asthma, brimonidine fatigue, acetazolamide stones) are cross-subject pharmacology marks.',
    mnemonic: 'POAG = Painless, Open angle, Asymptomatic Progression — fields go Nasal before you notice; "cup > disc = suspect".',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Diagnosis', body: ['IOP >21 mmHg is typical but NORMAL-TENSION glaucoma exists — diagnose by optic nerve + visual fields together.', 'Disc: cup:disc ratio ≥0.6 or asymmetry >0.2, focal notching, disc haemorrhage, RNFL defect.', 'Fields: nasal step, arcuate (Bjerrum) scotoma; central vision preserved till late.', 'Gonioscopy confirms OPEN angle (vs closed in AACG); pachymetry for thin corneas (falsely low IOP readings).'] },
      { h: 'Management ladder', body: ['Topical first: prostaglandin analogues (latanoprost — first-line, ↑uveitis/herpes caution) → beta-blockers (timolol — ask about asthma/heart block) → alpha-2 agonists (brimonidine) → carbonic anhydrase inhibitors (dorzolamide; acetazolamide for short-term/oral).', 'Laser trabeculoplasty; trabeculectomy (± MMC) when medical fails.', 'Never chronic oral acetazolamide without monitoring (metabolic acidosis, paraesthesia, renal stones).'] },
    ],
  },
  // ─── PSYCHIATRY ───
  {
    id: 'c-mdd', topicId: T2.mood, name: 'Major Depressive Disorder', kind: 'disease',
    summary: '≥5 depressive symptoms for ≥2 weeks with functional loss — and a suicide risk assessment you must never skip.',
    whyMatters: 'Among the most common disorders psychiatry exams test: the two-week/five-symptom rule, core vs somatic features, melancholic and atypical profiles, SSRI first-line logic with the 2-week onset and activation trap, and the risk ladder that makes "ask about suicidal ideation" the always-safe answer.',
    mnemonic: 'SIGECAPS (Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicidality) — ≥5 for ≥2 weeks, one must be mood/anhedonia.',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Diagnosis & specifiers', body: ['≥5 of 9 symptoms (depressed mood, anhedonia, weight/appetite change, sleep disturbance, psychomotor change, fatigue, guilt/worthlessness, poor concentration, suicidal thoughts) for ≥2 weeks; at least one is mood or anhedonia; causes distress/impairment; not substance/medical/grief-only.', 'Melancholic: profound anhedonia, early-morning waking, weight loss, diurnal variation (worse morning). Atypical: mood reactivity, hypersomnia, hyperphagia, leaden paralysis.', 'Postpartum onset: distinguish baby blues (days 3–7, self-limited) from PPD (≥2 wks) and puerperal psychosis (emergency).'] },
      { h: 'Management', body: ['First-line: SSRIs (fluoxetine/sertraline/escitalopram) — effect at 2–4 wks, start low, no abrupt stop (discontinuation syndrome); early activation/switch risk in bipolar diathesis → always screen for past mania.', 'Severe/psychotic/refractory: combination therapy, ECT (fastest, safest in pregnancy with psychotic depression/catatonia).', 'Safety: every depressed patient gets a direct, non-judgemental suicidal-ideation + plan/means enquiry; means restriction saves lives.'] },
    ],
  },
  {
    id: 'c-schizo-frs', topicId: T2.mood, name: 'Schizophrenia & First-Rank Symptoms', kind: 'disease',
    summary: 'Schneiderian first-rank symptoms (thought interference, 3rd-person voices, delusional perception) with >6 months duration for diagnosis.',
    whyMatters: 'The exam tests the symptom LIST and the timeline: FRS are specific-but-not-sensitive, ≥1 month active symptoms + 6 months disturbance defines schizophrenia, and negative symptoms (blunt affect, avolition) drive disability and predict antipsychotic response worse than positive symptoms.',
    mnemonic: 'The FRS quartet: THOUGHT (insertion/withdrawal/broadcast), VOICES (3rd person, running commentary), CONTROL (passive), PERCEPTION (delusional).',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Diagnosis & discrimination', body: ['Duration: ≥1 month active-phase symptoms (≥2, one core: delusions/hallucinations/disorganised speech) + 6 months overall disturbance; functioning decline.', 'FRS (Schneider): thought alienation (insertion/withdrawal/broadcast), hearing thoughts aloud, 3rd-person or running-commentary auditory hallucinations, delusional perception, passivity phenomena.', 'Schizoaffective: mood episodes + ≥2 weeks psychosis WITHOUT mood; brief psychotic disorder <1 month; delusional disorder ≥1 month with functioning preserved.'] },
      { h: 'Treatment anchors', body: ['First-line atypicals (risperidone, olanzapine, aripiprazole); clozapine for treatment-resistance (≥2 adequate trials) — watch agranulocytosis, myocarditis, seizures, metabolic syndrome.', 'EPS ladder: acute dystonia (anticholinergic), akathisia (propranolol/cyproheptadine), parkinsonism, tardive dyskinesia (late; VMAT2 inhibitors).', 'Depression + negative symptoms dominate outcomes; psychosocial rehabilitation is inseparable from drugs.'] },
    ],
  },
  // ─── DERMATOLOGY ───
  {
    id: 'c-psoriasis', topicId: T2.psoriasis, name: 'Psoriasis', kind: 'disease',
    summary: 'Well-demarcated silvery plaques on extensors with Auspitz bleeding, nail pitting and the Koebner phenomenon.',
    whyMatters: 'The classic papulosquamous exam: morphology → Auspitz sign, candle-grease and Grattat tests; nail and joint (psoriatic arthritis — pencil-in-cup) systemic hooks; and the therapy ladder (emollients → steroids/vit D analogues → phototherapy → methotrexate/biologics) including the paradoxical-beta-blocker and antimalarial flares.',
    mnemonic: 'AUSPITZ: pin-point bleeding after scale lift. Koebner = lesions at trauma lines; Candle grease sign + Grattat = scraping triad.',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Clinical spectrum', body: ['Plaque (chronic plaque/psoriasis vulgaris) — extensors (knees, elbows), scalp, sacrum; bilateral symmetric.', 'Guttate (drop lesions after streptococcal sore throat — children/young adults), pustular (generalised = emergency with fever; palmoplantar), erythrodermic (life-threatening heat loss).', 'Nails: pitting (most common), oil-drop/oncholysis, subungual hyperkeratosis. Joints: DIP-predominant asymmetric oligoarthritis, dactylitis, pencil-in-cup on X-ray.'] },
      { h: 'Pathogenesis & triggers', body: ['Th17/IL-23/IL-17 driven keratinocyte hyperproliferation (acanthosis, parakeratosis, Munro microabscesses, elongated rete ridges, suprapapillary thinning).', 'Triggers: streptococcal infection, trauma (Koebner), drugs (beta-blockers, lithium, antimalarials, NSAIDs, steroid WITHDRAWAL), smoking, alcohol, stress, obesity.'] },
      { h: 'Treatment ladder', body: ['Topical: emollients base + potent corticosteroid with vitamin D3 analogue (calcipotriol) for plaque disease; tar/anthralin for scalp.', 'Phototherapy: narrow-band UVB; PUVA for palmoplantar/thick plaques.', 'Systemic: methotrexate (monitor CBC/LFT — folate cover; contraindicated pregnancy), acitretin, cyclosporine; biologics (TNF-α, IL-17, IL-23 inhibitors) for severe/arthritic disease.'] },
    ],
  },
  {
    id: 'c-atopic-derm', topicId: T2.psoriasis, name: 'Atopic Dermatitis', kind: 'disease',
    summary: 'The itch that rashes: flexural, age-staged eczema in an atopic child — barrier repair and steroid ladders over antibiotics.',
    whyMatters: 'The commonest paediatric dermatosis and the other half of the papulosquamous pair: pruritus-first morphology, distribution by age (face/extensor in infancy → flexural in childhood → lichenification in adults), the atopic triad (asthma, allergic rhinitis, AD), food-allergy logic and the moisturiser-first therapy message that examiners emphasise.',
    mnemonic: 'ATOPIC: Asthma + rhinitis/Th2 skew + Oozing (infant face) + Pruritus + Ichthyosis/palmar hyperlinearity + Chronic flexural course.',
    difficulty: 1, examRelevance: 3, clinicalRelevance: 5,
    detail: [
      { h: 'Morphology by age', body: ['Infancy (<2 y): acute, weeping facial and extensor eczema; spares the nappy area.', 'Childhood (2–12): flexural (antecubital/popliteal fossae), lichenified plaques, Dennie-Morgan infraorbital folds, dry ichthyotic skin.', 'Adults: hand eczema, lichen simplex chronicus; pruritus is universal and worsens at night.'] },
      { h: 'Management ladder', body: ['1) Emollients liberally (the foundation — bath-avoid soap), trigger avoidance (wool, detergents, sweat).', '2) Topical corticosteroids (short courses, right potency for site) ± topical calcineurin inhibitors (tacrolimus/pimecrolimus) for face/folds and steroid-sparing maintenance.', '3) Flares with honey-crusted weeping → impetiginisation (S. aureus) — antiseptic washes, antibiotics if genuine infection; eczema herpeticum (punched-out monomorphic vesicles + fever) = emergency aciclovir.', 'Severe refractory: phototherapy, systemic (cyclosporine, dupilumab IL-4/13).'] },
    ],
  },
  // ─── ORTHOPAEDICS ───
  {
    id: 'c-colles', topicId: T2.fractures, name: 'Colles Fracture', kind: 'disease',
    summary: 'Extra-articular distal-radius fracture with DORSAL displacement/tilt after a fall on the outstretched hand — dinner-fork deformity.',
    whyMatters: 'The most common adult forearm fracture and the standard "FOOSH" vignette: deformity naming (dinner-fork vs Smith reverse), the median-nerve/carpal-tunnel and extensor-pollicis-longus rupture complications, radial-shortening mechanics, and the osteoporosis flag it raises in elderly women.',
    mnemonic: 'COLLES = Classic Old Lady, Low-Energy fracture, Extra-articular, Silver fork/dinner-fork deformity (dorsal tilt). Smith = Spade (volar, reverse).',
    difficulty: 1, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Recognition & imaging', body: ['Elderly woman, fall on outstretched hand (supinated wrist extended); dinner-fork (apex volar, dorsal distal fragment) + radial shortening; ulnar styloid may fracture.', 'X-ray: distal radius within 2 cm of the wrist, dorsal tilt >11° normal lost, intra-articular extension defines the Frykman/ABC complexity.'] },
      { h: 'Management & complications', body: ['Closed reduction + below-elbow cast (volar/neutral flexion) for typical fractures; K-wire/external fixation/volar plating for unstable, intra-articular or comminuted.', 'Early: median nerve compression (paraesthesia in the median territory — acute carpal tunnel, consider urgent release), compartment syndrome (rare).', 'Late: malunion with stiffness, EPL tendon rupture (attrition 4–8 weeks), CRPS (Sudeck osteodystrophy), post-traumatic arthritis; osteoporosis workup (DEXA, calcium/vitamin D) is part of the treatment.'] },
    ],
  },
  {
    id: 'c-compartment', topicId: T2.fractures, name: 'Compartment Syndrome', kind: 'disease',
    summary: 'Rising pressure in a closed fascial space: pain OUT OF PROPORTION + pain on passive stretch — fasciotomy before 6 hours or Volkmann follows.',
    whyMatters: 'The diagnosis that separates good interns from disasters: analgesia-resistant pain is the earliest sign; pulselessness is LATE (by then muscle is dead). Exams love the 5 Ps, the tight-cast trap, the supracondylar-fracture-in-children context, and the Volkmann ischaemic contracture endgame.',
    mnemonic: 'The 5 Ps are LATE except PAIN: Pain (earliest, on passive stretch), Pressure/tense compartment, Paresthesia, then Pallor, Pulselessness, Paralysis = already necrotic.',
    difficulty: 2, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Aetiology & diagnosis', body: ['Fractures (supracondylar humerus in children, tibial shaft, forearm both-bones), crush, tight casts/dressings, burns, reperfusion, anticoagulation bleeds.', 'Diagnosis is CLINICAL: increasing analgesic requirement, pain on passive stretch (hallmark), tense swollen compartment, paraesthesia in the distal nerves.', 'Intra-compartmental pressure: within 30 mmHg of diastolic (or absolute >30–45 mmHg) supports fasciotomy; normotensive children with growing anxiety + analgesia escalation = treat, do not wait.'] },
      { h: 'Management & sequelae', body: ['Split/remove the cast immediately (first step even before imaging), elevate to heart level only, reassess within 30–60 min → emergency fasciotomy (two-incision four-compartment leg; volar/dorsal forearm).', 'After 6–8 hours of ischaemia: muscle necrosis → Volkmann ischaemic contracture (flexion deformity, claw hand in forearm), rhabdomyolysis → myoglobinuric renal failure (aggressive fluids, monitor K+).', 'NEVER: tight circumferential dressings over a swelling limb; ice does not treat compartment syndrome.'] },
    ],
  },
]

export const edgesExpanded: SeedEdge[] = [
  // Surgery links
  { from: 'c-inflamm', to: 'c-appendicitis', type: 'prerequisite_of', label: 'acute inflammation in action' },
  { from: 'c-ulcer', to: 'c-appendicitis', type: 'commonly_tested_with', label: 'epigastric-pain phase overlap' },
  { from: 'c-appendicitis', to: 'c-torsion', type: 'differential_of', label: 'RIF pain mimic in adolescent males' },
  { from: 'c-hernia', to: 'c-int-obstruction', type: 'causes', label: 'strangulated hernia' },
  { from: 'c-int-obstruction', to: 'c-shock', type: 'causes', label: 'fluid third-spacing' },
  { from: 'c-cholecystitis', to: 'c-ulcer', type: 'commonly_tested_with', label: 'RUQ vs epigastric pain maps' },
  { from: 'c-cholecystitis', to: 'c-shock', type: 'causes', label: 'cholangitis → septic shock' },
  { from: 'c-torsion', to: 'c-hernia', type: 'commonly_tested_with', label: 'acute inguinoscrotal swelling' },
  // Thyroid nodule links
  { from: 'c-thyroidphys', to: 'c-thyroidnodule', type: 'prerequisite_of', label: 'TSH-first logic' },
  { from: 'c-graves', to: 'c-thyroidnodule', type: 'commonly_tested_with', label: 'diffuse vs solitary swelling' },
  { from: 'c-thyroidnodule', to: 'c-neoplasia', type: 'related_to', label: 'malignancy red flags' },
  // Shock / sepsis web
  { from: 'c-sepsis', to: 'c-shock', type: 'causes', label: 'distributive shock' },
  { from: 'c-sepsis', to: 'c-aki', type: 'causes', label: 'septic AKI — commonest hospital cause' },
  { from: 'c-shock', to: 'c-trauma-primary', type: 'related_to', label: 'Circulation step of the primary survey' },
  { from: 'c-appendicitis', to: 'c-sepsis', type: 'causes', label: 'perforation → peritonitis' },
  // OBGY links
  { from: 'c-preec', to: 'c-eclampsia-mgmt', type: 'prerequisite_of', label: 'severe features → seizure protocol' },
  { from: 'c-preec', to: 'c-abruptio', type: 'causes', label: 'risk factor' },
  { from: 'c-previa', to: 'c-abruptio', type: 'differential_of', label: 'THE APH pair' },
  { from: 'c-previa', to: 'c-pph', type: 'causes', label: 'lower segment cannot contract' },
  { from: 'c-abruptio', to: 'c-shock', type: 'causes', label: 'hypovolemia + DIC' },
  { from: 'c-oxytocin', to: 'c-pph', type: 'treated_by', label: 'first-line uterotonic' },
  { from: 'c-partograph', to: 'c-pph', type: 'related_to', label: 'prolonged labour → atony' },
  { from: 'c-htn', to: 'c-eclampsia-mgmt', type: 'related_to', label: 'BP control in pregnancy' },
  // Paediatrics links
  { from: 'c-milestones', to: 'c-vaccines', type: 'related_to', label: 'well-child visit alignment' },
  { from: 'c-kwashmaras', to: 'c-milestones', type: 'causes', label: 'developmental delay' },
  { from: 'c-vaccines', to: 'c-imnci', type: 'related_to', label: 'child-survival programs' },
  { from: 'c-tof', to: 'c-ecg', type: 'diagnosed_by', label: 'RAD + RVH' },
  { from: 'c-tof', to: 'c-cardcycle', type: 'prerequisite_of', label: 'shunt & murmur physics' },
  // ENT / Ophtha links
  { from: 'c-bppv-meniere', to: 'c-ent-conductive', type: 'related_to', label: 'ENT localisation logic' },
  { from: 'c-otitis-media', to: 'c-ent-conductive', type: 'causes', label: 'conductive hearing loss' },
  { from: 'c-poag', to: 'c-betablock', type: 'treated_by', label: 'topical timolol' },
  { from: 'c-poag', to: 'c-diabretino', type: 'commonly_tested_with', label: 'silent causes of blindness' },
  { from: 'c-red-eye', to: 'c-poag', type: 'differential_of', label: 'congestive vs silent glaucoma' },
  // Psychiatry / Dermatology / Ortho links
  { from: 'c-schizo-frs', to: 'c-mdd', type: 'commonly_tested_with', label: 'psychosis vs mood discrimination' },
  { from: 'c-psoriasis', to: 'c-atopic-derm', type: 'differential_of', label: 'THE skin pair' },
  { from: 'c-psoriasis', to: 'c-inflamm', type: 'related_to', label: 'Th17/TNF chronic inflammation' },
  { from: 'c-compartment', to: 'c-colles', type: 'complication_of', label: 'forearm compartment (both-bones)' },
]

// ─── UNIVERSE EXPANSION (struggle-zone topics: the classic "most difficult" list) ───
export const topicsUniverse: SeedTopic[] = [
  { id: 't-phys-acidbase', subjectId: 'physiology', name: 'Acid-Base Balance', system: 'renal', importance: 5, description: 'pH defence lines, ABG interpretation — the single most feared physiology topic.' },
  { id: 't-bioch-glyco', subjectId: 'biochemistry', name: 'Glycogen Storage Diseases', importance: 4, description: 'Von Gierke to McArdle — enzymes, organs, lactic acidosis fingerprints.' },
  { id: 't-anat-brachial', subjectId: 'anatomy', name: 'Brachial Plexus', system: 'musculoskeletal', importance: 4, description: 'Roots-trunks-divisions-cords-branches — every exam favourite nerve map.' },
  { id: 't-anat-cranial', subjectId: 'anatomy', name: 'Cranial Nerve Nuclei & Lesions', system: 'neurology', importance: 4, description: 'Twelve nerves, their nuclei and the pupil/eye/gaze lesion vignettes.' },
  { id: 't-patho-coag', subjectId: 'pathology', name: 'Coagulation Cascade', system: 'hematology', importance: 5, description: 'Intrinsic vs extrinsic, PT/aPTT logic, anticoagulant targets.' },
  { id: 't-patho-immuno', subjectId: 'pathology', name: 'Immunodeficiency & Hypersensitivity', importance: 4, description: 'Types I–IV, B/T-cell defects, the classic infection-pattern clues.' },
  { id: 't-pharm-steroids', subjectId: 'pharmacology', name: 'Corticosteroids & Immunosuppressants', importance: 4, description: 'Potency ladder, steroid rules, calcineurin inhibitors, rejection.' },
  { id: 't-micro-immuno', subjectId: 'microbiology', name: 'Immunology Applied', system: 'infectious', importance: 4, description: 'Antibody classes, ELISA/Western logic, vaccine platform types.' },
  { id: 't-cm-biostat', subjectId: 'cm', name: 'Biostatistics Tests & Screening', importance: 5, description: 'Test selection grids, sensitivity/specificity, bias — the classic weak spot.' },
  { id: 't-fmt-toxicology', subjectId: 'fmt', name: 'Toxicology & Antidotes', importance: 4, description: 'Organophosphates, snake bite, heavy metals — the antidote ladder.' },
  { id: 't-rad-chestxray', subjectId: 'rad', name: 'Chest X-Ray & CT Patterns', system: 'respiratory', importance: 4, description: 'Silhouette sign, air-bronchogram, the 10 classic shadows.' },
  { id: 't-anes-crit', subjectId: 'anes', name: 'Airway, Relaxants & Malignant Hyperthermia', importance: 3, description: 'Depolarising vs non-depolarising, suxamethonium traps, MH crisis.' },
]

export const conceptsUniverse: SeedConcept[] = [
  {
    id: 'c-acidbase', topicId: 't-phys-acidbase', name: 'Acid-Base Disorders & ABG', kind: 'physiology',
    summary: 'pH 7.35–7.45 defended by buffers, lungs (minutes) and kidneys (days) — decode any gas in 5 steps.',
    whyMatters: 'Universally ranked the most difficult physiology topic because it cross-links renal physiology, pulmonology, medicine ICU care and pharmacology (diuretics, salicylates). NEET-PG asks mixed-gap vignettes every year, and ABG fluency is assumed in every ICU posting.',
    mnemonic: 'ROME: Respiratory Opposite, Metabolic Equal (pH vs pCO₂). Winters formula for metabolic acidosis compensation: expected pCO₂ = 1.5 × HCO₃⁻ + 8 ± 2.',
    difficulty: 5, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'The 5-step ABG walk', body: ['1) pH: acidemia (<7.35) or alkalemia (>7.45)?', '2) Primary disorder: pCO₂ moves opposite pH → respiratory; HCO₃⁻ moves with pH → metabolic.', '3) Compensation: acute vs chronic respiratory (HCO₃⁻ +1/−2 per 10 mmHg acute; +4 chronic), metabolic → Winters.', '4) Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻): normal 8–12; elevated → MUDPILES.', '5) Delta-delta: ΔAG vs ΔHCO₃⁻ exposes a second metabolic disorder.'] },
      { h: 'Classic fingerprints', body: ['Vomiting → hypochloremic hypokalemic metabolic ALKALOSIS (urine Cl⁻ low).', 'Diarrhoea → normal-AG hyperchloremic metabolic acidosis.', 'Type 1 RTA (distal): urine pH >5.5, stones; Type 2 (proximal): bicarbonaturia, Fanconi; Type 4: hyperkalemic, hypoaldosteronism — commonest.', 'Salicylates: respiratory alkalosis first, then high-AG acidosis.', 'Sepsis/shock: lactic (high-AG) acidosis — perfusion first, pH second.'] },
      { h: 'High-yield traps', body: ['Compensation never over-corrects — if pH is normal with abnormal gases, think mixed disorder.', 'Henderson-Hasselbalch mental check: pH 7.4 ⇒ HCO₃⁻ × pCO₂ ratio 20:1.', 'Diuretics: loops → metabolic alkalosis; acetazolamide → metabolic acidosis; spironolactone → hyperkalemic acidosis.'] },
    ],
  },
  {
    id: 'c-rta', topicId: 't-phys-acidbase', name: 'Renal Tubular Acidosis', kind: 'disease',
    summary: 'Three flavours of non-anion-gap acidosis — the urine pH and K⁺ separate them.',
    whyMatters: 'The classic "hard renal vignette": nephrolithiasis + alkaline urine (Type 1), Fanconi growth failure (Type 2), hyperkalemia + diabetic nephropathy (Type 4). Distinguishing them integrates GFR physiology, acid-base and drug effects.',
    mnemonic: 'Type 1 = Stones (distal, pH >5.5). Type 2 = proximal "two low" (HCO₃⁻, growth). Type 4 = Four K⁺ (hyperkalemia).',
    difficulty: 5, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Discriminator table', body: ['Type 1 (distal): cannot secrete H⁺; urine pH >5.5, hypokalemia, calcium phosphate stones, associated Sjögren/SLE, amphotericin B.', 'Type 2 (proximal): cannot reabsorb HCO₃⁻; urine pH variable (<5.5 once plasma HCO₃⁻ falls), hypokalemia, Fanconi (glucosuria, aminoaciduria, phosphaturia → rickets), carbonic anhydrase inhibitors.', 'Type 4: hypoaldosteronism (diabetic nephropathy, ACEi/spironolactone, heparin); hyperkalemia, mild acidosis, urine pH <5.5.'] },
    ],
  },
  {
    id: 'c-glycogen', topicId: 't-bioch-glyco', name: 'Glycogen Storage Diseases', kind: 'disease',
    summary: 'Twelve enzyme-deficiency syndromes — liver vs muscle vs heart maps the enzyme.',
    whyMatters: 'A pure memorisation trap that exams soften with clinical clues: fasting hypoglycemia + hepatomegaly (Von Gierke), exercise intolerance + no lactate rise (McArdle), infantile cardiomegaly (Pompe). Biochemistry, paediatrics and neurology all test it.',
    mnemonic: 'Very Apt Candidate Must Prepare Fors Exercise (types I–VI order) · McArdle = Muscle, myoglobinuria, lactate does NOT rise · Von Gierke = Glucose-6-phosphatase, Gout + hyperlipidemia.',
    difficulty: 4, examRelevance: 4, clinicalRelevance: 3,
    detail: [
      { h: 'The exam five', body: ['Type I Von Gierke — G6Pase — severe fasting hypoglycemia, hepatomegaly, lactic acidosis, hyperuricemia (gout), hyperlipidemia; treat with cornstarch.', 'Type II Pompe — acid α-glucosidase (lysosomal) — cardiomegaly + hypotonia in infancy; enzyme replacement exists.', 'Type III Cori — debrancher — milder hepatomegaly, normal lactate.', 'Type V McArdle — muscle glycogen phosphorylase — exercise cramps, second-wind phenomenon, no lactate rise on ischaemic forearm test, myoglobinuria.', 'Type IV Andersen — branching enzyme — cirrhosis in infancy.'] },
    ],
  },
  {
    id: 'c-brachial', topicId: 't-anat-brachial', name: 'Brachial Plexus Lesions', kind: 'anatomy',
    summary: 'C5–T1 mapped to five palsies — Erb, Klumpke, winging, claw, and the thoracic outlet trio.',
    whyMatters: 'The highest-yield anatomy topic in NEET-PG because every lesion is a ready-made vignette: shoulder dystocia (Erb C5-6), abduction-traction injury (Klumpke C8-T1 + Horner), thoracic outlet syndrome (T1 + sympathetic), and the waiter-tip posture is a one-line giveaway.',
    mnemonic: 'Randy Travis Drinks Cold Beer (Roots Trunks Divisions Cords Branches) · Erb = waiter-tip posture · Klumpke = claw hand + Horner · Long thoracic nerve → winged scapula (C5,6,7 raise your arm to heaven).',
    difficulty: 4, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Lesion atlas', body: ['Erb (upper, C5-C6): shoulder dystocia, waiter-tip posture — abduction/lateral rotation + flexion lost.', 'Klumpke (lower, C8-T1): upward traction (monkey grasp), intrinsic hand muscles; ± Horner (T1 preganglionic → refer for surgical exploration).', 'Thoracic outlet: lower trunk compressed by cervical rib — ulnar paraesthesia + Hand weakness + Horner variant.', 'Long thoracic (serratus anterior): mastectomy/post-op → winged scapula.', 'Axillary (surgical neck of humerus): deltoid + regimental badge anaesthesia.', 'Radial (midshaft humerus): wrist drop, triceps-sparing if below spiral groove? — triceps may be spared with distal lesions.'] },
    ],
  },
  {
    id: 'c-cranial', topicId: 't-anat-cranial', name: 'Cranial Nerve Lesions', kind: 'anatomy',
    summary: 'Twelve nerves, five exam vignettes: pupil, gaze, face, swallow, voice.',
    whyMatters: 'Neuroanatomy applied: III vs VI palsy localisation, Bell palsy (LMN — whole half of face) vs stroke (UMN — forehead spared), bulbar vs pseudobulbar palsy, and the Argyll Robertson vs Horner pupil table are repeat NEET-PG questions.',
    mnemonic: 'Oh Oh Oh To Touch And Feel Very Good Velvet, AH · "Down and out" eye = III palsy (sparing pupil = diabetic/ischaemic; blown pupil = compressive PCom aneurysm).',
    difficulty: 4, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'High-yield lesion logic', body: ['CN III: down-and-out eye, ptosis, pupil-involving = aneurysm (surgical), pupil-sparing = diabetic mononeuropathy.', 'CN VI: convergent squint — false localising sign (raised ICP).', 'CN VII: LMN (Bell) = forehead involved + hyperacusis + taste loss anterior two-thirds; UMN = forehead spared.', 'Bulbar (LMN IX-X-XII: fasciculating tongue) vs pseudobulbar (UMN: spastic tongue, emotional lability).', 'CN II fields: bitemporal hemianopia = chiasma (pituitary).', 'Argyll Robertson: accomodates, does not react (neurosyphilis); Adie: tonic, reacts to accommodation slowly.'] },
    ],
  },
  {
    id: 'c-coag', topicId: 't-patho-coag', name: 'Coagulation Cascade & Anticoagulants', kind: 'pathology',
    summary: 'Intrinsic (aPTT) vs extrinsic (PT) — and exactly where each anticoagulant cuts the web.',
    whyMatters: 'The highest-difficulty pathology topic: primary vs secondary haemostasis, PT/aPTT interpretation, mixing studies, and drug mechanisms (heparin-AT3, warfarin-vitamin K factors, DOACs) form one integrated exam question family — bleeding vignettes never stop appearing.',
    mnemonic: 'Play Outside Then Inside (Platelets Outside → PT extrinsic/Tissue factor → aPTT Intrinsic) · Warfarin = II, VII, IX, X + C & S ("We Need Care For Protein C & S") · Heparin potentiates Antithrombin III (IIa + Xa).',
    difficulty: 5, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'Cascade logic', body: ['Primary haemostasis: platelet plug (vWF adhesion → aggregation). Secondary: fibrin via coagulation factors.', 'Extrinsic (TF + VII) → PT/INR; Intrinsic (XII, XI, IX, VIII) → aPTT. Common path: X → II → fibrin.', 'PT only ↑ = extrinsic (VII def, warfarin, liver disease early); aPTT only ↑ = intrinsic (VIII/IX def — haemophilia, heparin, vWF, lupus anticoagulant); both ↑ = common path/liver failure/DIC.'] },
      { h: 'Drug targets & traps', body: ['UFH: IIa=Xa ratio 1:1, aPTT-monitored, HIT (platelet fall >50% → stop, switch to argatroban/fondaparinux), protamine reverses.', 'LMWH: Xa-biased, anti-Xa assay, safer re HIT, still protamine partial.', 'Warfarin: II VII IX X + protein C/S; takes days (protein C half-life short → transient hypercoagulability → bridge with heparin); skin necrosis; INR targets 2–3 (mech valve mitral 2.5–3.5); reversal = vitamin K ± PCC.', 'DOACs: rivaroxaban/apixaban (Xa), dabigatran (IIa) — fixed dosing, idarucizumab reverses dabigatran.', 'DIC: both PT/aPTT ↑ + D-dimer ↑ + platelets ↓ + fibrinogen ↓ — microthrombi + bleeding simultaneously.'] },
    ],
  },
  {
    id: 'c-hypersensitivity', topicId: 't-patho-immuno', name: 'Hypersensitivity & Immunodeficiency', kind: 'pathology',
    summary: 'Types I–IV reactions and the infection pattern that betrays each immunodeficiency.',
    whyMatters: 'Bridges pathology, microbiology and medicine: anaphylaxis (I), Goodpasture (II), serum sickness (III), contact dermatitis (IV) — then SCID/CVID/DiGeorge/CGD each present with a signature infection (encapsulated, fungal, catalase-positive). High memorisation load, near-guaranteed questions.',
    mnemonic: 'ACID: Allergy (I), Cytotoxic (II), Immune-complex (III), Delayed (IV) · CGD = Catalase-Glucose-Diatomic (S. aureus, Pseudomonas, Candida, Aspergillus — NBT test negative).',
    difficulty: 4, examRelevance: 4, clinicalRelevance: 4,
    detail: [
      { h: 'Type I–IV map', body: ['I IgE mast-cell (anaphylaxis, asthma, P-K reaction) — allergen-specific IgE, treatment: avoid + adrenaline.', 'II IgG/IgM cytotoxic (Goodpasture α3(IV) collagen, autoimmune haemolysis, ITP).', 'III immune complex (SLE, serum sickness, Arthus, PSGN) — complement, neutrophils, low C3/C4.', 'IV T-cell delayed (TB PPD 48–72 h, contact dermatitis, graft rejection) — no antibody.'] },
      { h: 'Deficiency fingerprints', body: ['Recurrent encapsulated (Pneumococcus) → asplenia/CVID/complement C3.', 'Recurrent Neisseria → terminal complement C5-9.', 'Recurrent catalase-positive (S. aureus, Aspergillus) → CGD.', 'T-cell defects (DiGeorge 22q11, SCID) → viral/fungal/protozoal (PCP).', 'X-linked bruton (BTK) — boys, after 6 months, no tonsils, no immunoglobulins.', 'IgA deficiency — commonest; transfusion anaphylaxis risk.'] },
    ],
  },
  {
    id: 'c-steroids', topicId: 't-pharm-steroids', name: 'Corticosteroid Pharmacology', kind: 'pharmacology',
    summary: 'Mineralo- vs glucocorticoid potency ladder, stress dosing rules, and steroid withdrawal traps.',
    whyMatters: 'Steroids touch every specialty — nephrotic syndrome, asthma, ITP, transplant, Addison — and exams test the relative potencies, the 5-R rules of tapering, and adrenal-crisis physiology. Wrong potency order = lost marks.',
    mnemonic: 'Potency (gluco): Cortisol → Prednisolone (×4) → Methylpred (×5) → Dexamethasone (×25, no mineralo). "Sick day rule": double oral steroid during intercurrent illness.',
    difficulty: 4, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Core rules', body: ['Relative potencies: hydrocortisone 1 / prednisolone 4 / methylprednisolone 5 / dexamethasone 25–30; mineralocorticoid order: fludrocortisone > hydrocortisone > prednisolone ≫ dexamethasone (~0).', 'Adrenal suppression: >3 weeks or >prednisolone 7.5 mg/day → never stop abruptly; taper by disease activity, not formula.', 'Dexamethasone suppresses own ACTH → a single-dose DST tests Cushing; dexamethasone also crosses blood-brain barrier best (cerebral oedema).', 'Steroid triad of chronic toxicity: osteoporosis, hyperglycemia, infections + avascular necrosis, cataract, myopathy (proximal).', 'Addison crisis: hydrocortisone 100 mg IV + fluids; Addison maintenance: hydrocortisone + fludrocortisone.'] },
    ],
  },
  {
    id: 'c-biostat', topicId: 't-cm-biostat', name: 'Biostatistical Tests & Screening', kind: 'concept',
    summary: 'Which test for which data, and why the 2×2 grid decides sensitivity vs specificity.',
    whyMatters: 'The most-hated CM topic and a guaranteed 3–5 marks: t-test/ANOVA/chi-square selection, type I vs II error, power, sensitivity/specificity/PVV trade-offs with prevalence, and screening biases (lead-time, length). Fluency converts fear into free marks.',
    mnemonic: 'SOFA for tests: (continuous, parametric, 2 groups) = t-test → 3+ groups ANOVA; categorical = chi-square; non-parametric = Mann-Whitney/Kruskal. SPin = Specific-Positive rules IN; SNout = Sensitive-Negative rules OUT.',
    difficulty: 4, examRelevance: 5, clinicalRelevance: 3,
    detail: [
      { h: 'Test-selection grid', body: ['Two means (normal) → unpaired t-test; paired data → paired t-test; 3+ groups → ANOVA.', 'Two proportions → chi-square (small n → Fisher exact).', 'Non-normal/ordinal → Mann-Whitney U, Wilcoxon, Kruskal-Wallis.', 'Correlation Pearson (normal) vs Spearman; regression predicts.', 'Type I (α, false positive) vs Type II (β, false negative); Power = 1 − β (target 80–90%).'] },
      { h: 'Screening mathematics', body: ['Sensitivity: detects disease when disease present (rule-out). Specificity: flags health when healthy (rule-in).', 'PPV rises with prevalence — low-prevalence screening → many false positives.', 'Lead-time bias: survival looks longer because detected earlier; length bias: indolent disease over-sampled; healthy-volunteer bias.'] },
    ],
  },
  {
    id: 'c-antidotes', topicId: 't-fmt-toxicology', name: 'Poisoning & Antidotes', kind: 'concept',
    summary: 'Organophosphates, snakebite, paracetamol, lead — every antidote with its window.',
    whyMatters: 'FMT highest-yield chapter AND an emergency skill: Indian tox wards run on organophosphate and snakebite protocols. Exams pair each poison with its antidote, decontamination window, and the empty-ventricle ECG of TCA overdose.',
    mnemonic: 'PAM for organophosphates (before ageing), Atropine for the muscarinic storm, NAC for paracetamol, Naloxone for opioids, Flumazenil for benzos, Fomepizole for methanol/ethylene glycol, Deferoxamine for iron, DMSO(BAL/DMSA) for heavy metals.',
    difficulty: 4, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'The exam antidote table', body: ['Organophosphate: atropine (2–5 mg IV doubling until drying) + pralidoxime (within hours, before AChE ageing); midriasic atropine never reversed by physostigmine in practice.', 'Snakebite: polyvalent ASV after 20WBCT confirms envenomation; neostigmine for neurotoxic ptosis; watch for ASV reactions; no tourniquet/no incision.', 'Paracetamol: N-acetylcysteine (Rumack-Matthew nomogram, 150 mg/kg load); biggest risk >150 mg/kg.', 'Opioid: naloxone (short t½ → re-sedation). Benzo: flumazenil (seizure risk in mixed/TCA).', 'Methanol: fomepizole ± ethanol + folate (formic acid → blindness).', 'Iron: deferoxamine (serum iron >500). Lead: BAL/DMSA/succimer; arsenic/mercury: BAL, DMSA.'] },
      { h: 'Pattern recognition', body: ['TCAs: wide QRS → sodium bicarbonate.', 'Carbon monoxide: cherry-red skin, pulse oximetry normal but SpO₂ misleading → hyperbaric O₂.', 'Organochlorine: seizures; hydrocarbon: no gastric lavage (aspiration).', 'Cholinergic crisis Mnemonic SLUDGE/ killer Bs.'] },
    ],
  },
  {
    id: 'c-cxr', topicId: 't-rad-chestxray', name: 'Chest X-Ray Pattern Reading', kind: 'investigation',
    summary: 'Silhouette sign, air bronchogram, and the ten shadows every viva expects.',
    whyMatters: 'Radiology is new to many students but the CXR pattern list is pure yield: lobar vs whole-lung collapse, pleural vs parenchymal opacity, the "white-out with mediastinal shift" decision tree, and classic signs tested verbatim.',
    mnemonic: 'ABCDE approach (Airway-Bones-Cardiac-Diaphragm-Everything) · Silhouette sign: loss of border = same plane (RML obscures right heart border; lingula also touches left heart border; lower lobe hides diaphragm but spares the heart border).',
    difficulty: 3, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Pattern table', body: ['Lobar consolidation: air bronchogram, no volume loss; may obscure heart border per lobar position.', 'Collapse: displacement — trachea/mediastinum TOWARD opacity; total lung collapse vs massive effusion (pushes AWAY) is the exam binary.', 'Pneumothorax: visceral pleural line + absent peripheral markings; tension = tracheal push + hemodynamic collapse → needle decompression.', 'Cavitation: TB (apical), squamous ca, abscess (air-fluid), Klebsiella, staph (children).', 'Miliary: 1–3 mm nodules — TB, metastases, silicosis.', 'Bat-wing perihilar oedema + Kerley B lines = pulmonary oedema (cardiomegaly).'] },
    ],
  },
  {
    id: 'c-airway', topicId: 't-anes-crit', name: 'Airway, Neuromuscular Blockade & MH', kind: 'clinical_skill',
    summary: 'Rapid-sequence logic, suxamethonium traps, reversal agents, malignant hyperthermia.',
    whyMatters: 'The anaesthesia content NEET-PG actually asks: depolarising vs non-depolarising relaxants, suxamethonium contraindications (hyperkalemia, burns, MH, myopathies), sugammadex reversal, and the dantrolene answer to malignant hyperthermia in the OT.',
    mnemonic: 'Suxamethonium "4 no-s": No hyperK, No burns/ crush >48h, No MH history, No neuromuscular disease · Dantrolene for MH (ryanodine receptor).',
    difficulty: 4, examRelevance: 3, clinicalRelevance: 5,
    detail: [
      { h: 'NMJ pharmacology', body: ['Depolarising: suxamethonium — phase I block (no fade, augmented by cholinesterase inhibitors), fasciculations, hyperkalemia, raised IOP, MH trigger.', 'Non-depolarising (curare, vec, roc, atracurium): competitive — fade on train-of-four, REVERSED by neostigmine (± glycopyrrolate) or sugammadex (roc/vec selective).', 'Atracurium: Hoffman elimination (pH/temperature) — safe in renal failure; laudanosine.', 'Malignant hyperthermia: autosomal dominant ryanodine/RYR1; rising ETCO₂ + tachycardia + rigidity + temp (late); stop volatile + sux, dantrolene 2.5 mg/kg + cooling.'] },
      { h: 'RSI and airway', body: ['RSI: preoxygenation, cricoid pressure (Sellick), induction + sux; "empty stomach" assumptions; failed airway plan (LMA → FONA).', 'Mallampati class I–IV predicts difficulty; thyromental distance <6 cm hard airway.', 'Laryngospasm: 100% O₂ + CPAP ± sux 25 mg.'] },
    ],
  },
  {
    id: 'c-arrhythmia', topicId: T.acs, name: 'Arrhythmia Interpretation', kind: 'disease',
    summary: 'Narrow vs wide, regular vs irregular — the four-grid route to any ECG rhythm strip.',
    whyMatters: 'The most-difficult medicine skill on exams: AF vs flutter, SVT vs sinus tach, VT vs SVT-with-aberrancy, complete heart block degrees, and drug choices (adenosine, amiodarone, adenosine-first in stable SVT) are asked year after year.',
    mnemonic: 'Irregular narrow = AF (or MAT) · Regular narrow = SVT (adenosine) · Wide + pulseless = VT → shock · Chaotic lines = VF → shock · "Atrial kick lost" → anticoagulate (CHADS-VASc).',
    difficulty: 4, examRelevance: 5, clinicalRelevance: 5,
    detail: [
      { h: 'The 2×2 rhythm grid', body: ['Narrow-regular: sinus tach, SVT (AVNRT — P buried), atrial flutter (sawtooth 300/2 or 4).', 'Narrow-irregular: AF (no P, fibrillatory baseline), MAT (≥3 P morphologies — COPD).', 'Wide-regular: VT until proven otherwise (fusion/capture beats), SVT with BBB, hyperkalemia sine wave.', 'Wide-irregular: AF with aberrancy, polymorphic VT (torsades — QT-prolonging drugs, Mg²⁺ first).'] },
      { h: 'Blocks & emergencies', body: ['AV block: Mobitz I (Wenckebach — PR stretch, usually benign) vs II (dropped without warning → pacemaker territory).', 'Complete: AV dissociation, cannon A waves, rate 30–45 → pacemaker.', 'Stable SVT: vagal → adenosine 6→12 mg; unstable: synchronised cardioversion.', 'AF: rate control (β-blocker/CCB, digoxin in HF), anticoagulation by CHA₂DS₂-VASc; >48 h uncontrolled → 3-week anticoagulation or TOE-guided cardioversion.'] },
    ],
  },
  {
    id: 'c-genetics', topicId: T.pedsNephro, name: 'Inheritance Patterns & Pedigrees', kind: 'concept',
    summary: 'AD, AR, XLR, mitochondrial — read the pedigree, name the syndrome.',
    whyMatters: 'A genetics question family that spans biochemistry, paediatrics, medicine and OBGY counselling: male-to-male transmission = AD; skipped generations = AR; no father-to-son = X-linked; mothers-only transmission = mitochondrial (MELAS, LHON).',
    mnemonic: 'AD = "A Dominant family album" (Huntington, Marfan, NF, PKD-adult) · AR = "silent carriers" (CF, sickle, thalassemia, PKU) · XLR = "Knight moves" (DMD, haemophilia A/B, G6PD) · Mitochondrial = "motherline" + heteroplasmy.',
    difficulty: 4, examRelevance: 4, clinicalRelevance: 3,
    detail: [
      { h: 'Pattern rules', body: ['AD: vertical, male-to-male possible, variable expressivity (NF-1), delayed age of onset (Huntington CAG — anticipation).', 'AR: horizontal, consanguinity flag, 25% recurrence; carriers unaffected.', 'X-linked recessive: sons of carrier 50%; no male-to-male; skewed severity (Lyonisation in females).', 'X-linked dominant: Rett, incontinentia pigmenti (male lethal).', 'Mitochondrial: maternal, variable heteroplasmy — MELAS, MERRF, LHON, aminoglycoside ototoxicity (12S rRNA).', 'Trinucleotide repeats: Huntington (CAG), Fragile X (CGG, anticipation through females), myotonic dystrophy (CTG).'] },
    ],
  },
  {
    id: 'c-fluids', topicId: T.pedsNephro, name: 'Paediatric Fluids & Dehydration', kind: 'clinical_skill',
    summary: 'WHO plans A/B/C, deficit maths, and why hypo-osmolar ORS changed the game.',
    whyMatters: 'The most-tested paediatrics practical topic: assessment of dehydration (% loss), WHO treatment plans, maintenance 4-2-1 vs Holiday-Segar, and ORS osmolarity trivia — asked as both calculations and vignettes.',
    mnemonic: 'Some Dehydration (6–9%): Plan B 75 ml/kg over 4 h · Severe (≥10%): Plan C — 30 ml/kg in 1 h (infants) then 70 ml/kg in 2.5 h · Maintenance: 100/50/25 (Holiday-Segar per kg split).',
    difficulty: 3, examRelevance: 4, clinicalRelevance: 5,
    detail: [
      { h: 'Assessment & plans', body: ['Signs: lethargy, sunken eyes, skin pinch (slow ≥2 s), absent tears, decreased urine — map to none/some/severe.', 'Plan C shock bolus: 20 ml/kg NS (or Ringer lactate), reassess; then deficit replacement per WHO table.', 'ORS low-osmolar (245 mOsm/L, Na 75) — reduces stool output & vomiting vs old 311.', 'Zinc 20 mg × 14 days reduces duration; continue feeding; no anti-motility in children.', 'Maintenance: 4 ml/kg/h first 10 kg + 2 next 10 + 1 each after (4-2-1 rule).'] },
    ],
  },
]

export const edgesUniverse: SeedEdge[] = [
  // Acid-base web
  { from: 'c-gfr', to: 'c-acidbase', type: 'prerequisite_of', label: 'filtrate → buffer logic' },
  { from: 'c-acidbase', to: 'c-rta', type: 'prerequisite_of', label: 'non-gap acidosis family' },
  { from: 'c-acidbase', to: 'c-aki', type: 'related_to', label: 'uraemic acidosis' },
  { from: 'c-diuretics', to: 'c-acidbase', type: 'causes', label: 'alkalosis/acidosis by class' },
  { from: 'c-acidbase', to: 'c-hyperk', type: 'causes', label: 'K⁺-pH see-saw' },
  { from: 'c-dka', to: 'c-acidbase', type: 'causes', label: 'high-AG acidosis' },
  { from: 'c-rta', to: 'c-nephrotic', type: 'commonly_tested_with', label: 'renal differential maps' },
  // Coagulation web
  { from: 'c-coag', to: 'c-acei', type: 'commonly_tested_with', label: 'drug safety monitoring pairs' },
  { from: 'c-coag', to: 'c-leukemia', type: 'related_to', label: 'AML-DIC' },
  { from: 'c-abruptio', to: 'c-coag', type: 'causes', label: 'obstetric DIC' },
  { from: 'c-sepsis', to: 'c-coag', type: 'causes', label: 'sepsis-induced coagulopathy' },
  // Immuno web
  { from: 'c-hypersensitivity', to: 'c-inflamm', type: 'prerequisite_of', label: 'acute → immune-mediated' },
  { from: 'c-hypersensitivity', to: 'c-psoriasis', type: 'related_to', label: 'Th17 chronic type IV-like' },
  { from: 'c-hypersensitivity', to: 'c-nephritic', type: 'causes', label: 'type III PSGN' },
  { from: 'c-vaccines', to: 'c-hypersensitivity', type: 'related_to', label: 'platform immunology' },
  // Steroids
  { from: 'c-steroids', to: 'c-nephrotic', type: 'treated_by', label: 'first-line steroid-sensitive' },
  { from: 'c-steroids', to: 'c-asthma-copd', type: 'treated_by', label: 'ICS + exacerbations' },
  { from: 'c-cushing', to: 'c-steroids', type: 'causes', label: 'iatrogenic Cushing' },
  // Biostat + CM
  { from: 'c-biostat', to: 'c-epidesign', type: 'prerequisite_of', label: 'design → analysis' },
  { from: 'c-biostat', to: 'c-vaccines', type: 'related_to', label: 'program evaluation' },
  // Toxicology
  { from: 'c-antidotes', to: 'c-shock', type: 'related_to', label: 'toxic shock states' },
  { from: 'c-antidotes', to: 'c-trauma-primary', type: 'related_to', label: 'ABCDE in poisoning' },
  // Radiology + anaesthesia
  { from: 'c-cxr', to: 'c-asthma-copd', type: 'diagnosed_by', label: 'hyperinflation' },
  { from: 'c-cxr', to: 'c-tb', type: 'diagnosed_by', label: 'apical cavitary lesion' },
  { from: 'c-cxr', to: 'c-heartfail', type: 'diagnosed_by', label: 'pulmonary oedema' },
  { from: 'c-airway', to: 'c-shock', type: 'prerequisite_of', label: 'airway-before-circulation' },
  { from: 'c-hyperk', to: 'c-airway', type: 'related_to', label: 'suxamethonium contraindication' },
  // Arrhythmia + ECG
  { from: 'c-ecg', to: 'c-arrhythmia', type: 'prerequisite_of', label: 'waves → rhythm reading' },
  { from: 'c-arrhythmia', to: 'c-ami', type: 'commonly_tested_with', label: 'post-MI arrhythmia' },
  { from: 'c-hyperk', to: 'c-arrhythmia', type: 'causes', label: 'wide-complex brady' },
  { from: 'c-betablock', to: 'c-arrhythmia', type: 'treated_by', label: 'rate control' },
  // Genetics + peds
  { from: 'c-genetics', to: 'c-tof', type: 'related_to', label: '22q11 conotruncal link' },
  { from: 'c-genetics', to: 'c-milestones', type: 'related_to', label: 'syndromic delay' },
  { from: 'c-fluids', to: 'c-aki', type: 'causes', label: 'prerenal dehydration' },
  { from: 'c-fluids', to: 'c-imnci', type: 'related_to', label: 'Plan A/B/C framework' },
  // Anatomy struggle links
  { from: 'c-brachial', to: 'c-colles', type: 'related_to', label: 'median nerve territory' },
  { from: 'c-brachial', to: 'c-compartment', type: 'related_to', label: 'forearm nerve deficits' },
  { from: 'c-cranial', to: 'c-bppv-meniere', type: 'related_to', label: 'vestibulocochlear territory' },
  { from: 'c-cranial', to: 'c-red-eye', type: 'related_to', label: 'III/VI pupil & gaze' },
  // Biochem link
  { from: 'c-glycogen', to: 'c-insulin', type: 'related_to', label: 'glycogen ↔ glucose homeostasis' },
]

export const allConcepts = [...concepts, ...conceptsExtra, ...conceptsCoverage, ...conceptsClinical, ...conceptsUniverse]

export const allEdges = [...edges, ...edgesExpanded, ...edgesUniverse].filter(
  (e, i, arr) => !e.to.includes('none') && arr.findIndex(x => x.from === e.from && x.to === e.to) === i,
)
