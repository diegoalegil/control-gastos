const pad = (n: number) => String(n).padStart(2, '0')

/** Fecha local de hoy, YYYY-MM-DD. Nunca usar toISOString para fechas de negocio. */
export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 'YYYY-MM-DD' -> 'YYYY-MM' */
export function monthOf(date: string): string {
  return date.slice(0, 7)
}

export function currentMonth(): string {
  return monthOf(todayStr())
}

/** Suma meses a un 'YYYY-MM'. Funciona para cualquier año (2050 incluido). */
export function addMonths(ym: string, delta: number): string {
  const [y, m] = ym.split('-').map(Number)
  const total = y * 12 + (m - 1) + delta
  const ny = Math.floor(total / 12)
  const nm = (total % 12) + 1
  return `${ny}-${pad(nm)}`
}

export function daysInMonth(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

/** Meses entre dos 'YYYY-MM': monthDiff('2026-06','2026-08') -> 2 */
export function monthDiff(a: string, b: string): number {
  const [ya, ma] = a.split('-').map(Number)
  const [yb, mb] = b.split('-').map(Number)
  return yb * 12 + mb - (ya * 12 + ma)
}

/** Día clavado al largo del mes: clampDay('2026-02', 31) -> '2026-02-28' */
export function clampDay(ym: string, day: number): string {
  return `${ym}-${pad(Math.min(day, daysInMonth(ym)))}`
}

const monthFmt = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
const monthShortFmt = new Intl.DateTimeFormat('es-ES', { month: 'short' })
const dayFmt = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
const dayYearFmt = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const shortDateFmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function toDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d ?? 1)
}

/** '2026-06' -> 'Junio 2026' */
export function monthLabel(ym: string): string {
  return capitalize(monthFmt.format(toDate(`${ym}-01`)))
}

/** '2026-06' -> 'jun' */
export function monthShortLabel(ym: string): string {
  return monthShortFmt.format(toDate(`${ym}-01`)).replace('.', '')
}

/** Cabecera de grupo por día: Hoy / Ayer / 'Lunes, 9 de junio' (+año si no es el actual) */
export function dayLabel(date: string): string {
  const today = todayStr()
  if (date === today) return 'Hoy'
  const [y, m, d] = today.split('-').map(Number)
  const yest = new Date(y, m - 1, d - 1)
  const yestStr = `${yest.getFullYear()}-${pad(yest.getMonth() + 1)}-${pad(yest.getDate())}`
  if (date === yestStr) return 'Ayer'
  const fmt = date.slice(0, 4) === today.slice(0, 4) ? dayFmt : dayYearFmt
  return capitalize(fmt.format(toDate(date)))
}

/** '2026-07-05' -> '5 jul 2026' */
export function shortDate(date: string): string {
  return shortDateFmt.format(toDate(date)).replaceAll('.', '')
}
