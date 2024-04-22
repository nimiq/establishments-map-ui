import { Banner, Category, Currency, Provider } from "types";

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

export function getCategoryIcon(category: Category){
  const iconName = categoryIconCatalog[category]
  return iconName;
}

const cryptoIconCategory: Record<Currency, string> = {
  [Currency.NIM]: 'i-nimiq:logos-nimiq',
  [Currency.BTC]: 'i-cryptocurrency-color:btc',
  [Currency.ETH]: 'i-cryptocurrency-color:eth',
  [Currency.DASH]: 'i-cryptocurrency-color:dash',
  [Currency.LTC]: 'i-cryptocurrency-color:ltc',
  [Currency.BCH]: 'i-cryptocurrency-color:bch',
  [Currency.LBTC]: 'i-nimiq:logos-lbtc',
  [Currency.USDC_on_POLYGON]: 'i-cryptocurrency-color:usdc',
  [Currency.XLM]: 'i-cryptocurrency-color:xlm',
  [Currency.XRP]: 'i-cryptocurrency-color:xrp',
  [Currency.BINANCE_PAY]: '' // TODO Add tooltip
} 

export function getCurrencyIcon(currency: Currency){
  const iconName = cryptoIconCategory[currency]
  return iconName;
}
 
const bannerIconCategory: Record<Banner, string> = {
  [Provider.Edenia]: 'i-providers:edenia',
  [Provider.Bluecode]: 'i-providers:bluecode',
  [Provider.CryptopaymentLink]: 'i-providers:cryptopaymentlink',
  [Provider.Kurant]: 'i-providers:kurant',
  [Provider.NAKA]: 'i-providers:naka',
  'Nimiq-Pay': 'i-nimiq:logos-nimiq-pay',
  DefaultAtm: '',
  None: '',
}

export function getBannerIcon(provider: Banner){
  const iconName = bannerIconCategory[provider]
  return iconName;
}
