<script setup lang="ts">
import { createReusableTemplate, useBreakpoints } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { screens } from 'tailwindcss-nimiq-theme'
import { defineAsyncComponent } from 'vue'
import { CustomMarker } from 'vue3-google-map'

// @ts-expect-error The types will be added in the future
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import type { Location, Point } from '@/types'
import { useMap } from '@/stores/map'
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
</script>

<template>
  <CustomMarker
    v-for="({ center, count, clusterId }, i) in clusters" :key="i"
    :options="{ position: center, anchorPoint: 'CENTER' }"
  >
    <div class="grid text-sm font-bold text-white rounded-full shadow cursor-pointer aspect-square place-content-center bg-space ring-white/20 ring-2 ring-offset-1 ring-offset-white/40" :style="`width: clamp(24px, ${0.24 * count + 24}px, 48px); font-size: clamp(14px, ${0.14 * count + 4}px, 18px)`" @click="onClusterClick(center, clusterId)">
      {{ count < 100 ? count : '99+' }}
    </div>
  </CustomMarker>

  <DefineTemplate v-slot="{ location: { category, name } }">
    <div class="flex items-center gap-x-2 max-w-[176px]">
      <div v-if="showCategoryIcon()" class="grid w-8 h-8 text-white rounded-full shadow ring-white/40 ring-2 place-content-center bg-space">
        <CategoryIcon :category="category" class="w-7" />
      </div>
      <div v-else class="grid w-3 h-3 text-sm font-bold text-white rounded-full shadow ring-white/40 ring-2 place-content-center bg-space" />
      <span v-if="showSingleName()" class="flex-1 font-semibold leading-none text-left text-space" style="font-size: 16.5px; text-stroke: 0.5px white;">
        {{ name }}
      </span>
    </div>
  </DefineTemplate>

  <CustomMarker
    v-for="(location, i) in singles" :key="i"
    :options="{ position: { lng: location.lng, lat: location.lat }, anchorPoint: showSingleName() ? 'LEFT_CENTER' : 'CENTER' }"
  >
    <ReuseTemplate v-if="isMobile" :location="location" />

    <PopoverRoot v-else>
      <PopoverTrigger :aria-label="$t('See location details')" class="p-1 cursor-pointer">
        <ReuseTemplate :location="location" class="px-1 transition-shadow rounded-sm" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent side="right" :side-offset="5" class="shadow">
          <Card :location="location" :progress="1" class="max-w-xs" />
          <PopoverArrow :style="`fill: ${location.bg};width: 16px;height:8px`" />

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
