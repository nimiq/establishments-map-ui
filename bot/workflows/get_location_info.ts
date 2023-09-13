import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { SendContext } from '../functions/send_context.ts'
import { GetLocation } from '../functions/get_location.ts'

const GetLocationInfoWorkflow = DefineWorkflow({
  callback_id: 'get_location_info_wf',
  title: 'Get location info',
  description: 'Get location info with a uuid',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ['interactivity'],
  },
})

const formData = GetLocationInfoWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: 'Get Location by uuid',
    interactivity: GetLocationInfoWorkflow.inputs.interactivity,
    submit_label: 'Get info',
    description: 'Gets info from an location given its UUID.',
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
        description: 'From which environment it should be fetched',
        type: Schema.types.string,
        enum: ['Test', 'Production'],
        default: 'Test',
      }],
      required: ['uuid', 'environment'],
    },
  },
)

const locationStep = GetLocationInfoWorkflow.addStep(
  GetLocation,
  {
    uuid: formData.outputs.fields.uuid,
    environment: formData.outputs.fields.environment,
  },
)

GetLocationInfoWorkflow.addStep(
  SendContext,
  {
    location: locationStep.outputs.location,
    environment: formData.outputs.fields.environment,
    reviewer: GetLocationInfoWorkflow.inputs.interactivity.interactor.id,
    type: 'location_info',
  },
)

export default GetLocationInfoWorkflow
