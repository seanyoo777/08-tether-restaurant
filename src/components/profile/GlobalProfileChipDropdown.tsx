import {
  appendProfileDropdownAudit,
  buildProfileDropdownDetailRows,
  buildProfileDropdownMetaRows,
  listProfileDropdownQuickLinks,
  type GlobalUserProfileRow,
  type ProfileChipView,
  type ProfileDropdownLinkId,
} from '@tetherget/global-profile-chip-core'
import { useNavigate } from 'react-router-dom'

const PLATFORM = 'restaurant' as const

type Props = {
  open: boolean
  onClose: () => void
  view: ProfileChipView
  profile: GlobalUserProfileRow
  showAdmin?: boolean
}

export function GlobalProfileChipDropdown({ open, onClose, view, profile, showAdmin = false }: Props) {
  const navigate = useNavigate()
  if (!open) return null

  const detailRows = buildProfileDropdownDetailRows(PLATFORM, profile, view)
  const metaRows = buildProfileDropdownMetaRows(view)
  const links = listProfileDropdownQuickLinks(PLATFORM, { admin: showAdmin })

  const closeWith = (reason: string) => {
    appendProfileDropdownAudit(PLATFORM, 'profile.dropdown.closed', reason)
    onClose()
  }

  const auditLink = (id: ProfileDropdownLinkId, path: string) => {
    appendProfileDropdownAudit(PLATFORM, 'profile.dropdown.link_clicked', id)
    navigate(path)
    onClose()
  }

  const onLink = (id: ProfileDropdownLinkId) => {
    if (id === 'oneai-hub') {
      const hub = import.meta.env.VITE_ONEAI_PROFILE_HUB_URL
      if (hub?.startsWith('http')) window.open(hub, '_blank', 'noopener,noreferrer')
      appendProfileDropdownAudit(PLATFORM, 'profile.dropdown.link_clicked', id)
      onClose()
      return
    }
    if (id === 'my-page') auditLink(id, '/me')
    else if (id === 'help') auditLink(id, '/coupons/help')
    else if (id === 'admin') auditLink(id, '/admin/hq')
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-black/50 md:bg-transparent"
        aria-label="Close profile menu"
        data-testid="profile-chip-dropdown-backdrop"
        onClick={() => closeWith('backdrop')}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile menu"
        data-testid="profile-chip-dropdown"
        className="fixed inset-x-0 bottom-0 z-[61] max-h-[min(85dvh,520px)] overflow-y-auto rounded-t-2xl border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-[calc(100%+0.35rem)] md:w-[min(20rem,92vw)] md:rounded-xl md:pb-3"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[var(--color-tr-border)] px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{view.nickname}</p>
            <p className="text-[11px] text-[var(--color-tr-muted)]">
              Lv {view.oneAiLevel} · {view.platformBadge}
            </p>
          </div>
          <button
            type="button"
            data-testid="profile-chip-dropdown-close"
            className="shrink-0 rounded-lg border border-[var(--color-tr-border)] px-2 py-1 text-xs"
            onClick={() => closeWith('close-button')}
          >
            닫기
          </button>
        </div>
        <dl className="space-y-2 px-4 py-3 text-xs">
          {detailRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-2">
              <dt className="text-[var(--color-tr-muted)]">{row.label}</dt>
              <dd className="truncate font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
        <dl className="space-y-1 border-t border-[var(--color-tr-border)] px-4 py-2 text-[10px] text-[var(--color-tr-muted)]">
          {metaRows.map((row) => (
            <div key={row.label} className="flex justify-between gap-2">
              <dt>{row.label}</dt>
              <dd className="truncate">{row.value}</dd>
            </div>
          ))}
        </dl>
        <nav className="flex flex-col gap-1 border-t border-[var(--color-tr-border)] px-3 py-3">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              data-testid={`profile-chip-dropdown-link-${link.id}`}
              className="rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
              onClick={() => onLink(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <p className="px-4 pb-2 text-[10px] text-[var(--color-tr-muted)]">
          Read-only mock · global-profile-chip · no auth/KYC/wallet
        </p>
      </div>
    </>
  )
}