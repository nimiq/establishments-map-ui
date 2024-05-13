<script setup lang="ts">
import { ref } from 'vue'

const selected = ref(SUPPORTED_LANGUAGES[0])
</script>

<template>
  <Story title="Select language">
    You have selected {{ selected }}
    <div flex="~ items-end justify-end" h-256 bg-neutral-200 p-24 w="90%">
      <TriangleSelector v-model:selected="selected" :options="SUPPORTED_LANGUAGES" />
    </div>
  </Story>
</template>
