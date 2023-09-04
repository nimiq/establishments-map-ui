/* eslint-disable no-console */

import { DbWriteFunction } from '../types/index.ts'
import type { DatabaseAuthArgs, InsertLocationsClustersSetParams } from '../types/index.ts'

async function fetchDb<T>(
  { url, apikey, auth }: DatabaseAuthArgs,
  functionName: DbWriteFunction,
  body?: string,
): Promise<T | string> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    apikey,
  }

  const urlAuth = new URL(`${url}/auth/v1/token?grant_type=password`)
  console.log(
    `Making auth request to POST ${urlAuth.href} with headers ${
      JSON.stringify(headers)
    }`,
  )

  console.log(`Email is set? ${!!auth.email}. Password is set? ${!!auth.password}.`)

  const authResponse = await fetch(urlAuth, {
    method: 'POST',
    headers,
    body: JSON.stringify(auth),
  }).catch((error) => {
    return `Error fetching the auth token: ${error}`
  })
  if (typeof authResponse === 'string') {
    console.error(authResponse)
    return authResponse
  }

  const authData = await authResponse?.json()
  const accessToken = authData?.access_token
  if (!accessToken) {
    return `Error Refresh Auth Token. \`access_token\` not in the response. Response: ${
      JSON.stringify({ authData })
    }`
  }
  console.log(`Got access token? ${!!accessToken}`)
  headers.Authorization = `Bearer ${accessToken}`

  const urlRequest = new URL(`${url}/rest/v1/rpc/${functionName}`)

  console.log(`POST ${urlRequest.href} ${JSON.stringify(headers)}`)
  console.assert(body, body || 'No body provided')

  const response = await fetch(urlRequest, { method: 'POST', headers, body }).catch(e =>
    `Error fetching database: ${e}`,
  )
  if (typeof response === 'string') {
    console.error(response)
    return response
  }

  if (!response.ok) {
    const error = await response.json()
    console.error(
      `Error FetchDb: ${response.status} ${response.statusText}. Response ${
        JSON.stringify(error)
      }`,
    )
    console.error(error)
    return error
  }

  if (response.status === 204) {
    console.log(
      `No content for query: ${urlRequest.href} | ${response.status} ${response.statusText}`,
    )
    return `No content for query: ${urlRequest.href} | ${response.status} ${response.statusText}`
  }

  const data: T = await response.json()
  console.log(`Fetched ${urlRequest.href}: ${JSON.stringify(data)}`)
  return data
}

// type RawLocation = Omit<LocationDb, 'uuid' | 'category_label'>

// export async function addRawLocation(dbArgs: DatabaseAuthArgs, location: RawLocation) {
//   const body = {
//     p_name: location.name,
//     p_address: location.address,
//     p_lng: location.lng,
//     p_lat: location.lat,
//     p_rating: location.rating || null,
//     p_photo: location.photo || null,
//     p_category: location.category,
//     p_gmaps_types: location.gmapstype || [],
//     p_gmaps: location.gmaps,
//     p_instagram: location.instagram || null,
//     p_facebook: location.facebook || null,
//     p_provider: location.provider,
//     p_sells: location.sells,
//     p_accepts: location.accepts,
//   }
//   return await fetchDb<LocationDb>(dbArgs, DbWriteFunction.InsertRaw, JSON.stringify(body))
// }

// export async function addRawLocations(dbArgs: DatabaseAuthArgs, locations: RawLocation[]) {
//   const body = locations.map(l => ({
//     p_name: l.name,
//     p_address: l.address,
//     p_lng: l.lng,
//     p_lat: l.lat,
//     p_rating: l.rating || null,
//     p_photo: l.photo || null,
//     p_category: l.category || null,
//     p_gmaps_types: l.gmapstype || [],
//     p_gmaps: l.gmaps,
//     p_instagram: l.instagram || null,
//     p_facebook: l.facebook || null,
//     p_provider: l.provider,
//     p_sells: l.sells,
//     p_accepts: l.accepts,
//   }))
//   return await fetchDb<LocationDb>(dbArgs, DbWriteFunction.InsertRawBulk, JSON.stringify(body))
// }

// type InsertWithPlaceId = Pick<LocationDb, 'provider' | 'accepts' | 'sells'> & { place_id: string }

// export async function addLocationWithPlaceId(dbArgs: DatabaseAuthArgs, { accepts, place_id, provider, sells }: InsertWithPlaceId) {
//   const body = {
//     p_place_id: place_id,
//     p_provider: provider,
//     p_accepts: accepts,
//     p_sells: sells,
//   }
//   return await fetchDb<LocationDb>(dbArgs, DbWriteFunction.Insert, JSON.stringify(body))
// }

export async function deleteLocation(dbArgs: DatabaseAuthArgs, uuid: string) {
  return await fetchDb(dbArgs, DbWriteFunction.DeleteLocation, JSON.stringify({ location_uuid: uuid }))
}

export async function insertLocationsClusterSet(dbArgs: DatabaseAuthArgs, data: InsertLocationsClustersSetParams) {
  return await fetchDb(dbArgs, DbWriteFunction.InsertLocationsClustersSet, JSON.stringify(data))
}

export async function flushClusterTable(dbArgs: DatabaseAuthArgs) {
  return await fetchDb(dbArgs, DbWriteFunction.FlushClustersTable)
}
