import { Category, Currency, Issue } from 'types'

export function translateCategory(category: Category) {
  switch (category) {
    case Category.CarsBikes: return i18n.t('Cars & Bikes')
    case Category.Cash: return i18n.t('Cash')
    case Category.ComputerElectronics: return i18n.t('Computer & Electronics')
    case Category.Entertainment: return i18n.t('Entertainment')
    case Category.FoodDrinks: return i18n.t('Food & Drinks')
    case Category.HealthBeauty: return i18n.t('Health & Beauty')
    case Category.HotelLodging: return i18n.t('Hotel & Lodging')
    case Category.LeisureActivities: return i18n.t('Leisure Activities')
    case Category.Miscellaneous: return i18n.t('Miscellaneous')
    case Category.RestaurantBar: return i18n.t('Restaurant & Bar')
    case Category.Shop: return i18n.t('Shop')
    case Category.SportsFitness: return i18n.t('Sports & Fitness')
    default:
      console.error(`Translation for category ${category} is missing`)
      return i18n.t('Miscellaneous')
  }
}

export function translateIssue(issue: Issue) {
  switch (issue) {
    case Issue.LOCATION_GONE: return i18n.t('Location gone')
    case Issue.MISSING_CURRENCY: return i18n.t('Currency missing')
    case Issue.MISSING_NOT_ACCEPTED: return i18n.t('Currency not accepted')
    case Issue.NO_CRYPTO: return i18n.t('No crypto')
    case Issue.OTHER:
    default:
      return i18n.t('Other')
  }
}

export function translateCurrency(currency: Currency) {
  switch (currency) {
    case Currency.BTC: return 'Bitcoin'
    case Currency.ETH: return 'Ethereum'
    case Currency.NIM: return 'Nimiq'
    case Currency.USDC_on_POLYGON: return i18n.t('USDC on POLYGON')
    case Currency.BINANCE_PAY: return i18n.t('Binance Pay')
    case Currency.BCH: return 'Bitcoin Cash'
    case Currency.DASH: return 'Dash'
    case Currency.LTC: return 'Litecoin'
    case Currency.LBTC: return 'Lightning Bitcoin'
    case Currency.XLM: return 'Stellar'
    case Currency.XRP: return 'Ripple'
  }
}
