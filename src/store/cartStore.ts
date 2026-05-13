import { create } from 'zustand'

import { getMenusForStore } from '../mock/catalog'

export type CartLine = {
  menuId: string
  name: string
  unitKrw: number
  unitUsdt: number
  qty: number
}

export function computeCartTotals(lines: CartLine[]): { krw: number; usdt: number } {
  const krw = lines.reduce((s, l) => s + l.unitKrw * l.qty, 0)
  const usdt = lines.reduce((s, l) => s + l.unitUsdt * l.qty, 0)
  return { krw, usdt }
}

type ReorderLine = {
  menuId: string
  name: string
  qty: number
  lineTotalKrw: number
}

type CartState = {
  storeId: string | null
  storeName: string | null
  lines: CartLine[]
  setStore: (storeId: string, storeName: string) => void
  addLine: (line: Omit<CartLine, 'qty'> & { qty?: number }) => void
  setQty: (menuId: string, qty: number) => void
  removeLine: (menuId: string) => void
  clear: () => void
  totals: () => { krw: number; usdt: number }
  /** 다른 가게 장바구니가 있으면 비운 뒤 해당 주문 상품으로 교체 */
  reorderFromOrder: (params: { storeId: string; storeName: string; lines: ReorderLine[] }) => void
}

export const useCartStore = create<CartState>((set, get) => ({
  storeId: null,
  storeName: null,
  lines: [],
  setStore: (storeId, storeName) => set({ storeId, storeName }),
  addLine: (line) => {
    const { menuId, name, unitKrw, unitUsdt, qty = 1 } = line
    const lines = [...get().lines]
    const i = lines.findIndex((l) => l.menuId === menuId)
    if (i >= 0) {
      lines[i] = { ...lines[i], qty: lines[i].qty + qty }
    } else {
      lines.push({ menuId, name, unitKrw, unitUsdt, qty })
    }
    set({ lines })
  },
  setQty: (menuId, qty) => {
    if (qty <= 0) {
      get().removeLine(menuId)
      return
    }
    set({
      lines: get().lines.map((l) => (l.menuId === menuId ? { ...l, qty } : l)),
    })
  },
  removeLine: (menuId) => set({ lines: get().lines.filter((l) => l.menuId !== menuId) }),
  clear: () => set({ lines: [], storeId: null, storeName: null }),
  totals: () => computeCartTotals(get().lines),
  reorderFromOrder: ({ storeId, storeName, lines: reorderLines }) => {
    const menus = getMenusForStore(storeId)
    const nextLines: CartLine[] = reorderLines.map((l) => {
      const menu = menus.find((m) => m.id === l.menuId)
      const unitKrw = Math.max(1, Math.round(l.lineTotalKrw / l.qty))
      const unitUsdt = menu
        ? Math.round(menu.usdtApprox * (unitKrw / menu.priceKrw) * 100) / 100
        : Math.round((l.lineTotalKrw / l.qty / 1430) * 100) / 100
      return {
        menuId: l.menuId,
        name: l.name,
        unitKrw,
        unitUsdt,
        qty: l.qty,
      }
    })
    set({ storeId, storeName, lines: nextLines })
  },
}))
