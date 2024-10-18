<script setup lang="ts">
import { GoogleMap } from 'vue3-google-map'

const apiKey = useRuntimeConfig().public.googleMapsApiKey
const { language } = useNavigatorLanguage()

const { showSplashScreen } = storeToRefs(useApp())
const { mapLoaded, zoom, map, lat, lng, boundingBox } = storeToRefs(useMap())
const initialZoom = useMap().zoom
const initialCenter = useMap().center

const mapStore = useMap()
const { mapInstance } = storeToRefs(mapStore)

const isDark = useDark()
const styles = ref<(typeof GoogleMap.map.MapTypeStyle)[]>()
watch(isDark, async () => {
  const module = isDark.value ? await import('@/assets/map-styles/dark') : await import('@/assets/map-styles/light')
  styles.value = module.default as (typeof GoogleMap.map.MapTypeStyle)[]
}, { immediate: true })

const restriction = {
  latLngBounds: { north: 80, south: -80, west: Number.NEGATIVE_INFINITY, east: Number.POSITIVE_INFINITY },
  strictBounds: true,
}

type GestureBehaviour = 'cooperative' | 'greedy' | 'none' | 'auto'
const mapGestureBehaviour = useRouteQuery<GestureBehaviour>('gestureBehaviour', 'greedy')

function updateCenter() {
  const { lat: newLat, lng: newLng } = map.value!.getCenter()?.toJSON() as Point
  lat.value = newLat
  lng.value = newLng
}

function updateZoom() {
  zoom.value = map.value!.getZoom() as number
}

function onBoundsChanged() {
  const bounds = map.value?.getBounds()
  const { lat: swlat, lng: swlng } = bounds!.getSouthWest().toJSON()
  const { lat: nelat, lng: nelng } = bounds!.getNorthEast().toJSON()
  boundingBox.value = { nelat, nelng, swlat, swlng }
}
</script>

<template>
  <transition leave-active-class="duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <LoadingScreen v-if="showSplashScreen" />
  </transition>

  <GoogleMap
    ref="mapInstance" v-bind="$attrs" :api-key :language disable-default-ui
    :gesture-handling="mapGestureBehaviour" :keyboard-shortcuts="false" :styles :max-zoom="21"
    :min-zoom="3" :restriction="restriction" :clickable-icons="false" :zoom="initialZoom" :center="initialCenter"
    :libraries="['places', 'maps'] as unknown as ['places']"
    @center_changed="updateCenter" @zoom_changed="updateZoom" @bounds_changed="onBoundsChanged"
    @idle.once="() => mapLoaded = true"
  >
    <MapMarkers />
  </GoogleMap>
</template>
