<script setup lang="ts" generic="T extends string">
withDefaults(defineProps<{ options: T[], displayValue?: (v: T) => string }>(), { displayValue: (v: T) => v })
const selected = defineModel<T>('selected')
</script>

<template>
  <SelectRoot v-model="selected" relative>
    <SelectTrigger input-box flex="~ gap-8 items-center">
      <SelectValue :placeholder="i18n.t('Select issue')" text-14
        :class="{ 'text-neutral': !!selected, 'text-neutral-700': !selected }" />
      <div aria-hidden i-nimiq:chevron-down ml-auto text="12 neutral-600" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent position="popper" bg-gradient-neutral relative z-101
        w="[calc(var(--radix-select-trigger-width)+3px)]" ml--1.5 inset-0 rounded-6 shadow text-neutral-200
        ring="1.5 neutral-500/6">
        <SelectViewport py-8>
          <SelectItem v-for="(option, index) in options" :key="index" :value="option" px-14 py-6
            flex="~ gap-8 items-center" cursor-pointer hocus:bg="neutral-0/6" transition-colors>
            <SelectItemText>{{ displayValue(option) }}</SelectItemText>
            <SelectItemIndicator ml-auto rounded-full bg-neutral-0 size-20 grid="~ place-content-center">
              <div i-nimiq:check text="10 neutral" mb--2 />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
