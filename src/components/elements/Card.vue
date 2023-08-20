<script setup lang="ts">
import { type PropType, computed, defineAsyncComponent } from 'vue'
import CryptoList from '@/components/atoms/CryptoList.vue'
import BasicInfo from '@/components/elements/BasicInfo.vue'
import CardBg from '@/components/elements/CardBg.vue'
import { type Location, Provider } from '@/types'

const props = defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
})

const ProviderBanner = defineAsyncComponent(() => import('@/components/elements/ProviderBanner.vue'))
const showProviderBanner = computed(() => props.location.provider !== Provider.Default)
</script>

<template>
  <div class="relative overflow-hidden rounded-lg duration-[--duration,0] group/card" :style="`background: ${location.bgFullCard ? location.bg : 'white'}`">
    <CardBg
      v-if="location.provider !== Provider.Default" :location="location"
      :progress="progress"
    />

    <div
      v-if="location.photo" class="pt-1.5 px-1.5 transition-height duration-[--duration]"
      :style="`height: ${progress * 184}px;`"
    >
      <img class="object-cover w-full h-full rounded-sm" :src="location.photo" alt="">
    </div>

    <div class="px-6 py-5 space-y-5">
      <BasicInfo :location="location" :progress="progress" />

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform translate-y-3 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-75 ease-out" leave-from-class="transform opacity-100"
        leave-to-class="transform translate-y-3 opacity-0"
      >
        <template v-if="progress > 0.5 && location.accepts.length > 0 && location.sells.length > 0">
          <div
            class="grid grid-flow-col grid-cols-[auto,auto] grid-rows-[auto,1fr] gap-y-1 gap-x-2 w-max h-max relative z-20"
          >
            <h5 class="text-xs text-white/60">
              {{ $t('Buy') }}
            </h5>
            <CryptoList :cryptos="location.accepts" />
            <h5 class="text-xs text-white/60">
              {{ $t('Sell') }}
            </h5>
            <CryptoList :cryptos="location.sells" />
          </div>
        </template>
        <template v-else>
          <CryptoList :cryptos="[...new Set(location.accepts.concat(location.sells))]" class="relative z-20" />
        </template>
      </transition>
    </div>

    <ProviderBanner
      v-if="progress > 0 && showProviderBanner && location.provider !== Provider.Default" :location="location"
      class="absolute w-full rounded-b-lg -mt-9"
      :style="`backgroundColor: ${location.isShop ? location.bg : 'transparent'}; opacity: ${progress / 0.8}; bottom: -${(1 - progress) * 54}px;`"
    />
  </div>
</template>

<style scoped>
.zoom-in {
  animation: zoomIn 400ms cubic-bezier(0.4, 0, 0.31, 1.3);
}

@keyframes zoomIn {
  0% {
    transform: scale(0)
  }

  100% {
    transform: scale(1)
  }
}
</style>
