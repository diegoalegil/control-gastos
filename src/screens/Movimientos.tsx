import { useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CatBubble } from '../components/CatBubble'
import { EmptyState } from '../components/EmptyState'
import { FadeCard } from '../components/FadeCard'
import { IconSearch, IconTrash } from '../components/Icons'
import { IllusRecibo } from '../components/Illustrations'
import { db } from '../lib/db'
import { dayLabel } from '../lib/dates'
import { formatBalance, formatSigned } from '../lib/money'
import { useAllTransactions, useRecurringRules } from '../state/hooks'
import type { Category, Transaction } from '../lib/types'

type TypeFilter = 'todos' | 'gasto' | 'ingreso'

function SwipeRow({ children, onDelete }: { children: ReactNode; onDelete: () => void }) {
  return (
    <motion.div
      className="swipe-item"
      layout
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
    >
      <div className="swipe-delete">
        <IconTrash size={21} />
      </div>
      <motion.div
        className="swipe-content"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.45, right: 0 }}
        dragSnapToOrigin
        onDragEnd={(_, info) => {
          if (info.offset.x < -90 || info.velocity.x < -600) onDelete()
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export function Movimientos({
  categories,
  catMap,
  onEdit,
  onDeleted,
}: {
  categories: Category[]
  catMap: Map<string, Category>
  onEdit: (tx: Transaction) => void
  onDeleted: (tx: Transaction) => void
}) {
  const txs = useAllTransactions()
  const rules = useRecurringRules()
  const ruleIcon = useMemo(
    () => new Map((rules ?? []).filter((r) => r.iconId).map((r) => [r.id, r.iconId as string])),
    [rules],
  )
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todos')
  const [catFilter, setCatFilter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!txs) return undefined
    const needle = q.trim().toLowerCase()
    return txs.filter((t) => {
      if (typeFilter !== 'todos' && t.type !== typeFilter) return false
      if (catFilter && t.categoryId !== catFilter) return false
      if (needle) {
        const cat = catMap.get(t.categoryId)
        const hay = `${t.note ?? ''} ${cat?.name ?? ''}`.toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [txs, q, typeFilter, catFilter, catMap])

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    for (const t of filtered ?? []) {
      const list = map.get(t.date)
      if (list) list.push(t)
      else map.set(t.date, [t])
    }
    return [...map.entries()]
  }, [filtered])

  const deleteTx = async (t: Transaction) => {
    await db.transactions.delete(t.id)
    onDeleted(t)
  }

  const hasAny = (txs?.length ?? 0) > 0
  const visibleCats = categories.filter((c) => !c.archived)

  return (
    <div className="screen">
      <h1 className="screen-title">Movimientos</h1>

      {hasAny && (
        <>
          <div className="search">
            <IconSearch size={19} />
            <input
              className="input"
              type="search"
              placeholder="Buscar por nota o categoría"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="chip-row">
            {(
              [
                ['todos', 'Todos'],
                ['gasto', 'Gastos'],
                ['ingreso', 'Ingresos'],
              ] as Array<[TypeFilter, string]>
            ).map(([v, l]) => (
              <button
                key={v}
                type="button"
                className={`chip${typeFilter === v ? ' active' : ''}`}
                onClick={() => setTypeFilter(v)}
              >
                {l}
              </button>
            ))}
            {visibleCats.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`chip${catFilter === c.id ? ' active' : ''}`}
                onClick={() => setCatFilter(catFilter === c.id ? null : c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}

      {filtered && filtered.length === 0 && (
        hasAny ? (
          <p className="settings-note" style={{ textAlign: 'center', marginTop: 28 }}>
            Nada coincide con tu búsqueda.
          </p>
        ) : (
          <EmptyState
            art={<IllusRecibo />}
            title="Sin movimientos todavía"
            caption="Pulsa el botón + para apuntar tu primer gasto o ingreso."
          />
        )
      )}

      {groups.map(([date, list], gi) => {
        const net = list.reduce((s, t) => s + (t.type === 'ingreso' ? t.amountCents : -t.amountCents), 0)
        return (
          <FadeCard key={date} index={gi} className="">
            <div className="day-head">
              <h4>{dayLabel(date)}</h4>
              <span>{formatBalance(net)}</span>
            </div>
            <div className="tx-card">
              <AnimatePresence initial={false}>
                {list.map((t) => {
                  const cat = catMap.get(t.categoryId)
                  return (
                    <SwipeRow key={t.id} onDelete={() => void deleteTx(t)}>
                      <button type="button" className="row row-divided" onClick={() => onEdit(t)}>
                        <CatBubble
                          category={cat}
                          iconId={t.recurringId ? ruleIcon.get(t.recurringId) : undefined}
                        />
                        <span className="row-body">
                          <span className="row-title">{t.note || cat?.name || 'Sin categoría'}</span>
                          {(() => {
                            const showCat = t.note && cat && t.note !== cat.name
                            const parts = [showCat ? cat.name : null, t.recurringId ? 'Recurrente' : null]
                              .filter(Boolean)
                              .join(' · ')
                            return parts ? <span className="row-sub">{parts}</span> : null
                          })()}
                        </span>
                        <span className={`row-amount${t.type === 'ingreso' ? ' pos' : ''}`}>
                          {formatSigned(t.amountCents, t.type)}
                        </span>
                      </button>
                    </SwipeRow>
                  )
                })}
              </AnimatePresence>
            </div>
          </FadeCard>
        )
      })}
    </div>
  )
}
