<script setup lang="ts">
import ArrowLinkIcon from "@/components/icons/icon-arrow-link.vue"
import { Tooltip } from "@nimiq/vue3-components";
import { useSlots } from "vue";

defineProps({
	ctaHref: {
		type: String,
		default: undefined,
	},
	container: {
		type: HTMLElement,
		default: undefined,
	},

	preferredPosition: {
		type: String,
		required: false
	}
})

const slots = useSlots()
const hasSlot = (name: string) => {
	return !!slots[name]
}
</script>

<template>
	<Tooltip :preferred-position="preferredPosition"
		class="relative [&>.tooltip-box]:absolute [&>.tooltip-box]:max-w-xs z-20">
		<template #trigger>
			<slot name="trigger" />
		</template>

		<div class="absolute overflow-hidden w-max sm:px-0 top-8">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 10" class="relative h-3 text-space w-max left-2">
				<path fill="currentColor"
					d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z" />
			</svg>
			<div class="py-3 space-y-2 rounded-sm shadow ring-1 ring-space/30 children:px-4 bg-gradient-space">
				<p class="uppercase text-white opacity-70 text-[10px] font-bold border-fog rounded-full tracking-wider pt-1 pl-1">
					<slot name="subline" v-if="hasSlot('subline')" />
				</p>

				<h3 class="text-lg font-bold text-white" v-if="hasSlot('title')">
					<slot name="title" />
				</h3>

				<p class="text-sm text-white/60" v-if="hasSlot('description')">
					<slot name="description" />
				</p>

				<!-- TODO This could be a button -->
				<a class="text-sky font-bold text-sm group flex items-center gap-x-1.5 w-max" v-if="hasSlot('cta') && ctaHref"
					:href="ctaHref" target="_blank">
					<slot name="cta" />
					<ArrowLinkIcon
						class="w-2.5 h-2.5 relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
				</a>
				<slot name="bottom" v-if="hasSlot('bottom')" />
			</div>
		</div>
	</Tooltip>
</template>
