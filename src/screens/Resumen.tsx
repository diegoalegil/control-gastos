import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { AnimatedAmount } from '../components/AnimatedAmount'
import { DonutChart } from '../components/DonutChart'
import { EmptyState } from '../components/EmptyState'
import { FadeCard } from '../components/FadeCard'
import { IconChevronLeft, IconChevronRight, IconPlus } from '../components/Icons'
import { IllusPlanta } from '../components/Illustrations'
import { MonthBars } from '../components/MonthBars'
import { ProgressBar } from '../components/ProgressBar'
import { addMonths, currentMonth, monthLabel } from '../lib/dates'
import { formatBalance, formatCents, formatSigned } from '../lib/money'
import { monthTotals, useMonthTransactions, useMonthsTotals } from '../state/hooks'
import type { Category } from '../lib/types'

const spring = { type: 'spring', stiffness: 500, damping: 30 } as const

export function Resumen({
  categories,
  catMap,
  onAdd,
}: {
  categories: Category[]
  catMap: Map<string, Category>
  onAdd: () => void
}) {
  const [ym, setYm] = useState(currentMonth())
  const txs = useMonthTransactions(ym)
  const totals = useMemo(() => monthTotals(txs ?? []), [txs])

  const monthsList = useMemo(() => Array.from({ length: 6 }, (_, i) => addMonths(ym, i - 5)), [ym])
  const bars = useMonthsTotals(monthsList)

  const segments = useMemo(() => {
    const sorted = [...totals.byCategory.entries()].sort((a, b) => b[1] - a[1])
    return sorted.map(([catId, value]) => {
      const cat = catMap.get(catId)
      return {
        id: catId,
        value,
        color: `var(--cat-${cat?.color ?? 10})`,
        name: cat ? `${cat.icon} ${cat.name}` : 'Sin categoría',
      }
    })
  }, [totals, catMap])

  const budgets = useMemo(
    () =>
      categories.filter(
        (c) => c.type === 'gasto' && !c.archived && (c.monthlyBudgetCents ?? 0) > 0,
      ),
    [categories],
  )

  const label = monthLabel(ym)

  return (
    <div className="screen">
      <div className="month-nav">
        <motion.button
          type="button"
          className="month-nav-arrow glass"
          whileTap={{ scale: 0.88 }}
          transition={spring}
          onClick={() => setYm(addMonths(ym, -1))}
          aria-label="Mes anterior"
        >
          <IconChevronLeft />
        </motion.button>
        <div className="month-nav-label glass">
          {label}
          <input
            type="month"
            value={ym}
            onChange={(e) => e.target.value && setYm(e.target.value)}
            aria-label="Elegir mes"
          />
        </div>
        <motion.button
          type="button"
          className="month-nav-arrow glass"
          whileTap={{ scale: 0.88 }}
          transition={spring}
          onClick={() => setYm(addMonths(ym, 1))}
          aria-label="Mes siguiente"
        >
          <IconChevronRight />
        </motion.button>
      </div>

      <FadeCard>
        <div className="balance-label">Balance de {label.toLowerCase()}</div>
        <div className={`balance-amount${totals.balance < 0 ? ' neg' : ''}`}>
          <AnimatedAmount cents={totals.balance} format={formatBalance} />
        </div>
        <div className="balance-stats">
          <div className="stat">
            <div className="stat-label">Ingresos</div>
            <div className="stat-value pos">
              <AnimatedAmount cents={totals.income} format={(c) => formatSigned(c, 'ingreso')} />
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Gastos</div>
            <div className="stat-value">
              <AnimatedAmount cents={totals.expense} format={(c) => formatSigned(c, 'gasto')} />
            </div>
          </div>
        </div>
      </FadeCard>

      {txs && txs.length === 0 && (
        <FadeCard index={1}>
          <EmptyState
            art={<IllusPlanta />}
            title={`Nada en ${label.toLowerCase()}`}
            caption="Añade tu primer movimiento y aquí verás en qué se va el dinero."
            action={
              <button type="button" className="btn btn-small" onClick={onAdd}>
                <IconPlus size={18} /> Añadir movimiento
              </button>
            }
          />
        </FadeCard>
      )}

      {segments.length > 0 && (
        <FadeCard index={1}>
          <div className="card-title">Gastos por categoría</div>
          <DonutChart key={ym} segments={segments}>
            <div className="v">{formatCents(totals.expense)}</div>
            <div className="l">en gastos</div>
          </DonutChart>
          <div>
            {segments.map((s) => (
              <div key={s.id} className="legend-row">
                <span className="legend-dot" style={{ background: s.color }} />
                <span className="legend-name">{s.name}</span>
                <span className="legend-pct">{Math.round((s.value / totals.expense) * 100)}%</span>
                <span className="legend-amount">{formatCents(s.value)}</span>
              </div>
            ))}
          </div>
        </FadeCard>
      )}

      {budgets.length > 0 && (
        <FadeCard index={2}>
          <div className="card-title">Presupuestos de {label.toLowerCase()}</div>
          {budgets.map((c) => {
            const spent = totals.byCategory.get(c.id) ?? 0
            const budget = c.monthlyBudgetCents ?? 0
            const frac = spent / budget
            const left = budget - spent
            return (
              <div key={c.id} className="budget-row">
                <div className="budget-head">
                  <span className="budget-name">
                    {c.icon} {c.name}
                  </span>
                  {left >= 0 ? (
                    <span className="budget-nums">
                      <strong>{formatCents(spent)}</strong> de {formatCents(budget)}
                    </span>
                  ) : (
                    <span className="budget-nums budget-over">
                      {formatCents(-left)} de más
                    </span>
                  )}
                </div>
                <ProgressBar fraction={frac} color={`var(--cat-${c.color})`} />
              </div>
            )
          })}
        </FadeCard>
      )}

      <FadeCard index={3}>
        <div className="card-title">Últimos 6 meses</div>
        {bars && <MonthBars data={bars} selected={ym} onSelect={setYm} />}
      </FadeCard>
    </div>
  )
}
