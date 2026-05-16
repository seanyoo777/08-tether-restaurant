import type { CheckStatus } from '../selfTest/types'
import { appendAudit } from './auditTrailStore'

export function appendCouponRiskAudit(params: {
  action: string
  target?: string
  detail?: string
  validation: CheckStatus
  actor?: 'customer' | 'hq_admin' | 'system' | 'self_test'
}): void {
  if (!params.action.startsWith('coupon.risk.')) {
    throw new Error(`coupon risk audit must use coupon.risk.* prefix: ${params.action}`)
  }
  appendAudit({
    actor: params.actor ?? 'system',
    action: params.action,
    target: params.target,
    detail: params.detail,
    validation: params.validation,
  })
}
