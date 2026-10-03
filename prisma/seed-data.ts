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

export const allEdges = edges.filter(e => !e.to.includes('none'))

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

export const allConcepts = [...concepts, ...conceptsExtra, ...conceptsCoverage]
