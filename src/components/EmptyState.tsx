import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function EmptyState({
  art,
  title,
  caption,
  action,
}: {
  art: ReactNode
  title: string
  caption: string
  action?: ReactNode
}) {
  return (
    <motion.div
      className="empty"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {art}
      <h3>{title}</h3>
      <p>{caption}</p>
      {action}
    </motion.div>
  )
}
