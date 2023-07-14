<script setup lang="ts">
import { useDraggable, useWindowSize } from '@vueuse/core';
import { computed, ref } from 'vue';

const INITIAL_GAP = 20/*px*/
const props = defineProps({
  initialHeight: {
    type: Number,
    required: true,
  },
  maxHeight: {
    type: Number,
    required: true,
  },
})

const progress = ref(0)
const dif = props.maxHeight - props.initialHeight

let initialTime = 0
const container = ref<HTMLElement | null>(null)
const { y } = useDraggable(container, {
  preventDefault: true,
  axis: 'y',
  onStart: () => {
    initialTime = Date.now()
  },
  onMove: ({ y }) => {
    const draggableHeight = windowHeight.value - y
    progress.value = Math.max(0, Math.min((draggableHeight - props.initialHeight) / dif, 1))
  },
  onEnd: () => {
    container.value?.style.setProperty('--duration', '0.25s');
    setTimeout(() => container.value?.style.removeProperty('--duration'), 250);
    progress.value < 0.5 ? close() : open()
  }
})

const { height: windowHeight } = useWindowSize()

const style = computed(() => {
  const gap = (1 - progress.value) * INITIAL_GAP
  const borderRadius = (1 - progress.value) * 0.5
  const height = props.initialHeight + dif * progress.value

  return {
    top: `${windowHeight.value - height - gap}px`,
    left: `${gap}px`,
    right: `${gap}px`,
    borderBottomRightRadius: `${borderRadius}rem`,
    borderBottomLeftRadius: `${borderRadius}rem`,
    height: `${height}px`,
  }
})

function close() {
  progress.value = 0
}

function open() {
  progress.value = 1
}

function onClick() {
  const duration = Date.now() - initialTime
  console.log({ duration })
  if (duration < 100) {
    container.value?.style.setProperty('--duration', '0.25s');
    setTimeout(() => container.value?.style.removeProperty('--duration'), 250)
    progress.value = 1
  }
}
</script>

<template>
  <div ref="container" class="absolute sheet-transition" :style="style" @click="onClick">
    <div class="pt-2 pb-5 cursor-grab">
      <hr class="w-32 h-1 mx-auto border-0 rounded-full bg-black/20">
    </div>
    <slot />
  </div>
</template>

<style>
.sheet-transition {
  --gap-duration: calc(var(--duration));
  transition: top var(--gap-duration) ease-in-out, left var(--gap-duration) ease-in-out, right var(--gap-duration) ease-in-out,
    border-radius var(--duration) ease-in-out, height var(--duration) ease-in-out;
}
</style>
