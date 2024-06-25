import type { LocationQuery, RouteParams } from 'vue-router'
import type { MapPosition } from 'types'
import { useMap } from '@/stores/map'
import { isPointInViewport } from 'geo'

/**
 * When user loads the map:
 *  1. If the user is at /lat,lng,zoom -> We load the user's location from the URL
 *  2. If the user is at / -> We load the user's location from the IP address using Nimiq Geolocation API
 *  3. Otherwise, we use FALLBACK_POSITION
 *
 * When UUID is in the URL, we will show the card for that location. We even edit the lat and lng in the URL to match the location's coordinates.
 */

// Costa Rica
const FALLBACK_POSITION: MapPosition = { center: { lat: 9.6301892, lng: -84.2541844 }, zoom: 9 }

const validFloat = (n?: string | string[]) => !!n && typeof n === 'string' && !Number.isNaN(Number(n))

async function useDefaultMapPosition() {
  const { useGeoIp } = await import('@/stores/geo-location')
  const { geolocateIp } = useGeoIp()
  const { ipPositionError, ipPosition } = storeToRefs(useGeoIp())
  await geolocateIp()

  if (!ipPositionError.value && ipPosition.value) {
    // eslint-disable-next-line no-console
    console.log(`Using user's location: ${JSON.stringify(ipPosition)}`)
    useMap().setPosition(ipPosition.value)
  }
  else {
    console.warn(`Error getting user's location: ${ipPositionError.value}. Using fallback position. ${JSON.stringify(FALLBACK_POSITION)}`)
    useMap().setPosition(FALLBACK_POSITION)
  }
}

export async function useInitialMapPosition({ lat: latStr, lng: lngStr, zoom: zoomStr }: RouteParams, { uuid: locationUuid }: LocationQuery) {
  // If the user is at /, then we load the locations using the default position
  // If we have an uuid, we load the location using the uuid
  if ((!validFloat(latStr) || !validFloat(lngStr) || !validFloat(zoomStr)) && !locationUuid) {
    useDefaultMapPosition()
    return
  }

  let { lat, lng, zoom } = { lat: Number(latStr), lng: Number(lngStr), zoom: Number(zoomStr) }

  if (locationUuid) {
    const location = await (await import('@/stores/locations')).useLocations().getLocationByUuid(locationUuid as string /* UUID already valid. See router.ts */)
    const { height, width } = useWindowSize()
    if (location && !isPointInViewport({ center: { lat, lng }, zoom, height: height.value, width: width.value }, location)) {
      lat = location.lat
      lng = location.lng
      zoom = 16
    }
  }

  useMap().setPosition({ center: { lat, lng }, zoom })
}
