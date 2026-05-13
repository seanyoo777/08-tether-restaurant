import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { useCartStore } from '../store/cartStore'

const tab =
  'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[9px] font-medium leading-tight text-[var(--color-tr-muted)] sm:text-[10px]'

function TabLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) => `${tab} ${isActive ? '!text-[var(--color-tr-accent)]' : ''} min-h-[52px]`}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span className="px-0.5 text-center">{label}</span>
    </NavLink>
  )
}

export function CustomerLayout() {
  const location = useLocation()
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.qty, 0))
  const hideNav = location.pathname.startsWith('/pay/') || location.pathname.startsWith('/checkout')

  const showNav =
    !hideNav &&
    !location.pathname.startsWith('/admin') &&
    !location.pathname.startsWith('/rider')

  const ordersTabActive =
    location.pathname === '/orders' || /^\/orders\/[^/]+\/?$/.test(location.pathname)

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col bg-[var(--color-tr-bg)] shadow-xl shadow-black/40">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
      {showNav ? (
        <nav className="flex shrink-0 border-t border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] pb-[env(safe-area-inset-bottom)]">
          <TabLink to="/" label="홈" icon="⌂" />
          <TabLink to="/search" label="검색" icon="⌕" />
          <NavLink
            to="/cart"
            end
            className={({ isActive }) =>
              `${tab} relative min-h-[52px] ${isActive ? '!text-[var(--color-tr-accent)]' : ''}`
            }
          >
            <span className="text-lg leading-none">🛒</span>
            <span className="px-0.5 text-center">장바구니</span>
            {count > 0 ? (
              <span className="absolute right-[calc(50%-20px)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-tr-accent)] px-1 text-[10px] font-bold text-[#04120c]">
                {count > 99 ? '99+' : count}
              </span>
            ) : null}
          </NavLink>
          <NavLink
            to="/orders"
            className={() => `${tab} min-h-[52px] ${ordersTabActive ? '!text-[var(--color-tr-accent)]' : ''}`}
          >
            <span className="text-lg leading-none">📋</span>
            <span className="px-0.5 text-center">주문내역</span>
          </NavLink>
          <TabLink to="/me" label="내정보" icon="👤" />
        </nav>
      ) : null}
    </div>
  )
}
