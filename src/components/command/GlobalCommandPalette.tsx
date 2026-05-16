import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  appendCommandPaletteAudit,
  closeCommandPalette,
  createDefaultCommandExecutor,
  filterCommands,
  isCommandPaletteOpen,
  readRecentCommandIds,
  saveRecentCommandId,
  subscribeCommandPaletteStore,
  type CommandItem,
} from '@tetherget/global-command-palette-core'
import { buildRestaurantCommandRegistry } from '../../command/commandRegistry'
import { isRestaurantCommandPaletteEnabled } from '../../command/commandFeatureFlags'

function subscribeOpen(onStore: () => void) {
  return subscribeCommandPaletteStore(onStore)
}

function getOpenSnapshot() {
  return isCommandPaletteOpen()
}

export function GlobalCommandPalette() {
  const navigate = useNavigate()
  const open = useSyncExternalStore(subscribeOpen, getOpenSnapshot, () => false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const registry = useMemo(() => buildRestaurantCommandRegistry(), [])
  const recentIds = useMemo(() => (open ? readRecentCommandIds() : []), [open])
  const execute = useMemo(
    () =>
      createDefaultCommandExecutor({
        route: (target) => navigate(target),
        external_mock: (target) => {
          if (target.startsWith('http')) window.open(target, '_blank', 'noopener,noreferrer')
        },
      }),
    [navigate],
  )

  const displayItems = useMemo(() => {
    let items = filterCommands(registry, query)
    if (!query.trim()) {
      const map = new Map(registry.map((c) => [c.id, c]))
      const recent = recentIds.map((id) => map.get(id)).filter((c): c is CommandItem => Boolean(c?.enabled))
      const set = new Set(recent.map((r) => r.id))
      items = [...recent, ...items.filter((c) => !set.has(c.id))]
    }
    return items
  }, [registry, query, recentIds])

  const handleClose = useCallback(() => {
    closeCommandPalette('restaurant')
    setQuery('')
    setActiveIndex(0)
  }, [])

  const runCommand = useCallback(
    (item: CommandItem) => {
      appendCommandPaletteAudit('command.executed', 'restaurant', item.id, item.target)
      execute(item)
      saveRecentCommandId('restaurant', item.id)
      handleClose()
    },
    [execute, handleClose],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, displayItems.length - 1)))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && displayItems[activeIndex]) {
        e.preventDefault()
        runCommand(displayItems[activeIndex]!)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, displayItems, activeIndex, runCommand, handleClose])

  if (!isRestaurantCommandPaletteEnabled() || !open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        data-testid="global-command-backdrop"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal
        data-testid="global-command-palette"
        className="relative z-[201] flex max-h-[min(85dvh,28rem)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] sm:rounded-2xl"
      >
        <div className="border-b border-[var(--color-tr-border)] p-3">
          <input
            data-testid="global-command-input"
            type="search"
            autoFocus
            placeholder="Search commands…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            className="w-full rounded-lg border border-[var(--color-tr-border)] bg-[var(--color-tr-bg)] px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2" role="listbox">
          {displayItems.length === 0 ? (
            <p data-testid="global-command-empty" className="py-8 text-center text-sm text-[var(--color-tr-muted)]">
              No commands found
            </p>
          ) : (
            displayItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                data-testid={`global-command-result-${item.id}`}
                className={`mb-1 flex w-full flex-col rounded-lg px-3 py-2 text-left ${
                  index === activeIndex ? 'bg-[var(--color-tr-accent)]/15' : ''
                }`}
                onClick={() => runCommand(item)}
              >
                <span className="text-sm font-semibold">{item.title}</span>
                <span className="text-xs text-[var(--color-tr-muted)]">{item.subtitle}</span>
              </button>
            ))
          )}
        </div>
        <p className="border-t border-[var(--color-tr-border)] px-3 py-2 text-[10px] text-[var(--color-tr-muted)]">
          MOCK ONLY · no search API
        </p>
      </div>
    </div>
  )
}
