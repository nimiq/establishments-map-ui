<script setup lang="ts">
import { type PropType, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { type Location, Theme } from 'types'
import { useLocations } from '@/stores/locations'
import SheetModal from '@/components/atoms/SheetModal.vue'
import Card from '@/components/elements/Card.vue'

defineProps({
  locations: {
    type: Array as PropType<Location[]>,
    required: true,
  },
})

defineEmits({
  closeList: () => true,
})

// We have only one progress across all elements. If any of the element moves, all of them move.
const INITIAL_GAP_TO_SCREEN = 20

// Value is between 0 and 1
const progress = ref(0)

const { selectedUuid } = storeToRefs(useLocations())

const scrollRoot = ref<HTMLElement>()
const cards = ref<HTMLElement[]>()

let scrollingIntoView = !!selectedUuid.value
let scrollingList = false

function handleSelectedUuidUpdate(uuid: string | undefined, smooth = true) {
  if (!uuid)
    return

  if (scrollingList)
    return

  const card = document.querySelector(`[data-card-uuid="${uuid}"]`)
  if (!card)
    return

  scrollingIntoView = true

  if (smooth) {
    card.scrollIntoView({ behavior: 'smooth' })
  }
  else {
    scrollRoot.value!.scrollTo({
      left: card.getBoundingClientRect().left,
      behavior: 'instant',
    })
  }

  if (smooth) {
    if ('onscrollend' in window) {
      scrollRoot.value!.addEventListener('scrollend', () => {
        scrollingIntoView = false
      }, { once: true })
    }
    else {
      window.setTimeout(() => scrollingIntoView = false, 1000)
    }
  }
  else {
    scrollingIntoView = false
  }
}

watch(selectedUuid, uuid => handleSelectedUuidUpdate(uuid))

onMounted(() => {
  handleSelectedUuidUpdate(selectedUuid.value, false)
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
    class="flex items-end w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-x-3 scroll-mx-[var(--spacing)] pointer-events-none bg-gradient-to-t from-space/20 to-space/0 bg-bottom bg-no-repeat"
    :style="`--spacing: ${(1 - Math.max(progress, 0)) * INITIAL_GAP_TO_SCREEN}px; background-size: 100% 184px;--tw-gradient-from: rgb(31 35 72 / ${0.2 * Math.min((1 + progress * 2), 1)}) var(--tw-gradient-from-position); --initial-gap-to-screen: ${INITIAL_GAP_TO_SCREEN}px;`"
  >
    <li
      v-for="location in locations" :key="location.uuid" ref="cards"
      class="relative shrink-0 snap-center first:pl-[var(--spacing)] last:pr-[var(--spacing)] pointer-events-auto"
      :data-card-uuid="location.uuid"
    >
      <SheetModal
        :max-height="location.photo ? 363 : 179" :initial-border-radius="8"
        :initial-gap-to-screen="INITIAL_GAP_TO_SCREEN" class="relative w-full rounded-t-lg" :progress="progress"
        @update:progress="progress = $event" @close-list="() => $emit('closeList')"
      >
        <template #dragger>
          <div class="relative">
            <hr
              class="absolute inset-x-0 z-10 w-32 h-1 mx-auto mt-2 ml-auto border-0 rounded-full" :class="[
                { 'mt-3': progress === 1 },
                [
                  location.isAtm && location.theme === Theme.Dark
                    ? (location.photo && progress > 0.1 ? 'bg-white/80 mix-blend-lighten' : 'bg-white/30 mix-blend-lighten')
                    : (location.photo && progress > 0.1 ? 'bg-space/60 mix-blend-darken' : 'bg-space/20 mix-blend-darken'),
                ],
              ]"
            >
          </div>
        </template>
        <Card :location="location" :progress="progress" />
      </SheetModal>
    </li>
  </ul>
</template>
