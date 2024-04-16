<script setup lang="ts">
import { createReusableTemplate, useBreakpoints } from '@vueuse/core'
import { Currency, LocationLink, type Location } from 'types'
import BasicInfo from '@/components/cards/location/BasicInfoLocation.vue'
import CardBg from '@/components/cards/location/LocationCardBg.vue'
import Banner from '@/components/elements/Banner.vue'
import CardDotsMenu from '@/components/cards/location/LocationCardDotsMenu.vue'
import { breakpointsTailwind } from '@vueuse/core'
import { computed } from 'vue'
import { getCurrencyIcon } from '@/composables/useIcon'

const props = defineProps<{ location: Location, progress: number }>()

const isMobile = useBreakpoints(breakpointsTailwind).smaller('md')

function arrayEquals(arrA: string[], arrB: string[]): boolean {
  return arrA.length === arrB.length && arrA.every((value, index) => value === arrB[index])
}

const max = 3 // Max number of cryptos to display. If more, display a "+n" at the end
const accepts = computed(() => props.location.accepts)
const sells = computed(() => props.location.sells)
const acceptToDisplay = computed(() => accepts.value.length <= max ? accepts.value : accepts.value.slice(0, max))
const sellToDisplay = computed(() => sells.value.length <= max ? sells.value : sells.value.slice(0, max))

const [DefineCryptoList, ReuseCryptoList] = createReusableTemplate<{ cryptosToDisplay: Currency[], n: number }>()
</script>

<template>
  <DefineCryptoList v-slot="{ cryptosToDisplay, n }">
    <ul v-if="cryptosToDisplay.length > 0" flex="~ items-center gap-x-8" p-4 bg-neutral-0 rounded-full w-max ring="1.5 neutral/10" absolute bottom-0 z-20 shadow translate-y="1/2">
      <li v-for="c in cryptosToDisplay " :key="c">
        <div text-24 :class="getCurrencyIcon(c)" :title="c" />
      </li>
      <li v-if="n > 0" pr-4 text="14 neutral-700">
        +{{ n }}
      </li>
    </ul>
  </DefineCryptoList>

  <div relative rounded-12 duration="[var(--duration,0)]" group h-full select-none :class="{
    'rounded-b-0': progress === 1 && isMobile,
    'of-hidden': isMobile,
    'select-auto': progress === 1 || !isMobile,
  }" :style="`background: ${location.isAtm ? location.bg[0] : 'white'}`">
    <CardBg v-if="location.isAtm" :location="location" />

    <div v-if="location.photo && progress > 0" pt-6 px-5 transition-height duration="[--duration]"
      :style="`height: ${progress * 184}px;`">
      <img object-cover w-full h-full rounded-8
        :class="location.isAtm && location.isDark ? 'bg-neutral-0/60' : 'bg-neutral/10'" :src="location.photo"
        :alt="$tc('Picture of {name}', { name: location.name })" draggable="false"
        @load="($event.target as HTMLImageElement).classList.remove('animate-pulse')">
    </div>

    <div relative px-24 pt-20 pb-32>
      <BasicInfo :location="location" :progress="progress" />
      <CardDotsMenu v-if="progress === 1" :location="location" absolute top-20 right-4 />

      <transition enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform translate-y-3 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-75 ease-out" leave-from-class="transform opacity-100"
        leave-to-class="transform translate-y-3 opacity-0">
        <div
          v-if="progress > 0.5 && location.accepts.length && location.sells.length && !arrayEquals(location.accepts, location.sells)"
          grid="~ flow-col cols-[auto,auto] rows-[auto,1fr] gap-x-8 gap-y-4" w-max h-max relative z-20>
          <h5 text="12 neutral-700">
            {{ $t('Buy') }}
          </h5>
          <ReuseCryptoList :cryptosToDisplay="sellToDisplay" :n="location.sells.length - sellToDisplay.length" />
          <h5 class="text-12 text-white/60">
            {{ $t('Sell') }}
          </h5>
          <ReuseCryptoList :cryptosToDisplay="acceptToDisplay" :n="location.accepts.length - acceptToDisplay.length" />
        </div>
        <ReuseCryptoList v-else :cryptosToDisplay="acceptToDisplay"
          :n="location.accepts.length - acceptToDisplay.length" />
      </transition>
    </div>

    <transition name="scale">
      <a v-if="!location.photo && location.url && progress > 0.5" :href="location.url" pill-tertiary pill-sm arrow
        bg-neutral-0 text-16 absolute w-52 text-24 top-16 right-16>
        <div v-if="location.linkTo === LocationLink.GMaps" i-logos:google-maps />
        <div v-if="location.linkTo === LocationLink.Facebook" i-logos:facebook />
        <div v-if="location.linkTo === LocationLink.Instagram" i-nimiq:logos-instagram />
      </a>
    </transition>

    <Banner v-if="progress > 0 && location.banner !== 'None'" :location="location"
      absolute max-desktop:w-screen :class="{ 'rounded-b-12': progress < 1 || !isMobile }" :style="{
        backgroundColor: !location.isAtm ? location.bg[0] : 'transparent',
        opacity: progress / 0.8,
        bottom: `-${(1 - progress) * 70}px`, // the height is 54, we add 16px to delay the animation
        left: `calc(${1 - progress} * var(--initial-gap-to-screen) * -1)`, // make the provider grow in a vertical line
        padding: `0 calc(${(1 - progress)} * var(--initial-gap-to-screen))`, // delay the animation
      }" />
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
