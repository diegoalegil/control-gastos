import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { AmountKeypad } from '../components/AmountKeypad'
import { CategoryPicker } from '../components/CategoryPicker'
import { Segmented } from '../components/Segmented'
import { Switch } from '../components/Switch'
import { db, uid } from '../lib/db'
import { monthOf, todayStr } from '../lib/dates'
import { materializeRecurring } from '../lib/recurring'
import type { Category, Transaction, TxType } from '../lib/types'

export function TxForm({
  categories,
  edit,
  onSaved,
  onDelete,
}: {
  categories: Category[]
  edit?: Transaction | null
  onSaved: (msg: string) => void
  onDelete?: (tx: Transaction) => void
}) {
  const [type, setType] = useState<TxType>(edit?.type ?? 'gasto')
  const [cents, setCents] = useState(edit?.amountCents ?? 0)
  const [date, setDate] = useState(edit?.date ?? todayStr())
  const [note, setNote] = useState(edit?.note ?? '')
  const [repeat, setRepeat] = useState(false)
  const [saving, setSaving] = useState(false)

  const typeCats = useMemo(
    () => categories.filter((c) => c.type === type && !c.archived),
    [categories, type],
  )
  const [categoryId, setCategoryId] = useState<string | null>(edit?.categoryId ?? null)
  const selected = categoryId && typeCats.some((c) => c.id === categoryId) ? categoryId : null

  const day = Number(date.slice(8, 10)) || 1

  const save = async () => {
    if (!selected || cents === 0 || saving) return
    setSaving(true)
    const noteTrim = note.trim() || undefined

    if (edit) {
      await db.transactions.update(edit.id, {
        type,
        amountCents: cents,
        categoryId: selected,
        date,
        note: noteTrim,
      })
      onSaved('Movimiento actualizado')
      return
    }

    if (repeat) {
      await db.recurring.add({
        id: uid(),
        type,
        amountCents: cents,
        categoryId: selected,
        note: noteTrim,
        dayOfMonth: day,
        startMonth: monthOf(date),
        active: true,
      })
      await materializeRecurring()
      onSaved('Recurrente creada')
    } else {
      await db.transactions.add({
        id: uid(),
        type,
        amountCents: cents,
        categoryId: selected,
        date,
        note: noteTrim,
        createdAt: Date.now(),
      })
      onSaved('Movimiento guardado')
    }
  }

  return (
    <div>
      <Segmented
        options={[
          { value: 'gasto', label: 'Gasto' },
          { value: 'ingreso', label: 'Ingreso' },
        ]}
        value={type}
        onChange={setType}
      />

      <AmountKeypad cents={cents} onChange={setCents} />

      <div className="field">
        <span className="label">Categoría</span>
        <CategoryPicker categories={typeCats} value={selected} onChange={setCategoryId} />
      </div>

      <div className="field">
        <label className="label" htmlFor="tx-date">
          Fecha
        </label>
        <input
          id="tx-date"
          className="input"
          type="date"
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="tx-note">
          Nota (opcional)
        </label>
        <input
          id="tx-note"
          className="input"
          type="text"
          placeholder="P. ej. cena con amigos"
          maxLength={80}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {!edit && (
        <div className="row" style={{ marginBottom: 10 }}>
          <span className="row-body">
            <span className="row-title">Repetir cada mes</span>
            <span className="row-sub">Se añadirá solo, el día {day} de cada mes</span>
          </span>
          <Switch on={repeat} onChange={setRepeat} />
        </div>
      )}

      {edit?.recurringId && (
        <p className="settings-note" style={{ margin: '0 2px 12px' }}>
          Este movimiento lo creó una regla recurrente. Los cambios solo afectan a este mes.
        </p>
      )}

      <motion.button
        type="button"
        className="btn"
        whileTap={{ scale: 0.97 }}
        disabled={!selected || cents === 0}
        onClick={() => void save()}
      >
        Guardar
      </motion.button>

      {edit && onDelete && (
        <button
          type="button"
          className="btn btn-danger-text"
          style={{ background: 'none', marginTop: 4 }}
          onClick={() => onDelete(edit)}
        >
          Eliminar movimiento
        </button>
      )}
    </div>
  )
}
