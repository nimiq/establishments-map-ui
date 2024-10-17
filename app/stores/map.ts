import type { GoogleMap } from 'vue3-google-map'
import { safeParse, union, undefined as vUndefined } from 'valibot'
import { LatSchema, LngSchema, UuidSchema, ZoomSchema } from '~~/lib/schemas'

export const useMap = defineStore('map', () => {
  const mapInstance = shallowRef<typeof GoogleMap>()
  const map = computed(() => mapInstance.value?.map as google.maps.Map | undefined)
  const center = ref(map.value?.getCenter()?.toJSON() as Point | undefined)
  const zoom = ref(map.value?.getZoom() ?? 3)
  const mapLoaded = ref(false)
  const boundingBox = ref<BoundingBox>()

  const router = useRouter()
  const route = useRoute()

  // Update the route
  const updateRouteDebouncer = useDebounceFn(() => {
    if (!center.value)
      return

    router.push({
      params: {
        coords: `@${center.value.lat},${center.value.lng},${zoom.value}z`,
      },
      query: { ...route.query, uuid: useLocations().selectedUuid || undefined },
      replace: true,
    })
  }, 300, { maxWait: 2000 })
  const clusterDebouncer = useDebounceFn(() => useMarkers().cluster(), 300, { maxWait: 2000 })

  function boundsToBox(bounds: google.maps.LatLngBounds) {
    const { lat: swlat, lng: swlng } = bounds.getSouthWest().toJSON()
    const { lat: nelat, lng: nelng } = bounds.getNorthEast().toJSON()
    return { swlat, swlng, nelat, nelng }
  }

  function onBoundsChanged() {
    const bounds = map.value?.getBounds()
    if (!bounds)
      return

    const { nelat, nelng, swlat, swlng } = boundsToBox(bounds)
    boundingBox.value = { nelat, nelng, swlat, swlng }

    updateRouteDebouncer()

    clusterDebouncer()
  }

  // The bounds event is fired a lot, so we debounce it
  const onBoundsChangedDebouncer = useDebounceFn(onBoundsChanged, 30)

  function getParams() {
    const parts = route.path.slice(2 /* remove '/@' from the beginning */, -1 /* Remove 'z' from the back */)?.split(',')
    if (parts.length !== 3)
      return
    const { output: lat, success: latSuccess } = safeParse(LatSchema, parts[0])
    const { output: lng, success: lngSuccess } = safeParse(LngSchema, parts[1])
    const { output: zoom, success: zoomSuccess } = safeParse(ZoomSchema, parts[2])
    if (!latSuccess || !lngSuccess || !zoomSuccess)
      return
    const { output: uuid, success: uuidSuccess } = safeParse(union([UuidSchema, vUndefined()]), route.query.uuid)
    if (!uuidSuccess)
      return { lat, lng, zoom }
    return { lat, lng, zoom, uuid }
  }

  // Costa Rica
  const FALLBACK_POSITION: MapPosition = { center: { lat: 9.6301892, lng: -84.2541844 }, zoom: 9 }

  const { geolocateIp } = useGeoIp()
  const { ipPositionError, ipPosition } = storeToRefs(useGeoIp())
  const { selectedUuid } = storeToRefs(useLocations())

  const unwatch = watch(map, async (map) => {
    if (!map)
      return

    const params = getParams()
    if (!params) {
      await geolocateIp()

      if (!ipPositionError.value && ipPosition.value) {
        // eslint-disable-next-line no-console
        console.log(`Using user's location: ${JSON.stringify(ipPosition.value)}`)
        setPosition(ipPosition.value)
      }
      else {
        console.warn(`Error getting user's location: ${ipPositionError.value}. Using fallback position. ${JSON.stringify(FALLBACK_POSITION)}`)
        setPosition(FALLBACK_POSITION)
      }
    }
    else {
      const { lat, lng, zoom, uuid } = params
      // const { center, zoom: mapZoom } = storeToRefs(useMap())
      // center.value = { lat, lng }
      // mapZoom.value = zoom
      setPosition({ center: { lat, lng }, zoom })
      if (uuid)
        selectedUuid.value = uuid
    }
    // setPosition({ center: { lat: params.lat, lng: params.lng }, zoom: params.zoom }, { clearMarkers: true })
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

    setPosition,

    center,
    zoom,
    boundingBox,

    increaseZoom,
    decreaseZoom,

    goToPlaceId,
  }
})
