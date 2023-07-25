<script setup lang="ts">
import CrossIcon from "@/components/icons/icon-cross.vue"
import { Dialog, DialogPanel, DialogTitle, DialogOverlay, TransitionChild, TransitionRoot, DialogDescription } from "@headlessui/vue"
import { ref, useSlots } from "vue"

const isOpen = ref(false)

const emit = defineEmits({
	open: Function,
	close: Function
})

function closeModal() {
	isOpen.value = false
	emit('close')
}

function openModal() {
	isOpen.value = true
	emit('open')
}

function hasSlot(slot: 'pre-title' | 'title') {
	return !!useSlots()[slot]
}
</script>

<template>
	<slot :openModal="openModal" name="trigger" />

	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal" class="relative z-20">
			<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
				leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-space/60" />
			</TransitionChild>

			<div class="fixed inset-x-0 bottom-0 overflow-y-auto md:inset-0">
				<div class="flex items-center justify-center min-h-full text-center">
					<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95">
						<DialogPanel
							class="relative w-full px-6 py-8 text-left align-middle transition-all transform bg-white rounded-t-lg shadow-lg md:px-10 md:rounded-lg md:max-w-lg">
							<CrossIcon @click="closeModal"
								class="absolute w-6 h-6 transition-colors rounded-full cursor-pointer top-4 right-4 bg-space/20 hover:bg-space/30 focus-visible:bg-space/30 text-white/80" />

							<div v-if="hasSlot('pre-title')" class="mb-4">
								<slot name="pre-title" />
							</div>

							<DialogTitle v-if="hasSlot('title')" as="h2" class="mb-2 text-2xl font-bold text-space">
								<slot name="title" />
							</DialogTitle>

							<DialogDescription class="text-base text-space/60">
								<slot name="content" />
							</DialogDescription>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
