import Supercluster from 'supercluster'
import type { Cluster, ClusterArea, ComputedClusterSet } from '../types/map.ts'
import type { Location } from '../types/location.ts'
import { toPoint } from './index.ts'

export const CLUSTERS_MAX_ZOOM = 17
export const algorithm = (radius: number) => new Supercluster({ radius, maxZoom: CLUSTERS_MAX_ZOOM })

export function computeCluster(algorithm: Supercluster, locations: Location[], { zoom, boundingBox: bbox }: ClusterArea): ComputedClusterSet {
  const singles: Location[] = []
  const clusters: Cluster[] = []

  // Clusters are computed in the client
  algorithm.load(locations.map(toPoint) as GeoJSON.Feature<GeoJSON.Point, Location>[])

  for (const c of algorithm.getClusters([bbox.swLng, bbox.swLat, bbox.neLng, bbox.neLat], zoom)) {
    const count = c.properties.point_count || 1

    if (count > 1) {
      const clusterId = c.properties.cluster_id
      clusters.push({
        id: clusterId,
        lng: c.geometry.coordinates[0],
        lat: c.geometry.coordinates[1],
        count,

        // Compute it lazily
        get expansionZoom() { return algorithm.getClusterExpansionZoom(clusterId) },
      })
    }
    else {
      singles.push(c.properties as Location)
    }
  }

  return {
    clusters,
    singles,
  }
}
