<script setup lang="ts">
import { Currency } from 'types';

defineProps<{ cryptosToDisplay: Currency[], n: number }>()
</script>

<template>
  <ul v-if="cryptosToDisplay.length > 0" flex="~ items-center gap-x-8" p-4 bg-neutral-0 rounded-full w-max
    ring-neutral-100 absolute bottom-0 z-20>
    <li v-for="c in cryptosToDisplay " :key="c">
      <div text-24 :class="getCurrencyIcon(c)" :title="c" />
    </li>
    <li v-if="n > 0" pr-4 text="14 neutral-700">
      +{{ n }}
    </li>
  </ul>
</template>
