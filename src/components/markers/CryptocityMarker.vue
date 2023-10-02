<script setup lang="ts">
import type { Cryptocity, CryptocityData } from 'types'
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMap } from '@/stores/map'
import CryptocityIcon from '@/components/icons/icon-cryptocity.vue'
import { useCryptocities } from '@/stores/cryptocities'

const props = defineProps({
  cryptocity: {
    type: Object as PropType<Cryptocity>,
    required: true,
  },
})

const { cryptocities } = storeToRefs(useCryptocities())
const cryptocity = computed(() => cryptocities.value.data[props.cryptocity]!)

const { setPosition } = useMap()

const router = useRouter()
const route = useRoute()

function onCryptocityClick() {
  const { lat, lng, name, showCardAtZoom } = cryptocity.value as CryptocityData
  const cardTrigger = (document.querySelector('[data-cryptocity-card]') as HTMLElement)
  if (cardTrigger)
    cardTrigger.click()
  setPosition({ center: { lat, lng }, zoom: showCardAtZoom })
  router.push({ query: { ...route.query, cryptocity: name } })
}
</script>

<template>
  <div
    class="grid p-1 bg-white rounded-full shadow cursor-pointer group/city clickable-sm aspect-square place-content-center"
    @click="onCryptocityClick()"
  >
    <div class="absolute inset-0 duration-400 transition-[background-color] rounded-full group-hover/city:bg-space/[0.06] group-focus-visible/city:bg-space/[0.06]" />
    <CryptocityIcon class="w-full" />
  </div>
</template>
