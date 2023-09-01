<script setup lang="ts">
import SearchBox from '@/components/atoms/SearchBox.vue'
import CryptoMapModal from '@/components/elements/CryptoMapModal.vue'
import { useAutocomplete } from '@/composables/useAutocomplete'
import { type Suggestion, SuggestionType } from '@/types'
import { useMap } from '@/stores/map'
import { useLocations } from '@/stores/locations'

const emit = defineEmits({
  open: (value: boolean) => value,
})

const { querySearch, suggestions } = useAutocomplete()

function searchBoxOpen(value: boolean) {
  value ? showSearchBoxList() : hideSearchBoxList()
  emit('open', value)
}

function hideSearchBoxList() {
  const searchBoxList = document.querySelector('ul[data-combobox-options]') as HTMLElement | null
  if (!searchBoxList)
    return

  searchBoxList.remove()
}

function showSearchBoxList() {
  const searchBoxList = document.querySelector('[data-search-box] ul') as HTMLElement | null
  if (!searchBoxList)
    return

  document.body.appendChild(searchBoxList)
  searchBoxList.style.position = 'absolute'
  searchBoxList.style.top = '36px'
  searchBoxList.style.left = '24px'
  searchBoxList.style.zIndex = '1000'
}

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

  hideSearchBoxList()
}
</script>

<template>
  <header class="relative z-10 flex items-center w-full p-10 py-6 pl-4 pr-6 desktop:p-4 gap-x-2 desktop:gap-x-4">
    <img src="@/assets/logo.svg" :alt="$t('Crypto Map logo')" class="h-[22px]">
    <SearchBox
      :autocomplete="querySearch" :suggestions="suggestions" class="flex-1 w-full " rounded-full
      combobox-options-classes="!rounded-t-0 !rounded-b-2xl desktop:w-[320px] desktop:!top-[88px] max-desktop:w-full max-desktop:!left-0 max-desktop:!top-[78px]" size="sm"
      :placeholder="$t('Search Map')" data-search-box @open="searchBoxOpen" @selected="onSelect"
    />
    <CryptoMapModal />
    <!-- TODO -->
    <!-- <p class="pt-4 text-xs text-space/60" v-if="xl">
      {{ $t('Enter country, city or zip code to discover locations that accept Bitcoin, Nimiq and other crypto-currencies.') }}
    </p> -->
  </header>
</template>
