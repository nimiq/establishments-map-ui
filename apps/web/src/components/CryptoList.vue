<script setup lang="ts">
import { Currency, Location } from 'types';

const props = withDefaults(defineProps<{ location: Location, progress?: number }>(), { progress: 1 })

function arrayEquals(arrA: string[], arrB: string[]): boolean {
  return arrA.length === arrB.length && arrA.every((value, index) => value === arrB[index])
}

const max = 3 // Max number of cryptos to display. If more, display a "+n" at the end
const accepts = computed(() => props.location.accepts)
const sells = computed(() => props.location.sells)
const acceptToDisplay = computed(() => accepts.value.length <= max ? accepts.value : accepts.value.slice(0, max))
const sellToDisplay = computed(() => sells.value.length <= max ? sells.value : sells.value.slice(0, max))

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ cryptosToDisplay: Currency[], n: number }>()
</script>

<template>
  <DefineTemplate v-slot="{ cryptosToDisplay, n }">
    <ul v-if="cryptosToDisplay.length > 0" flex="~ items-center gap-x-8" p-4 bg-neutral-0 rounded-full w-max
      ring-neutral-100 absolute bottom-0 z-20>
      <li v-for="c in cryptosToDisplay " :key="c">
        <div text-24 :class="getCurrencyIcon(c)" :title="c" />
      </li>
      <li v-if="n > 0" pr-4 text="14 neutral-700">
        +{{ n }}
      </li>
    </ul>
  </DefineTemplate>

  <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform translate-y-3 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-75 ease-out"
    leave-from-class="transform opacity-100" leave-to-class="transform translate-y-3 opacity-0">
    <div
      v-if="progress > 0.5 && location.accepts.length && location.sells.length && !arrayEquals(location.accepts, location.sells)"
      grid="~ flow-col cols-[fit-content,fit-content] rows-[fit-content,1fr] gap-y-1 gap-x-2" relative z-20 size-max>
      <h5 text="13 white/60">
        {{ $t('Buy') }}
      </h5>
      <ReuseTemplate :cryptos-to-display="location.sells" :n="location.sells.length - sellToDisplay.length" />
      <h5 text="13 white/60">
        {{ $t('Sell') }}
      </h5>
      <ReuseTemplate :cryptos-to-display="location.accepts" :n="location.accepts.length - acceptToDisplay.length" />
    </div>
    <ReuseTemplate v-else :cryptos-to-display="[...new Set(location.accepts.concat(location.sells))]" relative z-20
      :n="location.accepts.length - acceptToDisplay.length" />
  </transition>
</template>
