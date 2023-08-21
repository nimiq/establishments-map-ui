<script setup lang="ts">
import type { Cluster } from '@googlemaps/markerclusterer'
import { SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import { useDebounceFn } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { CustomMarker, GoogleMap, MarkerCluster } from 'vue3-google-map'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocations } from '@/stores/locations'
import CategoryIcon from '@/components/atoms/CategoryIcon.vue'
import googleMapStyles from '@/assets/google-map-styles'
import { useMap } from '@/stores/map'

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAP_KEY

const mapStore = useMap()
const { mapHasPosition, center, zoom } = mapStore
const { boundingBox, mapInstance } = storeToRefs(mapStore)

const superClusterAlgorithm = new SuperClusterAlgorithm({ radius: 160, maxZoom: 18 })
function render(cluster: Cluster) {
  return new google.maps.Marker({
    position: cluster.position,
    label: {
      text: String(cluster.markers?.length || 0),
      color: 'white',
      fontWeight: 'bold',
    },
    icon: '/img/cluster.png',
  })
}

const restriction = {
  latLngBounds: { north: 80, south: -80, west: -179.999999, east: 179.999999 },
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

const router = useRouter()

// Make the API request after the map has not been moved for 300ms or after 700ms
const { getLocations, locations } = useLocations()
const debouncedFn = useDebounceFn(async () => {
  if (!mapHasPosition())
    return
  getLocations(boundingBox.value!)
  router.push({ name: 'coords', params: { ...center(), zoom: zoom() } })
}, 300, { maxWait: 700 })
</script>

<template>
  <div>
    <GoogleMap
      ref="mapInstance" :api-key="googleMapsKey"
      class="w-full h-full" disable-default-ui
      :gesture-handling="mapGestureBehaviour" :keyboard-shortcuts="false" :styles="googleMapStyles"
      :min-zoom="3" :restriction="restriction" @bounds_changed="debouncedFn" @idle.once="useMap().setInitialPosition"
    >
      <MarkerCluster :options="{ algorithm: superClusterAlgorithm, renderer: { render } }">
        <CustomMarker
          v-for="{ lat, uuid, lng, category, name } in locations" :key="uuid"
          :options="{ position: { lat, lng }, anchorPoint: 'TOP_CENTER' }"
        >
          <div
            class="flex flex-col items-center rounded-full shadow cursor-pointer" data-tooltip
          >
            <!-- 'text-space': uuid !== selectedlocationUuid,
              'text-ocean': uuid === selectedlocationUuid, -->
            <svg
              xmlns="http://www.w3.org/2000/svg" width="28" height="10" viewBox="0 0 28 10" class="text-space" :class="{
                'text-ocean': false,
              }"
            >
              <path
                fill="currentColor"
                d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z"
              />
            </svg>

            <!-- 'bg-gradient-space': uuid !== selectedlocationUuid,
              'bg-ocean': uuid === selectedlocationUuid -->
            <div
              class="rounded-full flex gap-x-3 items-center pl-1 pr-4 py-[5px] bg-gradient-space" :class="{
                'bg-ocean': false,
              }"
            >
              <CategoryIcon class="h-8 w-8 p-0.5 bg-white rounded-full grid place-items-center" :category="category" />
              <div style="font-size: 1.125rem" class="text-white">
                {{ name }}
              </div>
            </div>
          </div>
        </CustomMarker>
      </MarkerCluster>
    </GoogleMap>

    <slot />
  </div>
</template>
