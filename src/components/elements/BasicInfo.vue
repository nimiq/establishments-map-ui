<script setup lang="ts">
import { type PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { type Location } from 'types'
import GmapsButton from './GmapsButton.vue'
import StarFilledIcon from '@/components/icons/icon-star-filled.vue'
import StarIcon from '@/components/icons/icon-star.vue'
import { useLocations } from '@/stores/locations'

defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
})

const { selectedUuid } = storeToRefs(useLocations())
</script>

<template>
  <div
    class="grid grid-rows-[repeat(3,auto)] gap-x-1.5 group/card" :class="{
      'text-white': location.isAtm && location.isDark,
      'text-space': !location.isAtm || location.isLight,
      'grid-cols-[auto_1fr]': location.photo,
      'grid-cols-[auto_1fr_auto]': !location.photo,
    }"
  >
    <h2
      class="text-base font-bold leading-[1.3] col-span-2 pb-1 text-balance"
      :class="{
        'text-sky': !location.isAtm && selectedUuid === location.uuid,
        'mr-4': location.photo,
        'mr-2': !location.photo,
      }"
    >
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <template v-if="location.isAtm">{{ $t('ATM') }} (</template>{{ location.name }}<template v-if="location.isAtm">)</template>
    </h2>

    <GmapsButton v-if="!location.photo && location.url && progress > 0.5" :location="location" class="mr-4 self-start -mt-2 -mb-2" />

    <template v-if="!location.isAtm">
      <span class="row-start-2 text-xs font-semibold first-letter:capitalize text-space/60">
        {{ location.gmaps_types[0]?.replaceAll('_', ' ') || location.category_label }}
      </span>
      <div v-if="location.rating" class="row-start-2 flex gap-x-0.5">
        <template v-for="i in 5" :key="i">
          <component :is="i <= location.rating ? StarFilledIcon : StarIcon" class="w-3 h-3" />
        </template>
      </div>
    </template>
    <span v-else-if="location.isAtm" class="row-start-2 text-xs font-semibold text-white/70">
      <template v-if="location.accepts?.length > 0 && location.sells?.length > 0">{{
        $t('Buy & sell crypto')
      }}</template>
      <template v-else-if="location.accepts.length > 0">{{ $t('Sell crypto only') }}</template>
      <template v-else-if="location.sells.length > 0">{{ $t('Buy crypto only') }}</template>
    </span>
    <p
      class="text-xs leading-[1.5] grid-cols-1 row-start-3" :class="{
        'text-white/70': location.isAtm && location.isDark,
        'text-space/60': !location.isAtm || location.isLight,
        'col-span-2': location.photo,
        'col-span-3': !location.photo,
      }"
    >
      {{ location.address }}
    </p>
  </div>
</template>
