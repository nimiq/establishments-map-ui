<script setup lang="ts">
import { storeToRefs } from 'pinia'
import TheMapInstance from '@/components/TheMapInstance.vue'
import Button from '@/components/atoms/Button.vue'
import Controls from '@/components/elements/Controls.vue'
import DesktopList from '@/components/elements/DesktopList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import IconChevronDown from '@/components/icons/icon-chevron-down.vue'
import { useApp } from '@/stores/app'
import { useLocations } from '@/stores/locations'

const locationsStore = useLocations()
const { locations } = storeToRefs(locationsStore)

const appStore = useApp()
const { listIsShown } = storeToRefs(appStore)
</script>

<template>
  <TheMapInstance class="relative flex flex-col w-screen h-screen" :locations="locations">
    <div class="absolute flex flex-col max-w-xs bottom-6 top-6 left-6">
      <div class="bg-white shadow-header rounded-2xl" style="mask-image: linear-gradient(white, white);">
        <InteractionBar />
        <DesktopList
          class="transition-[max-height]"
          :class="{
            'max-h-[calc(100vh-10rem)]': listIsShown,
            'max-h-0': !listIsShown,
          }"
        />
      </div>
      <Button bg-color="white" class="mt-6" @click="listIsShown = !listIsShown">
        <template #icon>
          <IconChevronDown :class="{ 'rotate-180': listIsShown }" class="transition-transform delay-500 text-space" />
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
    <FilterModal class="absolute top-6 right-6" />
    <Controls class="absolute bottom-6 right-6" />
  </TheMapInstance>
</template>
