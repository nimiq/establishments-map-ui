<script setup lang="ts">
import { Location, LocationLink } from 'types';

defineProps<{ location: Location }>()
</script>
<template>
  <transition name="scale">
    <a v-if="location.linkTo" :href="location.url" pill-tertiary arrow bg-neutral-0 px-8 py-6 un-text="15 neutral-800"
      after:ml-3 target="_blank" rel="noopener noreferrer">
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
