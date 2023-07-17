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
  initialBorderRadius: {
    type: Number,
    default: 0,
  },
  initialGapToScreen: {
    type: Number,
    default: 20,
  },
})

const emit = defineEmits({
  'update:progress': (_: number) => true,
})

const dif = props.maxHeight - props.initialHeight

let initialY = 0
let initialTime = 0
let isOpen = false
const container = ref<HTMLElement | null>(null)

function onStart(event: PointerEvent) {
  initialTime = event.timeStamp
  initialY = event.clientY
  isOpen = props.progress === 1
  container.value!.setPointerCapture(event.pointerId)
}

function onMove(event: PointerEvent) {
  const yDelta = (initialY - event.clientY)
  const startingPoint = isOpen ? yDelta + dif : yDelta
  const newProgress = Math.max(0, Math.min(startingPoint / dif, 1))
  emit('update:progress', newProgress)
}

function onEnd(event: PointerEvent) {
  container.value!.releasePointerCapture(event.pointerId)

  animateShortly()
  const timeDelta = event.timeStamp - initialTime

  // Touch events seems to be faster than mouse events
  const isClick = event.pointerType === "touch"
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

function animateShortly() {
  document.documentElement.style.setProperty('--duration', '0.2s')
  setTimeout(() => document.documentElement.style.removeProperty('--duration'), 100)
}

const style = ref()
function onCardDrag(progress: number) {
  const radius = (1 - progress) * props.initialBorderRadius

  style.value = {
    height: `${props.initialHeight + dif * progress}px`,
    marginBottom: `${(1 - progress) * props.initialGapToScreen}px`,
    borderBottomRightRadius: `${radius}px`,
    borderBottomLeftRadius: `${radius}px`,
    width: `${window.innerWidth - (1 - progress) * 40}px`,
  }
}
watch(() => props.progress, onCardDrag, { immediate: true })
</script>

<template>
  <article ref="container" class="absolute h-full touch-none sheet-transition will-change-auto"
    @pointerdown.prevent="onStart" @pointermove.prevent="onMove" @pointerup.prevent="onEnd" :style="style">
    <slot name="dragger">
      <div class="pt-2 pb-5 cursor-grab">
        <hr class="w-32 h-1 mx-auto border-0 rounded-full bg-black/20">
      </div>
    </slot>

    <slot />
  </article>
</template>

<style>
.sheet-transition {
  transition: margin-bottom var(--duration), margin-left var(--duration), width var(--duration), border-bottom-right-radius var(--duration), border-bottom-left-radius var(--duration), height var(--duration);
}
</style>
