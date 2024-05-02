<script setup lang="ts">
import type { Location } from 'types'

const props = defineProps<{ location: Location, progress: number }>()

function arrayEquals(arrA: string[], arrB: string[]): boolean {
  return arrA.length === arrB.length && arrA.every((value, index) => value === arrB[index])
}

const max = 3 // Max number of cryptos to display. If more, display a "+n" at the end
const accepts = computed(() => props.location.accepts)
const sells = computed(() => props.location.sells)
const acceptToDisplay = computed(() => accepts.value.length <= max ? accepts.value : accepts.value.slice(0, max))
const sellToDisplay = computed(() => sells.value.length <= max ? sells.value : sells.value.slice(0, max))
</script>

<template>
  <div relative rounded-t-12 duration="$duration,0" desktop:max-w-352 w-full group h-full select-none :class="{
    'of-hidden': isMobile,
    'select-auto': progress === 1 || !isMobile,
  }" :style="{
    background: location.isAtm ? location.bg[0] : 'rgb(var(--nq-neutral-0,0))',
    'border-bottom-left-radius': isMobile ? `calc((1 - ${progress}) * 12px)` : '12px',
    'border-bottom-right-radius': isMobile ? `calc((1 - ${progress}) * 12px)` : '12px',
  }" animate-fade-in animate-duration-100>
    <LocationCardBg v-if="location.isAtm" :location="location" />

    <div v-if="location.photo && progress > 0" pt-6 px-5 transition-height duration="[--duration]"
      :style="`height: ${progress * 184}px;`">
      <img object-cover w-full h-full rounded-8
        :class="location.isAtm && location.isDark ? 'bg-neutral-0/60' : 'bg-neutral/10'" :src="location.photo"
        :alt="$tc('Picture of {name}', { name: location.name })" draggable="false"
        @load="($event.target as HTMLImageElement).classList.remove('animate-pulse')">
    </div>

    <div relative px-24 py-20 space-y-20>
      <BasicInfoLocation :location="location" :progress="progress" />
      <LocationCardDotsMenu v-if="progress === 1" :location absolute top-20 right-4 />

      <transition enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform translate-y-3 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-75 ease-out" leave-from-class="transform opacity-100"
        leave-to-class="transform translate-y-3 opacity-0">
        <template
          v-if="progress > 0.5 && location.accepts.length && location.sells.length && !arrayEquals(location.accepts, location.sells)">
          <div
            class="grid grid-flow-col grid-cols-[auto,auto] grid-rows-[auto,1fr] gap-y-1 gap-x-2 w-max h-max relative z-20">
            <h5 class="text-xs text-white/60">
              {{ $t('Buy') }}
            </h5>
            <CryptoList :cryptos-to-display="location.sells" :n="location.sells.length - sellToDisplay.length" />
            <h5 class="text-xs text-white/60">
              {{ $t('Sell') }}
            </h5>
            <CryptoList :cryptos-to-display="location.accepts" :n="location.accepts.length - acceptToDisplay.length" />
          </div>
        </template>
        <template v-else>
          <CryptoList :cryptos-to-display="[...new Set(location.accepts.concat(location.sells))]" relative z-20
            :n="location.accepts.length - acceptToDisplay.length" />
        </template>
      </transition>
    </div>

    <LocationExternalUrl :location v-if="!location.photo && location.url && progress > 0.5" absolute top-16 right-16 />

    <!-- TODO Shadow mobile lsit -->

    <Banner v-if="progress > 0 && location.banner !== 'None'" :location absolute max-desktop:w-screen mt--36
      :class="{ 'rounded-b-12': !isMobile }" :style="{
        backgroundColor: !location.isAtm ? location.bg[0] : 'transparent',
        opacity: progress / 0.8,
        bottom: `-${(1 - progress) * 70}px`, // the height is 54, we add 16px to delay the animation
        left: `calc(${1 - progress} * var(--initial-gap-to-screen) * -1)`, // make the provider grow in a vertical line
        padding: `0 calc(${(1 - progress)} * var(--initial-gap-to-screen))`, // delay the animation
      }" />
  </div>
</template>
