import type { Enums } from './supabase'

type ToPascalCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${Capitalize<T>}${ToPascalCase<U>}` // Handles underscores
    : S extends `${infer T} ${infer U}`
      ? `${Capitalize<T>}${ToPascalCase<U>}` // Handles spaces
      : Capitalize<S> // Capitalize the final part

export const Category: Record<ToPascalCase<Enums<'category_enum'>>, Enums<'category_enum'>> = {
  CarsBikes: 'cars_bikes',
  Cash: 'cash',
  ComputerElectronics: 'computer_electronics',
  Entertainment: 'entertainment',
  FoodDrinks: 'food_drinks',
  HealthBeauty: 'health_beauty',
  HotelLodging: 'hotel_lodging',
  LeisureActivities: 'leisure_activities',
  RestaurantBar: 'restaurant_bar',
  Shop: 'shop',
  SportsFitness: 'sports_fitness',
  Miscellaneous: 'miscellaneous',
}

export type CategoryType = typeof Category[keyof typeof Category]

export const Currency: Record<Enums<'currency_enum'>, Enums<'currency_enum'>> = {
  NIM: 'NIM',
  BTC: 'BTC',
  LBTC: 'LBTC', // Lightning BTC
  USDC_on_POLYGON: 'USDC_on_POLYGON',
  USDT: 'USDT',
  ETH: 'ETH',
  LTC: 'LTC',
  XLM: 'XLM',
  XRP: 'XRP',
  DASH: 'DASH',
  BCH: 'BCH',
  BINANCE_PAY: 'BINANCE_PAY',
}

export type CurrencyType = typeof Currency[keyof typeof Currency]

type OmitKeysWithSlash<T> = {
  [K in keyof T as K extends `${string}/${string}` ? never : K]: T[K];
}
export const Provider: OmitKeysWithSlash<Record<ToPascalCase<Enums<'provider_type'>>, Enums<'provider_type'>>> = {
  DefaultShop: 'DefaultShop',
  DefaultAtm: 'DefaultAtm',
  NAKA: 'NAKA',
  Kurant: 'Kurant',
  Bluecode: 'Bluecode',
  Edenia: 'Edenia',
  BitcoinJungle: 'Bitcoin Jungle',
  Coinmap: 'Coinmap',
  AcceptLightning: 'Accept Lightning',
  Bridge2Bitcoin: 'Bridge2Bitcoin',
  BtcMap: 'BtcMap',
  TheGambia: 'TheGambia',

  // Split banner
  CryptopaymentLink: 'Cryptopayment Link',
  Osmo: 'Osmo',
  Opago: 'Opago',

  GoCrypto: 'GoCrypto',
}

export type ProviderType = typeof Provider[keyof typeof Provider]
