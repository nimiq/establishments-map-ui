<script setup lang="ts">
import { computed, ref } from "vue";
import BottomSheetModal from "./BottomSheetModal.vue";

const progress = ref(0)

const style = computed(() => {
  const gap = (1 - progress.value) * 1.25
  const borderRadius = (1 - progress.value) * 0.5
  return {
    bottom: `${gap}rem`,
    left: `${gap}rem`,
    right: `${gap}rem`,
    borderBottomRightRadius: `${borderRadius}rem`,
    borderBottomLeftRadius: `${borderRadius}rem`,
  }
})
</script>

<template>
  <Story title="Modal Sheet">
    <div class="relative flex items-end w-screen h-screen bg-space/20">
      <BottomSheetModal class="absolute text-center bg-white rounded-lg shadow sheet-transition" :style="style"
        :initial-height="171" :max-height="371" @progress="progress = $event">
      </BottomSheetModal>
    </div>
  </Story>
</template>

<style>
.sheet-transition {
  --duration: 0.35s;
  --gap-duration: calc(var(--duration) / 1.75);
  transition: bottom var(--gap-duration) ease-in-out, left var(--gap-duration) ease-in-out, right var(--gap-duration) ease-in-out,
    border-radius var(--duration) ease-in-out, height var(--duration) ease-in-out;
}
</style>
