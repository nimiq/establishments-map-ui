<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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

const heightDifference = props.maxHeight - props.initialHeight

let initialY = 0
let initialX = 0
let initialOpen = false
const dragging = ref(false)
const container = ref<HTMLElement | null>(null)
const isOpen = computed(() => props.progress === 1)

function onStart(event: PointerEvent) {
  dragging.value = true
  initialY = event.clientY
  initialX = event.clientX
  initialOpen = isOpen.value
  container.value!.setPointerCapture(event.pointerId)
}

function onMove(event: PointerEvent) {
  if (!dragging.value)
    return

  const yDelta = initialY - event.clientY

  if (Math.abs(yDelta) < 10)
    return

  let newProgress: number
  if (initialOpen) {
    // yDelta is negative for dragging down
    newProgress = Math.min(Math.max(heightDifference + yDelta, 0), heightDifference) / heightDifference
  }
  else {
    // yDelta is positive for dragging up
    newProgress = Math.min(Math.max(yDelta, 0), heightDifference) / heightDifference
  }
  emit('update:progress', newProgress)
}

function onEnd(event: PointerEvent) {
  dragging.value = false
  container.value!.releasePointerCapture(event.pointerId)

  animateShortly()

  const isClick = Math.abs(initialY - event.clientY) < 10 && Math.abs(initialX - event.clientX) < 10

  if (isClick && !initialOpen) {
    open()
  }
  else {
    if (initialOpen)
      props.progress < 0.85 ? close() : open()

    else
      props.progress > 0.15 ? open() : close()
  }
}

function onCancel(event: PointerEvent) {
  dragging.value = false
  container.value!.releasePointerCapture(event.pointerId)
  animateShortly()
  if (initialOpen)
    open()
  else
    close()
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
    height: `${props.initialHeight + heightDifference * progress}px`,
    marginBottom: `${(1 - progress) * props.initialGapToScreen}px`,
    borderBottomRightRadius: `${radius}px`,
    borderBottomLeftRadius: `${radius}px`,
    width: `${window.innerWidth - (1 - progress) * 40}px`,
  }
}
watch(() => props.progress, onCardDrag, { immediate: true })

function resizeListener() {
  onCardDrag(props.progress)
}

onMounted(() => {
  window.addEventListener('resize', resizeListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeListener)
})
</script>

<template>
  <article
    ref="container" class="absolute h-full touch-pan-x sheet-transition will-change-auto"
    :style="style" @pointerdown="onStart" @pointermove="onMove" @pointerup="onEnd" @pointercancel="onCancel"
  >
    <slot name="dragger">
      <div class="relative">
        <hr
          class="absolute inset-x-0 z-10 w-32 h-1 mx-auto mt-2 ml-auto border-0 rounded-full bg-black/20"
          :class="{
            'bg-white mt-3': isOpen,
            'mix-blend-darken': !isOpen,
          }"
        >
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
