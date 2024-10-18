import type { RawLocation } from '../../../packages/types/src/index.ts'
import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.7.0/mod.ts'
import { LocationType } from '../types/location.ts'
import { getMessageString } from '../util/message_location.ts'

export const UpdateContextMessage = DefineFunction({
  callback_id: 'update_context_message',
  title: 'Updates context message',
  description: 'Updates the message with the location info',
  source_file: 'functions/update_context_message.ts',
  input_parameters: {
    properties: {
      location: {
        type: LocationType,
      },
      message_ts: {
        type: Schema.slack.types.message_ts,
        description: 'The timestamp of the message to update',
      },
      reviewer: {
        type: Schema.types.string,
        description: 'The reviewer identifier',
      },
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
      type: {
        type: Schema.types.string,
        description: 'Type of message',
      },
      reason: {
        type: Schema.types.string,
        description: 'Reason of the issue',
      },
      reason_id: {
        type: Schema.types.string,
        description: 'Reason identifier of the issue',
      },
    },
    required: [
      'location',
      'message_ts',
      'reviewer',
      'environment',
      'type',
    ],
  },
})

export default SlackFunction(
  UpdateContextMessage,
  async ({ client, inputs, env }) => {
    const {
      location,
      message_ts,
      environment,
      reviewer,
      type,
      reason,
      reason_id,
    } = inputs
    const dev = environment === 'Test'
    const channel = dev ? env.SLACK_CHANNEL_ID_TEST : env.SLACK_CHANNEL_ID
    const crypto_map_domain = dev
      ? env.CRYPTO_MAP_DOMAIN_TEST
      : env.CRYPTO_MAP_DOMAIN

    let text = ''
    switch (type) {
      case 'candidate_added':
        text = getMessageString({
          type: 'candidate_added',
          ...location as RawLocation,
          dev,
          crypto_map_domain,
          reviewer,
        })
        break

      case 'location_deleted_issue':
        text = getMessageString({
          type: 'location_deleted_issue',
          ...location as RawLocation,
          dev,
          crypto_map_domain,
          reviewer,
          reason: reason || '',
          reason_id: reason_id || '',
        })
        break
    }

    await client.chat.update({
      channel,
      ts: message_ts,
      blocks: [{
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text,
          },
        ],
      }],
    })

    return {
      outputs: {},
    }
  },
)
