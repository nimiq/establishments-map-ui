<script setup lang="ts">
import TheList from "@/components/TheList.vue"
import Button from "@/components/elements/Button.vue"
import FilterModal from "@/components/elements/FilterModal.vue"
import Popover from "@/components/elements/Popover.vue"
import SearchBox from "@/components/elements/SearchBox.vue"
import ChevronLeftIcon from "@/components/icons/icon-arrow-small-left.vue"
import { SuggestionType, useAutocomplete, type Suggestion } from "@/composables/useAutocomplete"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { useEstablishments } from "@/stores/establishments"
import { useGoogle } from "@/stores/google"
import { useBreakpoints } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { screens } from 'tailwindcss-nimiq-theme'
import { computed } from "vue"

const googleStore = useGoogle()

const apiStore = useApi()
const { selectedCategories, selectedCurrencies } = storeToRefs(apiStore)

const appStore = useApp()
const { listIsShown } = storeToRefs(appStore)

const { xl } = useBreakpoints(screens)

const establishmentsStore = useEstablishments()
const { establishmentsInView, nearEstablishmentsNotInView, shouldShowNearby } = storeToRefs(establishmentsStore)

const listIsEmpty = computed(() => establishmentsInView.value.length === 0)

const { autocomplete, suggestions, status } = useAutocomplete({ searchFor: [SuggestionType.GOOGLE_REGIONS, SuggestionType.API] })

function onSelect(suggestion?: Suggestion) {
	if (!suggestion) return

	if (suggestion.type === SuggestionType.GOOGLE_REGIONS || suggestion.type === SuggestionType.GOOGLE_ESTABLISHMENT) {
		googleStore.goToPlaceId(suggestion.id)
		return
	} else if (suggestion.type === SuggestionType.API) {
		switch (suggestion.apiSuggestion) {
			case 'category':
				selectedCategories.value = [suggestion.id]
				break
			case 'currency':
				selectedCurrencies.value = [suggestion.id]
				break
			case 'establishment':
				appStore.goToEstablishment(suggestion.id, { behaviourList: 'show' })
				break
		}
	}
}
</script>

<template>
	<div class="xl:overflow-hidden shadow-header xl:w-96 xl:rounded-xl transition-height" :class="{
		'xl:h-[112px]': !listIsShown,
		'xl:h-[calc(112px+208px)]': listIsShown && listIsEmpty,
		'xl:h-[calc(100vh-104px)]': listIsShown && !listIsEmpty,
	}">
		<header class="relative z-10 w-full p-10 py-6 pl-4 pr-6 bg-white xl:p-4">
			<div class="flex items-center gap-x-2">
				<Popover cta-href="https://nimiq.com" :custom-top="true" class="xl:!fixed [&_[data-tooltip]]:max-w-xs">
					<template #trigger>
						<img src="@/assets/logo.svg" alt="Crypto Map logo" class="w-6">
					</template>
					<template #title>
						{{ $t('Crypto_Map') }}
					</template>
					<template #description>
						{{ $t('This_app_is_brought_to_you_by_Nimiq') }}
					</template>
					<template #cta>
						{{ $t('Go_to_Nimiq') }}
					</template>
					<template #bottom>
						<img class="mt-4 ml-auto opacity-40" alt="Nimiq logo" src="@/assets/nimiq-horizontal-logo.svg" />
					</template>
				</Popover>
				<SearchBox :autocomplete="autocomplete" :suggestions="suggestions" :status="status" class="flex-1 ml-8"
					rounded-full combobox-options-classes="w-[calc(100vw)] mt-12 left-[-51px] max-h-[220px] rounded-t-0" size="sm"
					@selected="onSelect" />
				<FilterModal />
			</div>
			<p class="pt-4 text-xs text-space/60" v-if="xl">
				{{ $t('Enter_country_city_or_zip_code') }}
			</p>
		</header>
		<TheList v-if="xl" class="!shadow-none" />
	</div>
	<Button v-if="xl" bgColor="white" class="mt-6 shadow" size="md" @click="appStore.toggleList()">
		<template #icon>
			<ChevronLeftIcon class="h-4 text-space w-4.5 transition-transform delay-150 ease-out" :class="{
				'rotate-90': listIsShown,
				'-rotate-90': !listIsShown,
			}" />
		</template>
		<template #text>
			{{ listIsShown ? $t("Hide_list") : $t("Show_list") }}
		</template>
	</Button>
</template>
