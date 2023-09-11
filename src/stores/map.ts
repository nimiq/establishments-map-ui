import { useDebounceFn } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { EstimatedMapPosition, MapPosition, Point } from 'types'
import { computed, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { GoogleMap } from 'vue3-google-map'
import { useCluster } from './cluster'
import { useLocations } from './locations'

export const useMap = defineStore('map', () => {
  const mapInstance = shallowRef<typeof GoogleMap>()
  const map = computed(() => mapInstance.value?.map as google.maps.Map | undefined)
  const center = ref(map.value?.getCenter()?.toJSON() as Point | undefined)
  const zoom = ref(map.value?.getZoom() ?? 3)
  const boundingBox = ref(boundsToBox(map.value?.getBounds()))

  const router = useRouter()
  const route = useRoute()

  // Update the route
  const updateRouteDebouncer = useDebounceFn(() => {
    if (!center.value)
      return
    router.push({
      name: 'coords',
      params: { ...center.value, zoom: zoom.value },
      query: { ...route.query, uuid: useLocations().selectedUuid || undefined },
      replace: true,
    })
  }, 300, { maxWait: 2000 })
  const clusterDebouncer = useDebounceFn(() => useCluster().cluster(), 300, { maxWait: 2000 })

  function boundsToBox(bounds?: google.maps.LatLngBounds) {
    if (!bounds)
      return undefined
    const { lat: swLat, lng: swLng } = bounds.getSouthWest().toJSON()
    const { lat: neLat, lng: neLng } = bounds.getNorthEast().toJSON()
    return { swLat, swLng, neLat, neLng }
  }

  function onBoundsChanged() {
    if (!map.value || !map.value.getBounds())
      return
    boundingBox.value = boundsToBox(map.value!.getBounds())
    updateRouteDebouncer()

    // If we don't have the item in the memoized map, we need to update the clusters
    // If we have it, getMemoized will update the active value
    if (useCluster().needsToUpdate())
      clusterDebouncer()
  }

  // The bounds event is fired a lot, so we debounce it
  const onBoundsChangedDebouncer = useDebounceFn(onBoundsChanged, 30)

  const unwatch = watch(map, (map) => {
    if (!map)
      return
    map.addListener('center_changed', () => {
      center.value = map.getCenter()?.toJSON() as Point | undefined
    })
    map.addListener('zoom_changed', () => {
      zoom.value = map.getZoom()!
    })
    map.addListener('bounds_changed', onBoundsChangedDebouncer)
    unwatch()
  })

  const increaseZoom = () => map.value?.setZoom(zoom.value + 1)
  const decreaseZoom = () => map.value?.setZoom(zoom.value - 1)

  function setPosition(p?: MapPosition | EstimatedMapPosition | google.maps.LatLngBounds, smooth = false) {
    if (!map.value || !p)
      return

    if ('zoom' in p) {
      if (smooth) {
        map.value?.panTo(p.center)
      }
      else {
        map.value?.setCenter(p.center)
        map.value?.setZoom(p.zoom)
      }
    }
    else if ('accuracy' in p) {
      const circle = new google.maps.Circle({
        center: p.center,
        radius: p.accuracy,
      })
      map.value?.fitBounds(circle.getBounds()!)
    }
    else if (p instanceof google.maps.LatLngBounds) {
      map.value?.fitBounds(p)
    }
  }

  async function goToPlaceId(placeId?: string) {
    const geocoder = new google.maps.Geocoder()
    if (!placeId)
      return
    const res = await geocoder.geocode({ placeId })
    setPosition(res.results[0]?.geometry.viewport)
  }

  return {
    map,
    mapInstance,

    setPosition,

    center,
    zoom,
    boundingBox,

    increaseZoom,
    decreaseZoom,

    goToPlaceId,
  }
})
