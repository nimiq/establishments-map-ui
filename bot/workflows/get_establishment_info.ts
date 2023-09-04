import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts'
import { GetEstablishment } from '../functions/get_establishment.ts'
import { SendContext } from '../functions/send_context.ts'

const GetEstablishmentInfoWorkflow = DefineWorkflow({
  callback_id: 'get_establishment_info_wf',
  title: 'Get establishment info',
  description: 'Get establishment info with a uuid',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ['interactivity'],
  },
})

const formData = GetEstablishmentInfoWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: 'Get Establishment Uuid',
    interactivity: GetEstablishmentInfoWorkflow.inputs.interactivity,
    submit_label: 'Get info',
    description: 'Gets info from an establishment given its UUID.',
    fields: {
      elements: [{
        name: 'uuid',
        title: 'UUID',
        description:
          'The UUID of the establishment. You can get it from the Crypto Map.',
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

const establishmentStep = GetEstablishmentInfoWorkflow.addStep(
  GetEstablishment,
  {
    uuid: formData.outputs.fields.uuid,
    environment: formData.outputs.fields.environment,
  },
)

GetEstablishmentInfoWorkflow.addStep(
  SendContext,
  {
    establishment: establishmentStep.outputs.establishment,
    environment: formData.outputs.fields.environment,
    reviewer: GetEstablishmentInfoWorkflow.inputs.interactivity.interactor.id,
    type: 'establishment_info',
  },
)

export default GetEstablishmentInfoWorkflow
