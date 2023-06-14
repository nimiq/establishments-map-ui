<script setup lang="ts">
import ArrowLinkIcon from "@/components/icons/icon-arrow-link.vue";

import { Tooltip } from "@nimiq/vue3-components";
import { nextTick, onMounted, onUnmounted, ref, useSlots } from "vue";

defineProps({
	ctaHref: {
		type: String,
		default: undefined,
	},
	container: {
		type: HTMLElement,
		default: undefined,
	},
})

const slots = useSlots()
const hasSlot = (name: string) => {
	return !!slots[name]
}

const tooltip$ = ref<typeof Tooltip>()
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			if (!tooltip$.value!.isShown) return
			tooltipShowing(false)
		} else {
			tooltip$.value!.hide();
		}
	})
})

async function tooltipShowing(wait = true) {
	const trigger = tooltip$.value!.$el.querySelector(".trigger")
	if (wait) await nextTick()
	const tooltipBox = document.querySelector("[data-tooltip]") as HTMLElement
	const top = trigger.getBoundingClientRect().top + 20
	const smallScreen = window.innerWidth < 750
	const left = !smallScreen ? trigger.getBoundingClientRect().left + trigger.getBoundingClientRect().width / 2 - 24 : 2
	tooltipBox.style.left = `${left}px`
	tooltipBox.style.top = `${top}px`
	if (smallScreen) {
		const triangle = tooltipBox.querySelector("svg")! as SVGElement
		triangle.style.left = `${trigger.getBoundingClientRect().left + trigger.getBoundingClientRect().width / 2 - 18}px`
	}

}

onMounted(() => {
	if (!tooltip$.value) return
	const trigger = tooltip$.value.$el.querySelector(".trigger")
	observer.observe(trigger!);
})

onUnmounted(() => {
	if (!tooltip$.value) return
	const trigger = tooltip$.value.$el.querySelector(".trigger")
	observer.unobserve(trigger!);
})

function showTooltip() {
	tooltip$.value!.show()
}

function hideTooltip() {
	tooltip$.value!.hide()
}
</script>

<template>
	<Tooltip :container="container" class="relative [&>.tooltip-box]:max-w-xs z-20" ref="tooltip$" @show="tooltipShowing"
		preferredPosition="horizontal">
		<template #trigger>
			<slot name="trigger" />
		</template>

		<Teleport to="body">
			<div class="absolute max-w-sm overflow-hidden sm:px-0" data-tooltip @mouseover="showTooltip"
				@mouseleave="hideTooltip">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 10" class="relative h-3 text-space w-max left-2">
					<path fill="currentColor"
						d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z" />
				</svg>
				<div class="py-3 space-y-2 rounded-sm shadow ring-1 ring-space/30 children:px-4 bg-gradient-space">
					<p
						class="uppercase text-white opacity-70 text-[10px] font-bold border-fog rounded-full tracking-wider pt-1 pl-1">
						<slot name="subline" v-if="hasSlot('subline')" />
					</p>

					<h3 class="text-lg font-bold text-white" v-if="hasSlot('title')">
						<slot name="title" />
					</h3>

					<p class="text-sm text-white/60" v-if="hasSlot('description')">
						<slot name="description" />
					</p>

					<slot name="post-description" />

					<a class="text-sky font-bold text-sm group flex items-center gap-x-1.5 w-max" v-if="hasSlot('cta') && ctaHref"
						:href="ctaHref" target="_blank">
						<slot name="cta" />
						<ArrowLinkIcon
							class="w-2.5 h-2.5 relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
					</a>
					<slot name="bottom" v-if="hasSlot('bottom')" />
				</div>
			</div>
		</Teleport>
	</Tooltip>
</template>
