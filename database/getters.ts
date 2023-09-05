import type { BoundingBox, ComputedClusterSet, DatabaseArgs, Location, Suggestion } from '../types/index.ts'
import { Category, Currency, Provider } from '../types/index.ts'

enum DbFunction {
  GetLocations = 'get_locations',
  GetLocation = 'get_location_by_uuid',
  SearchLocations = 'search_locations',
  GetLocationsClustersSet = 'get_locations_clusters_set',
  GetMaxZoom = 'get_max_zoom',
}

/**
The types from the database are basically the same as the values we would get from the database
using select * from table_name.
Pros:
- Since these tables are rarely updated, we hardcode the values here, so we don't have to query.
- We can easily use the types in the frontend using the enums
- Easily create the translations.
Cons:
- Update the types manually when the database changes. This rarely happens and when it happens, most
likely we also need to update things in the UI, so not really a downside!
    -> If we change category, we need to add the proper icon and the translation
    -> If we change provider, we need to add the logo, assets, translations...
    -> And so on
 */
export const CURRENCIES = Object.values(Currency)
export const CATEGORIES = Object.values(Category)
export const PROVIDERS = Object.values(Provider)

async function fetchDb<T>(url: URL, apikey: DatabaseArgs['apikey']): Promise<T | undefined> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey,
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
  console.group(`🔍 Database "${url.pathname.split('/').pop()}${url.search}"`)
  console.log(data)
  console.groupEnd()
  /* eslint-enable no-console */

  return data
}

export async function getLocations({ apikey, url: baseUrl }: DatabaseArgs, { neLat, neLng, swLat, swLng }: BoundingBox, parseLocations: (l: Location) => Location = l => l): Promise<Location[]> {
  const url = new URL(`${baseUrl}/rest/v1/rpc/${DbFunction.GetLocations}`)
  url.searchParams.set('swlng', swLng.toString())
  url.searchParams.set('nelng', neLng.toString())
  url.searchParams.set('swlat', swLat.toString())
  url.searchParams.set('nelat', neLat.toString())
  const locations = await fetchDb<Location[]>(url, apikey) ?? []
  return locations.map(parseLocations)
}

export async function getLocation({ apikey, url: baseUrl }: DatabaseArgs, uuid: string, parseLocation: (l: Location) => Location): Promise<Location | undefined> {
  const url = new URL(`${baseUrl}/rest/v1/rpc/${DbFunction.GetLocation}`)
  url.searchParams.set('location_uuid', uuid)
  const location = await fetchDb<Location>(url, apikey)
  if (!location) {
    console.warn(`Location ${uuid} not found`)
    return undefined
  }
  return parseLocation(location)
}

export async function searchLocations({ apikey, url: baseUrl }: DatabaseArgs, query: string) {
  const url = new URL(`${baseUrl}/rest/v1/rpc/${DbFunction.SearchLocations}`)
  url.searchParams.set('p_query', query)
  return await fetchDb<Omit<Suggestion, 'type'>[]>(url, apikey) ?? []
}

export async function getClusters({ apikey, url: baseUrl }: DatabaseArgs, { neLat, neLng, swLat, swLng }: BoundingBox, zoom: number, parseLocation: (l: Location) => Location = l => l): Promise<ComputedClusterSet> {
  const url = new URL(`${baseUrl}/rest/v1/rpc/${DbFunction.GetLocationsClustersSet}`)
  url.searchParams.set('swlng', swLng.toString())
  url.searchParams.set('nelng', neLng.toString())
  url.searchParams.set('swlat', swLat.toString())
  url.searchParams.set('nelat', neLat.toString())
  url.searchParams.set('zoom_level', zoom.toString())
  const res = await fetchDb<ComputedClusterSet>(url, apikey)
  return {
    clusters: res?.clusters ?? [],
    singles: res?.singles.map(parseLocation) ?? [],
  }
}

/**
 * The maximum zoom level at which the clusters are computed in the database.
 * If the user zooms in more than this, the clusters will be computed in the client.
 */
export async function getClusterMaxZoom({ apikey, url: baseUrl }: DatabaseArgs): Promise<number> {
  const url = new URL(`${baseUrl}/rest/v1/rpc/${DbFunction.GetMaxZoom}`)
  return await fetchDb<number>(url, apikey) ?? -1 // FIXME: Show error to user instead of using -1
}
