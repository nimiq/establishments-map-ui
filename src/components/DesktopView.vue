<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Controls from '@/components/elements/Controls.vue'
import DesktopList from '@/components/elements/DesktopList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import TheMapInstance from '@/components/elements/TheMapInstance.vue'
import IconChevronDown from '@/components/icons/icon-chevron-down.vue'
import { useApp } from '@/stores/app'
import { useCluster } from '@/stores/cluster'

const { firstLocationsLoaded, isListShown } = storeToRefs(useApp())
const { singlesInView, clustersInView } = storeToRefs(useCluster())

const openSuggestions = ref(false)
</script>

<template>
  <TheMapInstance class="relative flex flex-col w-screen h-screen" />
  <!-- Shadow -->
  <div
    :class="{ 'translate-x-0 delay-100 duration-500 opacity-20': isListShown, '-translate-x-full duration-1000 delay-75 opacity-0': !isListShown }"
    class="absolute inset-0 max-w-[368px] transition-[transform,opacity] will-change-transform pointer-events-none bg-gradient-to-r from-space to-space/0"
  />
  <aside class="absolute flex flex-col max-w-xs bottom-6 top-6 left-6 h-max pointer-events-none [&>*]:pointer-events-auto">
    <!-- This element if for the shadow in the header. We cannot use a normal shadow because the use of mask-image restrict us of using shadows -->
    <div class="absolute inset-0 shadow rounded-2xl pointer-events-none h-[calc(64px+(88px*var(--search-box-hint)))]" />
    <div class="duration-75 bg-white shadow-header transition-border-radius" :class="openSuggestions && !isListShown ? 'rounded-t-2xl' : 'rounded-2xl'" style="mask-image: linear-gradient(white, white);">
      <InteractionBar @open="openSuggestions = $event" />
      <DesktopList :singles="singlesInView" :clusters="clustersInView" :list-is-shown="isListShown" />
    </div>
    <Button bg-color="white" :loading="!firstLocationsLoaded" class="mt-6 shadow" @click="isListShown = !isListShown">
      <template v-if="firstLocationsLoaded" #icon>
        <IconChevronDown :class="{ 'rotate-180': isListShown }" class="transition-transform delay-500" />
      </template>
      <template #label>{{ $t(!firstLocationsLoaded ? 'Loading' : isListShown ? 'Hide list' : 'Show list') }}</template>
    </Button>
  </aside>
  <FilterModal class="absolute top-6 right-6" />
  <Controls class="absolute bottom-6 right-6" />
</template>
