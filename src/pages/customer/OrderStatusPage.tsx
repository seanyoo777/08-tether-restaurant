import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { OrderCustomerBadge } from '../../components/OrderCustomerBadge'
import { OrderProgressTrack } from '../../components/OrderProgressTrack'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { isReorderablePhase, toCustomerPhase } from '../../domain/orderDisplay'
import { liveOrderToSnapshot, mockOrderToSnapshot, type OrderSnapshot } from '../../domain/orderSnapshot'
import { getOrderById } from '../../mock/orders'
import { useCartStore } from '../../store/cartStore'
import { useLiveOrderStore } from '../../store/liveOrderStore'

export function OrderStatusPage() {
  const { orderId = '' } = useParams()
  const navigate = useNavigate()
  const live = useLiveOrderStore((s) => s.get(orderId))
  const seeded = getOrderById(orderId)
  const [supportOpen, setSupportOpen] = useState(false)
  const reorderFromOrder = useCartStore((s) => s.reorderFromOrder)

  const order = useMemo((): OrderSnapshot | null => {
    if (live) return liveOrderToSnapshot(live)
    if (seeded) return mockOrderToSnapshot(seeded)
    return null
  }, [live, seeded])

  const phase = order ? toCustomerPhase(order.orderStatus) : 'received'
  const canReorder = order ? isReorderablePhase(phase) : false

  if (!order) {
    return (
      <div className="p-4">
        <PageHeader title="주문 상세" backTo="/orders" />
        <p className="mt-4 text-sm text-[var(--color-tr-muted)]">주문을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="주문 상세" backTo="/orders" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />

        <Card>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-tr-muted)]">가게</p>
              <p className="mt-0.5 truncate text-lg font-bold">{order.storeName}</p>
            </div>
            <OrderCustomerBadge phase={phase} />
          </div>
          <div className="mt-3 space-y-1 text-[11px] text-[var(--color-tr-muted)]">
            <p>
              주문번호 <span className="font-mono text-[var(--color-tr-text)]">{order.id}</span>
            </p>
            <p>주문시간 {new Date(order.createdAt).toLocaleString('ko-KR')}</p>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium text-[var(--color-tr-muted)]">주문 진행</p>
          <div className="mt-4">
            <OrderProgressTrack phase={phase} />
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium text-[var(--color-tr-muted)]">주문 상품</p>
          {order.items.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--color-tr-muted)]">표시할 상품이 없습니다.</p>
          ) : (
            <ul className="mt-3 space-y-4">
              {order.items.map((item) => (
                <li
                  key={`${order.id}-${item.menuId}-${item.name}`}
                  className="border-b border-[var(--color-tr-border)] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 font-medium leading-snug">{item.name}</p>
                    <span className="shrink-0 text-sm text-[var(--color-tr-muted)]">×{item.qty}</span>
                  </div>
                  {(item.options?.length ?? 0) > 0 ? (
                    <ul className="mt-1.5 space-y-0.5 text-[11px] text-[var(--color-tr-muted)]">
                      {(item.options ?? []).map((opt) => (
                        <li key={`${item.menuId}-${opt}`}>· {opt}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-[11px] text-[var(--color-tr-muted)]">옵션 없음</p>
                  )}
                  <p className="mt-2 text-sm font-semibold tabular-nums">{item.lineTotalKrw.toLocaleString()}원</p>
                  <p className="text-[11px] text-[var(--color-tr-muted)] tabular-nums">
                    단가 {Math.round(item.lineTotalKrw / item.qty).toLocaleString()}원
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <p className="text-xs font-medium text-[var(--color-tr-muted)]">배송지</p>
          <p className="mt-2 text-sm leading-relaxed">{order.address}</p>
          <p className="mt-3 text-xs font-medium text-[var(--color-tr-muted)]">요청사항</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-tr-muted)]">
            {order.memo?.trim() ? order.memo : '요청사항 없음'}
          </p>
        </Card>

        <Card>
          <p className="text-xs font-medium text-[var(--color-tr-muted)]">결제 요약</p>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-[var(--color-tr-muted)]">상품 합계</span>
            <span className="font-semibold tabular-nums">{order.totalAmount.toLocaleString()}원</span>
          </div>
          <div className="mt-2 flex justify-between text-xs tabular-nums text-[var(--color-tr-muted)]">
            <span>USDT 홀딩</span>
            <span>{order.totalUsdtHold.toFixed(2)} USDT</span>
          </div>
          {order.holdingTxRef ? (
            <p className="mt-2 break-all text-[11px] text-[var(--color-tr-muted)]">참조 {order.holdingTxRef}</p>
          ) : null}
        </Card>

        {canReorder ? (
          <TrButton
            className="w-full"
            onClick={() => {
              reorderFromOrder({
                storeId: order.storeId,
                storeName: order.storeName,
                lines: order.items.map((i) => ({
                  menuId: i.menuId,
                  name: i.name,
                  qty: i.qty,
                  lineTotalKrw: i.lineTotalKrw,
                })),
              })
              navigate('/cart')
            }}
          >
            같은 메뉴 다시 담기
          </TrButton>
        ) : null}

        <TrButton variant="ghost" className="w-full" onClick={() => setSupportOpen(true)}>
          고객센터 문의
        </TrButton>

        <TrButton variant="ghost" className="w-full" onClick={() => navigate('/orders')}>
          주문내역으로
        </TrButton>
      </div>

      {supportOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-title"
          onClick={() => setSupportOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSupportOpen(false)
          }}
        >
          <div onClick={(e) => e.stopPropagation()} role="presentation">
            <Card className="max-w-sm shadow-2xl">
              <p id="support-title" className="text-sm font-semibold">
                고객센터 문의
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-tr-muted)]">
                현재는 테스트 버전입니다. 실제 서비스에서는 주문번호 기준으로 고객센터 문의가 연결됩니다.
              </p>
              <TrButton className="mt-4 w-full" onClick={() => setSupportOpen(false)}>
                확인
              </TrButton>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  )
}
