import { motion } from 'motion/react'

export function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`switch${on ? ' on' : ''}`}
      onClick={() => onChange(!on)}
    >
      <motion.span className="switch-thumb" layout transition={{ type: 'spring', stiffness: 520, damping: 33 }} />
    </button>
  )
}
