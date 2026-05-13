export type SettlementRow = {
  id: string
  period: string
  storeName: string
  grossUsdt: number
  feeUsdt: number
  netUsdt: number
  status: 'scheduled' | 'paid' | 'on_hold'
}

export const mockSettlementRows: SettlementRow[] = [
  {
    id: 's1',
    period: '2026-05-01 ~ 2026-05-07',
    storeName: '강남 김치찌개 공방',
    grossUsdt: 420.5,
    feeUsdt: 21.02,
    netUsdt: 399.48,
    status: 'scheduled',
  },
  {
    id: 's2',
    period: '2026-05-01 ~ 2026-05-07',
    storeName: '마포 스모크 버거',
    grossUsdt: 310.0,
    feeUsdt: 15.5,
    netUsdt: 294.5,
    status: 'paid',
  },
]
