import {
  DefineWorkflow,
  Schema,
} from 'https://deno.land/x/deno_slack_sdk@2.7.0/mod.ts'
import { Currency, Provider } from '../../../packages/types/src/index.ts'
import { CreateRawLocation } from '../functions/create_raw_location.ts'
import { SendContext } from '../functions/send_context.ts'

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
        type: Schema.types.string,
      }, {
        name: 'lat',
        title: 'Latitude',
        description:
          'The latitude of the location. Use a pin in Google Maps to get it. San Jose\'s latitude is 9.934739',
        type: Schema.types.string,
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
        name: 'photo',
        title: 'Enter a picture',
        description: 'An image of the location. It is preferable to use a .webp file. Use https://www.freefileconvert.com/',
        maxItems: 1,
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.file_id,
          allowed_filetypes_group: 'IMAGES_ONLY',
        },
      }, {
        name: 'accepts',
        title: 'Currencies that the location accepts',
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
          enum: Object.values(Currency),
        },
        description: 'The list of cryptos that the location accepts',
      }, {
        name: 'provider',
        title: 'Provider',
        description: 'The provider of the location',
        type: Schema.types.string,
        enum: Object.values(Provider),
        default: Provider.DefaultShop,
      }, {
        name: 'environment',
        title: 'Environment',
        description: 'Which database to use',
        type: Schema.types.string,
        enum: ['Test', 'Production'],
        default: 'Production',
      }],
      required: [
        'name',
        'address',
        'lng',
        'lat',
        'category',
        'environment',
        'accepts',
        'provider',
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
    // lat and lng need to be processed as string in the form as
    // Slack contains some issues with float numbers
    lat: formData.outputs.fields.lat,
    lng: formData.outputs.fields.lng,
    facebook: formData.outputs.fields.facebook,
    instagram: formData.outputs.fields.instagram,
    rating: formData.outputs.fields.rating,
    photo: formData.outputs.fields.photo,
    provider: formData.outputs.fields.provider,
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
