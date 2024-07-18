/**
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

import type { Cryptocity, CryptocityDatabase } from './cryptocity.ts'
import type { RawLocation } from './location.ts'
import type { BoundingBox, Markers } from './map.ts'

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
  LBTC = 'LBTC', // Lightning BTC
  USDC_on_POLYGON = 'USDC_on_POLYGON',
  ETH = 'ETH',
  LTC = 'LTC',
  XLM = 'XLM',
  XRP = 'XRP',
  DASH = 'DASH',
  BCH = 'BCH',
  BINANCE_PAY = 'BINANCE_PAY',
}

export enum Provider {
  DefaultShop = 'DefaultShop',
  DefaultAtm = 'DefaultAtm',
  NAKA = 'NAKA',
  Kurant = 'Kurant',
  Bluecode = 'Bluecode',
  Edenia = 'Edenia',
  BitcoinJungle = 'Bitcoin Jungle',
  Coinmap = 'Coinmap',
  AcceptLightning = 'Accept Lightning',
  Bridge2Bitcoin = 'Bridge2Bitcoin',
  BtcMap = 'BtcMap',
  TheGambia = 'TheGambia',

  // Split banner
  CryptopaymentLink = 'Cryptopayment Link',
  Osmo = 'Osmo',
  Opago = 'Opago',
}

export enum DatabaseUser {
  Authenticated = 'authenticated',
  Anonymous = 'anonymous',
  Any = 'any',
}

export interface DatabaseArgs {
  url: string
  apikey: string
}

export interface DatabaseAuthArgs extends DatabaseArgs {
  authToken: string
  user: DatabaseUser.Authenticated
}

export interface DatabaseAnonArgs extends DatabaseArgs {
  captchaToken: string
  user: DatabaseUser.Anonymous
}

export interface DatabaseAnyUserArgs extends DatabaseArgs {
  user: DatabaseUser.Any
}

export interface DatabaseAuthenticateUserArgs extends DatabaseArgs {
  auth: {
    email: string
    password: string
  }
}

// Functions that both anon and auth users can call.
// - If user is anon, it is required to pass a captchaToken
// - If user is auth, it is required to pass a authToken
export enum AnonReadDbFunction {
  GetLocations = 'get_locations',
  GetLocation = 'get_location_by_uuid',
  SearchLocations = 'search_locations',
  GetMarkers = 'get_markers',
  GetMaxZoom = 'get_max_zoom_computed_markers_in_server',
  GetCryptocities = 'get_cryptocities',
  GetCryptocityPolygon = 'get_cryptocity_polygon',
}

export enum AnonWriteDbFunction {
  AuthAnonUser = 'auth_anon_user',
}

export type AnonDbFunction =
  | typeof AnonReadDbFunction
  | typeof AnonWriteDbFunction
export const anonDbFunctions: AnonDbFunction = Object.assign(
  {},
  AnonReadDbFunction,
  AnonWriteDbFunction,
)

// Functions that only auth users can call. These functions require an authToken.
export enum AuthWriteDbFunction {
  UpsertRawLocation = 'upsert_location',
  UpsertLocationsWithGMaps = 'upsert_locations_with_gmaps_api',
  DeleteLocation = 'delete_location_by_uuid',
  InsertMarkers = 'insert_markers',
  FlushMarkersTable = 'flush_markers_table',
}

export enum AuthReadDbFunction {
  GetStats = 'get_stats', // TODO Add check in backend
}

export type AuthDbFunction =
  | typeof AuthReadDbFunction
  | typeof AuthWriteDbFunction
export const authDbFunctions: AuthDbFunction = Object.assign(
  {},
  AuthReadDbFunction,
  AuthWriteDbFunction,
)

export enum AnyUserReadDbFunction {
  GetTimestamps = 'get_timestamps',
}

export type AnyUserDbFunction = typeof AnyUserReadDbFunction
export const anyUserDbFunctions: AnyUserDbFunction = Object.assign(
  {},
  AnyUserReadDbFunction,
)

export interface Args {
  [AnonReadDbFunction.GetMarkers]: { zoom: number, boundingBox: BoundingBox }
  [AnonReadDbFunction.GetCryptocities]: {
    boundingBox: BoundingBox
    excludedCities: Cryptocity[]
  }
  [AuthWriteDbFunction.UpsertLocationsWithGMaps]: (Partial<RawLocation> & {
    accepts: RawLocation['accepts']
    place_id?: string
  })[]
  [AuthWriteDbFunction.InsertMarkers]: {
    zoom_level: number
    items: (
      | InsertMarkersSingle
      | InsertMarkersSingleCryptocity
      | InsertMarkersCluster
    )[]
  }
}

export interface Returns {
  [AnonReadDbFunction.GetCryptocities]: CryptocityDatabase[]
  [AnonReadDbFunction.GetMarkers]: Markers
  [AnyUserReadDbFunction.GetTimestamps]: {
    markers: string
    locations: string
    cryptocities: string
  }
  [AuthReadDbFunction.GetStats]: {
    cryptos: number
    locations: number
    providers: number
    providers_count: Record<Provider, number>
    crypto_sells_combinations: Record<string, number>
    crypto_accepts_combinations: Record<string, number>
  }
  [AuthWriteDbFunction.UpsertLocationsWithGMaps]: {
    added: RawLocation[]
    multiples: object[][]
    errors: {
      input: Args[AuthWriteDbFunction.UpsertLocationsWithGMaps]
      error: string
      apiUrl: string
    }[]
  }
  [AnonWriteDbFunction.AuthAnonUser]: { uuid: string, max_age: number }
}

export interface InsertMarkersSingle {
  lat: number
  lng: number
  count: 1
  locationUuid?: string
}
export interface InsertMarkersSingleCryptocity {
  lat: number
  lng: number
  count: 1
  cryptocities: Cryptocity[]
}
export interface InsertMarkersCluster {
  lat: number
  lng: number
  count: number
  expansionZoom: number
  cryptocities: Cryptocity[]
}
