import { create } from 'zustand'

export type CartLine = {
  menuId: string
  name: string
  unitKrw: number
  unitUsdt: number
  qty: number
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
  totals: () => {
    const krw = get().lines.reduce((s, l) => s + l.unitKrw * l.qty, 0)
    const usdt = get().lines.reduce((s, l) => s + l.unitUsdt * l.qty, 0)
    return { krw, usdt }
  },
}))
