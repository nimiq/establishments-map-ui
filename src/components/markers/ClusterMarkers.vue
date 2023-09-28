<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import type { Cluster, Point } from 'types'
import type { PropType } from 'vue'
import { CustomMarker } from 'vue3-google-map'
import CryptocityMarker from './CryptocityMarker.vue'
import { useMap } from '@/stores/map'
import { useCryptocities } from '@/stores/cryptocities'

defineProps({
  clusters: {
    type: Object as PropType<Cluster[]>,
    required: true,
  },
})

const [DefineCluster, ReuseCluster] = createReusableTemplate<{ cluster: Cluster }>()

const { setPosition } = useMap()
const { zoom } = storeToRefs(useMap())
const { cryptocities: allCryptocities } = storeToRefs(useCryptocities())

function onClusterClick(center: Point, proposedZoom: number) {
  // To make it more fluid if zoom is lower than 13, the minimum zoom change must be 3
  const newZoom = proposedZoom < 13 ? Math.max(proposedZoom, zoom.value + 3) : proposedZoom
  setPosition({ center, zoom: newZoom })
}
</script>

<template>
  <DefineCluster v-slot="{ cluster: { count, diameter } }">
    <div class="grid text-sm font-bold text-white transition-colors rounded-full shadow cursor-pointer aspect-square place-content-center bg-space hover:bg-[#35395A] focus:bg-[#35395A] ring-white/20 ring-2 ring-offset-1 ring-offset-white/40 max-desktop:clickable" :style="`width: ${diameter}px; font-size: clamp(14px, ${0.14 * count + 4}px, 18px)`">
      {{ count < 100 ? count : '99+' }}
    </div>
  </DefineCluster>

  <CustomMarker
    v-for="({ lat, lng, count, expansionZoom, diameter, id, cryptocities }) in clusters"
    :key="id"
    :options="{ position: { lat, lng }, anchorPoint: 'CENTER' }"
    data-custom-marker
    :class="cryptocities.length > 0 && 'z-10'"
  >
    <ReuseCluster v-if="cryptocities.length > 0" :cluster="{ lat, lng, count, expansionZoom, diameter, id, cryptocities }" @click="onClusterClick({ lat, lng }, expansionZoom)" />

    <ul v-else class="relative group [--hover:0] hover:[--hover:1]" :style="`padding-right: calc(var(--hover) * ${diameter * cryptocities.length + 8}px)`">
      <li class="relative z-10"><ReuseCluster :cluster="{ lat, lng, count, expansionZoom, diameter, id, cryptocities }" @click="onClusterClick({ lat, lng }, expansionZoom)" /></li>

      <li v-for="city in cryptocities" :key="city">
        <!-- TODO Add classes -->
        <CryptocityMarker v-if="!!allCryptocities.data[city]" :cryptocity="allCryptocities.data[city]!" />
      </li>
    </ul>
  </CustomMarker>
</template>
<!-- transition-transform scale-[0.85] translate-x-[calc(var(--index)*12px)] group-hover:scale-100 group-hover:translate-x-[calc(100%*var(--index)+var(--index)*8px)] -->

<!-- transition-transform translate-x-0.5 group-hover:translate-x-0 -rotate-45 group-hover:rotate-0' -->
