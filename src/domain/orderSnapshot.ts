/**
 * 주문 표시용 정합 스냅샷 (Phase 2).
 * MockOrder / LiveOrder 필드명 차이를 흡수하고, 리스트·상세 UI는 이 타입만 보도록 통로를 맞춘다.
 * — 파이프라인 상태 변경 로직 없음. 순수 매핑만.
 */

import type { LiveOrder } from '../store/liveOrderStore'
import type { MockOrder, OrderLineItem, OrderStatus } from '../mock/orders'

/** 결제 관점 표시 상태 (내부 OrderStatus에서 순수 파생, UI 노출용 확장) */
export type SnapshotPaymentStatus = 'unpaid' | 'holding' | 'settled' | 'cancelled'

/** 배달 관점 표시 상태 (내부 OrderStatus에서 순수 파생) */
export type SnapshotDeliveryStatus =
  | 'none'
  | 'queued'
  | 'in_kitchen'
  | 'ready_handoff'
  | 'in_transit'
  | 'completed'
  | 'cancelled'

/**
 * 공통 주문 스냅샷.
 * - totalAmount: 원화 합계 (= MockOrder.totalKrw / LiveOrder.totalKrw)
 * - address / memo: 배송지·요청사항 (= deliveryAddress / deliveryRequest)
 * - customerName: 표시용 고객명 (Mock: customerLabel, Live: customerLabel 선택)
 * - updatedAt / riderName: 현재 소스에 없음 → null (추후 API 필드 연결)
 */
export type OrderSnapshot = {
  id: string
  storeId: string
  storeName: string
  customerName: string | null
  items: OrderLineItem[]
  totalAmount: number
  totalUsdtHold: number
  holdingTxRef: string | null
  paymentStatus: SnapshotPaymentStatus
  orderStatus: OrderStatus
  deliveryStatus: SnapshotDeliveryStatus
  createdAt: string
  updatedAt: string | null
  address: string
  riderName: string | null
  memo: string | null
}

/** @internal — OrderStatus → 결제 표시 (기존 상태값 변경 없음) */
export function deriveSnapshotPaymentStatus(status: OrderStatus): SnapshotPaymentStatus {
  switch (status) {
    case 'pending_payment':
      return 'unpaid'
    case 'cancelled':
      return 'cancelled'
    case 'delivered':
      return 'settled'
    case 'paid_holding':
    case 'accepted':
    case 'cooking':
    case 'ready_pickup':
    case 'out_for_delivery':
      return 'holding'
  }
}

/** @internal — OrderStatus → 배달 표시 (기존 상태값 변경 없음) */
export function deriveSnapshotDeliveryStatus(status: OrderStatus): SnapshotDeliveryStatus {
  switch (status) {
    case 'pending_payment':
      return 'none'
    case 'paid_holding':
      return 'queued'
    case 'accepted':
    case 'cooking':
      return 'in_kitchen'
    case 'ready_pickup':
      return 'ready_handoff'
    case 'out_for_delivery':
      return 'in_transit'
    case 'delivered':
      return 'completed'
    case 'cancelled':
      return 'cancelled'
  }
}

export function mockOrderToSnapshot(o: MockOrder): OrderSnapshot {
  return {
    id: o.id,
    storeId: o.storeId,
    storeName: o.storeName,
    customerName: o.customerLabel,
    items: o.items.map((i) => ({ ...i })),
    totalAmount: o.totalKrw,
    totalUsdtHold: o.totalUsdtHold,
    holdingTxRef: o.holdingTxRef,
    paymentStatus: deriveSnapshotPaymentStatus(o.status),
    orderStatus: o.status,
    deliveryStatus: deriveSnapshotDeliveryStatus(o.status),
    createdAt: o.createdAt,
    updatedAt: null,
    address: o.deliveryAddress,
    riderName: null,
    memo: o.deliveryRequest.trim() ? o.deliveryRequest : null,
  }
}

export function liveOrderToSnapshot(o: LiveOrder): OrderSnapshot {
  return {
    id: o.id,
    storeId: o.storeId,
    storeName: o.storeName,
    customerName: o.customerLabel ?? null,
    items: o.items.map((i) => ({ ...i })),
    totalAmount: o.totalKrw,
    totalUsdtHold: o.totalUsdtHold,
    holdingTxRef: o.holdingTxRef,
    paymentStatus: deriveSnapshotPaymentStatus(o.status),
    orderStatus: o.status,
    deliveryStatus: deriveSnapshotDeliveryStatus(o.status),
    createdAt: o.createdAt,
    updatedAt: null,
    address: o.deliveryAddress,
    riderName: null,
    memo: o.deliveryRequest.trim() ? o.deliveryRequest : null,
  }
}

/**
 * MockOrder vs LiveOrder 소스 차이 (스냅샷으로 흡수하는 항목).
 * - Mock만 customerLabel 고정 문자열. Live는 `customerLabel?` 없으면 customerName null.
 * - 둘 다 updatedAt / riderName 없음 → 스냅샷 null.
 * - totalKrw 명은 스냅샷에서 totalAmount로 통일 (값 동일).
 * - 배송지·요청: Mock/Live 동일 필드명이나 스냅샷에서는 address / memo 로 통일.
 */

/** 고객·점주·HQ 동일 규칙: mock 목록 + live 맵 병합(id 기준 live 우선), 최신순 */
export function mergeMockAndLiveOrderSnapshots(
  mock: MockOrder[],
  liveById: Record<string, LiveOrder>,
): OrderSnapshot[] {
  const byId = new Map<string, OrderSnapshot>()
  for (const o of mock) {
    byId.set(o.id, mockOrderToSnapshot(o))
  }
  for (const o of Object.values(liveById)) {
    byId.set(o.id, liveOrderToSnapshot(o))
  }
  return [...byId.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}
