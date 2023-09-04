export enum CurrencyOption {
  'All currencies' = 'All currencies',
  'CPL' = 'CPL',
  'BTC' = 'BTC',
  'NIM' = 'NIM',
  'BTC & NIM' = 'BTC & NIM',
}

export interface Establishment {
  id?: number
  uuid: string
  name: string
  address: string
  category: string
  gmapstype?: string[]
  lat: number
  lng: number
  provider: string
  accepts: string[]
  sells: string[]
  rating?: number
  facebook?: string
  instagram?: string
  gmaps?: string
  photo?: string
  gmaps_place_id?: string
}
