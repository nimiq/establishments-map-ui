<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { GoogleMap } from 'vue3-google-map'
import { useMap } from '@/stores/map'
import { i18n } from '@/i18n/i18n-setup'
import { useInitialMapPosition } from '@/composables/useInitialMapPosition'
import MapMarkers from '@/components/elements/MapMarkers.vue'

const { params: initialParams } = useRoute()
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
</script>

<template>
  <GoogleMap
    ref="mapInstance" :language="i18n.locale" disable-default-ui :gesture-handling="mapGestureBehaviour" :keyboard-shortcuts="false"
    class="w-full h-full" :styles="googleMapStyles" :max-zoom="21" :min-zoom="3" :restriction="restriction" :clickable-icons="false"
    @idle.once="setInitialMapPosition"
  >
    <MapMarkers />
  </GoogleMap>
</template>
