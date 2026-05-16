/** Self-Test Center 공통 결과 상태 (플랫폼 전역 규칙) */
export type CheckStatus = 'PASS' | 'WARN' | 'FAIL'

export type SelfTestCheck = {
  id: string
  name: string
  category: 'order' | 'cart' | 'flags' | 'routing' | 'smoke' | 'admin' | 'coupon' | 'profile'
  status: CheckStatus
  message: string
  durationMs?: number
}

export type SelfTestRunSummary = {
  runId: string
  checkedAt: string
  overall: CheckStatus
  issueCount: number
  passCount: number
  warnCount: number
  failCount: number
  checks: SelfTestCheck[]
  mockOnly: true
}

export type AuditTrailEntry = {
  id: string
  at: string
  actor: 'hq_admin' | 'store_admin' | 'self_test' | 'system' | 'customer'
  action: string
  target?: string
  detail?: string
  validation?: CheckStatus
}
