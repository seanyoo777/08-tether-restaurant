import { create } from 'zustand'

import { DEFAULT_ACTIVE_RAIL, type PaymentRail } from '../integration/productContext'

/** mock 전용 기능 플래그 — 실연동·실거래 없음 */
export type FeatureFlags = {
  mockPaymentsOnly: true
  enableCardRail: boolean
  enableRiderDispatchDemo: boolean
  enableHqForceCancel: boolean
  activePaymentRail: PaymentRail
  /** restaurant.qr_coupon.enabled */
  qrCouponEnabled: boolean
  /** restaurant.oneai_event.enabled */
  oneAiEventEnabled: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  mockPaymentsOnly: true,
  enableCardRail: false,
  enableRiderDispatchDemo: true,
  enableHqForceCancel: false,
  activePaymentRail: DEFAULT_ACTIVE_RAIL,
  qrCouponEnabled: true,
  oneAiEventEnabled: true,
}

type FeatureFlagState = {
  flags: FeatureFlags
  setFlag: <K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]) => void
  resetFlags: () => void
}

export const useFeatureFlagsStore = create<FeatureFlagState>((set) => ({
  flags: { ...DEFAULT_FLAGS },
  setFlag: (key, value) =>
    set((s) => ({
      flags: { ...s.flags, [key]: value },
    })),
  resetFlags: () => set({ flags: { ...DEFAULT_FLAGS } }),
}))

export function getFeatureFlagFallback(key: keyof FeatureFlags): FeatureFlags[keyof FeatureFlags] {
  return DEFAULT_FLAGS[key]
}
