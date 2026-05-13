import { create } from 'zustand'

import type { OrderStatus } from '../mock/orders'

/** 결제 완료 후 주문 상태 화면용 mock 세션 저장 */
export type LiveOrder = {
  id: string
  storeName: string
  status: OrderStatus
  totalKrw: number
  totalUsdtHold: number
  holdingTxRef: string | null
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
