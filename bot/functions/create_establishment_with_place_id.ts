/* eslint-disable no-console */

import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import { EstablishmentType } from '../types/establishments.ts'
import { upsertLocationWithPlaceId } from '../util/database.ts'

export const CreateEstablishmentWithPlaceId = DefineFunction({
  callback_id: 'create_establishment_with_place_id',
  title: 'New establishment with Place ID',
  description: 'Create an establishment with a Place ID',
  source_file: 'functions/create_establishment_with_place_id.ts',
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
        description: 'The list of cryptos that the establishment accepts',
      },
      sells: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
        description: 'In case the establishment sells crypto like ATMs',
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
      establishment: {
        type: EstablishmentType,
      },
    },
    required: ['establishment'],
  },
})

export default SlackFunction(
  CreateEstablishmentWithPlaceId,
  async ({ inputs, env }) => {
    const { place_id: gmaps_place_id, accepts, sells, environment } = inputs

    const dev = environment === 'Test'
    const email = env.DB_AUTH_EMAIL
    const password = env.DB_AUTH_PASS
    const apikey = dev ? env.DB_AUTH_KEY_TEST : env.DB_AUTH_KEY
    const dbUrl = dev ? env.DB_URL_TEST : env.DB_URL
    const google_maps_key = env.GOOGLE_MAPS_API_KEY
    const auth = {
      email,
      password,
      apikey,
      google_maps_key,
    }

    console.log(
      `Creating establishment with Place ID ${gmaps_place_id}, accepts ${accepts}, sells ${sells}`,
      `dbUrl: ${dbUrl} dev: ${dev} auth: ${JSON.stringify(auth)}`,
    )
    const res = await upsertLocationWithPlaceId(
      dbUrl,
      {
        gmaps_place_id,
        accepts,
        sells: sells || [],
        provider: 'DefaultShop',
      },
      dev,
      auth,
    )
    if (typeof res === 'string') {
      return {
        error: res,
      }
    }

    return {
      outputs: {
        establishment: res,
      },
    }
  },
)
