<script setup lang="ts">
import { useShare } from '@vueuse/core'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'radix-vue'
import type { PropType } from 'vue'
import { ref, watch } from 'vue'
import { CheckmarkSmallIcon, CopyIcon } from '@nimiq/vue3-components'
import type { Location } from 'types'
import IconFlag from '@/components/icons/icon-flag.vue'
import IconShare from '@/components/icons/icon-share.vue'
import IconThreeDots from '@/components/icons/icon-three-dots.vue'
import { i18n } from '@/i18n/i18n-setup'

const props = defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
})

const isUrlCopied = ref(false)
const isClickable = ref(false)
const keepOpen = ref(false)

watch(keepOpen, x => isClickable.value = x)

const { share, isSupported: shareIsSupported } = useShare()

const url = () => `${window.location.origin}/${window.location.pathname}?uuid=${props.location.uuid}`

async function handleShare() {
  keepOpen.value = true
  if (shareIsSupported.value) {
    await share({
      title: props.location.name,
      text: i18n.t('Check out {locationName} on Nimiq\'s Crypto Map', { locationName: props.location.name }),
      url: url(),
    })
    keepOpen.value = false
  }
  else {
    isUrlCopied.value = await navigator.clipboard.writeText(url()).then(() => true).catch(() => false)
    if (!isUrlCopied.value)
      /* eslint-disable-next-line no-alert */
      alert(i18n.t('Could not copy URL to clipboard.'))
    setTimeout(() => {
      isUrlCopied.value = false
      keepOpen.value = false
    }, 2000)
  }
}

function handleOpen(open: boolean) {
  if (open)
    setTimeout(() => isClickable.value = true, 200)
  else
    isClickable.value = false
}
</script>

<template>
  <DropdownMenuRoot :open="keepOpen" @update:open="handleOpen">
    <DropdownMenuTrigger v-bind="$attrs">
      <IconThreeDots
        class="w-5 h-5 transition-colors"
        :class="{
          'text-space/30 hover:text-space/50': !location.isAtm || location.isLight,
          'text-white/60 hover:text-white/80': location.isAtm && location.isDark,
        }"
      />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="outline-none bg-gradient-space rounded-sm p-1 will-change-[colors] shadow absolute -top-6 -right-2 min-w-max animate-slideLeftAndFade"
        :class="{ 'pointer-events-none': !isClickable }"
        :side-offset="0"
        @interact-outside="isClickable = false"
      >
        <DropdownMenuItem
          class="flex px-4 py-2 text-white transition-colors outline-none cursor-pointer select-none hover:text-white/80"
          :class="{ 'pointer-events-none': !isClickable }"
          @click="handleShare"
        >
          <template v-if="shareIsSupported">
            <IconShare class="w-4 h-4 mr-3" />
            <span class="text-base font-semibold leading-4">{{ $t('Share') }}</span>
          </template>
          <template v-else>
            <CopyIcon v-if="!isUrlCopied" class="w-4 h-4 mr-3" />
            <CheckmarkSmallIcon v-else class="w-4 h-4 mr-3" />
            <span class="text-base font-semibold leading-4">{{ isUrlCopied ? $t('Copied') : $t('Copy URL') }}</span>
          </template>
        </DropdownMenuItem>
        <DropdownMenuItem
          as="a"
          :href="`/location/report?uuid=${location.uuid}`"
          class="flex px-4 py-2 transition-colors outline-none cursor-pointer select-none text-salmon hover:text-salmon/80"
        >
          <IconFlag class="w-4 h-4 mr-3" />
          <span class="text-base font-semibold leading-4">{{ $t('Report') }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
