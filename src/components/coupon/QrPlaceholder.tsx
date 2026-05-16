type Props = {
  payload: string
  couponId: string
  size?: 'md' | 'lg'
}

/** 실제 QR 결제/스캔 연동 없음 — 시각적 placeholder */
export function QrPlaceholder({ payload, couponId, size = 'md' }: Props) {
  const dim = size === 'lg' ? 'h-52 w-52' : 'h-36 w-36'
  const cells = 11
  const hash = [...payload].reduce((n, ch) => n + ch.charCodeAt(0), 0)

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative ${dim} overflow-hidden rounded-2xl border-2 border-[var(--color-tr-border-2)] bg-white p-2 shadow-inner`}
        aria-label="QR placeholder (mock, not payment)"
      >
        <div
          className="grid h-full w-full gap-px"
          style={{ gridTemplateColumns: `repeat(${cells}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cells * cells }, (_, i) => {
            const on = (i + hash) % 3 !== 0
            return (
              <span
                key={i}
                className={on ? 'bg-[#0a100e]' : 'bg-white'}
                style={{ aspectRatio: '1' }}
              />
            )
          })}
        </div>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-tr-accent-dim)]">
            Mock QR
          </span>
        </span>
      </div>
      <p className="max-w-[240px] truncate font-mono text-[10px] text-[var(--color-tr-muted)]">{couponId}</p>
    </div>
  )
}
