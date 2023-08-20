<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import BasicInfo from '@/components/elements/BasicInfo.vue'
import CardBg from '@/components/elements/CardBg.vue'
import { useLocations } from '@/stores/locations'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const locationsStore = useLocations()
const { locations } = storeToRefs(locationsStore)
</script>

<template>
  <!-- We use DynamicScroller because the height of the items depends on the amount of data they have -->
  <DynamicScroller
    key-field="uuid"
    :items="locations"
    :min-item-size="40"
    list-tag="ul"
    item-tag="ul"
    class="h-full overflow-auto scroll-space"
  >
    <template #default="{ item: location, index, active }">
      <DynamicScrollerItem
        :item="location"
        :active="active"
        :data-index="index"
        class="relative px-6 py-5 overflow-hidden border-space/10 border-t-xs group/card [&_[data-rings]]:-rotate-90"
        :style="`background: ${location.isDark ? location.bg : 'white'}`"
      >
        <CardBg v-if="location.isAtm" :progress="0" :location="location" />
        <BasicInfo :location="location" />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
