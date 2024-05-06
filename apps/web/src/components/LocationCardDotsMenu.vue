<script setup lang="ts">
import type { Location } from 'types'

const props = defineProps<{ location: Location }>()

const url = `${window.location.origin}${window.location.pathname}?uuid=${props.location.uuid}`

const { share, isSupported: shareIsSupported } = useShare({
  title: props.location.name,
  text: `${i18n.t('Check out {locationName} on Nimiq\'s Crypto Map', { locationName: props.location.name })}\n\n${url}`,
})
const { copy, isSupported: copyIsSupported, copied } = useClipboard({ source: url, copiedDuring: 3000 })

// We show the report location modal if the query parameter 'modal' is set to 'report-location'
const initialOpen = useRoute().query['modal'] === 'report'
</script>

<template>
  <DropdownMenuRoot :defaultOpen="initialOpen">
    <DropdownMenuTrigger v-bind="$attrs">
      <div i-nimiq:vertical-ellipsis text="20 neutral/40 hocus:neutral/50 inverted:white/40 inverted:hocus:white/50"
        transition-colors />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <Transition name="slide-left">
        <DropdownMenuContent bg-gradient-neutral rounded-6 z-200 p-4 shadow absolute top--24 right--10 min-w-152
          flex="~ col" :side-offset="0" select-none>

          <DropdownMenuItem v-if="shareIsSupported" flex="~ items-center" px-14 py-8 bg="hocus:neutral-0/10" rounded-2
            text="neutral-0 hover:text-neutral-100" cursor-pointer @click="share" animate-fade-in animate-duration-100
            animate-delay-100 animate-both>
            <div i-nimiq:nodes text-14 mr-12 />
            <span font-semibold>{{ $t('Share') }}</span>
          </DropdownMenuItem>

          <DropdownMenuItem v-if="copyIsSupported" @select.prevent="() => copy()" px-14 py-8
            :class="{ 'bg-green delay-50 duration-700': copied, 'transparent hocus:bg-neutral-0/10 duration-300 cursor-pointer': !copied }"
            transition-colors rounded-2 text="neutral-0 hover:text-neutral-100" animate-fade-in animate-duration-100
            animate-delay-150 animate-both>
            <transition name="fade-slide" mode="out-in">
              <div v-if="copied" key="copied" flex="~ items-center gap-12" data-copied>
                <div i-nimiq:check text-14 />
                <span font-semibold>Copied</span>
              </div>
              <div v-else key="copy" flex="~ items-center gap-12" data-copy>
                <div i-nimiq:copy text-14 />
                <span font-semibold>Copy Link</span>
              </div>
            </transition>
          </DropdownMenuItem>

          <ReportLocation :location>
            <template #trigger>
              <DropdownMenuItem as="button" flex="~ items-center" px-14 py-8 text-red cursor-pointer w-full
                bg="hocus:red/20" rounded-2 animate-fade-in animate-duration-100 animate-delay-200 animate-both
                @select.prevent>
                <div i-nimiq:flag text-14 mr-12 />
                <span font-bold>{{ $t('Report') }}</span>
              </DropdownMenuItem>
            </template>
          </ReportLocation>
        </DropdownMenuContent>
      </Transition>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  transition:
    opacity 250ms cubic-bezier(.4, 0, .2, 1),
    margin-left 450ms var(--nq-ease);
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  margin-left: 0.25rem;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: transform 75ms ease-out, opacity 100ms var(--nq-ease);
}

[data-copy]:is(.fade-slide-enter-from, .fade-slide-leave-to) {
  transform: translateY(-0.5rem);
  opacity: 0;
}

[data-copied]:is(.fade-slide-enter-from, .fade-slide-leave-to) {
  transform: translateY(0.5rem);
  opacity: 0;

}
</style>
