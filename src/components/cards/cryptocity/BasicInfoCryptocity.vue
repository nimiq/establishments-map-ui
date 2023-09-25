<script setup lang="ts">
import type { Component, PropType } from 'vue'
import CryptocityIcon from '@/components/icons/icon-cryptocity.vue'

defineProps({
  // cryptocity: {
  //   type: Object as PropType<CryptocityCluster>,
  //   required: true,
  // },
  icon: {
    type: Object as PropType<Component>,
  },
})

defineEmits({
  iconClick: (_: MouseEvent) => true,
})
</script>

<template>
  <div class="flex items-center gap-x-2">
    <CryptocityIcon class="w-[31px] h-[27px]" />
    <div>
      <h3 class="text-base text-space">cryptocity.name</h3>
      <span class="w-40 text-sm text-space/60 animate-pulse bg-space/20 rounded-xs">{{ $tc('{count} locations', -1) }}</span>
    </div>
    <component :is="icon" class="text-[#C9CAD3] p-1 w-6 h-6 ml-auto transition hover:bg-space/10 focus-visible:bg-space/10 rounded-full" data-cryptocity-trigger @click="$emit('iconClick', $event)" />
  </div>
</template>
