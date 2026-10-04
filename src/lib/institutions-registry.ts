// ─── INSTITUTIONAL SOURCE REGISTRY (source-first architecture) ───────────────
// A typed, honest, code-based discovery index of OFFICIAL medical sources.
//
// ABSOLUTE RULES this file obeys:
//   · We index METADATA ONLY (name, kind, official URL, access type) — never
//     reproduced content.
//   · `urlVerified: true` means the official domain was confirmed via a live
//     web search (z-ai `web_search`) on the date in `lastVerified`. It is a
//     domain confirmation, NOT a ranking and NOT an endorsement.
//   · Entries we could not confirm in a verification session carry
//     `urlVerified: false`, `lastVerified: null`, and a note telling the user
//     to confirm the link themselves. We never present an unverified domain
//     as verified.
//   · If a future search contradicts a recorded URL, update the URL to what
//     the search shows and note the change.

export type SourceKind = 'AIIMS' | 'GOVERNMENT' | 'DATABASE' | 'GLOBAL_UNIVERSITY' | 'SOCIETY'
export type AccessType = 'PUBLIC' | 'REGISTRATION' | 'PAID' | 'MIXED' | 'UNKNOWN'

export interface SourceRecord {
  slug: string
  name: string
  kind: SourceKind
  country: string
  officialUrl: string
  urlVerified: boolean
  lastVerified: string | null
  accessType: AccessType
  notes: string
}

// Date of the live web-search verification session that confirmed the entries
// flagged `urlVerified: true` below.
const VERIFIED_ON = '2026-10-04'

const PENDING = 'Official URL recorded but not yet re-verified — confirm at the link'

export const SOURCE_REGISTRY: SourceRecord[] = [
  // ── AIIMS network (India) ────────────────────────────────────────────────
  // Domains below marked verified were confirmed via live web search on the
  // date above. The 5 unverified entries follow the standard AIIMS subdomain
  // pattern but were NOT seen in a search result this session — they carry
  // the honest "verification pending" status.
  {
    slug: 'aiims-new-delhi',
    name: 'AIIMS New Delhi',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://www.aiims.edu',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Apex institute of the AIIMS network. Official domain aiims.edu confirmed via live web search.',
  },
  {
    slug: 'aiims-patna',
    name: 'AIIMS Patna',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimspatna.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimspatna.edu.in confirmed via live web search.',
  },
  {
    slug: 'aiims-bhopal',
    name: 'AIIMS Bhopal',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsbhopal.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsbhopal.edu.in confirmed via live web search.',
  },
  {
    slug: 'aiims-bhubaneswar',
    name: 'AIIMS Bhubaneswar',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsbhubaneswar.nic.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain confirmed via live web search — note this campus uses .nic.in, not .edu.in.',
  },
  {
    slug: 'aiims-jodhpur',
    name: 'AIIMS Jodhpur',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsjodhpur.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsjodhpur.edu.in confirmed via live web search.',
  },
  {
    slug: 'aiims-rishikesh',
    name: 'AIIMS Rishikesh',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsrishikesh.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsrishikesh.edu.in confirmed via live web search.',
  },
  {
    slug: 'aiims-raipur',
    name: 'AIIMS Raipur',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsraipur.edu.in',
    urlVerified: false,
    lastVerified: null,
    accessType: 'PUBLIC',
    notes: `${PENDING}. Search surfaced a district government site, not the institute domain.`,
  },
  {
    slug: 'aiims-nagpur',
    name: 'AIIMS Nagpur',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsnagpur.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsnagpur.edu.in confirmed via live web search.',
  },
  {
    slug: 'aiims-gorakhpur',
    name: 'AIIMS Gorakhpur',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsgorakhpur.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsgorakhpur.edu.in confirmed via live web search.',
  },
  {
    slug: 'aiims-kalyani',
    name: 'AIIMS Kalyani',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://www.aiimskalyani.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimskalyani.edu.in confirmed via live web search (legacy mirror exists at old.aiimskalyani.edu.in).',
  },
  {
    slug: 'aiims-bibinagar',
    name: 'AIIMS Bibinagar',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsbibinagar.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsbibinagar.edu.in confirmed via live web search. Campus near Hyderabad.',
  },
  {
    slug: 'aiims-deoghar',
    name: 'AIIMS Deoghar',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsdeoghar.edu.in',
    urlVerified: false,
    lastVerified: null,
    accessType: 'PUBLIC',
    notes: PENDING,
  },
  {
    slug: 'aiims-bathinda',
    name: 'AIIMS Bathinda',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsbathinda.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsbathinda.edu.in confirmed via live web search.',
  },
  {
    slug: 'aiims-rajkot',
    name: 'AIIMS Rajkot',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsrajkot.edu.in',
    urlVerified: false,
    lastVerified: null,
    accessType: 'PUBLIC',
    notes: `${PENDING}. Search only surfaced a third-party document-service subdomain.`,
  },
  {
    slug: 'aiims-bilaspur',
    name: 'AIIMS Bilaspur',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://www.aiimsbilaspur.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsbilaspur.edu.in confirmed via live web search. Himachal Pradesh campus.',
  },
  {
    slug: 'aiims-guwahati',
    name: 'AIIMS Guwahati',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsguwahati.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsguwahati.in confirmed via live web search — note the .in TLD, not .edu.in.',
  },
  {
    slug: 'aiims-jammu',
    name: 'AIIMS Jammu',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://www.aiimsjammu.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Official domain aiimsjammu.edu.in confirmed via live web search. The institute campus is located at Vijaypur (Jammu).',
  },
  {
    slug: 'aiims-rae-bareli',
    name: 'AIIMS Rae Bareli',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsraebareli.edu.in',
    urlVerified: false,
    lastVerified: null,
    accessType: 'PUBLIC',
    notes: PENDING,
  },
  {
    slug: 'aiims-vijaypur-jammu',
    name: 'AIIMS Vijaypur (Jammu)',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://www.aiimsjammu.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Vijaypur (Jammu) campus of AIIMS Jammu — its official site aiimsjammu.edu.in was confirmed via live web search. Listed separately because exam/booking portals label the two names differently.',
  },
  {
    slug: 'aiims-madurai',
    name: 'AIIMS Madurai',
    kind: 'AIIMS',
    country: 'India',
    officialUrl: 'https://aiimsmadurai.edu.in',
    urlVerified: false,
    lastVerified: null,
    accessType: 'PUBLIC',
    notes: PENDING,
  },

  // ── Indian government bodies ─────────────────────────────────────────────
  {
    slug: 'nmc-india',
    name: 'National Medical Commission (NMC)',
    kind: 'GOVERNMENT',
    country: 'India',
    officialUrl: 'https://www.nmc.org.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Medical education regulator of India — CBME curriculum, NEET-PG regulations, doctor registration. Domain nmc.org.in confirmed via live web search.',
  },
  {
    slug: 'nbems',
    name: 'National Board of Examinations in Medical Sciences (NBEMS)',
    kind: 'GOVERNMENT',
    country: 'India',
    officialUrl: 'https://natboard.edu.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Conducts NEET-PG, NEET-SS, FMGE, DNB. Domain natboard.edu.in confirmed via live web search (official NBEMS subdomains staged.natboard.edu.in and webdisk.natboard.edu.in appeared in results).',
  },
  {
    slug: 'icmr',
    name: 'Indian Council of Medical Research (ICMR)',
    kind: 'GOVERNMENT',
    country: 'India',
    officialUrl: 'https://www.icmr.gov.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: "India's apex medical research body — guidelines, trials, journals. Domain icmr.gov.in confirmed via live web search.",
  },
  {
    slug: 'mohfw-india',
    name: 'Ministry of Health & Family Welfare, India',
    kind: 'GOVERNMENT',
    country: 'India',
    officialUrl: 'https://mohfw.gov.in',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'National health programmes, policies and official health advisories. Domain mohfw.gov.in confirmed via live web search.',
  },

  // ── Global government / intergovernmental ────────────────────────────────
  {
    slug: 'who',
    name: 'World Health Organization (WHO)',
    kind: 'GOVERNMENT',
    country: 'International (UN)',
    officialUrl: 'https://www.who.int',
    urlVerified: false,
    lastVerified: null,
    accessType: 'PUBLIC',
    notes: `${PENDING}. UN specialized agency for global health — guidelines and fact sheets.`,
  },
  {
    slug: 'cdc',
    name: 'Centers for Disease Control and Prevention (CDC)',
    kind: 'GOVERNMENT',
    country: 'USA',
    officialUrl: 'https://www.cdc.gov',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'US public-health agency — MMWR, travel health notices, disease surveillance. Domain cdc.gov confirmed via live web search.',
  },
  {
    slug: 'nih',
    name: 'National Institutes of Health (NIH)',
    kind: 'GOVERNMENT',
    country: 'USA',
    officialUrl: 'https://www.nih.gov',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'US biomedical research agency (parent of PubMed/NCBI). Domain nih.gov confirmed via live web search across official NIH institute subdomains (e.g. cc.nih.gov, niaaa.nih.gov).',
  },

  // ── Literature databases ─────────────────────────────────────────────────
  {
    slug: 'pubmed',
    name: 'PubMed (NCBI/NLM)',
    kind: 'DATABASE',
    country: 'USA',
    officialUrl: 'https://pubmed.ncbi.nlm.nih.gov',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'The primary biomedical literature index (36M+ citations). Metadata and abstracts; full text lives at the publisher. Domain confirmed via live web search.',
  },
  {
    slug: 'europe-pmc',
    name: 'Europe PMC (EMBL-EBI)',
    kind: 'DATABASE',
    country: 'UK / Europe',
    officialUrl: 'https://europepmc.org',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Open literature database with a free public REST API — the source MEDULA uses for real paper metadata. Domain confirmed via live web search.',
  },
  {
    slug: 'crossref',
    name: 'Crossref',
    kind: 'DATABASE',
    country: 'International',
    officialUrl: 'https://www.crossref.org',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'DOI registration agency — the authoritative way to resolve any paper DOI to its publisher page. Domain confirmed via live web search.',
  },
  {
    slug: 'doaj',
    name: 'Directory of Open Access Journals (DOAJ)',
    kind: 'DATABASE',
    country: 'International',
    officialUrl: 'https://doaj.org',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Index of vetted open-access journals — useful to check whether a journal is legitimate. Domain confirmed via live web search.',
  },

  // ── Global universities / academic medical centers ───────────────────────
  {
    slug: 'harvard-medical-school',
    name: 'Harvard Medical School',
    kind: 'GLOBAL_UNIVERSITY',
    country: 'USA',
    officialUrl: 'https://hms.harvard.edu',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'MIXED',
    notes: 'Public site and free HMX/online content alongside paid programmes. Domain hms.harvard.edu confirmed via live web search.',
  },
  {
    slug: 'johns-hopkins-medicine',
    name: 'Johns Hopkins Medicine',
    kind: 'GLOBAL_UNIVERSITY',
    country: 'USA',
    officialUrl: 'https://www.hopkinsmedicine.org',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Patient education, health library and CME. Domain hopkinsmedicine.org confirmed via live web search.',
  },
  {
    slug: 'stanford-medicine',
    name: 'Stanford Medicine',
    kind: 'GLOBAL_UNIVERSITY',
    country: 'USA',
    officialUrl: 'https://med.stanford.edu',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'School of Medicine site — education and research portals. Domain med.stanford.edu confirmed via live web search.',
  },
  {
    slug: 'mit-opencourseware',
    name: 'MIT OpenCourseWare',
    kind: 'GLOBAL_UNIVERSITY',
    country: 'USA',
    officialUrl: 'https://ocw.mit.edu',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'PUBLIC',
    notes: 'Fully free, openly licensed course materials (including biology/NEET-adjacent science). Domain ocw.mit.edu confirmed via live web search.',
  },
  {
    slug: 'mayo-clinic',
    name: 'Mayo Clinic',
    kind: 'GLOBAL_UNIVERSITY',
    country: 'USA',
    officialUrl: 'https://www.mayoclinic.org',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'MIXED',
    notes: 'Nonprofit academic medical center — free patient-facing disease pages; some professional/lab services are paid or registered. Domain confirmed via live web search.',
  },

  // ── Evidence syntheses ───────────────────────────────────────────────────
  {
    slug: 'cochrane-library',
    name: 'Cochrane Library',
    kind: 'DATABASE',
    country: 'International',
    officialUrl: 'https://www.cochranelibrary.com',
    urlVerified: true,
    lastVerified: VERIFIED_ON,
    accessType: 'MIXED',
    notes: 'Gold-standard systematic reviews. Abstracts/plain-language summaries are free; full reviews can require subscription depending on country. Domain confirmed via live web search.',
  },
]

// Case-insensitive, word-wise registry search across name, slug, kind, country
// and notes. A record matches if ANY meaningful query word appears (so natural
// queries like "AIIMS cardiology research" still surface AIIMS records);
// records matching more words rank first, verified ahead of unverified on
// ties, then alphabetical. Ordering is a display choice, never a quality
// ranking of the sources.
const STOPWORDS = new Set(['and', 'of', 'the', 'in', 'for', 'a', 'an', 'to', 'with', 'on', 'at', 'by'])

export function searchRegistry(q: string): SourceRecord[] {
  const words = q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w))
  if (words.length === 0) return []
  return SOURCE_REGISTRY.map((r) => {
    const hay = `${r.name} ${r.slug} ${r.kind} ${r.country} ${r.notes}`.toLowerCase()
    const score = words.reduce((acc, w) => (hay.includes(w) ? acc + 1 : acc), 0)
    return { r, score }
  })
    .filter((s) => s.score > 0)
    .sort((a, b) =>
      b.score - a.score ||
      (a.r.urlVerified === b.r.urlVerified ? a.r.name.localeCompare(b.r.name) : a.r.urlVerified ? -1 : 1),
    )
    .map((s) => s.r)
}
