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
}

export interface DatabaseAuthArgs extends DatabaseArgs {
  auth: {
    email: string
    password: string
  }
}

export enum DbWriteFunction {
  Insert = 'insert_location',
  InsertRaw = 'insert_raw_location',
  InsertRawBulk = 'insert_locations',
  DeleteLocation = 'delete_location_by_uuid',
  InsertLocationsClustersSet = 'insert_locations_clusters_set',
  FlushClustersTable = 'flush_clusters_table',
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
