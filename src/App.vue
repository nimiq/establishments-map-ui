<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <transition :name="route.meta.transition">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<style scoped>
.slide-left-leave-active,
.slide-left-enter-active {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.25, 0, 0, 1);
  transition-duration: 400ms;
}

.slide-left-enter {
  transform: translate(100%, 0);
}

.slide-left-leave-to {
  transform: translate(-100%, 0);
}

.slide-right-leave-active,
.slide-right-enter-active {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.25, 0, 0, 1);
  transition-duration: 400ms;
}

.slide-right-enter {
  transform: translate(-100%, 0);
}

.slide-right-leave-to {
  transform: translate(200%, 0);
}
</style>
