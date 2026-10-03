// ─── MEDOS CLINICAL CASE SIMULATOR ───
// Progressive-reveal interactive cases. All content original.

export interface SeedCaseStep {
  id: string; phase: string; title: string; content: string[];
  question?: string; options?: string[]; answerId?: number; teaching?: string;
}
export interface SeedCase {
  id: string; title: string; specialty: string; system: string; difficulty: number;
  patient: { age: string; sex: string; occupation: string; complaint: string };
  steps: SeedCaseStep[]; learning: string[]; diagnosis: string;
}

export const cases: SeedCase[] = [
  {
    id: 'case-graves', title: 'The Professor Who Cannot Sit Still', specialty: 'Endocrinology', system: 'endocrine', difficulty: 2,
    diagnosis: "Graves' disease (diffuse toxic goiter)",
    patient: { age: '34', sex: 'Female', occupation: 'School teacher', complaint: 'Weight loss, palpitations, tremor — 2 months' },
    steps: [
      {
        id: 's1', phase: 'HISTORY', title: 'Presenting complaints',
        content: ['A 34-year-old school teacher reports 8 kg weight loss despite increased appetite over 2 months.', 'She feels "her heart racing", sweats excessively, and colleagues say she seems anxious and irritable.', 'Her periods have become scanty. She has no chest pain, no fever, no travel history.'],
        question: 'Which single follow-up question would most sharpen your differential right now?',
        options: ['"Any change in your bowel habits?"', '"Do you have a family history of diabetes?"', '"Have you traveled to an endemic area?"', '"Any recreational drug use?"'],
        answerId: 0, teaching: 'Weight loss + heat intolerance + palpitations + oligomenorrhea → thyrotoxicosis until excluded; diarrhea/AI thyroid history support Graves (autoimmune clustering).',
      },
      {
        id: 's2', phase: 'VITALS', title: 'On examination — vitals',
        content: ['BP 138/62 mmHg (wide pulse pressure), pulse 118/min regular, low-volume warm hands.', 'Temperature 37.8°C, RR 18, SpO2 98% room air.', 'Weight 46 kg (was 54 kg in records).'],
        question: 'The wide pulse pressure with tachycardia primarily reflects:',
        options: ['Decreased afterload from vasodilation + increased stroke volume', 'Aortic stenosis', 'Pericardial tamponade', 'Hypovolemia'],
        answerId: 0, teaching: 'Thyroid hormone ↑β-adrenergic sensitivity and lowers SVR → bounding pulses, wide pulse pressure, high-output state.',
      },
      {
        id: 's3', phase: 'EXAMINATION', title: 'General & systemic examination',
        content: ['Diffuse, smooth, nontender goiter ~2× normal; faint bruit audible over it.', 'Lid lag present; eyes proptosed bilaterally with stare; no diplopia.', 'Fine tremor of outstretched hands; proximal muscle power 4/5.', 'Pretibial firm, erythematous plaque-like swelling.'],
        question: 'The combination of thyroid bruit + exophthalmos + pretibial myxedema indicates:',
        options: ['Toxic multinodular goiter', "Graves' disease", 'Subacute thyroiditis', 'Factitious thyrotoxicosis'],
        answerId: 1, teaching: 'Eye disease + dermopathy are PATHOGNOMONIC of Graves — TSH-R stimulating antibodies act on orbital fibroblasts and dermis, not on nodular tissue.',
      },
      {
        id: 's4', phase: 'LABORATORY', title: 'Thyroid profile',
        content: ['TSH: <0.01 µIU/mL (0.35–5.5). Free T4: 3.1 ng/dL (0.8–1.8). Free T3: 9.2 pg/mL (2.0–4.4).', 'Radioiodine uptake at 24 h: 62% (diffuse, uniform).', 'TSH receptor antibodies (TRAb): strongly positive.'],
        question: 'The diffuse high uptake distinguishes Graves from which important mimic?',
        options: ['Toxic adenoma (hot nodule)', 'Painless (silent) thyroiditis', 'Toxic multinodular goiter', 'All of the above show LOW uptake in contrast'],
        answerId: 1, teaching: 'Thyroiditis releases preformed hormone with a DESTROYED gland → uptake near zero. Graves floods with uniform uptake; TMNG is patchy.',
      },
      {
        id: 's5', phase: 'MANAGEMENT', title: 'Treatment planning',
        content: ['She is planning pregnancy next year. Symptom control and rapid control of hormone synthesis are needed first.', 'You counsel about three definitive paths: thionamides, radioiodine, surgery.'],
        question: 'Which sequence correctly treats her thyrotoxic symptoms today?',
        options: ['Radioiodine now, propranolol later', 'Propranolol for symptoms + methimazole to block synthesis', 'Iodine first, then propranolol', 'PTU + immediate thyroidectomy'],
        answerId: 1, teaching: 'β-blocker controls adrenergic symptoms immediately; methimazole blocks TPO (preferred outside pregnancy). Iodine NEVER before thionamide (fuels synthesis). Radioiodine worsens ophthalmopathy and is contraindicated in planned pregnancy.',
      },
      {
        id: 's6', phase: 'REPORT', title: 'Clinical reasoning report',
        content: ['You connected a multi-system presentation to one autoimmune axis — the classic intern-level integration.', 'Review: thyrotoxicosis differentials by uptake scan; Graves management ladder; thyroid storm blocks.'],
      },
    ],
    learning: [
      'Eye disease + pretibial myxedema are specific to Graves (not other hyperthyroidism).',
      'High diffuse uptake = Graves; zero uptake = thyroiditis/factitious.',
      'In thyroid storm: block (PTU) BEFORE flood (iodine) — always.',
      'Pregnancy planning shifts choices: PTU first trimester, no radioiodine.',
    ],
  },
  {
    id: 'case-nephrotic', title: 'The Boy With Swollen Eyes Every Morning', specialty: 'Nephrology / Paediatrics', system: 'renal', difficulty: 2,
    diagnosis: 'Nephrotic syndrome — likely minimal change disease',
    patient: { age: '7', sex: 'Male', occupation: 'Student', complaint: 'Periorbital swelling and abdominal distension — 10 days' },
    steps: [
      {
        id: 's1', phase: 'HISTORY', title: 'Presenting complaints',
        content: ['A 7-year-old boy has periorbital swelling worst in the mornings, progressing to abdominal distension.', 'Urine is frothy; volumes reduced. No red urine, no fever, no sore throat in recent weeks.', 'Past history unremarkable; immunizations complete.'],
        question: 'Frothy urine + morning periorbital edema in a child most strongly suggests:',
        options: ['Acute glomerulonephritis', 'Nephrotic-range proteinuria', 'Hepatic cirrhosis', 'Malnutrition (kwashiorkor)'],
        answerId: 1, teaching: 'Frothy urine = proteinuria. Periorbital (dependent by night) edema in children + normal BP history points nephrotic > nephritic.',
      },
      {
        id: 's2', phase: 'EXAMINATION', title: 'Vitals & examination',
        content: ['BP 100/62 (normal for age), pulse 92. Weight up 3 kg from records.', 'Periorbital puffiness, sacral edema, ascites with shifting dullness; bilateral pedal edema.', 'No rash, no arthritis, JVP not raised; chest clear.'],
        question: 'Normal BP with anasarca favors which pattern?',
        options: ['Nephrotic syndrome', 'Nephritic syndrome', 'Both equally', 'Neither — suggests cardiac cause'],
        answerId: 0, teaching: 'Nephritic = inflamed glomeruli → hypertension, hematuria. Nephrotic = leaky but quiet glomeruli → protein loss, edema, usually normal BP early.',
      },
      {
        id: 's3', phase: 'LABORATORY', title: 'Urine & blood',
        content: ['Urinalysis: protein 4+, no blood, no casts; 24 h protein 4.8 g/day.', 'Serum albumin 1.7 g/dL; cholesterol 310 mg/dL; C3 normal.', 'Creatinine 0.6 mg/dL (normal). ASO titer negative.'],
        question: 'Which finding is the strongest argument against post-infectious glomerulonephritis?',
        options: ['Normal C3', 'Absence of hematuria/RBC casts', 'High cholesterol', 'Normal creatinine'],
        answerId: 1, teaching: 'Post-strep GN is a NEPHRITIC disease: hematuria with RBC casts + low C3. Bland heavy proteinuria is the nephrotic signature.',
      },
      {
        id: 's4', phase: 'DECISION', title: 'Biopsy or treat?',
        content: ['The team debates renal biopsy versus empirical steroids.', 'He is 7 years old, nephrotic picture, normal renal function, no hematuria, normal complement.'],
        question: 'The most appropriate next step is:',
        options: ['Renal biopsy immediately', 'Empirical prednisolone with response monitoring (biopsy only if atypical/steroid-resistant)', 'Cyclophosphamide first', 'ACE inhibitor monotherapy'],
        answerId: 1, teaching: 'In children 2–12 with idiopathic nephrotic syndrome and no atypical features, MCD is so likely that empirical steroids precede biopsy; biopsy is reserved for steroid resistance, relapse with atypical features, or age <1/>12.',
      },
      {
        id: 's5', phase: 'COMPLICATION', title: 'A complication emerges',
        content: ['On day 5 he develops left flank pain, mild fever, and hematuria appears; proteinuria worsens.', 'Doppler ultrasound: absent flow in left renal vein.'],
        question: 'The hypercoagulability underlying this complication is chiefly due to:',
        options: ['Thrombocytosis', 'Urinary loss of antithrombin III', 'Steroid therapy', 'Hemoconcentration alone'],
        answerId: 1, teaching: 'Renal vein thrombosis is a feared nephrotic complication — antithrombin III (and C/S proteins) lost in urine; albumin <2 g/dL raises VTE risk further.',
      },
      {
        id: 's6', phase: 'REPORT', title: 'Clinical reasoning report',
        content: ['Key discriminators practiced: nephrotic vs nephritic, biopsy thresholds in children, complication recognition.', 'Recommended revision: glomerular disease table, nephrotic complications, MCD course.'],
      },
    ],
    learning: [
      'Morning periorbital edema + frothy urine + normal BP = nephrotic syndrome in children.',
      'Children 2–12: treat empirically with steroids; biopsy only if atypical or steroid-resistant.',
      'Antithrombin III loss → renal vein thrombosis; screen with Doppler when symptoms shift.',
      'Loss of IgG/complement factor B → pneumococcal peritonitis risk (encapsulated organisms).',
    ],
  },
  {
    id: 'case-ami', title: 'Chest Pain at the Wedding', specialty: 'Cardiology / Emergency', system: 'cardiovascular', difficulty: 3,
    diagnosis: 'Acute inferior STEMI (RCA occlusion)',
    patient: { age: '58', sex: 'Male', occupation: 'Shopkeeper', complaint: 'Crushing chest pain — 40 minutes' },
    steps: [
      {
        id: 's1', phase: 'PRESENTATION', title: 'Emergency arrival',
        content: ['A 58-year-old man, diabetic, smoker, collapses with crushing retrosternal chest pain 40 minutes ago at a family wedding.', 'Pain radiates to left arm; associated with sweating and vomiting.', 'He says he "felt something was wrong" for two days — episodic chest tightness on walking.'],
        question: 'The two-day prodrome of exertional tightness before a prolonged resting pain suggests:',
        options: ['Stable angina only', 'Unstable angina progressing to acute coronary syndrome', 'GERD', 'Musculoskeletal pain'],
        answerId: 1, teaching: 'New/worsening exertional angina → crescendo pattern → rest pain = unstable angina; persistent rest pain with necrosis markers/ST changes = evolving MI. Plaque rupture is the final event.',
      },
      {
        id: 's2', phase: 'VITALS & ECG', title: 'Vitals and the 10-minute ECG',
        content: ['BP 96/60, pulse 52/min regular, SpO2 94%, RR 20.', 'ECG: ST elevation 3 mm in II, III, aVF; ST depression in I, aVL; sinus bradycardia.', 'Right-sided leads show ST elevation in V4R.'],
        question: 'The ECG localizes the infarct and predicts the bradycardia. Which artery and node are involved?',
        options: ['LAD — SA node', 'RCA — AV node (and possibly SA node)', 'LCx — AV node only', 'Left main — both'],
        answerId: 1, teaching: 'II, III, aVF = inferior (RCA ~85%). RCA supplies the AV node in 90% (SA node 60%) → bradyarrhythmias, heart block. V4R elevation = RV infarct — preload-dependent: avoid nitrates!',
      },
      {
        id: 's3', phase: 'DECISION', title: 'Reperfusion strategy',
        content: ['The nearest PCI-capable centre is 35 minutes away (door-to-balloon achievable).', 'Hospital has a cath lab but the interventionalist is 20 minutes from arrival.'],
        question: 'Given achievable door-to-balloon ≤90 minutes, the correct strategy is:',
        options: ['Fibrinolysis now (faster in this setting)', 'Primary PCI (preferred over lysis when achievable in time)', 'Thrombolysis + transfer for rescue PCI in all cases', 'Conservative management with heparin'],
        answerId: 1, teaching: 'Primary PCI is superior to fibrinolysis when door-to-balloon ≤120 min (ideally 90). Lysis is for when timely PCI is unavailable. RV infarct + hypotension: fluids before any nitrate.',
      },
      {
        id: 's4', phase: 'PHARMACOLOGY', title: 'Adjunct therapy',
        content: ['He receives chewable aspirin 300 mg, ticagrelor loading, and anticoagulation en route to the lab.'],
        question: 'Why is aspirin CHEWED rather than swallowed whole?',
        options: ['Chewing prevents vomiting', 'Chewed aspirin is absorbed faster via buccal mucosa and accelerates antiplatelet effect', 'Chewing reduces bleeding risk', 'It is only tradition'],
        answerId: 1, teaching: 'Time-to-inhibition matters in STEMI — chewing speeds absorption (enteric coating delays it). Every minute of occluded myocardium costs myocytes: "time is muscle".',
      },
      {
        id: 's5', phase: 'COMPLICATION', title: 'Day 4 — a new sound',
        content: ['Day 4 post-PCI: sudden pulmonary edema with a harsh pansystolic murmur and palpable precordial thrill.', 'Echo: left-to-right jet at the interventricular septum.'],
        question: 'The diagnosis and mechanism are:',
        options: ['Papillary muscle rupture — acute MR', 'Ventricular septal rupture — acquired L→R shunt', 'Free wall rupture — tamponade', 'Dressler syndrome'],
        answerId: 1, teaching: 'VSR: 3–7 days post-MI, pansystolic murmur + THRILL + step-up O2 at RV. Papillary rupture gives severe MR (no thrill); free-wall rupture = tamponade/sudden death.',
      },
      {
        id: 's6', phase: 'REPORT', title: 'Clinical reasoning report',
        content: ['You exercised the full ACS chain: risk factors → plaque rupture → ECG localization → reperfusion timing → complication timeline.', 'Weak points to revise: RV infarct hemodynamics, post-MI complication timeline.'],
      },
    ],
    learning: [
      'Inferior MI (II, III, aVF) = RCA; expect bradycardia/blocks; check V4R for RV infarct (no nitrates).',
      'Primary PCI > lysis when door-to-balloon ≤90–120 min.',
      'Chew aspirin — absorption speed is survival.',
      'Pansystolic murmur + thrill 3–7 days post-MI = ventricular septal rupture.',
    ],
  },
  {
    id: 'case-dka', title: 'The Intern Who Stopped Insulin', specialty: 'Internal Medicine / Endocrine Emergency', system: 'endocrine', difficulty: 3,
    diagnosis: 'Diabetic ketoacidosis (new-onset T1DM)',
    patient: { age: '21', sex: 'Female', occupation: 'Medical intern', complaint: 'Vomiting, deep breathing, confusion — 1 day' },
    steps: [
      {
        id: 's1', phase: 'PRESENTATION', title: 'History',
        content: ['A 21-year-old medical intern reports 3 weeks of polyuria, polydipsia and 6 kg weight loss.', 'Since morning: repeated vomiting, deep sighing breathing, abdominal pain; roommates say she seemed "confused".', 'No medications, no drug history; family history: cousin with "sugar disease".'],
        question: 'Deep sighing (Kussmaul) breathing here represents:',
        options: ['Anxiety hyperventilation', 'Respiratory compensation for metabolic acidosis', 'Aspirin intoxication', 'Pulmonary embolism'],
        answerId: 1, teaching: 'Kussmaul respiration blows off CO2 to compensate for ketoacidosis (Winter formula: expected pCO2 ≈ 1.5×HCO3 + 8 ± 2). Abdominal pain in DKA can mimic surgical abdomen.',
      },
      {
        id: 's2', phase: 'EXAMINATION', title: 'Examination',
        content: ['BP 94/58, pulse 122, RR 28 deep, temp 36.8°C; GCS 14.', 'Dry mucous membranes, sunken eyes; breath has fruity (acetone) odor.', 'Abdomen soft, diffuse tenderness, no guarding.'],
        question: 'The fruity breath odor reflects:',
        options: ['Uremia', 'Acetone (a ketone body) exhalation', 'Alcohol', 'Fecal odor from obstruction'],
        answerId: 1, teaching: 'Acetone is volatile — exhaled ketone. Uremia is urinous/ammoniac; fetor hepaticus is musty.',
      },
      {
        id: 's3', phase: 'LABORATORY', title: 'Bedside and labs',
        content: ['Urine: glucose 4+, ketones 3+. VBG: pH 7.02, HCO3 6 mEq/L. Glucose 512 mg/dL.', 'Na 132, K 5.6, Cl 100; anion gap 26. Creatinine 1.1.'],
        question: 'Serum potassium is 5.6 — the team must remember that total body potassium is actually:',
        options: ['High, as serum suggests', 'Depleted — acidosis and insulin lack have shifted K out of cells', 'Normal', 'Unpredictable'],
        answerId: 1, teaching: 'The most dangerous misconception in DKA: serum K is normal/high while TOTAL body K is low. Insulin will drive K into cells → replace once K <5.2–5.3 with urine flow, or fatal arrhythmias follow.',
      },
      {
        id: 's4', phase: 'MANAGEMENT', title: 'Sequencing therapy',
        content: ['You are the first doctor. Fluids, insulin, and potassium decisions must be sequenced correctly.'],
        question: 'The correct first-hour sequence is:',
        options: ['Bolus insulin, then fluids, add K immediately', 'Isotonic saline 1–1.5 L first hour, then insulin infusion; hold K until K <5.2 with urine output', 'Half-normal saline + bicarbonate first', 'Dextrose first to prevent hypoglycemia'],
        answerId: 1, teaching: 'Volume first (she is 5–6 L down; insulin is ineffective in shock) → then insulin 0.1 U/kg/h. Potassium only after K falls <5.2 and urine flows. Bicarbonate only if pH <6.9. Dextrose is added later when glucose approaches 250 — to keep insulin running until the GAP closes.',
      },
      {
        id: 's5', phase: 'PITFALL', title: 'The classic mistake',
        content: ['Six hours in: glucose 210 mg/dL. A colleague stops the insulin infusion entirely.'],
        question: 'Why is stopping insulin at this point wrong?',
        options: ['Nothing wrong — glucose target met', 'Ketoacidosis persists; insulin must continue until the anion gap closes — switch fluids to dextrose and continue insulin', 'Insulin causes cerebral edema at this stage', 'Insulin must double instead'],
        answerId: 1, teaching: 'Glucose normalizes before ketones. Stop insulin only when gap closed, anion normal, patient eating — otherwise ketogenesis resumes. Add dextrose to continue insulin safely.',
      },
      {
        id: 's6', phase: 'REPORT', title: 'Clinical reasoning report',
        content: ['You navigated the highest-risk sequencing scenario in endocrine emergencies.', 'Revise: Winter formula, cerebral edema in pediatric DKA, HHS contrast.'],
      },
    ],
    learning: [
      'DKA triad: hyperglycemia + ketosis + anion-gap acidosis; Kussmaul breathing is compensation.',
      'Total-body K is DEPLETED despite serum readings — replace once K <5.2 with urine flow.',
      'Sequence: fluids → insulin → potassium → dextrose when glucose <250 — never stop insulin before the gap closes.',
      'Serum glucose falls before ketones clear — gap closure is the endpoint.',
    ],
  },
]
