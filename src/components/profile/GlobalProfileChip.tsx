import { useEffect, useMemo, useRef, useState } from 'react'
import {
  appendProfileChipAudit,
  appendProfileDropdownAudit,
  DEFAULT_ONEAI_PROFILE_HUB_PATH,
  isProfileChipDropdownEnabled,
  isProfileChipEnabled,
  isProfileCrossAppLinkEnabled,
} from '@tetherget/global-profile-chip-core'
import { useProfileChipLive } from '../../hooks/useProfileChipLive'
import { GlobalProfileChipDropdown } from './GlobalProfileChipDropdown'

type GlobalProfileChipProps = {
  compact?: boolean
}

export function GlobalProfileChip({ compact = false }: GlobalProfileChipProps) {
  const enabled = useMemo(() => isProfileChipEnabled(), [])
  const dropdownEnabled = useMemo(() => isProfileChipDropdownEnabled(), [])
  const { view, profile, pulse } = useProfileChipLive('restaurant')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const renderedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return
    if (renderedRef.current) return
    renderedRef.current = true
    appendProfileChipAudit('profile.chip.rendered', 'restaurant', `source=${view.source}`)
    if (view.isMockProfile) appendProfileChipAudit('profile.chip.fallback_used', 'restaurant')
  }, [enabled, view.source, view.isMockProfile])

  useEffect(() => {
    if (!dropdownOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        appendProfileDropdownAudit('restaurant', 'profile.dropdown.closed', 'escape')
        setDropdownOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dropdownOpen])

  if (!enabled) return null

  const chipBody = (
    <>
      <span
        className="shrink-0 rounded-full"
        style={{ width: compact ? 8 : 10, height: compact ? 8 : 10, background: view.avatarColor }}
        aria-hidden
      />
      {!compact ? (
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-semibold">{view.nickname}</span>
          <span className="block truncate text-[9px] text-[var(--color-tr-muted)]">
            Lv.{view.oneAiLevel} · {view.platformBadge}
          </span>
        </span>
      ) : (
        <span className="truncate font-semibold">{view.nickname}</span>
      )}
      {view.isMockProfile ? (
        <span className="shrink-0 rounded border border-amber-500/50 px-1 text-[8px] font-bold text-amber-400">
          mock
        </span>
      ) : null}
    </>
  )

  const chipClass = `inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] text-left text-[var(--color-tr-text)] ${
    compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'
  }${pulse ? ' profile-chip-sync-pulse' : ''}`

  if (dropdownEnabled) {
    return (
      <div className="relative shrink-0">
        <button
          type="button"
          data-testid={compact ? 'profile-chip-compact' : 'profile-chip'}
          data-profile-chip-variant="dropdown"
          aria-expanded={dropdownOpen}
          aria-haspopup="dialog"
          aria-label={`Profile ${view.nickname}`}
          className={chipClass}
          onClick={() => {
            setDropdownOpen((prev) => {
              const next = !prev
              appendProfileDropdownAudit(
                'restaurant',
                next ? 'profile.dropdown.opened' : 'profile.dropdown.closed',
                next ? 'chip-click' : 'chip-click-toggle-off',
              )
              return next
            })
          }}
        >
          {chipBody}
        </button>
        <GlobalProfileChipDropdown
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          view={view}
          profile={profile}
          showAdmin
        />
      </div>
    )
  }

  const onLegacyClick = () => {
    appendProfileChipAudit('profile.chip.link_clicked', 'restaurant')
    if (isProfileCrossAppLinkEnabled()) {
      const hub = import.meta.env.VITE_ONEAI_PROFILE_HUB_URL ?? DEFAULT_ONEAI_PROFILE_HUB_PATH
      if (hub.startsWith('http')) window.open(hub, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <button
      type="button"
      data-testid={compact ? 'profile-chip-compact' : 'profile-chip'}
      data-profile-chip-variant="link"
      aria-label={`Profile ${view.nickname}`}
      onClick={onLegacyClick}
      className={chipClass}
    >
      {chipBody}
    </button>
  )
}
