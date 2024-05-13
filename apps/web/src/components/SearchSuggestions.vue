<script setup lang="ts">
import { AutocompleteStatus } from '@/composables/useAutocomplete'
import type { GoogleSuggestion, LocationSuggestion } from '@/composables/useAutocomplete'

defineProps<{ status: AutocompleteStatus, googleSuggestions: GoogleSuggestion[], locationSuggestions: LocationSuggestion[] }>()
</script>

<template>
  <ComboboxContent data-suggestions absolute inset-x-0 bg-neutral-0>
    <div v-if="status !== AutocompleteStatus.WithResults" p-16 text-neutral-800>
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
        <ComboboxLabel text="12 neutral-700" px-16 py-8 label>
          {{ $t('Crypto Locations') }}
        </ComboboxLabel>

        <ComboboxItem
          v-for="s in locationSuggestions" :key="s.uuid" :value="s"
          cursor-pointer px-16 py-12 transition-colors hocus:bg-neutral-100 @click="() => useLocations().goToLocation(s.uuid, { open: true })"
        >
          <span block truncate v-html="highlightMatches(s.name, s.matchedSubstrings)" />
        </ComboboxItem>
      </ComboboxGroup>

      <ComboboxSeparator v-if="locationSuggestions.length > 0" my-12 h-2 bg-neutral-100 />

      <ComboboxGroup>
        <ComboboxLabel text="12 neutral-700" px-16 py-8 label>
          {{ $t('Results from Google') }}
        </ComboboxLabel>

        <ComboboxItem
          v-for="s in googleSuggestions" :key="s.placeId" :value="s"
          cursor-pointer px-16 py-12 transition-colors hocus:bg-neutral-100 @click="() => useMap().goToPlaceId(s.placeId)"
        >
          <span block truncate v-html="highlightMatches(s.label, s.matchedSubstrings)" />
        </ComboboxItem>
      </ComboboxGroup>
    </template>
  </ComboboxContent>
</template>
