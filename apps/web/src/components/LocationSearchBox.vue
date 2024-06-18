<script setup lang="ts">
import type { GoogleSuggestion } from '@/composables/useAutocomplete'

const props = defineProps<{ disablePersistState?: boolean }>()
const { query, status, googleSuggestions } = useAutocomplete({ autocomplete: [Autocomplete.GoogleBussines], persistState: !props.disablePersistState })
const selected = defineModel<GoogleSuggestion>('selected')
</script>

<template>
  <ComboboxRoot v-model="selected" relative :display-value="v => v.label" @update:search-term="q => query = q">
    <ComboboxAnchor flex="~ items-center justify-between" relative>
      <ComboboxInput :placeholder="$t('Search Map')" peer input-box rounded-6 pr-32 text-14 />
      <div v-if="!query" i-nimiq:magnifying-glass absolute right-8 text="14 neutral-600 peer-focus-visible:blue" />
      <ComboboxCancel v-else i-nimiq:cross absolute right-8 text="10 neutral-700 peer-focus-visible:blue/80" />
    </ComboboxAnchor>

    <ComboboxContent w="[calc(100%+3px)]" data-suggestions absolute inset-x-0 z-1 ml--1.5 rounded-6 bg-neutral shadow>
      <ComboboxViewport>
        <div v-if="status !== AutocompleteStatus.WithResults" p-16 text="14 neutral-700">
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
          <ComboboxItem
            v-for="s in googleSuggestions" :key="s.placeId" :value="s" bg="hocus:bg-white/40" cursor-pointer
            px-16 py-12 transition-colors text="14 neutral-100" @click="() => useMap().goToPlaceId(s.placeId)"
          >
            <span class="block truncate" v-html="highlightMatches(s.label, s.matchedSubstrings)" />
          </ComboboxItem>
        </template>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
