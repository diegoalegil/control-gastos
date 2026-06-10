import { motion } from 'motion/react'
import { IconCloudOff, IconLock, IconRepeat } from '../components/Icons'
import { IllusPlanta } from '../components/Illustrations'

export function Welcome({ onDone }: { onDone: () => void }) {
  return (
    <motion.div className="welcome" exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.25 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.08 }}
      >
        <IllusPlanta size={200} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.18 }}
      >
        <h1>Control de Gastos</h1>
        <p>Tu dinero del mes, claro y a mano.</p>
      </motion.div>
      <motion.ul
        className="welcome-points"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.28 }}
      >
        <li>
          <span className="pt-icon">
            <IconLock size={19} />
          </span>
          <span>
            <strong>Privado de verdad</strong>
            Tus datos viven solo en este iPhone.
          </span>
        </li>
        <li>
          <span className="pt-icon">
            <IconCloudOff size={19} />
          </span>
          <span>
            <strong>Funciona sin conexión</strong>
            En el metro, en el avión, donde sea.
          </span>
        </li>
        <li>
          <span className="pt-icon">
            <IconRepeat size={19} />
          </span>
          <span>
            <strong>Recurrentes automáticos</strong>
            Nómina, alquiler y suscripciones se apuntan solas.
          </span>
        </li>
      </motion.ul>
      <motion.button
        type="button"
        className="btn"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.38 }}
        whileTap={{ scale: 0.97 }}
        onClick={onDone}
      >
        Empezar
      </motion.button>
    </motion.div>
  )
}
