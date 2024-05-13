<script setup lang="ts">
defineProps<{ location: MapLocation }>()
const { selectedUuid } = storeToRefs(useLocations())
const { fillMarker, showLocationName } = useUIParams()
</script>

<template>
  <div
    flex="~ items-center gap-8" group max-w-176 :data-active="location.uuid === selectedUuid || undefined"
    :style="{ '--c1': location.bg[0], '--c2': location.bg[1] || location.bg[0] }" @click="selectedUuid = location.uuid"
  >
    <!-- Markers when the user zooms out -->
    <div v-if="!fillMarker" class="marker" size-12 text-12 bg="$c1 image-$c1 hocus:$c2 hocus:image-$c2" />

    <!-- Markers for ATMs -->
    <div
      v-else-if="location.isAtm" ring="1.5 $c1 op-10"
      bg="$c1 image-$c1 hocus:$c2 hocus:image-$c2" centered size-32 rounded-full text-white transition-colors
    >
      {{ $t('ATM') }}
    </div>

    <!-- Markers when the user zooms in and it is not an ATM -->
    <div v-else class="marker" centered size-32 text-20>
      <div :class="getCategoryIcon(location.category)" />
    </div>

    <!-- Text -->
    <span
      v-if="!location.isAtm && showLocationName" class="text" :data-outline="location.name"
      :class="{ invisible: !isMobile && location.uuid === selectedUuid }"
    >
      {{ location.name }}
    </span>
  </div>
</template>

<style scoped>
.marker {
  --uno: ring-1.5 ring-neutral/3 group-data-[active]:ring-blue/6 group-hocus:ring-blue/6;
  --uno: bg-neutral group-data-[active]:bg-blue group-hocus:bg-blue-1100;
  --uno: transition-colors rounded-full shadow text-neutral-0;
}

.text {
  --uno: flex-1 relative select-none;
  --uno: text-16 text-left text-neutral font-bold group-data-[active]:text-blue group-hocus:text-blue-1100 lh-none;
  -webkit-text-stroke: 3px rgb(var(--nq-neutral-0));
  transition: -webkit-text-stroke 0.3s, color 0.3s;

  &::before {
    content: attr(data-outline);
    position: absolute;
    -webkit-text-stroke: 0;
  }
}
</style>
