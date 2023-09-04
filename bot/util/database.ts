/* eslint-disable no-console */

import type { Establishment } from './types.ts'

enum DbFunction {
  UpsertRaw = 'upsert_location',
  UpsertWithMapsApi = 'upsert_location_with_gmaps_api',
  GetByUuid = 'get_location_by_uuid',
  DeleteLocation = 'delete_location_by_uuid',
}

const METHODS: Record<DbFunction, 'GET' | 'POST' | 'DELETE'> = {
  [DbFunction.UpsertRaw]: 'POST',
  [DbFunction.UpsertWithMapsApi]: 'POST',
  [DbFunction.GetByUuid]: 'GET',
  [DbFunction.DeleteLocation]: 'POST',
}

interface Auth {
  email?: string
  password?: string
  apikey: string
  google_maps_key?: string
}

async function fetchDb<T>(
  dbUrl: string,
  functionName: DbFunction,
  auth: Auth,
  dev: boolean,
  payload: string,
): Promise<T | string> {
  const method = METHODS[functionName]
  const isGet = method === 'GET'

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'apikey': auth.apikey,
  }

  let accessToken = ''
  if (!isGet) {
    const urlAuth = new URL(`${dbUrl}/auth/v1/token?grant_type=password`)
    console.log(
      `Making auth request to POST ${urlAuth.href} with headers ${
        JSON.stringify(headers)
      }`,
    )

    const { email, password } = auth
    console.log(`Email is set? ${!!email}. Password is set? ${!!password}.`)
    if (!email || !password)
      return `Error Fetch Auth Token. \`email\` or \`password\` not set. Email: ${!!email}. Password: ${!!password}`

    const authResponse = await fetch(urlAuth, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    }).catch((error) => {
      return `Error fetching the auth token: ${error}`
    })
    if (typeof authResponse === 'string') {
      console.error(authResponse)
      return authResponse
    }

    const authData = await authResponse?.json()
    accessToken = authData?.access_token
    if (!accessToken) {
      return `Error Refresh Auth Token. \`access_token\` not in the response. Response: ${
        JSON.stringify({ authData })
      }`
    }
    console.log(`Got access token? ${!!accessToken}`)
  }

  const url = new URL(`${dbUrl}/rest/v1/rpc/${functionName}`)
  let body
  if (isGet) {
    url.search = payload || ''
  }
  else {
    body = payload
    headers.Authorization = `Bearer ${accessToken}`
  }

  console.log(`${method} ${url.href} ${JSON.stringify(headers)}`)
  if (body)
    console.log(body)

  const response = await fetch(url, { method, headers, body }).catch(e =>
    `Error fetching database: ${e}`,
  )
  if (typeof response === 'string') {
    console.error(response)
    return response
  }
  console.log('reponse.ok', response.status, response.statusText, response.ok)

  if (!response.ok) {
    console.error(
      `Error. FetchDb Response: ${response.status} ${response.statusText}. ${
        JSON.stringify(response)
      }`,
    )
    return `Error. FetchDb Response: ${response.status} ${response.statusText}. ${
      JSON.stringify(response)
    }`
  }

  if (response.status === 204) {
    console.log(
      `No content for query: ${url.href} | ${response.status} ${response.statusText}`,
    )
    return `No content for query: ${url.href} | ${response.status} ${response.statusText}`
  }

  const data: T = await response.json()
  console.log(`Fetched ${url}: ${JSON.stringify(data)}`)
  return data
}

export async function upsertLocation(
  dbUrl: string,
  location: Establishment,
  dev: boolean,
  auth: Auth,
) {
  delete location.id
  const body = JSON.stringify({
    p_name: location.name,
    p_address: location.address,
    p_category: location.category,
    p_lng: location.lng,
    p_lat: location.lat,
    p_rating: location.rating || null,
    p_photo: location.photo || null,
    p_gmaps_types: location.gmapstype || [],
    p_instagram: location.instagram || null,
    p_facebook: location.facebook || null,
    p_provider: location.provider,
    p_sells: location.sells,
    p_accepts: location.accepts,
    p_gmaps_place_id: location.gmaps_place_id || null,
    p_uuid: location.uuid || null,
  })
  console.log(`Adding establishment: ${body}`)
  const res = await fetchDb<Establishment>(
    dbUrl,
    DbFunction.UpsertRaw,
    auth,
    dev,
    body,
  )
  if (typeof res === 'string' && !res.startsWith('No content for query'))
    return res
}

export async function upsertLocationWithPlaceId(
  dbUrl: string,
  { accepts, gmaps_place_id, provider, sells }: Partial<Establishment>,
  dev: boolean,
  auth: Auth,
) {
  const body = JSON.stringify({
    p_locations: [
      {
        place_id: gmaps_place_id,
        provider,
        sells,
        accepts,
        google_maps_key: auth.google_maps_key,
      },
    ],
  })
  const res = await fetchDb<{ added: Establishment[]; errors: any }>(
    dbUrl,
    DbFunction.UpsertWithMapsApi,
    auth,
    dev,
    body,
  )
  if (typeof res === 'string' && !res.startsWith('No content for query'))
    return res

  // @ts-expect-error This is not an error
  if (res.errors?.length > 0) {
    // @ts-expect-error This is not an error
    return JSON.stringify(res.errors)
  }

  // @ts-expect-error Not an error
  return res.added[0]
}

export async function getEstablishment(
  dbUrl: string,
  uuid: string,
  dev: boolean,
  auth: Auth,
) {
  const establishment = await fetchDb<Establishment>(
    dbUrl,
    DbFunction.GetByUuid,
    auth,
    dev,
    `location_uuid=${uuid}`,
  )
  if (establishment === null)
    return `No establishment found for: ${uuid}`

  return establishment
}

export async function deleteEstablishment(
  dbUrl: string,
  uuid: string,
  dev: boolean,
  auth: Auth,
) {
  const res = await fetchDb<Establishment>(
    dbUrl,
    DbFunction.DeleteLocation,
    auth,
    dev,
    JSON.stringify({ location_uuid: uuid }),
  )
  if (typeof res === 'string' && !res.startsWith('No content for query'))
    console.error(`Error deleting establishment ${uuid}: ${res}`)

  return res
}
