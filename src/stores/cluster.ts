import { getClusterMaxZoom, getClusters } from 'database'
import { defineStore } from 'pinia'
import Supercluster from 'supercluster'
import type { Category, Cluster, ClusterArea, ComputedClusterSet, Currency, Location, LocationClusterParams, LocationClusterSet } from 'types'
import { shallowRef } from 'vue'
import { addBBoxToArea, bBoxIsWithinArea, toMultiPolygon } from 'shared'
import { useLocations } from './locations'
import { DATABASE_ARGS, parseLocation } from '@/shared'
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
  const memoized = new Map<LocationClusterParams, LocationClusterSet>()

  function getMemoized({ zoom, categories, currencies }: LocationClusterParams): [LocationClusterParams, LocationClusterSet | undefined] {
    for (const key of memoized.keys()) {
      if (key.zoom === zoom && key.categories === categories && key.currencies === currencies)
        return [key, memoized.get(key)!]
    }
    const newKey = {
      zoom,
      categories,
      currencies,
    }
    return [newKey, undefined]
  }

  let maxZoomFromServer: number | undefined
  async function shouldRunInClient({ zoom, categories, currencies }: LocationClusterParams): Promise<boolean> {
    // We cannot compute all clusters combinations in the server, if user has selected currencies or categories
    // we need to compute the clusters in the client
    if (currencies || categories)
      return true
    maxZoomFromServer ||= await getClusterMaxZoom(DATABASE_ARGS)
    return zoom > maxZoomFromServer
  }

  const clusterAlgorithm = new Supercluster({ radius: 88 })

  async function getClusterFromClient(clusterArea: ClusterArea): Promise<ComputedClusterSet> {
    const locations = await getLocations(clusterArea.boundingBox)
    return computeCluster(clusterAlgorithm, locations, clusterArea)
  }

  async function getClusterFromDatabase({ zoom, boundingBox }: ClusterArea): Promise<ComputedClusterSet> {
    const res = await getClusters(DATABASE_ARGS, boundingBox, zoom, parseLocation)
    setLocations(res.singles)
    return res
  }

  async function cluster(clusterArea: ClusterArea, { categories = [], currencies = [] }: { currencies?: Currency[]; categories?: Category[] }) {
    const { zoom, boundingBox } = clusterArea
    const [key, item] = getMemoized({ zoom, categories: categories.sort().join(','), currencies: currencies.sort().join(',') })

    if (item && bBoxIsWithinArea(boundingBox, item.memoizedArea)) {
      clusters.value = item.memoizedClusters
      singles.value = item.memoizedSingles
      return
    }

    const { clusters: newClusters, singles: newSingles } = await shouldRunInClient(key)
      ? await getClusterFromClient(clusterArea)
      : await getClusterFromDatabase(clusterArea)

    const newItem: LocationClusterSet = {
      memoizedArea: item ? addBBoxToArea(boundingBox, item.memoizedArea) : toMultiPolygon(boundingBox).geometry,
      memoizedClusters: newClusters,
      memoizedSingles: newSingles,
    }
    memoized.set(key, newItem)

    clusters.value = newClusters
    singles.value = newSingles
  }

  return {
    cluster,
    clusters,
    singles,
  }
})
