<script setup lang="ts">
import { ref } from 'vue'
import { createReusableTemplate } from '@vueuse/core'
import type { Location } from 'types'
import Button from '../atoms/Button.vue'
import DesktopList from './DesktopList.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import { locations as defaultLocations } from '@/assets-dev/stories/locations'
import { locations as locationsEdgeCases } from '@/assets-dev/stories/locations-edge-cases'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{ locations: Location[] }>()

const listIsShown = ref(true)
</script>

<template>
  <Story>
    <DefineTemplate v-slot="{ locations }">
      <div class="relative h-screen">
        <img src="@/assets-dev/stories/map-new-york-square.png" alt="" class="object-cover h-full">
        <div class="absolute flex flex-col max-w320 bottom-6 top-6 left-6 h-max pointer-events-none [&>*]:pointer-events-auto">
          <div class="bg-white shadow-header rounded-2xl" style="mask-image: linear-gradient(white, white);">
            <InteractionBar />
            <DesktopList :singles="Object.values(locations)" :clusters="[]" :list-is-shown="listIsShown" />
          </div>
          <button pill-blue @click="listIsShown = !listIsShown" class="mt6">
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
