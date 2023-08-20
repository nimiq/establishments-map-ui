<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import TextAreaInput from '@/components/atoms/TextAreaInput.vue'
import FormContainer from '@/components/forms/FormContainer.vue'
import { useLocations } from '@/stores/locations'
import { translateIssue } from '@/translations'
import type { Location } from '@/types'
import { Issue } from '@/types'

const { getLocationByUuid } = useLocations()

const selectedIssue = ref<Issue>()
const issueDescription = ref<string>('')
const disabled = computed(() => !selectedIssue.value || !issueDescription.value)

const route = useRoute()
const uuid = computed(() => route.params.uuid as string)
const location = ref<Location>()

onMounted(async () => {
  location.value = await getLocationByUuid(uuid.value)
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
      <span v-if="location?.category">&nbsp;&nbsp;·&nbsp;&nbsp;{{ location.category_label }}</span>
    </template>

    <template #form>
      <Select
        v-model:selected-single="selectedIssue" :multiple="false" :label="$t('Select issue')"
        :options="Object.values(Issue)" :placeholder="$t('Select issue')" replace-placeholder
      >
        <template #option="{ option: issue }">
          {{ translateIssue(issue) }}
        </template>
        <template #selected="{ option: issue }">
          {{ translateIssue(issue) }}
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
