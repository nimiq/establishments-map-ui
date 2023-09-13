import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { SendContext } from '../functions/send_context.ts'

const ShowHelpWorkflow = DefineWorkflow({
  callback_id: 'show_help_wf',
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
    type: 'info',
    environment: 'Production',
    reviewer: ShowHelpWorkflow.inputs.interactivity.interactor.id,
  },
)

export default ShowHelpWorkflow
