import type { ButtonHTMLAttributes, ReactNode } from 'react'

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
}

export function TrButton({ children, variant = 'primary', className = '', ...rest }: BtnProps) {
  const base =
    'inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45'
  const styles =
    variant === 'primary'
      ? 'bg-[var(--color-tr-accent)] text-[#04120c] shadow-[0_8px_24px_rgba(38,161,123,0.25)] hover:bg-[var(--color-tr-accent-dim)]'
      : variant === 'danger'
        ? 'border border-[var(--color-tr-danger)]/40 bg-[var(--color-tr-danger)]/10 text-[var(--color-tr-danger)] hover:bg-[var(--color-tr-danger)]/15'
        : 'border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] text-[var(--color-tr-text)] hover:border-[var(--color-tr-border-2)]'
  return (
    <button type="button" className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
