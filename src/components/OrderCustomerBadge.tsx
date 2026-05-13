import type { CustomerOrderPhase } from '../domain/orderDisplay'
import { customerPhaseLabel } from '../domain/orderDisplay'

const badgeClass: Record<CustomerOrderPhase, string> = {
  received: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25',
  cooking: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25',
  delivery: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25',
  done: 'bg-[var(--color-tr-accent)]/15 text-[var(--color-tr-accent)] ring-1 ring-[var(--color-tr-accent)]/30',
  cancelled: 'bg-[var(--color-tr-danger)]/12 text-[var(--color-tr-danger)] ring-1 ring-[var(--color-tr-danger)]/25',
}

export function OrderCustomerBadge({ phase }: { phase: CustomerOrderPhase }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeClass[phase]}`}
    >
      {customerPhaseLabel[phase]}
    </span>
  )
}
