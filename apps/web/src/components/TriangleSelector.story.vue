<script setup lang="ts">
import { SUPPORTED_LANGUAGES } from '@/i18n/i18n-setup';
import TriangleSelector from './TriangleSelector.vue';
import { ref } from 'vue';
const selected= ref(SUPPORTED_LANGUAGES[0])
</script>

<template>
  <Story title="Select language">
    You have selected {{selected}}
    <div h-256 flex="~ items-end justify-end" p-24 bg-neutral-200 w="90%">
      <TriangleSelector :options="SUPPORTED_LANGUAGES" v-model:selected="selected" />
    </div>
  </Story>
</template>
