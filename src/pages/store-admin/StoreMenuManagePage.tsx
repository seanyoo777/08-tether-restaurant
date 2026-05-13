import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { TrButton } from '../../components/TrButton'
import { mockMenus } from '../../mock/catalog'

export function StoreMenuManagePage() {
  const mine = mockMenus.filter((m) => m.storeId === 'st_gangnam_kimchi')
  return (
    <div className="flex flex-col gap-4">
      <MockBanner />
      <p className="text-sm text-[var(--color-tr-muted)]">데모 가게 기준 목록입니다. 저장/동기화 없음.</p>
      {mine.map((m) => (
        <Card key={m.id}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">
                {m.imageEmoji} {m.name}
              </p>
              <p className="mt-1 text-xs text-[var(--color-tr-muted)]">{m.description}</p>
              <p className="mt-2 text-sm font-semibold tabular-nums">{m.priceKrw.toLocaleString()}원</p>
            </div>
            <TrButton variant="ghost" className="min-h-9 shrink-0 px-3 text-xs">
              수정
            </TrButton>
          </div>
        </Card>
      ))}
      <TrButton variant="ghost" className="w-full">
        + 메뉴 추가 (mock)
      </TrButton>
    </div>
  )
}
