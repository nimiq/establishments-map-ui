<script setup lang="ts">
import { type PropType, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { type Location, Theme } from 'types'
import { useLocations } from '@/stores/locations'
import SheetModal from '@/components/atoms/SheetModal.vue'
import Card from '@/components/elements/Card.vue'

const props = defineProps({
  locations: {
    type: Array as PropType<Location[]>,
    required: true,
  },
  listIsShown: {
    type: Boolean,
    default: false,
  },
})

defineEmits({
  closeList: () => true,
})

// We have only one progress across all elements. If any of the element moves, all of them move.
const INITIAL_GAP_TO_SCREEN = 20

// Value is between 0 and +-1
const progress = ref(0)
const delayScrolling = ref(false)

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

  scrollingIntoView = true
  // Delay scrolling when the list is not shown during the transition duration to prevent glitchy scrolling
  setTimeout(() => document.querySelector(`[data-card-uuid="${uuid}"]`)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' }), delayScrolling.value ? 350 : 0)

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
watch(() => props.listIsShown, (listIsShown) => {
  // This will prevent the glitchy scrolling but also allow to now have any delay when the list is already open
  delayScrolling.value = listIsShown
  setTimeout(() => delayScrolling.value = !listIsShown, 10)
}, { immediate: true })

onMounted(() => {
  handleSelectedUuidUpdate(selectedUuid.value, true)
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
    :style="`--spacing: ${(1 - Math.max(progress, 0)) * INITIAL_GAP_TO_SCREEN}px; background-size: 100% 184px;--tw-gradient-from: rgb(31 35 72 / ${0.2 * Math.min((1 + progress * 2), 1)}) var(--tw-gradient-from-position);`"
  >
    <li
      v-for="location in locations" :key="location.uuid" ref="cards"
      class="relative shrink-0 snap-center first:pl-[var(--spacing)] last:pr-[var(--spacing)] pointer-events-auto"
      :data-card-uuid="location.uuid"
    >
      <SheetModal
        :max-height="location.photo ? 363 : 179" :initial-border-radius="8"
        :initial-gap-to-screen="INITIAL_GAP_TO_SCREEN" class="relative w-full bg-white rounded-t-lg" :progress="progress"
        @update:progress="progress = $event" @close-list="() => $emit('closeList')"
      >
        <template #dragger>
          <div class="relative">
            <hr
              class="absolute inset-x-0 z-10 w-32 h-1 mx-auto mt-2 ml-auto border-0 rounded-full" :class="[
                { 'mt-3': progress === 1 },
                [location.bgFullCard && location.theme === Theme.Dark ? 'bg-white/30 mix-blend-lighten' : 'bg-white mix-blend-darken'],
              ]"
            >
          </div>
        </template>
        <Card :location="location" :progress="progress" />
      </SheetModal>
    </li>
  </ul>
</template>
