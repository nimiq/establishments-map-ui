<script setup lang="ts" generic="Option extends string | object">
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { computed, ref, useSlots, watch } from 'vue'
import ArrowSelectIcon from '@/components/icons/icon-arrow-select.vue'
import CheckIcon from '@/components/icons/icon-check.vue'
import CrossIcon from '@/components/icons/icon-cross.vue'
import { i18n } from '@/i18n/i18n-setup'

const props = defineProps({
  modelValue: {
    type: Array as () => Option[],
    default: () => [],
  },
  selectedSingle: {
    type: [Object, String] as unknown as () => Option,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Array as () => Option[],
    default: () => [],
  },
  placeholder: {
    type: String,
    default: () => i18n.t('Select an option'),
  },
  label: {
    type: String,
    default: () => i18n.t('Select an option'),
  },
  replacePlaceholder: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  'update:modelValue': (value: Option[]) => value,
  'update:selectedSingle': (value: Option) => value,
})

const selected = ref<Option[]>(props.modelValue)

const usePlaceholder = computed(() => props.replacePlaceholder && !!selected.value && (Array.isArray(selected.value) ? selected.value.length > 0 : Object.keys(selected.value).length > 0))

watch(selected, (value) => {
  if (props.multiple)
    emit('update:modelValue', value as Option[])
  else
    emit('update:selectedSingle', value as Option)
})

const slots = useSlots()
const hasLabel = computed(() => props.label || hasSlot('label'))
function hasSlot(slotName: 'selected-option' | 'after-options' | 'label') {
  return slots[slotName] !== undefined
}
</script>

<template>
  <div>
    <Listbox v-model="selected" :multiple="multiple">
      <ListboxLabel v-if="hasLabel" class="capitalize text-space/40">
        <slot name="label">
          {{ label }}
        </slot>
      </ListboxLabel>
      <div class="relative" :class="{ 'mt-1': hasLabel }">
        <ListboxButton
          class="relative w-full ring-[1.5px] ring-space/[0.15] cursor-pointer rounded-sm bg-white py-2 pl-4 pr-[3.25rem] text-left outline-none focus-visible:ring-sky/30 focus-visible:text-sky/60"
          :class="usePlaceholder ? 'text-space' : 'text-space/60'"
        >
          <span class="block truncate">
            <slot
              v-if="usePlaceholder" name="selected"
              v-bind="{ option: multiple ? selected : selected as Option }"
            />
            <template v-else>{{ placeholder }}</template>
          </span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 mr-2 pointer-events-none">
            <ArrowSelectIcon class="h-5 w-5 text-space/[0.15]" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute -top-px -left-px w-[calc(100%+2px)] overflow-auto rounded-sm bg-white py-1 text-16 ring-1 ring-space ring-opacity-5 focus:outline-none sm:text-14 scroll-grey z-40 bg-gradient-space pb-4 max-h-60 shadow-select space-y-1"
          >
            <ListboxOption
              v-for="(option, i) in options" v-slot="{ active, selected: optionIsSelected }" :key="i" :value="option"
              as="template"
            >
              <li
                class="relative flex items-center py-2 pl-3 pr-2 text-white transition-colors cursor-pointer select-none gap-x-2"
                :class="{ 'bg-white/10': active }"
              >
                <slot name="option" v-bind="typeof option === 'object' ? option : { option }" />
                <div
                  class="w-5 h-5 ml-auto rounded-full" :class="{
                    'bg-white': optionIsSelected,
                    'border border-white/10': !optionIsSelected,
                  }"
                >
                  <CheckIcon v-if="optionIsSelected" class="w-5 h-5 -top-0.5 -left-px text-space" />
                </div>
              </li>
            </ListboxOption>
            <div v-if="hasSlot('after-options')" class="text-14 text-white/60 px-4 mt-2.5">
              <slot name="after-options" />
            </div>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
    <ul v-if="hasSlot('selected-option')" class="flex flex-wrap gap-2 mt-2">
      <li
        v-for="(option, i) in selected" :key="i"
        class="w-max bg-space/[0.07] rounded-sm px-2 pt-1.5 pb-1 text-14 text-space flex gap-x-2.5 items-center"
      >
        <span>
          <slot name="selected-option" v-bind="{ option }" />
        </span>
        <CrossIcon class="w-2 cursor-pointer text-space" @click="selected = selected.filter(o => o !== option)" />
      </li>
    </ul>
  </div>
</template>
