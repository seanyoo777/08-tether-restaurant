/**
 * QR / 오프라인 이벤트 쿠폰 mock — 실제 QR 결제·실결제·포인트 정산 없음.
 */

/** 오프라인 쿠폰 표준 상태 */
export type OfflineCouponStatus = 'issued' | 'used' | 'expired' | 'canceled'

/** 하위 호환 legacy 상태 (UI·store 래퍼 유지) */
export type LegacyCouponStatus = 'unused' | 'reserved' | 'redeemed'

export type CouponStatus = OfflineCouponStatus | LegacyCouponStatus

export type RestaurantCoupon = {
  couponId: string
  storeId: string
  storeName: string
  eventName: string
  campaignId?: string
  oneAiEventId?: string
  bjEventTag?: string
  validFrom: string
  validUntil: string
  status: CouponStatus
  qrPayload: string
  discountLabel: string
  saved: boolean
}

export function buildQrPlaceholderPayload(couponId: string, storeId: string): string {
  return `tether-restaurant:offline-mock-coupon:v1:${couponId}@${storeId}`
}

export function isCouponPastExpiry(coupon: Pick<RestaurantCoupon, 'validUntil'>): boolean {
  return Date.now() > new Date(coupon.validUntil).getTime()
}

export function normalizeCouponStatus(status: CouponStatus): OfflineCouponStatus {
  switch (status) {
    case 'unused':
    case 'reserved':
    case 'issued':
      return 'issued'
    case 'redeemed':
    case 'used':
      return 'used'
    case 'expired':
      return 'expired'
    case 'canceled':
      return 'canceled'
  }
}

export function effectiveOfflineCouponStatus(
  coupon: RestaurantCoupon,
): OfflineCouponStatus {
  if (isCouponPastExpiry(coupon)) return 'expired'
  return normalizeCouponStatus(coupon.status)
}

/** @deprecated effectiveOfflineCouponStatus 사용 권장 */
export function effectiveCouponStatus(coupon: RestaurantCoupon): CouponStatus {
  return effectiveOfflineCouponStatus(coupon)
}

export const offlineCouponStatusLabel: Record<OfflineCouponStatus, string> = {
  issued: '발급됨',
  used: '사용됨 (mock)',
  expired: '만료',
  canceled: '취소됨',
}

export function displayCouponStatusLabel(coupon: RestaurantCoupon): string {
  return offlineCouponStatusLabel[effectiveOfflineCouponStatus(coupon)]
}

/** @deprecated displayCouponStatusLabel 사용 */
export const couponStatusLabel: Record<CouponStatus, string> = {
  issued: '발급됨',
  used: '사용됨 (mock)',
  expired: '만료',
  canceled: '취소됨',
  unused: '사용 가능 (legacy)',
  reserved: '사용 예약 (legacy)',
  redeemed: '사용 완료 (legacy)',
}

export function canTransitionOffline(
  from: OfflineCouponStatus,
  to: OfflineCouponStatus,
): boolean {
  if (from === 'expired' || from === 'used' || from === 'canceled') return false
  if (to === 'expired') return true
  if (from === 'issued' && (to === 'used' || to === 'canceled')) return true
  return false
}

export function transitionOfflineCouponStatus(
  coupon: RestaurantCoupon,
  next: OfflineCouponStatus,
): RestaurantCoupon | null {
  const current = effectiveOfflineCouponStatus(coupon)
  if (isCouponPastExpiry(coupon) || next === 'expired') {
    return { ...coupon, status: 'expired' }
  }
  if (!canTransitionOffline(current, next)) return null
  return { ...coupon, status: next }
}

/** legacy 전이 (unused→reserved→redeemed) — 내부적으로 offline으로 매핑 */
export function canTransitionCoupon(from: CouponStatus, to: CouponStatus): boolean {
  const f = normalizeCouponStatus(from)
  const t = normalizeCouponStatus(to)
  if (from === 'unused' && to === 'reserved') return true
  if (from === 'reserved' && to === 'redeemed') return true
  return canTransitionOffline(f, t)
}

export function transitionCouponStatus(
  coupon: RestaurantCoupon,
  next: CouponStatus,
): RestaurantCoupon | null {
  const offlineNext = normalizeCouponStatus(next)
  return transitionOfflineCouponStatus(coupon, offlineNext)
}

export function migrateStoredCouponStatus(status: CouponStatus): CouponStatus {
  switch (status) {
    case 'unused':
    case 'reserved':
      return 'issued'
    case 'redeemed':
      return 'used'
    default:
      return status
  }
}
