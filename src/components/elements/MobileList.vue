<script setup lang="ts">
import { type PropType, ref } from 'vue'
import SheetModal from '@/components/atoms/SheetModal.vue'
import Card from '@/components/elements/Card.vue'
import type { Location } from '@/types'

defineProps({
  locations: {
    type: Array as PropType<Location[]>,
    default: () => [],
  },
})

// We have only one progress across all elements. If any of the element moves, all of them move.
const INITIAL_GAP_TO_SCREEN = 20

// Value is between 0 and 1
const progress = ref(0)
</script>

<template>
  <ul
    class="flex items-end w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-x-3 scroll-mx-[var(--spacing)]"
    :style="`--spacing: ${(1 - progress) * INITIAL_GAP_TO_SCREEN}px`"
  >
    <li
      v-for="(l, i) in locations" :key="i"
      class="relative shrink-0 snap-center first:pl-[var(--spacing)] last:pr-[var(--spacing)]"
    >
      <SheetModal
        :initial-height="162" :max-height="371" :initial-border-radius="8"
        :initial-gap-to-screen="INITIAL_GAP_TO_SCREEN" class="relative w-full bg-white rounded-t-lg" :progress="progress"
        @update:progress="progress = $event"
      >
        <Card :location="l" :progress="progress" />
      </SheetModal>
    </li>
  </ul>
</template>
