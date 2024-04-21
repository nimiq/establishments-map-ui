<script setup lang="ts">
import type { Location } from 'types'

const props = defineProps<{ location: Location }>()

const url = `${window.location.origin}${window.location.pathname}?uuid=${props.location.uuid}`

const { share, isSupported: shareIsSupported } = useShare({
  title: props.location.name,
  text: `${i18n.t('Check out {locationName} on Nimiq\'s Crypto Map', { locationName: props.location.name })}\n\n${url}`,
})
const { copy, isSupported: copyIsSupported, copied } = useClipboard({ source: url, copiedDuring: 2000 })
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger v-bind="$attrs">
      <div i-nimiq:vertical-ellipsis text="20 neutral-600 hocus:neutral-700" transition-colors />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <Transition name="slide-left">
        <DropdownMenuContent bg-gradient-neutral rounded-6 p-4 shadow absolute top--24 right--10 min-w-152 flex="~ col"
          :side-offset="0" select-none>

          <DropdownMenuItem v-if="shareIsSupported" flex="~ items-center" px-14 py-8 bg="hocus:neutral-0/10" rounded-2
            text="neutral-0 hover:text-neutral-100" cursor-pointer @click="share">
            <div i-nimiq:nodes text-16 mr-12 />
            <span text-16 font-semibold>{{ $t('Share') }}</span>
          </DropdownMenuItem>

          <DropdownMenuItem v-if="copyIsSupported" @select.prevent="() => copy()" px-14 py-8 bg="hocus:neutral-0/10"
            cursor-pointer flex="~ items-center" rounded-2 text="neutral-0 hover:text-neutral-100">
            <div>
              <span i-nimiq:copy block text-16 mr-12 />
              <span text-16 font-semibold>{{ $t('Copy Link') }}</span>
            </div>
          </DropdownMenuItem>

          <ReportLocation :location>
            <template #trigger>
              <DropdownMenuItem as="button" flex="~ items-center" px-14 py-8 text-red-1100 cursor-pointer
                bg="hocus:red/20" rounded-2>
                <div i-nimiq:flag text-16 mr-12 />
                <span text-16 font-semibold>{{ $t('Report') }}</span>
              </DropdownMenuItem>
            </template>
          </ReportLocation>
        </DropdownMenuContent>
      </Transition>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style>
.slide-left-content {
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);
  transform: translateX(2rem) !important;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition:
    opacity 250ms cubic-bezier(.4, 0, .2, 1),
    left 450ms var(--nq-ease);
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(50%);
  left: 20rem;
}
</style>
