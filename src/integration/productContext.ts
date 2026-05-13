/**
 * 향후 TetherGet(1) · OneAI(3) · 테더식당(본 앱) · UTE(7) 공통 관리자 SSO/권한에
 * 그대로 넘길 수 있는 최소 식별자. 실제 연동 없음 — 타입만 고정.
 */
export const PRODUCT_IDS = {
  tetherGet: 'product:tetherget',
  oneAi: 'product:oneai',
  tetherRestaurant: 'product:tether-restaurant',
  ute: 'product:ute',
} as const

export type ProductId = (typeof PRODUCT_IDS)[keyof typeof PRODUCT_IDS]

export type AdminRole =
  | 'super'
  | 'hq_ops'
  | 'hq_finance'
  | 'hq_support'
  | 'store_owner'
  | 'store_staff'
  | 'rider'

export type UnifiedAdminSession = {
  subjectId: string
  displayName: string
  products: Partial<Record<ProductId, AdminRole[]>>
}

export type PaymentRail = 'usdt_hold' | 'card' | 'apple_pay' | 'samsung_pay' | 'kakao_pay'

export const DEFAULT_ACTIVE_RAIL: PaymentRail = 'usdt_hold'
