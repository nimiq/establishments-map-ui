import { AuthWriteDbFunction, type DatabaseAuthArgs, type DatabaseAuthenticateUserArgs, type InsertLocationsClustersSetParams, type InsertWithPlaceIdArgs, type InsertWithPlaceIdResponse, type Location, type RawLocation } from '../types/index.ts'
import { authenticateUser } from './auth.ts'
import { fetchDb } from './fetch.ts'

export async function addLocation(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs, location: Omit<RawLocation, 'uuid'>) {
  return await fetchDb<Location>(AuthWriteDbFunction.UpsertRawLocation, await authenticateUser(dbArgs), { body: { location } })
}

export async function addLocationWithPlaceId(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs, locations: InsertWithPlaceIdArgs[]): Promise<InsertWithPlaceIdResponse | undefined> {
  return await fetchDb<InsertWithPlaceIdResponse>(AuthWriteDbFunction.UpsertLocationsWithGMaps, await authenticateUser(dbArgs), { body: { locations } })
}

export async function deleteLocation(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs, location_uuid: string) {
  return await fetchDb<Location>(AuthWriteDbFunction.DeleteLocation, await authenticateUser(dbArgs), { body: { location_uuid } })
}

export async function insertMarkers(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs, { items, zoom_level }: InsertLocationsClustersSetParams) {
  return await fetchDb<Location>(AuthWriteDbFunction.InsertMarkers, await authenticateUser(dbArgs), { body: { items, zoom_level } })
}

export async function flushMarkersTable(dbArgs: DatabaseAuthArgs | DatabaseAuthenticateUserArgs) {
  return await fetchDb<Location>(AuthWriteDbFunction.FlushMarkersTable, await authenticateUser(dbArgs))
}
