export type MenuItem = {
  id: string
  storeId: string
  name: string
  description: string
  priceKrw: number
  usdtApprox: number
  imageEmoji: string
  soldOut: boolean
}

export type Store = {
  id: string
  name: string
  category: string
  distanceKm: number
  rating: number
  reviewCount: number
  etaMin: number
  tags: string[]
  bannerEmoji: string
}

export const mockStores: Store[] = [
  {
    id: 'st_gangnam_kimchi',
    name: '강남 김치찌개 공방',
    category: '한식',
    distanceKm: 0.4,
    rating: 4.8,
    reviewCount: 128,
    etaMin: 28,
    tags: ['포장', '배달'],
    bannerEmoji: '🥘',
  },
  {
    id: 'st_mapo_burger',
    name: '마포 스모크 버거',
    category: '버거',
    distanceKm: 1.2,
    rating: 4.6,
    reviewCount: 342,
    etaMin: 35,
    tags: ['배달'],
    bannerEmoji: '🍔',
  },
  {
    id: 'st_yeoui_sushi',
    name: '여의 스시바',
    category: '일식',
    distanceKm: 2.0,
    rating: 4.9,
    reviewCount: 89,
    etaMin: 42,
    tags: ['예약', '배달'],
    bannerEmoji: '🍣',
  },
]

export const mockMenus: MenuItem[] = [
  {
    id: 'm1',
    storeId: 'st_gangnam_kimchi',
    name: '들깨 김치찌개',
    description: '국산 돼지 목살, 묵은지 365일 숙성',
    priceKrw: 12000,
    usdtApprox: 8.4,
    imageEmoji: '🍲',
    soldOut: false,
  },
  {
    id: 'm2',
    storeId: 'st_gangnam_kimchi',
    name: '제육덮밥',
    description: '양념 제육 + 계란후라이',
    priceKrw: 11000,
    usdtApprox: 7.7,
    imageEmoji: '🍚',
    soldOut: false,
  },
  {
    id: 'm3',
    storeId: 'st_mapo_burger',
    name: '스모크 베이컨 세트',
    description: '더블 패티, 체다, 스모크 소스',
    priceKrw: 15000,
    usdtApprox: 10.5,
    imageEmoji: '🍔',
    soldOut: false,
  },
  {
    id: 'm4',
    storeId: 'st_yeoui_sushi',
    name: '초밥 12피스',
    description: '당일 도착 참치·연어',
    priceKrw: 28000,
    usdtApprox: 19.6,
    imageEmoji: '🍣',
    soldOut: true,
  },
]

export function getStoreById(id: string): Store | undefined {
  return mockStores.find((s) => s.id === id)
}

export function getMenusForStore(storeId: string): MenuItem[] {
  return mockMenus.filter((m) => m.storeId === storeId)
}
