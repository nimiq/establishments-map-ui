/* eslint-disable no-console */

import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { addLocation } from '../../database/functions.ts'
import { getDbAuthArgs } from '../util/db-args.ts'
import type { RawLocation } from '../../types/location.ts'
import { LocationType } from '../types/location.ts'
import { Provider } from '../../types/database.ts'
import type { Category, Currency } from '../../types/database.ts'

export const CreateRawLocation = DefineFunction({
  callback_id: 'create_raw_location',
  title: 'New location with manual data',
  description: 'Create an location with all the data',
  source_file: 'functions/create_raw_location.ts',
  input_parameters: {
    properties: {
      name: {
        type: Schema.types.string,
        description: 'Name of the location',
      },
      address: {
        type: Schema.types.string,
        description: 'Address of the location',
      },
      lng: {
        type: Schema.types.number,
        description: 'Longitude of the location',
      },
      lat: {
        type: Schema.types.number,
        description: 'Latitude of the location',
      },
      rating: {
        type: Schema.types.number,
        description: 'Rating of the location',
      },
      category: {
        type: Schema.types.string,
        description: 'Category of the location',
      },
      instagram: {
        type: Schema.types.string,
        description: 'Instagram of the location',
      },
      facebook: {
        type: Schema.types.string,
        description: 'Facebook of the location',
      },
      accepts: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
        description: 'The list of cryptos that the location accepts',
      },
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
    },
    required: [
      'name',
      'address',
      'lng',
      'lat',
      'category',
      'environment',
      'accepts',
    ],
  },
  output_parameters: {
    properties: {
      location: {
        type: LocationType,
      },
    },
    required: ['location'],
  },
})

export default SlackFunction(
  CreateRawLocation,
  async ({ inputs, env }) => {
    const locationInput: Omit<RawLocation, 'uuid'> = {
      name: inputs.name,
      address: inputs.address,
      lat: inputs.lat,
      lng: inputs.lng,
      category: inputs.category as Category,
      rating: inputs.rating,
      provider: Provider.DefaultShop,
      accepts: inputs.accepts as Currency[],
      sells: [],
      facebook: inputs.facebook,
      instagram: inputs.instagram,
      gmaps_types: [],
    }
    const res = await addLocation(
      getDbAuthArgs(env, inputs.environment === 'Test'),
      locationInput,
    )
    console.log(`Added ${JSON.stringify(res)}`)
    return !res || typeof res === 'string'
      ? { error: JSON.stringify(res) }
      : { outputs: { location: res } }
  },
)
