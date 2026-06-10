import { motion } from 'motion/react'

/** Barra de progreso de presupuesto. Por encima de 1 se vuelve roja. */
export function ProgressBar({ fraction, color }: { fraction: number; color: string }) {
  const pct = Math.min(fraction, 1) * 100
  return (
    <div className="progress-track">
      <motion.div
        className="progress-fill"
        style={{ background: fraction > 1 ? 'var(--neg)' : color }}
        initial={{ width: 0 }}
        animate={{ width: `${fraction > 0 ? Math.max(pct, 2.5) : 0}%` }}
        transition={{ type: 'spring', stiffness: 210, damping: 30 }}
      />
    </div>
  )
}
