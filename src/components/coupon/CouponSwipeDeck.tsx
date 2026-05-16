import type { RestaurantCoupon } from '../../domain/coupon'
import { CouponCard } from './CouponCard'

type Props = {
  coupons: RestaurantCoupon[]
}

/** 모바일 가로 스와이프 쿠폰 덱 (snap) */
export function CouponSwipeDeck({ coupons }: Props) {
  if (coupons.length === 0) {
    return <p className="text-sm text-[var(--color-tr-muted)]">표시할 쿠폰이 없습니다.</p>
  }

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scroll-smooth">
      {coupons.map((c) => (
        <CouponCard key={c.couponId} coupon={c} compact />
      ))}
    </div>
  )
}
