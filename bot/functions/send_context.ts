import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { getMessageString } from '../util/message_location.ts'
import { LocationType } from '../types/location.ts'
import type { RawLocation } from '../../types/location.ts'

export const SendContext = DefineFunction({
  callback_id: 'send_context',
  title: 'Send context',
  description: 'Sends a message as context',
  source_file: 'functions/send_context.ts',
  input_parameters: {
    properties: {
      location: {
        type: LocationType,
        description: 'Name of the location',
      },
      reviewer: {
        type: Schema.slack.types.user_id,
      },
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
      type: {
        type: Schema.types.string,
        enum: [
          'location_deleted',
          'location_added',
          'location_info',
          'info',
        ],
      },
    },
    required: ['environment', 'reviewer', 'type'],
  },
})

export default SlackFunction(
  SendContext,
  async ({ client, inputs, env }) => {
    const dev = inputs.environment === 'Test'
    const location = inputs.location!

    let text = ''
    switch (inputs.type) {
      case 'location_deleted':
        text = getMessageString({
          ...location as RawLocation,
          dev,
          type: inputs.type,
          reviewer: inputs.reviewer!,
        })
        break
      case 'location_added':
        text = getMessageString(
          {
            ...location as RawLocation,
            dev,
            type: inputs.type,
            reviewer: inputs.reviewer!,
            crypto_map_domain: dev
              ? env.CRYPTO_MAP_DOMAIN_TEST
              : env.CRYPTO_MAP_DOMAIN,
          },
        )
        break
      case 'location_info':
        text = getMessageString({
          ...location as RawLocation,
          dev,
          type: inputs.type,
          reviewer: inputs.reviewer!,
          crypto_map_domain: dev
            ? env.CRYPTO_MAP_DOMAIN_TEST
            : env.CRYPTO_MAP_DOMAIN,
        })
        break
      case 'info':
        text = `:cryptomap: Crypto Map Bot Help :cryptomap:

        Message triggered by <@${inputs.reviewer!}>.

        What can I do?
        - I will notify in this channel when a user submits a new candidate. You later can decide if you want to add it to the Map or ignore it.
        - I will notify in this channel when a user submits a new issue. You later can decide if you want to remove it or ignore it.
        - Write \`/add\` in this channel to add an location. A modal will open and you will add the information.
        - Write \`/delete\` in this channel to remove an location. A modal will open and you will set the UUID. `
    }
    await client.chat.postMessage({
      channel: dev ? env.SLACK_CHANNEL_ID_TEST : env.SLACK_CHANNEL_ID,
      blocks: [
        {
          type: 'context',
          elements: [{
            type: 'mrkdwn',
            text,
          }],
        },
      ],
    })

    return {
      outputs: {},
    }
  },
)
