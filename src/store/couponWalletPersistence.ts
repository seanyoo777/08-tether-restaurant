import {
  migrateStoredCouponStatus,
  type RestaurantCoupon,
} from '../domain/coupon'

const STORAGE_KEY = 'tether-restaurant.offline-coupon-wallet.v1'

export type PersistedCouponWallet = {
  version: 1
  savedAt: string
  coupons: Record<string, RestaurantCoupon>
}

let memoryFallback: PersistedCouponWallet | null = null

function readRaw(): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY)
  }
  return memoryFallback ? JSON.stringify(memoryFallback) : null
}

export function loadPersistedCouponWallet(): Record<string, RestaurantCoupon> | null {
  const raw = readRaw()
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as PersistedCouponWallet
    if (!parsed?.coupons || typeof parsed.coupons !== 'object') return null
    const migrated: Record<string, RestaurantCoupon> = {}
    for (const [id, c] of Object.entries(parsed.coupons)) {
      migrated[id] = {
        ...c,
        status: migrateStoredCouponStatus(c.status),
      }
    }
    return migrated
  } catch {
    return null
  }
}

export function savePersistedCouponWallet(coupons: Record<string, RestaurantCoupon>): void {
  const payload: PersistedCouponWallet = {
    version: 1,
    savedAt: new Date().toISOString(),
    coupons,
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } else {
    memoryFallback = payload
  }
}

export function clearPersistedCouponWalletForTests(): void {
  memoryFallback = null
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function getCouponWalletStorageKey(): string {
  return STORAGE_KEY
}
