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

export interface Location extends RawLocation {
  category_label: string

  // Given the social media fields, we can generate just one link
  // See parseLocation function for more details.
  linkTo?: LocationLink
  url?: string

  // UI Options
  theme: Theme
  bg: [string /* primary color */, string | undefined /* Active for atm */]

  // Provider text
  providerLabel?: string
  providerTooltip?: string
  providerTooltipCta?: string

  // Quick getters
  isAtm: boolean
  isDark: boolean
  isLight: boolean
  hasBottomBanner: boolean
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
}
