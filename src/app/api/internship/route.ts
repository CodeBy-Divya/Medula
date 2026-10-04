import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// ─── INTERNSHIP MODE (spec §44) ───
// Rotation-based year plan for intern profiles (year 5), built on the
// NMC CRMI standard internship rotation structure (12 months / 10 postings).
// Clinical duties reflect typical Indian medical-college ward postings; the
// NEET-PG hooks tie each posting to MEDOS study surfaces.

export interface InternshipRotation {
  id: string
  name: string
  emoji: string
  days: number
  monthsLabel: string
  subjectCode: string | null
  subjectName: string
  duties: string[]
  neetTip: string
  logbookHint: string
  questionCount: number
}

export interface InternshipBlock {
  label: string
  minutes: number
  kind: 'clinical' | 'recall' | 'questions' | 'revision' | 'notes' | 'rest'
}

export interface InternshipPayload {
  active: boolean // profile is in the internship year
  rotations: InternshipRotation[]
  weekTemplate: { weekday: InternshipBlock[]; weekend: InternshipBlock[] }
  totals: { postings: number; months: number; studyHoursPerWeek: number; questionsInScope: number }
  sourceNote: string
}

// NMC CRMI rotation structure — 12-month rotating internship (Cr-12 of the
// Graduate Medical Education Regulations). Total = 12 months exactly.
const ROTATIONS: Omit<InternshipRotation, 'questionCount' | 'subjectName'>[] = [
  {
    id: 'medicine', name: 'General Medicine', emoji: '🩺', days: 60, monthsLabel: '2 months',
    subjectCode: 'medicine',
    duties: ['Ward rounds & case files', 'Emergency calls with the resident', 'Bedside procedures under supervision', 'Night duty & on-call'],
    neetTip: 'The highest-weight NEET-PG subject — harvest every admission as a vignette. End-of-round one-liners are question stems in disguise.',
    logbookHint: 'Log 3 de-identified cases per week (history → findings → management).',
  },
  {
    id: 'surgery', name: 'General Surgery', emoji: '🚑', days: 60, monthsLabel: '2 months (incl. Anaesthesia)',
    subjectCode: 'surgery',
    duties: ['Pre-op assessment & consent', 'Assisting in theatre', 'Dressings, suturing & catheters', 'Post-op rounds'],
    neetTip: 'Surgery MCQs cluster around trauma, hernia and GI-bleed algorithms — the exact calls you make in the ward.',
    logbookHint: 'Log assisted procedures + one anaesthesia exposure per week.',
  },
  {
    id: 'obgy', name: 'Obstetrics & Gynaecology', emoji: '🤰', days: 60, monthsLabel: '2 months (incl. Family Welfare)',
    subjectCode: 'obgy',
    duties: ['Labour room postings', 'Antenatal & immunisation clinics', 'Assisting deliveries & LSCS', 'Family-planning counselling'],
    neetTip: 'Partograph decisions, ANC schedule and the PPH ladder are perennially repeated — write them on your ward cards.',
    logbookHint: 'Record deliveries witnessed/assisted.',
  },
  {
    id: 'cm', name: 'Community Medicine', emoji: '🌍', days: 60, monthsLabel: '2 months (incl. UHC)',
    subjectCode: 'cm',
    duties: ['Urban & rural health centres', 'Field visits & surveys', 'Immunisation sessions', 'Health camps & surveillance'],
    neetTip: 'Epidemiology & biostatistics questions are pure formula marks — do them on clinic downtime with flashcards.',
    logbookHint: 'Log field visits, outreach activity and one epidemiological exercise.',
  },
  {
    id: 'peds', name: 'Paediatrics', emoji: '👶', days: 30, monthsLabel: '1 month',
    subjectCode: 'peds',
    duties: ['Paediatric ward & OPD', 'Growth & development assessment', 'Immunisation schedule', 'NICU observation'],
    neetTip: 'Milestone charts, WHO hydration plans and congenital-syndrome spotting are the tested core.',
    logbookHint: 'Log well-baby assessments and any resuscitation observed.',
  },
  {
    id: 'orth', name: 'Orthopaedics', emoji: '🦿', days: 30, monthsLabel: '1 month (incl. PMR)',
    subjectCode: 'orth',
    duties: ['Fracture clinic & plaster room', 'Trauma assisting', 'Reduction & splinting basics', 'PMR exposure'],
    neetTip: 'Nerve-injury pairing with fractures is a classic — link each fracture to its nerve via Doubt Search.',
    logbookHint: 'Log casts applied and reductions assisted.',
  },
  {
    id: 'casualty', name: 'Casualty / Emergency', emoji: '⚡', days: 15, monthsLabel: '15 days',
    subjectCode: 'anes',
    duties: ['Triage & first response', 'Emergency drugs & airway basics', 'Suturing lacerations', 'BLS/ACLS application'],
    neetTip: 'First-line-drug questions (poisoning, anaphylaxis, arrhythmia) come straight from casualty protocols.',
    logbookHint: 'Log emergencies handled with the stepwise protocol you followed.',
  },
  {
    id: 'ent', name: 'ENT', emoji: '👂', days: 15, monthsLabel: '15 days',
    subjectCode: 'ent',
    duties: ['ENT OPD procedures', 'Ear syringing & nasal packing', 'Assisting tonsillectomy/FESS', 'Audiometry basics'],
    neetTip: 'The epistaxis ladder, otitis media sequences and cranial-nerve palsies are compact, high-yield clusters.',
    logbookHint: 'Log OPD procedures and assisted surgeries.',
  },
  {
    id: 'opht', name: 'Ophthalmology', emoji: '👁️', days: 15, monthsLabel: '15 days',
    subjectCode: 'opht',
    duties: ['Refraction & slit lamp', 'Cataract surgery assisting', 'Eye camps', 'Fundus examination'],
    neetTip: 'The red-eye triage table and glaucoma drugs are worth a dedicated flashcard deck before the posting ends.',
    logbookHint: 'Log refractions done and surgeries assisted.',
  },
  {
    id: 'elective', name: 'Elective Posting', emoji: '🌟', days: 15, monthsLabel: '15 days',
    subjectCode: null,
    duties: ['Chosen superspecialty exposure', 'Mini-project or audit', 'Departmental teaching', 'Career shadowing'],
    neetTip: 'Pick what you may pursue for PG — the vocabulary you learn here pays off in counselling interviews later.',
    logbookHint: 'Log the audit topic and key learnings.',
  },
]

// Daily template: fixed ward-hours + study blocks derived from profile hours.
function buildBlocks(wardMinutes: number, studyMinutes: number, weekend: boolean): InternshipBlock[] {
  const blocks: InternshipBlock[] = []
  if (!weekend && wardMinutes > 0) {
    blocks.push({ label: 'Ward rounds & case files', minutes: Math.round(wardMinutes * 0.55), kind: 'clinical' })
    blocks.push({ label: 'OPD / procedures / notes', minutes: Math.round(wardMinutes * 0.45), kind: 'clinical' })
  }
  blocks.push({ label: 'Morning recall — flashcards (memory fades overnight)', minutes: 20, kind: 'recall' })
  const questions = Math.max(30, Math.round(studyMinutes * 0.45))
  const revision = Math.max(20, Math.round(studyMinutes * 0.3))
  const notes = Math.max(15, studyMinutes - questions - revision)
  blocks.push({ label: 'Question block — posting-linked MCQs', minutes: questions, kind: 'questions' })
  blocks.push({ label: 'Revision — spaced repetition due list', minutes: revision, kind: 'revision' })
  blocks.push({ label: 'Logbook write-up & next-day prep', minutes: notes, kind: 'notes' })
  blocks.push({ label: 'Sleep ≥ 7 h — recall consolidation is a clinical skill', minutes: 420, kind: 'rest' })
  return blocks
}

export async function GET() {
  const profile = await getDemoProfile()

  const [subjectRows, qCounts] = await Promise.all([
    db.subject.findMany(),
    db.question.groupBy({ by: ['subjectCode'], _count: { _all: true } }),
  ])
  const subjectMap = new Map(subjectRows.map(s => [s.id, s]))
  // Question rows store the subject CODE (e.g. "MED"); rotations use subject
  // ids ("medicine") — translate through the subject table.
  const qByCode = new Map(qCounts.map(q => [q.subjectCode, q._count._all]))

  const rotations: InternshipRotation[] = ROTATIONS.map(r => {
    const subject = r.subjectCode ? subjectMap.get(r.subjectCode) : undefined
    return {
      ...r,
      // overwrite with the DB subject code (e.g. "MED") — this is what the
      // questions API and quiz presets speak
      subjectCode: subject?.code ?? null,
      subjectName: subject?.name ?? '',
      questionCount: subject ? qByCode.get(subject.code) ?? 0 : 0,
    }
  })

  // Weekday template assumes a standard 8-hour ward day; the rest of the
  // profile's declared weekday hours go to self-study (min 45 min).
  const weekdayStudy = Math.max(45, profile.weekdayHours * 60 - 8 * 60)
  const weekendStudy = profile.weekendHours * 60
  const weekTemplate = {
    weekday: buildBlocks(480, weekdayStudy, false),
    weekend: buildBlocks(0, weekendStudy, true),
  }

  const payload: InternshipPayload = {
    active: profile.year >= 5,
    rotations,
    weekTemplate,
    totals: {
      postings: rotations.length,
      months: Math.round(rotations.reduce((a, r) => a + r.days, 0) / 30),
      studyHoursPerWeek: profile.weekdayHours * 5 + profile.weekendHours * 2,
      questionsInScope: rotations.reduce((a, r) => a + r.questionCount, 0),
    },
    sourceNote:
      'Rotation structure follows the NMC Graduate Medical Education Regulations (CRMI): a 12-month rotating internship with 2-month Medicine, Surgery, OBGY and Community Medicine postings. Exact order and electives vary by college — verify with your CRMI calendar.',
  }
  return NextResponse.json(payload)
}
