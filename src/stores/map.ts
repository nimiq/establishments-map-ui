import { computed, ref, shallowRef, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { GoogleMap } from 'vue3-google-map'
import { useDebounceFn } from '@vueuse/core'
import type { EstimatedMapPosition, MapPosition, Point } from 'types'
import { useRoute, useRouter } from 'vue-router'
import { useCluster } from './cluster'
import { useFilters } from './filters'
import { useLocations } from './locations'

export const useMap = defineStore('map', () => {
  const mapInstance = shallowRef<typeof GoogleMap>()
  const map = computed(() => mapInstance.value?.map as google.maps.Map | undefined)
  const center = ref(map.value?.getCenter()?.toJSON() as Point | undefined)
  const zoom = ref(map.value?.getZoom() ?? 3)
  const boundingBox = ref(boundsToBox(map.value?.getBounds()))

  const router = useRouter()
  const route = useRoute()

  const locationsStore = useLocations()
  const { cluster } = useCluster()
  const { selectedUuid } = storeToRefs(useLocations())
  const { selectedCategories, selectedCurrencies } = storeToRefs(useFilters())

  async function onBoundsChanged() {
    const bbox = boundingBox.value
    if (!bbox)
      return
    router.push({
      name: 'coords',
      params: { ...center.value, zoom: zoom.value },
      query: { ...route.query, uuid: selectedUuid.value ? selectedUuid.value : undefined },
      replace: true,
    })
    await locationsStore.getLocations(bbox)
    cluster({
      boundingBox: bbox,
      zoom: zoom.value,
    }, {
      categories: selectedCategories.value,
      currencies: selectedCurrencies.value,
    })
  }

  // Make the API request after the map has not been moved for 300ms or after 700ms
  const onBoundsChangedDebounced = useDebounceFn(onBoundsChanged, 300, { maxWait: 2000 })

  function boundsToBox(bounds?: google.maps.LatLngBounds) {
    if (!bounds)
      return undefined
    const { lat: swLat, lng: swLng } = bounds.getSouthWest().toJSON()
    const { lat: neLat, lng: neLng } = bounds.getNorthEast().toJSON()
    return { swLat, swLng, neLat, neLng }
  }

  const unwatch = watch(map, (map) => {
    if (!map)
      return
    map.addListener('center_changed', () => {
      center.value = map.getCenter()?.toJSON() as Point | undefined
    })
    map.addListener('zoom_changed', () => {
      zoom.value = map.getZoom()!
    })
    map.addListener('bounds_changed', () => {
      boundingBox.value = boundsToBox(map.getBounds())
      onBoundsChangedDebounced()
    })
    unwatch()
  })

  const increaseZoom = () => map.value?.setZoom(zoom.value + 1)
  const decreaseZoom = () => map.value?.setZoom(zoom.value - 1)

  function setPosition(p?: MapPosition | EstimatedMapPosition | google.maps.LatLngBounds) {
    if (!map.value || !p)
      return

    if ('zoom' in p) {
      map.value?.setCenter(p.center)
      map.value?.setZoom(p.zoom)
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
