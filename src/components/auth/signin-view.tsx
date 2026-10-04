'use client'

// ─── SIGN IN — demo-first premium auth page ───
// Demo credentials are printed on the page on purpose: this is an educational
// demo. One tap on "Use demo account" drops the reviewer straight into the
// dashboard; custom emails route through onboarding as fresh accounts.

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, History, Loader2, LockKeyhole, LogIn, Mail, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore, readStoredView, viewToLabel, writeStoredSession } from '@/lib/store'
import type { Profile, View } from '@/lib/types'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const DEMO_EMAIL = 'doctor@medos.in'
const DEMO_PASSWORD = 'medos2024'

type Phase = 'idle' | 'working' | 'error'

export function SignInView() {
  const setView = useAppStore(s => s.setView)
  const setProfile = useAppStore(s => s.setProfile)
  const reduce = useReducedMotion()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)
  // The map remembers where the doctor left off — offer to resume there.
  // (SignInView mounts client-side only, so reading localStorage here is safe.)
  const [resumeView] = useState<View | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = readStoredView()
    return stored && stored !== 'home' ? stored : null
  })

  const enterApp = (profile: Profile | null) => {
    if (profile) {
      setProfile(profile)
      if (profile.onboarded) {
        // Resume the last working view when there is one (kept fresh by setView).
        setView(readStoredView() ?? 'home')
      } else {
        setView('onboarding')
      }
    } else {
      setProfile(null)
      setView('onboarding')
    }
  }

  const submit = async (mode: 'form' | 'demo') => {
    setPhase('working')
    setError(null)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'demo' ? { mode: 'demo' } : { email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Sign-in failed. Try again.')
        setPhase('error')
        return
      }
      // Explicit session — reloads stay signed in; sign-out clears it.
      writeStoredSession(data.account === 'demo' ? 'demo' : 'new')
      enterApp(data.profile ?? null)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
      setPhase('error')
    }
  }

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    void submit('form')
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-background text-foreground">
      {/* ambient sky scene */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="scene-float absolute -left-16 top-1/3 size-72 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="scene-float absolute -right-20 bottom-10 size-80 rounded-full bg-emerald-300/15 blur-3xl" style={{ animationDelay: '3s' }} />
        {['🌿', '☁️', '🦋', '🍃'].map((e, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute select-none text-xl opacity-40"
            animate={reduce ? undefined : { y: [0, -16, 0, 12, 0], rotate: [0, 9, 0, -7, 0] }}
            transition={reduce ? undefined : { duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.4 }}
            style={{ left: `${10 + i * 24}%`, top: `${12 + (i % 2) * 64}%` }}
          >
            {e}
          </motion.span>
        ))}
      </div>

      {/* top bar */}
      <header className="relative z-10 flex h-16 items-center px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setView('landing')}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to home
        </button>
      </header>

      {/* sign-in card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="clay w-full max-w-md rounded-3xl p-6 sm:p-8"
        >
          {/* brand */}
          <div className="flex flex-col items-center text-center">
            <span className="relative grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10">
              <span className="font-mono text-2xl font-bold text-primary">M</span>
              <span className="absolute -right-1 -top-1 size-3 animate-pulse rounded-full bg-primary" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Welcome back, doctor</h1>
            <p className="mt-1.5 text-sm text-ink-soft">
              Sign in to your medical universe — your map remembers exactly where you left off.
            </p>
            {resumeView && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.07] px-3 py-1 text-[11px] font-semibold text-primary">
                <History className="size-3" aria-hidden />
                Resume at {viewToLabel(resumeView)} after sign-in
              </p>
            )}
          </div>

          {/* form */}
          <form onSubmit={onSubmitForm} className="mt-7 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="signin-email" className="text-xs font-medium">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder={DEMO_EMAIL}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="clay-in h-11 min-h-11 border-0 pl-9 shadow-none focus-visible:ring-2"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signin-password" className="text-xs font-medium">Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="signin-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="clay-in h-11 min-h-11 border-0 pl-9 pr-10 shadow-none focus-visible:ring-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-sev-crit/30 bg-sev-crit/10 px-3 py-2 text-xs font-medium text-sev-crit">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="min-h-11 w-full gap-2 text-sm font-semibold" disabled={phase === 'working'}>
              {phase === 'working' ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
              Sign in
            </Button>
          </form>

          {/* demo shortcut */}
          <div className="mt-5 rounded-2xl border border-sev-ok/30 bg-sev-ok/[0.07] p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sev-ok">
              <Sparkles className="size-3.5" /> Demo access
            </p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-soft">
              <span className="inline-flex items-center gap-1"><UserRound className="size-3" /> {DEMO_EMAIL}</span>
              <span className="inline-flex items-center gap-1"><LockKeyhole className="size-3" /> {DEMO_PASSWORD}</span>
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-2.5 min-h-10 w-full gap-2 border-sev-ok/40 text-sm font-semibold text-sev-ok hover:bg-sev-ok/10"
              onClick={() => void submit('demo')}
              disabled={phase === 'working'}
            >
              {phase === 'working' ? <Loader2 className="size-4 animate-spin" /> : <UserRound className="size-4" />}
              Use demo account — skip the form
            </Button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground">
            <ShieldCheck className="size-3" />
            Educational demo only — no real credentials or patient data are stored.
          </p>
        </motion.div>
      </main>

      {/* footer */}
      <footer className="relative z-10 mt-auto border-t border-line px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        MEDOS — educational learning platform. Not medical advice. Verify with official NMC/NBEMS sources.
      </footer>
    </div>
  )
}
