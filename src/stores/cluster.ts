import { defineStore, storeToRefs } from 'pinia'
import type { AnyProps } from 'supercluster'
import Supercluster from 'supercluster'
import { shallowRef } from 'vue'
import { useFilters } from './filters'
import type { BoundingBox, Cluster, Location, MemoizedCluster, Point } from '@/types'

export const useCluster = defineStore('cluster', () => {
  const { selectedCategories, selectedCurrencies } = storeToRefs(useFilters())

  const clusters = shallowRef<Cluster[]>([])

  // All items that are not clustered
  const singles = shallowRef<Location[]>([])

  const BASE_RADIUS = 140 // This is the max cluster radius at zoom level 0
  const DECAY_FACTOR = 1.05 // You can adjust this to change how fast the radius decreases

  function locationToPoint(location: Location): Supercluster.PointFeature<AnyProps> {
    return { type: 'Feature', geometry: { type: 'Point', coordinates: [location.lng, location.lat] }, properties: { location } }
  }

  /*
    With memoziation, we reduce redundant calculations and optimizes user map interactions to optimize map performance:
      - `memoizedCluster` stores clusters, bounding boxes, and filters by zoom level.
      - Before re-clustering, we check for existing data matching the current zoom, bounding box, and filters.
      - If a match is found, we reuse stored clusters; otherwise, new clusters are computed and stored.
  */
  const memoizedClusters = new Map<number, MemoizedCluster[]>()

  const clusterAlgorithm = shallowRef<Supercluster>()

  function cluster(locations: Location[], { neLat, neLng, swLat, swLng }: BoundingBox, zoom: number) {
    const existingData = memoizedClusters.get(zoom)

    if (existingData) {
      const toStr = (arr: string[]) => JSON.stringify(arr.sort())
      const categoriesStr = toStr(selectedCategories.value)
      const currenciesStr = toStr(selectedCurrencies.value)
      for (const { boundingBox: { neLat: memNeLat, neLng: memNeLng, swLat: memSwLat, swLng: memSwLng }, clusters: memoizedCluster, categories, currencies } of existingData) {
        const isWithinBoundingBox = neLng > swLng
          ? neLat <= memNeLat && neLng <= memNeLng && swLat >= memSwLat && swLng >= memSwLng
          : neLat <= memNeLat && (neLng <= memNeLng || neLng >= memSwLng) && swLat >= memSwLat // Consider anti-meridian

        const hasSameCategories = toStr(categories) === categoriesStr
        const hasSameCurrencies = toStr(currencies) === currenciesStr
        if (isWithinBoundingBox && hasSameCategories && hasSameCurrencies) {
          clusters.value = memoizedCluster
          return
        }
      }
    }

    // Compute new clusters if not found in memoized data
    clusterAlgorithm.value = new Supercluster({
      radius: BASE_RADIUS / DECAY_FACTOR ** zoom,
    })

    clusterAlgorithm.value.load(locations.map(locationToPoint))

    const newSingles: Location[] = []
    const newClusters: Cluster[] = []

    for (const c of clusterAlgorithm.value.getClusters([swLng, swLat, neLng, neLat], zoom)) {
      const center: Point = { lng: c.geometry.coordinates[0], lat: c.geometry.coordinates[1] }
      const count = c.properties.point_count || 1
      const clusterId = c.properties.cluster_id
      if (count > 1)
        newClusters.push({ center, count, clusterId })
      else
        newSingles.push(c.properties.location)
    }

    singles.value = newSingles
    clusters.value = newClusters

    // Store this newly computed cluster data in memoizedData
    const newMemoizedData: MemoizedCluster = {
      boundingBox: { neLat, neLng, swLat, swLng },
      clusters: clusters.value,
      singles: singles.value,
      categories: selectedCategories.value,
      currencies: selectedCurrencies.value,
    }

    if (existingData)
      existingData.push(newMemoizedData)

    else
      memoizedClusters.set(zoom, [newMemoizedData])
  }

  return {
    clusterAlgorithm,
    cluster,
    clusters,
    singles,
  }
})
