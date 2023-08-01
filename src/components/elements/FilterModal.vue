<script setup lang="ts">
import Button from "@/components/atoms/Button.vue"
import CategoryIcon from "@/components/atoms/CategoryIcon.vue"
import CryptoIcon from "@/components/atoms/CryptoIcon.vue"
import Select from "@/components/atoms/Select.vue"
import CrossIcon from "@/components/icons/icon-cross.vue"
import FilterIcon from "@/components/icons/icon-filter.vue"
import type { Category, Currency } from "@/database"
import { categories, currencies } from "@/database"
import { useApp } from "@/stores/app"
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue"
import { storeToRefs } from "pinia"
import { computed, ref, watchEffect } from "vue"

const isOpen = ref(false)

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
	appStore.setSelectedCategories(unappliedFiltersCategories.value)
	appStore.setSelectedCurrencies(unappliedFiltersCurrencies.value)
	closeModal({ shouldClearFilters: false })
}
</script>

<template>
	<div>
	<Button @click="openModal" bgColor="white" size="md">
		<template #icon>
			<FilterIcon class="text-space w-4.5 h-4.5" />
		</template>
		<template #label>
			Filters
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

							<Select :placeholder="$t('Select Cryptocurrency')" :options="currencies"
								v-model="unappliedFiltersCurrencies" class="px-6 md:px-10">
								<template #label>
									<h3 class="mb-6 text-sm font-semibold tracking-wider uppercase text-space/40 md:mb-8">
										{{ $t('Cryptocurrencies') }}
									</h3>
								</template>
								<template #option="{ option: currency }">
									<div class="flex items-center gap-x-2">
										<CryptoIcon :crypto="currency" size="sm" bg="white" />
										<b>{{ currency }}</b>
									</div>
								</template>
								<template #after-options> {{ $t('More cryptocurrencies supported in the future') }}</template>
								<template #selected-option="{ option: currency }"> {{ currency }} </template>
							</Select>
							<Select :options="categories" v-model="unappliedFiltersCategories"
								:placeholder="$t('Select category')" class="px-6 mt-9 md:px-10">
								<template #label>
									<h3 class="mb-6 text-sm font-semibold tracking-wider uppercase text-space/40 md:mb-8">
										{{ $t('Categories') }}
									</h3>
								</template>
								<template #option="{ option: category }">
									<CategoryIcon class="w-6 h-6" :category="category" />
									<!-- Note: the translations for categories are defined in api-constants-*.json -->
									{{ $t(category) }}
								</template>
								<template #selected-option="{ option: category }">
									<!-- Note: the translations for categories are defined in api-constants-*.json -->
									<template v-if="category">{{ $t(category) }}</template>
								</template>
							</Select>
							<hr class="w-full h-px my-8 bg-space/10" />
							<div class="flex justify-between px-6 md:px-10">
								<Button bg-color="grey" @click="closeModal({ shouldClearFilters: true })">
									<template #label> {{ $t('Clear') }} </template>
								</Button>
								<Button bg-color="sky" @click="applyFilters" gradient>
									<template #label> {{ $t('Apply filters') }} </template>
								</Button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
	</div>
</template>
