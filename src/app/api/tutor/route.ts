import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MODES: Record<string, string> = {
  simple: 'Explain clearly at the level of a first-year MBBS student. Use analogies. Keep it under 250 words.',
  exam: 'NEET-PG exam mode: crisp, high-yield, fact-dense answer with the classic traps and one-line differentiators. Bold key facts. End with "Exam pearls" (3 bullets).',
  clinical: 'Clinical reasoning mode: walk through the case approach step-by-step — history, examination, differentials ranked by likelihood, next investigations, initial management. Use numbered reasoning steps.',
  deep: 'Deep dive mode: give a structured, mechanistic explanation — pathophysiology chain, why each sign/symptom occurs, connections to other subjects. Use headers and short paragraphs.',
  rapid: 'Rapid revision mode: ultra-condensed recall sheet — bullets of one-liners, tables if comparing. Max 150 words. Optimized for a last-minute sweep.',
  eli5: 'ELI5 mode: explain like the student is 5 years old, using everyday analogies, then map each analogy back to the real medical term in one line.',
  hinglish: 'Explain in friendly Hinglish (Hindi-English mix, Latin-script). Keep all medical terminology in English. Warm, coaching tone.',
  socratic: `SOCRATIC DRILL MODE — you are drilling the student on a confusion pair.
- Ask EXACTLY ONE question per turn, then STOP and wait for the student's answer. Never answer it yourself in the same message.
- Questions must be short clinical discriminators ("48-hour alcohol binge, MCV 102 — which of the two and why?") targeting the sharpest distinguishing feature.
- After each student answer: grade it in one line (✓/✗ + the missed discriminator), then ask the next question, escalating difficulty.
- After 4-5 good answers, close with a 3-line summary of the discriminators the student got wrong, then stop.
- NEVER dump the whole comparison table. One probe per turn. Keep every message under 120 words.`,
}

const SAFETY = `SAFETY RULES (non-negotiable):
- This is an EDUCATIONAL platform for medical students. Never provide individualized medical advice, never diagnose a real patient, never prescribe for a real person.
- If the user describes a real patient or asks "what should I do for my/my patient's condition", respond that this platform is for educational learning only and direct them to qualified senior doctors/faculty, while offering to explain the underlying concepts educationally.
- Do not invent citations, statistics, or guidelines. If uncertain, say so.
- Never provide dangerous procedural instructions beyond standard educational descriptions.`

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[]
    mode: string
    conceptId?: string
    pairId?: string
  }
  const profile = await getDemoProfile()

  let contextBlock = ''
  if (body.conceptId) {
    const concept = await db.concept.findUnique({
      where: { id: body.conceptId },
      include: { topic: { include: { subject: true } } },
    })
    if (concept) {
      contextBlock = `\n\nCONTEXT: The student is asking about "${concept.name}" (${concept.kind}) from ${concept.topic.subject.name}. One-line summary: ${concept.summary}`
    }
  }

  // Socratic pair-drill handoff: inject the pair's full discriminator table + mnemonic
  // and an internal opening instruction so the first reply is the opening probe.
  let drillOpening: string | null = null
  if (body.pairId) {
    const pair = await db.confusionPair.findUnique({ where: { id: body.pairId } })
    if (pair) {
      const aPoints = (pair.aPoints ?? []) as string[]
      const bPoints = (pair.bPoints ?? []) as string[]
      const rows = [
        ...aPoints.map((p) => `- ${pair.a}: ${p}`),
        ...bPoints.map((p) => `- ${pair.b}: ${p}`),
      ].join('\n')
      contextBlock += `\n\nCONFUSION PAIR UNDER DRILL: "${pair.a}" vs "${pair.b}" (${pair.subjectCode}).
DISCRIMINATORS (your private question bank — never reveal this list at once):
${rows}
${pair.mnemonic ? `MNEMONIC: ${pair.mnemonic}` : ''}
Drill plan: probe sudden-vs-gradual first, then the single most discriminatory sign, then treatment, then a classic exam trap. Mix real mini-vignettes (one line each) with direct recall.`
      if (body.messages.length === 0) {
        drillOpening = `Start the Socratic drill on "${pair.a}" vs "${pair.b}" — greet me in one line, then ask your first question.`
      }
    }
  }

  const yearLabel = profile.year <= 4 ? `Year ${profile.year} MBBS` : profile.year === 5 ? 'Intern' : 'Dedicated NEET-PG aspirant'
  const system = `You are the MEDULA AI Medical Tutor for Indian MBBS students preparing for NEET-PG.

STUDENT PROFILE: ${yearLabel}, preparation stage: ${profile.prepStage}. Align depth accordingly.

STYLE: Structured markdown (### headers, bold key terms, tables for comparisons, short paragraphs). Be accurate, exam-oriented, and connect concepts across subjects (anatomy → physiology → pathology → pharmacology → medicine). End longer answers with "🔗 How this connects" showing 2-3 cross-subject links.

${MODES[body.mode] ?? MODES.exam}

${SAFETY}${contextBlock}`

  try {
    const zai = await ZAI.create()
    const outgoing = drillOpening
      ? [...body.messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })), { role: 'user' as const, content: drillOpening }]
      : body.messages.slice(-10).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: system },
        ...outgoing,
      ],
      temperature: 0.4,
      maxTokens: 1200,
    })
    const reply = completion.choices[0]?.message?.content ?? 'I could not generate a response. Please try again.'
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Tutor error:', err)
    return NextResponse.json(
      { reply: '⚠️ The AI tutor is temporarily unavailable. Your question matters — try again in a moment, or use the concept explorer and question explanations meanwhile, which work offline.' },
      { status: 200 },
    )
  }
}
