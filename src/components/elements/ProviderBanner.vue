<script setup lang="ts">
import type { PropType } from 'vue'
import Popover from '@/components/atoms/Popover.vue'
import CardBg from '@/components/elements/CardBg.vue'
import InfoIcon from '@/components/icons/icon-info.vue'
import type { Location } from '@/types'

defineProps({
  location: {
    type: Object as PropType<Location>,
    required: true,
  },
  isAtm: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <footer class="relative flex items-center" :class="{ 'h-16': location.providerLabel, 'h-9': !location.providerLabel }">
    <CardBg v-if="!location.isAtm && location.providerLabel" :location="location" />

    <div v-if="location.providerLabel" class="z-20 flex items-center pt-1.5 pl-6 pr-4 text-xs gap-x-1.5">
      <i18n-t
        :keypath="location.providerLabel" tag="p" :class="{
          'text-white/60 [&>b]:text-white': location.isDark,
          'text-space/60 [&>b]:text-space': location.isLight,
        }"
      >
        <!-- The name in the label can optionally be written bold by including a {provider} placeholder -->
        <template #provider>
          <b>{{ location.provider }}</b>
        </template>
      </i18n-t>
      <Popover preferred-position="top">
        <template #trigger>
          <InfoIcon
            :class="{
              'text-white/50': location.isDark,
              'text-space/50': location.isLight,
            }"
          />
        </template>
        <template #title>
          {{ location.provider }}
        </template>
        <template #description>
          {{ location.providerTooltip }}
        </template>
      </Popover>
    </div>
  </footer>
</template>
