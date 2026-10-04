// ─── UNDERSTAND · catalog B — pre/para-clinical expansion ───
// Non-scene syllabus topics for the pre-clinical and para-clinical subjects.
// Subject codes mirror the Subject table exactly. Content: NMC CBME 2024 /
// NEET-PG blueprint aligned, cross-checked against Gray's, Guyton, Harper,
// Robbins, KD Tripathi, Ananthanarayan and Park (restated simply).

import type { UnderstandTopic } from './understand-types'

export const CATALOG_B: UnderstandTopic[] = [
  {
    id: 'u-brachial-plexus',
    title: 'Brachial Plexus Injuries',
    emoji: '💪',
    subjectCode: 'ANAT',
    system: 'Upper Limb',
    yield: 'must',
    oneLiner: 'C5–T1 rebuilt as Randy Travis Drinks Cold Beer — where the pull happens decides the deformity you see.',
    plain:
      'The brachial plexus runs from C5–T1 through roots, trunks, divisions, cords and branches, and traction injuries hit it at predictable spots. A downward pull on the shoulder stretches the upper trunk (Erb), an upward pull on the arm stretches the lower trunk (Klumpke) — and each produces its own signature deformity.',
    steps: [
      { title: 'Trace the map', text: 'Roots C5–T1 → trunks (upper C5–6, middle C7, lower C8–T1) → divisions → cords → terminal branches. "Randy Travis Drinks Cold Beer" — and every exam question sits somewhere on this line.' },
      { title: 'Erb — upper trunk, waiter\'s tip', text: 'Traction separating shoulder and neck (shoulder dystocia, fall on the shoulder) injures C5–C6: shoulder adducted and internally rotated, elbow extended, forearm pronated, wrist flexed — the classic "waiter\'s tip" posture.' },
      { title: 'Klumpke — lower trunk, claw hand', text: 'Upward pull of the arm (breech delivery, grabbing a branch while falling) injures C8–T1: all intrinsic hand muscles denervated → total claw hand, often with Horner syndrome when T1 sympathetic fibres are torn.' },
      { title: 'The neighbours examiners borrow', text: 'Long thoracic nerve (C5–7) to serratus anterior — axillary node clearance can cut it → winged scapula. Thoracodorsal (posterior cord, C6–8) to latissimus dorsi and suprascapular from the upper trunk complete the favourite "which nerve?" list.' },
    ],
    weak: [
      { title: 'Erb vs Klumpke confusion', detail: 'Upper trunk = DOWNWARD shoulder traction = waiter\'s tip (Erb); lower trunk = UPWARD arm traction = claw hand (Klumpke). Flipping the traction direction flips the answer.', severity: 'frequent' },
      { title: 'Horner with Klumpke is a red flag', detail: 'T1 carries preganglionic sympathetic fibres to the head — Klumpke plus ptosis/miosis/anhidrosis in a smoker means a Pancoast tumour until proven otherwise.', severity: 'deadly' },
      { title: 'The ulnar paradox', detail: 'A proximal ulnar lesion (elbow) claws LESS than a distal one (wrist), because lost FDP function removes the flexion force on the IP joints. Counter-intuitive and heavily tested.', severity: 'tricky' },
      { title: 'Winged scapula ≠ always serratus', detail: 'Serratus palsy (long thoracic nerve, post-mastectomy) wings the scapula on pushing against a wall; trapezius palsy (accessory nerve, post-neck surgery) wings it with the shoulder shrug. Two wingings, two operations.', severity: 'tricky' },
    ],
    traps: [
      { q: 'Waiter\'s-tip deformity — roots and trunk?', a: 'C5–C6, upper trunk (Erb\'s palsy) — from downward traction of the shoulder, classically shoulder dystocia.' },
      { q: 'Claw hand + Horner syndrome in a chronic smoker?', a: 'Klumpke palsy from an apical (Pancoast) lung tumour invading C8–T1 and the stellate ganglion.' },
      { q: 'Winged scapula after axillary dissection — which nerve?', a: 'Long thoracic nerve (C5, 6, 7) — serratus anterior paralysis.' },
    ],
  },

  {
    id: 'u-inguinal-hernia',
    title: 'Inguinal Canal & Hernia Sites',
    emoji: '🕳️',
    subjectCode: 'ANAT',
    system: 'Abdomen & Groin',
    yield: 'high',
    oneLiner: 'One pair of vessels — the inferior epigastrics — is the referee that names every groin lump.',
    plain:
      'The inguinal canal is a passage through the lower abdominal wall with four definable walls, and hernias leave it through one of three named gaps. Indirect hernias enter at the deep ring lateral to the inferior epigastric vessels, direct ones push through Hesselbach\'s triangle medial to them, and femoral ones slip under the inguinal ligament.',
    steps: [
      { title: 'Walls in four strokes', text: 'Anterior: external oblique aponeurosis (+ internal oblique laterally); floor: inguinal ligament; roof: arching fibres of internal oblique and transversus; posterior: transversalis fascia + conjoint tendon medially. MALT works as a memory aid — Muscles (roof), Aponeurosis (anterior), Ligament (floor), Transversalis (posterior).' },
      { title: 'Two rings, two landmarks', text: 'Deep ring: 1.25 cm above the midpoint of the inguinal ligament, lateral to the inferior epigastric vessels, in transversalis fascia. Superficial ring: a triangle in the external oblique aponeurosis just above the pubic crest.' },
      { title: 'Indirect vs direct', text: 'Indirect: through the deep ring, LATERAL to the inferior epigastrics, congenital (patent processus vaginalis), may descend into the scrotum, commonest at all ages. Direct: pushes through Hesselbach\'s triangle — rectus medially, inferior epigastrics laterally, inguinal ligament below — acquired, rarely reaches the scrotum.' },
      { title: 'Femoral — small, female, strangulating', text: 'Passes below and LATERAL to the pubic tubercle through the femoral canal; its sharp medial border (lacunar ligament) makes it the hernia most likely to strangulate — the classic emergency in middle-aged women.' },
    ],
    weak: [
      { title: 'The inferior epigastric referee', detail: 'Lateral to the vessels = indirect (via deep ring); medial = direct (through Hesselbach\'s triangle). Every MCQ stem hides this one relationship — locate it before answering.', severity: 'deadly' },
      { title: 'Ring geography mix-ups', detail: 'Deep ring sits 1.25 cm above the ligament\'s midpoint; the superficial ring is above the pubic crest. Claiming "both rings are above the pubic tubercle" throws away the whole question.', severity: 'frequent' },
      { title: 'Femoral vs inguinal at the tubercle', detail: 'Femoral neck = below and lateral to the pubic tubercle; inguinal = above and medial. In a strangulated female groin lump, exam logic picks femoral over indirect inguinal.', severity: 'tricky' },
      { title: 'What is NOT in the cord', detail: 'The ilioinguinal nerve passes through the canal but enters by piercing internal oblique — it is NOT a content of the spermatic cord; the genital branch of genitofemoral is. A standing MCQ.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Single discriminator between direct and indirect inguinal hernia?', a: 'Relation to the inferior epigastric vessels — indirect passes lateral (via the deep ring), direct medial (through Hesselbach\'s triangle).' },
      { q: 'Most common hernia overall, and the one most likely to strangulate?', a: 'Most common = indirect inguinal; most strangulation-prone = femoral (the rigid lacunar ligament forms its medial neck).' },
      { q: 'Boundaries of Hesselbach\'s triangle?', a: 'Medial — lateral edge of rectus abdominis; lateral — inferior epigastric vessels; base — inguinal ligament.' },
    ],
  },

  {
    id: 'u-coronary-anatomy',
    title: 'Coronary Artery Anatomy',
    emoji: '🫀',
    subjectCode: 'ANAT',
    system: 'Thorax — Heart',
    yield: 'must',
    oneLiner: 'Three arteries, three ECG territories — localise the occlusion before the interventionist does.',
    plain:
      'The right coronary artery and the left (which divides into LAD and circumflex) map cleanly onto inferior, anterior and lateral myocardial territories. Add dominance — defined by which artery gives the posterior descending branch — plus the nodal branches, and you can predict both the infarct pattern and the arrhythmia from the vessel alone.',
    steps: [
      { title: 'The big three', text: 'LAD runs in the anterior interventricular groove supplying the anterior wall and anterior two-thirds of the septum; LCx circles the AV groove for the lateral wall; RCA feeds the right ventricle and, in ~80% of hearts, the posterior septum via the posterior descending artery.' },
      { title: 'ECG territories', text: 'V1–V4 = LAD (anterior/septal); II, III, aVF = RCA (inferior); I, aVL, V5–V6 = LCx (lateral). Posterior infarcts (tall R + ST depression in V1–V3) usually belong to the LCx/posterior-LV territory.' },
      { title: 'Dominance = who owns the PDA', text: 'Right-dominant ~80%: PDA from the RCA; left-dominant ~10%: from the LCx; co-dominant ~10%: both. Dominance describes the posterior septum\'s supply, not the size of the vessel.' },
      { title: 'Nodal arteries & the diastole rule', text: 'SA nodal artery arises from the RCA in ~60%, the AV nodal artery from the RCA in ~80–90% — which is why inferior STEMI loves bradyarrhythmias and AV block. And because systolic contraction squeezes the intramyocardial vessels shut, coronaries fill mainly in DIASTOLE.' },
    ],
    weak: [
      { title: 'Widow-maker, precisely', detail: 'PROXIMAL LAD occlusion — before the first septal and diagonal branches — takes the whole anterior wall and septum. A distal LAD clot is a far smaller event; the stem usually tells you the level.', severity: 'tricky' },
      { title: 'ECG-to-artery mapping errors', detail: 'Swapping inferior (RCA) for lateral (LCx) territories loses the artery question every time. Drill "II/III/aVF → RCA" until it is reflexive.', severity: 'deadly' },
      { title: 'Dominance ≠ size', detail: 'A "dominant" artery is simply the one giving the PDA; a modest-looking RCA can still be dominant. Never define dominance by calibre.', severity: 'tricky' },
      { title: 'Nodal supply percentages', detail: 'SA node: RCA ~60% (LCx ~40%); AV node: RCA ~90% in right-dominant hearts. These two numbers decide the arrhythmia questions attached to inferior MI.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Anterior STEMI (V1–V4) with cardiogenic shock — which artery?', a: 'LAD — proximal occlusion ("widow-maker") infarcting the anterior wall and anterior two-thirds of the septum.' },
      { q: 'Inferior STEMI developing complete heart block — culprit vessel?', a: 'RCA — its AV nodal branch supplies the AV node in ~90% (right-dominant) hearts.' },
      { q: 'Coronary flow is maximal during…?', a: 'Diastole — systolic contraction compresses intramyocardial vessels; hence tachycardia shortens perfusion time and worsens ischaemia.' },
    ],
  },

  {
    id: 'u-thyroid-axis',
    title: 'Thyroid Hormone Axis',
    emoji: '🦋',
    subjectCode: 'PHYS',
    system: 'Endocrine',
    yield: 'must',
    oneLiner: 'TRH asks, TSH orders, the follicular cell delivers T4 — and the periphery does the final chemistry.',
    plain:
      'The hypothalamo–pituitary–thyroid axis is a clean negative-feedback loop: TRH → TSH → T3/T4, with T3/T4 braking both upstream glands. Iodide is trapped, oxidised and coupled by thyroid peroxidase into T4 (the prohormone) and a little T3; peripheral 5′-deiodinase then makes the truly active hormone.',
    steps: [
      { title: 'The loop', text: 'TRH from the hypothalamus drives TSH from pituitary thyrotrophs; TSH acts on follicular cells, and free T3/T4 feed back on both pituitary and hypothalamus. TSH is the single best screening test for thyroid dysfunction.' },
      { title: 'Inside the follicular cell', text: 'NIS traps iodide → TPO oxidises, organifies (MIT/DIT on thyroglobulin) and couples them: DIT+DIT = T4, MIT+DIT = T3. Hormone is stored as colloid and released on demand.' },
      { title: 'T4 is a prohormone', text: 'The gland secretes mostly T4 (t½ ~7 days); the periphery converts it to T3 (3–4× more potent, t½ ~1 day) or to inactive reverse-T3. The long T4 half-life is why a levothyroxine dose change waits 6–8 weeks before rechecking.' },
      { title: 'Drugs ride the same enzymes', text: 'PTU blocks TPO AND peripheral 5′-deiodinase; methimazole blocks TPO only (preferred after the first trimester of pregnancy). In thyroid storm give PTU FIRST, then iodide ~1 hour later — iodide alone would simply top up substrate for new hormone synthesis.' },
    ],
    weak: [
      { title: 'Primary vs central — let TSH decide', detail: 'High TSH = primary (thyroid failure); low or inappropriately normal TSH with low T4 = central (pituitary/hypothalamic). Calling a central case "primary" is the classic dead mark.', severity: 'deadly' },
      { title: 'Total vs free hormone', detail: 'Pregnancy and OCPs raise TBG → total T4 climbs but FREE T4 stays normal — that is euthyroid, not hyperthyroid. Nephrotic syndrome and androgens lower TBG and do the opposite.', severity: 'frequent' },
      { title: 'Wolff–Chaikoff vs Jod-Basedow', detail: 'Excess iodide transiently SWITCHES OFF organification (Wolff–Chaikoff, protective); autonomous thyroid tissue escapes the block and overproduces — iodine-induced hyperthyroidism (Jod-Basedow), classically after contrast or amiodarone.', severity: 'tricky' },
      { title: 'Which is more active?', detail: 'T3, not T4 — T4 is a circulating prohormone and rT3 is inactive. "Biologically active thyroid hormone" = T3.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Pregnant woman with elevated total T4 — hyperthyroid?', a: 'No — oestrogen raises TBG; total hormone rises while free T4 stays normal (euthyroid hyperthyroxinaemia).' },
      { q: 'Best single screening test for thyroid dysfunction?', a: 'TSH — it changes log-fold and sits upstream of both primary and central disease.' },
      { q: 'Thyroid storm — iodide or PTU first, and why?', a: 'PTU first (blocks new synthesis), iodide ~1 h later to block release — iodide alone fuels further hormone synthesis (Jod-Basedow logic).' },
    ],
  },

  {
    id: 'u-cardiac-cycle',
    title: 'Cardiac Cycle & Pressure–Volume Loop',
    emoji: '📊',
    subjectCode: 'PHYS',
    system: 'Cardiovascular',
    yield: 'high',
    oneLiner: 'Four corners, four valves, two sounds — the Wiggers diagram is one story told in three graphs.',
    plain:
      'Systole (~0.3 s) and diastole (~0.5 s) break into named phases, each opened or closed by a valve event that also makes a sound. The pressure–volume loop is the same cycle drawn clockwise, and every disease you know simply stretches one corner of it.',
    steps: [
      { title: 'Fill, then fire', text: 'Rapid filling → diastasis (the longest phase at rest) → atrial systole tops up ~20–30% of the volume (the "atrial kick"). A stiff ventricle announces the kick as an S4.' },
      { title: 'Systole begins with a snap', text: 'Ventricular pressure exceeds atrial → AV valves close = S1 = isovolumetric contraction (volume fixed, pressure climbing). When LV pressure passes aortic pressure, the aortic valve opens and ejection begins.' },
      { title: 'Ejection ends with the notch', text: 'As the LV relaxes, aortic pressure briefly exceeds ventricular → semilunar valves slam = S2, leaving the dicrotic notch (aortic recoil). Then isovolumetric relaxation, until the mitral opens and filling restarts.' },
      { title: 'Read the loop corners', text: 'A: mitral opens (filling starts); B: mitral closes (end-diastole, ~120 mL); C: aortic opens; D: aortic closes (end-systole, ~50 mL). Width B–D = stroke volume (~70 mL); SV/EDV = EF (~55–65%). Preload widens the loop, afterload pushes corner D right, contractility drags D left.' },
    ],
    weak: [
      { title: 'Corner mislabelling', detail: 'B and D are the two "closed-valve" corners (the isovolumetric phases): B = mitral closure at end-diastole, D = aortic closure at end-systole. Confusing B and D reverses the entire interpretation.', severity: 'deadly' },
      { title: 'Heart sounds are valve events', detail: 'S1 = AV valves (start of systole); S2 = semilunar (end of systole); S3 = rapid filling; S4 = atrial kick against a stiff ventricle. Never attach S1 to the muscle itself.', severity: 'frequent' },
      { title: 'Preload vs afterload arrows', detail: 'Volume load → wider loop with higher EDV; pressure load (aortic stenosis, hypertension) → taller loop with higher ESV. Shift-direction questions become free marks once you have drawn it once.', severity: 'tricky' },
      { title: 'Which phase is longest?', detail: 'Diastasis at resting heart rate — but at high rates diastole shrinks first, the mechanism behind angina during tachycardia.', severity: 'frequent' },
    ],
    traps: [
      { q: 'S3 gallop corresponds to which phase?', a: 'Early rapid ventricular filling — physiological in children/athletes; after ~40 years it signals ventricular volume overload (dilated cardiomyopathy, mitral regurgitation).' },
      { q: 'The dicrotic notch on an aortic pressure trace represents…?', a: 'Closure of the aortic valve with elastic recoil of the aorta — the same instant as S2.' },
      { q: 'Why does anaemia with tachycardia stress the coronaries?', a: 'Perfusion occurs in diastole; tachycardia eats diastolic time while anaemia lowers oxygen content — supply falls exactly as demand rises.' },
    ],
  },

  {
    id: 'u-glycolysis-gluconeogenesis',
    title: 'Glycolysis vs Gluconeogenesis — the Switch',
    emoji: '🍬',
    subjectCode: 'BIOCH',
    system: 'Carbohydrate Metabolism',
    yield: 'must',
    oneLiner: 'One molecule — fructose-2,6-bisphosphate — decides whether the liver burns glucose or makes it.',
    plain:
      'Glycolysis and gluconeogenesis share the reversible steps but fight at four irreversible enzymes, and the hormone of the moment wins by flipping fructose-2,6-bisphosphate. Insulin loads the glycolysis side, glucagon loads the gluconeogenesis side — learn the switch and half of metabolic regulation falls into place.',
    steps: [
      { title: 'The contested checkpoints', text: 'Rate-limiting step of glycolysis = PFK-1 (activated by AMP and F2,6BP; inhibited by ATP and citrate); pyruvate kinase gets feed-forward activation from F1,6BP and is switched OFF by glucagon-mediated phosphorylation.' },
      { title: 'The F2,6BP seesaw', text: 'The bifunctional PFK-2/FBPase-2 enzyme makes and destroys F2,6BP. Insulin dephosphorylates it → PFK-2 active → F2,6BP rises → glycolysis. Glucagon (cAMP/PKA) phosphorylates it → FBPase-2 active → F2,6BP falls → gluconeogenesis.' },
      { title: 'The four bypass enzymes', text: 'Pyruvate carboxylase (biotin-dependent, mitochondrial, switched on by acetyl-CoA) → PEP carboxykinase → fructose-1,6-bisphosphatase (inhibited by F2,6BP and AMP) → glucose-6-phosphatase. These are the only steps gluconeogenesis adds.' },
      { title: 'Where glucose can be exported', text: 'G6Pase lives only in liver, kidney and intestine — muscle can never release glucose from its own glycogen (McArdle disease proves it). Alcohol raises NADH and blocks both entry points (pyruvate→lactate, OAA→malate) → fasting hypoglycaemia.' },
    ],
    weak: [
      { title: 'F2,6BP direction errors', detail: 'F2,6BP simultaneously ACTIVATES PFK-1 and INHIBITS fructose-1,6-bisphosphatase — it is pure "glycolysis ON". Getting the insulin/glucagon side backwards flips fed and fasting states.', severity: 'deadly' },
      { title: 'Glucokinase vs hexokinase', detail: 'Hexokinase: everywhere, low Km, inhibited by G6P. Glucokinase: liver + pancreatic β-cells, high Km (works only after a meal), immune to G6P inhibition, induced by insulin.', severity: 'frequent' },
      { title: 'Muscle "helping" glucose', detail: 'Muscle lacks G6Pase — its glycogenolysis only fuels contraction. Any option claiming muscle raises blood glucose is automatically wrong.', severity: 'deadly' },
      { title: 'Substrate shuttles', detail: 'Pyruvate carboxylase works in the mitochondrion, but oxaloacetate cannot cross the inner membrane — it leaves as malate (or aspartate) and is re-oxidised for PEPCK in the cytosol.', severity: 'tricky' },
    ],
    traps: [
      { q: 'Rate-limiting enzyme of glycolysis?', a: 'PFK-1 (phosphofructokinase-1) — allosterically activated by AMP and fructose-2,6-bisphosphate, inhibited by ATP and citrate.' },
      { q: 'Fructose-2,6-bisphosphate does what?', a: 'Activates PFK-1 AND inhibits fructose-1,6-bisphosphatase — the master switch pushing metabolism toward glycolysis under insulin.' },
      { q: 'Fasting hypoglycaemia in chronic alcoholism — mechanism?', a: 'High NADH/NAD⁺ diverts pyruvate to lactate and oxaloacetate to malate, starving gluconeogenesis of both substrates.' },
    ],
  },

  {
    id: 'u-urea-cycle',
    title: 'Urea Cycle & Hyperammonaemia',
    emoji: '♻️',
    subjectCode: 'BIOCH',
    system: 'Nitrogen Metabolism',
    yield: 'high',
    oneLiner: 'Two nitrogens, five enzymes, two compartments — and every block ends with ammonia on the brain.',
    plain:
      'The urea cycle converts toxic ammonia into urea across the mitochondrion and cytosol: carbamoyl phosphate synthetase-I and ornithine transcarbamylase inside, the argininosuccinate enzymes and arginase outside. Block any step and ammonia accumulates — a newborn or child sliding from vomiting and lethargy into flapping tremor and coma.',
    steps: [
      { title: 'Order and address', text: 'CPS-I → OTC (both mitochondrial); ASS → ASL → arginase (all cytosolic); ornithine shuttles back into the mitochondrion. Mnemonic: Ordinary Careless Crappers Are Also Frivolous About Urination.' },
      { title: 'The gatekeeper', text: 'CPS-I is rate-limiting and needs the allosteric activator N-acetylglutamate (made by NAGS from glutamate + acetyl-CoA). Urea\'s two nitrogens come from free ammonia (via carbamoyl phosphate) and from aspartate.' },
      { title: 'The prototype: OTC deficiency', text: 'X-linked, the most common urea cycle defect: mitochondrial carbamoyl phosphate leaks into the cytosol → the pyrimidine pathway runs wild → raised orotic acid WITHOUT megaloblastic anaemia, low BUN, and hyperammonaemic respiratory alkalosis.' },
      { title: 'Treatment logic', text: 'Stop the nitrogen coming in: protein restriction, calories first. Trap the nitrogen going out: lactulose (acidifies the gut lumen, NH₃ → NH₄⁺), rifaximin, and scavengers — sodium benzoate (with glycine) and phenylbutyrate/phenylacetate (with glutamine); arginine/citrulline replace cycle intermediates.' },
    ],
    weak: [
      { title: 'OTC vs hereditary orotic aciduria', detail: 'Both spill orotic acid; OTC deficiency (X-linked) has NO megaloblastic anaemia, while UMP-synthase deficiency has megaloblastic anaemia refractory to B12/folate. That one line separates the two favourites.', severity: 'deadly' },
      { title: 'NAG is the ignition key', detail: 'No N-acetylglutamate → CPS-I stays cold → hyperammonaemia despite intact enzymes (NAGS deficiency mimics CPS-I deficiency); carbamylglutamate treats it.', severity: 'tricky' },
      { title: 'Compartments in the wrong half', detail: 'Only the first two enzymes are mitochondrial; ASS, ASL and arginase are cytosolic. Any question naming the compartment expects you to know this split.', severity: 'frequent' },
      { title: 'How ammonia travels', detail: 'Glutamine (most tissues) and alanine (muscle, the glucose–alanine/Cahill cycle) are the two nitrogen couriers delivering ammonia to the liver.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Most common urea cycle disorder and its inheritance?', a: 'Ornithine transcarbamylase deficiency — X-linked recessive; raised orotic acid WITHOUT megaloblastic anaemia.' },
      { q: 'Raised orotic acid + megaloblastic anaemia not responding to B12/folate?', a: 'Hereditary orotic aciduria (UMP synthase deficiency) — NOT OTC deficiency.' },
      { q: 'Rate-limiting enzyme of the urea cycle and its activator?', a: 'Carbamoyl phosphate synthetase-I, allosterically activated by N-acetylglutamate.' },
    ],
  },

  {
    id: 'u-gn-patterns',
    title: 'Glomerulonephritis Patterns',
    emoji: '🧫',
    subjectCode: 'PATHO',
    system: 'Renal',
    yield: 'must',
    oneLiner: 'Nephritic or nephrotic, subepithelial or subendothelial — every GN is a deposit plus a time signature.',
    plain:
      'Glomerular disease reads on two axes: clinical (nephritic haematuria vs nephrotic proteinuria) and histological (where the immune deposits sit and what complement is doing). The post-infectious, IgA and nephrotic patterns carry nearly all the marks — each has a timing clue and a location clue.',
    steps: [
      { title: 'The clinical axis', text: 'Nephritic: haematuria with dysmorphic RBCs and RBC casts, hypertension, oliguria, <3.5 g/day protein. Nephrotic: >3.5 g/day proteinuria, hypoalbuminaemia, oedema, hyperlipidaemia — plus a hypercoagulable state (antithrombin III lost in urine → renal vein thrombosis).' },
      { title: 'PSGN — the humps', text: '1–3 weeks after pharyngitis (3–6 weeks after impetigo): "lumpy-bumpy" subepithelial IgG–C3 humps, low C3 that normalises within 6–8 weeks, rising ASO/anti-DNase B. Children usually recover; adults may not.' },
      { title: 'IgA nephropathy — the impostor', text: 'The most common GN worldwide: haematuria 1–2 days after a URI (synpharyngitic) with NORMAL complement and mesangial IgA deposits. Compare: PSGN needs weeks and shows low C3.' },
      { title: 'The nephrotic three (plus MPGN)', text: 'Minimal change: children, foot-process effacement on EM, exquisitely steroid-responsive. Membranous: adults, subepithelial "spike-and-dome", anti-PLA2R, linked to HBV/solid tumours/NSAIDs. FSGS: Black patients, HIV (collapsing variant), heroin — least steroid-responsive. MPGN straddles both spectra: tram-track GBM with persistently low C3.' },
    ],
    weak: [
      { title: 'Timing separates the two haematurias', detail: 'Days after the sore throat = IgA nephropathy; weeks after = PSGN. IgA keeps complement normal; PSGN drops C3 and normalises it over 6–8 weeks.', severity: 'deadly' },
      { title: 'Deposit location = diagnosis', detail: 'Subepithelial → PSGN humps / membranous spikes; subendothelial with mesangial interposition → MPGN tram-track; mesangial → IgA; EM showing ONLY foot-process effacement → minimal change disease.', severity: 'tricky' },
      { title: 'Steroid-response hierarchy', detail: 'MCD answers beautifully; FSGS is the least responsive of the childhood causes; membranous depends on PLA2R status. "Which nephrotic child avoids biopsy?" — the steroid-responsive MCD one.', severity: 'frequent' },
      { title: 'Alport\'s triad gets forgotten', detail: 'X-linked type IV collagen (COL4A5): hereditary nephritis + sensorineural deafness + anterior lenticonus; "basket-weave" GBM on EM and a family history of haematuria.', severity: 'tricky' },
    ],
    traps: [
      { q: 'Child with nephrotic syndrome — first therapeutic step?', a: 'Empirical oral prednisolone (minimal change disease presumed) — biopsy reserved for steroid resistance, atypical features or older age.' },
      { q: 'Haematuria two weeks after pharyngitis with low C3?', a: 'Post-streptococcal GN — subepithelial humps, rising ASO/anti-DNase B, C3 normalising by 6–8 weeks.' },
      { q: 'Tram-track (double-contour) GBM — pattern and complement?', a: 'Membranoproliferative GN — subendothelial deposits with mesangial interposition; C3 persistently low.' },
    ],
  },

  {
    id: 'u-leukemia-lymphoma',
    title: 'Leukaemia vs Lymphoma — WHO Flavour',
    emoji: '🩸',
    subjectCode: 'PATHO',
    system: 'Haematology',
    yield: 'must',
    oneLiner: 'Same neoplastic clones, two costumes — liquid in the marrow, solid in the node; the translocations do the naming.',
    plain:
      'Leukaemia and lymphoma are presentations, not different diseases: the same B- or T-cell clone may flow in blood or ball up as a mass. Exams therefore test two tables — the age/shape/cell-surface table and the translocation table — and Auer rods plus a handful of cytogenetics carry most questions.',
    steps: [
      { title: 'The acute leukaemias', text: 'AML (adults): Auer rods, gum hypertrophy in M4/M5; M3 = t(15;17) PML-RARA → ATRA ± arsenic, watch for DIC. ALL (children, the commonest childhood malignancy): TdT+, CD10+, with CNS and testes as sanctuary relapse sites.' },
      { title: 'The chronic leukaemias', text: 'CML (40–60 yr): massive leucocytosis with basophilia, LOW leukocyte-alkaline-phosphatase score, t(9;22) BCR-ABL → imatinib. CLL (elderly): smudge cells, CD5+CD23+ B cells, warm autoimmune haemolytic anaemia, hypogammaglobulinaemia, Richter transformation to DLBCL.' },
      { title: 'Hodgkin lymphoma', text: 'Reed–Sternberg cells ("owl eyes", CD15+/CD30+, usually CD20−), contiguous nodal spread, bimodal age distribution, B symptoms. Nodular sclerosis is the commonest subtype — young women, mediastinum, lacunar cells.' },
      { title: 'The NHL translocation table', text: 'Burkitt: t(8;14) c-MYC, starry-sky macrophages, jaw in the endemic (EBV) form vs abdomen in the sporadic form. Follicular: t(14;18) BCL-2, indolent. Mantle: t(11;14) cyclin D1, CD5+ but CD23−. DLBCL: commonest NHL overall — aggressive but curable.' },
    ],
    weak: [
      { title: 'Auer rod → M3 → ATRA chain', detail: 'Acute promyelocytic leukaemia presents with DIC; treatment is all-trans-retinoic acid ± arsenic. A plain "AML chemotherapy" answer loses the stem.', severity: 'deadly' },
      { title: 't(9;22) is not CML-exclusive', detail: 'It defines CML but also marks a WORSE-prognosis ALL subset. Read whether the stem says adult-chronic or paediatric-acute before committing.', severity: 'tricky' },
      { title: 'CD5 is the gatekeeper', detail: 'CD5+ B-cell neoplasm: CLL if CD23+ (smudge cells), mantle lymphoma if CD23− with cyclin D1. One marker decides the lineage.', severity: 'tricky' },
      { title: 'Liquid vs solid is presentation', detail: 'The same clone can present as marrow failure (leukaemic phase) or as a nodal mass; Burkitt exists as BOTH a lymphoma and an L3 leukaemia. Don\'t treat the words as separate families.', severity: 'frequent' },
    ],
    traps: [
      { q: 't(15;17) — diagnosis and drug?', a: 'Acute promyelocytic leukaemia (AML-M3), PML-RARA — treated with all-trans retinoic acid ± arsenic trioxide.' },
      { q: 'Starry-sky histology — lymphoma and translocation?', a: 'Burkitt lymphoma — t(8;14) activating c-MYC; EBV in the endemic jaw form.' },
      { q: 'Smudge cells on the peripheral smear?', a: 'Chronic lymphocytic leukaemia — fragile mature B lymphocytes that rupture during the spread.' },
    ],
  },

  {
    id: 'u-cell-injury',
    title: 'Cell Injury & Necrosis Types',
    emoji: '💥',
    subjectCode: 'PATHO',
    system: 'Cell Injury',
    yield: 'high',
    oneLiner: 'One threshold — mitochondrial and membrane damage — separates swelling that recovers from death that scars.',
    plain:
      'Injury stays reversible (cellular swelling, fatty change) until mitochondria and membranes fail; then necrosis takes one of five patterned forms that name the underlying disease. Apoptosis is the tidy, caspase-driven sibling — energy-dependent, silent and inflammation-free.',
    steps: [
      { title: 'The point of no return', text: 'ATP depletion, membrane damage and mitochondrial permeability transition mark irreversible injury; amorphous mitochondrial calcium densities appear on EM. Before that line everything is swelling and blebs — after it, enzymes and calcium finish the cell.' },
      { title: 'The five necrosis patterns', text: 'Coagulative: ischaemic infarcts of solid organs (heart, kidney, spleen) — ghost outlines persist. Liquefactive: brain and abscesses. Caseous: TB granulomas. Fat: pancreatitis (saponification) and traumatic breast necrosis. Fibrinoid: vessel walls — malignant hypertension, vasculitis.' },
      { title: 'Apoptosis does it cleanly', text: 'Caspase-driven and ATP-dependent: intrinsic (mitochondrial Bcl-2/BAX balance, cytochrome c → caspase 9) or extrinsic (Fas/TNF death receptors → caspase 8). No inflammation — Councilman bodies in viral hepatitis, steroid-shrunk lymphocytes.' },
      { title: 'Calcification follows the serum', text: 'Dystrophic: calcium in DAMAGED tissue with NORMAL serum calcium (old valves, atheroma, psammoma bodies). Metastatic: calcium in NORMAL tissue driven by HYPERCALCAEMIA (hyperparathyroidism, bone destruction) — nephrocalcinosis is the classic site.' },
    ],
    weak: [
      { title: 'The brain exception', detail: 'Solid-organ infarcts are coagulative EXCEPT the brain — lipid-rich, stroma-poor tissue digests itself → liquefactive necrosis and eventual cyst. "Cerebral infarct = coagulative" is an automatic lost mark.', severity: 'deadly' },
      { title: 'Dystrophic vs metastatic logic', detail: 'Decide by serum calcium, not by site: normal Ca in dead tissue = dystrophic; high Ca in living tissue = metastatic. Reversing the pair fails both fill-in questions.', severity: 'frequent' },
      { title: 'Fat necrosis is chemistry, not just shape', detail: 'Pancreatic lipase frees fatty acids that bind Ca²⁺ → calcium soaps (chalky-white areas) and measurable HYPOcalcaemia in acute pancreatitis.', severity: 'tricky' },
      { title: 'Gangrene is a cover-name', detail: 'Dry gangrene = coagulative necrosis from ischaemia; wet = liquefactive with bacterial superinfection. The exam wants the underlying pattern, not the label.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Necrosis type in a cerebral infarct?', a: 'Liquefactive — the brain has little supportive stroma and abundant lipid/lysosomal content, so it softens and cysts.' },
      { q: 'Chalky-white deposits in an inflamed pancreas?', a: 'Fat necrosis — saponification of fatty acids by lipase, forming calcium soaps (with hypocalcaemia).' },
      { q: 'Calcium in a scarred mitral valve with normal serum calcium — type?', a: 'Dystrophic calcification — local tissue damage with normal systemic calcium.' },
    ],
  },

  {
    id: 'u-beta-blockers',
    title: 'Beta-Blockers',
    emoji: '🎯',
    subjectCode: 'PHARM',
    system: 'CVS Pharmacology',
    yield: 'must',
    oneLiner: 'β1 for the heart, β2 for the airways — every indication, contraindication and trap lives on that split.',
    plain:
      'Beta-blockers slow the heart (β1: rate, contractility, AV conduction, renin release) and, if non-selective, also block β2 bronchodilation and vasodilation. Choosing selective vs non-selective, knowing the four HFrEF drugs, and remembering the withdrawal and phaeochromocytoma rules is the whole subject.',
    steps: [
      { title: 'The selectivity map', text: 'β1-selective: metoprolol, atenolol, bisoprolol, esmolol (ultra-short IV), nebivolol. Non-selective: propranolol, nadolol, timolol (glaucoma), sotalol (also class III). α+β: labetalol (hypertension in pregnancy), carvedilol. Pindolol/acebutolol carry intrinsic sympathomimetic activity.' },
      { title: 'Why the heart likes them', text: 'Class II antiarrhythmic action: ↓SA node rate, ↓AV conduction, ↓contractility, ↓renin from JG cells. Uses span IHD, hypertension, arrhythmias, HF, thyrotoxicosis symptom control, migraine prophylaxis, essential tremor and variceal prophylaxis in portal hypertension.' },
      { title: 'The four HFrEF names', text: 'Bisoprolol, carvedilol, metoprolol SUCCINATE and nebivolol reduce mortality in heart failure — start low, go slow, and never initiate during acute decompensation.' },
      { title: 'The danger rules', text: 'Propranolol can precipitate bronchospasm in asthma; in diabetes it masks the tachycardia/tremor of hypoglycaemia (sweating persists). In phaeochromocytoma, block α BEFORE β or hypertension explodes. Chronic users must taper — abrupt stop → rebound tachycardia, hypertension and unstable angina.' },
    ],
    weak: [
      { title: 'Cardioselectivity is dose-dependent', detail: 'β1-selective drugs lose selectivity at higher doses — "safe in asthma" is relative, never absolute. Exams reward the word "cautiously".', severity: 'frequent' },
      { title: 'Wrong beta-blocker in HFrEF', detail: 'Only carvedilol, bisoprolol, metoprolol succinate and nebivolol carry mortality evidence; sotalol or atenolol answers are planted traps. And never START one in an acutely decompensated patient.', severity: 'deadly' },
      { title: 'Unopposed α catastrophe', detail: 'β-blockade alone in phaeochromocytoma leaves α-mediated vasoconstriction unopposed → hypertensive crisis. Phenoxybenzamine first, then β.', severity: 'deadly' },
      { title: 'Withdrawal syndrome forgotten', detail: 'Chronic therapy upregulates receptors; stopping overnight can trigger rebound angina/MI and arrhythmias — taper over 1–2 weeks.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Why is propranolol avoided in asthma?', a: 'Non-selective β2 blockade → bronchospasm; if a beta-blocker is essential, use a cardioselective agent cautiously.' },
      { q: 'Beta-blocker of choice in pregnancy-related hypertension?', a: 'Labetalol (α+β) — maternal BP control without compromising uteroplacental flow.' },
      { q: 'A patient on atenolol for 5 years stops it abruptly — what happens?', a: 'Withdrawal: receptor upregulation → rebound tachycardia, hypertension and unstable angina; taper, don\'t stop.' },
    ],
  },

  {
    id: 'u-aminoglycosides',
    title: 'Aminoglycosides',
    emoji: '🔊',
    subjectCode: 'PHARM',
    system: 'Antimicrobials',
    yield: 'high',
    oneLiner: 'Oxygen-powered entry to the 30S ribosome — cidal for aerobic Gram-negatives, deafening and nephrotoxic in return.',
    plain:
      'Aminoglycosides (gentamicin, tobramycin, amikacin, streptomycin, neomycin) bind the 30S subunit irreversibly, causing mRNA misreading and killing the cell. Uptake needs oxygen, so anaerobes ignore them entirely — and the same cell-biology intimacy explains the three classic toxicities.',
    steps: [
      { title: 'Mechanism and entry', text: 'Passive diffusion, then oxygen-dependent active transport into the cell — anaerobes have no door. At the 30S subunit (S12 protein): irreversible inhibition of the initiation complex plus mRNA misreading = BACTERICIDAL, unlike the static tetracyclines.' },
      { title: 'How they are used', text: 'Aerobic Gram-negative coverage (Enterobacterales, Pseudomonas) and SYNERGY with cell-wall agents — penicillin + gentamicin for enterococcal endocarditis. Poorly absorbed orally: neomycin is given PO only for gut decontamination (most toxic of the family, never parenteral).' },
      { title: 'The toxicity triad', text: 'Nephrotoxicity: proximal tubule, usually reversible non-oliguric AKI. Ototoxicity: cochlear (high-frequency loss, tinnitus) or vestibular (ataxia) — cumulative and permanent, potentiated by loop diuretics. Neuromuscular blockade: curare-like — dangerous in myasthenia gravis; reverse with calcium gluconate + neostigmine.' },
      { title: 'Dosing is a design feature', text: 'Concentration-dependent killing plus a post-antibiotic effect allow once-daily high-dose regimens; TROUGH levels (not peaks) best predict toxicity. Contraindicated in pregnancy — foetal ototoxicity (streptomycin, classically).' },
    ],
    weak: [
      { title: 'Cidal vs static at 30S', detail: 'Aminoglycosides AND tetracyclines bind 30S, but only aminoglycosides are bactericidal. Pairing the wrong adjective with the subunit is the standing trap.', severity: 'frequent' },
      { title: 'The anaerobe blind spot', detail: 'Uptake requires aerobic electron transport — zero activity against anaerobes and poor intracellular effect. Adding an aminoglycoside "for anaerobic cover" is simply wrong.', severity: 'tricky' },
      { title: 'Which toxicity is reversible?', detail: 'Nephrotoxicity usually reverses on stopping; ototoxicity is cumulative and permanent, and TROUGH levels predict it. Swapping the two in an answer costs the mark.', severity: 'deadly' },
      { title: 'Loop diuretic double hit', detail: 'Furosemide + aminoglycoside = additive ototoxicity — a classic ward and MCQ combination, especially with renal impairment.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Gentamicin with furosemide — what interaction?', a: 'Additive ototoxicity — high-frequency hearing loss and vestibular damage; avoid the combination, especially in renal failure.' },
      { q: 'Why are aminoglycosides useless against anaerobes?', a: 'Their uptake is oxygen-dependent active transport — anaerobic bacteria cannot import the drug.' },
      { q: 'A myasthenic given gentamicin deteriorates — mechanism?', a: 'Neuromuscular junction blockade (curare-like, Ca²⁺-antagonised) — treat with calcium gluconate and neostigmine.' },
    ],
  },

  {
    id: 'u-tb-diagnosis',
    title: 'Diagnosing Tuberculosis',
    emoji: '🦠',
    subjectCode: 'MICRO',
    system: 'Bacterial Infections',
    yield: 'must',
    oneLiner: 'Skin test says "exposed", NAAT says "TB + rifampicin resistance?", culture says "gold standard" — use them in that order of speed.',
    plain:
      'Tuberculosis diagnosis stacks four tools: the tuberculin skin test (infection, not disease), sputum microscopy (fast but insensitive), NAAT/GeneXpert (species plus rifampicin resistance in ~2 hours — India\'s upfront test under NTEP) and culture (the gold standard, with full drug susceptibility). Knowing what each CANNOT tell you is where the marks live.',
    steps: [
      { title: 'Mantoux — a test of infection', text: '0.1 mL of tuberculin (5 TU PPD; India uses RT23 with Tween 80) intradermally, reading the transverse INDURATION — not redness — at 48–72 h. Cutoffs shift with risk: ≥5 mm in HIV/contacts/immunosuppressed; ≥10 mm general or high-risk; ≥15 mm no known risk factors. A positive test means infection, never proof of active disease.' },
      { title: 'Smear and culture', text: 'Ziehl–Neelsen smear needs ~10,000 bacilli/mL — fast and cheap but only ~50–60% sensitive. Culture on LJ medium (6–8 weeks; rough, tough, buff colonies) or liquid MGIT (1–3 weeks) remains the GOLD STANDARD and enables complete drug-susceptibility testing.' },
      { title: 'NAAT — India\'s upfront test', text: 'GeneXpert MTB/RIF (CBNAAT): cartridge-based real-time PCR detecting M. tuberculosis AND rpoB-mediated rifampicin resistance in ~2 hours; NTEP deploys it as the initial test for all presumptive TB, including CSF and tissue samples. It does NOT screen for isoniazid resistance — that needs LPA or culture DST.' },
      { title: 'IGRA and the anergy list', text: 'QuantiFERON/T-SPOT detect T-cell interferon-γ without BCG cross-reactivity — but still cannot separate latent from active TB. False-negative Mantoux (anergy): HIV, miliary TB, sarcoidosis, malnutrition, measles and other viral infections, corticosteroids.' },
    ],
    weak: [
      { title: 'Positive Mantoux ≠ disease', detail: 'The skin test can never distinguish latent infection from active TB — disease needs symptoms, radiology and microbiology. And after recent infection there is an 8–10 week window before it turns positive.', severity: 'deadly' },
      { title: 'BCG and environmental mycobacteria', detail: 'BCG usually leaves an induration under 10 mm that wanes with age; non-tuberculous mycobacteria cross-react — the very reason IGRAs were built. Over-reading a post-BCG Mantoux over-diagnoses TB.', severity: 'frequent' },
      { title: 'GeneXpert is RIF-only', detail: 'It reports MTB and rifampicin resistance — NOT a complete susceptibility profile. "GeneXpert rules out drug resistance" is false; isoniazid and second-line drugs need LPA or culture DST.', severity: 'tricky' },
      { title: 'Induration, not erythema', detail: 'Measure the hard raise transversely at 48–72 h; reading redness or the wrong day are the two technique errors examiners model.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Upfront diagnostic test for pulmonary TB in India (NTEP)?', a: 'NAAT — CBNAAT/GeneXpert MTB/RIF for every presumptive TB case (MTB + rifampicin resistance in ~2 h).' },
      { q: 'Gold standard for TB diagnosis?', a: 'Culture (LJ/MGIT) — highest sensitivity and the only source of a complete drug-susceptibility profile.' },
      { q: 'Mantoux cutoff in an HIV-positive contact of a TB patient?', a: '≥5 mm induration — the strictest tier, shared with the heavily immunosuppressed and fibrotic-CXR groups.' },
    ],
  },

  {
    id: 'u-culpable-homicide',
    title: 'Culpable Homicide vs Murder',
    emoji: '⚖️',
    subjectCode: 'FMT',
    system: 'Forensic Law',
    yield: 'must',
    oneLiner: 'Culpable homicide is the genus, murder the species — the difference is how certain death was in the mind.',
    plain:
      'IPC Section 299 (now BNS 100) defines culpable homicide — death caused intending death, intending a likely-fatal injury, or knowing death is likely. Section 300 (BNS 101) upgrades it to murder when death is intended, when the injury is objectively "sufficient in the ordinary course of nature to cause death", or when the act is known to be imminently deadly. The five exceptions then pull murder back down to culpable homicide.',
    steps: [
      { title: 'The probability ladder', text: '299: death is "likely". 300: death is intended (Firstly), or the offender KNOWS the injury will kill that particular person (Secondly), or the injury is objectively sufficient in the ordinary course of nature (Thirdly), or the act is imminently dangerous and must in all probability cause death (Fourthly). Every MCQ is testing which rung you stand on.' },
      { title: 'The doctor\'s phrase', text: '"Sufficient in the ordinary course of nature to cause death" (Thirdly) is the sentence medicolegal opinions are built on — the objective lethality of the injury, whatever the offender believed (Viresh Singh v State of UP).' },
      { title: 'Five exceptions that demote murder', text: 'Grave and sudden provocation; exceeding private defence in good faith; a public servant exceeding powers in good faith; a sudden fight in the heat of passion without premeditation; and consent of a person above 18 years. Any exception converts 300 → 304.' },
      { title: 'Punishment map', text: 'Murder (IPC 302 / BNS 103): death or imprisonment for life + fine. Culpable homicide with intention (304-I / BNS 105): life or up to 10 years; with knowledge only (304-II): up to 10 years. Renumbering: IPC 299→BNS 100, 300→101, 302→103, 304→105.' },
    ],
    weak: [
      { title: 'Genus vs species, with the case name', detail: '"Culpable homicide is the genus and murder the species" — Reg v Govinda (1876), the one FMT quote examiners expect, year included.', severity: 'frequent' },
      { title: 'Likely vs sufficient', detail: '299 needs death merely LIKELY; 300-Thirdly needs the injury SUFFICIENT to cause death in the ordinary course of nature. One adjective changes the section — and the punishment.', severity: 'deadly' },
      { title: 'Exceptions are a closed list', detail: 'Only five demote murder; "heat of passion" alone is NOT one of them unless it is a SUDDEN FIGHT without premeditation (Exception 4). Inventing a sixth exception is a favourite distractor.', severity: 'tricky' },
      { title: 'BNS renumbering', detail: 'Exams now mix IPC and BNS 2023 numbers: 299→100, 300→101, 302→103, 304→105. Answering 302 where BNS 103 is asked loses the mark either way.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Death during a sudden mutual fight, no premeditation — which offence?', a: 'Culpable homicide not amounting to murder — IPC 304 (BNS 105) via Exception 4 to Section 300.' },
      { q: 'Punishment under IPC 302 (BNS 103)?', a: 'Death or imprisonment for life, plus fine — the maximum for murder.' },
      { q: 'Which IPC 300 clause uses "sufficient in the ordinary course of nature"?', a: 'Thirdly — intentional bodily injury objectively sufficient to cause death; the phrase doctors opine on (Viresh Singh case).' },
    ],
  },

  {
    id: 'u-levels-of-prevention',
    title: 'Levels of Prevention',
    emoji: '🛡️',
    subjectCode: 'CM',
    system: 'General Epidemiology',
    yield: 'must',
    oneLiner: 'Before risk factors exist, as they appear, once disease starts, once damage is done — four levels, five modes of intervention.',
    plain:
      'Prevention is a timeline, not a pile of examples: primordial (stop risk factors ever emerging), primary (health promotion + specific protection), secondary (early diagnosis + prompt treatment), tertiary (disability limitation + rehabilitation). Every exam question is an example dropped on the wrong level — place the example on the timeline and you cannot miss.',
    steps: [
      { title: 'Primordial — the policy level', text: 'Acting before risk factors appear in the population: national trans-fat bans, urban planning for walkability, school anti-smoking education. No disease exists yet — not even a risk factor does.' },
      { title: 'Primary — health promotion + specific protection', text: 'Health promotion is generic (health education, lifestyle, sanitation); specific protection is aimed (immunisation, iodised salt, seat belts, fluoridation, chemoprophylaxis — INH for a child TB contact is PRIMARY, not secondary).' },
      { title: 'Secondary — early diagnosis + prompt treatment', text: 'Screening and case-finding (Pap smear, mammography, BP/glucose checks) become prevention only when PROMPT TREATMENT follows — together they halt progression and allow cure. Treating active TB or newly found hypertension sits here.' },
      { title: 'Tertiary — disability limitation + rehabilitation', text: 'First limit the damage (insulin to prevent diabetic complications, splints to prevent leprosy deformities), then restore function (physiotherapy, prostheses, vocational retraining). Quaternary prevention — protecting patients from overmedicalisation — is the modern add-on.' },
    ],
    weak: [
      { title: 'Primordial vs primary boundary', detail: 'Is the risk factor already present in the population? Yes → primary; No (policy against its emergence) → primordial. "Ban trans-fats" is primordial; "screen for obesity" is secondary.', severity: 'tricky' },
      { title: 'Chemoprophylaxis is primary', detail: 'INH for child contacts and meningococcal prophylaxis for close contacts = specific protection (primary). Calling prophylaxis "secondary because disease may exist" is the classic wrong answer.', severity: 'deadly' },
      { title: 'Screening alone is incomplete', detail: 'Early diagnosis counts as secondary prevention only WITH prompt treatment — a screening programme without a treatment pathway achieves nothing.', severity: 'frequent' },
      { title: 'Tertiary has two halves', detail: 'Disability LIMITATION (stop the deformity or complication) and REHABILITATION (restore function) are separate modes of intervention — questions often name one and expect the other.', severity: 'frequent' },
    ],
    traps: [
      { q: 'Pap smear screening for cervical cancer — level of prevention?', a: 'Secondary — early diagnosis (it works only because prompt treatment follows).' },
      { q: 'Iodised salt in goitre-endemic districts — level?', a: 'Primary prevention — specific protection (fortification against a defined deficiency).' },
      { q: 'National policy eliminating industrial trans-fats — level?', a: 'Primordial prevention — acting before the risk factor emerges in the population.' },
    ],
  },
]
