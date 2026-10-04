// ─── Europe PMC (EBI) client — server-only ──────────────────────────────────
// SOURCE-FIRST architecture: every paper rendered in MEDULA comes from this
// real, public scholarly API (https://europepmc.org, operated by EMBL-EBI).
// We normalize EXACTLY what the API returns — unknown fields stay empty/null,
// nothing is inferred, invented or "filled in".

const BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'
const TIMEOUT_MS = 8_000
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes, keyed by full URL

export interface NormalizedPaper {
  pmid: string
  pmcid: string | null
  doi: string | null
  title: string
  authors: string
  journal: string
  pubYear: string // '' when the API did not provide one — never guessed
  pubDate: string // firstPublicationDate 'YYYY-MM-DD' or '' — never guessed
  abstractText: string // HTML stripped to plain text
  pubType: string | null
  isOpenAccess: boolean
  citedByCount: number | null
  url: string // canonical link to the ORIGINAL source
  sourceApi: 'EuropePMC'
  retrievedAt: string // ISO timestamp of when we fetched this from upstream
}

/** Typed upstream failure so routes can map it to an honest 5xx. */
export class EuropePmcError extends Error {
  kind: 'UPSTREAM' | 'TIMEOUT'
  constructor(kind: 'UPSTREAM' | 'TIMEOUT', message: string) {
    super(message)
    this.name = 'EuropePmcError'
    this.kind = kind
  }
}

// ─── HTML stripping (JATS abstracts carry <h4>, <p>, <b>, <i>, <title>…) ────

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&nbsp;': ' ',
  '&ndash;': '–',
  '&mdash;': '—',
  '&minus;': '−',
  '&alpha;': 'α',
  '&beta;': 'β',
  '&gamma;': 'γ',
  '&delta;': 'δ',
  '&micro;': 'μ',
  '&deg;': '°',
}

/** Strip JATS/HTML markup from an abstract into plain text. */
export function stripHtml(input: string): string {
  let out = input.replace(/<[^>]*>/g, ' ')
  for (const [ent, ch] of Object.entries(ENTITIES)) out = out.replaceAll(ent, ch)
  // numeric entities (e.g. &#x2013;) — decode safe printable range only
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_m, hex: string) => {
    const code = parseInt(hex, 16)
    return code > 31 && code < 0xfffd ? String.fromCodePoint(code) : ' '
  })
  return out.replace(/\s+/g, ' ').trim()
}

// ─── In-memory TTL cache (per server instance) ──────────────────────────────

const cache = new Map<string, { at: number; data: unknown }>()

function cacheGet<T>(key: string): T | null {
  const hit = cache.get(key)
  if (!hit) return null
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return hit.data as T
}

function cacheSet(key: string, data: unknown): void {
  cache.set(key, { at: Date.now(), data })
  // soft bound: drop oldest entries if the cache grows unbounded
  if (cache.size > 200) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at).slice(0, 50)
    for (const [k] of oldest) cache.delete(k)
  }
}

// ─── Low-level fetch with hard timeout ──────────────────────────────────────

async function fetchJson(url: string): Promise<unknown> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new EuropePmcError('UPSTREAM', `Europe PMC responded HTTP ${res.status}`)
    return (await res.json()) as unknown
  } catch (err) {
    if (err instanceof EuropePmcError) throw err
    if (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')) {
      throw new EuropePmcError('TIMEOUT', `Europe PMC did not respond within ${TIMEOUT_MS / 1000}s`)
    }
    throw new EuropePmcError('UPSTREAM', err instanceof Error ? err.message : 'Europe PMC unreachable')
  } finally {
    clearTimeout(timer)
  }
}

// ─── Normalizer (built against the live API shape, verified 2025) ───────────
// search?resultType=core returns resultList.result[] with:
//   id, source ('MED'…), pmid?, pmcid?, doi?, title, authorString, pubYear,
//   firstPublicationDate?, journalInfo.journal.title, pubTypeList.pubType[],
//   isOpenAccess ('Y'|'N'), citedByCount (number), abstractText (JATS HTML)

interface RawResult {
  id?: unknown
  source?: unknown
  pmid?: unknown
  pmcid?: unknown
  doi?: unknown
  title?: unknown
  authorString?: unknown
  pubYear?: unknown
  firstPublicationDate?: unknown
  abstractText?: unknown
  pubType?: unknown
  pubTypeList?: { pubType?: unknown } | null
  journalInfo?: { journal?: { title?: unknown } | null; yearOfPublication?: unknown } | null
  isOpenAccess?: unknown
  citedByCount?: unknown
}

function asString(v: unknown, max = 10_000): string {
  return typeof v === 'string' ? v.slice(0, max).trim() : ''
}

function normalize(raw: RawResult, retrievedAt: string): NormalizedPaper | null {
  const source = asString(raw.source, 20) || 'MED'
  const pmid = asString(raw.pmid, 20) || asString(raw.id, 20)
  const title = asString(raw.title, 2_000).replace(/\s+/g, ' ')
  if (!pmid || !title) return null // unusable record — skip, never fabricate a stand-in

  const doi = asString(raw.doi, 200) || null
  const pmcid = asString(raw.pmcid, 20) || null

  const types = raw.pubTypeList?.pubType
  const pubType = Array.isArray(types)
    ? types.filter((t) => typeof t === 'string').map(String).join(', ').slice(0, 300) || null
    : asString(raw.pubType, 300) || null

  const pubYear =
    asString(raw.pubYear, 10) ||
    (typeof raw.journalInfo?.yearOfPublication === 'number'
      ? String(raw.journalInfo.yearOfPublication)
      : '')

  const journal = asString(raw.journalInfo?.journal?.title, 300)

  const abstractText = raw.abstractText ? stripHtml(asString(raw.abstractText, 40_000)).slice(0, 8_000) : ''

  // canonical URL to the original source — DOI preferred, else Europe PMC's
  // source-scoped permalink (MED/{pmid} or e.g. PPR/{preprint-id})
  const url = doi ? `https://doi.org/${doi}` : `https://europepmc.org/article/${source}/${pmid}`

  return {
    pmid,
    pmcid,
    doi,
    title,
    authors: asString(raw.authorString, 4_000),
    journal,
    pubYear,
    pubDate: asString(raw.firstPublicationDate, 10), // '' = unknown, honestly
    abstractText,
    pubType,
    isOpenAccess: raw.isOpenAccess === 'Y',
    citedByCount: typeof raw.citedByCount === 'number' ? raw.citedByCount : null,
    url,
    sourceApi: 'EuropePMC',
    retrievedAt,
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export type SearchSort = 'relevance' | 'date' | 'cited'

const SORT_PARAM: Record<SearchSort, string | null> = {
  relevance: null, // default BM25 relevance — no sort param
  date: 'P_PDATE_D desc',
  cited: 'CITED desc',
}

export interface SearchOptions {
  pageSize?: number
  sort?: SearchSort
  /** raw Europe PMC filter clauses appended with AND, e.g. '(OPEN_ACCESS:Y)' */
  extraFilters?: string[]
  /** Europe PMC `page` param — note: upstream IGNORES it; use `fetchOffset` below */
  page?: never
}

export interface SearchPage {
  hitCount: number
  papers: NormalizedPaper[]
}

/**
 * Search Europe PMC. NOTE on pagination: upstream ignores its `page` param
 * (verified live — page=1 and page=2 return identical ids), so callers needing
 * page N should request `pageSize = N * 12` (≤ 1000, the API cap) and slice —
 * see searchEuropePmcPaged().
 */
export async function searchEuropePmc(
  query: string,
  opts: SearchOptions = {},
): Promise<SearchPage> {
  const pageSize = Math.min(Math.max(opts.pageSize ?? 12, 1), 1000)
  const params = new URLSearchParams({
    query,
    format: 'json',
    pageSize: String(pageSize),
    resultType: 'core',
  })
  const sortParam = opts.sort ? SORT_PARAM[opts.sort] : null
  if (sortParam) params.set('sort', sortParam)
  for (const f of opts.extraFilters ?? []) {
    if (f) params.set('query', `${params.get('query')} AND ${f}`)
  }
  const url = `${BASE}?${params.toString()}`

  const cached = cacheGet<SearchPage>(url)
  if (cached) return cached

  const data = (await fetchJson(url)) as {
    hitCount?: unknown
    resultList?: { result?: RawResult[] | null } | null
  } | null

  const hitCount = typeof data?.hitCount === 'number' ? data.hitCount : 0
  const retrievedAt = new Date().toISOString()
  const papers: NormalizedPaper[] = []
  const seen = new Set<string>()
  for (const raw of data?.resultList?.result ?? []) {
    const paper = normalize(raw, retrievedAt)
    if (!paper || seen.has(paper.pmid)) continue
    seen.add(paper.pmid)
    papers.push(paper)
  }

  const page: SearchPage = { hitCount, papers }
  cacheSet(url, page)
  return page
}

/**
 * Paged search that actually works: fetches `page × pageSize` records
 * (≤ 1000 upstream cap) and slices the requested window. hitCount stays the
 * true upstream total so the UI never over-reports availability.
 */
export async function searchEuropePmcPaged(
  query: string,
  opts: { pageSize?: number; page?: number; sort?: SearchSort; extraFilters?: string[] } = {},
): Promise<SearchPage> {
  const perPage = Math.min(Math.max(opts.pageSize ?? 12, 1), 100)
  const page = Math.min(Math.max(opts.page ?? 1, 1), 50)
  const fetchSize = Math.min(page * perPage, 1000)
  const all = await searchEuropePmc(query, {
    pageSize: fetchSize,
    sort: opts.sort,
    extraFilters: opts.extraFilters,
  })
  const start = (page - 1) * perPage
  return {
    hitCount: all.hitCount,
    papers: all.papers.slice(start, start + perPage),
  }
}

/** Fetch a single MED record by PMID. Returns null when the id is unknown. */
export async function fetchByPmid(pmid: string): Promise<NormalizedPaper | null> {
  const clean = pmid.trim()
  if (!/^\d{1,12}$/.test(clean)) return null
  const params = new URLSearchParams({
    query: `EXT_ID:${clean} AND SRC:MED`,
    format: 'json',
    pageSize: '1',
    resultType: 'core',
  })
  const url = `${BASE}?${params.toString()}`

  const cached = cacheGet<SearchPage>(url)
  if (cached) return cached.papers[0] ?? null

  const data = (await fetchJson(url)) as {
    hitCount?: unknown
    resultList?: { result?: RawResult[] | null } | null
  }
  const pageData: SearchPage = {
    hitCount: typeof data?.hitCount === 'number' ? data.hitCount : 0,
    papers: [],
  }
  const retrievedAt = new Date().toISOString()
  for (const raw of data?.resultList?.result ?? []) {
    const paper = normalize(raw, retrievedAt)
    if (paper) pageData.papers.push(paper)
  }
  cacheSet(url, pageData)
  return pageData.papers[0] ?? null
}
