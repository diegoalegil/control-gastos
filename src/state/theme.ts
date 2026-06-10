import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { getSetting, setSetting } from '../lib/db'
import type { Theme } from '../lib/types'

const media = window.matchMedia('(prefers-color-scheme: dark)')

function apply(theme: Theme) {
  const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
  document.documentElement.dataset.theme = resolved
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolved === 'dark' ? '#1b1a17' : '#f6f4ee')
  // espejo síncrono para que index.html pinte el tema correcto al arrancar
  try {
    localStorage.setItem('cg-theme', resolved)
  } catch {
    /* sin localStorage no pasa nada: solo se pierde el anti-destello */
  }
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const theme = useLiveQuery(
    async () => (await getSetting<Theme>('theme')) ?? 'system',
    [],
    'system' as Theme,
  )

  useEffect(() => {
    apply(theme)
    if (theme !== 'system') return
    const onChange = () => apply('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  return [theme, (t) => void setSetting('theme', t)]
}
