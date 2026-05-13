# Platform Architecture — Tether Restaurant Platform

High-level architecture for **08-tether-restaurant**: a **scalable restaurant platform** slice inside the broader tetherget-mvp ecosystem. **Mock/demo mode only**; **no real payment execution**.

---

## 1. Architectural Goals

| Goal | How it is expressed in code today |
|------|-----------------------------------|
| **Mobile-first** | `CustomerLayout`, responsive tokens, tab-first IA. |
| **Reusable** | Shared components; `domain/` for pure rules; `integration/` for cross-product types. |
| **Separated surfaces** | Customer (`/`), store admin (`/admin/store`), HQ (`/admin/hq`), rider (`/rider`). |
| **Adapter-ready** | Payment rails and future APIs behind conceptual ports (stores until interfaces are formalized). |
| **Ecosystem-compatible** | `productContext.ts` — product ids and admin session shape for TetherGet / OneAI / UTE alignment. |

---

## 2. Layered View

```text
┌──────────────────────────────────────────────────────────────┐
│                     Presentation (React)                      │
│  pages/customer │ pages/store-admin │ pages/hq │ pages/rider │
└─────────────────────────────┬────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────┐
│              Client state (Zustand) + domain (pure TS)        │
│  cartStore │ checkoutDraftStore │ liveOrderStore │ domain/*   │
└─────────────────────────────┬────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────┐
│           Data: mock modules (replaceable with adapters)      │
│  mock/catalog │ mock/orders │ mock/settlement                 │
└─────────────────────────────┬────────────────────────────────┘
                              │
                    [ Future: HTTP / WS / Web3 ]
```

**Preserve existing architecture:** new capabilities should add modules or adapters, not rewrite the router tree without migration plan.

---

## 3. Role and Surface Matrix

| Role | Base path | Layout module |
|------|-----------|---------------|
| Customer | `/`, `/orders`, … | `CustomerLayout` |
| Store operator | `/admin/store` | `StoreAdminLayout` |
| Platform operator | `/admin/hq` | `HqAdminLayout` |
| Rider | `/rider` | Inline shell in page |

Authentication is **not** implemented in MVP; routes are **capability placeholders** for future SSO / RBAC.

---

## 4. Integration Slots (Future)

| Slot | Purpose |
|------|---------|
| **Product / tenant context** | `integration/productContext.ts` — `ProductId`, `AdminRole`, `UnifiedAdminSession`. |
| **Payments** | `PaymentRail` types; checkout UI shows USDT hold + disabled future rails. |
| **Notifications** | Event hooks after order state changes (to be wired to push provider). |
| **OneAI / analytics** | Read-only exports or webhooks from order pipeline (future). |

---

## 5. Build and Quality Gate

```bash
npm run build
npm run lint
```

Per **AGENTS.md** and **.cursorrules**: both must pass before merge; **no real trading/payment API** connections in this repo’s MVP scope.

---

## 6. Documentation Set

| Document | Focus |
|----------|--------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Repo folder map |
| [ROUTES.md](./ROUTES.md) | URL reference |
| [ORDER_FLOW.md](./ORDER_FLOW.md) | Order lifecycle |
| [CUSTOMER_APP.md](./CUSTOMER_APP.md) | Customer IA |
| [STORE_ADMIN.md](./STORE_ADMIN.md) | Store back office |
| [DELIVERY_SYSTEM.md](./DELIVERY_SYSTEM.md) | Logistics / rider |
| [MOBILE_UI.md](./MOBILE_UI.md) | Mobile UI system |

---

## 7. Governance

When **structure**, **folders**, **systems**, or **integrations** change:

1. Update **`MASTER_MANUAL.md`** (monorepo root) — section **8번 Tether Restaurant**.
2. Update **`docs/*.md`** — at minimum this file and [README.md](./README.md) index.

See [AGENTS.md](../AGENTS.md).
