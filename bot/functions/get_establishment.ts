/* eslint-disable no-console */

import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import { EstablishmentType } from '../types/establishments.ts'
import { getEstablishment } from '../util/database.ts'

export const GetEstablishment = DefineFunction({
  callback_id: 'get_establishment',
  title: 'Get establishment',
  description: 'Gets the establishment given any of its params.',
  source_file: 'functions/get_establishment.ts',
  input_parameters: {
    properties: {
      uuid: {
        type: Schema.types.string,
        description: 'The UUID of the establishment',
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
      establishment: {
        type: EstablishmentType,
        description: 'The establishment',
      },
    },
    required: ['establishment'],
  },
})

export default SlackFunction(
  GetEstablishment,
  async ({ inputs, env }) => {
    const { uuid, environment } = inputs

    const dev = environment === 'Test'
    const apikey = dev ? env.DB_AUTH_KEY_TEST : env.DB_AUTH_KEY
    const dbUrl = dev ? env.DB_URL_TEST : env.DB_URL
    const auth = { apikey }
    const establishment = await getEstablishment(dbUrl, uuid, dev, auth)
    if (typeof establishment === 'string')
      return { error: establishment }

    console.log(`Fetched establishment ${JSON.stringify(establishment)}`)
    return {
      outputs: {
        establishment,
      },
    }
  },
)
