<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { vElementVisibility } from '@vueuse/components'
import { useDebounceFn } from '@vueuse/core'
import { computed, ref, useSlots, watchEffect } from 'vue'
import SearchIcon from '@/components/icons/icon-search.vue'
import CrossIcon from '@/components/icons/icon-cross.vue'
import { AutocompleteStatus } from '@/types'
import type { Suggestion } from '@/types'

const props = defineProps({
  roundedFull: {
    type: Boolean,
    default: false,
  },
  comboboxOptionsClasses: {
    type: String,
    default: '',
  },
  bgCombobox: {
    type: String as () => 'space' | 'white',
    default: 'white',
  },
  size: {
    type: String as () => 'sm' | 'md',
    default: 'md',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
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

const selected = ref<Suggestion>()
const query = ref<string>()

const userCanCleanInput = computed(() => props.allowClean && query.value !== '' && query.value !== undefined)

const loading = ref(false)
const status = computed<AutocompleteStatus>(() => {
  if (props.suggestions.length > 0)
    return AutocompleteStatus.WithResults
  if (loading.value)
    return AutocompleteStatus.Loading
  if (props.suggestions.length === 0 && query.value !== '')
    return AutocompleteStatus.NoResults
  return AutocompleteStatus.Initial
})

watchEffect(
  async () => {
    if (query.value === 'undefined')
      query.value = undefined
    if (!query.value)
      return
    loading.value = true
    await props.autocomplete(query.value)
    loading.value = false
  },
)

const slots = useSlots()
const hasLabel = computed(() => props.label || hasSlot('label'))
function hasSlot(slotName: 'label') {
  return slots[slotName] !== undefined
}

function sanitizeAndHighlightMatches(str: string, matches: Suggestion['matchedSubstrings']) {
  // Split into unicode chars because match positions in google.maps.places.AutocompletePrediction["matched_substrings"]
  // are based on unicode chars, as opposed to surrogate pairs of Javascript strings for Unicode chars on astral planes
  // (see https://mathiasbynens.be/notes/javascript-unicode)
  const parts = [...str]

  // Sanitize potential html in input string to mitigate risk of XSS because the result will be fed to v-html. Note that
  // this manipulation does not change indices/positions of our string parts (initial unicode characters).
  for (let i = 0; i < parts.length; ++i) {
    if (parts[i] === '<')
      parts[i] = '&lt;'
    else if (parts[i] === '>')
      parts[i] = '&gt;'
  }

  // Make matches bold. Note that our manipulations do not change indices/positions of our string parts (initial unicode
  // characters), thus we don't have to adapt match offsets of subsequent matches. Additionally, matches are probably
  // not overlapping, but it would also not hurt.
  for (const match of matches || []) {
    parts[match.offset] = `<b>${parts[match.offset]}`
    parts[match.offset + match.length - 1] = `${parts[match.offset + match.length - 1]}</b>`
  }

  return parts.join('')
}

function clearInput() {
  selected.value = undefined
  query.value = undefined
}

const debouncedRequest = useDebounceFn(
  (isVisible: boolean) => {
    emit('open', isVisible)
  },
  50,
)

function onListVisibilityChange(isVisible: boolean) {
  debouncedRequest(isVisible)
}
</script>

<template>
  <Combobox
    v-slot="{ open }" v-model="selected" as="div" nullable by="id"
    @update:model-value="emit('selected', selected)"
  >
    <ComboboxLabel v-if="hasLabel" class="capitalize text-space/40">
      <slot name="label">
        {{ label }}
      </slot>
    </ComboboxLabel>
    <div class="relative" :class="{ 'mt-1': hasLabel }">
      <div
        class="relative w-full cursor-default overflow-hidden text-left ring-[1.5px]" :class="{
          'ring-space/[0.15] focus-within:ring-sky/30': !open,
          'ring-ocean/30': open,
          'rounded-full': roundedFull,
          'rounded-sm': !roundedFull,
        }"
      >
        <ComboboxInput
          class="w-full border-none placeholder:text-space/60 focus-within:placeholder:text-sky/60 focus:ring-0 outline-none pr-[3.25rem] pl-4"
          :class="{
            'text-space': !open,
            'text-ocean': open,
            'text-sm py-[5px]': size === 'sm',
            'text-base py-2': size === 'md',
          }" autocomplete="off" :placeholder="placeholder" :display-value="(v) => (v as Suggestion)?.label"
          @change="query = $event.target.value"
        />

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
        <ComboboxOptions
          v-element-visibility="onListVisibilityChange" data-combobox-options
          class="z-40 absolute w-full scroll-space overflow-auto rounded-sm text-base focus:outline-none shadow-lg top-0.5"
          :class="[
            comboboxOptionsClasses,
            {
              'bg-white': bgCombobox === 'white',
              'bg-space': bgCombobox === 'space',
            },
          ]"
        >
          <div
            v-if="AutocompleteStatus.WithResults !== status" class="relative px-4 py-2 cursor-default select-none" :class="{
              'text-space/80': bgCombobox === 'white',
              'text-white/80': bgCombobox === 'space',
            }"
          >
            <span v-if="status === AutocompleteStatus.Loading">
              {{ $t('Loading...') }}
            </span>
            <span v-else-if="status === AutocompleteStatus.Initial">
              {{ $t('Start typing...') }}
            </span>
            <span v-else-if="status === AutocompleteStatus.NoResults && query !== ''">
              {{ $t('Nothing found.') }}
            </span>
          </div>

          <ComboboxOption
            v-for="suggestion in suggestions" v-else :key="suggestion.id" v-slot="{ selected: optionIsSelected, active }" as="template"
            :value="suggestion"
          >
            <li
              class="relative select-none py-1.5 flex items-center transition-colors cursor-pointer" :class="{
                'hover:bg-space/[0.06] focus:bg-space/[0.06]': bgCombobox === 'white',
                'hover:bg-white/10 focus:bg-white/10': bgCombobox === 'space',
                'bg-space/[0.06]': bgCombobox === 'white' && active,
                'bg-white/10': bgCombobox === 'space' && active,
                'px-6 gap-x-6': size === 'sm',
                'px-3 gap-x-2': size === 'md',
              }"
            >
              <span
                class="block truncate" :class="{
                  'text-space': bgCombobox === 'white',
                  'text-white': bgCombobox === 'space',
                }" v-html="sanitizeAndHighlightMatches(suggestion.label, suggestion.matchedSubstrings)"
              />
              <span
                v-if="optionIsSelected" class="absolute inset-y-0 left-0 flex items-center pl-3" :class="{
                  'text-white':
                    (active && bgCombobox === 'white') || (!active && bgCombobox === 'space'),
                  'text-space':
                    (!active && bgCombobox === 'white') || (active && bgCombobox === 'space'),
                }"
              />
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>
