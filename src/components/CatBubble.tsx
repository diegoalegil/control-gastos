import type { CSSProperties } from 'react'
import { CatIcon, hasCatIcon } from './CatIcons'
import type { Category } from '../lib/types'

/**
 * Burbuja de categoría: icono SVG sobre fondo tintado con el color de la
 * categoría. iconId explícito (p. ej. el de una recurrente) tiene prioridad.
 * Nunca emojis (solo como reserva de datos antiguos).
 */
export function CatBubble({
  category,
  iconId,
  color: colorOverride,
  size = 42,
}: {
  category?: Category
  iconId?: string
  color?: number
  size?: number
}) {
  const id = iconId ?? category?.iconId
  const color = colorOverride ?? category?.color ?? 10
  return (
    <span
      className="cat-bubble"
      style={{ '--bubble': `var(--cat-${color})`, width: size, height: size } as CSSProperties}
    >
      {hasCatIcon(id) ? (
        <CatIcon id={id} size={Math.round(size * 0.55)} />
      ) : category?.icon ? (
        category.icon
      ) : (
        <CatIcon id="sparkles" size={Math.round(size * 0.55)} />
      )}
    </span>
  )
}
