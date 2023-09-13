import type { Env } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types.ts'
import type { DatabaseArgs, DatabaseAuthArgs } from '../../types/database.ts'

export function getDbArgs(envs: Env, dev: boolean): DatabaseArgs {
  if (!envs.DB_URL || !envs.DB_AUTH_KEY)
    throw new Error('DB_URL or DB_AUTH_KEY is not defined')

  return {
    url: dev ? envs.DB_URL_TEST : envs.DB_URL,
    apikey: dev ? envs.DB_AUTH_KEY_TEST : envs.DB_AUTH_KEY,
  }
}

export function getDbAuthArgs(envs: Env, dev: boolean): DatabaseAuthArgs {
  if (!envs.DB_AUTH_EMAIL || !envs.DB_AUTH_PASS)
    throw new Error('DB_AUTH_EMAIL or DB_AUTH_PASS is not defined')

  return {
    ...getDbArgs(envs, dev),
    auth: {
      email: envs.DB_AUTH_EMAIL,
      password: envs.DB_AUTH_PASS,
    },
  }
}
