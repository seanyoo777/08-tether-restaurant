import { useMemo } from 'react'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { TrButton } from '../../components/TrButton'
import { mergeMockAndLiveOrderSnapshots } from '../../domain/orderSnapshot'
import { mockOrders, orderStatusLabel } from '../../mock/orders'
import { useLiveOrderStore } from '../../store/liveOrderStore'

export function StoreOrdersPage() {
  const liveMap = useLiveOrderStore((s) => s.orders)

  const rows = useMemo(() => mergeMockAndLiveOrderSnapshots(mockOrders, liveMap), [liveMap])

  return (
    <div className="flex flex-col gap-4">
      <MockBanner />
      {rows.map((s) => (
        <Card key={s.id}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-tr-muted)]">
                고객 <span className="text-[var(--color-tr-text)]">{s.customerName ?? '—'}</span>
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-[var(--color-tr-muted)]">{s.id}</p>
              <p className="mt-1 text-[11px] text-[var(--color-tr-muted)]">{s.storeName}</p>
              <p className="mt-2 text-sm font-medium">{orderStatusLabel[s.orderStatus]}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-[var(--color-tr-muted)]">{s.address}</p>
              {s.memo ? (
                <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--color-tr-muted)]">요청: {s.memo}</p>
              ) : null}
              <ul className="mt-2 space-y-1 text-xs text-[var(--color-tr-muted)]">
                {s.items.map((i) => (
                  <li key={i.menuId}>
                    {i.name} × {i.qty}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums">{s.totalAmount.toLocaleString()}원</p>
              <p className="text-[11px] text-[var(--color-tr-muted)] tabular-nums">₮ {s.totalUsdtHold}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <TrButton variant="ghost" className="flex-1 min-h-9 text-xs">
              거절
            </TrButton>
            <TrButton className="flex-[2] min-h-9 text-xs">접수 (mock)</TrButton>
          </div>
        </Card>
      ))}
    </div>
  )
}
