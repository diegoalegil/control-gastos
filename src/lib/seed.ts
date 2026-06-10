import { db, getSetting, setSetting, uid } from './db'
import type { Category } from './types'

const DEFAULTS: Array<Omit<Category, 'id' | 'archived' | 'order'>> = [
  { name: 'Comida fuera', icon: '🍽️', color: 1, type: 'gasto' },
  { name: 'Supermercado', icon: '🛒', color: 4, type: 'gasto' },
  { name: 'Transporte', icon: '🚌', color: 6, type: 'gasto' },
  { name: 'Hogar', icon: '🏠', color: 2, type: 'gasto' },
  { name: 'Ocio', icon: '🎬', color: 8, type: 'gasto' },
  { name: 'Salud', icon: '🩺', color: 5, type: 'gasto' },
  { name: 'Suscripciones', icon: '📺', color: 7, type: 'gasto' },
  { name: 'Compras', icon: '🛍️', color: 9, type: 'gasto' },
  { name: 'Otros gastos', icon: '✨', color: 10, type: 'gasto' },
  { name: 'Nómina', icon: '💼', color: 4, type: 'ingreso' },
  { name: 'Extras', icon: '🪙', color: 3, type: 'ingreso' },
  { name: 'Otros ingresos', icon: '🌱', color: 5, type: 'ingreso' },
]

/** Crea las categorías por defecto una sola vez (primer arranque). */
export async function seedIfNeeded(): Promise<void> {
  const seeded = await getSetting<boolean>('seeded')
  if (seeded) return
  await db.transaction('rw', db.categories, db.settings, async () => {
    if ((await db.categories.count()) === 0) {
      await db.categories.bulkAdd(
        DEFAULTS.map((c, i) => ({ ...c, id: uid(), archived: false, order: i })),
      )
    }
    await setSetting('seeded', true)
  })
}
