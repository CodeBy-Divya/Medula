'use client'

// ─── 3D VISUAL VIEWER — topics rendered as floating 3D layer diagrams ───
// Drag to orbit the stack, tap a layer to fly it forward, read the simple
// explanation. Falls back to a concept-generated stack when no custom
// diagram exists (see src/lib/visual3d.ts).

import { useCallback, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Compass, Hand, RotateCcw, Sparkles, Stethoscope, Waypoints } from 'lucide-react'
import type { ConceptDetail } from '@/lib/types'
import { getDiagram3D, type Diagram3D, type Layer3D } from '@/lib/visual3d'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TINT_FALLBACK = ['#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#22d3ee', '#f97316', '#2dd4bf']

function layerTint(l: Layer3D, i: number): string {
  return l.tint ?? TINT_FALLBACK[i % TINT_FALLBACK.length]
}

export function Concept3D({ detail }: { detail: ConceptDetail }) {
  const reduce = useReducedMotion()
  const diagram: Diagram3D = useMemo(() => getDiagram3D(detail.id, detail), [detail])

  const [activeId, setActiveId] = useState<string | null>(diagram.layers[0]?.id ?? null)
  const [rot, setRot] = useState({ x: -14, y: 22 })
  const [autoOrbit, setAutoOrbit] = useState(false)
  const dragRef = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)
  const movedRef = useRef(false)

  const active = diagram.layers.find(l => l.id === activeId) ?? null

  // pointer-drag orbiting
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y }
    movedRef.current = false
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }, [rot])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > 6) movedRef.current = true
    const nx = Math.max(-62, Math.min(30, d.rx - dy * 0.35))
    const ny = Math.max(-80, Math.min(80, d.ry + dx * 0.4))
    setRot({ x: nx, y: ny })
  }, [])

  const onPointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  const onLayerClick = (id: string) => {
    if (movedRef.current) return // it was a drag, not a click
    setActiveId(cur => (cur === id ? null : id))
  }

  const reset = () => {
    setRot({ x: -14, y: 22 })
    setAutoOrbit(false)
  }

  const custom = diagram.layers.some(l => l.detail && l.simple !== l.detail)

  return (
    <div className="space-y-3" data-testid="concept-3d">
      {/* intro strip */}
      <div className="flex flex-wrap items-start gap-3">
        <span
          aria-hidden
          className="clay-in grid size-11 shrink-0 place-items-center rounded-2xl text-xl"
        >
          {diagram.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="size-3" /> 3D visual learning
          </p>
          <h3 className="mt-0.5 text-base font-semibold tracking-tight">{diagram.title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{diagram.intro}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAutoOrbit(v => !v)}
            aria-pressed={autoOrbit}
            className={cn(
              'clay-btn-soft inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium',
              autoOrbit && 'ring-2 ring-primary',
            )}
          >
            <Compass className={cn('size-3.5', !reduce && autoOrbit && 'animate-spin [animation-duration:6s]')} />
            Orbit
          </button>
          <button
            type="button"
            onClick={reset}
            className="clay-btn-soft inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium"
            aria-label="Reset 3D view"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* 3D stage — the OUTER wrapper carries the clip: elements that establish
          perspective cannot reliably clip their own 3D children (both
          overflow-hidden and same-element clip-path get bypassed), but a plain
          wrapper with clip-path forces flattening of the rendered output. */}
      <div
        className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-sky-400/[0.07] via-transparent to-amber-300/[0.06] [clip-path:inset(0_round_1rem)]"
        style={{ height: 340, touchAction: 'pan-y' }}
        role="application"
        aria-label={`Interactive 3D diagram of ${diagram.title}. Drag to rotate, click a layer to inspect it.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="stage3d absolute inset-0">
        {/* scene backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="scene-dawn absolute inset-0 opacity-60" />
          <div className="absolute bottom-3 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[100%] bg-primary/10 blur-2xl" />
        </div>

        {/* drag hint */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full border border-line bg-card/80 px-2.5 py-1 text-[10px] font-medium text-ink-soft backdrop-blur"
        >
          <Hand className="size-3" /> drag to rotate
        </span>

        <motion.div
          className="scene3d-plane absolute inset-0 grid place-items-center"
          animate={reduce ? { rotateX: rot.x, rotateY: rot.y } : { rotateX: rot.x, rotateY: autoOrbit ? undefined : rot.y }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* auto-orbit wrapper — separate so drag and orbit don't fight */}
          {autoOrbit && !reduce ? (
            <div
              className="scene3d-plane relative h-full w-full"
              style={{ animation: 'orbit-spin 16s linear infinite' }}
            >
              <LayerStack
                diagram={diagram}
                activeId={activeId}
                onLayerClick={onLayerClick}
                reduce={reduce}
              />
            </div>
          ) : (
            <LayerStack diagram={diagram} activeId={activeId} onLayerClick={onLayerClick} reduce={reduce} />
          )}
        </motion.div>

        {/* active layer caption ribbon */}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-30">
          <p className="w-fit max-w-full truncate rounded-full border border-line bg-card/85 px-3 py-1 text-[11px] font-medium backdrop-blur">
            {active ? (
              <>
                <span aria-hidden className="mr-1">{active.emoji}</span>
                {active.label}
                <span className="mx-1.5 text-primary">·</span>
                <span className="text-ink-soft">{active.simple}</span>
              </>
            ) : (
              'Tap a layer to inspect it ↗'
            )}
          </p>
        </div>
        </div>{/* /.stage3d */}
      </div>

      {/* layer chips — a second, organized way into the diagram (z-10 keeps
          them clickable above any 3D content projected out of the stage) */}
      <div className="relative z-10 flex flex-wrap gap-1.5" role="tablist" aria-label="Diagram layers">
        {diagram.layers.map((l, i) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={activeId === l.id}
            onClick={() => setActiveId(l.id)}
            className={cn(
              'clay-btn-soft inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium transition-all',
              activeId === l.id && 'ring-2 ring-primary',
            )}
          >
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ background: layerTint(l, i) }}
            />
            {l.label}
          </button>
        ))}
      </div>

      {/* explanation panel for the active layer */}
      {active && (
        <motion.div
          key={active.id}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="clay relative z-10 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-xl text-base"
              style={{ background: `${layerTint(active, diagram.layers.indexOf(active))}22` }}
            >
              {active.emoji}
            </span>
            <h4 className="text-sm font-semibold tracking-tight">{active.label}</h4>
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              simple first
            </span>
          </div>
          <p className="mt-2.5 text-sm leading-relaxed">{active.simple}</p>
          {active.detail && active.detail !== active.simple && (
            <p className="mt-2 border-l-2 border-primary/40 pl-3 text-xs leading-relaxed text-ink-soft">
              {active.detail}
            </p>
          )}
        </motion.div>
      )}

      {/* clinical anchor */}
      <p className="flex items-start gap-2 rounded-xl border border-sev-ok/25 bg-sev-ok/5 px-3 py-2.5 text-xs leading-relaxed text-ink-soft">
        <Stethoscope className="mt-0.5 size-3.5 shrink-0 text-sev-ok" />
        <span>{diagram.clinical}</span>
      </p>

      {!custom && (
        <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Waypoints className="size-3" />
          Layered from this concept&apos;s study notes — hand-drawn 3D scenes are being added to the highest-yield topics first.
        </p>
      )}
    </div>
  )
}

function LayerStack({
  diagram,
  activeId,
  onLayerClick,
  reduce,
}: {
  diagram: Diagram3D
  activeId: string | null
  onLayerClick: (id: string) => void
  reduce: boolean | null
}) {
  const n = diagram.layers.length
  return (
    <div className="scene3d-plane relative h-[220px] w-[300px] md:h-[240px] md:w-[360px]">
      {diagram.layers.map((l, i) => {
        const isActive = activeId === l.id
        const tint = layerTint(l, i)
        // spread layers through Z from back to front; active jumps forward
        const baseZ = (n - 1 - i) * 46
        const z = isActive ? baseZ + 100 : baseZ
        const yOffset = isActive ? 0 : i * 3
        return (
          <motion.button
            key={l.id}
            type="button"
            onClick={() => onLayerClick(l.id)}
            aria-pressed={isActive}
            aria-label={`${l.label}: ${l.simple}`}
            className={cn(
              'layer3d layer3d-card absolute inset-x-6 top-1/2 flex items-center gap-3 rounded-2xl p-3 text-left md:inset-x-10',
              isActive ? 'z-30' : 'z-10',
              !reduce && !isActive && 'layer3d-float',
            )}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: yOffset,
              z,
              rotateX: isActive ? 0 : -2,
              scale: isActive ? 1.02 : 1,
            }}
            transition={{ type: 'spring', stiffness: 170, damping: 22, delay: reduce ? 0 : i * 0.06 }}
            style={
              {
                '--lz': `${baseZ}px`,
                borderColor: isActive ? `${tint}88` : undefined,
                boxShadow: isActive
                  ? `0 26px 48px -18px ${tint}66, inset 0 1.5px 4px -1px var(--clay-hi), 0 0 0 1px ${tint}55`
                  : undefined,
              } as React.CSSProperties
            }
          >
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-xl text-lg"
              style={{
                background: `linear-gradient(150deg, ${tint}30, ${tint}12)`,
                boxShadow: `inset 0 1px 3px -1px ${tint}55, inset 0 -2px 4px -2px ${tint}33`,
              }}
            >
              {l.emoji}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold leading-tight">{l.label}</span>
              <span className="block truncate text-[10px] text-ink-soft">{l.simple}</span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
