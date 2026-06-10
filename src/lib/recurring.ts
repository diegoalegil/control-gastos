import { db, uid } from './db'
import { addMonths, clampDay, monthOf, todayStr } from './dates'
import type { RecurringRule } from './types'

/**
 * Genera los movimientos pendientes de todas las reglas activas, desde el mes
 * siguiente al último materializado hasta hoy. Idempotente: se apoya en
 * lastMaterializedMonth y comprueba recurringId+mes antes de insertar.
 * Devuelve cuántos movimientos se han creado.
 */
export async function materializeRecurring(now = todayStr()): Promise<number> {
  const nowYm = monthOf(now)
  let created = 0

  await db.transaction('rw', db.recurring, db.transactions, async () => {
    const rules = (await db.recurring.toArray()).filter((r) => r.active)

    for (const rule of rules) {
      let ym = rule.lastMaterializedMonth ? addMonths(rule.lastMaterializedMonth, 1) : rule.startMonth
      if (ym < rule.startMonth) ym = rule.startMonth
      const last = rule.endMonth && rule.endMonth < nowYm ? rule.endMonth : nowYm

      let materializedUpTo = rule.lastMaterializedMonth

      while (ym <= last) {
        const date = clampDay(ym, rule.dayOfMonth)
        if (date > now) break // aún no toca este mes; se reintenta en la próxima apertura

        const already = await db.transactions
          .where('recurringId')
          .equals(rule.id)
          .and((t) => monthOf(t.date) === ym)
          .count()

        if (already === 0) {
          await db.transactions.add({
            id: uid(),
            type: rule.type,
            amountCents: rule.amountCents,
            categoryId: rule.categoryId,
            date,
            note: rule.note,
            recurringId: rule.id,
            createdAt: Date.now(),
          })
          created++
        }
        materializedUpTo = ym
        ym = addMonths(ym, 1)
      }

      if (materializedUpTo !== rule.lastMaterializedMonth) {
        await db.recurring.update(rule.id, { lastMaterializedMonth: materializedUpTo })
      }
    }
  })

  return created
}

/** Fecha de la próxima ejecución de una regla, o null si ya terminó. */
export function nextOccurrence(rule: RecurringRule, now = todayStr()): string | null {
  if (!rule.active) return null
  const nowYm = monthOf(now)
  let ym = rule.startMonth > nowYm ? rule.startMonth : nowYm
  // si la fecha de este mes ya pasó (o ya está generada), la próxima es el mes siguiente
  if (ym === nowYm && (clampDay(ym, rule.dayOfMonth) <= now || rule.lastMaterializedMonth === nowYm)) {
    ym = addMonths(ym, 1)
  }
  if (rule.endMonth && ym > rule.endMonth) return null
  return clampDay(ym, rule.dayOfMonth)
}
