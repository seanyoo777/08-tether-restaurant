# 테더식당 — 라우트

기준: `src/App.tsx`  
고객 구역은 `CustomerLayout` (`max-w-md`, 하단 탭)으로 감쌉니다.

## 고객 (`/` 레이아웃)

| 경로 | 화면 |
|------|------|
| `/` | 홈 |
| `/search` | 가게 검색 |
| `/stores/:storeId` | 가게 상세 |
| `/stores/:storeId/menu` | 메뉴 |
| `/cart` | 장바구니 |
| `/checkout` | 주문 확인 |
| `/pay/:draftId` | USDT 홀딩 (mock 단계) |
| `/orders` | 주문내역 |
| `/orders/:orderId` | 주문 상세·상태 |
| `/me` | 내 정보 |
| `/coupons` | QR 쿠폰 지갑 (mock) |
| `/coupons/help` | 쿠폰 Help Center |
| `/coupons/:couponId` | 쿠폰 상세 · QR placeholder |
| `/events/oneai` | OneAI Event Hub mock |

## 딥링크 (레이아웃 밖, 즉시 `Navigate`)

| 경로 | 동작 |
|------|------|
| `/s/:storeId` | 유효 가게 → `/stores/:storeId`, 없으면 `/search` |
| `/qr/:storeId` | 유효 가게 → `/stores/:storeId/menu`, 없으면 `/search` |

## 가게 관리자

| 경로 | 설명 |
|------|------|
| `/admin/store` | 대시보드 |
| `/admin/store/menus` | 메뉴 관리 |
| `/admin/store/orders` | 주문 접수 |
| `/admin/store/settlement` | 정산 관리 |

## 본사 관리자

| 경로 | 설명 |
|------|------|
| `/admin/hq` | 대시보드 |
| `/admin/hq/members` … `rbac` | 회원·가게·메뉴·주문·결제·정산·수수료·분쟁·신고·캠페인·알림·통계·RBAC (mock 화면) |
| `/admin/hq/self-test` | Self-Test Center (diagnostics, audit trail, feature flags) |

## 라이더

| 경로 | 설명 |
|------|------|
| `/rider` | 라이더 작업 목록 (mock) |

## 기타

- 미매칭 경로는 `/`로 리다이렉트 (`Navigate replace`).
