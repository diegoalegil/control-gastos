import { AnimatePresence, motion } from 'motion/react'

export interface ToastData {
  id: number
  msg: string
  actionLabel?: string
  onAction?: () => void
}

export function ToastHost({ toast }: { toast: ToastData | null }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className="toast"
          initial={{ opacity: 0, y: 16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 10, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          {toast.msg}
          {toast.actionLabel && (
            <button type="button" onClick={toast.onAction}>
              {toast.actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
