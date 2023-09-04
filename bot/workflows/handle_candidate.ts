import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts'
import { VerifyCaptcha } from '../functions/verify_captcha.ts'
import { HandleCandidateMessage } from '../functions/handle_candidate_message.ts'
import { CreateEstablishmentWithPlaceId } from '../functions/create_establishment_with_place_id.ts'
import { UpdateContextMessage } from '../functions/update_context_message.ts'

const HandleCandidateWorkflow = DefineWorkflow({
  callback_id: 'handle_candidate',
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
    environment: HandleCandidateWorkflow.inputs.dev ? 'Test' : 'Production',
    place_id: HandleCandidateWorkflow.inputs.gmapsPlaceId,
    accepts: HandleCandidateWorkflow.inputs.currencies,
  },
)

const establishmentToDbStep = HandleCandidateWorkflow.addStep(
  CreateEstablishmentWithPlaceId,
  {
    place_id: HandleCandidateWorkflow.inputs.gmapsPlaceId,
    accepts: HandleCandidateWorkflow.inputs.currencies,
    environment: HandleCandidateWorkflow.inputs.dev ? 'Test' : 'Production',
  },
)

HandleCandidateWorkflow.addStep(
  UpdateContextMessage,
  {
    establishment: establishmentToDbStep.outputs.establishment,
    message_ts: messageStep.outputs.message_ts,
    reviewer: messageStep.outputs.reviewer,
    environment: HandleCandidateWorkflow.inputs.dev ? 'Test' : 'Production',
    type: 'candidate_added',
  },
)

export default HandleCandidateWorkflow
