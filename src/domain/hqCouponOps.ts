/**
 * HQ 쿠폰 운영 집계 — localStorage 지갑 + 세션 audit only. 외부 API 없음.
 */

import {
  effectiveOfflineCouponStatus,
  offlineCouponStatusLabel,
  type OfflineCouponStatus,
  type RestaurantCoupon,
} from './coupon'
import type { EventCampaign } from '../mock/eventCampaigns'
import type { AuditTrailEntry } from '../selfTest/types'
import { getCouponWalletStorageKey } from '../store/couponWalletPersistence'

const COUPON_AUDIT_ACTION_PREFIX = 'coupon.'

export type CouponStatusCounts = Record<OfflineCouponStatus, number>

export type CampaignCouponStat = {
  campaignKey: string
  title: string
  issued: number
  used: number
  expired: number
  canceled: number
  total: number
}

export type HqCouponOpsSnapshot = {
  dataSource: 'localStorage'
  storageKey: string
  totalCoupons: number
  statusCounts: CouponStatusCounts
  campaignStats: CampaignCouponStat[]
  recentCouponAudits: AuditTrailEntry[]
}

export function isCouponAuditEntry(entry: AuditTrailEntry): boolean {
  return entry.action.startsWith(COUPON_AUDIT_ACTION_PREFIX)
}

export function buildCouponStatusCounts(coupons: RestaurantCoupon[]): CouponStatusCounts {
  const counts: CouponStatusCounts = {
    issued: 0,
    used: 0,
    expired: 0,
    canceled: 0,
  }
  for (const c of coupons) {
    const s = effectiveOfflineCouponStatus(c)
    counts[s] += 1
  }
  return counts
}

export function campaignKeyForCoupon(c: RestaurantCoupon): string {
  if (c.campaignId) return c.campaignId
  if (c.oneAiEventId) return c.oneAiEventId
  return 'uncategorized'
}

function titleForCampaignKey(key: string, campaigns: EventCampaign[], coupons: RestaurantCoupon[]): string {
  const camp = campaigns.find((x) => x.campaignId === key)
  if (camp) return camp.title
  const sample = coupons.find((c) => c.oneAiEventId === key || c.campaignId === key)
  if (sample) return sample.eventName
  if (key === 'uncategorized') return '미분류 쿠폰'
  return key
}

export function buildCampaignCouponStats(
  coupons: RestaurantCoupon[],
  campaigns: EventCampaign[],
): CampaignCouponStat[] {
  const map = new Map<string, CampaignCouponStat>()

  for (const camp of campaigns) {
    map.set(camp.campaignId, {
      campaignKey: camp.campaignId,
      title: camp.title,
      issued: 0,
      used: 0,
      expired: 0,
      canceled: 0,
      total: 0,
    })
  }

  for (const c of coupons) {
    const key = campaignKeyForCoupon(c)
    let row = map.get(key)
    if (!row) {
      row = {
        campaignKey: key,
        title: titleForCampaignKey(key, campaigns, coupons),
        issued: 0,
        used: 0,
        expired: 0,
        canceled: 0,
        total: 0,
      }
      map.set(key, row)
    }
    const s = effectiveOfflineCouponStatus(c)
    row[s] += 1
    row.total += 1
  }

  return [...map.values()].sort((a, b) => b.total - a.total)
}

export function buildHqCouponOpsSnapshot(params: {
  coupons: RestaurantCoupon[]
  campaigns: EventCampaign[]
  auditEntries: AuditTrailEntry[]
  recentLimit?: number
}): HqCouponOpsSnapshot {
  const recentCouponAudits = params.auditEntries
    .filter(isCouponAuditEntry)
    .slice(-(params.recentLimit ?? 15))
    .reverse()

  return {
    dataSource: 'localStorage',
    storageKey: getCouponWalletStorageKey(),
    totalCoupons: params.coupons.length,
    statusCounts: buildCouponStatusCounts(params.coupons),
    campaignStats: buildCampaignCouponStats(params.coupons, params.campaigns),
    recentCouponAudits,
  }
}

export function statusCountRows(counts: CouponStatusCounts): { label: string; key: OfflineCouponStatus; value: number }[] {
  return (['issued', 'used', 'expired', 'canceled'] as const).map((key) => ({
    key,
    label: offlineCouponStatusLabel[key],
    value: counts[key],
  }))
}
