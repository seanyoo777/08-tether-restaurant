import { Navigate, useParams } from 'react-router-dom'

import { getStoreById } from '../../mock/catalog'

/** 짧은 URL·공유용 → 가게 상세 */
export function ShortStoreEntryPage() {
  const { storeId = '' } = useParams()
  if (!getStoreById(storeId)) return <Navigate to="/search" replace />
  return <Navigate to={`/stores/${storeId}`} replace />
}

/** QR·테이블 주문용 → 메뉴로 바로 진입 */
export function QrStoreEntryPage() {
  const { storeId = '' } = useParams()
  if (!getStoreById(storeId)) return <Navigate to="/search" replace />
  return <Navigate to={`/stores/${storeId}/menu`} replace />
}
