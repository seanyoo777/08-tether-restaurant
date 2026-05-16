import { create } from 'zustand'

import {
  buildQrPlaceholderPayload,
  effectiveOfflineCouponStatus,
  transitionOfflineCouponStatus,
  type RestaurantCoupon,
} from '../domain/coupon'
import {
  detectAbnormalCampaignIssuance,
  evaluateCouponUseAttempt,
  type CouponUseRiskEvaluation,
} from '../domain/couponRiskGuard'
import { mockIssueCouponFromEventHub, type OneAiEventHubEntry } from '../integration/oneaiEventHub'
import type { EventCampaign } from '../mock/eventCampaigns'
import { mockCoupons } from '../mock/coupons'
import { appendAudit } from './auditTrailStore'
import { appendCouponRiskAudit } from './couponRiskGuardActions'
import {
  loadPersistedCouponWallet,
  savePersistedCouponWallet,
} from './couponWalletPersistence'

type WalletState = {
  coupons: Record<string, RestaurantCoupon>
  upsert: (c: RestaurantCoupon) => void
  listCoupons: () => RestaurantCoupon[]
  getCoupon: (id: string) => RestaurantCoupon | undefined
  toggleSave: (couponId: string) => void
  /** legacy: issued 유지 + audit */
  reserveMock: (couponId: string) => boolean
  /** legacy → offline used */
  redeemMock: (couponId: string) => boolean
  applyUsedMock: (couponId: string) => boolean
  /** Risk Guard 평가 + audit (차단 시 상태 변경 없음) */
  attemptUseWithRiskGuard: (couponId: string) => CouponUseRiskEvaluation | null
  applyCanceledMock: (couponId: string) => boolean
  claimFromOneAiEvent: (entry: OneAiEventHubEntry) => RestaurantCoupon | null
  issueFromCampaign: (campaign: EventCampaign) => RestaurantCoupon | null
  /** HQ 패널 — localStorage에서 지갑 재로드 */
  reloadFromPersistence: () => void
}

function seedWallet(): Record<string, RestaurantCoupon> {
  const map: Record<string, RestaurantCoupon> = {}
  for (const c of mockCoupons) {
    map[c.couponId] = { ...c, status: effectiveOfflineCouponStatus(c) }
  }
  return map
}

function loadInitialCoupons(): Record<string, RestaurantCoupon> {
  const persisted = loadPersistedCouponWallet()
  if (persisted && Object.keys(persisted).length > 0) return persisted
  return seedWallet()
}

function commit(
  set: (partial: Partial<WalletState>) => void,
  coupons: Record<string, RestaurantCoupon>,
) {
  set({ coupons })
  savePersistedCouponWallet(coupons)
}

export const useCouponWalletStore = create<WalletState>((set, get) => ({
  coupons: loadInitialCoupons(),

  upsert: (c) => commit(set, { ...get().coupons, [c.couponId]: c }),

  listCoupons: () =>
    Object.values(get().coupons)
      .map((c) => ({ ...c, status: effectiveOfflineCouponStatus(c) }))
      .sort((a, b) => (a.validUntil < b.validUntil ? -1 : 1)),

  getCoupon: (id) => {
    const c = get().coupons[id]
    if (!c) return undefined
    return { ...c, status: effectiveOfflineCouponStatus(c) }
  },

  toggleSave: (couponId) => {
    const c = get().coupons[couponId]
    if (!c) return
    const next = { ...c, saved: !c.saved }
    commit(set, { ...get().coupons, [couponId]: next })
    appendAudit({
      actor: 'customer',
      action: next.saved ? 'coupon.saved.mock' : 'coupon.unsaved.mock',
      target: couponId,
    })
  },

  reserveMock: (couponId) => {
    const c = get().coupons[couponId]
    if (!c) return false
    if (effectiveOfflineCouponStatus(c) !== 'issued') return false
    appendAudit({
      actor: 'customer',
      action: 'coupon.claimed',
      target: couponId,
      detail: 'offline issued (mock, no payment)',
      validation: 'PASS',
    })
    return true
  },

  redeemMock: (couponId) => get().applyUsedMock(couponId),

  attemptUseWithRiskGuard: (couponId) => {
    const c = get().coupons[couponId]
    if (!c) return null
    const normalized = { ...c, status: effectiveOfflineCouponStatus(c) }
    const evaluation = evaluateCouponUseAttempt(normalized)
    appendCouponRiskAudit({
      action: evaluation.riskCode,
      target: couponId,
      detail: evaluation.message,
      validation: evaluation.severity,
      actor: 'customer',
    })
    return evaluation
  },

  applyUsedMock: (couponId) => {
    const evaluation = get().attemptUseWithRiskGuard(couponId)
    if (!evaluation?.allowed) return false
    const c = get().coupons[couponId]
    if (!c) return false
    const next = transitionOfflineCouponStatus(c, 'used')
    if (!next) return false
    commit(set, { ...get().coupons, [couponId]: next })
    appendAudit({
      actor: 'customer',
      action: 'coupon.redeemed.mock',
      target: couponId,
      detail: 'offline status=used (not real QR payment)',
      validation: 'PASS',
    })
    return true
  },

  applyCanceledMock: (couponId) => {
    const c = get().coupons[couponId]
    if (!c) return false
    const next = transitionOfflineCouponStatus(c, 'canceled')
    if (!next) return false
    commit(set, { ...get().coupons, [couponId]: next })
    appendAudit({
      actor: 'customer',
      action: 'coupon.canceled.mock',
      target: couponId,
      detail: 'offline status=canceled',
      validation: 'PASS',
    })
    return true
  },

  claimFromOneAiEvent: (entry) => {
    const { coupon, hubRef } = mockIssueCouponFromEventHub(entry)
    commit(set, { ...get().coupons, [coupon.couponId]: coupon })
    appendAudit({
      actor: 'customer',
      action: 'coupon.generated',
      target: coupon.couponId,
      detail: `oneai hubRef=${hubRef} event=${entry.eventId}`,
      validation: 'PASS',
    })
    return coupon
  },

  reloadFromPersistence: () => {
    const next = loadInitialCoupons()
    set({ coupons: next })
  },

  issueFromCampaign: (campaign) => {
    const couponId = `cpn-camp-${campaign.campaignId}-${Date.now()}`
    const coupon: RestaurantCoupon = {
      couponId,
      storeId: campaign.storeId,
      storeName: campaign.storeName,
      eventName: campaign.title,
      campaignId: campaign.campaignId,
      bjEventTag: campaign.bjEventTag,
      validFrom: new Date().toISOString(),
      validUntil: campaign.endsAt,
      status: 'issued',
      qrPayload: buildQrPlaceholderPayload(couponId, campaign.storeId),
      discountLabel: campaign.prizeLabel,
      saved: false,
    }
    commit(set, { ...get().coupons, [coupon.couponId]: coupon })
    appendAudit({
      actor: 'customer',
      action: 'coupon.generated',
      target: coupon.couponId,
      detail: `offline campaign=${campaign.campaignId}`,
      validation: 'PASS',
    })
    const issuanceRisks = detectAbnormalCampaignIssuance(
      Object.values(get().coupons),
      [campaign],
    )
    const campRisk = issuanceRisks.find((r) => r.campaignKey === campaign.campaignId)
    if (campRisk) {
      appendCouponRiskAudit({
        action: 'coupon.risk.abnormal_issuance',
        target: campaign.campaignId,
        detail: campRisk.message,
        validation: campRisk.severity,
        actor: 'system',
      })
    }
    return coupon
  },
}))
