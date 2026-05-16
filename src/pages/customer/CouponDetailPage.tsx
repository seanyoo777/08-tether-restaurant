import { Link, useNavigate, useParams } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { QrPlaceholder } from '../../components/coupon/QrPlaceholder'
import { OneAiLogo } from '../../components/coupon/OneAiLogo'
import { couponStatusLabel, effectiveCouponStatus } from '../../domain/coupon'
import { useCouponWalletStore } from '../../store/couponWalletStore'

export function CouponDetailPage() {
  const { couponId } = useParams()
  const navigate = useNavigate()
  const coupon = useCouponWalletStore((s) => (couponId ? s.getCoupon(couponId) : undefined))
  const toggleSave = useCouponWalletStore((s) => s.toggleSave)
  const reserveMock = useCouponWalletStore((s) => s.reserveMock)
  const redeemMock = useCouponWalletStore((s) => s.redeemMock)

  if (!coupon) {
    return (
      <div>
        <PageHeader title="쿠폰" backTo="/coupons" />
        <div className="p-4">
          <p className="text-sm text-[var(--color-tr-muted)]">쿠폰을 찾을 수 없습니다.</p>
          <TrButton className="mt-4 w-full" onClick={() => navigate('/coupons')}>
            목록으로
          </TrButton>
        </div>
      </div>
    )
  }

  const status = effectiveCouponStatus(coupon)
  const canReserve = status === 'unused'
  const canRedeem = status === 'unused' || status === 'reserved'

  return (
    <div>
      <PageHeader title="QR 쿠폰" backTo="/coupons" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <div className="flex flex-col items-center py-2">
            <QrPlaceholder payload={coupon.qrPayload} couponId={coupon.couponId} size="lg" />
            <p className="mt-3 text-center text-xs text-[var(--color-tr-muted)]">
              직원이 이 QR을 스캔하면 mock 사용 처리됩니다. 실결제 아름.
            </p>
          </div>
        </Card>
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">{coupon.storeName}</p>
          <p className="mt-1 font-semibold">{coupon.eventName}</p>
          <p className="mt-1 text-sm text-[var(--color-tr-accent)]">{coupon.discountLabel}</p>
          {coupon.bjEventTag ? (
            <p className="mt-2 text-[10px] text-violet-300">{coupon.bjEventTag}</p>
          ) : null}
          {coupon.oneAiEventId ? (
            <div className="mt-2">
              <OneAiLogo compact />
            </div>
          ) : null}
        </Card>
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">상태</p>
          <p className="mt-1 font-semibold">{couponStatusLabel[status]}</p>
          <p className="mt-2 text-[11px] text-[var(--color-tr-muted)]">
            만료: {new Date(coupon.validUntil).toLocaleString('ko-KR')}
          </p>
        </Card>
        <div className="flex flex-col gap-2">
          <TrButton variant="ghost" className="w-full" onClick={() => toggleSave(coupon.couponId)}>
            {coupon.saved ? '저장 취소 (mock)' : '쿠폰 저장 (mock)'}
          </TrButton>
          {canReserve ? (
            <TrButton variant="ghost" className="w-full" onClick={() => reserveMock(coupon.couponId)}>
              사용 예약 (mock)
            </TrButton>
          ) : null}
          {canRedeem ? (
            <TrButton className="w-full" onClick={() => redeemMock(coupon.couponId)}>
              사용 처리 (mock)
            </TrButton>
          ) : null}
        </div>
        <Link to="/coupons/help" className="text-center text-xs text-[var(--color-tr-accent)]">
          사용 방법 보기
        </Link>
      </div>
    </div>
  )
}
