import { useNavigate, useParams } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { PageHeader } from '../../components/PageHeader'
import { TrButton } from '../../components/TrButton'
import { getStoreById } from '../../mock/catalog'

export function StoreDetailPage() {
  const navigate = useNavigate()
  const { storeId = '' } = useParams()
  const store = getStoreById(storeId)

  if (!store) {
    return (
      <div className="p-4">
        <PageHeader title="가게 없음" backTo="/search" />
        <p className="mt-4 text-sm text-[var(--color-tr-muted)]">목록에서 다시 선택해 주세요.</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="가게 상세" backTo="/" />
      <div className="flex flex-col gap-4 p-4 pb-8">
        <MockBanner />
        <div className="flex items-start gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-tr-surface-2)] text-3xl">
            {store.bannerEmoji}
          </div>
          <div>
            <h2 className="text-xl font-bold">{store.name}</h2>
            <p className="mt-1 text-sm text-[var(--color-tr-muted)]">
              {store.category} · ★{store.rating} ({store.reviewCount} 리뷰)
            </p>
            <p className="mt-1 text-xs text-[var(--color-tr-muted)]">배달 약 {store.etaMin}분 · {store.distanceKm}km</p>
          </div>
        </div>
        <Card>
          <p className="text-sm leading-relaxed text-[var(--color-tr-muted)]">
            사장님 휴대폰/관리자 화면으로 주문을 바로 확인합니다. 키오스크 없이 운영하는 매장에 맞춘 흐름입니다.
          </p>
        </Card>
        <TrButton className="w-full" onClick={() => navigate(`/stores/${store.id}/menu`)}>
          메뉴 보기
        </TrButton>
      </div>
    </div>
  )
}
