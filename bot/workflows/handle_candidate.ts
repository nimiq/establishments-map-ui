import { DefineWorkflow, Schema } from 'https://deno.land/x/deno_slack_sdk@2.7.0/mod.ts'
import { CreateLocationWithPlaceId } from '../functions/create_location_with_place_id.ts'
import { HandleCandidateMessage } from '../functions/handle_candidate_message.ts'
import { UpdateContextMessage } from '../functions/update_context_message.ts'
import { VerifyCaptcha } from '../functions/verify_captcha.ts'

const HandleCandidateWorkflow = DefineWorkflow({
  callback_id: 'handle_candidate_wf',
  title: 'Candidate notification',
  description:
    'Sends a message in the notification channel with the new candidate info',
  input_parameters: {
    properties: {
      gmapsPlaceId: {
        type: Schema.types.string,
      },
      captcha: {
        type: Schema.types.string,
      },
      name: {
        type: Schema.types.string,
      },
      currencies: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
      },
      dev: {
        type: Schema.types.boolean,
      },
    },
    required: [
      'gmapsPlaceId',
      'captcha',
      'name',
      'currencies',
      'dev',
    ],
  },
})

HandleCandidateWorkflow.addStep(
  VerifyCaptcha,
  {
    captcha: HandleCandidateWorkflow.inputs.captcha,
  },
)

const messageStep = HandleCandidateWorkflow.addStep(
  HandleCandidateMessage,
  {
    name: HandleCandidateWorkflow.inputs.name,
    environment: HandleCandidateWorkflow.inputs.dev.toString() === 'true' ? 'Test' : 'Production',
    place_id: HandleCandidateWorkflow.inputs.gmapsPlaceId,
    accepts: HandleCandidateWorkflow.inputs.currencies,
  },
)

const locationToDbStep = HandleCandidateWorkflow.addStep(
  CreateLocationWithPlaceId,
  {
    place_id: HandleCandidateWorkflow.inputs.gmapsPlaceId,
    accepts: HandleCandidateWorkflow.inputs.currencies,
    environment: HandleCandidateWorkflow.inputs.dev.toString() === 'true' ? 'Test' : 'Production',
  },
)

HandleCandidateWorkflow.addStep(
  UpdateContextMessage,
  {
    location: locationToDbStep.outputs.location,
    message_ts: messageStep.outputs.message_ts,
    reviewer: messageStep.outputs.reviewer,
    environment: HandleCandidateWorkflow.inputs.dev.toString() === 'true' ? 'Test' : 'Production',
    type: 'candidate_added',
  },
)

export default HandleCandidateWorkflow
