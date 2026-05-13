import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { TrButton } from '../../components/TrButton'
import { mockOrders, orderStatusLabel } from '../../mock/orders'

export function StoreOrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      <MockBanner />
      {mockOrders.map((o) => (
        <Card key={o.id}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-tr-muted)]">{o.customerLabel}</p>
              <p className="mt-0.5 font-mono text-[11px] text-[var(--color-tr-muted)]">{o.id}</p>
              <p className="mt-2 text-sm font-medium">{orderStatusLabel[o.status]}</p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--color-tr-muted)]">
                {o.items.map((i) => (
                  <li key={i.menuId}>
                    {i.name} × {i.qty}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums">{o.totalKrw.toLocaleString()}원</p>
              <p className="text-[11px] text-[var(--color-tr-muted)] tabular-nums">₮ {o.totalUsdtHold}</p>
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
