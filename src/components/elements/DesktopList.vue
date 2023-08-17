<script setup lang="ts">
import type { PropType } from 'vue'
import { CardLayout } from './Card.vue'
import { Theme, providersAssets } from '@/assets-dev/provider-assets'
import BasicInfo from '@/components/elements/BasicInfo.vue'
import CardBg from '@/components/elements/CardBg.vue'
import type { Location } from '@/database'

defineProps({
  locations: {
    type: Array as PropType<Location[]>,
    required: true,
  },
})

const layout = ({ category }: Location) => category === 'cash' ? CardLayout.Atm : CardLayout.Location
const asset = ({ provider }: Location) => providersAssets[provider]
function bgColor(e: Location) {
  return {
    background: [Theme.FullCardDark, Theme.FullCardLight].includes(asset(e).theme) ? asset(e).bg : 'white',
  }
}
</script>

<template>
  <ul class="flex flex-col w-80">
    <li
      v-for="(l, i) in locations" :key="i"
      class="relative px-6 py-5 overflow-hidden bg-white border-space/10 border-t-xs group/card [&_[data-rings]]:-rotate-90"
      :style="bgColor(l)"
    >
      <CardBg v-if="layout(l) === CardLayout.Atm" :layout="layout(l)" :progress="0" :provider-assets="asset(l)" />
      <BasicInfo :location="l" :layout="layout(l)" :theme="asset(l).theme" />
    </li>
  </ul>
</template>
