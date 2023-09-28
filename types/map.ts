import type { Feature, MultiPolygon } from '@turf/helpers'
import type { Location } from './location.ts'
import type { Cryptocity } from './cryptocity.ts'

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
  lng: number
  lat: number
  expansionZoom: number // The new zoom when the cluster is expanded
  count: number
  diameter: number
  cryptocities: Cryptocity[]
}

export interface ClusterArea {
  zoom: number
  boundingBox: BoundingBox
}

export interface LocationClusterParams {
  zoom: number
  categories?: string
  currencies?: string
}

export interface Markers {
  clusters: Cluster[]
  singles: Location[]
}

export interface MemoizedMarkers extends Markers {
  // The different areas where the clusters have been already computed
  area: Feature<MultiPolygon>
}
