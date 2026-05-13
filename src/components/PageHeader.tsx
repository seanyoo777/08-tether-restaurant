import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type PageHeaderProps = {
  title: string
  backTo?: string
  rightSlot?: ReactNode
}

export function PageHeader({ title, backTo, rightSlot }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--color-tr-border)] bg-[color-mix(in_oklab,var(--color-tr-bg)_88%,transparent)] px-4 py-3 backdrop-blur-md">
      {backTo ? (
        <Link
          to={backTo}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-tr-border)] text-sm text-[var(--color-tr-muted)] transition hover:border-[var(--color-tr-accent)] hover:text-[var(--color-tr-text)]"
          aria-label="뒤로"
        >
          ←
        </Link>
      ) : (
        <span className="w-9" />
      )}
      <h1 className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight">{title}</h1>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : <span className="w-9" />}
    </header>
  )
}
