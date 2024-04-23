<script setup lang="ts">
import { translateCurrency } from '@/translations'
import { Currency } from 'types'
const selected = defineModel<Currency[]>('selected')
const options = Object.values(Currency)
</script>

<template>
  <MultiSelector v-model:selected="selected" :options multiple>
    <template #option="{ option }">
      <div :class="getCurrencyIcon(option)" text-18 />
      <span>{{ translateCurrency(option) }}</span>
    </template>
  </MultiSelector>
  <TagsInputRoot :model-value="selected" delimiter="" flex="~ gap-8 items-center wrap" mt-6 min-h-26 mb-8 rounded-8>
    <TagsInputItem v-for="item in selected" :key="item" :value="item" w-max bg-neutral-200 font-bold rounded-2 pl-8 pr-4
      py-4 text-12 flex="~ gap-x-6 items-center" class="has-[button:hover]:bg-red/15 has-[button:hover]:text-red-1100"
      transition-colors>
      <TagsInputItemText>{{ translateCurrency(item) }}</TagsInputItemText>
      <TagsInputItemDelete p-4>
        <div i-nimiq:cross text-8 />
      </TagsInputItemDelete>
    </TagsInputItem>
  </TagsInputRoot>
</template>
