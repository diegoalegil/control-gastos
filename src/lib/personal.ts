import { db, setSetting, uid } from './db'
import { addMonths, currentMonth } from './dates'
import { materializeRecurring } from './recurring'
import type { Category, TxType } from './types'

/**
 * Plan personal de Diego (junio 2026): ingreso por inversión (base 800 € +
 * extras) el día 1, 50 € al S&P 500, factura Vodafone (líneas + TV Samsung
 * financiada + iPhone 17 Pro Max en 24 cuotas), suscripciones, gym y el
 * W204 AMG («la bestia»). Ahorro objetivo: 10 %. Todo con iconos SVG propios.
 */

interface CatSpec {
  name: string
  iconId: string
  color: number
  type: TxType
  budgetCents?: number
}

// presupuestos orientativos para ~800 €/mes de ingreso; editables en Ajustes
export const PERSONAL_CATS: CatSpec[] = [
  { name: 'Supermercado', iconId: 'cart', color: 4, type: 'gasto', budgetCents: 18000 },
  { name: 'Comida fuera', iconId: 'plate', color: 1, type: 'gasto', budgetCents: 6000 },
  { name: 'Ocio y salidas', iconId: 'drinks', color: 9, type: 'gasto', budgetCents: 10000 },
  { name: 'Compras', iconId: 'bag', color: 8, type: 'gasto', budgetCents: 8000 },
  { name: 'Gaming y tecnología', iconId: 'gamepad', color: 7, type: 'gasto', budgetCents: 4000 },
  { name: 'Suscripciones', iconId: 'play', color: 6, type: 'gasto' },
  { name: 'Móvil', iconId: 'vodafone', color: 6, type: 'gasto' },
  { name: 'Financiación', iconId: 'card', color: 10, type: 'gasto' },
  { name: 'Gimnasio', iconId: 'gym', color: 5, type: 'gasto' },
  { name: 'Gasolina', iconId: 'fuel', color: 2, type: 'gasto', budgetCents: 12000 },
  // gasto irregular del W204: aceite, frenos, reparaciones... sin presupuesto mensual
  { name: 'Mantenimiento de la bestia', iconId: 'mercedes', color: 3, type: 'gasto' },
  { name: 'Viajes', iconId: 'plane', color: 5, type: 'gasto' },
  { name: 'Regalos', iconId: 'gift', color: 9, type: 'gasto' },
  { name: 'Ahorro e inversión', iconId: 'savings', color: 4, type: 'gasto' },
  { name: 'Inversión', iconId: 'sp500', color: 4, type: 'ingreso' },
  { name: 'Extras inversión', iconId: 'coins', color: 3, type: 'ingreso' },
]

export interface FixedItem {
  key: string
  label: string
  categoryName: string
  iconId: string
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
  { key: 'inv', label: 'Inversión (parte fija)', categoryName: 'Inversión', iconId: 'sp500', type: 'ingreso', day: 1, defaultCents: 80000 },
  { key: 'sp500', label: 'Aportación S&P 500', categoryName: 'Ahorro e inversión', iconId: 'sp500', type: 'gasto', day: 1, defaultCents: 5000 },
  // factura Vodafone de mayo 2026: 3 líneas (60GB + 2×30GB) + IGIC ≈ 26,04 €
  { key: 'movil', label: 'Líneas Vodafone', categoryName: 'Móvil', iconId: 'vodafone', type: 'gasto', day: 1, defaultCents: 2604 },
  { key: 'netflix', label: 'Netflix', categoryName: 'Suscripciones', iconId: 'netflix', type: 'gasto', day: 1, defaultCents: 1000 },
  { key: 'youtube', label: 'YouTube Premium', categoryName: 'Suscripciones', iconId: 'youtube', type: 'gasto', day: 1, defaultCents: 1000 },
  { key: 'amusic', label: 'Apple Music', categoryName: 'Suscripciones', iconId: 'applemusic', type: 'gasto', day: 1, defaultCents: 1800 },
  // base 90 €; los meses que suba a 180 se edita el movimiento generado (solo afecta a ese mes)
  { key: 'claude', label: 'Claude', categoryName: 'Suscripciones', iconId: 'claude', type: 'gasto', day: 1, defaultCents: 9000 },
  { key: 'chatgpt', label: 'ChatGPT', categoryName: 'Suscripciones', iconId: 'chatgpt', type: 'gasto', day: 1 },
  { key: 'gym', label: 'Gimnasio', categoryName: 'Gimnasio', iconId: 'gym', type: 'gasto', day: 1, defaultCents: 5400 },
  // TV Samsung QLED: 28,11 €/cuota, 281,18 € pendientes en la factura de mayo ≈ 10 cuotas desde junio
  { key: 'fintv', label: 'Financiación TV (Samsung QLED)', categoryName: 'Financiación', iconId: 'tv', type: 'gasto', day: 1, financed: true, defaultCents: 2811, defaultInstallments: 10 },
  // iPhone 17 Pro Max: 1.299,03 € en 24 cuotas de 54,12 € (pedido 06/2026); canon
  // digital 3,48 € + gestión 13,27 € van como pago único en la primera factura
  { key: 'finmovil', label: 'Financiación iPhone 17 Pro Max', categoryName: 'Financiación', iconId: 'iphone', type: 'gasto', day: 1, financed: true, defaultCents: 5412, defaultInstallments: 24 },
]

export const SAVINGS_RATE = 0.1

/**
 * Aplica el plan: crea las categorías que falten (sin duplicar por nombre),
 * pone presupuestos e iconos donde falten, crea las recurrentes con importe
 * indicado (sin duplicar por nota, actualizando su icono) y fija el objetivo
 * de ahorro. Devuelve cuántos movimientos materializó de inmediato.
 */
export async function applyPersonalPlan(
  amounts: Map<string, number>,
  installments: Map<string, number> = new Map(),
): Promise<number> {
  await db.transaction('rw', db.categories, db.recurring, db.settings, async () => {
    const existing = await db.categories.toArray()
    const byName = new Map(existing.map((c) => [c.name.toLowerCase(), c]))
    let order = existing.reduce((m, c) => Math.max(m, c.order), 0) + 1

    for (const spec of PERSONAL_CATS) {
      const found = byName.get(spec.name.toLowerCase())
      if (found) {
        const patch: Partial<Category> = {}
        if (spec.budgetCents && !found.monthlyBudgetCents) patch.monthlyBudgetCents = spec.budgetCents
        if (!found.iconId) patch.iconId = spec.iconId
        if (Object.keys(patch).length) await db.categories.update(found.id, patch)
      } else {
        const cat: Category = {
          id: uid(),
          name: spec.name,
          icon: '',
          iconId: spec.iconId,
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
    const ruleByNote = new Map(rules.map((r) => [(r.note ?? '').toLowerCase(), r]))
    const start = currentMonth()

    for (const item of FIXED_ITEMS) {
      const existingRule = ruleByNote.get(item.label.toLowerCase())
      if (existingRule) {
        if (!existingRule.iconId) await db.recurring.update(existingRule.id, { iconId: item.iconId })
        continue
      }
      const cents = amounts.get(item.key)
      if (!cents) continue
      const cat = byName.get(item.categoryName.toLowerCase())
      if (!cat) continue
      const n = installments.get(item.key)
      await db.recurring.add({
        id: uid(),
        type: item.type,
        amountCents: cents,
        categoryId: cat.id,
        iconId: item.iconId,
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
