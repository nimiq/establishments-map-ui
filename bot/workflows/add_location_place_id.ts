import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { SendContext } from '../functions/send_context.ts'
import { CreateLocationWithPlaceId } from '../functions/create_location_with_place_id.ts'
import { Currency } from '../../types/index.ts'

const CreateAddLocationPlaceIdWorkflow = DefineWorkflow({
  callback_id: 'add_location_placeid_wf',
  title: 'Add location PlaceID',
  description:
    'It will fetch info from GMaps API and add it to the database immediately',
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

const formData = CreateAddLocationPlaceIdWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: 'Add location PlaceID',
    interactivity: CreateAddLocationPlaceIdWorkflow.inputs.interactivity,
    submit_label: 'Create',
    description:
      'Create a new location given its Place ID. The information will be published immediately..',
    fields: {
      elements: [{
        name: 'place_id',
        title: 'Place ID',
        description: 'The Place ID of the location',
        type: Schema.types.string,
      }, {
        name: 'accepts',
        title: 'Currencies that the location accepts',
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
          // I would like to know if it possible to fetch this from the database
          // But it seems that the only option is to have the formData as first
          // step of the workflow
          enum: Object.values(Currency),
        },
        description: 'The list of cryptos that the location accepts',
      }, {
        name: 'sells',
        title: 'Currencies that the ATM sells',
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
          // I would like to know if it possible to fetch this from the database
          // But it seems that the only option is to have the formData as first
          // step of the workflow
          enum: Object.values(Currency),
        },
        description: 'The list of cryptos that the location sells',
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

const locationStep = CreateAddLocationPlaceIdWorkflow.addStep(
  CreateLocationWithPlaceId,
  {
    place_id: formData.outputs.fields.place_id,
    accepts: formData.outputs.fields.accepts,
    sells: formData.outputs.fields.sells,
    environment: formData.outputs.fields.environment,
  },
)

CreateAddLocationPlaceIdWorkflow.addStep(
  SendContext,
  {
    location: locationStep.outputs.location,
    environment: formData.outputs.fields.environment,
    reviewer:
      CreateAddLocationPlaceIdWorkflow.inputs.interactivity.interactor.id,
    type: 'location_added',
  },
)

export default CreateAddLocationPlaceIdWorkflow
