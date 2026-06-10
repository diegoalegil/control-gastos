import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionGlobalConfig } from 'motion/react'
import { registerSW } from 'virtual:pwa-register'
import './styles/tokens.css'
import './styles/app.css'
import App from './App'

// modo sin animaciones para tests/capturas (?noanim)
if (new URLSearchParams(location.search).has('noanim')) {
  MotionGlobalConfig.skipAnimations = true
}

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
