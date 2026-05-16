import { describe, expect, it } from 'vitest'

import {
  buildCouponRiskGuardReport,
  detectAbnormalCampaignIssuance,
  evaluateCouponUseAttempt,
  isCouponRiskAuditEntry,
} from '../src/domain/couponRiskGuard'
import { mockCoupons } from '../src/mock/coupons'
import { mockEventCampaigns } from '../src/mock/eventCampaigns'
import { effectiveOfflineCouponStatus } from '../src/domain/coupon'

describe('couponRiskGuard', () => {
  it('blocks duplicate use on used coupon', () => {
    const used = mockCoupons.find((c) => effectiveOfflineCouponStatus(c) === 'used')
    expect(used).toBeDefined()
    const ev = evaluateCouponUseAttempt(used!)
    expect(ev.allowed).toBe(false)
    expect(ev.riskCode).toBe('coupon.risk.duplicate_use')
    expect(ev.severity).toBe('FAIL')
  })

  it('blocks expired and canceled coupons', () => {
    const expired = mockCoupons.find((c) => effectiveOfflineCouponStatus(c) === 'expired')
    const canceled = mockCoupons.find((c) => effectiveOfflineCouponStatus(c) === 'canceled')
    expect(evaluateCouponUseAttempt(expired!).riskCode).toBe('coupon.risk.use_expired')
    expect(evaluateCouponUseAttempt(canceled!).riskCode).toBe('coupon.risk.use_canceled')
  })

  it('detects abnormal campaign issuance', () => {
    const camp = mockEventCampaigns[0]!
    const many = Array.from({ length: 5 }, (_, i) => ({
      ...mockCoupons[0]!,
      couponId: `test-${i}`,
      campaignId: camp.campaignId,
      status: 'issued' as const,
    }))
    const risks = detectAbnormalCampaignIssuance(many, [camp], {
      warnThreshold: 4,
      failThreshold: 8,
    })
    expect(risks.length).toBe(1)
    expect(risks[0]!.severity).toBe('WARN')
  })

  it('builds risk report from audit', () => {
    const report = buildCouponRiskGuardReport({
      coupons: mockCoupons,
      campaigns: mockEventCampaigns,
      auditEntries: [
        {
          id: 'r1',
          at: new Date().toISOString(),
          actor: 'customer',
          action: 'coupon.risk.use_expired',
          validation: 'FAIL',
        },
      ],
    })
    expect(report.invalidStatusUseAttempts).toBe(1)
    expect(isCouponRiskAuditEntry({ action: 'coupon.risk.use_expired' } as never)).toBe(true)
  })
})
