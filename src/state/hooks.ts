import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../lib/db'
import type { Category, RecurringRule, Transaction } from '../lib/types'

export function useCategories(): Category[] | undefined {
  return useLiveQuery(() => db.categories.orderBy('order').toArray(), [])
}

export function useCategoryMap(categories: Category[] | undefined): Map<string, Category> {
  return useMemo(() => new Map((categories ?? []).map((c) => [c.id, c])), [categories])
}

/** Movimientos de un mes YYYY-MM, más recientes primero. */
export function useMonthTransactions(ym: string): Transaction[] | undefined {
  return useLiveQuery(
    async () => {
      const txs = await db.transactions.where('date').startsWith(`${ym}-`).toArray()
      return txs.sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : b.date.localeCompare(a.date)))
    },
    [ym],
  )
}

/** Todos los movimientos, más recientes primero. */
export function useAllTransactions(): Transaction[] | undefined {
  return useLiveQuery(async () => {
    const txs = await db.transactions.orderBy('date').reverse().toArray()
    return txs.sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : 0))
  }, [])
}

export function useRecurringRules(): RecurringRule[] | undefined {
  return useLiveQuery(async () => {
    const rules = await db.recurring.toArray()
    return rules.sort((a, b) => Number(b.active) - Number(a.active) || a.dayOfMonth - b.dayOfMonth)
  }, [])
}

export interface MonthTotals {
  income: number
  expense: number
  balance: number
  byCategory: Map<string, number> // solo gastos
}

export function monthTotals(txs: Transaction[]): MonthTotals {
  let income = 0
  let expense = 0
  const byCategory = new Map<string, number>()
  for (const t of txs) {
    if (t.type === 'ingreso') income += t.amountCents
    else {
      expense += t.amountCents
      byCategory.set(t.categoryId, (byCategory.get(t.categoryId) ?? 0) + t.amountCents)
    }
  }
  return { income, expense, balance: income - expense, byCategory }
}

/** Totales de varios meses (para la comparativa). */
export function useMonthsTotals(months: string[]): Array<{ ym: string; income: number; expense: number }> | undefined {
  return useLiveQuery(
    async () => {
      const result = []
      for (const ym of months) {
        const txs = await db.transactions.where('date').startsWith(`${ym}-`).toArray()
        const { income, expense } = monthTotals(txs)
        result.push({ ym, income, expense })
      }
      return result
    },
    [months.join(',')],
  )
}
