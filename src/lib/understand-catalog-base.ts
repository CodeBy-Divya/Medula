// ─── UNDERSTAND · base catalog ───
// Flagship living-scene topics + starter entries. Subject codes mirror the
// Subject table exactly. Content: NMC CBME 2024 / NEET-PG blueprint aligned,
// cross-checked against Guyton, Robbins and Harrison's (restated simply).

import type { UnderstandTopic } from './understand-types'

export const BASE_TOPICS: UnderstandTopic[] = [
  {
    id: 'u-heart',
    title: 'The Beating Heart',
    emoji: '❤️',
    subjectCode: 'PHYS',
    system: 'Cardiovascular',
    yield: 'must',
    sceneId: 'heart',
    oneLiner: 'Two pumps in one muscle — blue blood to the lungs, red blood to the body.',
    plain:
      'The heart is two pumps side by side. The RIGHT heart receives deoxygenated blood from the body and sends it to the lungs; the LEFT heart receives oxygenated blood from the lungs and drives it to the whole body. Every beat starts with an electrical spark and ends with valves snapping shut — that is why the heart is best understood as electrics, plumbing and doors working together.',
    steps: [
      { title: 'Two pumps, one muscle', anchor: 'whole', text: 'Right side (blue) always points at the lungs; left side (red) points at the body. Septum keeps the two streams from ever mixing.' },
      { title: 'Atria top-up the fill', anchor: 'atria', text: 'Atria contract first — they are the "top-up pump" that squeezes the last 20–30% of blood into the ventricles before the big squeeze.' },
      { title: 'Systole — the big squeeze', anchor: 'ventricles', text: 'Ventricles contract, pressure shoots up, semilunar valves fly open and blood is ejected into the pulmonary artery and aorta. The LV does the hardest work — hence its wall is thickest.' },
      { title: 'The spark starts it all', anchor: 'conduction', text: 'SA node fires (the natural pacemaker) → AV node delays briefly so atria finish emptying → bundle of His and Purkinje fibres light the ventricles bottom-up.' },
      { title: 'Valves guard every door', anchor: 'valves', text: 'AV valves (tricuspid, mitral) slam at systole start = S1 "lub". Semilunar valves (aortic, pulmonary) slam at systole end = S2 "dub". Murmurs are doors that leak or refuse to open.' },
    ],
    weak: [
      { title: 'Left/right flips on imaging', detail: 'The heart\'s LEFT appears on the viewer\'s RIGHT on a PA X-ray. Exams love mirroring traps — always say "patient\'s left".', severity: 'frequent', anchor: 'whole' },
      { title: 'Pulmonary artery ≠ oxygenated', detail: 'Artery = "vessel carrying blood AWAY from heart", not oxygen-rich. The pulmonary artery carries deoxygenated blood; pulmonary veins carry oxygenated blood.', severity: 'frequent', anchor: 'pa' },
      { title: 'Murmur timing', detail: 'Systolic murmur = between S1 and S2 (stenosis of outflow valves OR regurgitation of AV valves). Diastolic = after S2. Timing first, then valve.', severity: 'tricky', anchor: 'valves' },
      { title: 'Why LV hypertrophy first', detail: 'Systemic resistance is ~5× pulmonary resistance, so the LV wall thickens under chronic pressure load (hypertension, aortic stenosis).', severity: 'tricky', anchor: 'ventricles' },
    ],
    traps: [
      { q: 'Sequence of blood flow through the right heart?', a: 'RA → tricuspid → RV → pulmonary (semilunar) valve → pulmonary ARTERY (deoxygenated) → lungs.' },
      { q: 'First heart sound (S1) is caused by…?', a: 'Closure of the AV valves (mitral + tricuspid) at the START of ventricular systole — not by the muscle itself.' },
      { q: 'Thickest chamber and why?', a: 'Left ventricle — it pumps against systemic resistance (~5× pulmonary), so pressure work thickens its wall.' },
    ],
  },

  {
    id: 'u-ecg',
    title: 'The ECG, Wave by Wave',
    emoji: '📈',
    subjectCode: 'PHYS',
    system: 'Cardiovascular',
    yield: 'must',
    sceneId: 'ecg',
    oneLiner: 'The heart writes its own diary — every wave is a chamber doing something electric.',
    plain:
      'An ECG is the summed electrical activity of the heart seen from the skin. Each P wave is atrial depolarisation, each QRS is ventricular depolarisation, and the T wave is ventricular reset. If you can name what the heart is DOING during each segment, you can decode every rhythm and every interval without memorising patterns blindly.',
    steps: [
      { title: 'P — atria fire', anchor: 'p', text: 'SA impulse spreads across atria → small rounded bump. Atrial fibrillation = no P waves, just a wavy baseline.' },
      { title: 'PR — the gatekeeper pause', anchor: 'pr', text: 'AV node deliberately delays ~0.12–0.20 s (3–5 small squares) so ventricles wait for atrial emptying. Longer = AV block.' },
      { title: 'QRS — ventricles fire', anchor: 'qrs', text: 'Purkinje system ignites both ventricles bottom-up in <0.12 s. Wide QRS means the impulse started inside the ventricles (escape/beats, bundle branch block, toxicity).' },
      { title: 'ST — the plateau', anchor: 'st', text: 'All ventricular cells are depolarised together — the line sits isoelectric. Elevation or depression here is the classic fingerprint of ischaemia/infarction.' },
      { title: 'T — the reset', anchor: 't', text: 'Ventricles repolarise (outside-in, the opposite of conduction order) → broad smooth wave. Peaked T = hyperkalaemia; inverted T = ischaemia.' },
      { title: 'QT — fire + reset window', anchor: 'qt', text: 'QT spans depolarisation + repolarisation. Drugs and electrolytes prolong it → risk of torsades. Correct QT for heart rate (QTc).' },
    ],
    weak: [
      { title: 'Counting the PR interval', detail: 'Normal PR = 0.12–0.20 s = 3–5 small squares. Students over-read first-degree block on borderline tracings — count the squares.', severity: 'frequent', anchor: 'pr' },
      { title: 'Wide vs narrow QRS logic', detail: 'Narrow = travelled the His–Purkinje highway; wide (≥0.12 s) = ventricular origin or aberrant conduction. This one rule organises tachycardia diagnosis.', severity: 'tricky', anchor: 'qrs' },
      { title: 'ST elevation territory', detail: 'Leads II/III/aVF = inferior (RCA usually); V1–V4 = anterior (LAD); I/aVL/V5–V6 = lateral. Localise the artery, don\'t just name the finding.', severity: 'deadly', anchor: 'st' },
      { title: 'Rate without a ruler', detail: '300 ÷ number of large squares between R waves (regular rhythm). Chain: memorise 300-150-100-75-60-50.', severity: 'frequent', anchor: 'qrs' },
    ],
    traps: [
      { q: 'Absent P waves + irregularly irregular rhythm = ?', a: 'Atrial fibrillation — no coordinated atrial activity, no P waves, fibrillatory baseline.' },
      { q: 'Peaked (tented) T waves should make you check…?', a: 'Serum potassium — hyperkalaemia, before it degenerates into wide QRS and arrest.' },
      { q: 'PR longer than 5 small squares with every beat conducted = ?', a: 'First-degree AV block — constant delay, every P still followed by a QRS.' },
    ],
  },

  {
    id: 'u-nephron',
    title: 'The Nephron — Renal Conveyor Belt',
    emoji: '🫘',
    subjectCode: 'PHYS',
    system: 'Renal',
    yield: 'must',
    sceneId: 'nephron',
    oneLiner: 'Filter, reclaim, fine-tune — every diuretic you know lives at one exact segment.',
    plain:
      'The nephron is a factory conveyor: the glomerulus filters ~125 mL/min of plasma, then each specialised segment reclaims exactly what the body needs. Because every segment has its own transporter, each diuretic class "lives" at one segment — learn the segment and the drug, its electrolyte effects and its side-effects follow automatically.',
    steps: [
      { title: 'Glomerulus — the filter', anchor: 'glom', text: 'Hydrostatic pressure pushes water and small solutes out; cells and albumin stay. Filtration fraction ≈ 20% of renal plasma flow.' },
      { title: 'Proximal tubule — bulk recycling', anchor: 'pct', text: 'Reclaims ~65% of Na⁺ and essentially ALL glucose and amino acids (SGLT2, Na⁺/H⁺). Isosmotic — water follows salt.' },
      { title: 'Loop of Henle — the salt gradient', anchor: 'loop', text: 'Thick ascending limb pumps Na-K-2Cl (NKCC2) into the medulla — building the gradient the collecting duct will later exploit. Furosemide paralyses this pump.' },
      { title: 'Distal tubule — fine tuning', anchor: 'dct', text: 'NCC cotransporter — the thiazide target. Also the calcium-handling segment: thiazides increase Ca²⁺ reabsorption (good for stones).' },
      { title: 'Collecting duct — the final gate', anchor: 'cd', text: 'Aldosterone opens ENaC (save Na⁺, dump K⁺); ADH inserts aquaporin-2 water channels. Spironolactone blocks the aldosterone receptor — K⁺-sparing.' },
      { title: 'JG apparatus — the sensor', anchor: 'jga', text: 'Macula densa reads NaCl at the end of the loop; JG cells release renin when perfusion or salt delivery drops — the ignition of the RAAS cascade.' },
    ],
    weak: [
      { title: 'Diuretic ↔ segment mismatch', detail: 'Loop diuretic acts on the THICK ASCENDING limb (NKCC2), thiazide on the DISTAL tubule (NCC), amiloride/spironolactone on the collecting duct (ENaC/MR). Mixed-up pairs are a guaranteed lost mark.', severity: 'frequent', anchor: 'loop' },
      { title: 'Where glucose reabsorption ends', detail: 'Glucose is 100% reclaimed in the PCT — glucosuria means either plasma load exceeds Tm (hyperglycaemia) or PCT damage (Fanconi).', severity: 'frequent', anchor: 'pct' },
      { title: 'Countercurrent direction confusion', detail: 'Descending limb = WATER leaves (permeable, no pumps); ascending = SALT leaves (pumps, water-impermeable). Saying it backwards destroys the gradient story.', severity: 'tricky', anchor: 'loop' },
      { title: 'ADH acts on the duct, not the loop', detail: 'Vasopressin inserts AQP-2 in the COLLECTING DUCT. Concentrating ability = gradient (loop) × water channels (ADH) — two separate machines.', severity: 'tricky', anchor: 'cd' },
    ],
    traps: [
      { q: 'Drug of choice causing hyponatraemia in the elderly?', a: 'Thiazides — they impair dilution (act on cortical diluting segment) while loops preserve medullary washout better.' },
      { q: 'Furosemide causes hypocalcaemia or hypercalcaemia?', a: 'Hypocalcaemia — loops dump Ca²⁺ (opposite of thiazides). Used to treat hypercalcaemia with fluids.' },
      { q: 'Renin comes from which cells, sensing what?', a: 'JG cells of the afferent arteriole, triggered by low perfusion pressure, sympathetic drive, and low NaCl at the macula densa.' },
    ],
  },

  {
    id: 'u-alveolus',
    title: 'Alveolus — Where Breath Becomes Blood',
    emoji: '🫁',
    subjectCode: 'PHYS',
    system: 'Respiratory',
    yield: 'must',
    sceneId: 'alveolus',
    oneLiner: 'A 0.5-micron membrane where oxygen hops in and carbon dioxide hops out — 300 million times per lung.',
    plain:
      'Gas exchange is pure diffusion across the alveolar-capillary membrane: oxygen dissolves the surfactant lining, crosses the thin wall, and binds haemoglobin while CO₂ travels the other way down its own gradient. The whole design optimises area (300 million alveoli) and thinness (0.5 μm) — and every respiratory disease is this design failing in one specific way.',
    steps: [
      { title: 'Air arrives, alveolus expands', anchor: 'alv', text: 'Diaphragm drops → intrapleural pressure falls → alveolus inflates. Surfactant cuts surface tension so small alveoli don\'t collapse into big ones (LaPlace).' },
      { title: 'The membrane — 0.5 μm thin', anchor: 'membrane', text: 'Six layers from air to blood, but total thickness of a human hair\'s fraction. Diffusion capacity falls when the membrane thickens (fibrosis) or area dies (emphysema).' },
      { title: 'O₂ crosses and hitches a ride', anchor: 'o2', text: 'O₂ dissolves, crosses, and binds haemoglobin — the sigmoid curve keeps loading high in lungs and unloading low in tissues. 2,3-BPG, temperature and pH shift it.' },
      { title: 'CO₂ exits the other way', anchor: 'co2', text: 'CO₂ diffuses 20× faster than O₂, mostly carried as bicarbonate via the chloride shift. That\'s why CO₂ problems appear later than O₂ problems.' },
      { title: 'Perfusion must meet ventilation', anchor: 'perfusion', text: 'Alveoli at the top are well-ventilated but poorly perfused; the base the opposite. V/Q mismatch is THE mechanism behind most hypoxaemia.' },
    ],
    weak: [
      { title: 'Surfactant = Type II pneumocyte', detail: 'Made by Type II cells (dipalmitoyl phosphatidylcholine); Type I cells are the thin gas-exchange wall. NRDS in preterms = surfactant not yet made.', severity: 'frequent', anchor: 'surfactant' },
      { title: 'Shunt vs dead space', detail: 'V/Q = 0 (shunt, perfusion without air — pneumonia) vs ∞ (dead space, air without perfusion — PE). Both cause hypoxaemia but respond differently to O₂.', severity: 'deadly', anchor: 'perfusion' },
      { title: 'Why CO₂ crosses easily but O₂ therapy matters', detail: 'CO₂ solubility ×20 → diffusion rarely limits it; O₂ transfer is the limiting step in fibrosis. Exercise unmasks the deficit.', severity: 'tricky', anchor: 'o2' },
    ],
    traps: [
      { q: 'Atelectasis after surgery — mechanism?', a: 'Shallow breathing → alveolar collapse (low V/Q shunt) — prevent with incentive spirometry, not antibiotics.' },
      { q: 'Which slope of the O₂-Hb curve unloads in tissues?', a: 'The steep portion — small drops in PO₂ release large amounts of O₂; acidity and heat shift the curve right (more unloading).' },
      { q: 'Preterm baby, grunting, ground-glass CXR = ?', a: 'Neonatal respiratory distress syndrome — surfactant deficiency; give antenatal steroids + exogenous surfactant.' },
    ],
  },

  {
    id: 'u-neuron',
    title: 'Neuron & Synapse — The Firing Line',
    emoji: '🧠',
    subjectCode: 'PHYS',
    system: 'Nervous System',
    yield: 'must',
    sceneId: 'neuron',
    oneLiner: 'An electrical wave travels the wire, converts to chemistry at the cleft, and re-arms in milliseconds.',
    plain:
      'A neuron fires when the membrane potential crosses threshold — Na⁺ rushes in (depolarisation), K⁺ resets (repolarisation), and the Na/K pump re-arms the battery. At the synapse the electrical signal becomes chemical: calcium gates open, vesicles release neurotransmitter, and the next cell decides to fire or not. Every anaesthetic, antiepileptic and psychiatric drug acts somewhere on this one loop.',
    steps: [
      { title: 'Resting battery: −70 mV', anchor: 'soma', text: 'The Na⁺/K⁺ ATPase trades 3 Na⁺ out for 2 K⁺ in, holding the resting potential. This is the battery every signal spends.' },
      { title: 'Threshold → the spike', anchor: 'ap', text: 'At −55 mV, voltage-gated Na⁺ channels open in an all-or-nothing surge; K⁺ channels follow to repolarise. Refractory periods enforce one-way travel.' },
      { title: 'Myelin = fast lane', anchor: 'myelin', text: 'Myelin insulates the wire; the impulse jumps node to node (saltatory conduction) — up to 120 m/s. Demyelination (MS, GBS) slows or blocks it.' },
      { title: 'Arrival → calcium → release', anchor: 'synapse', text: 'The wave depolarises the terminal, voltage-gated Ca²⁺ channels open, and vesicles fuse — snare proteins do the docking. Botulinum, magnesium and aminoglycosides all sabotage this step.' },
      { title: 'Chemistry decides', anchor: 'nt', text: 'Neurotransmitter crosses the cleft, binds receptors — excitatory (glutamate, Na⁺ in) or inhibitory (GABA, Cl⁻ in). Reuptake and enzymes clear the stage: that\'s where SSRIs live.' },
    ],
    weak: [
      { title: 'Absolute vs relative refractory', detail: 'Absolute = Na⁺ channels locked shut (no stimulus works); relative = K⁺ still leaving, needs a stronger-than-normal stimulus. Exams test the difference constantly.', severity: 'frequent', anchor: 'ap' },
      { title: 'Excitatory ≠ always Na⁺', detail: 'Glutamate opens cation channels; GABA/glycine open Cl⁻. Saying "inhibitory = K⁺ out" confuses the two mechanisms — the classic GABA-A is Cl⁻ IN.', severity: 'tricky', anchor: 'nt' },
      { title: 'Saltatory conduction saves energy AND time', detail: 'Na⁺ enters only at nodes → less pump work, faster speed. Loss of myelin does both: slow conduction and conduction block.', severity: 'tricky', anchor: 'myelin' },
    ],
    traps: [
      { q: 'Which ion is mandatory for transmitter release?', a: 'Calcium — extracellular Ca²⁺ influx triggers vesicle fusion; low Ca²⁺ (or high Mg²⁺) blocks release.' },
      { q: 'Why does hyperkalaemia cause arrhythmias and weakness?', a: 'Resting potential drifts toward threshold → fibres fire spontaneously then become inexcitable; excitable tissues are exquisitely K⁺-sensitive.' },
      { q: 'Botulinum toxin in one line?', a: 'Cleaves SNARE proteins → acetylcholine never releases → flaccid paralysis (vs tetanus toxin\'s spastic paralysis).' },
    ],
  },

  {
    id: 'u-gastric',
    title: 'Gastric Pit — The Acid Factory',
    emoji: '🧪',
    subjectCode: 'PHYS',
    system: 'Gastrointestinal',
    yield: 'high',
    sceneId: 'gastric',
    oneLiner: 'Parietal cells pump protons at a million-fold gradient — and three layers of defence keep the stomach from digesting itself.',
    plain:
      'The gastric mucosa is a coordinated chemical plant: parietal cells secrete HCl via the H⁺/K⁺-ATPase, chief cells release pepsinogen, G cells orchestrate with gastrin, and a mucus-bicarbonate barrier keeps the acid from burning its own factory. PPIs block the pump, H. pylori attacks the barrier, and ulcers are the balance sheet of offence vs defence.',
    steps: [
      { title: 'G cells call the tune', anchor: 'gcell', text: 'Distension and peptides trigger gastrin → growth of the mucosa and direct parietal-cell stimulation. Zollinger–Ellison = gastrinoma runaway.' },
      { title: 'The proton pump fires', anchor: 'parietal', text: 'H⁺/K⁺-ATPase trades gastric H⁺ for blood K⁺ at a million-to-one gradient; Cl⁻ follows. PPIs covalently silence this pump — the last common path of acid secretion.' },
      { title: 'Chief cells add the enzyme', anchor: 'chief', text: 'Pepsinogen (inactive) is released and cleaved to pepsin only below pH ~5 — protein digestion starts safely. Cimetidine has an antidopamine side-effect profile chief cells know nothing about.' },
      { title: 'The barrier holds the line', anchor: 'mucus', text: 'Mucus + bicarbonate + tight epithelium + prostaglandin-driven blood flow. NSAIDs block prostaglandins and H. pylori ammonia dissolves mucus — both breach the wall.' },
    ],
    weak: [
      { title: 'PPI timing question', detail: 'PPIs act on ACTIVATED pumps — take 30–60 min BEFORE meals. H2 blockers at night (histamine tone is nocturnal). Timing questions are free marks if remembered.', severity: 'frequent', anchor: 'parietal' },
      { title: 'Which cell makes intrinsic factor?', detail: 'Parietal cells — NOT chief cells. Pernicious anaemia follows autoimmune parietal-cell loss even though acid and IF fall together.', severity: 'frequent', anchor: 'parietal' },
      { title: 'Gastrin vs histamine vs ACh hierarchy', detail: 'All three stimulate the parietal cell; histamine (H2) potentiates the other two — which is why H2 blockers blunt every stimulus, not just histamine.', severity: 'tricky', anchor: 'parietal' },
    ],
    traps: [
      { q: 'Why doesn\'t the stomach digest itself?', a: 'The mucus-bicarbonate barrier + prostaglandin cytoprotection + rapid epithelial turnover; NSAIDs/H. pylori break precisely these.' },
      { q: 'Stress ulcer vs NSAID ulcer location?', a: 'Stress (Cushing/Curling) tends to proximal/oesophagogastric; NSAID ulcers favour antrum/duodenum — mechanism of injury differs.' },
      { q: 'Drug class that causes hypergastrinaemia?', a: 'PPIs — chronic achlorhydria removes negative feedback → ECL hyperplasia; relevance in long-term users.' },
    ],
  },

  {
    id: 'u-acidbase',
    title: 'Acid–Base — Three Lines of Defence',
    emoji: '⚖️',
    subjectCode: 'PHYS',
    system: 'Renal & Respiratory',
    yield: 'must',
    oneLiner: 'Buffers act in seconds, lungs in minutes, kidneys in days — every ABG is one of the three failing.',
    plain:
      'The body defends pH 7.4 with three nested systems: bicarbonate buffers instantly, ventilation adjusts CO₂ within minutes, and renal compensation over days. Read every ABG by asking: which direction is the pH, which system is primary, is the compensation appropriate — Winter\'s formula and the anion gap then name the disorder for you.',
    steps: [
      { title: 'Step 1 — read the pH', text: 'pH < 7.35 = acidaemia; > 7.45 = alkalaemia. Never start with the compensations — the pH names the primary event.' },
      { title: 'Step 2 — who is to blame', text: 'pCO₂ moving WITH the pH abnormality = respiratory primary; HCO₃⁻ moving AGAINST it = metabolic primary.' },
      { title: 'Step 3 — is compensation right', text: 'Metabolic acidosis: expected pCO₂ = 1.5 × HCO₃⁻ + 8 ± 2 (Winters). Outside range = a second, mixed disorder.' },
      { title: 'Step 4 — the anion gap', text: 'Gap = Na − (Cl + HCO₃⁻), normal 8–12. High gap = MUDPILES added acid; normal gap = diarrhoea/RTA losing bicarbonate. Correct for albumin.' },
    ],
    weak: [
      { title: 'Compensation ≠ correction', detail: 'Compensation never overshoots to normalise pH — if pH is normal with abnormal gases, think mixed disorder, not perfect compensation.', severity: 'deadly' },
      { title: 'Correcting the gap for albumin', detail: 'Every 1 g/dL fall in albumin lowers the normal gap by 2.5 — septic patients with low albumin can hide a high-gap acidosis.', severity: 'tricky' },
      { title: 'Acute vs chronic respiratory compensation', detail: 'HCO₃⁻ rises 1 mmol/L per 10 mmHg pCO₂ acutely but 3.5 chronically — using the wrong factor mislabels renal compensation.', severity: 'tricky' },
    ],
    traps: [
      { q: 'Vomiting — which acid-base picture?', a: 'Metabolic ALKALOSIS with hypochloraemia (lose gastric HCl) — often with paradoxical aciduria from volume depletion.' },
      { q: 'DKA gas pattern?', a: 'High-anion-gap metabolic acidosis with appropriate respiratory compensation (Kussmaul) — check Winters before calling it mixed.' },
      { q: 'Salicylate poisoning — why both gaps?', a: 'High-gap acidosis PLUS primary respiratory alkalosis (direct medullary stimulation) — a classic mixed disorder.' },
    ],
  },

  {
    id: 'u-jaundice',
    title: 'Jaundice — Follow the Bilirubin',
    emoji: '🟡',
    subjectCode: 'PATHO',
    system: 'Hepatobiliary',
    yield: 'must',
    oneLiner: 'Pre-hepatic, hepatic or post-hepatic — bilirubin\'s journey map localises the disease for you.',
    plain:
      'Bilirubin is haemoglobin\'s breakdown product: unconjugated (indirect) arrives at the liver water-bound, is conjugated (direct) to become excretable, then travels in bile to the gut. Where that journey breaks decides the picture: haemolysis floods the system pre-hepatically, hepatocyte disease mixes both fractions, and obstruction spills conjugated bilirubin into blood with dark urine and pale stools.',
    steps: [
      { title: 'The journey', text: 'RBC breakdown → unconjugated bilirubin (albumin-bound) → hepatocyte UGT conjugation → bile → gut → urobilinogen/stercobilin.' },
      { title: 'Pre-hepatic (haemolysis)', text: 'Massive unconjugated rise, NO bilirubin in urine ("acholuric"), high urobilinogen. Think sickle cell, G6PD, malaria.' },
      { title: 'Hepatocellular', text: 'Damaged hepatocytes fail at conjugation AND excretion — mixed fractions, dark urine, AST/ALT leading. Viral hepatitis, cirrhosis, drugs.' },
      { title: 'Post-hepatic (obstructive)', text: 'Conjugated bilirubin regurgitates: dark urine, PALE stools, itching, ALP/GGT leading. Stones, strictures, head-of-pancreas cancer.' },
    ],
    weak: [
      { title: 'Urine colour logic', detail: 'Conjugated bilirubin is water-soluble → dark urine only in hepatic/obstructive jaundice. Haemolysis leaves urine normal — "acholuric jaundice".', severity: 'frequent' },
      { title: 'Crigler–Najjar vs Gilbert', detail: 'Both unconjugated: Gilbert = mild UGT reduction, harmless, stress/fasting-triggered; Crigler–Najjar type 1 = absent UGT, kernicterus risk. Dubin–Johnson/Rotor = conjugated.', severity: 'tricky' },
      { title: 'Neonatal jaundice danger line', detail: 'Unconjugated bilirubin crosses the immature BBB → kernicterus. Phototherapy converts it to excretable isomers; exchange transfusion is the escape hatch.', severity: 'deadly' },
    ],
    traps: [
      { q: 'Pale stool + dark urine + itching = ?', a: 'Obstructive (post-hepatic) jaundice — conjugated hyperbilirubinaemia; image the biliary tree (ultrasound first).' },
      { q: 'Which jaundice has normal-coloured urine?', a: 'Haemolytic — unconjugated bilirubin is albumin-bound and never reaches the urine.' },
      { q: 'Enzyme that conjugates bilirubin?', a: 'UGT1A1 (glucuronosyltransferase) — the target enzyme in Gilbert/Crigler–Najjar spectrum.' },
    ],
  },
]
