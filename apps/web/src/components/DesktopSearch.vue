<script setup lang="ts">
const autocomplete = Object.values(Autocomplete)
const { query, status, googleSuggestions, locationSuggestions } = useAutocomplete({ autocomplete })
</script>

<template>
  <ComboboxRoot v-model:searchTerm="query" flex-1>
    <ComboboxAnchor flex="~ items-center justify-between" relative>
      <ComboboxInput :placeholder="$t('Search Map')" input-box peer w-full rounded-full text-14 />
      <div
        v-if="query === ''" text="14 neutral-600 peer-focus-visible:blue"
        aria-hidden i-nimiq:magnifying-glass absolute right-16
      />
      <ComboboxCancel v-else i-nimiq:cross absolute right-16 text="10  neutral-700 peer-focus-visible:blue/80" />
    </ComboboxAnchor>
    <SearchSuggestions :status :google-suggestions :location-suggestions top-66 rounded-b-16 shadow />
  </ComboboxRoot>
</template>
