<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CustomMarker } from 'vue3-google-map'
import { useCluster } from '@/stores/cluster'
import { useMap } from '@/stores/map'
import type { Point } from '@/types'

const { clusters, clusterAlgorithm } = storeToRefs(useCluster())

const { setPosition, zoom } = useMap()

function onClusterClick(center: Point, clusterId: number) {
  if (!clusterAlgorithm.value)
    return

  // If zoom is lower than 13, the minimum zoom change must be 3
  // To make it more fluid
  const proposedZoom = clusterAlgorithm.value.getClusterExpansionZoom(clusterId)
  const newZoom = proposedZoom < 13 ? Math.max(proposedZoom, zoom() + 3) : proposedZoom

  setPosition({
    center,
    zoom: newZoom,
  })
}

const showName = (count: number) => count === 1 && zoom() >= 8
</script>

<template>
  <CustomMarker
    v-for="({ center, count, clusterId, name }, i) in clusters" :key="i"
    :options="{ position: center, anchorPoint: showName(count) ? 'LEFT_CENTER' : 'CENTER' }"
  >
    <div v-if="count === 1" class="flex items-center gap-x-2 max-w-[176px] z-10">
      <div class="grid w-3 h-3 text-sm font-bold text-white rounded-full shadow ring-white/40 ring-2 place-content-center bg-space" />
      <!-- TODO Make the text-border white -->
      <span v-if="showName(count)" class="text-base font-semibold leading-none text-space" style="text-shadow: 0px 0px 4px white;">{{ name }}</span>
    </div>
    <div v-else class="grid text-sm font-bold text-white rounded-full shadow cursor-pointer aspect-square place-content-center bg-space ring-white/20 ring-2 ring-offset-1 ring-offset-white/40" :style="`width: clamp(24px, ${0.24 * count + 24}px, 48px); font-size: clamp(14px, ${0.14 * count + 4}px, 18px)`" @click="onClusterClick(center, clusterId)">
      {{ count < 100 ? count : '99+' }}
    </div>
  </CustomMarker>
</template>
