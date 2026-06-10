import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { Category } from '../lib/types'

export function CategoryPicker({
  categories,
  value,
  onChange,
}: {
  categories: Category[]
  value: string | null
  onChange: (id: string) => void
}) {
  return (
    <div className="cat-grid">
      {categories.map((c) => (
        <motion.button
          key={c.id}
          type="button"
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className={`cat-chip${c.id === value ? ' selected' : ''}`}
          onClick={() => onChange(c.id)}
        >
          <span className="cat-bubble" style={{ '--bubble': `var(--cat-${c.color})` } as CSSProperties}>
            {c.icon}
          </span>
          <span>{c.name}</span>
        </motion.button>
      ))}
    </div>
  )
}
