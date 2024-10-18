import type { GoogleMap } from 'vue3-google-map'

export const useMap = defineStore('map', () => {
  const mapInstance = shallowRef<typeof GoogleMap>()
  const map = computed(() => mapInstance.value?.map as google.maps.Map | undefined)
  const mapLoaded = ref(false)
  const boundingBox = ref<BoundingBox>()

  const lat = useRouteParams('lat', '', { transform: Number, mode: 'replace' })
  const lng = useRouteParams('lng', '', { transform: Number })
  const zoom = useRouteParams('zoom', '', { transform: Number })
  const center = computed(() => lat.value && lng.value ? { lat: lat.value, lng: lng.value } : undefined)

  const router = useRouter()
  const route = useRoute()

  watchDebounced(
    boundingBox,
    () => {
      router.push({
        name: '@lat,lng,zoomz',
        params: { lat: lat.value.toString(), lng: lng.value.toString(), zoom: zoom.value.toString() },
        query: { ...route.query, uuid: useLocations().selectedUuid || undefined },
        replace: true,
      })
    },
    { debounce: 500, maxWait: 1000 },
  )
  // The bounds event is fired a lot, so we debounce it

  // const unwatch = watch(map, async (map) => {
  //   if (!map)
  //     return

  //   // setPosition({ center: { lat: params.lat, lng: params.lng }, zoom: params.zoom }, { clearMarkers: true })
  //   // map.addListener('center_changed', () => {
  //   //   const { lat: newLat, lng: newLng } = map.getCenter()?.toJSON() as Point
  //   //   lat.value = newLat
  //   //   lng.value = newLng
  //   // })
  //   // map.addListener('zoom_changed', () => {
  //   //   zoom.value = map.getZoom()!
  //   // })
  //   // map.addListener('bounds_changed', onBoundsChanged)
  //   unwatch()
  // })

  const increaseZoom = () => map.value?.setZoom(zoom.value + 1)
  const decreaseZoom = () => map.value?.setZoom(zoom.value - 1)

  interface SetPositionOptions {
    /*
      * If true, the map will pan to the new position instead of setting it directly
      * This is useful when the map is not centered on the user's location
      *
      * @default false
      */
    smooth?: boolean

    /**
     * If true, the markers will be cleared before setting the position
     *
     * @default false
     */
    clearMarkers?: boolean
  }
  function setPosition(p?: MapPosition | EstimatedMapPosition | google.maps.LatLngBounds, { clearMarkers, smooth }: SetPositionOptions = {}) {
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

    // It takes a few seconds to recompute the clusters, so we clear the markers to avoid showing them
    if (clearMarkers)
      useMarkers().clearMarkers()
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
    mapLoaded,
    lat,
    lng,

    setPosition,

    center,
    zoom,
    boundingBox,

    increaseZoom,
    decreaseZoom,

    goToPlaceId,
  }
})
