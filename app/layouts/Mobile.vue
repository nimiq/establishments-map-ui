<script setup lang="ts">
const { isListShown } = storeToRefs(useApp())
const { singlesInView } = storeToRefs(useMarkers())
const { selectedUuid } = storeToRefs(useLocations())

const searchOpen = ref(false)

watch(selectedUuid, (uuid) => {
  if (uuid)
    isListShown.value = true
}, { immediate: true })
</script>

<template>
  <div flex="~ col" h="screen 100dvh">
    <InteractionBar>
      <template #search>
        <button flex="~ justify-between items-center" group input-box flex-1 rounded-full @click="searchOpen = true">
          <span text="neutral-700 group-hocus:$color">
            <!-- {{ $t('Search Map') }} -->
            Search Map
          </span>
          <div i-nimiq:magnifying-glass absolute right-16 text="14 neutral-600 group-hocus:$color" />
        </button>
        <MobileSearch v-model:open="searchOpen" fixed inset-0 bg-neutral-0 />
      </template>
    </InteractionBar>
    <TheMapInstance flex-1 />
    <transition name="scale">
      <MapControls v-if="singlesInView.length === 0 || !isListShown" absolute bottom-24 right-24 />
    </transition>

    <MobileList />
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
