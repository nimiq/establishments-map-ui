import { getExtra } from './locations'
import { Currency, type Location, Provider } from '@/types'

export const locations: Partial<Record<Provider, Location>> = {
  [Provider.DefaultAtm]: {
    uuid: '1',
    name: 'ATM with no rating',
    address: 'This is suppose a long address. This is weird case since ',
    accepts: [Currency.BTC, Currency.NIM, Currency.ETH],
    gmaps_types: ['stadium'],
    lat: 1,
    lng: 1,
    gmaps: 'https://goo.gl/maps/ujJkv9DFuPfkwqat9',
    photo: 'https://images.unsplash.com/photo-1646491946169-76e0668b8b3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    ...getExtra(Provider.DefaultAtm, [Currency.BTC, Currency.NIM, Currency.ETH]),
  },
}
