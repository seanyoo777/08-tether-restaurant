import { Link } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { mockStores } from '../../mock/catalog'

export function CustomerHomePage() {
  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <div>
        <p className="text-xs font-medium tracking-wide text-[var(--color-tr-accent)]">테더식당</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">오늘 뭐 드실래요?</h2>
        <p className="mt-1 text-sm text-[var(--color-tr-muted)]">휴대폰으로 주문·USDT 홀딩까지 한 화면에서 (mock)</p>
      </div>
      <MockBanner />
      <div className="grid gap-3">
        {mockStores.map((s) => (
          <Link key={s.id} to={`/stores/${s.id}`} className="block">
            <Card className="transition hover:border-[var(--color-tr-accent)]/40">
              <div className="flex gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-tr-surface-2)] text-2xl">
                  {s.bannerEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-semibold">{s.name}</p>
                    <span className="shrink-0 text-xs text-[var(--color-tr-muted)]">{s.distanceKm}km</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-tr-muted)]">
                    {s.category} · ★{s.rating} ({s.reviewCount}) · 약 {s.etaMin}분
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[var(--color-tr-surface-2)] px-2 py-0.5 text-[10px] text-[var(--color-tr-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
