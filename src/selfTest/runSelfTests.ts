import { appendAudit } from '../store/auditTrailStore'
import { runAllSelfTestChecks, runAdminPostActionChecks } from './checks'
import { runCouponChecks } from './couponChecks'
import type { CheckStatus, SelfTestCheck, SelfTestRunSummary } from './types'

function overallFromChecks(checks: { status: CheckStatus }[]): CheckStatus {
  if (checks.some((c) => c.status === 'FAIL')) return 'FAIL'
  if (checks.some((c) => c.status === 'WARN')) return 'WARN'
  return 'PASS'
}

export function summarizeChecks(checks: SelfTestCheck[]): SelfTestRunSummary {
  const passCount = checks.filter((c) => c.status === 'PASS').length
  const warnCount = checks.filter((c) => c.status === 'WARN').length
  const failCount = checks.filter((c) => c.status === 'FAIL').length
  const issueCount = warnCount + failCount

  return {
    runId: `run-${Date.now()}`,
    checkedAt: new Date().toISOString(),
    overall: overallFromChecks(checks),
    issueCount,
    passCount,
    warnCount,
    failCount,
    checks,
    mockOnly: true,
  }
}

let lastSummary: SelfTestRunSummary | null = null

export function getLastSelfTestSummary(): SelfTestRunSummary | null {
  return lastSummary
}

export function runCouponSelfTestSuite(): SelfTestRunSummary {
  return summarizeChecks(runCouponChecks())
}

export function runSelfTestSuite(): SelfTestRunSummary {
  const checks = runAllSelfTestChecks()
  const summary = summarizeChecks(checks)
  lastSummary = summary
  appendAudit({
    actor: 'self_test',
    action: 'self_test.run',
    detail: `overall=${summary.overall} issues=${summary.issueCount}`,
    validation: summary.overall,
  })
  return summary
}

/** 관리자 mock 상태 변경 직후 자동 검증 (websocket 불필요) */
export function validateAfterAdminAction(params: {
  actor: 'hq_admin' | 'store_admin'
  action: string
  orderId?: string
}): SelfTestRunSummary {
  const checks = runAdminPostActionChecks(params.orderId)
  const summary = summarizeChecks(checks)
  lastSummary = summary
  appendAudit({
    actor: params.actor,
    action: params.action,
    target: params.orderId,
    detail: `post-validation overall=${summary.overall}`,
    validation: summary.overall,
  })
  return summary
}
