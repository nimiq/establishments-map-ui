import {
  DefineFunction,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { getDbAuthUserArgs } from '../util/db-args.ts'

export const PostMarkers = DefineFunction({
  callback_id: 'post_markers',
  title: 'Post markers',
  description: 'Computes the markers for rendering',
  source_file: 'functions/post_markers.ts',
})

export default SlackFunction(
  PostMarkers,
  async ({ env }) => {
    const fnUrl = env.SUPABASE_MARKERS_FUNCTION
    if (!fnUrl)
      return { error: 'No edge function defined' }

    const { apikey, authToken } = await getDbAuthUserArgs(env, false)

    if (!authToken)
      return { error: 'No token' }

    // eslint-disable-next-line no-console
    console.log(`POST ${fnUrl}`)

    const headers = { Authorization: `Bearer ${authToken}`, apikey }
    // The function takes more than 15 seconds to run, so we cannot wait for it
    fetch(fnUrl, { method: 'POST', headers }).catch(error => `Error POST ${fnUrl}: ${error}`)
    return { outputs: {} }
  },
)
