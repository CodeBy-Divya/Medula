'use client'

// ─── LIVING SCENE · The beating heart ───
// Four chambers contract in sequence, blood particles flow the correct way,
// the SA node sparks and valves guard every door. Steps spotlight each beat
// of the story; a focused anchor dims everything else.

import { anchorGlow, type SceneProps } from './scene-contract'

const BLUE = '#38bdf8'
const RED = '#fb7185'
const RED_O2 = '#f87171'

// flow paths (SVG path strings reused by CSS offset-path)
const D_BLUE = 'M120,120 C110,170 112,205 128,232 C140,252 158,258 172,246'
const D_RED = 'M356,120 C366,170 364,205 348,232 C336,252 318,258 304,246'
const D_PA = 'M172,236 C150,190 140,120 168,62 C178,42 196,40 210,54 C226,70 238,80 252,84'
const D_AO = 'M304,236 C330,196 342,130 320,80 C310,58 292,54 262,60'

function Particles({ d, color, dur, delay }: { d: string; color: string; dur: number; delay: number }) {
  return (
    <>
      {[0, 0.33, 0.66].map((off, i) => (
        <circle
          key={i}
          r={5}
          fill={color}
          opacity={0.9}
          className="medos-flow"
          style={{ '--path': `path('${d}')`, '--dur': `${dur}s`, animationDelay: `${delay + off * dur}s` } as React.CSSProperties}
        />
      ))}
    </>
  )
}

export function HeartScene({ step, playing, reduce, focus }: SceneProps) {
  const s = (a: string) => anchorGlow(focus, a)
  const lit = (anchor: string, target: number) => (focus ? (focus === anchor ? target : 0.18) : step >= 0 ? 1 : 1)
  const halo = focus ? (
    <>
      {[
        ['whole', 240, 190, 150], ['atria', 240, 105, 110], ['ventricles', 238, 235, 105],
        ['conduction', 150, 78, 60], ['valves', 240, 170, 120],
      ].map(([a, cx, cy, r]) =>
        focus === a ? (
          <circle key={a as string} cx={cx as number} cy={cy as number} r={r as number} fill="none"
            stroke="url(#haloGrad)" strokeWidth={3} className="medos-anchor-pulse" />
        ) : null,
      )}
    </>
  ) : null

  return (
    <svg
      className="medos-scene"
      viewBox="0 0 480 340"
      role="img"
      aria-label="Living diagram of the beating heart: chambers, valves, conduction and blood flow"
      data-playing={playing && !reduce ? 'true' : 'false'}
    >
      <defs>
        <radialGradient id="heartBody" cx="42%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#fecaca" />
          <stop offset="55%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
        <radialGradient id="raBody" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </radialGradient>
        <radialGradient id="laBody" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#fecaca" />
          <stop offset="100%" stopColor="#ef4444" />
        </radialGradient>
        <linearGradient id="haloGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* backdrop aura */}
      <ellipse cx={240} cy={185} rx={195} ry={140} fill="#f43f5e" opacity={0.07} />

      <g data-anchor="whole" opacity={s('whole')}>
        {/* ── great vessels behind ── */}
        <g data-anchor="pa" opacity={Math.max(s('pa'), 0.999) && (focus ? s('pa') : 1)}>
          <path d="M168,236 C146,188 138,116 166,60 C176,40 196,38 210,52 C226,68 240,78 254,82 L246,100 C232,96 220,88 206,72 C196,62 188,62 182,76 C158,126 164,188 186,228 Z"
            fill={BLUE} opacity={0.75} />
          <text x={118} y={52} fontSize={11} fontWeight={700} fill={BLUE}>Pulmonary artery → lungs</text>
        </g>
        <g data-anchor="aorta" opacity={focus ? s('aorta') : 1}>
          <path d="M300,236 C328,194 344,126 322,76 C312,54 292,50 262,56 L258,44 C296,36 324,44 336,70 C360,124 344,200 314,244 Z"
            fill={RED_O2} opacity={0.8} />
          <text x={322} y={42} fontSize={11} fontWeight={700} fill={RED_O2}>Aorta → whole body</text>
          <path d="M262,60 C236,66 222,74 214,86" fill="none" stroke={RED_O2} strokeWidth={9} strokeLinecap="round" opacity={0.8} />
        </g>

        {/* ── atria (beat on their own clock) ── */}
        <g data-anchor="atria" opacity={lit('atria', 1)}>
          <g style={reduce ? undefined : { animation: 'medos-atria 1.6s ease-in-out infinite', transformOrigin: '128px 110px', transformBox: 'view-box' }}>
            <path data-anchor="ra" d="M78,96 C74,64 96,42 126,44 C154,46 170,66 168,94 C168,112 158,124 142,128 L106,128 C88,124 80,112 78,96 Z"
              fill="url(#raBody)" opacity={focus ? s('ra') : 1} filter="url(#softGlow)" />
          </g>
          <g style={reduce ? undefined : { animation: 'medos-atria 1.6s ease-in-out infinite', transformOrigin: '352px 110px', transformBox: 'view-box' }}>
            <path data-anchor="la" d="M402,96 C406,64 384,42 354,44 C326,46 310,66 312,94 C312,112 322,124 338,128 L374,128 C392,124 400,112 402,96 Z"
              fill="url(#laBody)" opacity={focus ? s('la') : 1} filter="url(#softGlow)" />
          </g>
        </g>

        {/* ── ventricles (the systole drum) ── */}
        <g data-anchor="ventricles" opacity={lit('ventricles', 1)}>
          <g style={reduce ? undefined : { animation: 'medos-beat 1.6s ease-in-out infinite', transformOrigin: '160px 240px', transformBox: 'view-box' }}>
            <path data-anchor="rv" d="M104,132 L166,132 C186,138 194,158 192,182 C190,216 176,258 158,286 C148,300 132,300 122,286 C106,258 96,214 96,178 C96,158 98,142 104,132 Z"
              fill="#60a5fa" opacity={0.92} filter="url(#softGlow)" />
          </g>
          <g style={reduce ? undefined : { animation: 'medos-beat 1.6s ease-in-out infinite', transformOrigin: '316px 240px', transformBox: 'view-box' }}>
            <path data-anchor="lv" d="M376,132 L314,132 C294,138 286,158 288,182 C290,216 304,258 322,286 C332,300 348,300 358,286 C374,258 384,214 384,178 C384,158 382,142 376,132 Z"
              fill="#ef4444" opacity={0.95} filter="url(#softGlow)" />
          </g>
          {/* interventricular septum */}
          <line x1={240} y1={132} x2={240} y2={282} stroke="#7f1d1d" strokeWidth={5} strokeDasharray="8 5" opacity={0.55} />
        </g>

        {/* ── valves: little doors that flip ── */}
        <g data-anchor="valves" opacity={focus ? s('valves') : 1}>
          {[
            [172, 132, -12], [306, 132, 12],
          ].map(([x, y, rot], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`} style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite' }}>
              <path d="M0,0 L-13,-9 L-11,6 Z" fill="#fde68a" stroke="#b45309" strokeWidth={1.4} />
              <path d="M0,0 L13,-9 L11,6 Z" fill="#fde68a" stroke="#b45309" strokeWidth={1.4} />
            </g>
          ))}
          <text x={172} y={158} fontSize={10} fontWeight={700} fill="#b45309" textAnchor="middle">tricuspid</text>
          <text x={306} y={158} fontSize={10} fontWeight={700} fill="#b45309" textAnchor="middle">mitral</text>
          <circle cx={200} cy={92} r={7} fill="#fde68a" stroke="#b45309" strokeWidth={1.4} />
          <circle cx={278} cy={88} r={7} fill="#fde68a" stroke="#b45309" strokeWidth={1.4} />
          <text x={200} y={76} fontSize={9.5} fontWeight={700} fill="#b45309" textAnchor="middle">pulmonary</text>
          <text x={278} y={72} fontSize={9.5} fontWeight={700} fill="#b45309" textAnchor="middle">aortic</text>
        </g>

        {/* ── conduction system: spark → wires ── */}
        <g data-anchor="conduction" opacity={focus ? s('conduction') : 1} filter="url(#softGlow)">
          <circle data-anchor="sa" cx={132} cy={58} r={7} fill="#fbbf24"
            style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite' }} />
          <text x={96} y={40} fontSize={10.5} fontWeight={800} fill="#b45309">SA node</text>
          <path d="M132,64 C136,84 140,96 144,110" fill="none" stroke="#fbbf24" strokeWidth={2.5} strokeDasharray="5 4" className={reduce ? undefined : 'medos-dash'} />
          <circle data-anchor="av" cx={146} cy={114} r={5.5} fill="#f97316"
            style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite', animationDelay: '0.5s' }} />
          <text x={158} y={112} fontSize={9.5} fontWeight={700} fill="#b45309">AV node</text>
          <path d="M146,118 C170,150 196,186 210,226 M146,118 C186,146 226,190 238,230"
            fill="none" stroke="#fbbf24" strokeWidth={2.5} strokeDasharray="5 4"
            className={reduce ? undefined : 'medos-dash'} style={{ animationDuration: '1.3s' }} />
          <path d="M146,118 C196,140 258,168 302,214" fill="none" stroke="#fbbf24" strokeWidth={2}
            strokeDasharray="4 5" className={reduce ? undefined : 'medos-dash'} style={{ animationDuration: '1.9s' }} opacity={0.7} />
        </g>

        {/* ── flowing blood ── */}
        <g data-anchor="flow">
          <Particles d={D_BLUE} color={BLUE} dur={4} delay={0} />
          <Particles d={D_RED} color={RED} dur={4} delay={0.8} />
          <Particles d={D_PA} color={BLUE} dur={5} delay={1.4} />
          <Particles d={D_AO} color={RED} dur={5} delay={2.1} />
        </g>
      </g>

      {/* side captions */}
      <g fontSize={11} fontWeight={800}>
        <text x={70} y={300} fill={BLUE}>RIGHT ♥ blue · to the lungs</text>
        <text x={288} y={300} fill={RED}>LEFT ♥ red · to the body</text>
      </g>

      {halo}
    </svg>
  )
}
