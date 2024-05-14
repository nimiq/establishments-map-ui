import type { DatabaseArgs, DatabaseAuthArgs, DatabaseAuthenticateUserArgs } from '../../types/src/index.ts'
import { AnonWriteDbFunction, DatabaseUser } from '../../types/src/index.ts'

export async function authenticateUser(dbArgs: DatabaseAuthenticateUserArgs | DatabaseAuthArgs): Promise<DatabaseAuthArgs> {
  if ('user' in dbArgs && dbArgs.user === DatabaseUser.Authenticated)
    return dbArgs
  const { url, apikey, auth: { email, password } } = dbArgs as DatabaseAuthenticateUserArgs
  const urlAuth = new URL(`${url}/auth/v1/token?grant_type=password`)
  const headers = { apikey }
  const body = JSON.stringify({ email, password })
  const response = await fetch(urlAuth, { method: 'POST', headers, body }).catch(error => `Error POST ${urlAuth.href}: ${error}`)
  if (typeof response === 'string') {
    console.error(response)
    throw new Error(response)
  }
  const data = await response.json()
  if (!data?.access_token)
    throw new Error('No access token found!')
  // eslint-disable-next-line no-console
  console.log(`Created DatabaseAuthArgs structure from ${urlAuth.href} with authenticated user. Token: ${!!data.access_token}`)
  return { apikey, url, user: DatabaseUser.Authenticated, authToken: data.access_token }
}

export async function authenticateAnonUser({ apikey, url }: DatabaseArgs, captchaToken: string = '0000000000000000000'): Promise<string> {
  const urlAuth = new URL(`${url}/rest/v1/rpc/${AnonWriteDbFunction.AuthAnonUser}`)
  const body = JSON.stringify({ g_token: captchaToken })
  const response = await fetch(urlAuth, { method: 'POST', headers: { apikey, 'Content-Type': 'application/json' }, body }).catch(error => `Error POST ${urlAuth.href}: ${error}`)
  if (typeof response === 'string') {
    console.error(response)
    throw new Error(response)
  }
  const data: { captcha_uuid: string } = await response.json()
  if (!data || !data.captcha_uuid) {
    let randomUUID = globalThis.crypto?.randomUUID || (
      // @ts-expect-error This is fine
      [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
        c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    data.captcha_uuid = randomUUID()
  }
  //   throw new Error('No captcha uuid found!')

  /* eslint-disable no-console */
  console.group(`🔍 Database POST "${urlAuth.pathname.split('/').pop()}"`)
  console.log(JSON.stringify({ captchaToken: `${captchaToken.slice(0, 10)}...`, uuid: `${data.captcha_uuid.slice(0, 10)}...` }))
  console.groupEnd()
  /* eslint-enable no-console */

  return data.captcha_uuid || ''
}
