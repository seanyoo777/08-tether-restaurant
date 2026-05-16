import {
  buildQrPlaceholderPayload,
  type RestaurantCoupon,
} from '../domain/coupon'

const day = 24 * 60 * 60 * 1000
const now = Date.now()

function seedCoupon(partial: Omit<RestaurantCoupon, 'qrPayload' | 'saved'>): RestaurantCoupon {
  return {
    ...partial,
    qrPayload: buildQrPlaceholderPayload(partial.couponId, partial.storeId),
    saved: false,
  }
}

export const mockCoupons: RestaurantCoupon[] = [
  seedCoupon({
    couponId: 'cpn-bj-luna-001',
    storeId: 'st_gangnam_kimchi',
    storeName: '강남 김치찌개 연구소',
    eventName: 'Luna BJ 라이브 시청 이벤트',
    oneAiEventId: 'oneai-evt-luna-2026',
    bjEventTag: 'BJ · Luna',
    validFrom: new Date(now - 2 * day).toISOString(),
    validUntil: new Date(now + 5 * day).toISOString(),
    status: 'unused',
    discountLabel: '음료 1잔 무료',
  }),
  seedCoupon({
    couponId: 'cpn-store-lunch-002',
    storeId: 'st_mapo_burger',
    storeName: '마포 버거 랩',
    eventName: '점심 타임 15% 할인',
    validFrom: new Date(now - 1 * day).toISOString(),
    validUntil: new Date(now + 2 * day).toISOString(),
    status: 'reserved',
    discountLabel: '15% 할인 (최대 5,000원)',
  }),
  seedCoupon({
    couponId: 'cpn-oneai-hub-003',
    storeId: 'st_gangnam_kimchi',
    storeName: '강남 김치찌개 연구소',
    eventName: 'OneAI Event Hub 주간 당첨',
    oneAiEventId: 'oneai-evt-hub-weekly',
    bjEventTag: 'OneAI Hub',
    validFrom: new Date(now - 7 * day).toISOString(),
    validUntil: new Date(now - 1 * day).toISOString(),
    status: 'unused',
    discountLabel: '사이드 메뉴 증정',
  }),
]

export function getMockCouponById(id: string): RestaurantCoupon | undefined {
  return mockCoupons.find((c) => c.couponId === id)
}
