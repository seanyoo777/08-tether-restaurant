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
          <h3 className="text-sm font-semibold">쿠폰 사용 방법 (mock)</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-[var(--color-tr-muted)]">
            <li>쿠폰 지객에서 QR 화면을 열어 주세요.</li>
            <li>점주와 본사 관리자 화면에서 mock 사용 처리를 합니다.</li>
            <li>상태는 unused → reserved → redeemed(mock) 순으로 변합니다.</li>
          </ol>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold">QR mock 설명</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-tr-muted)]">
            화면의 QR 패턴은 시각적 placeholder입니다.
            실제 결제 또는 온체인 스캔 연동이 없습니다.
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold">실제 결제 아늄</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-tr-muted)]">
            테더식당 쿠폰은 할인 또는 증정용이며,
            USDT 홀딩 또는 카드 승인을 트리거하지 않습니다.
          </p>
        </Card>
      </div>
    </div>
  )
}
