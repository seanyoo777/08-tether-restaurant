import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { useCartStore } from '../../store/cartStore'
import { useCheckoutDraftStore } from '../../store/checkoutDraftStore'
import { useLiveOrderStore } from '../../store/liveOrderStore'

const steps = ['주문 서명', 'USDT 임시 홀딩', '가게 알림', '배차(선택)'] as const

export function PaymentHoldPage() {
  const { draftId = '' } = useParams()
  const navigate = useNavigate()
  const draft = useCheckoutDraftStore((s) => s.get(draftId))
  const removeDraft = useCheckoutDraftStore((s) => s.remove)
  const clearCart = useCartStore((s) => s.clear)
  const upsertLive = useLiveOrderStore((s) => s.upsert)
  const [step, setStep] = useState(0)

  if (!draft) {
    return (
      <div className="p-4">
        <PageHeader title="결제" backTo="/checkout" />
        <p className="mt-4 text-sm text-[var(--color-tr-muted)]">유효한 주문 초안이 없습니다. 장바구니부터 다시 진행해 주세요.</p>
      </div>
    )
  }

  const advance = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1)
      return
    }
    const orderId = `ord_${Date.now()}`
    const tx = `mock-hold-trx-${Math.random().toString(16).slice(2, 10)}`
    upsertLive({
      id: orderId,
      storeId: draft.storeId,
      storeName: draft.storeName,
      status: 'paid_holding',
      totalKrw: draft.totalKrw,
      totalUsdtHold: draft.totalUsdt,
      holdingTxRef: tx,
      createdAt: new Date().toISOString(),
      items: draft.lines.map((l) => ({
        menuId: l.menuId,
        name: l.name,
        qty: l.qty,
        lineTotalKrw: l.lineTotalKrw,
        options: [],
      })),
      deliveryAddress: '서울시 강남구 테헤란로 123 (mock)',
      deliveryRequest: '문 앞에 놓아주세요 (mock)',
    })
    removeDraft(draftId)
    clearCart()
    navigate(`/orders/${orderId}`)
  }

  return (
    <div>
      <PageHeader title="USDT 홀딩" backTo="/checkout" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">{draft.storeName}</p>
          <p className="mt-2 text-lg font-bold tabular-nums">{draft.totalKrw.toLocaleString()}원</p>
          <p className="text-sm text-[var(--color-tr-muted)] tabular-nums">홀딩 USDT ≈ {draft.totalUsdt.toFixed(2)}</p>
        </Card>
        <Card>
          <ol className="space-y-3">
            {steps.map((label, i) => (
              <li key={label} className="flex gap-3 text-sm">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i <= step ? 'bg-[var(--color-tr-accent)] text-[#04120c]' : 'bg-[var(--color-tr-surface-2)] text-[var(--color-tr-muted)]'
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className={i <= step ? 'font-medium' : 'text-[var(--color-tr-muted)]'}>{label}</p>
                  {i === 1 ? (
                    <p className="mt-0.5 text-xs text-[var(--color-tr-muted)]">실제 스마트컨트랙트·지갑 연결 없음 — 버튼으로만 진행합니다.</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </Card>
        <TrButton className="w-full" onClick={advance}>
          {step < steps.length - 1 ? '다음 단계 (mock)' : '홀딩 완료 처리'}
        </TrButton>
      </div>
    </div>
  )
}
