<script setup lang="ts">
import Select, { type SelectOption } from "@/components/elements/Select.vue"
import TextAreaInput from "@/components/elements/TextAreaInput.vue"
import FormContainer from "@/components/forms/FormContainer.vue"
import { useApi } from "@/stores/api"
import { useEstablishments, type Establishment } from "@/stores/establishments"
import { storeToRefs } from "pinia"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"

const apiStore = useApi()
const { categoriesIssue } = storeToRefs(apiStore)

const establishmentsStore = useEstablishments()
const { establishments } = storeToRefs(establishmentsStore)

const selectedIssue = ref<SelectOption>()
const issueDescription = ref<string>("")

const route = useRoute()

const disabled = computed(() => !selectedIssue.value || !issueDescription.value)

const uuid = computed(() => route.params.uuid as string)

const establishment = computed(() => establishments.value.get(uuid.value) as Establishment | undefined)

onMounted(async () => {
	await apiStore.fetchIssueCategories()

	if (establishments.value.has(uuid.value)) {
		await apiStore.getEstablishmentByUuid(uuid.value)
	}
})

async function onSubmit(token: string) {
	if (!selectedIssue.value?.id || !establishment.value) return
	return await apiStore.reportEstablishment({
		token,
		issueCategoryId: selectedIssue.value.id as number,
		establishmentUuid: establishment.value.uuid as string,
		description: issueDescription.value,
	})
}
</script>

<template>
	<FormContainer :disabled="disabled" :on-submit="onSubmit">
		<template #title>{{ $t("Report_an_issue_with_an_establishment") }}</template>
		<template #description v-if="establishment">
			<RouterLink class="text-sky" :to="`/establishment/${establishment?.uuid}`">{{ establishment?.name }}</RouterLink>
			<span v-if="establishment?.address">, {{ establishment?.address }}</span>
			<span v-if="establishment?.category">&nbsp;&nbsp;·&nbsp;&nbsp;{{ $t(establishment?.category) }}</span>
		</template>

		<template #form>
			<Select :label="$t('Select_issue')" :options="categoriesIssue.map(({ id, label }) => ({ id, label: $t(label) }))"
				v-model:selected-single="selectedIssue" :multiple="false" :placeholder="$t('Select_issue')" replace-placeholder />

			<TextAreaInput :placeholder="$t('Write_your_problem_here')" class="mt-6" :label="$t('Describe_the_issue')"
				v-model="issueDescription" />
		</template>
		<template #button-label>{{ $t('Report_Establishment') }}</template>

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
