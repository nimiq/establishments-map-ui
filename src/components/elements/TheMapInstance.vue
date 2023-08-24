<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { GoogleMap } from 'vue3-google-map'
import { useMap } from '@/stores/map'
import { detectLanguage } from '@/i18n/i18n-setup'
import { useInitialMapPosition } from '@/composables/useInitialMapPosition'
import MapMarkers from '@/components/elements/MapMarkers.vue'

const { params: initialParams } = useRoute()
const setInitialMapPosition = () => useInitialMapPosition(initialParams)

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
const mapGestureBehaviour = computed<GestureBehaviour>(() => {
  const gestureBehaviourParam = useRoute().params.gestureBehaviour
  if (typeof gestureBehaviourParam === 'string' && ['cooperative', 'greedy', 'none', 'auto'].includes(gestureBehaviourParam))
    return gestureBehaviourParam as GestureBehaviour
  return 'greedy'
})
</script>

<template>
  <GoogleMap
    ref="mapInstance" :language="detectLanguage()" disable-default-ui :gesture-handling="mapGestureBehaviour" :keyboard-shortcuts="false"
    class="w-full h-full" :styles="googleMapStyles" :min-zoom="3" :restriction="restriction" @bounds_changed="mapStore.onBoundsChanged"
    @idle.once="setInitialMapPosition"
  >
    <MapMarkers />

    <!-- <MarkerCluster>
      <CustomMarker
        v-for="{ lat, uuid, lng, category, name } in locations" :key="uuid"
        :options="{ position: { lat, lng }, anchorPoint: 'TOP_CENTER' }"
      >
        <div
          class="flex flex-col items-center rounded-full shadow cursor-pointer" data-tooltip
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="10" viewBox="0 0 28 10" class="text-space">
            <path
              fill="currentColor"
              d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z"
            />
          </svg>
          <div class="rounded-full flex gap-x-3 items-center pl-1 pr-4 py-[5px] bg-gradient-space">
            <CategoryIcon class="h-8 w-8 p-0.5 bg-white rounded-full grid place-items-center" :category="category" />
            <div style="font-size: 1.125rem" class="text-white">
              {{ name }}
            </div>
          </div>
        </div>
      </CustomMarker>
    </MarkerCluster> -->
  </GoogleMap>
</template>
