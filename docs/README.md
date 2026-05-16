# 테더식당 (08-tether-restaurant) 문서

모노레포 루트의 [`MASTER_MANUAL.md`](../../MASTER_MANUAL.md)와 함께 유지합니다.

구조 변경·신규 폴더·신규 시스템 추가 시 **이 `docs/` 폴더와 `MASTER_MANUAL.md`의 8번 섹션**을 같이 갱신합니다.

| 문서 | 설명 |
|------|------|
| [PLATFORM_ARCHITECTURE.md](./PLATFORM_ARCHITECTURE.md) | 플랫폼 레이어, 역할 분리, 통합 슬롯, 품질 게이트 |
| [ORDER_FLOW.md](./ORDER_FLOW.md) | 주문 라이프사이클, 상태 모델, mock 결제·확장 |
| [CUSTOMER_APP.md](./CUSTOMER_APP.md) | 고객 앱 IA, 탭·딥링크, 경계(관리자 비노출) |
| [STORE_ADMIN.md](./STORE_ADMIN.md) | 가게 관리자 URL·역할·확장 |
| [DELIVERY_SYSTEM.md](./DELIVERY_SYSTEM.md) | 배달·라이더·디스패치 목표 아키텍처 |
| [MOBILE_UI.md](./MOBILE_UI.md) | 모바일 퍼스트 UI 셸·토큰·컴포넌트 원칙 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 디렉터리 구조, 레이아웃, 상태·도메인 모듈 |
| [ROUTES.md](./ROUTES.md) | 라우팅 표 (고객 / 관리자 / 딥링크) |
| [TETHER_RESTAURANT_STRUCTURE_AUDIT.md](./TETHER_RESTAURANT_STRUCTURE_AUDIT.md) | 8번 전용 구조 점검(폴더·라우트·위험도·공통/전용 분리) |
| [SELF_TEST.md](./SELF_TEST.md) | Self-Test Center, diagnostics, audit trail, flags, smoke CLI |
| [TETHER_RESTAURANT_COUPON.md](./TETHER_RESTAURANT_COUPON.md) | QR / event coupon mock, wallet UI, status, audit |
| [TETHER_RESTAURANT_ONEAI_EVENT.md](./TETHER_RESTAURANT_ONEAI_EVENT.md) | OneAI Event Hub mock bridge, 당첨·발급 |

프로젝트 루트 규칙 요약: [`AGENTS.md`](../AGENTS.md)
