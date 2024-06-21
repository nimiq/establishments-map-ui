<script setup lang="ts">
const searchOpen = ref(false)
</script>

<template>
  <div flex="~ col" h="screen 100dvh">
    <TheMapInstance flex-1 />

    <div absolute inset-x-24 top-24>
      <button
        bg="neutral-0 hover:neutral-100"
        flex="~ items-center justify-between" :aria-label="$t('Search')" :title="$t('Search')"
        w-full rounded-8 px-16 py-8 shadow transition-colors @click="searchOpen = true"
      >
        <span op-60>{{ $t('Search Crypto Map') }}</span>
        <div i-nimiq:magnifying-glass op-40 />
      </button>
    </div>
    <MobileSearch v-model:open="searchOpen" fixed inset-0 bg-neutral-0 />
    <MobileList />
  </div>
</template>
