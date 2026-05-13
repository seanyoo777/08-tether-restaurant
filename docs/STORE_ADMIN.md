# Store Admin — Tether Restaurant Platform

The **store admin** experience is for **merchant operators** (owner or staff) using a **phone or desktop browser** — no dedicated kiosk app is required for MVP validation.

---

## 1. Access Model

| Environment | Entry |
|-------------|--------|
| **Base URL** | `/admin/store` |
| **Sub-routes** | `/admin/store/menus`, `/admin/store/orders`, `/admin/store/settlement` |

**Separation:** Store admin is **not** linked from the customer tab bar. Operators bookmark or receive the URL through your own ops channel (QR poster for staff, internal docs, etc.).

---

## 2. Responsibilities (Target Product)

| Area | MVP (mock) | Future |
|------|------------|--------|
| **Dashboard** | Static KPI-style cards | Real-time order counts, revenue |
| **Menu management** | List + edit affordances (non-persisting) | CRUD + sync + moderation hooks |
| **Order intake** | List from `mockOrders` + status labels | WebSocket / push, accept-reject, prep timers |
| **Settlement** | Mock payout rows | Payout batches, fees, tax exports |

---

## 3. Layout Pattern

`StoreAdminLayout` provides:

- Sticky **page header** with contextual title.
- **Horizontal segment control** for sub-pages on small screens.
- Link to **HQ admin** for demo convenience (`/admin/hq`) — acceptable **between admin apps**, not from customer UI.

---

## 4. Data and Authority (Scalable Structure)

Today, store admin reads the same **mock** sources as demos (`mock/orders.ts`, etc.). A scalable split:

```text
Customer API (public)     Store API (authenticated)     HQ API (platform)
        │                           │                           │
        └───────────┬───────────────┴───────────────┬───────────┘
                    │                               │
              Order projections              Policy / fees / disputes
```

Implement **role-based access** at the API layer later; the UI route tree can remain stable.

---

## 5. Principles

- **Preserve** existing routes and screens; extend with real APIs behind adapters.
- **No real payment** configuration in store admin until PSP / treasury integration is explicitly scoped.
- **Mobile-first**: touch targets and horizontal scroll for nav chips match customer app quality bar.

---

## 6. Related Documents

- [ORDER_FLOW.md](./ORDER_FLOW.md)
- [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md)
- [DELIVERY_SYSTEM.md](./DELIVERY_SYSTEM.md) — rider handoff when delivery is enabled.
