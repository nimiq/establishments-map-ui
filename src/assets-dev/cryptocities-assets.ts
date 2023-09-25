import { Cryptocity } from 'types'
import type { CryptocityData } from 'types'
import { i18n } from '@/i18n/i18n-setup'

// Note that description is defined as a getter to be able to use the i18nKeyPassThrough, as the actual translation
// for providerLabel is happening in i18n-t in MapMarkers
export const cryptocitiesData: Record<Cryptocity, CryptocityData> = {
  [Cryptocity.SanJose]: {
    cryptocity: Cryptocity.SanJose,
    name: 'Criptociudad San José',
    get description() {
      return [
        i18n.t('The San Jose Cryptocity Initiative is part of the Cryptocity endeavour led by Nimiq and its partners.'),
        i18n.t('We are strategically working with local businesses to stimulate the regional economy through the innovative use of cryptocurrency.'),
        i18n.t('You can learn more at'),
      ]
    },
    url: 'https://www.criptociudad.cr/',
    centroid: { lat: 9.935, lng: -84.102 },
    boundingBox: { neLat: 9.9720332, neLng: -84.0467977, swLat: 9.8998796, swLng: -84.1800327 },
    count: -1,
  },
}
