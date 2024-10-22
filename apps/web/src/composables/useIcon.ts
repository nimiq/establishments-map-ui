import { Category, Currency } from 'types'

// @unocss-include

const categoryIconCatalog: Record<Category, string> = {
  [Category.CarsBikes]: 'i-nimiq:front-car',
  [Category.Cash]: 'i-nimiq:cash',
  [Category.ComputerElectronics]: 'i-nimiq:screen-monitor',
  [Category.Entertainment]: 'i-nimiq:cinema-tickets',
  [Category.FoodDrinks]: 'i-nimiq:burger',
  [Category.HealthBeauty]: 'i-nimiq:health-cross',
  [Category.HotelLodging]: 'i-nimiq:bed',
  [Category.LeisureActivities]: 'i-nimiq:racket-sport',
  [Category.Miscellaneous]: 'i-nimiq:question-mark',
  [Category.RestaurantBar]: 'i-nimiq:fork-knife',
  [Category.Shop]: 'i-nimiq:shopping-bag',
  [Category.SportsFitness]: 'i-nimiq:basketball',
}

export function getCategoryIcon(category: Category) {
  const iconName = categoryIconCatalog[category]
  return iconName
}

const cryptoIconCategory: Partial<Record<Currency, string>> = {
  [Currency.NIM]: 'i-nimiq:logos-nimiq',
  [Currency.BTC]: 'i-cryptocurrency-color:btc scale-116 mr-2',
  [Currency.ETH]: 'i-cryptocurrency-color:eth',
  [Currency.DASH]: 'i-cryptocurrency-color:dash',
  [Currency.LTC]: 'i-cryptocurrency-color:ltc',
  [Currency.BCH]: 'i-cryptocurrency-color:bch',
  [Currency.LBTC]: 'i-nimiq:logos-lightning-bitcoin scale-128 mr-2',
  [Currency.USDC_on_POLYGON]: 'i-cryptocurrency-color:usdc',
  [Currency.XLM]: 'i-cryptocurrency-color:xlm',
  [Currency.XRP]: 'i-cryptocurrency-color:xrp',
  [Currency.USDT]: 'i-cryptocurrency-color:usdt',
}

export function getCurrencyIcon(currency: Currency) {
  const iconName = cryptoIconCategory[currency]
  return iconName
}
