import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts'
import { CreateEstablishmentWithPlaceId } from '../functions/create_establishment_with_place_id.ts'
import { SendContext } from '../functions/send_context.ts'

const CreateAddEstablishmenPlaceIdWorkflow = DefineWorkflow({
  callback_id: 'add_establishment_with_place_id_wf',
  title: 'Create an establishment with a Place ID',
  description: 'Create an establishment with a Place ID',
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ['interactivity'],
  },
})

// This step will make the workflow break.
// It would be nice to fix it, so we don't have to hardcode the constants.
const CURRENCIES = [
  'BTC',
  'NIM',
  'ETH',
  'LTC',
  'DASH',
  'XMR',
  'XRP',
  'LBTC',
]

const formData = CreateAddEstablishmenPlaceIdWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: 'Add via Place ID',
    interactivity: CreateAddEstablishmenPlaceIdWorkflow.inputs.interactivity,
    submit_label: 'Create',
    description:
      'Create a new establishment given its Place ID. The information will be published immediately..',
    fields: {
      elements: [{
        name: 'place_id',
        title: 'Place ID',
        description: 'The Place ID of the establishment',
        type: Schema.types.string,
      }, {
        name: 'accepts',
        title: 'Currencies that the establishment accepts',
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
          enum: CURRENCIES,
        },
        description: 'The list of cryptos that the establishment accepts',
      }, {
        name: 'sells',
        title: 'Currencies that the ATM sells',
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
          enum: CURRENCIES,
        },
        description: 'The list of cryptos that the establishment sells',
      }, {
        name: 'environment',
        title: 'Environment',
        description: 'From which environment it should be deleted',
        type: Schema.types.string,
        enum: ['Test', 'Production'],
        default: 'Test',
      }],
      required: ['place_id', 'environment'],
    },
  },
)

const establishmentStep = CreateAddEstablishmenPlaceIdWorkflow.addStep(
  CreateEstablishmentWithPlaceId,
  {
    place_id: formData.outputs.fields.place_id,
    accepts: formData.outputs.fields.accepts,
    sells: formData.outputs.fields.sells,
    environment: formData.outputs.fields.environment,
  },
)

CreateAddEstablishmenPlaceIdWorkflow.addStep(
  SendContext,
  {
    establishment: establishmentStep.outputs.establishment,
    environment: formData.outputs.fields.environment,
    reviewer:
      CreateAddEstablishmenPlaceIdWorkflow.inputs.interactivity.interactor.id,
    type: 'establishment_added',
  },
)

export default CreateAddEstablishmenPlaceIdWorkflow
