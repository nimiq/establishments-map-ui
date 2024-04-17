<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Controls from '@/components/elements/Controls.vue'
import DesktopList from '@/components/elements/DesktopList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import TheMapInstance from '@/components/elements/TheMapInstance.vue'
import { useApp } from '@/stores/app'
import { useMarkers } from '@/stores/markers'
import { useMap } from '@/stores/map'
import { useToggle } from '@vueuse/core'

const { isListShown } = storeToRefs(useApp())
const { singlesInView, clustersInView, maxZoomFromServer } = storeToRefs(useMarkers())
const { zoom } = storeToRefs(useMap())

const openSuggestions = ref(false)

const toggleList = useToggle(isListShown)
</script>

<template>
  <TheMapInstance w-screen h-screen />
  <!-- Shadow -->
  <div
    :class="{ 'translate-x-0 delay-100 duration-500 opacity-20': isListShown, '-translate-x-full duration-1000 delay-75 opacity-0': !isListShown }"
    absolute inset-0 max-w-368 transition="[transform,opacity]" will-change-transform pointer-events-none bg-gradient-to-r from-neutral to-transparent
  />
  <aside absolute max-w-384 inset-24 right-initial h-max pointer-events-none children:pointer-events-auto flex="~ col">
    <!-- This element if for the shadow in the header. We cannot use a normal shadow because the use of mask-image restrict us of using shadows -->
    <div class="absolute inset-0 shadow rounded-16 pointer-events-none h-[calc(64px+(88px*var(--search-box-hint)))]" />
    <div w-max duration-75 bg-neutral-0 ring-neutral-100 shadow-header transition-border-radius :class="openSuggestions && !isListShown ? 'rounded-t-16' : 'rounded-16'" style="mask-image: linear-gradient(white, white);">
      <InteractionBar @open="openSuggestions = $event" />
      <DesktopList :singles="singlesInView" :clusters="clustersInView" :list-is-shown="isListShown" />
    </div>
    <button mt-12 pill-tertiary pill-sm ring-neutral-50 z-10 flex="~ gap-8" @click="() => toggleList()">
      <div i-nimiq:chevron-down :class="{ 'rotate-180': isListShown }" text="10 op-70" transition="transform delay-500" />	 
      {{ $t(isListShown ? 'Hide list' : 'Show list') }} 
    </button>
  </aside>
  <FilterModal v-if="maxZoomFromServer < zoom" absolute top-24 right-24 />
  <Controls absolute bottom-24 right-24 />
</template>
