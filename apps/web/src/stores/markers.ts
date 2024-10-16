import { getClusterMaxZoom } from 'database'
import { CLUSTERS_MAX_ZOOM, addBBoxToArea, algorithm, bBoxIsWithinArea, computeMarkers, getItemsWithinBBox, toMultiPolygon } from 'geo'
import type { Cluster, LocationClusterParams, MapLocation, Markers, MemoizedMarkers } from 'types'
import { getAnonDatabaseArgs, parseLocation } from '@/shared'

export const useMarkers = defineStore('markers', () => {
  const { setLocations, getLocations } = useLocations()
  const { zoom, boundingBox } = storeToRefs(useMap())
  const loaded = ref(false)
  const { setCryptocities, getCryptocities } = useCryptocities()
  const { attachedCryptocities } = storeToRefs(useCryptocities())

  /*
   * With memoization, we reduce redundant calculations/requests and optimizes user map interactions to optimize map performance:
  -* `memoizedCluster` stores clusters, bounding boxes, and filters by zoom level.
  -* Before re-clustering, we check for existing data matching the current zoom, bounding box, and filters.
  -* If a match is found, we reuse stored clusters; otherwise, new clusters are computed and stored.
   */
  const { payload: memoized } = useExpiringStorage('memoized_markers', {
    defaultValue: [] as { key: LocationClusterParams, value: MemoizedMarkers }[],
    expiresIn: 7 * 24 * 60 * 60 * 1000,
    timestamp: useApp().timestamps?.markers,
  })

  /**
   * The clusters and singles are computed from the memoized clusters and singles. For each zoom level and each filter combination,
   * we store the clusters and singles.
   */
  const clusters = shallowRef<Cluster[]>([])
  const clustersInView = computed(() => boundingBox.value ? getItemsWithinBBox(clusters.value, boundingBox.value) : [])
  const singles = shallowRef<MapLocation[]>([])
  const singlesInView = computed(() => boundingBox.value ? getItemsWithinBBox(singles.value, boundingBox.value) : [])

  function getIndex({ zoom, categories, currencies }: LocationClusterParams) {
    return memoized?.value?.findIndex?.(m => m.key.zoom === zoom && m.key.categories === categories && m.key.currencies === currencies)
  }

  function getMemoized() {
    const key = { zoom: zoom.value }

    const index = getIndex(key)
    const item = index !== -1 ? memoized?.value[index]?.value : undefined

    // If the item exists and the bounding box is within the memoized area, we can reuse the memoized item and there is no need to re-cluster
    const needsToUpdate = !item || !boundingBox.value || !bBoxIsWithinArea(boundingBox.value, item.area)

    // Update the memoized item if it exists
    if (!needsToUpdate)
      setMarkers(item.singles, item.clusters)

    return { key, item, needsToUpdate }
  }

  const { init: initMaxZoom, payload: maxZoomFromServer } = useExpiringStorage('max_zoom_from_server', {
    expiresIn: 7 * 24 * 60 * 60 * 1000,
    getAsyncValue: async () => {
      return await getClusterMaxZoom(await getAnonDatabaseArgs())
    },
    timestamp: useApp().timestamps?.markers,
  })

  async function shouldRunInClient({ zoom }: LocationClusterParams): Promise<boolean> {
    // FIXME Not the best solution, but it works for now
    // We cannot compute all clusters combinations in the server, if user has selected currencies or categories
    // we need to compute the clusters in the client
    // if (currencies || categories)
    //   return true

    await initMaxZoom() // Get the value from the server if it doesn't exist
    return zoom > maxZoomFromServer.value
  }

  async function getMarkersFromClients(): Promise<Markers> {
    const locations = await getLocations(boundingBox.value!)
    const cryptocities = await getCryptocities(boundingBox.value!)
    setCryptocities(boundingBox.value!, cryptocities)
    const { clusters, singles } = computeMarkers(algorithm(80), locations, { boundingBox: boundingBox.value!, zoom: zoom.value })
    return { singles, clusters }
  }

  async function getMarkersFromDatabase(): Promise<Markers> {
    const url = new URL('https://crypto-map.nuxt.dev/api/markers/')
    url.searchParams.append('nelat', boundingBox.value!.neLat.toString())
    url.searchParams.append('nelng', boundingBox.value!.neLng.toString())
    url.searchParams.append('swlat', boundingBox.value!.swLat.toString())
    url.searchParams.append('swlng', boundingBox.value!.swLng.toString())
    url.searchParams.append('zoom_level', zoom.value.toString())
    const res = await fetch(url)
    const json = await res.json() as Markers
    const { singles, clusters } = json
    const locations = singles.map(parseLocation)

    const cryptocities = await getCryptocities(boundingBox.value!)
    setLocations(locations)
    setCryptocities(boundingBox.value!, cryptocities)
    clusters.forEach(c => c.diameter = Math.max(24, Math.min(48, 0.24 * c.count + 24)))
    return json
  }

  function setMarkers(newSingles: MapLocation[], newClusters: Cluster[]) {
    singles.value = newSingles
    clusters.value = newClusters
    attachedCryptocities.value = newClusters.flatMap(c => c.cryptocities)
    loaded.value = true
  }

  async function cluster() {
    if (zoom.value > CLUSTERS_MAX_ZOOM) {
      // We are too zoomed in, no need to cluster
      setMarkers(await getLocations(boundingBox.value!), [])
      return
    }

    const { item, key, needsToUpdate } = getMemoized()

    if (!needsToUpdate)
      return

    const { clusters: newClusters, singles: newSingles } = await shouldRunInClient(key)
      ? await getMarkersFromClients()
      : await getMarkersFromDatabase()

    if (item) {
      item.area = addBBoxToArea(boundingBox.value!, item.area)
      item.clusters.push(...newClusters.filter(c => item.clusters.every(i => i.id !== c.id)))
      item.singles.push(...newSingles.filter(s => item.singles.every(i => i.uuid !== s.uuid)))
    }
    else {
      memoized.value.push({
        key,
        value: {
          area: toMultiPolygon(boundingBox.value!),
          clusters: newClusters,
          singles: newSingles,
        },
      })
    }

    setMarkers(newSingles, newClusters)
  }

  return {
    memoized,
    cluster,
    clusters,
    singles,
    clustersInView,
    singlesInView,
    loaded,
    maxZoomFromServer,
    clearMarkers: () => setMarkers([], []),
  }
})
