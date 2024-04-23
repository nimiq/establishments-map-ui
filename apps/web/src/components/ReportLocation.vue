<script setup lang="ts">
import { Issue, Location } from 'types'
import { translateIssue } from '@/translations'
defineProps<{ location: Location }>()
const description = ref('')
const issue = ref<Issue>()
</script>

<template>
  <Modal name="report">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template #title>
      <div flex="~ gap-8 items-baseline" ml--6>
        <div rounded-6 size-28 grid="~ place-content-center" bg-red-400 aria-hidden>
          <div i-nimiq:flag text-red text-14 />
        </div>
        {{ $t('Report an issue') }}
      </div>
    </template>
    <template #description>
      <p>{{ $t('Tell us what\'s wrong with this location') }}</p>
    </template>
    <template #content>
      <div flex="~" mt-32 mb-14>
        <img v-if="location.photo" :src="location.photo" max-w-128 rounded-4 object-cover mr-24 min-w-32 />
        <div h-max flex="~ col">
          <BasicInfoLocation :location />
          <ul v-if="location.accepts.length > 0" flex="~ items-center gap-x-8" bg-neutral-0 rounded-full
            ring-neutral-100 mt-16>
            <li v-for="c in location.accepts " :key="c" text-24 :class="getCurrencyIcon(c)" :title="c" />
          </ul>
        </div>
        <LocationExternalUrl :location ml-auto />
      </div>
      <FAQ nested>
        <template #trigger>
          <div flex="~ gap-4 items-center" text="neutral-800 14" hocus:bg-neutral-200 transition-colors mx--6 px-6 py-2
            rounded-4>
            <div i-nimiq:help op-80 text-12 relative top--1 />
            <p>{{ $t('Where is the data coming from?') }}</p>
          </div>
        </template>
      </FAQ>

      <form action="" mt-40>
        <label for="name" text="14 neutral-900" font-200 mb-4 block>{{ $t('Select issue') }}</label>
        <Select :options="Object.values(Issue)" :option-to-text="translateIssue" v-model:selected="issue" />

        <label for="name" text="14 neutral-900" font-200 mb-4 block mt-24>{{ $t('Describe the issue') }}</label>
        <textarea :placeholder="$t('Write your problem here')" input-box text="14 neutral" resize-none min-h-64
          v-model="description" style="field-sizing: content" />

        <div flex="~ gap-16 justify-end" mt-24>
          <DialogClose :aria-label="$t('Cancel')" pill-tertiary pill-sm>Cancel</DialogClose>
          <button type="submit" :disabled="!description || !issue" pill-blue pill-sm>{{ $t('Report Location')
            }}</button>
        </div>
      </form>
    </template>
  </Modal>
</template>
