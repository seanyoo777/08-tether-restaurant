# Self-Test & Validation (08 — mock)

Global platform rule: **Self-Test Center**, **Diagnostics Panel**, **Audit Trail**, **Feature Flag Validation**, **Smoke Test** — all mock-only, no real trading/settlement/on-chain.

## UI entry

| Surface | URL |
|---------|-----|
| HQ / Store admin nav | `/admin/hq/self-test` |

## Diagnostics panel

- **PASS / WARN / FAIL** overall status
- **Issue count**, **last checked**, **Mock only** badge
- Per-check list with category and duration

## Audit trail

- `auditTrailStore` — **append-only** (max 200 entries, no delete/edit API)
- Seeded with `audit_trail.initialized`
- Admin mock actions (e.g. store order accept) append entries with optional `validation` status

## Feature flags

- `featureFlagsStore` — `mockPaymentsOnly` locked true; optional demo toggles
- **Validate flags** runs `runFeatureFlagChecks()` and appends audit entry

## Admin post-action validation

After store **접수 (mock)** on a live session order:

1. `updateStatus` (live map only)
2. `appendAdminActionAudit`
3. `validateAfterAdminAction` — order snapshot checks without websocket

## CLI

```bash
npm run test    # vitest (domain/cart)
npm run smoke   # lint + test + build
npm run build
npm run lint
```

## Code map

| Path | Role |
|------|------|
| `src/selfTest/types.ts` | `CheckStatus`, `SelfTestRunSummary`, `AuditTrailEntry` |
| `src/selfTest/checks.ts` | Pure-ish check runners |
| `src/selfTest/runSelfTests.ts` | Suite + post-admin validation |
| `src/store/auditTrailStore.ts` | Append-only trail |
| `src/store/featureFlagsStore.ts` | Mock flags + fallbacks |
| `src/pages/admin/SelfTestCenterPage.tsx` | HQ Self-Test Center UI |
