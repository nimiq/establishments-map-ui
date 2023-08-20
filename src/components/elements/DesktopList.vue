<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BasicInfo from '@/components/elements/BasicInfo.vue'
import CardBg from '@/components/elements/CardBg.vue'
import { useLocations } from '@/stores/locations'

const locationsStore = useLocations()
const { locations } = storeToRefs(locationsStore)
</script>

<template>
  <ul class="overflow-auto scroll-space">
    <li
      v-for="(location, i) in locations" :key="i"
      class="relative px-6 py-5 overflow-hidden border-space/10 border-t-xs group/card [&_[data-rings]]:-rotate-90"
      :style="`background: ${location.isDark ? location.bg : 'white'}`"
    >
      <CardBg v-if="location.isAtm" :progress="0" :location="location" />
      <BasicInfo :location="location" />
    </li>
  </ul>
</template>
