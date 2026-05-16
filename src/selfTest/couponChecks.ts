import {
  buildHqCouponOpsSnapshot,
  buildCouponStatusCounts,
} from '../domain/hqCouponOps'
import {
  buildQrPlaceholderPayload,
  canTransitionOffline,
  effectiveOfflineCouponStatus,
  migrateStoredCouponStatus,
  transitionOfflineCouponStatus,
} from '../domain/coupon'
import { mockCoupons } from '../mock/coupons'
import { mockEventCampaigns } from '../mock/eventCampaigns'
import { useFeatureFlagsStore } from '../store/featureFlagsStore'
import { useCouponWalletStore } from '../store/couponWalletStore'
import {
  getCouponWalletStorageKey,
  loadPersistedCouponWallet,
  savePersistedCouponWallet,
} from '../store/couponWalletPersistence'
import type { SelfTestCheck } from './types'
import { runCouponRiskGuardChecks } from './couponRiskChecks'

function check(
  partial: Omit<SelfTestCheck, 'durationMs'> & { durationMs?: number },
): SelfTestCheck {
  return { ...partial, durationMs: partial.durationMs ?? 0 }
}

export function runCouponChecks(): SelfTestCheck[] {
  const t0 = performance.now()
  const checks: SelfTestCheck[] = []
  const flags = useFeatureFlagsStore.getState().flags

  const sample = mockCoupons[0]
  const offlineStatuses = ['issued', 'used', 'expired', 'canceled'] as const
  const schemaOk =
    !!sample &&
    typeof sample.couponId === 'string' &&
    typeof sample.qrPayload === 'string' &&
    typeof sample.validUntil === 'string' &&
    offlineStatuses.includes(effectiveOfflineCouponStatus(sample))

  checks.push(
    check({
      id: 'coupon-schema',
      name: 'Coupon schema check',
      category: 'coupon',
      status: schemaOk ? 'PASS' : 'FAIL',
      message: schemaOk
        ? 'couponId / qrPayload / offline status (issued|used|expired|canceled) OK'
        : 'mock coupon seed invalid',
      durationMs: performance.now() - t0,
    }),
  )

  const payload = buildQrPlaceholderPayload('test-cpn', 'st_gangnam_kimchi')
  const qrOk = payload.includes('offline-mock-coupon')
  checks.push(
    check({
      id: 'coupon-qr-placeholder',
      name: 'QR placeholder check',
      category: 'coupon',
      status: qrOk ? 'PASS' : 'FAIL',
      message: qrOk ? 'offline mock QR payload OK' : 'QR payload format mismatch',
      durationMs: performance.now() - t0,
    }),
  )

  const transitionOk =
    canTransitionOffline('issued', 'used') &&
    canTransitionOffline('issued', 'canceled') &&
    !canTransitionOffline('used', 'issued')
  const transitioned = sample
    ? transitionOfflineCouponStatus({ ...sample, status: 'issued' }, 'used')
    : null
  checks.push(
    check({
      id: 'coupon-status-transition',
      name: 'Offline status transition',
      category: 'coupon',
      status: transitionOk && transitioned?.status === 'used' ? 'PASS' : 'FAIL',
      message: transitionOk ? 'issued→used|canceled rules OK' : 'invalid transition rules',
      durationMs: performance.now() - t0,
    }),
  )

  const legacyMigrate = migrateStoredCouponStatus('unused') === 'issued'
  checks.push(
    check({
      id: 'coupon-legacy-migrate',
      name: 'Legacy status migrate',
      category: 'coupon',
      status: legacyMigrate ? 'PASS' : 'FAIL',
      message: legacyMigrate ? 'unused→issued migrate OK' : 'legacy migrate failed',
      durationMs: performance.now() - t0,
    }),
  )

  const wallet = useCouponWalletStore.getState().listCoupons()
  const cardOk = wallet.length >= mockCoupons.length
  checks.push(
    check({
      id: 'coupon-wallet-seed',
      name: 'Mobile coupon card seed',
      category: 'coupon',
      status: cardOk ? 'PASS' : 'WARN',
      message: cardOk ? `${wallet.length} coupons in wallet` : 'wallet fewer than seed',
      durationMs: performance.now() - t0,
    }),
  )

  const campaignOk = mockEventCampaigns.length > 0 && mockEventCampaigns.every((c) => c.offlineOnly)
  checks.push(
    check({
      id: 'coupon-event-campaign-card',
      name: 'Event campaign card seed',
      category: 'coupon',
      status: campaignOk ? 'PASS' : 'FAIL',
      message: campaignOk
        ? `${mockEventCampaigns.length} offline campaigns`
        : 'event campaign seed missing',
      durationMs: performance.now() - t0,
    }),
  )

  try {
    savePersistedCouponWallet(wallet.reduce<Record<string, (typeof wallet)[0]>>((acc, c) => {
      acc[c.couponId] = c
      return acc
    }, {}))
    const reloaded = loadPersistedCouponWallet()
    const persistOk = !!reloaded && Object.keys(reloaded).length >= mockCoupons.length
    checks.push(
      check({
        id: 'coupon-localstorage',
        name: 'localStorage persistence',
        category: 'coupon',
        status: persistOk ? 'PASS' : 'WARN',
        message: persistOk
          ? `key=${getCouponWalletStorageKey()}`
          : 'persist round-trip unavailable (SSR/test env)',
        durationMs: performance.now() - t0,
      }),
    )
  } catch {
    checks.push(
      check({
        id: 'coupon-localstorage',
        name: 'localStorage persistence',
        category: 'coupon',
        status: 'WARN',
        message: 'localStorage write failed',
        durationMs: performance.now() - t0,
      }),
    )
  }

  const expiredSample = wallet.find((c) => effectiveOfflineCouponStatus(c) === 'expired')
  checks.push(
    check({
      id: 'coupon-expired-effective',
      name: 'Expired effective status',
      category: 'coupon',
      status: expiredSample ? 'PASS' : 'WARN',
      message: expiredSample
        ? `expired: ${expiredSample.couponId}`
        : 'no expired coupon in seed',
      durationMs: performance.now() - t0,
    }),
  )

  checks.push(
    check({
      id: 'coupon-no-real-payment',
      name: 'No real payment check',
      category: 'coupon',
      status: flags.mockPaymentsOnly && flags.qrCouponEnabled ? 'PASS' : 'WARN',
      message:
        flags.mockPaymentsOnly && flags.qrCouponEnabled
          ? 'mock only — no real payment / QR payment / points'
          : 'flags may block coupon demo',
      durationMs: performance.now() - t0,
    }),
  )

  checks.push(
    check({
      id: 'coupon-oneai-flag',
      name: 'OneAI event flag',
      category: 'coupon',
      status: flags.oneAiEventEnabled ? 'PASS' : 'WARN',
      message: `restaurant.oneai_event.enabled=${flags.oneAiEventEnabled}`,
      durationMs: performance.now() - t0,
    }),
  )

  const hqSnap = buildHqCouponOpsSnapshot({
    coupons: wallet,
    campaigns: mockEventCampaigns,
    auditEntries: [],
  })
  const counts = buildCouponStatusCounts(wallet)
  const hqOk =
    hqSnap.dataSource === 'localStorage' &&
    hqSnap.totalCoupons === wallet.length &&
    counts.issued + counts.used + counts.expired + counts.canceled === wallet.length

  checks.push(
    check({
      id: 'hq-coupon-ops-snapshot',
      name: 'HQ coupon ops snapshot',
      category: 'coupon',
      status: hqOk ? 'PASS' : 'FAIL',
      message: hqOk
        ? `HQ panel ready: ${hqSnap.totalCoupons} coupons, ${hqSnap.campaignStats.length} campaigns`
        : 'HQ ops aggregation mismatch',
      durationMs: performance.now() - t0,
    }),
  )

  checks.push(...runCouponRiskGuardChecks())

  return checks
}
