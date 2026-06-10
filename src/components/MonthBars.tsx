import { motion, useReducedMotion } from 'motion/react'
import { monthShortLabel } from '../lib/dates'

export interface MonthDatum {
  ym: string
  income: number
  expense: number
}

/** Barras de ingresos/gastos de los últimos meses. Tocar un mes navega a él. */
export function MonthBars({
  data,
  selected,
  onSelect,
}: {
  data: MonthDatum[]
  selected: string
  onSelect: (ym: string) => void
}) {
  const reduced = useReducedMotion()
  const W = 312
  const H = 136
  const chartH = 106
  const groupW = W / data.length
  const barW = 11
  const inner = 5
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1)
  const h = (v: number) => Math.max((v / max) * (chartH - 8), v > 0 ? 3 : 1.5)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Comparativa mensual">
      {data.map((d, i) => {
        const cx = i * groupW + groupW / 2
        const active = d.ym === selected
        const hi = h(d.income)
        const he = h(d.expense)
        return (
          <g key={d.ym} opacity={active ? 1 : 0.55} onClick={() => onSelect(d.ym)} style={{ cursor: 'pointer' }}>
            <rect x={i * groupW} y={0} width={groupW} height={H} fill="transparent" />
            <motion.rect
              x={cx - barW - inner / 2}
              width={barW}
              rx={4}
              fill="var(--bar-pos)"
              initial={reduced ? false : { y: chartH, height: 0 }}
              animate={{ y: chartH - hi, height: hi }}
              transition={{ type: 'spring', stiffness: 240, damping: 30, delay: i * 0.035 }}
            />
            <motion.rect
              x={cx + inner / 2}
              width={barW}
              rx={4}
              fill="var(--bar-neg)"
              initial={reduced ? false : { y: chartH, height: 0 }}
              animate={{ y: chartH - he, height: he }}
              transition={{ type: 'spring', stiffness: 240, damping: 30, delay: i * 0.035 + 0.02 }}
            />
            <text
              x={cx}
              y={H - 8}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight={active ? 700 : 600}
              fill={active ? 'var(--accent)' : 'var(--ink-3)'}
            >
              {monthShortLabel(d.ym)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
