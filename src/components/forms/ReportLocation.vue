<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { SelectOption } from '../atoms/Select.vue'
import TextAreaInput from '@/components/atoms/TextAreaInput.vue'
import FormContainer from '@/components/forms/FormContainer.vue'
import { i18n } from '@/i18n/i18n-setup'
import { useLocations } from '@/stores/locations'
import type { Location } from '@/database'

enum IssueCategory {
  LOCATION_GONE = 'location_gone',
  MISSING_CURRENCY = 'missing_currency',
  MISSING_NOT_ACCEPTED = 'missing_not_accepted',
  NO_CRYPTO = 'no_crypto',
  OTHER = 'other',
}

function translateIssueCategory(issueCategory: string) {
  switch (issueCategory as IssueCategory) {
    case IssueCategory.LOCATION_GONE: return i18n.t('Location gone')
    case IssueCategory.MISSING_CURRENCY: return i18n.t('Currency missing')
    case IssueCategory.MISSING_NOT_ACCEPTED: return i18n.t('Currency not accepted')
    case IssueCategory.NO_CRYPTO: return i18n.t('No crypto')
    case IssueCategory.OTHER:
    default:
      return i18n.t('Other')
  }
}

const locationsStore = useLocations()
const { locations } = storeToRefs(locationsStore)

const selectedIssue = ref<SelectOption>()
const issueDescription = ref<string>('')
const disabled = computed(() => !selectedIssue.value || !issueDescription.value)

const route = useRoute()
const uuid = computed(() => route.params.uuid as string)
const location = computed(() => locations.value.get(uuid.value) as Location | undefined)

onMounted(async () => {
  if (locations.value.has(uuid.value))
    await locationsStore.getLocationByUuid(uuid.value)
})

async function onSubmit(captcha: string) {
  if (!selectedIssue.value)
    return
  const body = {
    captcha,
    dev: import.meta.env.DEV,
    reason: issueDescription.value,
    reason_id: selectedIssue.value,
    uuid: uuid.value,
  }
  const url = import.meta.env.VITE_SLACK_REPORT_URL
  return await fetch(url, {
    body: JSON.stringify(body),
    method: 'POST',
  })
}
</script>

<template>
  <FormContainer :disabled="disabled" :on-submit="onSubmit">
    <template #title>
      {{ $t('Report an issue with a location') }}
    </template>
    <template v-if="location" #description>
      <RouterLink class="text-sky" :to="`/location/${location?.uuid}`">
        {{ location?.name }}
      </RouterLink>
      <span v-if="location?.address">, {{ location.address }}</span>
      <span v-if="location?.category">&nbsp;&nbsp;·&nbsp;&nbsp;{{ translateLocationCategory(location.category) }}</span>
    </template>

    <template #form>
      <Select
        v-model:selected-single="selectedIssue" :multiple="false" :label="$t('Select issue')"
        :options="Object.values(IssueCategory)" :placeholder="$t('Select issue')" replace-placeholder
      >
        <template #option="{ option: issue }">
          {{ translateIssueCategory(issue) }}
        </template>
        <template #selected="{ option: issue }">
          {{ translateIssueCategory(issue) }}
        </template>
      </Select>

      <TextAreaInput
        v-model="issueDescription" :placeholder="$t('Write your problem here')" class="mt-6"
        :label="$t('Describe the issue')"
      />
    </template>
    <template #button-label>
      {{ $t('Report Location') }}
    </template>

    <!-- Success -->
    <template #success-title>
      {{ $t('Thank you for reporting this issue') }}
    </template>
    <template #success-description>
      {{ $t('This may take a few days to process. Keep an eye out for changes to the location in the Crypto Map.') }}
    </template>
    <template #success-button-label>
      {{ $t('Back to the Map') }}
    </template>

    <!-- Error -->
    <template #error-title>
      {{ $t('Something went wrong') }}
    </template>
    <template #error-description>
      {{ $t('There has been a problem on our side.') }}
    </template>
    <template #error-button-label>
      {{ $t('Try again') }}
    </template>
  </FormContainer>
</template>
