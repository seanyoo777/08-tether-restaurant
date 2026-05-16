import type { CommandItem } from '@tetherget/global-command-palette-core'
import { DEFAULT_ONEAI_PROFILE_HUB_PATH } from '@tetherget/global-profile-chip-core'

function oneAiHub(): string {
  const env = import.meta.env?.VITE_ONEAI_PROFILE_HUB_URL
  if (typeof env === 'string' && env.startsWith('http')) return env
  return `http://127.0.0.1:5173/${DEFAULT_ONEAI_PROFILE_HUB_PATH.replace(/^#/, '#')}`
}

export function buildRestaurantCommandRegistry(): CommandItem[] {
  return [
    {
      id: 'tr-coupon-wallet',
      title: 'Coupon Wallet',
      subtitle: 'Restaurant · /coupons',
      category: 'coupon',
      platformId: 'restaurant',
      keywords: ['coupon', 'wallet', 'qr', '쿠폰'],
      actionType: 'route',
      target: '/coupons',
      enabled: true,
      mockOnly: true,
    },
    {
      id: 'tr-coupon-detail',
      title: 'Coupon Detail',
      subtitle: 'Restaurant · first mock coupon',
      category: 'coupon',
      platformId: 'restaurant',
      keywords: ['coupon', 'detail', 'qr'],
      actionType: 'route',
      target: '/coupons/cpn-bj-luna-001',
      enabled: true,
      mockOnly: true,
    },
    {
      id: 'tr-oneai-event',
      title: 'OneAI Event',
      subtitle: 'Restaurant · /events/oneai',
      category: 'event',
      platformId: 'restaurant',
      keywords: ['oneai', 'event', 'lucky'],
      actionType: 'route',
      target: '/events/oneai',
      enabled: true,
      mockOnly: true,
    },
    {
      id: 'tr-help',
      title: 'Help',
      subtitle: 'Restaurant · /coupons/help',
      category: 'help',
      platformId: 'restaurant',
      keywords: ['help', 'faq', 'guide'],
      actionType: 'route',
      target: '/coupons/help',
      enabled: true,
      mockOnly: true,
    },
    {
      id: 'tr-my-profile',
      title: 'My Profile',
      subtitle: 'Restaurant · /me',
      category: 'profile',
      platformId: 'restaurant',
      keywords: ['profile', 'me', '내정보'],
      actionType: 'route',
      target: '/me',
      enabled: true,
      mockOnly: true,
    },
    {
      id: 'tr-oneai-profile',
      title: 'OneAI Profile',
      subtitle: 'OneAI Profile Hub (mock link)',
      category: 'profile',
      platformId: 'oneai',
      keywords: ['oneai', 'profile', 'hub'],
      actionType: 'external_mock',
      target: oneAiHub(),
      enabled: true,
      mockOnly: true,
    },
  ]
}
