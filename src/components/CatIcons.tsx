import type { ReactNode } from 'react'

/**
 * Iconos de categoría dibujados a mano (24×24, trazo redondeado, currentColor).
 * Sustituyen a los emojis en TODA la app — ver DESIGN.md.
 */

const ICONS: Record<string, ReactNode> = {
  // la bestia: estrella de tres puntas
  mercedes: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 12V3.75M12 12l-7.14 4.13M12 12l7.14 4.13" />
    </>
  ),
  fuel: (
    <>
      <path d="M5 20.5V6a2 2 0 0 1 2-2h4.5a2 2 0 0 1 2 2v14.5" />
      <path d="M3.5 20.5h10.5" />
      <path d="M7 7.5h4.5V11H7z" />
      <path d="M13.5 10.5h1.8a1.8 1.8 0 0 1 1.8 1.8v3.9a1.4 1.4 0 0 0 2.8 0V9.4L18 7.5" />
    </>
  ),
  cart: (
    <>
      <path d="M4 5h2.3l2.2 10.5h9.3l1.9-7H7.2" />
      <circle cx="9.3" cy="19" r="1.4" />
      <circle cx="16.5" cy="19" r="1.4" />
    </>
  ),
  plate: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="4.1" />
    </>
  ),
  drinks: (
    <>
      <path d="M5.5 5h13l-6.5 7.3V19" />
      <path d="M8.8 19.5h6.4" />
      <path d="M7.6 7.4h8.8" />
    </>
  ),
  bag: (
    <>
      <path d="M7 8.5h10l-.9 11.3a.8.8 0 0 1-.8.7H8.7a.8.8 0 0 1-.8-.7L7 8.5Z" />
      <path d="M9.2 8.5V7.2a2.8 2.8 0 0 1 5.6 0v1.3" />
    </>
  ),
  gamepad: (
    <>
      <path d="M7 9h10a3.7 3.7 0 0 1 3.6 4.1l-.4 2.9a2.5 2.5 0 0 1-4.5 1.1l-1.1-1.6H9.4l-1.1 1.6a2.5 2.5 0 0 1-4.5-1.1l-.4-2.9A3.7 3.7 0 0 1 7 9Z" />
      <path d="M8.7 11.1v3.4M7 12.8h3.4" />
      <path d="M15.3 11.7h.01M17.2 13.6h.01" strokeWidth={2.4} />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M10.2 8.8l5.6 3.2-5.6 3.2Z" fill="currentColor" stroke="none" />
    </>
  ),
  vodafone: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path
        d="M15.4 5.9c-3.1 1.5-4.9 4.4-4.4 7.3.4 2.2 2.3 3.7 4.4 3.3 1.9-.4 3.1-2.2 2.8-4-.3-1.6-1.7-2.7-3.3-2.6.1-1.5 1.1-2.9 2.5-3.7z"
        fill="currentColor"
        stroke="none"
      />
    </>
  ),
  iphone: (
    <>
      <rect x="7.75" y="3.25" width="8.5" height="17.5" rx="2.6" />
      <path d="M10.8 6h2.4" />
      <path d="M12 17.8h.01" strokeWidth={2.4} />
    </>
  ),
  tv: (
    <>
      <rect x="3.75" y="5.25" width="16.5" height="11.5" rx="2" />
      <path d="M12 16.75v3.5M9 20.25h6" />
    </>
  ),
  card: (
    <>
      <rect x="3.75" y="5.75" width="16.5" height="12.5" rx="2.2" />
      <path d="M3.75 10h16.5M7 14.2h3.4" />
    </>
  ),
  gym: (
    <>
      <path d="M9.5 12h5" />
      <path d="M6.5 8.5v7M17.5 8.5v7" strokeWidth={2.1} />
      <path d="M4.25 10.2v3.6M19.75 10.2v3.6" strokeWidth={2.1} />
    </>
  ),
  plane: (
    <>
      <path d="M21.5 3.5 3 10.2l6.5 2.3L11.8 19l2.6-4.3 7.1-11.2Z" />
      <path d="M9.5 12.5 21.5 3.5" />
    </>
  ),
  gift: (
    <>
      <path d="M4.75 11.5h14.5V20a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1Z" />
      <path d="M3.75 7.5h16.5v4H3.75z" />
      <path d="M12 7.5V21" />
      <path d="M12 7.5C10.5 4 6 4 6 6.6c0 2 3.5 1.6 6 .9ZM12 7.5c1.5-3.5 6-3.5 6-.9 0 2-3.5 1.6-6 .9Z" />
    </>
  ),
  sp500: (
    <>
      <path d="M4.5 4.5v15h15" />
      <path d="M7.5 14.5l3.4-3.9 2.8 2.3 4.8-5.9" />
      <path d="M15.3 7h3.2v3.2" />
    </>
  ),
  savings: (
    <>
      <path d="M5.5 19.5v-4.5M10 19.5v-8M14.5 19.5v-11M19 19.5V5.5" strokeWidth={2.3} />
    </>
  ),
  coins: (
    <>
      <circle cx="9" cy="9.5" r="5.25" />
      <path d="M12.9 13.3a5.25 5.25 0 1 0 6.6 6.6" />
      <path d="M14.5 9.3a5.25 5.25 0 0 1 5.2 5.2" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 20.5v-7" />
      <path d="M12 13.5C11 9.7 8.2 7.6 4.7 7.6c.8 4 3.7 6.2 7.3 5.9Z" />
      <path d="M12 13.5c.8-3.1 3.1-4.9 6-4.9-.6 3.3-2.9 5.1-6 4.9Z" />
    </>
  ),
  house: (
    <>
      <path d="M4.75 10.8 12 4.5l7.25 6.3V19a1.6 1.6 0 0 1-1.6 1.6h-3.4v-5.4h-4.5v5.4H6.35a1.6 1.6 0 0 1-1.6-1.6Z" />
    </>
  ),
  bus: (
    <>
      <rect x="4.25" y="4.75" width="15.5" height="12" rx="2.4" />
      <path d="M4.25 10.75h15.5M12 4.75v6" />
      <path d="M8 19.75h.01M16 19.75h.01" strokeWidth={2.6} />
    </>
  ),
  health: (
    <>
      <path d="M12 20.2S4.5 15.6 4.5 10.2A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.4-7.5 10-7.5 10Z" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 5.5l1.5 4.4 4.4 1.5-4.4 1.5L11 17.3l-1.5-4.4-4.4-1.5 4.4-1.5Z" />
      <path d="M18.3 4.4l.55 1.55 1.55.55-1.55.55-.55 1.55-.55-1.55-1.55-.55 1.55-.55Z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="4.25" y="8" width="15.5" height="11.5" rx="2" />
      <path d="M9.5 8V6.4a1.9 1.9 0 0 1 1.9-1.9h1.2a1.9 1.9 0 0 1 1.9 1.9V8" />
      <path d="M4.25 12.5h15.5" />
    </>
  ),
  netflix: (
    <>
      <path d="M8.25 19.5v-15M15.75 19.5v-15M8.25 4.5l7.5 15" strokeWidth={2.3} />
    </>
  ),
  youtube: (
    <>
      <rect x="3.25" y="6" width="17.5" height="12" rx="3.4" />
      <path d="M10.4 9.4l5 2.6-5 2.6Z" fill="currentColor" stroke="none" />
    </>
  ),
  applemusic: (
    <>
      <path d="M9.25 17.5V7.6l8.5-2.1v9.9" />
      <circle cx="7.15" cy="17.5" r="2.1" fill="currentColor" stroke="none" />
      <circle cx="15.65" cy="15.4" r="2.1" fill="currentColor" stroke="none" />
    </>
  ),
  claude: (
    <>
      <path d="M12 3.9v3.4M12 16.7v3.4M3.9 12h3.4M16.7 12h3.4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" strokeWidth={2.1} />
    </>
  ),
  chatgpt: (
    <>
      <path d="M12 3.6l7.3 4.2v8.4L12 20.4l-7.3-4.2V7.8Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
}

/** Orden de presentación en el selector de iconos */
export const ICON_IDS = [
  'mercedes',
  'fuel',
  'cart',
  'plate',
  'drinks',
  'bag',
  'gamepad',
  'play',
  'tv',
  'iphone',
  'vodafone',
  'card',
  'gym',
  'plane',
  'gift',
  'health',
  'house',
  'bus',
  'sp500',
  'savings',
  'coins',
  'sprout',
  'briefcase',
  'sparkles',
  'netflix',
  'youtube',
  'applemusic',
  'claude',
  'chatgpt',
] as const

export function hasCatIcon(id: string | undefined): id is string {
  return !!id && id in ICONS
}

export function CatIcon({ id, size = 22 }: { id: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[id] ?? ICONS.sparkles}
    </svg>
  )
}
