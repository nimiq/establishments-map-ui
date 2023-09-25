<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Cluster, CryptocityData, CryptocityMarker, Point } from 'types'
import { CustomMarker } from 'vue3-google-map'
import type { PropType } from 'vue'
import { createReusableTemplate } from '@vueuse/core'
import { useMap } from '@/stores/map'
import CryptocityIcon from '@/components/icons/icon-cryptocity.vue'

defineProps({
  clusters: {
    type: Object as PropType<Cluster[]>,
    required: true,
  },
  cryptocities: {
    type: Object as PropType<CryptocityMarker>,
    required: true,
  },
})

const [DefineCluster, ReuseCluster] = createReusableTemplate<{ cluster: Cluster }>()
const [DefineCryptocity, ReuseCryptocity] = createReusableTemplate<{ cryptocity: CryptocityData; list?: { diameter: number; index: number } }>()

const { setPosition } = useMap()
const { zoom } = storeToRefs(useMap())

// Since the Desktop requires a Popover, we need to create a reusable template where the trigger is the same component
// as in the mobile version, but without the Popover

function onClusterClick(center: Point, proposedZoom: number) {
  // To make it more fluid if zoom is lower than 13, the minimum zoom change must be 3
  const newZoom = proposedZoom < 13 ? Math.max(proposedZoom, zoom.value + 3) : proposedZoom
  setPosition({ center, zoom: newZoom })
}

function onCryptocityClick(center: Point) {
  const cardTrigger = (document.querySelector('[data-cryptocity-card]') as HTMLElement)
  if (cardTrigger)
    cardTrigger.click()
  setPosition({ center, zoom: 13 })
}
</script>

<template>
  <DefineCluster v-slot="{ cluster: { count, diameter } }">
    <div class="grid text-sm font-bold text-white transition-colors rounded-full shadow cursor-pointer aspect-square place-content-center bg-space hover:bg-[#35395A] focus:bg-[#35395A] ring-white/20 ring-2 ring-offset-1 ring-offset-white/40 max-desktop:clickable" :style="`width: ${diameter}px; font-size: clamp(14px, ${0.14 * count + 4}px, 18px)`">
      {{ count < 100 ? count : '99+' }}
    </div>
  </DefineCluster>

  <DefineCryptocity v-slot="{ list, cryptocity: { centroid } }">
    <div
      v-if="zoom <= 14"
      class="absolute top-0 z-0 grid p-1 bg-white rounded-full shadow cursor-pointer clickable-sm aspect-square place-content-center"
      :style="`width: ${list?.diameter || 32}px; --index: ${list?.index}`" :class="list && 'transition-transform scale-[0.85] translate-x-[calc(var(--index)*12px)] group-hover:scale-100 group-hover:translate-x-[calc(100%*var(--index)+var(--index)*8px)]'" @click="onCryptocityClick(centroid)"
    >
      <CryptocityIcon
        class="w-full"
        :class="list && 'transition-transform translate-x-0.5 group-hover:translate-x-0 -rotate-45 group-hover:rotate-0'"
      />
    </div>
  </DefineCryptocity>

  <CustomMarker
    v-for="({ lat, lng, count, expansionZoom, diameter, id }) in clusters"
    :key="id"
    :options="{ position: { lat, lng }, anchorPoint: 'CENTER' }"
    data-custom-marker
    :class="cryptocities.get(id) !== undefined && 'z-10'"
  >
    <ReuseCluster v-if="cryptocities.get(id) === undefined" :cluster="{ lat, lng, count, expansionZoom, diameter, id }" @click="onClusterClick({ lat, lng }, expansionZoom)" />

    <ul v-else class="relative group [--hover:0] hover:[--hover:1]" :style="`padding-right: calc(var(--hover) * ${diameter * cryptocities.get(id)!.length + 8}px)`">
      <li class="relative z-10"><ReuseCluster :cluster="{ lat, lng, count, expansionZoom, diameter, id }" @click="onClusterClick({ lat, lng }, expansionZoom)" /></li>

      <li v-for="(city, index) in cryptocities.get(id)" :key="city.cryptocity">
        <ReuseCryptocity :cryptocity="city" :list="{ diameter, index: cryptocities.get(id)!.length - index }" class="animate-cryptocity clickable" />
      </li>
    </ul>
  </CustomMarker>

  <CustomMarker
    v-for="city in cryptocities.get(-1)"
    :key="city.cryptocity"
    :options="{ position: { ...city.centroid }, anchorPoint: 'CENTER' }"
  >
    <ReuseCryptocity :cryptocity="city" />
  </CustomMarker>
</template>
