# Tether Restaurant — Offline Coupon / Event (mock MVP)

## Goals

- **오프라인** 쿠폰·이벤트 mock (매장 방문·캠페인 시나리오)
- **Additive only** — 기존 주문·결제·HQ 기능 유지
- **No** real payment, QR payment, points settlement, external API

## Coupon model

| Field | Description |
|-------|-------------|
| `couponId` | Unique id |
| `status` | `issued` \| `used` \| `expired` \| `canceled` (+ legacy `unused`/`reserved`/`redeemed` → migrate on load) |
| `qrPayload` | `tether-restaurant:offline-mock-coupon:v1:…` |
| `validUntil` | Expiry (effective `expired` when past) |
| `campaignId` | Optional offline campaign ref |

### Status flow (mock)

```
issued → used     (applyUsedMock / redeemMock)
issued → canceled (applyCanceledMock)
* → expired       (time-based, effective status)
```

## Event campaign card

- Seed: `src/mock/eventCampaigns.ts`
- UI: `EventCampaignCard` on `/coupons`
- Action: `issueFromCampaign` → `coupon.generated` audit → navigate to detail

## localStorage

- Key: `tether-restaurant.offline-coupon-wallet.v1`
- Module: `src/store/couponWalletPersistence.ts`
- Wallet store persists on every mutation (`couponWalletStore.ts`)

## Audit (append-only)

| Action | When |
|--------|------|
| `coupon.generated` | Campaign / OneAI issue |
| `coupon.claimed` | Legacy reserve (issued hold) |
| `coupon.redeemed.mock` | Used (offline) |
| `coupon.canceled.mock` | Canceled |
| `coupon.saved.mock` | Save toggle |
| `coupon.risk.use_cleared` | Issued coupon — use allowed (mock) |
| `coupon.risk.duplicate_use` | Used coupon — duplicate use attempt (FAIL) |
| `coupon.risk.use_expired` | Expired coupon use attempt (FAIL) |
| `coupon.risk.use_canceled` | Canceled coupon use attempt (FAIL) |
| `coupon.risk.abnormal_issuance` | Campaign issued count over mock threshold (WARN/FAIL) |

## Risk / Abuse Guard (mock)

- Module: `src/domain/couponRiskGuard.ts`
- Actions: `src/store/couponRiskGuardActions.ts` (`appendCouponRiskAudit` — `coupon.risk.*` only)
- Wallet: `attemptUseWithRiskGuard`, `applyUsedMock` (guard before `used`), `issueFromCampaign` (post-issue issuance check)
- HQ UI: `CouponRiskGuardCard` on `/admin/hq/coupon-ops`
- Customer: `CouponDetailPage` Risk Guard banner + **사용 시도** on non-issued coupons

### Mock thresholds

| Signal | WARN | FAIL |
|--------|------|------|
| Issued coupons per campaign | ≥ 4 | ≥ 8 |

No real payment, QR payment, points, or external API.

## Self-test

`runCouponChecks()` + `runCouponRiskGuardChecks()` — schema, QR placeholder, offline transitions, risk use/duplicate/expired/canceled, report builder, `coupon.risk.*` prefix.

## Routes

| Path | Screen |
|------|--------|
| `/coupons` | Wallet + campaigns |
| `/coupons/:couponId` | QR + use/cancel |
| `/coupons/help` | Help |
| `/events/oneai` | OneAI Hub mock (optional) |
| `/admin/hq/coupon-ops` | **HQ 쿠폰 운영 관리** (발급 현황·상태별 카운트·캠페인 통계·audit·Self-Test) |
| `/admin/hq/campaigns` | 쿠폰·이벤트 stub + 운영 패널 링크 |

## HQ 쿠폰 운영 패널

- Module: `src/domain/hqCouponOps.ts`, `src/pages/hq/HqCouponOpsPage.tsx`
- Data: `couponWalletStore` + `loadPersistedCouponWallet` (localStorage), `auditTrailStore` (세션 append-only)
- UI: **Risk Guard** 카드, 발급 요약, 상태별 카운트, 캠페인별 mock 통계, 최근 `coupon.*` / `coupon.risk.*` audit, **Mock only** 배지, `DiagnosticsPanel` + `runCouponSelfTestSuite()`
- Actions: **localStorage 새로고침**, 쿠폰 Self-Test, Self-Test Center 링크

## Related

- [TETHER_RESTAURANT_COUPON.md](./TETHER_RESTAURANT_COUPON.md) (earlier QR coupon notes)
- [TETHER_RESTAURANT_ONEAI_EVENT.md](./TETHER_RESTAURANT_ONEAI_EVENT.md)
- [SELF_TEST.md](./SELF_TEST.md)

## CLI

```bash
npm run lint
npm run test
npm run build
```
