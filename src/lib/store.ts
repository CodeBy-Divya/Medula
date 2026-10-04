'use client'

import { create } from 'zustand'
import type { Profile, View } from './types'

// ── Last-view memory + hash deep links ─────────────────────────────────
// App views (inside the shell) persist to localStorage so sign-in can drop
// the doctor back where they left off, and mirror to the URL hash (#/map)
// so a reload keeps the same view.
export const APP_VIEWS: readonly View[] = [
  'home', 'map', 'understand', 'learn', 'questions', 'cases', 'revise', 'tutor', 'progress', 'roadmap', 'profile',
] as const

export const LAST_VIEW_KEY = 'medos:last-view'
export const SESSION_KEY = 'medos:session'

// ── Session flag ───────────────────────────────────────────────────────
// The demo backend has no cookies — GET /api/profile always returns the
// seeded account. To keep sign-in meaningful, the client records an
// explicit "session" in localStorage only after the user actually signs
// in (or finishes onboarding). Reloads with an active session resume the
// app; sign-out (or a fresh browser) starts from the landing page.
export type StoredSession = { account: 'demo' | 'new'; at: number }

export function readStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredSession>
    if (parsed?.account !== 'demo' && parsed?.account !== 'new') return null
    return { account: parsed.account, at: typeof parsed.at === 'number' ? parsed.at : 0 }
  } catch { return null }
}

export function writeStoredSession(account: 'demo' | 'new'): void {
  try { window.localStorage.setItem(SESSION_KEY, JSON.stringify({ account, at: Date.now() })) } catch { /* private mode */ }
}

export function clearStoredSession(): void {
  try { window.localStorage.removeItem(SESSION_KEY) } catch { /* private mode */ }
}

export function isAppView(v: string | null): v is View {
  return !!v && (APP_VIEWS as readonly string[]).includes(v)
}

export function readStoredView(): View | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(LAST_VIEW_KEY)
    return isAppView(v) ? v : null
  } catch { return null }
}

export function viewFromHash(hash?: string): View | null {
  const h = hash ?? (typeof window !== 'undefined' ? window.location.hash : '')
  if (!h) return null
  const m = /^#\/([a-z]+)$/.exec(h)
  return isAppView(m?.[1] ?? null) ? (m![1] as View) : null
}

export function viewToLabel(v: View): string {
  const labels: Partial<Record<View, string>> = {
    home: 'Home', map: 'the Medical Map', understand: 'Understand Your Topic', learn: 'Learn', questions: 'the Question Lab',
    cases: 'the Case Simulator', revise: 'Revise', tutor: 'the AI Tutor',
    progress: 'Progress', roadmap: 'Roadmap', profile: 'Profile',
  }
  return labels[v] ?? v
}

interface AppState {
  view: View
  profile: Profile | null
  hydrated: boolean
  loadingProfile: boolean
  conceptFocus: string | null // concept explorer target
  searchOpen: boolean
  auditOpen: boolean
  shortcutsOpen: boolean // keyboard cheat-sheet overlay (?)
  mapScope: string | null // pending scope to apply in the map view (e.g. "subject:anatomy")
  quizPreset: { subjectCode?: string; system?: string; conceptId?: string; count?: number; pairId?: string; pairLabel?: string } | null
  setView: (v: View) => void
  setProfile: (p: Profile | null) => void
  setHydrated: (v: boolean) => void
  openConcept: (id: string) => void
  closeConcept: () => void
  setSearchOpen: (v: boolean) => void
  setAuditOpen: (v: boolean) => void
  setShortcutsOpen: (v: boolean) => void
  setMapScope: (s: string | null) => void
  setQuizPreset: (p: AppState['quizPreset']) => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'landing',
  profile: null,
  hydrated: false,
  loadingProfile: true,
  conceptFocus: null,
  searchOpen: false,
  auditOpen: false,
  shortcutsOpen: false,
  mapScope: null,
  quizPreset: null,
  setView: (v) => {
    if (isAppView(v)) {
      try { window.localStorage.setItem(LAST_VIEW_KEY, v) } catch { /* private mode */ }
    }
    set({ view: v })
  },
  setProfile: (p) => set({ profile: p }),
  setHydrated: (v) => set({ hydrated: v }),
  openConcept: (id) => set({ conceptFocus: id }),
  closeConcept: () => set({ conceptFocus: null }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setAuditOpen: (v) => set({ auditOpen: v }),
  setShortcutsOpen: (v) => set({ shortcutsOpen: v }),
  setMapScope: (s) => set({ mapScope: s }),
  setQuizPreset: (p) => set({ quizPreset: p }),
}))
