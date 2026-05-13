import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { mockSettlementRows } from '../../mock/settlement'

export function StoreSettlementPage() {
  const rows = mockSettlementRows.filter((r) => r.storeName.includes('김치'))
  return (
    <div className="flex flex-col gap-4">
      <MockBanner />
      <Card>
        <p className="text-sm text-[var(--color-tr-muted)]">
          USDT 홀딩 → 배달/픽업 완료 후 <span className="text-[var(--color-tr-text)]">정산 예정</span>으로 이동합니다. 실제
          분배 로직은 연결하지 않았습니다.
        </p>
      </Card>
      {rows.map((r) => (
        <Card key={r.id}>
          <p className="text-xs text-[var(--color-tr-muted)]">{r.period}</p>
          <p className="mt-1 font-medium">{r.storeName}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-[var(--color-tr-muted)]">총액</p>
              <p className="mt-0.5 font-semibold tabular-nums">₮{r.grossUsdt}</p>
            </div>
            <div>
              <p className="text-[var(--color-tr-muted)]">수수료</p>
              <p className="mt-0.5 font-semibold tabular-nums">₮{r.feeUsdt}</p>
            </div>
            <div>
              <p className="text-[var(--color-tr-muted)]">지급</p>
              <p className="mt-0.5 font-semibold tabular-nums">₮{r.netUsdt}</p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-[var(--color-tr-accent)]">
            상태: {r.status === 'paid' ? '지급 완료' : r.status === 'scheduled' ? '예정' : '보류'}
          </p>
        </Card>
      ))}
    </div>
  )
}
