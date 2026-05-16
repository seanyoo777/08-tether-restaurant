import { Link } from 'react-router-dom'

import { displayCouponStatusLabel, effectiveOfflineCouponStatus, type RestaurantCoupon } from '../../domain/coupon'
import { OneAiLogo } from './OneAiLogo'

const statusTone: Record<string, string> = {
  issued: 'border-[var(--color-tr-accent)]/40',
  used: 'border-[var(--color-tr-border-2)] opacity-80',
  expired: 'border-[var(--color-tr-border)] opacity-60',
  canceled: 'border-[var(--color-tr-danger)]/30 opacity-70',
}

type Props = {
  coupon: RestaurantCoupon
  compact?: boolean
}

export function CouponCard({ coupon, compact }: Props) {
  const status = effectiveOfflineCouponStatus(coupon)
  const until = new Date(coupon.validUntil).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Link
      to={`/coupons/${coupon.couponId}`}
      className={`block shrink-0 snap-center ${compact ? 'w-[280px]' : 'w-full'}`}
    >
      <article
        className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[var(--color-tr-surface-2)] to-[var(--color-tr-surface)] p-4 shadow-lg shadow-black/30 ${statusTone[status] ?? ''}`}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--color-tr-accent)]/10" />
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-tr-muted)]">
              {coupon.storeName}
            </p>
            <h3 className="mt-0.5 truncate text-base font-bold">{coupon.eventName}</h3>
          </div>
          {coupon.saved ? (
            <span className="shrink-0 text-[10px] font-medium text-[var(--color-tr-accent)]">저장됨</span>
          ) : null}
        </div>
        <p className="mt-2 text-sm font-semibold text-[var(--color-tr-accent)]">{coupon.discountLabel}</p>
        <p className="mt-1 text-[11px] text-[var(--color-tr-muted)]">사용 가능 ~ {until}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--color-tr-surface)] px-2 py-0.5 text-[10px] font-medium">
            {displayCouponStatusLabel(coupon)}
          </span>
          {coupon.bjEventTag ? (
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-300">
              {coupon.bjEventTag}
            </span>
          ) : null}
          {coupon.oneAiEventId ? <OneAiLogo compact /> : null}
        </div>
      </article>
    </Link>
  )
}
