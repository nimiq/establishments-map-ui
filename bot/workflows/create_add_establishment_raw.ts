import { DefineWorkflow, Schema } from 'deno-slack-sdk/mod.ts'
import { CreateEstablishmentRaw } from '../functions/create_establishment_raw.ts'
import { SendContext } from '../functions/send_context.ts'

const CreateAddEstablishmenRawWorkflow = DefineWorkflow({
  callback_id: 'add_establishment_raw',
  title: 'Create an establishment without PlaceID',
  description: 'Create an establishment setting all parameters manually',
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

const formData = CreateAddEstablishmenRawWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: 'Add manually a Location',
    interactivity: CreateAddEstablishmenRawWorkflow.inputs.interactivity,
    submit_label: 'Create',
    description:
      'Create a new location given the data. The information will be published immediately.',
    fields: {
      elements: [{
        name: 'name',
        title: 'Name',
        description: 'The name of the establishment',
        type: Schema.types.string,
      }, {
        name: 'address',
        title: 'Address',
        description: 'The address of the establishment',
        type: Schema.types.string,
      }, {
        name: 'lng',
        title: 'Longitude',
        description:
          'The longitude of the establishment. Use a pin in Google Maps to get it. San Jose\'s longitude is -84.089013',
        type: Schema.types.number,
      }, {
        name: 'lat',
        title: 'Latitude',
        description:
          'The latitude of the establishment. Use a pin in Google Maps to get it. San Jose\'s latitude is 9.934739',
        type: Schema.types.number,
      }, {
        name: 'rating',
        title: 'Rating',
        description: 'The rating of the establishment',
        type: Schema.types.number,
      }, {
        name: 'category',
        title: 'Category',
        description: 'The category of the establishment',
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
          'The username in Instagram of the establishment. What follows the @ in the URL',
        type: Schema.types.string,
      }, {
        name: 'facebook',
        title: 'Facebook',
        description:
          'The username in facebook of the establishment. What follows you see after facebook.com/',
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

const establishmentStep = CreateAddEstablishmenRawWorkflow.addStep(
  CreateEstablishmentRaw,
  {
    address: formData.outputs.fields.address,
    category: formData.outputs.fields.category,
    accepts: formData.outputs.fields.accepts,
    lat: formData.outputs.fields.lat,
    lng: formData.outputs.fields.lng,
    name: formData.outputs.fields.name,
    facebook: formData.outputs.fields.facebook,
    instagram: formData.outputs.fields.instagram,
    rating: formData.outputs.fields.rating,
    environment: formData.outputs.fields.environment,
  },
)

CreateAddEstablishmenRawWorkflow.addStep(
  SendContext,
  {
    establishment: establishmentStep.outputs.establishment,
    environment: formData.outputs.fields.environment,
    reviewer:
      CreateAddEstablishmenRawWorkflow.inputs.interactivity.interactor.id,
    type: 'establishment_added',
  },
)

export default CreateAddEstablishmenRawWorkflow
