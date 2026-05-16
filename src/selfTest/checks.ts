import { computeCartTotals } from '../store/cartStore'
import { getFeatureFlagFallback, useFeatureFlagsStore } from '../store/featureFlagsStore'
import { useLiveOrderStore } from '../store/liveOrderStore'
import { DEFAULT_ACTIVE_RAIL, PRODUCT_IDS } from '../integration/productContext'
import { mockOrders } from '../mock/orders'
import { getStoreById } from '../mock/catalog'
import {
  mergeMockAndLiveOrderSnapshots,
  mockOrderToSnapshot,
} from '../domain/orderSnapshot'
import { runCouponChecks } from './couponChecks'
import type { SelfTestCheck } from './types'

function check(
  partial: Omit<SelfTestCheck, 'durationMs'> & { durationMs?: number },
): SelfTestCheck {
  return { ...partial, durationMs: partial.durationMs ?? 0 }
}

export function runOrderSnapshotChecks(): SelfTestCheck[] {
  const checks: SelfTestCheck[] = []
  const t0 = performance.now()

  if (mockOrders.length === 0) {
    checks.push(
      check({
        id: 'order-mock-seed',
        name: 'Mock 주문 시드',
        category: 'order',
        status: 'FAIL',
        message: 'mockOrders 가 비어 있습니다.',
        durationMs: performance.now() - t0,
      }),
    )
    return checks
  }

  const sample = mockOrderToSnapshot(mockOrders[0]!)
  const fieldsOk =
    typeof sample.totalAmount === 'number' &&
    sample.totalAmount > 0 &&
    typeof sample.address === 'string' &&
    typeof sample.orderStatus === 'string'

  checks.push(
    check({
      id: 'order-snapshot-fields',
      name: 'OrderSnapshot 필드 정합',
      category: 'order',
      status: fieldsOk ? 'PASS' : 'FAIL',
      message: fieldsOk
        ? 'totalAmount / address / orderStatus / customerName 매핑 OK'
        : '스냅샷 필수 필드 누락 또는 비정상',
      durationMs: performance.now() - t0,
    }),
  )

  const merged = mergeMockAndLiveOrderSnapshots(mockOrders, useLiveOrderStore.getState().orders)
  const sorted =
    merged.length < 2 ||
    merged.every((row, i) => i === 0 || merged[i - 1]!.createdAt >= row.createdAt)

  checks.push(
    check({
      id: 'order-merge-sort',
      name: 'Mock+Live 병합·정렬',
      category: 'order',
      status: sorted ? 'PASS' : 'WARN',
      message: sorted
        ? `${merged.length}건 병합, createdAt 내림차순`
        : '병합 목록 정렬이 기대와 다를 수 있음',
      durationMs: performance.now() - t0,
    }),
  )

  return checks
}

export function runCartChecks(): SelfTestCheck[] {
  const t0 = performance.now()
  const totals = computeCartTotals([
    { menuId: 't', name: 'Test', unitKrw: 1000, unitUsdt: 0.7, qty: 2 },
  ])
  const ok = totals.krw === 2000 && totals.usdt > 0
  return [
    check({
      id: 'cart-totals-pure',
      name: '장바구니 합계 (selector 무한루프 방지)',
      category: 'cart',
      status: ok ? 'PASS' : 'FAIL',
      message: ok ? 'computeCartTotals 순수 함수 OK' : '합계 계산 오류',
      durationMs: performance.now() - t0,
    }),
  ]
}

export function runFeatureFlagChecks(): SelfTestCheck[] {
  const t0 = performance.now()
  const flags = useFeatureFlagsStore.getState().flags
  const checks: SelfTestCheck[] = []

  checks.push(
    check({
      id: 'flag-mock-only',
      name: 'Mock-only 결제 모드',
      category: 'flags',
      status: flags.mockPaymentsOnly ? 'PASS' : 'FAIL',
      message: flags.mockPaymentsOnly
        ? 'mockPaymentsOnly=true (실거래·실정산 비활성)'
        : 'mockPaymentsOnly 가 꺼져 있음 — 데모 정책 위반',
      durationMs: performance.now() - t0,
    }),
  )

  const railOk = flags.activePaymentRail === DEFAULT_ACTIVE_RAIL
  checks.push(
    check({
      id: 'flag-active-rail',
      name: '활성 결제 레일',
      category: 'flags',
      status: railOk ? 'PASS' : 'WARN',
      message: railOk
        ? `activePaymentRail=${flags.activePaymentRail}`
        : `비기본 레일: ${flags.activePaymentRail} (fallback: ${getFeatureFlagFallback('activePaymentRail')})`,
      durationMs: performance.now() - t0,
    }),
  )

  checks.push(
    check({
      id: 'flag-qr-coupon',
      name: 'restaurant.qr_coupon.enabled',
      category: 'flags',
      status: flags.qrCouponEnabled ? 'PASS' : 'WARN',
      message: `qrCouponEnabled=${flags.qrCouponEnabled}`,
      durationMs: performance.now() - t0,
    }),
  )
  checks.push(
    check({
      id: 'flag-oneai-event',
      name: 'restaurant.oneai_event.enabled',
      category: 'flags',
      status: flags.oneAiEventEnabled ? 'PASS' : 'WARN',
      message: `oneAiEventEnabled=${flags.oneAiEventEnabled}`,
      durationMs: performance.now() - t0,
    }),
  )

  if (flags.enableCardRail && flags.mockPaymentsOnly) {
    checks.push(
      check({
        id: 'flag-card-fallback',
        name: '카드 레일 fallback',
        category: 'flags',
        status: 'WARN',
        message: '카드 레일 플래그 ON — UI는 비활성 슬롯만 허용 (mock)',
        durationMs: performance.now() - t0,
      }),
    )
  } else {
    checks.push(
      check({
        id: 'flag-card-fallback',
        name: '카드 레일 fallback',
        category: 'flags',
        status: 'PASS',
        message: '카드 레일 mock 비활성 또는 정책 일치',
        durationMs: performance.now() - t0,
      }),
    )
  }

  return checks
}

export function runRoutingSmokeChecks(): SelfTestCheck[] {
  const t0 = performance.now()
  const store = getStoreById(mockOrders[0]?.storeId ?? '')
  return [
    check({
      id: 'route-catalog',
      name: '카탈로그·주문 시드 연결',
      category: 'routing',
      status: store ? 'PASS' : 'WARN',
      message: store ? `가게 시드 ${store.name}` : '첫 mock 주문의 storeId에 가게 없음',
      durationMs: performance.now() - t0,
    }),
    check({
      id: 'route-product-id',
      name: '통합 관리자 product id',
      category: 'routing',
      status: PRODUCT_IDS.tetherRestaurant === 'product:tether-restaurant' ? 'PASS' : 'FAIL',
      message: PRODUCT_IDS.tetherRestaurant,
      durationMs: performance.now() - t0,
    }),
  ]
}

export function runAdminPostActionChecks(orderId?: string): SelfTestCheck[] {
  const base = runOrderSnapshotChecks()
  if (!orderId) return base

  const live = useLiveOrderStore.getState().get(orderId)
  const t0 = performance.now()
  base.push(
    check({
      id: 'admin-live-order',
      name: '관리자 액션 후 live 주문',
      category: 'admin',
      status: live ? 'PASS' : 'WARN',
      message: live
        ? `live 주문 ${orderId} status=${live.status}`
        : `시드 주문 ${orderId} — live 맵에 없음 (mock 전용 표시)`,
      durationMs: performance.now() - t0,
    }),
  )
  return base
}

export function runAllSelfTestChecks(): SelfTestCheck[] {
  return [
    ...runOrderSnapshotChecks(),
    ...runCartChecks(),
    ...runFeatureFlagChecks(),
    ...runRoutingSmokeChecks(),
    ...runCouponChecks(),
  ]
}
