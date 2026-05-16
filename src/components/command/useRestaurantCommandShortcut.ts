import { useEffect } from 'react'
import { toggleCommandPalette } from '@tetherget/global-command-palette-core'
import {
  isRestaurantCommandKeyboardShortcutEnabled,
  isRestaurantCommandPaletteEnabled,
} from '../../command/commandFeatureFlags'

export function useRestaurantCommandShortcut() {
  useEffect(() => {
    if (!isRestaurantCommandPaletteEnabled() || !isRestaurantCommandKeyboardShortcutEnabled()) return
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      e.preventDefault()
      toggleCommandPalette('restaurant')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
