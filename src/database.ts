import { providersAssets } from './assets-dev/provider-assets'
import type { Suggestion } from './stores/autocomplete'
import { translateCategory } from './translations'
import { type BoundingBox, Category, Currency, type Location, LocationLink, Provider, Theme } from './types'

export const CURRENCIES = Object.values(Currency)
export const CATEGORIES = Object.values(Category)
export const PROVIDERS = Object.values(Provider)

const databaseUrl = import.meta.env.VITE_DATABASE_URL
const databaseToken = import.meta.env.VITE_DATABASE_KEY

// TODO: It would be nice to show error messages to the user as a Toast 🙃
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

  /* eslint-disable no-console */
  console.group('🔍 Database GET')
  console.log(`Fetching to ${url}`)
  console.log(data)
  console.groupEnd()
  /* eslint-enable no-console */

  return data
}

function parseLocation(location: Location) {
  const isAtm = location.category === Category.Cash

  if (!location.provider || !PROVIDERS.includes(location.provider)) {
    console.warn(`Unknown provider: '${location.provider}'. Setting ${location.provider} provider. Location: ${JSON.stringify(location)}`)
    location.provider = isAtm ? Provider.DefaultAtm : Provider.DefaultShop
  }

  // Prioritize links in this order: 1. Google Maps -> 2. Instagram -> 3. Facebook
  location.linkTo = location.gmaps ? LocationLink.GMaps : location.instagram ? LocationLink.Instagram : location.facebook ? LocationLink.Facebook : undefined
  location.url = location.gmaps || location.instagram || location.facebook

  Object.assign(location, providersAssets[location.provider]) // Assing all the keys from the asset to the location

  location.isAtm = isAtm
  location.isShop = location.category === Category.Shop
  location.isDark = location.theme === Theme.Dark
  location.isLight = location.theme === Theme.Light
  location.hasBottomBanner = location.provider !== Provider.DefaultShop && location.provider !== Provider.DefaultAtm

  if (isAtm && location.provider === Provider.DefaultShop)
    location.provider = Provider.DefaultAtm

  // Make the translation reactive in case user change language
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
