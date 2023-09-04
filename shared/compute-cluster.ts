import type { AnyProps } from 'supercluster'
import type Supercluster from 'supercluster'
import type { Cluster, Location, LocationClusterParams, LocationClusterSet, Point } from 'types'

function locationToPoint(location: Location): Supercluster.PointFeature<AnyProps> {
  return { type: 'Feature', geometry: { type: 'Point', coordinates: [location.lng, location.lat] }, properties: { location } }
}

export function computeCluster(algorithm: Supercluster, locations: Location[], { zoom, boundingBox: bbox }: LocationClusterParams): LocationClusterSet {
  const singles: Location[] = []
  const clusters: Cluster[] = []

  // Clusters are computed in the client
  algorithm.load(locations.map(locationToPoint))

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
