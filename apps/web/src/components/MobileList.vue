<script setup lang="ts">
import { Theme } from 'types'

const { isListShown } = storeToRefs(useApp())
const { singlesInView: locations, clustersInView } = storeToRefs(useMarkers())

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
    isListShown.value = false
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

function close() {
  isListShown.value = false
  selectedUuid.value = undefined
}
</script>

<template>
  <transition
    enter-from-class="translate-y-[110%] opacity-0" leave-to-class="translate-y-[110%] opacity-0"
    enter-active-class="transition duration-300" leave-active-class="transition duration-300"
  >
    <ul
      v-if="locations.length > 0 && isListShown" ref="scrollRoot" absolute bottom-0 w-full flex="~ items-end gap-x-3"
      of-x-auto snap="x mandatory"
      bg="gradient-to-t gradient-from-neutral/20 gradient-to-neutral/0 bottom no-repeat [size:100%_184px]" :class="{
        'pointer-events-none': !isIOs,
      }"
      :style="`--spacing: ${(1 - Math.max(progress, 0)) * INITIAL_GAP_TO_SCREEN}px; --un-gradient-from: rgb(var(--nq-neutral) / ${0.2 * Math.min((1 + progress * 2), 1)}) var(--un-gradient-from-position); --initial-gap-to-screen: ${INITIAL_GAP_TO_SCREEN}px; max-height: ${maxUlHeight};`"
    >
      <li
        v-for="location in locations" :key="location.uuid" ref="cards" first:pl="$spacing" last:pr="$spacing"
        pointer-events-auto relative shrink-0 snap-center :data-card-uuid="location.uuid"
      >
        <SheetModal
          v-model:progress="progress" :max-height="location.photo ? 363 : 179" :initial-border-radius="8"
          :initial-gap-to-screen="INITIAL_GAP_TO_SCREEN" relative w-full rounded-t-lg @close="close"
        >
          <template #dragger>
            <div relative>
              <hr
                absolute inset-x-0 z-10 mx-auto ml-auto mt-8 h-4 w-128 border-0 rounded-full :class="[
                  { 'mt-12': progress === 1 },
                  [
                    location.isAtm && location.theme === Theme.Dark
                      ? !location.photo! && !progress! > !0.1 ? 'bg-white/80 !mix-blend-lighten'! : 'bg-white/30 mix-blend-lighten'
                      : (location.photo && progress > 0.1 ? 'bg-darkblue/40 mix-blend-darken' : 'bg-darkblue/20 mix-blend-darken'),
                  ],
                ]"
              >
            </div>
          </template>
          <LocationCard :location="location" :progress="progress" />
        </SheetModal>
      </li>
    </ul>
    <button
      v-else-if="!isListShown" translate-x="-50%" pill-sm absolute bottom-24 pill-tertiary shadow left="50%"
      @click="isListShown = true"
    >
      {{ $t('Show list') }}
    </button>
    <button v-else translate-x="-50%" pill-sm absolute bottom-24 text-orange pill-tertiary shadow left="50%">
      {{
        clustersInView.length > 0 ? $t('Zoom in to see the list.') : $t('Oops, no businesses around here.')
      }}
    </button>
  </transition>
</template>

<style scoped>
ul::-webkit-scrollbar {
  display: none;
}
</style>
