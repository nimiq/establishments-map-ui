<script setup lang="ts">
import type { MapLocation } from 'types'
import { locations as defaultLocations } from '@/assets-dev/stories/locations'
import { locations as locationsEdgeCases } from '@/assets-dev/stories/locations-edge-cases'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ locations: MapLocation[] }>()

const listIsShown = ref(true)
</script>

<template>
  <Story>
    <DefineTemplate v-slot="{ locations }">
      <div class="relative h-screen">
        <img src="@/assets-dev/stories/map-new-york-square.png" alt="" class="h-full object-cover">
        <div
          class="pointer-events-none absolute bottom-6 left-6 top-6 h-max max-w-320 flex flex-col [&>*]:pointer-events-auto"
        >
          <div class="shadow-header rounded-2xl bg-white" style="mask-image: linear-gradient(white, white);">
            <InteractionBar />
            <DesktopList :singles="Object.values(locations)" :clusters="[]" :list-is-shown="listIsShown" />
          </div>
          <button pill-blue class="mt-6" @click="listIsShown = !listIsShown">
            {{ listIsShown ? $t('Hide list') : $t('Show list') }}
          </button>
        </div>
      </div>
    </DefineTemplate>

    <Variant title="Default">
      <ReuseTemplate :locations="Object.values(defaultLocations)" />
    </Variant>
    <Variant title="Edge cases">
      <ReuseTemplate :locations="Object.values(locationsEdgeCases)" />
    </Variant>
  </Story>
</template>
