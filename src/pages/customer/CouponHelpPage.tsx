import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'

export function CouponHelpPage() {
  return (
    <div>
      <PageHeader title="Help Center" backTo="/coupons" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <h3 className="text-sm font-semibold">오프라인 쿠폰 사용 (mock)</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-[var(--color-tr-muted)]">
            <li>캠페인 카드에서 쿠폰을 발급받거나 지갑의 쿠폰을 선택합니다.</li>
            <li>QR placeholder 화면을 매장에서 제시합니다.</li>
            <li>상태: issued → used (mock) 또는 issued → canceled.</li>
          </ol>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold">QR mock · localStorage</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-tr-muted)]">
            QR은 시각적 placeholder이며 실제 QR 결제가 아닙니다. 쿠폰 지갑은 브라우저
            localStorage에 저장됩니다 (키: tether-restaurant.offline-coupon-wallet.v1).
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold">실제 결제·정산 없음</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-tr-muted)]">
            쿠폰 사용은 mock 상태 변경만 수행합니다. 실제 결제, QR 결제, 포인트 정산, 외부 API 호출은
            없습니다.
          </p>
        </Card>
      </div>
    </div>
  )
}
