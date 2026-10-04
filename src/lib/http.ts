// ─── HTTP INPUT HARDENING HELPERS ───
// Small, dependency-free guards for mutating API routes: safe JSON parsing and
// bounded scalar coercion so bad client input returns a 4xx instead of a
// Prisma 500 (NaN/FK) or an unbounded write (DoS).

/** Parse a request body as JSON; returns null (→ route should 400) on bad JSON or empty body. */
export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T
  } catch {
    return null
  }
}

/** Accept only non-empty strings, trimmed and hard-capped at `max` chars; null otherwise. */
export function asTrimmed(v: unknown, max: number): string | null {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null
}

/** Coerce to a finite integer clamped to [min, max]; `fallback` when NaN/undefined/non-numeric. */
export function asInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = Math.round(Number(v))
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}
