<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import TheMapInstance from '@/components/elements/TheMapInstance.vue'
import MobileList from '@/components/elements/MobileList.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import Controls from '@/components/elements/Controls.vue'
import ShowListButton from '@/components/elements/ShowListButton.vue'
import { useCluster } from '@/stores/cluster'
import { useApp } from '@/stores/app'
import { useLocations } from '@/stores/locations'

const { firstLocationsLoaded } = storeToRefs(useApp())
const { singles } = storeToRefs(useCluster())

const isListShown = ref(false)

// TODO: Only show list when user searched for something
// watch(firstLocationsLoaded, () => {
//   if (firstLocationsLoaded.value)
//     isListShown.value = true
// })

const { selectedUuid } = storeToRefs(useLocations())
watch(selectedUuid, (uuid) => {
  if (uuid)
    isListShown.value = true
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <InteractionBar />
    <TheMapInstance class="relative flex-1" />
    <FilterModal class="absolute top-24 right-5" />
    <Controls class="absolute bottom-6 right-6" :class="{ hidden: isListShown }" />
    <transition
      enter-from-class="translate-y-[110%] opacity-0" leave-to-class="translate-y-[110%] opacity-0"
      enter-active-class="transition duration-300" leave-active-class="transition duration-300"
    >
      <template v-if="singles.length > 0">
        <MobileList v-if="isListShown" :locations="singles" class="absolute bottom-0 w-full" @close-list="isListShown = false; selectedUuid = undefined;" />
        <ShowListButton
          v-else :first-locations-loaded="firstLocationsLoaded" :list-is-shown="isListShown" chevron-direction="up"
          class="absolute -translate-x-1/2 bottom-6 left-1/2" @click="isListShown = true"
        />
      </template>
    </transition>
  </div>
</template>
