import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import { getMessageString } from '../util/message_establishment.ts'

export const HandleCandidateMessage = DefineFunction({
  callback_id: 'handle_candidate_message',
  title: 'Handle candidate message',
  description:
    'Sends a message in the notification channel with the new candidate info',
  source_file: 'functions/handle_candidate_message.ts',
  input_parameters: {
    properties: {
      name: {
        type: Schema.types.string,
        description: 'The name of the establishment',
      },
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
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
    },
    required: ['name', 'place_id', 'accepts', 'environment'],
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
  HandleCandidateMessage,
  async ({ inputs, env, client }) => {
    const { name, place_id, accepts, environment } = inputs
    const dev = environment === 'Test'
    const text = getMessageString({
      type: 'new_candidate',
      accepts,
      dev,
      name,
      gmaps: `https://www.google.com/maps/place/?q=place_id:${place_id}`,
    })
    const channel = dev
      ? env.SLACK_CHANNEL_ID_TEST
      : env.SLACK_CHANNEL_ID
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
              text: { type: 'plain_text', text: 'Reject' },
              value: 'reject',
              action_id: 'reject_candidate',
              style: 'danger',
              confirm: {
                title: {
                  type: 'plain_text',
                  text: 'Are you sure?',
                },
                text: {
                  type: 'mrkdwn',
                  text:
                    'This will remove the candidate from the list but you would be able to add it later manually.',
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
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: dev ? 'Approve (in test environment)' : 'Approve',
              },
              style: 'primary',
              value: 'approve',
              action_id: 'approve_candidate',
              confirm: {
                title: {
                  type: 'plain_text',
                  text: 'Are you sure?',
                },
                text: {
                  type: 'mrkdwn',
                  text:
                    'This will add the candidate in the Crypto Map immediately. You can remove it later manually.',
                },
                confirm: {
                  type: 'plain_text',
                  confirm: () => ({ completed: false }),
                  text: 'Yes, add it to the Crypto Map.',
                },
                deny: {
                  type: 'plain_text',
                  text: 'Nah, I changed my mind',
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
  ['approve_candidate', 'reject_candidate'],
  async ({ action, body, client, env }) => {
    const reviewer = body.user.id

    const outputs = {
      reviewer,
      message_ts: body.message?.ts,
    }
    const approved = action.action_id === 'approve_candidate'

    const { accepts, environment, name } = body.function_data.inputs
    const dev = environment === 'Test'
    const type = approved ? 'approved' : 'rejected'
    const text = getMessageString({
      type,
      accepts,
      dev,
      name,
      reviewer,
    })
    const channel = dev
      ? env.SLACK_CHANNEL_ID_TEST
      : env.SLACK_CHANNEL_ID

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

    if (approved) {
      await client.functions.completeSuccess({
        function_execution_id: body.function_data.execution_id,
        outputs,
      })
    }
  },
)
