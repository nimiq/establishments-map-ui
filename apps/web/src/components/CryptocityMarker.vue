<script setup lang="ts">
import type { Cryptocity, CryptocityData } from 'types'

const props = defineProps<{ cryptocity: Cryptocity}>()

const { cryptocities } = storeToRefs(useCryptocities())
const cryptocity = computed(() => cryptocities.value.data[props.cryptocity]!)

const { setPosition } = useMap()

const router = useRouter()
const route = useRoute()

function onCryptocityClick() {
  const { lat, lng, name, showCardAtZoom } = cryptocity.value as CryptocityData
  setPosition({ center: { lat, lng }, zoom: showCardAtZoom }, { clearMarkers: true })
  router.push({ query: { ...route.query, cryptocity: name } })
}
</script>

<template>
  <div grid="~ place-content-center" p-4 bg-neutral-0 rounded-full shadow cursor-pointer aspect-square  @click="onCryptocityClick()">
    <div absolute inset-0 duration-400 transition-background-color rounded-full group-hocus="bg-neutral/6" />
    <div i-nimiq:logos-cryptocity />
  </div>
</template>
