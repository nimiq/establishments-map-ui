<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'

const { setPosition } = useMap()
const { zoom } = storeToRefs(useMap())
const { clusters } = storeToRefs(useMarkers())

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

function onPointer({ type }: PointerEvent, c: Cluster) {
  if (isMobile || c.cryptocities.length === 0)
    return

  setExpansionCluster(c.id, type === 'pointerover' ? '1' : '0')
}

function onPointerDown(e: PointerEvent, c: Cluster) {
  if (isMobile && c.cryptocities.length > 0)
    toggleClusterExpansion(c, e)
  else
    onClusterClick(c)
}

function getClusterStyles(c: Cluster) {
  return {
    '--expanded': 0,
    'left': `calc(-1 * ${c.diameter / 2}px)`, // To centered it after we set it to the left in the anchor point
    'padding-right': `calc(var(--expanded) * ${c.diameter * c.cryptocities.length + 8}px)`,
  }
}

const { cryptocities } = storeToRefs(useCryptocities())

const router = useRouter()
const route = useRoute()

function onCryptocityClick(cryptocityName: Cryptocity) {
  const { lat, lng, name, showCardAtZoom } = cryptocities.value.data[cryptocityName]!
  setPosition({ center: { lat, lng }, zoom: showCardAtZoom }, { clearMarkers: true })
  router.push({ query: { ...route.query, cryptocity: name } })
}
</script>

<template>
  <CustomMarker
    v-for="c in clusters" :key="c.id"
    :options="{ position: c, anchorPoint: c.cryptocities.length === 0 ? 'CENTER' : 'LEFT_CENTER' }" data-custom-marker
    :class="c.cryptocities.length > 0 && 'z-10'"
  >
    <OnClickOutside @trigger="isMobile && toggleClusterExpansion(c, $event)">
      <ul
        :data-cluster-id="c.id" relative :style="getClusterStyles(c)" @pointerover="e => onPointer(e, c)"
        @pointerout="e => onPointer(e, c)"
      >
        <li relative z-10>
          <button
            text="14 neutral-0 dark:white/80" bg="neutral dark:blue hover:neutral-900" ring="1.5 neutral/10"
            centered aspect-square cursor-pointer rounded-full font-bold transition-colors shadow
            :style="`width: ${c.diameter}px; font-size: clamp(14px, ${0.14 * c.count + 4}px, 18px)`"
            @pointerdown="e => onPointerDown(e, c)"
          >
            {{ c.count < 1000 ? c.count : '999+' }}
          </button>
        </li>

        <li
          v-for="(city, i) in c.cryptocities" :key="city" absolute top-0 transition-all :style="`
        z-index: ${c.cryptocities.length - i};
        width: ${c.diameter}px;
        --offset-1: calc(${i + 1} * 12px); /* If is not expanded */
        --offset-2: calc((100% * ${i + 1}) + (${i + 1} * 8px)); /* If is expanded */
        transform: translateX(calc(var(--offset-1) * (1 - var(--expanded)) + var(--offset-2) * var(--expanded))) rotate(calc((1 - var(--expanded)) * -90deg));
          padding-left: calc(1 - var(--expanded) * 2px);
          `"
        >
          <div
            centered aspect-square cursor-pointer rounded-full bg-neutral-0 p-4 shadow
            @click="onCryptocityClick(city)"
          >
            <div absolute inset-0 rounded-full transition-background-color duration-400 group-hocus="bg-neutral/6" />
            <div i-nimiq:logos-cryptocity :style="{ fontSize: `${c.diameter * 0.75}px` }" />
          </div>
        </li>
      </ul>
    </OnClickOutside>
  </CustomMarker>
</template>
