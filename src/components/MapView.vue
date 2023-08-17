<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { screens } from 'tailwindcss-nimiq-theme'
import DesktopView from '@/components/DesktopView.vue'
import MobileView from '@/components/MobileView.vue'

const isMobile = useBreakpoints(screens).smaller('md')
</script>

<template>
  <MobileView v-if="isMobile" />
  <DesktopView v-else />
</template>
