<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import EstablishmentCard from "@/components/elements/EstablishmentCard.vue"
import NoEstablishments from "@/components/illustrations/no-establishments.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { useEstablishments } from "@/stores/establishments"
import { storeToRefs } from "pinia"
import { computed, nextTick, ref, watch } from "vue"
// import { RecycleScroller } from 'vue-virtual-scroller' TODO

const { xlScreen } = useBreakpoints()

const appStore = useApp()
const { listIsShown } = storeToRefs(appStore)

const establishmentsStore = useEstablishments()
const { establishmentsInView, nearEstablishmentsNotInView, shouldShowNearby } = storeToRefs(establishmentsStore)

const listIsEmpty = computed(() => establishmentsInView.value.length === 0)

const items = computed(() => {
	const items = establishmentsInView.value.concat(shouldShowNearby ? nearEstablishmentsNotInView.value : [])
	return items.map((item) => {
		const isAtm = item.hasAllInfo && item.providers.some((p) => p.sell.length > 0)
		const type = isAtm ? "atm" : "default"
		// const size = sizes[type]
		return { ...item, type }
	})
})

const { getEstablishmentByUuid } = useApi()
const scroller$ = ref<HTMLUListElement>()

// create observer. every time a new item inside scroller is in the viewport, we need to load its information by getEstablishmentByUuid
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const uuid = entry.target.getAttribute("data-uuid")
			if (uuid) {
				getEstablishmentByUuid(uuid)
			}
		}
	})
})

watch([listIsShown, listIsEmpty], async () => {
	await nextTick()
	if (!scroller$.value) return
	scroller$.value.querySelectorAll("[data-uuid]").forEach((item) => {
		observer.observe(item)
	})
})
</script>

<template>
	<div
		class="bg-white max-xl:absolute max-xl:transition-all xl:transition-transform-width max-xl:bottom-0 max-xl:bg-white max-xl:shadow max-xl:w-screen max-xl:overflow-y-auto"
		:class="{
			'h-full xl:h-[calc(100%-112px)]': !listIsEmpty,
		}">
		<div v-if="!listIsEmpty" :class="{ 'xl:!overflow-hidden': !listIsShown }"
			class="relative gap-6 p-6 space-y-6 bg-space/[0.04] xl:flex xl:flex-col xl:w-96 columns-2xs scroll-py-6 xl:overflow-y-auto scroll-space z-2 max-xl:pb-16 xl:h-full">
			<!-- <RecycleScroller :items="items" class="h-full" key-field="uuid" list-tag="ul" item-tag="li" emit-update
				@update="updateList">
				<template v-slot="{ item: establishment }">
					<EstablishmentCard :establishment="establishment" />
				</template>
			</RecycleScroller> -->
			<ul class="space-y-5" ref="scroller$">
				<li v-for="item in items" :key="item.uuid">
					<EstablishmentCard :establishment="item" :data-uuid="item.uuid" />
				</li>
			</ul>

			<Button bgColor="grey" class="!mt-9" size="md" @click="establishmentsStore.showNearby"
				v-if="!shouldShowNearby && nearEstablishmentsNotInView.length > 0">
				<template #icon>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-3 h-3 text-space">
						<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M1 8h14M8 1v14" />
					</svg>
				</template>

				<template #label>
					{{ $t("Show_more_establishments") }}
				</template>
			</Button>

		</div>

		<div v-else
			class="grid items-center w-screen gap-6 p-6 bg-white place-content-center xl:w-96 max-xl:py-20 xl:shadow xl:h-main">
			<NoEstablishments class="w-20 text-space justify-self-center" />
			<p class="text-base text-center text-space xl:text-xl">{{ $t('Oops_no_businesses_around_here') }}</p>
		</div>

		<transition enter-active-class="duration-200 ease-out" enter-from-class="translate-y-12 opacity-0"
			enter-to-class="translate-y-0 opacity-100" leave-active-class="duration-100 ease-in"
			leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-12 opacity-0">
			<div v-if="!xlScreen && listIsShown" class="fixed z-10 flex justify-center w-full bottom-5">
				<Button bg-color="ocean" class="shadow" @click="appStore.hideList">
					<template #label>{{ $t('Back_to_the_Map') }}</template>
				</Button>
			</div>
		</transition>
	</div>
</template>
