import type { CryptocityUI } from 'types'
import { Cryptocity } from 'types'
import { i18n } from '@/i18n/i18n-setup'

function defaultCryptocityDescription(cryptocityName: string) {
  return [
    i18n.t('{cryptocityName} is part of the global Cryptocity Initiative led by Nimiq and its partners.', { cryptocityName }),
    i18n.t('We are strategically working with local businesses to stimulate the regional economy through the innovative use of cryptocurrency.'),
    i18n.t('Learn more at'),
  ]
}

// Note that description is defined as a getter to be able to use the i18nKeyPassThrough, as the actual translation
// for providerLabel is happening in i18n-t in MapMarkers
export const cryptocitiesUi: Record<Cryptocity, CryptocityUI> = {
  [Cryptocity.SanJose]: {
    name: 'Criptociudad San José',
    get description() { return defaultCryptocityDescription('Criptociudad San José') },
  },

  [Cryptocity.Mannheim]: {
    name: 'Kryptostadt Mannheim',
    get description() { return defaultCryptocityDescription('Kryptostadt Mannheim') },
  },

  [Cryptocity.Banjul]: {
    name: 'Cryptocity Banjul',
    get description() { return defaultCryptocityDescription('Cryptocity Banjul') },
  },

  [Cryptocity.Vienna]: {
    name: 'Cryptocity Vienna',
    get description() { return defaultCryptocityDescription('Cryptocity Vienna') },
  },

  [Cryptocity.Berlin]: {
    name: 'Cryptocity Berlin',
    get description() { return defaultCryptocityDescription('Cryptocity Berlin') },
  },

  [Cryptocity.Munich]: {
    name: 'Cryptocity Munich',
    get description() { return defaultCryptocityDescription('Cryptocity Munich') },
  },

  [Cryptocity.Montreal]: {
    name: 'Cryptocity Montreal',
    get description() { return defaultCryptocityDescription('Cryptocity Montreal') },
  },

  [Cryptocity.Zurich]: {
    name: 'Cryptocity Zurich',
    get description() { return defaultCryptocityDescription('Cryptocity Zurich') },
  },

  [Cryptocity.MexicoCity]: {
    name: 'Cryptocity Mexico City',
    get description() { return defaultCryptocityDescription('Cryptocity Mexico City') },
  },

  [Cryptocity.GuatemalaCity]: {
    name: 'Cryptocity Guatemala City',
    get description() { return defaultCryptocityDescription('Cryptocity Guatemala City') },
  },

  [Cryptocity.Ljubljana]: {
    name: 'Ljubljana',
    get description() {
      return [
        i18n.t('Thanks to GoCrypto, Slovenia\'s capital, Ljubljana, has become a top destination for crypto enthusiasts.'),
        i18n.t('With over 600 acceptance locations, Ljubljana not only stands as the most crypto-friendly city in Europe but also secures a prominent position in international rankings.'),
        i18n.t('Learn more at'),
      ]
    },
  },

  [Cryptocity.SaoPaulo]: {
    name: 'Criptocidade São Paulo',
    get description() { return defaultCryptocityDescription('Criptocidade São Paulo') },
  },
  [Cryptocity.PortoAlegre]: {
    name: 'Criptocidade Porto Alegre',
    get description() { return defaultCryptocityDescription('Criptocidade Porto Algre') },
  },
  [Cryptocity.RioDeJaneiro]: {
    name: 'Criptocidade Rio De Janeiro',
    get description() { return defaultCryptocityDescription('Criptocidade Rio de Janeiro') },
  },
}
