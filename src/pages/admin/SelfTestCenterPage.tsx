import { useCallback, useState } from 'react'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { AuditTrailPanel } from '../../components/selfTest/AuditTrailPanel'
import { DiagnosticsPanel } from '../../components/selfTest/DiagnosticsPanel'
import { FeatureFlagPanel } from '../../components/selfTest/FeatureFlagPanel'
import { SelfTestCheckList } from '../../components/selfTest/SelfTestCheckList'
import { getLastSelfTestSummary, runSelfTestSuite } from '../../selfTest/runSelfTests'
import type { SelfTestRunSummary } from '../../selfTest/types'

export function SelfTestCenterPage() {
  const [summary, setSummary] = useState<SelfTestRunSummary | null>(
    () => getLastSelfTestSummary() ?? runSelfTestSuite(),
  )
  const [running, setRunning] = useState(false)

  const runAll = useCallback(() => {
    setRunning(true)
    try {
      setSummary(runSelfTestSuite())
    } finally {
      setRunning(false)
    }
  }, [])

  return (
    <article className="flex max-w-3xl flex-col gap-4">
      <MockBanner />
      <header>
        <h2 className="text-lg font-bold">Self-Test Center</h2>
        <p className="mt-1 text-sm text-[var(--color-tr-muted)]">
          Mock diagnostics, audit trail, feature flags, and smoke checks. No live trading, settlement, or
          on-chain execution.
        </p>
      </header>

      <DiagnosticsPanel summary={summary} onRun={runAll} running={running} />

      <Card>
        <h3 className="text-sm font-semibold">Self-test checks</h3>
        <div className="mt-3">
          <SelfTestCheckList checks={summary?.checks ?? []} />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold">Feature flag validation</h3>
        <div className="mt-3">
          <FeatureFlagPanel />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold">Audit trail (append-only)</h3>
        <div className="mt-3">
          <AuditTrailPanel />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold">Smoke test (CLI)</h3>
        <p className="mt-2 text-xs text-[var(--color-tr-muted)]">
          Run without websocket: <code className="font-mono">npm run test</code>,{' '}
          <code className="font-mono">npm run smoke</code>, <code className="font-mono">npm run build</code>,{' '}
          <code className="font-mono">npm run lint</code>
        </p>
      </Card>
    </article>
  )
}
