import { PROVIDERS } from 'database'
import type { DatabaseAnonArgs, DatabaseArgs, MapLocation } from 'types'
import { DatabaseUser, LocationLink, Provider } from 'types'
import { getCardConfiguration } from './assets-dev/banner-assets'
import { translateCategory } from './i18n/translations'
import { useApp } from './stores/app'

const GOOGLE_MAPS_API = import.meta.env.VITE_GOOGLE_MAP_KEY

export const DATABASE_ARGS: DatabaseArgs = {
  url: import.meta.env.VITE_DATABASE_URL,
  apikey: import.meta.env.VITE_DATABASE_KEY,
}

export async function getAnonDatabaseArgs(): Promise<DatabaseAnonArgs> {
  await useApp().init()
  return { ...DATABASE_ARGS, captchaToken: useApp().captchaTokenUuid, user: DatabaseUser.Anonymous }
}

function getProvider({ provider, isAtm }: MapLocation) {
  const providerRoot = provider?.split('/').at(0) as Provider // Some providers have a root and a subprovider. We don't care at the moment about the subprovider
  const isInvalidProvider = !providerRoot || !PROVIDERS.includes(providerRoot)
  if (isInvalidProvider) {
    const newProvider = isAtm ? Provider.DefaultAtm : Provider.DefaultShop
    console.warn(`Invalid provider: '${provider}'. Setting ${newProvider} provider. MapLocation: ${JSON.stringify(location)}`)
    return newProvider
  }
  else if (isAtm && providerRoot === Provider.DefaultShop) {
    return Provider.DefaultAtm
  }
  return providerRoot
}

export function parseLocation(location: MapLocation) {
  location.isAtm = location.sells.length > 0
  location.provider = getProvider(location)

  // If the photo is not a URL, then it's a reference to Google Maps
  const hasPhotoUrl = location.photo?.startsWith('http')
  if (!hasPhotoUrl) {
    if (location.photo) {
      // location.photo is a base64 photo reference
      location.photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${location.photo}&key=${GOOGLE_MAPS_API}`
    }
    else {
      location.photo = undefined
    }
  }

  // Prioritize links in this order: 1. Google Maps -> 2. Instagram -> 3. Facebook
  location.linkTo = location.gmaps ? LocationLink.GMaps : location.instagram ? LocationLink.Instagram : location.facebook ? LocationLink.Facebook : undefined
  location.url = location.gmaps || location.instagram || location.facebook

  location = { ...location, ...getCardConfiguration(location) }

  // Make the translation reactive in case user change language
  Object.defineProperty(location, 'category_label', { get: () => translateCategory(location.category) })
  return location
}
