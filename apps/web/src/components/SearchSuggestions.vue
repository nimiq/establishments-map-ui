<script setup lang="ts">
import { AutocompleteStatus, GoogleSuggestion, LocationSuggestion } from '@/composables/useAutocomplete';
defineProps<{ status: AutocompleteStatus, googleSuggestions: GoogleSuggestion[], locationSuggestions: LocationSuggestion[] }>()
</script>

<template>
  <ComboboxContent absolute bg-neutral-0 inset-x-0 data-suggestions>
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
          <span block truncate v-html="highlightMatches(s.name, s.matchedSubstrings)" />
        </ComboboxItem>
      </ComboboxGroup>
      <ComboboxSeparator bg-neutral-100 h-2 my-12 />

      <ComboboxGroup>
        <ComboboxLabel label text="12 neutral-700" px-16 py-8>
          {{ $t('Results from Google') }}
        </ComboboxLabel>

        <ComboboxItem v-for="s in googleSuggestions" :key="s.placeId" :value="s" px-16 py-12 hocus:bg-neutral-100
          transition-colors cursor-pointer @click="() => useMap().goToPlaceId(s.placeId)">
          <span block truncate v-html="highlightMatches(s.label, s.matchedSubstrings)" />
        </ComboboxItem>
      </ComboboxGroup>
    </template>

  </ComboboxContent>
</template>
