<template>
	<Combobox v-model="selected" v-slot="{ open }" as="div" nullable @update:model-value="emit('selected', selected)"
		by="id">
		<ComboboxLabel v-if="hasLabel" class="capitalize text-space/40">
			<slot name="label">
				{{ label }}
			</slot>
		</ComboboxLabel>
		<div class="relative" :class="{ 'mt-1': hasLabel }">
			<div class="relative w-full cursor-default overflow-hidden text-left ring-[1.5px]" :class="{
				'ring-space/[0.15] focus-within:ring-sky/30': !open,
				'ring-ocean/30': open,
				'rounded-full': roundedFull,
				'rounded-sm': !roundedFull,
			}">
				<ComboboxInput
					class="w-full border-none placeholder:text-space/60 focus-within:placeholder:text-sky/60 focus:ring-0 outline-none pr-[3.25rem] pl-4"
					:class="{
						'text-space': !open,
						'text-ocean': open,
						'text-sm py-[5px]': size === 'sm',
						'text-base py-2': size === 'md',
					}" autocomplete="off" :placeholder="placeholder" :displayValue="(v) => (v as Suggestion)?.label"
					@change="query = $event.target.value" />

				<div class="absolute inset-y-0 right-0 flex items-center pr-4">
					<ComboboxButton v-if="!userCanCleanInput">
						<SearchIcon class="w-4 h-5 text-space/40" />
					</ComboboxButton>
					<button v-else>
						<CrossIcon class="w-4 h-5 text-space/40" @click="clearInput()" />
					</button>
				</div>
			</div>
			<TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0">
				<ComboboxOptions v-element-visibility="onListVisibilityChange" data-combobox-options
					class="z-40 absolute w-full scroll-space overflow-auto rounded-sm text-base focus:outline-none shadow-lg top-0.5"
					:class="[
						comboboxOptionsClasses,
						{
							'bg-white': bgCombobox === 'white',
							'bg-space': bgCombobox === 'space',
						},
					]">
					<div class="relative px-4 py-2 cursor-default select-none" :class="{
						'text-space/80': bgCombobox === 'white',
						'text-white/80': bgCombobox === 'space',
					}" v-if="AutocompleteStatus.WITH_RESULTS !== status">
						<span v-if="status === AutocompleteStatus.LOADING">
							{{ $t('Loading') }}
						</span>
						<span v-else-if="status === AutocompleteStatus.INITIAL">
							{{ $t('Start_Typing') }}
						</span>
						<span v-else-if="status === AutocompleteStatus.NO_RESULTS && query !== ''">
							{{ $t('Nothing_found') }}
						</span>
					</div>

					<ComboboxOption v-else v-for="suggestion in suggestions" as="template" :key="suggestion.id" :value="suggestion"
						v-slot="{ selected, active }">
						<li class="relative select-none py-1.5 flex items-center transition-colors cursor-pointer" :class="{
							'hover:bg-space/[0.06] focus:bg-space/[0.06]': bgCombobox === 'white',
							'hover:bg-white/10 focus:bg-white/10': bgCombobox === 'space',
							'bg-space/[0.06]': bgCombobox === 'white' && active,
							'bg-white/10': bgCombobox === 'space' && active,
							'px-6 gap-x-6': size === 'sm',
							'px-3 gap-x-2': size === 'md',
						}">
							<span class="block truncate" :class="{
								'text-space': bgCombobox === 'white',
								'text-white': bgCombobox === 'space',
							}" v-html="makeBold(suggestion.label, suggestion.matchedSubstrings)">
							</span>
							<span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3" :class="{
								'text-white':
									(active && bgCombobox === 'white') || (!active && bgCombobox === 'space'),
								'text-space':
									(!active && bgCombobox === 'white') || (active && bgCombobox === 'space'),
							}">
							</span>
						</li>
					</ComboboxOption>
				</ComboboxOptions>
			</TransitionRoot>
		</div>
	</Combobox>
</template>

<script setup lang="ts">
import CrossIcon from "@/components/icons/icon-cross.vue"
import SearchIcon from "@/components/icons/icon-search.vue"
import { AutocompleteStatus, type Suggestion } from "@/stores/autocomplete"
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxLabel,
	ComboboxOption,
	ComboboxOptions,
	TransitionRoot
} from "@headlessui/vue"
import { vElementVisibility } from '@vueuse/components'
import { useDebounceFn } from "@vueuse/core"
import { computed, ref, useSlots, watchEffect } from "vue"

const props = defineProps({
	roundedFull: {
		type: Boolean,
		default: false,
	},
	comboboxOptionsClasses: {
		type: String,
		default: "",
	},
	bgCombobox: {
		type: String as () => "space" | "white",
		default: "white",
	},
	size: {
		type: String as () => "sm" | "md",
		default: "md",
	},
	label: {
		type: String,
		default: "",
	},
	placeholder: {
		type: String,
		default: "",
	},
	autocomplete: {
		type: Function,
		required: true,
	},
	suggestions: {
		type: Array as () => Suggestion[],
		required: true,
	},
	allowClean: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits({
	selected: (value?: Suggestion) => value,
	open: (value: boolean) => value,
})

const userCanCleanInput = computed(() => props.allowClean && query.value !== "" && query.value !== undefined)

const selected = ref<Suggestion>()
const query = ref<string>()

const loading = ref(false);
const status = computed<AutocompleteStatus>(() => {
	if (props.suggestions.length > 0) return AutocompleteStatus.WITH_RESULTS
	if (loading.value) return AutocompleteStatus.LOADING
	if (props.suggestions.length === 0 && query.value !== "") return AutocompleteStatus.NO_RESULTS
	return AutocompleteStatus.INITIAL
})

watchEffect(
	async () => {
		if (query.value === "undefined")
			query.value = undefined
		if (!query.value) return
		loading.value = true
		await props.autocomplete(query.value)
		loading.value = false
	}
)

const slots = useSlots()
const hasLabel = computed(() => props.label || hasSlot("label"))
function hasSlot(slotName: "label") {
	return slots[slotName] !== undefined
}

function makeBold(str: string, matches: Suggestion["matchedSubstrings"]) {
	matches?.forEach((match) => {
		const bolded = str.slice(match.offset, match.offset + match.length)
		str = str.replace(bolded, `<b>${bolded}</b>`)
	})
	return str
}

function clearInput() {
	selected.value = undefined
	query.value = undefined
}

const debouncedRequest = useDebounceFn(
	(isVisible: boolean) => {
		emit("open", isVisible)
	},
	50
)

function onListVisibilityChange(isVisible: boolean) {
	debouncedRequest(isVisible)
}
</script>
