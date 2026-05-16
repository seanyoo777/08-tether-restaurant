import { create } from 'zustand'

import type { AuditTrailEntry, CheckStatus } from '../selfTest/types'

const MAX_ENTRIES = 200

type AuditState = {
  entries: AuditTrailEntry[]
  /** append-only — 기존 항목 수정·삭제 없음 */
  append: (entry: Omit<AuditTrailEntry, 'id' | 'at'> & { at?: string }) => void
}

let seq = 0

export const useAuditTrailStore = create<AuditState>((set, get) => ({
  entries: [
    {
      id: 'audit-seed-1',
      at: new Date(0).toISOString(),
      actor: 'system',
      action: 'audit_trail.initialized',
      detail: 'Mock append-only audit trail (no production destructive actions)',
      validation: 'PASS',
    },
  ],
  append: (partial) => {
    seq += 1
    const entry: AuditTrailEntry = {
      id: `audit-${Date.now()}-${seq}`,
      at: partial.at ?? new Date().toISOString(),
      actor: partial.actor,
      action: partial.action,
      target: partial.target,
      detail: partial.detail,
      validation: partial.validation,
    }
    const next = [...get().entries, entry]
    set({ entries: next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next })
  },
}))

export function appendAudit(
  entry: Omit<AuditTrailEntry, 'id' | 'at'> & { at?: string },
): AuditTrailEntry {
  useAuditTrailStore.getState().append(entry)
  const list = useAuditTrailStore.getState().entries
  return list[list.length - 1]!
}

export function appendAdminActionAudit(params: {
  actor: 'hq_admin' | 'store_admin'
  action: string
  target?: string
  detail?: string
  validation?: CheckStatus
}): void {
  appendAudit({
    actor: params.actor,
    action: params.action,
    target: params.target,
    detail: params.detail,
    validation: params.validation ?? 'PASS',
  })
}
