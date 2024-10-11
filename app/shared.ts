import { PROVIDERS } from 'database'
import { getCardConfiguration } from './assets-dev/banner-assets'

function getProvider({ provider, isAtm }: MapLocation) {
  const providerRoot = provider?.split('/').at(0) as ProviderType // Some providers have a root and a subprovider. We don't care at the moment about the subprovider
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
      location.photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${location.photo}&key=${useRuntimeConfig().public.googleMapKey}`
    }
    else {
      location.photo = null
    }
  }

  // @ts-expect-error FIXME
  const gmaps = location.gmaps
  // Prioritize links in this order: 1. Google Maps -> 2. Instagram -> 3. Facebook
  location.linkTo = gmaps ? LocationLink.GMaps : location.instagram ? LocationLink.Instagram : location.facebook ? LocationLink.Facebook : undefined
  location.url = gmaps || location.instagram || location.facebook

  location = { ...location, ...getCardConfiguration(location) }

  location.category_label = useTranslations().translateCategory(location.category)
  return location
}
