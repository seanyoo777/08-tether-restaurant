import { create } from 'zustand'

export type CheckoutDraft = {
  id: string
  storeId: string
  storeName: string
  lines: { menuId: string; name: string; qty: number; lineTotalKrw: number }[]
  totalKrw: number
  totalUsdt: number
}

type DraftState = {
  drafts: Record<string, CheckoutDraft>
  put: (draft: CheckoutDraft) => void
  get: (id: string) => CheckoutDraft | undefined
  remove: (id: string) => void
}

export const useCheckoutDraftStore = create<DraftState>((set, get) => ({
  drafts: {},
  put: (draft) => set({ drafts: { ...get().drafts, [draft.id]: draft } }),
  get: (id) => get().drafts[id],
  remove: (id) =>
    set({
      drafts: Object.fromEntries(
        Object.entries(get().drafts).filter(([k]) => k !== id),
      ),
    }),
}))
