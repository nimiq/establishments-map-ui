<script setup lang="ts">
import { Currency } from 'types';
import { translateCurrency } from '@/translations'
type Option = { value: Currency, label: string }
const selected = ref<Option[]>([])
const options = Object.values(Currency).map((value) => ({ value, label: translateCurrency(value) } satisfies Option))
</script>

<template>
  <NestedModal pill-blue pill-sm>
    <template #trigger>
      {{ $t('Add Crypto location') }}
    </template>
    <template #title>
      {{ $t('Add a location to the Crypto Map') }}
    </template>
    <template #description>
      {{ $t('You can add any location that has a Google Business Profile.') }}
    </template>
    <template #content>
      <div mt-8 flex="~ col">
        <a href="https://www.google.com/business/" target="_blank" rel="noopener noreferrer" arrow text-blue w-max
          font-semibold>
          {{ $t('Create Google Business profile') }}
        </a>

        <form action="" mt-32>
          <label for="name" text="14 neutral-900" font-200 mb-4 block>{{ $t('Find Location') }}</label>
          <LocationSearchBox />

          <label for="name" text="14 neutral-900" font-200 mb-4 block mt-24>{{ $t('Select Cryptocurrency') }}</label>
          <MultiSelector v-model:selected="cryptos" :options multiple>
            <template #option="{ option }">
              <div :class="getCurrencyIcon(option.value)" text-18 />
              <span>{{ option.label }}</span>
            </template>
          </MultiSelector>
          <TagsInputRoot v-slot="{ modelValue: tags }" :model-value="selected" delimiter=""
            flex="~ gap-8 items-center wrap" mt-6 min-h-26 mb-8 rounded-8>
            <TagsInputItem v-for="item in tags" :key="item" :value="item" w-max bg-neutral-200 font-bold rounded-2 pl-8
              pr-4 py-4 text-12 flex="~ gap-x-6 items-center"
              class="has-[button:hover]:bg-red/15 has-[button:hover]:text-red-1100" transition-colors>
              <TagsInputItemText>{{ item.label }}</TagsInputItemText>
              <TagsInputItemDelete p-4>
                <div i-nimiq:cross text-8 />
              </TagsInputItemDelete>
            </TagsInputItem>
          </TagsInputRoot>
          <div flex="~ gap-16 justify-end">
            <DialogClose :aria-label="$t('Cancel')" pill-tertiary pill-sm>Cancel</DialogClose>
            <button type="submit" disabled pill-blue pill-sm>{{ $t('Submit Location') }}</button>
          </div>
        </form>
      </div>
    </template>
  </NestedModal>
</template>
