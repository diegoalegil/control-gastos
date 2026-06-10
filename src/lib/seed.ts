import { db, getSetting, setSetting, uid } from './db'
import type { Category } from './types'

const DEFAULTS: Array<Omit<Category, 'id' | 'archived' | 'order'>> = [
  { name: 'Comida fuera', icon: '', iconId: 'plate', color: 1, type: 'gasto' },
  { name: 'Supermercado', icon: '', iconId: 'cart', color: 4, type: 'gasto' },
  { name: 'Transporte', icon: '', iconId: 'bus', color: 6, type: 'gasto' },
  { name: 'Hogar', icon: '', iconId: 'house', color: 2, type: 'gasto' },
  { name: 'Ocio', icon: '', iconId: 'drinks', color: 8, type: 'gasto' },
  { name: 'Salud', icon: '', iconId: 'health', color: 5, type: 'gasto' },
  { name: 'Suscripciones', icon: '', iconId: 'play', color: 7, type: 'gasto' },
  { name: 'Compras', icon: '', iconId: 'bag', color: 9, type: 'gasto' },
  { name: 'Otros gastos', icon: '', iconId: 'sparkles', color: 10, type: 'gasto' },
  { name: 'Nómina', icon: '', iconId: 'briefcase', color: 4, type: 'ingreso' },
  { name: 'Extras', icon: '', iconId: 'coins', color: 3, type: 'ingreso' },
  { name: 'Otros ingresos', icon: '', iconId: 'sprout', color: 5, type: 'ingreso' },
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

const EMOJI_TO_ICON: Record<string, string> = {
  '🍽️': 'plate',
  '🛒': 'cart',
  '🚌': 'bus',
  '🏠': 'house',
  '🎬': 'drinks',
  '🩺': 'health',
  '📺': 'play',
  '🛍️': 'bag',
  '✨': 'sparkles',
  '💼': 'briefcase',
  '🪙': 'coins',
  '🌱': 'sprout',
  '🍻': 'drinks',
  '🎮': 'gamepad',
  '📱': 'iphone',
  '💳': 'card',
  '🏋️': 'gym',
  '⛽': 'fuel',
  '🔧': 'mercedes',
  '☮️': 'mercedes',
  '✈️': 'plane',
  '🎁': 'gift',
  '📊': 'savings',
  '📈': 'sp500',
}

/** Migración: toda categoría sin iconId recibe uno (cero emojis en la UI). */
export async function ensureIconIds(): Promise<void> {
  const cats = await db.categories.toArray()
  for (const c of cats) {
    if (c.iconId) continue
    await db.categories.update(c.id, { iconId: EMOJI_TO_ICON[c.icon] ?? 'sparkles' })
  }
}
