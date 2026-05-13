import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'

export function StoreAdminHomePage() {
  return (
    <div className="flex flex-col gap-4">
      <MockBanner />
      <div className="grid grid-cols-2 gap-3">
        {[
          { k: '오늘 주문', v: '18' },
          { k: '홀딩 중', v: '₮ 142.3' },
          { k: '조리 중', v: '4' },
          { k: '배달 중', v: '2' },
        ].map((x) => (
          <Card key={x.k} className="py-3">
            <p className="text-[11px] text-[var(--color-tr-muted)]">{x.k}</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{x.v}</p>
          </Card>
        ))}
      </div>
      <Card>
        <p className="text-sm leading-relaxed text-[var(--color-tr-muted)]">
          이 화면은 사장님 휴대폰에서 바로 쓰는 <span className="text-[var(--color-tr-text)]">가게 관리자 허브</span>입니다. 주문
          푸시·접수·조리 상태는 추후 실시간 채널로 연결하고, 지금은 mock 지표만 표시합니다.
        </p>
      </Card>
    </div>
  )
}
