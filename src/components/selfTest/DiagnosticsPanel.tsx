import type { SelfTestRunSummary } from '../../selfTest/types'

const statusStyles: Record<SelfTestRunSummary['overall'], string> = {
  PASS: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  WARN: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  FAIL: 'bg-red-500/15 text-red-400 border-red-500/30',
}

type Props = {
  summary: SelfTestRunSummary | null
  onRun?: () => void
  running?: boolean
}

export function DiagnosticsPanel({ summary, onRun, running }: Props) {
  const overall = summary?.overall ?? 'WARN'
  const issueCount = summary?.issueCount ?? 0
  const lastChecked = summary?.checkedAt
    ? new Date(summary.checkedAt).toLocaleString('ko-KR')
    : '\u2014'

  return (
    <section className="rounded-xl border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] p-3">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-tr-muted)]">
            Diagnostics
          </span>
          <span className="rounded-md border border-[var(--color-tr-border)] bg-[var(--color-tr-surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-tr-accent)]">
            Mock only
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tabular-nums ${statusStyles[overall]}`}
          >
            {overall}
          </span>
        </div>
        {onRun ? (
          <button
            type="button"
            disabled={running}
            onClick={onRun}
            className="rounded-lg bg-[var(--color-tr-accent)]/20 px-3 py-1.5 text-xs font-medium text-[var(--color-tr-accent)] disabled:opacity-50"
          >
            {running ? '\uac80\uc0ac \uc911\u2026' : '\uc804\uccb4 \uac80\uc0ac'}
          </button>
        ) : null}
      </header>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <div>
          <dt className="text-[var(--color-tr-muted)]">Issues</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-[var(--color-tr-text)]">{issueCount}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-tr-muted)]">Last checked</dt>
          <dd className="mt-0.5 text-[var(--color-tr-text)]">{lastChecked}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-tr-muted)]">Checks</dt>
          <dd className="mt-0.5 tabular-nums text-[var(--color-tr-text)]">
            {summary
              ? `${summary.passCount}P / ${summary.warnCount}W / ${summary.failCount}F`
              : '\u2014'}
          </dd>
        </div>
      </dl>
    </section>
  )
}
