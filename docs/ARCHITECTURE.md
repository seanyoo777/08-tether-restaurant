# 테더식당 — 아키텍처

스택: **Vite 8 · React 19 · TypeScript (strict) · Tailwind CSS v4 · React Router v7 · Zustand**  
모드: **mock 전용** (실결제·온체인·배달 파트너 API 미연결)

## 상위 디렉터리 (`src/`)

| 경로 | 역할 |
|------|------|
| `App.tsx` | 최상위 `Routes` (고객 레이아웃 / 관리자 / 라이더 / 딥링크 리다이렉트) |
| `main.tsx` | `BrowserRouter` 진입점 |
| `index.css` | 테마 토큰·글로벌 스타일 |
| `layouts/` | `CustomerLayout` (모바일 하단 탭), `StoreAdminLayout`, `HqAdminLayout` |
| `pages/customer/` | 고객 홈·검색·가게·메뉴·장바구니·결제·주문내역·주문상세·내정보·QR 진입 리다이렉트 |
| `pages/store-admin/` | 가게 관리자 (`/admin/store/*`) |
| `pages/hq/` | 본사 관리자 화면 모듈 (`hqScreens.tsx`) |
| `pages/rider/` | 라이더 (`/rider`) |
| `components/` | 공용 UI (`Card`, `PageHeader`, `TrButton`, 주문 배지·진행바 등) |
| `domain/` | 순수 도메인: `orderDisplay.ts`(고객 단계), **`orderSnapshot.ts`**(Mock/Live → `OrderSnapshot` 표시 정합) |
| `mock/` | `catalog`, `orders`, `settlement` 등 시드 데이터 |
| `store/` | `cartStore`, `checkoutDraftStore`, `liveOrderStore` |
| `integration/` | 향후 TetherGet / OneAI / UTE 공통 관리자용 `productContext.ts` |

## 고객 vs 관리자 IA

- **고객**: 하단 탭만 사용. **관리자·라이더 URL을 고객 UI에 노출하지 않음.**
- **가게 관리자**: 브라우저에서 `/admin/store` 직접 진입.
- **본사 관리자**: `/admin/hq`.
- **라이더**: `/rider`.

## 주문 데이터 흐름 (mock)

1. 장바구니 → 체크아웃 → `checkoutDraftStore`에 초안 저장 → `/pay/:draftId` USDT 홀딩 단계 UI.
2. 완료 시 `liveOrderStore`에 주문 스냅샷 저장 후 `/orders/:orderId`.
3. 시드 주문은 `mock/orders.ts`의 `mockOrders` + 동일 스토어 병합.

## 재주문

- `cartStore.reorderFromOrder`: **현재 장바구니를 해당 가게 기준으로 교체** 후, 메뉴 mock에서 단가·USDT 환산 보조.
- 완료(`delivered`) 주문 상세에서만 “같은 메뉴 다시 담기” 노출.

## 빌드

```bash
npm run build
npm run lint
```
