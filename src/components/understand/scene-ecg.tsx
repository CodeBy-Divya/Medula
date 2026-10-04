'use client'

// ─── LIVING SCENE · The ECG — the heart writing its own diary ───
// Classic ECG paper, a repeating cardiac waveform, a sweeping stylus dot and
// per-step emphasis on P / PR / QRS / ST / T / QT. Pairs with the heart scene.

import { anchorGlow, type SceneProps } from './scene-contract'

const BASE_Y = 178

// one-cycle waveform, then duplicated for a continuous strip
const CYCLE =
  `M0,${BASE_Y} C14,${BASE_Y} 20,${BASE_Y} 26,${BASE_Y}` + // flat
  ` C34,${BASE_Y - 4} 40,${BASE_Y - 22} 47,${BASE_Y - 22}` + // P up
  ` C54,${BASE_Y - 22} 60,${BASE_Y - 4} 68,${BASE_Y}` + // P down
  ` C86,${BASE_Y} 96,${BASE_Y} 104,${BASE_Y}` + // PR
  ` L108,${BASE_Y + 10} L114,${BASE_Y - 52} L120,${BASE_Y + 26} L124,${BASE_Y}` + // QRS
  ` C138,${BASE_Y} 148,${BASE_Y} 158,${BASE_Y}` + // ST
  ` C170,${BASE_Y - 6} 180,${BASE_Y - 30} 192,${BASE_Y - 30}` + // T up
  ` C204,${BASE_Y - 30} 214,${BASE_Y - 5} 226,${BASE_Y}` + // T down
  ` C240,${BASE_Y} 244,${BASE_Y} 248,${BASE_Y}`

const SEGMENTS: { id: string; label: string; x: number; w: number; text: string }[] = [
  { id: 'p', label: 'P', x: 30, w: 40, text: 'P — atria fire' },
  { id: 'pr', label: 'PR', x: 70, w: 36, text: 'PR — AV pause' },
  { id: 'qrs', label: 'QRS', x: 104, w: 24, text: 'QRS — ventricles fire' },
  { id: 'st', label: 'ST', x: 128, w: 34, text: 'ST — plateau' },
  { id: 't', label: 'T', x: 162, w: 62, text: 'T — reset' },
  { id: 'qt', label: 'QT', x: 104, w: 120, text: 'QT — fire + reset' },
]

export function EcgScene({ step, playing, reduce, focus }: SceneProps) {
  const active = focus ?? (step >= 0 && step < SEGMENTS.length ? SEGMENTS[step].id : null)

  return (
    <svg
      className="medos-scene"
      viewBox="0 0 480 340"
      role="img"
      aria-label="Living ECG: P wave, PR segment, QRS complex, ST segment and T wave on rolling paper"
      data-playing={playing && !reduce ? 'true' : 'false'}
    >
      <defs>
        <linearGradient id="ecgGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
          <stop offset="50%" stopColor="#f43f5e" stopOpacity="1" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* paper */}
      <rect x={8} y={28} width={464} height={284} rx={14} fill="#fff1f2" opacity={0.92} />
      <g stroke="#fda4af" strokeWidth={0.6} opacity={0.65}>
        {Array.from({ length: 29 }, (_, i) => (
          <line key={`v${i}`} x1={8 + i * 16} y1={28} x2={8 + i * 16} y2={312} />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <line key={`h${i}`} x1={8} y1={28 + i * 16} x2={472} y2={28 + i * 16} />
        ))}
      </g>
      <g stroke="#fb7185" strokeWidth={1.4} opacity={0.75}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`V${i}`} x1={8 + i * 64} y1={28} x2={8 + i * 64} y2={312} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`H${i}`} x1={8} y1={28 + i * 64} x2={472} y2={28 + i * 64} />
        ))}
      </g>

      {/* segment bands — spotlight the active one */}
      {SEGMENTS.map((seg, i) => {
        const on = active === seg.id
        return (
          <g key={seg.id} opacity={active ? (on ? 1 : 0.3) : 0.85} data-anchor={seg.id}>
            <rect x={8 + seg.x} y={40} width={seg.w} height={264} rx={6}
              fill={on ? '#fbbf24' : '#f43f5e'} opacity={on ? 0.14 : 0.05} />
            <text x={8 + seg.x + seg.w / 2} y={56} textAnchor="middle"
              fontSize={12} fontWeight={800} fill={on ? '#b45309' : '#9f1239'}>
              {seg.label}
            </text>
            {!reduce && (
              <text x={8 + seg.x + seg.w / 2} y={72} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#9f1239" opacity={0.75}>
                {seg.text}
              </text>
            )}
            {on && !reduce && (
              <rect x={8 + seg.x} y={40} width={seg.w} height={264} rx={6} fill="none"
                stroke="#f59e0b" strokeWidth={2} style={{ animation: 'medos-glow 1.4s ease-in-out infinite' }} />
            )}
            {i === 0 && <text x={8 + seg.x} y={320} fontSize={0}> </text>}
          </g>
        )
      })}

      {/* waveform: two cycles for a continuous strip */}
      <g transform={`translate(8 ${0}) scale(1)`}>
        <path d={`${CYCLE} ${CYCLE.replace('M0,', 'M248,')}`}
          fill="none" stroke="#e11d48" strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round"
          opacity={active ? 0.45 : 0.9} />
        <path d={`${CYCLE} ${CYCLE.replace('M0,', 'M248,')}`}
          fill="none" stroke="#be123c" strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray="26 900" opacity={0.95}
          style={reduce ? undefined : { animation: 'medos-dash 3.2s linear infinite' }} />
      </g>

      {/* sweeping stylus */}
      {!reduce && (
        <g style={{ animation: 'medos-scan 3.2s linear infinite' }}>
          <line x1={8} y1={28} x2={8} y2={312} stroke="url(#ecgGlow)" strokeWidth={3} />
          <circle cx={8} cy={BASE_Y} r={5} fill="#e11d48" />
        </g>
      )}

      {/* heart-rate readout */}
      <g transform="translate(360 66)" data-anchor="hr">
        <rect x={0} y={0} width={92} height={44} rx={10} fill="#0f172a" opacity={0.92} />
        <text x={46} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#94a3b8">SINUS RHYTHM</text>
        <text x={46} y={37} textAnchor="middle" fontSize={16} fontWeight={800} fill="#4ade80"
          style={reduce ? undefined : { animation: 'medos-glow 1.6s ease-in-out infinite' }}>
          75 bpm
        </text>
      </g>
    </svg>
  )
}
