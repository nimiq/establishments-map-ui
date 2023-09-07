<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { Location } from 'types'
import { LocationLink } from 'types'
import Button from '@/components/atoms/Button.vue'

defineProps<{
  location: Location
}>()

const IconGmapsPin = defineAsyncComponent(() => import('@/components/icons/icon-gmaps-pin.vue'))
const InstagramLogo = defineAsyncComponent(() => import('@/components/icons/icon-instagram.vue'))
const FacebookLogo = defineAsyncComponent(() => import('@/components/icons/icon-facebook.vue'))
</script>

<template>
  <Button bg-color="white" :href="location.url" border-color="grey" class="!w-[52px]" size="sm">
    <template #icon>
      <IconGmapsPin v-if="location.linkTo === LocationLink.GMaps" class="h-4.5" />
      <InstagramLogo v-else-if="location.linkTo === LocationLink.Instagram" class="h-4" />
      <FacebookLogo v-else-if="location.linkTo === LocationLink.Facebook" class="h-4" />
    </template>
  </Button>
</template>
