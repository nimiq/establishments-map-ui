<script setup lang="ts">
import { computed, ref } from 'vue'
import { CURRENCIES } from 'database'
import type { Currency, Suggestion } from 'types'
import SearchBox from '../atoms/SearchBox.vue'
import Select from '../atoms/Select.vue'
import FormContainer from '@/components/forms/FormContainer.vue'
import CryptoIcon from '@/components/icons/cryptos/CryptoIcon.vue'
import { useAutocomplete } from '@/composables/useAutocomplete'
import { translateCurrency } from '@/translations'

const { suggestions, status, querySearch } = useAutocomplete()

const selectedCurrencies = ref<Currency[]>([])
const selectedPlace = ref<Suggestion>()

const disabled = computed(() => selectedCurrencies.value.length === 0 || !selectedPlace.value)

async function onSubmit(captcha: string) {
  if (!selectedPlace.value)
    return
  const body = {
    name: selectedPlace.value.label,
    gmapsPlaceId: selectedPlace.value.id,
    currencies: selectedCurrencies.value,
    captcha,
    dev: import.meta.env.DEV,
  }
  const url = import.meta.env.VITE_SLACK_NEW_CANDIDATE_URL
  return await fetch(url, {
    body: JSON.stringify(body),
    method: 'POST',
  })
}
</script>

<template>
  <FormContainer :disabled="disabled" :on-submit="onSubmit">
    <template #title>
      {{ $t('Add a location to the Crypto Map') }}
    </template>
    <template #description>
      {{ $t('You can add any location that has a Google Business Profile.') }}
    </template>
    <template #link>
      <a href="https://www.google.com/business/" target="_blank">{{ $t('Create Google Business profile') }}</a>
    </template>
    <template #form>
      <SearchBox
        :autocomplete="(query: string) => querySearch(query, true)" :suggestions="suggestions" :status="status" :label="$t('Find location')"
        :placeholder="$t('Type the name of the location')" combobox-options-classes="w-[calc(100%+4px)] -left-0.5 top-unset rounded-sm"
        bg-combobox="space" input-id="search-input" :allow-clean="false" @selected="(selectedPlace = $event)"
      />

      <Select
        v-model="selectedCurrencies" class="mt-6"
        :label="$t('Select Cryptocurrency')" :options="CURRENCIES" :placeholder="$t('Select Cryptocurrency')"
      >
        <template #option="{ option: currency }">
          <CryptoIcon :crypto="currency" size="sm" bg="white" />
          <span>{{ translateCurrency(currency) }}</span>
        </template>
        <template #after-options>
          {{ $t('More cryptocurrencies supported in the future') }}
        </template>
        <template #selected-option="{ option: currency }">
          {{ translateCurrency(currency) }}
        </template>
      </Select>
    </template>
    <template #button-label>
      {{ $t('Submit Location') }}
    </template>

    <!-- Success -->
    <template #success-title>
      {{ $t('Thank you for submitting a new location to the Crypto Map!') }}
    </template>
    <template #success-description>
      {{ $t('This may take a few days to process. Keep an eye out for changes to the location in the Crypto Map.') }}
    </template>
    <template #success-button-label>
      {{ $t('Back to the Map') }}
    </template>

    <!-- Error -->
    <template #error-title>
      {{ $t('Something went wrong') }}
    </template>
    <template #error-description>
      {{ $t('There has been a problem on our side.') }}
    </template>
    <template #error-button-label>
      {{ $t('Try again') }}
    </template>
  </FormContainer>
</template>
