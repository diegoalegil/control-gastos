import Dexie, { type EntityTable } from 'dexie'
import type { Category, RecurringRule, SettingsRow, Transaction } from './types'

export const db = new Dexie('control-gastos') as Dexie & {
  transactions: EntityTable<Transaction, 'id'>
  categories: EntityTable<Category, 'id'>
  recurring: EntityTable<RecurringRule, 'id'>
  settings: EntityTable<SettingsRow, 'key'>
}

db.version(1).stores({
  transactions: 'id, date, type, categoryId, recurringId',
  categories: 'id, order',
  recurring: 'id',
  settings: 'key',
})

export function uid(): string {
  return crypto.randomUUID()
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const row = await db.settings.get(key)
  return row?.value as T | undefined
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await db.settings.put({ key, value })
}
