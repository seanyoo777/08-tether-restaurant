/** 오프라인 이벤트 캠페인 mock — 외부 API 없음 */
export type EventCampaign = {
  campaignId: string
  title: string
  subtitle: string
  storeId: string
  storeName: string
  endsAt: string
  prizeLabel: string
  bjEventTag?: string
  offlineOnly: true
}

const day = 24 * 60 * 60 * 1000

export const mockEventCampaigns: EventCampaign[] = [
  {
    campaignId: 'camp-offline-lunch-2026',
    title: '오프라인 점심 이벤트',
    subtitle: '매장 방문 후 쿠폰 발급 (mock)',
    storeId: 'st_mapo_burger',
    storeName: '마포 버거 랩',
    endsAt: new Date(Date.now() + 3 * day).toISOString(),
    prizeLabel: '음료 업그레이드',
    offlineOnly: true,
  },
  {
    campaignId: 'camp-offline-weekend-bj',
    title: '주말 BJ 팝업',
    subtitle: '오프라인 한정 (mock)',
    storeId: 'st_gangnam_kimchi',
    storeName: '강남 김치찌개 연구소',
    endsAt: new Date(Date.now() + 7 * day).toISOString(),
    prizeLabel: '사이드 1+1',
    bjEventTag: 'BJ · Popup',
    offlineOnly: true,
  },
]

export function getEventCampaignById(id: string): EventCampaign | undefined {
  return mockEventCampaigns.find((c) => c.campaignId === id)
}
