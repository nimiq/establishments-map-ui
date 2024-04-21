<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { TransitionPresets, useTransition } from '@vueuse/core'

const props = defineProps<{ maxHeight: number, initialBorderRadius: number, initialGapToScreen: number }>()

const progress = defineModel<number>('progress', {default:0})

const emit = defineEmits({ 'closeList': () => true })

const containerHeight = ref(0)
const initialHeight = computed(() => containerHeight.value)
const heightDifference = computed(() => props.maxHeight - initialHeight.value)

let initialY = 0
let initialX = 0
let initialOpen = false
let lastEventTime = window.performance.now()
let lastEventY = 0
let speedY = 0
let timerId: number | null = null
const dragging = ref(false)
const container = ref<HTMLElement | null>(null)
const isOpen = computed(() => progress.value === 1)

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

  const currentEventTime = window.performance.now()
  const timeDifference = currentEventTime - lastEventTime
  const dy = event.clientY - lastEventY
  speedY = dy / timeDifference // speed in px/ms
  lastEventTime = currentEventTime
  lastEventY = event.clientY
  if (timerId !== null)
    clearTimeout(timerId)
  timerId = window.setTimeout(() => {
    speedY = 0
  }, 100) // if no event in 100ms, reset speedY to 0

  let newProgress: number
  if (initialOpen) {
    // yDelta is negative for dragging down
    newProgress = Math.min(Math.max(heightDifference.value + yDelta, 0), heightDifference.value) / heightDifference.value
  }
  else {
    // yDelta is positive for dragging up
    if (yDelta > 0)
      newProgress = Math.min(yDelta, heightDifference.value) / heightDifference.value
    else
      // Dragging down to close list
      newProgress = Math.min(yDelta, initialHeight.value) / initialHeight.value
  }
  progress.value = newProgress
}

function onEnd(event: PointerEvent) {
  dragging.value = false
  container.value!.releasePointerCapture(event.pointerId)

  animateShortly()

  const isClick = Math.abs(initialY - event.clientY) < 10 && Math.abs(initialX - event.clientX) < 10

  if (isClick && !initialOpen) {
    open(true)
  }
  else {
    if (initialOpen) {
      progress.value < 0.85 ? close() : open()
    }
    else {
      progress.value > 0.15 ? open() : close()

      // Close list if dragged down fast enough
      if (progress.value < 0 && speedY > 0.8)
        emit('closeList')

      if (progress.value < -0.5)
        emit('closeList')
    }
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
  progress.value = 0
}

function open(smooth = false) {
  if (smooth) {
    const source = ref(0)
    const output = useTransition(source, {
      duration: 300,
      transition: TransitionPresets.easeOutQuart,
    })
    source.value = 1
    const stop = watch(output, () => {
      progress.value = output.value
      if (output.value >= 1) {
        source.value = 0
        stop()
      }
    })
  }
  else {
    progress.value = 1
  }
}

function animateShortly() {
  document.documentElement.style.setProperty('--duration', '0.2s')
  setTimeout(() => document.documentElement.style.removeProperty('--duration'), 100)
}

const style = ref()
function onCardDrag(progress: number) {
  const radius = (1 - progress) * props.initialBorderRadius

  style.value = {
    height: isOpen.value ? 'min-content' : progress > 0 ? `${initialHeight.value + heightDifference.value * progress}px` : 'min-content',
    // Set to -6 for closing list, -8 would be more "accurate" more -6 feels more natural
    marginBottom: `${(1 - (progress >= 0 ? progress : progress * -6)) * props.initialGapToScreen}px`,
    borderBottomRightRadius: `${radius}px`,
    borderBottomLeftRadius: `${radius}px`,
    width: `${window.innerWidth - (1 - Math.max(progress, 0)) * 40}px`,
  }
}
watch(() => progress.value, onCardDrag, { immediate: true })

function resizeListener() {
  onCardDrag(progress.value)
}

onMounted(() => {
  window.addEventListener('resize', resizeListener)
  // Get height of the sheet after it's mounted
  containerHeight.value = container.value!.offsetHeight
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeListener)
})
</script>

<template>
  <article
    ref="container" absolute h-full touch-pan-x will-change-auto min-h-fit class="sheet-transition" :style="style"
    @pointerdown="onStart" @pointermove="onMove" @pointerup="onEnd" @pointercancel="onCancel"
  >
    <slot name="dragger" />
    <slot />
  </article>
</template>

<style>
.sheet-transition {
  transition: margin-bottom var(--duration), margin-left var(--duration), width var(--duration), border-bottom-right-radius var(--duration), border-bottom-left-radius var(--duration), height var(--duration);
}
</style>
