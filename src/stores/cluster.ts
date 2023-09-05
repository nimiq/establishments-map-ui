import { getClusterMaxZoom, getClusters } from 'database'
import { defineStore } from 'pinia'
import Supercluster from 'supercluster'
import type { Category, ClusterArea, ComputedClusterSet, Currency, LocationClusterParams, LocationClusterSet } from 'types'
import { addBBoxToArea, bBoxIsWithinArea, toMultiPolygon } from 'shared'
import { computed, shallowRef } from 'vue'
import { useLocations } from './locations'
import { DATABASE_ARGS, parseLocation } from '@/shared'
import { computeCluster } from '@/../shared/compute-cluster'

export const useCluster = defineStore('cluster', () => {
  const { setLocations, getLocations } = useLocations()

  /*
    With memoziation, we reduce redundant calculations/requests and optimizes user map interactions to optimize map performance:
      - `memoizedCluster` stores clusters, bounding boxes, and filters by zoom level.
      - Before re-clustering, we check for existing data matching the current zoom, bounding box, and filters.
      - If a match is found, we reuse stored clusters; otherwise, new clusters are computed and stored.
  */
  const memoized = shallowRef(new Map<LocationClusterParams, LocationClusterSet>())
  const active = shallowRef<LocationClusterSet>()

  function getKey({ zoom, categories, currencies }: LocationClusterParams): LocationClusterParams | undefined {
    for (const key of memoized.value.keys()) {
      if (key.zoom === zoom && key.categories === categories && key.currencies === currencies)
        return key
    }
  }

  function getMemoized({ zoom, categories, currencies }: LocationClusterParams): { key: LocationClusterParams; item: LocationClusterSet | undefined } {
    const key = getKey({ zoom, categories, currencies }) || { zoom, categories, currencies }
    return { key, item: memoized.value.get(key) }
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
    const { key, item } = getMemoized({ zoom, categories: categories.sort().join(','), currencies: currencies.sort().join(',') })

    if (item && bBoxIsWithinArea(boundingBox, item.memoizedArea)) {
      active.value = memoized.value.get(key)
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
    memoized.value.set(key, newItem)
    active.value = memoized.value.get(key)
  }

  return {
    cluster,
    clusters: computed(() => active.value?.memoizedClusters || []),
    singles: computed(() => active.value?.memoizedSingles || []),
  }
})
