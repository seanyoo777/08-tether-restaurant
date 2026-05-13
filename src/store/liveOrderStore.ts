import { create } from 'zustand'

import type { OrderLineItem, OrderStatus } from '../mock/orders'

/** 결제 완료 후 주문 상세·주문내역용 mock 세션 저장 */
export type LiveOrder = {
  id: string
  storeId: string
  storeName: string
  /** MockOrder.customerLabel 과 정합용 (없으면 스냅샷 customerName 은 null) */
  customerLabel?: string
  status: OrderStatus
  totalKrw: number
  totalUsdtHold: number
  holdingTxRef: string | null
  createdAt: string
  items: OrderLineItem[]
  deliveryAddress: string
  deliveryRequest: string
}

type LiveState = {
  orders: Record<string, LiveOrder>
  upsert: (o: LiveOrder) => void
  get: (id: string) => LiveOrder | undefined
}

export const useLiveOrderStore = create<LiveState>((set, get) => ({
  orders: {},
  upsert: (o) => set({ orders: { ...get().orders, [o.id]: o } }),
  get: (id) => get().orders[id],
}))
