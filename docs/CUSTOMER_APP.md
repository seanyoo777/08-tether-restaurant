# Customer App — Tether Restaurant Platform

The **customer application** is optimized for **mobile-first** use: ordering and payment simulation from the customer’s phone, without kiosk hardware.

---

## 1. Scope and Boundaries

| In scope | Out of scope (customer UI) |
|----------|----------------------------|
| Browse stores, menus, cart, checkout, mock USDT hold | Store admin, HQ admin, rider consoles |
| Order history and order detail | Links or CTAs that expose `/admin/*` or `/rider` |
| Profile placeholder (`/me`) | Real KYC, chat, or support ticketing APIs |

**Rule:** Customer screens must **not** surface administrator or rider entry points. Operations staff use **dedicated URLs** documented in [STORE_ADMIN.md](./STORE_ADMIN.md) and [DELIVERY_SYSTEM.md](./DELIVERY_SYSTEM.md).

---

## 2. Information Architecture

### 2.1 Bottom Tab Bar (`CustomerLayout`)

Fixed five tabs (mobile-first, `max-w-md` shell):

| Tab | Route | Role |
|-----|-------|------|
| Home | `/` | Featured / nearby stores (mock list) |
| Search | `/search` | Text filter over mock catalog |
| Cart | `/cart` | Line items, qty, totals, link to checkout |
| Orders | `/orders` | Merged mock + session orders, newest first |
| Profile | `/me` | Placeholder profile (mock) |

Checkout and payment routes **hide** the tab bar to reduce distraction during payment simulation.

### 2.2 Stack Routes (under customer layout)

- Store detail: `/stores/:storeId`
- Menu: `/stores/:storeId/menu`
- Checkout: `/checkout`
- Mock payment: `/pay/:draftId`
- Order detail: `/orders/:orderId`

See [ROUTES.md](./ROUTES.md) for the full table.

---

## 3. Deep Links and QR

| Path | Behavior |
|------|----------|
| `/s/:storeId` | Redirect to store **detail** if store exists; else search. |
| `/qr/:storeId` | Redirect to **menu** for table-side / QR ordering scenarios. |

These routes live **outside** the tab layout shell so redirects stay lightweight and bookmarkable.

---

## 4. State and Reusability

- **Cart**: `cartStore` — single store per cart; `reorderFromOrder` aligns with “same menu again” for completed orders.
- **Orders**: `liveOrderStore` + `mockOrders` — list/detail merge keeps UI stable when backend exists.
- **Display logic**: `domain/orderDisplay.ts` — separates **pipeline status** from **customer-friendly phases**.

---

## 5. UX Principles (AGENTS.md / .cursorrules)

- **Extend, don’t remove** features when iterating.
- **UI/UX first** — clarity of price, status, and next step over density.
- **Mock/demo only** — banners and copy should set expectations (no real money movement).

---

## 6. Ecosystem Alignment

Shared concepts for future **unified admin** and **OneAI** bridges live under `src/integration/` (e.g. product identifiers). The customer app stays thin: presentation + local state until real APIs are adopted.

---

## 7. Related Documents

- [ORDER_FLOW.md](./ORDER_FLOW.md)
- [MOBILE_UI.md](./MOBILE_UI.md)
- [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md)
