<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import TheMapInstance from '@/components/elements/TheMapInstance.vue'
import Controls from '@/components/elements/Controls.vue'
import DesktopList from '@/components/elements/DesktopList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import ShowListButton from '@/components/elements/ShowListButton.vue'
import { useCluster } from '@/stores/cluster'
import { useApp } from '@/stores/app'

const { firstLocationsLoaded } = storeToRefs(useApp())
const { singles, clusters } = storeToRefs(useCluster())

const listIsShown = ref(false)

const openSuggestions = ref(false)
</script>

<template>
  <TheMapInstance class="relative flex flex-col w-screen h-screen" />
  <div
    v-for="i in 2" :key="i"
    :class="{ 'translate-x-0 delay-100 duration-500 opacity-10': listIsShown, '-translate-x-full duration-1000 delay-75 opacity-0': !listIsShown }"
    class="absolute inset-0 max-w-[368px] transition-[transform,opacity] will-change-transform pointer-events-none bg-gradient-to-r from-space to-space/0"
  />
  <aside class="absolute flex flex-col max-w-xs bottom-6 top-6 left-6 h-max pointer-events-none [&>*]:pointer-events-auto">
    <div class="duration-75 bg-white shadow-header transition-border-radius" :class="openSuggestions ? 'rounded-t-2xl' : 'rounded-2xl'" style="mask-image: linear-gradient(white, white);">
      <InteractionBar @open="openSuggestions = $event" />
      <DesktopList :locations="singles" :clusters="clusters" :list-is-shown="listIsShown" />
    </div>
    <ShowListButton :first-locations-loaded="firstLocationsLoaded" :list-is-shown="listIsShown" class="mt-6" @click="listIsShown = !listIsShown" />
  </aside>
  <FilterModal class="absolute top-6 right-6" />
  <Controls class="absolute bottom-6 right-6" />
</template>
