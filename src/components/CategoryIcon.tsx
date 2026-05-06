import type { ReactNode } from 'react'

type CategoryIconProps = {
  slug: string
  className?: string
}

const iconClass = 'h-full w-full'

function DataStructuresIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 5.5h11v4h-11v-4Z" className="fill-current opacity-25" />
      <path d="M4.5 14.5h6v4h-6v-4ZM13.5 14.5h6v4h-6v-4Z" className="fill-current opacity-25" />
      <path d="M12 9.5v2.5M7.5 12h9M7.5 12v2.5M16.5 12v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 5.5h11v4h-11v-4ZM4.5 14.5h6v4h-6v-4ZM13.5 14.5h6v4h-6v-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function AlgorithmsIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 7h10M7 12h6M7 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 7h.01M5 12h.01M5 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16.5 10.5 19 13l-2.5 2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OperatingSystemsIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5.5h14v10H5v-10Z" className="fill-current opacity-20" />
      <path d="M5 5.5h14v10H5v-10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 19h6M12 15.5V19M8 9h3M8 12h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function NetworksIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 7.5v9M7.5 9.5l9 5M16.5 9.5l-9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM6 14.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM18 14.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" className="fill-current opacity-20" />
      <path d="M12 4.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM6 14.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM18 14.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function DatabasesIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 7c0-1.4 2.7-2.5 6-2.5s6 1.1 6 2.5v10c0 1.4-2.7 2.5-6 2.5s-6-1.1-6-2.5V7Z" className="fill-current opacity-20" />
      <path d="M18 7c0 1.4-2.7 2.5-6 2.5S6 8.4 6 7m12 5c0 1.4-2.7 2.5-6 2.5S6 13.4 6 12m12 5c0 1.4-2.7 2.5-6 2.5S6 18.4 6 17V7c0-1.4 2.7-2.5 6-2.5s6 1.1 6 2.5v10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function ArchitectureIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 8h8v8H8V8Z" className="fill-current opacity-25" />
      <path d="M8 8h8v8H8V8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4.5 9.5H8M4.5 14.5H8M16 9.5h3.5M16 14.5h3.5M9.5 4.5V8M14.5 4.5V8M9.5 16v3.5M14.5 16v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.5 10.5h3v3h-3v-3Z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

function LanguagesCompilersIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4M13 6.5l-2 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z" stroke="currentColor" strokeWidth="1.4" className="opacity-35" />
    </svg>
  )
}

function SecurityIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4.5 18 7v4.5c0 3.7-2.3 6.2-6 8-3.7-1.8-6-4.3-6-8V7l6-2.5Z" className="fill-current opacity-20" />
      <path d="M12 4.5 18 7v4.5c0 3.7-2.3 6.2-6 8-3.7-1.8-6-4.3-6-8V7l6-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9.5 12 1.7 1.7 3.6-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FallbackIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6h5v5H6V6ZM13 6h5v5h-5V6ZM6 13h5v5H6v-5ZM13 13h5v5h-5v-5Z" className="fill-current opacity-20" />
      <path d="M6 6h5v5H6V6ZM13 6h5v5h-5V6ZM6 13h5v5H6v-5ZM13 13h5v5h-5v-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

const icons: Record<string, () => ReactNode> = {
  'data-structures': DataStructuresIcon,
  algorithms: AlgorithmsIcon,
  'operating-systems': OperatingSystemsIcon,
  networks: NetworksIcon,
  databases: DatabasesIcon,
  'computer-architecture': ArchitectureIcon,
  'languages-compilers': LanguagesCompilersIcon,
  security: SecurityIcon,
}

export default function CategoryIcon({ slug, className = 'h-6 w-6' }: CategoryIconProps) {
  const Icon = icons[slug] ?? FallbackIcon

  return (
    <span className={`inline-grid shrink-0 place-items-center ${className}`}>
      <Icon />
    </span>
  )
}
