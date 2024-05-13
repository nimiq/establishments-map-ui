import { Provider, Theme } from 'types'
import type { Banner, MapLocation } from 'types'

// A dummy implementation of i18n.t that simply passes through the translation key. For usage for bannerLabels, for
// which the actual translation is happening in i18n-t in ProviderBanner, and for which a pre-translation here via the
// actual i18n.t would lead to the translation used as translation key there, being an unknown translation key. Thus, we
// simply pass the original translation key, such that it can get handled in ProviderBanner's i18n-t. Note that on usage
// i18nKeyPassThrough must be copied into a variable i18n, to be callable as i18n.t, such that the source string /
// translation key is extractable via i18n:extract and such that the translation key is properly replaced with an
// associated simple index in production builds via the i18n optimizer.
const i18nKeyPassThrough = {
  t: (key: string) => key,
}

// Note that bannerLabel is defined as a getter to be able to use the i18nKeyPassThrough, as the actual translation
// for bannerLabel is happening in i18n-t in ProviderBanner, and bannerTooltip is defined as a getter to not be
// constant but re-computed on language changes. bannerLabel can include a {provider} placeholder which gets handled
// in i18n-t in ProviderBanner.
type BannerConfiguration = Pick<MapLocation, 'bg' | 'theme' | 'bannerLabel' | 'bannerTooltip' | 'bannerTooltipCta' | 'bannerTooltipLabel' | 'bannerGooglePlay' | 'bannerAppStore'>
const cardConfiguration: Record<Banner, BannerConfiguration> = {
  'None': {
    bg: ['rgb(var(--nq-neutral-0))', undefined],
    theme: Theme.Light,
  },
  [Provider.DefaultAtm]: {
    theme: Theme.Dark,
    bg: ['radial-gradient(100% 100% at 100% 100%, #4D4C96 0%, #5F4B8B 100%)', 'radial-gradient(100% 100% at 100% 100%, hsl(241, 33%, 41%) 0%, hsl(259, 30%, 39%) 100%)'],
  },
  'Nimiq-Pay': {
    bg: ['rgb(var(--nq-gold))', 'rgb(var(--nq-gold-1100))'],
    theme: Theme.Dark,
    get bannerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Pay with {provider}')
    },
    get bannerTooltip() {
      return i18n.t('Nimiq Pay enables self-custodial payments with NIM wherever BTC Lightning is accepted.')
    },
    bannerGooglePlay: 'https://play.google.com/store/apps/details?id=com.nimiq.pay',
    bannerAppStore: 'https://apps.apple.com/app/id6471844738',
  },
  [Provider.NAKA]: {
    theme: Theme.Dark,
    bg: ['#293FFF', undefined],
    get bannerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Powered by {provider}')
    },
    get bannerTooltip() {
      return i18n.t('NAKA is a global payment network that enables merchants to accept crypto payments.')
    },
    bannerTooltipCta: 'https://naka.com',
  },
  [Provider.Kurant]: {
    theme: Theme.Dark,
    bg: ['#A92E19', 'hsl(9, 74%, 35%)'],
    get bannerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Register with {provider}')
    },
    get bannerTooltip() {
      return i18n.t('Kurant enables users to easily purchase cryptocurrencies through a network of ATMs.')
    },
    bannerTooltipCta: 'https://kurant.net',
  },
  [Provider.Bluecode]: {
    bg: ['#004899', undefined],
    theme: Theme.Dark,
    get bannerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Powered by {provider}')
    },
    get bannerTooltip() {
      return i18n.t('Bluecode is a payment method that allows secure transactions directly through the smartphone.')
    },
    get bannerTooltipLabel() {
      return i18n.t('Coming soon')
    },
    bannerTooltipCta: 'https://bluecode.com',
  },
  [Provider.CryptopaymentLink]: {
    bg: ['#5C6CFF', undefined],
    theme: Theme.Dark,
    get bannerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Powered by {provider}')
    },
    get bannerTooltip() {
      return i18n.t('With CryptoPayment Link, you can quickly and easily receive cryptocurrency payments from your customers.')
    },
    bannerTooltipCta: 'https://cplink.com',
  },
  [Provider.Edenia]: {
    bg: ['#00B2B0', 'hsl(179, 100%, 32%)'],
    theme: Theme.Dark,
    get bannerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Register with {provider}')
    },
    get bannerTooltip() {
      return i18n.t('Edenia enables users to easily purchase cryptocurrencies through a network of ATMs')
    },
    bannerTooltipCta: 'https://edenia.com/',
  },
}

const bannerMap: Record<Provider, Banner> = {
  [Provider.AcceptLightning]: 'Nimiq-Pay',
  [Provider.BtcMap]: 'Nimiq-Pay',
  [Provider.Bridge2Bitcoin]: 'Nimiq-Pay',
  [Provider.Coinmap]: 'Nimiq-Pay',
  [Provider.NAKA]: Provider.NAKA,
  [Provider.Kurant]: Provider.Kurant,
  [Provider.Bluecode]: Provider.Bluecode,
  [Provider.CryptopaymentLink]: Provider.CryptopaymentLink,
  [Provider.Edenia]: Provider.Edenia,
  [Provider.DefaultAtm]: Provider.DefaultAtm,
  [Provider.DefaultShop]: 'None',
  [Provider.BitcoinJungle]: 'None',
}

export function getCardConfiguration(provider: Provider): typeof cardConfiguration[Banner] & Pick<MapLocation, 'banner'> {
  const banner = bannerMap[provider]
  return { banner, ...cardConfiguration[banner] }
}
