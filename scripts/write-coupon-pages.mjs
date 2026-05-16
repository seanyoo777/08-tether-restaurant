import { writeFileSync } from 'node:fs'

const D = 'div'

writeFileSync(
  'src/pages/customer/CouponWalletPage.tsx',
  `import { Link } from 'react-router-dom'

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
      <${D}>
        <PageHeader title="\uB0B4 \uCFE0\uD3F0" backTo="/" />
        <${D} className="p-4">
          <MockBanner />
          <p className="mt-4 text-sm text-[var(--color-tr-muted)]">
            QR \uCFE0\uD3F0 \uAE30\uB2A5\uC774 \uBE44\uD65C\uC131\uD654\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.
          </p>
        </${D}>
      </${D}>
    )
  }

  return (
    <${D}>
      <PageHeader title="\uB0B4 \uCFE0\uD3F0" backTo="/" />
      <${D} className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <p className="text-xs text-[var(--color-tr-muted)]">
          \uBAA8\uBC14\uC77C wallet \uC2A4\uD0C0\uC77C \u00b7 QR mock \u00b7 \uC2E4\uC81C \uACB0\uC81C \uC544\uB984
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
          <h3 className="text-sm font-semibold">\uCFE0\uD3F0 \uBAA9\uB85D</h3>
          <${D} className="mt-3">
            <CouponSwipeDeck coupons={coupons} />
          </${D}>
        </section>
        {saved.length > 0 ? (
          <section>
            <h3 className="text-sm font-semibold">\uC800\uC7A5\uD55C \uCFE0\uD3F0</h3>
            <ul className="mt-2 space-y-2">
              {saved.map((c) => (
                <li key={c.couponId}>
                  <Link to={\`/coupons/\${c.couponId}\`} className="block rounded-lg border border-[var(--color-tr-border)] px-3 py-2 text-sm">
                    {c.storeName} \u00b7 {c.discountLabel}
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
      </${D}>
    </${D}>
  )
}
`,
)

writeFileSync(
  'src/pages/customer/CouponDetailPage.tsx',
  `import { Link, useNavigate, useParams } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { CouponCard } from '../../components/coupon/CouponCard'
import { QrPlaceholder } from '../../components/coupon/QrPlaceholder'
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
      <${D}>
        <PageHeader title="\uCFE0\uD3F0" backTo="/coupons" />
        <${D} className="p-4">
          <p className="text-sm text-[var(--color-tr-muted)]">\uCFE0\uD3F0\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</p>
          <TrButton className="mt-4 w-full" onClick={() => navigate('/coupons')}>
            \uBAA9\uB85D\uC73C\uB85C
          </TrButton>
        </${D}>
      </${D}>
    )
  }

  const status = effectiveCouponStatus(coupon)
  const canReserve = status === 'unused'
  const canRedeem = status === 'unused' || status === 'reserved'

  return (
    <${D}>
      <PageHeader title="QR \uCFE0\uD3F0" backTo="/coupons" />
      <${D} className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <${D} className="flex flex-col items-center py-2">
            <QrPlaceholder payload={coupon.qrPayload} couponId={coupon.couponId} size="lg" />
            <p className="mt-3 text-center text-xs text-[var(--color-tr-muted)]">
              \uC9C1\uC6D0\uC774 \uC774 QR\uC744 \uC2A4\uCE94\uD558\uBA74 mock \uC0AC\uC6A9 \uCC98\uB9AC\uB429\uB2C8\uB2E4. \uC2E4\uACB0\uC81C \uC544\uB984.
            </p>
          </${D}>
        </Card>
        <CouponCard coupon={coupon} />
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">\uC0C1\uD0DC</p>
          <p className="mt-1 font-semibold">{couponStatusLabel[status]}</p>
          <p className="mt-2 text-[11px] text-[var(--color-tr-muted)]">
            \uB9CC\uB8CC: {new Date(coupon.validUntil).toLocaleString('ko-KR')}
          </p>
        </Card>
        <${D} className="flex flex-col gap-2">
          <TrButton variant="ghost" className="w-full" onClick={() => toggleSave(coupon.couponId)}>
            {coupon.saved ? '\uC800\uC7A5 \uCDE8\uC18C (mock)' : '\uCFE0\uD3F0 \uC800\uC7A5 (mock)'}
          </TrButton>
          {canReserve ? (
            <TrButton variant="ghost" className="w-full" onClick={() => reserveMock(coupon.couponId)}>
              \uC0AC\uC6A9 \uC608\uC57D (mock)
            </TrButton>
          ) : null}
          {canRedeem ? (
            <TrButton className="w-full" onClick={() => redeemMock(coupon.couponId)}>
              \uC0AC\uC6A9 \uCC98\uB9AC (mock)
            </TrButton>
          ) : null}
        </${D}>
        <Link to="/coupons/help" className="text-center text-xs text-[var(--color-tr-accent)]">
          \uC0AC\uC6A9 \uBC29\uBC95 \uBCF4\uAE30
        </Link>
      </${D}>
    </${D}>
  )
}
`,
)

writeFileSync(
  'src/pages/customer/CouponHelpPage.tsx',
  `import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'

export function CouponHelpPage() {
  return (
    <${D}>
      <PageHeader title="Help Center" backTo="/coupons" />
      <${D} className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <h3 className="text-sm font-semibold">\uCFE0\uD3F0 \uC0AC\uC6A9 \uBC29\uBC95 (mock)</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-[var(--color-tr-muted)]">
            <li>\uCFE0\uD3F0 \uC9C0\uAC1D\uC5D0\uC11C QR \uD654\uBA74\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.</li>
            <li>\uC810\uC8FC\uC640 \uBCF8\uC0AC \uAD00\uB9AC\uC790 \uD654\uBA74\uC5D0\uC11C mock \uC0AC\uC6A9 \uCC98\uB9AC\uB97C \uD569\uB2C8\uB2E4.</li>
            <li>\uC0C1\uD0DC\uB294 unused \u2192 reserved \u2192 redeemed(mock) \uC21C\uC73C\uB85C \uBCC0\uD569\uB2C8\uB2E4.</li>
          </ol>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold">QR mock \uC124\uBA85</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-tr-muted)]">
            \uD654\uBA74\uC758 QR \uD328\uD134\uC740 \uC2DC\uAC01\uC801 placeholder\uC785\uB2C8\uB2E4.
            \uC2E4\uC81C \uACB0\uC81C \uB610\uB294 \uC628\uCCB4\uC778 \uC2A4\uCE94 \uC5F0\uB3D9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold">\uC2E4\uC81C \uACB0\uC81C \uC544\uB284</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-tr-muted)]">
            \uD14C\uB354\uC2DD\uB2F9 \uCFE0\uD3F0\uC740 \uD560\uC778 \uB610\uB294 \uC99D\uC815\uC6A9\uC774\uBA70,
            USDT \uD640\uB529 \uB610\uB294 \uCE74\uB4DC \uC2B9\uC778\uC744 \uD2B8\uB9AC\uAC70\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.
          </p>
        </Card>
      </${D}>
    </${D}>
  )
}
`,
)

writeFileSync(
  'src/pages/customer/OneAiEventHubPage.tsx',
  `import { useState } from 'react'
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
      <${D}>
        <PageHeader title="OneAI Event" backTo="/coupons" />
        <${D} className="p-4 text-sm text-[var(--color-tr-muted)]">OneAI \uC774\uBCA4\uD2B8\uAC00 \uBE44\uD65C\uC131\uD654\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.</${D}>
      </${D}>
    )
  }

  return (
    <${D}>
      <PageHeader title="OneAI Event Hub" backTo="/coupons" />
      <${D} className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <${D} className="flex items-center gap-2">
          <OneAiLogo />
          <p className="text-xs text-[var(--color-tr-muted)]">\uB2F9\uCCA8 \u00b7 \uBC1C\uAE09 mock</p>
        </${D}>
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
                  navigate(\`/coupons/\${c.couponId}\`)
                }
              }}
            >
              \uB2F9\uCCA8 \uC2DC\uBAE0\uB808\uC774\uC158 (mock)
            </TrButton>
          </Card>
        ))}
        {lastWin ? (
          <p className="text-center text-xs text-[var(--color-tr-muted)]">Last: {lastWin}</p>
        ) : null}
        <Link to="/coupons" className="text-center text-xs text-[var(--color-tr-accent)]">
          \uCFE0\uD3F0 \uC9C0\uAC1D\uC73C\uB85C
        </Link>
      </${D}>
    </${D}>
  )
}
`,
)

console.log('wrote coupon pages')
