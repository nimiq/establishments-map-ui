<script setup lang="ts">
const { singles } = storeToRefs(useMarkers())
const { zoom } = storeToRefs(useMap())
const SingleMarkersDesktop = defineAsyncComponent(() => import('./SingleMarkersDesktop.vue'))

const { browserPositionIsSupported, browserPosition } = useGeoIp()
</script>

<template>
  <SingleMarkersDesktop v-if="!isMobile" />
  <CustomMarker
    v-for="location in singles" v-else :key="location.uuid"
    :options="{ position: { lng: location.lng, lat: location.lat } }" data-custom-marker
  >
    <SingleMarker :location />
  </CustomMarker>

  <ClusterMarkers />

  <!-- User Position Marker -->
  <CustomMarker
    v-if="browserPositionIsSupported && browserPosition && browserPosition.accuracy < 1000 && browserPosition.accuracy > 0"
    :options="{ position: { lng: browserPosition.center.lng, lat: browserPosition.center.lat } }" data-custom-marker
  >
    <UserLocationMarker :accuracy="browserPosition.accuracy" :zoom />
  </CustomMarker>

  <!-- Looks like you are about to find something interesting... -->
  <template v-if="zoom > 15">
    <CustomMarker
      v-for="({ lat, lng, e }) in [{ lat: 10.455694, lng: -84.676981, e: '🦥' }, { lat: 19.260062, lng: 98.904358, e: '🐘' }, { lng: -73.528486, lat: 45.503334, e: '🦫' }]"
      :key="e" :options="{ position: { lat, lng }, anchorPoint: 'CENTER' }"
    >
      <div centered aspect-square rounded-full bg-neutral-0 p-8 text-24 shadow>
        {{ e }}
      </div>
    </CustomMarker>
  </template>
</template>
