<script setup lang="ts">
import { LocationLink } from 'types'

defineProps<{ location: MapLocation }>()
</script>

<template>
  <transition name="scale">
    <a
      v-if="location.linkTo" :href="location.url" bg-neutral-0 px-8 py-5 arrow pill-tertiary after:ml-3 after:text-13
      un-text="14 neutral-800" target="_blank" rel="noopener noreferrer"
    >
      <div v-if="location.linkTo === LocationLink.GMaps" i-logos:google-maps />
      <div v-if="location.linkTo === LocationLink.Facebook" i-logos:facebook />
      <div v-if="location.linkTo === LocationLink.Instagram" i-nimiq:logos-instagram />
    </a>
  </transition>
</template>

<style scoped>
.scale-enter-active {
  animation: icon-in 200ms ease-out;
}

.scale-leave-active {
  animation: icon-in 150ms ease-in reverse;
  opacity: 0;
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
