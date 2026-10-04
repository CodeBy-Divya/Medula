import { NextRequest, NextResponse } from 'next/server'
import { getDemoProfile, toProfile } from '@/lib/profile'

export const dynamic = 'force-dynamic'

// ─── DEMO AUTH ───
// Educational demo sign-in. Two flows:
//   { mode: 'demo' }                      → straight into the seeded demo account
//   { email, password }                   → demo credentials return the demo profile;
//                                           any other valid email becomes a fresh
//                                           account routed through onboarding.
// NOTE: this is a learning-demo authenticator, not production IAM. No secrets
// are stored; nothing here grants access to real patient or user data.

const DEMO_EMAIL = 'doctor@medula.in'
const DEMO_PASSWORD = 'medula2024'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { mode?: string; email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const p = await getDemoProfile()

  // One-tap demo login
  if (body.mode === 'demo') {
    return NextResponse.json({
      ok: true,
      account: 'demo',
      profile: toProfile(p),
    })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  const password = body.password ?? ''

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
  }

  if (email === DEMO_EMAIL) {
    if (password !== DEMO_PASSWORD) {
      return NextResponse.json(
        { error: 'Wrong password for the demo account. Hint: it is shown below the form.' },
        { status: 401 },
      )
    }
    return NextResponse.json({ ok: true, account: 'demo', profile: toProfile(p) })
  }

  // Any other email → a fresh account goes through onboarding
  return NextResponse.json({ ok: true, account: 'new', profile: null })
}
