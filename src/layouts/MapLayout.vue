<script setup lang="ts">
import TheHeaderBar from "@/components/TheHeaderBar.vue"
import TheList from "@/components/TheList.vue"
import TheMap from "@/components/TheMap.vue"
import { screens } from 'tailwindcss-nimiq-theme'
import { useBreakpoints } from "@vueuse/core"

const { xl } = useBreakpoints(screens)
</script>

<template>
	<div class="fixed flex flex-col w-screen h-full">
		<template v-if="!xl">
			<TheHeaderBar />
			<div class="relative flex h-full">
				<TheMap class="relative w-screen" />
				<TheList />
			</div>
		</template>
		<template v-else>
			<TheMap class="relative w-screen" />
			<div class="absolute top-6 left-6">
				<TheHeaderBar />
			</div>

		</template>

	</div>
</template>
