<script setup lang="ts">
import googleMapStyles from "@/assets/google-map-styles"
import CategoryIcon from "@/components/atoms/CategoryIcon.vue"
import { useApp } from "@/stores/app"
import { useEstablishments } from "@/stores/establishments"
import { useMap, type BoundingBox } from "@/stores/map"
import { Cluster, SuperClusterAlgorithm } from "@googlemaps/markerclusterer"
import { storeToRefs } from "pinia"
import { CustomMarker, GoogleMap, MarkerCluster } from "vue3-google-map"


const establishmentsStore = useEstablishments()
const { establishmentsInView } = storeToRefs(establishmentsStore)

const appStore = useApp()
const { selectedEstablishmentUuid, mapGestureBehaviour } = storeToRefs(appStore)

const mapStore = useMap()
const {
	navigateToUserLocation,
	increaseZoom,
	decreaseZoom,
	computeBoundingBox,
} = mapStore
const { center, zoom, map$, boundingBox } = storeToRefs(mapStore)

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAP_KEY

// We have to wait until GoogleMap component is mounted in order to compute
// the bounding box of the map if user is accessing the map from an establishment
function onIdle() {
	computeBoundingBox({ updateRoute: false })
}

const superClusterAlgorithm = new SuperClusterAlgorithm({ radius: 160, maxZoom: 18 }) as unknown as undefined // To avoid lint error
const render = (cluster: Cluster) => {
	return new google.maps.Marker({
		position: cluster.position,
		label: {
			text: String(cluster.markers?.length || 0),
			color: "white",
			fontWeight: "bold",
		},
		icon: "/img/cluster.png",
	})
}

const restriction = {
	latLngBounds: { north: 80, south: -80, west: -179.999999, east: 179.999999 },
	strictBounds: true,
}

function selectEstablishment(uuid: string) {
	selectedEstablishmentUuid.value = uuid
	appStore.showList()
}
</script>

<template>
	<GoogleMap v-if="center && center.lat !== 0 && center.lng !== 0" ref="map$" :api-key="googleMapsKey"
		class="w-full h-full" :center="center" :zoom="zoom" disable-default-ui :clickable-icons="false"
		:mapGesture-handling="mapGestureBehaviour" :keyboard-shortcuts="false" :styles="googleMapStyles"
		@bounds_changed="computeBoundingBox" @idle.once="onIdle" :min-zoom="3" :restriction="restriction">
		<MarkerCluster :options="{ algorithm: superClusterAlgorithm, renderer: { render } }">
			<CustomMarker v-for="establishment in establishmentsInView" :key="establishment.uuid"
				:options="{ position: { lat: establishment.lat, lng: establishment.lng }, anchorPoint: 'TOP_CENTER' }">
				<div @click="selectEstablishment(establishment.uuid)"
					class="flex flex-col items-center rounded-full shadow cursor-pointer" data-tooltip>
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="10" viewBox="0 0 28 10" :class="{
						'text-space': establishment.uuid !== selectedEstablishmentUuid,
						'text-ocean': establishment.uuid === selectedEstablishmentUuid,
					}">
						<path fill="currentColor"
							d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z" />
					</svg>

					<div class="rounded-full flex gap-x-3 items-center pl-1 pr-4 py-[5px]" :class="{
						'bg-gradient-space': establishment.uuid !== selectedEstablishmentUuid,
						'bg-ocean': establishment.uuid === selectedEstablishmentUuid,
					}">
						<CategoryIcon class="h-8 w-8 p-0.5 bg-white rounded-full grid place-items-center"
							:category="establishment.category" />
						<div style="font-size: 1.125rem" class="text-white">{{ establishment.name }}</div>
					</div>
				</div>
			</CustomMarker>
		</MarkerCluster>
	</GoogleMap>

	<div class="absolute flex flex-col top-5 right-5 md:top-6 md:right-6 gap-y-4 children:shadow">
		<slot name="button-calculate-position" :navigateToUserLocation="navigateToUserLocation" />

		<div class="flex flex-col bg-white rounded-full">
			<slot name="button-zoom-in" :zoomIn="increaseZoom" />

			<hr class="self-stretch h-px bg-space/10" />

			<slot name="button-zoom-out" :zoomOut="decreaseZoom" />
		</div>
	</div>
</template>
