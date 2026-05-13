import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { DEFAULT_ACTIVE_RAIL, type PaymentRail } from '../../integration/productContext'
import { computeCartTotals, useCartStore } from '../../store/cartStore'
import { useCheckoutDraftStore } from '../../store/checkoutDraftStore'

const futureRails: { id: PaymentRail; label: string; disabled: boolean }[] = [
  { id: 'usdt_hold', label: 'USDT 임시 홀딩 (기본)', disabled: false },
  { id: 'card', label: '카드', disabled: true },
  { id: 'apple_pay', label: 'Apple Pay', disabled: true },
  { id: 'samsung_pay', label: 'Samsung Pay', disabled: true },
  { id: 'kakao_pay', label: '카카오페이', disabled: true },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const lines = useCartStore((s) => s.lines)
  const storeId = useCartStore((s) => s.storeId)
  const storeName = useCartStore((s) => s.storeName)
  const totals = useMemo(() => computeCartTotals(lines), [lines])
  const putDraft = useCheckoutDraftStore((s) => s.put)

  const disabled = !storeId || !storeName || lines.length === 0

  return (
    <div>
      <PageHeader title="주문 확인" backTo="/cart" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <p className="text-xs font-medium text-[var(--color-tr-muted)]">결제 수단 (확장 슬롯)</p>
          <div className="mt-2 grid gap-2">
            {futureRails.map((r) => (
              <div
                key={r.id}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                  r.id === DEFAULT_ACTIVE_RAIL
                    ? 'border-[var(--color-tr-accent)]/50 bg-[var(--color-tr-accent)]/10'
                    : 'border-[var(--color-tr-border)] opacity-60'
                }`}
              >
                <span>{r.label}</span>
                {r.disabled ? <span className="text-[10px] text-[var(--color-tr-muted)]">추후</span> : <span className="text-[var(--color-tr-accent)]">●</span>}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">{storeName}</p>
          <ul className="mt-2 space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.menuId} className="flex justify-between gap-2 tabular-nums">
                <span className="min-w-0 truncate">
                  {l.name} × {l.qty}
                </span>
                <span>{(l.unitKrw * l.qty).toLocaleString()}원</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-[var(--color-tr-border)] pt-3 text-sm font-semibold tabular-nums">
            <span>합계</span>
            <span>{totals.krw.toLocaleString()}원</span>
          </div>
          <p className="mt-1 text-right text-xs text-[var(--color-tr-muted)] tabular-nums">
            USDT 홀딩 예상 {totals.usdt.toFixed(2)} (mock 환산)
          </p>
        </Card>
        <TrButton
          className="w-full"
          disabled={disabled}
          onClick={() => {
            if (!storeId || !storeName) return
            const draftId = `draft_${Date.now()}`
            putDraft({
              id: draftId,
              storeId,
              storeName,
              lines: lines.map((l) => ({
                menuId: l.menuId,
                name: l.name,
                qty: l.qty,
                lineTotalKrw: l.unitKrw * l.qty,
              })),
              totalKrw: totals.krw,
              totalUsdt: totals.usdt,
            })
            navigate(`/pay/${draftId}`)
          }}
        >
          결제 · USDT 홀딩 화면으로
        </TrButton>
      </div>
    </div>
  )
}
