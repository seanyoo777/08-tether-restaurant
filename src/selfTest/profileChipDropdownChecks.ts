import { runProfileChipDropdownSelfTests } from '@tetherget/global-profile-chip-core'
import type { SelfTestCheck } from './types'

function check(
  partial: Omit<SelfTestCheck, 'durationMs'> & { durationMs?: number },
): SelfTestCheck {
  return { ...partial, durationMs: partial.durationMs ?? 0 }
}

export function runProfileChipDropdownChecks(): SelfTestCheck[] {
  const t0 = performance.now()
  const result = runProfileChipDropdownSelfTests('restaurant')
  return result.checks.map((c) =>
    check({
      id: `profile-dropdown-${c.id}`,
      name: c.label,
      category: 'profile',
      status: c.status,
      message: c.message,
      durationMs: performance.now() - t0,
    }),
  )
}
