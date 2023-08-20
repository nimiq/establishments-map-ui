import { defineAsyncComponent } from 'vue'
import { i18n } from '@/i18n/i18n-setup'
import { Provider, Theme } from '@/types'
import type { Location } from '@/types'

export const providersAssets: Record<Provider, Pick<Location, 'bg' | 'bgFullCard' | 'theme' | 'providerLabel' | 'providerIcon' | 'providerTooltip'>> = {
  [Provider.Default]: {
    bg: 'white',
    bgFullCard: false,
    theme: Theme.Light,

  },
  [Provider.DefaultAtm]: {
    theme: Theme.Dark,
    bgFullCard: true,
    bg: 'radial-gradient(100% 100% at 100% 100%, #4D4C96 0%, #5F4B8B 100%)',
    providerIcon: defineAsyncComponent(
      () => import('@/components/icons/providers/default-atm.vue'),
    ),
  },
  [Provider.GoCrypto]: {
    theme: Theme.Light,
    bgFullCard: false,
    bg: '#F0BF4C',
    get providerLabel() {
      return i18n.t('{provider} app required')
    },
    get providerTooltip() {
      return i18n.t('GoCrypto is a global payment network that enables merchants to accept crypto payments.')
    },
    providerIcon: defineAsyncComponent(
      () => import('@/components/icons/providers/gocrypto.vue'),
    ),
  },
  [Provider.Kurant]: {
    theme: Theme.Dark,
    bgFullCard: true,
    bg: '#A92E19',
    get providerLabel() {
      return i18n.t('Register with {provider}')
    },
    get providerTooltip() {
      return i18n.t('Kurant ATM is a blockchain-based ATM network and platform.')
    },
    providerIcon: defineAsyncComponent(
      () => import('@/components/icons/providers/kurant.vue'),
    ),
  },
  [Provider.Bluecode]: {
    bg: '#004899',
    bgFullCard: false,
    theme: Theme.Dark,
    get providerLabel() {
      return i18n.t('{provider} required')
    },
    get providerTooltip() {
      // TODO
      return 'Blah blah'
    },
    providerIcon: defineAsyncComponent(
      () => import('@/components/icons/providers/bluecode.vue'),
    ),
  },
  [Provider.CryptopaymentLink]: {
    bg: '#5C6CFF',
    theme: Theme.Dark,
    bgFullCard: false,
    get providerLabel() {
      return i18n.t('{provider} available')
    },
    get providerTooltip() {
      // TODO
      return 'Blah blah'
    },
    providerIcon: defineAsyncComponent(
      () => import('@/components/icons/providers/cryptopayment-link.vue'),
    ),
  },
  [Provider.Edenia]: {
    bg: '#00B2B0',
    theme: Theme.Dark,
    bgFullCard: false,
    get providerLabel() {
      return i18n.t('By {provider}')
    },
    get providerTooltip() {
      // TODO
      return 'Blah blah'
    },
    providerIcon: defineAsyncComponent(
      () => import('@/components/icons/providers/edenia.vue'),
    ),
  },

  // TODO
  [Provider.CryptoCR]: {
    theme: Theme.Light,
    bgFullCard: false,
    bg: 'pink',
    providerIcon: defineAsyncComponent(
      () => import('@/components/icons/providers/default-atm.vue'),
    ),
  },
}
