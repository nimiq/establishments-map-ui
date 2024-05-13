<script setup lang="ts" generic="T extends string">
withDefaults(defineProps<{ options: T[], multiple?: boolean }>(), { multiple: false })
const selected = defineModel<T[]>('selected')
const query = ref('')
</script>

<template>
  <ComboboxRoot v-model="selected" v-model:search-term="query" :multiple relative>
    <ComboboxAnchor group relative p-0 input-box>
      <ComboboxInput
        :placeholder="$t('Select an option')" w-full
        rounded-6 bg-neutral-0 px-14 py-4.5 text="14 group-hocus:placeholder:blue" @keydown.enter.prevent
      />
      <ComboboxTrigger
        absolute inset-y-0 right-0 centered aspect-square h-full
        text="10 neutral-700 hocus:blue group-focus-within:blue group-hocus:blue"
      >
        <div i-nimiq:chevron-down />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent
        position="popper"
        w="[calc(var(--radix-combobox-trigger-width)+3px)]"
        ring="1.5 neutral-500/6" relative inset-0 z-300 ml--1.5 max-h-280 of-auto rounded-6 text-neutral-200 shadow bg-gradient-neutral
      >
        <ComboboxViewport py-8>
          <ComboboxEmpty px-14 py-4.5>
            {{ $t('No options') }}
          </ComboboxEmpty>
          <ComboboxItem
            v-for="(option, index) in options" :key="index" :value="option"
            flex="~ gap-8 items-center" hocus:bg="neutral-0/6" cursor-pointer px-14 py-6 transition-colors
          >
            <slot name="option" :option="option" />
            <ComboboxItemIndicator centered ml-auto size-20 rounded-full bg-neutral-0>
              <div i-nimiq:check text="10 neutral" mb--2 />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
