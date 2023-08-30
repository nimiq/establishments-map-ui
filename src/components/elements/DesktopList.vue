<script setup lang="ts">
import type { PropType } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import BasicInfo from '@/components/elements/BasicInfo.vue'
import CardBg from '@/components/elements/CardBg.vue'
import type { Location } from '@/types'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

defineProps({
  locations: {
    type: Array as PropType<Location[]>,
    required: true,
  },
  listIsShown: {
    type: Boolean,
    default: true,
  },
})

function onLocationClicked({ uuid }: Location) {
  (document.querySelector(`[data-trigger-uuid=${uuid}]`) as HTMLElement)?.click()
}

// const heights = {
//   border: 0.8,
//   py: 20 * 2,
//   title: 20.8 + 4,
//   categoryAndRating: 16,
//   buyAndSell: 16,
//   address: 18,
// } as const

// function getPoolType(l: Location): Location & { itemSize: number } {
//   let itemSize = heights.border + heights.py + heights.title + (l.address ? heights.address : 0)
//   if (!l.isAtm)
//     itemSize += l.category || l.rating ? heights.categoryAndRating : 0
//   else if (l.isAtm)
//     itemSize += heights.buyAndSell

//   return Object.assign(l, { itemSize })
// }
</script>

<template>
  <RecycleScroller
    key-field="uuid"
    :items="locations"
    :item-size="99"
    list-tag="ul"
    item-tag="li"
    :class="`overflow-auto scroll-space transition-[height] will-change-[height] ${listIsShown ? 'h-[calc(100vh-10.5rem)]' : 'h-0'}`"
    item-class="relative overflow-hidden border-space/10 border-t-xs group/card [&_[data-rings]]:-rotate-90"
  >
    <template #default="{ item: location }">
      <button
        class="w-full px-6 py-5 text-left"
        :style="`background: ${location.isAtm && location.isDark ? location.bg : 'white'}`"
        @click="onLocationClicked(location)"
      >
        <CardBg v-if="location.isAtm" :location="location" :with-gradient="false" class="translate-y-1" />
        <BasicInfo :location="location" />
      </button>
    </template>
  </RecycleScroller>
</template>
