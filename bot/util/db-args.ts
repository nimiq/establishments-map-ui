import type { Env } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import { authenticateUser } from '../../database/auth.ts'
import type { DatabaseAuthArgs, DatabaseAuthenticateUserArgs } from '../../types/database.ts'

export async function getDbAuthUserArgs(envs: Env, dev: boolean): Promise<DatabaseAuthArgs> {
  if (!envs.DB_URL || !envs.DB_AUTH_KEY || !envs.DB_AUTH_EMAIL || !envs.DB_AUTH_PASS)
    throw new Error('DB_URL or DB_AUTH_KEY is not defined')

  const dbArgs: DatabaseAuthenticateUserArgs = {
    url: dev ? envs.DB_URL_TEST : envs.DB_URL,
    apikey: dev ? envs.DB_AUTH_KEY_TEST : envs.DB_AUTH_KEY,
    auth: {
      email: envs.DB_AUTH_EMAIL,
      password: envs.DB_AUTH_PASS,
    },
  }

  return await authenticateUser(dbArgs)
}
