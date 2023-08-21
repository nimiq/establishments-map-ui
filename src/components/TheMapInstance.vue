<script setup lang="ts">
import type { Cluster } from '@googlemaps/markerclusterer'
import { SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import { useDebounceFn } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { CustomMarker, GoogleMap, MarkerCluster } from 'vue3-google-map'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Loader } from '@googlemaps/js-api-loader'
import { useLocations } from '@/stores/locations'
import CategoryIcon from '@/components/icons/categories/CategoryIcon.vue'
import { useMap } from '@/stores/map'
import { detectLanguage } from '@/i18n/i18n-setup'

// FIXME
// Vue 3 Google Maps is supposed to load the Google Maps API for us, but it doesn't work for some reason
// https://github.com/inocan-group/vue3-google-map/blob/9e33d341d4ba31fdc0dc43acc36989e010b5c996/src/components/GoogleMap.vue#L327-L335
// I tried many things, but this is the only thing that worked
new Loader({ apiKey: import.meta.env.VITE_GOOGLE_MAP_KEY, version: 'weekly' }).importLibrary('places')

const mapStore = useMap()
const { mapHasPosition, center, zoom } = mapStore
const { boundingBox, mapInstance, map } = storeToRefs(mapStore)

const superClusterAlgorithm = new SuperClusterAlgorithm({ radius: 160, maxZoom: 18 })
function render(cluster: Cluster) {
  return new map.value.Marker({
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
</script>

<template>
  <GoogleMap
    ref="mapInstance"
    :language="detectLanguage()"
    disable-default-ui :gesture-handling="mapGestureBehaviour" :keyboard-shortcuts="false"
    class="w-full h-full" :styles="googleMapStyles" :min-zoom="3" :restriction="restriction"
    @bounds_changed="debouncedFn" @idle.once="useMap().setInitialPosition"
  >
    <MarkerCluster :options="{ algorithm: superClusterAlgorithm, renderer: { render } }">
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
    </MarkerCluster>
  </GoogleMap>
</template>
