'use client'

// ─── LIVING SCENE · The alveolus — where breath becomes blood ───
// A coral sac breathes in and out over an amber surfactant film, a rose
// capillary wraps its base with donut RBCs streaming past, sky-blue O₂ hops
// the 0.5 µm membrane into blood and binds haemoglobin while plum CO₂ hops
// back into the air. Steps spotlight each stage; a focused anchor dims the rest.

import { anchorGlow, type SceneProps } from './scene-contract'
import type { CSSProperties } from 'react'

const INK = '#7c2d12'
const CORAL = '#e2734d'
const CORAL_D = '#9a3412'
const SKY = '#38bdf8'
const SKY_D = '#0369a1'
const PLUM = '#a855f7'
const PLUM_D = '#6d28d9'
const ROSE = '#e11d48'
const ROSE_D = '#9f1239'
const AMBER_D = '#b45309'

// capillary centreline hugging the alveolar base (RBCs stream along it)
const D_CAP = 'M70,226 C140,264 230,276 300,266 C352,258 392,238 416,202'
// airway feeding the sac
const D_AIR = 'M22,52 C60,56 88,70 100,84'

// gas-exchange hops: O₂ air → blood, CO₂ blood → air
const D_O2 = [
  'M158,218 C158,232 160,244 166,254',
  'M182,228 C182,240 184,250 188,258',
  'M206,222 C208,234 210,244 216,252',
]
const D_CO2 = [
  'M236,258 C232,242 228,228 222,214 C216,200 208,190 198,182',
  'M258,254 C254,240 248,228 242,216 C238,206 232,198 226,190',
  'M282,244 C280,232 276,222 270,212 C264,202 256,194 248,188',
]

// narration step index → spotlighted anchor (understand-catalog order)
const STEPS = ['alv', 'membrane', 'o2', 'co2', 'perfusion'] as const

const SPOTS: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  alv: { cx: 185, cy: 142, rx: 116, ry: 116 },
  membrane: { cx: 185, cy: 222, rx: 98, ry: 38 },
  o2: { cx: 182, cy: 238, rx: 58, ry: 38 },
  co2: { cx: 248, cy: 220, rx: 60, ry: 54 },
  perfusion: { cx: 243, cy: 244, rx: 186, ry: 50 },
  surfactant: { cx: 185, cy: 142, rx: 94, ry: 94 },
}

type FlowProps = {
  d: string
  dur: number
  delay?: number
  r?: number
  fill: string
  n?: number
  opacity?: number
  reduce: boolean
}

/** Particles riding an offset-path — skipped entirely under reduced motion. */
function Flow({ d, dur, delay = 0, r = 3.2, fill, n = 2, opacity = 0.92, reduce }: FlowProps) {
  if (reduce) return null
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <circle
          key={i}
          r={r}
          fill={fill}
          opacity={opacity}
          className="medos-flow"
          style={
            {
              '--path': `path('${d}')`,
              '--dur': `${dur}s`,
              animationDelay: `${delay + (i / n) * dur}s`,
            } as CSSProperties
          }
        />
      ))}
    </>
  )
}

/** Donut-shaped red cells streaming along the capillary. */
function RbcFlow({ d, dur, delay = 0, n = 4, reduce }: { d: string; dur: number; delay?: number; n?: number; reduce: boolean }) {
  if (reduce) return null
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <g
          key={i}
          className="medos-flow"
          style={
            {
              '--path': `path('${d}')`,
              '--dur': `${dur}s`,
              animationDelay: `${delay + (i / n) * dur}s`,
            } as CSSProperties
          }
        >
          <circle r={6.5} fill="url(#rbcBody)" stroke="#be123c" strokeWidth={1} />
          <circle r={2.4} fill="#ffe4e6" opacity={0.9} />
        </g>
      ))}
    </>
  )
}

export function AlveolusScene({ step, playing, reduce, focus }: SceneProps) {
  const stepAnchor = step >= 0 && step < STEPS.length ? STEPS[step] : null
  const active = focus ?? stepAnchor
  const live = playing && !reduce

  // focus wins (anchorGlow dims everything else); the active step just emphasizes
  const op = (a: string): number => {
    if (focus) return anchorGlow(focus, a)
    if (active && active !== a) return 0.55
    return 1
  }

  // slight scale-up on the stage the narration is talking about
  const emph = (id: string): CSSProperties | undefined => {
    const sp = SPOTS[id]
    if (active !== id || reduce || !sp) return undefined
    return {
      animation: 'medos-breathe 2.8s ease-in-out infinite',
      transformOrigin: `${sp.cx}px ${sp.cy}px`,
      transformBox: 'view-box',
    }
  }

  // the sac and its walls breathe on one shared clock (~4s)
  const breathe: CSSProperties | undefined = reduce
    ? undefined
    : { animation: 'medos-breathe 4s ease-in-out infinite', transformOrigin: '185px 142px', transformBox: 'view-box' }
  const sacAnim = active === 'alv' ? emph('alv') : breathe

  const spot = focus ? SPOTS[focus] : undefined
  const glow = !focus && active ? SPOTS[active] : undefined
  const dash = (dur: number): CSSProperties | undefined =>
    reduce ? undefined : { animation: `medos-dash ${dur}s linear infinite` }

  return (
    <svg
      className="medos-scene"
      viewBox="0 0 480 340"
      role="img"
      aria-label="Living alveolus diagram: breathing sac lined with surfactant, 0.5 µm membrane, oxygen hopping into capillary blood onto red cells and carbon dioxide hopping out"
      data-playing={live ? 'true' : 'false'}
    >
      <defs>
        <radialGradient id="alvAura" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="alvGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="alvHalo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <radialGradient id="alvBody" cx="40%" cy="32%" r="82%">
          <stop offset="0%" stopColor="#fff1e8" />
          <stop offset="45%" stopColor="#ffcdb4" />
          <stop offset="100%" stopColor="#f2825f" />
        </radialGradient>
        <radialGradient id="rbcBody" cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#ffe4e6" />
          <stop offset="38%" stopColor="#fecdd3" />
          <stop offset="58%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
        <filter id="alvSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="alvClay" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="3" floodColor="#7c2d12" floodOpacity="0.28" />
        </filter>
        <marker id="mSky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill={SKY_D} />
        </marker>
        <marker id="mRose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill={ROSE} />
        </marker>
      </defs>

      {/* warm coral aura */}
      <ellipse cx={240} cy={180} rx={218} ry={152} fill="url(#alvAura)" />

      {/* soft glow behind the step-active stage */}
      {glow && (
        <ellipse cx={glow.cx} cy={glow.cy} rx={glow.rx} ry={glow.ry} fill="url(#alvGlow)"
          style={reduce ? undefined : { animation: 'medos-glow 2s ease-in-out infinite' }} />
      )}

      {/* ── capillary — perfusion along the wall (behind the sac) ── */}
      <g data-anchor="perfusion" opacity={op('perfusion')} style={emph('perfusion')}>
        <path d={D_CAP} fill="none" stroke="#fb7185" strokeWidth={36} strokeLinecap="round" opacity={0.3} filter="url(#alvClay)" />
        <path d={D_CAP} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="10 16" strokeLinecap="round" opacity={0.5} style={dash(6)} />
        <RbcFlow d={D_CAP} dur={8} n={4} reduce={reduce} />
        <path d="M376,242 L406,210" fill="none" stroke={ROSE} strokeWidth={2.5} markerEnd="url(#mRose)" strokeLinecap="round"
          style={reduce ? undefined : { animation: 'medos-glow 1.8s ease-in-out infinite' }} />
        <text x={414} y={196} fontSize={9} fontWeight={700} fill={ROSE_D}>to heart</text>
        <text x={330} y={300} fontSize={9} fontWeight={700} fill={ROSE_D} textAnchor="middle">capillary blood flow →</text>
      </g>

      {/* ── the alveolus — it breathes ── */}
      <g data-anchor="alv" opacity={op('alv')}>
        {/* terminal bronchiole feeding the sac (does not expand) */}
        <path d={D_AIR} fill="none" stroke={CORAL} strokeWidth={19} strokeLinecap="round" opacity={0.5} filter="url(#alvClay)" />
        <path d={D_AIR} fill="none" stroke="#fdba74" strokeWidth={14} strokeLinecap="round" opacity={0.95} />
        <path d={D_AIR} fill="none" stroke="#fff7ed" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
        <Flow d={D_AIR} dur={3} r={3} fill={SKY} n={2} reduce={reduce} />
        <text x={22} y={38} fontSize={9.5} fontWeight={700} fill={SKY_D}>air in →</text>

        <g style={sacAnim}>
          <circle cx={185} cy={142} r={102} fill="url(#alvBody)" stroke={CORAL} strokeWidth={3} opacity={0.97} filter="url(#alvClay)" />
          <circle cx={185} cy={142} r={84} fill="#fff8f2" opacity={0.75} />
          <circle cx={185} cy={142} r={84} fill="none" stroke={CORAL} strokeWidth={1.2} opacity={0.4} />
          <text x={185} y={116} fontSize={11} fontWeight={700} fill={CORAL_D} textAnchor="middle" opacity={0.9}>alveolus</text>
        </g>
      </g>

      {/* ── the shared wall — 0.5 µm membrane ── */}
      <g data-anchor="membrane" opacity={op('membrane')} style={emph('membrane')}>
        <g style={breathe}>
          <path d="M97,193 C110,224 144,244 185,244 C226,244 260,224 273,193" fill="none" stroke={ROSE_D} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
          <path d="M97,193 C110,224 144,244 185,244 C226,244 260,224 273,193" fill="none" stroke="#ffffff" strokeWidth={1.5} strokeDasharray="8 5" opacity={0.75} style={dash(5)} />
        </g>
        <text x={66} y={286} fontSize={9.5} fontWeight={700} fill={ROSE_D}>0.5 µm membrane</text>
        <line x1={100} y1={279} x2={114} y2={240} stroke={ROSE_D} strokeWidth={0.9} opacity={0.5} />
      </g>

      {/* ── surfactant — shimmering film on the inner surface ── */}
      <g data-anchor="surfactant" opacity={op('surfactant')} style={emph('surfactant')}>
        <g style={breathe}>
          <circle cx={185} cy={142} r={86} fill="none" stroke="#fcd34d" strokeWidth={4} opacity={0.65}
            style={reduce ? undefined : { animation: 'medos-glow 3s ease-in-out infinite' }} />
          <circle cx={185} cy={142} r={81} fill="none" stroke="#fde68a" strokeWidth={1.4} strokeDasharray="5 9" opacity={0.7} />
          {/* Type II pneumocyte making surfactant */}
          <rect x={107} y={183} width={15} height={15} rx={4.5} fill="#fbbf24" stroke={AMBER_D} strokeWidth={1.2} />
          <circle cx={114.5} cy={190.5} r={2.4} fill="#92400e" opacity={0.75} />
        </g>
        <text x={44} y={88} fontSize={9.5} fontWeight={700} fill={AMBER_D}>surfactant</text>
        <line x1={110} y1={86} x2={124} y2={81} stroke={AMBER_D} strokeWidth={0.9} opacity={0.5} />
        <text x={78} y={214} fontSize={9} fontWeight={700} fill="#92400e">Type II cell</text>
        <line x1={104} y1={210} x2={107} y2={198} stroke="#92400e" strokeWidth={0.8} opacity={0.5} />
      </g>

      {/* ── O₂ hops air → blood, binds haemoglobin ── */}
      <g data-anchor="o2" opacity={op('o2')} style={emph('o2')}>
        {D_O2.map((d, i) => (
          <Flow key={i} d={d} dur={2.4} r={3.2} fill={SKY} n={2} delay={i * 0.8} reduce={reduce} />
        ))}
        {[[146, 252], [172, 257], [198, 253]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={5} fill="#fff1f2" stroke="#f87171" strokeWidth={2.2} filter="url(#alvSoft)" />
            <circle cx={x - 4.5} cy={y - 2.5} r={1.7} fill="#7dd3fc"
              style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite', animationDelay: `${i * 0.4}s` }} />
            <circle cx={x + 4} cy={y + 3} r={1.7} fill="#7dd3fc"
              style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite', animationDelay: `${i * 0.4 + 0.8}s` }} />
          </g>
        ))}
        <text x={124} y={200} fontSize={10} fontWeight={700} fill={SKY_D} textAnchor="end">O₂ in</text>
        <line x1={134} y1={206} x2={134} y2={220} stroke={SKY_D} strokeWidth={1.6} markerEnd="url(#mSky)" strokeLinecap="round" />
        <text x={222} y={272} fontSize={8.5} fontWeight={700} fill={ROSE_D}>Hb ⇄ O₂</text>
      </g>

      {/* ── CO₂ hops blood → air, the reverse journey ── */}
      <g data-anchor="co2" opacity={op('co2')} style={emph('co2')}>
        {D_CO2.map((d, i) => (
          <Flow key={i} d={d} dur={3} r={3.2} fill={PLUM} n={2} delay={i * 1} reduce={reduce} />
        ))}
        <text x={296} y={190} fontSize={10} fontWeight={700} fill={PLUM_D}>CO₂ out</text>
      </g>

      {/* caption */}
      <text x={24} y={332} fontSize={9} fontWeight={700} fill={INK} opacity={0.75}>one membrane, two journeys — O₂ in, CO₂ out</text>

      {/* narration-step ring (subtle outline on the active stage) */}
      {stepAnchor && !focus && SPOTS[stepAnchor] && (
        <ellipse cx={SPOTS[stepAnchor].cx} cy={SPOTS[stepAnchor].cy} rx={SPOTS[stepAnchor].rx} ry={SPOTS[stepAnchor].ry}
          fill="none" stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="5 6" opacity={0.85}
          style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite' }} />
      )}

      {/* focus spotlight: pulsing amber halo */}
      {spot && (
        <ellipse cx={spot.cx} cy={spot.cy} rx={spot.rx} ry={spot.ry} fill="none"
          stroke="url(#alvHalo)" strokeWidth={3}
          className={reduce ? undefined : 'medos-anchor-pulse'} />
      )}
    </svg>
  )
}
