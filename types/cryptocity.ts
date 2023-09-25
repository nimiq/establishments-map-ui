import type { MultiPolygon } from '@turf/helpers'
import type { BoundingBox, Point } from './index.ts'

export enum Cryptocity {
  SanJose = 'San Jose',
}

export interface CryptocityData {
  cryptocity: Cryptocity
  name: string
  description: string[]
  url: string
  centroid: Point
  boundingBox: BoundingBox
  count: number
}

export type CryptocityMarker = Map<number /* id of the cluster OR -1 not attached  */, CryptocityData[]>

export interface CryptocityMemoized { area: MultiPolygon; markers: CryptocityMarker }
