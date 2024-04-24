<script setup lang="ts">
import type { Location } from 'types'
import { CustomMarker } from 'vue3-google-map'

const { singles } = storeToRefs(useMarkers())

const { zoom } = storeToRefs(useMap())
const { showLocationName } = getMapUiState()
const { isListShown } = storeToRefs(useApp())
const { selectedUuid } = storeToRefs(useLocations())

// Needed when bg color is a gradient
const regex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g
function extractColorFromBg(bg: string) {
  return (bg.match(regex) || []).at(-1)
}

const popoverKey = ref(0)
function handlePopoverOpen(isOpen: boolean, location: Location) {
  if (!isOpen) {
    selectedUuid.value = undefined
    return
  }
  // Find element by uuid and scroll to it
  const element = document.querySelector(`[data-trigger-uuid="${location.uuid}"]`)
  // Get distance from marker to left side of the screen
  const distance = element?.getBoundingClientRect().left
  // If < 368px (width of the locations list), move the map to the marker
  if (distance && distance < 368 && isListShown.value) {
    popoverKey.value = 0
    const center = { lat: location.lat, lng: location.lng }
    useMap().setPosition({ center, zoom: zoom.value }, { smooth: true })
    const stop = setInterval(() => {
      popoverKey.value += 1
      if (popoverKey.value === 50)
        clearInterval(stop)
    }, 10)
  }
  selectedUuid.value = location.uuid
}
</script>

<template>
  <CustomMarker v-for="location in singles" :key="location.uuid"
    :options="{ position: { lng: location.lng, lat: location.lat }, anchorPoint: showLocationName ? 'LEFT_CENTER' : 'CENTER' }"
    data-custom-marker>

    <PopoverRoot @update:open="(isOpen: boolean) => handlePopoverOpen(isOpen, location)">
      <PopoverAnchor absolute h-full w-28 pointer-events-none />
      <PopoverTrigger :aria-label="$t('See location details')" cursor-pointer :data-trigger-uuid="location.uuid">
        <SingleMarker :location transition-shadow rounded-4 />
      </PopoverTrigger>
      <PopoverPortal :key="popoverKey">
        <Transition name="popover">
          <PopoverContent side="right" :side-offset="5" rounded-12 shadow :collision-padding="8" sticky="always"
            @open-auto-focus.prevent>
            <LocationCard :location="location" :progress="1" />
            <PopoverArrow
              :style="{ color: location.isAtm ? extractColorFromBg(location.bg[0]) : 'rgb(var(--nq-neutral-0))' }"
              as-child rotate-180 right-1>
              <div w-16 h-8 i-nimiq:tooltip-triangle />
            </PopoverArrow>
          </PopoverContent>
        </Transition>
      </PopoverPortal>
    </PopoverRoot>
  </CustomMarker>
</template>

<style scoped>
.popover-enter-active,
.popover-leave-active {
  transition:
    opacity 250ms cubic-bezier(.4, 0, .2, 1),
    left 100ms ease-in;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
}
</style>
