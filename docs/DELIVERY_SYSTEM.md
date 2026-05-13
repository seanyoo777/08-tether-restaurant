# Delivery System — Tether Restaurant Platform

This document covers **delivery and logistics** from a product and architecture perspective. The current codebase ships a **rider mock surface** only — no dispatch API, mapping, or courier integration.

---

## 1. Current State (Mock / Demo)

| Component | Route | Notes |
|-----------|-------|-------|
| **Rider app shell** | `/rider` | Standalone layout; task cards and actions are UI-only. |
| **Customer order flow** | See [ORDER_FLOW.md](./ORDER_FLOW.md) | Mock “배차(선택)” step in payment wizard; no live dispatch. |

**No real payment execution** applies to delivery fees and rider payouts until treasury and contracts are integrated.

---

## 2. Target Architecture (Scalable)

```text
         ┌─────────────────┐
         │  Order Service  │
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
 Kitchen      Dispatch      Customer
 (store)    (assignment)     (tracking)
```

| Layer | Responsibility |
|-------|----------------|
| **Order state machine** | Single source of truth for `accepted` → `cooking` → `out_for_delivery` → `delivered`. |
| **Dispatch adapter** | In-house riders, 3PL, or hybrid; plug behind `DispatchPort` (future). |
| **Location / ETA** | Map and ETA widgets consume adapter responses; mock returns static ETAs today. |
| **Notifications** | Push/SMS templates keyed by order id and role (customer vs rider). |

---

## 3. Customer vs Rider vs Store

| Actor | Primary concern |
|-------|-----------------|
| **Customer** | ETA, status phase (“배달중”), contact/support — see [CUSTOMER_APP.md](./CUSTOMER_APP.md). |
| **Store** | Prep time, handoff to rider or pickup shelf — see [STORE_ADMIN.md](./STORE_ADMIN.md). |
| **Rider** | Task list, navigation, proof of delivery — `/rider` to be backed by APIs later. |

**Separation rule:** Customer app does **not** embed rider tools; reduces accidental privilege exposure and keeps bundles smaller.

---

## 4. Mobile-First Rider UX (Guidelines)

- Large tap targets for **완료** / **지도** style actions.
- One-hand friendly card stack for active deliveries.
- Offline-tolerant patterns (queue actions) — future when native or PWA hardening ships.

---

## 5. Integration with Ecosystem

- **Unified admin** may observe fleet-level KPIs and SLA breaches.
- **OneAI** could suggest prep/dispatch timing from historical mock → later real data (adapter-gated).

---

## 6. Related Documents

- [ORDER_FLOW.md](./ORDER_FLOW.md)
- [MOBILE_UI.md](./MOBILE_UI.md)
- [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md)
