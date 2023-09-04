import type { LocationQuery, RouteParams } from 'vue-router'
import type { MapPosition } from 'types'
import { useMap } from '@/stores/map'

/**
 * When user loads the map:
 *  1. If the user is at /lat,lng,zoom -> We load the user's location from the URL
 *  2. If the user is at / -> We load the user's location from the IP address using Nimiq Geolocation API
 *  3. Otherwise, we use FALLBACK_POSITION
*/

// Costa Rica
export const FALLBACK_POSITION: MapPosition = { center: { lat: 9.6301892, lng: -84.2541844 }, zoom: 9 }

export async function useInitialMapPosition(p: RouteParams, query: LocationQuery) {
  const { setPosition } = useMap()

  if (Object.keys(query).includes('uuid')) {
    // We need to load the location from the uuid, but we want to keep the map position
    (await import('@/stores/locations')).useLocations().getLocationByUuid(query.uuid as string /* UUID already valid. See router.ts */)
  }

  const validFloat = (n?: string | string[]) => !!n && typeof n === 'string' && !Number.isNaN(Number(n))
  if (validFloat(p.lat) && validFloat(p.lng) && validFloat(p.zoom)) {
    setPosition({ center: { lat: Number(p.lat), lng: Number(p.lng) }, zoom: Number(p.zoom) })
    return
  }

  const { useGeoIp } = await import('@/composables/useGeoLocation')
  const { geolocateIp, ipPosition, ipPositionError } = useGeoIp()
  await geolocateIp()

  if (!ipPositionError.value && ipPosition.value) {
    setPosition(ipPosition.value)
    return
  }

  console.warn(`Error getting user's location: ${ipPositionError.value}. Using fallback position. ${JSON.stringify(FALLBACK_POSITION)}`)
  setPosition(FALLBACK_POSITION)
}
