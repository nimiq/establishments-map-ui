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
		<template #title>{{ $t("Report_an_issue_with_an_location") }}</template>
		<template #description v-if="location">
			<RouterLink class="text-sky" :to="`/location/${location?.uuid}`">{{ location?.name }}</RouterLink>
			<span v-if="location?.address">, {{ location?.address }}</span>
			<span v-if="location?.category">&nbsp;&nbsp;·&nbsp;&nbsp;{{ $t(location?.category) }}</span>
		</template>

		<template #form>
			<Select :multiple="false" :label="$t('Select_issue')" :options="issueCategories"
				v-model:selected-single="selectedIssue" :placeholder="$t('Select_issue')" replace-placeholder>
				<template #option="{ issue }">
					<template v-if="issue === 'location_gone'">{{ $t('location_gone') }}</template>
					<template v-if="issue === 'missing_currency'">{{ $t('missing_currency') }}</template>
					<template v-if="issue === 'missing_not_accepted'">{{ $t('missing_not_accepted') }}</template>
					<template v-if="issue === 'no_crypto'">{{ $t('no_crypto') }}</template>
					<template v-if="issue === 'other'">{{ $t('other') }}</template>
				</template>
				<template #selected="{ issue }">
					<template v-if="issue === 'location_gone'">{{ $t('location_gone') }}</template>
					<template v-if="issue === 'missing_currency'">{{ $t('missing_currency') }}</template>
					<template v-if="issue === 'missing_not_accepted'">{{ $t('missing_not_accepted') }}</template>
					<template v-if="issue === 'no_crypto'">{{ $t('no_crypto') }}</template>
					<template v-if="issue === 'other'">{{ $t('other') }}</template>
				</template>
			</Select>

			<TextAreaInput :placeholder="$t('Write_your_problem_here')" class="mt-6" :label="$t('Describe_the_issue')"
				v-model="issueDescription" />
		</template>
		<template #button-label>{{ $t('Report_Location') }}</template>

		<!-- Success -->
		<template #success-title>{{ $t('Thank_you_for_reporting_this_issue') }}</template>
		<template #success-description>{{ $t('This_may_take_a_few_days_to_process') }}</template>
		<template #success-button-label>{{ $t('Back_to_the_Map') }}</template>

		<!-- Error -->
		<template #error-title>{{ $t('Something_went_wrong') }}</template>
		<template #error-description>{{ $t('There_has_been_a_problem_on_our_side') }}</template>
		<template #error-button-label>{{ $t('Try_again') }}</template>
	</FormContainer>
</template>
