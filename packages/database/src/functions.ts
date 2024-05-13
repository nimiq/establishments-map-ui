import type { Args, DatabaseAuthArgs, DatabaseAuthenticateUserArgs, MapLocation, RawLocation, Returns } from '../../types/src/index.ts'
import { AuthWriteDbFunction } from '../../types/src/index.ts'
import { authenticateUser } from './auth.ts'
import { fetchDb } from './fetch.ts'

export async function addLocation(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs, location: Omit<RawLocation, 'uuid'>) {
  return await fetchDb<MapLocation>(AuthWriteDbFunction.UpsertRawLocation, await authenticateUser(dbArgs), { body: { location } })
}

export async function addLocationWithPlaceId(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs, locations: Args[AuthWriteDbFunction.UpsertLocationsWithGMaps]) {
  return await fetchDb<Returns[AuthWriteDbFunction.UpsertLocationsWithGMaps]>(AuthWriteDbFunction.UpsertLocationsWithGMaps, await authenticateUser(dbArgs), { body: { locations } })
}

export async function deleteLocation(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs, location_uuid: string) {
  return await fetchDb<MapLocation>(AuthWriteDbFunction.DeleteLocation, await authenticateUser(dbArgs), { body: { location_uuid } })
}

export async function insertMarkers(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs, { items, zoom_level }: Args[AuthWriteDbFunction.InsertMarkers]) {
  return await fetchDb<MapLocation>(AuthWriteDbFunction.InsertMarkers, await authenticateUser(dbArgs), { body: { items, zoom_level } })
}

export async function flushMarkersTable(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs) {
  return await fetchDb<MapLocation>(AuthWriteDbFunction.FlushMarkersTable, await authenticateUser(dbArgs))
}
