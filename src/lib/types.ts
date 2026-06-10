export type TxType = 'ingreso' | 'gasto'

export interface Transaction {
  id: string
  type: TxType
  amountCents: number
  categoryId: string
  /** Fecha local YYYY-MM-DD */
  date: string
  note?: string
  /** Presente si la generó una regla recurrente */
  recurringId?: string
  createdAt: number
}

export interface Category {
  id: string
  name: string
  /** Emoji que representa la categoría */
  icon: string
  /** Índice 1-10 dentro de la paleta de categorías */
  color: number
  type: TxType
  monthlyBudgetCents?: number
  archived: boolean
  order: number
}

export interface RecurringRule {
  id: string
  type: TxType
  amountCents: number
  categoryId: string
  note?: string
  /** 1-31; si el mes es más corto se usa el último día */
  dayOfMonth: number
  /** Mes YYYY-MM desde el que aplica */
  startMonth: string
  /** Último mes YYYY-MM (incluido), opcional */
  endMonth?: string
  /** Último mes ya generado */
  lastMaterializedMonth?: string
  active: boolean
}

export interface SettingsRow {
  key: string
  value: unknown
}

export type Theme = 'system' | 'light' | 'dark'

export interface BackupFile {
  app: 'control-gastos'
  version: 1
  exportedAt: string
  categories: Category[]
  transactions: Transaction[]
  recurring: RecurringRule[]
  settings: SettingsRow[]
}
