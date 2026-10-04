'use client'

// ─── LIVING SCENE · The neuron — the firing line ───
// A horizontal neuron: dendrite inputs rain into the soma, an amber action
// potential sprints down the myelinated axon (jumping node to node), Ca²⁺
// gates the terminal, vesicles fuse and neurotransmitters rain across the
// cleft onto an excitatory (glutamate) and an inhibitory (GABA) receptor.

import { anchorGlow, type SceneProps } from './scene-contract'

const VIOLET = '#a78bfa'
const VIOLET_HI = '#c4b5fd'
const CYAN = '#22d3ee'
const CYAN_HI = '#67e8f9'
const AMBER = '#fbbf24'
const MINT = '#34d399'

// narration step index → spotlighted anchor
const STEPS = ['soma', 'ap', 'myelin', 'synapse', 'nt'] as const

// spotlight shapes per anchor (circles when rx === ry)
const SPOTS: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  soma: { cx: 104, cy: 190, rx: 68, ry: 68 },
  ap: { cx: 234, cy: 187, rx: 122, ry: 46 },
  myelin: { cx: 236, cy: 187, rx: 104, ry: 34 },
  synapse: { cx: 356, cy: 184, rx: 52, ry: 46 },
  nt: { cx: 408, cy: 186, rx: 56, ry: 80 },
}

const AXON = 'M140,188 L332,188'
const AP_PATH = 'M140,188 L332,188'
const BOLT = '2,-11 -5,1 -1.5,1 -3,10 5,-2 1.5,-2'

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

/** The action-potential spike: amber bolt + soft halo sprinting along the axon. */
function BoltTrain({ reduce }: { reduce: boolean }) {
  if (reduce) {
    return <polygon points={BOLT} fill={AMBER} stroke="#b45309" strokeWidth={0.8} transform="translate(236 187)" />
  }
  const st = (dl: number) =>
    ({ '--path': `path('${AP_PATH}')`, '--dur': '2.4s', animationDelay: `${dl}s` }) as React.CSSProperties
  return (
    <>
      {[0, 1.2].map((dl) => (
        <g key={dl}>
          <circle r={11} fill={AMBER} opacity={0.22} className="medos-flow" style={st(dl)} />
          <polygon points={BOLT} fill={AMBER} stroke="#b45309" strokeWidth={0.8} className="medos-flow" style={st(dl)} />
        </g>
      ))}
    </>
  )
}

export function NeuronScene({ step, playing, reduce, focus }: SceneProps) {
  const stepAnchor = step >= 0 && step < STEPS.length ? STEPS[step] : null
  const active = focus ?? stepAnchor
  // focus wins (anchorGlow dims everything else); otherwise the narration step emphasizes
  const op = (a: string) => {
    if (focus) return anchorGlow(focus, a)
    if (active && active !== a) return 0.42
    return 1
  }
  const spot = focus ? SPOTS[focus] : null

  const pillXs = [158, 194, 230, 266, 302]
  const nodeXs = [176, 212, 248, 284]

  return (
    <svg
      className="medos-scene"
      viewBox="0 0 480 340"
      role="img"
      aria-label="Living diagram of a neuron firing: soma with Na-K pump, action potential sprinting along a myelinated axon, synapse with Ca²⁺ influx, vesicle fusion and neurotransmitters crossing the cleft"
      data-playing={playing && !reduce ? 'true' : 'false'}
    >
      <defs>
        <radialGradient id="neuSoma" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="55%" stopColor={VIOLET} />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
        <radialGradient id="neuTerm" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#cffafe" />
          <stop offset="55%" stopColor={VIOLET} />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <linearGradient id="neuMyelin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="100%" stopColor={VIOLET} />
        </linearGradient>
        <linearGradient id="neuHalo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="neuSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* backdrop aura */}
      <ellipse cx={240} cy={185} rx={214} ry={142} fill="#8b5cf6" opacity={0.07} />

      {/* ── axon cable + directional dashes (visible at the nodes) ── */}
      <g data-anchor="ap" opacity={op('ap')}>
        <path d={AXON} fill="none" stroke={VIOLET} strokeWidth={9} strokeLinecap="round" opacity={0.16} />
        <path d={AXON} fill="none" stroke={VIOLET} strokeWidth={4.5} strokeLinecap="round" opacity={0.9} />
        <path d={AXON} fill="none" stroke={AMBER} strokeWidth={1.8} strokeLinecap="round"
          strokeDasharray="6 7" opacity={0.6}
          style={reduce ? undefined : { animation: 'medos-dash 1.1s linear infinite' }} />
      </g>

      {/* ── myelin sheath + nodes of Ranvier ── */}
      <g data-anchor="myelin" opacity={op('myelin')}>
        {pillXs.map((x, i) => (
          <rect key={x} x={x - 15} y={176} width={30} height={24} rx={11.5}
            fill="url(#neuMyelin)" stroke="#7c3aed" strokeWidth={1}
            style={
              reduce
                ? undefined
                : {
                    animation: `medos-breathe ${3.6 + i * 0.2}s ease-in-out infinite`,
                    animationDelay: `${i * 0.35}s`,
                    transformOrigin: 'center',
                    transformBox: 'fill-box',
                  }
            } />
        ))}
        {nodeXs.map((x, i) => (
          <circle key={x} cx={x} cy={188} r={4.2} fill={CYAN}
            style={reduce ? undefined : { animation: 'medos-glow 1.4s ease-in-out infinite', animationDelay: `${i * 0.32}s` }} />
        ))}
        <text x={209} y={158} textAnchor="middle" fontSize={10} fontWeight={700} fill={VIOLET_HI}>myelin</text>
        <line x1={209} y1={162} x2={209} y2={173} stroke={VIOLET_HI} strokeWidth={1} opacity={0.55} />
        <text x={237} y={224} textAnchor="middle" fontSize={9} fontWeight={700} fill={CYAN}>node</text>
        <line x1={237} y1={212} x2={237} y2={194} stroke={CYAN} strokeWidth={1} opacity={0.55} />
      </g>

      {/* ── action potential bolts sprinting soma → terminal ── */}
      <g data-anchor="ap" opacity={op('ap')}>
        <BoltTrain reduce={reduce} />
        <rect x={168} y={44} width={112} height={22} rx={9} fill="#1e1b4b" opacity={0.92} stroke={AMBER} strokeOpacity={0.5} />
        <text x={224} y={59} textAnchor="middle" fontSize={10} fontWeight={800} fill={AMBER}
          style={reduce ? undefined : { animation: 'medos-glow 2.4s ease-in-out infinite' }}>
          AP +40 mV
        </text>
      </g>

      {/* ── soma: dendrites, nucleus, Na/K pump badge ── */}
      <g data-anchor="soma" opacity={op('soma')}>
        <path d="M76,172 C58,152 42,148 22,138 M72,190 C50,186 34,190 16,184 M76,208 C58,224 44,232 26,240"
          fill="none" stroke={CYAN} strokeWidth={8} strokeLinecap="round" opacity={0.12} />
        <path d="M76,172 C58,152 42,148 22,138 M72,190 C50,186 34,190 16,184 M76,208 C58,224 44,232 26,240 M52,152 C46,140 40,134 30,126"
          fill="none" stroke={CYAN} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
        {[[40, 146], [28, 180], [48, 226]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={CYAN_HI} opacity={0.75} />
        ))}
        {/* arriving inputs */}
        <Flow d="M22,138 C42,148 58,152 76,172" color={AMBER} dur={3.2} r={2.6} count={2} reduce={reduce} />
        <Flow d="M16,184 C34,190 50,186 72,190" color={MINT} dur={3.8} delay={0.9} r={2.6} count={2} reduce={reduce} />
        <circle cx={104} cy={190} r={36} fill="url(#neuSoma)" stroke={VIOLET_HI} strokeWidth={1.5} filter="url(#neuSoft)" />
        <circle cx={104} cy={190} r={14} fill="#5b21b6"
          style={
            reduce
              ? undefined
              : { animation: 'medos-breathe 4.2s ease-in-out infinite', transformOrigin: 'center', transformBox: 'fill-box' }
          } />
        <circle cx={104} cy={190} r={4.5} fill={VIOLET_HI} opacity={0.9} />
        <text x={14} y={112} fontSize={9} fontWeight={700} fill={CYAN} opacity={0.85}>dendrites</text>
        <rect x={34} y={104} width={98} height={18} rx={9} fill="#1e1b4b" opacity={0.88} />
        <text x={83} y={116.5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#ddd6fe">soma −70 mV</text>
        <line x1={104} y1={228} x2={104} y2={238} stroke="#5eead4" strokeWidth={1} opacity={0.5} />
        <rect x={50} y={240} width={108} height={18} rx={9} fill="#134e4a" opacity={0.92} stroke="#5eead4" strokeOpacity={0.5} />
        <text x={104} y={252.5} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#5eead4"
          style={reduce ? undefined : { animation: 'medos-glow 3s ease-in-out infinite' }}>
          3Na⁺ out / 2K⁺ in
        </text>
      </g>

      {/* ── axon terminal: vesicles + Ca²⁺ gate ── */}
      <g data-anchor="synapse" opacity={op('synapse')}>
        <ellipse cx={356} cy={184} rx={30} ry={25} fill="url(#neuTerm)" stroke={CYAN_HI} strokeWidth={1.5} filter="url(#neuSoft)" />
        <path d="M380,168 C388,174 388,196 380,202" fill="none" stroke={AMBER} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
        <ellipse cx={340} cy={200} rx={7} ry={4} fill="#fb7185" opacity={0.55} />
        {[[344, 172], [356, 164], [368, 172], [350, 186], [364, 184]].map(([x, y], i) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={4.3} fill="#7dd3fc" stroke="#0ea5e9" strokeWidth={0.8}
            style={reduce ? undefined : { animation: 'medos-floaty 3.2s ease-in-out infinite', animationDelay: `${i * 0.45}s` }} />
        ))}
        {/* vesicles drifting to the membrane and fusing */}
        <Flow d="M368,176 L384,170" color="#7dd3fc" dur={2.4} r={4} count={2} reduce={reduce} opacity={0.95} />
        <Flow d="M362,192 L384,196" color="#7dd3fc" dur={3} delay={1.1} r={4} count={2} reduce={reduce} opacity={0.95} />
        {/* Ca²⁺ influx */}
        <Flow d="M397,256 C393,234 389,216 386,198" color={CYAN} dur={2} r={3} count={3} reduce={reduce} />
        <text x={397} y={266} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={CYAN}>Ca²⁺</text>
        <text x={346} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={CYAN_HI}>axon terminal</text>
      </g>

      {/* ── synaptic cleft: NT rain + postsynaptic receptors ── */}
      <g data-anchor="nt" opacity={op('nt')}>
        <rect x={419} y={118} width={54} height={136} rx={10} fill="#0ea5e9" opacity={0.12} />
        <rect x={410} y={118} width={9} height={136} rx={4.5} fill="url(#neuMyelin)" stroke="#38bdf8" strokeWidth={1} />
        <text x={460} y={186} textAnchor="middle" fontSize={9} fontWeight={700} fill="#38bdf8" opacity={0.8}
          transform="rotate(-90 460 186)">postsynaptic</text>
        {/* excitatory receptor (glutamate → Na⁺ in) */}
        <path d="M412,157 L405,157 C400,157 400,175 405,175 L412,175" fill="none" stroke={CYAN} strokeWidth={3.2} strokeLinecap="round"
          style={reduce ? undefined : { animation: 'medos-glow 1.4s ease-in-out infinite' }} />
        <Flow d="M386,166 L401,166" color={AMBER} dur={1.3} r={2.8} count={3} reduce={reduce} />
        <Flow d="M412,166 L436,166" color="#38bdf8" dur={1.6} delay={0.2} r={2.4} count={2} reduce={reduce} />
        <text x={424} y={152} fontSize={8.5} fontWeight={700} fill="#7dd3fc">Na⁺ in</text>
        {/* inhibitory receptor (GABA → Cl⁻ in) */}
        <path d="M412,204 L405,204 C400,204 400,222 405,222 L412,222" fill="none" stroke={MINT} strokeWidth={3.2} strokeLinecap="round"
          style={reduce ? undefined : { animation: 'medos-glow 1.4s ease-in-out infinite', animationDelay: '0.7s' }} />
        <Flow d="M386,212 L401,212" color={MINT} dur={1.5} delay={0.4} r={2.8} count={3} reduce={reduce} />
        <Flow d="M412,212 L436,212" color="#6ee7b7" dur={1.8} delay={0.6} r={2.4} count={2} reduce={reduce} />
        <text x={424} y={232} fontSize={8.5} fontWeight={700} fill="#6ee7b7">Cl⁻ in</text>
        <text x={400} y={138} textAnchor="middle" fontSize={9} fontWeight={700} fill={AMBER}>glutamate →</text>
        <text x={397} y={240} textAnchor="middle" fontSize={9} fontWeight={700} fill={MINT}>← GABA</text>
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
          stroke="url(#neuHalo)" strokeWidth={3}
          className={reduce ? undefined : 'medos-anchor-pulse'} />
      )}

      <text x={240} y={330} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="#94a3b8">
        input → soma → spike → node-to-node jump → Ca²⁺ gate → cleft rain
      </text>
    </svg>
  )
}
