// ─── UNDERSTAND · catalog C — clinical subjects expansion ───
// Ward-and-theatre topics across Medicine, Surgery, OBGY, Paeds and the
// clinical specialties. Content: NMC CBME 2024 / NEET-PG blueprint aligned,
// cross-checked against Harrison's, Bailey & Love, DC Dutta, Ghai, Maheshwari,
// Dhingra, Khurana and Neeraj Ahuja (restated simply).

import type { UnderstandTopic } from './understand-types'

export const CATALOG_C: UnderstandTopic[] = [
  {
    id: 'u-dka-management',
    title: 'Diabetic Ketoacidosis — Insulin, Fluids, Potassium',
    emoji: '🍬',
    subjectCode: 'MED',
    system: 'Endocrinology',
    yield: 'must',
    oneLiner: 'Three numbers run DKA — sugar, ketones and potassium — and insulin must not stop until the gap closes.',
    plain:
      'Diabetic ketoacidosis is absolute insulin deficiency: lipolysis runs unchecked, the liver pours out ketoacids and glucose piles up while the kidney dumps water and electrolytes. Treatment is a fixed trio — IV fluids, a low-dose insulin infusion and obsessive potassium replacement — continued until the ketosis clears, not merely until the sugar looks pretty. Always hunt the precipitant: infection, myocardial infarction, new-onset type 1 diabetes or simply missed insulin.',
    steps: [
      { title: 'Confirm the triad', text: 'Hyperglycaemia (usually >250 mg/dL), ketonaemia/ketonuria and metabolic acidosis — pH <7.3 with bicarbonate <18 mEq/L. The anion gap, not the glucose, tells you how sick the patient is.' },
      { title: 'Fluids before insulin', text: '0.9% saline, 1–1.5 L in the first hour, then reassess — osmotic diuresis leaves patients 5–6 L down. Insulin pushed into a shrunken, hypovolaemic circulation worsens shock.' },
      { title: 'Low-dose insulin infusion', text: '0.1 U/kg/h IV drops glucose by 50–75 mg/dL per hour; faster falls threaten cerebral oedema. When glucose reaches ~200 mg/dL, ADD dextrose and keep the insulin running — only the ketoacidosis, never the sugar, ends the infusion.' },
      { title: 'Potassium is the kill-switch', text: 'Acidosis and insulin lack shift K⁺ out of cells: serum may look high while total body potassium is empty. Replace early (target 4–5 mEq/L); if K⁺ <3.3 hold insulin and replete first — one dose of insulin on a low K⁺ can arrest the heart.' },
    ],
    weak: [
      { title: 'Stopping insulin when sugar normalises', detail: 'Glucose corrects in hours; ketoacids take 12–24 h. Stop the infusion only when ketones clear, the anion gap closes and pH >7.3 — dextrose keeps the sugar topped up meanwhile.', severity: 'deadly' },
      { title: 'The potassium paradox', detail: 'A high serum K⁺ at presentation does NOT mean the body has potassium — it means it is about to lose it the moment insulin starts. Skipping replacement is the classic DKA death.', severity: 'deadly' },
      { title: 'Bicarbonate reflex', detail: 'Bicarbonate is not given unless pH <6.9: it drives K⁺ into cells, worsens paradoxical CSF acidosis and delays ketone clearance.', severity: 'tricky' },
      { title: 'Missing the trigger', detail: 'Infection, MI, new-onset type 1 diabetes and omitted insulin cause most episodes — treating the biochemistry while a urinary infection rages is a recurring exam vignette.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Why continue IV insulin after glucose reaches 200 mg/dL?', a: 'Ketogenesis must switch off first — add 5–10% dextrose and continue insulin until ketones clear and the anion gap closes.' },
      { q: 'Indication for bicarbonate in DKA?', a: 'Only pH <6.9 — otherwise it worsens hypokalaemia and paradoxical CSF acidosis.' },
      { q: 'Treated DKA patient becomes drowsy with bradycardia — think what?', a: 'Cerebral oedema (especially children/young adults, over-rapid correction) — hypertonic saline/mannitol, imaging, ICU.' },
    ],
  },

  {
    id: 'u-dyspnoea-pneumonia-vs-hf',
    title: 'Dyspnoea — Pneumonia or Pulmonary Oedema?',
    emoji: '🌬️',
    subjectCode: 'MED',
    system: 'Respiratory & Cardiac',
    yield: 'high',
    oneLiner: 'Fever with one dull zone says infection; nights propped on pillows say pump failure — BNP and a film settle the rest.',
    plain:
      'Acute breathlessness is the exam-room tug-of-war between a lung infection and a failing left ventricle. Consolidation gives fever, purulent sputum, pleuritic pain and ONE dull, bronchial-breathing territory; left ventricular failure gives orthopnoea, PND, bilateral basal crepitations, raised JVP and a third heart sound. NT-proBNP and the chest X-ray then confirm which side of the rope you are pulling.',
    steps: [
      { title: 'The history splits first', text: 'Days of fever with rusty sputum and pleuritic pain point to pneumonia; orthopnoea, waking gasping (PND), nocturnal cough and ankle swelling on a background of IHD/HTN point to heart failure.' },
      { title: 'Examine the lung zones', text: 'Pneumonia is LOCAL: dull percussion, bronchial breathing, increased vocal resonance and coarse crackles in one territory. LVF is BILATERAL: fine basal crepitations, raised JVP, S3 gallop, dependent oedema.' },
      { title: 'One film, two stories', text: 'Lobar opacification with an air bronchogram vs cardiomegaly, upper-lobe diversion ("bat-wing"), Kerley B lines and pleural effusions. A white-out can be either — correlate clinically.' },
      { title: 'BNP closes the argument', text: 'BNP <100 pg/mL (NT-proBNP <300) makes acute heart failure very unlikely; it rises with age, AF, renal failure and sepsis, so it confirms but never diagnoses alone. Echo grades the pump once the patient is stable.' },
    ],
    weak: [
      { title: 'Kerley B lines mislabelled as infection', detail: 'Short parallel lines at the lung bases are distended interlobular septa — interstitial oedema of LVF, not consolidation; perihilar "bat-wing" shadowing is alveolar oedema.', severity: 'tricky' },
      { title: 'BNP treated as a diagnosis', detail: 'It is a rule-OUT tool — sepsis, PE, renal failure and atrial fibrillation all raise it. A normal BNP in acute dyspnoea should send the hunt to a non-cardiac cause.', severity: 'frequent' },
      { title: 'Treating mid-stream', detail: 'Antibiotics in flash pulmonary oedema, or furosemide in lobar pneumonia, is the trap — name the side of the tug-of-war before the first prescription.', severity: 'deadly' },
    ],
    traps: [
      { q: 'Best single test to EXCLUDE heart failure in acute dyspnoea?', a: 'BNP/NT-proBNP — very low levels virtually exclude acute LV failure (high negative predictive value).' },
      { q: 'Dull note + bronchial breathing + increased vocal resonance = ?', a: 'Consolidation (pneumonia) — the X-ray shows lobar opacification with an air bronchogram.' },
      { q: 'CXR: cardiomegaly, Kerley B lines, bilateral effusions — diagnosis?', a: 'Left ventricular failure with pulmonary venous congestion — oxygen, diuretics, afterload reduction.' },
    ],
  },

  {
    id: 'u-thyroid-storm-myxoedema',
    title: 'Thyroid Storm & Myxoedema Coma',
    emoji: '🌡️',
    subjectCode: 'MED',
    system: 'Endocrinology',
    yield: 'high',
    oneLiner: 'Two ends of one rope: the storm burns (beta-blocker first), the coma freezes (steroids before thyroxine).',
    plain:
      'Thyroid storm is decompensated hyperthyroidism — fever, tachyarrhythmia, agitation and heart failure, usually precipitated by infection, surgery or iodine load; myxoedema coma is decompensated hypothyroidism — hypothermia, bradycardia, hyponatraemia and a clouded sensorium in a longstanding patient. Both are ICU diseases treated with hormone blockade or replacement plus steroids and supportive care. Both live and die by the ORDER of the drugs.',
    steps: [
      { title: 'Storm: cool the adrenergic fire', text: 'Beta-blockade first (propranolol or esmolol) for tremor, tachycardia and agitation — cautiously in heart failure/asthma. Fluids, oxygen and active cooling run in parallel.' },
      { title: 'Storm: block, then plug', text: 'PTU (preferred — it also blocks peripheral T4→T3 conversion) shuts hormone synthesis; iodine (Lugol\'s) follows at least 1 h LATER — given first, it is fuel for new hormone. Hydrocortisone impairs conversion and covers relative adrenal insufficiency.' },
      { title: 'Myxoedema coma: the frozen patient', text: 'Hypothermia (often without shivering), bradycardia, hypoventilation, hyponatraemia and altered sensorium; precipitants are infection, cold, sedatives and MI. Rewarm PASSIVELY — rapid external rewarming vasodilates and collapses a preload-dependent circulation.' },
      { title: 'Myxoedema coma: hydrocortisone before thyroxine', text: 'IV hydrocortisone first, then IV levothyroxine loading — thyroid hormone accelerates metabolism and can precipitate adrenal crisis in the coexisting (common) adrenal insufficiency.' },
    ],
    weak: [
      { title: 'Iodine before thionamide', detail: '"Block first, plug later" is exam gold: iodine given before PTU/carbimazole becomes substrate for MORE T3/T4. Wait at least 1 h between the thionamide and the iodine load.', severity: 'deadly' },
      { title: 'Thyroxine without steroid cover', detail: 'In myxoedema coma give hydrocortisone BEFORE levothyroxine — restoring thyroid drive unmasks adrenal insufficiency and can precipitate collapse.', severity: 'deadly' },
      { title: 'PTU vs carbimazole selection', detail: 'PTU wins in storm (peripheral conversion block) and first-trimester pregnancy (carbimazole embryopathy — aplasia cutis, choanal atresia); carbimazole wins for routine maintenance (PTU hepatotoxicity).', severity: 'tricky' },
    ],
    traps: [
      { q: 'First drug in thyroid storm?', a: 'A beta-blocker (propranolol/esmolol) — then block synthesis with PTU, give iodine ≥1 h later, plus hydrocortisone and cooling.' },
      { q: 'Why hydrocortisone in BOTH storm and myxoedema coma?', a: 'It covers coexisting adrenal insufficiency — and in storm additionally impairs T4→T3 conversion.' },
      { q: 'Hypothermic, bradycardic, hyponatraemic, obtunded patient — diagnosis and hormone?', a: 'Myxoedema coma — IV levothyroxine (after hydrocortisone), ventilatory support, passive rewarming.' },
    ],
  },

  {
    id: 'u-appendicitis-alvarado',
    title: 'Acute Appendicitis — The Alvarado Score',
    emoji: '🚨',
    subjectCode: 'SURG',
    system: 'Gastrointestinal',
    yield: 'must',
    oneLiner: 'Pain that migrates from navel to right iliac fossa, then a 10-point score decides knife or watch.',
    plain:
      'Appendicitis begins as luminal obstruction — lymphoid hyperplasia or a faecolith — so pain starts as a vague periumbilical ache (visceral afferents, T10) and only localises to the right iliac fossa when the parietal peritoneum inflames. The Alvarado score turns the clinical features into a number that supports, never replaces, the hands. In a woman of childbearing age the urinary pregnancy test comes before any surgeon\'s signature.',
    steps: [
      { title: 'Follow the pain\'s journey', text: 'Obstruction → distension → visceral pain at the umbilicus (T10); 12–24 h later parietal inflammation pins it to McBurney\'s point (lateral 1/3 of the ASIS–umbilicus line) with rebound and guarding. Anorexia, nausea and low fever straddle the two.' },
      { title: 'Score it: MANTRELS', text: 'Migration 1 · Anorexia 1 · Nausea/vomiting 1 · Tenderness RIF 2 · Rebound 2 · Elevated temp ≥37.3 °C 1 · Leukocytosis >10,000 2 · Left shift >75% neutrophils 2 = 10. ≥7 → appendicitis likely, operate; 4–6 → equivocal — image or observe; ≤3 → unlikely.' },
      { title: 'Operate — or mass it', text: 'Uncomplicated: appendicectomy with antibiotic cover. A 3–5-day appendix mass without perforation gets the Ochsner–Sherren conservative regimen (antibiotics, nil orally, mark the mass) with interval appendicectomy at 6–8 weeks; free perforation/peritonitis is an emergency laparotomy.' },
      { title: 'Respect the mimics', text: 'Mesenteric adenitis, Meckel\'s diverticulitis, Crohn\'s, ureteric colic — and above all ectopic pregnancy: a UPT is part of every appendicitis workup in fertile women. A retrocaecal appendix hides behind a psoas sign; a pelvic appendix may irritate the rectum and bladder.' },
    ],
    weak: [
      { title: 'Operating on the score, not the patient', detail: 'The score is a triage aid, not a surgeon — a low score with localised peritonism still goes to theatre, and an equivocal score demands imaging/observation, not blind reassurance of a sick abdomen.', severity: 'frequent' },
      { title: 'Reversing the migration', detail: 'Periumbilical FIRST, RIF later. Pain that started in the RIF and moved centrally should make you re-think the diagnosis entirely.', severity: 'frequent' },
      { title: 'Forgetting the UPT', detail: 'Ruptured ectopic presenting as "RIF pain" is the classic fatal mimic — pregnancy test before theatre in every woman of childbearing age.', severity: 'deadly' },
    ],
    traps: [
      { q: 'Why does appendicitis start at the umbilicus?', a: 'Visceral afferents (T10) sense distension — the periumbilical ache precedes parietal peritoneal inflammation that localises it to McBurney\'s point.' },
      { q: 'Alvarado score of 8 — next step?', a: 'Appendicitis highly likely — proceed to appendicectomy (cutoff ≥7).' },
      { q: 'Appendix mass on day 4 without generalised peritonitis?', a: 'Ochsner–Sherren conservative regimen; interval appendicectomy at 6–8 weeks (and exclude caecal carcinoma in the elderly).' },
    ],
  },

  {
    id: 'u-intestinal-obstruction',
    title: 'Intestinal Obstruction — Drip, Suck, Decide',
    emoji: '🎈',
    subjectCode: 'SURG',
    system: 'Gastrointestinal',
    yield: 'high',
    oneLiner: 'Colic, vomiting, distension, absolute constipation — then the film decides small, large or twisted.',
    plain:
      'Mechanical obstruction turns the gut into a fluid-filled balloon: colicky pain, vomiting, distension and absolute constipation, in an order that betrays the level — proximal obstruction vomits early and distends late, distal obstruction the reverse. The plain X-ray separates small-bowel (central, valvulae crossing the full lumen) from large-bowel (peripheral, haustra) patterns. The real decisions are strangulation versus simple obstruction, and drip-and-suck versus theatre.',
    steps: [
      { title: 'Level by the clock', text: 'Proximal (high) SBO: early bilious vomiting, little distension, rapid dehydration. Distal ileal/colonic: gross distension with late, feculent vomiting. Absolute constipation (obstipation) completes the quartet.' },
      { title: 'Read the film', text: 'SBO: central dilated loops (>3 cm) with valvulae conniventes crossing the WHOLE width ("step-ladder"). LBO: peripheral loops with haustra that do NOT cross; caecum >9 cm threatens perforation. Sigmoid volvulus: "coffee-bean" rising from the pelvis.' },
      { title: 'Strangulation is the emergency', text: 'Constant (not colicky) pain, localised tenderness/guarding, fever, tachycardia, leucocytosis or peritonism mean a loop\'s blood supply is dying — resuscitate and take to theatre; imaging cannot reliably exclude it.' },
      { title: 'Drip and suck, then decide', text: 'NG decompression, IV fluids and electrolyte correction first in EVERY patient. Early post-op adhesional SBO without strangulation usually settles in 24–48 h; most other mechanical obstructions — and sigmoid volvulus after endoscopic detorsion — need definitive surgery.' },
    ],
    weak: [
      { title: 'Valvulae vs haustra', detail: 'Valvulae conniventes cross the entire lumen = small bowel; haustra are incomplete and do not cross = large bowel. Naming the wrong fold flips the whole differential.', severity: 'frequent' },
      { title: 'Surgery reflex for adhesional obstruction', detail: 'Uncomplicated adhesive SBO is FIRST a drip-and-suck disease for 24–48 h — operating too early trades a self-limiting episode for more adhesions.', severity: 'tricky' },
      { title: 'Feculent vomiting read as gastroenteritis', detail: 'Feculent vomit means stagnant distal small bowel or colon — it is obstruction until proven otherwise, not an infection story.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Coffee-bean sign, no peritonism — management?', a: 'Sigmoid volvulus — flexible sigmoidoscopic detorsion first, elective sigmoid colectomy later to prevent recurrence.' },
      { q: 'Caecal diameter that demands action?', a: 'Beyond ~9 cm — perforation risk; decompress surgically (a contrast enema may reduce a competent-valve colonic obstruction).' },
      { q: 'Which obstruction vomits late and feculent?', a: 'Distal small bowel/colonic — the longer the stagnant segment, the later and more feculent the vomiting.' },
    ],
  },

  {
    id: 'u-labour-partograph',
    title: 'Labour Stages & the Partograph',
    emoji: '📏',
    subjectCode: 'OBGY',
    system: 'Obstetrics',
    yield: 'must',
    oneLiner: 'Active labour begins at 6 cm — plot the alert line, and let the partograph shout before you do.',
    plain:
      'First stage (onset of labour to full dilatation) is now plotted from 6 cm on the WHO 2018 partograph with its alert line; second stage ends with the baby (pushing ≤2 h primigravida, ≤1 h multigravida); third stage delivers the placenta, and active management there is the cheapest PPH vaccine in medicine. The partograph\'s cervicograph and 4-hourly observations exist to catch the slowly-progressing labour before the fetus pays for it.',
    steps: [
      { title: 'Stage 1 — plot from 6 cm', text: 'The latent phase (to 6 cm) needs patience, not a partograph; active phase expects ≥1 cm/h dilatation. Crossing the alert line (classically the action line 4 h to its right) means review and augmentation (ARM, oxytocin) — not automatic caesarean.' },
      { title: 'Surveillance rhythm', text: 'Fetal heart every 30 min (intermittent auscultation), contractions 30-minutely, BP, pulse, temperature and cervical assessment 4-hourly, head descent by abdominal fifths. The chart is a conversation the labour must keep having with you.' },
      { title: 'Stage 2 — push with purpose', text: 'Full dilatation to delivery: passive descent until the head reaches the perineum, then active pushing — ≤2 h in a primigravida, ≤1 h in a multigravida (a little longer with epidural). Prolongation forces the forceps/ventouse decision.' },
      { title: 'Stage 3 — active management', text: 'Uterotonic (oxytocin 10 IU IM with the anterior shoulder), controlled cord traction and uterine massage — this trio roughly halves postpartum haemorrhage. Inspect the placenta and palpate the uterus through the first (fourth) stage.' },
    ],
    weak: [
      { title: 'Plotting from 4 cm', detail: 'WHO 2018: active labour starts at 6 cm. Starting the partograph at 4 cm manufactures false "prolonged active phase" labels and needless oxytocin and caesareans.', severity: 'frequent' },
      { title: 'Alert vs action line roles', detail: 'Alert line = review/refer/think; action line (4 h to its right, classical partograph) = intervene. Confusing a crossed alert line with "operate now" is the classic management slip.', severity: 'tricky' },
      { title: 'Pushing before descent', detail: 'Bearing down at 8–9 cm exhausts the mother and burns the pelvic floor — second stage means FULL dilatation, then passive descent, then pushing.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Single most important third-stage intervention?', a: 'Prophylactic uterotonic — oxytocin 10 IU IM; active management (uterotonic + controlled cord traction + uterine massage) roughly halves PPH.' },
      { q: 'Minimum dilatation rate in active first stage?', a: 'About 1 cm/h — progress slower than the alert line triggers review and augmentation.' },
      { q: 'Second stage time limits?', a: '2 h primigravida / 1 h multigravida (longer with epidural) — beyond this, plan assisted vaginal delivery.' },
    ],
  },

  {
    id: 'u-pre-eclampsia-mgso4',
    title: 'Pre-eclampsia & Magnesium Toxicity',
    emoji: '🧯',
    subjectCode: 'OBGY',
    system: 'Obstetrics',
    yield: 'must',
    oneLiner: 'The only cure is delivery — until then, MgSO₄ guards the brain and three vitals guard the magnesium.',
    plain:
      'Pre-eclampsia is new hypertension after 20 weeks plus proteinuria or organ dysfunction; severe features (≥160/110, platelets <100,000, transaminases doubled, creatinine rise, pulmonary oedema, cerebral/visual symptoms) push it to urgent delivery. MgSO₄ is the seizure shield for severe disease and eclampsia — and its monitoring is a reflex you must have before the exam, not after a tragedy. Delivery remains the only cure.',
    steps: [
      { title: 'Define, then stratify', text: 'BP ≥140/90 after 20 weeks + proteinuria (≥300 mg/24 h or raised protein:creatinine ratio) or end-organ signs. Severe features: ≥160/110, low platelets, LFTs doubled, creatinine rise, pulmonary oedema, headache/visual blur/RUQ pain. Low-dose aspirin from 12–14 weeks protects high-risk mothers.' },
      { title: 'MgSO₄ — the seizure shield', text: 'Loading 4 g IV slowly (Pritchard adds 10 g IM), maintenance 1–2 g/h IV or 5 g IM 4-hourly. It prevents and treats eclamptic fits — brain protection that antihypertensives cannot provide — and continues for 24 h after delivery/last fit.' },
      { title: 'Three vitals before every dose', text: 'Patellar reflexes PRESENT, respiratory rate ≥12/min, urine output ≥25–30 mL/h. Toxicity eats reflexes first, then respiration, then the heart — antidote: 10 mL of 10% calcium gluconate IV.' },
      { title: 'BP and the delivery clock', text: 'Labetalol, nifedipine or hydralazine bring severe BP down; ergometrine is FORBIDDEN (vasospastic crisis) — use oxytocin. Deliver for unstable severe disease or at 34+ weeks with severe disease — and expect the disease to peak 24–48 h POSTpartum before resolving.' },
    ],
    weak: [
      { title: 'Monitoring reflexes missed', detail: 'MgSO₄ kills by paralysis, and the patellar jerk is the early-warning radar — dosing without reflexes, RR and urine output is exactly how toxicity happens on the ward.', severity: 'deadly' },
      { title: 'Curing BP, forgetting the placenta', detail: 'Normotension on labetalol is not remission — fetal growth restriction, abruption and stillbirth run on; severe disease needs a delivery plan, not titration alone.', severity: 'tricky' },
      { title: 'Postpartum amnesia', detail: 'Eclampsia can FIRST appear days after delivery, and MgSO₄ continues for 24 h post-delivery/last fit — "she delivered, so she is safe" is a false discharge reflex.', severity: 'frequent' },
    ],
    traps: [
      { q: 'First clinical sign of MgSO₄ toxicity?', a: 'Loss of the patellar (knee) reflexes — before respiratory depression (<12/min) and cardiac arrest.' },
      { q: 'Antidote for magnesium toxicity?', a: 'Calcium gluconate 10% — 10 mL IV slowly.' },
      { q: 'Why is ergometrine contraindicated in pre-eclampsia?', a: 'It provokes vasoconstriction/hypertensive crisis — oxytocin is the third-stage uterotonic of choice.' },
    ],
  },

  {
    id: 'u-imnci-danger-signs',
    title: 'IMNCI — Danger Signs & Colour Triage',
    emoji: '🚩',
    subjectCode: 'PEDS',
    system: 'Paediatric Emergency',
    yield: 'must',
    oneLiner: 'Four danger signs, three colours, three breathing rates — IMNCI is triage arithmetic that saves lives.',
    plain:
      'IMNCI (WHO/UNICEF Integrated Management of Neonatal and Childhood Illness, adapted for India) first checks EVERY sick child for four general danger signs — unable to drink or breastfeed, vomits everything, convulsions, lethargy or unconsciousness — then classifies by age-specific fast-breathing cut-offs and chest indrawing. Every classification lands in a colour: Pink = urgent referral after pre-referral treatment, Red = treat at the facility, Yellow = home care.',
    steps: [
      { title: 'Danger signs before anything else', text: 'All four mean the child may die within days: cannot drink/breastfeed, vomits everything, has convulsed in this illness, is lethargic/unconscious. Any one → urgent pre-referral treatment and referral — no further scoring needed.' },
      { title: 'Count the breaths (calm child, full minute)', text: 'Fast breathing: ≥60/min under 2 months, ≥50/min at 2–12 months, ≥40/min at 1–5 years. Lower chest wall indrawing or stridor in a calm child outranks the number — severe pneumonia.' },
      { title: 'Colour the classification', text: 'PINK row = urgent referral (first-dose antibiotic — ceftriaxone or ampicillin+gentamicin — treat fever/hypoglycaemia, keep warm, refer); RED = specific treatment and advice at the facility (oral antibiotic, ORS); YELLOW = home care advice and follow-up.' },
      { title: 'The young infant is a different animal', text: '0–2 months: fast breathing ≥60, severe chest indrawing, grunting, fever ≥37.5 °C OR hypothermia <35.5 °C, poor feeding or movement only on stimulation — any of these is possible serious bacterial infection: treat and refer. Hypothermia is as sinister as fever.' },
    ],
    weak: [
      { title: 'Counting a crying child\'s breaths', detail: 'Fast breathing must be counted in a CALM child over a FULL 60 seconds — a crying, feeding or febrile infant manufactures false pneumonias (fever alone raises the rate).', severity: 'frequent' },
      { title: 'Chest indrawing mis-scoped', detail: 'IMNCI means LOWER chest wall indrawing on inspiration — intercostal recession alone is not the sign; examine the undressed child held upright.', severity: 'tricky' },
      { title: 'Colour rows swapped', detail: 'Pink = refer URGENTLY (top row), Red = treat locally with specific drugs, Yellow = home care. Writing "red = refer" throws away the whole triage design.', severity: 'frequent' },
    ],
    traps: [
      { q: 'The four general danger signs?', a: 'Unable to drink/breastfeed, vomits everything, convulsions in current illness, lethargy/unconsciousness.' },
      { q: 'Fast-breathing cut-off at 6 months?', a: '≥50/min (2–12 months); ≥60 below 2 months, ≥40 from 1–5 years.' },
      { q: 'Pink classification — what before referral?', a: 'Pre-referral treatment: first-dose antibiotic (ceftriaxone or ampicillin+gentamicin), correct hypoglycaemia, antimalarial/antipyretic as indicated, keep warm, refer urgently.' },
    ],
  },

  {
    id: 'u-neonatal-jaundice',
    title: 'Neonatal Jaundice — Phototherapy Thresholds',
    emoji: '👶',
    subjectCode: 'PEDS',
    system: 'Neonatology',
    yield: 'must',
    oneLiner: 'Jaundice in the first 24 hours is never physiological — after that, hour-specific lines decide light or exchange.',
    plain:
      'Neonatal jaundice is a race between bilirubin production (a big red-cell mass breaking down) and an immature liver short on UGT. Physiological jaundice appears on day 2–3, peaks under ~12–15 mg/dL and fades by 10–14 days; jaundice in the first 24 h, a rise >5 mg/dL/day, a high conjugated fraction or prolongation beyond 14–21 days is pathological. Phototherapy thresholds are hour- and risk-specific — blue-green light photo-isomerises bilirubin into water-soluble forms the baby can dump without conjugation.',
    steps: [
      { title: 'The physiological clock', text: 'Appears day 2–3, peaks day 4–5, clears by ~day 10 (term) or 2 weeks (preterm). Out of clock = pathological: <24 h is haemolysis/sepsis until proven otherwise; beyond 14–21 days is "prolonged" — check the conjugated fraction, thyroid, and stools for biliary atresia.' },
      { title: 'Measure, don\'t squint', text: 'Transcutaneous or serum bilirubin plotted on hour-specific nomograms (Bhutani) against risk factors — prematurity, haemolysis, sepsis, hypoalbuminaemia, inadequate feeding. Kramer zones are a screening pointer, never the treatment gate.' },
      { title: 'Phototherapy — light as medicine', text: 'Blue-green light (420–480 nm) converts unconjugated bilirubin to water-soluble photoisomers (lumirubin) excreted without conjugation. Maximise skin exposure, shield the eyes, monitor temperature and hydration — IV fluids are NOT routine; feed the baby.' },
      { title: 'Escalation: exchange transfusion', text: 'Double-volume exchange (160–180 mL/kg) when bilirubin crosses the exchange line, intensive phototherapy fails, or encephalopathy signs appear (lethargy, high-pitched cry, retrocollis/opisthotonus). Kernicterus stains the basal ganglia — irreversible; it is the UNCONJUGATED fraction that crosses.' },
    ],
    weak: [
      { title: 'Phototherapy for a pale-stool baby', detail: 'Conjugated (direct) jaundice does NOT respond to phototherapy — pale stools with dark urine mean biliary atresia needing a Kasai portoenterostomy, ideally before 60 days of life.', severity: 'deadly' },
      { title: 'Treating Kramer zones, not numbers', detail: 'Visual zones are screening aids; treatment thresholds are lab values on hour-specific curves. "Looks deep yellow" alone starts neither phototherapy nor exchange.', severity: 'frequent' },
      { title: 'The underfeeding loop', detail: 'Breastfeeding (not breast-milk) jaundice in the first week is driven by poor intake → less stool → bilirubin recirculates; the fix is feeding support, not stopping breastfeeding.', severity: 'tricky' },
    ],
    traps: [
      { q: 'Jaundice within the first 24 hours of life?', a: 'Always pathological — investigate haemolysis (Rh/ABO, G6PD) and sepsis immediately.' },
      { q: 'How does phototherapy work?', a: 'Photo-isomerisation of unconjugated bilirubin by blue-green light (420–480 nm) to water-soluble isomers excreted without conjugation.' },
      { q: 'Day-20 jaundice + pale stools + dark urine?', a: 'Conjugated hyperbilirubinaemia — obstructive cholestasis/biliary atresia: urgent workup, Kasai portoenterostomy <60 days.' },
    ],
  },

  {
    id: 'u-colles-fracture',
    title: 'Colles Fracture — Dinner Fork & the 5 Ps',
    emoji: '🍴',
    subjectCode: 'ORTH',
    system: 'Upper Limb Trauma',
    yield: 'high',
    oneLiner: 'Fall on the outstretched hand, dorsal tilt, dinner-fork wrist — and a cast that must never hide a compartment syndrome.',
    plain:
      'A Colles fracture is a distal radius fracture (within ~2 cm of the joint) with DORSAL displacement and dorsal tilt — the classic dinner-fork deformity after a fall on the outstretched, extended wrist, usually in an osteoporotic woman. The X-ray (PA + lateral) reads radial length, inclination and tilt; treatment is closed reduction and a below-elbow cast. The complications — EPL rupture, median nerve compression, malunion, compartment syndrome — are examined far more often than the reduction technique.',
    steps: [
      { title: 'Mechanism & deformity', text: 'FOOSH with wrist extension loads the dorsal rim → distal fragment tilts dorsally (the normal ~11° volar tilt reverses), impacts and shortens → the "dinner-fork" profile, radial styloid ending proximal to the ulnar.' },
      { title: 'Read the film like a surgeon', text: 'PA: radial length (height ~11 mm) and radial inclination (~22°); lateral: volar tilt (~11°). Dorsal comminution, intra-articular step >2 mm or marked shortening mark the unstable patterns that need operative fixation rather than a cast.' },
      { title: 'Reduce, cast, check', text: 'Closed reduction (haematoma block/sedation) with traction, volar flexion and ulnar deviation, then a below-elbow cast for ~6 weeks — re-check the reduction and nerve symptoms in the first week, because a beautiful day-0 reduction can slip dorsally.' },
      { title: 'Complications and the 5 Ps', text: 'Acute carpal tunnel (median nerve) at presentation; delayed EPL attrition rupture 4–8 weeks on; malunion with stiffness; Sudeck\'s/CRPS. And in ANY cast: pain out of proportion, paraesthesia, pallor, pulselessness, paralysis — compartment syndrome: split the cast first, image later.' },
    ],
    weak: [
      { title: 'Colles vs Smith direction', detail: 'Colles: distal fragment tilts DORSALLY (dinner-fork), fall on the extended wrist. Smith: VOLAR displacement ("garden-spade", reverse Colles), fall on the back of the flexed wrist. One word — dorsal/volar — carries the whole mark.', severity: 'deadly' },
      { title: 'EPL rupture surprise', detail: 'Weak thumb extension WEEKS after a Colles is an attrition rupture of extensor pollicis longus (rubbing over the disrupted third compartment) — not a missed dislocation; tendon transfer (EIP) is the usual fix.', severity: 'frequent' },
      { title: 'Pain out of proportion read as "poor pain tolerance"', detail: 'Under a tight cast, escalating pain + paraesthesia is compartment syndrome until proven otherwise — loosen/split the cast before analgesia reassurance or any imaging.', severity: 'deadly' },
    ],
    traps: [
      { q: 'Dinner-fork deformity — which way does the fragment point?', a: 'Dorsally displaced and dorsally tilted distal radius = Colles fracture (normal volar tilt reversed).' },
      { q: 'Thumb extension weakness 6 weeks after Colles reduction?', a: 'EPL attrition rupture — delayed tendon attrition over the fracture site.' },
      { q: 'Volarly displaced distal radius fracture is called?', a: 'Smith fracture — reverse Colles; fall on the dorsum of the flexed wrist.' },
    ],
  },

  {
    id: 'u-otitis-media-complications',
    title: 'Otitis Media — The Complication Map',
    emoji: '🥁',
    subjectCode: 'ENT',
    system: 'Otology',
    yield: 'high',
    oneLiner: 'Follow the pus: mastoid behind, labyrinth inward, and through the skull — meningitis first, Gradenigo on the apex.',
    plain:
      'Acute otitis media usually resolves, but an untreated ear or an unsafe (cholesteatomatous) ear lets infection escape: within the temporal bone (mastoiditis, facial palsy, labyrinthitis, petrositis) or intracranially (meningitis, abscess, lateral sinus thrombosis, otitic hydrocephalus). Each complication carries a named sign — sagging canal wall, Gradenigo triad, Griesinger sign — and a fixed order of "most common" that the exam loves.',
    steps: [
      { title: 'Intratemporal — behind and below', text: 'Acute mastoiditis: postauricular swelling and tenderness, pinna pushed DOWN-and-out, sagging posterosuperior deep canal wall — IV antibiotics ± cortical (simple) mastoidectomy. Facial palsy (dehiscent canal) and labyrinthitis (vertigo, nystagmus, SNHL) live in the same bone.' },
      { title: 'Petrous apex — Gradenigo\'s triad', text: 'Petrositis: abducens (VI) palsy → diplopia, severe retro-orbital pain, and otorrhoea. A VI palsy with an ear discharge is Gradenigo syndrome until proven otherwise — the petrous apex sits beside the cavernous sinus.' },
      { title: 'Intracranial — the dangerous exit', text: 'Meningitis is the MOST COMMON intracranial complication; otogenic brain abscess (temporal lobe > cerebellar) follows — headache, fever, focal signs, altered mentation. Lateral (sigmoid) sinus thrombophlebitis: "picket-fence" fevers, anaemia, Griesinger\'s sign (pitting postauricular oedema).' },
      { title: 'Safe vs unsafe ear', text: 'Tubotympanic CSOM (central perforation, mucosal disease) = safe — treat medically. Atticoantral CSOM (attic/marginal perforation with cholesteatoma) = unsafe — bone-eroding and complication-generating; mastoid surgery is definitive.' },
    ],
    weak: [
      { title: 'Listing brain abscess as the commonest', detail: 'Meningitis is the most common intracranial complication of otitis media; abscess (temporal > cerebellar) is second. "Most common" questions live and die on this order.', severity: 'frequent' },
      { title: 'Gradenigo triad half-remembered', detail: 'VI palsy + retro-orbital pain + otorrhoea — students swap the nerve (III/IV) or drop the ear link; anchor it to the petrous apex geography.', severity: 'tricky' },
      { title: 'Missing mastoiditis in a treated AOM', detail: 'Pain and fever persisting or rebounding after 48 h of antibiotics, ear pushed down-and-out with postauricular swelling = coalescent mastoiditis — not "a resistant cold"; delay invites intracranial spread.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Ear discharge + diplopia + retro-orbital pain = ?', a: 'Gradenigo syndrome — petrous apicitis with VI nerve palsy.' },
      { q: 'Pitting oedema over the mastoid in CSOM?', a: 'Griesinger\'s sign — lateral (sigmoid) sinus thrombophlebitis via the emissary vein.' },
      { q: 'Which CSOM ear is "unsafe" and why?', a: 'Atticoantral (attic/marginal perforation + cholesteatoma) — erodes bone and causes the complications; needs mastoid surgery.' },
    ],
  },

  {
    id: 'u-red-eye',
    title: 'The Acute Red Eye — Angle Closure vs The Rest',
    emoji: '🔴',
    subjectCode: 'OPHT',
    system: 'Glaucoma & Cornea',
    yield: 'must',
    oneLiner: 'Deep pain, hazy cornea, a fixed mid-dilated pupil and vomiting: that red eye is an eye casualty, not a conjunctivitis.',
    plain:
      'Most red eyes are benign conjunctivitis — gritty, discharging, vision intact, cornea and pupil normal. The dangerous few announce themselves: acute angle-closure glaucoma (severe pain, haloes, hazy cornea, mid-dilated fixed pupil, stony-hard eye), keratitis (white infiltrate, fluorescein-staining defect) and acute iritis (ciliary flush, small irregular pupil). Reduced vision, corneal haze or an abnormal pupil in a red eye is a referral — always.',
    steps: [
      { title: 'The benign end', text: 'Conjunctivitis: diffuse redness maximal in the fornices, discharge (purulent in bacterial, watery with a preauricular node in viral), gritty discomfort, NO vision loss, clear cornea, reactive pupil. Treat and reassure — never with steroid drops.' },
      { title: 'Angle closure — minutes matter', text: 'Elderly hyperopes with a shallow anterior chamber, triggered by dusk or mydriatics: severe ocular pain and headache, haloes around lights, steamy (oedematous) cornea, mid-dilated vertically-oval FIXED pupil, stony-hard eye, IOP 50–70 mmHg, vomiting. Sight can be lost within days.' },
      { title: 'Drop the pressure, then the pupil', text: 'Acetazolamide 500 mg IV/PO + topical timolol/brimonidine ± hyperosmotics; pilocarpine 2–4% only AFTER the pressure falls (an ischaemic sphincter will not constrict at 60 mmHg). Definitive: laser peripheral iridotomy — in BOTH eyes (the fellow eye is a loaded gun).' },
      { title: 'The inflammatory reds', text: 'Keratitis/corneal ulcer: ciliary flush, white opacity, photophobia, fluorescein uptake (herpetic dendrite → aciclovir). Acute iritis: ciliary congestion, small irregular pupil (posterior synechiae), painful photophobia — steroid/cycloplegic care by an ophthalmologist.' },
    ],
    weak: [
      { title: 'Mydriatics in a painful red eye', detail: 'Dilating drops in a shallow-chamber eye can trigger or deepen angle closure — and pilocarpine given BEFORE the IOP is lowered fails. Order matters in both directions.', severity: 'deadly' },
      { title: 'Ciliary vs conjunctival congestion', detail: 'Redness ringing the LIMBUS (ciliary flush) means deep inflammation — keratitis/iritis/angle closure; diffuse fornix-maximal redness is conjunctival. The limbus is the danger zone.', severity: 'frequent' },
      { title: 'Vision "a bit blurry" dismissed', detail: 'Any reduction in acuity, corneal haze or pupil abnormality takes conjunctivitis OFF the table — these are sight-threatening red eyes needing urgent ophthalmology.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Pupil in acute congestive (angle-closure) glaucoma?', a: 'Mid-dilated, vertically oval, fixed and unreactive — with a steamy cornea and stony-hard globe.' },
      { q: 'Why give pilocarpine only after lowering IOP?', a: 'At very high pressure the sphincter is ischaemic and unresponsive — acetazolamide/timolol first, then pilocarpine opens the angle.' },
      { q: 'Definitive treatment once pressure is controlled?', a: 'Laser peripheral iridotomy — performed in both eyes (prophylactic fellow-eye iridotomy).' },
    ],
  },

  {
    id: 'u-psoriasis-vs-eczema',
    title: 'Psoriasis vs Eczema — Plaque vs Itch',
    emoji: '🌾',
    subjectCode: 'DERM',
    system: 'Dermatology',
    yield: 'high',
    oneLiner: 'Silver scale on extensors with pitted nails is psoriasis; a poorly-defined flexural itch in an atopic child is eczema.',
    plain:
      'Psoriasis is a sharply-demarcated, silvery-scaled, extensor-surface plaque disease with candle-grease, Auspitz and Koebner signs, nail pitting and post-streptococcal guttate flares. Atopic dermatitis is a poorly-demarcated, exquisitely itchy, flexural dermatitis in a child with asthma or hay fever — face/extensors in infancy, flexures by childhood, hands in adulthood. Morphology (demarcation, scale, nails) discriminates far better than itch does, and treatment forks at the same point: calcipotriol+steroid versus emollient+steroid.',
    steps: [
      { title: 'Psoriasis — the plaque fingerprint', text: 'Extensors of elbows/knees, scalp, sacrum: sharply marginated erythematous plaques with silvery-white micaceous scale. Signs: candle-grease (scale peels in layers), Grattage (shiny membrane), Auspitz (pinpoint bleeding). Nails: pitting, oil-drop, onycholysis; 20–30% develop psoriatic arthritis (DIP joints, dactylitis, RF-negative).' },
      { title: 'Eczema — the itch chronology', text: 'Atopic dermatitis: intense itch FIRST, dry poorly-demarcated patches; infant = face and extensors, child = flexures (antecubital/popliteal), adult = hands and lichenified flexures. Personal/family asthma or allergic rhinitis and lifelong dry skin complete the picture.' },
      { title: 'The guttate plot twist', text: 'Drop-like scaly papules erupting on the trunk 2–3 weeks after a streptococcal sore throat, typically in adolescents = guttate psoriasis — often self-limiting, but it announces the diathesis. Missing the throat-culture clue by writing "guttate eczema" loses the marks.' },
      { title: 'Treat by name', text: 'Psoriasis: potent topical steroid + calcipotriol (vitamin D analogue), phototherapy (NB-UVB), methotrexate/acitretin/ciclosporin, biologics for severe disease. Eczema: liberal emollients, stepped topical steroids, topical calcineurin inhibitors on the face, antiseptic measures for S. aureus flares — and eczema herpeticum (punched-out erosions + fever) gets IV aciclovir, urgently.' },
    ],
    weak: [
      { title: 'Auspitz vs Koebner swapped', detail: 'Auspitz = pinpoint bleeding when the scale is scraped off (psoriasis). Koebner = new lesions at sites of trauma (psoriasis, lichen planus, vitiligo, warts) — a phenomenon, not exclusive to psoriasis.', severity: 'frequent' },
      { title: 'Itch as the discriminator', detail: 'Psoriasis can itch too — itch alone never separates them; demarcation, scale quality, distribution and nails do. "Itchy = eczema" is the wrong reflex.', severity: 'tricky' },
      { title: 'Steroid potency upside down', detail: 'Potent steroids on the face/flexures cause atrophy; mild steroids on thick plaques fail — match potency to site, and remember calcipotriol is a psoriasis tool, not an eczema one.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Candle-grease and Auspitz signs belong to which disease?', a: 'Psoriasis — layered scale removal ending in pinpoint bleeding.' },
      { q: 'Drop-like scaly lesions 2 weeks after a sore throat?', a: 'Guttate psoriasis — post-streptococcal; often self-limiting, may precede chronic plaque disease.' },
      { q: 'Atopic child, punched-out erosions + fever on eczema?', a: 'Eczema herpeticum — disseminated HSV; IV aciclovir and urgent dermatology.' },
    ],
  },

  {
    id: 'u-depression-schizophrenia',
    title: 'Depression vs Schizophrenia — Reading Psychosis',
    emoji: '🌫️',
    subjectCode: 'PSY',
    system: 'Psychiatry',
    yield: 'core',
    oneLiner: 'First-rank symptoms point to schizophrenia; delusions of guilt with psychomotor slowdown point to psychotic depression.',
    plain:
      'Major depression is at least two weeks of low mood, anhedonia and fatigability with biological rhythm changes, worthlessness and suicidal thinking; when severe it turns psychotic with MOOD-CONGRUENT delusions — guilt, poverty, nihilism. Schizophrenia is defined by a month of positive symptoms — Schneider\'s first-rank symptoms (thought interference, commenting/arguing voices, passivity, delusional perception) — plus decline in function, with negative symptoms eroding the personality. The mood-congruence of the delusions, the course and the first-rank pattern are the three levers that separate them.',
    steps: [
      { title: 'Depression — the biological core', text: '≥2 weeks: low mood, anhedonia, decreased energy plus sleep/appetite change, diurnal variation (worse mornings), psychomotor retardation, worthlessness/guilt, suicidal ideation. First-line: SSRI ± psychotherapy; psychotic or life-threatening depression → antidepressant + antipsychotic, or ECT.' },
      { title: 'Psychotic depression — mood-congruent madness', text: 'Delusions of sin/guilt, poverty, nihilism and hypochondriasis with derogatory auditory hallucinations — the content MATCHES the depression. Treat with antidepressant + antipsychotic, or ECT (rapid, safe in food refusal, high suicide risk and pregnancy).' },
      { title: 'Schizophrenia — the first-rank quartet', text: 'Schneider FRS: audible thoughts; voices commenting (2nd person) or arguing (3rd person); thought insertion, withdrawal, broadcast; delusional perception; passivity ("made" feelings/impulses/acts). Add negative symptoms (blunted affect, avolition, alogia) and ≥1 month of symptoms (ICD-10) — FRS are suggestive, not exclusive.' },
      { title: 'Manage the psychosis', text: 'Atypical antipsychotics first-line (risperidone, olanzapine); clozapine after ≥2 adequate antipsychotic trials fail — treatment-resistant schizophrenia — with WBC/ANC monitoring for agranulocytosis. Depression\'s psychosis remits with mood treatment; schizophrenia needs long-term antipsychotic maintenance.' },
    ],
    weak: [
      { title: 'First-rank = schizophrenia, boxed', detail: 'FRS strongly SUGGEST schizophrenia but are neither sufficient nor exclusive — mood disorders can show them. Diagnosis follows criteria and course, not a checklist stamp.', severity: 'tricky' },
      { title: 'Treating psychotic depression as schizophrenia', detail: 'Episodic, mood-congruent, biological depression with guilt delusions needs antidepressant/ECT — antipsychotic monotherapy starves the mood illness underneath.', severity: 'deadly' },
      { title: 'Voices counted wrong', detail: 'Commenting (2nd person: "she is useless") and discussing/arguing (3rd person) voices are first-rank; a single first-person "I am bad" voice is not. Person-counting of hallucinations is a real exam point.', severity: 'frequent' },
    ],
    traps: [
      { q: 'List Schneider\'s first-rank symptoms.', a: 'Audible thoughts; voices commenting or arguing; thought insertion/withdrawal/broadcast; delusional perception; passivity phenomena.' },
      { q: 'Delusions of guilt and poverty + severe psychomotor retardation = ?', a: 'Psychotic (severe) depression — mood-congruent psychosis; antidepressant + antipsychotic, or ECT.' },
      { q: 'Schizophrenia failing two adequate antipsychotic trials — next?', a: 'Clozapine (treatment-resistant schizophrenia), with agranulocytosis monitoring.' },
    ],
  },

  {
    id: 'u-ct-head-stroke',
    title: 'CT Head in Stroke — The Golden Window',
    emoji: '🩻',
    subjectCode: 'RAD',
    system: 'Neuroradiology',
    yield: 'must',
    oneLiner: 'The first CT\'s job is to say "no blood" — ischaemia may not show for hours, and the clock decides the drug.',
    plain:
      'Non-contrast CT is the gatekeeper of acute stroke: it cannot reliably SEE early ischaemia (it may be normal for hours) but it must EXCLUDE haemorrhage before thrombolysis. Early ischaemic signs exist — hyperdense MCA, insular ribbon loss, lentiform obscuration, sulcal effacement — and beyond 4.5 hours the IV alteplase window closes while CT angiography/perfusion opens the 6–24 h thrombectomy window. A "normal" early CT with a stroke story is a treatment opportunity, not a clean bill.',
    steps: [
      { title: 'Why CT first', text: 'Within the thrombolysis window the only CT job is haemorrhage exclusion: fresh blood is HYPERdense immediately (ischaemia turns HYPOdense later). IV alteplase <4.5 h from onset requires no haemorrhage, no large established infarct, no significant mass effect.' },
      { title: 'Early ischaemia whispers', text: 'First hours: hyperdense MCA/ICA sign (clot inside the vessel), loss of the insular ribbon, obscuration of the lentiform nucleus, effaced sulci. Conspicuous hypodensity and oedema appear from ~6–24 h; a large hypodensity (>1/3 MCA territory) contraindicates thrombolysis.' },
      { title: 'Extend the window with imaging', text: 'CT angiography maps large-vessel occlusion; CT/MR perfusion separates dead core from salvageable penumbra — mechanical thrombectomy is offered up to 24 h in selected patients (DAWN/DEFUSE-3 mismatch). MRI DWI is the most SENSITIVE early test, but CT is the fast, available gatekeeper.' },
      { title: 'Blood patterns by age', text: 'SAH: hyperdense basal cisterns/fissures — CT is ~99% sensitive within 6 h, then fades daily; CT-negative SAH with a typical history → LP at ≥12 h for xanthochromia (bilirubin). Intraparenchymal haematoma: hyperdense acutely, isodense by 1–3 weeks, hypodense chronically; CTA may reveal the aneurysm/spot sign.' },
    ],
    weak: [
      { title: 'A normal early CT excludes stroke', detail: 'It excludes (or confirms) HAEMORRHAGE — early ischaemia is often invisible. Treating the clock, not the picture, is the whole point of the golden window.', severity: 'deadly' },
      { title: 'Hyperdense MCA misread as haemorrhage', detail: 'The hyperdense MCA sign is THROMBUS INSIDE the artery — an early INFARCT sign predicting large infarct and poor outcome, not an intracerebral bleed; thrombolysis decisions hinge on this reading.', severity: 'tricky' },
      { title: 'LP too early after SAH', detail: 'LP before 12 h may show no xanthochromia yet — and LP is skipped entirely if CT is diagnostic. Order: CT first; LP ≥12 h only when CT is negative and suspicion persists.', severity: 'frequent' },
    ],
    traps: [
      { q: 'What must the non-contrast CT show before IV alteplase?', a: 'Absence of haemorrhage (and no large established hypodense infarct/mass effect) — within 4.5 h of onset.' },
      { q: 'Hyperdense middle cerebral artery sign means?', a: 'Intraluminal thrombus — an early ischaemic marker predicting large infarct/poor outcome; NOT a haemorrhage.' },
      { q: 'Thunderclap headache, CT at 8 h normal — next?', a: 'Lumbar puncture ≥12 h from onset for xanthochromia (bilirubin) — CT sensitivity for SAH has already begun to fall.' },
    ],
  },

  {
    id: 'u-asa-mallampati',
    title: 'ASA Grade & Mallampati — Risk Meets Airway',
    emoji: '😮',
    subjectCode: 'ANES',
    system: 'Airway & Perioperative',
    yield: 'core',
    oneLiner: 'One number grades the patient, one class grades the airway — and the fasting clock is 2-4-6.',
    plain:
      'The ASA physical status (I–V, with E appended for emergencies) quantifies systemic disease for the anaesthetist: from the healthy ASA-I to the moribund ASA-V, the II/III hinge is FUNCTIONAL LIMITATION. The Mallampati class (I–IV, seen in a seated patient with a maximally-open mouth) predicts difficult laryngoscopy — Class III–IV flag a difficult airway, confirmed with thyromental distance, mouth opening and neck movement. Both are one-minute assessments with life-long exam value.',
    steps: [
      { title: 'ASA I to V — and E', text: 'I: healthy. II: mild disease, NO functional limitation (controlled HTN/DM, smoker, BMI 30–40). III: severe disease WITH functional limitation (poorly controlled DM/HTN, COPD, dialysis). IV: constant threat to life (MI <3 months, decompensated heart failure). V: moribund, not expected to survive without surgery (ruptured AAA). E is appended for emergencies.' },
      { title: 'Mallampati — what you can see', text: 'Seated, tongue maximal, no phonation: Class I = soft palate, fauces, uvula and pillars visible; II = soft palate, fauces, uvula (pillars hidden); III = soft palate and BASE of uvula only; IV = hard palate alone. III–IV predict difficult laryngoscopy.' },
      { title: 'The airway battery beyond Mallampati', text: 'Thyromental distance <6 cm (~3 finger-breadths), interincisor gap <3 cm, limited neck extension, prominent incisors/receding mandible — the LEMON screen. Mallampati alone misses a large share of difficult airways; combine the tests.' },
      { title: 'Fasting and the plan', text: 'Elective: 6 h solids, 4 h breast milk, 2 h clear fluids — the 2-4-6 clock. Grade the patient, class the airway, then choose induction: a full stomach (obstruction, pregnancy, trauma) overrides the fasting clock with rapid-sequence induction.' },
    ],
    weak: [
      { title: 'Mallampati class vs Cormack grade', detail: 'Class = the pre-operative MOUTH view (I–IV); grade = the LARYNGOSCOPE view (Cormack–Lehane I–IV). Interchanging them in a viva is an instant credibility wound.', severity: 'frequent' },
      { title: 'The II/III hinge', detail: 'ASA-II has no functional limitation; ASA-III does (activity limited). "Diabetes" alone never decides the class — the control and the function do.', severity: 'tricky' },
      { title: 'Forgetting the E', detail: 'The emergency suffix changes everything: an ASA-II burst appendix becomes II-E with higher aspiration and physiological risk — forgetting E (and the rapid sequence it demands) is a classic trap.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Mallampati Class III means?', a: 'Only the soft palate and base of uvula visible — higher likelihood of difficult laryngoscopy (Cormack III/IV).' },
      { q: 'ASA-IV definition?', a: 'Severe systemic disease that is a constant threat to life — e.g. MI within 3 months, decompensated heart failure.' },
      { q: 'Fasting rules before elective anaesthesia?', a: '6 h solids, 4 h breast milk, 2 h clear fluids; emergencies/full stomach → rapid-sequence induction.' },
    ],
  },
]
