import type Supercluster from 'supercluster'
import type { Cluster, ClusterArea, ComputedClusterSet, Location, Point } from 'types'
import { toPoint } from './'

export function computeCluster(algorithm: Supercluster, locations: Location[], { zoom, boundingBox: bbox }: ClusterArea): ComputedClusterSet {
  const singles: Location[] = []
  const clusters: Cluster[] = []

  // Clusters are computed in the client
  algorithm.load(locations.map(toPoint) as GeoJSON.Feature<GeoJSON.Point, Location>[])

  for (const c of algorithm.getClusters([bbox.swLng, bbox.swLat, bbox.neLng, bbox.neLat], zoom)) {
    const center: Point = { lng: c.geometry.coordinates[0], lat: c.geometry.coordinates[1] }
    const count = c.properties.point_count || 1
    const clusterId = c.properties.cluster_id

    if (count > 1) {
      clusters.push({
        id: clusterId,
        center,
        count,

        // Compute it lazily
        get expansionZoom() { return algorithm.getClusterExpansionZoom(clusterId) },
      })
    }
    else {
      singles.push(c.properties.location)
    }
  }

  return {
    clusters,
    singles,
  }
}
