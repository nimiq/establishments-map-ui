<script setup lang="ts">
import type { CryptocityData } from 'types'

defineProps<{ cryptocity: CryptocityData }>()
defineEmits({ close: () => true })
</script>

<template>
  <div
    class="p6 transition-all duration-300 bg-white shadow cursor-default rounded-t-md desktop:rounded-md border border-[#e9e9ed] border-solid desktop:max-w-320"
    @pointerdown.capture.stop.prevent @dblclick.capture.stop.prevent
  >
    <div class="grid items-center grid-cols-[auto_1fr_auto] grid-rows-2 grid-flow-dense gap-x-2">
      <div i-nimiq:logos-cryptocity text-28 row-span-full />
      <h3 text="neutral lh-none" :class="cryptocity.locationsCount <= 1 ? 'row-span-full' : ''">
        {{ cryptocity.name }}
      </h3>
      <span v-if="cryptocity.locationsCount > 1" text="14 lh-none neutral-700">
        {{ $tc('{count} locations', cryptocity.locationsCount) }}
      </span>
      <button
        type="button"
        relative size-24 col-start-3 p-8 ml-auto transition rounded-full text-neutral-100 top--4
        :aria-label="$t('Close')" :class="cryptocity.locationsCount > 1 ? 'self-start' : 'row-span-full'"
        @click="$emit('close')" close-btn
      />
    </div>

    <p v-for="(p, i) in cryptocity.description" :key="i" text="14 neutral-800" :pt="i === 0 ? '12' : '8'">
      {{ p }}
    </p>
    <button pill-sm pill-blue mt-2 text-14>
      {{ cryptocity.url }}
    </button>
  </div>
</template>
