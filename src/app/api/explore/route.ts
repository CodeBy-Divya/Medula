import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { asTrimmed } from '@/lib/http'
import { searchRegistry } from '@/lib/institutions-registry'

export const dynamic = 'force-dynamic'

// ─── EXPLORE MEDICINE — one query, four source legs, always honest ───────────
// (a) LEARN        MEDULA curriculum graph (local, offline, ours)
// (b) RESEARCH     real paper metadata via Europe PMC (EBI) public REST API
// (c) INSTITUTIONS the verified institutional source registry
// (d) WEB          live web search → classified into courses/guidelines/resources
//
// Legs run in parallel with Promise.allSettled: one failing leg degrades to an
// empty group + a note, never a 500. We index metadata only, always link to
// the original source, and the optional AI summary is grounded ONLY in the
// retrieved sources and labelled as AI output.

// ── shapes ───────────────────────────────────────────────────────────────────
interface LearnItem {
  type: 'topic' | 'concept'
  id: string
  title: string
  subtitle: string
  subjectColor: string
}

interface ResearchItem {
  pmid: string
  title: string
  authors: string
  journal: string
  pubYear: string
  isOpenAccess: boolean
  url: string
}

interface WebItem {
  title: string
  url: string
  snippet: string
  host: string
  date: string
  retrievedAt: string
}

interface WebGroups {
  courses: WebItem[]
  guidelines: WebItem[]
  resources: WebItem[]
}

interface Summary {
  text: string
  note: string
}

// ── small helpers ────────────────────────────────────────────────────────────
function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// ── leg (a): local curriculum graph ──────────────────────────────────────────
// SQLite `contains` is case-sensitive for LIKE, so we fetch the (small) local
// graph once and match in JS with case-insensitive includes — simple, reliable.
async function legLearn(q: string): Promise<{ data: LearnItem[]; notes: string[] }> {
  try {
    const lower = q.toLowerCase()
    const [topics, concepts] = await Promise.all([
      db.topic.findMany({ include: { subject: true } }),
      db.concept.findMany({ include: { topic: { include: { subject: true } } } }),
    ])

    const topicHits: LearnItem[] = topics
      .filter((t) => t.name.toLowerCase().includes(lower) || t.subject.name.toLowerCase().includes(lower))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 4)
      .map((t) => ({
        type: 'topic' as const,
        id: t.id,
        title: t.name,
        subtitle: `${t.subject.name}${t.system ? ` · ${t.system}` : ''}`,
        subjectColor: t.subject.color,
      }))

    const conceptHits: LearnItem[] = concepts
      .filter((c) => c.name.toLowerCase().includes(lower) || c.summary.toLowerCase().includes(lower))
      .slice(0, 4)
      .map((c) => ({
        type: 'concept' as const,
        id: c.id,
        title: c.name,
        subtitle: `${c.topic.subject.name} · ${c.topic.name}`,
        subjectColor: c.topic.subject.color,
      }))

    return { data: [...topicHits, ...conceptHits], notes: [] }
  } catch {
    return { data: [], notes: ['Local curriculum search failed — the LEARN group is empty this time.'] }
  }
}

// ── leg (b): real papers via Europe PMC (EBI) public REST ────────────────────
// Local helper on purpose: this route owns only this tiny fetch, and the
// Research Hub module (src/lib/europepmc.ts) belongs to another owner.
interface EuropePmcResult {
  id?: string
  source?: string
  pmid?: string
  doi?: string
  title?: string
  authorString?: string
  pubYear?: string
  isOpenAccess?: string
  journalInfo?: { journal?: { title?: string } }
  journal?: string
}

async function europePmcSearch(q: string): Promise<ResearchItem[]> {
  const url =
    'https://www.ebi.ac.uk/europepmc/webservices/rest/search' +
    `?query=${encodeURIComponent(`${q} AND HAS_ABSTRACT:Y`)}&format=json&pageSize=3&resultType=core`

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`Europe PMC responded ${res.status}`)
  const data = (await res.json()) as { resultList?: { result?: EuropePmcResult[] } }
  const results = data.resultList?.result ?? []

  return results
    .filter((r) => r.title)
    .slice(0, 3)
    .map((r) => {
      const pmid = r.pmid || r.id || 'UNKNOWN'
      const prefix = r.source || (r.pmid ? 'MED' : 'PMC')
      return {
        pmid,
        title: stripHtml(r.title ?? ''),
        authors: (r.authorString ?? '').trim() || 'Authors not listed',
        journal: r.journalInfo?.journal?.title ?? r.journal ?? 'Journal not listed',
        pubYear: r.pubYear ?? '',
        isOpenAccess: r.isOpenAccess === 'Y',
        url: r.doi ? `https://doi.org/${r.doi}` : `https://europepmc.org/article/${prefix}/${pmid}`,
      }
    })
}

async function legResearch(q: string): Promise<{ data: ResearchItem[]; notes: string[] }> {
  try {
    return { data: await europePmcSearch(q), notes: [] }
  } catch {
    return { data: [], notes: ['Europe PMC did not respond in time — the RESEARCH group is empty this time.'] }
  }
}

// ── leg (c): institutional source registry ───────────────────────────────────
async function legInstitutions(q: string): Promise<{ data: ReturnType<typeof searchRegistry>; notes: string[] }> {
  try {
    return { data: searchRegistry(q).slice(0, 6), notes: [] }
  } catch {
    return { data: [], notes: ['Source registry lookup failed — the INSTITUTIONS group is empty this time.'] }
  }
}

// ── leg (d): live web search → classified discovery ──────────────────────────
const GUIDELINE_HOSTS = ['who.int', 'mohfw.gov.in', 'nmc.org.in', 'icmr.gov.in']
const COURSE_HOSTS = ['edx.org', 'coursera.org', 'ocw.mit.edu', 'mayoclinic.org', 'hopkinsmedicine.org', 'harvard.edu', 'stanford.edu']

function classifyWeb(host: string, title: string): keyof WebGroups {
  const h = host.toLowerCase()
  const t = title.toLowerCase()
  if (GUIDELINE_HOSTS.some((d) => h.includes(d)) || t.includes('guideline')) return 'guidelines'
  if (COURSE_HOSTS.some((d) => h.includes(d)) || t.includes('course')) return 'courses'
  return 'resources'
}

interface WebSearchResult {
  url?: string
  name?: string
  snippet?: string
  host_name?: string
  date?: string
}

async function legWeb(q: string): Promise<{ data: WebGroups; notes: string[] }> {
  const empty: WebGroups = { courses: [], guidelines: [], resources: [] }
  try {
    const { default: ZAI } = await import('z-ai-web-dev-sdk')
    const zai = await ZAI.create()
    const raw = await zai.functions.invoke('web_search', { query: `${q} medicine`, num: 10 })
    const results: WebSearchResult[] = Array.isArray(raw) ? raw : []

    const groups: WebGroups = { courses: [], guidelines: [], resources: [] }
    const now = new Date().toISOString()
    for (const r of results) {
      const url = r.url?.trim()
      const title = (r.name ?? '').trim()
      if (!url || !title) continue
      let host = r.host_name ?? ''
      if (!host) {
        try { host = new URL(url).hostname } catch { host = '' }
      }
      const item: WebItem = {
        title,
        url,
        snippet: (r.snippet ?? '').trim(),
        host,
        date: r.date ?? '',
        retrievedAt: now,
      }
      groups[classifyWeb(host, title)].push(item)
    }
    return { data: groups, notes: [] }
  } catch {
    return {
      data: empty,
      notes: ['Live web search was unavailable — the ON THE WEB group is empty this time.'],
    }
  }
}

// ── grounded AI summary (locked to retrieved sources) ────────────────────────
async function buildSummary(q: string, sourceLines: string[]): Promise<{ summary: Summary | null; notes: string[] }> {
  if (sourceLines.length < 3) return { summary: null, notes: [] }
  try {
    const { default: ZAI } = await import('z-ai-web-dev-sdk')
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            "You are MEDULA's medical discovery assistant. Using ONLY the numbered sources provided, " +
            'give a 2-3 sentence short answer to the query, then one bullet "What to learn next". ' +
            'Cite sources as [1], [2]. If the sources do not answer the question, say exactly that. ' +
            'Do not add outside medical facts.',
        },
        {
          role: 'user',
          content: `Query: ${q}\n\nSources:\n${sourceLines.join('\n')}`,
        },
      ],
      temperature: 0.3,
    })
    const text = completion.choices[0]?.message?.content?.trim()
    if (!text) return { summary: null, notes: ['AI summary returned empty — hidden for this query.'] }
    return {
      summary: {
        text,
        note: 'AI summary grounded in the sources above — verify at the original links.',
      },
      notes: [],
    }
  } catch {
    return { summary: null, notes: ['AI summary was unavailable — results are shown unsummarised.'] }
  }
}

// ── the route ────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const q = asTrimmed(req.nextUrl.searchParams.get('q'), 120)
    if (!q || q.length < 2 || q.length > 120) {
      return NextResponse.json(
        { error: 'Provide a search query q of 2..120 characters.' },
        { status: 400 },
      )
    }

    const [learn, research, institutions, web] = await Promise.allSettled([
      legLearn(q),
      legResearch(q),
      legInstitutions(q),
      legWeb(q),
    ])

    const unwrap = <T,>(r: PromiseSettledResult<{ data: T; notes: string[] }>, fallback: T, leg: string) =>
      r.status === 'fulfilled'
        ? { data: r.value.data, notes: r.value.notes }
        : { data: fallback, notes: [`${leg} leg failed unexpectedly — it was skipped for this query.`] }

    const learnRes = unwrap(learn, [] as LearnItem[], 'LEARN')
    const researchRes = unwrap(research, [] as ResearchItem[], 'RESEARCH')
    const instRes = unwrap(institutions, [], 'INSTITUTIONS')
    const webRes = unwrap(web, { courses: [], guidelines: [], resources: [] } as WebGroups, 'WEB')

    const notes = [...learnRes.notes, ...researchRes.notes, ...instRes.notes, ...webRes.notes]

    // Grounded AI summary only when there is something real to ground on.
    const webItems: WebItem[] = [
      ...webRes.data.guidelines,
      ...webRes.data.courses,
      ...webRes.data.resources,
    ]
    const totalResults =
      learnRes.data.length + researchRes.data.length + instRes.data.length + webItems.length

    let summary: Summary | null = null
    if (totalResults >= 3) {
      const sourceLines: string[] = []
      learnRes.data.forEach((l) =>
        sourceLines.push(`[${sourceLines.length + 1}] (MEDULA curriculum — ${l.type}) ${l.title} — ${l.subtitle}`),
      )
      researchRes.data.forEach((r) =>
        sourceLines.push(`[${sourceLines.length + 1}] (Europe PMC paper) ${r.title} — ${r.journal} ${r.pubYear} — ${r.url}`),
      )
      instRes.data.forEach((inst) =>
        sourceLines.push(`[${sourceLines.length + 1}] (official source) ${inst.name} — ${inst.officialUrl}`),
      )
      webItems.slice(0, 10).forEach((w) =>
        sourceLines.push(`[${sourceLines.length + 1}] (web — ${w.host}) ${w.title} — ${stripHtml(w.snippet).slice(0, 220)} — ${w.url}`),
      )
      const built = await buildSummary(q, sourceLines.slice(0, 18))
      summary = built.summary
      notes.push(...built.notes)
    }

    return NextResponse.json({
      query: q,
      groups: {
        learn: learnRes.data,
        research: researchRes.data,
        institutions: instRes.data,
        web: webRes.data,
      },
      summary,
      provenance: {
        retrievedAt: new Date().toISOString(),
        sources: ['MEDULA curriculum graph (local)', 'Europe PMC (EBI)', 'Live web search'],
      },
      notes,
    })
  } catch (err) {
    console.error('Explore error:', err)
    return NextResponse.json({ error: 'Explore failed unexpectedly. Please retry.' }, { status: 500 })
  }
}
