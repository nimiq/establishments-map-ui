<script setup lang="ts">
import { createReusableTemplate, useBreakpoints } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { PopoverAnchor, PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { screens } from 'tailwindcss-nimiq-theme'
import { defineAsyncComponent } from 'vue'
import { CustomMarker } from 'vue3-google-map'
import type { Location, Point } from '@/types'
import { useMap } from '@/stores/map'
import { useLocations } from '@/stores/locations'
import { useCluster } from '@/stores/cluster'
import Card from '@/components/elements/Card.vue'

// TODO Import this from radix-vue. We need to import it lazily so we don't load it in the mobile version
// const PopoverArrow = defineAsyncComponent(() => import('radix-vue'))
// const PopoverContent = defineAsyncComponent(() => import('radix-vue'))
// const PopoverPortal = defineAsyncComponent(() => import('radix-vue'))
// const PopoverRoot = defineAsyncComponent(() => import('radix-vue'))
// const PopoverTrigger = defineAsyncComponent(() => import('radix-vue'))

const { clusters, singles } = storeToRefs(useCluster())

const { setPosition } = useMap()
const { zoom } = storeToRefs(useMap())

const showSingleName = () => zoom.value >= 11
const showCategoryIcon = () => zoom.value >= 13

const CategoryIcon = defineAsyncComponent(
  () => import('@/components/icons/categories/CategoryIcon.vue'),
)

// Since the Desktop requires a Popover, we need to create a reusable template where the trigger is the same component
// as in the mobile version, but without the Popover
const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ location: Location }>()

const { smaller } = useBreakpoints(screens)
const DESKTOP_LAYOUT = 'md' // FIXME This is suppose to be the same value as in the tailwind config
const isMobile = smaller(DESKTOP_LAYOUT)

const { selectedUuid: initialUuid } = useLocations()
const { selectedUuid } = storeToRefs(useLocations())

// Needed when bg color is a gradient
function extractColorFromBg(bg: string) {
  const regex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g
  // TODO: Find a way to know if the arrow is on the left or right side and use the correct color
  const colors = bg.match(regex) || []
  return colors[colors.length - 1]
}

function onClusterClick(center: Point, proposedZoom: number) {
  // To make it more fluid if zoom is lower than 13, the minimum zoom change must be 3
  const newZoom = proposedZoom < 13 ? Math.max(proposedZoom, zoom() + 3) : proposedZoom
  setPosition({ center, zoom: newZoom })
}
</script>

<template>
  <CustomMarker
    v-for="({ center, count, expansionZoom, id }) in clusters" :key="id"
    :options="{ position: center, anchorPoint: 'CENTER' }"
  >
    <div class="grid text-sm font-bold text-white transition-colors rounded-full shadow cursor-pointer aspect-square place-content-center bg-space hover:bg-[#35395A] focus:bg-[#35395A] ring-white/20 ring-2 ring-offset-1 ring-offset-white/40" :style="`width: clamp(24px, ${0.24 * count + 24}px, 48px); font-size: clamp(14px, ${0.14 * count + 4}px, 18px)`" @click="onClusterClick(center, expansionZoom)">
      {{ count < 100 ? count : '99+' }}
    </div>
  </CustomMarker>

  <DefineTemplate v-slot="{ location: { category, name, isAtm, bg, uuid } }">
    <div class="flex items-center gap-x-2 max-w-[176px] group/marker">
      <div v-if="isAtm" class="grid w-8 h-8 text-white rounded-full shadow ring-white/40 ring-2 place-content-center" :style="`background: ${bg}`">
        {{ $t('ATM') }}
      </div>
      <div
        v-else-if="showCategoryIcon"
        class="grid w-8 h-8 text-white transition-colors rounded-full shadow ring-white/40 ring-2 place-content-center" :class="uuid === selectedUuid ? 'bg-sky' : 'bg-space group-hover/marker:bg-[#494d6c] group-focus/marker:bg-[#494d6c]'"
      >
        <CategoryIcon :category="category" class="w-7" />
      </div>
      <div
        v-else class="grid w-3 h-3 text-sm font-bold text-white transition-colors rounded-full shadow ring-white/40 ring-2 place-content-center"
        :class="uuid === selectedUuid ? 'bg-sky' : 'bg-space group-hover/marker:bg-[#494d6c] group-focus/marker:bg-[#494d6c]'"
      />
      <!-- <PopoverAnchor class="mx-1" /> -->
      <span
        v-if="!isAtm && showSingleName"
        class="flex-1 text-base font-semibold leading-none text-left transition-[color,-webkit-text-stroke] select-none [-webkit-text-stroke:_3px_white] relative before:content-[attr(data-outline)] before:absolute before:[-webkit-text-stroke:0]"
        :class="[uuid === selectedUuid ? 'text-sky' : 'text-space group-hover/marker:text-space/80 group-focus/marker:bg-[#35395A]', { invisible: !isMobile && uuid === selectedUuid }]"
        :data-outline="name"
      >
        {{ name }}
      </span>
    </div>
  </DefineTemplate>

  <CustomMarker
    v-for="location in singles" :key="location.uuid"
    :options="{ position: { lng: location.lng, lat: location.lat }, anchorPoint: showSingleName ? 'LEFT_CENTER' : 'CENTER' }"
  >
    <ReuseTemplate v-if="isMobile" :location="location" @click="selectedUuid = location.uuid" />

    <PopoverRoot
      v-else
      :default-open="location.uuid === initialUuid"
      @update:open="isOpen => selectedUuid = isOpen ? location.uuid : undefined"
    >
      <PopoverAnchor
        class="absolute h-full pointer-events-none -left-1"
        :class="location.isAtm || showCategoryIcon ? 'w-10' : 'w-5'"
      />
      <PopoverTrigger :aria-label="$t('See location details')" class="cursor-pointer" :data-trigger-uuid="location.uuid">
        <ReuseTemplate :location="location" class="transition-shadow rounded-sm" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent side="right" :side-offset="5" class="rounded-lg shadow">
          <Card :location="location" :progress="1" class="max-w-xs" />
          <PopoverArrow class="w-4 h-2" />

          <PopoverArrow as-child>
            <svg
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 10" class="relative h-3 w-max left-2"
              :style="`fill: ${location.isAtm ? extractColorFromBg(location.bg) : 'white'}`"
            >
              <path
                fill="currentColor"
                d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z"
              />
            </svg>
          </PopoverArrow>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </CustomMarker>
</template>
