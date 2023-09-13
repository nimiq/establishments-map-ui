/* eslint-disable no-console */

import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { getMessageString } from '../util/message_location.ts'
import { LocationType } from '../types/location.ts'
import type { RawLocation } from '../../types/location.ts'

export const HandleIssueMessage = DefineFunction({
  callback_id: 'handle_issue_message',
  title: 'Handle issue message',
  description:
    'Sends a message in the notification channel with the issue info',
  source_file: 'functions/handle_issue_message.ts',
  input_parameters: {
    properties: {
      location: {
        type: LocationType,
        description: 'The location',
      },
      reason: {
        type: Schema.types.string,
        description: 'The reason for the issue',
      },
      reason_id: {
        type: Schema.types.string,
        description: 'The reason identifier for the issue',
      },
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
    },
    required: ['location', 'reason', 'reason_id', 'environment'],
  },
  output_parameters: {
    properties: {
      message_ts: {
        type: Schema.slack.types.message_ts,
        description: 'The message that was sent to the channel',
      },
      reviewer: {
        type: Schema.types.string,
        description: 'The reviewer identifier',
      },
    },
    required: ['message_ts', 'reviewer'],
  },
})

export default SlackFunction(
  HandleIssueMessage,
  async ({ inputs, env, client }) => {
    const { location, environment, reason, reason_id } = inputs
    const dev = environment === 'Test'
    if (typeof location === 'string')
      return { error: location }

    const crypto_map_domain = dev
      ? env.CRYPTO_MAP_DOMAIN_TEST
      : env.CRYPTO_MAP_DOMAIN

    const text = getMessageString({ type: 'new_issue', dev, ...location as RawLocation, crypto_map_domain, reason, reason_id })

    const channel = dev ? env.SLACK_CHANNEL_ID_TEST : env.SLACK_CHANNEL_ID

    await client.chat.postMessage({
      channel,
      text,
      blocks: [
        {
          type: 'context',
          elements: [{
            type: 'mrkdwn',
            text,
          }],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Ignore issue' },
              value: 'ignore',
              action_id: 'ignore_issue',
              confirm: {
                title: {
                  type: 'plain_text',
                  text: 'Are you sure?',
                },
                text: {
                  type: 'mrkdwn',
                  text:
                    'This will mark the issue as ignored. You can always delete the location later if you change your mind.',
                },
                confirm: {
                  type: 'plain_text',
                  text: 'Yes, ignore issue.',
                },
                deny: {
                  type: 'plain_text',
                  text: 'I changed my mind',
                },
              },
            },
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Delete location' },
              value: 'delete_location',
              action_id: 'delete_location',
              style: 'danger',
              confirm: {
                title: {
                  type: 'plain_text',
                  text: 'Are you sure?',
                },
                text: {
                  type: 'mrkdwn',
                  text:
                    ':exclamation: This will remove the location from the :cryptomap: Crypto Map. This action is irreversible',
                },
                confirm: {
                  type: 'plain_text',
                  text: 'Yes, remove it.',
                },
                deny: {
                  type: 'plain_text',
                  text: 'I changed my mind',
                },
              },
            },
          ],
        },
      ],
    })

    return {
      completed: false,
    }
  },
).addBlockActionsHandler(
  ['ignore_issue', 'delete_location'],
  async ({ action, body, client, env }) => {
    const reviewer = body.user.id

    const outputs = {
      reviewer,
      message_ts: body.message?.ts,
    }

    console.log(
      `The user ${reviewer} chose ${action.value}. So,${
        action.value === 'delete_location' ? 'deleted' : 'ignored'
      } the location ${body.function_data.inputs.location.uuid}`,
    )
    const type = action.value === 'delete_location'
      ? 'approve_issue'
      : 'ignore_issue'

    const { environment, location, reason, reason_id }
      = body.function_data.inputs
    const dev = environment === 'Test'
    const crypto_map_domain = dev
      ? env.CRYPTO_MAP_DOMAIN_TEST
      : env.CRYPTO_MAP_DOMAIN
    const text = getMessageString({ type, dev, ...location as RawLocation, crypto_map_domain, reason, reason_id, reviewer })
    const channel = dev ? env.SLACK_CHANNEL_ID_TEST : env.SLACK_CHANNEL_ID

    await client.chat.update({
      channel,
      ts: outputs.message_ts,
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

    if (type === 'approve_issue') {
      await client.functions.completeSuccess({
        function_execution_id: body.function_data.execution_id,
        outputs,
      })
    }
  },
)
