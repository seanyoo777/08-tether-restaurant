import { Link } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { useFeatureFlagsStore } from '../../store/featureFlagsStore'

export function MyProfilePage() {
  const qrCoupon = useFeatureFlagsStore((s) => s.flags.qrCouponEnabled)
  return (
    <div>
      <PageHeader title="내 정보" backTo="/" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">닉네임</p>
          <p className="mt-1 font-medium">테더식당 고객 (mock)</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">연락처</p>
          <p className="mt-1 font-medium tabular-nums">010-****-4821</p>
        </Card>
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">앱</p>
          <p className="mt-1 text-sm">테더식당 고객 앱 · MVP</p>
        </Card>
        {qrCoupon ? (
          <Link
            to="/coupons"
            className="flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-tr-accent)]/40 bg-[var(--color-tr-accent)]/10 text-sm font-semibold text-[var(--color-tr-accent)]"
          >
            QR 쿠폰 지갑
          </Link>
        ) : null}
      </div>
    </div>
  )
}
