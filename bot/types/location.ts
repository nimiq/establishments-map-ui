import { Schema } from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { DefineType } from 'https://deno.land/x/deno_slack_sdk@2.2.0/types/mod.ts'

const LocationType = DefineType({
  name: 'Location',
  type: Schema.types.object,
  description: 'Location information',
  properties: {
    uuid: { type: Schema.types.string },
    name: { type: Schema.types.string },
    address: { type: Schema.types.string },
    rating: { type: Schema.types.number },
    lat: { type: Schema.types.number },
    lng: { type: Schema.types.number },
    category: { type: Schema.types.string },
    gmaps_types: {
      type: Schema.types.array,
      items: {
        type: Schema.types.string,
      },
    },
    gmaps: { type: Schema.types.string },
    photo: { type: Schema.types.string, default: '' },
    provider: { type: Schema.types.string },
    accepts: {
      type: Schema.types.array,
      items: {
        type: Schema.types.string,
      },
    },
    sells: {
      type: Schema.types.array,
      items: {
        type: Schema.types.string,
      },
    },
  },
  required: [
    'uuid',
    'name',
    'address',
    'category',
    'provider',
    'lat',
    'lng',
    'accepts',
    'sells',
    'gmaps_types',
  ],
})

export { LocationType }
