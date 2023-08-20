<script setup lang="ts">
import { storeToRefs } from 'pinia'
import TheMapInstance from '@/components/TheMapInstance.vue'
import DesktopList from '@/components/elements/DesktopList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import { useLocations } from '@/stores/locations'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import Controls from '@/components/elements/Controls.vue'

const locationsStore = useLocations()
const { locations } = storeToRefs(locationsStore)
</script>

<template>
  <TheMapInstance class="relative flex flex-col w-screen h-screen" :locations="locations">
    <div class="absolute flex-1 bg-white top-6 left-6 rounded-2xl shadow-header">
      <InteractionBar />
      <DesktopList />
    </div>
    <FilterModal class="absolute top-6 right-6" />
    <Controls class="absolute bottom-6 right-6" />
  </TheMapInstance>
</template>
