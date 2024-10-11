import Supercluster from 'supercluster'
import { toPoint } from './geo-json'
import type { ClusterArea, Point } from '~~/types/map'

export const CLUSTERS_MAX_ZOOM = 17
export const algorithm = (radius: number) => new Supercluster({ radius, maxZoom: CLUSTERS_MAX_ZOOM })

export function computeMarkers<T extends Point>(algorithm: Supercluster, markers: T[], { zoom, boundingBox: bbox }: ClusterArea) {
  const singles: T[] = []
  const clusters: ClusterArea[] = []

  algorithm.load(markers.map(toPoint) as GeoJSON.Feature<GeoJSON.Point, T>[])
  for (const c of algorithm.getClusters([bbox.swLng, bbox.swLat, bbox.neLng, bbox.neLat], zoom)) {
    const count = c.properties.point_count || 1

    if (count > 1) {
      const clusterId = c.properties.cluster_id
      clusters.push({
        id: clusterId,
        lng: c.geometry.coordinates[0] as number,
        lat: c.geometry.coordinates[1] as number,
        count,
        cryptocities: [],
        diameter: Math.max(24, Math.min(48, 0.24 * count + 24)), // TODO Check if this is necessary

        // Compute it lazily
        get expansionZoom() { return algorithm.getClusterExpansionZoom(clusterId) },
      })
    }
    else {
      singles.push(c.properties as T)
    }
  }

  return { clusters, singles }
}
