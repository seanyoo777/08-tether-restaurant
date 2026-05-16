import { useAuditTrailStore } from '../../store/auditTrailStore'

export function AuditTrailPanel() {
  const entries = useAuditTrailStore((s) => s.entries)
  const reversed = [...entries].reverse()

  return (
    <section className="flex flex-col gap-2">
      <p className="text-xs text-[var(--color-tr-muted)]">
        Append-only mock audit trail. No delete or rewrite.
      </p>
      <ul className="max-h-72 space-y-2 overflow-y-auto">
        {reversed.map((e) => (
          <li
            key={e.id}
            className="rounded-lg border border-[var(--color-tr-border)] bg-[var(--color-tr-surface-2)] px-3 py-2 text-xs"
          >
            <p className="font-mono text-[10px] text-[var(--color-tr-muted)]">
              {new Date(e.at).toLocaleString('ko-KR')} · {e.actor}
            </p>
            <p className="mt-1 font-medium">{e.action}</p>
            {e.target ? <p className="text-[var(--color-tr-muted)]">target: {e.target}</p> : null}
            {e.detail ? <p className="mt-0.5 text-[var(--color-tr-muted)]">{e.detail}</p> : null}
            {e.validation ? (
              <p className="mt-1 text-[10px] font-bold text-[var(--color-tr-accent)]">{e.validation}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
