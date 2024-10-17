<script setup lang="ts">
const searchOpen = ref(false)
</script>

<template>
  <div flex="~ col" h="screen 100dvh">
    <TheMapInstance flex-1 />

    <div absolute inset-x-24 top-24>
      <!-- :title="$t('Search')" -->
      <button
        bg="neutral-0 hover:neutral-100"
        flex="~ items-center justify-between" title="Search"
        w-full rounded-8 px-16 py-8 transition-colors shadow @click="searchOpen = true"
      >
        <!-- <span op-60>{{ $t('Search Crypto Map') }}</span> -->
        <span op-60>Search Crypto Map</span>
        <div i-nimiq:magnifying-glass op-40 />
      </button>
    </div>
    <MobileSearch v-model:open="searchOpen" fixed inset-0 bg-neutral-0 />
    <MobileList />
  </div>
</template>
