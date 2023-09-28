import type { FeatureCollection, MultiPolygon } from '@turf/helpers'

export enum Cryptocity {
  SanJose = 'San Jose',
}

// Information that we get from the database
export interface CryptocityDatabase {
  city: Cryptocity
  lng: number
  lat: number
  shape: FeatureCollection<MultiPolygon>
  locationsCount: number
}

// Information that we get from the assets
export interface CryptocityUI {
  name: string // This is the name we use in the UI. Not the same as city.
  description: string[]
  url: string
}

export interface CryptocityData extends CryptocityDatabase, CryptocityUI {}
