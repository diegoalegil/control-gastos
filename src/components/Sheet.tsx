import { useEffect, type ReactNode } from 'react'
import { motion, useDragControls, useReducedMotion } from 'motion/react'

interface SheetProps {
  title?: string
  onClose: () => void
  children: ReactNode
}

/**
 * Bottom sheet tipo iOS: sube con spring, se cierra arrastrando hacia abajo
 * desde el asa (el contenido sigue siendo desplazable). Debe montarse dentro
 * de un AnimatePresence.
 */
export function Sheet({ title, onClose, children }: SheetProps) {
  const controls = useDragControls()
  const reduced = useReducedMotion()

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  return (
    <>
      <motion.div
        className="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />
      <motion.div
        className="sheet"
        role="dialog"
        aria-modal="true"
        initial={reduced ? { opacity: 0 } : { y: '100%' }}
        animate={reduced ? { opacity: 1 } : { y: 0 }}
        exit={reduced ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        drag={reduced ? false : 'y'}
        dragListener={false}
        dragControls={controls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 500) onClose()
        }}
      >
        <div className="sheet-handle" onPointerDown={(e) => controls.start(e)} />
        {title && <div className="sheet-title">{title}</div>}
        <div className="sheet-body">{children}</div>
      </motion.div>
    </>
  )
}
