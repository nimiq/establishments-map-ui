<script setup lang="ts">
const { isListShown } = storeToRefs(useApp())
const { singlesInView } = storeToRefs(useMarkers())
const { selectedUuid } = storeToRefs(useLocations())

watch(selectedUuid, (uuid) => {
  if (uuid)
    isListShown.value = true
}, { immediate: true })
</script>

<template>
  <div flex="~ col" h="screen 100dvh">
    <!-- <InteractionBar /> -->
    <TheMapInstance flex-1 />
    <Controls v-if="singlesInView.length === 0 || !isListShown" class="absolute bottom-6 right-6" />
    <!-- <transition enter-from-class="translate-y-[110%] opacity-0" leave-to-class="translate-y-[110%] opacity-0"
      enter-active-class="transition duration-300" leave-active-class="transition duration-300">
      <template v-if="singlesInView.length > 0">
        <MobileList v-if="isListShown" :locations="singlesInView" absolute bottom-0 w-full
          @close-list="isListShown = false; selectedUuid = undefined;" />
        <button pill-tertiary pill-sm @click="isListShown = true" v-else absolute shadow translate-x="-50%" bottom-24
          left="50%">
          {{ $t('Show list') }}
        </button>
      </template>
<button pill-tertiary pill-sm text-orange @click="isListShown = true" v-else absolute shadow translate--x="50%" bottom-6
  left="50%">
  {{ $t('Oops, no businesses around here') }}
</button>
</transition> -->
  </div>
</template>
