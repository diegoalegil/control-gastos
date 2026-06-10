import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import '../styles/splash-intro.css'

/**
 * SplashIntro — arranque de la app.
 * La marca (moneda € + brote) se dibuja a sí misma sobre --bg, el nombre
 * entra con spring y el splash se eleva revelando la app debajo.
 * Solo transform + opacity. Respeta prefers-reduced-motion.
 */

const DRAW: [number, number, number, number] = [0.65, 0, 0.35, 1]
const HOLD_MS = 1700
const HOLD_MS_REDUCED = 350

export function SplashIntro({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const called = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), reduced ? HOLD_MS_REDUCED : HOLD_MS)
    // red de seguridad: si onAnimationComplete se perdiera (pestaña en segundo
    // plano, etc.), la app nunca debe quedarse detrás del splash
    const safety = setTimeout(() => finish(), (reduced ? HOLD_MS_REDUCED : HOLD_MS) + 1500)
    return () => {
      clearTimeout(t)
      clearTimeout(safety)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  const finish = () => {
    if (called.current) return
    called.current = true
    onDone()
  }

  /** Atajos: si hay reduced motion, todo aparece ya pintado.
      Los trazos van con opacity 0 hasta su delay — un extremo redondeado
      con pathLength 0 pintaría un punto visible antes de empezar. */
  const draw = (delay: number, duration: number) =>
    reduced
      ? { initial: false as const, animate: { pathLength: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { delay, duration, ease: DRAW },
            opacity: { delay, duration: 0.01 },
          },
        }

  const fade = (delay: number, duration = 0.3) =>
    reduced
      ? { initial: false as const, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay, duration, ease: 'easeOut' as const },
        }

  return (
    <motion.div
      className="splash"
      role="presentation"
      aria-label="Control de Gastos"
      initial={false}
      animate={leaving ? { opacity: 0, scale: reduced ? 1 : 1.04 } : { opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0.22 : 0.42, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={() => {
        if (leaving) finish()
      }}
      style={{ pointerEvents: 'none' }}
    >
      <svg className="splash-mark" viewBox="36 18 440 454" fill="none" aria-hidden="true">
        {/* relleno suave de la moneda */}
        <motion.circle cx="256" cy="296" r="146" fill="var(--accent-soft)" {...fade(0.5, 0.35)} />

        {/* la moneda se dibuja a sí misma — como <path> (arranca arriba, sentido horario);
            pathLength sobre <circle> no es fiable */}
        <motion.path
          d="M256 150a146 146 0 0 1 0 292a146 146 0 0 1 0-292"
          stroke="var(--accent)"
          strokeWidth="21"
          strokeLinecap="round"
          {...draw(0.16, 0.5)}
        />

        {/* símbolo €: arco + barras, con pop sutil al cerrar (centrado óptico en la moneda) */}
        <g transform="translate(15 0)">
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          {...(reduced
            ? { initial: false as const, animate: { scale: 1 } }
            : {
                initial: { scale: 1 },
                animate: { scale: [1, 1.07, 1] },
                transition: { delay: 1.02, duration: 0.28, times: [0, 0.4, 1], ease: 'easeOut' },
              })}
        >
          <motion.path
            d="M318 244a89 89 0 1 0 0 104"
            stroke="var(--accent)"
            strokeWidth="33"
            strokeLinecap="round"
            {...draw(0.48, 0.38)}
          />
          <motion.path
            d="M190 278h74"
            stroke="var(--accent)"
            strokeWidth="33"
            strokeLinecap="round"
            {...draw(0.8, 0.16)}
          />
          <motion.path
            d="M190 314h74"
            stroke="var(--accent)"
            strokeWidth="33"
            strokeLinecap="round"
            {...draw(0.88, 0.16)}
          />
        </motion.g>
        </g>

        {/* brote: tallo y hojas (ligero aumento óptico sobre el icono) */}
        <g transform="translate(256 152) scale(1.16) translate(-256 -152)">
        <motion.path
          d="M256 152c-1-25-7-45-22-64"
          stroke="#9db877"
          strokeWidth="15"
          strokeLinecap="round"
          {...draw(0.6, 0.32)}
        />

        {/* hojas: crecen desde su punto de unión con overshoot */}
        <motion.path
          d="M236 90c-13-24-35-35-62-33 11 28 33 39 62 33Z"
          fill="#9db877"
          stroke="var(--bg)"
          strokeWidth="9"
          strokeLinejoin="round"
          style={{ transformBox: 'fill-box', transformOrigin: '100% 85%' }}
          {...(reduced
            ? { initial: false as const, animate: { scale: 1 } }
            : {
                initial: { scale: 0 },
                animate: { scale: 1 },
                transition: { delay: 0.82, type: 'spring', stiffness: 420, damping: 24 },
              })}
        />
        <motion.path
          d="M247 113c23-6 35-21 39-47-25 6-37 22-39 47Z"
          fill="#82bda0"
          stroke="var(--bg)"
          strokeWidth="9"
          strokeLinejoin="round"
          style={{ transformBox: 'fill-box', transformOrigin: '0% 100%' }}
          {...(reduced
            ? { initial: false as const, animate: { scale: 1 } }
            : {
                initial: { scale: 0 },
                animate: { scale: 1 },
                transition: { delay: 0.94, type: 'spring', stiffness: 420, damping: 24 },
              })}
        />
        </g>

        {/* destellos de trazo a mano */}
        <g stroke="var(--ink)" strokeWidth="10" strokeLinecap="round" opacity="0.45">
          <motion.path d="M104 220c6-12 8-22 7-36" {...draw(1.06, 0.26)} />
          <motion.path d="M84 252c-8-7-17-11-28-13" {...draw(1.12, 0.26)} />
          <motion.path d="M408 200c-6 12-8 22-7 36" {...draw(1.14, 0.26)} />
          <motion.path d="M428 168c8 7 17 11 28 13" {...draw(1.2, 0.26)} />
        </g>
      </svg>

      <motion.h1
        className="splash-title"
        {...(reduced
          ? { initial: false as const, animate: { opacity: 1, y: 0 } }
          : {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: {
                delay: 1.0,
                opacity: { delay: 1.0, duration: 0.32 },
                type: 'spring',
                stiffness: 300,
                damping: 30,
              },
            })}
      >
        Control de Gastos
      </motion.h1>
    </motion.div>
  )
}
