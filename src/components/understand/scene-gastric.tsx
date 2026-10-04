'use client'

// ─── LIVING SCENE · The gastric pit — the acid factory ───
// A cross-section of gastric mucosa: an acid pool shimmering in the lumen,
// a thick mint mucus + HCO₃⁻ barrier, and three secretory cells — the G cell
// (gastrin), the parietal cell (H⁺/K⁺-ATPase proton pump) and the chief cell
// (pepsinogen) — with a PPI badge parked on the proton pump.

import { anchorGlow, type SceneProps } from './scene-contract'

const ROSE = '#fb7185'
const ROSE_HI = '#fda4af'
const AMBER = '#fbbf24'
const AMBER_HI = '#fde68a'
const MINT_DK = '#065f46'
const BLUE_HI = '#bfdbfe'

// narration step index → spotlighted anchor
const STEPS = ['gcell', 'parietal', 'chief', 'mucus'] as const

const SPOTS: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  gcell: { cx: 214, cy: 291, rx: 44, ry: 32 },
  parietal: { cx: 150, cy: 230, rx: 74, ry: 76 },
  chief: { cx: 264, cy: 248, rx: 52, ry: 58 },
  mucus: { cx: 240, cy: 133, rx: 202, ry: 30 },
}

const ACID =
  'M14,92 C50,84 90,98 130,90 C170,82 210,96 250,88 C290,80 330,96 370,88 C410,80 444,94 466,88 L466,114 L14,114 Z'
const ACID_SURFACE = 'M14,92 C50,84 90,98 130,90 C170,82 210,96 250,88 C290,80 330,96 370,88 C410,80 444,94 466,88'
const WALL =
  'M14,158 C60,150 100,156 140,152 C180,148 200,154 240,152 C280,150 300,156 340,152 C380,148 420,156 466,150 L466,318 L14,318 Z'
const MUCUS_BAND =
  'M14,114 L466,114 L466,146 C420,152 380,144 340,148 C300,152 260,144 220,148 C180,152 140,144 100,148 C60,152 30,146 14,148 Z'

type FlowProps = {
  d: string
  color: string
  dur: number
  delay?: number
  r?: number
  count?: number
  reduce: boolean
  opacity?: number
}

/** Particles riding an offset-path (hidden entirely under reduced motion). */
function Flow({ d, color, dur, delay = 0, r = 3, count = 3, reduce, opacity = 0.9 }: FlowProps) {
  if (reduce) return null
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          r={r}
          fill={color}
          opacity={opacity}
          className="medos-flow"
          style={
            {
              '--path': `path('${d}')`,
              '--dur': `${dur}s`,
              animationDelay: `${delay + (i * dur) / count}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

export function GastricScene({ step, playing, reduce, focus }: SceneProps) {
  const stepAnchor = step >= 0 && step < STEPS.length ? STEPS[step] : null
  const active = focus ?? stepAnchor
  // focus wins (anchorGlow dims everything else); otherwise the narration step emphasizes
  const op = (a: string) => {
    if (focus) return anchorGlow(focus, a)
    if (active && active !== a) return 0.42
    return 1
  }
  const spot = focus ? SPOTS[focus] : null

  return (
    <svg
      className="medos-scene"
      viewBox="0 0 480 340"
      role="img"
      aria-label="Living diagram of the gastric pit: G cell releasing gastrin, parietal cell proton pump pouring H⁺ into the lumen, chief cell releasing pepsinogen, all under the mucus-bicarbonate shield"
      data-playing={playing && !reduce ? 'true' : 'false'}
    >
      <defs>
        <linearGradient id="gaAcid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={AMBER_HI} />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="gaMucus" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="gaWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="55%" stopColor={ROSE} />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <radialGradient id="gaParietal" cx="40%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#fee2e2" />
          <stop offset="60%" stopColor={ROSE} />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
        <radialGradient id="gaChief" cx="40%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="55%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </radialGradient>
        <radialGradient id="gaG" cx="42%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="60%" stopColor={AMBER} />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <linearGradient id="gaHalo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="gaSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* backdrop aura */}
      <ellipse cx={240} cy={180} rx={214} ry={146} fill="#f43f5e" opacity={0.06} />

      {/* ── shared stage: lumen + acid pool + epithelial wall ── */}
      <g opacity={focus ? 0.4 : 1}>
        <rect x={14} y={26} width={452} height={88} rx={12} fill="#7f1d1d" opacity={0.18} />
        <path d={ACID} fill="url(#gaAcid)" opacity={0.88} />
        <path d={ACID_SURFACE} fill="none" stroke={AMBER_HI} strokeWidth={2.5} strokeLinecap="round"
          style={reduce ? undefined : { animation: 'medos-glow 2.6s ease-in-out infinite' }} />
        {/* rising acid bubbles */}
        <Flow d="M80,88 L76,58" color={AMBER_HI} dur={3.4} r={2.4} count={2} reduce={reduce} />
        <Flow d="M190,86 L188,54" color={AMBER_HI} dur={4} delay={0.7} r={2.8} count={2} reduce={reduce} />
        <Flow d="M300,88 L304,56" color={AMBER_HI} dur={3.8} delay={1.3} r={2.2} count={2} reduce={reduce} />
        <Flow d="M410,86 L414,58" color={AMBER_HI} dur={4.4} delay={0.4} r={2.6} count={2} reduce={reduce} />
        <rect x={20} y={32} width={92} height={20} rx={9} fill="#450a0a" opacity={0.9} />
        <text x={66} y={45.5} textAnchor="middle" fontSize={9.5} fontWeight={800} fill="#fdba74">HCl · pH 1.5</text>
        <text x={466} y={44} textAnchor="end" fontSize={10} fontWeight={800} fill={ROSE_HI} opacity={0.9}>gastric lumen</text>
        {/* epithelial wall */}
        <path d={WALL} fill="url(#gaWall)" opacity={0.9} />
        {[[60, 300], [110, 306], [330, 304], [392, 300], [432, 308]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill="#9f1239" opacity={0.5} />
        ))}
        <line x1={14} y1={318} x2={466} y2={318} stroke="#881337" strokeWidth={2} opacity={0.6} />
      </g>

      {/* ── mucus + HCO₃⁻ barrier ── */}
      <g data-anchor="mucus" opacity={op('mucus')}>
        <path d={MUCUS_BAND} fill="url(#gaMucus)" opacity={0.85}
          style={
            reduce
              ? undefined
              : { animation: 'medos-breathe 5.5s ease-in-out infinite', transformOrigin: 'center', transformBox: 'fill-box' }
          } />
        {['M60,132 q20,-6 40,0', 'M300,130 q20,6 40,0', 'M392,132 q18,-5 36,0'].map((d, i) => (
          <path key={d} d={d} fill="none" stroke="#ecfdf5" strokeWidth={2} strokeLinecap="round" opacity={0.7}
            style={reduce ? undefined : { animation: 'medos-glow 2.8s ease-in-out infinite', animationDelay: `${i * 0.6}s` }} />
        ))}
        <Flow d="M120,146 L117,122" color="#a7f3d0" dur={3} r={2} count={2} reduce={reduce} />
        <Flow d="M320,146 L322,122" color="#a7f3d0" dur={3.2} delay={0.8} r={2} count={2} reduce={reduce} />
        <Flow d="M396,144 L398,122" color="#a7f3d0" dur={2.8} delay={0.4} r={2} count={2} reduce={reduce} />
        <text x={240} y={136} textAnchor="middle" fontSize={10.5} fontWeight={800} fill={MINT_DK}>mucus + HCO₃⁻ barrier</text>
        <text x={240} y={147} textAnchor="middle" fontSize={8} fontWeight={700} fill="#047857" opacity={0.9}>pH ≈ 7 shield</text>
      </g>

      {/* ── G cell: gastrin → parietal ── */}
      <g data-anchor="gcell" opacity={op('gcell')}>
        <ellipse cx={214} cy={291} rx={19} ry={13} fill="url(#gaG)" stroke="#f59e0b" strokeWidth={1} filter="url(#gaSoft)" />
        <circle cx={214} cy={289} r={4.5} fill="#92400e" />
        <Flow d="M202,282 C188,274 176,266 166,256" color={AMBER} dur={2.6} r={2.6} count={3} reduce={reduce} />
        <text x={194} y={265} fontSize={8.5} fontWeight={700} fill={AMBER}>gastrin →</text>
        <text x={214} y={312} textAnchor="middle" fontSize={8.5} fontWeight={800} fill={AMBER_HI}>G cell</text>
      </g>

      {/* ── parietal cell: the proton pump ── */}
      <g data-anchor="parietal" opacity={op('parietal')}>
        <path d="M104,254 C96,208 118,178 152,178 C190,178 206,210 198,246 C192,282 168,296 148,294 C124,292 110,280 104,254 Z"
          fill="url(#gaParietal)" stroke="#fecdd3" strokeWidth={1.2} filter="url(#gaSoft)" />
        <circle cx={150} cy={238} r={10} fill="#9f1239" />
        <path d="M126,214 C136,204 148,204 156,212 C164,220 176,220 182,210" fill="none" stroke="#fecdd3"
          strokeWidth={2.4} strokeLinecap="round" strokeDasharray="1 5" opacity={0.85} />
        <rect x={115} y={168} width={70} height={16} rx={8} fill="#7f1d1d" stroke={AMBER} strokeOpacity={0.7} />
        <text x={150} y={179.5} textAnchor="middle" fontSize={8} fontWeight={800} fill={AMBER_HI}>H⁺/K⁺-ATPase</text>
        {/* H⁺ out (up) · K⁺ in (down) */}
        <Flow d="M150,164 C150,142 150,122 150,100" color={AMBER} dur={2.6} r={3} count={3} reduce={reduce} />
        <Flow d="M158,138 C158,152 158,160 158,168" color="#93c5fd" dur={3.6} delay={0.6} r={2} count={2} reduce={reduce} />
        <polygon points="147,126 153,126 150,132" fill={AMBER} />
        <polygon points="155,150 161,150 158,144" fill="#93c5fd" />
        <rect x={18} y={178} width={78} height={17} rx={8} fill="#431407" opacity={0.92} />
        <text x={57} y={190} textAnchor="middle" fontSize={8} fontWeight={700} fill="#fdba74">H⁺ out / K⁺ in</text>
        <text x={146} y={310} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#ffe4e6" opacity={0.9}>makes intrinsic factor</text>
        {/* PPI badge pointing at the pump */}
        <rect x={30} y={268} width={58} height={22} rx={11} fill="#4c0519" stroke={AMBER} strokeWidth={1.5}
          style={reduce ? undefined : { animation: 'medos-glow 2.6s ease-in-out infinite' }} />
        <text x={59} y={282.5} textAnchor="middle" fontSize={9.5} fontWeight={800} fill={AMBER_HI}>PPI ✋</text>
        <path d="M88,274 C100,238 108,204 115,184" fill="none" stroke={AMBER} strokeWidth={1.5}
          strokeDasharray="4 9" opacity={0.75}
          style={reduce ? undefined : { animation: 'medos-dash 1.4s linear infinite' }} />
      </g>

      {/* ── chief cell: pepsinogen factory ── */}
      <g data-anchor="chief" opacity={op('chief')}>
        <path d="M232,258 C228,224 242,206 264,206 C288,206 300,226 296,256 C292,284 274,294 260,292 C244,290 236,278 232,258 Z"
          fill="url(#gaChief)" stroke={BLUE_HI} strokeWidth={1.2} filter="url(#gaSoft)" />
        <circle cx={262} cy={252} r={8} fill="#1e3a8a" />
        {[[250, 224], [268, 218], [278, 232], [256, 236], [270, 244]].map(([x, y], i) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} fill="#312e81" opacity={0.8}
            style={reduce ? undefined : { animation: 'medos-glow 2.4s ease-in-out infinite', animationDelay: `${i * 0.4}s` }} />
        ))}
        <Flow d="M262,202 C262,180 258,152 256,112" color="#93c5fd" dur={3.2} r={2.6} count={3} reduce={reduce} />
        <text x={264} y={198} textAnchor="middle" fontSize={9.5} fontWeight={800} fill={BLUE_HI}>chief cell</text>
        <text x={274} y={162} fontSize={8.5} fontWeight={700} fill={BLUE_HI}>pepsinogen →</text>
      </g>

      {/* narration-step ring (subtle outline on the active anchor) */}
      {stepAnchor && !focus && SPOTS[stepAnchor] && (
        <ellipse cx={SPOTS[stepAnchor].cx} cy={SPOTS[stepAnchor].cy} rx={SPOTS[stepAnchor].rx} ry={SPOTS[stepAnchor].ry}
          fill="none" stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="5 6" opacity={0.85}
          style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite' }} />
      )}

      {/* focus spotlight: pulsing amber halo */}
      {spot && (
        <ellipse cx={spot.cx} cy={spot.cy} rx={spot.rx} ry={spot.ry} fill="none"
          stroke="url(#gaHalo)" strokeWidth={3}
          className={reduce ? undefined : 'medos-anchor-pulse'} />
      )}

      <text x={240} y={331} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#94a3b8">
        gastrin → pump → H⁺ out · pepsinogen waits · shield = mucus + HCO₃⁻
      </text>
    </svg>
  )
}
