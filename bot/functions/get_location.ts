/* eslint-disable no-console */

import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.7.0/mod.ts'
import { getLocation } from '../../../packages/database/src/index.ts'
import { LocationType } from '../types/location.ts'
import { getDbAuthUserArgs } from '../util/db-args.ts'

export const GetLocation = DefineFunction({
  callback_id: 'get_location_info',
  title: 'Get location',
  description: 'Gets the location given any of its params.',
  source_file: 'functions/get_location.ts',
  input_parameters: {
    properties: {
      uuid: {
        type: Schema.types.string,
        description: 'The UUID of the location',
      },
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
    },
    required: ['uuid', 'environment'],
  },
  output_parameters: {
    properties: {
      location: {
        type: LocationType,
        description: 'The location instance',
      },
    },
    required: ['location'],
  },
})

export default SlackFunction(
  GetLocation,
  async ({ inputs, env }) => {
    const res = await getLocation(
      await getDbAuthUserArgs(env, inputs.environment === 'Test'),
      inputs.uuid!,
      l => l,
    )
    console.log(`Fetched location ${JSON.stringify(res)}`)
    return !res || typeof res === 'string'
      ? { error: JSON.stringify(res) }
      : { outputs: { location: res } }
  },
)
