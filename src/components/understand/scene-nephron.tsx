'use client'

// ─── LIVING SCENE · The nephron — a renal conveyor belt ───
// Filtrate (cyan) flows the full conveyor: Bowman → PCT → loop of Henle →
// DCT → collecting duct. Salt is pumped out of the thick ascending limb
// (amber), water drips from the duct under ADH, glucose and amino acids are
// reclaimed in the PCT, peritubular capillaries (rose) wrap every segment
// and the JG apparatus sniffs the salt and fires renin. Narration steps
// spotlight each conveyor station; a focused anchor dims everything else.

import { anchorGlow, type SceneProps } from './scene-contract'
import type { CSSProperties } from 'react'

const INK = '#7c2d12'
const TEAL = '#0891b2'
const TEAL_D = '#0e7490'
const AMBER = '#d97706'
const AMBER_D = '#b45309'
const ROSE = '#e11d48'
const VIOLET = '#7c3aed'
const VIOLET_D = '#5b21b6'

// tubule geometry — one continuous clay tube, drawn segment by segment
// (each continuation starts with an explicit L so the path stays valid)
const D_PCT = 'M98,110 C90,126 106,132 114,144 C122,156 98,160 94,172 C90,184 120,182 136,192 C150,201 150,212 150,224'
const D_LOOP = 'M150,224 L150,264 C150,288 186,288 186,264 L186,204'
const D_DCT = 'M186,204 C186,188 198,182 212,176 C230,169 242,156 238,140 C234,126 214,122 196,120 C176,118 158,116 142,104 C132,96 140,86 154,82 C186,72 226,74 252,86 C272,95 284,100 298,106'
const D_TUBE = `${D_PCT} L${D_LOOP.slice(1)} L${D_DCT.slice(1)}`
const D_FILTRATE = `${D_TUBE} C303,108 308,110 311,114 L311,292`

// peritubular capillaries — hugging the tubules from efferent to venule
const D_CAP = 'M136,48 C160,34 208,38 248,52 C266,60 264,78 250,88 C240,96 232,104 234,118 C238,138 262,146 266,166 C270,186 246,192 232,186 C218,180 210,190 212,204 C214,222 236,224 244,238 C252,252 240,262 226,262 C210,262 204,274 210,286 C216,298 234,296 246,304 C256,310 268,308 276,314'
const D_CAP_PCT = 'M134,50 C112,58 100,78 104,98 C108,116 96,130 88,146 C82,160 86,178 96,190'
const D_AFF = 'M46,68 C60,62 70,60 78,62'

// local exchange flows: reclaim + secretions
const D_GLUCOSE = 'M100,158 C92,164 87,170 84,180'
const D_AA = 'M104,180 C98,185 95,189 91,192'
const D_SALT = [
  'M194,228 C208,228 220,232 232,238',
  'M194,252 C208,252 220,256 232,262',
  'M194,272 C208,272 220,276 232,282',
]
const D_WATER = ['M148,246 C134,246 122,242 110,238', 'M148,266 C134,266 122,262 110,258']
const D_DROP = [
  'M296,166 C282,172 272,168 260,174',
  'M296,204 C282,210 270,206 258,212',
  'M296,236 C284,242 272,238 262,244',
]

// narration step index → spotlighted anchor (understand-catalog order)
const STEPS = ['glom', 'pct', 'loop', 'dct', 'cd', 'jga'] as const
const FLOW_ANCHORS = ['glom', 'pct', 'loop', 'dct', 'cd']

// spotlight geometry per anchor (halo on focus, soft glow + ring on active step)
const SPOTS: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  glom: { cx: 98, cy: 80, rx: 50, ry: 50 },
  pct: { cx: 120, cy: 170, rx: 52, ry: 76 },
  loop: { cx: 168, cy: 256, rx: 46, ry: 58 },
  dct: { cx: 212, cy: 130, rx: 98, ry: 72 },
  cd: { cx: 311, cy: 180, rx: 40, ry: 146 },
  jga: { cx: 132, cy: 99, rx: 30, ry: 30 },
  vessel: { cx: 200, cy: 180, rx: 130, ry: 160 },
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
function Flow({ d, dur, delay = 0, r = 3.2, fill, n = 3, opacity = 0.92, reduce }: FlowProps) {
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

export function NephronScene({ step, playing, reduce, focus }: SceneProps) {
  const stepAnchor = step >= 0 && step < STEPS.length ? STEPS[step] : null
  const active = focus ?? stepAnchor
  const live = playing && !reduce

  // focus wins (anchorGlow dims everything else); the active step just emphasizes
  const op = (a: string): number => {
    if (focus) return anchorGlow(focus, a)
    if (active && active !== a) return 0.55
    return 1
  }

  // slight scale-up on the station the narration is talking about
  const emph = (id: string): CSSProperties | undefined => {
    const sp = SPOTS[id]
    if (active !== id || reduce || !sp) return undefined
    return {
      animation: 'medos-breathe 2.8s ease-in-out infinite',
      transformOrigin: `${sp.cx}px ${sp.cy}px`,
      transformBox: 'view-box',
    }
  }

  const spot = focus ? SPOTS[focus] : undefined
  const glow = !focus && active ? SPOTS[active] : undefined
  // the clay tube + filtrate conveyor belong to the flow stations
  const flowOp = focus
    ? FLOW_ANCHORS.includes(focus) ? 1 : 0.28
    : stepAnchor && !FLOW_ANCHORS.includes(stepAnchor) ? 0.6 : 1

  const dash = (dur: number): CSSProperties | undefined =>
    reduce ? undefined : { animation: `medos-dash ${dur}s linear infinite` }

  return (
    <svg
      className="medos-scene"
      viewBox="0 0 480 340"
      role="img"
      aria-label="Living nephron diagram: glomerulus filtering into Bowman's capsule, proximal tubule reclaiming glucose, loop of Henle salt gradient, distal tubule fine-tuning, ADH-gated collecting duct and the renin-firing JG apparatus"
      data-playing={live ? 'true' : 'false'}
    >
      <defs>
        <radialGradient id="nephAura" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nephGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nephHalo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <radialGradient id="glomTuft" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="55%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#be123c" />
        </radialGradient>
        <linearGradient id="filtrate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="cdGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id="nephSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nephClay" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="3" floodColor="#7c2d12" floodOpacity="0.3" />
        </filter>
        <marker id="mAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill={AMBER} />
        </marker>
      </defs>

      {/* warm kidney-bean aura + cortex/medulla zones */}
      <ellipse cx={240} cy={178} rx={216} ry={152} fill="url(#nephAura)" />
      <rect x={14} y={246} width={452} height={74} rx={18} fill="#78350f" opacity={0.07} />
      <line x1={14} y1={246} x2={466} y2={246} stroke={INK} strokeWidth={1} strokeDasharray="1 7" strokeLinecap="round" opacity={0.18} />
      <text x={452} y={32} fontSize={9} fontWeight={700} fill={INK} opacity={0.5} textAnchor="end">CORTEX</text>
      <text x={28} y={262} fontSize={9} fontWeight={700} fill={INK} opacity={0.5}>MEDULLA</text>

      {/* soft glow behind the step-active station */}
      {glow && (
        <ellipse cx={glow.cx} cy={glow.cy} rx={glow.rx} ry={glow.ry} fill="url(#nephGlow)"
          style={reduce ? undefined : { animation: 'medos-glow 2s ease-in-out infinite' }} />
      )}

      {/* ── peritubular capillaries (vessel) ── */}
      <g data-anchor="vessel" opacity={op('vessel')} style={emph('vessel')}>
        <path d={D_CAP} fill="none" stroke={ROSE} strokeWidth={6} strokeLinecap="round" opacity={0.22} />
        <path d={D_CAP} fill="none" stroke={ROSE} strokeWidth={3} strokeLinecap="round" opacity={0.55} />
        <path d={D_CAP_PCT} fill="none" stroke={ROSE} strokeWidth={2.6} strokeLinecap="round" opacity={0.45} />
        <Flow d={D_CAP} dur={9} r={3} fill="#f43f5e" n={4} reduce={reduce} />
        <Flow d={D_CAP_PCT} dur={5} r={2.4} fill="#f43f5e" n={2} delay={1.2} reduce={reduce} />
        <text x={208} y={24} fontSize={9} fontWeight={700} fill={ROSE} textAnchor="middle" opacity={0.85}>peritubular capillaries</text>
      </g>

      {/* ── glomerulus — the filter ball in Bowman's capsule ── */}
      <g data-anchor="glom" opacity={op('glom')} style={emph('glom')}>
        <path d={D_AFF} fill="none" stroke={ROSE} strokeWidth={7} strokeLinecap="round" opacity={0.75} />
        <path d="M120,62 C126,54 130,50 136,48" fill="none" stroke={ROSE} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        <Flow d={D_AFF} dur={2.2} r={2.6} fill="#f43f5e" n={2} reduce={reduce} />
        <circle cx={98} cy={80} r={30} fill="#fff7ed" opacity={0.6} stroke="#f1c9a5" strokeWidth={3} filter="url(#nephClay)" />
        <circle cx={98} cy={80} r={24} fill="none" stroke={TEAL} strokeWidth={1.4} strokeDasharray="3 3" opacity={0.5} />
        <circle cx={98} cy={80} r={16.5} fill="url(#glomTuft)" filter="url(#nephSoft)" />
        <path d="M88,74 C94,68 102,68 106,74 M90,84 C96,90 104,88 108,82 M92,78 C98,74 104,80 100,86"
          fill="none" stroke="#be123c" strokeWidth={1.8} strokeLinecap="round" opacity={0.65} />
        {/* filtration slit — marching beads */}
        <circle cx={98} cy={80} r={19.5} fill="none" stroke="#67e8f9" strokeWidth={2.4} strokeLinecap="round"
          strokeDasharray="0.6 8.06" style={dash(1.4)} />
        {[[92, 72], [104, 78], [94, 86], [103, 88]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.9} fill="#ffffff" opacity={0.95}
            style={reduce ? undefined : { animation: 'medos-glow 1.4s ease-in-out infinite', animationDelay: `${i * 0.35}s` }} />
        ))}
        <text x={84} y={22} fontSize={10} fontWeight={700} fill={INK} textAnchor="middle">glomerulus</text>
      </g>

      {/* ── the clay tube (shared wall of the whole conveyor) ── */}
      <g opacity={flowOp}>
        <path d={D_TUBE} fill="none" stroke="#b45f3f" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round"
          opacity={0.5} filter="url(#nephClay)" />
        <path d={D_TUBE} fill="none" stroke="#f7c59a" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={0.45} />
      </g>

      {/* ── JG apparatus — sensor cluster where the DCT touches the glomerulus ── */}
      <g data-anchor="jga" opacity={op('jga')} style={emph('jga')}>
        <circle cx={128} cy={92} r={4} fill="#c4b5fd" stroke={VIOLET_D} strokeWidth={1} />
        <circle cx={137} cy={97} r={4.5} fill="#a78bfa" stroke={VIOLET_D} strokeWidth={1} />
        <circle cx={129} cy={104} r={4} fill="#c4b5fd" stroke={VIOLET_D} strokeWidth={1} />
        <circle cx={138} cy={109} r={4.5} fill="#a78bfa" stroke={VIOLET_D} strokeWidth={1} />
        <circle cx={133} cy={100} r={3} fill="#fbbf24"
          style={reduce ? undefined : { animation: 'medos-glow 1.8s ease-in-out infinite' }} />
        <text x={24} y={108} fontSize={9} fontWeight={700} fill={VIOLET_D}>JG apparatus</text>
        <text x={24} y={121} fontSize={9.5} fontWeight={700} fill={AMBER_D}
          style={reduce ? undefined : { animation: 'medos-glow 2.4s ease-in-out infinite' }}>renin ✦</text>
        <line x1={90} y1={112} x2={116} y2={100} stroke={INK} strokeWidth={0.9} opacity={0.45} />
      </g>

      {/* ── PCT — bulk reclaim ── */}
      <g data-anchor="pct" opacity={op('pct')} style={emph('pct')}>
        <path d={D_PCT} fill="none" stroke="url(#filtrate)" strokeWidth={6} strokeLinecap="round" opacity={0.95} />
        <Flow d={D_GLUCOSE} dur={2.6} r={2.4} fill="#f59e0b" n={2} reduce={reduce} />
        <Flow d={D_AA} dur={2.8} r={2.4} fill="#fbbf24" n={2} delay={0.9} reduce={reduce} />
        <rect x={14} y={148} width={88} height={17} rx={8.5} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1} opacity={0.95} />
        <text x={58} y={160} fontSize={8.5} fontWeight={700} fill={AMBER_D} textAnchor="middle">glucose · 100% ♻</text>
        <rect x={14} y={168} width={88} height={17} rx={8.5} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1} opacity={0.95} />
        <text x={58} y={180} fontSize={8.5} fontWeight={700} fill={AMBER_D} textAnchor="middle">amino acids ♻</text>
        <text x={24} y={228} fontSize={10} fontWeight={700} fill={INK}>PCT — bulk reclaim</text>
      </g>

      {/* ── loop of Henle — the U engine ── */}
      <g data-anchor="loop" opacity={op('loop')} style={emph('loop')}>
        <path d={D_LOOP} fill="none" stroke="url(#filtrate)" strokeWidth={6} strokeLinecap="round" opacity={0.95} />
        {/* salt pumped out of the thick ascending limb */}
        {D_SALT.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={AMBER} strokeWidth={2.5} markerEnd="url(#mAmber)" strokeLinecap="round"
            style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite', animationDelay: `${i * 0.5}s` }} />
        ))}
        {/* water leaking out of the descending limb */}
        {D_WATER.map((d, i) => (
          <Flow key={i} d={d} dur={2.8} r={2.4} fill={TEAL} n={2} delay={i * 0.9} reduce={reduce} />
        ))}
        <text x={96} y={252} fontSize={9} fontWeight={700} fill={TEAL_D} textAnchor="end">water out ↓</text>
        <text x={168} y={303} fontSize={10.5} fontWeight={700} fill={INK} textAnchor="middle">Loop of Henle</text>
        <text x={168} y={316} fontSize={9} fontWeight={700} fill={AMBER_D} textAnchor="middle">NKCC2 → furosemide</text>
      </g>

      {/* ── DCT — fine tuning ── */}
      <g data-anchor="dct" opacity={op('dct')} style={emph('dct')}>
        <path d={D_DCT} fill="none" stroke="url(#filtrate)" strokeWidth={6} strokeLinecap="round" opacity={0.95} />
        <text x={196} y={52} fontSize={9} fontWeight={700} fill={AMBER_D} textAnchor="middle">NCC → thiazide</text>
        <text x={196} y={64} fontSize={9.5} fontWeight={700} fill={INK} textAnchor="middle">DCT — fine tune</text>
      </g>

      {/* ── collecting duct — the final gate ── */}
      <g data-anchor="cd" opacity={op('cd')} style={emph('cd')}>
        <rect x={298} y={54} width={26} height={252} rx={13} fill="url(#cdGrad)" opacity={0.9} stroke={VIOLET} strokeWidth={2.5} filter="url(#nephClay)" />
        <line x1={311} y1={66} x2={311} y2={294} stroke="#ffffff" strokeWidth={7} opacity={0.35} strokeLinecap="round" />
        <line x1={311} y1={114} x2={311} y2={292} stroke="#a5f3fc" strokeWidth={4.5} opacity={0.9} strokeLinecap="round" />
        {/* water droplets draining out under ADH */}
        {D_DROP.map((d, i) => (
          <Flow key={i} d={d} dur={3.2} r={2.8} fill="#67e8f9" n={2} delay={i * 1.1} reduce={reduce} />
        ))}
        <text x={276} y={160} fontSize={9} fontWeight={700} fill={TEAL_D} textAnchor="middle">H₂O out</text>
        <text x={334} y={150} fontSize={9.5} fontWeight={700} fill={TEAL_D}>ADH ⇄ AQP-2</text>
        <text x={334} y={208} fontSize={9} fontWeight={700} fill={AMBER_D}>aldosterone · ENaC</text>
        {/* aldosterone gate: Na⁺ out / K⁺ in */}
        <path d="M296,264 C286,264 278,264 268,264" fill="none" stroke={AMBER} strokeWidth={2} markerEnd="url(#mAmber)" strokeLinecap="round" />
        <path d="M266,282 C276,282 284,282 292,282" fill="none" stroke={AMBER} strokeWidth={2} markerEnd="url(#mAmber)" strokeLinecap="round" />
        <text x={278} y={257} fontSize={9} fontWeight={700} fill={AMBER_D} textAnchor="middle">Na⁺ out</text>
        <text x={276} y={296} fontSize={9} fontWeight={700} fill={AMBER_D} textAnchor="middle">K⁺ in</text>
        <polygon points="303,306 319,306 311,320" fill={VIOLET} opacity={0.9} />
        <text x={311} y={333} fontSize={9} fontWeight={700} fill={VIOLET_D} textAnchor="middle">→ urine · to renal pelvis</text>
        <text x={311} y={44} fontSize={10} fontWeight={700} fill={VIOLET_D} textAnchor="middle">Collecting duct</text>
      </g>

      {/* ── filtrate on the conveyor (Bowman → pelvis) ── */}
      <g opacity={flowOp}>
        <Flow d={D_FILTRATE} dur={11} r={3.2} fill="#22d3ee" n={5} reduce={reduce} />
        <Flow d="M311,114 L311,292" dur={3.4} r={2.8} fill="#e0f2fe" n={2} delay={0.6} reduce={reduce} />
      </g>

      {/* bottom caption */}
      <text x={24} y={332} fontSize={9} fontWeight={700} fill={INK} opacity={0.75}>≈125 mL/min filtered · ~99% reclaimed</text>

      {/* narration-step ring (subtle outline on the active station) */}
      {stepAnchor && !focus && SPOTS[stepAnchor] && (
        <ellipse cx={SPOTS[stepAnchor].cx} cy={SPOTS[stepAnchor].cy} rx={SPOTS[stepAnchor].rx} ry={SPOTS[stepAnchor].ry}
          fill="none" stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="5 6" opacity={0.85}
          style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite' }} />
      )}

      {/* focus spotlight: pulsing amber halo */}
      {spot && (
        <ellipse cx={spot.cx} cy={spot.cy} rx={spot.rx} ry={spot.ry} fill="none"
          stroke="url(#nephHalo)" strokeWidth={3}
          className={reduce ? undefined : 'medos-anchor-pulse'} />
      )}
    </svg>
  )
}
