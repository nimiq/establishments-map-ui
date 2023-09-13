import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { DeleteLocation } from '../functions/delete_location.ts'
import { SendContext } from '../functions/send_context.ts'

const DeleteLocationWorkflow = DefineWorkflow({
  callback_id: 'delete_location_wf',
  title: 'Delete location immediately',
  description:
    'A message will be posted in the channel with the information of the location after deletion',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ['interactivity'],
  },
})

const formData = DeleteLocationWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: 'Delete Location by uuid',
    interactivity: DeleteLocationWorkflow.inputs.interactivity,
    submit_label: 'Delete',
    description:
      'Delete an location given its UUID. The information will be deleted immediately.',
    fields: {
      elements: [{
        name: 'uuid',
        title: 'UUID',
        description:
          'The UUID of the location. You can get it from the Crypto Map.',
        type: Schema.types.string,
      }, {
        name: 'environment',
        title: 'Environment',
        description: 'From which environment it should be deleted',
        type: Schema.types.string,
        enum: ['Test', 'Production'],
        default: 'Test',
      }],
      required: ['uuid', 'environment'],
    },
  },
)

const locationStep = DeleteLocationWorkflow.addStep(
  DeleteLocation,
  {
    uuid: formData.outputs.fields.uuid,
    environment: formData.outputs.fields.environment,
  },
)

DeleteLocationWorkflow.addStep(
  SendContext,
  {
    location: locationStep.outputs.location,
    environment: formData.outputs.fields.environment,
    reviewer: DeleteLocationWorkflow.inputs.interactivity.interactor.id,
    type: 'location_deleted',
  },
)

export default DeleteLocationWorkflow
