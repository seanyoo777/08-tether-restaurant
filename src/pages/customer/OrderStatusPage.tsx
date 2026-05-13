import { Link, useParams } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { getOrderById, orderStatusLabel } from '../../mock/orders'
import { useLiveOrderStore } from '../../store/liveOrderStore'

export function OrderStatusPage() {
  const { orderId = '' } = useParams()
  const live = useLiveOrderStore((s) => s.get(orderId))
  const seeded = getOrderById(orderId)
  const order = live
    ? {
        id: live.id,
        storeName: live.storeName,
        status: live.status,
        totalKrw: live.totalKrw,
        totalUsdtHold: live.totalUsdtHold,
        holdingTxRef: live.holdingTxRef,
        items: [] as { name: string; qty: number }[],
      }
    : seeded
      ? {
          id: seeded.id,
          storeName: seeded.storeName,
          status: seeded.status,
          totalKrw: seeded.totalKrw,
          totalUsdtHold: seeded.totalUsdtHold,
          holdingTxRef: seeded.holdingTxRef,
          items: seeded.items.map((i) => ({ name: i.name, qty: i.qty })),
        }
      : null

  if (!order) {
    return (
      <div className="p-4">
        <PageHeader title="주문 상태" backTo="/" />
        <p className="mt-4 text-sm text-[var(--color-tr-muted)]">주문을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="주문 상태" backTo="/" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <Card>
          <p className="text-xs text-[var(--color-tr-muted)]">{order.storeName}</p>
          <p className="mt-1 font-mono text-xs text-[var(--color-tr-muted)]">#{order.id}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-sm text-[var(--color-tr-muted)]">상태</span>
            <span className="rounded-full bg-[var(--color-tr-accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--color-tr-accent)]">
              {orderStatusLabel[order.status]}
            </span>
          </div>
          <div className="mt-3 flex justify-between text-sm tabular-nums">
            <span className="text-[var(--color-tr-muted)]">금액</span>
            <span className="font-medium">{order.totalKrw.toLocaleString()}원</span>
          </div>
          <div className="mt-1 flex justify-between text-xs tabular-nums text-[var(--color-tr-muted)]">
            <span>USDT 홀딩</span>
            <span>{order.totalUsdtHold.toFixed(2)}</span>
          </div>
          {order.holdingTxRef ? (
            <p className="mt-2 break-all text-[11px] text-[var(--color-tr-muted)]">참조: {order.holdingTxRef}</p>
          ) : null}
        </Card>
        {order.items.length > 0 ? (
          <Card>
            <p className="text-xs font-medium text-[var(--color-tr-muted)]">주문 내역</p>
            <ul className="mt-2 space-y-1 text-sm">
              {order.items.map((i) => (
                <li key={`${i.name}-${i.qty}`} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">{i.name}</span>
                  <span className="tabular-nums text-[var(--color-tr-muted)]">×{i.qty}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          <Link to="/rider" className="block rounded-xl border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] px-4 py-3 text-center text-sm text-[var(--color-tr-muted)] hover:border-[var(--color-tr-border-2)]">
            라이더 화면 보기
          </Link>
          <Link to="/admin/store/orders" className="block rounded-xl border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] px-4 py-3 text-center text-sm text-[var(--color-tr-muted)] hover:border-[var(--color-tr-border-2)]">
            가게 주문 접수
          </Link>
        </div>
      </div>
    </div>
  )
}
