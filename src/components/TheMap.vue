<script setup lang="ts">
import type { PropType } from 'vue'
import Button from '@/components/atoms/Button.vue'
import GeolocationIcon from '@/components/icons/icon-geolocation.vue'
import MinusIcon from '@/components/icons/icon-minus.vue'
import PlusIcon from '@/components/icons/icon-plus.vue'
import TheMapInstance from '@/components/TheMapInstance.vue'
import type { Location } from '@/database'

const props = defineProps({
  locations: {
    type: Array as PropType<Location[]>,
    required: true,
  },
})
</script>

<template>
  <main class="h-full">
    <TheMapInstance :locations="props.locations">
      <template #button-calculate-position="{ navigateToUserLocation }">
        <Button
          style="width: 34px; height: 34px" bg-color="white" size="sm" draggable="false"
          :aria-label="$t('Show your location')" :title="$t('Show your location')" @click="navigateToUserLocation"
        >
          <template #icon>
            <GeolocationIcon />
          </template>
        </Button>
      </template>

      <template #button-zoom-in="{ zoomIn }">
        <Button
          style="width: 34px; height: 34px" class="rounded-b-0 p-[5px] pb-1" bg-color="white" size="sm"
          draggable="false" :aria-label="$t('Zoom in')" :title="$t('Zoom in')" @click="zoomIn"
        >
          <template #icon>
            <PlusIcon />
          </template>
        </Button>
      </template>

      <template #button-zoom-out="{ zoomOut }">
        <Button
          style="width: 34px; height: 34px" class="rounded-t-0 p-[5px] pt-1" bg-color="white" size="sm"
          draggable="false" :aria-label="$t('Zoom out')" :title="$t('Zoom out')" @click="zoomOut"
        >
          <template #icon>
            <MinusIcon />
          </template>
        </Button>
      </template>
    </TheMapInstance>
    <Button
      class="absolute shadow bottom-5 md:bottom-6 right-5 md:right-6" bg-color="white" href="/location/add"
      size="md" text-color="ocean" draggable="false" :aria-label="$t('Add location')"
      :title="$t('Add location')"
    >
      <template #label>
        {{ $t('Add location') }}
      </template>
    </Button>
  </main>
</template>
