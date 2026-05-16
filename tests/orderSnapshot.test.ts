import { describe, expect, it } from 'vitest'

import { mergeMockAndLiveOrderSnapshots, mockOrderToSnapshot } from '../src/domain/orderSnapshot'
import { mockOrders } from '../src/mock/orders'
import { computeCartTotals } from '../src/store/cartStore'

describe('orderSnapshot', () => {
  it('maps mock order display fields', () => {
    const o = mockOrders[0]
    expect(o).toBeDefined()
    const s = mockOrderToSnapshot(o!)
    expect(s.totalAmount).toBe(o!.totalKrw)
    expect(s.address).toBe(o!.deliveryAddress)
    expect(s.customerName).toBe(o!.customerLabel)
    expect(s.orderStatus).toBe(o!.status)
  })

  it('merges live over mock by id', () => {
    const mock = mockOrders[0]!
    const live = {
      [mock.id]: {
        id: mock.id,
        storeId: mock.storeId,
        storeName: mock.storeName,
        status: 'accepted' as const,
        totalKrw: mock.totalKrw + 1,
        totalUsdtHold: mock.totalUsdtHold,
        holdingTxRef: mock.holdingTxRef,
        createdAt: mock.createdAt,
        items: mock.items,
        deliveryAddress: mock.deliveryAddress,
        deliveryRequest: mock.deliveryRequest,
      },
    }
    const merged = mergeMockAndLiveOrderSnapshots(mockOrders, live)
    const row = merged.find((r) => r.id === mock.id)
    expect(row?.orderStatus).toBe('accepted')
    expect(row?.totalAmount).toBe(mock.totalKrw + 1)
  })
})

describe('cartStore', () => {
  it('computeCartTotals is pure', () => {
    const t = computeCartTotals([{ menuId: 'a', name: 'A', unitKrw: 500, unitUsdt: 0.3, qty: 3 }])
    expect(t.krw).toBe(1500)
    expect(t.usdt).toBeCloseTo(0.9)
  })
})
