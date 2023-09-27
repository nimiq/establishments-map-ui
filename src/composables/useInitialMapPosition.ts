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

async function selectAndOpenCard(uuid: string) {
  const location = await (await import('@/stores/locations')).useLocations().getLocationByUuid(uuid /* UUID already valid. See router.ts */)
  if (location) {
    // We set the locations in the store, and then we show the card
    // https://github.com/nimiq/crypto-map/commit/45b8cdf2e7aabba6039d69043190b8357950736d#r126800610
    (await import ('@/stores/markers')).useMarkers().singles = [location]
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(500) // We need to wait for the marker to be rendered in the right position to avoid CLS
    ;(document.querySelector(`[data-trigger-uuid="${uuid}"]`) as HTMLElement)?.click()
  }
  else {
    console.warn(`Location with uuid ${uuid} not found`)
  }
}

export async function useInitialMapPosition(p: RouteParams, query: LocationQuery) {
  if (Object.keys(query).includes('uuid'))
    selectAndOpenCard(query.uuid as string) // No need to await

  const validFloat = (n?: string | string[]) => !!n && typeof n === 'string' && !Number.isNaN(Number(n))
  if (validFloat(p.lat) && validFloat(p.lng) && validFloat(p.zoom)) {
    useMap().setPosition({ center: { lat: Number(p.lat), lng: Number(p.lng) }, zoom: Number(p.zoom) })
    return
  }

  const { useGeoIp } = await import('@/composables/useGeoLocation')
  const { geolocateIp, ipPosition, ipPositionError } = useGeoIp()
  await geolocateIp()

  if (!ipPositionError.value && ipPosition.value) {
    useMap().setPosition(ipPosition.value)
    return
  }

  console.warn(`Error getting user's location: ${ipPositionError.value}. Using fallback position. ${JSON.stringify(FALLBACK_POSITION)}`)
  useMap().setPosition(FALLBACK_POSITION)
}
