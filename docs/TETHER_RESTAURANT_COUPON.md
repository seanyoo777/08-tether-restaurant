# Tether Restaurant — QR / Event Coupon (mock MVP)

## Scope

- Mobile QR coupon wallet (mock placeholder QR — **not real payment**)
- Restaurant event coupons and BJ event tags
- Status: `unused` → `reserved` → `redeemed` (mock) / `expired`
- Append-only audit: `coupon.generated`, `coupon.claimed`, `coupon.redeemed.mock`

## Data model

| Field | Description |
|-------|-------------|
| `couponId` | Unique id |
| `qrPayload` | `tether-restaurant:mock-coupon:v1:{id}@{storeId}` |
| `validUntil` | Expiry ISO timestamp |
| `status` | Stored status; UI uses `effectiveCouponStatus()` for expiry |
| `bjEventTag` | Optional BJ event label |
| `oneAiEventId` | Optional OneAI hub reference |

## Code map

| Path | Role |
|------|------|
| `src/domain/coupon.ts` | Types, transitions, QR payload |
| `src/mock/coupons.ts` | Seed coupons |
| `src/store/couponWalletStore.ts` | Wallet, save, reserve/redeem mock |
| `src/components/coupon/*` | Card, QR placeholder, swipe deck, OneAI logo |
| `src/pages/customer/Coupon*.tsx` | Wallet, detail, help |

## Routes (customer)

| Path | Screen |
|------|--------|
| `/coupons` | Coupon wallet |
| `/coupons/:couponId` | Large QR + actions |
| `/coupons/help` | Help Center |
| `/events/oneai` | OneAI Event Hub mock |

## Feature flags

- `restaurant.qr_coupon.enabled` → `flags.qrCouponEnabled`
- `restaurant.oneai_event.enabled` → `flags.oneAiEventEnabled`

## Self-test

`runCouponChecks()` in `src/selfTest/couponChecks.ts` — schema, QR placeholder, transitions, no real payment.
