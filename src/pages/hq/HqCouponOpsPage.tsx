import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { DiagnosticsPanel } from '../../components/selfTest/DiagnosticsPanel'
import { SelfTestCheckList } from '../../components/selfTest/SelfTestCheckList'
import { TrButton } from '../../components/TrButton'
import { CouponRiskGuardCard } from '../../components/coupon/CouponRiskGuardCard'
import { buildCouponRiskGuardReport } from '../../domain/couponRiskGuard'
import { buildHqCouponOpsSnapshot, statusCountRows } from '../../domain/hqCouponOps'
import { mockEventCampaigns } from '../../mock/eventCampaigns'
import { runCouponSelfTestSuite } from '../../selfTest/runSelfTests'
import type { SelfTestRunSummary } from '../../selfTest/types'
import { appendAudit } from '../../store/auditTrailStore'
import { useAuditTrailStore } from '../../store/auditTrailStore'
import { useCouponWalletStore } from '../../store/couponWalletStore'

const validationTone: Record<string, string> = {
  PASS: 'text-emerald-400',
  WARN: 'text-amber-400',
  FAIL: 'text-red-400',
}

export function HqCouponOpsPage() {
  const coupons = useCouponWalletStore((s) => s.listCoupons())
  const reloadFromPersistence = useCouponWalletStore((s) => s.reloadFromPersistence)
  const auditEntries = useAuditTrailStore((s) => s.entries)

  const [selfTest, setSelfTest] = useState<SelfTestRunSummary | null>(null)
  const [running, setRunning] = useState(false)

  const snapshot = useMemo(
    () =>
      buildHqCouponOpsSnapshot({
        coupons,
        campaigns: mockEventCampaigns,
        auditEntries,
      }),
    [coupons, auditEntries],
  )

  const riskReport = useMemo(
    () =>
      buildCouponRiskGuardReport({
        coupons,
        campaigns: mockEventCampaigns,
        auditEntries,
      }),
    [coupons, auditEntries],
  )

  const runCouponTests = useCallback(() => {
    setRunning(true)
    try {
      setSelfTest(runCouponSelfTestSuite())
    } finally {
      setRunning(false)
    }
  }, [])

  const refreshWallet = () => {
    reloadFromPersistence()
    appendAudit({
      actor: 'hq_admin',
      action: 'hq.coupon_ops.refresh',
      detail: 'reload wallet from localStorage',
      validation: 'PASS',
    })
  }

  return (
    <article className="flex max-w-4xl flex-col gap-4">
      <MockBanner />
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">쿠폰 운영 관리</h2>
          <p className="mt-1 text-sm text-[var(--color-tr-muted)]">
            발급·사용 mock 통계 · localStorage 지갑 · 세션 audit. 실결제·QR 결제·포인트 정산·외부 API 없음.
          </p>
          <p className="mt-2 text-[10px] font-mono text-[var(--color-tr-muted)]">
            storage: {snapshot.storageKey}
          </p>
        </div>
        <span className="rounded-md border border-[var(--color-tr-border)] bg-[var(--color-tr-surface-2)] px-2 py-1 text-[10px] font-medium text-[var(--color-tr-accent)]">
          Mock only
        </span>
      </header>

      <div className="flex flex-wrap gap-2">
        <TrButton variant="ghost" onClick={refreshWallet}>
          localStorage 새로고침
        </TrButton>
        <TrButton variant="ghost" onClick={runCouponTests}>
          쿠폰 Self-Test
        </TrButton>
        <Link
          to="/admin/hq/self-test"
          className="inline-flex min-h-11 items-center rounded-xl border border-[var(--color-tr-border)] px-4 text-sm font-semibold"
        >
          Self-Test Center
        </Link>
      </div>

      <DiagnosticsPanel summary={selfTest} onRun={runCouponTests} running={running} />

      {selfTest ? (
        <Card>
          <h3 className="text-sm font-semibold">쿠폰 Self-Test (PASS / WARN / FAIL)</h3>
          <div className="mt-3">
            <SelfTestCheckList checks={selfTest.checks.filter((c) => c.category === 'coupon')} />
          </div>
        </Card>
      ) : null}

      <CouponRiskGuardCard report={riskReport} />

      <Card>
        <h3 className="text-sm font-semibold">발급 현황 요약</h3>
        <p className="mt-1 text-2xl font-bold tabular-nums">{snapshot.totalCoupons}</p>
        <p className="text-xs text-[var(--color-tr-muted)]">총 쿠폰 (localStorage + 시드)</p>
      </Card>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {statusCountRows(snapshot.statusCounts).map((row) => (
          <Card key={row.key}>
            <p className="text-[10px] text-[var(--color-tr-muted)]">{row.label}</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{row.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold">캠페인별 발급·사용 mock 통계</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--color-tr-border)] text-[var(--color-tr-muted)]">
                <th className="py-2 pr-2 font-normal">캠페인</th>
                <th className="py-2 pr-2 font-normal">발급</th>
                <th className="py-2 pr-2 font-normal">사용</th>
                <th className="py-2 pr-2 font-normal">만료</th>
                <th className="py-2 pr-2 font-normal">취소</th>
                <th className="py-2 font-normal">합계</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.campaignStats.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-[var(--color-tr-muted)]">
                    캠페인 데이터 없음
                  </td>
                </tr>
              ) : (
                snapshot.campaignStats.map((row) => (
                  <tr key={row.campaignKey} className="border-b border-[var(--color-tr-border)]/60">
                    <td className="py-2 pr-2 font-medium">{row.title}</td>
                    <td className="py-2 pr-2 tabular-nums">{row.issued}</td>
                    <td className="py-2 pr-2 tabular-nums">{row.used}</td>
                    <td className="py-2 pr-2 tabular-nums">{row.expired}</td>
                    <td className="py-2 pr-2 tabular-nums">{row.canceled}</td>
                    <td className="py-2 tabular-nums font-semibold">{row.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold">최근 coupon audit (append-only)</h3>
        <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto">
          {snapshot.recentCouponAudits.length === 0 ? (
            <li className="text-sm text-[var(--color-tr-muted)]">쿠폰 관련 audit 없음</li>
          ) : (
            snapshot.recentCouponAudits.map((e) => (
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
                  <p className={`mt-1 text-[10px] font-bold ${validationTone[e.validation] ?? ''}`}>
                    {e.validation}
                  </p>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </Card>
    </article>
  )
}
