<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  initialHeight: {
    type: Number,
    required: true,
  },
  maxHeight: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits({
  'update:progress': (_: number) => true,
})

const dif = props.maxHeight - props.initialHeight

let initialY = 0
let initialTime = 0
const dragging = ref(false)
let isOpen = false
const container = ref<HTMLElement | null>(null)

function onStart(event: PointerEvent) {
  dragging.value = true
  initialTime = event.timeStamp
  initialY = event.clientY
  isOpen = props.progress === 1
  container.value!.setPointerCapture(event.pointerId)
}

function onMove(event: PointerEvent) {
  if (!dragging.value) return
  const yDelta = (initialY - event.clientY)
  const startingPoint = isOpen ? yDelta + dif : yDelta
  const newProgress = Math.max(0, Math.min(startingPoint / dif, 1))
  emit('update:progress', newProgress)
}

function onEnd(event: PointerEvent) {
  dragging.value = false
  container.value!.releasePointerCapture(event.pointerId)

  animateShortly()
  const isTouch = event.pointerType === "touch"
  const timeDelta = event.timeStamp - initialTime

  const isClick = isTouch
    ? timeDelta < 100
    : timeDelta < 250

  if (isClick && !isOpen) {
    open()
  } else {
    if (isOpen) {
      props.progress < 0.85 ? close() : open()
    } else {
      props.progress > 0.15 ? open() : close()
    }
  }
}

function close() {
  emit('update:progress', 0)
}

function open() {
  emit('update:progress', 1)
}

defineExpose({
  open,
  close,
})

function animateShortly() {
  container.value?.style.setProperty('--duration', '0.2s')
  setTimeout(() => container.value?.style.removeProperty('--duration'), 100)
}
</script>

<template>
  <article ref="container" class="absolute h-full touch-none" @pointerdown.prevent="onStart" @pointermove.prevent="onMove"
    @pointerup.prevent="onEnd">
    <div class="pt-2 pb-5 cursor-grab">
      <hr class="w-32 h-1 mx-auto border-0 rounded-full bg-black/20">
    </div>
    <slot />
  </article>
</template>
