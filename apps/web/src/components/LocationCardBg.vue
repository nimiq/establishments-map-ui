<script setup lang="ts">
import { Location, Provider } from 'types'
import { getBannerIcon } from '@/composables/useIcon';

withDefaults(defineProps<{ location: Location, withGradient?: boolean }>(), { withGradient: true })
</script>

<template>
  <template v-if="!location.isAtm">
    <div v-if="withGradient" aria-hidden absolute rounded="$bottom-radius" top-0 right-0
      bg="[radial-gradient(100%_75.78%_at_100%_100%,#ffffff_0%,rgba(255,255,255,0)_100%)]" op-20 pointer-events-none
      w-full h-full />
    <div v-bind="$attrs" absolute bottom-0 right-0 z-20 of-hidden w-full h-full pointer-events-none>
      <div i-ring:provider size-188 absolute right--62 bottom--62 />
      <div absolute p-6 rounded-full size-32 right-16 bottom-16 :class="{
        'bg-neutral': location.banner === 'Nimiq-Pay',
        'bg-[#b7ff00]': location.banner === Provider.NAKA,
        'bg-neutral-0': location.banner !== 'Nimiq-Pay' && location.banner !== Provider.NAKA
      }">
        <div :class="getBannerIcon(location.banner)" text-20 />
      </div>
    </div>
  </template>

  <template v-if="location.isAtm">
    <div v-if="withGradient" absolute top-0 right-0
      bg="[radial-gradient(100%_75.78%_at_100%_0%,#ffffff_0%,rgba(255,255,255,0)_100%)]" op-20 pointer-events-none
      w-full h-full />
    <div v-bind="$attrs" absolute bottom-0 right-0 z-20 w-full h-full of-hidden pointer-events-none>
      <div aria-hidden i-ring:atm absolute bottom-16 right-16 size-59 />
      <div :class="getBannerIcon(location.banner)" text-19 absolute bottom-36 right-36 />
    </div>
  </template>
</template>
