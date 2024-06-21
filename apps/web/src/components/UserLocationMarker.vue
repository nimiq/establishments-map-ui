<script lang="ts" setup>
import { EstimatedMapPosition } from "types";
import { metersToPx } from "../../../../packages/geo/src/geo-utils.js";

const props = defineProps<{ browserPosition: EstimatedMapPosition }>();

const { zoom } = storeToRefs(useMap())
const accuracyCircleEl = ref();
const radius = useCssVar("--radius", accuracyCircleEl, { initialValue: "64px" });

watch([props.browserPosition, zoom], () => {
  const pixelRadius = metersToPx(props.browserPosition.accuracy, zoom.value, props.browserPosition.center.lat);
  radius.value = `${Math.min(zoom.value < 11 ? 0 : 64, Math.max(24, pixelRadius))}px`;
}, { immediate: true });

</script>

<template>
  <div grid="~ cols-1 rows-1" pointer-events-none>
    <div size-10 rounded-full bg-blue ring="2 white" col-span-full row-span-full self-center justify-self-center z-1 />
    <div rounded-full bg-blue-300 op-60 size="$radius" transition-all duration-400 col-span-full row-span-full ref="accuracyCircleEl" />
  </div>
</template>
