/**
 * Ilustraciones propias estilo cálido/orgánico (ver DESIGN.md):
 * blob de papel de fondo, trazo a mano con extremos redondeados,
 * acentos terracota/oliva/mostaza. El trazo hereda currentColor (--ink).
 */

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
} as const

function Blob({ d }: { d: string }) {
  return <path d={d} fill="var(--illus-paper)" />
}

/** Planta que brota de una maceta con monedas: crecimiento del ahorro. */
export function IllusPlanta({ size = 168 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.77} viewBox="0 0 220 170" aria-hidden>
      <Blob d="M32 102C28 62 68 36 112 34c46-2 82 26 80 68-2 38-44 56-86 54S36 142 32 102Z" />
      {/* maceta */}
      <path d="M85 103h50l-5.5 32c-.6 3.4-2.8 5-6.2 5h-26.6c-3.4 0-5.6-1.6-6.2-5L85 103Z" fill="var(--accent)" fillOpacity="0.88" />
      <path {...stroke} d="M85 103h50l-5.5 32c-.6 3.4-2.8 5-6.2 5h-26.6c-3.4 0-5.6-1.6-6.2-5L85 103Z" />
      {/* tallo y hojas */}
      <path {...stroke} d="M110 103c1-16-1-26-6-40" />
      <path d="M104 63c-7-12-17-16-29-16 6 14 16 19 29 16Z" fill="var(--cat-4)" />
      <path {...stroke} d="M104 63c-7-12-17-16-29-16 6 14 16 19 29 16Z" />
      <path d="M107 82c10-4 16-11 19-24-13 4-19 11-19 24Z" fill="var(--cat-5)" />
      <path {...stroke} d="M107 82c10-4 16-11 19-24-13 4-19 11-19 24Z" />
      {/* moneda con € */}
      <circle cx="155" cy="127" r="14.5" fill="var(--cat-3)" fillOpacity="0.92" />
      <circle {...stroke} cx="155" cy="127" r="14.5" />
      <path {...stroke} strokeWidth={2} d="M161 122a7.5 7.5 0 1 0 0 10M148.5 124.5h8M148.5 129.5h8" />
      {/* destellos */}
      <path {...stroke} strokeWidth={2} d="M68 78c2-3 2-6 1-9M74 84c3-1 5-3 6-6" opacity="0.55" />
      <path {...stroke} strokeWidth={2} d="M152 64c0-3 1-5 3-7M158 68c2-2 5-3 8-3" opacity="0.55" />
    </svg>
  )
}

/** Recibo con lápiz: aún no hay movimientos apuntados. */
export function IllusRecibo({ size = 168 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.77} viewBox="0 0 220 170" aria-hidden>
      <Blob d="M30 90C34 52 74 30 116 32c44 2 76 30 74 70-2 36-40 58-84 54-42-4-80-28-76-66Z" />
      {/* recibo con borde dentado abajo */}
      <path
        d="M82 34l58 3-4 86-7.5-5.5-7.5 6.5-7.5-6.5-7.5 6.5-7.5-6.5-8 5.5L82 34Z"
        fill="var(--surface)"
      />
      <path {...stroke} d="M82 34l58 3-4 86-7.5-5.5-7.5 6.5-7.5-6.5-7.5 6.5-7.5-6.5-8 5.5L82 34Z" />
      {/* renglones */}
      <path {...stroke} strokeWidth={2} d="M94 52h34M94 63h26M94 74h32" opacity="0.45" />
      <path {...stroke} strokeWidth={2.4} d="M94 94h34" opacity="0.9" />
      <path d="M94 94" />
      {/* lápiz */}
      <path d="M133 96l26 26-7 7-26-26 7-7Z" fill="var(--cat-3)" fillOpacity="0.9" />
      <path {...stroke} d="M133 96l26 26-7 7-26-26 7-7Z" />
      <path d="M159 122l8.5 8.8-15.5-1.8 7-7Z" fill="var(--illus-paper)" />
      <path {...stroke} d="M159 122l8.5 8.8-15.5-1.8 7-7Z" />
      <path d="M167.5 130.8l-3.5-3.6 2.2-2.2 1.3 5.8Z" fill="currentColor" />
      {/* moneda pequeña */}
      <circle cx="63" cy="118" r="10" fill="var(--accent)" fillOpacity="0.85" />
      <circle {...stroke} cx="63" cy="118" r="10" />
      <path {...stroke} strokeWidth={2} d="M67 114.5a5.5 5.5 0 1 0 0 7M58.5 116.5h5.5M58.5 119.5h5.5" />
    </svg>
  )
}

/** Calendario con flechas circulares: movimientos que se repiten. */
export function IllusCiclo({ size = 168 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.77} viewBox="0 0 220 170" aria-hidden>
      <Blob d="M34 96C30 58 66 34 110 32c46-2 80 28 78 66-2 40-42 60-84 58S38 134 34 96Z" />
      {/* calendario */}
      <rect x="78" y="52" width="64" height="58" rx="10" fill="var(--surface)" />
      <path d="M78 70v-8c0-5.5 4.5-10 10-10h44c5.5 0 10 4.5 10 10v8H78Z" fill="var(--accent)" fillOpacity="0.88" />
      <rect {...stroke} x="78" y="52" width="64" height="58" rx="10" />
      <path {...stroke} d="M78 70h64M93 44v12M127 44v12" />
      {/* días */}
      <g fill="currentColor" opacity="0.45">
        <circle cx="93" cy="83" r="2.6" />
        <circle cx="110" cy="83" r="2.6" />
        <circle cx="127" cy="83" r="2.6" />
        <circle cx="93" cy="97" r="2.6" />
        <circle cx="127" cy="97" r="2.6" />
      </g>
      <circle cx="110" cy="97" r="5" fill="var(--cat-5)" />
      {/* flechas circulares */}
      <path {...stroke} stroke="var(--accent)" strokeWidth={2.6} d="M156 64c10 12 13 28 6 42" />
      <path {...stroke} stroke="var(--accent)" strokeWidth={2.6} d="M162 99l-1 9-9-2" />
      <path {...stroke} stroke="var(--accent)" strokeWidth={2.6} d="M64 106C54 94 51 78 58 64" />
      <path {...stroke} stroke="var(--accent)" strokeWidth={2.6} d="M58 71l1-9 9 2" />
      {/* destellos */}
      <path {...stroke} strokeWidth={2} d="M163 124c2-2 5-3 8-3M158 131c1-2 1-5 0-8" opacity="0.5" />
    </svg>
  )
}
