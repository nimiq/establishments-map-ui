<script setup lang="ts">
import Modal from "@/components/atoms/Modal.vue"
import Button from "@/components/atoms/Button.vue"
import CryptoMapIcon from "@/components/icons/icon-crypto-map.vue"
import GearIcon from "@/components/icons/icon-gear.vue"

</script>

<template>
	<Modal>

		<template #trigger="{ openModal }">
			<Button bgColor="transparent" size="md" @click="openModal">
				<template #icon>
					<GearIcon class="text-space/30 w-4.5 h-4.5" />
				</template>
			</Button>
		</template>

		<template #pre-title>
			<CryptoMapIcon class="h-8" />
		</template>

		<template #title>
			Crypto Map
		</template>

		<template #content>
			<p class="[text-wrap:pretty]">
				This app is brought to you by Nimiq, only places that are verified by Google are accepted for this map.
			</p>

			<div class="flex items-center justify-between mt-8">
				<Button bg="sky" href="/Locations/add">
					<template #label>
						Add Crypto location
					</template>
				</Button>

				<span>EN</span>
			</div>
		</template>
	</Modal>
</template>
