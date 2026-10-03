'use client'

// ─── MEDICAL MAP — "Google Maps for medicine" ───
// Interactive SVG knowledge graph: pan, zoom, scoped views, drill into concepts.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Bone, Brain, Bug, Droplet, Droplets, Focus, HeartPulse, RotateCcw, Sparkles,
  TriangleAlert, Utensils, Waypoints, Wind, X, type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { KIND_META, SYSTEMS } from '@/lib/types'
import type { GraphPayload, SubjectSummary } from '@/lib/types'
import { forceLayout } from '@/lib/graph-layout'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type MapNode = GraphPayload['nodes'][number]
type LaidNode = { node: MapNode; x: number; y: number }

const VIEW_W = 1000
const VIEW_H = 640
const SEED = 42 // fixed → deterministic layout between renders
const MIN_ZOOM = 0.6
const MAX_ZOOM = 2.5

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

function truncate18(s: string): string {
  return s.length > 18 ? `${s.slice(0, 17)}…` : s
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function ScopeChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-line bg-surface text-ink-soft hover:border-primary/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

export function MedicalMapView() {
  const conceptFocus = useAppStore(s => s.conceptFocus)
  const openConcept = useAppStore(s => s.openConcept)
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

  const nodes: LaidNode[] = useMemo(() => {
    if (!data || !layout) return []
    return data.nodes
      .map(n => {
        const pos = layout.get(n.id)
        return pos ? { node: n, x: pos.x, y: pos.y } : null
      })
      .filter((n): n is LaidNode => n !== null)
  }, [data, layout])

  const edges = useMemo(() => {
    if (!data || !layout) return []
    return data.edges
      .map((e, i) => {
        const a = layout.get(e.from)
        const b = layout.get(e.to)
        if (!a || !b) return null
        return { key: `${e.from}-${e.to}-${e.type}-${i}`, ...e, x1: a.x, y1: a.y, x2: b.x, y2: b.y }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
  }, [data, layout])

  const centerId = scope.startsWith('concept:') ? scope.slice(8) : null
  const centerName = centerId ? data?.nodes.find(n => n.id === centerId)?.name ?? 'Focused concept' : null
  const subjectSel = scope.startsWith('subject:') ? scope.slice(8) : '__all__'

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <header className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-primary md:size-11">
          <Waypoints className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">MEDICAL MAP</h1>
          <p className="text-xs text-ink-soft md:text-sm">Travel the connections between concepts, diseases and drugs.</p>
        </div>
      </header>

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
              <span className="size-2 rounded-full" style={{ backgroundColor: meta.color }} />
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
        </span>
        {data && !loading && (
          <span className="ml-auto font-medium text-foreground/75">
            {data.nodes.length} nodes · {data.edges.length} links
          </span>
        )}
      </div>

      {/* ── Graph canvas ── */}
      <div
        ref={containerRef}
        className="relative h-[520px] overflow-hidden rounded-3xl border border-line bg-surface-2 med-grid md:h-[640px]"
        onDoubleClick={() => setView({ k: 1, x: 0, y: 0 })}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label="Medical knowledge graph"
          className={cn('h-full w-full select-none touch-none', dragging ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing')}
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
              const pulse = !reduceMotion && (n.node.status === 'weak' || n.node.status === 'unstable') && n.node.mastery > 0
              return (
                <g key={n.node.id} transform={`translate(${n.x} ${n.y})`}>
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
                    {pulse && (
                      <motion.circle
                        r={r + 9}
                        fill="none"
                        stroke={statusColor}
                        strokeWidth={1.5}
                        initial={{ opacity: 0.55 }}
                        animate={{ opacity: [0.55, 0.05] }}
                        transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    {isCenter && (
                      <circle r={r + 7} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeDasharray="4 4" opacity={0.9} />
                    )}
                    <circle r={r} fill={n.node.subjectColor} fillOpacity={0.85} stroke={statusColor} strokeWidth={2.5} />
                    <circle r={Math.max(3.5, r * 0.24)} fill={kindColor} opacity={0.9} style={{ pointerEvents: 'none' }} />
                    <text
                      y={r + 15}
                      textAnchor="middle"
                      fontSize={11}
                      fill="var(--foreground)"
                      fillOpacity={0.8}
                      style={{ pointerEvents: 'none' }}
                    >
                      {truncate18(n.node.name)}
                    </text>
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
              className="rounded-full p-1 text-ink-soft transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        {/* tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-10 w-max max-w-[250px] rounded-xl border border-line bg-card/95 p-3 shadow-xl backdrop-blur"
            style={{
              left: clamp(hover.left, 130, Math.max(hover.containerW - 130, 130)),
              top: hover.top,
              transform: hover.top < 140 ? 'translate(-50%, 20px)' : 'translate(-50%, calc(-100% - 16px))',
            }}
          >
            <p className="text-sm font-medium leading-snug">{hover.node.name}</p>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-soft">
              <span className="size-2 rounded-full" style={{ backgroundColor: KIND_META[hover.node.kind]?.color ?? 'var(--muted-foreground)' }} />
              {KIND_META[hover.node.kind]?.label ?? hover.node.kind} · {hover.node.subjectCode}
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{hover.node.summary}</p>
            <div className="mt-1.5 flex items-center gap-2 text-[11px]">
              <span className="font-medium" style={{ color: STATUS_COLORS[hover.node.status] ?? 'var(--muted-foreground)' }}>
                Mastery {hover.node.mastery}%
              </span>
              <span className="text-muted-foreground">{STATUS_LABELS[hover.node.status] ?? hover.node.status}</span>
            </div>
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
            <Button variant="outline" size="sm" onClick={() => void load(scope)}>
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
      </div>

      {/* ── Footer hint ── */}
      <p className="text-[11px] text-muted-foreground">
        Click a node to open its explorer · Drag to pan · Scroll to zoom · Dashed = prerequisite
      </p>
    </div>
  )
}
