import { db } from './db'
import { todayStr } from './dates'
import { shareOrDownload } from './export'
import type { BackupFile } from './types'

export async function exportBackup(): Promise<void> {
  const [categories, transactions, recurring, settings] = await Promise.all([
    db.categories.toArray(),
    db.transactions.toArray(),
    db.recurring.toArray(),
    db.settings.toArray(),
  ])
  const backup: BackupFile = {
    app: 'control-gastos',
    version: 1,
    exportedAt: new Date().toISOString(),
    categories,
    transactions,
    recurring,
    settings,
  }
  await shareOrDownload(
    `copia-control-gastos-${todayStr()}.json`,
    JSON.stringify(backup, null, 2),
    'application/json',
  )
}

export function parseBackup(text: string): BackupFile {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('El archivo no es un JSON válido.')
  }
  const b = data as Partial<BackupFile>
  if (
    b?.app !== 'control-gastos' ||
    b.version !== 1 ||
    !Array.isArray(b.categories) ||
    !Array.isArray(b.transactions) ||
    !Array.isArray(b.recurring) ||
    !Array.isArray(b.settings)
  ) {
    throw new Error('El archivo no es una copia de seguridad de Control de Gastos.')
  }
  return b as BackupFile
}

/** Reemplaza TODOS los datos por los de la copia. Confirmar antes de llamar. */
export async function restoreBackup(backup: BackupFile): Promise<void> {
  await db.transaction('rw', db.categories, db.transactions, db.recurring, db.settings, async () => {
    await Promise.all([
      db.categories.clear(),
      db.transactions.clear(),
      db.recurring.clear(),
      db.settings.clear(),
    ])
    await db.categories.bulkAdd(backup.categories)
    await db.transactions.bulkAdd(backup.transactions)
    await db.recurring.bulkAdd(backup.recurring)
    await db.settings.bulkPut(backup.settings)
  })
}
