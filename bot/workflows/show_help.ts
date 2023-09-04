import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts'
import { SendContext } from '../functions/send_context.ts'

const ShowHelpWorkflow = DefineWorkflow({
  callback_id: 'show_help',
  title: 'Help',
  description: 'Shows a help message',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ['interactivity'],
  },
})

ShowHelpWorkflow.addStep(
  SendContext,
  {
    environment: 'Production',
    reviewer: ShowHelpWorkflow.inputs.interactivity.interactor.id,
  },
)

export default ShowHelpWorkflow
