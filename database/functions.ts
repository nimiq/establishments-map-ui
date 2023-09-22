import type { DatabaseArgs, DatabaseAuthArgs, InsertLocationsClustersSetParams, InsertWithPlaceIdResponse, Location, RawLocation } from '../types/index.ts'
import type { InsertWithPlaceIdArgs } from '../types/database.ts'
import { DbWriteFunction } from '../types/database.ts'
import { fetchDb, getAuth } from './fetch.ts'
import { useCaptcha } from '@/composables/useCaptcha'

const { getToken } = useCaptcha()

async function insertTokenIntoAuth(dbArgs: DatabaseAuthArgs) {
  return dbArgs.token ? { ...dbArgs } : { ...dbArgs, token: await getAuth(dbArgs) }
}

export async function addLocation(dbArgs: DatabaseAuthArgs, location: Omit<RawLocation, 'uuid'>) {
  return await fetchDb<Location>(DbWriteFunction.UpsertRawLocation, await insertTokenIntoAuth(dbArgs), JSON.stringify({ location }))
}

export async function addLocationWithPlaceId(dbArgs: DatabaseAuthArgs, locations: InsertWithPlaceIdArgs[]): Promise<InsertWithPlaceIdResponse | undefined> {
  return await fetchDb<InsertWithPlaceIdResponse>(DbWriteFunction.UpsertLocationsWithGMaps, await insertTokenIntoAuth(dbArgs), JSON.stringify({ locations }))
}

export async function deleteLocation(dbArgs: DatabaseAuthArgs, uuid: string) {
  return await fetchDb<Location>(DbWriteFunction.DeleteLocation, await insertTokenIntoAuth(dbArgs), JSON.stringify({ location_uuid: uuid }))
}

export async function insertLocationsClusterSet(dbArgs: DatabaseAuthArgs, data: InsertLocationsClustersSetParams) {
  return await fetchDb<Location>(DbWriteFunction.InsertLocationsClustersSet, await insertTokenIntoAuth(dbArgs), JSON.stringify(data))
}

export async function flushClusterTable(dbArgs: DatabaseAuthArgs) {
  return await fetchDb<Location>(DbWriteFunction.FlushClustersTable, await insertTokenIntoAuth(dbArgs))
}

export async function authAnonUser(dbArgs: DatabaseArgs) {
  const g_token = await getToken()
  // console.log('g_token', g_token)
  return await fetchDb(DbWriteFunction.AuthAnonUser, dbArgs, JSON.stringify({ g_token }))
}
