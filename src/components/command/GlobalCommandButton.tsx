import { openCommandPalette } from '@tetherget/global-command-palette-core'
import {
  isRestaurantCommandKeyboardShortcutEnabled,
  isRestaurantCommandPaletteEnabled,
} from '../../command/commandFeatureFlags'

export function GlobalCommandButton() {
  if (!isRestaurantCommandPaletteEnabled()) return null
  const hint = isRestaurantCommandKeyboardShortcutEnabled() ? 'Ctrl+K' : undefined
  return (
    <button
      type="button"
      data-testid="global-command-button"
      aria-label="Open command palette"
      className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-tr-border)] px-2 py-1 text-[10px] font-semibold text-[var(--color-tr-muted)]"
      onClick={() => openCommandPalette('restaurant')}
    >
      ⌕ {hint ? <span className="hidden sm:inline opacity-70">{hint}</span> : null}
    </button>
  )
}
