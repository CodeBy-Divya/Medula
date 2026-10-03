// ─── MEDOS 3D VISUAL LEARNING — diagram registry ───
// Each diagram renders a topic as a stack of floating 3D layers.
// Content is original, NMC CBME-aligned and cross-checked against standard
// references (Guyton, Robbins, Harrison's principles — restated simply).

export interface Layer3D {
  id: string
  label: string
  emoji: string
  /** depth position 0 (front) .. 6 (back) — rendered as translateZ offsets */
  z: number
  /** one-line simple explanation (shown when the layer is selected) */
  simple: string
  /** 1–2 line exam-grade detail */
  detail: string
  tint?: string // optional accent color (any CSS color)
}

export interface Diagram3D {
  conceptId: string
  title: string
  emoji: string
  /** plain-language intro shown above the stage */
  intro: string
  layers: Layer3D[]
  /** real-world anchor line shown under the stage */
  clinical: string
}

const D = (d: Diagram3D) => d

export const DIAGRAMS_3D: Record<string, Diagram3D> = {
  'c-acidbase': D({
    conceptId: 'c-acidbase',
    title: 'Acid–Base Balance',
    emoji: '⚖️',
    intro: 'Your body defends pH with three lines of defence — buffers act in seconds, lungs in minutes, kidneys in days.',
    clinical: 'Every ABG report is just these layers misbehaving — identify which line failed and compensation writes the diagnosis.',
    layers: [
      { id: 'buf', label: 'Buffers · seconds', emoji: '🛡️', z: 0, tint: '#38bdf8',
        simple: 'Bicarbonate soaks up extra acid instantly — the fastest shield.',
        detail: 'HCO₃⁻ is the main extracellular buffer; haemoglobin and proteins buffer inside cells. pKa 6.1 keeps blood pH near 7.4.' },
      { id: 'lung', label: 'Lungs · minutes', emoji: '🫁', z: 1, tint: '#34d399',
        simple: 'Blow off or hold back CO₂ to move pH within minutes.',
        detail: 'Ventilation controls pCO₂. Metabolic acidosis → Kussmaul breathing; metabolic alkalosis → hypoventilation (limited by hypoxia).' },
      { id: 'kid', label: 'Kidneys · days', emoji: '🫘', z: 2, tint: '#fbbf24',
        simple: 'Kidneys reabsorb HCO₃⁻ and excrete H⁺ — the slow but definitive fix.',
        detail: 'Full renal compensation takes 3–5 days. Respiratory acidosis → ↑HCO₃⁻ (1 acute / 3.5 chronic per 10 mmHg pCO₂).' },
      { id: 'winters', label: 'Winters formula', emoji: '🧮', z: 3, tint: '#fb7185',
        simple: 'Expected pCO₂ = 1.5 × HCO₃⁻ + 8 ± 2 — tells you if lungs are compensating.',
        detail: 'For metabolic acidosis. Measured pCO₂ higher than expected → additional respiratory acidosis (mixed disorder).' },
      { id: 'gap', label: 'Anion gap', emoji: '🔍', z: 4, tint: '#a78bfa',
        simple: 'Gap = Na − (Cl + HCO₃⁻); normal 8–12. High gap = add MUDPILES acid.',
        detail: 'Methanol, Uraemia, DKA, Propylene glycol, Isoniazid/Iron, Lactate, Ethylene glycol, Salicylates. Correct gap for albumin (↓2.5 per g/dL ↓albumin).' },
    ],
  }),

  'c-gfr': D({
    conceptId: 'c-gfr',
    title: 'The Nephron — where GFR happens',
    emoji: '🫘',
    intro: 'The nephron is a factory conveyor: filter in the glomerulus, then each segment reclaims exactly what the body needs.',
    clinical: 'Diuretic classes map one-to-one onto segments — know the segment, predict the drug and its electrolyte side-effects.',
    layers: [
      { id: 'glom', label: 'Glomerulus', emoji: '🧽', z: 0, tint: '#38bdf8',
        simple: 'Pressure filters ~125 mL/min of plasma; cells and big proteins stay behind.',
        detail: 'Filtration fraction = GFR/RPF ≈ 20%. Freely filters solutes < 5 kDa; albumin (69 kDa) excluded by size + negative charge.' },
      { id: 'pct', label: 'Proximal tubule', emoji: '♻️', z: 1, tint: '#34d399',
        simple: 'Bulk recycling: 65% of Na⁺, ALL glucose and amino acids.',
        detail: 'SGLT2 (glucose), Na⁺/H⁺ exchanger, isosmotic reabsorption. Damaged in Fanconi syndrome; glucose in urine when TM exceeded.' },
      { id: 'loop', label: 'Loop of Henle', emoji: '🔁', z: 2, tint: '#fbbf24',
        simple: 'Countercurrent multiplier builds the salt gradient — urine concentrates here.',
        detail: 'Thick ascending limb = NKCC2 cotransporter → target of furosemide. Impermeable descending limb; diluting segment above.' },
      { id: 'dct', label: 'Distal tubule', emoji: '🧂', z: 3, tint: '#fb7185',
        simple: 'Fine-tunes Na⁺ via NCC and handles calcium — thiazides act here.',
        detail: 'NCC = thiazide target. Thiazides ↑Ca²⁺ reabsorption (help stones, worsen hypercalcaemia); DCT also makes dilute urine.' },
      { id: 'cd', label: 'Collecting duct', emoji: '🚰', z: 4, tint: '#a78bfa',
        simple: 'Final gate: aldosterone saves Na⁺, ADH inserts water channels.',
        detail: 'ENaC (aldosterone → spironolactone blocks it; K⁺ sparing) and AQP-2 (ADH → desmopressin). Site of acid/base and K⁺ final balance.' },
      { id: 'jga', label: 'JG apparatus', emoji: '🎛️', z: 5, tint: '#22d3ee',
        simple: 'The pressure sensor: macula densa tastes NaCl, JG cells release renin.',
        detail: '↓NaCl at macula densa or ↓perfusion → renin → RAAS. Source of erythropoietin too (interstitial peritubular cells).' },
    ],
  }),

  'c-raas': D({
    conceptId: 'c-raas',
    title: 'RAAS — the pressure cascade',
    emoji: '🌊',
    intro: 'A drop in pressure triggers a hormone waterfall that ends with salt retention and tighter vessels.',
    clinical: 'Every antihypertensive class in this cascade was designed by interrupting one step of this diagram.',
    layers: [
      { id: 'trig', label: 'Trigger', emoji: '⚡', z: 0, tint: '#fbbf24',
        simple: 'Low BP, low salt at macula densa, or β₁ sympathetic drive switch it on.',
        detail: 'Three independent triggers converge on JG cells: renal hypoperfusion, ↓NaCl delivery, and β₁ stimulation (baroreceptor reflex).' },
      { id: 'renin', label: 'Renin', emoji: '🔓', z: 1, tint: '#38bdf8',
        simple: 'Renin cuts angiotensinogen → angiotensin I (the inert pro-hormone).',
        detail: 'Released by JG cells; the rate-limiting step. Direct renin inhibitor = aliskiren. Renin is also measured to differentiate hypertension subtypes.' },
      { id: 'ang2', label: 'Angiotensin II', emoji: '🧨', z: 2, tint: '#fb7185',
        simple: 'ACE in the lungs converts Ang I → II — the potent pressor hormone.',
        detail: 'ACE also degrades bradykinin → ACE inhibitors raise bradykinin (dry cough, angioedema). ARBs block the receptor instead.' },
      { id: 'aldo', label: 'Aldosterone', emoji: '🧂', z: 3, tint: '#34d399',
        simple: 'Adrenal cortex releases aldosterone: save Na⁺ and water, dump K⁺ and H⁺.',
        detail: 'Acts on ENaC in collecting duct → Na⁺ retention, K⁺ wasting (hypokalaemic alkalosis). Blocked by spironolactone/eplerenone.' },
      { id: 'fx', label: 'Other Ang-II effects', emoji: '💥', z: 4, tint: '#a78bfa',
        simple: 'Vasoconstriction, ADH + thirst, and cardiac/vessel remodelling.',
        detail: 'Ang II also stimulates ADH release and hypothalamic thirst, and drives hypertrophy (→ ARBs/ACEI protective in HFrEF and CKD).' },
    ],
  }),

  'c-coag': D({
    conceptId: 'c-coag',
    title: 'Coagulation Cascade',
    emoji: '🩸',
    intro: 'Two ignition switches (extrinsic & intrinsic) feed one final common pathway that makes the fibrin plug.',
    clinical: 'PT reads the extrinsic arm (warfarin), aPTT reads the intrinsic arm (heparin) — the lab tests are just probe wires onto this diagram.',
    layers: [
      { id: 'ext', label: 'Extrinsic · TF-VII', emoji: '⚡', z: 0, tint: '#fbbf24',
        simple: 'Injured tissue shows Factor VII its trigger — measured by PT/INR.',
        detail: 'Tissue factor + VIIa → X. Seconds-fast. Warfarin prolongs PT (↓II, VII, IX, X + proteins C & S — VII has the shortest half-life).' },
      { id: 'int', label: 'Intrinsic · XII→XI→IX→VIII', emoji: '🔗', z: 1, tint: '#38bdf8',
        simple: 'Damaged surfaces chain-activate factors — measured by aPTT.',
        detail: 'XII → XI → IX → VIII cascade. Heparin potentiates antithrombin → prolongs aPTT. Haemophilia A = VIII, B = IX (both prolong aPTT, normal PT).' },
      { id: 'common', label: 'Common pathway', emoji: '🏭', z: 2, tint: '#34d399',
        simple: 'X + V → prothrombin → thrombin → fibrin mesh (XIII cross-links it).',
        detail: 'Both arms converge at Xa. Thrombin also activates platelets and XIII. Fibrin cross-linking completes the stable clot.' },
      { id: 'drugs', label: 'Anticoagulant map', emoji: '💊', z: 3, tint: '#fb7185',
        simple: 'Warfarin → II,VII,IX,X · Heparin/DOAC → Xa/IIa · Aspirin ≠ this cascade (platelets).',
        detail: 'Warfarin: PT/INR. Unfractionated heparin: aPTT. Rivaroxaban/apixaban = Xa inhibitors; dabigatran = direct IIa. LMWH hits Xa mainly.' },
      { id: 'bal', label: 'Balance: C & S', emoji: '⚖️', z: 4, tint: '#a78bfa',
        simple: 'Protein C & S brake the clot — warfarin breaks them FIRST (skin necrosis).',
        detail: 'Protein C/S half-lives are shorter than II, IX, X → transient hypercoagulability in the first days of warfarin → bridge with heparin.' },
    ],
  }),

  'c-cardcycle': D({
    conceptId: 'c-cardcycle',
    title: 'The Cardiac Cycle',
    emoji: '💓',
    intro: 'One heartbeat, two pumps, four sounds — pressures and valves move in a strict sequence you can hear.',
    clinical: 'Murmurs are timing puzzles: systole = between S1–S2, diastole = S2–next S1. This cycle diagram is the decoder ring.',
    layers: [
      { id: 'fill', label: 'Rapid filling · S3', emoji: '💧', z: 0, tint: '#38bdf8',
        simple: 'Passive filling fills 80% — an S3 here means an overloaded ventricle.',
        detail: 'Early diastole: MV/TV open, pressure gradient pulls blood in. S3 (ventricular gallop) = normal in young/ pregnancy, pathological in volume overload/HF.' },
      { id: 'ast', label: 'Atrial kick · S4', emoji: '🦶', z: 1, tint: '#34d399',
        simple: 'The atria top up the tank — S4 appears when the ventricle is stiff.',
        detail: 'Contributes the last 20% ("atrial kick"). S4 = "atria fighting a stiff ventricle" (hypertrophy, ischaemia); absent in AF.' },
      { id: 'sys', label: 'Systole · S1 → ejection', emoji: '💥', z: 2, tint: '#fb7185',
        simple: 'AV valves slam shut (S1), pressure spikes, semilunars open, blood ejects.',
        detail: 'Isovolumetric contraction (MV/TV closed) → ejection (A/P valves open). S1 = mitral/tricuspid closure; loud in MS, soft in MR.' },
      { id: 'dias', label: 'Relaxation · S2', emoji: '🌬️', z: 3, tint: '#fbbf24',
        simple: 'Aortic & pulmonary valves close (S2) — A2 before P2 on inspiration.',
        detail: 'Inspiration splits S2 widely (↑venous return delays P2). Paradoxical splitting in LBBB; fixed split in ASD.' },
      { id: 'jvp', label: 'JVP waves a-c-v', emoji: '📈', z: 4, tint: '#a78bfa',
        simple: 'Neck veins draw the same cycle: a=atria squeeze, c=carotid kick, v=filling.',
        detail: "Cannon 'a' waves = AV dissociation (complete heart block); giant 'v' = TR; absent 'a' = AF. Kussmaul sign (↑JVP on inspire) = tamponade/constriction." },
    ],
  }),

  'c-ecg': D({
    conceptId: 'c-ecg',
    title: 'Reading the ECG',
    emoji: '📈',
    intro: 'The ECG is the heart\'s electrical story told wave by wave — each layer is one chapter.',
    clinical: 'ST-elevation territories localise the artery: V1–V4 = LAD/anterior, II-III-aVF = RCA/inferior, I-aVL-V5/6 = circumflex/lateral.',
    layers: [
      { id: 'p', label: 'P wave', emoji: '🅿️', z: 0, tint: '#38bdf8',
        simple: 'Atria depolarise — absent or chaotic P waves mean the sinus boss is gone.',
        detail: 'Normal <120 ms. No P + irregularly irregular = AF; sawtooth F waves = flutter; P before every QRS = sinus rhythm.' },
      { id: 'pr', label: 'PR interval', emoji: '⏱️', z: 1, tint: '#34d399',
        simple: 'AV junction delay (0.12–0.20 s) — long = block, short = bypass track.',
        detail: '>200 ms = 1° AV block. Short PR + delta wave = WPW. Progressive lengthening then drop = Mobitz I; dropped without warning = Mobitz II (pacing).' },
      { id: 'qrs', label: 'QRS complex', emoji: '⚡', z: 2, tint: '#fb7185',
        simple: 'Ventricles fire — wider than 3 small boxes means a bypass or bundle problem.',
        detail: 'Normal <120 ms. Wide QRS: BBB, hyperkalaemia (peaked T first!), ventricular origin. Pathological Q wave >1 box deep = past infarct.' },
      { id: 'st', label: 'ST segment & T wave', emoji: '🚨', z: 3, tint: '#fbbf24',
        simple: 'ST elevation = artery occlusion now; depressed ST = ischaemia or strain.',
        detail: 'ST↑ with reciprocal depression = STEMI. Diffuse ST↑ + PR depression = pericarditis. Peaked T = hyperkalaemia; U waves = hypokalaemia.' },
      { id: 'qt', label: 'QT interval', emoji: '🛏️', z: 4, tint: '#a78bfa',
        simple: 'Long QT invites torsades — count the drugs and salts first.',
        detail: 'QTc >500 ms (or >480 in women) → risk of torsades de pointes. Causes: macrolides/antipsychotics/antiemetics, ↓K⁺ ↓Mg²⁺ ↓Ca²⁺, congenital (Romano-Ward).' },
    ],
  }),

  'c-brachial': D({
    conceptId: 'c-brachial',
    title: 'Brachial Plexus',
    emoji: '🦾',
    intro: 'Roots → Trunks → Divisions → Cords → Branches. One line, five stations — every exam lesion hides in a station.',
    clinical: 'Waiter\'s tip = Erb (C5-6, upper trunk). Claw hand = Klumpke (C8-T1, lower trunk) — or ulnar nerve at the wrist.',
    layers: [
      { id: 'roots', label: 'Roots C5–T1', emoji: '🌱', z: 0, tint: '#34d399',
        simple: 'Five spinal roots leave the neck — C5 to T1 (plus small C4/T2 Variants).',
        detail: 'Long thoracic nerve (C5-7) leaves early → winged scapula if injured. Dorsal scapular (C5) → rhomboids.' },
      { id: 'trunks', label: 'Trunks', emoji: '🌳', z: 1, tint: '#38bdf8',
        simple: 'Roots braid into 3 trunks: superior (C5-6), middle (C7), inferior (C8-T1).',
        detail: 'Erb palsy = superior trunk traction (breech/shoulder dystocia) → waiter\u2019s tip. Klumpke = inferior traction (upward pull) → claw hand ± Horner (T1).' },
      { id: 'div', label: 'Divisions', emoji: '🔀', z: 2, tint: '#fbbf24',
        simple: 'Each trunk splits into an anterior and a posterior division — six strands.',
        detail: 'Anterior divisions → flexor compartment (lateral + medial cords); posterior divisions → extensor compartment (posterior cord). No clinical syndrome is isolated here.' },
      { id: 'cords', label: 'Cords', emoji: '🪢', z: 3, tint: '#fb7185',
        simple: 'Cords wrap the axillary artery and are named by position: lateral, posterior, medial.',
        detail: 'Lateral cord → musculocutaneous + lateral root of median. Posterior → axillary + radial. Medial → ulnar + medial root of median. M-shape around the artery.' },
      { id: 'branches', label: 'Terminal branches', emoji: '🖐️', z: 4, tint: '#a78bfa',
        simple: 'Rand Drinks Cold Beer: Radial, musculocutaneous, axillary, median, ulnar.',
        detail: 'Radial = Saturday-night palsy (wrist drop). Median = carpal tunnel, hand of benediction. Ulnar = claw. Axillary = surgical neck fracture (deltoid). Musculocutaneous = biceps reflex afferent/efferent.' },
    ],
  }),

  'c-cranial': D({
    conceptId: 'c-cranial',
    title: 'The 12 Cranial Nerves',
    emoji: '🧠',
    intro: 'Group the twelve by job: two smell & see, five pure motor, five mixed — and two that light up the pupils.',
    clinical: 'Tongue deviates TOWARD the lesion (XII), uvula deviates AWAY (X), face: LMN = whole half, UMN = lower half only.',
    layers: [
      { id: 'ss', label: 'Pure sensory', emoji: '👃', z: 0, tint: '#38bdf8',
        simple: 'I smell, II sees, VIII hears and balances.',
        detail: 'I olfactory (anosmia = cribriform plate fracture / frontal meningioma). II optic. VIII vestibulocochlear — tumours at the CPA involve VIII + V + VII together.' },
      { id: 'mm', label: 'Pure motor', emoji: '💪', z: 1, tint: '#34d399',
        simple: 'III, IV, VI move the eyes; XI shrugs, XII wags the tongue.',
        detail: 'III: down-out eye + blown pupil (compressive = emergency). IV: superior oblique (head tilt away). VI: fails abduction (false localising). XII: tongue deviates toward lesion.' },
      { id: 'mixed', label: 'Mixed nerves', emoji: '🔀', z: 2, tint: '#fbbf24',
        simple: 'V, VII, IX, X carry sensation + movement (± autonomic).',
        detail: 'V: face sensation + mastication (corneal reflex afferent). VII: facial muscles + taste anterior 2/3 (efferent limb of corneal reflex; Bell palsy = whole half). IX + X: gag reflex afferent/efferent.' },
      { id: 'ps', label: 'Autonomic cargo', emoji: '🌬️', z: 3, tint: '#fb7185',
        simple: 'III constricts pupils; VII/IX carry salivary and tear signals; X runs the viscera.',
        detail: 'III carries parasympathetics (ciliary ganglion). VII = submandibular/sublingual + lacrimal; IX = parotid. X = thoraco-abdominal parasympathetics until mid-transverse colon.' },
      { id: 'clinic', label: 'Rapid-fire lesions', emoji: '🎯', z: 4, tint: '#a78bfa',
        simple: 'Blown pupil = III compression · Ptosis + small pupil = Horner · Jaw jerk only in V.',
        detail: "Argyll Robertson pupil (accommodates, does not react) = neurosyphilis. Internuclear ophthalmoplegia = MLF lesion (MS). Cavernous sinus syndrome: III, IV, V1, VI all together." },
    ],
  }),

  'c-thyroidphys': D({
    conceptId: 'c-thyroidphys',
    title: 'Thyroid Hormone Factory',
    emoji: '🦋',
    intro: 'The thyroid builds hormone on a protein scaffold using captured iodine — controlled by a two-level feedback loop.',
    clinical: 'TSH is the most sensitive first test: ↑TSH = primary hypothyroid, ↓TSH = primary hyperthyroid — the gland and pituitary always argue inversely (when healthy).',
    layers: [
      { id: 'axis', label: 'TRH → TSH axis', emoji: '🎛️', z: 0, tint: '#38bdf8',
        simple: 'Hypothalamus (TRH) tells pituitary (TSH) tells thyroid — hormones close the loop.',
        detail: 'Negative feedback: high T4/T3 suppresses both TRH and TSH. Secondary (central) disease inverts this — check TSH before assuming.' },
      { id: 'trap', label: 'Iodide trapping', emoji: '🧲', z: 1, tint: '#34d399',
        simple: 'NIS pump grabs iodide from blood — radioiodine therapy exploits the same door.',
        detail: 'Na⁺/I⁻ symporter (NIS) concentrates iodide 20–40×. Blocked acutely by perchlorate/thiocyanate; Wolff-Chaikoff effect = iodide-load shutdown.' },
      { id: 'make', label: 'Synthesis (TPO)', emoji: '🏭', z: 2, tint: '#fbbf24',
        simple: 'Thyroglobulin + oxidised iodine + coupling = T4 (mostly) and T3.',
        detail: 'TPO oxidises & organifies iodide (blocked by carbimazole/PTU). Coupling MIT+DIT → T3; DIT+DIT → T4 (90% of output). Congenital TPO defect = commonest dyshormonogenesis.' },
      { id: 'conv', label: 'Transport & conversion', emoji: '🚚', z: 3, tint: '#fb7185',
        simple: 'T4 rides on TBG, then tissues convert T4 → the active T3.',
        detail: '5′-deiodinase makes T3 (4× active). OCP/pregnancy raise TBG → total T4 up but free T4 normal. PTU also blocks conversion (drug of choice in storm).' },
      { id: 'fx', label: 'Hormone effects', emoji: '🔥', z: 4, tint: '#a78bfa',
        simple: 'T3 raises BMR, heart rate, gut speed and bone turnover — everything idles higher.',
        detail: 'Nuclear receptor effects: ↑β-adrenergic sensitivity (tremor, sweating, tachycardia), ↑lipolysis, ↑glucose absorption, needed for brain myelination (Cretinism if congenital).' },
    ],
  }),

  'c-shock': D({
    conceptId: 'c-shock',
    title: 'Shock — four flavours',
    emoji: '🚨',
    intro: 'Shock = cells starving for oxygen, whatever the trigger. Classify by pump, pipes, volume or traffic jam.',
    clinical: 'Norepinephrine is first-line vasopressor in septic shock. Warm skin + wide pulse pressure early = distributive; cold + clamped = hypovolaemic/cardiogenic.',
    layers: [
      { id: 'hypo', label: 'Hypovolaemic', emoji: '🩸', z: 0, tint: '#fbbf24',
        simple: 'Tank empty: haemorrhage or fluid loss — flat veins, cold and clamped.',
        detail: 'ATLS classes I–IV by blood loss (15/30/40%>40). Compensating: ↑HR first, BP falls late (decompensation). 1:1:1 balanced resuscitation, control the source.' },
      { id: 'cardio', label: 'Cardiogenic', emoji: '💔', z: 1, tint: '#fb7185',
        simple: 'Pump failed (big MI): lungs wet, neck veins full, cold peripheries.',
        detail: 'PCWP ↑, CI ↓. Avoid aggressive fluids — inotropes (dobutamine) + revascularisation. Mortality highest; consider IABP/MCS bridge.' },
      { id: 'distr', label: 'Distributive', emoji: '🌡️', z: 2, tint: '#38bdf8',
        simple: 'Pipes wide open (sepsis, anaphylaxis, neurogenic): warm skin, wide pulse pressure.',
        detail: 'SVR ↓. Septic shock = lactate >2 after fluids + pressors (Sepsis-3). Anaphylaxis → IM adrenaline 0.5 mg. Neurogenic loses sympathetic tone (no reflex tachycardia).' },
      { id: 'obstr', label: 'Obstructive', emoji: '🚧', z: 3, tint: '#a78bfa',
        simple: 'Traffic jam outside the pump: tamponade, tension pneumothorax, massive PE.',
        detail: 'Pulsus paradoxus + Kussmaul = tamponade (pericardiocentesis). Tracheal deviation + silent chest = tension (needle decompression first). PE: thrombolysis if unstable.' },
      { id: 'mon', label: 'Endpoints of resus', emoji: '🎯', z: 4, tint: '#34d399',
        simple: 'Follow MAP ≥65, lactate clearance, urine output — not just the BP number.',
        detail: 'Early goal-directed therapy essentials: MAP ≥ 65 mmHg, urine >0.5 mL/kg/h, lactate clearing. ScvO₂ trends reflect the balance.' },
    ],
  }),

  'c-arrhythmia': D({
    conceptId: 'c-arrhythmia',
    title: 'Arrhythmias by address',
    emoji: '❤️‍🔥',
    intro: 'Every tachyarrhythmia lives at a level of the conduction system — name the floor, choose the drug.',
    clinical: 'Unstable (shock, chest pain, syncope) = synchronised cardioversion regardless of rhythm. Adenosine for SVT, amiodarone for VT-with-pulse, magnesium for torsades.',
    layers: [
      { id: 'sinus', label: 'Sinus node', emoji: '🧭', z: 0, tint: '#38bdf8',
        simple: 'Normal pacemaker gone fast (>100) or slow (<50) — usually physiological or drug-driven.',
        detail: 'Sinus tachy: pain/fever/anaemia/thyroid. Sinus brady: athlete, β-blocker, CCF... Treat the cause first; atropine/pacing only if symptomatic.' },
      { id: 'atria', label: 'Atrial', emoji: '🌀', z: 1, tint: '#34d399',
        simple: 'AF = irregularly irregular, no P. Flutter = sawtooth. SVT = sudden regular palpitations.',
        detail: 'AF: rate control (βB/diltiazem), anticoagulate by CHA₂DS₂-VASc. SVT: vagal → adenosine 6→12 mg. Flutter: ablation cures cavotricuspid isthmus.' },
      { id: 'av', label: 'AV node blocks', emoji: '🚦', z: 2, tint: '#fbbf24',
        simple: '1° = long PR. 2° Mobitz I = lengthening then drop; Mobitz II = sudden drop. 3° = complete divorce.',
        detail: "Mobitz I usually benign (vagal/inferior MI). Mobitz II + 3° AVB → permanent pacemaker. Cannon 'a' waves + variable intensity S1 = 3° block." },
      { id: 'vent', label: 'Ventricular', emoji: '⚡', z: 3, tint: '#fb7185',
        simple: 'VT = broad regular. VF = chaotic, pulseless. Torsades = VT on long QT twisting baseline.',
        detail: 'VT with pulse: amiodarone infusion. VF/pulseless VT: defibrillate + CPR + adrenaline/ amiodarone. Torsades: IV magnesium ± overdrive pacing, stop QT drugs.' },
      { id: 'dig', label: 'Digoxin note', emoji: '💊', z: 4, tint: '#a78bfa',
        simple: 'Digoxin slows AV conduction (rate control) — toxicity: arrhythmias + yellow vision.',
        detail: 'Sodium-pump inhibitor, positive inotrope. Toxicity worsened by hypokalaemia/hypercalcaemia; treat with Digibind (Fab fragments).' },
    ],
  }),

  'c-hyperk': D({
    conceptId: 'c-hyperk',
    title: 'Hyperkalaemia — the ECG timebomb',
    emoji: '🧯',
    intro: 'Potassium climbs silently until the heart changes shape on ECG — treat in three moves: stabilise, shift, remove.',
    clinical: 'Peaked T waves → give calcium gluconate NOW (membrane stabiliser), then insulin-glucose to shift K⁺ into cells, then remove it (resin/dialysis).',
    layers: [
      { id: 'cause', label: 'Causes', emoji: '🧾', z: 0, tint: '#fbbf24',
        simple: 'CKD, ACEi/ARB + K-sparing drugs, acidosis, burns/rhabdo, adrenal failure.',
        detail: 'Check first for pseudohyperkalaemia (haemolysed sample, thrombocytosis). Addison crisis = hypoNa + hyperK + hypotension.' },
      { id: 'ecg', label: 'ECG progression', emoji: '📈', z: 1, tint: '#fb7185',
        simple: 'Peaked T → flat P → wide QRS → sine wave → asystole. The rhythm is a timer.',
        detail: 'Peaked T (tented) is earliest. Progressive widening ends in a sine-wave pattern — sine wave needs immediate Ca²⁺ regardless of K value.' },
      { id: 'stab', label: '1 · Stabilise', emoji: '🛡️', z: 2, tint: '#38bdf8',
        simple: 'IV calcium gluconate protects the myocardium for 30–60 min (does NOT lower K⁺).',
        detail: '10 mL 10% Ca-gluconate over 2–3 min, repeat after 5 min if ECG unchanged. Digoxin toxicity is the caution (give via central line).' },
      { id: 'shift', label: '2 · Shift into cells', emoji: '🔄', z: 3, tint: '#34d399',
        simple: 'Insulin 10 U + 25 g glucose, nebulised salbutamol ± bicarbonate (if acidotic).',
        detail: 'Insulin drives K⁺ into cells via Na⁺/K⁺-ATPase — guard glucose for ~1 h. β2-agonists are additive (dose 10–20 mg). Bicarb only if acidosis present.' },
      { id: 'remove', label: '3 · Remove from body', emoji: '🚿', z: 4, tint: '#a78bfa',
        simple: 'Loop diuretics, K⁺-binders (patiromer/SZC), or dialysis for the definitive drop.',
        detail: 'Haemodialysis = fastest (refractory/renal failure). Sodium polystyrene is slow (hours) and Na⁺-loading. Stop all K⁺ sources meanwhile.' },
    ],
  }),

  'c-glycogen': D({
    conceptId: 'c-glycogen',
    title: 'Glycogen Storage Diseases',
    emoji: '🍬',
    intro: 'A missing enzyme blocks the sugar-storage pathway at a different step — each step is a different disease with a signature organ.',
    clinical: 'Von Gierke = fasting hypoglycaemia + hepatomegaly + lactic acidosis (treat with cornstarch). Pompe = baby with massive heart. McArdle = exercise cramps, lactate does NOT rise.',
    layers: [
      { id: 'vong', label: 'Von Gierke · Type I', emoji: '🍰', z: 0, tint: '#fb7185',
        simple: 'No glucose-6-phosphatase → liver can\'t release sugar: fast-fed cycle chaos.',
        detail: 'Autosomal recessive. Severe fasting hypoglycaemia, hepatomegaly, lactic acidosis, hyperuricaemia (gout), hyperlipidaemia. Frequent cornstarch feeds; adenomas in adulthood.' },
      { id: 'pompe', label: 'Pompe · Type II', emoji: '💗', z: 1, tint: '#38bdf8',
        simple: 'Lysosomal α-glucosidase missing → glycogen floods the heart — the pumping cardiomyopathy baby.',
        detail: 'Pompe = the ONLY lysosomal GSD. Floppy infant + hypertrophic cardiomegaly + macroglossia. ERT (alglucosidase alfa) available; CK normal-ish.' },
      { id: 'cori', label: 'Cori · Type III', emoji: '🧱', z: 2, tint: '#fbbf24',
        simple: 'Debrancher enzyme missing → short branches pile up ("limit dextrin").',
        detail: 'Milder Von Gierke look-alike: hepatomegaly + hypoglycaemia but lactic acidosis mild; muscles involved. Dextrans of ~4 glucose units accumulate.' },
      { id: 'mcardle', label: 'McArdle · Type V', emoji: '🏃', z: 3, tint: '#34d399',
        simple: 'Muscle phosphorylase missing → cramps on exertion, second-wind phenomenon, flat lactate.',
        detail: 'Ischaemic forearm exercise: lactate FAILS to rise, and there is a second-wind phenomenon. Sucrose pre-exercise helps.' },
      { id: 'rule', label: 'Pattern rule', emoji: '🧭', z: 4, tint: '#a78bfa',
        simple: 'Liver types = hypoglycaemia + hepatomegaly. Muscle types = weakness + cramps, no hypoglycaemia.',
        detail: 'Number the enzyme in the pathway: G6Pase (I), lysosomal α-glucosidase (II), debrancher (III), brancher (IV, cirrhosis), muscle phosphorylase (V), liver phosphorylase (VI, Hers).' },
    ],
  }),

  'c-antidotes': D({
    conceptId: 'c-antidotes',
    title: 'Poisons & Antidotes',
    emoji: '🧪',
    intro: 'Ten poisons cover 90% of exam questions — each antidote works at a different rung of the poison\'s ladder.',
    clinical: 'Acetaminophen + NAC, opioids + naloxone, organophosphates + atropine/PAM, methanol + fomepizole — memorise as pairs, tested almost every year.',
    layers: [
      { id: 'apap', label: 'Acetaminophen → NAC', emoji: '💊', z: 0, tint: '#38bdf8',
        simple: 'NAC refills glutathione and shields the liver — best within 8 h.',
        detail: 'Toxic metabolite NAPQI depletes glutathione. Rumack-Matthew nomogram plots level vs time; stage II (24–72 h) RUQ pain + ↑ALT/AST.' },
      { id: 'opioid', label: 'Opioids → Naloxone', emoji: '🆘', z: 1, tint: '#34d399',
        simple: 'Naloxone kicks opioids off receptors — short action, may need infusion.',
        detail: 'Triad: miosis, respiratory depression, coma. Naloxone 0.4–2 mg IV; re-sedates in ~30–45 min (heroin long half-life).' },
      { id: 'op', label: 'Organophosphates → Atropine + PAM', emoji: '🐛', z: 2, tint: '#fbbf24',
        simple: 'SLUDGE cholinergic flood: dry it with atropine, revive the enzyme with pralidoxime.',
        detail: 'AChE inhibited → muscarinic (salivation, miosis, bronchorrhoea) + nicotinic (fasciculations, weakness). Atropine until chest clear; PAM reactivates AChE early.' },
      { id: 'alcohol', label: 'Methanol/EG → Fomepizole', emoji: '🥃', z: 3, tint: '#fb7185',
        simple: 'Fomepizole blocks alcohol dehydrogenase so the acids never form.',
        detail: 'Methanol → formic acid (visual loss, basal ganglia). Ethylene glycol → oxalate (AKI, hypocalcaemia, envelope crystals). ± Dialysis for acidosis/organ failure.' },
      { id: 'misc', label: 'More pairs', emoji: '🔗', z: 4, tint: '#a78bfa',
        simple: 'CO → O₂ · Benzos → flumazenil (careful) · Iron → desferrioxamine · Lead → succimer · Snake → ASV.',
        detail: 'CO: 100% O₂ (half-life 240→60 min; hyperbaric if pregnant/neuro). Russell viper ASV for haemotoxic + neurotoxic bites; neostigmine for neurotoxic signs.' },
    ],
  }),

  'c-tof': D({
    conceptId: 'c-tof',
    title: 'Tetralogy of Fallot',
    emoji: '🫀',
    intro: 'One embryological mistake (anterocephalad VSD) creates four defects — the degree of RVOT obstruction sets the cyanosis.',
    clinical: 'Tet spells: squatting (↑SVR) + O₂ + morphine. Boot-shaped heart on CXR; single S2; harsh systolic murmur of PS (not the VSD).',
    layers: [
      { id: 'vsd', label: '1 · Large VSD', emoji: '🕳️', z: 0, tint: '#38bdf8',
        simple: 'A big hole between the ventricles — one shared exit pressure.',
        detail: 'Non-restrictive perimembranous VSD from anterocephalad deviation of the outlet septum; equalises RV/LV pressures.' },
      { id: 'rvot', label: '2 · RVOT obstruction', emoji: '🚧', z: 1, tint: '#fb7185',
        simple: 'Narrow pulmonary outflow — the MORE blocked, the MORE blue.',
        detail: 'Subvalvular (infundibular) ± valvular PS. Degree of obstruction determines shunt direction and cyanosis severity; the murmur is from this, not the VSD.' },
      { id: 'ao', label: '3 · Overriding aorta', emoji: '🚰', z: 2, tint: '#fbbf24',
        simple: 'The aorta straddles the VSD — it collects blood from both ventricles.',
        detail: 'Aorta sits over the defect, receiving deoxygenated RV blood directly → systemic desaturation.' },
      { id: 'rvh', label: '4 · RV hypertrophy', emoji: '💪', z: 3, tint: '#34d399',
        simple: 'The right ventricle thickens against the blockage — boot-shaped heart.',
        detail: 'CXR: boot-shaped (coeur en sabot), concave pulmonary segment, oligaemic lung fields. ECG: RAD + RVH in a baby.' },
      { id: 'spell', label: 'Tet spells', emoji: '🧎', z: 4, tint: '#a78bfa',
        simple: 'Crying → infundibulum spasms → cyanosis crisis: kneel, breathe, soothe, phenylephrine.',
        detail: 'Management: knee-chest position, 100% O₂, morphine (sedation ↓catecholamines), IV fluids, phenylephrine (↑SVR) ± propranolol. Definitive repair at 3–6 months.' },
    ],
  }),

  'c-pph': D({
    conceptId: 'c-pph',
    title: 'Postpartum Haemorrhage — 4 Ts',
    emoji: '🩺',
    intro: 'Blood loss >500 mL after delivery: ask which of the four Ts failed — Tone first, because it\'s 80% of the answer.',
    clinical: 'First move for atony: uterine massage + oxytocin ± carboprost/misoprostol; bimanual compression buys time. Also check for trauma, retained tissue and clotting failure.',
    layers: [
      { id: 'tone', label: 'Tone · 80%', emoji: '🫱', z: 0, tint: '#fb7185',
        simple: 'Uterine atony — a soft, boggy uterus that forgot to clamp itself shut.',
        detail: 'Risk: overdistension (twins, polyhydramnios), prolonged oxytocin labour, MgSO₄, chorioamnionitis. Uterotonics ladder: oxytocin → ergometrine (no HTN) → carboprost (no asthma) → misoprostol.' },
      { id: 'trauma', label: 'Trauma', emoji: '🩹', z: 1, tint: '#fbbf24',
        simple: 'Cuts and tears: perineal, vaginal, cervical, or a hidden rupture.',
        detail: 'Inspect in order after excluding atony. Continues to bleed despite a firm uterus. Repair under adequate exposure; check uterine rupture in previous-scar labour.' },
      { id: 'tissue', label: 'Tissue', emoji: '🧩', z: 2, tint: '#38bdf8',
        simple: 'Retained placenta or membranes keep the uterus from contracting.',
        detail: 'Inspect the placenta for missing cotyledons/vessels; ultrasound for retained products. Manual removal in theatre; consider succenturiate lobe and accreta spectrum.' },
      { id: 'thrombin', label: 'Thrombin', emoji: '🧪', z: 3, tint: '#34d399',
        simple: 'Clotting itself fails — dilutional coagulopathy, DIC, or inherited disorder.',
        detail: 'Look for oozing from IV sites, ↓platelets, ↑PT/aPTT, low fibrinogen. Blood products early: RBC + FFP + platelets/cryoprecipitate; activate MTP.' },
      { id: 'shock', label: 'Shock & escalation', emoji: '🚨', z: 4, tint: '#a78bfa',
        simple: 'Two wide-bore IVs, TXA, 1:1:1 resuscitation — escalate to balloon/surgery if refractory.',
        detail: 'Tranexamic acid (WOMAN trial: within 3 h). Escalation: intrauterine balloon → B-Lynch suture → uterine artery ligation → hysterectomy (last resort).' },
    ],
  }),

  'c-preec': D({
    conceptId: 'c-preec',
    title: 'Pre-eclampsia Spectrum',
    emoji: '🤰',
    intro: 'New hypertension after 20 weeks with organ involvement — the only cure is delivery, everything else buys time.',
    clinical: 'MgSO₄ for seizures (eclampsia), labetalol/nifedipine/methyldopa for BP, steroids for lung maturity before 34 weeks. Headache + visual flashes + epigastric pain = imminent eclampsia.',
    layers: [
      { id: 'def', label: 'Definition', emoji: '📋', z: 0, tint: '#38bdf8',
        simple: 'BP ≥140/90 after 20 weeks + proteinuria (or organ signs) in a previously normotensive woman.',
        detail: 'Gestational HTN = BP alone; pre-eclampsia adds proteinuria/organ dysfunction. Severe features: ≥160/110, platelets <100k, Cr ↑, LFTs ×2, pulmonary oedema, neuro symptoms.' },
      { id: 'path', label: 'Pathology', emoji: '🔬', z: 1, tint: '#fbbf24',
        simple: 'Bad placentation: spiral arteries never remodel → ischaemic placenta poisons the mother\'s endothelium.',
        detail: 'Failed trophoblast invasion → ↑sFlt-1, ↓PIGF → generalised endothelial dysfunction (that\'s why seizures, hepatic and renal injury all appear together).' },
      { id: 'risk', label: 'Risk & prevention', emoji: '🛡️', z: 2, tint: '#34d399',
        simple: 'Primigravida, multiple pregnancy, molar, CKD/HTN/diabetes, previous PET → low-dose aspirin from 12 weeks.',
        detail: 'USPSTF/WHO: aspirin 75–150 mg nightly for high-risk women started before 16–20 weeks; calcium supplementation where dietary intake is low.' },
      { id: 'ec', label: 'Eclampsia & HELLP', emoji: '⚡', z: 3, tint: '#fb7185',
        simple: 'Eclampsia = PET + seizures. HELLP = haemolysis, ↑liver enzymes, low platelets — may lack the BP story.',
        detail: 'MgSO₄ loading 4 g IV then 1 g/h; reflexes + RR + urine monitored; calcium gluconate reverses toxicity. HELLP: deliver after stabilisation.' },
      { id: 'mgmt', label: 'Management', emoji: '🎯', z: 4, tint: '#a78bfa',
        simple: 'Control BP (keep diastolic >90 for placental flow — never drop hard), steroids, deliver at 34 weeks or earlier if unstable.',
        detail: 'Antihypertensives: labetalol IV, nifedipine oral, methyldopa (long-term). AVOID ACEi/ARB (fetal). Expectant care only if stable <34 w with daily feto-maternal monitoring.' },
    ],
  }),
}

// ─── Fallback builder ────────────────────────────────────────────────────────
// Turns any ConceptDetail into a layered 3D diagram using its detail sections,
// so EVERY topic in the map gets a 3D treatment — even without a custom scene.

import type { ConceptDetail, Section } from './types'

const KIND_EMOJI: Record<string, string> = {
  concept: '💡', disease: '🩺', drug: '💊', investigation: '🔬',
  physiology: '⚡', anatomy: '🦴', pathology: '🧫', pharmacology: '💉',
  microbiology: '🦠', clinical_skill: '🤲',
}

export function buildFallbackDiagram(c: ConceptDetail): Diagram3D {
  const emoji = KIND_EMOJI[c.kind] ?? '💡'
  const layers: Layer3D[] = []

  if (c.detail && c.detail.length > 0) {
    c.detail.slice(0, 6).forEach((sec: Section, i: number) => {
      const first = sec.body?.[0] ?? (sec.table ? sec.table.rows[0]?.join(' · ') : '') ?? ''
      layers.push({
        id: `sec-${i}`,
        label: sec.h,
        emoji: LAYER_EMOJIS[i % LAYER_EMOJIS.length],
        z: i,
        simple: first.length > 130 ? `${first.slice(0, 127)}…` : (first || 'Open the detail view for the full note.'),
        detail: (sec.body ?? []).slice(1, 3).join(' ') || first,
      })
    })
  }

  if (layers.length === 0) {
    layers.push(
      { id: 'what', label: 'What is it', emoji: '💡', z: 0,
        simple: c.summary, detail: c.summary },
      { id: 'why', label: 'Why it matters', emoji: '🎯', z: 1,
        simple: c.whyMatters, detail: c.whyMatters },
    )
    if (c.mnemonic) {
      layers.push({ id: 'mn', label: 'Mnemonic', emoji: '🧠', z: 2,
        simple: c.mnemonic, detail: c.mnemonic })
    }
  }

  return {
    conceptId: c.id,
    title: c.name,
    emoji,
    intro: c.summary,
    clinical: c.clinicalRelevance >= 4
      ? 'High-yield clinical concept — examiners love the application layers here.'
      : 'Tap a layer to bring it forward and read the simple explanation.',
    layers,
  }
}

const LAYER_EMOJIS = ['💡', '🧩', '🔬', '🫀', '🧪', '🧠', '⚡', '🦠']

export function getDiagram3D(conceptId: string, detail: ConceptDetail): Diagram3D {
  return DIAGRAMS_3D[conceptId] ?? buildFallbackDiagram(detail)
}
