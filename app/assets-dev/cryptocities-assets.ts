const useI18n = () => ({ t: (key: string) => key })

// TODO Remove url and showCardAtZoom
// TODO Remove 'Learn more at'... Move it to tooltip

// Note that description is defined as a getter to be able to use the i18nKeyPassThrough, as the actual translation
// for providerLabel is happening in i18n-t in MapMarkers

export const cryptocitiesUi: Record<CryptocityType, CryptocityUI> = {
  [Cryptocity.SanJose]: {
    name: 'Criptociudad San José',
    get description() {
      return [
        useI18n().t('Criptociudad San José is part of the global Cryptocity Initiative led by Nimiq and its partners.'),
        useI18n().t('We are strategically working with local businesses to stimulate the regional economy through the innovative use of cryptocurrency.'),
        useI18n().t('Learn more at'),
      ]
    },
    // url: 'https://www.criptociudad.cr/',
    // showCardAtZoom: 11,
  },

  [Cryptocity.Mannheim]: {
    name: 'Kryptostadt Mannheim',
    get description() {
      return [
        useI18n().t('Kryptostadt Mannheim is part of the global Cryptocity Initiative led by Nimiq and its partners.'),
        useI18n().t('We are strategically working with local businesses to stimulate the regional economy through the innovative use of cryptocurrency.'),
        useI18n().t('Learn more at'),
      ]
    },
    // url: 'https://kryptostadt.info/',
    // showCardAtZoom: 12,
  },

  [Cryptocity.Ljubljana]: {
    name: 'Ljubljana',
    get description() {
      return [
        useI18n().t('Thanks to GoCrypto, Slovenia\'s capital, Ljubljana, has become a top destination for crypto enthusiasts.'),
        useI18n().t('With over 600 acceptance locations, Ljubljana not only stands as the most crypto-friendly city in Europe but also secures a prominent position in international rankings.'),
        useI18n().t('Learn more at'),
      ]
    },
    // url: 'https://gocrypto.com/blog',
    // showCardAtZoom: 11,
  },
  [Cryptocity.Banjul]: {
    name: 'Banjul',
    get description() {
      return [
        useI18n().t('Banjul is part of the global Cryptocity Initiative.'),
        useI18n().t('We are working with local businesses to promote cryptocurrency adoption.'),
        useI18n().t('Learn more at'),
      ]
    },
  },
  [Cryptocity.Vienna]: {
    name: 'Vienna',
    get description() {
      return [
        useI18n().t('Vienna is embracing cryptocurrency technology.'),
        useI18n().t('The city is fostering innovation in the crypto space.'),
        useI18n().t('Learn more at'),
      ]
    },
  },
  [Cryptocity.Berlin]: {
    name: 'Berlin',
    get description() {
      return [
        useI18n().t('Berlin is a hub for blockchain and cryptocurrency startups.'),
        useI18n().t('The city offers a vibrant ecosystem for crypto enthusiasts.'),
        useI18n().t('Learn more at'),
      ]
    },
  },
  [Cryptocity.Munich]: {
    name: 'Munich',
    get description() {
      return [
        useI18n().t('Munich is advancing in the cryptocurrency space.'),
        useI18n().t('The city is home to various blockchain initiatives.'),
        useI18n().t('Learn more at'),
      ]
    },
  },
  [Cryptocity.Montreal]: {
    name: 'Montreal',
    get description() {
      return [
        useI18n().t('Montreal is emerging as a significant player in the cryptocurrency landscape.'),
        useI18n().t('The city is fostering a growing community of blockchain enthusiasts and startups.'),
        useI18n().t('Learn more at'),
      ]
    },
  },
  [Cryptocity.Zurich]: {
    name: 'Zurich',
    get description() {
      return [
        useI18n().t('Zurich is becoming a prominent hub for cryptocurrency and blockchain technology.'),
        useI18n().t('The city is known for its innovative fintech ecosystem and crypto-friendly regulations.'),
        useI18n().t('Learn more at'),
      ]
    },
  },
  [Cryptocity.MexicoCity]: {
    name: 'Mexico City',
    get description() {
      return [
        useI18n().t('Mexico City is embracing cryptocurrency adoption and blockchain technology.'),
        useI18n().t('The city is seeing a rise in crypto startups and increasing interest from both businesses and individuals.'),
        useI18n().t('Learn more at'),
      ]
    },
  },
  [Cryptocity.GuatemalaCity]: {
    name: 'Guatemala City',
    get description() {
      return [
        useI18n().t('Guatemala City is exploring the potential of cryptocurrencies and blockchain technology.'),
        useI18n().t('The city is witnessing growing interest in digital currencies and their applications.'),
        useI18n().t('Learn more at'),
      ]
    },
  },
  // Add any other missing cryptocities here with the same structure
}
