import { Link } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'

const tasks = [
  { id: 't1', label: '강남 김치찌개 공방', sub: '픽업 · 1.2km', state: '배차됨' },
  { id: 't2', label: '마포 스모크 버거', sub: '배달 · 3.4km', state: '상차' },
] as const

export function RiderHomePage() {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col bg-[var(--color-tr-bg)]">
      <PageHeader title="라이더" backTo="/" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <p className="text-sm text-[var(--color-tr-muted)]">
            배차·내비·정산 연동 없음. 라이더 UX만 분리해 둔 화면입니다.
          </p>
        </Card>
        {tasks.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{t.label}</p>
                <p className="mt-1 text-xs text-[var(--color-tr-muted)]">{t.sub}</p>
              </div>
              <span className="rounded-full bg-[var(--color-tr-accent)]/15 px-2 py-1 text-[10px] font-medium text-[var(--color-tr-accent)]">
                {t.state}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <TrButton variant="ghost" className="flex-1 min-h-9 text-xs">
                지도 (mock)
              </TrButton>
              <TrButton className="flex-[2] min-h-9 text-xs">완료 처리</TrButton>
            </div>
          </Card>
        ))}
        <Link to="/orders/ord_demo_1" className="text-center text-xs text-[var(--color-tr-muted)] underline-offset-2 hover:underline">
          샘플 주문 상태 보기 →
        </Link>
      </div>
    </div>
  )
}
