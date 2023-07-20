<script setup lang="ts">
import { Theme, type ProviderAssets } from "@/assets-dev/provider-assets";
import Popover from '@/components/elements/Popover.vue';
import InfoIcon from '@/components/icons/icon-info.vue';
import { computed } from "vue";

const props = defineProps({
	assets: {
		type: Object as () => ProviderAssets,
		required: true,
	},
	isAtm: {
		type: Boolean,
		default: false
	}
})

const isDarkTheme = computed(() =>
	[Theme.BottomBannerDark, Theme.FullCardDark].includes(props.assets.theme)
)
</script>

<template>
	<footer class="relative flex items-center" :style="`height: ${assets.label ? '56px' : '36px'};`">

		<div v-if="assets.label" class="z-20 flex items-center pt-1.5 pl-6 pr-4 text-xs gap-x-1.5">
			<p v-html="assets.label" :class="{
				'text-white/60 [&>b]:text-white': isDarkTheme,
				'text-space/60 [&>b]:text-space': !isDarkTheme,
			}" />
			<Popover preferred-position="top">
				<template #trigger>
					<InfoIcon :class="{
						'text-white/50': isDarkTheme,
						'text-space/50': !isDarkTheme,
					}" />
				</template>
				<template #title>
					{{ assets.name }}
				</template>
				<template #description>
					<template>{{ assets.tooltip }}</template>
				</template>
			</Popover>
		</div>

	</footer>
</template>
