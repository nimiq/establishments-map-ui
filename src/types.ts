import type { defineAsyncComponent } from 'vue'

/** Database Types

The types from the database are basically the same as the values we would get from the database
using select * from table_name.
Pros:
- Since these tables are rarely updated, we hardcode the values here, so we don't have to query.
- We can easily use the types in the frontend using the enums
- Easily create the translations.
Const:
- Update the types manually when the database changes. This rarely happens and when it happens, most
likely we also need to update things in the UI, so not really a downside!
    -> If we change category, we need to add the proper icon and the translation
    -> If we change provider, we need to add the logo, assets, translations...
    -> And so on
 */

export enum Category {
  CarsBikes = 'cars_bikes',
  Cash = 'cash',
  ComputerElectronics = 'computer_electronics',
  Entertainment = 'entertainment',
  FoodDrinks = 'food_drinks',
  HealthBeauty = 'health_beauty',
  HotelLodging = 'hotel_lodging',
  LeisureActivities = 'leisure_activities',
  Miscellaneous = 'miscellaneous',
  RestaurantBar = 'restaurant_bar',
  Shop = 'shop',
  SportsFitness = 'sports_fitness',
}

export enum Currency {
  NIM = 'NIM',
  BTC = 'BTC',
  USDC_POLYGON = 'USDC_POLYGON',
  ETH = 'ETH',
  LTC = 'LTC',
  LBTC = 'LBTC',
  XLM = 'XLM',
  XRP = 'XRP',
  DASH = 'DASH',
}

export enum Provider {
  Default = 'DEFAULT',
  DefaultAtm = 'DefaultAtm',
  GoCrypto = 'GoCrypto',
  Kurant = 'Kurant',
  Bluecode = 'Bluecode',
  CryptopaymentLink = 'CryptopaymentLink',
  Edenia = 'Edenia',

  // TODO
  CryptoCR = 'CryptoCR',
}

/* Map Types */
export interface BoundingBox {
  southWest: Point
  northEast: Point
}

export interface Point {
  lat: number
  lng: number
}

export interface EstimatedPosition {
  center: Point
  accuracy: number // in meters
}

export interface Position {
  center: Point
  zoom: number
}

/** UI Types

Since the UI is quite flexible, better to define all cases using types, and we develop the UI from these types.
*/
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
  gmaps_type: string
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

  // We can only have one link. See parseLocation function for more details.
  linkTo?: LocationLink
  url?: string

  // UI Options
  theme: Theme
  bgFullCard: boolean
  bg: string
  providerIcon?: ReturnType<typeof defineAsyncComponent>

  // Provider text
  providerLabel?: string
  providerTooltip?: string

  // Quick getters
  isAtm: boolean
  isShop: boolean
  isDark: boolean
  isLight: boolean
}

// Others types
export enum Issue {
  LOCATION_GONE = 'location_gone',
  MISSING_CURRENCY = 'missing_currency',
  MISSING_NOT_ACCEPTED = 'missing_not_accepted',
  NO_CRYPTO = 'no_crypto',
  OTHER = 'other',
}
