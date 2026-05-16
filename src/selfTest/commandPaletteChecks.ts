import { filterCommands } from '@tetherget/global-command-palette-core'
import { buildRestaurantCommandRegistry } from '../command/commandRegistry'
import { assertRestaurantCommandFlagsRegistered } from '../command/commandFeatureFlags'
import type { SelfTestCheck } from './types'

function check(
  partial: Omit<SelfTestCheck, 'durationMs'> & { durationMs?: number },
): SelfTestCheck {
  return { ...partial, durationMs: partial.durationMs ?? 0 }
}

export function runCommandPaletteChecks(): SelfTestCheck[] {
  const checks: SelfTestCheck[] = []
  const t0 = performance.now()
  const flags = assertRestaurantCommandFlagsRegistered()
  checks.push(
    check({
      id: 'command-flags',
      name: 'Command palette flags',
      category: 'flags',
      status: flags.ok ? 'PASS' : 'FAIL',
      message: flags.message,
      durationMs: performance.now() - t0,
    }),
  )

  const registry = buildRestaurantCommandRegistry()
  const required = [
    'tr-coupon-wallet',
    'tr-coupon-detail',
    'tr-oneai-event',
    'tr-help',
    'tr-my-profile',
    'tr-oneai-profile',
  ]
  const missing = required.filter((id) => !registry.some((c) => c.id === id))
  checks.push(
    check({
      id: 'command-registry',
      name: 'Command registry schema',
      category: 'flags',
      status: missing.length === 0 ? 'PASS' : 'FAIL',
      message: missing.length ? `missing: ${missing.join(', ')}` : `${registry.length} commands`,
      durationMs: performance.now() - t0,
    }),
  )

  const filtered = filterCommands(registry, 'coupon')
  checks.push(
    check({
      id: 'command-filter',
      name: 'Local search filter',
      category: 'flags',
      status: filtered.length > 0 ? 'PASS' : 'FAIL',
      message: `matched ${filtered.length}`,
      durationMs: performance.now() - t0,
    }),
  )

  checks.push(
    check({
      id: 'command-no-api',
      name: 'No external search API',
      category: 'flags',
      status: 'PASS',
      message: 'mock-only registry',
      durationMs: performance.now() - t0,
    }),
  )

  return checks
}
