<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import ArrowLinkIcon from "@/components/icons/icon-arrow-link.vue"
import ArrowLeftIcon from "@/components/icons/icon-arrow-left.vue"
import { useCaptcha } from "@/composables/useCaptcha"
import { computed, onMounted, onUnmounted, ref, useSlots } from "vue"

const props = defineProps({
	disabled: {
		type: Boolean,
		default: false,
	},
	onSubmit: {
		type: Function,
		required: true,
	},
})

const { getToken, loadRecaptcha, removeRecaptcha } = useCaptcha()

enum FormState {
	Initial = "initial",
	Loading = "loading",
	Success = "success",
	Error = "error",
}

const state = ref<FormState>(FormState.Initial)
const disabled = computed(
	() => [FormState.Loading, FormState.Success].includes(state.value) || props.disabled
)

onMounted(() => {
	loadRecaptcha()
})

onUnmounted(() => {
	removeRecaptcha()
})

async function onSubmit() {
	if (disabled.value) return

	state.value = FormState.Loading
	const token = await getToken()
	props
		.onSubmit(token)
		.then(() => (state.value = FormState.Success))
		.catch(() => (state.value = FormState.Error))
}

const slots = useSlots()
const hasSlot = (name: string) => {
	return !!slots[name]
}
</script>

<template>
	<header
		class="p-6 shadow-[0px_7px_8.5px_rgba(31,_35,_72,_0.04),_0px_2px_2.5px_rgba(31,_35,_72,_0.02)] flex gap-x-4 items-center">
		<img src="@/assets/logo.svg" alt="Crypto Map logo" class="h-6" />
		<Button href="/" bg-color="grey">
			<template #icon>
				<ArrowLeftIcon class="" />
			</template>
			<template #label>
				{{ $t('Back_to_the_Map') }}
			</template>
		</Button>
	</header>
	<div
		class="flex flex-col h-full justify-center md:text-center w-[clamp(284px,768px,calc(100vw-3rem))] mx-auto min-h-[calc(100vh-80px)] max-md:justify-start py-8 md:py-24">
		<transition mode="out-in" enter-active-class="transition duration-500 ease-out lg:duration-100" :enter-from-class="`opacity-0 ${state === FormState.Initial ? '-translate-x-12' : 'translate-x-12'
			}`" enter-to-class="translate-x-0 opacity-100" leave-active-class="transition duration-300 ease-in"
			leave-from-class="translate-x-0 opacity-100" :leave-to-class="`opacity-0 ${state === FormState.Initial ? 'translate-x-12' : '-translate-x-12'
				}`">
			<main v-if="[FormState.Initial, FormState.Loading].includes(state)">
				<h1 class="font-bold text-4xl lg:text-5xl text-space leading-[1.2]" v-if="hasSlot('title')">
					<slot name="title" />
				</h1>
				<p class="mt-6 font-semibold text-space/60 lg:mt-8" v-if="hasSlot('description')">
					<slot name="description" />
				</p>

				<div class="text-sky font-bold text-sm group flex justify-center items-center gap-x-1.5 mt-4"
					v-if="hasSlot('link')">
					<slot name="link" />
					<ArrowLinkIcon class="w-2.5 h-2.5 group-hover:left-0.5 group-hover:-top-0.5 transition-all duration-300" />
				</div>

				<form class="text-left mt-14 lg:mt-16" @submit.prevent="onSubmit" v-if="hasSlot('form')">
					<slot name="form" />

					<Button bgColor="ocean" type="submit" class="mx-auto mt-10" size="lg" :loading="state === FormState.Loading"
						:disabled="disabled">
						<template #label>
							<slot name="button-label">{{ $t('Send') }}</slot>
						</template>
					</Button>
				</form>
			</main>

			<main v-else-if="state === FormState.Success">
				<h1 class="font-bold text-4xl lg:text-5xl text-space leading-[1.2]" v-if="hasSlot('success-title')">
					<slot name="success-title" />
				</h1>
				<p class="mt-6 font-semibold text-space/60 lg:mt-8" v-if="hasSlot('success-description')">
					<slot name="success-description" />
				</p>
				<Button bgColor="ocean" class="mx-auto mt-10" size="lg" href="/" v-if="hasSlot('success-button-label')">
					<template #label>
						<slot name="success-button-label">{{ $t('Back_to_the_Map') }}</slot>
					</template>
				</Button>
			</main>

			<main v-else-if="state === FormState.Error">
				<h1 class="font-bold text-4xl lg:text-5xl text-space leading-[1.2]" v-if="hasSlot('error-title')">
					<slot name="error-title" />
				</h1>
				<p class="mt-6 font-semibold text-space/60 lg:mt-8" v-if="hasSlot('error-description')">
					<slot name="error-description" />
				</p>
				<Button bgColor="ocean" class="mx-auto mt-10" size="lg" @click="state = FormState.Initial"
					v-if="hasSlot('error-button-label')">
					<template #label>
						<slot name="error-button-label">{{ $t('Try_again') }}</slot>
					</template>
				</Button>
			</main>
		</transition>
	</div>
</template>
