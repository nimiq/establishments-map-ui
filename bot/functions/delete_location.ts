/* eslint-disable no-console */

import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { deleteLocation } from '../../database/functions.ts'
import { getDbAuthArgs } from '../util/db-args.ts'
import { LocationType } from '../types/location.ts'

export const DeleteLocation = DefineFunction({
  callback_id: 'delete_location',
  title: 'Delete location',
  description:
    'Delete a location given its UUID. The information will be deleted immediately.',
  source_file: 'functions/delete_location.ts',
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
    required: ['environment', 'uuid'],
  },
  output_parameters: {
    properties: {
      location: {
        type: LocationType,
        description: 'The location',
      },
    },
    required: ['location'],
  },
})

export default SlackFunction(
  DeleteLocation,
  async ({ inputs, env }) => {
    const res = await deleteLocation(
      getDbAuthArgs(env, inputs.environment === 'Test'),
      inputs.uuid,
    )
    console.log(`Deleted ${JSON.stringify(res)}`)
    return !res || typeof res === 'string'
      ? { error: JSON.stringify(res) }
      : { outputs: { location: res } }
  },
)
