import { defineAsyncComponent } from 'vue'
import { ProviderName } from '@/database'
import { i18n } from '@/i18n/i18n-setup'

export enum Theme {
  Default = 'default',

  // A light colorfull banner at the bottom
  BottomBannerLight = 'bottom-banner-light',

  // A dark colorfull banner at the bottom
  BottomBannerDark = 'bottom-banner-dark',

  // A light colorfull card
  FullCardLight = 'full-card',

  // A dark colorfull card
  FullCardDark = 'full-card-dark',
}

export interface ProviderAssets {
  name: ProviderName
  theme: Theme
  bg: string
  label?: string
  tooltip?: string
  icon?: ReturnType<typeof defineAsyncComponent>
}

export const providersAssets: Record<ProviderName, ProviderAssets> = {
  [ProviderName.Default]: {
    name: ProviderName.DefaultAtm,
    theme: Theme.Default,
    bg: 'white',
  },
  [ProviderName.DefaultAtm]: {
    name: ProviderName.DefaultAtm,
    theme: Theme.FullCardDark,
    bg: 'radial-gradient(100% 100% at 100% 100%, #4D4C96 0%, #5F4B8B 100%)',
    icon: defineAsyncComponent(
      () => import('@/components/icons/providers/default-atm.vue'),
    ),
  },
  [ProviderName.GoCrypto]: {
    name: ProviderName.GoCrypto,
    theme: Theme.BottomBannerLight,
    bg: '#F0BF4C',
    get label() {
      return i18n.t('{provider} app required')
    },
    get tooltip() {
      return i18n.t('GoCrypto is a global payment network that enables merchants to accept crypto payments.')
    },
    icon: defineAsyncComponent(
      () => import('@/components/icons/providers/gocrypto.vue'),
    ),
  },
  [ProviderName.Kurant]: {
    name: ProviderName.Kurant,
    theme: Theme.FullCardDark,
    bg: '#A92E19',
    get label() {
      return i18n.t('Register with {provider}')
    },
    get tooltip() {
      return i18n.t('Kurant ATM is a blockchain-based ATM network and platform.')
    },
    icon: defineAsyncComponent(
      () => import('@/components/icons/providers/kurant.vue'),
    ),
  },
  [ProviderName.Bluecode]: {
    name: ProviderName.Bluecode,
    bg: '#004899',
    theme: Theme.BottomBannerDark,
    get label() {
      return i18n.t('{provider} required')
    },
    get tooltip() {
      // return i18n.t('TODO')
      return 'Blah blah'
    },
    icon: defineAsyncComponent(
      () => import('@/components/icons/providers/bluecode.vue'),
    ),
  },
  [ProviderName.CryptopaymentLink]: {
    name: ProviderName.CryptopaymentLink,
    bg: '#5C6CFF',
    theme: Theme.BottomBannerDark,
    get label() {
      return i18n.t('{provider} available')
    },
    get tooltip() {
      // return i18n.t('TODO')
      return 'Blah blah'
    },
    icon: defineAsyncComponent(
      () => import('@/components/icons/providers/cryptopayment-link.vue'),
    ),
  },
  [ProviderName.Edenia]: {
    name: ProviderName.Edenia,
    bg: '#00B2B0',
    theme: Theme.FullCardDark,
    get label() {
      return i18n.t('By {provider}')
    },
    get tooltip() {
      // return i18n.t('TODO')
      return 'Blah blah'
    },
    icon: defineAsyncComponent(
      () => import('@/components/icons/providers/edenia.vue'),
    ),
  },
}
