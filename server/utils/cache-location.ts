import type { MapLocation } from '~~/types/location'
import type { Result } from '~~/types/util'
import type { H3Event } from 'h3'
import consola from 'consola'

export function getLocationKey(uuid: string) {
  return `location:${uuid}`
}

export async function cacheLocation(event: H3Event, location: MapLocation) {
  const kv = hubKV()
  const key = getLocationKey(location.uuid)

  // Check if the location image exists in blob storage
  const blob = hubBlob()
  const existingImage = await blob.head(key).catch(() => false)
  const placeId = location.gmaps_place_id

  // If there's a Google Maps place ID and the image doesn't exist, fetch and store it
  if (placeId && !existingImage) {
    const { data: image, error } = await fetchPhotoFromGoogle(placeId)
    if (error || !image) {
      consola.warn(error)
    }
    else if (blob) {
      // Store the fetched image in blob storage
      await blob.put(key, image.blob, { contentType: image.contentType })
    }
  }

  // Cache the location data in KV store for future quick access
  await kv.set(key, location)
}

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
