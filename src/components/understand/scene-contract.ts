'use client'

// ─── UNDERSTAND · living-scene contract ───
// Every scene is a self-contained SVG ("the whole diagram is moving and live").
// - Continuous loops (heartbeat, particle flow, glow) are CSS animations so the
//   stage can pause everything with one [data-playing="false"] rule.
// - Narration steps + weak-point focus drive EMPHASIS (glow, opacity, zoom)
//   via normal React state — scenes never own step state.
// - Key elements carry data-anchor="id" so steps/weak-points can spotlight them.

export interface SceneProps {
  /** active narration step index (0-based) — -1 means "no step selected" */
  step: number
  /** false freezes every CSS animation (pause button) */
  playing: boolean
  /** respect prefers-reduced-motion: no loops, no tilt */
  reduce: boolean
  /** data-anchor id to spotlight (clicked weak point), null for none */
  focus?: string | null
}

/** Shared spotlight helper — dim everything except the focused anchor's group. */
export function anchorGlow(focus: string | null | undefined, anchor?: string): number {
  if (!focus) return 1
  return focus === anchor ? 1 : 0.28
}
