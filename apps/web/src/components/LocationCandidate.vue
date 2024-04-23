<script setup lang="ts">
import { GoogleSuggestion } from '@/composables/useAutocomplete';
import { Currency } from 'types';

const selectedPlace = ref<GoogleSuggestion>()
const selectedCryptos = ref<Currency[]>([])

const body = computed(() => ({
  name: selectedPlace.value?.label,
  gmapsPlaceId: selectedPlace.value?.placeId,
  currencies: selectedCryptos.value,
  dev: import.meta.env.DEV,
}))
const url = import.meta.env.VITE_SLACK_NEW_CANDIDATE_URL
const { disabled, state, onSubmit, reset, isError, isSuccess } = useForm({ url, body })
const feedbackScreen = computed(() => isError || isSuccess)
</script>

<template>
  <Modal nested name="candidate" pill-blue pill-sm>
    <template #trigger>
      {{ $t('Add Crypto location') }}
    </template>
    <template #title>
      <div flex="~ gap-8 items-baseline" ml--6>
        <div rounded-6 size-28 grid="~ place-content-center" bg-neutral-400>
          <div i-nimiq:landmark text-neutral text-14 />
        </div>
        {{ $t('Add a location to the Crypto Map') }}
      </div>
    </template>
    <template #description v-if="!feedbackScreen">
      {{ $t('You can add any location that has a Google Business Profile.') }}
    </template>
    <template #content>
      <Transition name="slide">
        <div v-if="!feedbackScreen" mt-8 flex="~ col">
          <a href="https://www.google.com/business/" target="_blank" rel="noopener noreferrer" arrow text-blue w-max
            font-semibold>
            {{ $t('Create Google Business profile') }}
            {{ state }}
          </a>
          <form @submit.prevent="onSubmit" mt-32>
            <label for="name" text="14 neutral-900" font-200 mb-4 block>{{ $t('Find Location') }}</label>
            <LocationSearchBox v-model:selected="selectedPlace" :displayValue="v => v.label" />

            <label for="name" text="14 neutral-900" font-200 mb-4 block mt-24>{{ $t('Select Cryptocurrency') }}</label>
            <CurrencySelector v-model:selected="selectedCryptos" />

            <div flex="~ gap-16 justify-end">
              <DialogClose :aria-label="$t('Cancel')" pill-tertiary pill-sm>Cancel</DialogClose>
              <button type="submit" :disabled :loading="state === FormState.Loading" pill-blue pill-sm>
                {{ $t('Submit Location') }}
              </button>
            </div>
          </form>
        </div>
        <div v-else rounded-6 mt-32 flex="~ col">
          <div flex="~ gap-8 items-center">
            <div i-nimiq:icons-lg-high-five aria-hidden text="32 neutral/90" />
            <p text="18 neutral" font-semibold>
              {{ isError ? $t('Something went wrong') : $t('You did it!') }}
            </p>
          </div>

          <div text="14 neutral-900" mt-8>
            {{
              isError
                ? $t('There has been a problem on our side.')
                : $t('This may take a few days to process. Keep an eye out for changes to the location in the Crypto Map.')
            }}
          </div>
          <DialogClose v-if="isSuccess" pill-blue pill-sm mt-32>{{ $t('Back to the Map') }}</DialogClose>
          <button v-if="isError" pill-blue pill-sm mt-32>{{ $t('Try again') }}</button>
        </div>
      </Transition>
    </template>
  </Modal>
</template>
