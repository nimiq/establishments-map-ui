<script setup lang="ts">
import CryptoIcon from "@/components/atoms/CryptoIcon.vue"
import FormContainer from "@/components/forms/FormContainer.vue"
import { currencies, type Currency } from "@/database"
import { useAutocomplete, type Suggestion } from "@/stores/autocomplete"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import SearchBox from "../atoms/SearchBox.vue"
import Select from "../atoms/Select.vue"

const autocompleteStore = useAutocomplete()
const { googleSuggestions } = storeToRefs(autocompleteStore)

const selectedCurrencies = ref<Currency[]>([])
const selectedPlace = ref<Suggestion>()

const disabled = computed(() => selectedCurrencies.value.length === 0 || !selectedPlace.value)

async function onSubmit(captcha: string) {
	if (!selectedPlace.value) return
	const body = {
		name: selectedPlace.value.label,
		gmapsPlaceId: selectedPlace.value.id,
		currencies: selectedCurrencies.value,
		captcha,
		dev: import.meta.env.DEV
	}
	const url = import.meta.env.VITE_SLACK_NEW_CANDIDATE_URL
	return await fetch(url, {
		body: JSON.stringify(body),
		method: "POST",
	})
}

function autocompleteGoogle(query: string) {
	return autocompleteStore.autocompleteGoogle(query, { searchForLocation: true })
}
</script>

<template>
	<FormContainer :disabled="disabled" :on-submit="onSubmit">
		<template #title>{{ $t('Add a location to the Crypto Map') }}</template>
		<template #description>{{ $t('You can add any location that has a Google Business Profile.') }}</template>
		<template #link>
			<a href="https://www.google.com/business/" target="_blank">{{ $t('Create Google Business profile') }}</a>
		</template>
		<template #form>
			<SearchBox :autocomplete="autocompleteGoogle" :suggestions="googleSuggestions" :label="$t('Find location')"
				:placeholder="$t('Type the name of the location')" combobox-options-classes="w-[calc(100%+4px)] -left-0.5 top-unset"
				bg-combobox="space" input-id="search-input" @selected="(selectedPlace = $event)" :allow-clean="false" />

			<Select class="mt-6" :label="$t('Select Cryptocurrency')" input-id="cryptocurrency-input"
				:options="currencies" v-model="selectedCurrencies" :placeholder="$t('Select Cryptocurrency')">
				<template #option="{ option: currency }">
					<CryptoIcon :crypto="currency" size="sm" bg="white" />
					<span>{{ currency }}</span>
				</template>
				<template #after-options> {{ $t('More cryptocurrencies supported in the future') }} </template>
				<template #selected-option="{ option: currency }">{{ currency }} </template>
			</Select>
		</template>
		<template #button-label>{{ $t('Submit Location') }}</template>

		<!-- Success -->
		<template #success-title>{{ $t('Thank you for submitting a new location to the Crypto Map!') }}</template>
		<template #success-description>{{ $t('This may take a few days to process. Keep an eye out for changes to the location in the Crypto Map.') }}</template>
		<template #success-button-label>{{ $t('Back to the Map') }}</template>

		<!-- Error -->
		<template #error-title>{{ $t('Something went wrong') }}</template>
		<template #error-description>{{ $t('There has been a problem on our side.') }}</template>
		<template #error-button-label>{{ $t('Try again') }}</template>
	</FormContainer>
</template>
