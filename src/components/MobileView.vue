<script setup lang="ts">
import { storeToRefs } from 'pinia'
import TheMapInstance from '@/components/TheMapInstance.vue'
import MobileList from '@/components/elements/MobileList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import { useLocations } from '@/stores/locations'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import Controls from '@/components/elements/Controls.vue'

const locationsStore = useLocations()
const { locationsInView } = storeToRefs(locationsStore)
</script>

<template>
  <div class="flex flex-col h-screen">
    <InteractionBar />

    <TheMapInstance class="relative flex-1" :locations="locationsInView">
      <FilterModal class="absolute top-6 right-6" />
      <Controls class="absolute bottom-6 right-6" />
      <MobileList :locations="locationsInView" class="absolute bottom-0 w-full" />
    </TheMapInstance>
  </div>
</template>
