export type OrderStatus =
  | 'pending_payment'
  | 'paid_holding'
  | 'accepted'
  | 'cooking'
  | 'ready_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type OrderLineItem = {
  menuId: string
  name: string
  qty: number
  lineTotalKrw: number
  /** 비어 있으면 옵션 없음 */
  options?: string[]
}

export type MockOrder = {
  id: string
  storeId: string
  storeName: string
  customerLabel: string
  items: OrderLineItem[]
  totalKrw: number
  totalUsdtHold: number
  status: OrderStatus
  createdAt: string
  holdingTxRef: string | null
  deliveryAddress: string
  deliveryRequest: string
}

export const mockOrders: MockOrder[] = [
  {
    id: 'ord_demo_1',
    storeId: 'st_gangnam_kimchi',
    storeName: '강남 김치찌개 공방',
    customerLabel: '고객 #4821',
    items: [
      {
        menuId: 'm1',
        name: '들깨 김치찌개',
        qty: 1,
        lineTotalKrw: 12000,
        options: ['곱빼기(해물)', '공기밥 추가'],
      },
      {
        menuId: 'm2',
        name: '제육덮밥',
        qty: 2,
        lineTotalKrw: 22000,
        options: ['맵기: 보통'],
      },
    ],
    totalKrw: 34000,
    totalUsdtHold: 23.8,
    status: 'delivered',
    createdAt: new Date().toISOString(),
    holdingTxRef: 'mock-hold-trx-9f2a…c41',
    deliveryAddress: '서울 강남구 테헤란로 427 (mock)',
    deliveryRequest: '문 앞에 놓아주세요. 초인종 X',
  },
  {
    id: 'ord_demo_2',
    storeId: 'st_mapo_burger',
    storeName: '마포 스모크 버거',
    customerLabel: '고객 #9012',
    items: [
      {
        menuId: 'm3',
        name: '스모크 베이컨 세트',
        qty: 1,
        lineTotalKrw: 15000,
        options: ['세트: 콜라(L)', '감자튀김'],
      },
    ],
    totalKrw: 15000,
    totalUsdtHold: 10.5,
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    holdingTxRef: 'mock-hold-trx-1b88…90d',
    deliveryAddress: '서울 마포구 월드컵로 10길 12 (mock)',
    deliveryRequest: '일회용 수저 부탁드립니다.',
  },
  {
    id: 'ord_demo_3',
    storeId: 'st_yeoui_sushi',
    storeName: '여의 스시바',
    customerLabel: '고객 #1203',
    items: [
      {
        menuId: 'm4',
        name: '초밥 12피스',
        qty: 1,
        lineTotalKrw: 28000,
        options: ['와사비 빼주세요'],
      },
    ],
    totalKrw: 28000,
    totalUsdtHold: 19.6,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
    holdingTxRef: null,
    deliveryAddress: '서울 영등포구 여의대로 24 (mock)',
    deliveryRequest: '',
  },
]

export function getOrderById(id: string): MockOrder | undefined {
  return mockOrders.find((o) => o.id === id)
}

/** 가게·본사 관리자용 내부 상태 라벨 (기존 유지) */
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
