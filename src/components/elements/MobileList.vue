<script setup lang="ts">
import { type PropType, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Location } from 'types'
import { useLocations } from '@/stores/locations'
import SheetModal from '@/components/atoms/SheetModal.vue'
import Card from '@/components/elements/Card.vue'

defineProps({
  locations: {
    type: Array as PropType<Location[]>,
    required: true,
  },
})

// We have only one progress across all elements. If any of the element moves, all of them move.
const INITIAL_GAP_TO_SCREEN = 20

// Value is between 0 and 1
const progress = ref(0)

const { selectedUuid } = storeToRefs(useLocations())

const scrollRoot = ref<HTMLElement>()
const cards = ref<HTMLElement[]>()

let scrollingIntoView = false
let scrollingList = false

watch(selectedUuid, (uuid) => {
  if (!uuid)
    return

  if (scrollingList)
    return

  scrollingIntoView = true
  document.querySelector(`[data-card-uuid="${uuid}"]`)?.scrollIntoView({ behavior: 'smooth' })

  if ('onscrollend' in window) {
    scrollRoot.value!.addEventListener('scrollend', () => {
      scrollingIntoView = false
    }, { once: true })
  }
  else {
    window.setTimeout(() => scrollingIntoView = false, 1000)
  }
})

function intersectionHandler(entries: IntersectionObserverEntry[]) {
  if (scrollingIntoView)
    return

  const uuid = entries.find(entry => entry.isIntersecting)?.target?.getAttribute('data-card-uuid')
  if (uuid) {
    scrollingList = true
    selectedUuid.value = uuid
    nextTick(() => scrollingList = false)
  }
}

const observer = new IntersectionObserver(intersectionHandler, {
  threshold: 0.5,
})

watch(cards, (newCards, oldCards) => {
  if (oldCards && oldCards.length > 0)
    oldCards.forEach(card => observer.unobserve(card))

  if (newCards && newCards.length > 0)
    newCards.forEach(card => observer.observe(card))
}, { deep: true })
</script>

<template>
  <ul
    ref="scrollRoot"
    class="flex items-end w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-x-3 scroll-mx-[var(--spacing)]"
    :style="`--spacing: ${(1 - progress) * INITIAL_GAP_TO_SCREEN}px`"
  >
    <li
      v-for="location in locations" :key="location.uuid"
      ref="cards"
      class="relative shrink-0 snap-center first:pl-[var(--spacing)] last:pr-[var(--spacing)]"
      :data-card-uuid="location.uuid"
    >
      <SheetModal
        :max-height="location.photo ? 363 : 179" :initial-border-radius="8"
        :initial-gap-to-screen="INITIAL_GAP_TO_SCREEN" class="relative w-full bg-white rounded-t-lg" :progress="progress"
        @update:progress="progress = $event"
      >
        <Card :location="location" :progress="progress" />
      </SheetModal>
    </li>
  </ul>
</template>
