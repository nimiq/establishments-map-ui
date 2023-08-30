<script setup lang="ts">
import { useShare } from '@vueuse/core'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'radix-vue'
import type { PropType } from 'vue'
import IconFlag from '@/components/icons/icon-flag.vue'
import IconShare from '@/components/icons/icon-share.vue'
import IconThreeDots from '@/components/icons/icon-three-dots.vue'
import { i18n } from '@/i18n/i18n-setup'
import type { Location } from '@/types'

const props = defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
})

const { share, isSupported: shareIsSupported } = useShare()

const url = () => `${window.location.origin}/${window.location.pathname}?uuid=${props.location.uuid}`
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger v-bind="$attrs">
      <IconThreeDots class="w-5 h-5 text-space/30" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="outline-none bg-gradient-space rounded-sm p-1 will-change-[opacity] shadow"
        :side-offset="10"
      >
        <DropdownMenuItem
          v-if="shareIsSupported"
          class="flex px-4 py-2 text-white transition-colors outline-none cursor-pointer select-none hover:text-white/80"
          @click="share({
            title: location.name,
            text: i18n.t('Check out {locationName} on Nimiq\'s Crypto Map'),
            url: url(),
          })"
        >
          <IconShare class="w-4 h-4 mr-3" />
          <span class="text-base font-semibold leading-4">Share</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          as="a"
          :href="`/location/report?uuid=${location.uuid}`"
          class="flex px-4 py-2 transition-colors outline-none cursor-pointer select-none text-salmon hover:text-salmon/80"
        >
          <IconFlag class="w-4 h-4 mr-3" />
          <span class="text-base font-semibold leading-4">Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
