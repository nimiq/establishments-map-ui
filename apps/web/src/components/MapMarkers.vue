<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CustomMarker } from 'vue3-google-map'
import ClusterMarkers from './ClusterMarkers.vue'
import SingleMarkers from './SingleMarkers.vue'
import CryptocityMarker from './CryptocityMarker.vue'
import { useMarkers } from '@/stores/markers'
import { useMap } from '@/stores/map'
import { useCryptocities } from '@/stores/cryptocities'

const { clusters, singles } = storeToRefs(useMarkers())
const { cryptocitiesSingles } = storeToRefs(useCryptocities())

const { zoom } = storeToRefs(useMap())
</script>

<template>
  <ClusterMarkers :clusters="clusters" />
  <SingleMarkers :singles="singles" />

  <CustomMarker
    v-for="({ city, lat, lng }) in cryptocitiesSingles.filter(c => c.showCardAtZoom + 4 > zoom)"
    :key="city"
    :options="{ position: { lng, lat }, anchorPoint: 'CENTER' }"
    class="w-8"
  >
    <CryptocityMarker :cryptocity="city" />
  </CustomMarker>
</template>
