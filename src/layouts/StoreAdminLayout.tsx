import { Link, Outlet, useLocation } from 'react-router-dom'

import { PageHeader } from '../components/PageHeader'

const links = [
  { to: '/admin/store', label: '대시보드' },
  { to: '/admin/store/menus', label: '메뉴 관리' },
  { to: '/admin/store/orders', label: '주문 접수' },
  { to: '/admin/store/settlement', label: '정산 관리' },
]

export function StoreAdminLayout() {
  const loc = useLocation()
  const sorted = [...links].sort((a, b) => b.to.length - a.to.length)
  const current =
    sorted.find((l) => loc.pathname === l.to || loc.pathname.startsWith(`${l.to}/`))?.label ?? '가게 관리자'

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col">
      <PageHeader title={current} backTo="/" />
      <div className="flex gap-2 overflow-x-auto border-b border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] px-3 py-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              loc.pathname === l.to
                ? 'border-[var(--color-tr-accent)] bg-[var(--color-tr-accent)]/15 text-[var(--color-tr-accent)]'
                : 'border-[var(--color-tr-border)] text-[var(--color-tr-muted)] hover:border-[var(--color-tr-border-2)]'
            }`}
          >
            {l.label}
          </Link>
        ))}
        <Link
          to="/admin/hq"
          className="shrink-0 rounded-full border border-dashed border-[var(--color-tr-border-2)] px-3 py-1.5 text-xs text-[var(--color-tr-muted)]"
        >
          본사 →
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>
    </div>
  )
}
