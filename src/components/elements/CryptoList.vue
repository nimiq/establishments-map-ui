<script setup lang="ts">
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import { computed } from "vue";

const props = defineProps({
	cryptos: {
		type: Array as () => string[],
		default: () => [],
	},
	label: {
		type: String
	},
	// max number of cryptos to display. If more, display a "+n" at the end
	max: {
		type: Number,
		default: 3,
	},
	theme: {
		type: String as () => "light" | "dark",
		default: "light",
	},
	layout: {
		type: String as () => "pill" | "dots",
	}
})

const cryptosToDisplay = computed(() => {
	const max = props.max
	const cryptos = props.cryptos
	if (cryptos.length <= max) {
		return cryptos
	} else {
		return cryptos.slice(0, max)
	}
})

const n = computed(() => {
	return props.cryptos.length - cryptosToDisplay.value.length
})
</script>

<template>
	<div class="flex items-center gap-x-2" :class="{ 'space-y-1.5': layout === 'pill', 'flex': layout === 'dots' }">
		<span v-if="props.label" class="text-sm"
			:class="{ 'text-white/60': props.theme === 'dark', 'text-space/60': props.theme === 'light' }">{{
				props.label }}</span>
		<ul class="flex items-center w-max gap-x-2"
			:class="{ 'bg-white rounded-full ring-1 ring-space/10 p-1': layout === 'pill' }">
			<li v-for="c in  cryptosToDisplay " :key="c">
				<CryptoIcon :crypto="c" :size="layout === 'dots' ? 'lg' : 'md'" :mono="layout === 'dots'"
					:bg="layout === 'dots' ? 'white/15' : 'transparent'" />
			</li>
			<li v-if="n > 0" class="pr-1 text-sm text-space/60">+{{ n }}</li>
		</ul>
	</div>
</template>
