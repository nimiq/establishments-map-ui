<script setup lang="ts">
import { ref } from 'vue'
import { createReusableTemplate } from '@vueuse/core'
import Button from '../atoms/Button.vue'
import DesktopList from './DesktopList.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import IconChevronDown from '@/components/icons/icon-chevron-down.vue'
import type { Location } from '@/types'
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
        <div class="absolute flex flex-col max-w-xs bottom-6 top-6 left-6 h-max pointer-events-none [&>*]:pointer-events-auto">
          <div class="bg-white shadow-header rounded-2xl" style="mask-image: linear-gradient(white, white);">
            <InteractionBar />
            <DesktopList :locations="Object.values(locations)" :clusters="[]" :list-is-shown="listIsShown" />
          </div>
          <Button bg-color="white" class="mt-6" @click="listIsShown = !listIsShown">
            <template #icon>
              <IconChevronDown :class="{ 'rotate-180': listIsShown }" class="transition-transform delay-500" />
            </template>
            <template #label>
              <template v-if="listIsShown">
                {{ $t('Hide list') }}
              </template>
              <template v-else>
                {{ $t('Show list') }}
              </template>
            </template>
          </Button>
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
