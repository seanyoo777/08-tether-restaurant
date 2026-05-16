import { TrButton } from '../TrButton'
import { useFeatureFlagsStore } from '../../store/featureFlagsStore'
import { appendAudit } from '../../store/auditTrailStore'
import { runFeatureFlagChecks } from '../../selfTest/checks'

export function FeatureFlagPanel() {
  const flags = useFeatureFlagsStore((s) => s.flags)
  const setFlag = useFeatureFlagsStore((s) => s.setFlag)
  const resetFlags = useFeatureFlagsStore((s) => s.resetFlags)

  const validateFlags = () => {
    const checks = runFeatureFlagChecks()
    const worst = checks.some((c) => c.status === 'FAIL')
      ? 'FAIL'
      : checks.some((c) => c.status === 'WARN')
        ? 'WARN'
        : 'PASS'
    appendAudit({
      actor: 'self_test',
      action: 'feature_flags.validate',
      detail: checks.map((c) => `${c.id}:${c.status}`).join(', '),
      validation: worst,
    })
  }

  return (
    <section className="flex flex-col gap-3 text-sm">
      <label className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-tr-border)] px-3 py-2">
        <span>Mock payments only (locked)</span>
        <input type="checkbox" checked={flags.mockPaymentsOnly} disabled readOnly />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-tr-border)] px-3 py-2">
        <span>Card rail demo slot</span>
        <input
          type="checkbox"
          checked={flags.enableCardRail}
          onChange={(e) => setFlag('enableCardRail', e.target.checked)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-tr-border)] px-3 py-2">
        <span>Rider dispatch demo</span>
        <input
          type="checkbox"
          checked={flags.enableRiderDispatchDemo}
          onChange={(e) => setFlag('enableRiderDispatchDemo', e.target.checked)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-tr-border)] px-3 py-2">
        <span className="font-mono text-xs">restaurant.qr_coupon.enabled</span>
        <input
          type="checkbox"
          checked={flags.qrCouponEnabled}
          onChange={(e) => setFlag('qrCouponEnabled', e.target.checked)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-tr-border)] px-3 py-2">
        <span className="font-mono text-xs">restaurant.oneai_event.enabled</span>
        <input
          type="checkbox"
          checked={flags.oneAiEventEnabled}
          onChange={(e) => setFlag('oneAiEventEnabled', e.target.checked)}
        />
      </label>
      <label className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-tr-border)] px-3 py-2">
        <span>HQ force cancel (mock)</span>
        <input
          type="checkbox"
          checked={flags.enableHqForceCancel}
          onChange={(e) => setFlag('enableHqForceCancel', e.target.checked)}
        />
      </label>
      <p className="text-xs text-[var(--color-tr-muted)]">
        Active rail: <span className="font-mono">{flags.activePaymentRail}</span>
      </p>
      <div className="flex gap-2">
        <TrButton variant="ghost" className="flex-1" onClick={() => resetFlags()}>
          Reset defaults
        </TrButton>
        <TrButton className="flex-1" onClick={validateFlags}>
          Validate flags
        </TrButton>
      </div>
    </section>
  )
}
