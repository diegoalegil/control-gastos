import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Sheet } from './components/Sheet'
import { TabBar, type Tab } from './components/TabBar'
import { ToastHost, type ToastData } from './components/Toast'
import { db, getSetting, setSetting } from './lib/db'
import { materializeRecurring } from './lib/recurring'
import { seedIfNeeded } from './lib/seed'
import { Ajustes } from './screens/Ajustes'
import { CategoryForm } from './screens/CategoryForm'
import { Movimientos } from './screens/Movimientos'
import { Recurrentes } from './screens/Recurrentes'
import { Resumen } from './screens/Resumen'
import { RuleForm } from './screens/RuleForm'
import { TxForm } from './screens/TxForm'
import { Welcome } from './screens/Welcome'
import { useCategories, useCategoryMap } from './state/hooks'
import { useTheme } from './state/theme'
import type { Category, RecurringRule, Transaction } from './lib/types'

type SheetState =
  | { kind: 'tx'; edit?: Transaction }
  | { kind: 'rule'; edit?: RecurringRule }
  | { kind: 'category'; edit?: Category; usageCount: number }
  | null

const recurrentesMsg = (n: number) =>
  n === 1 ? 'Se apuntó 1 movimiento recurrente' : `Se apuntaron ${n} movimientos recurrentes`

export default function App() {
  useTheme()
  const [tab, setTab] = useState<Tab>('resumen')
  const [ready, setReady] = useState(false)
  const [sheet, setSheet] = useState<SheetState>(null)
  const [toast, setToast] = useState<ToastData | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const categories = useCategories()
  const catMap = useCategoryMap(categories)
  const welcomed = useLiveQuery(
    async () => (await getSetting<boolean>('welcomed')) ?? false,
    [],
    null as boolean | null,
  )

  const notify = (msg: string, actionLabel?: string, onAction?: () => void) => {
    clearTimeout(toastTimer.current)
    const id = Date.now()
    setToast({
      id,
      msg,
      actionLabel,
      onAction: onAction
        ? () => {
            onAction()
            setToast(null)
          }
        : undefined,
    })
    toastTimer.current = setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 4500)
  }

  useEffect(() => {
    let cancelled = false
    void (async () => {
      await seedIfNeeded()
      const n = await materializeRecurring()
      if (cancelled) return
      setReady(true)
      if (n > 0) notify(recurrentesMsg(n))
      void navigator.storage?.persist?.().catch(() => {})
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!ready || welcomed === null) return null

  const closeSheet = () => setSheet(null)

  const savedAndClose = (msg: string) => {
    closeSheet()
    notify(msg)
  }

  const deleteTxWithUndo = (tx: Transaction) => {
    closeSheet()
    void db.transactions.delete(tx.id).then(() => {
      notify('Movimiento eliminado', 'Deshacer', () => void db.transactions.add(tx))
    })
  }

  const openCategory = async (edit?: Category) => {
    const usageCount = edit
      ? await db.transactions.where('categoryId').equals(edit.id).count()
      : 0
    setSheet({ kind: 'category', edit, usageCount })
  }

  const cats = categories ?? []

  return (
    <div className="app">
      <AnimatePresence>
        {welcomed === false && <Welcome onDone={() => void setSetting('welcomed', true)} />}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          {tab === 'resumen' && (
            <Resumen categories={cats} catMap={catMap} onAdd={() => setSheet({ kind: 'tx' })} />
          )}
          {tab === 'movimientos' && (
            <Movimientos
              categories={cats}
              catMap={catMap}
              onEdit={(tx) => setSheet({ kind: 'tx', edit: tx })}
              onDeleted={(tx) =>
                notify('Movimiento eliminado', 'Deshacer', () => void db.transactions.add(tx))
              }
            />
          )}
          {tab === 'recurrentes' && (
            <Recurrentes
              catMap={catMap}
              onEdit={(rule) => setSheet({ kind: 'rule', edit: rule })}
              onAdd={() => setSheet({ kind: 'rule' })}
              onMaterialized={(n) => notify(recurrentesMsg(n))}
            />
          )}
          {tab === 'ajustes' && (
            <Ajustes
              categories={cats}
              notify={notify}
              onEditCategory={(c) => void openCategory(c)}
              onAddCategory={() => void openCategory()}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <TabBar active={tab} onSelect={setTab} onAdd={() => setSheet({ kind: 'tx' })} />

      <AnimatePresence>
        {sheet?.kind === 'tx' && (
          <Sheet
            key="sheet-tx"
            title={sheet.edit ? 'Editar movimiento' : 'Nuevo movimiento'}
            onClose={closeSheet}
          >
            <TxForm
              categories={cats}
              edit={sheet.edit}
              onSaved={savedAndClose}
              onDelete={deleteTxWithUndo}
            />
          </Sheet>
        )}
        {sheet?.kind === 'rule' && (
          <Sheet
            key="sheet-rule"
            title={sheet.edit ? 'Editar recurrente' : 'Nueva recurrente'}
            onClose={closeSheet}
          >
            <RuleForm categories={cats} edit={sheet.edit} onSaved={savedAndClose} />
          </Sheet>
        )}
        {sheet?.kind === 'category' && (
          <Sheet
            key="sheet-cat"
            title={sheet.edit ? 'Editar categoría' : 'Nueva categoría'}
            onClose={closeSheet}
          >
            <CategoryForm edit={sheet.edit} usageCount={sheet.usageCount} onSaved={savedAndClose} />
          </Sheet>
        )}
      </AnimatePresence>

      <ToastHost toast={toast} />
    </div>
  )
}
