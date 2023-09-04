import { DefineFunction, Schema, SlackFunction } from 'deno-slack-sdk/mod.ts'
import { EstablishmentType } from '../types/establishments.ts'
import { getMessageString } from '../util/message_establishment.ts'

export const SendContext = DefineFunction({
  callback_id: 'send_context',
  title: 'Send context',
  description: 'Sends a message as context',
  source_file: 'functions/send_context.ts',
  input_parameters: {
    properties: {
      establishment: {
        type: EstablishmentType,
        description: 'Deleted establishment',
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
          'establishment_deleted',
          'establishment_added',
          'establishment_info',
        ],
      },
    },
    required: ['environment'],
  },
})

export default SlackFunction(
  SendContext,
  async ({ client, inputs, env }) => {
    const dev = inputs.environment === 'Test'
    let text = ''
    switch (inputs.type) {
      case 'establishment_deleted':
        text = getMessageString({
          ...inputs.establishment!,
          dev,
          type: inputs.type,
          reviewer: inputs.reviewer!,
        })
        break
      case 'establishment_added':
        text = getMessageString({
          ...inputs.establishment!,
          dev,
          type: inputs.type,
          reviewer: inputs.reviewer!,
          crypto_map_domain: dev
            ? env.CRYPTO_MAP_DOMAIN_TEST
            : env.CRYPTO_MAP_DOMAIN,
        })
        break
      case 'establishment_info':
        text = getMessageString({
          ...inputs.establishment!,
          dev,
          type: inputs.type,
          reviewer: inputs.reviewer!,
          crypto_map_domain: dev
            ? env.CRYPTO_MAP_DOMAIN_TEST
            : env.CRYPTO_MAP_DOMAIN,
        })
        break
      default:
        text = `:cryptomap: Crypto Map Bot Help :cryptomap:

        Message triggered by <@${inputs.reviewer!}>.

        What can I do?
        - I will notify in this channel when a user submits a new candidate. You later can decide if you want to add it to the Map or ignore it.
        - I will notify in this channel when a user submits a new issue. You later can decide if you want to remove it or ignore it.
        - Write \`/add\` in this channel to add an establishment. A modal will open and you will add the information.
        - Write \`/delete\` in this channel to remove an establishment. A modal will open and you will set the UUID. `
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
