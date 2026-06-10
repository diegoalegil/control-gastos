import { useId } from 'react'
import { motion } from 'motion/react'

interface Option<T extends string> {
  value: T
  label: string
}

/** Control segmentado iOS con pulgar deslizante. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<Option<T>>
  value: T
  onChange: (v: T) => void
}) {
  const id = useId()
  return (
    <div className="segmented" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className={`seg-btn${o.value === value ? ' active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.value === value && (
            <motion.div
              className="seg-thumb"
              layoutId={`seg-${id}`}
              transition={{ type: 'spring', stiffness: 430, damping: 34 }}
            />
          )}
          <span style={{ position: 'relative' }}>{o.label}</span>
        </button>
      ))}
    </div>
  )
}
