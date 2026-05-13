import { customerProgressIndex, customerProgressLabels, type CustomerOrderPhase } from '../domain/orderDisplay'

export function OrderProgressTrack({ phase }: { phase: CustomerOrderPhase }) {
  const labels = customerProgressLabels()
  const active = customerProgressIndex(phase)

  if (phase === 'cancelled') {
    return (
      <div className="rounded-xl border border-[var(--color-tr-danger)]/30 bg-[var(--color-tr-danger)]/8 px-3 py-3 text-center text-sm text-[var(--color-tr-danger)]">
        이 주문은 취소되었습니다.
      </div>
    )
  }

  const pct = ((active + 1) / labels.length) * 100

  return (
    <div>
      <div className="flex justify-between gap-1">
        {labels.map((label, i) => {
          const done = i <= active
          return (
            <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  done
                    ? 'bg-[var(--color-tr-accent)] text-[#04120c]'
                    : 'border border-[var(--color-tr-border-2)] bg-[var(--color-tr-surface-2)] text-[var(--color-tr-muted)]'
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-center text-[9px] font-medium leading-tight sm:text-[10px] ${
                  done ? 'text-[var(--color-tr-text)]' : 'text-[var(--color-tr-muted)]'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-tr-border)]">
        <div
          className="h-full rounded-full bg-[var(--color-tr-accent)] transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
