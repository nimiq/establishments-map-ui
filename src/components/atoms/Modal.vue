<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'radix-vue'
import { h, useSlots } from 'vue'
import CrossIcon from '@/components/icons/icon-cross.vue'

defineEmits({ open: Function, close: Function })

function hasSlot(slot: 'pre-title' | 'title' | 'description' | 'content') {
  return !!useSlots()[slot]
}

const separator = h('hr', { class: 'w-full h-px my-8 bg-space/10' })
</script>

<template>
  <DialogRoot @update:open="$event ? $emit('open') : $emit('close')">
    <DialogTrigger>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="bg-space/60 data-[state=open]:animate-fade data-[state=close]:animate-fade-out fixed inset-0 z-20" />
      <DialogContent class="fixed max-desktop:bottom-0 desktop:top-1/2 desktop:left-1/2 max-h-[85dvh] max-w-lg desktop:-translate-x-1/2 desktop:-translate-y-1/2 rounded-[6px] z-20 overflow-y-auto data-[state=open]:animate-fade md:rounded-lg md:max-w-lg focus:outline-none w-full py-8 text-left  bg-white rounded-t-lg shadow-lg">
        <div v-if="hasSlot('pre-title')" class="px-6 mb-4 md:px-10">
          <slot name="pre-title" />
        </div>

        <DialogTitle v-if="hasSlot('title')" class="px-6 mb-2 text-lg font-bold text-space md:px-10" as="h2">
          <slot name="title" />
        </DialogTitle>
        <DialogDescription v-if="hasSlot('description')" as="div" class="[&>*:not(hr)]:px-6 [&>*:not(hr)]:md:px-10 text-base text-space/60">
          <!-- eslint-disable-next-line vue/attribute-hyphenation -->
          <slot name="description" :Separator="separator" />
        </DialogDescription>

        <div v-if="hasSlot('content')" class="[&>*:not(hr)]:px-6 [&>*:not(hr)]:md:px-10">
          <!-- eslint-disable-next-line vue/attribute-hyphenation -->
          <slot name="content" :Separator="separator" />
        </div>

        <DialogClose
          class="absolute grid w-6 h-6 transition-colors rounded-full cursor-pointer place-content-center top-4 right-4 bg-space/20 hover:bg-space/30 focus-visible:bg-space/30 text-white/80"
          :aria-label="$t('Close')"
        >
          <CrossIcon class="text-white w-2.5 h-2.5" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
