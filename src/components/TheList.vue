<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import EstablishmentCard from "@/components/elements/EstablishmentCard.vue"
import NoEstablishments from "@/components/illustrations/no-establishments.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApp } from "@/stores/app"
import { useEstablishments } from "@/stores/establishments"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

const { smallScreen, xlScreen } = useBreakpoints()

const scroller$ = ref<HTMLDivElement>()

const appStore = useApp()
const { listIsShown, selectedEstablishmentUuid } = storeToRefs(appStore)

const establishmentsStore = useEstablishments()
const { establishmentsInView, nearEstablishmentsNotInView, shouldShowNearby } = storeToRefs(establishmentsStore)

const listIsEmpty = computed(() => establishmentsInView.value.length === 0)

watch(selectedEstablishmentUuid, (id) => {
	if (!id || !scroller$.value) return
	const item = scroller$.value.querySelector(`[data-establishment-id="${id}"]`)
	const index = item ? Array.from(scroller$.value.children).indexOf(item) : 0
	slideTo(index, listIsShown.value ? "smooth" : "auto")
})

function slideTo(index: number, behavior: "smooth" | "auto" = "smooth") {
	if (!scroller$.value) return
	if (!listIsShown) appStore.showList()
	listIsShown.value = true
	const li = scroller$.value.children[index] as HTMLLIElement
	li.scrollIntoView({ inline: "center", block: "center", behavior })
}
</script>

<template>
	<div
		class="max-xl:absolute max-xl:transition-all xl:transition-transform-width max-xl:bottom-0 max-xl:bg-white max-xl:shadow max-xl:w-screen max-xl:overflow-y-auto"
		:class="{
			'h-full lg:h-[calc(100vh-80px)]': !listIsEmpty,
		}">
		<div v-if="!listIsEmpty" id="list"
			class="relative gap-6 p-6 space-y-6 bg-white xl:flex xl:flex-col xl:w-96 columns-2xs scroll-py-6 xl:overflow-y-auto scroll-space z-2 max-xl:pb-16">
			<ul ref="scroller$" class="space-y-6">
				<li v-for="establishment in establishmentsInView" :key="establishment.uuid"
					class="list-item-wrap shadow-lg border pt-1.5 pb-6 rounded-lg flex flex-col break-inside-avoid-column transition-[box-shadow]"
					:class="{ 'ring ring-ocean': establishment.uuid === selectedEstablishmentUuid }"
					:data-establishment-id="establishment.uuid">
					<EstablishmentCard :establishment="establishment" />
				</li>

				<template v-if="shouldShowNearby">
					<li v-for="establishment in nearEstablishmentsNotInView" :key="establishment.uuid"
						class="list-item-wrap shadow-lg border pt-1.5 pb-6 rounded-lg flex flex-col break-inside-avoid-column transition-[box-shadow]"
						:class="{ 'ring ring-ocean': establishment.uuid === selectedEstablishmentUuid }"
						:data-establishment-id="establishment.uuid">
						<EstablishmentCard :establishment="establishment" />
					</li>
				</template>
			</ul>

			<Button bgColor="grey" class="!mt-9" size="md" @click="establishmentsStore.showNearby"
				v-if="!shouldShowNearby && nearEstablishmentsNotInView.length > 0">
				<template #icon>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-3 h-3 text-space">
						<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M1 8h14M8 1v14" />
					</svg>
				</template>

				<template #text>
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
					<template #text>{{ $t('Back_to_the_Map') }}</template>
				</Button>
			</div>
		</transition>
	</div>
</template>
