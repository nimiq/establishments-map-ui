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
  RestaurantBar = 'restaurant_bar',
  Shop = 'shop',
  SportsFitness = 'sports_fitness',
  Miscellaneous = 'miscellaneous',
}

export enum Currency {
  NIM = 'NIM',
  BTC = 'BTC',
  USDC_on_POLYGON = 'USDC_on_POLYGON',
  ETH = 'ETH',
  LTC = 'LTC',
  LBTC = 'LBTC',
  XLM = 'XLM',
  XRP = 'XRP',
  DASH = 'DASH',
  BCH = 'BCH',
}

export enum Provider {
  DefaultShop = 'DefaultShop',
  DefaultAtm = 'DefaultAtm',
  GoCrypto = 'GoCrypto',
  Kurant = 'Kurant',
  Bluecode = 'Bluecode',
  CryptopaymentLink = 'Cryptopayment Link',
  Edenia = 'Edenia',
}

/* Map Types */
export interface BoundingBox {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
}

export interface Point {
  lat: number
  lng: number
}

export interface EstimatedMapPosition {
  center: Point
  accuracy: number // in meters
}

export interface MapPosition {
  center: Point
  zoom: number
}

export interface Cluster {
  center: Point
  clusterId: number
  count: number
}

export interface MemoizedCluster {
  boundingBox: BoundingBox
  clusters: Cluster[]
  singles: Location[]
  categories: Category[]
  currencies: Currency[]
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

// Autocomplete types
export enum AutocompleteStatus {
  Initial = 'initial',
  Loading = 'loading',
  WithResults = 'with-results',
  NoResults = 'no-results',
}

export interface SearchFor {
  searchForLocation?: boolean
  searchForRegions?: boolean
}

export enum SuggestionType {
  Location = 'location',
  Category = 'category',
  Currency = 'currency',
  GoogleLocation = 'googleLocation',
  Region = 'regions',
}

export type Suggestion = {
  label: string
} & ({
  id: string // Google Place ID
  type: SuggestionType.GoogleLocation | SuggestionType.Region
  matchedSubstrings: google.maps.places.AutocompletePrediction['matched_substrings']
} | {
  id: Category
  type: SuggestionType.Category
  matchedSubstrings: undefined
} | {
  id: Currency
  type: SuggestionType.Currency
  matchedSubstrings: undefined
} | {
  id: string // Location UUID
  type: SuggestionType.Location
  matchedSubstrings: undefined
})

// Others types
export enum Issue {
  LOCATION_GONE = 'location_gone',
  MISSING_CURRENCY = 'missing_currency',
  MISSING_NOT_ACCEPTED = 'missing_not_accepted',
  NO_CRYPTO = 'no_crypto',
  OTHER = 'other',
}
