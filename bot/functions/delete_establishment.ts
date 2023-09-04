/* eslint-disable no-console */

import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import { EstablishmentType } from '../types/establishments.ts'
import { deleteEstablishment } from '../util/database.ts'

export const DeleteEstablishment = DefineFunction({
  callback_id: 'delete_establishment',
  title: 'Delete establishment',
  description:
    'Delete an establishment given its UUID. The information will be deleted immediately.',
  source_file: 'functions/delete_establishment.ts',
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
    required: ['environment', 'uuid'],
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
  DeleteEstablishment,
  async ({ inputs, env }) => {
    const { environment, uuid } = inputs

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
    const establishment = await deleteEstablishment(dbUrl, uuid, dev, auth)
    if (typeof establishment === 'string')
      return { error: establishment }

    console.log(`Deleted ${JSON.stringify(establishment)}`)
    return { outputs: { establishment } }
  },
)
