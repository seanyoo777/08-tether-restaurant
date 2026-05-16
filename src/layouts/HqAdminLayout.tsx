import { Link, Outlet, useLocation } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'
import { PRODUCT_IDS } from '../integration/productContext'

const hqNav = [
  { to: '/admin/hq', label: '대시보드' },
  { to: '/admin/hq/members', label: '회원 관리' },
  { to: '/admin/hq/stores', label: '가게 승인' },
  { to: '/admin/hq/menus', label: '메뉴 관리' },
  { to: '/admin/hq/orders', label: '주문 관리' },
  { to: '/admin/hq/payments', label: '결제 관리' },
  { to: '/admin/hq/settlement', label: '정산 관리' },
  { to: '/admin/hq/fees', label: '수수료 설정' },
  { to: '/admin/hq/disputes', label: '분쟁·환불' },
  { to: '/admin/hq/reports', label: '신고·차단' },
  { to: '/admin/hq/campaigns', label: '쿠폰·이벤트' },
  { to: '/admin/hq/notifications', label: '알림·푸시' },
  { to: '/admin/hq/stats', label: '통계' },
  { to: '/admin/hq/rbac', label: '권한(RBAC)' },
  { to: '/admin/hq/self-test', label: 'Self-Test' },
] as const

export function HqAdminLayout() {
  const loc = useLocation()
  const title = hqNav.find((n) => n.to === loc.pathname)?.label ?? '본사 관리자'

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col md:flex-row">
      <aside className="hidden w-56 shrink-0 border-r border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] p-3 md:block">
        <div className="mb-3 rounded-xl border border-[var(--color-tr-border)] bg-[var(--color-tr-surface-2)] p-2 text-[10px] text-[var(--color-tr-muted)]">
          통합 관리자 키: <span className="font-mono text-[var(--color-tr-text)]">{PRODUCT_IDS.tetherRestaurant}</span>
        </div>
        <nav className="flex flex-col gap-1">
          {hqNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`rounded-lg px-2 py-2 text-sm ${
                loc.pathname === n.to
                  ? 'bg-[var(--color-tr-accent)]/15 font-medium text-[var(--color-tr-accent)]'
                  : 'text-[var(--color-tr-muted)] hover:bg-[var(--color-tr-surface-2)] hover:text-[var(--color-tr-text)]'
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/admin/store"
            className="mt-2 rounded-lg border border-dashed border-[var(--color-tr-border-2)] px-2 py-2 text-sm text-[var(--color-tr-muted)]"
          >
            ← 가게 관리자
          </Link>
        </nav>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader title={title} backTo="/" />
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] px-2 py-2 md:hidden">
          {hqNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                loc.pathname === n.to
                  ? 'bg-[var(--color-tr-accent)]/20 text-[var(--color-tr-accent)]'
                  : 'bg-[var(--color-tr-surface-2)] text-[var(--color-tr-muted)]'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
