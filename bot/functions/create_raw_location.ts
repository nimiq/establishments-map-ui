/* eslint-disable no-console */

import type { Category, Currency } from '../../../packages/types/src/database.ts'
import {
  DefineFunction,
  Schema,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.7.0/mod.ts'
import { addLocation } from '../../../packages/database/src/index.ts'
import { Provider } from '../../../packages/types/src/database.ts'
import { LocationType } from '../types/location.ts'
import { getDbAuthUserArgs } from '../util/db-args.ts'

export const CreateRawLocation = DefineFunction({
  callback_id: 'create_raw_location',
  title: 'New location with manual data',
  description: 'Create an location with all the data',
  source_file: 'functions/create_raw_location.ts',
  input_parameters: {
    properties: {
      name: {
        type: Schema.types.string,
        description: 'Name of the location',
      },
      address: {
        type: Schema.types.string,
        description: 'Address of the location',
      },
      lng: {
        type: Schema.types.number,
        description: 'Longitude of the location',
      },
      lat: {
        type: Schema.types.number,
        description: 'Latitude of the location',
      },
      rating: {
        type: Schema.types.number,
        description: 'Rating of the location',
      },
      category: {
        type: Schema.types.string,
        description: 'Category of the location',
      },
      instagram: {
        type: Schema.types.string,
        description: 'Instagram of the location',
      },
      facebook: {
        type: Schema.types.string,
        description: 'Facebook of the location',
      },
      photo: {
        type: Schema.types.array,
        description: 'Photo of the location',
        items: {
          type: Schema.slack.types.file_id,
        },
      },
      provider: {
        title: 'Provider',
        description: 'The provider of the location',
        type: Schema.types.string,
        enum: Object.values(Provider),
        default: Provider.DefaultShop,
      },
      accepts: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
        description: 'The list of cryptos that the location accepts',
      },
      environment: {
        type: Schema.types.string,
        enum: ['Test', 'Production'],
      },
    },
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
  output_parameters: {
    properties: {
      location: {
        type: LocationType,
      },
    },
    required: ['location'],
  },
})

export default SlackFunction(
  CreateRawLocation,
  async ({ inputs, env, token }) => {
    console.log(`Creating location with ${JSON.stringify(inputs)}`)
    const args = await getDbAuthUserArgs(env, inputs.environment === 'Test')

    // check that args.lat and args.lng are numbers with at least a dot and some numbers after it.
    // we do not allow the user to put a lat like: 16. It needs to be 16.1234
    // "16".toString().match(/\d+\.\d+/) --> not valid
    // "16.".toString().match(/\d+\.\d+/) --> not valid
    // "16.123".toString().match(/\d+\.\d+/) --> valid
    const re = /^-?\d+\.\d+/
    if (!inputs.lat.toString().match(re) || !inputs.lng.toString().match(re)) {
      return { error: `Invalid latitude or longitude: ${inputs.lat}, ${inputs.lng}. Make sure to use a decimal number.` }
    }
    // check is in between -180 and 180
    const latNumber = Number.parseFloat(inputs.lat.toString())
    const lngNumber = Number.parseFloat(inputs.lng.toString())
    if (latNumber < -180 || latNumber > 180 || lngNumber < -180 || lngNumber > 180) {
      return { error: `Invalid latitude or longitude: ${inputs.lat}, ${inputs.lng}. Make sure to use a number between -180 and 180.` }
    }

    const { apikey, authToken, url } = args

    const storageUrl = `${url}/storage/v1`
    const bucket = 'locations-photo'

    const photoId = inputs.photo?.at(0)
    let filename: string

    console.log({ photoId })

    const uuid = globalThis.crypto.randomUUID()
    if (photoId) {
      const fileInfoUrl = new URL(`https://slack.com/api/files.info`)
      fileInfoUrl.searchParams.append('file', photoId)
      const headersToken = { Authorization: `Bearer ${token}` }

      const fileInfo = await fetch(fileInfoUrl.href, { headers: headersToken })
      const photoJson = await fileInfo.json()
      if (!fileInfo.ok || !photoJson.ok) {
        return { error: `Error fetching photo info: ${JSON.stringify({ fileInfo, photoJson })}` }
      }
      const photo = photoJson.file

      console.log(`Photo info: ${JSON.stringify(photo)}`)

      const mimetype = photo.mimetype
      if (mimetype === undefined || mimetype === null) {
        return { error: `Invalid file: ${photo.mimeType}. Only images are allowed.` }
      }
      filename = `${uuid}.${photo.filetype}`

      console.log(`Fetching photo ${photo.name}(${photo.id})`, headersToken)
      const res = await fetch(photo.thumb_360, { headers: headersToken })
      const photoBuffer = await res.arrayBuffer()
      console.log(`Photo buffer: ${photoBuffer.byteLength}`)

      const uploadHeaders = {
        'Authorization': `Bearer ${authToken}`,
        'cache-control': `max-age=3600`,
        'content-type': photo.mimetype,
        apikey,
      }

      const postUrl = `${storageUrl}/object/${bucket}/${filename}`
      console.log(`Uploading ${filename} to ${postUrl}`)
      fetch(postUrl, { method: 'POST', body: photoBuffer, headers: uploadHeaders })
    }

    console.log(`Photo handled`)
    const locationInput = {
      uuid,
      name: inputs.name,
      address: inputs.address,
      lat: inputs.lat,
      lng: inputs.lng,
      category: inputs.category as Category,
      rating: inputs.rating,
      provider: inputs.provider as Provider,
      accepts: inputs.accepts as Currency[],
      sells: [],
      photo: photoId ? `${storageUrl}/object/public/${bucket}/${filename!}` : undefined,
      facebook: inputs.facebook,
      instagram: inputs.instagram,
      gmaps_types: [],
    }
    const res = await addLocation(
      args,
      locationInput,
    )
    console.log(`Added ${JSON.stringify(res)}`)
    if (!res)
      return { error: 'Error adding location' }

    return { outputs: { location: res } }
  },
)
