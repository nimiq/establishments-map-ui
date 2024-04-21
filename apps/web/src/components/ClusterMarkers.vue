<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Cluster } from 'types'
import type { PropType } from 'vue'
import { CustomMarker } from 'vue3-google-map'
import { useBreakpoints } from '@vueuse/core'
import { breakpointsTailwind } from '@vueuse/core'
import { OnClickOutside } from '@vueuse/components'
import CryptocityMarker from './CryptocityMarker.vue'
import { useMap } from '@/stores/map'

defineProps({
  clusters: {
    type: Object as PropType<Cluster[]>,
    required: true,
  },
})

const { setPosition } = useMap()
const { zoom } = storeToRefs(useMap())
const isMobile = useBreakpoints(breakpointsTailwind).smaller('md')

function setExpansionCluster(id: number, open: '0' | '1') {
  (document.querySelector(`[data-cluster-id="${id}"]`) as HTMLElement).style.setProperty('--expanded', open)
}

function toggleClusterExpansion({ id }: Cluster, event?: Event) {
  const clusterUl = document.querySelector(`[data-cluster-id="${id}"]`) as HTMLElement
  const current = clusterUl.style.getPropertyValue('--expanded')
  // If it is outside the cluster and it is 0, do nothing
  if (event && current === '0' && !clusterUl.contains(event.target as Node))
    return
  setExpansionCluster(id, current === '1' ? '0' : '1')
}

function onClusterClick({ expansionZoom, lat, lng }: Cluster) {
  // To make it more fluid if zoom is lower than 13, the minimum zoom change must be 3
  const newZoom = expansionZoom < 13 ? Math.max(expansionZoom, zoom.value + 3) : Math.max(expansionZoom, zoom.value + 1)
  setPosition({ center: { lat, lng }, zoom: newZoom })
}
</script>

<template>
  <CustomMarker
    v-for="c in clusters"
    :key="c.id"
    :options="{ position: c, anchorPoint: c.cryptocities.length === 0 ? 'CENTER' : 'LEFT_CENTER' }"
    data-custom-marker
    :class="c.cryptocities.length > 0 && 'z-10'"
  >
    <OnClickOutside @trigger="isMobile && toggleClusterExpansion(c, $event)">
      <ul
        :data-cluster-id="c.id"
        relative
        :style="`
          --expanded: 0;
          left: calc(-1 * ${c.diameter / 2}px); /* To center it after we set it to the left in the anchor point */
          padding-right: calc(var(--expanded) * ${c.diameter * c.cryptocities.length + 8}px)
        `"
        @pointerover="!isMobile && c.cryptocities.length > 0 ? setExpansionCluster(c.id, '1') : undefined"
        @pointerout="!isMobile && c.cryptocities.length > 0 ? setExpansionCluster(c.id, '0') : undefined"
      >
        <li relative z-10>
          <div grid="~ place-content-center" text="14 neutral-0 dark:white/80" bg="neutral dark:purple hover:neutral-900" ring-neutral-100 transition-colors font-bold rounded-full shadow cursor-pointer aspect-square max-desktop:clickable :style="`width: ${c.diameter}px; font-size: clamp(14px, ${0.14 * c.count + 4}px, 18px)`"
            @pointerdown="isMobile && c.cryptocities.length > 0 ? toggleClusterExpansion(c) : onClusterClick(c)"
          >
            {{ c.count < 1000 ? c.count : '999+' }}
          </div>
        </li>

        <li
          v-for="(city, i) in c.cryptocities" :key="city"
          absolute top-0 transition-all
          :style="`
          z-index: ${c.cryptocities.length - i};
          width: ${c.diameter}px;
          --offset-1: calc(${i + 1} * 12px); /* If is not expanded */
          --offset-2: calc((100% * ${i + 1}) + (${i + 1} * 8px)); /* If is expanded */
          transform: translateX(calc(var(--offset-1) * (1 - var(--expanded)) + var(--offset-2) * var(--expanded))) rotate(calc((1 - var(--expanded)) * -90deg));
          padding-left: calc(1 - var(--expanded) * 2px);
        `"
        >
          <CryptocityMarker :cryptocity="city" />
        </li>
      </ul>
    </OnClickOutside>
  </CustomMarker>
</template>
