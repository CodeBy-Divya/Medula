// ─── Tiny force-directed graph layout (deterministic, no deps) ───
// Used by the Medical Map to arrange knowledge nodes in 2D.

export interface LayoutNode { id: string; x: number; y: number; vx: number; vy: number; r: number }
export interface LayoutEdge { from: string; to: string }

export interface LayoutOptions {
  width: number
  height: number
  iterations?: number
  seed?: number
}

// Mulberry32 PRNG for deterministic layouts
function prng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function forceLayout(
  nodeIds: { id: string; r: number }[],
  edges: LayoutEdge[],
  opts: LayoutOptions,
): Map<string, { x: number; y: number }> {
  const { width, height, iterations = 260, seed = 7 } = opts
  const rand = prng(seed)
  const nodes = new Map<string, LayoutNode>()
  const cx = width / 2, cy = height / 2
  for (const n of nodeIds) {
    const angle = rand() * Math.PI * 2
    const rad = 60 + rand() * Math.min(width, height) * 0.32
    nodes.set(n.id, { id: n.id, x: cx + Math.cos(angle) * rad, y: cy + Math.sin(angle) * rad, vx: 0, vy: 0, r: n.r })
  }
  const ids = [...nodes.keys()]
  const edgeList = edges
    .filter(e => nodes.has(e.from) && nodes.has(e.to))
    .map(e => [nodes.get(e.from)!, nodes.get(e.to)!] as const)

  const repulsion = Math.min(width, height) * 0.55
  const spring = 0.02
  const ideal = 120
  const centerPull = 0.012

  for (let it = 0; it < iterations; it++) {
    const cooling = 1 - it / iterations
    // repulsion (n² — fine for our node counts ≤ 60)
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = nodes.get(ids[i])!, b = nodes.get(ids[j])!
        let dx = a.x - b.x, dy = a.y - b.y
        let d2 = dx * dx + dy * dy
        if (d2 < 1) { dx = (rand() - 0.5); dy = (rand() - 0.5); d2 = 1 }
        const d = Math.sqrt(d2)
        const f = (repulsion * (a.r + b.r)) / d2
        const fx = (dx / d) * f, fy = (dy / d) * f
        a.vx += fx; a.vy += fy
        b.vx -= fx; b.vy -= fy
      }
    }
    // springs along edges
    for (const [a, b] of edgeList) {
      const dx = b.x - a.x, dy = b.y - a.y
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      const f = (d - ideal) * spring
      const fx = (dx / d) * f, fy = (dy / d) * f
      a.vx += fx; a.vy += fy
      b.vx -= fx; b.vy -= fy
    }
    // center gravity + integrate
    for (const id of ids) {
      const n = nodes.get(id)!
      n.vx += (cx - n.x) * centerPull
      n.vy += (cy - n.y) * centerPull
      n.vx *= 0.85; n.vy *= 0.85
      n.x += Math.max(-14, Math.min(14, n.vx * cooling))
      n.y += Math.max(-14, Math.min(14, n.vy * cooling))
      // keep in bounds
      n.x = Math.max(n.r + 8, Math.min(width - n.r - 8, n.x))
      n.y = Math.max(n.r + 8, Math.min(height - n.r - 8, n.y))
    }
  }
  const out = new Map<string, { x: number; y: number }>()
  for (const [id, n] of nodes) out.set(id, { x: n.x, y: n.y })
  return out
}
