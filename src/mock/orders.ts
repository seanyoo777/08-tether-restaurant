export type OrderStatus =
  | 'pending_payment'
  | 'paid_holding'
  | 'accepted'
  | 'cooking'
  | 'ready_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type MockOrder = {
  id: string
  storeId: string
  storeName: string
  customerLabel: string
  items: { menuId: string; name: string; qty: number; lineTotalKrw: number }[]
  totalKrw: number
  totalUsdtHold: number
  status: OrderStatus
  createdAt: string
  holdingTxRef: string | null
}

export const mockOrders: MockOrder[] = [
  {
    id: 'ord_demo_1',
    storeId: 'st_gangnam_kimchi',
    storeName: '강남 김치찌개 공방',
    customerLabel: '고객 #4821',
    items: [
      { menuId: 'm1', name: '들깨 김치찌개', qty: 1, lineTotalKrw: 12000 },
      { menuId: 'm2', name: '제육덮밥', qty: 2, lineTotalKrw: 22000 },
    ],
    totalKrw: 34000,
    totalUsdtHold: 23.8,
    status: 'paid_holding',
    createdAt: new Date().toISOString(),
    holdingTxRef: 'mock-hold-trx-9f2a…c41',
  },
  {
    id: 'ord_demo_2',
    storeId: 'st_mapo_burger',
    storeName: '마포 스모크 버거',
    customerLabel: '고객 #9012',
    items: [{ menuId: 'm3', name: '스모크 베이컨 세트', qty: 1, lineTotalKrw: 15000 }],
    totalKrw: 15000,
    totalUsdtHold: 10.5,
    status: 'cooking',
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    holdingTxRef: 'mock-hold-trx-1b88…90d',
  },
]

export function getOrderById(id: string): MockOrder | undefined {
  return mockOrders.find((o) => o.id === id)
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending_payment: '결제 대기',
  paid_holding: 'USDT 홀딩 완료',
  accepted: '접수 완료',
  cooking: '조리 중',
  ready_pickup: '픽업 준비',
  out_for_delivery: '배달 중',
  delivered: '배달 완료',
  cancelled: '취소됨',
}
