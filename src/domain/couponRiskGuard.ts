/**
 * 쿠폰 Risk / Abuse Guard (mock) — 실결제·외부 API 없음.
 */

import { effectiveOfflineCouponStatus, type RestaurantCoupon } from './coupon'
import { campaignKeyForCoupon } from './hqCouponOps'
import type { EventCampaign } from '../mock/eventCampaigns'
import type { AuditTrailEntry, CheckStatus } from '../selfTest/types'

export type CouponUseRiskEvaluation = {
  allowed: boolean
  severity: CheckStatus
  riskCode: string
  message: string
}

export type CampaignIssuanceRisk = {
  campaignKey: string
  title: string
  issuedCount: number
  warnThreshold: number
  failThreshold: number
  severity: CheckStatus
  message: string
}

export type CouponRiskFinding = {
  id: string
  severity: CheckStatus
  code: string
  message: string
  couponId?: string
  campaignKey?: string
}

export type CouponRiskGuardReport = {
  overall: CheckStatus
  issueCount: number
  duplicateUseAttempts: number
  invalidStatusUseAttempts: number
  abnormalCampaignCount: number
  findings: CouponRiskFinding[]
  recentRiskAudits: AuditTrailEntry[]
}

export const DEFAULT_CAMPAIGN_ISSUE_WARN_THRESHOLD = 4
export const DEFAULT_CAMPAIGN_ISSUE_FAIL_THRESHOLD = 8

const RISK_AUDIT_PREFIX = 'coupon.risk.'

export function isCouponRiskAuditEntry(entry: AuditTrailEntry): boolean {
  return entry.action.startsWith(RISK_AUDIT_PREFIX)
}

export function evaluateCouponUseAttempt(coupon: RestaurantCoupon): CouponUseRiskEvaluation {
  const status = effectiveOfflineCouponStatus(coupon)

  if (status === 'used') {
    return {
      allowed: false,
      severity: 'FAIL',
      riskCode: 'coupon.risk.duplicate_use',
      message: '이미 사용된 쿠폰에 대한 중복 사용 시도',
    }
  }

  if (status === 'expired') {
    return {
      allowed: false,
      severity: 'FAIL',
      riskCode: 'coupon.risk.use_expired',
      message: '만료된 쿠폰 사용 시도',
    }
  }

  if (status === 'canceled') {
    return {
      allowed: false,
      severity: 'FAIL',
      riskCode: 'coupon.risk.use_canceled',
      message: '취소된 쿠폰 사용 시도',
    }
  }

  return {
    allowed: true,
    severity: 'PASS',
    riskCode: 'coupon.risk.use_cleared',
    message: '발급 상태 — mock 사용 허용',
  }
}

export function countDuplicateUseAttemptsFromAudit(
  auditEntries: AuditTrailEntry[],
  couponId: string,
): number {
  return auditEntries.filter(
    (e) =>
      e.target === couponId &&
      (e.action === 'coupon.redeemed.mock' ||
        e.action === 'coupon.risk.duplicate_use' ||
        e.action === 'coupon.risk.use_expired' ||
        e.action === 'coupon.risk.use_canceled' ||
        e.action === 'coupon.risk.use_blocked'),
  ).length
}

export function detectAbnormalCampaignIssuance(
  coupons: RestaurantCoupon[],
  campaigns: EventCampaign[],
  opts?: { warnThreshold?: number; failThreshold?: number },
): CampaignIssuanceRisk[] {
  const warnThreshold = opts?.warnThreshold ?? DEFAULT_CAMPAIGN_ISSUE_WARN_THRESHOLD
  const failThreshold = opts?.failThreshold ?? DEFAULT_CAMPAIGN_ISSUE_FAIL_THRESHOLD
  const issuedByCampaign = new Map<string, number>()

  for (const c of coupons) {
    if (effectiveOfflineCouponStatus(c) !== 'issued') continue
    const key = campaignKeyForCoupon(c)
    issuedByCampaign.set(key, (issuedByCampaign.get(key) ?? 0) + 1)
  }

  const risks: CampaignIssuanceRisk[] = []

  for (const [campaignKey, issuedCount] of issuedByCampaign) {
    if (issuedCount < warnThreshold) continue
    const camp = campaigns.find((x) => x.campaignId === campaignKey)
    const title = camp?.title ?? campaignKey
    const severity: CheckStatus = issuedCount >= failThreshold ? 'FAIL' : 'WARN'
    risks.push({
      campaignKey,
      title,
      issuedCount,
      warnThreshold,
      failThreshold,
      severity,
      message:
        severity === 'FAIL'
          ? `캠페인 "${title}" 발급 ${issuedCount}건 — FAIL 임계(${failThreshold}) 초과`
          : `캠페인 "${title}" 발급 ${issuedCount}건 — WARN 임계(${warnThreshold}) 초과`,
    })
  }

  return risks.sort((a, b) => b.issuedCount - a.issuedCount)
}

function overallFromFindings(findings: CouponRiskFinding[]): CheckStatus {
  if (findings.some((f) => f.severity === 'FAIL')) return 'FAIL'
  if (findings.some((f) => f.severity === 'WARN')) return 'WARN'
  return 'PASS'
}

export function buildCouponRiskGuardReport(params: {
  coupons: RestaurantCoupon[]
  campaigns: EventCampaign[]
  auditEntries: AuditTrailEntry[]
  recentRiskLimit?: number
  campaignWarnThreshold?: number
  campaignFailThreshold?: number
}): CouponRiskGuardReport {
  const findings: CouponRiskFinding[] = []

  for (const c of params.coupons) {
    if (effectiveOfflineCouponStatus(c) !== 'used') continue
    const attempts = countDuplicateUseAttemptsFromAudit(params.auditEntries, c.couponId)
    if (attempts > 1) {
      findings.push({
        id: `dup-${c.couponId}`,
        severity: 'WARN',
        code: 'coupon.risk.duplicate_use_pattern',
        message: `쿠폰 ${c.couponId}: 사용 관련 audit ${attempts}건`,
        couponId: c.couponId,
      })
    }
  }

  const riskAudits = params.auditEntries.filter(isCouponRiskAuditEntry)
  const duplicateUseAttempts = riskAudits.filter((e) => e.action === 'coupon.risk.duplicate_use').length
  const invalidStatusUseAttempts = riskAudits.filter(
    (e) =>
      e.action === 'coupon.risk.use_expired' ||
      e.action === 'coupon.risk.use_canceled' ||
      e.action === 'coupon.risk.use_blocked',
  ).length

  for (const entry of riskAudits) {
    if (entry.action === 'coupon.risk.duplicate_use') {
      findings.push({
        id: `audit-${entry.id}`,
        severity: entry.validation ?? 'FAIL',
        code: entry.action,
        message: entry.detail ?? '중복 사용 시도',
        couponId: entry.target,
      })
    }
  }

  const abnormalCampaigns = detectAbnormalCampaignIssuance(params.coupons, params.campaigns, {
    warnThreshold: params.campaignWarnThreshold,
    failThreshold: params.campaignFailThreshold,
  })

  for (const row of abnormalCampaigns) {
    findings.push({
      id: `camp-${row.campaignKey}`,
      severity: row.severity,
      code: 'coupon.risk.abnormal_issuance',
      message: row.message,
      campaignKey: row.campaignKey,
    })
  }

  const issueCount = findings.filter((f) => f.severity === 'WARN' || f.severity === 'FAIL').length
  const recentRiskAudits = riskAudits.slice(-(params.recentRiskLimit ?? 10)).reverse()

  return {
    overall: overallFromFindings(findings),
    issueCount,
    duplicateUseAttempts,
    invalidStatusUseAttempts,
    abnormalCampaignCount: abnormalCampaigns.length,
    findings,
    recentRiskAudits,
  }
}
