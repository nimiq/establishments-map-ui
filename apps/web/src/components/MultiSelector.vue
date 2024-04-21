<script setup lang="ts" generic="T extends { value: string }">
withDefaults(defineProps<{ options: T[], multiple?: boolean }>(), { multiple: false })
const selected = defineModel<T[]>('selected')
const query = ref('')
</script>

<template>
  <ComboboxRoot v-model="selected" v-model:search-term="query" :multiple relative>
    <ComboboxAnchor relative input-text rounded-6 p-0 group>
      <ComboboxInput :placeholder="$t('Select an option')" @keydown.enter.prevent rounded-6 w-full py-4.5 px-14 bg-neutral-0 text="14 group-hocus:placeholder:blue" />
      <ComboboxTrigger absolute h-full right-0 inset-y-0 grid="~ place-content-center" aspect-square
        text="10 neutral-700 hocus:blue group-focus-within:blue group-hocus:blue">
        <div i-nimiq:chevron-down />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent position="popper" bg-gradient-neutral relative z-101
        w="[calc(var(--radix-combobox-trigger-width)+3px)]" ml--1.5 inset-0 rounded-6 shadow text-neutral-200
        ring="1.5 neutral-500/6" max-h-280 of-auto scrollbar="track:bg-pink" scrollbar-track:bg-neutral-200>
        <ComboboxViewport py-8>
          <ComboboxEmpty px-14 py-4.5>
            {{ $t('No options') }}
          </ComboboxEmpty>
          <ComboboxItem v-for="(option, index) in options" :key="index" :value="option" px-14 py-6
            flex="~ gap-8 items-center" cursor-pointer hocus:bg="neutral-0/6" transition-colors>
            <slot name="option" :option="option" />
            <ComboboxItemIndicator ml-auto rounded-full bg-neutral-0 size-20 grid="~ place-content-center">
              <div i-nimiq:check text="10 neutral" mb--2 />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
