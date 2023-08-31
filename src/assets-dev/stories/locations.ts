import { providersAssets } from '../provider-assets'
import { CATEGORIES } from '@/database'
import { translateCategory } from '@/translations'
import { Category, Currency, type Location, LocationLink, Provider } from '@/types'

type ExtraFields = Pick<Location, 'isAtm' | 'isShop' | 'isDark' | 'isLight' | 'provider' | 'category' | 'category_label' | 'providerTooltip' | 'theme' | 'bg' | 'bgFullCard' | 'hasBottomBanner' | 'sells' | 'url' | 'linkTo'>
export function getExtra(provider: Provider, sells: Currency[] = [], linkTo: LocationLink = LocationLink.GMaps): ExtraFields {
  const assets = providersAssets[provider]
  if (!assets)
    throw new Error(`Provider ${provider} not found in providersAssets`)

  const isAtm = sells.length > 0
  const category = isAtm ? Category.CarsBikes : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]

  let url

  if (linkTo === LocationLink.GMaps)
    url = 'https://goo.gl/maps/ujJkv9DFuPfkwqat9'
  else if (linkTo === LocationLink.Instagram)
    url = 'https://www.instagram.com/nimiq/'
  else if (linkTo === LocationLink.Facebook)
    url = 'https://www.facebook.com/nimiq/'

  return {
    isAtm,
    isShop: !isAtm,
    isDark: assets.theme === 'dark',
    isLight: assets.theme === 'light',
    ...assets,
    provider,
    category,
    hasBottomBanner: provider !== Provider.DefaultShop && provider !== Provider.DefaultAtm,
    category_label: translateCategory(category),
    sells,
    url,
    linkTo,
  }
}

export const locations: Record<Provider, Location> = {
  [Provider.GoCrypto]: {
    uuid: 'GoCrypto',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    ...getExtra(Provider.GoCrypto),
  },
  [Provider.Bluecode]: {
    uuid: 'Bluecode',
    name: 'Room 88',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH],
    gmaps_types: ['bar'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1543007631-283050bb3e8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    ...getExtra(Provider.Bluecode),
  },
  [Provider.CryptopaymentLink]: {
    uuid: 'CryptoPaymentLink',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.USDC_on_POLYGON],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    ...getExtra(Provider.CryptopaymentLink),
  },
  [Provider.DefaultAtm]: {
    uuid: 'DefaultATM',
    name: 'ATM',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH, Currency.DASH, Currency.XLM],
    gmaps_types: ['bank'],
    lat: 1,
    lng: 1,
    rating: 4,
    ...getExtra(Provider.DefaultAtm, [Currency.BTC, Currency.NIM, Currency.ETH, Currency.DASH, Currency.XLM]),

  },
  [Provider.Kurant]: {
    uuid: 'Kurant',
    name: 'ATM (Kurant)',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM],
    gmaps_types: ['bank'],
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    ...getExtra(Provider.Kurant, [Currency.BTC, Currency.NIM]),
  },
  [Provider.Edenia]: {
    uuid: 'Edenia',
    name: 'ATM (Edenia)',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [],
    gmaps_types: ['bank'],
    lat: 1,
    lng: 1,
    rating: 4,
    ...getExtra(Provider.Edenia, [Currency.BTC, Currency.NIM, Currency.USDC_on_POLYGON], LocationLink.Facebook),
  },
  [Provider.DefaultShop]: {
    uuid: 'DefaultShop',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    ...getExtra(Provider.DefaultShop, [], LocationLink.Instagram),
  },
}
