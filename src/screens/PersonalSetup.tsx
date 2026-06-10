import { useState } from 'react'
import { motion } from 'motion/react'
import { setSetting } from '../lib/db'
import { centsToInput, parseEuros } from '../lib/money'
import { applyPersonalPlan, FIXED_ITEMS } from '../lib/personal'

/**
 * Asistente de configuración personal: importes de los fijos de Diego.
 * Lo que quede en blanco no se crea (se puede volver desde Ajustes).
 */
export function PersonalSetup({ onDone }: { onDone: (materialized: number) => void }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      FIXED_ITEMS.filter((i) => i.defaultCents).map((i) => [i.key, centsToInput(i.defaultCents)]),
    ),
  )
  const [cuotas, setCuotas] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      FIXED_ITEMS.filter((i) => i.defaultInstallments).map((i) => [i.key, String(i.defaultInstallments)]),
    ),
  )
  const [applying, setApplying] = useState(false)

  const filled = FIXED_ITEMS.filter((i) => parseEuros(values[i.key] ?? '') !== undefined)

  const apply = async () => {
    if (applying) return
    setApplying(true)
    const amounts = new Map<string, number>()
    const installments = new Map<string, number>()
    for (const item of FIXED_ITEMS) {
      const cents = parseEuros(values[item.key] ?? '')
      if (cents) amounts.set(item.key, cents)
      const n = Math.round(Number(cuotas[item.key])) || 0
      if (item.financed && n > 0) installments.set(item.key, n)
    }
    const n = await applyPersonalPlan(amounts, installments)
    onDone(n)
  }

  const skip = async () => {
    await setSetting('personalSetup', 'skipped')
    onDone(0)
  }

  return (
    <div>
      <p className="settings-note" style={{ margin: '0 2px 14px' }}>
        Pon el importe mensual de tus fijos y los creo como recurrentes (día 1, ajustable
        después en Recurrentes). También añado tus categorías —coche, gaming, financiación…—
        con presupuestos orientativos y tu objetivo de ahorro del 10&nbsp;%. Lo que dejes en
        blanco no se crea.
      </p>

      <div className="settings-group" style={{ marginBottom: 16 }}>
        {FIXED_ITEMS.map((item) => (
          <div key={item.key} className="row row-divided">
            <span className="row-body">
              <span className="row-title">{item.label}</span>
              <span className="row-sub">
                {item.type === 'ingreso' ? 'Ingreso · día 1' : 'Gasto · día 1'}
                {item.financed ? ' · se borra al acabar' : ''}
              </span>
            </span>
            {item.financed && (
              <input
                className="input"
                style={{ width: 76, textAlign: 'right', height: 42 }}
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="cuotas"
                value={cuotas[item.key] ?? ''}
                onChange={(e) => setCuotas((v) => ({ ...v, [item.key]: e.target.value }))}
              />
            )}
            <input
              className="input"
              style={{ width: 104, textAlign: 'right', height: 42 }}
              type="text"
              inputMode="decimal"
              placeholder="0,00 €"
              value={values[item.key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [item.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        className="btn"
        whileTap={{ scale: 0.97 }}
        disabled={applying}
        onClick={() => void apply()}
      >
        {filled.length > 0 ? `Aplicar (${filled.length} fijos)` : 'Aplicar solo categorías'}
      </motion.button>
      <button
        type="button"
        className="btn"
        style={{ background: 'none', color: 'var(--ink-2)', marginTop: 4 }}
        onClick={() => void skip()}
      >
        Ahora no
      </button>
    </div>
  )
}
