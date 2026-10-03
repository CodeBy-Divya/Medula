'use client'

import { create } from 'zustand'
import type { Profile, View } from './types'

interface AppState {
  view: View
  profile: Profile | null
  hydrated: boolean
  loadingProfile: boolean
  conceptFocus: string | null // concept explorer target
  searchOpen: boolean
  auditOpen: boolean
  quizPreset: { subjectCode?: string; system?: string; conceptId?: string; count?: number } | null
  setView: (v: View) => void
  setProfile: (p: Profile | null) => void
  setHydrated: (v: boolean) => void
  openConcept: (id: string) => void
  closeConcept: () => void
  setSearchOpen: (v: boolean) => void
  setAuditOpen: (v: boolean) => void
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
  quizPreset: null,
  setView: (v) => set({ view: v }),
  setProfile: (p) => set({ profile: p }),
  setHydrated: (v) => set({ hydrated: v }),
  openConcept: (id) => set({ conceptFocus: id }),
  closeConcept: () => set({ conceptFocus: null }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setAuditOpen: (v) => set({ auditOpen: v }),
  setQuizPreset: (p) => set({ quizPreset: p }),
}))
