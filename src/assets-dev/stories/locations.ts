import { providersAssets } from '../provider-assets'
import { CATEGORIES } from '@/database'
import { translateCategory } from '@/translations'
import { Category, Currency, type Location, LocationType, Provider } from '@/types'

function getExtra(provider: Provider, locationType: LocationType): Pick<Location, 'isAtm' | 'isShop' | 'isDark' | 'isLight' | 'assets' | 'provider' | 'category' | 'category_label'> {
  const assets = providersAssets[provider]
  if (!assets)
    throw new Error(`Provider ${provider} not found in providersAssets`)

  const isAtm = locationType === LocationType.Atm
  const category = isAtm ? Category.CarsBikes : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]

  return {
    isAtm,
    isShop: locationType === LocationType.Shop,
    isDark: assets.theme === 'dark',
    isLight: assets.theme === 'light',
    assets,
    provider,
    category,
    category_label: translateCategory(category),
  }
}

export const locations: Record<Provider, Location> = {
  [Provider.Default]: {
    uuid: '1',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH],
    sells: [],
    gmaps_type: 'Stadium',
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    ...getExtra(Provider.Default, LocationType.Shop),
  },
  [Provider.DefaultAtm]: {
    uuid: '2',
    name: 'ATM',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH, Currency.DASH, Currency.XLM],
    sells: [],
    gmaps_type: 'Bank',
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    ...getExtra(Provider.DefaultAtm, LocationType.Shop),

  },
  [Provider.Kurant]: {
    uuid: '2',
    name: 'ATM (Kurant)',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM],
    sells: [Currency.NIM],
    gmaps_type: 'Bank',
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    ...getExtra(Provider.Kurant, LocationType.Shop),
  },
  [Provider.Bluecode]: {
    uuid: '3',
    name: 'Room 88',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH],
    sells: [],
    gmaps_type: 'Stadium',
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    photo: 'https://images.unsplash.com/photo-1543007631-283050bb3e8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    ...getExtra(Provider.Bluecode, LocationType.Shop),
  },
  [Provider.GoCrypto]: {
    uuid: '4',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH],
    sells: [],
    gmaps_type: 'Stadium',
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    ...getExtra(Provider.GoCrypto, LocationType.Shop),
  },
  [Provider.CryptopaymentLink]: {
    uuid: '5',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.USDC_POLYGON],
    sells: [],
    gmaps_type: 'Stadium',
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    ...getExtra(Provider.CryptopaymentLink, LocationType.Shop),
  },
  [Provider.Edenia]: {
    uuid: '5',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC, Currency.NIM, Currency.USDC_POLYGON],
    sells: [],
    gmaps_type: 'Stadium',
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    ...getExtra(Provider.Edenia, LocationType.Shop),
  },
}
