<script setup lang="ts" generic="T extends string">
withDefaults(defineProps<{ options: T[], displayValue?: (v: T) => string }>(), { displayValue: (v: T) => v })
const selected = defineModel<T>('selected')
</script>

<template>
  <SelectRoot v-model="selected" relative>
    <SelectTrigger input-box flex="~ gap-8 items-center">
      <SelectValue
        :placeholder="i18n.t('Select issue')" text-14
        :class="{ 'text-neutral': !!selected, 'text-neutral-700': !selected }"
      />
      <div aria-hidden i-nimiq:chevron-down ml-auto text="12 neutral-600" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        position="popper"
        w="[calc(var(--radix-select-trigger-width)+3px)]" relative inset-0 z-500 ml--1.5 rounded-6 text-neutral-200 bg-gradient-neutral shadow
        ring="1.5 neutral-500/6"
      >
        <SelectViewport py-8>
          <SelectItem
            v-for="(option, index) in options" :key="index" :value="option"
            flex="~ gap-8 items-center" hocus:bg="neutral-0/6" cursor-pointer px-14 py-6 transition-colors
          >
            <SelectItemText>{{ displayValue(option) }}</SelectItemText>
            <SelectItemIndicator centered ml-auto size-20 rounded-full bg-neutral-0>
              <div i-nimiq:check text="10 neutral" mb--2 />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
