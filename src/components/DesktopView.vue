<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import TheMapInstance from '@/components/elements/TheMapInstance.vue'
import Button from '@/components/atoms/Button.vue'
import Controls from '@/components/elements/Controls.vue'
import DesktopList from '@/components/elements/DesktopList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import IconChevronDown from '@/components/icons/icon-chevron-down.vue'
import { useLocations } from '@/stores/locations'

const locationsStore = useLocations()
const { locations, loaded: locationsLoaded } = storeToRefs(locationsStore)

const listIsShown = ref(false)
</script>

<template>
  <TheMapInstance class="relative flex flex-col w-screen h-screen" :locations="locations" />
  <div
    v-for="i in 2" :key="i"
    :class="{ 'translate-x-0 delay-100 duration-500 opacity-10': listIsShown, '-translate-x-full duration-1000 delay-75 opacity-0': !listIsShown }"
    class="absolute inset-0 max-w-[368px] transition-[transform,opacity] will-change-transform pointer-events-none bg-gradient-to-r from-space to-space/0"
  />
  <div class="absolute flex flex-col max-w-xs bottom-6 top-6 left-6 h-max pointer-events-none [&>*]:pointer-events-auto">
    <div class="bg-white shadow-header rounded-2xl" style="mask-image: linear-gradient(white, white);">
      <InteractionBar />
      <DesktopList :locations="locations" :list-is-shown="listIsShown" />
    </div>
    <Button bg-color="white" class="mt-6" :loading="!locationsLoaded" @click="listIsShown = !listIsShown">
      <template v-if="locationsLoaded" #icon>
        <IconChevronDown :class="{ 'rotate-180': listIsShown }" class="transition-transform delay-500" />
      </template>
      <template #label>
        <template v-if="!locationsLoaded">
          {{ $t('Loading') }}
        </template>
        <template v-else-if="listIsShown">
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
</template>
