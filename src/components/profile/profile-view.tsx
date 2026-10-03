'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  CalendarClock,
  Check,
  Clock3,
  GraduationCap,
  Hourglass,
  Info,
  Loader2,
  Palette,
  Pencil,
  ShieldAlert,
  Target,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { PREP_STAGE_LABELS, YEAR_LABELS } from '@/lib/types'
import type { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1)

const YEAR_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: 'Final Year' },
  { value: 5, label: 'Intern' },
  { value: 6, label: 'Dedicated Prep' },
]

const COLLEGE_TYPES = ['Government', 'Private', 'Deemed'] as const
type CollegeType = (typeof COLLEGE_TYPES)[number]

const PREP_OPTIONS: { value: Profile['prepStage']; label: string; desc: string }[] = [
  { value: 'exploring', label: 'Exploring', desc: 'Getting oriented to what NEET-PG demands.' },
  { value: 'foundation', label: 'Building foundation', desc: 'Concepts and early-year basics, done properly.' },
  { value: 'regular', label: 'Regular preparation', desc: 'Consistent study alongside college.' },
  { value: 'serious', label: 'Serious preparation', desc: 'Structured prep with weekly question practice.' },
  { value: 'dedicated', label: 'Dedicated prep', desc: 'Full-time preparation for NEET-PG.' },
  { value: 'revision', label: 'Revision phase', desc: 'Cycles, mocks and gap-closing.' },
]

const STYLE_OPTIONS = ['Visual', 'Text', 'Questions', 'Clinical cases', 'Flashcards', 'Interactive models', 'Audio', 'Mixed']

const RESOURCE_OPTIONS = ['Marrow', 'PW', 'PrepLadder', 'DAMS', 'Cerebellum', 'Other']

const RESOURCE_NOTE =
  'MEDOS sits above your resources — it never copies their content. After a lecture, come here for the recall + questions that make it stick.'

const DISCLAIMER_BULLETS = [
  'Knowledge scores are learning-analytics indicators — not assessments of clinical competence.',
  'Content and structure align to the NMC CBME curriculum.',
  'Exam dates are estimates — always verify with NBEMS and official sources.',
  'MEDOS is for educational use only — never a substitute for clinical judgment.',
]

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'DR'
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
  return letters || 'DR'
}

// ─── Card shell + small presentational helpers ──────────────────────────────

function Card({
  icon: Icon,
  title,
  action,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('glass rounded-2xl p-5', className)}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
          <Icon className="size-4 text-primary" aria-hidden />
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  )
}

function Segmented({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: number; label: string }[]
  value: number
  onChange: (v: number) => void
  ariaLabel: string
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'min-h-11 rounded-xl border px-3 text-sm font-medium transition-all',
            value === o.value
              ? 'border-primary/60 bg-primary/10 text-foreground shadow-[0_0_20px_-8px_rgba(34,211,238,0.55)]'
              : 'border-line bg-surface-2 text-ink-soft hover:border-primary/40 hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Chip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-all',
        selected
          ? 'border-cyan-400/60 bg-cyan-400/10 text-foreground'
          : 'border-line bg-surface-2 text-ink-soft hover:border-cyan-400/40 hover:text-foreground',
      )}
    >
      {selected && <Check className="size-3.5 text-cyan-400" aria-hidden />}
      {label}
    </button>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {value} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0] ?? min)}
        aria-label={label}
        className="mt-3"
      />
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, extra }: { icon: LucideIcon; label: string; value: string; extra?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-2 px-3.5 py-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-ink-soft">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
      {extra && <div className="ml-auto shrink-0">{extra}</div>}
    </div>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-center">
      <p className="text-lg font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">{label}</p>
    </div>
  )
}

function ChipRow({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) return <p className="text-xs text-ink-soft">{emptyLabel}</p>
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <span key={s} className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-foreground">
          {s}
        </span>
      ))}
    </div>
  )
}

// ─── Exam mode card (own state so it initializes from the loaded profile) ───

function ExamModeCard({ profile, onSaved }: { profile: Profile; onSaved: (p: Profile) => void }) {
  const { toast } = useToast()
  const [examMode, setExamMode] = useState(profile.examMode)
  const [examLabel, setExamLabel] = useState(profile.examLabel)
  const [examDate, setExamDate] = useState(profile.examDate ?? '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (saving) return
    setSaving(true)
    try {
      const res = await api.saveProfile({
        examMode,
        examLabel: examLabel.trim(),
        examDate: examMode && examDate ? examDate : null,
      })
      onSaved(res.profile)
      toast({
        title: examMode ? 'Exam mode on' : 'Exam mode off',
        description: examMode
          ? "Today's plan now leans toward your college syllabus and internals."
          : 'Back to your regular NEET-PG priority.',
      })
    } catch {
      toast({ title: 'Could not save exam mode', description: 'Check your connection and try again.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card icon={CalendarClock} title="Exam mode">
      <label className="flex cursor-pointer items-start justify-between gap-3">
        <span>
          <span className="block text-sm font-medium text-foreground">College exam priority</span>
          <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
            Temporarily reprioritizes today&apos;s plan toward your college syllabus and internal assessments.
          </span>
        </span>
        <Switch checked={examMode} onCheckedChange={setExamMode} className="mt-1 shrink-0" aria-label="College exam priority" />
      </label>
      {examMode && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="mt-4 space-y-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="pf-exam-label">Exam name</Label>
            <Input
              id="pf-exam-label"
              value={examLabel}
              onChange={(e) => setExamLabel(e.target.value)}
              placeholder="e.g. 2nd internal — Pathology"
              className="min-h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-exam-date">Exam date (optional)</Label>
            <Input
              id="pf-exam-date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="min-h-11"
            />
          </div>
        </motion.div>
      )}
      <Button onClick={() => void save()} disabled={saving} className="mt-4 min-h-11 w-full gap-2">
        {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
        Save exam mode
      </Button>
    </Card>
  )
}

// ─── ProfileView ─────────────────────────────────────────────────────────────

export function ProfileView() {
  const setStoreProfile = useAppStore((s) => s.setProfile)
  const setView = useAppStore((s) => s.setView)
  const { toast } = useToast()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Editable form state (hydrated from the loaded profile when edit starts)
  const [form, setForm] = useState({
    name: '',
    year: 1,
    semester: 1,
    collegeName: '',
    collegeType: 'Government' as CollegeType,
    gradYear: new Date().getFullYear() + 3,
    pastScore: '',
    prepStage: 'serious' as Profile['prepStage'],
    dailyHours: 4,
    weekdayHours: 5,
    weekendHours: 8,
    learningStyles: [] as string[],
    resources: [] as string[],
  })

  // Pull the truth from the API; fall back to the store snapshot if offline.
  useEffect(() => {
    let cancelled = false
    api
      .getProfile()
      .then((res) => {
        if (cancelled) return
        setProfile(res.profile)
        setStoreProfile(res.profile)
        setLoadError(false)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        const fallback = useAppStore.getState().profile
        if (fallback) {
          setProfile(fallback)
          setLoading(false)
        } else {
          setLoadError(true)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey, setStoreProfile])

  const startEdit = (p: Profile) => {
    setForm({
      name: p.name,
      year: p.year,
      semester: p.semester,
      collegeName: p.collegeName,
      collegeType: (COLLEGE_TYPES as readonly string[]).includes(p.collegeType)
        ? (p.collegeType as CollegeType)
        : 'Government',
      gradYear: p.gradYear,
      pastScore: p.pastScore,
      prepStage: p.prepStage,
      dailyHours: p.dailyHours,
      weekdayHours: p.weekdayHours,
      weekendHours: p.weekendHours,
      learningStyles: [...p.learningStyles],
      resources: [...p.resources],
    })
    setSaveError(null)
    setEditing(true)
  }

  // Year change auto-derives semester + grad year (same rules as onboarding).
  const chooseYear = (y: number) => {
    setForm((f) => ({
      ...f,
      year: y,
      semester: Math.min((y - 1) * 2 + 1, 8),
      gradYear: new Date().getFullYear() + (y <= 4 ? 5 - y : 1),
    }))
  }

  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const gradSane = form.gradYear >= new Date().getFullYear() && form.gradYear <= new Date().getFullYear() + 12
  const editValid =
    form.name.trim().length > 0 && form.learningStyles.length >= 1 && gradSane

  const weeklyFormHours = useMemo(
    () => Math.round((form.weekdayHours * 5 + form.weekendHours * 2) * 10) / 10,
    [form.weekdayHours, form.weekendHours],
  )

  const saveEdit = async () => {
    if (!editValid || saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await api.saveProfile({
        name: form.name.trim(),
        year: form.year,
        semester: form.semester,
        collegeName: form.collegeName.trim(),
        collegeType: form.collegeType,
        gradYear: form.gradYear,
        pastScore: form.pastScore.trim(),
        prepStage: form.prepStage,
        dailyHours: form.dailyHours,
        weekdayHours: form.weekdayHours,
        weekendHours: form.weekendHours,
        learningStyles: form.learningStyles,
        resources: form.resources,
      })
      setProfile(res.profile)
      setStoreProfile(res.profile)
      setEditing(false)
      toast({ title: 'Profile updated', description: 'Your plan, tutor depth and roadmap now match.' })
    } catch {
      setSaveError('Could not save your profile. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const onExamSaved = (p: Profile) => {
    setProfile(p)
    setStoreProfile(p)
  }

  // ── Loading / error / empty states ──
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-8 md:px-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-5 md:col-span-2">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (loadError || !profile) {
    const noneYet = !loadError
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
            <UserRound className="size-6 text-cyan-500 dark:text-cyan-300" aria-hidden />
          </div>
          <h1 className="mt-4 text-lg font-semibold tracking-tight">
            {noneYet ? 'No profile yet' : 'Could not load your profile'}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            {noneYet
              ? 'Tell MEDOS who you are and where you are in MBBS — everything else personalizes from there.'
              : 'Check your connection, then retry.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Button onClick={() => setView('onboarding')} className="min-h-11">
              {noneYet ? 'Start onboarding' : 'Go to onboarding'}
            </Button>
            <Button variant="outline" onClick={() => setReloadKey((k) => k + 1)} className="min-h-11">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const stageLabel = PREP_STAGE_LABELS[profile.prepStage] ?? profile.prepStage
  const primaryResource = profile.resources[0] ?? 'Marrow'
  const profileWeeklyHours = Math.round((profile.weekdayHours * 5 + profile.weekendHours * 2) * 10) / 10

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Profile</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">Your Medical Profile</h1>
        </div>
        {!editing && (
          <Button variant="outline" onClick={() => startEdit(profile)} className="min-h-11 gap-2">
            <Pencil className="size-4" aria-hidden />
            Edit profile
          </Button>
        )}
      </div>

      {/* Edit action bar */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="glass-strong mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3"
        >
          <p className="text-sm font-medium text-foreground">Editing profile — plan, tutor depth and roadmap follow these answers.</p>
          <div className="flex items-center gap-2">
            <Button onClick={() => setEditing(false)} variant="ghost" className="min-h-11" disabled={saving}>
              Cancel
            </Button>
            <Button onClick={() => void saveEdit()} className="min-h-11 gap-2" disabled={saving || !editValid}>
              {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}
              Save
            </Button>
          </div>
        </motion.div>
      )}

      {saveError && (
        <p role="alert" className="mb-5 rounded-xl border border-sev-crit/30 bg-sev-crit/10 px-3.5 py-2.5 text-xs text-sev-crit">
          {saveError}
        </p>
      )}
      {editing && !editValid && (
        <p className="mb-5 text-xs text-ink-soft">
          Save needs a name, at least one learning style, and a graduation year within the next 12 years.
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {/* ── Main column ── */}
        <div className="space-y-5 md:col-span-2">
          {/* IDENTITY */}
          <Card icon={UserRound} title="Identity">
            {editing ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pf-name">Name</Label>
                  <Input
                    id="pf-name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Dr. …"
                    className="min-h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Year</Label>
                  <Segmented options={YEAR_OPTIONS} value={form.year} onChange={chooseYear} ariaLabel="MBBS year" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="pf-sem">Semester</Label>
                    <Select value={String(form.semester)} onValueChange={(v) => setForm((f) => ({ ...f, semester: Number(v) }))}>
                      <SelectTrigger id="pf-sem" className="min-h-11 w-full">
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEMESTERS.map((s) => (
                          <SelectItem key={s} value={String(s)}>
                            Semester {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pf-grad">Graduation year</Label>
                    <Input
                      id="pf-grad"
                      type="number"
                      inputMode="numeric"
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 12}
                      value={form.gradYear}
                      onChange={(e) => setForm((f) => ({ ...f, gradYear: Number(e.target.value) }))}
                      aria-invalid={!gradSane}
                      className="min-h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pf-past">Past performance</Label>
                    <Input
                      id="pf-past"
                      value={form.pastScore}
                      onChange={(e) => setForm((f) => ({ ...f, pastScore: e.target.value }))}
                      placeholder="e.g. 62% in 1st internal"
                      className="min-h-11"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="pf-college">College</Label>
                    <Input
                      id="pf-college"
                      value={form.collegeName}
                      onChange={(e) => setForm((f) => ({ ...f, collegeName: e.target.value }))}
                      placeholder="Your medical college"
                      className="min-h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>College type</Label>
                    <div role="radiogroup" aria-label="College type" className="flex gap-2">
                      {COLLEGE_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={form.collegeType === t}
                          onClick={() => setForm((f) => ({ ...f, collegeType: t }))}
                          className={cn(
                            'min-h-11 flex-1 rounded-xl border px-3 text-sm font-medium transition-all',
                            form.collegeType === t
                              ? 'border-primary/60 bg-primary/10 text-foreground'
                              : 'border-line bg-surface-2 text-ink-soft hover:border-primary/40 hover:text-foreground',
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4">
                  <div className="grid size-16 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/15 text-lg font-semibold tracking-tight text-primary">
                    {initialsOf(profile.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xl font-semibold tracking-tight text-foreground">{profile.name}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {YEAR_LABELS[profile.year] ?? `Year ${profile.year}`} · Semester {profile.semester}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <InfoRow
                    icon={Building2}
                    label="College"
                    value={profile.collegeName || 'Not set'}
                    extra={
                      <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] text-ink-soft">
                        {profile.collegeType}
                      </span>
                    }
                  />
                  <InfoRow icon={CalendarDays} label="Expected graduation" value={`Class of ${profile.gradYear}`} />
                  <InfoRow icon={GraduationCap} label="Past performance" value={profile.pastScore || 'Not shared'} />
                  <InfoRow icon={Hourglass} label="Weekly capacity" value={`≈ ${profileWeeklyHours} h/week`} />
                </div>
              </div>
            )}
          </Card>

          {/* PREPARATION */}
          <Card icon={Target} title="Preparation">
            {editing ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Prep stage</Label>
                  <div role="radiogroup" aria-label="Preparation stage" className="grid gap-2 sm:grid-cols-2">
                    {PREP_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={form.prepStage === o.value}
                        onClick={() => setForm((f) => ({ ...f, prepStage: o.value }))}
                        className={cn(
                          'rounded-xl border p-3 text-left transition-all',
                          form.prepStage === o.value
                            ? 'border-primary/60 bg-primary/10'
                            : 'border-line bg-surface-2 hover:border-primary/40',
                        )}
                      >
                        <p className="text-sm font-medium text-foreground">{o.label}</p>
                        <p className="mt-0.5 text-xs leading-snug text-ink-soft">{o.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <SliderRow
                    label="Daily target"
                    value={form.dailyHours}
                    min={0.5}
                    max={12}
                    step={0.5}
                    unit="h/day"
                    onChange={(v) => setForm((f) => ({ ...f, dailyHours: v }))}
                  />
                  <SliderRow
                    label="Weekdays"
                    value={form.weekdayHours}
                    min={0}
                    max={14}
                    step={0.5}
                    unit="h/day"
                    onChange={(v) => setForm((f) => ({ ...f, weekdayHours: v }))}
                  />
                  <SliderRow
                    label="Weekends"
                    value={form.weekendHours}
                    min={0}
                    max={14}
                    step={0.5}
                    unit="h/day"
                    onChange={(v) => setForm((f) => ({ ...f, weekendHours: v }))}
                  />
                </div>
                <p className="text-xs text-ink-soft">≈ {weeklyFormHours} h/week total capacity</p>
                <div className="space-y-2">
                  <Label>Learning styles</Label>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_OPTIONS.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        selected={form.learningStyles.includes(s)}
                        onToggle={() => setForm((f) => ({ ...f, learningStyles: toggleIn(f.learningStyles, s) }))}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Resources you use</Label>
                  <div className="flex flex-wrap gap-2">
                    {RESOURCE_OPTIONS.map((r) => (
                      <Chip
                        key={r}
                        label={r}
                        selected={form.resources.includes(r)}
                        onToggle={() => setForm((f) => ({ ...f, resources: toggleIn(f.resources, r) }))}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {stageLabel}
                  </span>
                  {profile.examMode && profile.examLabel && (
                    <span className="rounded-full border border-sev-warn/40 bg-sev-warn/10 px-3 py-1 text-xs font-medium text-sev-warn">
                      Exam priority: {profile.examLabel}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <StatBlock value={`${profile.dailyHours} h`} label="Daily target" />
                  <StatBlock value={`${profile.weekdayHours} h`} label="Weekdays" />
                  <StatBlock value={`${profile.weekendHours} h`} label="Weekends" />
                </div>
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">
                    <Palette className="size-3.5" aria-hidden /> Learning styles
                  </p>
                  <ChipRow items={profile.learningStyles} emptyLabel="No learning styles selected yet." />
                </div>
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">
                    <Clock3 className="size-3.5" aria-hidden /> Weekly capacity
                  </p>
                  <p className="text-sm text-foreground">≈ {profileWeeklyHours} hours per week</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── Side column ── */}
        <div className="space-y-5">
          <ExamModeCard profile={profile} onSaved={onExamSaved} />

          {/* RESOURCES */}
          <Card icon={BookOpenCheck} title="Resources">
            <ChipRow items={profile.resources} emptyLabel="No resources selected — edit profile to add them." />
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">{RESOURCE_NOTE}</p>
            <div className="mt-3 rounded-xl border border-line bg-surface-2 p-3">
              <p className="flex flex-wrap items-center gap-1.5 text-xs text-foreground">
                <span className="font-semibold">{primaryResource}</span>
                <span className="text-ink-soft">· Renal pathology lecture</span>
                <Check className="size-3.5 text-sev-ok" aria-hidden />
              </p>
              <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-ink-soft">
                <CalendarClock className="mt-0.5 size-3 shrink-0 text-primary" aria-hidden />
                Platform follow-up: 20 min recall · 10 questions · 1 case
              </p>
            </div>
          </Card>

          {/* DATA & DISCLAIMER */}
          <Card icon={ShieldAlert} title="Data & disclaimer">
            <ul className="space-y-2.5">
              {DISCLAIMER_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
                  <Info className="mt-0.5 size-3.5 shrink-0 text-primary/80" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
