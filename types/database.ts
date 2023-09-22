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

import type { RawLocation } from './location.ts'

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

export interface DatabaseArgs {
  url: string
  apikey: string
  token?: string
}

export interface DatabaseAuthArgs extends DatabaseArgs {
  auth: {
    email: string
    password: string
  }
}

export enum DbWriteFunction {
  UpsertRawLocation = 'upsert_location',
  UpsertLocationsWithGMaps = 'upsert_locations_with_gmaps_api',
  DeleteLocation = 'delete_location_by_uuid',
  InsertLocationsClustersSet = 'insert_locations_clusters_set',
  FlushClustersTable = 'flush_clusters_table',
  AuthAnonUser = 'auth_anon_user',
}

export enum DbReadFunction {
  GetLocations = 'get_locations',
  GetLocation = 'get_location_by_uuid',
  SearchLocations = 'search_locations',
  GetLocationsClustersSet = 'get_locations_clusters_set',
  GetMaxZoom = 'get_max_zoom_computed_clusters_in_server',
  GetStats = 'get_stats',
  GetCryptocityPolygon = 'get_cryptocity_polygon',
}

export interface InsertLocationsClustersSetParamsItem {
  lat: number
  lng: number
  count: number
  locationUuid?: string // If count is 1
  expansionZoom?: number // If count is greater 1
}

export interface InsertLocationsClustersSetParams {
  zoom_level: number
  items: InsertLocationsClustersSetParamsItem[]
}

// ------ Return types --------

export interface DatabaseStatistics {
  cryptos: number
  locations: number
  providers: number
  providers_count: Record<Provider, number>
  crypto_sells_combinations: Record<string, number>
  crypto_accepts_combinations: Record<string, number>
}

export interface InsertWithPlaceIdArgs extends Partial<RawLocation> {
  accepts: RawLocation['accepts']
  place_id?: string
}

// The return structure of the PL/pgSQL function.
export interface InsertWithPlaceIdResponse {
  added: RawLocation[]
  multiples: object[][]
  errors: { input: InsertWithPlaceIdArgs; error: string; apiUrl: string }[]
}
