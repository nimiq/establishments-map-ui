import { getCardConfiguration } from './assets-dev/banner-assets'

function getProvider({ provider, isAtm }: MapLocation) {
  const providerRoot = provider?.split('/').at(0) as ProviderType // Some providers have a root and a subprovider. We don't care at the moment about the subprovider
  const isInvalidProvider = !providerRoot || !Providers.includes(providerRoot)
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

  // @ts-expect-error FIXME
  const gmaps = location.gmaps
  // Prioritize links in this order: 1. Google Maps -> 2. Instagram -> 3. Facebook
  location.linkTo = gmaps ? LocationLink.GMaps : location.instagram ? LocationLink.Instagram : location.facebook ? LocationLink.Facebook : undefined
  location.url = gmaps || location.instagram || location.facebook

  // Modify the location object in place
  Object.assign(location, getCardConfiguration(location))

  location.category_label = translateCategory(location.category)
  return location
}
