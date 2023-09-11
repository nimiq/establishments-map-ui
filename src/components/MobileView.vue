<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Controls from '@/components/elements/Controls.vue'
import FilterModal from '@/components/elements/FilterModal.vue'
import InteractionBar from '@/components/elements/InteractionBar.vue'
import MobileList from '@/components/elements/MobileList.vue'
import TheMapInstance from '@/components/elements/TheMapInstance.vue'
import { useApp } from '@/stores/app'
import { useCluster } from '@/stores/cluster'
import { useLocations } from '@/stores/locations'

const { firstLocationsLoaded, isListShown } = storeToRefs(useApp())
const { singlesInView, clustersInView } = storeToRefs(useCluster())

// TODO: Only show list when user searched for something
// watch(firstLocationsLoaded, () => {
//   if (firstLocationsLoaded.value)
//     isListShown.value = true
// })

const { selectedUuid } = storeToRefs(useLocations())
watch(selectedUuid, (uuid) => {
  if (uuid)
    isListShown.value = true
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col supports-[height:100dvh]:h-[100dvh] h-screen">
    <InteractionBar />
    <TheMapInstance class="flex-1" />
    <!-- Shadow -->
    <!-- <div
      :class="{ 'translate-y-0 delay-100 duration-500 opacity-20': isListShown, 'translate-y-full duration-500 opacity-0': !isListShown }"
      class="absolute bottom-0 w-full h-[184px] transition-[transform,opacity] will-change-transform pointer-events-none bg-gradient-to-t from-space to-space/0"
    /> -->
    <FilterModal class="absolute top-24 right-5" />
    <transition name="scale">
      <Controls v-if="singlesInView.length === 0 || !isListShown" class="absolute bottom-6 right-6" />
    </transition>
    <transition
      enter-from-class="translate-y-[110%] opacity-0" leave-to-class="translate-y-[110%] opacity-0"
      enter-active-class="transition duration-300" leave-active-class="transition duration-300"
    >
      <Button v-if="!firstLocationsLoaded" bg-color="white" loading class="absolute -translate-x-1/2 shadow bottom-6 left-1/2" as="label">
        <template #label>{{ $t('Loading') }}</template>
      </Button>
      <template v-else-if="singlesInView.length > 0">
        <MobileList v-if="isListShown" :locations="singlesInView" class="absolute bottom-0 w-full" @close-list="isListShown = false; selectedUuid = undefined;" />
        <Button v-else bg-color="white" class="absolute -translate-x-1/2 shadow bottom-6 left-1/2" @click="isListShown = true">
          <template #label>{{ $t('Show list') }}</template>
        </Button>
      </template>
      <Button v-else-if="clustersInView.length && clustersInView.length === 0" bg-color="white" class="shadow absolute -translate-x-1/2 bottom-6 left-1/2 [&>span]:text-pumpkin" as="label">
        <template #label>{{ $t('Oops, no businesses around here') }}</template>
      </Button>
    </transition>
  </div>
</template>

<style scoped>
.scale-enter-active {
  animation: icon-in 200ms ease-out 200ms;
  opacity: 0;
}

.scale-leave-active {
  animation: icon-in 150ms ease-in reverse;
}

@keyframes icon-in {
  0% {
    transform: scale(0.75);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
