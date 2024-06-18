<script setup lang="ts">
import type { MapLocation } from 'types'
import { ModalName } from './Modal.vue'

const props = defineProps<{ location: MapLocation }>()

const url = `${window.location.origin}${window.location.pathname}?uuid=${props.location.uuid}`

const { share, isSupported: shareIsSupported } = useShare({
  title: props.location.name,
  text: `${i18n.t('Check out {locationName} on Nimiq\'s Crypto Map', { locationName: props.location.name })}\n\n${url}`,
})
const { copy, isSupported: copyIsSupported, copied } = useClipboard({ source: url, copiedDuring: 3000 })

// We show the report location modal if the query parameter 'modal' is set to 'report-location'
const initialOpen = useRoute().query.modal === ModalName.Report
</script>

<template>
  <DropdownMenuRoot :default-open="initialOpen">
    <DropdownMenuTrigger v-bind="$attrs">
      <div
        i-nimiq:vertical-ellipsis text="20 neutral/40 hocus:neutral/50 inverted:white/40 inverted:hocus:white/50"
        transition-colors
      />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <Transition name="slide-left">
        <DropdownMenuContent
          flex="~ col" :side-offset="0"
          absolute right--10 top--24 z-200 min-w-152 select-none rounded-6 p-4 bg-gradient-neutral shadow
        >
          <DropdownMenuItem
            v-if="shareIsSupported" flex="~ items-center" bg="hocus:neutral-0/10"
            text="neutral-0 hover:text-neutral-100" animate-fade-in animate-duration-100 animate-delay-100 animate-both
            cursor-pointer rounded-2 px-14 py-8 @click="share"
          >
            <div i-nimiq:nodes mr-12 text-14 />
            <span font-semibold>{{ $t('Share') }}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            v-if="copyIsSupported"
            :class="{ 'bg-green delay-50 duration-700': copied, 'transparent hocus:bg-neutral-0/10 duration-300 cursor-pointer': !copied }"
            text="neutral-0 hover:text-neutral-100" animate-fade-in animate-duration-100 animate-delay-150 animate-both
            rounded-2 px-14 py-8 transition-colors @select.prevent="() => copy()"
          >
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
              <DropdownMenuItem
                as="button" flex="~ items-center" bg="hocus:red/20" w-full animate-fade-in
                animate-duration-100 animate-delay-200 animate-both cursor-pointer rounded-2 px-14 py-8 text-red
                @select.prevent
              >
                <div i-nimiq:flag mr-12 text-14 />
                <span font-bold>{{ $t('Report') }}</span>
              </DropdownMenuItem>
            </template>
          </ReportLocation>
        </DropdownMenuContent>
      </Transition>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped>
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
