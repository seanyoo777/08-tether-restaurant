import { create } from 'zustand'

import {
  effectiveCouponStatus,
  transitionCouponStatus,
  type RestaurantCoupon,
} from '../domain/coupon'
import { mockIssueCouponFromEventHub, type OneAiEventHubEntry } from '../integration/oneaiEventHub'
import { mockCoupons } from '../mock/coupons'
import { appendAudit } from './auditTrailStore'

type WalletState = {
  coupons: Record<string, RestaurantCoupon>
  upsert: (c: RestaurantCoupon) => void
  listCoupons: () => RestaurantCoupon[]
  getCoupon: (id: string) => RestaurantCoupon | undefined
  toggleSave: (couponId: string) => void
  reserveMock: (couponId: string) => boolean
  redeemMock: (couponId: string) => boolean
  claimFromOneAiEvent: (entry: OneAiEventHubEntry) => RestaurantCoupon | null
}

function seedWallet(): Record<string, RestaurantCoupon> {
  const map: Record<string, RestaurantCoupon> = {}
  for (const c of mockCoupons) {
    map[c.couponId] = { ...c, status: effectiveCouponStatus(c) }
  }
  return map
}

export const useCouponWalletStore = create<WalletState>((set, get) => ({
  coupons: seedWallet(),

  upsert: (c) => set({ coupons: { ...get().coupons, [c.couponId]: c } }),

  listCoupons: () =>
    Object.values(get().coupons)
      .map((c) => ({ ...c, status: effectiveCouponStatus(c) }))
      .sort((a, b) => (a.validUntil < b.validUntil ? -1 : 1)),

  getCoupon: (id) => {
    const c = get().coupons[id]
    if (!c) return undefined
    return { ...c, status: effectiveCouponStatus(c) }
  },

  toggleSave: (couponId) => {
    const c = get().coupons[couponId]
    if (!c) return
    const next = { ...c, saved: !c.saved }
    set({ coupons: { ...get().coupons, [couponId]: next } })
    appendAudit({
      actor: 'customer',
      action: next.saved ? 'coupon.saved.mock' : 'coupon.unsaved.mock',
      target: couponId,
    })
  },

  reserveMock: (couponId) => {
    const c = get().coupons[couponId]
    if (!c) return false
    const next = transitionCouponStatus(c, 'reserved')
    if (!next) return false
    set({ coupons: { ...get().coupons, [couponId]: next } })
    appendAudit({
      actor: 'customer',
      action: 'coupon.claimed',
      target: couponId,
      detail: 'status=reserved (mock, no payment)',
      validation: 'PASS',
    })
    return true
  },

  redeemMock: (couponId) => {
    const c = get().coupons[couponId]
    if (!c) return false
    const current = effectiveCouponStatus(c)
    let working = c
    if (current === 'unused') {
      const reserved = transitionCouponStatus(c, 'reserved')
      if (!reserved) return false
      working = reserved
    }
    const next = transitionCouponStatus(working, 'redeemed')
    if (!next) return false
    set({ coupons: { ...get().coupons, [couponId]: next } })
    appendAudit({
      actor: 'customer',
      action: 'coupon.redeemed.mock',
      target: couponId,
      detail: 'mock redeem — not a real payment',
      validation: 'PASS',
    })
    return true
  },

  claimFromOneAiEvent: (entry) => {
    const { coupon, hubRef } = mockIssueCouponFromEventHub(entry)
    set({ coupons: { ...get().coupons, [coupon.couponId]: coupon } })
    appendAudit({
      actor: 'customer',
      action: 'coupon.generated',
      target: coupon.couponId,
      detail: `oneai hubRef=${hubRef} event=${entry.eventId}`,
      validation: 'PASS',
    })
    return coupon
  },
}))
