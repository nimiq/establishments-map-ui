import { defineStore } from 'pinia'
import Supercluster from 'supercluster'
import { shallowRef } from 'vue'
import type { Category, Cluster, Currency, Location, LocationClusterParams, LocationClusterSet } from 'types'
import { getClusterMaxZoom, getClusters } from 'database'
import { useLocations } from './locations'
import { DATABASE_ARGS, isBoxWithinBox, parseLocation } from '@/shared'
import { computeCluster } from '@/../shared/compute-cluster'

export const useCluster = defineStore('cluster', () => {
  const { setLocations, getLocations } = useLocations()

  const clusters = shallowRef<Cluster[]>([])

  // All items that are not clustered
  const singles = shallowRef<Location[]>([])

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
    maxZoomFromServer ||= await getClusterMaxZoom(DATABASE_ARGS)
    return zoom > maxZoomFromServer
  }

  const clusterAlgorithm = new Supercluster({ radius: 88 })

  async function getClusterFromClient({ zoom, boundingBox: bbox }: LocationClusterParams): Promise<LocationClusterSet> {
    const locations = await getLocations(bbox)
    return computeCluster(clusterAlgorithm, locations, { zoom, boundingBox: bbox })
  }

  async function getClusterFromDatabase({ zoom, boundingBox }: LocationClusterParams): Promise<LocationClusterSet> {
    const res = await getClusters(DATABASE_ARGS, boundingBox, zoom, parseLocation)
    setLocations(res.singles)
    return res
  }

  async function cluster(params: LocationClusterParams, { categories = [], currencies = [] }: { currencies?: Currency[]; categories?: Category[] }) {
    params.currencies = currencies.sort().join(',')
    params.categories = categories.sort().join(',')
    if (hasMemoizedData(params))
      return

    const { clusters: newClusters, singles: newSingles } = await shouldRunInClient(params)
      ? await getClusterFromClient(params)
      : await getClusterFromDatabase(params)
    memoizedClusters.set(params, { clusters: newClusters, singles: newSingles })

    clusters.value = newClusters
    singles.value = newSingles
  }

  return {
    cluster,
    clusters,
    singles,
  }
})
