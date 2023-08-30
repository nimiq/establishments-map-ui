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

// TODO Import this from radix-vue
// const PopoverArrow = defineAsyncComponent(() => import('radix-vue'))
// const PopoverContent = defineAsyncComponent(() => import('radix-vue'))
// const PopoverPortal = defineAsyncComponent(() => import('radix-vue'))
// const PopoverRoot = defineAsyncComponent(() => import('radix-vue'))
// const PopoverTrigger = defineAsyncComponent(() => import('radix-vue'))

const { clusters, singles, clusterAlgorithm } = storeToRefs(useCluster())

const { setPosition, zoom } = useMap()

function onClusterClick(center: Point, clusterId: number) {
  if (!clusterAlgorithm.value)
    return

  // If zoom is lower than 13, the minimum zoom change must be 3
  // To make it more fluid
  const proposedZoom = clusterAlgorithm.value.getClusterExpansionZoom(clusterId)
  const newZoom = proposedZoom < 13 ? Math.max(proposedZoom, zoom() + 3) : proposedZoom

  setPosition({
    center,
    zoom: newZoom,
  })
}

const showSingleName = () => zoom() >= 8
const showCategoryIcon = () => zoom() >= 13

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
</script>

<template>
  <CustomMarker
    v-for="({ center, count, clusterId }) in clusters" :key="clusterId"
    :options="{ position: center, anchorPoint: 'CENTER' }"
  >
    <div class="grid text-sm font-bold text-white rounded-full shadow cursor-pointer aspect-square place-content-center bg-space ring-white/20 ring-2 ring-offset-1 ring-offset-white/40" :style="`width: clamp(24px, ${0.24 * count + 24}px, 48px); font-size: clamp(14px, ${0.14 * count + 4}px, 18px)`" @click="onClusterClick(center, clusterId)">
      {{ count < 100 ? count : '99+' }}
    </div>
  </CustomMarker>

  <DefineTemplate v-slot="{ location: { category, name, isAtm, bg, uuid } }">
    <div class="flex items-center max-w-[176px]">
      <div
        v-if="isAtm" class="grid w-8 h-8 text-white rounded-full shadow ring-white/40 ring-2 place-content-center" :style="`background: ${
          bg}`"
      >
        {{ $t('ATM') }}
      </div>
      <div v-else-if="showCategoryIcon()" class="grid w-8 h-8 text-white rounded-full shadow ring-white/40 ring-2 place-content-center" :class="uuid === selectedUuid ? 'bg-sky' : 'bg-space'">
        <CategoryIcon :category="category" class="w-7" />
      </div>
      <div v-else class="grid w-3 h-3 text-sm font-bold text-white rounded-full shadow ring-white/40 ring-2 place-content-center" :class="uuid === selectedUuid ? 'bg-sky' : 'bg-space'" />
      <PopoverAnchor class="mx-1" />
      <span
        v-if="!isAtm && showSingleName()"
        class="flex-1 text-base font-semibold leading-none text-left outline-text text-space"
        :class="{ invisible: uuid === selectedUuid }"
        :data-outline="name"
      >
        {{ name }}
      </span>
    </div>
  </DefineTemplate>

  <CustomMarker
    v-for="location in singles" :key="location.uuid"
    :options="{ position: { lng: location.lng, lat: location.lat }, anchorPoint: showSingleName() ? 'LEFT_CENTER' : 'CENTER' }"
  >
    <ReuseTemplate v-if="isMobile" :location="location" />

    <PopoverRoot
      v-else
      :default-open="location.uuid === initialUuid"
      @update:open="isOpen => selectedUuid = isOpen ? location.uuid : undefined"
    >
      <PopoverTrigger :aria-label="$t('See location details')" class="p-1 cursor-pointer" :data-trigger-uuid="location.uuid">
        <ReuseTemplate :location="location" class="px-1 transition-shadow rounded-sm" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent side="right" :side-offset="5" class="rounded-lg shadow">
          <Card :location="location" :progress="1" class="max-w-xs" />
          <PopoverArrow :style="`fill: ${location.isAtm ? location.bg : 'white'}; width: 16px; height:8px`" />

          <!-- TODO Once this is fixed https://github.com/radix-vue/radix-vue/issues/353 use custom arrow -->
          <!-- <PopoverArrow as-child>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 10" class="relative h-3 text-space w-max left-2" :style="`color: ${location.bg}`">
              <path
                fill="currentColor"
                d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z"
              />
            </svg>
          </PopoverArrow> -->
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </CustomMarker>
</template>

<style scoped>
.outline-text {
  -webkit-text-stroke: 3px white;
  text-stroke: 3px white;
  position: relative;
}

.outline-text::before {
  content: attr(data-outline);
  position: absolute;
  -webkit-text-stroke: 0;
  text-stroke: 0;
}
</style>
