<template>
	<component :is="getComponent()" :to="!isExternalLink ? props.href : undefined"
		:href="isExternalLink ? props.href : undefined" :target="isExternalLink ? '_blank' : undefined"
		class="flex items-center justify-center transition-colors rounded-full outline-none cursor-pointer group w-max disabled:cursor-not-allowed"
		v-bind="$attrs" :disabled="isDisabled" :class="{
			'bg-space': props.bgColor === 'space',
			'bg-ocean': props.bgColor === 'ocean' && !gradient,
			'bg-sky': props.bgColor === 'sky' && !gradient,
			'bg-gradient-sky': props.bgColor === 'sky' && gradient,
			'bg-white hover:bg-[#F2F2F4] focus-visible:bg-[#F2F2F4]': props.bgColor === 'white',
			'bg-space/10': props.bgColor === 'grey',
			'py-2.5 px-4 sm:py-3 sm:px-5 sm:h-10 gap-3': props.size === 'lg',
			'px-3 py-1.5 sm:py-2.5 sm:px-3 h-[30px] sm:h-8 gap-2': props.size === 'md',
			'p-2 sm:p-2.5 h-9 gap-2': props.size === 'sm',
			'aspect-square': hasSlot('icon') && !hasSlot('label'),
			'focus-visible:ring-offset-2': props.as !== 'div' && props.bgColor === 'space',
			'focus-visible:ring-space focus-visible:ring-1': props.as !== 'div',
			'group-button-focus-visible:ring-offset-2': props.as === 'div' && props.bgColor === 'space',
			'group-button-focus-visible:ring-space group-button-focus-visible:ring-1': props.as === 'div',
			'relative': hasSlot('badge'),
			'flex-row-reverse': props.layout === 'label-icon',
			'ring-1 ring-space/[0.15]': props.borderColor === 'grey',
		}">
		<span v-if="!props.hideIcon && (hasSlot('icon') || getComponent() === 'a')" :class="{
			'text-white/60': ['space', 'sky', 'ocean'].includes(props.bgColor),
			'text-space/60': ['white', 'transparent', 'grey'].includes(props.bgColor),
			'text-opacity-40': isDisabled,
		}" data-icon>
			<slot name="icon" />
		</span>
		<span v-if="hasSlot('label')" class="font-bold text-center whitespace-nowrap" :class="{
			'text-white [button:disabled>&]:!text-white/40': ['space', 'sky', 'ocean'].includes(
				props.bgColor
			),
			'text-space': ['white', 'grey'].includes(props.bgColor) && !textColor,
			'text-space/60': props.bgColor === 'transparent' && !textColor,
			'text-ocean': textColor === 'ocean',
			'text-sky': textColor === 'sky',
			'text-opacity-40': isDisabled,
			'text-sm md:text-base': props.size === 'lg',
			'text-xs md:text-sm': props.size === 'md',
			'text-11 md:text-xs': props.size === 'sm',
		}">
			<slot name="label" />
		</span>

		<template v-if="getComponent() === 'a'">
			<!-- TODO This only supports external links for now -->
			<ArrowLinkIcon
				class="w-2.5 h-2.5 relative text-sky group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
		</template>

		<transition enter-active-class="duration-200 ease-out" enter-from-class="scale-0 opacity-0"
			enter-to-class="scale-100 opacity-100" leave-active-class="duration-100 ease-in"
			leave-from-class="scale-100 opacity-100" leave-to-class="scale-0 opacity-0">
			<div v-if="hasSlot('badge')"
				class="rounded-full absolute translate-x-1/2 -translate-y-1/2 top-0.5 right-0.5 bg-space text-white text-xs grid place-content-center font-bold w-4 h-4">
				<slot name="badge" />
			</div>
		</transition>

		<transition name="loading">
			<CircleSpinner v-if="props.loading" :class="{
				'text-white': !['transparent', 'white'].includes(props.bgColor),
				'text-space/60': ['transparent', 'white'].includes(props.bgColor),
				'w-3 h-3': props.size === 'sm',
			}" />
		</transition>
	</component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, useSlots } from "vue"

const CircleSpinner = defineAsyncComponent(
	() => import("@/components/icons/icon-circle-spinner.vue")
)
const ArrowLinkIcon = defineAsyncComponent(
	() => import("@/components/icons/icon-arrow-link.vue")
)

const props = defineProps({
	bgColor: {
		type: String as () => "space" | "transparent" | "white" | "sky" | "grey" | "ocean",
		default: () => "space",
	},
	borderColor: {
		type: String as () => "grey" | undefined,
		default: undefined,
	},
	type: {
		type: String,
		default: undefined,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	href: {
		type: String,
		default: undefined,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	as: {
		type: String,
		default: undefined,
	},
	size: {
		type: String as () => "sm" | "md" | "lg",
		default: "md",
	},
	gradient: {
		type: Boolean,
		default: false,
	},
	textColor: {
		type: String as () => "sky" | "ocean",
		default: undefined,
	},
	layout: {
		type: String as () => "icon-label" | "label-icon",
		default: "icon-label",
	},
	hideIcon: {
		type: Boolean,
		default: false,
	}
})

const isDisabled = computed(() => props.disabled || props.loading)

const slots = useSlots()
const hasSlot = (name: "icon" | "label" | "badge") => {
	return !!slots[name]
}

const isExternalLink = computed(() => !!props.href?.startsWith("http"))
function getComponent() {
	if (props.as) return props.as
	if (!props.href) return "button"
	if (isExternalLink.value) return "a"
	return "router-link"
}
</script>

<style scoped>
.loading-enter-active {
	animation: loading-in 400ms ease-out;
}

.loading-leave-active {
	animation: loading-in 300ms ease-in reverse;
}

@keyframes loading-in {
	0% {
		transform: scale(0);
		margin-left: -12px;
		width: 0;
	}

	40% {
		transform: scale(0);
		margin-left: 0;
		width: unset;
	}

	100% {
		transform: scale(1);
		margin-left: 0;
		width: unset;
	}
}
</style>
