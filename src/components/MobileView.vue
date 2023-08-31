<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import TheMapInstance from '@/components/elements/TheMapInstance.vue'
import MobileList from '@/components/elements/MobileList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import Controls from '@/components/elements/Controls.vue'
import { useCluster } from '@/stores/cluster'

const { singles } = storeToRefs(useCluster())
const isListShown = computed(() => singles.value.length > 0)
</script>

<template>
  <div class="flex flex-col h-screen">
    <InteractionBar />
    <TheMapInstance class="relative flex-1" />
    <FilterModal class="absolute top-24 right-5" />
    <Controls class="absolute bottom-6 right-6" :class="{ hidden: isListShown }" />
    <MobileList :locations="singles" class="absolute bottom-0 w-full" />
  </div>
</template>
