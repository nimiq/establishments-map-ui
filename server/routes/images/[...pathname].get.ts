import type { MapLocation } from '~~/types/location'
import type { Database } from '~~/types/supabase'
import type { Result } from '~~/types/util'
import { serverSupabaseClient } from '#supabase/server'
import consola from 'consola'

// TODO eventHandlerCache?
export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event)

  // if the request is for a location image, serve it from blob storage
  if (pathname.startsWith('location/')) {
    // if the location is not cached, fetch it from the KV store
    if (!await hubKV().has(pathname)) {
      consola.info(`Location ${pathname} not cached, fetching from KV store`)

      // Remove the 'location/' prefix and the file extension to get the location UUID
      const uuid = pathname.replace('location/', '').replace(/\.[^/.]+$/, '')
      const supabase = await serverSupabaseClient<Database>(event)
      const { data: location, error } = await supabase.from('locations').select('gmaps_place_id').eq('uuid', uuid).single()
      if (error || !location?.gmaps_place_id)
        return createError({ statusCode: 404, message: `Location ${uuid} not found` })

      await cacheLocation(pathname, location.gmaps_place_id)
      consola.info(`Location ${pathname} cached`)
    }
  }

  return hubBlob().serve(event, pathname)
})

export async function cacheLocation(key: string, placeId: string) {
  // Check if the location image exists in blob storage
  const blob = hubBlob()
  const existingImage = await blob.head(key).catch(() => false)

  // If there's a Google Maps place ID and the image doesn't exist, fetch and store it
  if (placeId && !existingImage) {
    const { data: image, error } = await fetchPhotoFromGoogle(placeId)
    if (error || !image) {
      consola.warn(error)
    }
    else if (blob) {
      // Store the fetched image in blob storage
      await blob.put(key, image)
    }
  }
}

// Function to fetch a photo from Google Maps API
async function fetchPhotoFromGoogle(placeId: string): Result<Blob> {
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
    const blob = response._data as Blob

    return { data: blob, error: undefined }
  }
  catch (error) {
    return { data: undefined, error: `Failed to download and store image: ${error}` }
  }
}
