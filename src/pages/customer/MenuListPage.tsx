import { useNavigate, useParams } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { getMenusForStore, getStoreById } from '../../mock/catalog'
import { useCartStore } from '../../store/cartStore'

export function MenuListPage() {
  const navigate = useNavigate()
  const { storeId = '' } = useParams()
  const store = getStoreById(storeId)
  const menus = getMenusForStore(storeId)
  const setStore = useCartStore((s) => s.setStore)
  const addLine = useCartStore((s) => s.addLine)

  if (!store) {
    return (
      <div className="p-4">
        <PageHeader title="가게 없음" backTo="/search" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="메뉴" backTo={`/stores/${store.id}`} />
      <div className="flex flex-col gap-3 p-4 pb-28">
        <MockBanner />
        {menus.map((m) => (
          <Card key={m.id}>
            <div className="flex gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-tr-surface-2)] text-xl">
                {m.imageEmoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{m.name}</p>
                  {m.soldOut ? (
                    <span className="shrink-0 rounded-md bg-[var(--color-tr-danger)]/15 px-2 py-0.5 text-[10px] text-[var(--color-tr-danger)]">
                      품절
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--color-tr-muted)]">{m.description}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold tabular-nums">{m.priceKrw.toLocaleString()}원</p>
                    <p className="text-[11px] text-[var(--color-tr-muted)]">≈ {m.usdtApprox.toFixed(1)} USDT (참고)</p>
                  </div>
                  <TrButton
                    variant="ghost"
                    disabled={m.soldOut}
                    className="min-h-9 px-3 text-xs"
                    onClick={() => {
                      setStore(store.id, store.name)
                      addLine({
                        menuId: m.id,
                        name: m.name,
                        unitKrw: m.priceKrw,
                        unitUsdt: m.usdtApprox,
                        qty: 1,
                      })
                    }}
                  >
                    담기
                  </TrButton>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="sticky bottom-0 border-t border-[var(--color-tr-border)] bg-[color-mix(in_oklab,var(--color-tr-bg)_92%,transparent)] p-3 backdrop-blur-md">
        <TrButton className="w-full" onClick={() => navigate('/cart')}>
          장바구니로
        </TrButton>
      </div>
    </div>
  )
}
