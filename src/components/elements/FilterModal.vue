<script setup lang="ts">
import Button from "@/components/atoms/Button.vue"
import CategoryIcon from "@/components/atoms/CategoryIcon.vue"
import CryptoIcon from "@/components/atoms/CryptoIcon.vue"
import Select from "@/components/atoms/Select.vue"
import CrossIcon from "@/components/icons/icon-cross.vue"
import FilterIcon from "@/components/icons/icon-filter.vue"
import type { Category, Currency } from "@/database"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue"
import { storeToRefs } from "pinia"
import { computed, ref, watchEffect } from "vue"

const isOpen = ref(false)

const apiStore = useApi()
const { currencies, categories, loading } = storeToRefs(apiStore)
const appStore = useApp()
const { selectedCategories, selectedCurrencies } = storeToRefs(appStore)

const unappliedFiltersCategories = ref<Category[]>([])
const unappliedFiltersCurrencies = ref<Currency[]>([])

watchEffect(() => {
	unappliedFiltersCategories.value = [...selectedCategories.value];
})

watchEffect(() => {
	unappliedFiltersCurrencies.value = [...selectedCurrencies.value];
})

const nFilters = computed(() => {
	if (!selectedCategories || !selectedCurrencies) return 0
	return selectedCategories.value.length + selectedCurrencies.value.length
})

function clearFilters() {
	unappliedFiltersCategories.value = []
	unappliedFiltersCurrencies.value = []
	appStore.setSelectedCategories([])
	appStore.setSelectedCurrencies([])
}

function closeModal({ shouldClearFilters }: { shouldClearFilters: boolean }) {
	if (shouldClearFilters) {
		clearFilters()
	}
	isOpen.value = false
}

function openModal() {
	isOpen.value = true
}

function applyFilters() {
	appStore.setSelectedCategories(unappliedFiltersCategories.value.map(c => c.label))
	appStore.setSelectedCurrencies(unappliedFiltersCurrencies.value.map(c => c.symbol))
	closeModal({ shouldClearFilters: false })
}
</script>

<template>
	<Button @click="openModal" bgColor="grey" size="md" :disabled="loading">
		<template #icon>
			<FilterIcon class="text-space w-4.5 h-4.5" />
		</template>
		<template #badge v-if="nFilters > 0">{{ nFilters }} </template>
	</Button>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal({ shouldClearFilters: false })" class="relative z-20">
			<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
				leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-space/60" />
			</TransitionChild>

			<div class="fixed inset-x-0 bottom-0 overflow-y-auto md:inset-0">
				<div class="flex items-center justify-center min-h-full text-center">
					<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95">
						<DialogPanel
							class="relative w-full py-8 text-left align-middle transition-all transform bg-white shadow-lg md:max-w-lg rounded-t-8 md:rounded-lg">
							<CrossIcon @click="closeModal({ shouldClearFilters: false })"
								class="absolute w-6 h-6 transition-colors rounded-full cursor-pointer top-4 right-4 bg-space/20 hover:bg-space/30 focus-visible:bg-space/30 text-white/80" />

							<DialogTitle as="h2" class="px-6 text-2xl font-bold text-center text-space md:px-10">
								{{ $t('Filters') }}
							</DialogTitle>
							<hr class="w-full h-px my-8 bg-space/10" />

							<Select :placeholder="$t('Select_Cryptocurrency')" :options="[...currencies?.values()]" label-key="symbol"
								v-model="unappliedFiltersCurrencies" class="px-6 md:px-10">
								<template #label>
									<h3 class="mb-6 text-sm font-semibold tracking-wider uppercase text-space/40 md:mb-8">
										{{ $t('Cryptocurrencies') }}
									</h3>
								</template>
								<template #option="{ symbol, name }">
									<div class="flex items-center gap-x-2">
										<CryptoIcon :crypto="symbol" size="sm" bg="white" />
										<span><b>{{ symbol }}</b>, {{ $t(name) }}</span>
									</div>
								</template>
								<template #after-options> {{ $t('More_cryptocurrencies_supported_in_the_future') }}</template>
								<template #selected-option="{ symbol }"> {{ symbol }} </template>
							</Select>
							<Select :options="[...categories.values()]" v-model="unappliedFiltersCategories"
								:placeholder="$t('Select_Category')" class="px-6 mt-9 md:px-10">
								<template #label>
									<h3 class="mb-6 text-sm font-semibold tracking-wider uppercase text-space/40 md:mb-8">
										{{ $t('Categories') }}
									</h3>
								</template>
								<template #option="{ label }">
									<CategoryIcon class="w-6 h-6" :category="label" />
									{{ $t(label) }}
								</template>
								<template #selected-option="{ label }">
									<template v-if="label">{{ $t(label as string) }}</template>
								</template>
							</Select>
							<hr class="w-full h-px my-8 bg-space/10" />
							<div class="flex justify-between px-6 md:px-10">
								<Button bg-color="grey" @click="closeModal({ shouldClearFilters: true })">
									<template #label> {{ $t('Clear') }} </template>
								</Button>
								<Button bg-color="sky" @click="applyFilters" gradient>
									<template #label> {{ $t('Apply_filters') }} </template>
								</Button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
