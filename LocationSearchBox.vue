<script setup lang="ts">
const selected = defineModel<string>('selected')
const { q, status, googleSuggestions, highlightMatches } = useAutocomplete({ autocomplete: [Autocomplete.GoogleBussines] })
</script>

<template>
  <ComboboxRoot v-model:searchTerm="q" v-model="selected">
    <ComboboxAnchor flex="~ items-center justify-between" relative>
      <ComboboxInput :placeholder="$t('Search Map')" input-text rounded-6 text-14 peer w-full />
      <div v-if="q === ''" i-nimiq:magnifying-glass absolute right-16 text="14 neutral-600 peer-focus-visible:blue" />
      <ComboboxCancel v-else i-nimiq:cross absolute right-16 text="10  neutral-700 peer-focus-visible:blue/80" />
    </ComboboxAnchor>

    <ComboboxContent absolute bg-neutral z-1 shadow rounded-6 inset-x-0 data-suggestions w="[calc(var(--radix-combobox-trigger-width)+3px)]">
      <ComboboxViewport>
        <div p-16 text-neutral-800 v-if="status !== AutocompleteStatus.WithResults">
          <ComboboxEmpty v-if="status === AutocompleteStatus.NoResults">
            {{ $t('Nothing found.') }}
          </ComboboxEmpty>
          <span v-else-if="status === AutocompleteStatus.Loading">
            {{ $t('Loading...') }}
          </span>
          <span v-else-if="status === AutocompleteStatus.Initial">
            {{ $t('Start typing...') }}
          </span>
          <span v-else-if="status === AutocompleteStatus.Error">
            {{ $t('Error loading results.') }}
          </span>
        </div>
        <template v-else>
          <ComboboxItem v-for="s in googleSuggestions" :key="s.placeId" :value="s" px-16 py-12 hocus:bg-neutral-100
            transition-colors cursor-pointer @click="() => useMap().goToPlaceId(s.placeId)">
            <span class="block truncate" v-html="highlightMatches(s.label, s.matchedSubstrings)" />
          </ComboboxItem>
        </template>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
