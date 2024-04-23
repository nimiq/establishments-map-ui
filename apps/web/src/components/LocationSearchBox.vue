<script setup lang="ts" generic="T extends AcceptableValue">
import type { AcceptableValue } from 'radix-vue/dist/shared/types';
defineProps<{ displayValue: (value: T) => string }>()
const { q, status, googleSuggestions, highlightMatches } = useAutocomplete({ autocomplete: [Autocomplete.GoogleBussines] })
const selected = defineModel<T>('selected')
</script>

<template>
  <ComboboxRoot v-model:searchTerm="q" v-model="selected" relative>
    <ComboboxAnchor flex="~ items-center justify-between" relative>
      <ComboboxInput :placeholder="$t('Search Map')" input-box rounded-6 text-14 peer pr-28
        :value="selected && displayValue(selected)" />
      <div v-if="q === ''" i-nimiq:magnifying-glass absolute right-8 text="14 neutral-600 peer-focus-visible:blue" />
      <ComboboxCancel v-else i-nimiq:cross absolute right-8 text="10 neutral-700 peer-focus-visible:blue/80" />
    </ComboboxAnchor>

    <ComboboxContent absolute bg-neutral z-1 shadow rounded-6 inset-x-0 data-suggestions w="[calc(100%+3px)]" ml--1.5>
      <ComboboxViewport>
        <div p-16 text="14 neutral-700" v-if="status !== AutocompleteStatus.WithResults">
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
          <ComboboxItem v-for="s in googleSuggestions" :key="s.placeId" :value="s" px-16 py-12 bg="hocus:bg-white/40"
            transition-colors cursor-pointer @click="() => useMap().goToPlaceId(s.placeId)" text="14 neutral-100">
            <span class="block truncate" v-html="highlightMatches(s.label, s.matchedSubstrings)" />
          </ComboboxItem>
        </template>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
