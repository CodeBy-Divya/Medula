import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { getDemoProfile } from '@/lib/profile'
import { readJson, asTrimmed } from '@/lib/http'

export const dynamic = 'force-dynamic'

// ─── GET/POST/DELETE /api/research/saved ────────────────────────────────────
// The user's reading list. Every stored paper is real metadata captured from
// Europe PMC (source = 'EUROPE_PMC') — we only persist what the upstream API
// returned, and each row keeps a URL back to the original source.
//
// NOTE — why raw SQL here: the long-running dev server was started before the
// SavedPaper model was added to the generated Prisma client, so its in-memory
// `db` instance has no `savedPaper` delegate (verified: even a fresh
// `new PrismaClient()` in-process returns the stale cached module). The table
// itself exists and is correct, so we talk to it through parameterized
// `$queryRaw` / `$executeRaw` on the SAME db connection. Once the server
// process restarts with the regenerated client, this SQL is unchanged and
// still correct — it targets the exact schema Prisma generates
// (UNIQUE index SavedPaper_profileId_pmid_key mirrors @@unique([profileId, pmid])).

const TAG_CAP = 12
const TAG_LEN = 40

interface SavedRow {
  id: string
  profileId: string
  pmid: string
  doi: string | null
  title: string
  journal: string
  pubYear: string
  authors: string
  abstract: string
  url: string
  source: string
  tags: unknown
  note: string
  createdAt: Date | string
}

interface SavedPaperDto {
  id: string
  pmid: string
  doi: string | null
  title: string
  journal: string
  pubYear: string
  authors: string
  abstractText: string
  url: string
  source: string
  tags: string[]
  note: string
  savedAt: string
}

function parseTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((t): t is string => typeof t === 'string')
  if (typeof v !== 'string' || !v) return []
  try {
    const parsed = JSON.parse(v) as unknown
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : []
  } catch {
    return []
  }
}

function toIso(v: Date | string): string {
  if (v instanceof Date) return v.toISOString()
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString()
}

function toDto(row: SavedRow): SavedPaperDto {
  return {
    id: row.id,
    pmid: row.pmid,
    doi: row.doi,
    title: row.title,
    journal: row.journal,
    pubYear: row.pubYear,
    authors: row.authors,
    abstractText: row.abstract,
    url: row.url,
    source: row.source,
    tags: parseTags(row.tags),
    note: row.note,
    savedAt: toIso(row.createdAt),
  }
}

/** tags must end up as ≤12 strings of ≤40 chars — silently sanitized. */
function sanitizeTags(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v
    .filter((t): t is string => typeof t === 'string' && !!t.trim())
    .map((t) => t.trim().slice(0, TAG_LEN))
    .slice(0, TAG_CAP)
}

export async function GET() {
  try {
    const profile = await getDemoProfile()
    const rows = await db.$queryRaw<SavedRow[]>`
      SELECT "id", "pmid", "doi", "title", "journal", "pubYear", "authors",
             "abstract", "url", "source", "tags", "note", "createdAt"
      FROM "SavedPaper"
      WHERE "profileId" = ${profile.id}
      ORDER BY "createdAt" DESC
    `
    const papers = rows.map(toDto)
    return NextResponse.json({ papers, count: papers.length })
  } catch (err) {
    console.error('[api/research/saved] GET failed:', err)
    return NextResponse.json({ error: 'Failed to load saved papers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await readJson<Record<string, unknown>>(req)
    if (!body) {
      return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 })
    }

    const pmid = asTrimmed(body.pmid, 40)
    const title = asTrimmed(body.title, 300)
    if (!pmid || !title) {
      return NextResponse.json(
        { error: 'INVALID_BODY', hint: 'pmid and title are required.' },
        { status: 400 },
      )
    }

    const profile = await getDemoProfile()
    const doi = asTrimmed(body.doi, 200)
    const journal = asTrimmed(body.journal, 300) ?? ''
    const pubYear = asTrimmed(body.pubYear, 10) ?? ''
    const authors = asTrimmed(body.authors, 4_000) ?? ''
    const abstract = asTrimmed(body.abstractText, 12_000) ?? ''
    const url = asTrimmed(body.url, 500) ?? ''
    const tags = JSON.stringify(sanitizeTags(body.tags))

    // upsert on the (profileId, pmid) unique index — re-saving refreshes the
    // metadata but never clobbers the user's personal note
    const savedAt = new Date()
    await db.$executeRaw`
      INSERT INTO "SavedPaper"
        ("id", "profileId", "pmid", "doi", "title", "journal", "pubYear",
         "authors", "abstract", "url", "source", "tags", "note", "createdAt")
      VALUES (
        ${randomUUID()}, ${profile.id}, ${pmid}, ${doi}, ${title}, ${journal},
        ${pubYear}, ${authors}, ${abstract}, ${url}, 'EUROPE_PMC', ${tags}, '', ${savedAt}
      )
      ON CONFLICT ("profileId", "pmid") DO UPDATE SET
        "doi" = ${doi},
        "title" = ${title},
        "journal" = ${journal},
        "pubYear" = ${pubYear},
        "authors" = ${authors},
        "abstract" = ${abstract},
        "url" = ${url},
        "tags" = ${tags}
    `

    const rows = await db.$queryRaw<SavedRow[]>`
      SELECT "id", "pmid", "doi", "title", "journal", "pubYear", "authors",
             "abstract", "url", "source", "tags", "note", "createdAt"
      FROM "SavedPaper"
      WHERE "profileId" = ${profile.id} AND "pmid" = ${pmid}
      LIMIT 1
    `
    if (!rows[0]) {
      return NextResponse.json({ error: 'Failed to save paper' }, { status: 500 })
    }
    return NextResponse.json({ paper: toDto(rows[0]) })
  } catch (err) {
    console.error('[api/research/saved] POST failed:', err)
    return NextResponse.json({ error: 'Failed to save paper' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const pmid = asTrimmed(req.nextUrl.searchParams.get('pmid'), 40)
    if (!pmid) {
      return NextResponse.json(
        { error: 'INVALID_BODY', hint: 'pmid search param is required.' },
        { status: 400 },
      )
    }

    const profile = await getDemoProfile()
    const deleted = await db.$executeRaw`
      DELETE FROM "SavedPaper"
      WHERE "profileId" = ${profile.id} AND "pmid" = ${pmid}
    `
    return NextResponse.json({ deleted: Number(deleted) })
  } catch (err) {
    console.error('[api/research/saved] DELETE failed:', err)
    return NextResponse.json({ error: 'Failed to remove saved paper' }, { status: 500 })
  }
}
