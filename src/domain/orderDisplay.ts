import type { OrderStatus } from '../mock/orders'

/** 고객 UI용 주문 단계 (배지·진행바) */
export type CustomerOrderPhase = 'received' | 'cooking' | 'delivery' | 'done' | 'cancelled'

export const customerPhaseLabel: Record<CustomerOrderPhase, string> = {
  received: '주문접수',
  cooking: '조리중',
  delivery: '배달중',
  done: '완료',
  cancelled: '취소',
}

const progressLabels = ['주문접수', '조리중', '배달중', '완료'] as const

export function toCustomerPhase(status: OrderStatus): CustomerOrderPhase {
  switch (status) {
    case 'cancelled':
      return 'cancelled'
    case 'delivered':
      return 'done'
    case 'out_for_delivery':
      return 'delivery'
    case 'cooking':
    case 'ready_pickup':
      return 'cooking'
    case 'pending_payment':
    case 'paid_holding':
    case 'accepted':
      return 'received'
  }
}

/** 진행바: 0~3 = 주문접수→조리중→배달중→완료, 취소는 -1 */
export function customerProgressIndex(phase: CustomerOrderPhase): number {
  if (phase === 'cancelled') return -1
  const m: Record<Exclude<CustomerOrderPhase, 'cancelled'>, number> = {
    received: 0,
    cooking: 1,
    delivery: 2,
    done: 3,
  }
  return m[phase]
}

export function customerProgressLabels(): readonly string[] {
  return progressLabels
}

export function isReorderablePhase(phase: CustomerOrderPhase): boolean {
  return phase === 'done'
}
