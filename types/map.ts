import type { MultiPolygon } from '@turf/helpers'
import type { Location } from './location.ts'

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

export interface LocationClusterSet {
  memoizedClusters: Cluster[]
  memoizedSingles: Location[]

  // The different areas where the clusters have been already computed
  memoizedArea: MultiPolygon
}

export interface ComputedClusterSet {
  clusters: Cluster[]
  singles: Location[]
}
