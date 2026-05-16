import {
  assertCommandPaletteFlagsRegistered,
  isCommandKeyboardShortcutEnabled,
  isCommandPaletteEnabled,
  isCommandRecentEnabled,
} from '@tetherget/global-command-palette-core'
import { isProfileChipEnabled } from '@tetherget/global-profile-chip-core'

export function isRestaurantCommandPaletteEnabled(): boolean {
  return isCommandPaletteEnabled() && isProfileChipEnabled()
}

export function isRestaurantCommandKeyboardShortcutEnabled(): boolean {
  return isRestaurantCommandPaletteEnabled() && isCommandKeyboardShortcutEnabled()
}

export function assertRestaurantCommandFlagsRegistered() {
  return assertCommandPaletteFlagsRegistered()
}

export { isCommandRecentEnabled as isRestaurantCommandRecentEnabled }
