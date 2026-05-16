/**
 * OneAI Event Hub mock 어댑터 (3번 OneAI 연동 슬롯).
 * 실 API·실 당첨·실 결제 없음.
 */

import { PRODUCT_IDS } from './productContext'
import type { RestaurantCoupon } from '../domain/coupon'
import { buildQrPlaceholderPayload } from '../domain/coupon'

export const ONEAI_EVENT_HUB_PRODUCT = PRODUCT_IDS.oneAi

export type OneAiEventHubEntry = {
  eventId: string
  title: string
  subtitle: string
  bjTag?: string
  storeId: string
  storeName: string
  endsAt: string
  prizeLabel: string
}

export const mockOneAiEventHubEntries: OneAiEventHubEntry[] = [
  {
    eventId: 'oneai-evt-luna-2026',
    title: 'Luna BJ 라이브 시청 이벤트',
    subtitle: '라이브 30분 시청 후 쿠폰 발급 (mock)',
    bjTag: 'BJ · Luna',
    storeId: 'st_gangnam_kimchi',
    storeName: '강남 김치찌개 연구소',
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    prizeLabel: '음료 1잔 무료',
  },
  {
    eventId: 'oneai-evt-hub-weekly',
    title: 'OneAI Event Hub 주간 당첨',
    subtitle: 'Hub 추첨 당첨자 쿠폰 (mock)',
    bjTag: 'OneAI Hub',
    storeId: 'st_gangnam_kimchi',
    storeName: '강남 김치찌개 연구소',
    endsAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    prizeLabel: '사이드 메뉴 증정',
  },
]

export type OneAiWinMockResult = {
  won: true
  coupon: RestaurantCoupon
  hubRef: string
}

/** Event Hub 당첨 mock → 쿠폰 발급 DTO */
export function mockIssueCouponFromEventHub(entry: OneAiEventHubEntry): OneAiWinMockResult {
  const couponId = `cpn-oneai-${entry.eventId}-${Date.now()}`
  const validUntil = entry.endsAt
  const validFrom = new Date().toISOString()
  const coupon: RestaurantCoupon = {
    couponId,
    storeId: entry.storeId,
    storeName: entry.storeName,
    eventName: entry.title,
    oneAiEventId: entry.eventId,
    bjEventTag: entry.bjTag,
    validFrom,
    validUntil,
    status: 'issued',
    qrPayload: buildQrPlaceholderPayload(couponId, entry.storeId),
    discountLabel: entry.prizeLabel,
    saved: false,
  }
  return {
    won: true,
    coupon,
    hubRef: `oneai:hub:mock:${entry.eventId}`,
  }
}
