import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { CouponSwipeDeck } from '../../components/coupon/CouponSwipeDeck'
import { EventCampaignCard } from '../../components/coupon/EventCampaignCard'
import { OneAiLogo } from '../../components/coupon/OneAiLogo'
import { mockEventCampaigns } from '../../mock/eventCampaigns'
import { useFeatureFlagsStore } from '../../store/featureFlagsStore'
import { useCouponWalletStore } from '../../store/couponWalletStore'

export function CouponWalletPage() {
  const navigate = useNavigate()
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const qrEnabled = useFeatureFlagsStore((s) => s.flags.qrCouponEnabled)
  const oneAiEnabled = useFeatureFlagsStore((s) => s.flags.oneAiEventEnabled)
  const coupons = useCouponWalletStore((s) => s.listCoupons())
  const issueFromCampaign = useCouponWalletStore((s) => s.issueFromCampaign)
  const saved = coupons.filter((c) => c.saved)

  const onClaimCampaign = (campaign: (typeof mockEventCampaigns)[0]) => {
    setClaimingId(campaign.campaignId)
    try {
      const c = issueFromCampaign(campaign)
      if (c) navigate(`/coupons/${c.couponId}`)
    } finally {
      setClaimingId(null)
    }
  }

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
          오프라인 쿠폰 mock · localStorage 저장 · 실제 결제/QR 결제/포인트 정산 없음
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
          <h3 className="text-sm font-semibold">오프라인 이벤트 캠페인</h3>
          <div className="mt-3 flex flex-col gap-3">
            {mockEventCampaigns.map((camp) => (
              <EventCampaignCard
                key={camp.campaignId}
                campaign={camp}
                claiming={claimingId === camp.campaignId}
                onClaim={onClaimCampaign}
              />
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-sm font-semibold">내 쿠폰 지갑</h3>
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
                  <Link
                    to={`/coupons/${c.couponId}`}
                    className="block rounded-lg border border-[var(--color-tr-border)] px-3 py-2 text-sm"
                  >
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
