<script setup lang="ts">
import Button from "@/components/atoms/Button.vue"
import GeolocationIcon from "@/components/icons/icon-geolocation.vue"
import MinusIcon from "@/components/icons/icon-minus.vue"
import PlusIcon from "@/components/icons/icon-plus.vue"
import TheMapInstance from "@/components/TheMapInstance.vue"
import type { Location } from "@/database"
import type { PropType } from "vue"

const props = defineProps({
	locations: {
		type: Array as PropType<Location[]>,
		required: true
	},
})
</script>

<template>
	<main class="h-full">
		<TheMapInstance :locations="props.locations">
			<template #button-calculate-position="{ navigateToUserLocation }">
				<Button @click="navigateToUserLocation" style="width: 34px; height: 34px" bgColor="white" size="sm"
					draggable="false" aria-label="Show your location" title="Show your location">
					<template #icon>
						<GeolocationIcon />
					</template>
				</Button>
			</template>

			<template #button-zoom-in="{ zoomIn }">
				<Button @click="zoomIn" style="width: 34px; height: 34px" class="rounded-b-0 p-[5px] pb-1" bgColor="white"
					size="sm" draggable="false" aria-label="Zoom in" title="Zoom in">
					<template #icon>
						<PlusIcon />
					</template>
				</Button>
			</template>

			<template #button-zoom-out="{ zoomOut }">
				<Button @click="zoomOut" style="width: 34px; height: 34px" class="rounded-t-0 p-[5px] pt-1" bgColor="white"
					size="sm" draggable="false" aria-label="Zoom out" title="Zoom out">
					<template #icon>
						<MinusIcon />
					</template>
				</Button>
			</template>
		</TheMapInstance>
		<Button class="absolute shadow bottom-5 md:bottom-6 right-5 md:right-6" bgColor="white" href="/location/add"
			size="md" text-color="ocean" draggable="false" :aria-label="$t('Add location')"
			:title="$t('Add location')">
			<template #label> {{ $t('Add location') }} </template>
		</Button>
	</main>
</template>
