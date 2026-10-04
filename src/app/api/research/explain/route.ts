import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { readJson, asTrimmed } from '@/lib/http'
import { FEATURES } from '@/lib/feature-flags'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// ─── POST /api/research/explain ─────────────────────────────────────────────
// RAG-lite explainer: the model may ONLY use the title + abstract posted to it.
// The system prompt is strictly anti-hallucination — anything not in the
// abstract must be answered with "Not stated in the abstract." The output is
// always labelled as AI interpretation; the full paper remains the truth.

const SYSTEM_PROMPT = `You are a careful medical research explainer for Indian medical students. You may ONLY use the title and abstract provided. NEVER invent findings, numbers, drugs or conclusions that are not in the text. If the abstract does not contain the information, write 'Not stated in the abstract.' Answer in markdown with these exact sections: **In one sentence**, **For an MBBS student** (3-5 sentences), **Key findings** (bullets quoting the abstract's numbers only), **Limitations** (only limitations stated or clearly implied; otherwise say none stated), **Three study questions** (numbered). End with the exact line: '⚠️ AI interpretation of the abstract only — verify against the full paper at the original source.'`

export async function POST(req: NextRequest) {
  if (!FEATURES.ENABLE_PAPER_EXPLAIN) {
    return NextResponse.json({ error: 'FEATURE_DISABLED' }, { status: 403 })
  }

  try {
    const body = await readJson<{ title?: unknown; abstract?: unknown }>(req)
    if (!body) {
      return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 })
    }

    const title = asTrimmed(body.title, 300)
    const abstract = asTrimmed(body.abstract, 12_000)
    if (!title || title.length < 3 || !abstract || abstract.length < 40) {
      return NextResponse.json(
        {
          error: 'INVALID_BODY',
          hint: 'title (3–300 chars) and abstract (40–12000 chars) are required.',
        },
        { status: 400 },
      )
    }

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `TITLE: ${title}\n\nABSTRACT: ${abstract}` },
      ],
      temperature: 0.3,
      maxTokens: 1500,
    })
    const explanation = completion.choices[0]?.message?.content?.trim() ?? ''
    if (!explanation) {
      return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 502 })
    }

    return NextResponse.json({ explanation, generatedAt: new Date().toISOString() })
  } catch (err) {
    console.error('[api/research/explain] failed:', err)
    return NextResponse.json({ error: 'AI_UNAVAILABLE' }, { status: 502 })
  }
}
