<script setup lang="ts">
import TheList from "@/components/TheList.vue"
import Button from "@/components/atoms/Button.vue"
import FilterModal from "@/components/atoms/FilterModal.vue"
import Popover from "@/components/atoms/Popover.vue"
import SearchBox from "@/components/atoms/SearchBox.vue"
import ChevronLeftIcon from "@/components/icons/icon-arrow-small-left.vue"
import { useApp } from "@/stores/app"
import { SuggestionType, useAutocomplete, type Suggestion } from "@/stores/autocomplete"
import { useEstablishments } from "@/stores/establishments"
import { useMap } from "@/stores/map"
import { useBreakpoints } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { screens } from 'tailwindcss-nimiq-theme'
import { computed } from "vue"

const appStore = useApp()
const { listIsShown } = storeToRefs(appStore)

const { xl } = useBreakpoints(screens)

const establishmentsStore = useEstablishments()
const { establishmentsInView } = storeToRefs(establishmentsStore)

const listIsEmpty = computed(() => establishmentsInView.value.length === 0)

const autocompleteStore = useAutocomplete();
const { querySearch } = autocompleteStore;
const { dbSuggestions, googleSuggestions } = storeToRefs(autocompleteStore)

const suggestions = computed(() => dbSuggestions.value.concat(googleSuggestions.value))

function onSelect(suggestion?: Suggestion) {
	if (!suggestion) return

	switch (suggestion.type) {
		case SuggestionType.GOOGLE_ESTABLISHMENT:
		case SuggestionType.GOOGLE_REGIONS:
			useMap().goToPlaceId(suggestion.id)
			break;
		case 'category':
			appStore.setSelectedCategories([suggestion.label])
			break
		case 'currency':
			appStore.setSelectedCurrencies([suggestion.id])
			break
		case 'establishment':
			appStore.goToEstablishment(suggestion.id, { behaviourList: 'show' })
			break
	}

	hideSearchBoxList()
}

function searchBoxOpen(value: boolean) {
	value ? showSearchBoxList() : hideSearchBoxList()
}

function hideSearchBoxList() {
	const searchBoxList = document.querySelector('ul[data-combobox-options]') as HTMLElement | null
	if (!searchBoxList) return

	searchBoxList.remove()
}

function showSearchBoxList() {
	const searchBoxList = document.querySelector('[data-search-box] ul') as HTMLElement | null
	if (!searchBoxList) return

	document.body.appendChild(searchBoxList)
	searchBoxList.style.position = 'absolute'
	searchBoxList.style.top = `36px`
	searchBoxList.style.left = `24px`
	searchBoxList.style.zIndex = '1000'
}
</script>

<template>
	<div class="xl:overflow-y-hidden shadow-header xl:w-[322px] xl:rounded-xl transition-height" :class="{
		'xl:h-[128px]': !listIsShown,
		'xl:h-[calc(112px+208px)]': listIsShown && listIsEmpty,
		'xl:h-[calc(100vh-104px)]': listIsShown && !listIsEmpty,
	}">
		<header class="relative z-10 w-full p-10 py-6 pl-4 pr-6 bg-white xl:p-4 transition-[border]"
			:class="{ 'xl:border-b-xs xl:border-b-space/10': listIsShown }">
			<div class="flex items-center gap-x-2">
				<Popover cta-href="https://nimiq.com">
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
				<SearchBox :autocomplete="querySearch" :suggestions="suggestions" class="flex-1" rounded-full
					combobox-options-classes="w-[322px] mt-12 left-[-48px] max-h-[220px] rounded-t-0" size="sm"
					@open="searchBoxOpen" :placeholder="$t('Search_Map')" @selected="onSelect" data-search-box />
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
		<template #label>
			{{ listIsShown ? $t("Hide_list") : $t("Show_list") }}
		</template>
	</Button>
</template>
