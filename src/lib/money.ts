const eur = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  // es-ES no agrupa los miles de 4 cifras por defecto; '1.185,50 €' siempre
  useGrouping: 'always',
} as unknown as Intl.NumberFormatOptions)

/** Céntimos -> '1.234,56 €' */
export function formatCents(cents: number): string {
  return eur.format(cents / 100)
}

/** Céntimos con signo explícito: '+1.200,00 €' / '−45,30 €' (signo menos tipográfico) */
export function formatSigned(cents: number, type: 'ingreso' | 'gasto'): string {
  const abs = formatCents(Math.abs(cents))
  if (cents === 0) return abs
  return type === 'ingreso' ? `+${abs}` : `−${abs}`
}

/** Balance con signo solo si es negativo, usando − tipográfico */
export function formatBalance(cents: number): string {
  return cents < 0 ? `−${formatCents(Math.abs(cents))}` : formatCents(cents)
}

/** Importe en céntimos para el campo del teclado: '12,34 €' sin agrupar miles cuando se edita */
export function formatKeypad(cents: number): string {
  return eur.format(cents / 100)
}
