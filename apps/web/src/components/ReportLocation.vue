<script setup lang="ts">
import { ModalName } from './Modal.vue';
import { Issue, Location } from 'types'
import { translateIssue } from '@/translations'
defineProps<{ location: Location }>()
const description = ref('')
const issue = ref<Issue>()
const { selectedUuid, } = storeToRefs(useLocations())

const open = ref(false)

const body = computed(() => ({
  uuid: selectedUuid,
  reason: description.value,
  reason_id: issue.value,
  dev: import.meta.env.DEV,
}))
const url = import.meta.env.VITE_SLACK_REPORT_URL
const { disabled, submit, reset, isError, isSuccess, isSubmitted } = useForm({ url, body })
</script>

<template>
  <Modal :name="ModalName.Report" v-model:open="open">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template #title>
      <div flex="~ gap-8 items-baseline" ml--6>
        <div rounded-6 size-28 shrink-0 grid="~ place-content-center" bg-red-400 aria-hidden>
          <div i-nimiq:flag text-red text-14 />
        </div>
        <template v-if="isSuccess">
          {{ $t('Thank you for reporting this issue') }}
        </template>
        <template v-else-if="isError">
          {{ $t('Something went wrong') }}
        </template>
        <template v-else>
          {{ $t('Report an issue') }}
        </template>
      </div>
    </template>
    <template #description>
      <template v-if="isSuccess">
        {{ $t('This may take a few days to process. Keep an eye out for changes to the location in the Crypto Map.') }}
      </template>
      <template v-else-if="isError">
        {{ $t('There has been a problem on our side. Please try again.') }}
      </template>
      <template v-else>
        {{ $t('Tell us what\'s wrong with this location') }}
      </template>

    </template>
    <template #content>
      <template v-if="!isSubmitted">
        <div grid="~ cols-[128px_auto_1fr] row-[auto_1fr] gap-x-16 gap-y-8 items-center" mt-32 mb-14 relative group>
          <img v-if="location.photo" :src="location.photo" size-full rounded-4 object-cover grid-row-span-2 />
          <BasicInfoLocation :location grid-col-span-2 />
          <LocationExternalUrl :location />
          <CryptoList :location />
        </div>
        <FAQ nested :questions="['q-1']">
          <template #trigger>
            <div flex="~ gap-4 items-center" text="neutral-800 14" hocus:bg-neutral-200 transition-colors mx--6 px-6
              py-2 rounded-4>
              <div i-nimiq:help op-80 text-12 relative top--1 />
              <p>{{ $t('How is this data collected?') }}</p>
            </div>
          </template>
        </FAQ>

        <form @submit.prevent="submit" mt-40>
          <label for="name" text="14 neutral-900" font-200 mb-4 block>{{ $t('Select issue') }}</label>
          <Select :options="Object.values(Issue)" :display-value="translateIssue" v-model:selected="issue" />

          <label for="name" text="14 neutral-900" font-200 mb-4 block mt-24>{{ $t('Describe the issue') }}</label>
          <textarea :placeholder="$t('Write your problem here')" input-box text="14 neutral" resize-none min-h-64
            v-model="description" style="field-sizing: content" />

          <div flex="~ gap-16 justify-end" mt-24>
            <DialogClose :aria-label="$t('Cancel')" pill-tertiary pill-sm>Cancel</DialogClose>
            <button type="submit" :disabled="disabled" pill-sm pill-blue>{{ $t('Report Location')
              }}</button>
          </div>
        </form>
      </template>
      <button v-else mt-32 pill-sm pill-blue @click="isError ? reset() : (open = false)">
        {{ isError ? $t('Try again') : $t('Back to the Map') }}
      </button>
    </template>
  </Modal>
</template>
