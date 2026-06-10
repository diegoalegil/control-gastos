import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export interface DonutSegment {
  id: string
  value: number
  color: string
}

/** Donut SVG con arcos que barren al entrar. children va al centro. */
export function DonutChart({
  segments,
  size = 196,
  strokeWidth = 25,
  children,
}: {
  segments: DonutSegment[]
  size?: number
  strokeWidth?: number
  children?: ReactNode
}) {
  const reduced = useReducedMotion()
  const r = (size - strokeWidth) / 2
  const c = size / 2
  const circ = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0)

  // hueco entre arcos; los extremos redondeados ya añaden ~strokeWidth visual
  const gap = segments.length > 1 ? strokeWidth * 1.15 : 0

  let acc = 0
  const arcs = segments.map((seg) => {
    const frac = seg.value / total
    const len = Math.max(frac * circ - gap, 1.5)
    const offset = -(acc * circ + gap / 2)
    acc += frac
    return { ...seg, len, offset }
  })

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${c} ${c})`}>
          {arcs.map((a, i) => (
            <motion.circle
              key={a.id}
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDashoffset={a.offset}
              initial={{ strokeDasharray: reduced ? `${a.len} ${circ - a.len}` : `0.5 ${circ - 0.5}` }}
              animate={{ strokeDasharray: `${a.len} ${circ - a.len}` }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: [0.3, 0.1, 0.2, 1] }}
            />
          ))}
        </g>
      </svg>
      <div className="donut-center">{children}</div>
    </div>
  )
}
