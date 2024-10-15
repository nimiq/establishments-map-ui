import { object, safeParse, string } from 'valibot'
import consola from 'consola'
import type { Database } from '~~/types/supabase'
import { serverSupabaseClient } from '#supabase/server'
import type { MapLocation } from '~~/types/location'
import type { Result } from '~~/types/util'

// Define the schema for validating route parameters
const ParamsSchema = object({ uuid: string() })

export default defineEventHandler(async (event) => {
  // Validate the route parameters
  const { output: query, issues, success } = await getValidatedRouterParams(event, query => safeParse(ParamsSchema, query))
  if (!success || !query)
    throw createError({ statusCode: 400, message: 'Invalid query parameters', cause: JSON.stringify(issues) })

  // Generate a unique key for the location
  const key = `location:${query.uuid}`
  const kv = hubKV()

  // Check if the location data is already cached in KV store
  if (await kv.has(key))
    return await kv.get(key)

  // If not in cache, fetch the location data from Supabase
  const supabase = await serverSupabaseClient<Database>(event)
  const { data, error } = await supabase.rpc('get_location_by_uuid', { location_uuid: query.uuid }) as unknown as { data: MapLocation, error: any }
  if (error || !data)
    return createError({ statusCode: 404, message: `Location with UUID ${query.uuid} not found` })

  // Check if the location image exists in blob storage
  const blob = hubBlob()
  const existingImage = await blob.head(key).catch(() => false)
  const placeId = data.gmaps_place_id

  // If there's a Google Maps place ID and the image doesn't exist, fetch and store it
  if (placeId && !existingImage) {
    const { data: image, error } = await fetchPhotoFromGoogle(placeId)
    if (error || !image) {
      consola.warn(error)
      data.photo = ``
    }
    else if (blob) {
      // Store the fetched image in blob storage
      await blob.put(key, image.blob, { contentType: image.contentType })
      // Use the baseUrl when setting the photo URL
      data.photo = `https://${getRequestHost(event)}/images/${key}`
    }
  }

  // Cache the location data in KV store for future quick access
  await kv.set(key, data)

  return data
})

// Function to fetch a photo from Google Maps API
async function fetchPhotoFromGoogle(placeId: string): Result<{ contentType: string, blob: Blob }> {
  const gmapsApiKey = useRuntimeConfig().public.googleMapsApiKey
  try {
    // Fetch place details to get the photo reference
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${gmapsApiKey}`
    const placeDetails = await $fetch<{ result?: { photos?: { photo_reference: string }[] } }>(placeDetailsUrl)
    const photoReference = placeDetails.result?.photos?.[0]?.photo_reference

    if (!photoReference)
      return { data: undefined, error: `No photo reference found for place ID ${placeId}. Got ${JSON.stringify(placeDetails)}` }

    // Fetch the actual photo using the photo reference
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${gmapsApiKey}`
    const response = await $fetch.raw(imageUrl, { responseType: 'blob' })
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const blob = response._data as Blob

    return { data: { blob, contentType }, error: undefined }
  }
  catch (error) {
    return { data: undefined, error: `Failed to download and store image: ${error}` }
  }
}
