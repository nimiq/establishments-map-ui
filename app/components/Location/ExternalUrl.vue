<script setup lang="ts">
withDefaults(defineProps<{ location: MapLocation, showName?: boolean }>(), { showName: false })
</script>

<template>
  <transition name="scale">
    <a
      v-if="location.linkTo" :href="location.url" border="neutral/15" nq-nq-pill-tertiary bg-neutral-0 px-8 py-5 nq-arrow after:ml-3 after:text-13
      flex="~ gap-8" un-text="14 neutral-800" target="_blank" rel="noopener noreferrer"
    >
      <div v-if="location.linkTo === LocationLink.GMaps" i-logos:google-maps />
      <div v-if="location.linkTo === LocationLink.Facebook" i-logos:facebook />
      <div v-if="location.linkTo === LocationLink.Instagram" i-nimiq:logos-instagram />
      <span v-if="showName" text="14/19.6 ellipsis nowrap" max-w-198 flex-1 of-hidden text-blue>
        {{ location.name }}
      </span>
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
