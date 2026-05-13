# Tether Restaurant (8번) — Structure Audit (Phase 1–4)

**Scope:** `08-tether-restaurant` only.  
**Assumption:** This app is **independent** from 1–7 trading/investment apps (no shared runtime dependency in `package.json` or `src/` imports to sibling folders).

**Constraints verified for this audit:**

| Rule | Status |
|------|--------|
| No copy of 01 TetherGet / 02 TGX-CEX code in `src/` | No imports from sibling `01-*` … `07-*` paths detected |
| No trading / HTS / chart / wallet / ledger features added | None in codebase |
| No DB / API / real payment wiring | Zustand + `mock/*` only |

---

## 1. Current Folder Structure (Summary)

```text
08-tether-restaurant/
├── public/
├── src/
│   ├── App.tsx                 # Root route table
│   ├── main.tsx                # BrowserRouter entry
│   ├── index.css               # Tailwind @theme (tr-* tokens)
│   ├── vite-env.d.ts
│   ├── layouts/                # CustomerLayout, StoreAdminLayout, HqAdminLayout
│   ├── pages/
│   │   ├── customer/           # 고객앱 (탭 셸 내부 + 일부 전용)
│   │   ├── store-admin/        # 점주(가게) 관리
│   │   ├── hq/                 # 본사·플랫폼 관리 (hqScreens.tsx)
│   │   └── rider/              # 기사(라이더) 화면
│   ├── components/             # Shared UI + order UX widgets
│   ├── domain/                 # Pure TS: orderDisplay, orderSnapshot (**mergeMockAndLiveOrderSnapshots**)
│   ├── mock/                   # catalog, orders, settlement seeds
│   ├── store/                  # Zustand: cart, checkout draft, live orders
│   └── integration/            # Cross-product types (productContext) — no network
├── docs/
├── package.json
├── vite.config.ts
├── tsconfig*.json
└── eslint.config.js
```

**Scale:** 38 `src/**/*.{ts,tsx}` files (single SPA, no packages/workspace).

---

## 2. Routing Structure

| Zone | Prefix / path | Layout | Notes |
|------|----------------|----------|--------|
| **Deep link** | `/s/:storeId`, `/qr/:storeId` | None | `Navigate` to customer store or menu |
| **Customer** | `/`, `/search`, `/stores/*`, `/cart`, `/checkout`, `/pay/:draftId`, `/orders`, `/orders/:orderId`, `/me` | `CustomerLayout` | Bottom tabs; hide tabs on `/checkout`, `/pay/*` |
| **Store admin** | `/admin/store`, `.../menus`, `.../orders`, `.../settlement` | `StoreAdminLayout` | 점주 |
| **HQ / platform admin** | `/admin/hq` + subpaths | `HqAdminLayout` | 정산·정책·RBAC 등 스텁 화면 |
| **Rider** | `/rider` | Inline in page | 기사 |
| **Fallback** | `*` | → `/` | |

**Single source of truth:** `src/App.tsx` — all routes declared explicitly (no file-based router).

---

## 3. Actor / Surface Separation

| 구성 (요청 용어) | Route / module | 고객 UI 노출 |
|------------------|----------------|--------------|
| **고객앱** | `pages/customer/*`, `CustomerLayout` | 탭만 |
| **식당결제·주문** | Checkout, `PaymentHoldPage`, `Order*`, stores | 고객 영역 |
| **배달앱 (고객 추적 관점)** | Order phase UI, delivery fields on order detail | 고객 영역 |
| **점주관리** | `/admin/store/*` | **비노출** (URL 직접) |
| **기사관리** | `/rider` | **비노출** (고객 탭 없음) |
| **정산/관리자** | `/admin/hq/*`, store settlement | **비노출** |

Cross-link today: `StoreAdminLayout` → 링크 to HQ; `RiderHomePage` → 링크 to sample customer order (`/orders/ord_demo_1`) for demo. **Not** trading/HTS.

---

## 4. Order / Payment / Delivery / Settlement — File Inventory

### 4.1 Order (customer + shared mock)

| File | Role |
|------|------|
| `mock/orders.ts` | `OrderStatus`, `OrderLineItem`, `MockOrder`, `mockOrders`, `getOrderById`, `orderStatusLabel` |
| `store/liveOrderStore.ts` | Post–mock-payment session orders |
| `store/checkoutDraftStore.ts` | Pre-payment checkout payload |
| `domain/orderDisplay.ts` | Internal status → customer phase (badge / progress) |
| `domain/orderSnapshot.ts` | `OrderSnapshot`, mappers, **`mergeMockAndLiveOrderSnapshots`** (고객·점주·HQ 공통 병합) |
| `pages/customer/OrderHistoryPage.tsx` | List |
| `pages/customer/OrderStatusPage.tsx` | Detail, reorder, support modal |
| `components/OrderCustomerBadge.tsx` | Customer phase badge |
| `components/OrderProgressTrack.tsx` | Progress UI |
| `pages/store-admin/StoreOrdersPage.tsx` | 점주 주문 목록 (**Phase 3:** `OrderSnapshot` + mock/live 병합) |
| `pages/hq/hqScreens.tsx` | **`HqOrdersPage` (Phase 4:** 스냅샷 목록 + 집계 테이블), 기타 HQ 스텁 |

### 4.2 Payment (mock only)

| File | Role |
|------|------|
| `pages/customer/CheckoutPage.tsx` | Totals, `PaymentRail` display |
| `pages/customer/PaymentHoldPage.tsx` | Multi-step mock USDT hold |
| `integration/productContext.ts` | `PaymentRail`, `DEFAULT_ACTIVE_RAIL` |
| `pages/hq/hqScreens.tsx` | `HqPaymentsPage` stub |

### 4.3 Delivery / rider

| File | Role |
|------|------|
| `pages/rider/RiderHomePage.tsx` | 기사 작업 카드 (mock) |
| `docs/DELIVERY_SYSTEM.md` | Target architecture (doc) |
| *(logic)* | No dispatch service in `src/` |

### 4.4 Settlement

| File | Role |
|------|------|
| `mock/settlement.ts` | `mockSettlementRows` |
| `pages/store-admin/StoreSettlementPage.tsx` | 가게 정산 뷰 |
| `pages/hq/hqScreens.tsx` | `HqSettlementPage` 등 |

### 4.5 Restaurant catalog

| File | Role |
|------|------|
| `mock/catalog.ts` | `Store`, `MenuItem`, getters |
| `store/cartStore.ts` | Cart + `reorderFromOrder` (uses `getMenusForStore`) |

---

## 5. Common vs Restaurant-Specific Split

### 5.1 공통화 가능 후보 (향후 패키지 / 모노레포 공유 시)

문서·타입 수준에서만 겹칠 수 있는 영역 (**지금은 08 전용 구현**, 코드 공유 없음):

| Domain | Current location | Notes |
|--------|------------------|--------|
| **auth / session** | Not implemented | `UnifiedAdminSession` in `productContext.ts` is a **placeholder** only |
| **users / roles** | `AdminRole`, `ProductId` in `integration/productContext.ts` | Names align with ecosystem docs; no SSO |
| **admin shell patterns** | `HqAdminLayout`, `StoreAdminLayout` | Sidebar/chips pattern could become a shared layout lib later |
| **notification** | HQ stub `HqNotificationsPage` | No provider |
| **settlement log / audit** | HQ stubs, mock settlement rows | No append-only log store |

**Recommendation:** If a shared package is introduced later, **move only** `integration/productContext.ts`-style contracts and auth DTOs; keep **order line items, menu, store** in restaurant-specific packages.

### 5.2 테더식당 전용 유지 (must stay restaurant-scoped)

| Area | Files / concepts |
|------|------------------|
| **restaurant / menu** | `mock/catalog.ts`, `StoreMenuManagePage.tsx` |
| **order** | `mock/orders.ts`, `liveOrderStore`, order pages, `orderDisplay.ts`, **`orderSnapshot.ts`** |
| **payment (restaurant checkout)** | `CheckoutPage`, `PaymentHoldPage`, `PaymentRail` for F&B rails |
| **delivery / rider** | `RiderHomePage.tsx`, future `dispatch/*` |
| **store admin** | `pages/store-admin/*`, `StoreAdminLayout` |
| **restaurant settlement** | `mock/settlement.ts`, `StoreSettlementPage`, HQ settlement stub |

---

## 6. Risk Assessment (Imports, Types, Entanglement)

### 6.1 Low risk (verified)

- **No sibling repo imports** in `src/` (grep: no `../01-`, `../02-`, etc.).
- **Dependencies:** React, Vite, Tailwind, React Router, Zustand only — no web3/trading/chart libs.
- **Single `OrderStatus` source:** `mock/orders.ts` imported by `liveOrderStore`, `orderDisplay`, pages.

### 6.2 Medium risk (maintain discipline)

| Risk | Detail | Mitigation |
|------|--------|------------|
| **`hqScreens.tsx` monolith** | Many HQ pages in one file | Split by domain folder when any page grows real logic |
| **`LiveOrder` vs `MockOrder` shape drift** | 필드명 차이(`customerLabel` vs 선택 필드, `totalKrw` vs 표시용 `totalAmount` 등) | **Phase 2:** `OrderSnapshot` + 순수 mapper로 고객 주문 목록/상세에서 단일 표현 사용 |
| **`orderStatusLabel` vs customer phases** | Admin uses raw labels; customer uses `orderDisplay` | Keep both; document mapping (already in `orderDisplay.ts`) |
| **Rider → customer deep link** | `/orders/ord_demo_1` | Acceptable for demo; remove or gate behind `import.meta.env.DEV` if production-hardening |

### 6.3 High risk (do **not** do without explicit product approval)

| Risk | Why |
|------|-----|
| Importing **01/02/07** source or shared **wallet/ledger** | Violates platform separation; scope creep into trading |
| Adding **real** `fetch`/Web3 in payment path | Violates mock-first / no real payment rule |
| Merging **customer and admin** route trees | Security and bundle size; breaks IA separation |

### 6.4 Naming / path ambiguity (low)

- Customer `/orders` vs store admin `/admin/store/orders` — different prefixes; OK.
- `ProductId` string `product:ute` is **ecosystem identifier**, not a runtime import of UTE.

---

## 6A. Phase 2 — OrderSnapshot (타입 정합, 2026-05)

**Goal:** Reduce `MockOrder` / `LiveOrder` field-name drift for **customer** order list + detail without changing routing, payment steps, or `OrderStatus` transitions.

| Deliverable | Location |
|-------------|----------|
| `OrderSnapshot` type | `src/domain/orderSnapshot.ts` |
| Mappers | `mockOrderToSnapshot`, `liveOrderToSnapshot` |
| Derived (read-only) | `deriveSnapshotPaymentStatus`, `deriveSnapshotDeliveryStatus` — pure functions from existing `OrderStatus` |
| Consumers | `OrderHistoryPage`, `OrderStatusPage`, `StoreOrdersPage`, **`HqOrdersPage`** (`hqScreens.tsx`) |
| `LiveOrder` optional field | `customerLabel?` for future parity with `MockOrder.customerLabel` (optional; `PaymentHoldPage` unchanged) |

**Field mapping (요약):**

| Snapshot field | MockOrder | LiveOrder |
|----------------|-----------|-----------|
| `customerName` | `customerLabel` | `customerLabel ?? null` |
| `totalAmount` | `totalKrw` | `totalKrw` |
| `address` | `deliveryAddress` | `deliveryAddress` |
| `memo` | trimmed `deliveryRequest` or null | same |
| `orderStatus` | `status` | `status` |
| `paymentStatus` / `deliveryStatus` | 파생 (UI 확장용, 상태 머신 변경 없음) | 동일 |
| `updatedAt`, `riderName` | 없음 → `null` | 없음 → `null` |

**Not in scope (Phase 2):** 점주 화면은 Phase 2 직후까지 `MockOrder` 직접 사용이었음 → **Phase 3에서 `StoreOrdersPage`에 스냅샷 적용 완료.**

---

## 6B. Phase 3 — 점주 주문 화면 Snapshot (2026-05)

| Deliverable | Location |
|-------------|----------|
| 동일 DTO | `OrderSnapshot` via `mockOrderToSnapshot` / `liveOrderToSnapshot` |
| 목록 소스 | `mergeMockAndLiveOrderSnapshots(mockOrders, liveMap)` — **고객·점주·HQ 동일 함수** |
| 표시 | `customerName`, `totalAmount`, `address`, `memo`, `orderStatus` + 기존 `orderStatusLabel[s.orderStatus]` |
| 유지 | 거절 / 접수(mock) 버튼 — **동작·핸들러 미변경** (표시만 정합) |

---

## 6C. Phase 4 — HQ 주문 스텁 Snapshot (2026-05)

| Deliverable | Location |
|-------------|----------|
| 화면 | `HqOrdersPage` in `src/pages/hq/hqScreens.tsx` (기존 `HqStub` 2행 테이블 + **스냅샷 카드 목록** 병행) |
| 병합 | `mergeMockAndLiveOrderSnapshots` 재사용 |
| 표시 필드 | `totalAmount`, `customerName`, `address`, `memo`, `orderStatus` + `orderStatusLabel` + `storeName`, `items`, `createdAt` |
| 집계 | **진행 중**: 스냅샷 중 `delivered`·`cancelled` 제외 건수(동적). **지연 경보**: 기존과 동일 정적 `9` 유지. *(이전 스텁의 `512` 정적 진행 건수는 스냅샷 기반으로 대체 — 표시 정합 목적)* |
| 미변경 | 라우트, 결제/승인/배달 비즈니스 로직, 다른 HQ 스텁 페이지 |

---

## 7. Alignment with AGENTS.md / .cursorrules

- **Extend, don’t remove** existing features when changing structure.
- **build/lint** must pass after edits.
- **Structure / docs:** this file + `docs/README.md` + `MASTER_MANUAL.md` (root) when architecture changes.

---

## 8. Result Report (요청 보고 형식)

### 8.1 현재 구조 요약

독립 Vite SPA: **고객(탭)** / **점주(`/admin/store`)** / **본사(`/admin/hq`)** / **라이더(`/rider`)** 로 라우트 분리. 데이터는 **`mock/` + Zustand** 만 사용하며 1~7번 프로젝트 코드에 의존하지 않음.

### 8.2 주요 파일 목록

- **라우팅:** `src/App.tsx`, `src/main.tsx`
- **레이아웃:** `src/layouts/CustomerLayout.tsx`, `StoreAdminLayout.tsx`, `HqAdminLayout.tsx`
- **주문·결제:** `mock/orders.ts`, `store/*Store.ts`, `pages/customer/CheckoutPage.tsx`, `PaymentHoldPage.tsx`, `OrderHistoryPage.tsx`, `OrderStatusPage.tsx`, `domain/orderDisplay.ts`, **`domain/orderSnapshot.ts`**
- **메뉴·가게:** `mock/catalog.ts`, `pages/customer/*Store*`, `MenuListPage.tsx`, `store-admin/*`
- **정산:** `mock/settlement.ts`, `StoreSettlementPage.tsx`, HQ stubs in `hqScreens.tsx`
- **통합 식별자만:** `integration/productContext.ts`

### 8.3 공통화 가능 후보

`auth`, `users`, `roles`, `admin` 레이아웃 패턴, `notification` / `settlement log` / `audit log` — **현재는 타입·스텁 수준**; 실 공유 패키지는 추후 별도 모듈로 추출 권장.

### 8.4 테더식당 전용 유지 항목

`restaurant`/`menu`/`order`/`payment`(식당 결제 흐름)/`delivery`/`rider`/`store admin`/`restaurant settlement` 전부 **08 전용** 데이터 모델·화면으로 유지.

### 8.5 위험한 꼬임 가능성

형제 레포 **직접 import**, **지갑·원장·차트** 도입, **실결제·DB** 연결, **고객 UI에 관리자 노출** 복귀. 스냅샷 도입 후에도 **저장소 필드 리네임** 시 mapper 동기화 누락이면 고객 화면 깨짐 가능 → 리뷰 체크리스트에 포함.

### 8.6 수정/생성 파일 목록

**Phase 1 (감사 초안):**

| Action | Path |
|--------|------|
| **Create** | `docs/TETHER_RESTAURANT_STRUCTURE_AUDIT.md` |
| **Update** | `docs/README.md` |

**Phase 2 (OrderSnapshot):**

| Action | Path |
|--------|------|
| **Create** | `src/domain/orderSnapshot.ts` |
| **Update** | `src/store/liveOrderStore.ts` (`customerLabel?`) |
| **Update** | `src/pages/customer/OrderHistoryPage.tsx`, `OrderStatusPage.tsx` |
| **Update** | `docs/TETHER_RESTAURANT_STRUCTURE_AUDIT.md` (본 섹션·6A) |

**Phase 3 (점주 주문 스냅샷):**

| Action | Path |
|--------|------|
| **Update** | `src/pages/store-admin/StoreOrdersPage.tsx` |
| **Update** | `docs/TETHER_RESTAURANT_STRUCTURE_AUDIT.md` (§6B) |

**Phase 4 (HQ 주문 스냅샷 + 병합 공통화):**

| Action | Path |
|--------|------|
| **Update** | `src/domain/orderSnapshot.ts` (`mergeMockAndLiveOrderSnapshots`) |
| **Update** | `src/pages/hq/hqScreens.tsx` (`HqOrdersPage`) |
| **Update** | `src/pages/customer/OrderHistoryPage.tsx`, `src/pages/store-admin/StoreOrdersPage.tsx` |
| **Update** | `docs/TETHER_RESTAURANT_STRUCTURE_AUDIT.md` (§6C 등) |

### 8.7 build / lint 결과

- **`npm run build`** — 성공 (`tsc -b && vite build`, Vite production build 완료).
- **`npm run lint`** — 성공 (`eslint .`, exit code 0).

*(로컬 실행 시점: Phase 4 반영 직후.)*

### 8.8 다음 단계 제안

1. ~~**HQ 주문 스텁 스냅샷**~~ → **Phase 4 완료.**
2. **`mergeMockAndLiveOrderSnapshots` 단위 테스트** (선택, Vitest 도입 시).
3. **HQ 페이지 분할:** `hqScreens.tsx`에서 `HqOrdersPage` 등만 파일 분리 (라우트 불변).
4. **mock 소스 단일화:** `src/adapters/mock*.ts` 또는 MSW.
5. **라이더 데모 링크:** production에서 비활성화.

---

*Document version: Phase 1–4 (OrderSnapshot + 고객·점주·HQ 주문 표시 통일). Maintainer: update when folder, route topology, or order contracts change.*
