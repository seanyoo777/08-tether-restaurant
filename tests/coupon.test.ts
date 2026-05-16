import { describe, expect, it } from 'vitest'

import {
  buildQrPlaceholderPayload,
  canTransitionCoupon,
  effectiveCouponStatus,
  transitionCouponStatus,
} from '../src/domain/coupon'
import { mockIssueCouponFromEventHub, mockOneAiEventHubEntries } from '../src/integration/oneaiEventHub'
import { mockCoupons } from '../src/mock/coupons'

describe('coupon domain', () => {
  it('builds QR placeholder payload', () => {
    const p = buildQrPlaceholderPayload('cpn-1', 'st_gangnam_kimchi')
    expect(p).toContain('mock-coupon')
    expect(p).toContain('cpn-1')
  })

  it('allows unused to reserved to redeemed', () => {
    const base = mockCoupons[0]!
    const reserved = transitionCouponStatus({ ...base, status: 'unused' }, 'reserved')
    expect(reserved?.status).toBe('reserved')
    const redeemed = transitionCouponStatus(reserved!, 'redeemed')
    expect(redeemed?.status).toBe('redeemed')
    expect(canTransitionCoupon('redeemed', 'unused')).toBe(false)
  })

  it('marks past expiry as expired', () => {
    const expired = mockCoupons.find((c) => c.couponId === 'cpn-oneai-hub-003')!
    expect(effectiveCouponStatus(expired)).toBe('expired')
  })
})

describe('oneai event hub mock', () => {
  it('issues coupon on win mock', () => {
    const entry = mockOneAiEventHubEntries[0]!
    const { coupon, hubRef } = mockIssueCouponFromEventHub(entry)
    expect(coupon.status).toBe('unused')
    expect(coupon.oneAiEventId).toBe(entry.eventId)
    expect(hubRef).toContain('oneai:hub:mock')
  })
})
