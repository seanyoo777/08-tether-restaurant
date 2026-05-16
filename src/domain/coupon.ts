/**
 * QR / 이벤트 쿠폰 mock 도메인 — 실제 QR 결제·실결제 없음.
 */

export type CouponStatus = 'unused' | 'reserved' | 'redeemed' | 'expired'

export type RestaurantCoupon = {
  couponId: string
  storeId: string
  storeName: string
  eventName: string
  /** OneAI Event Hub 연동용 mock 참조 */
  oneAiEventId?: string
  bjEventTag?: string
  validFrom: string
  validUntil: string
  status: CouponStatus
  /** QR 스캔 mock 페이로드 (결제 아님) */
  qrPayload: string
  discountLabel: string
  saved: boolean
}

export function buildQrPlaceholderPayload(couponId: string, storeId: string): string {
  return `tether-restaurant:mock-coupon:v1:${couponId}@${storeId}`
}

export function isCouponPastExpiry(coupon: Pick<RestaurantCoupon, 'validUntil'>): boolean {
  return Date.now() > new Date(coupon.validUntil).getTime()
}

/** 만료 시각이 지났으면 expired 로 표시 (저장값과 병합) */
export function effectiveCouponStatus(coupon: RestaurantCoupon): CouponStatus {
  if (isCouponPastExpiry(coupon)) return 'expired'
  return coupon.status
}

export function canTransitionCoupon(from: CouponStatus, to: CouponStatus): boolean {
  if (from === 'expired' || from === 'redeemed') return false
  if (to === 'expired') return true
  if (from === 'unused' && to === 'reserved') return true
  if (from === 'reserved' && to === 'redeemed') return true
  return false
}

export function transitionCouponStatus(
  coupon: RestaurantCoupon,
  next: CouponStatus,
): RestaurantCoupon | null {
  const current = effectiveCouponStatus(coupon)
  if (isCouponPastExpiry(coupon) || next === 'expired') {
    return { ...coupon, status: 'expired' }
  }
  if (current === 'expired' || current === 'redeemed') return null
  if (!canTransitionCoupon(current, next)) return null
  return { ...coupon, status: next }
}

export const couponStatusLabel: Record<CouponStatus, string> = {
  unused: '사용 가능',
  reserved: '사용 예약',
  redeemed: '사용 완료 (mock)',
  expired: '만료',
}
