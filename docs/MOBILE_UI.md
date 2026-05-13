# Mobile UI — Tether Restaurant Platform

Design and implementation notes for a **mobile-first** restaurant platform. Desktop is supported as a wider viewport of the same components unless otherwise noted.

---

## 1. Layout Shell

| Pattern | Implementation |
|---------|----------------|
| **Max width** | Customer shell uses `max-w-md` centered column for readability and thumb reach. |
| **Safe areas** | `env(safe-area-inset-bottom)` on body (see `index.css`) and tab bar padding. |
| **Sticky chrome** | `PageHeader` sticky top; checkout/payment hide bottom tabs. |

---

## 2. Navigation

- **Primary:** Bottom tab bar — five equal-weight destinations; active state uses accent color.
- **Secondary:** Back chevron in `PageHeader` to logical parent (`/orders` from order detail, etc.).
- **Deep links:** `/s/*`, `/qr/*` bypass tab chrome for fast entry.

---

## 3. Visual System

- **Theme tokens** in Tailwind `@theme` (`index.css`): background, surface, border, accent (USDT-aligned green), danger, muted text.
- **Typography:** System / Pretendard stack; `tabular-nums` for prices and order ids.
- **Density:** Cards with clear separation; avoid cramming admin tables into customer flows.

---

## 4. Components (Reusable)

Shared building blocks under `src/components/`:

- `Card`, `PageHeader`, `TrButton`, `MockBanner`
- Order UX: `OrderCustomerBadge`, `OrderProgressTrack`

**Principle:** Reuse presentation primitives; keep **domain** in `src/domain/` and **data** in `src/mock/` or future API layer.

---

## 5. Accessibility and Quality

- Minimum touch target ~44px height on primary actions (`TrButton` default min height).
- Modal dialogs: backdrop dismiss, `role="dialog"`, primary action to close for support mock.
- Prefer semantic headings inside each screen for screen reader structure.

---

## 6. Alignment with Project Rules

Per **AGENTS.md** and **.cursorrules**:

- UI/UX priority; extend layouts without breaking existing routes.
- After structural UI changes, update **docs** and **MASTER_MANUAL.md** per repository policy.

---

## 7. Related Documents

- [CUSTOMER_APP.md](./CUSTOMER_APP.md)
- [STORE_ADMIN.md](./STORE_ADMIN.md)
- [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md)
