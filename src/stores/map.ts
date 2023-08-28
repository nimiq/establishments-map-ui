import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { GoogleMap } from 'vue3-google-map'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useLocations } from './locations'
import { useCluster } from './cluster'
import type { EstimatedMapPosition, MapPosition, Point } from '@/types'

export const useMap = defineStore('map', () => {
  const mapInstance = ref<typeof GoogleMap>()
  const map = computed(() => mapInstance.value?.map as google.maps.Map)
  const center = () => map.value?.getCenter()?.toJSON() as Point
  const zoom = () => map.value?.getZoom() as number
  const increaseZoom = () => map.value?.setZoom(zoom() + 1)
  const decreaseZoom = () => map.value?.setZoom(zoom() - 1)

  const boundingBox = () => {
    if (!map.value?.getBounds())
      return
    const { lat: swLat, lng: swLng } = map.value.getBounds()!.getSouthWest().toJSON()
    const { lat: neLat, lng: neLng } = map.value.getBounds()!.getNorthEast().toJSON()
    return { swLat, swLng, neLat, neLng }
  }

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

  const router = useRouter()
  const locationsStore = useLocations()
  const { cluster } = useCluster()

  async function onBoundsChanged() {
    const bbox = boundingBox()
    if (!bbox)
      return
    router.push({ name: 'coords', params: { ...center(), zoom: zoom() } })
    await locationsStore.getLocations(boundingBox()!)
    cluster(locationsStore.locations, boundingBox()!, zoom())
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

    // Make the API request after the map has not been moved for 300ms or after 700ms
    onBoundsChanged: useDebounceFn(onBoundsChanged, 300, { maxWait: 2000 }),
  }
})
