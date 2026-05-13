# Order Flow — Tether Restaurant Platform

This document describes the **end-to-end order lifecycle** in mock/demo mode. No real payment execution, wallet signing, or PSP APIs are connected.

---

## 1. Principles

| Principle | Description |
|-----------|-------------|
| **Mock only** | All checkout, USDT “holding,” and settlement steps are simulated in the client. |
| **No payment execution** | No on-chain transactions, card captures, or third-party payment calls. |
| **Preserve architecture** | Flow is implemented as: UI → Zustand stores → mock data; adapters can replace stores later. |
| **Traceability** | Orders carry IDs suitable for future customer-support and dispute workflows. |

---

## 2. High-Level Flow

```text
Discovery → Menu → Cart → Checkout → Payment (mock hold) → Order detail / history
     ↑                                              │
     └──────────── Reorder (completed orders) ─────┘
```

1. **Discovery**: Home, search, or deep link (`/s/:storeId`, `/qr/:storeId`).
2. **Menu**: Customer adds lines to the cart (single-store cart).
3. **Checkout**: Review totals and payment rail slots (USDT hold active; others reserved).
4. **Payment (mock)**: Draft stored in `checkoutDraftStore`; multi-step UI; on completion → `liveOrderStore` + navigate to `/orders/:orderId`.
5. **Post-order**: Order list (`/orders`), detail, customer-phase progress UI, optional reorder.

---

## 3. Data Artifacts (Current Implementation)

| Artifact | Store / module | Purpose |
|----------|----------------|---------|
| **Cart lines** | `cartStore` | Working cart; `reorderFromOrder` replaces cart for the target store. |
| **Checkout draft** | `checkoutDraftStore` | Short-lived payload for `/pay/:draftId`. |
| **Live order** | `liveOrderStore` | Session orders after mock payment. |
| **Seeded orders** | `mock/orders.ts` | Demo list merged with live orders on `/orders`. |

---

## 4. Status Model

- **Internal statuses** (`OrderStatus` in `mock/orders.ts`): e.g. `pending_payment`, `paid_holding`, `accepted`, `cooking`, `out_for_delivery`, `delivered`, `cancelled`.
- **Customer-facing phases** (`domain/orderDisplay.ts`): 주문접수 → 조리중 → 배달중 → 완료 (and **취소**). Used for badges and the progress track on order detail.

Mapping is intentional: admin and analytics can keep granular states while the customer app stays simple.

---

## 5. Future Extensions (Adapter-Ready)

| Extension | Suggested approach |
|-----------|-------------------|
| Real USDT hold / release | `PaymentAdapter` interface; swap mock for contract or custodial API behind the same draft → confirm step. |
| Card / wallets | Already modeled as `PaymentRail` in `integration/productContext.ts`; enable rails without changing route shape. |
| Server source of truth | Replace Zustand persistence with API + optimistic UI; keep route and screen contracts. |
| Notifications | Emit events on state transitions; connect push provider later. |

---

## 6. Related Documents

- [CUSTOMER_APP.md](./CUSTOMER_APP.md) — Customer surfaces and navigation.
- [STORE_ADMIN.md](./STORE_ADMIN.md) — Store-side order handling (mock).
- [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md) — System layers and integration slots.
