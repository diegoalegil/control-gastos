import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Card que entra con un spring suave, escalonada por índice. */
export function FadeCard({
  index = 0,
  className = 'card',
  style,
  children,
}: {
  index?: number
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 31, delay: Math.min(index, 6) * 0.055 }}
    >
      {children}
    </motion.div>
  )
}
