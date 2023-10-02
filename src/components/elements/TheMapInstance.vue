<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { GoogleMap } from 'vue3-google-map'
import { useDark } from '@vueuse/core'
import { useMap } from '@/stores/map'
import { i18n } from '@/i18n/i18n-setup'
import { useInitialMapPosition } from '@/composables/useInitialMapPosition'
import MapMarkers from '@/components/markers/MapMarkers.vue'
import { useApp } from '@/stores/app'

const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAP_KEY

const { params: initialParams } = useRoute()
const { mapLoaded, showSplashScreen } = storeToRefs(useApp())
const { query } = useRoute()
const setInitialMapPosition = () => useInitialMapPosition(initialParams, query)

const mapStore = useMap()
const { mapInstance } = storeToRefs(mapStore)

// Styles exported from https://snazzymaps.com/style/437351/crypto-map
const googleMapStyles = [
  { featureType: 'landscape', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ lightness: 57 }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ visibility: 'on' }, { lightness: 24 }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
] as (typeof GoogleMap.map.MapTypeStyle)[]

const restriction = {
  latLngBounds: { north: 80, south: -80, west: Number.NEGATIVE_INFINITY, east: Number.POSITIVE_INFINITY },
  strictBounds: true,
}

const validGestureBehaviours = ['cooperative', 'greedy', 'none', 'auto'] as const
type GestureBehaviour = typeof validGestureBehaviours[number]

const gestureBehaviourParam = useRoute().params.gestureBehaviour
const mapGestureBehaviour
  = typeof gestureBehaviourParam === 'string' && ['cooperative', 'greedy', 'none', 'auto'].includes(gestureBehaviourParam)
    ? gestureBehaviourParam as GestureBehaviour
    : 'greedy'

const isDark = useDark()
</script>

<template>
  <transition leave-active-class="duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div
      v-if="showSplashScreen"
      class="absolute inset-0 grid supports-[height:100dvh]:h-[100dvh] h-screen px-12 z-100 place-content-center"
      :class="isDark ? 'bg-space' : 'bg-white'"
    >
      <img :src="`logo-horizontal-${isDark ? 'dark' : 'light'}.svg`" loading="eager" :alt="$t('Crypto Map logo')" class="animate-fade">
      <i18n-t class="absolute inset-x-0 w-screen px-4 text-xs md:text-center bottom-4 text-space/80 dark:text-white/50" tag="div" keypath="This site is protected by reCAPTCHA and the Google {privacyPolicy} and {termsOfService} apply.">
        <template #privacyPolicy><a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="underline text-space/80 dark:text-white/60">{{ $t('Privacy Policy') }}</a></template>
        <template #termsOfService><a href="https://policies.google.com/terms" target="_blank" rel="noopener" class="underline text-space/80 dark:text-white/60">{{ $t('Terms of Service') }}</a></template>
      </i18n-t>
    </div>
  </transition>

  <GoogleMap
    ref="mapInstance" v-bind="$attrs" :api-key="GOOGLE_MAP_KEY" :language="i18n.locale" disable-default-ui :gesture-handling="mapGestureBehaviour"
    :keyboard-shortcuts="false" :styles="googleMapStyles" :max-zoom="21" :min-zoom="3" :restriction="restriction" :clickable-icons="false" :libraries="['places', 'maps'] as unknown as ['places']"
    @idle.once="() => { mapLoaded = true; setInitialMapPosition() }"
  >
    <MapMarkers />
  </GoogleMap>
</template>
