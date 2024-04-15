<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import type { Location } from 'types'
import LocationSocialButton from '@/components/elements/LocationSocialButton.vue'
import CryptoList from '@/components/atoms/CryptoList.vue'
import BasicInfo from '@/components/cards/location/BasicInfoLocation.vue'
import CardBg from '@/components/cards/location/LocationCardBg.vue'
import Banner from '@/components/elements/Banner.vue'
import CardDotsMenu from '@/components/cards/location/LocationCardDotsMenu.vue'
import { breakpointsTailwind } from '@vueuse/core'

defineProps<{ location: Location, progress: number }>()

const isMobile = useBreakpoints(breakpointsTailwind).smaller('md')

function arrayEquals(arrA: string[], arrB: string[]): boolean {
  return arrA.length === arrB.length && arrA.every((value, index) => value === arrB[index])
}
</script>

<template>
  <div
    class="relative rounded-lg duration-[--duration,0] group/card h-full select-none"
    :class="{
      'rounded-b-0': progress === 1 && isMobile,
      'overflow-hidden': isMobile,
      'select-auto': progress === 1 || !isMobile,
    }"
    :style="`background: ${location.isAtm ? location.bg[0] : 'white'}`"
  >
    <CardBg v-if="location.isAtm" :location="location" />

    <div
      v-if="location.photo && progress > 0" class="pt-1.5 px-1.5 transition-height duration-[--duration]"
      :style="`height: ${progress * 184}px;`"
    >
      <img
        class="object-cover w-full h-full rounded-sm animate-pulse "
        :class="location.isAtm && location.isDark ? 'bg-white/60' : 'bg-space/10'"
        :src="location.photo"
        :alt="$tc('Picture of {name}', { name: location.name })"
        draggable="false"
        @load="($event.target as HTMLImageElement).classList.remove('animate-pulse')"
      >
    </div>

    <div class="relative px-6 py-5 space-y-5">
      <BasicInfo :location="location" :progress="progress" />
      <CardDotsMenu v-if="progress === 1" :location="location" class="absolute top-0 right-4" />

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform translate-y-3 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-75 ease-out" leave-from-class="transform opacity-100"
        leave-to-class="transform translate-y-3 opacity-0"
      >
        <template v-if="progress > 0.5 && location.accepts.length && location.sells.length && !arrayEquals(location.accepts, location.sells)">
          <div
            class="grid grid-flow-col grid-cols-[auto,auto] grid-rows-[auto,1fr] gap-y-1 gap-x-2 w-max h-max relative z-20"
          >
            <h5 class="text-xs text-white/60">
              {{ $t('Buy') }}
            </h5>
            <CryptoList :cryptos="location.sells" />
            <h5 class="text-xs text-white/60">
              {{ $t('Sell') }}
            </h5>
            <CryptoList :cryptos="location.accepts" />
          </div>
        </template>
        <template v-else>
          <CryptoList :cryptos="[...new Set(location.accepts.concat(location.sells))]" class="relative z-20" />
        </template>
      </transition>
    </div>

    <transition name="scale">
      <LocationSocialButton v-if="location.photo && location.url && progress > 0.5" :location="location" class="absolute z-20 top-4 right-4" />
    </transition>

    <Banner
      v-if="progress > 0 && location.banner !== 'None'" :location="location"
      class="absolute max-desktop:w-screen -mt-9"
      :class="{ 'rounded-b-lg': progress < 1 || !isMobile }"
      :style="{
        backgroundColor: !location.isAtm ? location.bg[0] : 'transparent',
        opacity: progress / 0.8,
        bottom: `-${(1 - progress) * 70}px`, // the height is 54, we add 16px to delay the animation
        left: `calc(${1 - progress} * var(--initial-gap-to-screen) * -1)`, // make the provider grow in a vertical line
        padding: `0 calc(${(1 - progress)} * var(--initial-gap-to-screen))`, // delay the animation
      }"
    />
  </div>
</template>

<style scoped>
.scale-enter-active {
  animation: icon-in 200ms ease-out;
}

.scale-leave-active {
  animation: icon-in 150ms ease-in reverse;
  opacity: 0;
}

@keyframes icon-in {
  0% {
    transform: scale(0.75);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
