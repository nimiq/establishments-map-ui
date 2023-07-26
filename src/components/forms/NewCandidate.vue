<script setup lang="ts">
import CryptoIcon from "@/components/atoms/CryptoIcon.vue"
import FormContainer from "@/components/forms/FormContainer.vue"
import type { Currency } from "@/database"
import { useApi } from "@/stores/api"
import { useAutocomplete, type Suggestion } from "@/stores/autocomplete"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import SearchBox from "../atoms/SearchBox.vue"
import Select from "../atoms/Select.vue"

const apiStore = useApi()
const { currencies } = storeToRefs(apiStore)
const currenciesOptions = computed(() => [...currencies.value.values()])

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
		currencies: selectedCurrencies.value.map((c) => c.symbol),
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
		<template #title>{{ $t('Add_a_place_to_the_Crypto_Map') }}</template>
		<template #description>{{ $t('You_can_add_any_place_that_has_a_Google_Business_Profile') }}</template>
		<template #link>
			<a href="https://www.google.com/business/" target="_blank">{{ $t('Create_Google_Business_profile') }}</a>
		</template>
		<template #form>
			<SearchBox :autocomplete="autocompleteGoogle" :suggestions="googleSuggestions" :label="$t('Find_place')"
				:placeholder="$t('Type_the_name')" combobox-options-classes="w-[calc(100%+4px)] -left-0.5 top-unset"
				bg-combobox="space" input-id="search-input" @selected="(selectedPlace = $event)" :allow-clean="false" />

			<Select class="mt-6" :label="$t('Select_Cryptocurrency')" input-id="cryptocurrency-input"
				:options="currenciesOptions" v-model="selectedCurrencies" :placeholder="$t('Select_Cryptocurrency')">
				<template #option="{ symbol, name }">
					<CryptoIcon :crypto="symbol" size="sm" bg="white" />
					<span>
						<span class="font-bold">{{ symbol.toUpperCase() }}</span>
						{{ name }}
					</span>
				</template>
				<template #after-options> {{ $t('More_cryptocurrencies_supported_in_the_future') }} </template>
				<template #selected-option="{ name }">{{ name }} </template>
			</Select>
		</template>
		<template #button-label>{{ $t('Submit_Location') }}</template>

		<!-- Success -->
		<template #success-title>{{ $t('Thank_you_for_submitting_a_new_location_to_the_Crypto_Map') }}</template>
		<template #success-description>{{ $t('This_may_take_a_few_days_to_process') }}</template>
		<template #success-button-label>{{ $t('Back_to_the_Map') }}</template>

		<!-- Error -->
		<template #error-title>{{ $t('Something_went_wrong') }}</template>
		<template #error-description>{{ $t('There_has_been_a_problem_on_our_side') }}</template>
		<template #error-button-label>{{ $t('Try_again') }}</template>
	</FormContainer>
</template>
