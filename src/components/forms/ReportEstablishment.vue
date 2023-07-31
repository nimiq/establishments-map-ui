<script setup lang="ts">
import Select, { type SelectOption } from "@/components/atoms/Select.vue"
import TextAreaInput from "@/components/atoms/TextAreaInput.vue"
import FormContainer from "@/components/forms/FormContainer.vue"
import type { Location } from "@/database"
import { useApi } from "@/stores/api"
import { useLocations } from "@/stores/locations"
import { storeToRefs } from "pinia"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"

const apiStore = useApi();

const issueCategories = [
	{ issue: 'location_gone' }, { issue: 'missing_currency' }, { issue: 'missing_not_accepted' }, { issue: 'no_crypto' }, { issue: 'other' }
]

const locationsStore = useLocations()
const { Locations } = storeToRefs(locationsStore)

const selectedIssue = ref<SelectOption>()
const issueDescription = ref<string>("")
const disabled = computed(() => !selectedIssue.value || !issueDescription.value)

const route = useRoute()
const uuid = computed(() => route.params.uuid as string)
const location = computed(() => Locations.value.get(uuid.value) as Location | undefined)

onMounted(async () => {
	if (Locations.value.has(uuid.value)) {
		await apiStore.getLocationByUuid(uuid.value)
	}
})

async function onSubmit(captcha: string) {
	if (!selectedIssue.value) return
	const body = {
		captcha,
		dev: import.meta.env.DEV,
		reason: issueDescription.value,
		reason_id: selectedIssue.value.issue,
		uuid: uuid.value
	}
	const url = import.meta.env.VITE_SLACK_REPORT_URL
	return await fetch(url, {
		body: JSON.stringify(body),
		method: "POST",
	})
}
</script>

<template>
	<FormContainer :disabled="disabled" :on-submit="onSubmit">
		<template #title>{{ $t('Report an issue with a location') }}</template>
		<template #description v-if="location">
			<RouterLink class="text-sky" :to="`/location/${location?.uuid}`">{{ location?.name }}</RouterLink>
			<span v-if="location?.address">, {{ location?.address }}</span>
			<!-- Note: the translations for categories are defined in api-constants-*.json -->
			<span v-if="location?.category">&nbsp;&nbsp;·&nbsp;&nbsp;{{ $t(location?.category) }}</span>
		</template>

		<template #form>
			<Select :multiple="false" :label="$t('Select issue')" :options="issueCategories"
				v-model:selected-single="selectedIssue" :placeholder="$t('Select issue')" replace-placeholder>
				<!-- Note: the translations for issues are defined in api-constants-*.json -->
				<template #option="{ issue }">{{ $t(issue) }}</template>
				<template #selected="{ issue }">{{ $t(issue) }}</template>
			</Select>

			<TextAreaInput :placeholder="$t('Write your problem here')" class="mt-6" :label="$t('Describe the issue')"
				v-model="issueDescription" />
		</template>
		<template #button-label>{{ $t('Report Location') }}</template>

		<!-- Success -->
		<template #success-title>{{ $t('Thank you for reporting this issue') }}</template>
		<template #success-description>{{ $t('This may take a few days to process. Keep an eye out for changes to the location in the Crypto Map.') }}</template>
		<template #success-button-label>{{ $t('Back to the Map') }}</template>

		<!-- Error -->
		<template #error-title>{{ $t('Something went wrong') }}</template>
		<template #error-description>{{ $t('There has been a problem on our side.') }}</template>
		<template #error-button-label>{{ $t('Try again') }}</template>
	</FormContainer>
</template>
