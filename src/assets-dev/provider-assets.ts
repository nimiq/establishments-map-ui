import { Provider, Theme } from 'types'
import type { Location } from 'types'
import { i18n } from '@/i18n/i18n-setup'

// A dummy implementation of i18n.t that simply passes through the translation key. For usage for providerLabels, for
// which the actual translation is happening in i18n-t in ProviderBanner, and for which a pre-translation here via the
// actual i18n.t would lead to the translation used as translation key there, being an unknown translation key. Thus, we
// simply pass the original translation key, such that it can get handled in ProviderBanner's i18n-t. Note that on usage
// i18nKeyPassThrough must be copied into a variable i18n, to be callable as i18n.t, such that the source string /
// translation key is extractable via i18n:extract and such that the translation key is properly replaced with an
// associated simple index in production builds via the i18n optimizer.
const i18nKeyPassThrough = {
  t: (key: string) => key,
}

// Note that providerLabel is defined as a getter to be able to use the i18nKeyPassThrough, as the actual translation
// for providerLabel is happening in i18n-t in ProviderBanner, and providerTooltip is defined as a getter to not be
// constant but re-computed on language changes. providerLabel can include a {provider} placeholder which gets handled
// in i18n-t in ProviderBanner.
export const providersAssets: Record<Provider, Pick<Location, 'bg' | 'theme' | 'providerLabel' | 'providerTooltip' | 'providerTooltipCta'>> = {
  [Provider.DefaultShop]: {
    bg: ['white', undefined],
    theme: Theme.Light,

  },
  [Provider.DefaultAtm]: {
    theme: Theme.Dark,
    bg: ['radial-gradient(100% 100% at 100% 100%, #4D4C96 0%, #5F4B8B 100%)', 'radial-gradient(100% 100% at 100% 100%, hsl(241, 33%, 41%) 0%, hsl(259, 30%, 39%) 100%)'],
  },
  [Provider.GoCrypto]: {
    theme: Theme.Light,
    bg: ['#F0BF4C', undefined],
    get providerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Powered by {provider}')
    },
    get providerTooltip() {
      return i18n.t('GoCrypto is a global payment network that enables merchants to accept crypto payments.')
    },
    providerTooltipCta: 'https://gocrypto.com',
  },
  [Provider.Kurant]: {
    theme: Theme.Dark,
    bg: ['#A92E19', 'hsl(9, 74%, 35%)'],
    get providerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Register with {provider}')
    },
    get providerTooltip() {
      return i18n.t('Kurant enables users to easily purchase cryptocurrencies through a network of ATMs.')
    },
    providerTooltipCta: 'https://kurant.net',
  },
  [Provider.Bluecode]: {
    bg: ['#004899', undefined],
    theme: Theme.Dark,
    get providerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Powered by {provider}')
    },
    get providerTooltip() {
      return i18n.t('Bluecode is a payment method that allows secure transactions directly through the smartphone.')
    },
    providerTooltipCta: 'https://bluecode.com',
  },
  [Provider.CryptopaymentLink]: {
    bg: ['#5C6CFF', undefined],
    theme: Theme.Dark,
    get providerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Powered by {provider}')
    },
    get providerTooltip() {
      return i18n.t('With CryptoPayment Link, you can quickly and easily receive cryptocurrency payments from your customers.')
    },
    providerTooltipCta: 'https://cplink.com',
  },
  [Provider.Edenia]: {
    bg: ['#00B2B0', 'hsl(179, 100%, 32%)'],
    theme: Theme.Dark,
    get providerLabel() {
      const i18n = i18nKeyPassThrough
      return i18n.t('Register with {provider}')
    },
    get providerTooltip() {
      return i18n.t('Edenia enables users to easily purchase cryptocurrencies through a network of ATMs')
    },
    providerTooltipCta: 'https://edenia.com/',
  },
}
