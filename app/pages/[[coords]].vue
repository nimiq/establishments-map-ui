<script setup lang="ts">
if (import.meta.dev)
  useDark() // Take care of your eyes

defineRouteRules({ ssr: false })
</script>

<template>
  <NuxtLayout key="map" name="desktop" />
</template>
