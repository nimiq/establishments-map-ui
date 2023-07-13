<script setup lang="ts">
import { useDraggable, now } from '@vueuse/core';
import { useClamp } from '@vueuse/math';
import { computed, ref, watch } from 'vue';

const VELOCITY_THRESHOLD = 0.1;
const HEIGHT_MULTIPLIER = 0.8;
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

const emit = defineEmits<{
  (e: 'progress', progress: number): void
}>()

const container = ref<HTMLElement | null>(null)
const height = ref(props.initialHeight)
const clampedHeight = useClamp(height, props.initialHeight, props.maxHeight)
const progress = computed(() => {
  const progress = (height.value - props.initialHeight) / (props.maxHeight - props.initialHeight)
  const normalizedProgress = Math.min(Math.max(progress, 0), 1)
  return normalizedProgress
})
watch(height, () => emit('progress', progress.value))

function easeOutCubic(t: number): number {
  return (--t) * t * t + 1;
}

let initialY = 0

let initialTime = 0
let lastTime = now()

const velocity = ref(0)
const lastPosition = ref(0)
watch(velocity, updateHeight)

function updateHeight() {
  const normalizedVelocity = Math.abs(velocity.value) / VELOCITY_THRESHOLD;
  const easedVelocity = easeOutCubic(normalizedVelocity);
  height.value += Math.sign(velocity.value) * easedVelocity * HEIGHT_MULTIPLIER;
}

useDraggable(container, {
  preventDefault: true,
  stopPropagation: true,
  axis: 'y',
  onStart(position, event) {
    initialTime = now()
    lastTime = now()
    lastPosition.value = event.clientY
    initialY = event.clientY
  },
  onMove(position, event) {
    const moved = lastPosition.value - event.clientY
    const time = now() - lastTime
    velocity.value = moved / time
    lastTime = now()
    lastPosition.value = event.clientY
  },
  onEnd(position, event) {
    updateHeight()
    const minDrag = Math.abs(event.clientY - initialY) > 20
    if (minDrag)
      if (height.value > props.maxHeight / 2 || velocity.value > 0) {
        open();
      } else {
        close();
      }
  },
})

function open() {
  height.value = props.maxHeight;
}

function close() {
  height.value = props.initialHeight;
}

function onClick() {
  const clickDuration = lastTime - initialTime
  if (clickDuration < 4 /* ms */) open()
}
</script>

<template>
  <div ref="container" :style="`height: ${clampedHeight}px;`" @click="onClick">
    <div class="pt-2 pb-5 cursor-grab">
      <hr class="w-32 h-1 mx-auto border-0 rounded-full bg-black/20">
    </div>
    <slot />
  </div>
</template>
