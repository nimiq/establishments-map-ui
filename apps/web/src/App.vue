<script setup lang="ts">
const isDark = useDark()
isDark.value = false // We don't want to use dark mode in the Crypto Map for now
</script>

<template>
  <h1 class="sr-only">
    {{ $t('Explore the Crypto Map') }}
  </h1>
  <RouterView />
</template>
