// ─── MEDULA — grounded research-paper explainers: AI in Medicine (Task 19-d) ─
// Every paper here is REAL and landmark-status; each entry was included only
// because its existence, venue and general findings are well known. Where an
// exact figure is recalled with uncertainty it is either replaced by a
// qualitative description or flagged with a confidenceNote — NEVER invented.
// Explain-ers are independently synthesized for teaching; they do not
// reproduce any paper's text.

import type { PaperExplainer } from './types'

export const AI_MEDICINE_PAPERS: PaperExplainer[] = [
  {
    id: 'esteva-2017-dermatology-cnn',
    title: 'Dermatologist-level classification of skin cancer with deep neural networks',
    authors: 'Esteva A, Kuprel B, et al.',
    year: 2017,
    journal: 'Nature',
    doi: '10.1038/nature21056',
    url: 'https://doi.org/10.1038/nature21056',
    question:
      'Can a deep neural network classify skin lesions — including malignant ones — as accurately as board-certified dermatologists?',
    dataset:
      'A large set of clinical skin images (on the order of 129,000 images covering around 2,000 dermatological conditions), with the head-to-head test performed on biopsy-proven cases against 21 board-certified dermatologists.',
    method:
      'A convolutional neural network (an Inception-architecture model fine-tuned via transfer learning from general image recognition) was trained on the clinical image set, then tested on held-out, biopsy-verified cases for two clinically central tasks: classifying keratinocyte carcinomas and classifying melanomas.',
    result:
      'In the tested setting, the network’s agreement with the biopsy ground truth was on par with — and in some comparisons slightly exceeded — that of the 21 dermatologists. The comparison used the dermatologists’ own responses as a benchmark against the same biopsy-verified cases.',
    meaning:
      'A model trained purely on examples could reach specialist-level visual classification for a narrow, well-defined task. This paper became the template for "doctor-level AI" claims — and for the questions every such claim must answer: which doctors, which dataset, which operating point?',
    limitations: [
      'Test conditions were idealised: pre-cropped single-lesion images differ from real clinic workflows and dermoscopy practice.',
      'Dermatologists themselves disagreed with each other and with biopsy at meaningful rates, making the human benchmark fuzzy.',
      'The dataset was not representative of all skin tones and populations — a gap later work has had to address.',
    ],
    whyMatters:
      'It was the paper that made medical deep learning mainstream: published in Nature, covered worldwide, and built the rhetorical and methodological pattern — model vs experts on held-out data — that hundreds of studies followed. It also seeded today’s phone-based triage research.',
    simpleExplain:
      'Researchers showed a computer more than a hundred thousand photos of skin problems, each labelled by doctors. The computer learned to tell dangerous skin cancer from harmless spots about as well as 21 skin specialists did — on the same test. It is like a student who has seen more slides than any dermatologist sees in a lifetime. Important caveat: the test was tidy and artificial; real clinics are messier.',
    field: 'ai-in-medicine',
    evidenceLevel: 'landmark-study',
  },
  {
    id: 'gulshan-2016-diabetic-retinopathy',
    title: 'Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs',
    authors: 'Gulshan V, Peng L, et al. (Google research team)',
    year: 2016,
    journal: 'JAMA',
    doi: '10.1001/jama.2016.17216',
    question:
      'Can a deep-learning algorithm detect referable diabetic retinopathy in retinal fundus photographs accurately enough to support population screening?',
    dataset:
      'Tens of thousands of retinal fundus photographs from two independent validation sets (EyePACS-1 from the US and Messidor-2 from Europe), with the reference standard built by panels of ophthalmologists grading each image (majority-based adjudication of the disease grade).',
    method:
      'A deep convolutional network was trained to grade fundus photographs for diabetic retinopathy severity; performance was measured against the ophthalmologist-panel reference standard on the two held-out validation sets, at pre-specified operating points tuned for a screening use case.',
    result:
      'The algorithm met or exceeded the study’s benchmark (high sensitivity AND high specificity, roughly above the 90% level used as the screening threshold in the study’s framing) on both independent validation sets. Exact operating-point figures varied by dataset and threshold choice — the paper reports sensitivity/specificity pairs rather than a single headline number.',
    meaning:
      'Screening for a blinding disease — the classic public-health bottleneck where specialists are scarce — could be assisted or performed by AI on standard fundus photographs. This work led directly to real-world screening programmes and to the first autonomous AI diagnostic authorisations in ophthalmology.',
    limitations: [
      'Grading-quality photographs only: real screening programmes face blur, glare and ungradable images far more often than trial datasets.',
      'Two specific image sets and camera ecosystems; generalisation to other populations and devices needed separate proof.',
      'Detection of referable retinopathy is not the whole of diabetic eye care (maculopathy assessment and ongoing monitoring remain clinical tasks).',
    ],
    whyMatters:
      'Alongside Esteva 2017, this is one of the two founding demonstrations of clinical-grade medical AI. It is the study most often cited when explaining how AI enters PUBLIC HEALTH (screening at scale) rather than specialist practice.',
    simpleExplain:
      'Diabetes can quietly damage the retina and cause blindness; catching it early needs an eye specialist to look at photographs of the back of the eye — and there are not enough specialists. Researchers taught a computer to read those photos by showing it many labelled examples. Graded against panels of eye specialists, the computer caught the sight-threatening stage about as reliably as the specialists’ own benchmark required. This is the study behind "AI eye screening".',
    field: 'ai-in-medicine',
    evidenceLevel: 'landmark-study',
  },
  {
    id: 'rajpurkar-2017-chexnet',
    title: 'CheXNet: Radiologist-Level Pneumonia Detection on Chest X-Rays with Deep Learning',
    authors: 'Rajpurkar P, Irvin J, et al.',
    year: 2017,
    journal: 'arXiv (preprint)',
    url: 'https://arxiv.org/abs/1711.05225',
    question:
      'Can a deep convolutional network detect pneumonia on frontal chest X-rays at a level comparable to practising radiologists?',
    dataset:
      'ChestX-ray14 — a large public dataset of over 100,000 frontal chest X-ray images carrying (text-mined) labels for 14 thoracic pathologies; the pneumonia comparison used a subset where radiologists provided ground truth.',
    method:
      'A 121-layer densely connected convolutional network (DenseNet-121) was trained to classify the 14 findings, with the pneumonia task compared head-to-head against four radiologists on a held-out test set using F1-style agreement measures.',
    result:
      'In the paper’s setting, CheXNet exceeded the F1 scores achieved by the four radiologists on the pneumonia-detection task, and performed strongly across the 14 findings. The comparison and the noisy label source drew substantial subsequent methodological debate.',
    meaning:
      'Chest radiography — the highest-volume imaging test in the world — became a headline AI target. The paper also became a teaching case about evaluation: text-mined labels, small expert panels, and threshold choices all matter as much as the architecture.',
    limitations: [
      'Labels were extracted from radiology reports by NLP rather than independent adjudication — label noise caps what any model can honestly demonstrate.',
      'Comparison against four radiologists on a small test subset is a narrow benchmark, later debated in the literature.',
      'Released as a preprint; the surrounding claims circulated faster than the peer-reviewed evidence matured.',
    ],
    whyMatters:
      'One of the most-cited preprints in medical AI: it made chest X-ray interpretation the canonical imaging-AI benchmark and — equally instructively — became a standard example of how evaluation design (labels, comparators, operating points) shapes "radiologist-level" claims.',
    simpleExplain:
      'A research team trained a deep network on more than a hundred thousand labelled chest X-rays until it could flag pneumonia. On their test, it scored better than four radiologists doing the same task. But the X-rays’ "answers" had been copied out of written reports by software, not re-checked disease by disease — so the result is best read as a strong demonstration that sparked a decade of better-done follow-up work.',
    field: 'ai-in-medicine',
    evidenceLevel: 'landmark-study',
    confidenceNote:
      'Preprint with well-known evaluation debates; described here qualitatively (direction of result, dataset scale) rather than by exact F1 values.',
  },
  {
    id: 'mckinney-2020-breast-cancer-screening',
    title: 'International evaluation of an AI system for breast cancer screening',
    authors: 'McKinney SM, Sieniek M, et al. (Google Health team)',
    year: 2020,
    journal: 'Nature',
    doi: '10.1038/s41586-019-1799-6',
    url: 'https://doi.org/10.1038/s41586-019-1799-6',
    question:
      'Can an AI system read screening mammograms with fewer false positives and fewer false negatives than the routine radiologist processes it would replace or support?',
    dataset:
      'De-identified retrospective screening mammograms from large programmes in the United Kingdom (double-reading system) and the United States (single-reading system) — tens of thousands of women in each cohort.',
    method:
      'A deep-learning system analysed mammograms for suspicious findings; its classifications were compared against the actual screening outcomes (interval cancers and follow-up) and against the human reading processes in each country’s system, simulating both standalone and reader-support scenarios.',
    result:
      'The system reduced both false positives and false negatives relative to the routine process in both datasets, with larger absolute reductions in the US single-reading setting (where the human baseline is lighter) than in the UK double-reading setting. The often-quoted reduction figures (false positives down ~5.7% US / ~1.2% UK; false negatives down ~9.4% US / ~2.7% UK) are recalled from the abstract with moderate confidence — verify against the paper.',
    meaning:
      'Population screening — where tiny per-case differences compound across millions of reads — is a realistic AI target, and the reading-system context (single vs double reading) changes the size and even the existence of the benefit.',
    limitations: [
      'Retrospective simulation: the study models what the system would have done, rather than measuring prospective clinical outcomes.',
      'Two health systems with different reading practices — results do not transfer automatically to other programmes or equipment.',
      'Subsequent independent analyses and trials examined how the reported gains translate into real screening service deployment.',
    ],
    whyMatters:
      'Brought screening-scale thinking into medical AI (error rates per 100,000 reads, not per 100 cases) and demonstrated why health-system design — not just model accuracy — determines real-world value.',
    simpleExplain:
      'Mammograms are read by radiologists, sometimes two per film, and even experts miss some cancers and raise some false alarms. A big team trained AI on tens of thousands of screening mammograms from the UK and the US. On past data, the AI missed fewer cancers AND raised fewer false alarms than the usual reading process — most dramatically where only one radiologist normally reads. The catch: this was a simulation on old films, not AI actually running in clinics.',
    field: 'ai-in-medicine',
    evidenceLevel: 'landmark-study',
    confidenceNote:
      'Exact reduction percentages recalled with moderate confidence; qualitative direction (both error types reduced in both systems, larger US effect) is well established.',
  },
  {
    id: 'topol-2019-high-performance-medicine',
    title: 'High-performance medicine: the convergence of human and artificial intelligence',
    authors: 'Topol EJ',
    year: 2019,
    journal: 'Nature Medicine',
    doi: '10.1038/s41591-018-0300-7',
    url: 'https://doi.org/10.1038/s41591-018-0300-7',
    question:
      'How will the convergence of deep learning, sensors and clinical data reshape medicine’s core activities — and what stands between the promise and the patient?',
    dataset:
      'Not applicable — a narrative review/perspective synthesising the deep-learning, digital-sensor and clinical-AI literature of the decade.',
    method:
      'Structured expert synthesis across domains: imaging and diagnostics, therapeutics, population health, wearables and the "unstructured data" frontier (notes, voice), plus analysis of barriers (validation, privacy, workflow, the empathy deficit).',
    result:
      'Argues that deep learning plus continuous sensor data can make medicine more predictive, personalised and — paradoxically — more human, by returning time from keyboards to patients; equally clear that hype, weak validation, privacy and workflow integration are genuine obstacles. No numbers to quote — this is the field’s most-cited agenda-setting essay.',
    meaning:
      'Gave the medical profession its shared mental map of the AI transition — the vocabulary ("high-performance medicine") and the balanced posture: substantial potential, conditional on evidence and humanity.',
    limitations: [
      'A single-author perspective — inherently selective, not a systematic review.',
      'Optimistic timelines written before several celebrated models met humbling external validation.',
      'Fast-moving field: specific tool references have aged, though the framework has not.',
    ],
    whyMatters:
      'The single most-cited orientation document in AI-and-medicine. If you read one reference to understand why clinicians, not just engineers, are central to the AI transition — this is it.',
    simpleExplain:
      'One of medicine’s most respected voices reviewed everything AI was starting to do — reading scans, listening to hearts through phones, drafting notes — and made two arguments. First: AI could take over the pattern-recognition grunt work and give doctors back their time and attention. Second: none of that happens safely unless doctors demand proof, protect privacy and keep human connection at the centre. Famous last line spirit: the most welcome innovation may be the return of the human touch.',
    field: 'ai-in-medicine',
    evidenceLevel: 'landmark-study',
  },
  {
    id: 'singhal-2023-medpalm',
    title: 'Large language models encode clinical knowledge',
    authors: 'Singhal K, Azam S, et al. (Google research team)',
    year: 2023,
    journal: 'Nature',
    doi: '10.1038/s41586-023-06291-2',
    url: 'https://doi.org/10.1038/s41586-023-06291-2',
    question:
      'Do large language models encode clinical knowledge well enough to answer medical exam questions and generate clinically useful long-form answers?',
    dataset:
      'MultiMedQA — a suite of medical question-answering benchmarks combining USMLE-style exam questions (MedQA) and professional datasets — plus a human evaluation study in which clinicians judged long-form answers.',
    method:
      'The research team instruction-tuned the large Flan-PaLM model and introduced Med-PaLM, a decoding strategy steering the model toward medical question-answering; performance was benchmarked against prior state-of-the-art models and, separately, clinicians scored the model’s long-form answers against physician answers on axes like factuality, reasoning and harm.',
    result:
      'Flan-PaLM surpassed all previously published models on MultiMedQA (the often-quoted MedQA figure is 67.6% — recalled with moderate confidence; verify against the paper). Crucially, the clinician evaluation showed a gap: on long-form answers, clinician raters still judged the model below physician answers on several key axes — motivating the later Med-PaLM generation.',
    meaning:
      'Established the two-axes lesson for all medical LLMs: exam-style accuracy can look impressive while open-ended clinical usefulness lags — scores and safety are different currencies. Also set the evaluation template (clinician raters, harm axes) that later medical-LLM papers adopted.',
    limitations: [
      'Benchmarks test recall-style Q&A — real clinical reasoning is broader, messier and context-dependent.',
      'Long-form evaluation panels, though rigorous, cover limited clinical domains and cannot capture real-world workflow performance.',
      'Knowledge cutoff and hallucination risks mean even strong scores do not authorise unsupervised clinical use.',
    ],
    whyMatters:
      'The peer-reviewed anchor of the medical-LLM wave: it made "LLMs as medical knowledge engines" a testable, tested claim — and honestly documented where the gap to safe clinical use remained.',
    simpleExplain:
      'Researchers took a giant language model — the same family of technology behind chatbots — and asked it thousands of medical exam questions, then had doctors grade its longer explanations. Result: it beat every earlier model on the exam-style questions, approaching the passing range doctors themselves need. But when doctors read its written answers to open questions, they found them weaker than what physicians write — good enough to be exciting, not good enough to be trusted alone.',
    field: 'ai-in-medicine',
    evidenceLevel: 'landmark-study',
    confidenceNote: 'Exact benchmark percentage (67.6% on MedQA) recalled with moderate confidence; verify against the published abstract.',
  },
  {
    id: 'thirunavukarasu-2023-llms-in-medicine',
    title: 'Large language models in medicine',
    authors: 'Thirunavukarasu AJ, et al.',
    year: 2023,
    journal: 'Nature Medicine',
    question:
      'What can LLMs realistically contribute across medical education, research and clinical practice — and what risks, limitations and governance questions must be answered first?',
    dataset:
      'Not applicable — a narrative review synthesising the 2023 wave of LLM evaluations, applications and position papers across medicine.',
    method:
      'Structured narrative review of LLM capabilities mapped onto concrete medical workflows (documentation, summarisation, literature synthesis, education), with an analysis of failure modes (hallucination, bias, privacy) and of the evaluation/regulatory gap.',
    result:
      'Concludes that LLMs are already useful for language-shaped tasks (drafting, summarising, explaining) while clinical decision-making remains out of bounds without far stronger evidence, grounding and regulation; emphasises that evaluation frameworks lag the technology’s deployment.',
    meaning:
      'Became one of the standard citations for the pragmatic mid-2020s position: enthusiastic adoption of LLMs for paperwork, disciplined caution for everything that touches clinical decisions.',
    limitations: [
      'The LLM field moves so fast that any review’s specific model examples date quickly — read for the framework, not the leaderboard.',
      'Narrative (not systematic) selection of evidence.',
      'Written before several national regulators finalised LLM-specific guidance.',
    ],
    whyMatters:
      'The field’s most convenient single reference for "what LLMs may and may not do in medicine" — widely used in medical-education curricula, journal clubs and governance committees.',
    simpleExplain:
      'A 2023 stock-take of chatbot-style AI in medicine: brilliant at words (letters, notes, summaries, explanations), unreliable at facts unless grounded in verified sources, and not ready to make clinical decisions. The paper’s lasting value is its framing — treat LLMs as powerful language assistants whose outputs a human must own and verify.',
    field: 'ai-in-medicine',
    evidenceLevel: 'landmark-study',
    confidenceNote:
      'Included from training knowledge with high confidence that the review exists as described (Nature Medicine, 2023, first author Thirunavukarasu); no DOI is stated because the identifier is not recalled with certainty.',
  },
  {
    id: 'obermeyer-2019-racial-bias',
    title: 'Dissecting racial bias in an algorithm used to manage the health of populations',
    authors: 'Obermeyer Z, Powers B, et al.',
    year: 2019,
    journal: 'Science',
    doi: '10.1126/science.aax2342',
    url: 'https://doi.org/10.1126/science.aax2342',
    question:
      'Does a widely used commercial algorithm that assigns risk scores to allocate extra care to high-need patients treat Black and white patients equally?',
    dataset:
      'Health records of a large US academic hospital system’s population covered by the algorithm — millions of patient records linking algorithm scores, costs, diagnoses, biomarkers and demographics.',
    method:
      'The researchers compared each patient’s algorithm risk score against independent measures of actual illness burden (chronic conditions, lab values, utilisation) stratified by race, then modelled what would change if the algorithm’s target variable were replaced.',
    result:
      'At any given risk score, Black patients were considerably sicker than white patients: because the algorithm predicted healthcare COSTS as a proxy for health NEEDS, and historical access barriers meant less money was historically spent on Black patients’ care, the model systematically under-flagged them. The authors calculated that fixing the label (predicting illness directly rather than cost) would raise the share of Black patients receiving the programme’s extra help from roughly 17.7% to roughly 46.5% — figures widely quoted, recalled with high-moderate confidence.',
    meaning:
      'The canonical demonstration that algorithmic bias can arise from an innocent-looking LABEL CHOICE rather than from data volume or model complexity — and that "the algorithm is just maths" is not a defence. Reshaped how the field defines and audits fairness.',
    limitations: [
      'One commercial system and one health system’s data — the specific magnitudes do not generalise, though the mechanism has since been found elsewhere.',
      'Observational decomposition, not a randomised test of alternative allocation policies.',
      'The authors note the algorithm vendor cooperated and the label fix was feasible — deployments without such cooperation are harder to audit.',
    ],
    whyMatters:
      'The most influential paper in AI-and-health-equity: cited by regulators, ethicists and every fairness-audit framework since. It converted "bias in AI" from a theoretical worry into a measured, explained, fixable clinical governance problem.',
    simpleExplain:
      'A computer program used by many US hospitals decided which patients needed extra help by predicting who would generate high healthcare COSTS. That sounded sensible — but less money is spent on Black patients’ care because of access barriers, so the program concluded they were healthier than they were and offered them less help. Researchers showed that simply changing the goal from "costs" to "actual illness" would roughly triple the number of Black patients getting help. Bias lived not in the maths but in the question the maths was asked.',
    field: 'ai-in-medicine',
    evidenceLevel: 'landmark-study',
    confidenceNote:
      'The 17.7% → 46.5% reallocation figures are among the most-quoted numbers in the field; recalled with high-moderate confidence and flagged here for verification against the original.',
  },
  {
    id: 'abramoff-2018-idxdr-pivotal',
    title: 'Pivotal trial of an autonomous AI-based diagnostic system for detection of diabetic retinopathy in primary care offices',
    authors: 'Abràmoff MD, et al.',
    year: 2018,
    journal: 'npj Digital Medicine',
    question:
      'Can a fully autonomous AI diagnostic system — with no human over-read — safely and accurately detect more-than-mild diabetic retinopathy when operated by non-eye-care staff in primary-care offices?',
    dataset:
      'Around 900 patients with diabetes across multiple US primary-care sites; each received the autonomous system’s assessment (fundus photographs taken by trained non-eye staff) plus dilated examination by eye-care professionals as the reference standard.',
    method:
      'A pivotal, prospective diagnostic-accuracy study of the IDx-DR system: non-eye-care personnel took fundus images per the device protocol; the AI issued its own "more-than-mild diabetic retinopathy detected / not detected (+ image quality)" output, which was compared against the adjudicated dilated-exam reference.',
    result:
      'The autonomous system achieved high sensitivity and specificity against the reference standard at its pre-specified operating point (widely reported in the mid-80% to high-80% range for both — exact values not quoted here from memory), with a modest ungradable-image rate; this evidence supported the system becoming the first FDA-authorised autonomous AI diagnostic (De Novo pathway, 2018).',
    meaning:
      'Proved that bounded autonomy is achievable and safe when every element is controlled: one disease, approved cameras, trained operators, quality checks built in, and a low-regret output (referral for confirmatory exam). It remains the reference case for what "autonomous medical AI" should mean.',
    limitations: [
      'Device- and camera-specific: the safety case does not transfer to other systems or settings without new evidence.',
      'A single-disease screening claim — the "no over-read needed" verdict applies only within that narrow indication.',
      'Ungradable images mean some patients still require the standard pathway — autonomy is not coverage.',
    ],
    whyMatters:
      'The first FDA authorisation of an autonomous AI diagnostic — the moment "human-in-the-loop or not" became an empirical, regulated design question rather than a slogan. Every later autonomy discussion cites this trial.',
    simpleExplain:
      'In ordinary primary-care clinics, a nurse took photos of patients’ retinas with a special camera. The AI looked at the photos ALONE and decided: "signs of diabetes eye damage — refer to a specialist" or "no signs — routine follow-up". No eye doctor double-checked. In this pivotal study it did so reliably, and US regulators allowed it as the first AI allowed to make a screening referral without a physician over-read — for that one disease, that one camera, that one task.',
    field: 'ai-in-medicine',
    evidenceLevel: 'cohort',
    confidenceNote:
      'Study design and regulatory outcome are well established; exact sensitivity/specificity values deliberately not quoted from memory — described qualitatively as high against the dilated-exam reference.',
  },
  {
    id: 'beede-2020-dr-deployment-gap',
    title: 'A Human-Centered Evaluation of a Deep Learning System Deployed in Clinics for the Detection of Diabetic Retinopathy',
    authors: 'Beede E, Dawn S, et al.',
    year: 2020,
    journal: 'CHI Conference on Human Factors in Computing Systems (CHI \'20), ACM',
    question:
      'What actually happens — to accuracy, workflow and staff experience — when a well-validated deep-learning retinopathy system runs in real clinics, rather than in trial conditions?',
    dataset:
      'Field observations and interviews with nurses and clinic staff using a deployed AI diabetic-retinopathy screening system across multiple clinics in Thailand, plus analysis of the system’s operational logs.',
    method:
      'Qualitative human-computer-interaction field study: structured observation of screening sessions, staff interviews, and log analysis of image-capture outcomes across deployment sites with varying infrastructure.',
    result:
      'Real-world conditions diverged sharply from trial conditions: lighting and camera-capture problems produced ungradable images at far higher rates than trial data suggested, slow network links delayed results, staffing constraints meant single nurses juggled roles designed for teams, and feedback loops for improving image quality were weak. The study documents how these frictions degraded the system’s practical value despite its strong validation record.',
    meaning:
      'The canonical "validation ≠ deployment" evidence: a system that succeeds in a pivotal trial can under-deliver in clinics for reasons no accuracy metric captures — human factors, infrastructure and workflow design are part of the algorithm’s real-world performance.',
    limitations: [
      'Qualitative design: rich explanation of failure modes, not a new accuracy estimate.',
      'One country and one programme; specific frictions vary by deployment.',
      'Deployment conditions studied were of their time and place — connectivity and device conditions have improved in some programmes since.',
    ],
    whyMatters:
      'Required reading for anyone planning to deploy medical AI: it moved the conversation from "is the model accurate?" to "does the sociotechnical system work?" — and is the standard citation for deployment-gap analysis in global-health AI.',
    simpleExplain:
      'The same AI eye-screening system that did well in trials was installed in real Thai clinics. Researchers visited and watched. In real rooms: bright sunlight ruined photos, internet was slow, and one nurse had to do everything. Many images could not be graded at all — far more than in the trials — so fewer patients got a usable result than the accuracy numbers promised. Lesson: an AI tool is only as good as the clinic conditions around it.',
    field: 'ai-in-medicine',
    evidenceLevel: 'emerging-research',
    confidenceNote:
      'Qualitative findings summarised faithfully at a descriptive level; no performance numbers are quoted because the study reports deployment observations, not a benchmark score.',
  },
]

// ── List-UI index + filter helper ───────────────────────────────────────────

export interface PaperIndexEntry {
  id: string
  title: string
  year: number
  journal: string
  field: PaperExplainer['field']
}

/** Flat list for list UIs (Research library etc.) — no heavy fields. */
export const PAPER_INDEX: PaperIndexEntry[] = AI_MEDICINE_PAPERS.map((p) => ({
  id: p.id,
  title: p.title,
  year: p.year,
  journal: p.journal,
  field: p.field,
}))

/** Filter explainers by field (only 'ai-in-medicine' is populated today). */
export function papersByField(field: PaperExplainer['field']): PaperExplainer[] {
  return AI_MEDICINE_PAPERS.filter((p) => p.field === field)
}
