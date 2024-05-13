import type { EstimatedMapPosition } from 'types'

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

export function useGeoIp() {
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

  // Recursive function to get the user's location.
  // It will locate user after user has given permission.
  // It won't resolve until 2 seconds have passed or the accuracy is better than 1000m.
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  const MAX_WAIT = 5000
  const INTERVAL = 500
  async function geolocateUserViaBrowser(): Promise<EstimatedMapPosition> {
    geolocatingUserBrowser.value = true
    resumeGeolocation()

    let maxTries = MAX_WAIT / INTERVAL
    while (maxTries--) {
      await sleep(INTERVAL)
      // The default accuracy value is 0
      if (browserCoords.value.accuracy > 0 && browserCoords.value.accuracy < 1000)
        break
    }

    geolocatingUserBrowser.value = false

    return {
      center: {
        lat: browserCoords.value.latitude,
        lng: browserCoords.value.longitude,
      },
      accuracy: browserCoords.value.accuracy,
    }
  }

  return {
    // Lazy computed property. Will only be computed when we read it.
    geolocateIp,
    ipPositionError,
    ipPosition,

    // We need to trigger geolocation manually. Then we can read the coords.
    browserPositionIsSupported,
    errorBrowser,
    geolocateUserViaBrowser,
    geolocatingUserBrowser,
  }
}
