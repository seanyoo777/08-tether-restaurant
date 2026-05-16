import type { SelfTestCheck } from '../../selfTest/types'

const rowStyles: Record<SelfTestCheck['status'], string> = {
  PASS: 'text-emerald-400',
  WARN: 'text-amber-400',
  FAIL: 'text-red-400',
}

type Props = {
  checks: SelfTestCheck[]
}

export function SelfTestCheckList({ checks }: Props) {
  if (checks.length === 0) {
    return <p className="text-sm text-[var(--color-tr-muted)]">검사를 실행하면 결과가 표시됩니다.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {checks.map((c) => (
        <li
          key={c.id}
          className="rounded-lg border border-[var(--color-tr-border)] bg-[var(--color-tr-surface-2)] px-3 py-2 text-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium">{c.name}</span>
            <span className={`shrink-0 text-[10px] font-bold ${rowStyles[c.status]}`}>{c.status}</span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-tr-muted)]">{c.message}</p>
          <p className="mt-0.5 text-[10px] text-[var(--color-tr-muted)]">
            {c.category}
            {c.durationMs != null ? ` \u00b7 ${Math.round(c.durationMs)}ms` : ''}
          </p>
        </li>
      ))}
    </ul>
  )
}
