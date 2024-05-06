<script setup lang="ts">
import type { Location } from 'types'

defineProps<{ location: Location, progress: number }>()
</script>

<template>
  <div relative rounded-t-12 duration="$duration,0" desktop:max-w-352 w-full group h-full select-none :class="{
    'of-hidden': isMobile,
    'select-auto': progress === 1 || !isMobile,
  }" :style="{
    background: location.isAtm ? location.bg[0] : 'rgb(var(--nq-neutral-0,0))',
    '--bottom-radius': isMobile ? `calc((1 - ${progress}) * 12px)` : '12px',
    'border-bottom-left-radius': 'var(--bottom-radius)',
    'border-bottom-right-radius': 'var(--bottom-radius)'
  }" animate-fade-in animate-duration-100>
    <LocationCardBg v-if="location.isAtm" :location="location" />

    <div v-if="location.photo && progress > 0" pt-6 px-5 transition-height duration="[--duration]"
      :style="`height: ${progress * 184}px;`">
      <img object-cover w-full h-full rounded-8
        :class="location.isAtm && location.isDark ? 'bg-neutral-0/60' : 'bg-neutral/10'" :src="location.photo"
        :alt="$tc('Picture of {name}', { name: location.name })" draggable="false"
        @load="($event.target as HTMLImageElement).classList.remove('animate-pulse')">
    </div>

    <div relative px-24 py-20 space-y-20 :data-inverted="location.isDark && location.isAtm ? true : undefined">
      <BasicInfoLocation :location :progress />
      <LocationCardDotsMenu v-if="progress === 1" :location absolute top-0 right-16 />
      <CryptoList :location :progress />
    </div>

    <LocationExternalUrl :location v-if="location.photo && location.url && progress > 0.5" absolute top-16 right-16 />

    <Banner v-if="progress > 0 && location.banner !== 'None'" :location absolute w-full mt--36
      :class="{ 'rounded-b-12': !isMobile }" :style="{
        backgroundColor: !location.isAtm ? location.bg[0] : 'transparent',
        opacity: progress / 0.8,
        bottom: `-${(1 - progress) * 70}px`, // the height is 54, we add 16px to delay the animation
        left: `calc(${1 - progress} * var(--initial-gap-to-screen) * -1)`, // make the provider grow in a vertical line
        padding: `0 calc(${(1 - progress)} * var(--initial-gap-to-screen))`, // delay the animation
      }" />
  </div>
</template>
