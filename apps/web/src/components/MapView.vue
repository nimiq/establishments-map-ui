<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { breakpointsTailwind } from '@vueuse/core'
import DesktopView from '@/components/DesktopView.vue'
import MobileView from '@/components/MobileView.vue'

const isMobile = useBreakpoints(breakpointsTailwind).smaller('md')
</script>

<template>
  <MobileView v-if="isMobile" />
  <DesktopView v-else />
</template>
