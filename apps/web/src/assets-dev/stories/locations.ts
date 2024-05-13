import { CATEGORIES } from 'database'
import { Category, Currency, LocationLink, type MapLocation, Provider } from 'types'
import { getCardConfiguration } from '../banner-assets'

type ExtraFields = Pick<MapLocation, 'isAtm' | 'isDark' | 'isLight' | 'provider' | 'category' | 'category_label' | 'sells' | 'url' | 'linkTo'> & ReturnType<typeof getCardConfiguration>
export function getExtra(provider: Provider, sells: Currency[] = [], linkTo: LocationLink = LocationLink.GMaps): ExtraFields {
  const cardConfiguration = getCardConfiguration(provider)
  if (!cardConfiguration)
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
    isDark: cardConfiguration.theme === 'dark',
    isLight: cardConfiguration.theme === 'light',
    ...cardConfiguration,
    provider,
    category,
    category_label: translateCategory(category),
    sells,
    url,
    linkTo,
  }
}

export const locations: Record<Provider, MapLocation> = {
  [Provider.Coinmap]: {
    uuid: 'NimiqPayApp',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.LBTC],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.Coinmap),
  },
  [Provider.AcceptLightning]: {
    uuid: 'NimiqPayApp',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.LBTC],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.BtcMap),
  },
  [Provider.BtcMap]: {
    uuid: 'NimiqPayApp',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.LBTC],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.BtcMap),
  },
  [Provider.Bridge2Bitcoin]: {
    uuid: 'NimiqPayApp',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.LBTC],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.Bridge2Bitcoin),
  },
  [Provider.NAKA]: {
    uuid: 'NAKA',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.BINANCE_PAY],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.NAKA),
  },
  [Provider.Bluecode]: {
    uuid: 'Bluecode',
    name: 'Room 88',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.BTC, Currency.ETH],
    gmaps_types: ['bar'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1543007631-283050bb3e8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.Bluecode),
  },
  [Provider.CryptopaymentLink]: {
    uuid: 'CryptoPaymentLink',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.BTC, Currency.USDC_on_POLYGON],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.CryptopaymentLink),
  },
  [Provider.DefaultAtm]: {
    uuid: 'DefaultATM',
    name: 'ATM',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.BTC, Currency.ETH, Currency.DASH, Currency.XLM],
    gmaps_types: ['bank'],
    lat: 1,
    lng: 1,
    rating: 4,
    cryptocity: 'San Jose',
    ...getExtra(Provider.DefaultAtm, [Currency.NIM, Currency.BTC, Currency.ETH, Currency.DASH, Currency.XLM]),
  },
  [Provider.Kurant]: {
    uuid: 'Kurant',
    name: 'ATM (Kurant)',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.BTC],
    gmaps_types: ['bank'],
    lat: 1,
    lng: 1,
    rating: 4,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    cryptocity: 'San Jose',
    ...getExtra(Provider.Kurant, [Currency.NIM, Currency.BTC]),
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
    cryptocity: 'San Jose',
    ...getExtra(Provider.Edenia, [Currency.NIM, Currency.BTC, Currency.USDC_on_POLYGON], LocationLink.Facebook),
  },
  [Provider.DefaultShop]: {
    uuid: 'DefaultShop',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.NIM, Currency.BTC, Currency.ETH],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.DefaultShop, [], LocationLink.Instagram),
  },
  [Provider.BitcoinJungle]: {
    uuid: 'BitcoinJungle',
    name: 'Mercedes-Benz Arena',
    address: 'Kreuzbergstrasse 28, 10247, Berlin',
    accepts: [Currency.BTC],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    rating: 4,
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    cryptocity: 'San Jose',
    ...getExtra(Provider.BitcoinJungle),
  },
}
