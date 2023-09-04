import type { Location } from './location'

export interface BoundingBox {
  swLat: number
  swLng: number
  neLat: number
  neLng: number
}

export interface Point {
  lat: number
  lng: number
}

export interface EstimatedMapPosition {
  center: Point
  accuracy: number // in meters
}

export interface MapPosition {
  center: Point
  zoom: number
}

export interface Cluster {
  id: number // Used for optimization in the rendering process
  center: Point
  expansionZoom: number // The new zoom when the cluster is expanded
  count: number
}

export interface LocationClusterParams {
  boundingBox: BoundingBox
  zoom: number
  categories?: string
  currencies?: string
}

export interface LocationClusterSet {
  clusters: Cluster[]
  singles: Location[]
}
