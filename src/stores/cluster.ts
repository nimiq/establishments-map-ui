import { defineStore } from 'pinia'
import type { AnyProps } from 'supercluster'
import Supercluster from 'supercluster'
import { shallowRef } from 'vue'
import { useLocations } from './locations'
import type { Category, Cluster, Currency, Location, LocationClusterParams, LocationClusterSet, Point } from '@/types'
import { getClusterMaxZoom, getClusters } from '@/database'
import { isBoxWithinBox } from '@/shared'

export const useCluster = defineStore('cluster', () => {
  const { setLocations, getLocations } = useLocations()

  const clusters = shallowRef<Cluster[]>([])

  // All items that are not clustered
  const singles = shallowRef<Location[]>([])

  function locationToPoint(location: Location): Supercluster.PointFeature<AnyProps> {
    return { type: 'Feature', geometry: { type: 'Point', coordinates: [location.lng, location.lat] }, properties: { location } }
  }

  /*
    With memoziation, we reduce redundant calculations/requests and optimizes user map interactions to optimize map performance:
      - `memoizedCluster` stores clusters, bounding boxes, and filters by zoom level.
      - Before re-clustering, we check for existing data matching the current zoom, bounding box, and filters.
      - If a match is found, we reuse stored clusters; otherwise, new clusters are computed and stored.
  */
  const memoizedClusters = new Map<LocationClusterParams, LocationClusterSet>()

  function hasMemoizedData({ boundingBox, zoom, categories, currencies }: LocationClusterParams) {
    for (const [{ boundingBox: bboxMemo, zoom: zoomMemo, categories: categoriesMemo, currencies: currenciesMemo }, locationsClustersSet] of memoizedClusters.entries()) {
      const hasSameParams = zoomMemo === zoom && categoriesMemo === categories && currenciesMemo === currencies
      if (!isBoxWithinBox(boundingBox, bboxMemo) || !hasSameParams)
        continue
      clusters.value = locationsClustersSet.clusters
      singles.value = locationsClustersSet.singles
      return true
    }
    return false
  }

  let maxZoomFromServer
  async function shouldRunInClient({ zoom, categories, currencies }: LocationClusterParams): Promise<boolean> {
    // We cannot compute all clusters combinations in the server, if user has selected currencies or categories
    // we need to compute the clusters in the client
    if (currencies || categories)
      return true
    maxZoomFromServer ||= await getClusterMaxZoom()
    return zoom > maxZoomFromServer
  }

  const clusterAlgorithm = new Supercluster({ radius: 88 })

  async function getClusterFromClient({ zoom, boundingBox: bbox }: LocationClusterParams): Promise<[Cluster[], Location[]]> {
    const newSingles: Location[] = []
    const newClusters: Cluster[] = []

    const locations = await getLocations(bbox)

    // Clusters are computed in the client
    clusterAlgorithm.load(locations.map(locationToPoint))

    for (const c of clusterAlgorithm.getClusters([bbox.swLng, bbox.swLat, bbox.neLng, bbox.neLat], zoom)) {
      const center: Point = { lng: c.geometry.coordinates[0], lat: c.geometry.coordinates[1] }
      const count = c.properties.point_count || 1
      const clusterId = c.properties.cluster_id

      if (count > 1) {
        newClusters.push({
          id: clusterId,
          center,
          count,

          // Compute it lazily
          get expansionZoom() { return clusterAlgorithm.getClusterExpansionZoom(clusterId) },
        })
      }
      else {
        newSingles.push(c.properties.location)
      }
    }

    return [newClusters, newSingles]
  }

  async function getClusterFromDatabase({ zoom, boundingBox }: LocationClusterParams): Promise<[Cluster[], Location[]]> {
    const [clusters, singles] = await getClusters(zoom, boundingBox)
    setLocations(singles)
    return [clusters, singles]
  }

  async function cluster(params: LocationClusterParams, { categories = [], currencies = [] }: { currencies?: Currency[]; categories?: Category[] }) {
    params.currencies = currencies.sort().join(',')
    params.categories = categories.sort().join(',')
    if (hasMemoizedData(params))
      return
    [clusters.value, singles.value] = await shouldRunInClient(params)
      ? await getClusterFromClient(params)
      : await getClusterFromDatabase(params)
    memoizedClusters.set(params, { clusters: clusters.value, singles: singles.value })
  }

  return {
    cluster,
    clusters,
    singles,
  }
})
