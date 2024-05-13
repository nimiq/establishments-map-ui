<script setup lang="ts">
import { Currency } from 'types'

const selected = defineModel<Currency[]>('selected')
const options = Object.values(Currency).filter(c => c !== Currency.BINANCE_PAY)
</script>

<template>
  <MultiSelector v-model:selected="selected" :options multiple>
    <template #option="{ option }">
      <div :class="getCurrencyIcon(option)" text-18 />
      <span>{{ translateCurrency(option) }}</span>
    </template>
  </MultiSelector>
  <TagsInputRoot :model-value="selected" delimiter="" flex="~ gap-8 items-center wrap" mb-8 mt-6 min-h-26 rounded-8>
    <TagsInputItem v-for="item in selected" :key="item" :value="item" flex="~ gap-x-6 items-center"
      class="has-[button:hover]:bg-red/15 has-[button:hover]:text-red-1100" w-max rounded-2 bg-neutral-200 py-4 pl-8
      pr-4 text-12 font-bold transition-colors>
      <TagsInputItemText>{{ translateCurrency(item) }}</TagsInputItemText>
      <TagsInputItemDelete p-4>
        <div i-nimiq:cross text-8 />
      </TagsInputItemDelete>
    </TagsInputItem>
  </TagsInputRoot>
</template>
