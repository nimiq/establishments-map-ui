<script setup lang="ts">
defineProps<{ location: MapLocation, progress: number }>()
</script>

<template>
  <div duration="$duration,0" :class="{
    'of-hidden': isMobile,
    'select-auto': progress === 1 || !isMobile,
  }" :style="{
      'background': location.isAtm ? location.bg[0] : 'rgb(var(--nq-neutral-0,0))',
      '--bottom-radius': isMobile ? `calc((1 - ${progress}) * 12px)` : '12px',
      'border-bottom-left-radius': 'var(--bottom-radius)',
      'border-bottom-right-radius': 'var(--bottom-radius)',
    }" group relative h-full w-full animate-fade-in animate-duration-100 rounded-t-12 desktop:max-w-352>
    <LocationCardBg v-if="location.isAtm" :location="location" />

    <div v-if="location.photo && progress > 0" px-5 pt-6 transition-height duration="[--duration]"
      :style="`height: ${progress * 184}px;`">
      <img h-full w-full rounded-8 object-cover
        :class="location.isAtm && location.isDark ? 'bg-neutral-0/60' : 'bg-neutral/10'" :src="location.photo"
        :alt="$tc('Picture of {name}', { name: location.name })" draggable="false"
        @load="($event.target as HTMLImageElement).classList.remove('animate-pulse')">
    </div>

    <div relative px-24 py-20 :data-inverted="location.isDark && location.isAtm ? true : undefined">
      <BasicInfoLocation :location :progress />
      <LocationCardDotsMenu v-if="progress === 1" :location absolute right-16 top-0 mt-20 />
      <div v-if="location.cryptocity" ring="1 neutral-200" flex="~ gap-x-8" mb-20 mt-6 rounded-8 px-12 py-8>
        <div i-nimiq:logos-cryptocity text-17 />
        <p text="12 neutral-800" flex-1>
          {{ $t('Spend Cryptocity points here') }}
        </p>
        <div centered ml-8 size-16 rounded-full bg-green>
          <div text="white 9" i-nimiq:check relative bottom--0.5 />
        </div>
      </div>
      <div mt-16>
        <CryptoList :location :progress />
      </div>
    </div>

    <LocationExternalUrl v-if="location.photo && location.url && progress > 0.5" :location absolute right-16 top-16 />

    <Banner v-if="progress > 0 && location.banner !== 'None'" :location absolute mt--36 w-full
      :class="{ 'rounded-b-12': !isMobile }" :style="{
        backgroundColor: !location.isAtm ? location.bg[0] : 'transparent',
        opacity: progress / 0.8,
        bottom: `-${(1 - progress) * 70}px`, // the height is 54, we add 16px to delay the animation
        left: `calc(${1 - progress} * var(--initial-gap-to-screen) * -1)`, // make the provider grow in a vertical line
        padding: `0 calc(${(1 - progress)} * var(--initial-gap-to-screen))`, // delay the animation
      }" />
  </div>
</template>
