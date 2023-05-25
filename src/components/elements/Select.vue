<template>
	<div>
		<Listbox v-model="selected" :multiple="multiple">
			<ListboxLabel v-if="hasLabel" class="text-space/40 capitalize">
				<slot name="label">
					{{ label }}
				</slot>
			</ListboxLabel>
			<div class="relative" :class="{ 'mt-1': hasLabel }">
				<ListboxButton
					class="relative w-full ring-[1.5px] ring-space/[0.15] cursor-pointer rounded-sm bg-white py-2 pl-4 pr-[3.25rem] text-left outline-none focus-visible:ring-sky/30 focus-visible:text-sky/60"
					:class="{ 'text-space': usePlaceholder, 'text-space/60': !usePlaceholder, }">
					<span class="block truncate">
						{{
							usePlaceholder
							? geOptionById(selected as unknown as string | number)?.label
							: placeholder
						}}
					</span>
					<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 mr-2">
						<ArrowSelectIcon class="h-5 w-5 text-space/[0.15]" aria-hidden="true" />
					</span>
				</ListboxButton>

				<transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
					leave-to-class="opacity-0">
					<ListboxOptions
						class="absolute -top-px -left-px w-[calc(100%+2px)] overflow-auto rounded-sm bg-white py-1 text-base ring-1 ring-space ring-opacity-5 focus:outline-none sm:text-sm scroll-grey z-40 bg-gradient-space pb-4 max-h-60 shadow-select space-y-1">
						<ListboxOption v-slot="{ active, selected }" v-for="option in options" :key="option.id" :value="option.id"
							as="template">
							<li
								class="relative select-none py-2 pl-3 pr-2 text-white flex gap-x-2 items-center cursor-pointer transition-colors"
								:class="{ 'bg-white/10': active }">
								<slot name="option" v-bind="option">{{ option[labelKey] || '' }}</slot>
								<div class="w-5 h-5 rounded-full ml-auto" :class="{
									'bg-white': selected,
									'border border-white/10': !selected,
								}">
									<CheckIcon v-if="selected" class="w-5 h-5 -top-0.5 -left-px text-space" />
								</div>
							</li>
						</ListboxOption>
						<div class="text-sm text-white/60 px-4 mt-2.5" v-if="hasSlot('after-options')">
							<slot name="after-options" />
						</div>
					</ListboxOptions>
				</transition>
			</div>
		</Listbox>
		<ul class="mt-2 flex flex-wrap gap-2" v-if="hasSlot('selected-option')">
			<li v-for="selectedOption in selected" :key="selectedOption"
				class="w-max bg-space/[0.07] rounded-sm px-2 pt-1.5 pb-1 text-sm text-space flex gap-x-2.5 items-center">
				<span>
					<slot name="selected-option" v-bind="geOptionById(selectedOption)" />
				</span>
				<CrossIcon @click="removeSelected(selectedOption)" class="text-space w-4 h-5 cursor-pointer" />
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import ArrowSelectIcon from "@/components/icons/icon-arrow-select.vue"
import CheckIcon from "@/components/icons/icon-check.vue"
import CrossIcon from "@/components/icons/icon-cross.vue"
import { ref, useSlots, watch, computed } from "vue"

import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/vue"

export type SelectOption = {
	id: string | number
	label: string
	[key: string]: unknown
}

const props = defineProps({
	modelValue: {
		type: Array as () => SelectOption["id"][],
		default: () => [],
	},
	selectedSingle: {
		type: Object as () => SelectOption,
		default: () => undefined,
	},
	options: {
		type: Array as () => SelectOption[],
		default: () => [],
	},
	multiple: {
		type: Boolean,
		default: true,
	},
	placeholder: {
		type: String,
		default: "Select an option",
	},
	label: {
		type: String,
		default: "Select an option",
	},
	labelKey: {
		type: String,
		default: "label",
	},
	replacePlaceholder: {
		type: Boolean,
		default: false,
	},
})

const usePlaceholder = computed(() => props.replacePlaceholder && !!selected.value && !Array.isArray(selected.value))

const emit = defineEmits({
	"update:modelValue": (value: SelectOption["id"][]) => value,
	"update:selectedSingle": (value: SelectOption) => value,
})

const selected = ref<SelectOption["id"][]>(props.modelValue)
watch(selected, (value) => {
	if (props.multiple) {
		emit("update:modelValue", value)
	} else {
		const item = geOptionById(value as unknown as string | number)
		if (!item) return
		emit("update:selectedSingle", item)
	}
})

function removeSelected(option: SelectOption["id"]) {
	selected.value = selected.value.filter((o) => o !== option)
}

function geOptionById(id: SelectOption["id"]) {
	return props.options.find((o) => o.id === id)
}

const slots = useSlots()
const hasLabel = computed(() => props.label || hasSlot("label"))
function hasSlot(slotName: "selected-option" | "after-options" | "label") {
	return slots[slotName] !== undefined
}
</script>
