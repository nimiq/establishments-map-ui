<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { CryptocityData } from 'types'
import type { PropType } from 'vue'
import { useMap } from '@/stores/map'
import CryptocityIcon from '@/components/icons/icon-cryptocity.vue'

defineProps({
  cryptocity: {
    type: Object as PropType<CryptocityData>,
    required: true,
  },
})

const { setPosition } = useMap()
const { zoom } = storeToRefs(useMap())

function onCryptocityClick({ lat, lng }: CryptocityData) {
  const cardTrigger = (document.querySelector('[data-cryptocity-card]') as HTMLElement)
  if (cardTrigger)
    cardTrigger.click()
  setPosition({ center: { lat, lng }, zoom: 13 })
}
</script>

<template>
  <div
    v-if="zoom <= 14"
    class="absolute top-0 z-0 grid p-1 bg-white rounded-full shadow cursor-pointer clickable-sm aspect-square place-content-center"
    @click="onCryptocityClick(cryptocity)"
  >
    <CryptocityIcon class="w-full" />
  </div>
</template>
