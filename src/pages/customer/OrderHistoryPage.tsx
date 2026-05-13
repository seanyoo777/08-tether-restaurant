import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { OrderCustomerBadge } from '../../components/OrderCustomerBadge'
import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { toCustomerPhase } from '../../domain/orderDisplay'
import { mergeMockAndLiveOrderSnapshots } from '../../domain/orderSnapshot'
import { mockOrders } from '../../mock/orders'
import { useLiveOrderStore } from '../../store/liveOrderStore'

export function OrderHistoryPage() {
  const liveMap = useLiveOrderStore((s) => s.orders)

  const rows = useMemo(() => {
    const snapshots = mergeMockAndLiveOrderSnapshots(mockOrders, liveMap)
    return snapshots.map((s) => ({
      id: s.id,
      storeName: s.storeName,
      totalAmount: s.totalAmount,
      createdAt: s.createdAt,
      phase: toCustomerPhase(s.orderStatus),
    }))
  }, [liveMap])

  return (
    <div>
      <PageHeader title="주문내역" backTo="/" />
      <div className="flex flex-col gap-3 p-4 pb-8">
        <MockBanner />
        {rows.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--color-tr-muted)]">아직 주문이 없습니다.</p>
          </Card>
        ) : (
          rows.map((r) => (
            <Link key={r.id} to={`/orders/${r.id}`} className="block">
              <Card className="transition hover:border-[var(--color-tr-accent)]/35">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <OrderCustomerBadge phase={r.phase} />
                    <p className="text-right text-base font-bold tabular-nums">{r.totalAmount.toLocaleString()}원</p>
                  </div>
                  <p className="truncate text-[15px] font-semibold leading-snug">{r.storeName}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[var(--color-tr-muted)]">
                    <span>
                      주문번호 <span className="font-mono text-[var(--color-tr-text)]">{r.id}</span>
                    </span>
                    <span className="text-[var(--color-tr-border-2)]">·</span>
                    <span>{new Date(r.createdAt).toLocaleString('ko-KR')}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
