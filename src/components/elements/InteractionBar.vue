<script setup lang="ts">
import { type Suggestion, SuggestionType } from 'types'
import { useBreakpoints } from '@vueuse/core'
import { screens } from 'tailwindcss-nimiq-theme'
import { computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import SearchBox from '@/components/atoms/SearchBox.vue'
import CryptoMapModal from '@/components/elements/CryptoMapModal.vue'
import { useAutocomplete } from '@/composables/useAutocomplete'
import { useMap } from '@/stores/map'
import { useLocations } from '@/stores/locations'
import { useApp } from '@/stores/app'
import { useCluster } from '@/stores/cluster'

defineEmits({
  open: (value: boolean) => value,
})

const { querySearch, status, suggestions } = useAutocomplete()

const { singles } = storeToRefs(useCluster())
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function onSelect(suggestion?: Suggestion) {
  if (!suggestion)
    return
  switch (suggestion.type) {
    case SuggestionType.GoogleLocation:
    case SuggestionType.Region:
      useMap().goToPlaceId(suggestion.id)
      break
    case SuggestionType.Location:
      if (await useLocations().goToLocation(suggestion.id)) {
        while (!singles.value.some(s => s.uuid === suggestion.id))
          await sleep(100) // Try to wait for the item to be added
        await nextTick() // Wait for the marker to be rendered
        ;(document.querySelector(`[data-trigger-uuid="${suggestion.id}"]`) as HTMLElement)?.click()
      }

      break
  }

  useApp().hideSearchBoxHint()
}

const { shouldShowSearchBoxHint } = storeToRefs(useApp())
const showHint = computed(() => shouldShowSearchBoxHint.value && useBreakpoints(screens).greaterOrEqual('md').value)
</script>

<template>
  <header class="relative z-10 flex items-center w-full p-10 py-6 pl-4 pr-6 desktop:p-4 gap-x-2 desktop:gap-x-4">
    <img src="@/assets/logo.svg" :alt="$t('Crypto Map logo')" class="h-[22px]">
    <SearchBox
      :autocomplete="querySearch" :suggestions="suggestions" :status="status" class="flex-1 w-full " rounded-full
      combobox-options-classes="rounded-t-0 rounded-b-2xl desktop:w-[320px] desktop:top-[88px] desktop:left-6 max-desktop:w-full max-desktop:!top-[78px]" size="sm"
      :placeholder="$t('Search Map')" @selected="onSelect" @open="$emit('open', $event)"
    />
    <CryptoMapModal />
  </header>

  <!-- We need to hardcode the height, otherwise the desktop list will break -->
  <p v-if="showHint" class="p-5 text-xs border-t text-space/60 border-space/10" style="height: 88px">
    {{ $t('Enter country, city or zip code to discover locations that accept Bitcoin, Nimiq and other crypto-currencies.') }}
  </p>
</template>
