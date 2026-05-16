import { Link } from 'react-router-dom'

import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { CouponSwipeDeck } from '../../components/coupon/CouponSwipeDeck'
import { OneAiLogo } from '../../components/coupon/OneAiLogo'
import { useFeatureFlagsStore } from '../../store/featureFlagsStore'
import { useCouponWalletStore } from '../../store/couponWalletStore'

export function CouponWalletPage() {
  const qrEnabled = useFeatureFlagsStore((s) => s.flags.qrCouponEnabled)
  const oneAiEnabled = useFeatureFlagsStore((s) => s.flags.oneAiEventEnabled)
  const coupons = useCouponWalletStore((s) => s.listCoupons())
  const saved = coupons.filter((c) => c.saved)

  if (!qrEnabled) {
    return (
      <div>
        <PageHeader title="내 쿠폰" backTo="/" />
        <div className="p-4">
          <MockBanner />
          <p className="mt-4 text-sm text-[var(--color-tr-muted)]">
            QR 쿠폰 기능이 비활성화되어 있습니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="내 쿠폰" backTo="/" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <p className="text-xs text-[var(--color-tr-muted)]">
          모바일 wallet 스타일 · QR mock · 실제 결제 아름
        </p>
        {oneAiEnabled ? (
          <Link
            to="/events/oneai"
            className="flex items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/5 px-3 py-3"
          >
            <OneAiLogo />
            <span className="text-xs text-violet-300">Event Hub</span>
          </Link>
        ) : null}
        <section>
          <h3 className="text-sm font-semibold">쿠폰 목록</h3>
          <div className="mt-3">
            <CouponSwipeDeck coupons={coupons} />
          </div>
        </section>
        {saved.length > 0 ? (
          <section>
            <h3 className="text-sm font-semibold">저장한 쿠폰</h3>
            <ul className="mt-2 space-y-2">
              {saved.map((c) => (
                <li key={c.couponId}>
                  <Link to={`/coupons/${c.couponId}`} className="block rounded-lg border border-[var(--color-tr-border)] px-3 py-2 text-sm">
                    {c.storeName} · {c.discountLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <Link
          to="/coupons/help"
          className="flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] text-sm font-semibold"
        >
          Help Center
        </Link>
      </div>
    </div>
  )
}
