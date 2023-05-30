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
	bgColor: {
		type: String,
		default: "white",
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
	<div class="space-y-1.5">
		<span v-if="props.label" class="text-sm"
			:class="{ 'text-white/60': props.bgColor !== 'white', 'text-space/60': props.bgColor === 'white' }">{{
				props.label }}</span>
		<ul class="flex items-center p-1 bg-white rounded-full w-max ring-1 ring-space/10 gap-x-2">
			<li v-for="c in cryptosToDisplay" :key="c">
				<CryptoIcon :crypto="c" class="w-[26px] h-[26px]" />
			</li>
			<li v-if="n > 0" class="pr-1 text-sm text-space/60">+{{ n }}</li>
		</ul>
	</div>
</template>
