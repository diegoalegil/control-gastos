import { db, setSetting, uid } from './db'
import { addMonths, currentMonth } from './dates'
import { materializeRecurring } from './recurring'
import type { Category, TxType } from './types'

/**
 * Plan personal de Diego (respuestas del 2026-06-10): ingreso por inversión
 * (base fija + extras) el día 1, sin gasto de vivienda, Mercedes W204 AMG,
 * suscripciones digitales, gym, dos financiaciones y ahorro objetivo del 10 %.
 */

interface CatSpec {
  name: string
  icon: string
  color: number
  type: TxType
  budgetCents?: number
}

// presupuestos orientativos para <1.200 €/mes de ingreso; editables en Ajustes
const CATS: CatSpec[] = [
  { name: 'Supermercado', icon: '🛒', color: 4, type: 'gasto', budgetCents: 18000 },
  { name: 'Comida fuera', icon: '🍽️', color: 1, type: 'gasto', budgetCents: 6000 },
  { name: 'Ocio y salidas', icon: '🍻', color: 9, type: 'gasto', budgetCents: 10000 },
  { name: 'Compras', icon: '🛍️', color: 8, type: 'gasto', budgetCents: 8000 },
  { name: 'Gaming y tecnología', icon: '🎮', color: 7, type: 'gasto', budgetCents: 4000 },
  { name: 'Suscripciones', icon: '📺', color: 6, type: 'gasto' },
  { name: 'Móvil', icon: '📱', color: 6, type: 'gasto' },
  { name: 'Financiación', icon: '💳', color: 10, type: 'gasto' },
  { name: 'Gimnasio', icon: '🏋️', color: 5, type: 'gasto' },
  { name: 'Gasolina', icon: '⛽', color: 2, type: 'gasto', budgetCents: 12000 },
  { name: 'Coche (taller y seguro)', icon: '🔧', color: 3, type: 'gasto' },
  { name: 'Viajes', icon: '✈️', color: 5, type: 'gasto' },
  { name: 'Regalos', icon: '🎁', color: 9, type: 'gasto' },
  { name: 'Ahorro e inversión', icon: '📊', color: 4, type: 'gasto' },
  { name: 'Inversión', icon: '📈', color: 4, type: 'ingreso' },
  { name: 'Extras inversión', icon: '🪙', color: 3, type: 'ingreso' },
]

export interface FixedItem {
  key: string
  label: string
  categoryName: string
  type: TxType
  day: number
  /** Importe conocido de antemano, pre-rellenado en el asistente */
  defaultCents?: number
  /** Financiación: pide nº de cuotas y termina (y se borra) sola */
  financed?: boolean
  /** Cuotas conocidas de antemano, pre-rellenadas en el asistente */
  defaultInstallments?: number
}

// el ritual del día 1: entran los 800 €, salen 50 € al S&P 500 y se paga Vodafone
export const FIXED_ITEMS: FixedItem[] = [
  { key: 'inv', label: 'Inversión (parte fija)', categoryName: 'Inversión', type: 'ingreso', day: 1, defaultCents: 80000 },
  { key: 'sp500', label: 'Aportación S&P 500', categoryName: 'Ahorro e inversión', type: 'gasto', day: 1, defaultCents: 5000 },
  { key: 'movil', label: 'Móvil (Vodafone)', categoryName: 'Móvil', type: 'gasto', day: 1 },
  { key: 'netflix', label: 'Netflix', categoryName: 'Suscripciones', type: 'gasto', day: 1 },
  { key: 'youtube', label: 'YouTube Premium', categoryName: 'Suscripciones', type: 'gasto', day: 1 },
  { key: 'amusic', label: 'Apple Music', categoryName: 'Suscripciones', type: 'gasto', day: 1 },
  { key: 'claude', label: 'Claude', categoryName: 'Suscripciones', type: 'gasto', day: 1 },
  { key: 'chatgpt', label: 'ChatGPT', categoryName: 'Suscripciones', type: 'gasto', day: 1 },
  { key: 'gym', label: 'Gimnasio', categoryName: 'Gimnasio', type: 'gasto', day: 1 },
  // ambas van dentro de la factura Vodafone; el iPhone empieza este mes (cuota 1 de 24)
  { key: 'fintv', label: 'Financiación TV', categoryName: 'Financiación', type: 'gasto', day: 1, financed: true },
  { key: 'finmovil', label: 'Financiación iPhone', categoryName: 'Financiación', type: 'gasto', day: 1, financed: true, defaultInstallments: 24 },
]

export const SAVINGS_RATE = 0.1

/**
 * Aplica el plan: crea las categorías que falten (sin duplicar por nombre),
 * pone presupuestos sugeridos donde no haya, crea las recurrentes con importe
 * indicado (sin duplicar por nota) y fija el objetivo de ahorro.
 * Devuelve cuántos movimientos materializó de inmediato.
 */
export async function applyPersonalPlan(
  amounts: Map<string, number>,
  installments: Map<string, number> = new Map(),
): Promise<number> {
  await db.transaction('rw', db.categories, db.recurring, db.settings, async () => {
    const existing = await db.categories.toArray()
    const byName = new Map(existing.map((c) => [c.name.toLowerCase(), c]))
    let order = existing.reduce((m, c) => Math.max(m, c.order), 0) + 1

    for (const spec of CATS) {
      const found = byName.get(spec.name.toLowerCase())
      if (found) {
        if (spec.budgetCents && !found.monthlyBudgetCents) {
          await db.categories.update(found.id, { monthlyBudgetCents: spec.budgetCents })
        }
      } else {
        const cat: Category = {
          id: uid(),
          name: spec.name,
          icon: spec.icon,
          color: spec.color,
          type: spec.type,
          monthlyBudgetCents: spec.budgetCents,
          archived: false,
          order: order++,
        }
        await db.categories.add(cat)
        byName.set(spec.name.toLowerCase(), cat)
      }
    }

    const rules = await db.recurring.toArray()
    const existingNotes = new Set(rules.map((r) => (r.note ?? '').toLowerCase()))
    const start = currentMonth()

    for (const item of FIXED_ITEMS) {
      const cents = amounts.get(item.key)
      if (!cents || existingNotes.has(item.label.toLowerCase())) continue
      const cat = byName.get(item.categoryName.toLowerCase())
      if (!cat) continue
      const n = installments.get(item.key)
      await db.recurring.add({
        id: uid(),
        type: item.type,
        amountCents: cents,
        categoryId: cat.id,
        note: item.label,
        dayOfMonth: item.day,
        startMonth: start,
        endMonth: item.financed && n && n > 0 ? addMonths(start, n - 1) : undefined,
        active: true,
      })
    }

    await setSetting('savingsRate', SAVINGS_RATE)
    const savingsCat = byName.get('ahorro e inversión')
    if (savingsCat) await setSetting('savingsCategoryId', savingsCat.id)
    await setSetting('personalSetup', 'done')
  })

  return materializeRecurring()
}
