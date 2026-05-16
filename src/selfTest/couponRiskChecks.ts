import {
  buildCouponRiskGuardReport,
  evaluateCouponUseAttempt,
  isCouponRiskAuditEntry,
} from '../domain/couponRiskGuard'
import { effectiveOfflineCouponStatus } from '../domain/coupon'
import { mockCoupons } from '../mock/coupons'
import { mockEventCampaigns } from '../mock/eventCampaigns'
import type { SelfTestCheck } from './types'

function check(
  partial: Omit<SelfTestCheck, 'durationMs'> & { durationMs?: number },
): SelfTestCheck {
  return { ...partial, durationMs: partial.durationMs ?? 0 }
}

export function runCouponRiskGuardChecks(): SelfTestCheck[] {
  const t0 = performance.now()
  const checks: SelfTestCheck[] = []

  const issued = mockCoupons.find((c) => effectiveOfflineCouponStatus(c) === 'issued')
  const expired = mockCoupons.find((c) => effectiveOfflineCouponStatus(c) === 'expired')
  const used = mockCoupons.find((c) => effectiveOfflineCouponStatus(c) === 'used')
  const canceled = mockCoupons.find((c) => effectiveOfflineCouponStatus(c) === 'canceled')

  if (issued) {
    const ev = evaluateCouponUseAttempt(issued)
    checks.push(
      check({
        id: 'coupon-risk-use-issued',
        name: 'Risk: issued coupon use',
        category: 'coupon',
        status: ev.allowed && ev.severity === 'PASS' ? 'PASS' : 'FAIL',
        message: ev.message,
        durationMs: performance.now() - t0,
      }),
    )
  }

  if (expired) {
    const ev = evaluateCouponUseAttempt(expired)
    checks.push(
      check({
        id: 'coupon-risk-use-expired',
        name: 'Risk: expired coupon blocked',
        category: 'coupon',
        status: !ev.allowed && ev.severity === 'FAIL' ? 'PASS' : 'FAIL',
        message: `${ev.riskCode}: ${ev.message}`,
        durationMs: performance.now() - t0,
      }),
    )
  }

  if (used) {
    const ev = evaluateCouponUseAttempt(used)
    checks.push(
      check({
        id: 'coupon-risk-duplicate-use',
        name: 'Risk: duplicate use on used coupon',
        category: 'coupon',
        status:
          !ev.allowed && ev.riskCode === 'coupon.risk.duplicate_use' && ev.severity === 'FAIL'
            ? 'PASS'
            : 'FAIL',
        message: ev.message,
        durationMs: performance.now() - t0,
      }),
    )
  }

  if (canceled) {
    const ev = evaluateCouponUseAttempt(canceled)
    checks.push(
      check({
        id: 'coupon-risk-use-canceled',
        name: 'Risk: canceled coupon blocked',
        category: 'coupon',
        status: !ev.allowed && ev.severity === 'FAIL' ? 'PASS' : 'FAIL',
        message: ev.message,
        durationMs: performance.now() - t0,
      }),
    )
  }

  const report = buildCouponRiskGuardReport({
    coupons: mockCoupons,
    campaigns: mockEventCampaigns,
    auditEntries: [
      {
        id: 'risk-audit-1',
        at: new Date().toISOString(),
        actor: 'customer',
        action: 'coupon.risk.duplicate_use',
        target: used?.couponId,
        validation: 'FAIL',
      },
    ],
  })

  checks.push(
    check({
      id: 'coupon-risk-report',
      name: 'Risk guard report builder',
      category: 'coupon',
      status: report.duplicateUseAttempts >= 1 ? 'PASS' : 'WARN',
      message: `overall=${report.overall} findings=${report.findings.length}`,
      durationMs: performance.now() - t0,
    }),
  )

  checks.push(
    check({
      id: 'coupon-risk-audit-prefix',
      name: 'coupon.risk.* audit prefix',
      category: 'coupon',
      status: isCouponRiskAuditEntry({ action: 'coupon.risk.use_expired' } as never) ? 'PASS' : 'FAIL',
      message: 'append-only coupon.risk.* actions',
      durationMs: performance.now() - t0,
    }),
  )

  return checks
}
