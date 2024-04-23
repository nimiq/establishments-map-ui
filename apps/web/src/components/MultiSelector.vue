<script setup lang="ts" generic="T extends string">
withDefaults(defineProps<{ options: T[], multiple?: boolean }>(), { multiple: false })
const selected = defineModel<T[]>('selected')
const query = ref('')
</script>

<template>
  <ComboboxRoot v-model="selected" v-model:search-term="query" :multiple relative>
    <ComboboxAnchor relative input-box p-0 group>
      <ComboboxInput :placeholder="$t('Select an option')" rounded-6 @keydown.enter.prevent w-full py-4.5 px-14
        bg-neutral-0 text="14 group-hocus:placeholder:blue" />
      <ComboboxTrigger absolute h-full right-0 inset-y-0 grid="~ place-content-center" aspect-square
        text="10 neutral-700 hocus:blue group-focus-within:blue group-hocus:blue">
        <div i-nimiq:chevron-down />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent position="popper" bg-gradient-neutral relative z-101
        w="[calc(var(--radix-combobox-trigger-width)+3px)]" ml--1.5 inset-0 rounded-6 shadow text-neutral-200
        ring="1.5 neutral-500/6" max-h-280 of-auto>
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
