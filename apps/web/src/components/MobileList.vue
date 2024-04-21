<script setup lang="ts">
import { type Location, Theme } from 'types'

defineProps<{locations: Location[]}>()

const emit = defineEmits({
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

  scrollRoot.value!.scrollTo({
    left: scrollRoot.value!.scrollLeft + card.getBoundingClientRect().left,
    behavior: smooth ? 'smooth' : 'instant',
  })

  if (smooth) {
    if ('onscrollend' in window) {
      scrollRoot.value!.addEventListener('scrollend', () => {
        scrollingIntoView = false
      }, { once: true })
    }
    else {
      globalThis.setTimeout(() => scrollingIntoView = false, 1000)
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

const { mapInstance } = storeToRefs(useMap())
useEventListener(mapInstance.value?.$el, 'click', (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('[data-custom-marker]'))
    emit('closeList')
})

// Dynamically resize ul element when cards are extended to emulate `pointer-events:none` on iOS
// and allow users to click in the area of an extended image-less card that would usually be covered
// by the image.
const isIOs = (
  navigator.platform?.startsWith('iPhone')
  || navigator.platform?.startsWith('iPod')
  || navigator.platform?.startsWith('iPad')
) || !!navigator.userAgent.match(/(iPhone|iPod|iPad)/g)

// By default, on non-iOS devices and during scrolling, no max-height is set on the list
const maxUlHeight = ref('unset')

// Only run the whole shabang on iOS devices
if (isIOs) {
  let scrollendTimeout: number | undefined

  function timeoutHandler() {
    // If a card is scrolled to, we set the max-height of the list to the height of that card
    if (selectedUuid.value) {
      const currentCard = document.querySelector(`[data-card-uuid="${selectedUuid.value}"]`)
      if (currentCard) {
        const height = currentCard.getBoundingClientRect().height
        maxUlHeight.value = `${height}px`
      }
    }

    // Then reset the timeout variable, to not unnecessary clear expired timeouts
    scrollendTimeout = undefined
  }

  function scrollHandler() {
    // As soon as scrolling starts, we unset the max-height to allow all cards to fully display
    maxUlHeight.value = 'unset'

    // If a timeout is currently running, we clear it
    if (scrollendTimeout)
      window.clearTimeout(scrollendTimeout)

    // In any case, we start a new timeout to set the max-height after scrolling stops (this approach
    // is necessary, as iOS does not support the `scrollend` event)
    scrollendTimeout = window.setTimeout(timeoutHandler, 100)
  }

  // Only attach the scroll listener when the cards are extended
  let attached = false
  watch(progress, (p) => {
    // Attach the listener when cards are fully extended and the listener is not yet attached
    if (p === 1 && !attached) {
      scrollRoot.value!.addEventListener('scroll', scrollHandler)
      attached = true
    }

    // Detech the listener when cards become unextended and the listener is currently attached
    if (p < 1 && attached) {
      scrollRoot.value!.removeEventListener('scroll', scrollHandler)
      attached = false

      // Also reset the max-height to allow all cards to fully display
      maxUlHeight.value = 'unset'
    }
  }, { immediate: true })
}
</script>

<template>
  <ul
    ref="scrollRoot"
    class="flex items-end w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-x-3 scroll-mx-[var(--spacing)] bg-gradient-to-t from-space/20 to-space/0 bg-bottom bg-no-repeat"
    :class="{
      'pointer-events-none': !isIOs,
    }"
    :style="`--spacing: ${(1 - Math.max(progress, 0)) * INITIAL_GAP_TO_SCREEN}px; background-size: 100% 184px;--tw-gradient-from: rgb(31 35 72 / ${0.2 * Math.min((1 + progress * 2), 1)}) var(--tw-gradient-from-position); --initial-gap-to-screen: ${INITIAL_GAP_TO_SCREEN}px; max-height: ${maxUlHeight};`"
  >
    <li
      v-for="location in locations" :key="location.uuid" ref="cards"

      class="relative shrink-0 snap-center first:pl-[var(--spacing)] last:pr-[var(--spacing)] pointer-events-auto"
      :data-card-uuid="location.uuid"
    >
      <SheetModal
        :max-height="location.photo ? 363 : 179" :initial-border-radius="8"
        :initial-gap-to-screen="INITIAL_GAP_TO_SCREEN" class="relative w-full rounded-t-lg" v-model:progress="progress" @close-list="() => $emit('closeList')"
      >
        <template #dragger>
          <div class="relative">
            <hr
              class="absolute inset-x-0 z-10 w32 h1 mx-auto mt2 ml-auto border-0 rounded-full" :class="[
                { 'mt3': progress === 1 },
                [
                  location.isAtm && location.theme === Theme.Dark
                    ?!location.photo !&& !progress !> !0.1 !? !'bg-white/80 !mix-blend-lighten' !: !'bg-white/30 !mix-blend-lighten'
                    : (location.photo && progress > 0.1 ? 'bg-space/60 mix-blend-darken' : 'bg-space/20 mix-blend-darken'),
                ],
              ]"
            >
          </div>
        </template>
        <LocationCard :location="location" :progress="progress" />
      </SheetModal>
    </li>
  </ul>
</template>

<style scoped>
ul::-webkit-scrollbar{
  display: none;
}
</style>
