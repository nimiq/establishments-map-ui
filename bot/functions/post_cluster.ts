import {
  DefineFunction,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { getDbAuthArgs } from '../util/db-args.ts'
import { getAuth } from '../../database/fetch.ts'

export const PostCluster = DefineFunction({
  callback_id: 'post_cluster',
  title: 'Post cluster',
  description: 'Computes the clusters for rendering',
  source_file: 'functions/post_cluster.ts',
})

export default SlackFunction(
  PostCluster,
  async ({ env }) => {
    const fnUrl = env.SUPABASE_CLUSTER_FUNCTION
    if (!fnUrl)
      return { error: 'No edge function defined' }

    const auth = getDbAuthArgs(env, false)
    const token = await getAuth(auth)
    if (!token)
      return { error: 'No token' }

    const headers = { Authorization: `Bearer ${token}`, apikey: auth.apikey }
    const res = await fetch(fnUrl, { method: 'POST', headers }).catch(error => `Error POST ${fnUrl}: ${error}`)
    if (!res || typeof res === 'string')
      return { error: `Error POST ${fnUrl}: ${(JSON.stringify(res))}` }
    if (res.status !== 201)
      return { error: `Error POST ${fnUrl}: ${(JSON.stringify(res))}` }
    return { outputs: {} }
  },
)
