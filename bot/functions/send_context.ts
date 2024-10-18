/* eslint-disable no-console */

import type { RawLocation } from '../../../packages/types/src/index.ts'
import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.7.0/mod.ts'
import { LocationType } from '../types/location.ts'
import { getMessageString } from '../util/message_location.ts'

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
      content: {
        type: Schema.types.string,
        description: 'The content to send',
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
          'other',
        ],
      },
    },
    required: ['environment', 'type'],
  },
})

export default SlackFunction(
  SendContext,
  async ({ client, inputs, env }) => {
    console.log(JSON.stringify(inputs))
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
      default:
        text = inputs.content || 'No content provided'
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
