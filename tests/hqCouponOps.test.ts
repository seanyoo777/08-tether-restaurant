import { describe, expect, it } from 'vitest'

import {
  buildCampaignCouponStats,
  buildCouponStatusCounts,
  buildHqCouponOpsSnapshot,
  isCouponAuditEntry,
} from '../src/domain/hqCouponOps'
import { mockCoupons } from '../src/mock/coupons'
import { mockEventCampaigns } from '../src/mock/eventCampaigns'

describe('hqCouponOps', () => {
  it('counts offline statuses', () => {
    const counts = buildCouponStatusCounts(mockCoupons)
    const sum = counts.issued + counts.used + counts.expired + counts.canceled
    expect(sum).toBe(mockCoupons.length)
  })

  it('builds campaign stats from coupons', () => {
    const stats = buildCampaignCouponStats(mockCoupons, mockEventCampaigns)
    expect(stats.length).toBeGreaterThan(0)
    expect(stats.some((s) => s.total > 0)).toBe(true)
  })

  it('filters coupon audit entries', () => {
    expect(isCouponAuditEntry({ action: 'coupon.generated' } as never)).toBe(true)
    expect(isCouponAuditEntry({ action: 'self_test.run' } as never)).toBe(false)
  })

  it('builds snapshot with localStorage data source', () => {
    const snap = buildHqCouponOpsSnapshot({
      coupons: mockCoupons,
      campaigns: mockEventCampaigns,
      auditEntries: [
        {
          id: 'a1',
          at: new Date().toISOString(),
          actor: 'customer',
          action: 'coupon.generated',
        },
      ],
    })
    expect(snap.dataSource).toBe('localStorage')
    expect(snap.recentCouponAudits.length).toBe(1)
  })
})
