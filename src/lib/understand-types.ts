// ─── UNDERSTAND YOUR TOPIC — shared types ───
// A syllabus-wide library of living 3D topics. Content is original, aligned to
// the NMC CBME 2024 curriculum and the NEET-PG blueprint, cross-checked against
// standard references (Guyton, Robbins, Harrison's — restated simply).

export type YieldTier = 'must' | 'high' | 'core'
export type Severity = 'frequent' | 'tricky' | 'deadly'

/** Canonical subject codes — mirror the Subject table codes exactly. */
export const UNDERSTAND_SUBJECTS: Record<string, { name: string; color: string; emoji: string }> = {
  ANAT: { name: 'Anatomy', color: '#38bdf8', emoji: '🦴' },
  PHYS: { name: 'Physiology', color: '#22d3ee', emoji: '⚡' },
  BIOCH: { name: 'Biochemistry', color: '#34d399', emoji: '🧬' },
  PATHO: { name: 'Pathology', color: '#f472b6', emoji: '🔬' },
  PHARM: { name: 'Pharmacology', color: '#a78bfa', emoji: '💊' },
  MICRO: { name: 'Microbiology', color: '#fbbf24', emoji: '🦠' },
  FMT: { name: 'Forensic Medicine', color: '#94a3b8', emoji: '⚖️' },
  CM: { name: 'Community Medicine', color: '#4ade80', emoji: '🌍' },
  ENT: { name: 'ENT', color: '#fb923c', emoji: '👂' },
  OPHT: { name: 'Ophthalmology', color: '#2dd4bf', emoji: '👁️' },
  MED: { name: 'Medicine', color: '#60a5fa', emoji: '🩺' },
  SURG: { name: 'Surgery', color: '#f87171', emoji: '🔪' },
  OBGY: { name: 'Obstetrics & Gynae', color: '#e879f9', emoji: '🤰' },
  PEDS: { name: 'Paediatrics', color: '#facc15', emoji: '🧒' },
  ORTH: { name: 'Orthopaedics', color: '#c084fc', emoji: '🦿' },
  DERM: { name: 'Dermatology', color: '#fca5a5', emoji: '🧴' },
  PSY: { name: 'Psychiatry', color: '#818cf8', emoji: '🧠' },
  RAD: { name: 'Radiology', color: '#7dd3fc', emoji: '📡' },
  ANES: { name: 'Anaesthesia', color: '#9ca3af', emoji: '💉' },
}

/** One narrated beat of the living diagram. */
export interface UnderstandStep {
  title: string
  text: string
  /** data-anchor id inside the scene to spotlight for this step */
  anchor?: string
}

/** A documented point where students commonly slip. */
export interface WeakPoint {
  title: string
  detail: string
  severity: Severity
  anchor?: string
}

export interface ExamTrap {
  q: string
  a: string
}

export interface UnderstandTopic {
  id: string
  title: string
  emoji: string
  subjectCode: keyof typeof UNDERSTAND_SUBJECTS
  system: string
  yield: YieldTier
  /** living 3D scene id — omit for non-scene topics */
  sceneId?: 'heart' | 'ecg' | 'nephron' | 'alveolus' | 'neuron' | 'gastric'
  oneLiner: string
  /** 2–3 sentence plain-words explanation */
  plain: string
  steps: UnderstandStep[]
  weak: WeakPoint[]
  traps: ExamTrap[]
}

export const YIELD_META: Record<YieldTier, { label: string; cls: string }> = {
  must: { label: 'Must-know', cls: 'border-sev-crit/40 bg-sev-crit/10 text-sev-crit' },
  high: { label: 'High-yield', cls: 'border-sev-warn/40 bg-sev-warn/10 text-sev-warn' },
  core: { label: 'Core', cls: 'border-primary/40 bg-primary/10 text-primary' },
}

export const SEVERITY_META: Record<Severity, { label: string; cls: string; dot: string }> = {
  frequent: { label: 'Frequently missed', cls: 'border-amber-400/40 bg-amber-400/10 text-amber-500', dot: 'bg-amber-400' },
  tricky: { label: 'Tricky concept', cls: 'border-violet-400/40 bg-violet-400/10 text-violet-400', dot: 'bg-violet-400' },
  deadly: { label: 'Costly in exam', cls: 'border-rose-400/40 bg-rose-400/10 text-rose-400', dot: 'bg-rose-400' },
}
