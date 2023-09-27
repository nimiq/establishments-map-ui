import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import { getCryptocityPolygon } from 'database'
import { defineStore, storeToRefs } from 'pinia'
import { addBBoxToArea, bBoxIsWithinArea, bBoxesIntersect, distanceInPx } from 'shared'
import type { BoundingBox, Cryptocity, CryptocityMarker, CryptocityMemoized } from 'types'
import { computed, ref, watch } from 'vue'
import { useMarkers } from './markers'
import { useMap } from './map'
import { cryptocitiesData } from '@/assets-dev/cryptocities-assets.ts'
import { getAnonDatabaseArgs } from '@/shared'

export const useCryptocity = defineStore('cryptocities', () => {
  const { map, boundingBox, zoom, latInPx, lngInPx } = storeToRefs(useMap())

  const { clustersInView } = storeToRefs(useMarkers())

  const cryptocities = useLocalStorage('cryptocities', cryptocitiesData)

  // The cryptocities markers will be set:
  // - In the centroid position if they do not clash with any cluster
  // - Attached to the cluster if they clash with any cluster
  const cryptocitiesMarkers = ref<CryptocityMarker>(new Map())
  const memoizedMarkers = new Map<number /* zoom */, CryptocityMemoized>()

  const cryptocitiesInView = computed(() => {
    if (!boundingBox.value)
      return []
    return Object.values(cryptocities.value).filter(city => bBoxesIntersect(boundingBox.value!, city.boundingBox))
  })

  const citiesRendered: Cryptocity[] = []

  async function loadCryptocities(boundingBox: BoundingBox, zoom: number, map: google.maps.Map) {
    const memoized = memoizedMarkers.get(zoom) || { area: { type: 'MultiPolygon', coordinates: [] }, markers: new Map() }
    if (bBoxIsWithinArea(boundingBox, memoized.area)) {
      cryptocitiesMarkers.value = memoized.markers
      return
    }

    // Check if the bounding box of any cryptocity is in the view
    const cryptocitiesInView = Object.values(cryptocities.value).filter(p => bBoxesIntersect(p.boundingBox, boundingBox))
    if (cryptocitiesInView.length === 0)
      return

    const markers: CryptocityMarker = new Map()
    for (const city of cryptocitiesInView) {
      if (!citiesRendered.includes(city.cryptocity)) {
        getCryptocityPolygon(await getAnonDatabaseArgs(), city.cryptocity).then((polygon) => {
          map.data.addGeoJson(polygon!, { idPropertyName: city.cryptocity })
          citiesRendered.push(city.cryptocity)
        })
      }

      // check if it clashes
      const clusterToBeAttached = clustersInView.value.filter(c => distanceInPx(c, city.centroid, { latInPx: latInPx.value, lngInPx: lngInPx.value }) < c.diameter + 8 /* padding */)[0]

      // Add it to
      const key = clusterToBeAttached?.id ?? -1
      if (!markers.has(key))
        markers.set(key, [])
      markers.get(key)!.push(city)
    }

    memoized.area = addBBoxToArea(boundingBox, memoized.area)
    memoized.markers = markers
    cryptocitiesMarkers.value = markers
  }

  const loadCryptocitiesDebouncer = useDebounceFn(loadCryptocities, 600)

  const CRYPTOCITY_MIN_ZOOM = 7
  const CRYPTOCITY_MIN_OPACITY = 0.01
  const CRYPTOCITY_MAX_ZOOM = 21
  const CRYPTOCITY_MAX_OPACITY = 0.17

  function linearRegression(x: number): number {
    if (x < CRYPTOCITY_MIN_ZOOM || x > CRYPTOCITY_MAX_ZOOM)
      return 0

    const m = (CRYPTOCITY_MIN_OPACITY - CRYPTOCITY_MAX_OPACITY) / (CRYPTOCITY_MAX_ZOOM - CRYPTOCITY_MIN_ZOOM)
    const b = CRYPTOCITY_MAX_OPACITY - m * CRYPTOCITY_MIN_ZOOM
    return m * x + b
  }

  watch(clustersInView, async () => {
    if (!boundingBox.value || !map.value)
      return
    loadCryptocitiesDebouncer(boundingBox.value, zoom.value, map.value)
    const fillOpacity = linearRegression(zoom.value)
    map.value.data.setStyle({ fillColor: 'rgb(31 35 72)', fillOpacity, strokeWeight: 0 })
  })

  return {
    cryptocitiesInView,
    cryptocities: cryptocitiesMarkers,
  }
})
