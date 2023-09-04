import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import { EstablishmentType } from '../types/establishments.ts'
import { upsertLocation } from '../util/database.ts'
import type { Establishment } from '../util/types.ts'

export const CreateEstablishmentRaw = DefineFunction({
  callback_id: 'create_establishment_raw',
  title: 'New establishment with manual data',
  description: 'Create an establishment with all the data',
  source_file: 'functions/create_establishment_raw.ts',
  input_parameters: {
    properties: {
      name: {
        type: Schema.types.string,
        description: 'Name of the establishment',
      },
      address: {
        type: Schema.types.string,
        description: 'Address of the establishment',
      },
      lng: {
        type: Schema.types.number,
        description: 'Longitude of the establishment',
      },
      lat: {
        type: Schema.types.number,
        description: 'Latitude of the establishment',
      },
      rating: {
        type: Schema.types.number,
        description: 'Rating of the establishment',
      },
      category: {
        type: Schema.types.string,
        description: 'Category of the establishment',
      },
      instagram: {
        type: Schema.types.string,
        description: 'Instagram of the establishment',
      },
      facebook: {
        type: Schema.types.string,
        description: 'Facebook of the establishment',
      },
      accepts: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
        description: 'The list of cryptos that the establishment accepts',
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
      establishment: {
        type: EstablishmentType,
      },
    },
    required: ['establishment'],
  },
})

export default SlackFunction(
  CreateEstablishmentRaw,
  async ({ inputs, env }) => {
    const {
      address,
      accepts,
      category,
      environment,
      lat,
      lng,
      name,
      facebook,
      instagram,
      rating,
    } = inputs

    const establishment: Establishment = {
      name,
      address,
      lat,
      lng,
      category,
      rating,
      provider: 'DefaultShop',
      accepts,
      sells: [],
      uuid: '',
      facebook,
      instagram,
    }

    const dev = environment === 'Test'
    const email = env.DB_AUTH_EMAIL
    const password = env.DB_AUTH_PASS
    const apikey = dev ? env.DB_AUTH_KEY_TEST : env.DB_AUTH_KEY
    const dbUrl = dev ? env.DB_URL_TEST : env.DB_URL
    const auth = {
      email,
      password,
      apikey,
    }
    const res = await upsertLocation(dbUrl, establishment, dev, auth)
    if (typeof res === 'string') {
      return {
        error: res,
      }
    }

    return {
      outputs: {
        establishment,
      },
    }
  },
)
