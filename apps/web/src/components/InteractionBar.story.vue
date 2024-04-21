<script setup lang="ts">
import InteractionBar from './InteractionBar.vue'
</script>

<template>
  <Story title="Interaction Bar">
    <div class="relative h-screen desktop:p-2 bg-fog">
      <InteractionBar />
      <img src="@/assets-dev/stories/map-new-york-square.png" alt="" class="absolute inset-0 object-cover h-full">
    </div>
  </Story>
</template>
