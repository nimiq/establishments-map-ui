<script setup lang="ts">
import type { Issue } from '#imports'
import { ModalName } from './Modal.vue'

defineProps<{ location: MapLocation }>()

const description = ref('')
const issue = ref<Issue>()
const { selectedUuid } = storeToRefs(useLocations())

const open = ref(false)

const body = computed(() => ({
  uuid: selectedUuid.value,
  reason: description.value,
  reason_id: issue.value,
  dev: import.meta.dev,
}))
const url = new URL(useRuntimeConfig().public.slackReportUrl)
const disabled = computed(() => !description.value || !issue.value)
const { submit, reset, isError, isSuccess, isSubmitted } = useForm({ url, body })
</script>

<template>
  <Modal v-model:open="open" :name="ModalName.Report">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template #title>
      <div flex="~ gap-8 items-baseline justify-center" ml--6>
        <template v-if="isSuccess">
          <!-- {{ $t(Thank you for reporting this issue) }} -->
          Thank you for reporting this issue
        </template>
        <template v-else-if="isError">
          <!-- {{ $t(Something went wrong) }} -->
          Something went wrong
        </template>
        <template v-else>
          <!-- {{ $t(Report an issue) }} -->
          Report an issue
        </template>
      </div>
    </template>
    <template #description>
      <template v-if="isSuccess">
        <!-- {{ $t(This may take a few days to process. Keep an eye out for changes to the location in the Crypto Map.) }} -->
        This may take a few days to process. Keep an eye out for changes to the location in the Crypto Map.
      </template>
      <template v-else-if="isError">
        <!-- {{ $t(There has been a problem on our side. Please try again.) }} -->
        There has been a problem on our side. Please try again.
      </template>
      <template v-else>
        <!-- {{ $t(Tell us what\'s wrong with this location) }} -->
        Tell us what\'s wrong with this location
      </template>
    </template>
    <template #content>
      <template v-if="!isSubmitted">
        <div flex="~ gap-8 items-center justify-center" relative mb-24 w-full>
          <LocationExternalUrl :location show-name flex-basis-auto />
          <CryptoList :location pill flex-1 nq-pill-tertiary :max="2" />
        </div>
        <FAQ nested :questions="['q-1']" w-full>
          <template #trigger>
            <div
              flex="~ gap-4 items-center justify-center" text="neutral-800 14" mx--6 rounded-4 px-6 py-2
              transition-colors hocus:bg-neutral-200
            >
              <div i-nimiq:help relative top--1 text="14 center" op-80 />
              <!-- <p>{{ $t('How is this data collected?') }}</p> -->
              <p>How is this data collected?</p>
            </div>
          </template>
        </FAQ>

        <form mt-40 @submit.prevent="submit">
          <label for="name" text="14 neutral-900" mb-4 block font-200>
            <!-- {{ $t('Select issue') }} -->
            Select issue
          </label>
          <Select v-model:selected="issue" :options="Object.values(Issue)" :display-value="translateIssue" />

          <label for="name" text="14 neutral-900" mb-4 mt-24 block font-200>
            <!-- {{ $t('Describe the issue') }} -->
            Describe the issue
          </label>
          <!-- :placeholder="$t('Write your problem here')" -->
          <textarea
            v-model="description" placeholder="Write your problem here" text="14 neutral"
            resize-none nq-input-box
          />

          <div flex="~ gap-16 justify-end" mt-24>
            <!-- :aria-label="$t('Cancel')" -->
            <DialogClose aria-label="Cancel" nq-pill-sm nq-pill-tertiary>
              Cancel
            </DialogClose>
            <button type="submit" :disabled="disabled" nq-pill-sm nq-pill-blue>
              <!-- {{ $t('Report Location') }} -->
              Report Location
            </button>
          </div>
        </form>
      </template>
      <button v-else nq-pill-sm mt-32 nq-pill-blue @click="isError ? reset() : (open = false)">
        <!-- {{ isError ? $t('Try again') : $t('Back to the Map') }} -->
        {{ isError ? 'Try again' : 'Back to the Map' }}
      </button>
    </template>
  </Modal>
</template>
