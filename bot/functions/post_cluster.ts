import {
  DefineFunction,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { getDbAuthUserArgs } from '../util/db-args.ts'

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

    const { apikey, authToken } = await getDbAuthUserArgs(env, false)

    if (!authToken)
      return { error: 'No token' }

    const headers = { Authorization: `Bearer ${authToken}`, apikey }
    // The function takes more than 15 seconds to run, so we cannot wait for it
    fetch(fnUrl, { method: 'POST', headers }).catch(error => `Error POST ${fnUrl}: ${error}`)
    return { outputs: {} }
  },
)
