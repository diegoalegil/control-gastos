import { motion } from 'motion/react'
import type { ComponentType } from 'react'
import { IconList, IconPie, IconPlus, IconRepeat, IconSliders } from './Icons'

export type Tab = 'resumen' | 'movimientos' | 'recurrentes' | 'ajustes'

const LEFT: Array<{ id: Tab; label: string; Icon: ComponentType<{ size?: number }> }> = [
  { id: 'resumen', label: 'Resumen', Icon: IconPie },
  { id: 'movimientos', label: 'Movimientos', Icon: IconList },
]
const RIGHT: typeof LEFT = [
  { id: 'recurrentes', label: 'Recurrentes', Icon: IconRepeat },
  { id: 'ajustes', label: 'Ajustes', Icon: IconSliders },
]

function TabBtn({
  id,
  label,
  Icon,
  active,
  onSelect,
}: (typeof LEFT)[number] & { active: boolean; onSelect: (t: Tab) => void }) {
  return (
    <motion.button
      type="button"
      className={`tab${active ? ' active' : ''}`}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={() => onSelect(id)}
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={23} />
      {label}
    </motion.button>
  )
}

export function TabBar({
  active,
  onSelect,
  onAdd,
}: {
  active: Tab
  onSelect: (t: Tab) => void
  onAdd: () => void
}) {
  return (
    <nav className="tabbar">
      <div className="tabbar-inner">
        {LEFT.map((t) => (
          <TabBtn key={t.id} {...t} active={active === t.id} onSelect={onSelect} />
        ))}
        <motion.button
          type="button"
          className="tab-add"
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 26 }}
          onClick={onAdd}
          aria-label="Añadir movimiento"
        >
          <IconPlus size={26} />
        </motion.button>
        {RIGHT.map((t) => (
          <TabBtn key={t.id} {...t} active={active === t.id} onSelect={onSelect} />
        ))}
      </div>
    </nav>
  )
}
