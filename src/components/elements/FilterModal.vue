<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import CategoryIcon from "@/components/elements/CategoryIcon.vue"
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import Select from "@/components/elements/Select.vue"
import CrossIcon from "@/components/icons/icon-cross.vue"
import FilterIcon from "@/components/icons/icon-filter.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApi } from "@/stores/api"
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue"
import { storeToRefs } from "pinia"
import { computed, onMounted, ref } from "vue"

const isOpen = ref(false)

const { smallScreen } = useBreakpoints()

const apiStore = useApi()
const { currencies, categories, selectedCategories, selectedCurrencies } =
	storeToRefs(apiStore)

const unappliedSelectedCategories = ref<string[]>([])
const unappliedSelectedCurrencies = ref<string[]>([])

onMounted(() => {
	unappliedSelectedCategories.value = selectedCategories.value
	unappliedSelectedCurrencies.value = selectedCurrencies.value || []
})

const nFilters = computed(() => {
	return selectedCategories.value.length + selectedCurrencies.value.length
})

function clearFilters() {
	unappliedSelectedCategories.value = []
	unappliedSelectedCurrencies.value = []
	selectedCategories.value = []
	selectedCurrencies.value = []
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
	selectedCategories.value = [...unappliedSelectedCategories.value]
	selectedCurrencies.value = [...unappliedSelectedCurrencies.value]
	closeModal({ shouldClearFilters: false })
}

function specialCurrency(id: string | number) {
	return ["bluecode", "atm"].includes(id as string)
}
</script>

<template>
	<Button @click="openModal" bgColor="grey" size="md">
		<template #icon>
			<FilterIcon class="text-space w-4.5 h-4.5" />
		</template>
		<template #text v-if="!smallScreen"> {{ $t('Filters') }} </template>
		<template #badge v-if="nFilters > 0"> {{ nFilters }} </template>
	</Button>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal({ shouldClearFilters: false })" class="relative z-20">
			<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
				leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-space/60" />
			</TransitionChild>

			<div class="fixed bottom-0 inset-x-0 md:inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center text-center">
					<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95">
						<DialogPanel
							class="relative w-full md:max-w-lg transform rounded-t-8 md:rounded-lg bg-white py-8 text-left align-middle shadow-lg transition-all">
							<CrossIcon @click="closeModal({ shouldClearFilters: false })"
								class="absolute top-4 right-4 bg-space/20 hover:bg-space/30 focus-visible:bg-space/30 transition-colors text-white/80 w-6 h-6 rounded-full cursor-pointer" />

							<DialogTitle as="h2" class="text-2xl font-bold text-space text-center px-6 md:px-10">
								{{ $t('Filters') }}
							</DialogTitle>
							<hr class="w-full bg-space/10 h-px my-8" />

							<Select placeholder="Select cryptocurrencies" :options="Object.values(currencies)" label-key="name"
								v-model="unappliedSelectedCurrencies" class="px-6 md:px-10">
								<template #label>
									<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-6 md:mb-8">
										{{ $t('Cryptocurrencies') }}
									</h3>
								</template>
								<template #option="{ id, label }">
									<div class="flex items-center gap-x-2">
										<CryptoIcon class="w-6 h-6" :crypto="id as string" border />
										<span v-if="!specialCurrency(id)"><b>{{ id }}</b>, {{ $t(label) }}</span>
										<template v-else>
											<span>{{ $t(label) }}</span>
											<span v-if="id === 'bluecode'"
												class="uppercase opacity-60 text-[10px] font-bold border-fog rounded-full tracking-wider pt-1 pl-1">
												{{ $t('Coming_soon') }}
											</span>
										</template>
									</div>
								</template>
								<template #after-options> More cryptocurrencies supported in the future </template>
								<template #selected-option="{ label }"> {{ label }} </template>
							</Select>
							<Select :options="Object.values(categories)" v-model="unappliedSelectedCategories"
								placeholder="Select category" class="mt-9 px-6 md:px-10">
								<template #label>
									<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-6 md:mb-8">
										{{ $t('Categories') }}
									</h3>
								</template>
								<template #option="{ id, label }">
									<CategoryIcon class="w-6 h-6" :category="id as string" />
									{{ label }}
								</template>
								<template #selected-option="{ label }">
									<template v-if="label">{{ $t(label) }}</template>
								</template>
							</Select>
							<hr class="w-full bg-space/10 h-px my-8" />
							<div class="px-6 md:px-10 flex justify-between">
								<Button bg-color="grey" @click="closeModal({ shouldClearFilters: true })">
									<template #text> {{ $t('Clear') }} </template>
								</Button>
								<Button bg-color="sky" @click="applyFilters" gradient>
									<template #text> {{ $t('Apply_filters') }} </template>
								</Button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
