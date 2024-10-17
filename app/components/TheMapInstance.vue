<script setup lang="ts">
import { GoogleMap } from 'vue3-google-map'

const apiKey = useRuntimeConfig().public.googleMapsApiKey
const { language } = useNavigatorLanguage()

const { params: initialParams } = useRoute()
const { showSplashScreen } = storeToRefs(useApp())
const { mapLoaded, zoom, center } = storeToRefs(useMap())

const mapStore = useMap()
const { mapInstance } = storeToRefs(mapStore)

const isDark = useDark()
const googleMapStyles = ref<(typeof GoogleMap.map.MapTypeStyle)[]>()
watch(isDark, async () => {
  const module = isDark.value ? await import('@/assets/map-styles/dark') : await import('@/assets/map-styles/light')
  googleMapStyles.value = module.default as (typeof GoogleMap.map.MapTypeStyle)[]
}, { immediate: true })

const restriction = {
  latLngBounds: { north: 80, south: -80, west: Number.NEGATIVE_INFINITY, east: Number.POSITIVE_INFINITY },
  strictBounds: true,
}

const validGestureBehaviours = ['cooperative', 'greedy', 'none', 'auto'] as const
type GestureBehaviour = typeof validGestureBehaviours[number]

const gestureBehaviourParam = initialParams.gestureBehaviour
const mapGestureBehaviour
  = typeof gestureBehaviourParam === 'string' && validGestureBehaviours.includes(gestureBehaviourParam)
    ? gestureBehaviourParam as GestureBehaviour
    : 'greedy'
</script>

<template>
  <transition leave-active-class="duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <LoadingScreen v-if="showSplashScreen" />
  </transition>

  <GoogleMap
    ref="mapInstance" v-bind="$attrs" :api-key :language disable-default-ui
    :gesture-handling="mapGestureBehaviour" :keyboard-shortcuts="false" :styles="googleMapStyles" :max-zoom="21"
    :min-zoom="3" :restriction="restriction" :clickable-icons="false" :zoom :center
    :libraries="['places', 'maps'] as unknown as ['places']"
    @idle.once="() => mapLoaded = true"
  >
    <MapMarkers />
  </GoogleMap>
</template>
