/* eslint-disable no-console */

import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.7.0/mod.ts'
import { getStats } from '../../../packages/database/src/index.ts'
import { getDbAuthUserArgs } from '../util/db-args.ts'

export const GetStats = DefineFunction({
  callback_id: 'get_stats',
  title: 'Get stats',
  description: 'Gets the stats from the database',
  source_file: 'functions/get_stats.ts',
  input_parameters: {
    properties: {
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
    },
    required: ['environment'],
  },
  output_parameters: {
    properties: {
      stats: {
        type: Schema.types.object,
        description: 'The stats from the database as JSON',
      },
    },
    required: ['stats'],
  },
})

export default SlackFunction(
  GetStats,
  async ({ inputs, env }) => {
    const res = await getStats(await getDbAuthUserArgs(env, inputs.environment === 'Test'))
    console.log(`Fetched stats ${JSON.stringify(res)}`)
    return !res || typeof res === 'string'
      ? { error: JSON.stringify(res) }
      : { outputs: { stats: res } }
  },
)
