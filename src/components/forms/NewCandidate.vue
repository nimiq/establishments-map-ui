<script setup lang="ts">
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import FormContainer from "@/components/forms/FormContainer.vue"
import { useAutocomplete, SuggestionType, type Suggestion } from "@/composables/useAutocomplete"
import { useApi } from "@/stores/api"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import SearchBox from "../elements/SearchBox.vue"
import Select from "../elements/Select.vue"

const apiStore = useApi()
const { currencies } = storeToRefs(apiStore)

const { autocomplete, suggestions, status } = useAutocomplete({ searchFor: [SuggestionType.GOOGLE_ESTABLISHMENT] })

const selectedCurrencies = ref<string[]>([])
const selectedPlace = ref<Suggestion>()

const disabled = computed(() => selectedCurrencies.value.length === 0 || !selectedPlace.value)

async function onSubmit(token: string) {
	return await apiStore.addCandidate({
		token,
		currencies: selectedCurrencies.value,
		gmapsPlaceId: selectedPlace.value?.id as string || "",
		name: selectedPlace.value?.label || "",
	})
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
			<SearchBox :autocomplete="autocomplete" :status="status" :suggestions="suggestions" :label="$t('Find_place')"
				combobox-options-classes="w-[calc(100%+4px)] -left-0.5 top-unset" bg-combobox="space" input-id="search-input"
				@selected="(selectedPlace = $event)" :allow-clean="false" />

			<Select class="mt-6" :label="$t('Select_Cryptocurrency')" input-id="cryptocurrency-input"
				:options="Object.values(currencies)" v-model="selectedCurrencies" :placeholder="$t('Select_Cryptocurrency')">
				<template #option="{ id, name }">
					<CryptoIcon class="w-6 h-6" :crypto="(id as string)" />
					<span>
						<span class="font-bold">{{ (id as string).toUpperCase() }}</span>
						{{ name }}
					</span>
				</template>
				<template #after-options> {{ $t('More_cryptocurrencies_supported_in_the_future') }} </template>
				<template #selected-option="{ name }">{{ name }} </template>
			</Select>
		</template>
		<template #button-label>{{ $t('Submit_Establishment') }}</template>

		<!-- Success -->
		<template #success-title>{{ $t('Thank_you_for_submitting_a_new_establishment_to_the_Crypto_Map') }}</template>
		<template #success-description>{{ $t('This_may_take_a_few_days_to_process') }}</template>
		<template #success-button-label>{{ $t('Back_to_the_Map') }}</template>

		<!-- Error -->
		<template #error-title>{{ $t('Something_went_wrong') }}</template>
		<template #error-description>{{ $t('There_has_been_a_problem_on_our_side') }}</template>
		<template #error-button-label>{{ $t('Try_again') }}</template>
	</FormContainer>
</template>
