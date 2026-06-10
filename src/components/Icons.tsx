import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function I({ size = 24, children, ...rest }: IconProps & { children: ReactNode }) {
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
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconPie = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 3.75V12l5.85 5.85" />
  </I>
)

export const IconList = (p: IconProps) => (
  <I {...p}>
    <path d="M8.5 6h11M8.5 12h11M8.5 18h11" />
    <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth={2.6} />
  </I>
)

export const IconRepeat = (p: IconProps) => (
  <I {...p}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </I>
)

export const IconSliders = (p: IconProps) => (
  <I {...p}>
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
    <path d="M2 14h4M10 8h4M18 16h4" />
  </I>
)

export const IconPlus = (p: IconProps) => (
  <I strokeWidth={2.2} {...p}>
    <path d="M12 5v14M5 12h14" />
  </I>
)

export const IconChevronLeft = (p: IconProps) => (
  <I strokeWidth={2.1} {...p}>
    <path d="m15 18-6-6 6-6" />
  </I>
)

export const IconChevronRight = (p: IconProps) => (
  <I strokeWidth={2.1} {...p}>
    <path d="m9 18 6-6-6-6" />
  </I>
)

export const IconSearch = (p: IconProps) => (
  <I {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
  </I>
)

export const IconX = (p: IconProps) => (
  <I strokeWidth={2.1} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </I>
)

export const IconTrash = (p: IconProps) => (
  <I {...p}>
    <path d="M3.5 6.5h17" />
    <path d="M8.5 6.5v-2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2" />
    <path d="M18.5 6.5V19a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V6.5" />
    <path d="M10 11v6M14 11v6" />
  </I>
)

export const IconShare = (p: IconProps) => (
  <I {...p}>
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    <path d="m16 6-4-4-4 4" />
    <path d="M12 2v13" />
  </I>
)

export const IconDownload = (p: IconProps) => (
  <I {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </I>
)

export const IconCheck = (p: IconProps) => (
  <I strokeWidth={2.2} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </I>
)

export const IconBackspace = (p: IconProps) => (
  <I {...p}>
    <path d="M21.5 5.5h-12L3 12l6.5 6.5h12a.8.8 0 0 0 .8-.8V6.3a.8.8 0 0 0-.8-.8Z" />
    <path d="m12.5 9.5 5 5M17.5 9.5l-5 5" />
  </I>
)

export const IconLock = (p: IconProps) => (
  <I {...p}>
    <rect x="4.5" y="11" width="15" height="9.5" rx="2.5" />
    <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
  </I>
)

export const IconCloudOff = (p: IconProps) => (
  <I {...p}>
    <path d="M22.6 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-5.95M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3" />
    <path d="m2 2 20 20" />
  </I>
)

export const IconPencil = (p: IconProps) => (
  <I {...p}>
    <path d="M17 3.5a2.6 2.6 0 0 1 3.7 3.7L7.6 20.3 2.5 21.5l1.2-5.1L17 3.5Z" />
  </I>
)

export const IconCalendar = (p: IconProps) => (
  <I {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M8 2.5V7M16 2.5V7M3.5 10.5h17" />
  </I>
)
