<script lang="ts" setup>
import type { EstimatedMapPosition } from 'types'
import { metersToPx } from 'geo'

const props = defineProps<{ browserPosition: EstimatedMapPosition }>()

const { zoom } = storeToRefs(useMap())
const accuracyCircleEl = ref()
const radius = useCssVar('--radius', accuracyCircleEl, { initialValue: '64px' })

watch([props.browserPosition, zoom], () => {
  const pixelRadius = metersToPx(props.browserPosition.accuracy, zoom.value, props.browserPosition.center.lat)
  radius.value = `${Math.min(zoom.value < 11 ? 0 : 64, Math.max(24, pixelRadius))}px`
}, { immediate: true })
</script>

<template>
  <div grid="~ cols-1 rows-1" pointer-events-none>
    <div ring="2 white" z-1 col-span-full row-span-full size-10 self-center justify-self-center rounded-full bg-blue />
    <div ref="accuracyCircleEl" size="$radius" col-span-full row-span-full rounded-full bg-blue-300 op-60 transition-all duration-400 />
  </div>
</template>
