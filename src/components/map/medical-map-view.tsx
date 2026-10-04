'use client'

// ─── MEDICAL MAP — "Google Maps for medicine" ───
// Interactive SVG knowledge graph: pan, zoom, scoped views, struggle-zone
// highlighting, kind emojis, and a warm scenic variant for the dashboard hero.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import {
  Bone, Brain, Bug, Compass, Droplet, Droplets, Filter, Focus, HeartPulse, Map as MapIcon, Maximize2, Mountain, Play,
  RotateCcw, Sparkles, TriangleAlert, Utensils, Waypoints, Wind, X, Zap, type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { KIND_META, SYSTEMS } from '@/lib/types'
import type { GraphPayload, SubjectSummary } from '@/lib/types'
import type { StruggleZone, MapInsights } from '@/app/api/map-insights/route'
import { forceLayout } from '@/lib/graph-layout'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const EASE3D: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Map-page shared pieces ──────────────────────────────────────────────────

function MasteryBar({ pct, className, delay = 0 }: { pct: number; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn('h-full shrink-0 rounded-full', className)}
      initial={reduce ? false : { width: 0 }}
      animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      transition={{ duration: 1, delay: reduce ? 0 : delay, ease: EASE3D }}
    />
  )
}

function DifficultyFlames({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Difficulty ${n} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn('text-[10px] leading-none', i < n ? 'opacity-100' : 'opacity-25 grayscale')}>
          🔥
        </span>
      ))}
    </span>
  )
}

function StruggleZoneCard({ zone, index }: { zone: StruggleZone; index: number }) {
  const openConcept = useAppStore(s => s.openConcept)
  const setQuizPreset = useAppStore(s => s.setQuizPreset)
  const setView = useAppStore(s => s.setView)

  const practice = () => {
    setQuizPreset({ conceptId: zone.conceptId, count: 5 })
    setView('questions')
  }

  return (
    <motion.li
      initial={false}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: EASE3D }}
      className="warm-card flex min-w-0 flex-col rounded-2xl p-3.5 transition-shadow hover:shadow-lg hover:shadow-rose-500/5"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-sev-crit/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sev-crit">
          <Mountain className="size-2.5" /> Hard
        </span>
        <DifficultyFlames n={zone.difficulty} />
      </div>
      <h4 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug">{zone.name}</h4>
      <p className="mt-0.5 text-[11px] font-medium" style={{ color: zone.subjectColor }}>
        {zone.subjectName}
      </p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-soft">{zone.reason}</p>
      <div className="mt-2">
        <div className="flex items-center justify-between text-[10px] text-ink-soft">
          <span>mastery</span>
          <span className="font-semibold tabular-nums text-sev-crit">{zone.mastery}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <MasteryBar pct={zone.mastery} className="bg-sev-crit" delay={0.3 + index * 0.08} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <Button size="sm" className="h-8 min-h-8 gap-1 rounded-lg px-2 text-[11px]" onClick={practice}>
          <Play className="size-3" /> Practice
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 min-h-8 gap-1 rounded-lg px-2 text-[11px]"
          onClick={() => openConcept(zone.conceptId)}
        >
          <MapIcon className="size-3" /> Explore
        </Button>
      </div>
    </motion.li>
  )
}

// Nature scene backdrop — soft decorative layer, hides itself if missing
function MapSceneImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setOk(false)}
      className="absolute inset-0 size-full object-cover opacity-[0.16] mix-blend-luminosity"
      loading="lazy"
    />
  )
}

type MapNode = GraphPayload['nodes'][number]
type StatusFilter = 'all' | 'attention' | 'unlearned' | 'struggle'
type LaidNode = { node: MapNode; x: number; y: number; labelAbove: boolean }

// Guided tour: an auto-walk through the most important stops on the map —
// struggle zones first (hardest × least mastered × highest yield), then the
// highest-degree hub concepts that unlock whole clusters.
interface TourStop {
  id: string
  name: string
  kind: string
  mastery: number
  difficulty: number
  status: MapNode['status']
  reason: string
  tag: 'struggle' | 'hub'
  degree: number
}
interface TourState {
  stops: TourStop[]
  index: number
}

const VIEW_W = 1000
const VIEW_H = 640
const SEED = 42 // fixed → deterministic layout between renders
const MIN_ZOOM = 0.6
const MAX_ZOOM = 2.5
const LABEL_MIN_ZOOM = 1.15 // below this zoom, only "major" nodes keep labels
// NOTE: spec said radius >= 17, but on this dataset every node is r >= 20
// (examRelevance 3..5 × mastery bonus), which would make ALL nodes major.
// 26 selects the visually larger upper band (~half the graph).
const MAJOR_RADIUS = 26
const LABEL_MAX_CHARS = 16
const LABEL_COLLIDE_Y = 14 // layout-px y-band in which labels count as stacked

const SYSTEM_ICONS: Record<string, LucideIcon> = {
  HeartPulse, Wind, Droplets, Utensils, Sparkles, Brain, Droplet, Bug, Bone,
}

const STATUS_COLORS: Record<string, string> = {
  strong: 'var(--sev-ok)',
  unstable: 'var(--sev-warn)',
  weak: 'var(--sev-crit)',
  new: 'var(--muted-foreground)',
}

const STATUS_LABELS: Record<string, string> = {
  strong: 'Strong', unstable: 'Unstable', weak: 'Weak', new: 'New',
}

const STATUS_ORDER = ['strong', 'unstable', 'weak', 'new'] as const

// Friendly emoji living inside each node circle (kind-based)
const KIND_EMOJI: Record<string, string> = {
  concept: '💡', disease: '🩺', drug: '💊', investigation: '🔬',
  physiology: '⚡', anatomy: '🦴', pathology: '🧫', pharmacology: '💉',
  microbiology: '🦠', clinical_skill: '🤲',
}

const STRUGGLE_EMOJI = '⚠️'

function isStruggle(n: MapNode): boolean {
  return n.difficulty >= 4 && n.mastery < 45
}

interface EdgeVisual { stroke: string; dasharray?: string; opacity: number; width: number }

function edgeVisual(type: string): EdgeVisual {
  switch (type) {
    case 'prerequisite_of':
      return { stroke: '#f59e0b', dasharray: '7 5', opacity: 0.7, width: 1.8 }
    case 'causes':
      return { stroke: '#fb7185', opacity: 0.7, width: 1.8 }
    case 'treated_by':
      return { stroke: '#34d399', opacity: 0.7, width: 1.8 }
    case 'diagnosed_by':
      return { stroke: '#fbbf24', opacity: 0.7, width: 1.8 }
    case 'commonly_tested_with':
      return { stroke: 'var(--muted-foreground)', dasharray: '2 6', opacity: 0.5, width: 1.4 }
    default:
      return { stroke: 'var(--foreground)', opacity: 0.15, width: 1.5 }
  }
}

function radiusOf(n: MapNode): number {
  return 14 + n.examRelevance * 2 + n.mastery * 0.08
}

/**
 * Word-boundary truncation: never cuts mid-word ("Acute Kidney Inju…" →
 * "Acute Kidney…"), prefers a space, falls back to a hyphen boundary
 * ("Renin-Angiotensin…" → "Renin-…"), and strips dangling separators from
 * names like "Heart Failure (HF)" → "Heart Failure…".
 */
function truncateLabel(s: string, max: number = LABEL_MAX_CHARS): string {
  if (s.length <= max) return s
  const head = s.slice(0, max)
  const space = head.lastIndexOf(' ')
  if (space > 3) return `${head.slice(0, space).replace(/[\s(—/:;,&]+$/, '')}…`
  const hyphen = head.lastIndexOf('-')
  if (hyphen > 2) return `${head.slice(0, hyphen + 1)}…`
  return `${head.trimEnd()}…`
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function ScopeChip({ active, onClick, children, className }: { active: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-line bg-surface text-ink-soft hover:border-primary/40 hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  )
}

// Drifting nature friends for the warm scenic backdrop (decorative)
const SCENE_EMOJI = ['🍃', '☁️', '🌿', '🌤️', '🦋', '☁️', '🍀', '☀️']

function SceneBackdrop() {
  const reduce = useReducedMotion()
  return (
    <div aria-hidden className="map-scene-dawn pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {/* floating nature emoji — slow, calm drift */}
      {SCENE_EMOJI.map((e, i) => (
        <span
          key={i}
          className={cn('absolute select-none opacity-40', !reduce && 'animate-leaf-drift')}
          style={{
            left: `${(i * 13 + 6) % 92}%`,
            top: `${(i * 31 + 10) % 78}%`,
            fontSize: `${12 + ((i * 7) % 10)}px`,
            animationDelay: `${(i * 1.3) % 6}s`,
            animationDuration: `${9 + (i % 4) * 3}s`,
            filter: 'saturate(0.9)',
          }}
        >
          {e}
        </span>
      ))}
    </div>
  )
}

export function MedicalMapCanvas({
  variant = 'full',
  className,
  showHeader,
}: {
  variant?: 'full' | 'hero'
  className?: string
  showHeader?: boolean
}) {
  const hero = variant === 'hero'
  // Default: full variant shows its compact header, hero does not.
  const withHeader = showHeader ?? !hero
  const mapScope = useAppStore(s => s.mapScope)
  const setMapScope = useAppStore(s => s.setMapScope)
  const conceptFocus = useAppStore(s => s.conceptFocus)
  const openConcept = useAppStore(s => s.openConcept)
  const setQuizPreset = useAppStore(s => s.setQuizPreset)
  const setAppView = useAppStore(s => s.setView)
  const reduceMotion = useReducedMotion()

  // Arriving from a focused concept (e.g. opened from Home) → neighborhood scope
  const [scope, setScope] = useState(() => (conceptFocus ? `concept:${conceptFocus}` : 'all'))
  const [data, setData] = useState<GraphPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<SubjectSummary[]>([])
  const [hover, setHover] = useState<{ node: MapNode; left: number; top: number; containerW: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [view, setView] = useState({ k: 1, x: 0, y: 0 })
  // Client-side status quick-filter — 'attention' = weak/unstable, 'unlearned' = new,
  // 'struggle' = the hardest topics (difficulty ≥ 4 AND mastery < 45)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  // Guided-tour state (null = not touring)
  const [tour, setTour] = useState<TourState | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const dragRef = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null)
  const movedRef = useRef(false)
  const lastOpenRef = useRef(0)

  const load = useCallback(async (s: string) => {
    setLoading(true)
    setError(null)
    try {
      const d = await api.graph(s)
      setData(d)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load the medical map')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load(scope) }, [scope, load])

  // Pending scope handed over from the dashboard Branch Galaxy / Roadmap.
  // 'tour' is NOT a scope — it's consumed by the auto-tour effect below.
  useEffect(() => {
    if (!mapScope || mapScope === 'tour') return
    setScope(mapScope)
    setMapScope(null)
  }, [mapScope, setMapScope])

  // Reset viewport whenever the scope changes
  useEffect(() => {
    setView({ k: 1, x: 0, y: 0 })
    setHover(null)
  }, [scope])

  useEffect(() => {
    let cancelled = false
    api.subjects()
      .then(d => { if (!cancelled) setSubjects(d.subjects) })
      .catch(() => { /* subject filter is optional — ignore fetch failure */ })
    return () => { cancelled = true }
  }, [])

  // Zoom around the cursor — viewBox-unit math (letterbox-aware)
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = svg.getBoundingClientRect()
      const s = Math.min(rect.width / VIEW_W, rect.height / VIEW_H)
      const ox = (rect.width - VIEW_W * s) / 2
      const oy = (rect.height - VIEW_H * s) / 2
      const cx = (e.clientX - rect.left - ox) / s
      const cy = (e.clientY - rect.top - oy) / s
      setView(prev => {
        const k = clamp(prev.k * Math.exp(-e.deltaY * 0.0016), MIN_ZOOM, MAX_ZOOM)
        const ratio = k / prev.k
        return { k, x: cx - (cx - prev.x) * ratio, y: cy - (cy - prev.y) * ratio }
      })
    }
    svg.addEventListener('wheel', onWheel, { passive: false })
    return () => svg.removeEventListener('wheel', onWheel)
  }, [])

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (dragRef.current) return // already panning (multi-touch guard)
    dragRef.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y }
    movedRef.current = false
    setDragging(true)
    setHover(null)
  }

  // Drag lifecycle as a window-listener effect: no pointer capture (which would
  // retarget `click` away from nodes), and works for mouse + touch alike.
  useEffect(() => {
    if (!dragging) return
    const start = dragRef.current
    if (!start) return
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.px
      const dy = ev.clientY - start.py
      if (Math.abs(dx) + Math.abs(dy) > 6) movedRef.current = true
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const s = Math.min(rect.width / VIEW_W, rect.height / VIEW_H)
      setView(prev => ({ k: prev.k, x: start.vx + dx / s, y: start.vy + dy / s }))
    }
    const onUp = () => {
      dragRef.current = null
      setDragging(false)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging])

  const onNodeClick = (id: string) => {
    if (movedRef.current) return
    const now = Date.now()
    if (now - lastOpenRef.current < 350) return // ignore double-click spam (would open+close)
    lastOpenRef.current = now
    if (tour) setTour(null) // manual exploration takes over from the tour
    openConcept(id)
  }

  const showHover = useCallback((n: LaidNode) => {
    if (dragRef.current) return // suppress tooltips while panning
    const g = gRef.current
    const container = containerRef.current
    if (!g || !container) return
    const ctm = g.getScreenCTM()
    if (!ctm) return
    const pt = new DOMPoint(n.x, n.y).matrixTransform(ctm)
    const rect = container.getBoundingClientRect()
    setHover({ node: n.node, left: pt.x - rect.left, top: pt.y - rect.top, containerW: rect.width })
  }, [])

  const layout = useMemo(() => {
    if (!data) return null
    return forceLayout(
      data.nodes.map(n => ({ id: n.id, r: radiusOf(n) })),
      data.edges.map(e => ({ from: e.from, to: e.to })),
      { width: VIEW_W, height: VIEW_H, seed: SEED },
    )
  }, [data])

  // Guided tour camera: ease the viewport so the active stop sits mid-canvas
  // (declared after `layout` — the memo it reads)
  useEffect(() => {
    if (!tour || !layout) return
    const stop = tour.stops[tour.index]
    const pos = layout.get(stop?.id)
    if (!stop || !pos) return
    const k = 1.4
    setView({
      k,
      x: clamp(VIEW_W / 2 - k * pos.x, VIEW_W * (1 - k), 0),
      y: clamp(VIEW_H / 2 - k * pos.y, VIEW_H * (1 - k), 0),
    })
  }, [tour, layout])

  // Layout positions are computed for the full payload (so toggling filters never
  // reflows the graph), then the status filter hides nodes + touching edges.
  const nodes: LaidNode[] = useMemo(() => {
    if (!data || !layout) return []
    const laid = data.nodes.flatMap(n => {
      const pos = layout.get(n.id)
      return pos ? [{ node: n, x: pos.x, y: pos.y }] : []
    })
    const visible = laid.filter(n =>
      statusFilter === 'all'
        ? true
        : statusFilter === 'attention'
          ? n.node.status === 'weak' || n.node.status === 'unstable'
          : statusFilter === 'unlearned'
            ? n.node.status === 'new'
            : isStruggle(n.node),
    )
    // Label collision softening (deterministic, no mutation): among visible nodes
    // sharing a y-band, alternate the label above/below by parity of preceding
    // collisions. Edge-of-canvas nodes flip toward the safe side.
    return visible.map((n, i) => {
      const stacked = visible.reduce(
        (cnt, p, j) => (j < i && Math.abs(p.y - n.y) < LABEL_COLLIDE_Y ? cnt + 1 : cnt),
        0,
      )
      const nearTop = n.y < 34
      const nearBottom = n.y > VIEW_H - 26
      return {
        ...n,
        labelAbove: nearTop ? false : nearBottom ? true : stacked % 2 === 0,
      }
    })
  }, [data, layout, statusFilter])

  const edges = useMemo(() => {
    if (!data || !layout) return []
    const visibleIds = new Set(nodes.map(n => n.node.id))
    return data.edges
      .map((e, i) => {
        const a = layout.get(e.from)
        const b = layout.get(e.to)
        if (!a || !b) return null
        return { key: `${e.from}-${e.to}-${e.type}-${i}`, ...e, x1: a.x, y1: a.y, x2: b.x, y2: b.y }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null && visibleIds.has(e.from) && visibleIds.has(e.to))
  }, [data, layout, nodes])

  const struggleCount = useMemo(
    () => (data ? data.nodes.filter(isStruggle).length : 0),
    [data],
  )

  // Degree map for hub discovery (undirected)
  const degreeMap = useMemo(() => {
    const m = new Map<string, number>()
    if (!data) return m
    for (const e of data.edges) {
      m.set(e.from, (m.get(e.from) ?? 0) + 1)
      m.set(e.to, (m.get(e.to) ?? 0) + 1)
    }
    return m
  }, [data])

  const startTour = useCallback(() => {
    if (!data) return
    const struggles: TourStop[] = data.nodes
      .filter(isStruggle)
      .sort((a, b) => b.difficulty * (100 - b.mastery) * b.examRelevance - a.difficulty * (100 - a.mastery) * a.examRelevance)
      .slice(0, 4)
      .map(n => ({
        id: n.id, name: n.name, kind: n.kind, mastery: n.mastery,
        difficulty: n.difficulty, status: n.status, tag: 'struggle' as const,
        degree: degreeMap.get(n.id) ?? 0,
        reason: `Difficulty ${n.difficulty}/5 with only ${n.mastery}% mastery — high-yield territory where NEET-PG loves to set traps. Start here, then drill its connections.`,
      }))
    const struggleIds = new Set(struggles.map(s => s.id))
    const hubs: TourStop[] = [...degreeMap.entries()]
      .map(([id, degree]) => ({ id, degree, node: data.nodes.find(n => n.id === id) }))
      .filter((x): x is { id: string; degree: number; node: MapNode } => !!x.node)
      .filter(x => !struggleIds.has(x.id) && x.degree >= 2)
      .sort((a, b) => b.degree - a.degree)
      .slice(0, struggles.length ? 2 : 4)
      .map(({ id, degree, node }) => ({
        id, name: node.name, kind: node.kind, mastery: node.mastery,
        difficulty: node.difficulty, status: node.status, tag: 'hub' as const,
        degree,
        reason: `A crossroads: ${degree} concepts connect through this one. Mastering it unlocks a whole cluster on the map — the highest-leverage recall you can build.`,
      }))
    const stops = [...struggles, ...hubs]
    if (!stops.length) return
    setHover(null)
    setTour({ stops, index: 0 })
  }, [data, degreeMap])

  // Tour stop → focused quiz hand-off (closes the tour; preset drives Question Lab)
  const practiceStop = useCallback((stopId: string) => {
    setQuizPreset({ conceptId: stopId, count: 5 })
    setTour(null)
    setAppView('questions')
  }, [setQuizPreset, setAppView])

  // Pending scope 'tour' (handed over from the Roadmap "Repair weakest" block)
  // → auto-start the guided tour once the graph data has loaded.
  useEffect(() => {
    if (mapScope !== 'tour' || !data) return
    setMapScope(null)
    startTour()
  }, [mapScope, data, setMapScope, startTour])

  const centerId = scope.startsWith('concept:') ? scope.slice(8) : null
  const centerName = centerId ? data?.nodes.find(n => n.id === centerId)?.name ?? 'Focused concept' : null
  const subjectSel = scope.startsWith('subject:') ? scope.slice(8) : '__all__'

  // Zoom-aware label decluttering: zoomed out, only major nodes keep labels.
  const showAllLabels = view.k >= LABEL_MIN_ZOOM
  const isMajorNode = (n: MapNode) =>
    radiusOf(n) >= MAJOR_RADIUS || n.status === 'weak' || n.status === 'unstable' || isStruggle(n) || n.id === centerId

  return (
    <div className={cn('space-y-3', className)}>
      {/* ── Header (full variant only, can be suppressed) ── */}
      {!hero && withHeader && (
        <header className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-primary md:size-11">
            <Waypoints className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">MEDICAL MAP</h1>
            <p className="text-xs text-ink-soft md:text-sm">Travel the connections between concepts, diseases and drugs.</p>
          </div>
        </header>
      )}

      {/* ── Scope bar ── */}
      <div className="flex flex-wrap items-center gap-2">
        <ScopeChip active={scope === 'all'} onClick={() => setScope('all')}>All</ScopeChip>
        {SYSTEMS.map(sys => {
          const Icon = SYSTEM_ICONS[sys.icon]
          const active = scope === `system:${sys.id}`
          return (
            <ScopeChip key={sys.id} active={active} onClick={() => setScope(active ? 'all' : `system:${sys.id}`)}>
              {Icon && <Icon className="size-3.5" />}
              {sys.label}
            </ScopeChip>
          )
        })}
        {/* status quick-filter chips (client-side only) */}
        <span aria-hidden className="mx-1 hidden h-6 w-px shrink-0 bg-line md:block" />
        <ScopeChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>ALL</ScopeChip>
        <ScopeChip active={statusFilter === 'struggle'} onClick={() => setStatusFilter(statusFilter === 'struggle' ? 'all' : 'struggle')}>
          <Zap className="size-3.5 text-sev-warn" />
          STRUGGLE ZONES
          {struggleCount > 0 && (
            <span className="ml-0.5 rounded-full bg-sev-crit/15 px-1.5 text-[10px] font-bold text-sev-crit">{struggleCount}</span>
          )}
        </ScopeChip>
        <ScopeChip active={statusFilter === 'attention'} onClick={() => setStatusFilter('attention')}>
          <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: 'var(--sev-warn)' }} />
          NEEDS WORK
        </ScopeChip>
        <ScopeChip active={statusFilter === 'unlearned'} onClick={() => setStatusFilter('unlearned')}>
          <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: 'var(--muted-foreground)' }} />
          NOT YET LEARNED
        </ScopeChip>
        {/* guided tour — walks the most important stops, struggle zones first */}
        <ScopeChip
          active={!!tour}
          onClick={() => (tour ? setTour(null) : startTour())}
          className={cn(!tour && 'border-primary/40 text-primary hover:border-primary hover:text-primary')}
        >
          <Compass className="size-3.5" />
          GUIDED TOUR
        </ScopeChip>
        <div className="ml-auto">
          <Select
            value={subjectSel}
            onValueChange={v => setScope(v === '__all__' ? 'all' : `subject:${v}`)}
          >
            <SelectTrigger className="h-9 w-[170px] text-xs md:w-[210px]" aria-label="Filter map by subject">
              <SelectValue placeholder="Subject view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All subjects</SelectItem>
              {subjects.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Legend + node count ── */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-ink-soft">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {Object.entries(KIND_META).map(([kind, meta]) => (
            <span key={kind} className="inline-flex items-center gap-1">
              <span aria-hidden className="text-[11px]">{KIND_EMOJI[kind]}</span>
              {meta.label}
            </span>
          ))}
        </div>
        <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
          {STATUS_ORDER.map(s => (
            <span key={s} className="inline-flex items-center gap-1">
              <span className="size-2.5 rounded-full border-2 bg-transparent" style={{ borderColor: STATUS_COLORS[s] }} />
              {STATUS_LABELS[s]}
            </span>
          ))}
          <span className="inline-flex items-center gap-1">
            <Mountain className="size-3 text-sev-crit" /> Struggle zone
          </span>
        </span>
        {data && !loading && (
          <span className="ml-auto font-medium text-foreground/75">
            {statusFilter === 'all'
              ? `${nodes.length} nodes · ${edges.length} links`
              : `${nodes.length} shown · ${data.nodes.length} mapped`}
          </span>
        )}
      </div>

      {/* ── Graph canvas ── */}
      <div
        ref={containerRef}
        className={cn(
          'relative overflow-hidden rounded-3xl border border-line bg-surface-2 med-grid',
          hero ? 'h-[420px] md:h-[560px]' : 'h-[520px] md:h-[640px]',
        )}
        onDoubleClick={() => setView({ k: 1, x: 0, y: 0 })}
      >
        {hero && <SceneBackdrop />}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label="Medical knowledge graph"
          className={cn('relative h-full w-full select-none touch-none', dragging ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing')}
          onPointerDown={onPointerDown}
        >
          <g ref={gRef} transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
            {/* edges under nodes */}
            {edges.map(e => {
              const st = edgeVisual(e.type)
              return (
                <motion.line
                  key={e.key}
                  x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                  stroke={st.stroke}
                  strokeWidth={st.width}
                  strokeDasharray={st.dasharray}
                  strokeLinecap="round"
                  initial={{ strokeOpacity: 0 }}
                  animate={{ strokeOpacity: st.opacity }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ pointerEvents: 'none' }}
                />
              )
            })}
            {/* nodes */}
            {nodes.map((n, i) => {
              const r = radiusOf(n.node)
              const statusColor = STATUS_COLORS[n.node.status] ?? 'var(--muted-foreground)'
              const kindColor = KIND_META[n.node.kind]?.color ?? 'var(--muted-foreground)'
              const isCenter = n.node.id === centerId
              const struggle = isStruggle(n.node)
              const pulse = !reduceMotion && (struggle || ((n.node.status === 'weak' || n.node.status === 'unstable') && n.node.mastery > 0))
              const emoji = KIND_EMOJI[n.node.kind] ?? ''
              const tourStop = tour?.stops[tour.index]
              const isTourFocus = !!tour && tourStop?.id === n.node.id
              const tourDim = !!tour && !isTourFocus
              return (
                <g key={n.node.id} transform={`translate(${n.x} ${n.y})`} opacity={tourDim ? 0.25 : 1}>
                  <motion.g
                    className="cursor-pointer"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: Math.min(i * 0.012, 0.6) }}
                    onPointerEnter={() => showHover(n)}
                    onPointerLeave={() => setHover(h => (h?.node.id === n.node.id ? null : h))}
                    onClick={() => onNodeClick(n.node.id)}
                  >
                    {isTourFocus && (
                      <motion.circle
                        r={r + 12}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        initial={{ opacity: 0.9 }}
                        animate={reduceMotion ? { opacity: 0.9 } : { opacity: [0.9, 0.25] }}
                        transition={reduceMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    {pulse && (
                      <motion.circle
                        r={r + 9}
                        fill="none"
                        stroke={struggle ? 'var(--sev-crit)' : statusColor}
                        strokeWidth={1.5}
                        initial={{ opacity: 0.55 }}
                        animate={{ opacity: [0.55, 0.05] }}
                        transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    {struggle && (
                      <circle
                        r={r + 5}
                        fill="none"
                        stroke="var(--sev-crit)"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        opacity={0.85}
                      />
                    )}
                    {isCenter && (
                      <circle r={r + 7} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeDasharray="4 4" opacity={0.9} />
                    )}
                    <circle r={r} fill={n.node.subjectColor} fillOpacity={0.85} stroke={statusColor} strokeWidth={2.5} />
                    {emoji && r >= 20 ? (
                      <text
                        textAnchor="middle"
                        y={r * 0.32}
                        fontSize={r * 0.78}
                        style={{ pointerEvents: 'none' }}
                        aria-hidden
                      >
                        {emoji}
                      </text>
                    ) : (
                      <circle r={Math.max(3.5, r * 0.24)} fill={kindColor} opacity={0.9} style={{ pointerEvents: 'none' }} />
                    )}
                    {struggle && (
                      <text
                        x={r * 0.62}
                        y={-r * 0.62}
                        textAnchor="middle"
                        fontSize={12}
                        style={{ pointerEvents: 'none' }}
                        aria-hidden
                      >
                        {STRUGGLE_EMOJI}
                      </text>
                    )}
                    <motion.text
                      y={n.labelAbove ? -(r + 8) : r + 15}
                      textAnchor="middle"
                      fontSize={11}
                      fill="var(--foreground)"
                      fillOpacity={0.8}
                      // legibility halo — opaque in dark AND light mode, sits under
                      // the glyphs via paint-order so edges crossing beneath stay muted
                      stroke="var(--background)"
                      strokeWidth={3}
                      strokeLinejoin="round"
                      paintOrder="stroke"
                      style={{ pointerEvents: 'none' }}
                      initial={false}
                      animate={{ opacity: showAllLabels || isMajorNode(n.node) ? 1 : 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
                    >
                      {truncateLabel(n.node.name)}
                    </motion.text>
                  </motion.g>
                </g>
              )
            })}
          </g>
        </svg>

        {/* focused-concept chip */}
        {centerName && (
          <div className="absolute left-3 top-3 z-30 flex max-w-[70%] items-center gap-2 rounded-full border border-line bg-card/90 py-1.5 pl-3 pr-1.5 text-xs shadow-sm backdrop-blur">
            <Focus className="size-3.5 shrink-0 text-primary" />
            <span className="truncate font-medium">{centerName}</span>
            <button
              type="button"
              onClick={() => setScope('all')}
              aria-label="Clear concept focus"
              className="inline-flex min-h-11 items-center justify-center rounded-full p-1 text-ink-soft transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        {/* struggle-zone banner (hero) */}
        {hero && struggleCount > 0 && !tour && (
          <div className="absolute left-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-sev-crit/30 bg-sev-crit/10 px-3 py-1.5 text-[11px] font-semibold text-sev-crit shadow-sm backdrop-blur">
            <TriangleAlert className="size-3.5" />
            {struggleCount} struggle zones on your map
          </div>
        )}

        {/* ── Guided tour card ── */}
        {tour && tour.stops[tour.index] && (() => {
          const stop = tour.stops[tour.index]
          const last = tour.index === tour.stops.length - 1
          return (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-14 left-1/2 z-30 w-[min(560px,94%)] -translate-x-1/2"
              role="complementary"
              aria-label="Guided tour"
            >
              <div className="rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-2xl backdrop-blur md:p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    <Compass className="size-3.5" />
                    Guided tour · stop {tour.index + 1} of {tour.stops.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTour(null)}
                    className="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium text-ink-soft transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-3" /> Exit tour
                  </button>
                </div>

                <h4 className="mt-2 text-lg font-semibold leading-snug tracking-tight">
                  {KIND_EMOJI[stop.kind] ?? '💡'} {stop.name}
                </h4>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className={cn(
                    'rounded-full px-2 py-0.5 font-bold uppercase tracking-wide',
                    stop.tag === 'struggle' ? 'bg-sev-crit/10 text-sev-crit' : 'bg-primary/10 text-primary',
                  )}>
                    {stop.tag === 'struggle' ? '⚠️ Struggle zone' : '⭐ Hub concept'}
                  </span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-ink-soft">
                    {KIND_META[stop.kind]?.label ?? stop.kind}
                  </span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-ink-soft tabular-nums">
                    mastery {stop.mastery}%
                  </span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-ink-soft tabular-nums">
                    difficulty {stop.difficulty}/5
                  </span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-ink-soft tabular-nums">
                    {stop.degree} links
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{stop.reason}</p>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-9"
                    disabled={tour.index === 0}
                    onClick={() => setTour(t => (t ? { ...t, index: t.index - 1 } : t))}
                  >
                    ← Prev
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-9"
                    onClick={() => { setTour(null); openConcept(stop.id) }}
                  >
                    Open explorer
                  </Button>
                  <Button
                    size="sm"
                    className="min-h-9 gap-1"
                    onClick={() => practiceStop(stop.id)}
                  >
                    <Play className="size-3.5" /> Practice
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto min-h-9"
                    onClick={() => (last ? setTour(null) : setTour(t => (t ? { ...t, index: t.index + 1 } : t)))}
                  >
                    {last ? 'Finish tour 🌿' : 'Next stop →'}
                  </Button>
                </div>
                {/* progress dots */}
                <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden>
                  {tour.stops.map((s, i) => (
                    <span
                      key={s.id}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === tour.index ? 'w-6 bg-primary' : 'w-1.5 bg-line',
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })()}

        {/* zoom indicator — doubles as click-to-reset */}
        <button
          type="button"
          onClick={() => setView({ k: 1, x: 0, y: 0 })}
          aria-label={`Zoom level ×${view.k.toFixed(1)} — click to reset view`}
          className="absolute bottom-3 right-3 z-30 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-card/90 px-3.5 py-1.5 text-xs font-medium tabular-nums text-ink-soft shadow-sm backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Maximize2 className="size-3.5" />
          ×{view.k.toFixed(1)}
        </button>

        {/* tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-10 w-max max-w-[250px]"
            style={{
              left: clamp(hover.left, 130, Math.max(hover.containerW - 130, 130)),
              top: hover.top,
              transform: hover.top < 140 ? 'translate(-50%, 20px)' : 'translate(-50%, calc(-100% - 16px))',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.16, ease: 'easeOut' }}
              style={{ transformOrigin: hover.top < 140 ? '50% 0%' : '50% 100%' }}
              className="rounded-xl border border-line bg-card/95 p-3 shadow-xl backdrop-blur"
            >
              <p className="text-sm font-medium leading-snug">{hover.node.name}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-soft">
                <span aria-hidden>{KIND_EMOJI[hover.node.kind] ?? '•'}</span>
                {KIND_META[hover.node.kind]?.label ?? hover.node.kind} · {hover.node.subjectCode}
                {hover.node.difficulty >= 4 && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-sev-crit/10 px-1.5 py-0.5 font-semibold text-sev-crit">
                    <Mountain className="size-2.5" /> difficulty {hover.node.difficulty}/5
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{hover.node.summary}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                <span className="font-medium" style={{ color: STATUS_COLORS[hover.node.status] ?? 'var(--muted-foreground)' }}>
                  Mastery {hover.node.mastery}%
                </span>
                <span className="text-muted-foreground">{STATUS_LABELS[hover.node.status] ?? hover.node.status}</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-3xl bg-surface-2/85 backdrop-blur-sm">
            <div className="flex items-end gap-2">
              <div className="shimmer size-3 rounded-full" />
              <div className="shimmer size-5 rounded-full" />
              <div className="shimmer size-8 rounded-full" />
              <div className="shimmer size-5 rounded-full" />
              <div className="shimmer size-3 rounded-full" />
            </div>
            <div className="shimmer h-2 w-44 rounded-full" />
            <p className="text-xs text-ink-soft">Charting the knowledge graph…</p>
          </div>
        )}

        {/* error overlay */}
        {!loading && error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-3xl bg-surface-2/85 p-6 text-center backdrop-blur-sm">
            <TriangleAlert className="size-8 text-sev-crit" />
            <p className="text-sm font-medium">The map could not be charted</p>
            <p className="max-w-sm truncate text-xs text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => void load(scope)}>
              <RotateCcw className="size-4" /> Retry
            </Button>
          </div>
        )}

        {/* empty scope */}
        {!loading && !error && data && data.nodes.length === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <Waypoints className="size-7 text-muted-foreground" />
            <p className="text-sm font-medium">Nothing mapped here yet</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              No concepts fall inside this scope. Try another system or subject.
            </p>
          </div>
        )}

        {/* status filter emptied the view (scope itself is untouched) */}
        {!loading && !error && data && data.nodes.length > 0 && nodes.length === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <Filter className="size-7 text-muted-foreground" />
            <p className="text-sm font-medium">Nothing matches this filter</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              {statusFilter === 'struggle'
                ? 'Great news — no struggle zones in this scope. Clear the filter to see the full map.'
                : 'No concepts in this scope have that learning status. Clear the filter to see the full map.'}
            </p>
            <Button variant="outline" size="sm" className="min-h-11" onClick={() => setStatusFilter('all')}>
              <RotateCcw className="size-4" /> Show all
            </Button>
          </div>
        )}
      </div>

      {/* ── Footer hint ── */}
      <p className="text-[11px] text-muted-foreground">
        Click a node to open its explorer · Drag to pan · Scroll to zoom · ⚠️ = struggle zone (hard &amp; unmastered)
      </p>
    </div>
  )
}

export function MedicalMapView() {
  const reduce = useReducedMotion()
  const [insights, setInsights] = useState<MapInsights | null>(null)

  useEffect(() => {
    let ok = true
    api.mapInsights().then(d => { if (ok) setInsights(d) }).catch(() => {})
    return () => { ok = false }
  }, [])

  const struggleZones = insights?.struggleZones ?? []
  const branches = insights?.branches ?? []
  const totalConcepts = branches.reduce((a, b) => a + b.conceptCount, 0)

  return (
    <div className="space-y-5">
      {/* ── Warm universe hero — the crown of the Medical Map page ── */}
      <section className="warm-scene relative overflow-hidden rounded-3xl p-4 md:p-6" aria-label="The Medical Map">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <MapSceneImage src="/scenes/dawn-meadow.jpg" alt="" />
          <div className="scene-dawn absolute inset-0" />
          <div className="scene-float absolute -left-10 -top-12 size-56 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="scene-float absolute -right-16 top-24 size-64 rounded-full bg-amber-300/20 blur-3xl" style={{ animationDelay: '2.5s' }} />
          {/* drifting nature friends */}
          {['🗺️', '🍃', '☁️', '🌿', '🦋'].map((e, i) => (
            <motion.span
              key={i}
              className="absolute select-none text-base opacity-50 md:text-lg"
              animate={reduce ? undefined : { y: [0, -14, 0, 10, 0], rotate: [0, 8, 0, -6, 0] }}
              transition={reduce ? undefined : { duration: 9 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.1 }}
              style={{ left: `${8 + i * 21}%`, top: `${(i % 2 === 0 ? 4 : 62)}%` }}
            >
              {e}
            </motion.span>
          ))}
        </div>

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft">Your medical universe</p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight md:text-3xl">
              The Medical Map
              <motion.span aria-hidden animate={reduce ? undefined : { y: [0, -3, 0] }} transition={{ duration: 2.6, repeat: Infinity }}>🗺️</motion.span>
            </h1>
            <p className="mt-1 max-w-xl text-xs text-ink-soft md:text-sm">
              Every concept is a place. {totalConcepts} concepts across {branches.length} branches, connected by how medicine
              actually works — drag, zoom and wander. Click any node to open its explorer.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="clay-in rounded-xl px-3 py-2 text-center">
              <span className="block text-lg font-semibold tabular-nums leading-none">{totalConcepts}</span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">concepts</span>
            </span>
            <span className="clay-in rounded-xl px-3 py-2 text-center">
              <span className="block text-lg font-semibold tabular-nums leading-none text-sev-crit">{struggleZones.length}</span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">struggle zones</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── The interactive map (header suppressed — hero above) ── */}
      <MedicalMapCanvas variant="full" showHeader={false} />

      {/* ── Struggle zones — the topics students find hardest ── */}
      {struggleZones.length > 0 && (
        <section aria-label="Struggle zones">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
              <TriangleAlert className="size-4 text-sev-crit" />
              Struggle zones
              <span className="rounded-full bg-sev-crit/10 px-2 py-0.5 text-[10px] font-bold text-sev-crit">
                hardest topics nationwide
              </span>
            </h2>
            <p className="text-[11px] text-ink-soft">High difficulty × low mastery × high NEET-PG yield</p>
          </div>
          <ul className="grid max-h-[27rem] grid-cols-1 gap-3 overflow-y-auto pb-1 pr-1 med-scroll sm:grid-cols-2 lg:grid-cols-3">
            {struggleZones.map((z, i) => (
              <StruggleZoneCard key={z.conceptId} zone={z} index={i} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
