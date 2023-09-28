import type { FeatureCollection } from '@turf/helpers'
import type { Args, BoundingBox, DatabaseAnonArgs, DatabaseAuthArgs, DatabaseAuthenticateUserArgs, Location, Returns, Suggestion } from '../types/index.ts'
import { AnonReadDbFunction, AuthReadDbFunction, Category, Cryptocity, Currency, Provider } from '../types/index.ts'
import { fetchDb } from './fetch.ts'
import { authenticateUser } from './auth.ts'

/**
 * We hardcode these values here, because they are rarely updated.
 * Even if we update those values in the database, we always need to update UI regardless.
 */
export const CURRENCIES = Object.values(Currency)
export const CATEGORIES = Object.values(Category)
export const PROVIDERS = Object.values(Provider)
export const CRYPTOCITIES = Object.values(Cryptocity)

// Maximum number of rows from the database
const MAX_N_ROWS = 1000

export async function getLocations(dbArgs: DatabaseAuthArgs | DatabaseAnonArgs, { neLat, neLng, swLat, swLng }: BoundingBox, parseLocations: (l: Location) => Location = l => l): Promise<Location[]> {
  const query = new URLSearchParams({ nelat: neLat.toString(), nelng: neLng.toString(), swlat: swLat.toString(), swlng: swLng.toString() })
  let page = 1
  const locations: Location[] = []
  do {
    query.set('page_num', (page++).toString())
    locations.push(...await fetchDb<Location[]>(AnonReadDbFunction.GetLocations, dbArgs, { query }) ?? [])
  } while (locations.length > 0 && locations.length % MAX_N_ROWS === 0)
  return locations.map(parseLocations)
}

export async function getLocation(dbArgs: DatabaseAuthArgs | DatabaseAnonArgs, uuid: string, parseLocation: (l: Location) => Location): Promise<Location | undefined> {
  const query = new URLSearchParams()
  query.append('location_uuid', uuid)
  const location = await fetchDb<Location>(AnonReadDbFunction.GetLocation, dbArgs, { query })
  if (!location) {
    console.warn(`Location ${uuid} not found`)
    return undefined
  }
  return parseLocation(location)
}

export async function searchLocations(dbArgs: DatabaseAuthArgs | DatabaseAnonArgs, queryInput: string) {
  const query = new URLSearchParams()
  query.append('p_query', queryInput)
  return await fetchDb<Omit<Suggestion, 'type'>[]>(AnonReadDbFunction.SearchLocations, dbArgs, { query }) ?? []
}

export async function getMarkers(
  dbArgs: DatabaseAuthArgs | DatabaseAnonArgs,
  { boundingBox: { neLat, neLng, swLat, swLng }, zoom }: Args[AnonReadDbFunction.GetMarkers],
  parseLocation: (l: Location) => Location = l => l,
): Promise<Returns[AnonReadDbFunction.GetMarkers]> {
  const query = new URLSearchParams({ nelat: neLat.toString(), nelng: neLng.toString(), swlat: swLat.toString(), swlng: swLng.toString(), zoom_level: zoom.toString() })
  const res = await fetchDb<Returns[AnonReadDbFunction.GetMarkers]>(AnonReadDbFunction.GetMarkers, dbArgs, { query })
  return {
    clusters: res?.clusters ?? [],
    singles: res?.singles.map(parseLocation) ?? [],
  }
}

/**
 * The maximum zoom level at which the clusters are computed in the database.
 * If the user zooms in more than this, the clusters will be computed in the client.
 */
export async function getClusterMaxZoom(dbArgs: DatabaseAuthArgs | DatabaseAnonArgs) {
  return await fetchDb<number>(AnonReadDbFunction.GetMaxZoom, dbArgs) ?? -1 // FIXME: Show error to user instead of using -1
}

export async function getCryptocityPolygon(dbArgs: DatabaseAuthArgs | DatabaseAnonArgs, city: Cryptocity): Promise<FeatureCollection | undefined> {
  return await fetchDb<FeatureCollection>(AnonReadDbFunction.GetCryptocityPolygon, dbArgs, { query: new URLSearchParams({ city }) })
}

export async function getCryptocities(dbArgs: DatabaseAuthArgs | DatabaseAnonArgs, { boundingBox: { neLat, neLng, swLat, swLng }, excludedCities }: Args[AnonReadDbFunction.GetCryptocities]) {
  const query = new URLSearchParams({ nelat: neLat.toString(), nelng: neLng.toString(), swlat: swLat.toString(), swlng: swLng.toString() })
  excludedCities.forEach(city => query.append('excluded_cities', city))
  return await fetchDb<Returns[AnonReadDbFunction.GetCryptocities]>(AnonReadDbFunction.GetCryptocities, dbArgs, { query })
}

export async function getStats(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs) {
  return await fetchDb<Returns[AuthReadDbFunction.GetStats]>(AuthReadDbFunction.GetStats, await authenticateUser(dbArgs))
}
