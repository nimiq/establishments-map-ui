import type { EstimatedMapPosition } from 'types'
import { createSharedComposable } from '@vueuse/core'

interface GeoIpResponse {
  location?: {
    longitude: string
    latitude: string
    accuracy_radius: number
  }
  country?: string
  city?: string
  city_names?: { [language: string]: string }
}

function _useGeoIp() {
  const ipPositionError = ref()
  const ipPosition = ref<EstimatedMapPosition>()

  async function geolocateIp() {
    const url = new URL('https://geoip.nimiq-network.com:8443/v1/locate')
    const response = await fetch(url).catch((e) => {
      ipPositionError.value = `Failed to fetch IP location: ${e}`
    })
    if (!response)
      return undefined

    const json: GeoIpResponse = await response.json()
    if (!json || !json.location || !json.location.latitude || !json.location.longitude) {
      ipPositionError.value = `Failed to fetch IP location. ${JSON.stringify(json)}`
      return undefined
    }

    const { latitude, longitude, accuracy_radius = 300 } = json.location
    ipPosition.value = {
      center: {
        lat: Number.parseFloat(latitude),
        lng: Number.parseFloat(longitude),
      },
      accuracy: accuracy_radius * 1000, // km -> m
    }
  }

  const { isSupported: browserPositionIsSupported, resume: resumeGeolocation, coords: browserCoords, error: errorBrowser } = useGeolocation({
    immediate: false,
  })
  const geolocatingUserBrowser = ref(false)
  const browserPosition = computed<EstimatedMapPosition>(() => {
    return {
      center: {
        lat: browserCoords.value.latitude,
        lng: browserCoords.value.longitude,
      },
      accuracy: browserCoords.value.accuracy,
    }
  })

  // Recursive function to get the user's location.
  // It will locate user after user has given permission.
  // It won't resolve until 15 seconds have passed or the accuracy is better than 1000m.
  const MAX_WAIT = 15000
  async function geolocateUserViaBrowser(): Promise<EstimatedMapPosition> {
    geolocatingUserBrowser.value = true
    resumeGeolocation()

    await until(browserPosition).toMatch(x => x.accuracy > 0, { timeout: MAX_WAIT })
    geolocatingUserBrowser.value = false
    return browserPosition.value
  }

  return {
    // Lazy computed property. Will only be computed when we read it.
    geolocateIp,
    ipPositionError,
    ipPosition,
    browserPosition,

    // We need to trigger geolocation manually. Then we can read the coords.
    browserPositionIsSupported,
    errorBrowser,
    geolocateUserViaBrowser,
    geolocatingUserBrowser,
  }
}

export const useGeoIp = createSharedComposable(_useGeoIp)
