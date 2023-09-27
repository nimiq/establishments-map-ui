import { getClusterMaxZoom, getClusters } from 'database'
import { defineStore, storeToRefs } from 'pinia'
import type { Cluster, ComputedClusterSet, Location, LocationClusterParams, LocationClusterSet } from 'types'
import { CLUSTERS_MAX_ZOOM, addBBoxToArea, algorithm, bBoxIsWithinArea, getItemsWithinBBox, toMultiPolygon } from 'shared'
import { computed, ref, shallowRef } from 'vue'
import { useLocations } from './locations'
import { useFilters } from './filters'
import { useMap } from './map'
import { getAnonDatabaseArgs, parseLocation } from '@/shared'
import { computeCluster } from '@/../shared/compute-cluster'
import type { ExpiringValue } from '@/composables/useExpiringStorage'
import { useExpiringStorage } from '@/composables/useExpiringStorage'

export const useMarkers = defineStore('markers', () => {
  const { setLocations, getLocations } = useLocations()
  const { visitedAreas } = storeToRefs(useLocations())
  const { filterLocations, filtersToString } = useFilters()
  const { zoom, boundingBox } = storeToRefs(useMap())
  const loaded = ref(false)

  /*
  With memoziation, we reduce redundant calculations/requests and optimizes user map interactions to optimize map performance:
  - `memoizedCluster` stores clusters, bounding boxes, and filters by zoom level.
  - Before re-clustering, we check for existing data matching the current zoom, bounding box, and filters.
  - If a match is found, we reuse stored clusters; otherwise, new clusters are computed and stored.
  */
  const { payload: memoized } = useExpiringStorage('memoized_markers',
    {
      expiresIn: 7 * 24 * 60 * 60 * 1000,
      getValue: () => new Map<LocationClusterParams, LocationClusterSet>(),
      serializer: {
        read: (str) => {
          const obj = JSON.parse(str)
          const value = new Map<LocationClusterParams, LocationClusterSet>()
          for (const key in obj.value) {
            const { zoom, categories, currencies } = JSON.parse(key)
            value.set({ zoom, categories, currencies }, obj[key])
          }
          return { value, expires: obj.expires }
        },
        write: (value: ExpiringValue<Map<LocationClusterParams, LocationClusterSet>>) => {
          const obj: Record<string, LocationClusterSet> = {}
          for (const [key, val] of value.value.entries())
            obj[JSON.stringify(key)] = val
          return JSON.stringify({ value: obj, expires: value.expires })
        },
      },
    })

  /**
   * The clusters and singles are computed from the memoized clusters and singles. For each zoom level and each filter combination,
   * we store the clusters and singles.
   */
  const clusters = shallowRef<Cluster[]>([])
  const clustersInView = computed(() => boundingBox.value ? getItemsWithinBBox(clusters.value, boundingBox.value) : [])
  const singles = shallowRef<Location[]>([])
  const singlesInView = computed(() => boundingBox.value ? getItemsWithinBBox(filterLocations(singles.value), boundingBox.value) : [])

  function getKey({ zoom, categories, currencies }: LocationClusterParams): LocationClusterParams | undefined {
    for (const key of memoized.value.keys()) {
      if (key.zoom === zoom && key.categories === categories && key.currencies === currencies)
        return key
    }
  }

  function getMemoized() {
    const obj = { zoom: zoom.value, ...filtersToString() }
    // If the key already exists, we need to reference the existing key by memory. Creating a new object, even with the same values, will not work.
    const key = getKey(obj) || obj

    const item: LocationClusterSet | undefined = memoized.value.get(key)

    // If the item exists and the bounding box is within the memoized area, we can reuse the memoized item and there is no need to re-cluster
    const needsToUpdate = !item || !boundingBox.value || !bBoxIsWithinArea(boundingBox.value, item.memoizedArea)

    // Update the memoized item if it exists
    if (!needsToUpdate) {
      clusters.value = item.memoizedClusters
      singles.value = item.memoizedSingles
    }

    return { key, item, needsToUpdate }
  }

  function needsToUpdate() {
    // We only need to re-cluster if we are zoomed out enough to see clusters
    return (zoom.value > CLUSTERS_MAX_ZOOM)
      ? !bBoxIsWithinArea(boundingBox.value!, visitedAreas.value) // If we already visited this area, no need to re-cluster
      : getMemoized().needsToUpdate
  }

  const { init: initMaxZoom, payload: maxZoomFromServer } = useExpiringStorage('max_zoom_from_server', { expiresIn: 7 * 24 * 60 * 60 * 1000, getAsyncValue: async () => getClusterMaxZoom(await getAnonDatabaseArgs()) })

  async function shouldRunInClient({ zoom, categories, currencies }: LocationClusterParams): Promise<boolean> {
    // We cannot compute all clusters combinations in the server, if user has selected currencies or categories
    // we need to compute the clusters in the client
    if (currencies || categories)
      return true

    await initMaxZoom() // Get the value from the server if it doesn't exist
    return zoom > maxZoomFromServer.value
  }

  async function getClusterFromClient(): Promise<ComputedClusterSet> {
    const locations = await getLocations(boundingBox.value!)
    return computeCluster(algorithm(80), locations, { boundingBox: boundingBox.value!, zoom: zoom.value })
  }

  async function getClusterFromDatabase(): Promise<ComputedClusterSet> {
    const res = await getClusters(await getAnonDatabaseArgs(), boundingBox.value!, zoom.value, parseLocation)
    setLocations(res.singles)
    res.clusters.forEach(c => c.diameter = Math.max(24, Math.min(48, 0.24 * c.count + 24)))
    return res
  }

  async function cluster() {
    if (zoom.value > CLUSTERS_MAX_ZOOM) {
      // We are too zoomed in, no need to cluster
      singles.value = await getLocations(boundingBox.value!)
      clusters.value = []
      return
    }

    const { item, key, needsToUpdate } = getMemoized()

    if (!needsToUpdate) {
      loaded.value = true
      return
    }

    const { clusters: newClusters, singles: newSingles } = await shouldRunInClient(key)
      ? await getClusterFromClient()
      : await getClusterFromDatabase()

    if (item) {
      item.memoizedArea = addBBoxToArea(boundingBox.value!, item.memoizedArea)
      item.memoizedClusters.push(...newClusters.filter(c => item.memoizedClusters.every(i => i.id !== c.id)))
      item.memoizedSingles.push(...newSingles.filter(s => item.memoizedSingles.every(i => i.uuid !== s.uuid)))
    }
    else {
      memoized.value.set(key, {
        memoizedArea: toMultiPolygon(boundingBox.value!).geometry,
        memoizedClusters: newClusters,
        memoizedSingles: newSingles,
      })
    }

    clusters.value = newClusters
    singles.value = newSingles

    loaded.value = true
  }

  return {
    memoized,
    cluster,
    clusters,
    singles,
    clustersInView,
    singlesInView,
    needsToUpdate,
    loaded,
  }
})
