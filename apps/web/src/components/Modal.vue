<script lang="ts">
export enum ModalName {
  CryptoMap = 'crypto-map',
  Report = 'report',
  FAQ = 'faq',
  Candidate = 'candidate'
}
</script>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';

const props = withDefaults(defineProps<{ name: ModalName, nested?: boolean }>(), { nested: false })
const emit = defineEmits<{ close: [] }>()

// Keep state in the URL
const query = useRouteQuery<ModalName | undefined>(props.nested ? 'nested' : 'modal')
const open = ref(query.value === props.name)
watch(open, v => {
  query.value = v ? props.name : undefined
  if (!v) emit('close')
})
onUnmounted(() => query.value = undefined)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-bind="$attrs">
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <Transition name="backdrop">
        <DialogOverlay v-if="!nested" bg-darkblue op-60 fixed inset-0 z-20 />
      </Transition>
      <Transition :name="nested ? 'nested' : 'modal'">
        <DialogContent :key="name" fixed bottom-0 desktop="top-1/2 left-1/2 translate--1/2" op-100 h-max max-h-85dvh
          w-full max-w-512 py-32 z-20 of-y-auto ring="1.5 neutral-50" shadow-lg bg-neutral-0 rounded="t-8 desktop:8"
          outline-none data-modal :data-nested="nested ? '' : undefined" @openAutoFocus.prevent>
          <DialogTitle px-24 desktop:px-40 mb-8 text-18 font-bold text-neutral lh-none as="h2">
            <slot name="title" />
          </DialogTitle>
          <DialogDescription block px-24 desktop:px-40 text-neutral-800>
            <slot name="description" />
          </DialogDescription>

          <div px-24 desktop:px-40>
            <slot name="content" />
          </div>

          <DialogClose :aria-label="$t('Close')" close-btn absolute right-16 top-16 text-28 />
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
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

.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 250ms cubic-bezier(.4, 0, .2, 1),
    transform 100ms ease-in !important;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  --un-scale-x: 0.96;
  --un-scale-y: 0.96;
  --un-translate-y: calc(-50% - 0.5rem);
}

/* Radix will set all the modals in the root of the body. So we check if a sibling contains [data-nested] */
[data-modal] {
  transition:
    transform 400ms ease-out,
    filter 450ms cubic-bezier(.3, 0, 0, 1);

  &:has(~ [data-nested][data-state="open"]) {
    --un-scale-x: 0.94;
    --un-scale-y: 0.94;
    filter: brightness(0.75) blur(2px);
  }
}

.nested-enter-active {
  transition: transform 650ms cubic-bezier(.3, 1, 0.2, 1);
}

.nested-leave-active {
  transition: transform 450ms cubic-bezier(0.3, 0, 0, 1);
}

.nested-enter-from,
.nested-leave-to {
  --un-translate-y: calc(-1.1 * (100vh / 2) - 100%);
}
</style>
