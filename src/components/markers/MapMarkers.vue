<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ClusterMarkers from './ClusterMarkers.vue'
import SingleMarkers from './SingleMarkers.vue'
import { useMarkers } from '@/stores/markers'
import { useCryptocity } from '@/stores/cryptocity'

const { clusters, singles } = storeToRefs(useMarkers())
const { cryptocities } = storeToRefs(useCryptocity())

// const { zoom } = storeToRefs(useMap())
</script>

<template>
  <ClusterMarkers :clusters="clusters" :cryptocities="cryptocities" />
  <SingleMarkers :singles="singles" />
  <!-- <CryptocityMarkers v-if="zoom <= 12" :cryptocities="cryptocities" /> -->
</template>
