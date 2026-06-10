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

/** '450' | '450,50' | '1.450,50 €' -> céntimos; vacío o inválido -> undefined */
export function parseEuros(s: string): number | undefined {
  const clean = s.trim().replace(/[€\s.]/g, '').replace(',', '.')
  if (!clean) return undefined
  const n = Number(clean)
  if (!Number.isFinite(n) || n <= 0) return undefined
  return Math.round(n * 100)
}

/** Céntimos -> valor editable para un input: 1250 -> '12,50'; enteros sin decimales */
export function centsToInput(cents: number | undefined): string {
  if (!cents) return ''
  const euros = cents / 100
  return Number.isInteger(euros) ? String(euros) : euros.toFixed(2).replace('.', ',')
}
