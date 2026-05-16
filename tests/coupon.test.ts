import { describe, expect, it, beforeEach } from 'vitest'

import {
  buildQrPlaceholderPayload,
  canTransitionOffline,
  effectiveOfflineCouponStatus,
  migrateStoredCouponStatus,
  transitionOfflineCouponStatus,
} from '../src/domain/coupon'
import { mockIssueCouponFromEventHub, mockOneAiEventHubEntries } from '../src/integration/oneaiEventHub'
import { mockCoupons } from '../src/mock/coupons'
import {
  clearPersistedCouponWalletForTests,
  loadPersistedCouponWallet,
  savePersistedCouponWallet,
} from '../src/store/couponWalletPersistence'

describe('offline coupon domain', () => {
  it('builds offline QR placeholder payload', () => {
    const p = buildQrPlaceholderPayload('cpn-1', 'st_gangnam_kimchi')
    expect(p).toContain('offline-mock-coupon')
    expect(p).toContain('cpn-1')
  })

  it('allows issued to used and canceled', () => {
    const base = mockCoupons[0]!
    const used = transitionOfflineCouponStatus({ ...base, status: 'issued' }, 'used')
    expect(used?.status).toBe('used')
    const canceled = transitionOfflineCouponStatus({ ...base, status: 'issued' }, 'canceled')
    expect(canceled?.status).toBe('canceled')
    expect(canTransitionOffline('used', 'issued')).toBe(false)
  })

  it('marks past expiry as expired', () => {
    const expired = mockCoupons.find((c) => c.couponId === 'cpn-oneai-hub-003')!
    expect(effectiveOfflineCouponStatus(expired)).toBe('expired')
  })

  it('migrates legacy unused to issued', () => {
    expect(migrateStoredCouponStatus('unused')).toBe('issued')
    expect(migrateStoredCouponStatus('redeemed')).toBe('used')
  })
})

describe('coupon wallet persistence', () => {
  beforeEach(() => {
    clearPersistedCouponWalletForTests()
  })

  it('round-trips coupons to storage', () => {
    const map = { 'cpn-test': mockCoupons[0]! }
    savePersistedCouponWallet(map)
    const loaded = loadPersistedCouponWallet()
    expect(loaded?.['cpn-test']?.couponId).toBe('cpn-bj-luna-001')
  })
})

describe('oneai event hub mock', () => {
  it('issues coupon with issued status', () => {
    const entry = mockOneAiEventHubEntries[0]!
    const { coupon, hubRef } = mockIssueCouponFromEventHub(entry)
    expect(coupon.status).toBe('issued')
    expect(coupon.oneAiEventId).toBe(entry.eventId)
    expect(hubRef).toContain('oneai:hub:mock')
  })
})
