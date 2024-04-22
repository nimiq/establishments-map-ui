<script setup lang="ts">
import { Location } from 'types';
defineProps<{ location: Location }>()
</script>

<template>
  <Modal>
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template #title>
      <div flex="~ gap-8 items-baseline" ml--6>
        <div rounded-6 size-28 grid="~ place-content-center" bg-red-400>
          <div i-nimiq:flag text-red text-14 />
        </div>
        {{ $t('Report an issue') }}
      </div>
    </template>
    <template #content>
      <div flex="~ gap-24" mt-32>
        <img v-if="location.photo" :src="location.photo" max-w-128 rounded-4 />
        <div h-96 flex="~ col">
          <BasicInfoLocation :location />
          <ul v-if="location.accepts.length > 0" flex="~ items-center gap-x-8" bg-neutral-0 rounded-full
            ring-neutral-100 mt-auto>
            <li v-for="c in location.accepts " :key="c">
              <div text-24 :class="getCurrencyIcon(c)" :title="c" />
            </li>
          </ul>
        </div>
      </div>
      <div>
        <NestedModal>
          <template #trigger>
            <div flex="~ gap-4 items-center" text="neutral-800 14" mt-16>
              <div i-nimiq:help op-80 text-12 />
              <p>
                {{ $t('Where is the data coming from?') }}
              </p>
            </div>
          </template>
          <template #title>
            {{ $t('FAQ') }}
          </template>
          <template #content>
            <FAQ />
          </template>
        </NestedModal>
      </div>

      <hr mx-auto max-w-128 border-neutral-500 my-24>

      <form action="">
        <label for="name" text="14 neutral-900" font-200 mb-4 block>{{ $t('Find Location') }}</label>
        <LocationSearchBox />

        <label for="name" text="14 neutral-900" font-200 mb-4 block mt-24>{{ $t('Describe the issue') }}</label>
        <textarea :placeholder="$t('Write your problem here')" input-text rounded-4 text-neutral w-full resize-none max-h-128 style="field-sizing: content" />

        <div flex="~ gap-16 justify-end" mt-32>
          <DialogClose :aria-label="$t('Cancel')" pill-tertiary pill-sm>Cancel</DialogClose>
          <button type="submit" disabled pill-blue pill-sm>{{ $t('Report Location') }}</button>
        </div>
      </form>
    </template>
  </Modal>
</template>

