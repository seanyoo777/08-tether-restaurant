import { Card } from '../Card'
import type { CouponRiskGuardReport } from '../../domain/couponRiskGuard'

const overallTone: Record<string, string> = {
  PASS: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  WARN: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  FAIL: 'border-red-500/40 bg-red-500/10 text-red-300',
}

const validationTone: Record<string, string> = {
  PASS: 'text-emerald-400',
  WARN: 'text-amber-400',
  FAIL: 'text-red-400',
}

type Props = {
  report: CouponRiskGuardReport
}

export function CouponRiskGuardCard({ report }: Props) {
  return (
    <Card className={overallTone[report.overall] ?? ''}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Risk / Abuse Guard (mock)</h3>
        <span className="rounded-md border border-current px-2 py-0.5 text-[10px] font-bold">
          {report.overall}
        </span>
      </div>
      <p className="mt-2 text-xs opacity-90">
        중복 사용·만료/취소 사용 시도·캠페인 비정상 발급량 mock 감지. 실결제·외부 API 없음.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg border border-[var(--color-tr-border)]/60 bg-[var(--color-tr-surface-2)] px-2 py-2">
          <p className="text-[10px] text-[var(--color-tr-muted)]">중복 사용 시도</p>
          <p className="text-lg font-bold tabular-nums">{report.duplicateUseAttempts}</p>
        </div>
        <div className="rounded-lg border border-[var(--color-tr-border)]/60 bg-[var(--color-tr-surface-2)] px-2 py-2">
          <p className="text-[10px] text-[var(--color-tr-muted)]">무효 상태 사용</p>
          <p className="text-lg font-bold tabular-nums">{report.invalidStatusUseAttempts}</p>
        </div>
        <div className="rounded-lg border border-[var(--color-tr-border)]/60 bg-[var(--color-tr-surface-2)] px-2 py-2">
          <p className="text-[10px] text-[var(--color-tr-muted)]">비정상 캠페인</p>
          <p className="text-lg font-bold tabular-nums">{report.abnormalCampaignCount}</p>
        </div>
        <div className="rounded-lg border border-[var(--color-tr-border)]/60 bg-[var(--color-tr-surface-2)] px-2 py-2">
          <p className="text-[10px] text-[var(--color-tr-muted)]">이슈 건수</p>
          <p className="text-lg font-bold tabular-nums">{report.issueCount}</p>
        </div>
      </div>
      {report.findings.length > 0 ? (
        <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
          {report.findings.slice(0, 8).map((f) => (
            <li
              key={f.id}
              className="rounded-lg border border-[var(--color-tr-border)] bg-[var(--color-tr-surface-2)] px-3 py-2 text-xs"
            >
              <p className={`font-bold ${validationTone[f.severity] ?? ''}`}>
                {f.severity} · {f.code}
              </p>
              <p className="mt-0.5">{f.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-[var(--color-tr-muted)]">현재 감지된 리스크 없음 (PASS)</p>
      )}
      {report.recentRiskAudits.length > 0 ? (
        <div className="mt-3 border-t border-[var(--color-tr-border)]/60 pt-3">
          <p className="text-[10px] font-semibold text-[var(--color-tr-muted)]">최근 coupon.risk.* audit</p>
          <ul className="mt-2 space-y-1">
            {report.recentRiskAudits.slice(0, 5).map((e) => (
              <li key={e.id} className="font-mono text-[10px] text-[var(--color-tr-muted)]">
                {e.action}
                {e.target ? ` · ${e.target}` : ''}
                {e.validation ? ` · ${e.validation}` : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  )
}
