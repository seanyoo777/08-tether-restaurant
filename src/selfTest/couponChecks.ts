import {
  buildQrPlaceholderPayload,
  canTransitionCoupon,
  effectiveCouponStatus,
  transitionCouponStatus,
} from '../domain/coupon'
import { mockCoupons } from '../mock/coupons'
import { useFeatureFlagsStore } from '../store/featureFlagsStore'
import { useCouponWalletStore } from '../store/couponWalletStore'
import type { SelfTestCheck } from './types'

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
  const schemaOk =
    !!sample &&
    typeof sample.couponId === 'string' &&
    typeof sample.qrPayload === 'string' &&
    typeof sample.validUntil === 'string' &&
    ['unused', 'reserved', 'redeemed', 'expired'].includes(sample.status)

  checks.push(
    check({
      id: 'coupon-schema',
      name: 'Coupon schema check',
      category: 'coupon',
      status: schemaOk ? 'PASS' : 'FAIL',
      message: schemaOk
        ? 'couponId / qrPayload / validUntil / status OK'
        : 'mock coupon seed invalid',
      durationMs: performance.now() - t0,
    }),
  )

  const payload = buildQrPlaceholderPayload('test-cpn', 'store-test')
  const qrOk = payload.startsWith('tether-restaurant:mock-coupon:')
  checks.push(
    check({
      id: 'coupon-qr-placeholder',
      name: 'QR placeholder check',
      category: 'coupon',
      status: qrOk ? 'PASS' : 'FAIL',
      message: qrOk ? 'mock QR payload prefix OK' : 'QR payload format mismatch',
      durationMs: performance.now() - t0,
    }),
  )

  const transitionOk =
    canTransitionCoupon('unused', 'reserved') &&
    canTransitionCoupon('reserved', 'redeemed') &&
    !canTransitionCoupon('redeemed', 'unused')
  const transitioned = sample
    ? transitionCouponStatus({ ...sample, status: 'unused' }, 'reserved')
    : null
  checks.push(
    check({
      id: 'coupon-status-transition',
      name: 'Status transition check',
      category: 'coupon',
      status: transitionOk && transitioned ? 'PASS' : 'FAIL',
      message: transitionOk
        ? 'unused→reserved→redeemed rules OK'
        : 'invalid status transition rules',
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

  const expiredSample = wallet.find((c) => effectiveCouponStatus(c) === 'expired')
  checks.push(
    check({
      id: 'coupon-expired-effective',
      name: 'Expired effective status',
      category: 'coupon',
      status: expiredSample ? 'PASS' : 'WARN',
      message: expiredSample
        ? `expired: ${expiredSample.couponId}`
        : 'no expired coupon in seed (optional)',
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
          ? 'mockPaymentsOnly + qrCouponEnabled (no real QR payment)'
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

  return checks
}
