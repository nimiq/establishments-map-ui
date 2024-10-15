import { CLUSTERS_MAX_ZOOM, algorithm, computeMarkers } from '~~/lib/compute-markers'
import type { Markers, MemoizedMarkers } from '~~/types/map'
import type { Database } from '~~/types/supabase'

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
    // timestamp: useApp().timestamps?.markers,
  })

  /**
   * The clusters and singles are computed from the memoized clusters and singles. For each zoom level and each filter combination,
   * we store the clusters and singles.
   */
  const clusters = shallowRef<Cluster[]>([])
  const clustersInView = computed(() => boundingBox.value ? getItemsWithinBBox(clusters.value, boundingBox.value) : [])
  const singles = shallowRef<MapLocation[]>([])
  const singlesInView = computed(() => boundingBox.value ? getItemsWithinBBox(singles.value, boundingBox.value) : [])

  // function getIndex({ zoom, categories, currencies }: LocationClusterParams) {
  function getIndex(_a: LocationClusterParams) {
    // return memoized.value?.findIndex?.(m => m.key.zoom === zoom && m.key.categories === categories && m.key.currencies === currencies)
    return -1
  }

  function getMemoized() {
    const key = { zoom: zoom.value }

    const index = getIndex(key)
    const item = index !== -1 ? memoized.value[index]?.value : undefined

    // If the item exists and the bounding box is within the memoized area, we can reuse the memoized item and there is no need to re-cluster
    const needsToUpdate = !item || !boundingBox.value || !bBoxIsWithinArea(boundingBox.value, item.area)

    // Update the memoized item if it exists
    if (!needsToUpdate)
      setMarkers(item.singles, item.clusters)

    return { key, item, needsToUpdate }
  }

  const supabase = useSupabaseClient<Database>()
  const maxZoomFromServer = ref(14)

  async function shouldRunInClient({ zoom }: LocationClusterParams): Promise<boolean> {
    // FIXME Not the best solution, but it works for now
    // We cannot compute all clusters combinations in the server, if user has selected currencies or categories
    // we need to compute the clusters in the client
    // if (currencies || categories)
    //   return true

    // await initMaxZoom() // Get the value from the server if it doesn't exist
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
    // const res = await getMarkers(await getAnonDatabaseArgs(), { boundingBox: boundingBox.value!, zoom: zoom.value }, parseLocation)
    const { data, error } = await supabase.rpc('get_markers', { ...boundingBox.value!, zoom_level: zoom.value })
    if (error)
      throw error

    const cryptocities = await getCryptocities(boundingBox.value!)
    setLocations((data as unknown as Markers).singles)
    setCryptocities(boundingBox.value!, cryptocities);
    (data as unknown as Markers).clusters.forEach(c => c.diameter = Math.max(24, Math.min(48, 0.24 * c.count + 24)))
    return data as unknown as Markers
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
      // memoized.value.push({
      //   key,
      //   value: {
      //     area: toMultiPolygon(boundingBox.value!),
      //     clusters: newClusters,
      //     singles: newSingles,
      //   },
      // })
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
