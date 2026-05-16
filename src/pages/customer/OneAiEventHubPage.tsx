import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { OneAiLogo } from '../../components/coupon/OneAiLogo'
import { mockOneAiEventHubEntries } from '../../integration/oneaiEventHub'
import { useFeatureFlagsStore } from '../../store/featureFlagsStore'
import { useCouponWalletStore } from '../../store/couponWalletStore'

export function OneAiEventHubPage() {
  const enabled = useFeatureFlagsStore((s) => s.flags.oneAiEventEnabled)
  const claim = useCouponWalletStore((s) => s.claimFromOneAiEvent)
  const navigate = useNavigate()
  const [lastWin, setLastWin] = useState<string | null>(null)

  if (!enabled) {
    return (
      <div>
        <PageHeader title="OneAI Event" backTo="/coupons" />
        <div className="p-4 text-sm text-[var(--color-tr-muted)]">OneAI 이벤트가 비활성화되어 있습니다.</div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="OneAI Event Hub" backTo="/coupons" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <div className="flex items-center gap-2">
          <OneAiLogo />
          <p className="text-xs text-[var(--color-tr-muted)]">당첨 · 발급 mock</p>
        </div>
        {mockOneAiEventHubEntries.map((evt) => (
          <Card key={evt.eventId}>
            <p className="text-xs text-violet-300">{evt.bjTag}</p>
            <h3 className="mt-1 font-semibold">{evt.title}</h3>
            <p className="mt-1 text-sm text-[var(--color-tr-muted)]">{evt.subtitle}</p>
            <p className="mt-2 text-sm text-[var(--color-tr-accent)]">{evt.prizeLabel}</p>
            <p className="mt-1 text-[11px] text-[var(--color-tr-muted)]">{evt.storeName}</p>
            <TrButton
              className="mt-3 w-full"
              onClick={() => {
                const c = claim(evt)
                if (c) {
                  setLastWin(c.couponId)
                  navigate(`/coupons/${c.couponId}`)
                }
              }}
            >
              당첨 시뫠레이션 (mock)
            </TrButton>
          </Card>
        ))}
        {lastWin ? (
          <p className="text-center text-xs text-[var(--color-tr-muted)]">Last: {lastWin}</p>
        ) : null}
        <Link to="/coupons" className="text-center text-xs text-[var(--color-tr-accent)]">
          쿠폰 지객으로
        </Link>
      </div>
    </div>
  )
}
