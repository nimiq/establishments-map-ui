import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { CreateRawLocation } from '../functions/create_raw_location.ts'
import { SendContext } from '../functions/send_context.ts'
import { Currency } from '../../types/index.ts'

const CreateAddLocationRawWorkflow = DefineWorkflow({
  callback_id: 'add_location_wf',
  title: 'Add location manually',
  description: 'It will add it to the database immediately',
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

const formData = CreateAddLocationRawWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: 'Add location manually',
    interactivity: CreateAddLocationRawWorkflow.inputs.interactivity,
    submit_label: 'Create',
    description:
      'Create a new location given the data. The information will be published immediately.',
    fields: {
      elements: [{
        name: 'name',
        title: 'Name',
        description: 'The name of the location',
        type: Schema.types.string,
      }, {
        name: 'address',
        title: 'Address',
        description: 'The address of the location',
        type: Schema.types.string,
      }, {
        name: 'lng',
        title: 'Longitude',
        description:
          'The longitude of the location. Use a pin in Google Maps to get it. San Jose\'s longitude is -84.089013',
        type: Schema.types.number,
      }, {
        name: 'lat',
        title: 'Latitude',
        description:
          'The latitude of the location. Use a pin in Google Maps to get it. San Jose\'s latitude is 9.934739',
        type: Schema.types.number,
      }, {
        name: 'rating',
        title: 'Rating',
        description: 'The rating of the location',
        type: Schema.types.number,
      }, {
        name: 'category',
        title: 'Category',
        description: 'The category of the location',
        type: Schema.types.string,
        enum: [
          'cash',
          'cars_bikes',
          'computer_electronics',
          'entertainment',
          'leisure_activities',
          'food_drinks',
          'restaurant_bar',
          'health_beauty',
          'sports_fitness',
          'hotel_lodging',
          'shop',
          'miscellaneous',
        ],
      }, {
        name: 'instagram',
        title: 'Instagram',
        description:
          'The username in Instagram of the location. What follows the @ in the URL',
        type: Schema.types.string,
      }, {
        name: 'facebook',
        title: 'Facebook',
        description:
          'The username in facebook of the location. What follows you see after facebook.com/',
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
        name: 'environment',
        title: 'Environment',
        description: 'From which environment it should be deleted',
        type: Schema.types.string,
        enum: ['Test', 'Production'],
        default: 'Test',
      }],
      required: [
        'name',
        'address',
        'lng',
        'lat',
        'category',
        'environment',
        'accepts',
      ],
    },
  },
)

const locationStep = CreateAddLocationRawWorkflow.addStep(
  CreateRawLocation,
  {
    name: formData.outputs.fields.name,
    address: formData.outputs.fields.address,
    category: formData.outputs.fields.category,
    accepts: formData.outputs.fields.accepts,
    lat: formData.outputs.fields.lat,
    lng: formData.outputs.fields.lng,
    facebook: formData.outputs.fields.facebook,
    instagram: formData.outputs.fields.instagram,
    rating: formData.outputs.fields.rating,
    environment: formData.outputs.fields.environment,
  },
)

CreateAddLocationRawWorkflow.addStep(
  SendContext,
  {
    location: locationStep.outputs.location,
    environment: formData.outputs.fields.environment,
    reviewer: CreateAddLocationRawWorkflow.inputs.interactivity.interactor.id,
    type: 'location_added',
  },
)

export default CreateAddLocationRawWorkflow
