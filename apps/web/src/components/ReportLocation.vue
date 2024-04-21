<script setup lang="ts">
import { Location } from 'types';
defineProps<{ location: Location }>()
</script>

<template>
  <Modal>
    <slot name="trigger" />
    <template #title>
      {{ $t('Report an issue with {locationName}', { locationName: location.name }) }}
    </template>
    <template #description>
      <span v-if="location?.address">{{ location.address }}</span>
      <span v-if="location?.address && location?.category" mx-4>·</span>
      <span v-if="location?.category">{{ location.category_label }}</span>
    </template>
    <template #content>
      <div mt-8 flex="~ col">
        <form action="" mt-32>
          <label for="name" text="14 neutral-900" font-200 mb-4 block>{{ $t('Find Location') }}</label>
          <LocationSearchBox />

          <label for="name" text="14 neutral-900" font-200 mb-4 block mt-24>{{ $t('Select Cryptocurrency') }}</label>

          <div flex="~ gap-16 justify-end">
            <DialogClose :aria-label="$t('Cancel')" pill-tertiary pill-sm>Cancel</DialogClose>
            <button type="submit" disabled pill-blue pill-sm>{{ $t('Report Location') }}</button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>
