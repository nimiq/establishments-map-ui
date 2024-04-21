<script setup lang="ts">
const autocomplete = Object.values(Autocomplete)
const { q, status, googleSuggestions, locationSuggestions, highlightMatches } = useAutocomplete({ autocomplete })

// The first time the user types something, we hide the hint
watchOnce(q, useApp().hideSearchBoxHint)
</script>

<template>
  <ComboboxRoot v-model:searchTerm="q">
    <ComboboxAnchor flex="~ items-center justify-between" relative>
      <ComboboxInput :placeholder="$t('Search Map')" input-text rounded-full text-14 peer w-full />
      <div v-if="q === ''" i-nimiq:magnifying-glass absolute right-16 text="14 neutral-600 peer-focus-visible:blue" />
      <ComboboxCancel v-else i-nimiq:cross absolute right-16 text="10  neutral-700 peer-focus-visible:blue/80" />
    </ComboboxAnchor>

    <ComboboxContent absolute bg-neutral-0 shadow rounded-b-16 top-66 inset-x-0 data-suggestions>
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
          <ComboboxGroup flex="~ col">
            <ComboboxLabel label text="12 neutral-700" px-16 py-8>
              {{ $t('Crypto Locations') }}
            </ComboboxLabel>

            <ComboboxItem v-for="s in locationSuggestions" :key="s.uuid" :value="s" px-16 py-12 hocus:bg-neutral-100
              transition-colors cursor-pointer @click="() => useLocations().goToLocation(s.uuid, { open: true })">
              <span class="block truncate" v-html="highlightMatches(s.name, s.matchedSubstrings)" />
            </ComboboxItem>
          </ComboboxGroup>
          <ComboboxSeparator bg-neutral-100 h-2 my-12 />

          <ComboboxGroup>
            <ComboboxLabel label text="12 neutral-700" px-16 py-8>
              {{ $t('Results from Google') }}
            </ComboboxLabel>

            <ComboboxItem v-for="s in googleSuggestions" :key="s.placeId" :value="s" px-16 py-12 hocus:bg-neutral-100
              transition-colors cursor-pointer @click="() => useMap().goToPlaceId(s.placeId)">
              <span class="block truncate" v-html="highlightMatches(s.label, s.matchedSubstrings)" />
            </ComboboxItem>
          </ComboboxGroup>
        </template>

      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
