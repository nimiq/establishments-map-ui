/**
Since the UI is quite flexible, better to define all cases using types, and we develop the UI from these types.
*/

import type { Category, Currency, Provider } from './database'

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

export interface Location {
  uuid: string
  name: string
  address: string
  category: Category
  category_label: string
  gmaps_types: string[]
  lat: number
  lng: number
  provider: Provider
  accepts: Currency[]
  sells: Currency[]
  rating?: number
  photo?: string

  // These social media fields are coming from the database
  instagram?: string
  facebook?: string
  gmaps?: string

  // Given the social media fields, we can generate just one link
  // See parseLocation function for more details.
  linkTo?: LocationLink
  url?: string

  // UI Options
  theme: Theme
  bgFullCard: boolean
  bg: string

  // Provider text
  providerLabel?: string
  providerTooltip?: string
  providerTooltipCta?: string

  // Quick getters
  isAtm: boolean
  isShop: boolean
  isDark: boolean
  isLight: boolean
  hasBottomBanner: boolean
}
