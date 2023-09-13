/* eslint-disable no-console */

import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { addLocationWithPlaceId } from '../../database/functions.ts'
import { getDbAuthArgs } from '../util/db-args.ts'
import { LocationType } from '../../types/location.ts'
import type { Currency } from '../../types/database.ts'
import { Provider } from '../../types/database.ts'

export const CreateLocationWithPlaceId = DefineFunction({
  callback_id: 'create_location_with_place_id',
  title: 'New location with Place ID',
  description: 'Create an location with a Place ID',
  source_file: 'functions/create_location_with_place_id.ts',
  input_parameters: {
    properties: {
      place_id: {
        type: Schema.types.string,
        description: 'Google Place ID',
      },
      accepts: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
        description: 'The list of cryptos that the location accepts',
      },
      sells: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
        description: 'In case the location sells crypto like ATMs',
      },
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
    },
    required: ['place_id', 'accepts', 'environment'],
  },
  output_parameters: {
    properties: {
      location: {
        type: typeof LocationType,
      },
    },
    required: ['location'],
  },
})

export default SlackFunction(
  CreateLocationWithPlaceId,
  async ({ inputs, env }) => {
    const res = await addLocationWithPlaceId(
      getDbAuthArgs(env, inputs.environment === 'Test'),
      [{ accepts: inputs.accepts as Currency[], sells: inputs.sells as Currency[], place_id: inputs.place_id, provider: Provider.DefaultShop }],
    )
    console.log(`Created location with PlaceID ${JSON.stringify(res)}`)
    return (!res || typeof res === 'string' || res.added.length !== 1)
      ? { error: JSON.stringify(res) }
      : { outputs: { location: res.added[0] } }
  },
)
