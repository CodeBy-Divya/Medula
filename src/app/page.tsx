'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { AppShell } from '@/components/app-shell'
import { LandingPage } from '@/components/landing/landing-page'
import { SignInView } from '@/components/auth/signin-view'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { MedicalMapView } from '@/components/map/medical-map-view'
import { LearnView } from '@/components/learn/learn-view'
import { QuestionsIndex } from '@/components/questions/questions-index'
import { CasesView } from '@/components/cases/cases-view'
import { ReviseView } from '@/components/revise/revise-view'
import { TutorView } from '@/components/tutor/tutor-view'
import { ProgressView } from '@/components/progress/progress-view'
import { RoadmapView } from '@/components/roadmap/roadmap-view'
import { ProfileView } from '@/components/profile/profile-view'
import { ConceptExplorer } from '@/components/concept/concept-explorer'
import { SearchOverlay } from '@/components/search/search-overlay'
import { AuditView } from '@/components/audit/audit-view'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const { view, setView, profile, setProfile } = useAppStore()

  // Reset scroll whenever the view changes (SPA views share one scroll context)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [view])

  // Hydrate profile once — decides landing vs app
  useEffect(() => {
    let ok = true
    api.getProfile()
      .then((r) => {
        if (!ok) return
        setProfile(r.profile)
        if (r.profile?.onboarded) {
          setView('home')
        }
      })
      .catch(() => {})
    return () => { ok = false }
  }, [setProfile, setView])

  const loaded = profile !== null

  // ── Landing / onboarding (standalone pages without shell) ──
  if (view === 'landing') return <LandingPage />
  if (view === 'signin') return <SignInView />
  if (view === 'onboarding') return <OnboardingWizard />

  // Wait for profile hydration before entering the app
  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="relative flex size-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <span className="font-mono text-xl font-bold text-primary">M</span>
            <span className="absolute -right-1 -top-1 size-2.5 animate-pulse rounded-full bg-primary" />
          </span>
          <Loader2 className="size-4 animate-spin text-ink-soft" />
        </div>
      </div>
    )
  }

  // ── App views inside the shell ──
  return (
    <AppShell>
      {view === 'home' && <DashboardView />}
      {view === 'map' && <MedicalMapView />}
      {view === 'learn' && <LearnView />}
      {view === 'questions' && <QuestionsIndex />}
      {view === 'cases' && <CasesView />}
      {view === 'revise' && <ReviseView />}
      {view === 'tutor' && <TutorView />}
      {view === 'progress' && <ProgressView />}
      {view === 'roadmap' && <RoadmapView />}
      {view === 'profile' && <ProfileView />}
      {/* Global overlays */}
      <ConceptExplorer />
      <SearchOverlay />
      <AuditView />
    </AppShell>
  )
}
