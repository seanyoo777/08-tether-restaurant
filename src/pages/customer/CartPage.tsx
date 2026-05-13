import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { computeCartTotals, useCartStore } from '../../store/cartStore'

export function CartPage() {
  const navigate = useNavigate()
  const lines = useCartStore((s) => s.lines)
  const storeName = useCartStore((s) => s.storeName)
  const setQty = useCartStore((s) => s.setQty)
  const clear = useCartStore((s) => s.clear)
  const t = useMemo(() => computeCartTotals(lines), [lines])

  return (
    <div>
      <PageHeader title="장바구니" backTo="/" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        {!storeName || lines.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--color-tr-muted)]">담긴 메뉴가 없습니다. 가게에서 메뉴를 담아 주세요.</p>
            <TrButton variant="ghost" className="mt-3 w-full" onClick={() => navigate('/search')}>
              가게 찾기
            </TrButton>
          </Card>
        ) : (
          <>
            <p className="text-xs text-[var(--color-tr-muted)]">{storeName}</p>
            {lines.map((l) => (
              <Card key={l.menuId}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{l.name}</p>
                    <p className="text-xs text-[var(--color-tr-muted)] tabular-nums">
                      {(l.unitKrw * l.qty).toLocaleString()}원 · ≈ {(l.unitUsdt * l.qty).toFixed(1)} USDT
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrButton variant="ghost" className="h-9 min-h-0 w-9 px-0" onClick={() => setQty(l.menuId, l.qty - 1)}>
                      −
                    </TrButton>
                    <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                    <TrButton variant="ghost" className="h-9 min-h-0 w-9 px-0" onClick={() => setQty(l.menuId, l.qty + 1)}>
                      +
                    </TrButton>
                  </div>
                </div>
              </Card>
            ))}
            <Card>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-tr-muted)]">합계</span>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">{t.krw.toLocaleString()}원</p>
                  <p className="text-xs text-[var(--color-tr-muted)] tabular-nums">USDT 홀딩 예상 ≈ {t.usdt.toFixed(2)}</p>
                </div>
              </div>
            </Card>
            <div className="flex gap-2">
              <TrButton variant="ghost" className="w-full flex-1" onClick={() => clear()}>
                비우기
              </TrButton>
              <TrButton className="w-full flex-[2]" onClick={() => navigate('/checkout')}>
                주문 확인으로
              </TrButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
