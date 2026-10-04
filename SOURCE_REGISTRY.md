# SOURCE_REGISTRY.md — Medical Knowledge OS · Phase 1 (Research)

> North star (spec §109): every feature must connect medical knowledge. This registry
> is the trust layer: **metadata first, always link out, never fabricate.**

## 1. Principles (spec §6, §57, §106, §107)

1. **Source-first**: every paper, course, guideline or institution shown in MEDULA
   carries `source`, `officialUrl`, and (where known) `lastVerified` / `retrievedAt`.
2. **Metadata-only**: we index title/authors/abstract/DOI and link to the original.
   We never reproduce full copyrighted papers, course videos, or paywalled content.
3. **Never fabricate**: if a domain, date, or fact cannot be verified it is shown as
   `verification pending` / `UNKNOWN` — never guessed (§106).
4. **Never bypass access controls**: no paywall/login/CAPTCHA circumvention, ever.
5. **Access honesty**: every resource is labelled `PUBLIC | REGISTRATION | PAID |
   MIXED | UNKNOWN`. Free resources are never labelled free without evidence.
6. **No rankings without methodology**: institutions are compared side-by-side, never ranked.

## 2. Verified institutional registry (live in code: `src/lib/institutions-registry.ts`)

Verification method: per-domain live web search on **2026-10-04 (IST)** — 27 CLI
searches. 31 of 37 entries verified; 6 honestly marked pending.

### India — AIIMS (verified domains)
| Institution | Official domain | Verified |
|---|---|---|
| AIIMS New Delhi | aiims.edu | ✅ 2026-10-04 |
| AIIMS Patna | aiimspatna.edu.in | ✅ |
| AIIMS Bhopal | aiimsbhopal.edu.in | ✅ |
| AIIMS Bhubaneswar | **aiimsbhubaneswar.nic.in** (not .edu.in — search-confirmed) | ✅ |
| AIIMS Jodhpur | aiimsjodhpur.edu.in | ✅ |
| AIIMS Rishikesh | aiimsrishikesh.edu.in | ✅ |
| AIIMS Nagpur | aiimsnagpur.edu.in | ✅ |
| AIIMS Gorakhpur | aiimsgorakhpur.edu.in | ✅ |
| AIIMS Kalyani | www.aiimskalyani.edu.in | ✅ |
| AIIMS Bibinagar | aiimsbibinagar.edu.in | ✅ |
| AIIMS Bathinda | aiimsbathinda.edu.in | ✅ |
| AIIMS Bilaspur | www.aiimsbilaspur.edu.in | ✅ |
| AIIMS Guwahati | **aiimsguwahati.in** | ✅ |
| AIIMS Jammu + Vijaypur (Jammu) | www.aiimsjammu.edu.in | ✅ |
| AIIMS Raipur / Deoghar / Rajkot / Rae Bareli / Madurai | recorded, **verification pending** | ⏳ shown as pending in UI |

### India — bodies (verified)
NBEMS → **natboard.edu.in** · NMC → **nmc.org.in** · ICMR → **icmr.gov.in** · MoHFW → **mohfw.gov.in**

### Global (verified)
WHO ⏳ pending (search returned only tertiary mirrors — honest pending badge) · CDC cdc.gov · NIH nih.gov · Harvard Medical School hms.harvard.edu · Johns Hopkins Medicine hopkinsmedicine.org · Stanford Medicine med.stanford.edu · MIT OCW ocw.mit.edu · Mayo Clinic mayoclinic.org · Cochrane Library cochranelibrary.com

### Scholarly databases (verified)
PubMed pubmed.ncbi.nlm.nih.gov · Europe PMC europepmc.org · Crossref crossref.org · DOAJ doaj.org

## 3. Scholarly APIs in production use

| API | Endpoint | Auth | Etiquette implemented |
|---|---|---|---|
| **Europe PMC (EBI)** — primary research source | `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=…&format=json&pageSize=12&resultType=core` | none (public) | 8 s timeout, 10-min in-memory TTL cache, pageSize ≤ 25, filters (`OPEN_ACCESS:Y`, `AFF:India`, `PUB_TYPE:"Review"`), sort `P_PDATE_D desc` / `CITED desc` |
| PubMed E-utilities | planned (P2) | optional key | respect 3 req/s limit |
| Crossref / DOAJ | planned (P2) | none | modular connector pattern (§71) |

Upstream quirk documented: Europe PMC ignores its `page` param on some queries —
MEDULA pages by `pageSize×page` fetch + slice, keeping the true `hitCount`.

## 4. Live web discovery (courses / guidelines)

Explore's `web` group calls the backend web-search function at request time and
classifies results by host/keywords into **courses / guidelines / resources**. Every
row shows `host`, `retrievedAt`, and the footer disclaimer: *"Confirm free/paid
status at the source."* Nothing is cached as fact; nothing is pre-seeded.

## 5. Ingestion pipeline (spec §56) — FEATURE-FLAGGED OFF (`ENABLE_SOURCE_PIPELINE: false`)

DISCOVER → FETCH → VALIDATE → CLASSIFY → EXTRACT METADATA → CHUNK → EMBED → TAG →
LINK TO GRAPH → QUALITY CHECK → **ADMIN REVIEW** → PUBLISH. Nothing auto-publishes.
Current substitute: live metadata retrieval + code-versioned registry (git = audit trail).

## 6. Gaps / next verifications (P2)

- Verify WHO + 5 pending AIIMS domains on a network path that resolves them.
- Admin review queue UI once `ENABLE_SOURCE_PIPELINE` is active.
- Guideline version store (`SourceVersion`) for WHAT CHANGED (§59) — flagged off.
