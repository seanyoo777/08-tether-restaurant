import { useMemo } from 'react'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { mergeMockAndLiveOrderSnapshots } from '../../domain/orderSnapshot'
import { mockOrders, orderStatusLabel } from '../../mock/orders'
import { useLiveOrderStore } from '../../store/liveOrderStore'

function HqStub({ title, description, rows }: { title: string; description: string; rows: { k: string; v: string }[] }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <MockBanner />
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm text-[var(--color-tr-muted)]">{description}</p>
      </div>
      <Card>
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-b border-[var(--color-tr-border)] last:border-0">
                <th className="py-2 pr-3 font-normal text-[var(--color-tr-muted)]">{r.k}</th>
                <td className="py-2 tabular-nums text-[var(--color-tr-text)]">{r.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export function HqDashboardPage() {
  return (
    <HqStub
      title="본사 대시보드"
      description="TetherGet · OneAI · 테더식당 · UTE 공통 관리자로 확장할 때 그대로 이관 가능한 화면 단위입니다."
      rows={[
        { k: '오늘 GMV (mock)', v: '₮ 12,480' },
        { k: '활성 가게', v: '128' },
        { k: '분쟁 큐', v: '3' },
        { k: '정산 배치', v: '오늘 02:00' },
      ]}
    />
  )
}

export function HqMembersPage() {
  return (
    <HqStub
      title="회원 관리"
      description="고객·사장님·라이더 프로필, 제재 이력, 디바이스 목록 등."
      rows={[
        { k: '신규 (7일)', v: '420' },
        { k: '휴면 처리 대기', v: '18' },
        { k: 'KYC 연동', v: '미연결' },
      ]}
    />
  )
}

export function HqStoresPage() {
  return (
    <HqStub
      title="가게 승인"
      description="서류 검수 → 현장 확인 → 오픈. 승인 워크플로만 UI로 고정."
      rows={[
        { k: '대기', v: '6' },
        { k: '반려', v: '1' },
        { k: '오픈', v: '128' },
      ]}
    />
  )
}

export function HqMenusPage() {
  return (
    <HqStub
      title="메뉴 관리 (본사)"
      description="플랫폼 기본 템플릿, 원산지 표기 검수, 노출 제한 카테고리."
      rows={[
        { k: '검수 대기', v: '24' },
        { k: '노출 중단', v: '3' },
      ]}
    />
  )
}

function inFlightOrderCount(snapshots: ReturnType<typeof mergeMockAndLiveOrderSnapshots>): number {
  return snapshots.filter((s) => s.orderStatus !== 'delivered' && s.orderStatus !== 'cancelled').length
}

export function HqOrdersPage() {
  const liveMap = useLiveOrderStore((s) => s.orders)
  const snapshots = useMemo(() => mergeMockAndLiveOrderSnapshots(mockOrders, liveMap), [liveMap])
  const inFlight = useMemo(() => inFlightOrderCount(snapshots), [snapshots])

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <MockBanner />
      <div>
        <h2 className="text-lg font-bold">주문 관리</h2>
        <p className="mt-1 text-sm text-[var(--color-tr-muted)]">
          전 가맹 주문 타임라인, 강제 취소, 재배차 지시. (mock — 고객·점주와 동일 OrderSnapshot 병합)
        </p>
      </div>
      <Card>
        <table className="w-full text-left text-sm">
          <tbody>
            <tr className="border-b border-[var(--color-tr-border)]">
              <th className="py-2 pr-3 font-normal text-[var(--color-tr-muted)]">진행 중</th>
              <td className="py-2 tabular-nums text-[var(--color-tr-text)]">{inFlight}</td>
            </tr>
            <tr>
              <th className="py-2 pr-3 font-normal text-[var(--color-tr-muted)]">지연 경보</th>
              <td className="py-2 tabular-nums text-[var(--color-tr-text)]">9</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <div className="flex flex-col gap-3">
        {snapshots.map((s) => (
          <Card key={s.id}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-[var(--color-tr-muted)]">{s.id}</p>
                <p className="mt-0.5 text-sm font-semibold">{s.storeName}</p>
                <p className="mt-1 text-xs text-[var(--color-tr-muted)]">
                  고객 <span className="text-[var(--color-tr-text)]">{s.customerName ?? '—'}</span>
                </p>
                <p className="mt-1 text-sm font-medium">{orderStatusLabel[s.orderStatus]}</p>
                <p className="mt-1 line-clamp-2 text-[11px] text-[var(--color-tr-muted)]">{s.address}</p>
                {s.memo ? (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--color-tr-muted)]">요청: {s.memo}</p>
                ) : null}
                <ul className="mt-2 space-y-0.5 text-[11px] text-[var(--color-tr-muted)]">
                  {s.items.map((i) => (
                    <li key={i.menuId}>
                      {i.name} × {i.qty}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <p className="text-sm font-semibold tabular-nums">{s.totalAmount.toLocaleString()}원</p>
                <p className="text-[11px] text-[var(--color-tr-muted)] tabular-nums">₮ {s.totalUsdtHold}</p>
                <p className="mt-1 text-[10px] text-[var(--color-tr-muted)]">
                  {new Date(s.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function HqPaymentsPage() {
  return (
    <HqStub
      title="결제 관리"
      description="USDT 홀딩 해제·부분취소·레일별 수납 상태. 실 API 없음."
      rows={[
        { k: '홀딩 중', v: '₮ 4,200' },
        { k: '카드 레일', v: '비활성' },
        { k: '간편결제 레일', v: '비활성' },
      ]}
    />
  )
}

export function HqSettlementPage() {
  return (
    <HqStub
      title="정산 관리"
      description="주기 정산, 가맹별 대사, 세금계산서 발행 연동(추후)."
      rows={[
        { k: '이번 주차', v: '2026-W19' },
        { k: '지급 예정', v: '₮ 88,420' },
      ]}
    />
  )
}

export function HqFeesPage() {
  return (
    <HqStub
      title="수수료 설정"
      description="카테고리·거리·피크타임 가중. 변경 이력 감사로그."
      rows={[
        { k: '기본 배달 수수료', v: '5.0%' },
        { k: 'USDT 홀딩 해제 수수료', v: '0.2%' },
      ]}
    />
  )
}

export function HqDisputesPage() {
  return (
    <HqStub
      title="분쟁·환불"
      description="고객·가게·라이더 간 분쟁, 부분 환불, 홀딩 해제 타이밍."
      rows={[
        { k: '오픈 티켓', v: '11' },
        { k: 'SLA 초과', v: '2' },
      ]}
    />
  )
}

export function HqReportsPage() {
  return (
    <HqStub
      title="신고·차단"
      description="리뷰/채팅 신고, 악성 유저·가게 차단, IP/디바이스 핑거프린트(추후)."
      rows={[
        { k: '신고 접수 (24h)', v: '37' },
        { k: '자동 차단', v: '4' },
      ]}
    />
  )
}

export function HqCampaignsPage() {
  return (
    <HqStub
      title="쿠폰·이벤트"
      description="조건 쿠폰, 세그먼트 푸시, 가맹 공동 프로모션."
      rows={[
        { k: '진행 중 캠페인', v: '5' },
        { k: '예산 소진율', v: '62%' },
      ]}
    />
  )
}

export function HqNotificationsPage() {
  return (
    <HqStub
      title="알림·푸시"
      description="주문/배달/정산 템플릿, 발송 큐, 실패 재시도."
      rows={[
        { k: '오늘 발송', v: '12,400' },
        { k: '실패율', v: '0.3%' },
      ]}
    />
  )
}

export function HqStatsPage() {
  return (
    <HqStub
      title="통계 대시보드"
      description="전환 퍼널, 코호트, 가맹 단위 기여도. 현재는 정적 mock."
      rows={[
        { k: '주문 전환', v: '3.8%' },
        { k: '재주문율', v: '29%' },
      ]}
    />
  )
}

export function HqRbacPage() {
  return (
    <HqStub
      title="플랫폼별 권한 (RBAC)"
      description="TetherGet / OneAI / 테더식당 / UTE 제품 키에 역할 매핑. `integration/productContext.ts`의 ProductId와 정합."
      rows={[
        { k: 'super', v: '전 제품' },
        { k: 'hq_finance', v: '정산·결제' },
        { k: 'store_owner', v: '테더식당 가맹' },
      ]}
    />
  )
}
