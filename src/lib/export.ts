import { db } from './db'
import { todayStr } from './dates'

/**
 * Comparte (iOS) o descarga un archivo. En una PWA instalada en iPhone la
 * hoja de compartir es la única vía fiable, con descarga como respaldo.
 */
export async function shareOrDownload(filename: string, content: string, mime: string): Promise<void> {
  const file = new File([content], filename, { type: mime })
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return // usuario canceló
      // si share falla por otra razón, caemos a descarga
    }
  }
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

const csvAmount = (cents: number) => (cents / 100).toFixed(2).replace('.', ',')

/** Escapa un campo CSV con separador ';' (formato Excel es-ES). */
const csvField = (s: string) => (/[";\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s)

export async function exportCsv(): Promise<void> {
  const [txs, cats] = await Promise.all([db.transactions.orderBy('date').toArray(), db.categories.toArray()])
  const catName = new Map(cats.map((c) => [c.id, c.name]))

  const rows = [
    ['Fecha', 'Tipo', 'Categoría', 'Importe', 'Nota'],
    ...txs.map((t) => [
      t.date,
      t.type === 'ingreso' ? 'Ingreso' : 'Gasto',
      catName.get(t.categoryId) ?? '—',
      `${t.type === 'gasto' ? '-' : ''}${csvAmount(t.amountCents)}`,
      t.note ?? '',
    ]),
  ]

  // BOM para que Excel detecte UTF-8; ';' como separador para locale es-ES
  const csv = '﻿' + rows.map((r) => r.map(csvField).join(';')).join('\r\n')
  await shareOrDownload(`control-gastos-${todayStr()}.csv`, csv, 'text/csv')
}
