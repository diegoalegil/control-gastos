import { useEffect } from 'react'
import {
  MotionGlobalConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'

/** Importe que cuenta hacia su nuevo valor con un spring (count-up tipo Apple). */
export function AnimatedAmount({ cents, format }: { cents: number; format: (c: number) => string }) {
  const reduced = useReducedMotion()
  const value = useMotionValue(cents)
  const spring = useSpring(value, { stiffness: 170, damping: 27 })
  const text = useTransform(spring, (v) => format(Math.round(v)))

  useEffect(() => {
    if (reduced || MotionGlobalConfig.skipAnimations) spring.jump(cents)
    else value.set(cents)
  }, [cents, reduced, value, spring])

  return <motion.span className="tnum">{text}</motion.span>
}
