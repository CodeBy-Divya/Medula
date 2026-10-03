'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Home, Map as MapIcon, BookOpen, CircleHelp, Stethoscope, RefreshCcw,
  Sparkles, LineChart, Route, UserRound, Search, Moon, SunMedium, Menu, X,
} from 'lucide-react'
import type { View } from '@/lib/types'

const NAV: { id: View; label: string; icon: typeof Home; hint?: string }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'map', label: 'Medical Map', icon: MapIcon },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'questions', label: 'Questions', icon: CircleHelp },
  { id: 'cases', label: 'Cases', icon: Stethoscope },
  { id: 'revise', label: 'Revise', icon: RefreshCcw },
  { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
  { id: 'progress', label: 'Progress', icon: LineChart },
  { id: 'roadmap', label: 'Roadmap', icon: Route },
  { id: 'profile', label: 'Profile', icon: UserRound },
]

const MOBILE_NAV = NAV.slice(0, 5)

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex size-8 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
        <span className="font-mono text-sm font-bold text-primary">M</span>
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary animate-pulse" />
      </span>
      {!compact && (
        <div className="leading-none">
          <span className="block text-[15px] font-bold tracking-tight">MEDOS</span>
          <span className="block text-[9px] uppercase tracking-[0.18em] text-ink-soft">Medical OS</span>
        </div>
      )}
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-10"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {mounted && theme === 'dark' ? <SunMedium className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { view, setView, setSearchOpen, profile } = useAppStore()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  const go = (v: View) => {
    setView(v)
    setMobileNavOpen(false)
  }

  const logoButton = (compact: boolean) => (
    <button onClick={() => setView('landing')} aria-label="MEDOS home" className="rounded-xl outline-none ring-primary/50 focus-visible:ring-2">
      <Logo compact={compact} />
    </button>
  )

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Desktop sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-sidebar/80 backdrop-blur-xl lg:flex">
        <div className="p-5"><button onClick={() => setView('landing')} aria-label="MEDOS home" className="rounded-xl"><Logo /></button></div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              aria-current={view === item.id ? 'page' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors min-h-11',
                view === item.id
                  ? 'bg-primary/12 font-medium text-primary'
                  : 'text-ink-soft hover:bg-surface-2 hover:text-foreground',
              )}
            >
              <item.icon className="size-4" />
              {item.label}
              {view === item.id && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <button
            onClick={() => go('profile')}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-surface-2 min-h-11"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              {(profile?.name ?? 'Dr').slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">Dr. {profile?.name ?? '…'}</span>
              <span className="block text-[11px] text-ink-soft">
                {profile ? (profile.year <= 4 ? `Year ${profile.year}` : profile.year === 5 ? 'Intern' : 'Dedicated') : ''}
              </span>
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex flex-1 flex-col lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-background/80 px-3 backdrop-blur-xl md:px-5">
          <button
            className="flex size-10 items-center justify-center rounded-xl hover:bg-surface-2 lg:hidden"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Open navigation"
          >
            {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="lg:hidden">{logoButton(true)}</div>

          <button
            onClick={() => setSearchOpen(true)}
            className="mx-auto hidden h-10 w-full max-w-md items-center gap-2.5 rounded-xl border border-line bg-surface-2 px-3.5 text-sm text-ink-soft transition-colors hover:border-primary/40 md:flex"
          >
            <Search className="size-4" />
            <span>Search medicine…</span>
            <kbd className="ml-auto rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">⌘K</kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex size-10 items-center justify-center rounded-xl hover:bg-surface-2 md:hidden"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
            <nav className="absolute inset-y-0 left-0 w-72 border-r border-line bg-background p-4 pt-5 shadow-2xl">
              <div className="mb-5"><button onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="rounded-xl"><Logo /></button></div>
              <div className="space-y-1">
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm min-h-11',
                      view === item.id ? 'bg-primary/12 font-medium text-primary' : 'text-ink-soft hover:bg-surface-2',
                    )}
                  >
                    <item.icon className="size-4" /> {item.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>

        {/* Sticky footer — mt-auto keeps it pinned when content is short */}
        <footer className="mt-auto border-t border-line px-4 py-4 md:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-[11px] text-ink-soft sm:flex-row">
            <span>MEDOS — the intelligence layer for medical education.</span>
            <span>Educational platform · Not medical advice · Verify against official NMC / NBEMS sources</span>
          </div>
        </footer>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/90 backdrop-blur-xl lg:hidden" aria-label="Primary">
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] transition-colors',
                view === item.id ? 'text-primary' : 'text-ink-soft',
              )}
              aria-current={view === item.id ? 'page' : undefined}
            >
              <item.icon className="size-5" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
