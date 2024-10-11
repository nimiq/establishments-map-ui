import type { FeatureCollection, MultiPolygon } from 'geojson'

// TODO Move this to an enum
export enum Cryptocity {
  SanJose = 'San_Jose',
  Ljubljana = 'Ljubljana',
  Mannheim = 'Mannheim',
  Banjul = 'Banjul',
  Vienna = 'Vienna',
  Berlin = 'Berlin',
  Munich = 'Munich',
  Montreal = 'Montreal',
  Zurich = 'Zurich',
  MexicoCity = 'Mexico_City',
  GuatemalaCity = 'Guatemala_City',
}

// Information that we get from the database
export interface CryptocityDatabase {
  city: Cryptocity
  lng: number
  lat: number
  shape: FeatureCollection<MultiPolygon>
  locationsCount: number
  url: string
  showCardAtZoom: number // The zoom level at which the card is not shown in the cluster but on the controls
}

// Information that we get from the assets
export interface CryptocityUI {
  name: string // This is the name we use in the UI. Not the same as city.
  description: string[]
}

export interface CryptocityData extends CryptocityDatabase, CryptocityUI { }
