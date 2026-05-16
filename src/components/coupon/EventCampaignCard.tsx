import type { EventCampaign } from '../../mock/eventCampaigns'
import { TrButton } from '../TrButton'

type Props = {
  campaign: EventCampaign
  onClaim: (campaign: EventCampaign) => void
  claiming?: boolean
}

export function EventCampaignCard({ campaign, onClaim, claiming }: Props) {
  const ends = new Date(campaign.endsAt).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className="rounded-2xl border border-[var(--color-tr-border)] bg-gradient-to-br from-[var(--color-tr-surface-2)] to-[var(--color-tr-surface)] p-4">
      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-tr-accent)]">
        오프라인 캠페인
      </p>
      <h3 className="mt-1 text-base font-bold">{campaign.title}</h3>
      <p className="mt-1 text-sm text-[var(--color-tr-muted)]">{campaign.subtitle}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--color-tr-text)]">{campaign.storeName}</p>
      <p className="mt-1 text-xs text-[var(--color-tr-accent)]">{campaign.prizeLabel}</p>
      <p className="mt-1 text-[11px] text-[var(--color-tr-muted)]">종료 {ends}</p>
      {campaign.bjEventTag ? (
        <span className="mt-2 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-300">
          {campaign.bjEventTag}
        </span>
      ) : null}
      <TrButton className="mt-3 w-full" disabled={claiming} onClick={() => onClaim(campaign)}>
        쿠폰 발급 (mock)
      </TrButton>
    </article>
  )
}
