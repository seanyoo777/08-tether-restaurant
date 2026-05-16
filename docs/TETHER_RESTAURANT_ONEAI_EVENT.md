# Tether Restaurant — OneAI Event Hub (mock bridge)

## Purpose

Prepare **08 Tether Restaurant** for future **OneAI (3) Event Hub** integration without live APIs.

## Mock adapter

`src/integration/oneaiEventHub.ts`

- `mockOneAiEventHubEntries` — event catalog
- `mockIssueCouponFromEventHub(entry)` — 당첨 mock → `RestaurantCoupon` + `hubRef`
- Product id: `PRODUCT_IDS.oneAi` from `productContext.ts`

## UI

- `OneAiLogo` component (gradient badge — not official asset)
- `/events/oneai` — 당첨 시뮬레이션 → wallet에 `coupon.generated` audit → coupon detail

## Boundaries

| In scope | Out of scope |
|----------|----------------|
| Mock win + coupon issuance | Real OneAI API |
| Logo / hub branding slot | Live streaming auth |
| Audit trail append | Real settlement |

## Related docs

- [TETHER_RESTAURANT_COUPON.md](./TETHER_RESTAURANT_COUPON.md)
- [SELF_TEST.md](./SELF_TEST.md)
