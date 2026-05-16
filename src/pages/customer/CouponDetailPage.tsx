import { Link, useNavigate, useParams } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { QrPlaceholder } from '../../components/coupon/QrPlaceholder'
import { OneAiLogo } from '../../components/coupon/OneAiLogo'
import {
  displayCouponStatusLabel,
  effectiveOfflineCouponStatus,
} from '../../domain/coupon'
import { evaluateCouponUseAttempt } from '../../domain/couponRiskGuard'
import { useCouponWalletStore } from '../../store/couponWalletStore'

export function CouponDetailPage() {
  const { couponId } = useParams()
  const navigate = useNavigate()
  const coupon = useCouponWalletStore((s) => (couponId ? s.getCoupon(couponId) : undefined))
  const toggleSave = useCouponWalletStore((s) => s.toggleSave)
  const applyUsedMock = useCouponWalletStore((s) => s.applyUsedMock)
  const attemptUseWithRiskGuard = useCouponWalletStore((s) => s.attemptUseWithRiskGuard)
  const applyCanceledMock = useCouponWalletStore((s) => s.applyCanceledMock)

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

  const offline = effectiveOfflineCouponStatus(coupon)
  const canUse = offline === 'issued'
  const canCancel = offline === 'issued'
  const useRisk = evaluateCouponUseAttempt(coupon)
  const riskTone =
    useRisk.severity === 'FAIL'
      ? 'border-red-500/40 bg-red-500/10 text-red-300'
      : useRisk.severity === 'WARN'
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
        : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'

  return (
    <div>
      <PageHeader title="QR 쿠폰" backTo="/coupons" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <div className="flex flex-col items-center py-2">
            <QrPlaceholder payload={coupon.qrPayload} couponId={coupon.couponId} size="lg" />
            <p className="mt-3 text-center text-xs text-[var(--color-tr-muted)]">
              오프라인 QR placeholder · 실제 QR 결제·포인트 정산 없음
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
          <p className="mt-1 font-semibold">{displayCouponStatusLabel(coupon)}</p>
          <p className="mt-2 text-[11px] text-[var(--color-tr-muted)]">
            만료: {new Date(coupon.validUntil).toLocaleString('ko-KR')}
          </p>
        </Card>
        <Card className={riskTone}>
          <p className="text-xs font-semibold">Risk Guard (mock)</p>
          <p className="mt-1 text-sm">
            {useRisk.severity} — {useRisk.message}
          </p>
        </Card>
        <div className="flex flex-col gap-2">
          <TrButton variant="ghost" className="w-full" onClick={() => toggleSave(coupon.couponId)}>
            {coupon.saved ? '저장 취소 (mock)' : '쿠폰 저장 (mock · localStorage)'}
          </TrButton>
          {canUse ? (
            <TrButton className="w-full" onClick={() => applyUsedMock(coupon.couponId)}>
              사용 처리 (mock · used)
            </TrButton>
          ) : (
            <TrButton
              variant="ghost"
              className="w-full"
              onClick={() => attemptUseWithRiskGuard(coupon.couponId)}
            >
              사용 시도 (Risk Guard · {useRisk.severity})
            </TrButton>
          )}
          {canCancel ? (
            <TrButton variant="danger" className="w-full" onClick={() => applyCanceledMock(coupon.couponId)}>
              취소 (mock · canceled)
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
