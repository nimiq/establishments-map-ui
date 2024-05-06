<script setup lang="ts">
import { type Location } from 'types'

withDefaults(defineProps<{ location: Location, progress?: number }>(), { progress: 0 })
</script>

<template>
  <div :grid="`~ rows-[repeat(3,auto)] gap-x-6 ${location.photo ? 'cols-[auto_1fr]' : 'cols-[auto_1fr_auto]'}`">
    <h3 text="16 neutral inverted:neutral-0" lh-20 col-span-2 pb-4 :class="`${location.photo ? 'mr-16' : 'mr-8'}`">
      {{ location.isAtm ? `${$t('ATM')} (${location.name})` : location.name }}
    </h3>

    <LocationExternalUrl v-if="!location.photo && location.url && progress > 0.5" :location self-start mr-20
      :class="location.isAtm ? 'mt--3' : 'mt--8'" />

    <template v-if="!location.isAtm">
      <span row-start-2 text="12 neutral-700" font-semibold capitalize whitespace-nowrap>
        {{ location.gmaps_types[0]?.replaceAll('_', ' ') || location.category_label }}
      </span>
      <div v-if="location.rating" row-start-2 flex="~ gap-x-2 self-center" text-12>
        <div i-nimiq:star v-for="i in 5" :key="i"
          :class="`${i <= location.rating ? 'text-gold' : 'text-neutral-400'}`" />
      </div>
    </template>
    <span v-else-if="location.isAtm" row-start-2 font-semibold text="12 neutral-800 inverted:neutral-300">
      <template v-if="location.accepts?.length > 0 && location.sells?.length > 0">{{
        $t('Buy & sell crypto')
      }}</template>
      <template v-else-if="location.accepts.length > 0">{{ $t('Sell crypto only') }}</template>
      <template v-else-if="location.sells.length > 0">{{ $t('Buy crypto only') }}</template>
    </span>
    <p v-if="location.address" leading-18 :grid="`~ cols-1 row-start-3 ${location.photo ? 'col-span-2' : 'col-span-3'}`"
      text="12 neutral-800 inverted:neutral-100">
      {{ location.address }}
    </p>
  </div>
</template>
