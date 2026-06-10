import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AmountKeypad } from '../components/AmountKeypad'
import { CategoryPicker } from '../components/CategoryPicker'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { Segmented } from '../components/Segmented'
import { db, uid } from '../lib/db'
import { currentMonth } from '../lib/dates'
import { materializeRecurring } from '../lib/recurring'
import type { Category, RecurringRule, TxType } from '../lib/types'

export function RuleForm({
  categories,
  edit,
  onSaved,
}: {
  categories: Category[]
  edit?: RecurringRule | null
  onSaved: (msg: string) => void
}) {
  const [type, setType] = useState<TxType>(edit?.type ?? 'gasto')
  const [cents, setCents] = useState(edit?.amountCents ?? 0)
  const [note, setNote] = useState(edit?.note ?? '')
  const [day, setDay] = useState(edit?.dayOfMonth ?? 1)
  const [startMonth, setStartMonth] = useState(edit?.startMonth ?? currentMonth())
  const [endMonth, setEndMonth] = useState(edit?.endMonth ?? '')
  const [confirming, setConfirming] = useState(false)
  const [saving, setSaving] = useState(false)

  const typeCats = useMemo(
    () => categories.filter((c) => c.type === type && !c.archived),
    [categories, type],
  )
  const [categoryId, setCategoryId] = useState<string | null>(edit?.categoryId ?? null)
  const selected = categoryId && typeCats.some((c) => c.id === categoryId) ? categoryId : null

  const save = async () => {
    if (!selected || cents === 0 || saving) return
    setSaving(true)
    const data = {
      type,
      amountCents: cents,
      categoryId: selected,
      note: note.trim() || undefined,
      dayOfMonth: Math.min(Math.max(Math.round(day) || 1, 1), 31),
      startMonth,
      endMonth: endMonth || undefined,
    }
    if (edit) {
      await db.recurring.update(edit.id, data)
      onSaved('Recurrente actualizada')
    } else {
      await db.recurring.add({ ...data, id: uid(), active: true })
      await materializeRecurring()
      onSaved('Recurrente creada')
    }
  }

  const removeRule = async () => {
    if (!edit) return
    await db.recurring.delete(edit.id)
    onSaved('Recurrente eliminada')
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
        <label className="label" htmlFor="rule-day">
          Día del mes (1–31)
        </label>
        <input
          id="rule-day"
          className="input"
          type="number"
          inputMode="numeric"
          min={1}
          max={31}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
        />
        {day > 28 && (
          <p className="settings-note" style={{ margin: '6px 2px 0' }}>
            En meses más cortos se usará el último día.
          </p>
        )}
      </div>

      <div className="field">
        <label className="label" htmlFor="rule-note">
          Nota (opcional)
        </label>
        <input
          id="rule-note"
          className="input"
          type="text"
          placeholder="P. ej. alquiler"
          maxLength={80}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="field" style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="label" htmlFor="rule-start">
            Desde
          </label>
          <input
            id="rule-start"
            className="input"
            type="month"
            value={startMonth}
            onChange={(e) => e.target.value && setStartMonth(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label" htmlFor="rule-end">
            Hasta (opcional)
          </label>
          <input
            id="rule-end"
            className="input"
            type="month"
            min={startMonth}
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
          />
        </div>
      </div>

      <motion.button
        type="button"
        className="btn"
        whileTap={{ scale: 0.97 }}
        disabled={!selected || cents === 0}
        onClick={() => void save()}
      >
        Guardar
      </motion.button>

      {edit && (
        <button
          type="button"
          className="btn btn-danger-text"
          style={{ background: 'none', marginTop: 4 }}
          onClick={() => setConfirming(true)}
        >
          Eliminar recurrente
        </button>
      )}

      <AnimatePresence>
        {confirming && (
          <ConfirmSheet
            message="Se dejará de repetir. Los movimientos ya apuntados se conservan."
            confirmLabel="Eliminar recurrente"
            onConfirm={() => void removeRule()}
            onCancel={() => setConfirming(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
