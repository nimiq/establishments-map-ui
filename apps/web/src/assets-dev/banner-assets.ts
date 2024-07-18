import { Currency, Provider, Theme } from 'types'
import type { CardType, LocationBanner, MapLocation } from 'types'

// @unocss-include

// A dummy implementation of i18n.t that simply passes through the translation key. For usage for bannerLabels, for
// which the actual translation is happening in i18n-t in Banner, and for which a pre-translation here via the
// actual i18n.t would lead to the translation used as translation key there, being an unknown translation key. Thus, we
// simply pass the original translation key, such that it can get handled in Banner's i18n-t. Note that on usage
// i18nKeyPassThrough must be copied into a variable i18n, to be callable as i18n.t, such that the source string /
// translation key is extractable via i18n:extract and such that the translation key is properly replaced with an
// associated simple index in production builds via the i18n optimizer.
const i18nKeyPassThrough = {
  t: (key: string) => key,
}

// Note that bannerLabel is defined as a getter to be able to use the i18nKeyPassThrough, as the actual translation
// for bannerLabel is happening in i18n-t in Banner, and bannerTooltip is defined as a getter to not be
// constant but re-computed on language changes. bannerLabel can include a {provider} placeholder which gets handled
// in i18n-t in ProviderBanner.
type CardConfig = Pick<MapLocation, 'banner' | 'cardStyle'>

const defaultCardStyle: MapLocation['cardStyle'] = {
  bg: ['rgb(var(--nq-neutral-0))', undefined],
  theme: Theme.Light,
  isDark: false,
}

const cardConfig: Record<CardType, CardConfig> = {
  'Default': { cardStyle: defaultCardStyle },
  [Provider.DefaultAtm]: {
    cardStyle: {
      theme: Theme.Dark,
      bg: [
        'radial-gradient(100% 100% at 100% 100%, #4D4C96 0%, #5F4B8B 100%)',
        'radial-gradient(100% 100% at 100% 100%, hsl(241, 33%, 41%) 0%, hsl(259, 30%, 39%) 100%)',
      ],
      isDark: true,
    },
  },
  'Nimiq-Pay': {
    cardStyle: defaultCardStyle,
    banner: {
      type: 'Nimiq-Pay',
      shortLabel: 'Nimiq Pay',
      get label() {
        const i18n = i18nKeyPassThrough
        return i18n.t('Pay with {provider}')
      },
      get tooltip() {
        return i18n.t(
          'Nimiq Pay enables self-custodial payments with NIM wherever BTC Lightning is accepted.',
        )
      },
      googlePlay: 'https://play.google.com/store/apps/details?id=com.nimiq.pay',
      appStore: 'https://apps.apple.com/app/id6471844738',
      icon: 'i-nimiq:logos-nimiq-pay-vertical',
      style: {
        theme: Theme.Dark,
        bg: splitBanner => (splitBanner ? '#265DD7' : 'rgb(var(--nq-gold))'),
        isDark: true,
      },
    },
  },
  [Provider.NAKA]: {
    cardStyle: defaultCardStyle,
    banner: {
      type: Provider.NAKA,
      get label() {
        const i18n = i18nKeyPassThrough
        return i18n.t('Powered by {provider}')
      },
      get tooltip() {
        return i18n.t(
          'NAKA is a global payment network that enables merchants to accept crypto payments.',
        )
      },
      tooltipCta: 'https://naka.com',
      icon: 'i-providers:naka',
      style: {
        theme: Theme.Dark,
        bg: () => '#293FFF',
        isDark: true,
      },
    },
  },
  [Provider.Kurant]: {
    cardStyle: {
      theme: Theme.Dark,
      bg: ['#A92E19', 'hsl(9, 74%, 35%)'],
      isDark: true,
    },
    banner: {
      type: Provider.Kurant,
      get label() {
        const i18n = i18nKeyPassThrough
        return i18n.t('Register with {provider}')
      },
      get tooltip() {
        return i18n.t(
          'Kurant enables users to easily purchase cryptocurrencies through a network of ATMs.',
        )
      },
      tooltipCta: 'https://kurant.net',
      icon: 'i-providers:kurant',
    },
  },
  [Provider.Bluecode]: {
    cardStyle: defaultCardStyle,
    banner: {
      type: Provider.Bluecode,
      get label() {
        const i18n = i18nKeyPassThrough
        return i18n.t('Powered by {provider}')
      },
      get tooltip() {
        return i18n.t(
          'Bluecode is a payment method that allows secure transactions directly through the smartphone.',
        )
      },
      get tooltipLabel() {
        const i18n = i18nKeyPassThrough
        return i18n.t('Coming soon')
      },
      tooltipCta: 'https://bluecode.com',
      style: {
        bg: () => '#004899',
        theme: Theme.Dark,
        isDark: true,
      },
      icon: 'i-providers:bluecode',
    },
  },
  [Provider.CryptopaymentLink]: {
    cardStyle: defaultCardStyle,
    banner: {
      type: Provider.CryptopaymentLink,
      get label() {
        const i18n = i18nKeyPassThrough
        return i18n.t('Powered by {provider}')
      },
      shortLabel: 'CPL',
      get tooltip() {
        return i18n.t(
          'With CryptoPayment Link, you can quickly and easily receive cryptocurrency payments from your customers.',
        )
      },
      tooltipCta: 'https://cplink.com',
      icon: 'i-providers:cpl',
      style: {
        bg: () => '#5371ff',
        theme: Theme.Dark,
        isDark: true,
      },
    },
  },
  [Provider.Edenia]: {
    cardStyle: {
      bg: ['#00B2B0', 'hsl(179, 100%, 32%)'],
      theme: Theme.Dark,
      isDark: true,
      icon: 'i-providers:edenia',
    },
    banner: {
      type: Provider.Edenia,
      get label() {
        const i18n = i18nKeyPassThrough
        return i18n.t('Register with {provider}')
      },
      get tooltip() {
        const i18n = i18nKeyPassThrough
        return i18n.t(
          'Edenia enables users to easily purchase cryptocurrencies through a network of ATMs',
        )
      },
      tooltipCta: 'https://edenia.com/',
    },
  },
  [Provider.Opago]: {
    cardStyle: defaultCardStyle,
    banner: {
      type: Provider.Opago,
      shortLabel: Provider.Opago,
      get tooltip() {
        const i18n = i18nKeyPassThrough
        return i18n.t(
          'Opago offers fast and easy payments with Bitcoin via the Lightning Network',
        )
      },
      tooltipCta: 'https://opago-pay.com/',
      icon: 'i-providers:opago',
      style: {
        bg: () => '#EFBC3F',
        theme: Theme.Light,
        isDark: false,
      },
    },
  },
  [Provider.Osmo]: {
    cardStyle: defaultCardStyle,
    banner: {
      type: Provider.Osmo,
      shortLabel: Provider.Osmo,
      get tooltip() {
        const i18n = i18nKeyPassThrough
        return i18n.t(
          'Osmo is a payment company powered by Bitcoin. Osmo helps you move money at the speed of light, anywhere in the world.',
        )
      },
      tooltipCta: 'https://en.osmowallet.com/',
      icon: 'i-providers:osmo',
      style: {
        bg: () => '#EFBC3F',
        theme: Theme.Light,
        isDark: false,
      },
    },
  },
}

const cardMap: Record<Provider, CardType> = {
  [Provider.NAKA]: Provider.NAKA,
  [Provider.Kurant]: Provider.Kurant,
  [Provider.Bluecode]: Provider.Bluecode,
  [Provider.CryptopaymentLink]: Provider.CryptopaymentLink,
  [Provider.Edenia]: Provider.Edenia,
  [Provider.DefaultAtm]: Provider.DefaultAtm,
  [Provider.AcceptLightning]: 'Default',
  [Provider.BtcMap]: 'Default',
  [Provider.Bridge2Bitcoin]: 'Default',
  [Provider.Coinmap]: 'Default',
  [Provider.DefaultShop]: 'Default',
  [Provider.BitcoinJungle]: 'Default',
  [Provider.TheGambia]: 'Nimiq-Pay',
  [Provider.Opago]: Provider.Opago,
  [Provider.Osmo]: Provider.Osmo,
} as const

export function getCardConfiguration({
  provider: _provider,
  accepts,
}: Pick<MapLocation, 'provider' | 'accepts'>): Pick<
  MapLocation,
  'cardStyle' | 'banner' | 'splitBanner'
> {
  const card = cardMap[_provider]

  if (card === 'Default' && accepts.includes(Currency.LBTC))
    return { ...cardConfig['Nimiq-Pay'], splitBanner: false }

  if (accepts.includes(Currency.LBTC)) {
    const { cardStyle, banner } = cardConfig[card]
    return {
      cardStyle,
      banner: [banner!, cardConfig['Nimiq-Pay'].banner!] as [
        LocationBanner,
        LocationBanner,
      ],
      splitBanner: true,
    }
  }

  return { ...cardConfig[card], splitBanner: false }
}
