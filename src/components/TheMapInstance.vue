<script setup lang="ts">
import type { Cluster } from '@googlemaps/markerclusterer'
import { SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import { storeToRefs } from 'pinia'
import type { PropType } from 'vue'
import { useRoute } from 'vue-router'
import { CustomMarker, GoogleMap, MarkerCluster } from 'vue3-google-map'
import googleMapStyles from '@/assets/google-map-styles'
import CategoryIcon from '@/components/atoms/CategoryIcon.vue'
import type { Location } from '@/database'
import { useApp } from '@/stores/app'
import { useMap } from '@/stores/map'

const props = defineProps({
  locations: {
    type: Array as PropType<Location[]>,
    required: true,
  },
})

const mapStore = useMap()
const { computeBoundingBox } = mapStore
const { center, zoom, map$ } = storeToRefs(mapStore)

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAP_KEY

// We have to wait until GoogleMap component is mounted in order to compute
// the bounding box of the map if user is accessing the map from an location
function onIdle() {
  computeBoundingBox({ updateRoute: false })
}

const superClusterAlgorithm = new SuperClusterAlgorithm({ radius: 160, maxZoom: 18 }) as unknown as undefined // To avoid lint error
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

function selectlocation() {
  // selectedlocationUuid.value = uuid
  useApp().showList()
}

const mapGestureBehaviour = useRoute().params.gestureBehaviour || 'greedy'
</script>

<template>
  <div>
    <GoogleMap
      v-if="center && center.lat !== 0 && center.lng !== 0" ref="map$" :api-key="googleMapsKey"
      class="w-full h-full" :center="center" :zoom="zoom" disable-default-ui :clickable-icons="false"
      :map-gesture-handling="mapGestureBehaviour" :keyboard-shortcuts="false" :styles="googleMapStyles"
      :min-zoom="3" :restriction="restriction" @bounds_changed="computeBoundingBox" @idle.once="onIdle"
    >
      <MarkerCluster :options="{ algorithm: superClusterAlgorithm, renderer: { render } }">
        <CustomMarker
          v-for="{ lat, uuid, lng, category, name } in props.locations" :key="uuid"
          :options="{ position: { lat, lng }, anchorPoint: 'TOP_CENTER' }"
        >
          <div
            class="flex flex-col items-center rounded-full shadow cursor-pointer" data-tooltip
            @click="selectlocation(uuid)"
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
