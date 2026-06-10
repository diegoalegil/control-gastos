import { useState } from 'react'
import { motion } from 'motion/react'
import { CatIcon, ICON_IDS } from '../components/CatIcons'
import { Segmented } from '../components/Segmented'
import { db, uid } from '../lib/db'
import { centsToInput, parseEuros } from '../lib/money'
import type { Category, TxType } from '../lib/types'

const COLORS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export function CategoryForm({
  edit,
  usageCount,
  onSaved,
}: {
  edit?: Category | null
  usageCount: number
  onSaved: (msg: string) => void
}) {
  const [type, setType] = useState<TxType>(edit?.type ?? 'gasto')
  const [name, setName] = useState(edit?.name ?? '')
  const [iconId, setIconId] = useState(edit?.iconId ?? 'sparkles')
  const [color, setColor] = useState(edit?.color ?? 1)
  const [budget, setBudget] = useState(centsToInput(edit?.monthlyBudgetCents))

  const save = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const budgetCents = type === 'gasto' ? parseEuros(budget) : undefined

    if (edit) {
      await db.categories.update(edit.id, {
        name: trimmed,
        icon: '',
        iconId,
        color,
        monthlyBudgetCents: budgetCents,
      })
      onSaved('Categoría actualizada')
    } else {
      const order = ((await db.categories.orderBy('order').last())?.order ?? 0) + 1
      await db.categories.add({
        id: uid(),
        name: trimmed,
        icon: '',
        iconId,
        color,
        type,
        monthlyBudgetCents: budgetCents,
        archived: false,
        order,
      })
      onSaved('Categoría creada')
    }
  }

  const archive = async (archived: boolean) => {
    if (!edit) return
    await db.categories.update(edit.id, { archived })
    onSaved(archived ? 'Categoría archivada' : 'Categoría restaurada')
  }

  const remove = async () => {
    if (!edit) return
    await db.categories.delete(edit.id)
    onSaved('Categoría eliminada')
  }

  return (
    <div>
      {!edit && (
        <div className="field">
          <Segmented
            options={[
              { value: 'gasto', label: 'Gasto' },
              { value: 'ingreso', label: 'Ingreso' },
            ]}
            value={type}
            onChange={setType}
          />
        </div>
      )}

      <div className="field">
        <label className="label" htmlFor="cat-name">
          Nombre
        </label>
        <input
          id="cat-name"
          className="input"
          type="text"
          placeholder="P. ej. Mascotas"
          maxLength={28}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="field">
        <span className="label">Icono</span>
        <div className="icon-grid">
          {ICON_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`icon-cell${iconId === id ? ' selected' : ''}`}
              aria-label={`Icono ${id}`}
              onClick={() => setIconId(id)}
            >
              <CatIcon id={id} size={20} />
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="label">Color</span>
        <div className="color-dots">
          {COLORS.map((c) => (
            <motion.button
              key={c}
              type="button"
              whileTap={{ scale: 0.85 }}
              className={`color-dot${color === c ? ' selected' : ''}`}
              style={{ background: `var(--cat-${c})` }}
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      {type === 'gasto' && (
        <div className="field">
          <label className="label" htmlFor="cat-budget">
            Presupuesto mensual (opcional)
          </label>
          <input
            id="cat-budget"
            className="input"
            type="text"
            inputMode="decimal"
            placeholder="P. ej. 250"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
      )}

      <motion.button
        type="button"
        className="btn"
        whileTap={{ scale: 0.97 }}
        disabled={!name.trim()}
        onClick={() => void save()}
      >
        Guardar
      </motion.button>

      {edit && !edit.archived && usageCount > 0 && (
        <button
          type="button"
          className="btn btn-danger-text"
          style={{ background: 'none', marginTop: 4 }}
          onClick={() => void archive(true)}
        >
          Archivar categoría
        </button>
      )}
      {edit && edit.archived && (
        <button
          type="button"
          className="btn"
          style={{ background: 'var(--surface-2)', color: 'var(--ink)', marginTop: 8 }}
          onClick={() => void archive(false)}
        >
          Restaurar categoría
        </button>
      )}
      {edit && usageCount === 0 && (
        <button
          type="button"
          className="btn btn-danger-text"
          style={{ background: 'none', marginTop: 4 }}
          onClick={() => void remove()}
        >
          Eliminar categoría
        </button>
      )}
    </div>
  )
}
