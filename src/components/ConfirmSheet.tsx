import { motion } from 'motion/react'

/** Hoja de confirmación estilo iOS para acciones destructivas. Montar dentro de AnimatePresence. */
export function ConfirmSheet({
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <>
      <motion.div
        className="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onCancel}
      />
      <motion.div
        className="actionsheet"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        exit={{ y: '110%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
      >
        <div className="actionsheet-group">
          <div className="actionsheet-msg">{message}</div>
          <button type="button" className="actionsheet-btn destructive" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
        <div className="actionsheet-group">
          <button type="button" className="actionsheet-btn cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </motion.div>
    </>
  )
}
