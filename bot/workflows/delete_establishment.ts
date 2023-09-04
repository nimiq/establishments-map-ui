import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts'
import { DeleteEstablishment } from '../functions/delete_establishment.ts'
import { SendContext } from '../functions/send_context.ts'

const DeleteEstablishmenWorkflow = DefineWorkflow({
  callback_id: 'delete_establishment_wf',
  title: 'Delete establishment',
  description: 'Delete establishment with a uuid',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
    },
    required: ['interactivity'],
  },
})

const formData = DeleteEstablishmenWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: 'Delete Form Uuid',
    interactivity: DeleteEstablishmenWorkflow.inputs.interactivity,
    submit_label: 'Delete',
    description:
      'Delete an establishment given its UUID. The information will be deleted immediately.',
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
        description: 'From which environment it should be deleted',
        type: Schema.types.string,
        enum: ['Test', 'Production'],
        default: 'Test',
      }],
      required: ['uuid', 'environment'],
    },
  },
)

const establishmentStep = DeleteEstablishmenWorkflow.addStep(
  DeleteEstablishment,
  {
    uuid: formData.outputs.fields.uuid,
    environment: formData.outputs.fields.environment,
  },
)

DeleteEstablishmenWorkflow.addStep(
  SendContext,
  {
    establishment: establishmentStep.outputs.establishment,
    environment: formData.outputs.fields.environment,
    reviewer: DeleteEstablishmenWorkflow.inputs.interactivity.interactor.id,
    type: 'establishment_deleted',
  },
)

export default DeleteEstablishmenWorkflow
