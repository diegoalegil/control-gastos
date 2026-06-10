import type { CSSProperties } from 'react'
import { EmptyState } from '../components/EmptyState'
import { FadeCard } from '../components/FadeCard'
import { IconPlus } from '../components/Icons'
import { IllusCiclo } from '../components/Illustrations'
import { Switch } from '../components/Switch'
import { db } from '../lib/db'
import { addMonths, currentMonth, shortDate } from '../lib/dates'
import { formatSigned } from '../lib/money'
import { materializeRecurring, nextOccurrence, remainingInstallments } from '../lib/recurring'
import { useRecurringRules } from '../state/hooks'
import type { Category, RecurringRule } from '../lib/types'

export function Recurrentes({
  catMap,
  onEdit,
  onAdd,
  onMaterialized,
}: {
  catMap: Map<string, Category>
  onEdit: (rule: RecurringRule) => void
  onAdd: () => void
  onMaterialized: (n: number) => void
}) {
  const rules = useRecurringRules()

  const toggle = async (rule: RecurringRule) => {
    if (rule.active) {
      await db.recurring.update(rule.id, { active: false })
      return
    }
    // al reactivar no se recuperan los meses en pausa: solo del mes actual en adelante
    await db.recurring.update(rule.id, {
      active: true,
      lastMaterializedMonth: addMonths(currentMonth(), -1),
    })
    const n = await materializeRecurring()
    if (n > 0) onMaterialized(n)
  }

  return (
    <div className="screen">
      <h1 className="screen-title">Recurrentes</h1>

      {rules && rules.length === 0 && (
        <EmptyState
          art={<IllusCiclo />}
          title="Nada se repite todavía"
          caption="Nómina, alquiler, suscripciones… créalas una vez y se apuntarán solas cada mes."
          action={
            <button type="button" className="btn btn-small" onClick={onAdd}>
              <IconPlus size={18} /> Nueva recurrente
            </button>
          }
        />
      )}

      {rules && rules.length > 0 && (
        <>
          <FadeCard className="settings-group">
            {rules.map((r) => {
              const cat = catMap.get(r.categoryId)
              const next = nextOccurrence(r)
              const remaining = remainingInstallments(r)
              const pendientes = remaining !== null ? Math.round((remaining * r.amountCents) / 100) : 0
              const state = !r.active
                ? 'en pausa'
                : remaining !== null
                  ? remaining > 0
                    ? `${remaining} ${remaining === 1 ? 'cuota' : 'cuotas'} · faltan ${pendientes} €`
                    : 'finalizada'
                  : next
                    ? `próximo ${shortDate(next)}`
                    : 'finalizada'
              return (
                <div key={r.id} className="row row-divided">
                  <button
                    type="button"
                    className="row"
                    style={{ padding: 0, border: 'none', flex: 1, minWidth: 0 }}
                    onClick={() => onEdit(r)}
                  >
                    <span
                      className="cat-bubble"
                      style={{ '--bubble': `var(--cat-${cat?.color ?? 10})` } as CSSProperties}
                    >
                      {cat?.icon ?? '❓'}
                    </span>
                    <span className="row-body">
                      <span className="row-title">{r.note || cat?.name || 'Sin categoría'}</span>
                      <span className="row-sub">
                        {formatSigned(r.amountCents, r.type)}
                        {remaining === null ? ` · día ${r.dayOfMonth}` : ''} · {state}
                      </span>
                    </span>
                  </button>
                  <Switch on={r.active} onChange={() => void toggle(r)} />
                </div>
              )
            })}
          </FadeCard>

          <p className="settings-note">
            Los movimientos se apuntan solos al abrir la app cuando llega su día.
          </p>

          <button type="button" className="btn btn-secondary" onClick={onAdd}>
            <IconPlus size={19} /> Nueva recurrente
          </button>
        </>
      )}
    </div>
  )
}
