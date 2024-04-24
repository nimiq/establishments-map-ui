<script setup lang="ts">
import { CustomMarker } from 'vue3-google-map'
const { singles } = storeToRefs(useMarkers())
const { zoom } = storeToRefs(useMap())
const SingleMarkersDesktop = defineAsyncComponent(() => import('./SingleMarkersDesktop.vue'))
</script>

<template>
  <SingleMarkersDesktop v-if="!isMobile" />
  <CustomMarker v-else v-for="location in singles" :key="location.uuid"
    :options="{ position: { lng: location.lng, lat: location.lat } }" data-custom-marker>
    <SingleMarker :location />
  </CustomMarker>

  <ClusterMarkers />

  <!-- <CustomMarker v-for="({ city, lat, lng }) in cryptocitiesSingles.filter(c => c.showCardAtZoom + 4 > zoom)" :key="city"
    :options="{ position: { lng, lat }, anchorPoint: 'CENTER' }" class="w-8">
    <CryptocityMarker :cryptocity="city" />
  </CustomMarker> -->

  <template v-if="zoom > 15">
    <CustomMarker
      v-for="({ position, e }) in [{ position: { lat: 10.455694, lng: -84.676981 }, e: '🦥' }, { position: { lat: 19.260062, lng: 98.904358 }, e: '🐘' }, { position: { lng: -73.528486, lat: 45.503334 }, e: '🦫' }]"
      :key="e" :options="{ position, anchorPoint: 'CENTER' }">
      <div grid="~ place-content-center" text-24 p-8 rounded-full bg-neutral-0 shadow aspect-square>
        {{ e }}
      </div>
    </CustomMarker>
  </template>
</template>
