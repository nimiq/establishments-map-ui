<script setup lang="ts">
import { type Suggestion, SuggestionType } from 'types'
import SearchBox from '@/components/atoms/SearchBox.vue'
import CryptoMapModal from '@/components/elements/CryptoMapModal.vue'
import { useAutocomplete } from '@/composables/useAutocomplete'
import { useMap } from '@/stores/map'
import { useLocations } from '@/stores/locations'

defineEmits({
  open: (value: boolean) => value,
})

const { querySearch, status, suggestions } = useAutocomplete()

function onSelect(suggestion?: Suggestion) {
  if (!suggestion)
    return

  switch (suggestion.type) {
    case SuggestionType.GoogleLocation:
    case SuggestionType.Region:
      useMap().goToPlaceId(suggestion.id)
      break
    case SuggestionType.Location:
      useLocations().goToLocation(suggestion.id)
      break
  }
}
</script>

<template>
  <header class="relative z-10 flex items-center w-full p-10 py-6 pl-4 pr-6 desktop:p-4 gap-x-2 desktop:gap-x-4">
    <img src="@/assets/logo.svg" :alt="$t('Crypto Map logo')" class="h-[22px]">
    <SearchBox
      :autocomplete="querySearch" :suggestions="suggestions" :status="status" class="flex-1 w-full " rounded-full
      combobox-options-classes="rounded-t-0 rounded-b-2xl desktop:w-[320px] desktop:top-[88px] desktop:left-6 max-desktop:w-full max-desktop:!left-[24px] max-desktop:!top-[78px]" size="sm"
      :placeholder="$t('Search Map')" @selected="onSelect" @open="$emit('open', $event)"
    />
    <CryptoMapModal />
    <!-- TODO -->
    <!-- <p class="pt-4 text-xs text-space/60" v-if="xl">
      {{ $t('Enter country, city or zip code to discover locations that accept Bitcoin, Nimiq and other crypto-currencies.') }}
    </p> -->
  </header>
</template>
