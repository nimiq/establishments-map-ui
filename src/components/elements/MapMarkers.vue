<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CustomMarker } from 'vue3-google-map'
import { useCluster } from '@/stores/cluster'

const { clusters } = storeToRefs(useCluster())
</script>

<template>
  <CustomMarker
    v-for="({ center: position, count }, i) in clusters" :key="i"
    :options="{ position, anchorPoint: 'CENTER' }"
  >
    <div v-if="count === 1" class="grid w-4 h-4 text-sm font-bold text-white rounded-full shadow ring-white/40 ring-2 place-content-center bg-space" />
    <div v-else class="grid w-8 h-8 text-sm font-bold text-white rounded-full shadow aspect-square place-content-center bg-space ring-white/20 ring-2 ring-offset-1 ring-offset-white/40">
      {{ count }}
    </div>
  </CustomMarker>
</template>
