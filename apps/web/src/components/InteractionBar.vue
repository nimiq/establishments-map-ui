<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core';

const { shouldShowSearchBoxHint } = storeToRefs(useApp())
const showHint = computed(() => shouldShowSearchBoxHint.value && useBreakpoints(breakpointsTailwind).greaterOrEqual('md').value)
</script>

<template>
  <header relative z-10 flex="~ items-center gap-16" w-full p-24 desktop:p-16 pl-16 z-100>
    <div i-nimiq:logos-crypto-map text-24 aria-hidden shrink-0 />
    <SearchBox flex-1 />
    <CryptoMapModal id="crypto-map-modal" />
  </header>

  <!-- We need to hardcode the height, otherwise the desktop list will break -->
  <p v-if="showHint" px-20 py-16 text-12 border-t text-neutral-700 h-88 max-w-320>
    {{ $t('Enter country, city or zip code to discover locations that accept Bitcoin, Nimiq and other crypto-currencies.')
    }}
  </p>
</template>
