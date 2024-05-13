<script setup lang="ts">
import { Provider } from 'types';

withDefaults(defineProps<{ location: MapLocation, withGradient?: boolean }>(), { withGradient: true })
</script>

<template>
  <template v-if="!location.isAtm">
    <div v-if="withGradient" rounded="$bottom-radius"
      bg="[radial-gradient(100%_75.78%_at_100%_100%,#ffffff_0%,rgba(255,255,255,0)_100%)]" aria-hidden
      pointer-events-none absolute right-0 top-0 h-full w-full op-20 />
    <div v-bind="$attrs" pointer-events-none absolute bottom-0 right-0 z-20 h-full w-full of-hidden>
      <div i-ring:provider absolute bottom--62 right--62 size-188 />
      <div absolute bottom-16 right-16 size-32 rounded-full p-6 :class="{
        'bg-neutral': location.banner === 'Nimiq-Pay',
        'bg-[#b7ff00]': location.banner === Provider.NAKA,
        'bg-neutral-0': location.banner !== 'Nimiq-Pay' && location.banner !== Provider.NAKA,
      }">
        <div :class="getBannerIcon(location.banner)" text-20 />
      </div>
    </div>
  </template>

  <template v-if="location.isAtm">
    <div v-if="withGradient" bg="[radial-gradient(100%_75.78%_at_100%_0%,#ffffff_0%,rgba(255,255,255,0)_100%)]"
      pointer-events-none absolute right-0 top-0 h-full w-full op-20 />
    <div v-bind="$attrs" pointer-events-none absolute bottom-0 right-0 z-20 h-full w-full of-hidden>
      <div aria-hidden i-ring:atm absolute bottom-16 right-16 size-59 />
      <div absolute bottom-32 right-32 centered rounded-full p-4 :class="{
        'bg-neutral': location.banner === 'Nimiq-Pay',
      }">
        <div :class="getBannerIcon(location.banner)" text-19 />
      </div>
    </div>
  </template>
</template>
