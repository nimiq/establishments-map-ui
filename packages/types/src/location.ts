/**
Since the UI is quite flexible, better to define all cases using types, and we develop the UI from these types.
 */

import type { Category, Currency, Provider } from './database.ts'

export enum LocationType {
  Shop = 'shop',
  Atm = 'atm',
}

// The theme is used to choose the right font color
export enum Theme {
  Dark = 'dark',
  Light = 'light',
}

export enum LocationLink {
  GMaps = 'gmaps',
  Instagram = 'instagram',
  Facebook = 'facebook',
}

// The different Banner designs
export type Banner = Provider.Bluecode | Provider.CryptopaymentLink | Provider.Edenia | Provider.Kurant | Provider.NAKA | Provider.Edenia | 'Nimiq-Pay' | Provider.DefaultAtm | 'None'

export interface MapLocation extends RawLocation {
  category_label: string

  // Given the social media fields, we can generate just one link
  // See parseLocation function for more details.
  linkTo?: LocationLink
  url?: string

  // UI Options
  theme: Theme
  bg: [string /* primary color */, string | undefined /* Active for atm */]

  // Quick getters
  isAtm: boolean
  isDark: boolean
  isLight: boolean

  // Banner: The design of the banner can be a provider or a Nimiq-Pay banner for specific providers.
  banner: Banner
  bannerLabel?: string
  bannerTooltip?: string
  bannerTooltipCta?: string
  bannerTooltipLabel?: string
  bannerGooglePlay?: string
  bannerAppStore?: string
}

export interface RawLocation {
  uuid: string
  name: string
  address: string
  category: Category
  lat: number
  lng: number
  provider: Provider
  accepts: Currency[]
  sells: Currency[]
  rating?: number
  photo?: string
  instagram?: string
  facebook?: string
  gmaps?: string
  gmaps_types: string[]
  cryptocity: string
}
