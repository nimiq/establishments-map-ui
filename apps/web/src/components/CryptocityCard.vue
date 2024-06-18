<script setup lang="ts">
defineProps<{ cryptocity: CryptocityData }>()
defineEmits({ close: () => true })
</script>

<template>
  <div
    class="cursor-default border border-[#e9e9ed] rounded-t-md border-solid bg-white p-6 transition-all duration-300 shadow desktop:max-w-320 desktop:rounded-md"
    @pointerdown.capture.stop.prevent @dblclick.capture.stop.prevent
  >
    <div class="grid grid-flow-dense grid-cols-[auto_1fr_auto] grid-rows-2 items-center gap-x-2">
      <div i-nimiq:logos-cryptocity row-span-full text-28 />
      <h3 text="neutral lh-none" :class="cryptocity.locationsCount <= 1 ? 'row-span-full' : ''">
        {{ cryptocity.name }}
      </h3>
      <span v-if="cryptocity.locationsCount > 1" text="14 lh-none neutral-700">
        {{ $tc('{count} locations', cryptocity.locationsCount) }}
      </span>
      <button
        type="button"
        :aria-label="$t('Close')" :class="cryptocity.locationsCount > 1 ? 'self-start' : 'row-span-full'"
        relative top--4 col-start-3 ml-auto size-24 rounded-full p-8 text-neutral-100 transition close-btn @click="$emit('close')"
      />
    </div>

    <p v-for="(p, i) in cryptocity.description" :key="i" text="14 neutral-800" :pt="i === 0 ? '12' : '8'">
      {{ p }}
    </p>
    <button pill-sm mt-2 text-14 pill-blue>
      {{ cryptocity.url }}
    </button>
  </div>
</template>
