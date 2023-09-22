// eslint-disable no-console
import type { CaptchaUuid } from 'types'
import type { DatabaseArgs, DatabaseAuthArgs, DbReadFunction } from '../types/database.ts'
import { DbWriteFunction } from '../types/database.ts'
import { authAnonUser } from './functions.ts'

const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

export async function fetchDb<T, FnName extends DbReadFunction | DbWriteFunction = any>(fnName: FnName, { apikey, url: baseUrl, token }: DatabaseArgs, parameters: string = ''): Promise<T | undefined> {
  const isWriteOperation = Object.values(DbWriteFunction).includes(fnName as DbWriteFunction)
  if (isWriteOperation && !token && fnName !== DbWriteFunction.AuthAnonUser)
    throw new Error('Missing token for write operation. Make sure to call getAuth first to retrieve the token.')

  if (!isWriteOperation) {
    // Check if we are on the browser and have access to cookies
    const isBrowser = !!globalThis.document
    if (isBrowser) {
      // TODO: improve performance by caching the captcha_uuid in memory
      const captcha_uuid = getCaptchaUUIDFromLocalStorage()

      if (captcha_uuid) {
        parameters += `&captcha_uuid=${captcha_uuid}`
      }
      else {
        const res = await authAnonUser({ apikey, url: baseUrl }) as { uuid: string; max_age: number } | undefined
        if (res?.uuid) {
          localStorage.setItem('captcha_uuid', JSON.stringify({ uuid: res.uuid, expiration_date: new Date(Date.now() + res.max_age * 1000).toISOString() }))
          parameters += `&captcha_uuid=${res.uuid}`
        }
      }
    }
  }

  const method = isWriteOperation ? 'POST' : 'GET'

  const url = new URL(`${baseUrl}/rest/v1/rpc/${fnName}`)
  url.search = !isWriteOperation ? parameters : ''

  const body = isWriteOperation ? parameters : undefined
  const requiredHeaders = { ...HEADERS, apikey }
  const headers = token ? { ...requiredHeaders, Authorization: `Bearer ${token}` } : requiredHeaders

  /* eslint-disable no-console */
  const response = await fetch(url, { method, headers, body }).catch(error => `Error ${method} ${url.href}: ${error}`)

  if (typeof response === 'string') {
    console.error(response)
    return undefined
  }

  if (!response.ok) {
    console.error(`Error fetching database: ${response.status} ${response.statusText}. Response ${JSON.stringify(response)}`)
    return undefined
  }

  if (response.status === 204) {
    console.warn(`No content for query: ${url.href} | ${response.status} ${response.statusText}`)
    return undefined
  }

  const data: T = await response.json()

  console.group(`🔍 Database ${method} "${url.pathname.split('/').pop()}${url.search}"`)
  console.log(data)
  console.groupEnd()
  /* eslint-enable no-console */

  return data
}

export async function getAuth({ url, apikey, auth: { email, password } }: DatabaseAuthArgs): Promise<string | undefined> {
  const urlAuth = new URL(`${url}/auth/v1/token?grant_type=password`)
  const headers = { apikey }
  const body = JSON.stringify({ email, password })
  const response = await fetch(urlAuth, { method: 'POST', headers, body }).catch(error => `Error POST ${urlAuth.href}: ${error}`)
  if (typeof response === 'string') {
    console.error(response)
    return undefined
  }
  const data = await response.json()
  if (!data?.access_token)
    throw new Error('No access token found!')
  // eslint-disable-next-line no-console
  console.log(`Fetching token from ${urlAuth.href}. Token: ${!!data.access_token}`)
  return data.access_token
}

function getCaptchaUUIDFromLocalStorage() {
  const value = localStorage.getItem('captcha_uuid')
  if (!value)
    return undefined

  const object = JSON.parse(value) as CaptchaUuid
  if (object.expiration_date > new Date().toISOString()) {
    return object.uuid
  }
  else {
    localStorage.removeItem('captcha_uuid')
    return undefined
  }
}
