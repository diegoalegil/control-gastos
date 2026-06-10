import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { formatKeypad } from '../lib/money'
import { IconBackspace } from './Icons'

// 9.999.999,99 € — sin límites razonables ni en 2050
const MAX_CENTS = 999_999_999

function Key({ children, onPress, aux }: { children: ReactNode; onPress: () => void; aux?: boolean }) {
  return (
    <motion.button
      type="button"
      className={`key${aux ? ' aux' : ''}`}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      onClick={onPress}
    >
      {children}
    </motion.button>
  )
}

/**
 * Teclado de importe estilo cajero: los dígitos entran por los céntimos.
 * '1' → 0,01 €  ·  '1','2','5','0' → 12,50 €
 */
export function AmountKeypad({ cents, onChange }: { cents: number; onChange: (c: number) => void }) {
  const press = (d: number) => {
    const next = cents * 10 + d
    if (next <= MAX_CENTS) onChange(next)
  }

  return (
    <div>
      <motion.div
        key={cents}
        initial={{ scale: 1.025 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 26 }}
        className={`amount-display${cents === 0 ? ' zero' : ''}`}
      >
        {formatKeypad(cents)}
      </motion.div>
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <Key key={d} onPress={() => press(d)}>
            {d}
          </Key>
        ))}
        <Key aux onPress={() => onChange(0)}>
          C
        </Key>
        <Key onPress={() => press(0)}>0</Key>
        <Key aux onPress={() => onChange(Math.floor(cents / 10))}>
          <IconBackspace size={23} />
        </Key>
      </div>
    </div>
  )
}
