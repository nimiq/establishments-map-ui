<script setup lang="ts">
const autocomplete = Object.values(Autocomplete)
const { query, status, googleSuggestions, locationSuggestions } = useAutocomplete({ autocomplete })
</script>

<template>
  <ComboboxRoot v-model:searchTerm="query" flex-1>
    <ComboboxAnchor flex="~ items-center justify-between" relative>
      <ComboboxInput :placeholder="$t('Search Map')" input-box rounded-full text-14 peer w-full />
      <div v-if="query === ''" i-nimiq:magnifying-glass absolute right-16 text="14 neutral-600 peer-focus-visible:blue"
        aria-hidden />
      <ComboboxCancel v-else i-nimiq:cross absolute right-16 text="10  neutral-700 peer-focus-visible:blue/80" />
    </ComboboxAnchor>
    <SearchSuggestions :status :googleSuggestions :locationSuggestions shadow rounded-b-16 top-66 />
  </ComboboxRoot>
</template>
