<script setup lang="ts">
const open = defineModel<boolean>('open')
const slots = useSlots()
</script>

<template>
  <DialogRoot v-model:open="open" group>
    <DialogTrigger v-bind="$attrs">
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <Transition name="backdrop">
        <DialogOverlay bg-darkblue op-60 fixed inset-0 z-20 />
      </Transition>
      <Transition name="zoom">
        <DialogContent fixed bottom-0 desktop="top-1/2 left-1/2 translate--1/2" op-100 max-h-85dvh w-full max-w-512
          py-32 z-20 of-y-auto ring="1.5 neutral-50" shadow-lg bg-neutral-0 rounded="t-8 desktop:8" h-max class="content">
          <div v-if="slots['pre-title']" px-24 desktop:px-40 mb-16>
            <slot name="pre-title" />
          </div>

          <DialogTitle v-if="slots.title" px-24 desktop:px-40 mb-8 text-18 font-bold text-neutral lh-none as="h2">
            <slot name="title" />
          </DialogTitle>
          <DialogDescription v-if="slots.description" as="div" px-24 desktop:px-40 text-neutral-800>
            <slot name="description" />
          </DialogDescription>

          <div v-if="slots.content" px-24 desktop:px-40>
            <slot name="content" />
          </div>

          <DialogClose :aria-label="$t('Close')" close-btn absolute right-16 top-16 text-28 />
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
/* https://github.com/nimiq/wallet/blob/a88d34bfa16930adbfd52baaa5b0809c38c5c365/src/components/modals/Modal.vue */

.backdrop-enter-active {
  transition: opacity 650ms cubic-bezier(.3, 1, .2, 1);
}

.backdrop-leave-active {
  transition: opacity 650ms cubic-bezier(.3, 0, 0, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition:
    opacity 250ms cubic-bezier(.4, 0, .2, 1),
    transform 450ms var(--nq-ease);
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  --un-scale-x: 0.96;
  --un-scale-y: 0.96;
  --un-translate-y: calc(-50% - 0.5rem);
}

.content {
  transition:
    transform 250ms cubic-bezier(.4, 0, .2, 1),
    filter 450ms cubic-bezier(.3, 0, 0, 1);

  /* Radix will set all the modals in the root of the body */
  &:has(+ [data-nested][data-state="open"]) {
    --un-scale-x: 0.94;
    --un-scale-y: 0.94;
    filter: brightness(0.75);
  }
}
</style>
