import type { Point } from './composables/useMap'
import { i18n } from './i18n/i18n-setup'
import type { Suggestion } from './stores/autocomplete'

export interface BoundingBox {
  southWest: Point
  northEast: Point
}
export enum Currency {
  NIM = 'NIM',
  BTC = 'BTC',
  USDC_POLYGON = 'USDC_POLYGON',
  ETH = 'ETH',
  LTC = 'LTC',
  LBTC = 'LBTC',
  XLM = 'XLM',
  XRP = 'XRP',
  DASH = 'DASH',
}
export const currencies = Object.values(Currency)

export enum Category {
  CarsBikes = 'cars_bikes',
  Cash = 'cash',
  ComputerElectronics = 'computer_electronics',
  Entertainment = 'entertainment',
  FoodDrinks = 'food_drinks',
  HealthBeauty = 'health_beauty',
  HotelLodging = 'hotel_lodging',
  LeisureActivities = 'leisure_activities',
  Miscellaneous = 'miscellaneous',
  RestaurantBar = 'restaurant_bar',
  Shop = 'shop',
  SportsFitness = 'sports_fitness',
}
export const categories = Object.values(Category)

export function translateCategory(category: Category) {
  switch (category) {
    case Category.CarsBikes: return i18n.t('Cars & Bikes')
    case Category.Cash: return i18n.t('Cash')
    case Category.ComputerElectronics: return i18n.t('Computer & Electronics')
    case Category.Entertainment: return i18n.t('Entertainment')
    case Category.FoodDrinks: return i18n.t('Food & Drinks')
    case Category.HealthBeauty: return i18n.t('Health & Beauty')
    case Category.HotelLodging: return i18n.t('Hotel & Lodging')
    case Category.LeisureActivities: return i18n.t('Leisure Activities')
    case Category.Miscellaneous: return i18n.t('Miscellaneous')
    case Category.RestaurantBar: return i18n.t('Restaurant & Bar')
    case Category.Shop: return i18n.t('Shop')
    case Category.SportsFitness: return i18n.t('Sports & Fitness')
    default:
      console.error(`Translation for category ${category} is missing`)
      return i18n.t('Miscellaneous')
  }
}

export enum ProviderName {
  Default = 'DEFAULT',
  DefaultAtm = 'DefaultAtm',
  GoCrypto = 'GoCrypto',
  Kurant = 'Kurant',
  Bluecode = 'Bluecode',
  CryptopaymentLink = 'CryptopaymentLink',
  Edenia = 'Edenia',
}
const PROVIDER_NAMES = Object.values(ProviderName)

export enum LocationType {
  Atm = 'atm',
  Shop = 'shop',
}

export interface Location {
  uuid: string
  name: string
  address: string
  category: Category
  category_label: string
  gmaps_type: string
  lat: number
  lng: number
  provider: ProviderName
  accepts: Currency[]
  sells: Currency[]
  type: LocationType
  rating?: number
  photo?: string
  instagram?: string
  url?: string
  gmaps?: string
  facebook?: string
}

const databaseUrl = import.meta.env.VITE_DATABASE_URL
const databaseToken = import.meta.env.VITE_DATABASE_KEY

async function fetchDb<T>(query: string): Promise<T | undefined> {
  const url = `${databaseUrl}/${query}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': databaseToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }).catch((error) => {
    return `Error fetching database: ${error}`
  })

  if (typeof response === 'string') {
    console.error(response)
    return undefined
  }

  if (!response.ok) {
    console.error(`Error fetching database: ${response.status} ${response.statusText}`)
    return undefined
  }

  const data: T = await response.json()
  // eslint-disable-next-line no-console
  console.log(`🔍 GET ${url}`)
  // eslint-disable-next-line no-console
  console.log(data)
  return data
}

function parseLocation(location: Location) {
  if (!location.provider || !PROVIDER_NAMES.includes(location.provider)) {
    console.warn(`Unknown provider: '${location.provider}'. Location: ${JSON.stringify(location)}`)
    location.provider = ProviderName.Default
  }

  const isAtm = location.sells.length > 0 || location.category === Category.Cash
  location.type = isAtm ? LocationType.Atm : LocationType.Shop
  if (isAtm && location.provider === ProviderName.Default)
    location.provider = ProviderName.DefaultAtm

  location.url = location.gmaps || location.instagram || location.facebook

  // Make the translation reactive
  Object.defineProperty(location, 'category_label', {
    get: () => translateCategory(location.category),
  })

  return location
}

export async function getLocations({ northEast, southWest }: BoundingBox): Promise<Location[]> {
  const query = `rpc/get_locations?swlng=${southWest.lng}&nelng=${northEast.lng}&swlat=${southWest.lat}&nelat=${northEast.lat}`
  const data = await fetchDb<Location[]>(query) ?? []
  return data.map(parseLocation)
}

export async function getLocation(uuid: string): Promise<Location | undefined> {
  const query = `rpc/get_location?uuid=${uuid}`
  const location = await fetchDb<Location>(query)
  if (!location) {
    console.warn(`Location ${uuid} not found`)
    return undefined
  }
  return parseLocation(location)
}

export async function queryResults(userQuery: string) {
  const query = `rpc/query_search?query=${userQuery}`
  const suggestions = await fetchDb<Suggestion[]>(query)
  return suggestions || []
}
