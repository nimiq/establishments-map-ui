<script setup lang="ts">
const searchOpen = ref(false)
</script>

<template>
  <div flex="~ col" h="screen 100dvh">
    <TheMapInstance flex-1 />

    <div absolute inset-x-24 top-24>
      <button w-full shadow rounded-8 bg="neutral-0 hover:neutral-100" transition-colors
        flex="~ items-center justify-between" :aria-label="$t('Search')" :title="$t('Search')"
        @click="searchOpen = true" px-16 py-8>
        <span op-60>{{ $t('Search Crypto Map') }}</span>
        <div i-nimiq:magnifying-glass op-40 />
      </button>
    </div>
    <MobileSearch v-model:open="searchOpen" fixed inset-0 bg-neutral-0 />
    <MobileList />
  </div>
</template>
