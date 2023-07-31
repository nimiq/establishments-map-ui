<script setup lang="ts">
import Button from "@/components/atoms/Button.vue"
import LocationCard from "@/components/atoms/LocationCard.vue"
import NoLocations from "@/components/illustrations/no-Locations.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApp } from "@/stores/app"
import { useLocations } from "@/stores/locations"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

const { xlScreen } = useBreakpoints()

const appStore = useApp()
const { listIsShown } = storeToRefs(appStore)

const locationsStore = useLocations()
const { LocationsInView } = storeToRefs(locationsStore)

const listIsEmpty = computed(() => LocationsInView.value.length === 0)

const scroller$ = ref<HTMLUListElement>()
</script>

<template>
	<div
		class="bg-white max-md:absolute max-md:transition-all md:transition-transform-width max-md:bottom-0 max-md:bg-white max-md:shadow max-md:w-screen max-md:overflow-y-auto"
		:class="{
			'h-full md:h-[calc(100%-112px)]': !listIsEmpty,
		}">
		<div v-if="!listIsEmpty" :class="{ 'md:!overflow-y-hidden': !listIsShown }"
			class="relative gap-6 p-6 space-y-6 bg-space/[0.04] md:flex md:flex-col md:w-[322px] columns-2xs scroll-py-6 md:overflow-y-auto scroll-space z-2 max-md:pb-16 md:h-full">
			<!-- <RecycleScroller :items="items" class="h-full" key-field="uuid" list-tag="ul" item-tag="li" emit-update
				@update="updateList">
				<template v-slot="{ item: location }">
					<LocationCard :location="location" />
				</template>
			</RecycleScroller> -->
			<ul class="space-y-5" ref="scroller$">
				<li v-for="item in LocationsInView" :key="item.uuid">
					<LocationCard :location="item" :data-uuid="item.uuid" />
				</li>
			</ul>

			<!-- <Button bgColor="grey" class="!mt-9" size="md" @click="locationsStore.showNearby"
				v-if="!shouldShowNearby && nearLocationsNotInView.length > 0">
				<template #icon>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-3 h-3 text-space">
						<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M1 8h14M8 1v14" />
					</svg>
				</template>

				<template #label>
					{{ $t('Show more Locations') }}
				</template>
			</Button> -->

		</div>

		<div v-else
			class="grid items-center w-screen gap-6 p-6 bg-white place-content-center md:w-[322px] max-md:py-20 md:shadow md:h-main">
			<NoLocations class="w-20 text-space justify-self-center" />
			<p class="text-base text-center text-space md:text-xl">{{ $t('Oops, no Locations around here') }}</p>
		</div>

		<transition enter-active-class="duration-200 ease-out" enter-from-class="translate-y-12 opacity-0"
			enter-to-class="translate-y-0 opacity-100" leave-active-class="duration-100 ease-in"
			leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-12 opacity-0">
			<div v-if="!xlScreen && listIsShown" class="fixed z-10 flex justify-center w-full bottom-5">
				<Button bg-color="ocean" class="shadow" @click="appStore.hideList">
					<template #label>{{ $t('Back to the Map') }}</template>
				</Button>
			</div>
		</transition>
	</div>
</template>
